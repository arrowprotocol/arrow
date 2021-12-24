import { Coder } from "@project-serum/anchor";
import type { RewarderData } from "@quarryprotocol/quarry-sdk";
import {
  findMinerAddress,
  findMinterAddress,
  findQuarryAddress,
  QUARRY_ADDRESSES,
  QUARRY_IDLS,
} from "@quarryprotocol/quarry-sdk";
import { newProgramMap } from "@saberhq/anchor-contrib";
import type { AugmentedProvider, Provider } from "@saberhq/solana-contrib";
import {
  SignerWallet,
  SolanaAugmentedProvider,
  SolanaProvider,
  TransactionEnvelope,
} from "@saberhq/solana-contrib";
import type { TokenAmount } from "@saberhq/token-utils";
import {
  createInitMintInstructions,
  deserializeMint,
  getATAAddress,
  getOrCreateATA,
  getOrCreateATAs,
  TOKEN_PROGRAM_ID,
} from "@saberhq/token-utils";
import type {
  KeyedAccountInfo,
  PublicKey,
  Signer,
  TransactionInstruction,
} from "@solana/web3.js";
import { Keypair, SystemProgram, SYSVAR_CLOCK_PUBKEY } from "@solana/web3.js";

import { ARROW_ADDRESSES, ARROW_FEE_OWNER, SUNNY_REWARDER_KEY } from ".";
import { SUNNY_PROGRAM } from "./constants";
import { generateArrowAddress, generateSunnyVaultAddress } from "./pda";
import type {
  ArrowData,
  ArrowMiner,
  ArrowSunnyProgram,
} from "./programs/arrowSunny";
import { ArrowSunnyJSON } from "./programs/arrowSunny";
import type { SunnyPoolData } from "./sunny";
import { SUNNY_CODER } from "./sunny";

export interface ArrowPrograms {
  ArrowSunny: ArrowSunnyProgram;
}

const QUARRY_MINE_CODER = new Coder(QUARRY_IDLS.Mine);

export const parseRewarder = (info: KeyedAccountInfo): RewarderData =>
  QUARRY_MINE_CODER.accounts.decode<RewarderData>(
    "Rewarder",
    info.accountInfo.data
  );

/**
 * Javascript SDK for interacting with Arrow.
 */
export class Arrow {
  constructor(
    readonly provider: AugmentedProvider,
    readonly programs: ArrowPrograms
  ) {}

  /**
   * Initialize from a Provider
   * @param provider
   * @returns
   */
  static init(provider: Provider): Arrow {
    const augProvider = new SolanaAugmentedProvider(provider);
    return new Arrow(
      augProvider,
      newProgramMap<ArrowPrograms>(
        augProvider,
        { ArrowSunny: ArrowSunnyJSON },
        ARROW_ADDRESSES
      )
    );
  }

  /**
   * Creates a new instance of the SDK with the given keypair.
   */
  withSigner(signer: Signer): Arrow {
    return Arrow.init(
      new SolanaProvider(
        this.provider.connection,
        this.provider.broadcaster,
        new SignerWallet(signer),
        this.provider.opts
      )
    );
  }

  /**
   * Creates a new Arrow.
   * @returns
   */
  async newArrow({
    sunnyPool,
    beneficiary,
    mintKP = Keypair.generate(),
    payer = this.provider.wallet.publicKey,
    sunnyRewarderKey = SUNNY_REWARDER_KEY,
  }: {
    sunnyPool: PublicKey;
    beneficiary: PublicKey;
    mintKP?: Keypair;
    payer?: PublicKey;
    sunnyRewarderKey?: PublicKey;
  }): Promise<{
    initTX: TransactionEnvelope;
    newArrowTX: TransactionEnvelope;
    newArrowTXs: TransactionEnvelope[];
  }> {
    const poolRaw = await this.provider.connection.getAccountInfo(sunnyPool);
    if (!poolRaw) {
      throw new Error("sunny pool does not exist");
    }
    const pool = SUNNY_CODER.accounts.decode<SunnyPoolData>(
      "Pool",
      poolRaw.data
    );

    const [arrow, arrowBump] = await generateArrowAddress(mintKP.publicKey);
    const [vault, vaultBump] = await generateSunnyVaultAddress({
      pool: sunnyPool,
      owner: arrow,
    });
    const [internalQuarry] = await findQuarryAddress(
      sunnyRewarderKey,
      pool.internalMint
    );
    const [internalMiner, internalBump] = await findMinerAddress(
      internalQuarry,
      vault
    );
    const [vendorMiner, vendorBump] = await findMinerAddress(
      pool.quarry,
      vault
    );

    // vault ATAs
    const { instructions } = await getOrCreateATAs({
      provider: this.provider,
      mints: {
        rewards: pool.rewardsMint,
        internal: pool.internalMint,
        vendor: pool.vendorMint,
      },
      owner: vault,
    });

    // miner ATAs
    const internalMinerATA = await getOrCreateATA({
      provider: this.provider,
      mint: pool.internalMint,
      owner: internalMiner,
    });
    const vendorMinerATA = await getOrCreateATA({
      provider: this.provider,
      mint: pool.vendorMint,
      owner: vendorMiner,
    });

    const rewarderDataRaw = await this.provider.getAccountInfo(
      sunnyRewarderKey
    );
    if (!rewarderDataRaw) {
      throw new Error(
        `could not fetch sunny rewarder at ${sunnyRewarderKey.toString()}`
      );
    }
    const rewarderData = parseRewarder(rewarderDataRaw);

    // create these ATAs so we don't need to do it later
    const feeATAs = await getOrCreateATAs({
      provider: this.provider,
      mints: {
        rewards: pool.rewardsMint,
        sunny: rewarderData.rewardsTokenMint,
      },
      owner: ARROW_FEE_OWNER,
    });

    const newArrowCtx = {
      accounts: {
        arrow,
        arrowMint: mintKP.publicKey,
        payer,
        beneficiary,
        systemProgram: SystemProgram.programId,
        pool: sunnyPool,
        vault,
        vendorMint: pool.vendorMint,
        mineProgram: QUARRY_ADDRESSES.Mine,
        tokenProgram: TOKEN_PROGRAM_ID,
        sunnyProgram: SUNNY_PROGRAM,
      },
    };
    const internalMinerAccounts = {
      rewarder: sunnyRewarderKey,
      quarry: internalQuarry,
      miner: internalMiner,
      minerVault: internalMinerATA.address,
      tokenMint: pool.internalMint,
    };
    const vendorMinerAccounts = {
      rewarder: pool.rewarder,
      quarry: pool.quarry,
      miner: vendorMiner,
      minerVault: vendorMinerATA.address,
      tokenMint: pool.vendorMint,
    };

    const initArrowMinerCommon = {
      arrow,
      payer,

      pool: sunnyPool,
      vault,

      mineProgram: QUARRY_ADDRESSES.Mine,
      sunnyProgram: SUNNY_PROGRAM,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
    };

    const newArrowIX = this.programs.ArrowSunny.instruction.newArrow(
      arrowBump,
      vaultBump,
      newArrowCtx
    );
    const initVendorMinerIX =
      this.programs.ArrowSunny.instruction.initArrowVendorMiner(vendorBump, {
        accounts: { ...initArrowMinerCommon, miner: vendorMinerAccounts },
      });
    const initInternalMinerIX =
      this.programs.ArrowSunny.instruction.initArrowInternalMiner(
        internalBump,
        {
          accounts: { ...initArrowMinerCommon, miner: internalMinerAccounts },
        }
      );

    const vendorMintRaw = await this.provider.getAccountInfo(pool.vendorMint);
    if (!vendorMintRaw) {
      throw new Error("could not find vendor mint");
    }
    const vendorMint = deserializeMint(vendorMintRaw.accountInfo.data);

    const initMintTX = await createInitMintInstructions({
      provider: this.provider,
      mintKP,
      decimals: vendorMint.decimals,
      mintAuthority: arrow,
      freezeAuthority: arrow,
    });
    return {
      initTX: initMintTX.combine(
        new TransactionEnvelope(this.provider, [
          ...feeATAs.instructions,
          ...instructions,
          ...[internalMinerATA.instruction, vendorMinerATA.instruction].filter(
            (x): x is TransactionInstruction => !!x
          ),
        ])
      ),
      newArrowTX: this.provider.newTX([
        newArrowIX,
        initVendorMinerIX,
        initInternalMinerIX,
      ]),
      newArrowTXs: [
        this.provider.newTX([newArrowIX]),
        this.provider.newTX([initVendorMinerIX]),
        this.provider.newTX([initInternalMinerIX]),
      ],
    };
  }

  /**
   * Stakes into an Arrow.
   */
  async stake({
    arrowMint,
    amount,
    depositor = this.provider.wallet.publicKey,
  }: {
    /**
     * Mint of the Arrow.
     */
    arrowMint: PublicKey;
    /**
     * Amount of tokens to stake.
     */
    amount: TokenAmount;
    depositor?: PublicKey;
  }): Promise<TransactionEnvelope> {
    const { depositorATAs, stakeAccounts } = await this._generateStakeAccounts({
      arrowMint,
      depositor,
    });
    if (depositorATAs.createAccountInstructions.vendor) {
      throw new Error("no vendor tokens");
    }
    return this.provider.newTX([
      ...depositorATAs.instructions,
      this.programs.ArrowSunny.instruction.depositVendor(amount.toU64(), {
        accounts: stakeAccounts,
      }),
      this.programs.ArrowSunny.instruction.stakeInternal({
        accounts: stakeAccounts,
      }),
    ]);
  }

  private async _generateStakeAccounts({
    arrowMint,
    depositor = this.provider.wallet.publicKey,
  }: {
    arrowMint: PublicKey;
    depositor?: PublicKey;
  }) {
    const [arrowKey] = await generateArrowAddress(arrowMint);
    const arrow: ArrowData | null =
      await this.programs.ArrowSunny.account.arrow.fetchNullable(arrowKey);
    if (!arrow) {
      throw new Error("arrow not found");
    }

    const depositorATAs = await getOrCreateATAs({
      provider: this.provider,
      mints: {
        arrow: arrowMint,
        vendor: arrow.vendorMiner.mint,
      },
      owner: depositor,
    });

    return {
      arrow,
      depositorATAs,
      stakeAccounts: {
        arrow: arrowKey,
        arrowStake: {
          arrowMint: arrow.mint,
          depositor,
          depositorArrowTokens: depositorATAs.accounts.arrow,
        },

        depositorStakedTokens: depositorATAs.accounts.vendor,
        internalMint: arrow.internalMiner.mint,
        vaultInternalTokenAccount: arrow.internalMiner.vaultStakedTokenAccount,
        vaultVendorTokenAccount: arrow.vendorMiner.vaultStakedTokenAccount,

        pool: arrow.pool,
        vault: arrow.vault,

        vendorStake: {
          rewarder: arrow.vendorMiner.rewarder,
          quarry: arrow.vendorMiner.quarry,
          miner: arrow.vendorMiner.miner,
          minerVault: arrow.vendorMiner.minerVault,
        },
        internalStake: {
          rewarder: arrow.internalMiner.rewarder,
          quarry: arrow.internalMiner.quarry,
          miner: arrow.internalMiner.miner,
          minerVault: arrow.internalMiner.minerVault,
        },

        clock: SYSVAR_CLOCK_PUBKEY,
        tokenProgram: TOKEN_PROGRAM_ID,
        mineProgram: QUARRY_ADDRESSES.Mine,
        sunnyProgram: SUNNY_PROGRAM,
      },
    };
  }

  async unstake({
    amount,
    arrowMint,
    depositor = this.provider.wallet.publicKey,
  }: {
    amount: TokenAmount;
    arrowMint: PublicKey;
    depositor?: PublicKey;
  }): Promise<TransactionEnvelope> {
    const { arrow, depositorATAs, stakeAccounts } =
      await this._generateStakeAccounts({
        arrowMint,
        depositor,
      });
    if (depositorATAs.createAccountInstructions.arrow) {
      throw new Error("no arrow tokens");
    }
    const sunnyFeeDestination = await getOrCreateATA({
      provider: this.provider,
      mint: arrow.vendorMiner.mint,
      owner: arrow.pool,
    });
    return this.provider.newTX([
      sunnyFeeDestination.instruction,
      ...depositorATAs.instructions,
      this.programs.ArrowSunny.instruction.unstakeInternal(amount.toU64(), {
        accounts: {
          arrowStake: stakeAccounts.arrowStake,
          stake: stakeAccounts,
        },
      }),
      this.programs.ArrowSunny.instruction.withdrawVendorTokens(
        amount.toU64(),
        {
          accounts: {
            stake: stakeAccounts,
            sunnyPoolFeeDestination: sunnyFeeDestination.address,
          },
        }
      ),
    ]);
  }

  /**
   * Claims Arrow rewards.
   */
  async claim({ arrowMint }: { arrowMint: PublicKey }): Promise<{
    vendorTX: TransactionEnvelope;
    internalTX: TransactionEnvelope;
  }> {
    const [arrowKey] = await generateArrowAddress(arrowMint);
    const arrowData: ArrowData | null =
      await this.programs.ArrowSunny.account.arrow.fetchNullable(arrowKey);
    if (!arrowData) {
      throw new Error("arrow not found");
    }

    const arrow = {
      key: arrowKey,
      data: arrowData,
    };
    const vendorTX = await this._claimRewarder({
      arrow,
      miner: arrow.data.vendorMiner,
    });
    const internalTX = await this._claimRewarder({
      arrow,
      miner: arrow.data.internalMiner,
    });

    return {
      vendorTX,
      internalTX,
    };
  }

  private async _claimRewarder({
    arrow,
    miner,
  }: {
    arrow: { key: PublicKey; data: ArrowData };
    miner: ArrowMiner;
  }): Promise<TransactionEnvelope> {
    const arrowFeeAccount = await getATAAddress({
      mint: miner.rewardsMint,
      owner: ARROW_FEE_OWNER,
    });
    const arrowStagingAccount = await getATAAddress({
      mint: miner.rewardsMint,
      owner: arrow.key,
    });
    const beneficiaryAccount = await getATAAddress({
      mint: miner.rewardsMint,
      owner: arrow.data.beneficiary,
    });

    const vaultATAs = await getOrCreateATAs({
      provider: this.provider,
      mints: {
        quarry: miner.mint,
        rewards: miner.rewardsMint,
      },
      owner: arrow.data.vault,
    });

    const [minter] = await findMinterAddress(miner.mintWrapper, miner.rewarder);

    const claimAccounts = {
      accounts: {
        arrow: arrow.key,
        beneficiaryAccount,
        arrowFeeAccount,
        sunnyPoolFeeAccount: miner.sunnyPoolRewardsFeeAccount,
        arrowStagingAccount,
        mintWrapper: miner.mintWrapper,
        mintWrapperProgram: QUARRY_ADDRESSES.MintWrapper,
        minter,
        rewardsTokenMint: miner.rewardsMint,
        vaultRewardsTokenAccount: miner.vaultRewardsTokenAccount,
        claimFeeTokenAccount: miner.claimFeeTokenAccount,
        stakeTokenAccount: miner.vaultStakedTokenAccount,
        stake: {
          rewarder: miner.rewarder,
          quarry: miner.quarry,
          miner: miner.miner,
          minerVault: miner.minerVault,
        },
        pool: arrow.data.pool,
        vault: arrow.data.vault,
        clock: SYSVAR_CLOCK_PUBKEY,
        tokenProgram: TOKEN_PROGRAM_ID,
        mineProgram: QUARRY_ADDRESSES.Mine,
        sunnyProgram: SUNNY_PROGRAM,
      },
    };

    return new TransactionEnvelope(this.provider, [
      ...vaultATAs.instructions,
      this.programs.ArrowSunny.instruction.claim(claimAccounts),
      this.programs.ArrowSunny.instruction.withdrawRewardsToBeneficiary(
        claimAccounts
      ),
    ]);
  }
}
