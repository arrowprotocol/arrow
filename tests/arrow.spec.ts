import { expectTX } from "@saberhq/chai-solana";
import {
  createMint,
  getATAAddress,
  getOrCreateATA,
  getTokenAccount,
  SPLToken,
  Token,
  TOKEN_PROGRAM_ID,
  TokenAmount,
  u64,
} from "@saberhq/token-utils";
import type { PublicKey, Signer } from "@solana/web3.js";
import { Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { expect } from "chai";

import type { Arrow } from "../src";
import { createRewarderAndQuarry } from "./quarryUtils";
import { createSunnyPool } from "./sunnyUtils";
import { makeSDK } from "./workspace";

describe("Arrow", () => {
  let sdk: Arrow;

  beforeEach(() => {
    sdk = makeSDK();
  });

  describe("happy path", () => {
    let adminKP: Signer;
    let lpToken: Token;
    let sunnyPool: PublicKey;
    let arrowToken: Token;

    beforeEach("prepare arrow", async () => {
      const { provider } = sdk;

      adminKP = Keypair.generate();
      await sdk.provider.connection.confirmTransaction(
        await sdk.provider.connection.requestAirdrop(
          adminKP.publicKey,
          10 * LAMPORTS_PER_SOL
        )
      );
      const lpTokenMint = await createMint(provider, adminKP.publicKey, 6);
      lpToken = Token.fromMint(lpTokenMint, 6);

      // set up the quarry and rewarder
      const rewarderAndQuarry = await createRewarderAndQuarry({
        connection: sdk.provider.connection,
        stakedToken: lpToken,
        annualRate: new u64(1_000_000_000),
      });

      // set up the sunny pool
      const sunnyPoolResult = await createSunnyPool({
        provider: sdk.provider,
        rewarder: rewarderAndQuarry.rewarder,
        quarry: rewarderAndQuarry.quarry,
      });
      sunnyPool = sunnyPoolResult.sunnyPool;
      const internalMint = sunnyPoolResult.internalMint;

      // set up the sunny quarry and rewarder
      const sunnyRewarder = await createRewarderAndQuarry({
        connection: sdk.provider.connection,
        stakedToken: Token.fromMint(internalMint, 6),
        annualRate: new u64(1_000_000_000),
      });

      const beneficiaryKP = Keypair.generate();
      const arrowMintKP = Keypair.generate();
      const { initTX, newArrowTXs } = await sdk.newArrow({
        sunnyPool,
        beneficiary: beneficiaryKP.publicKey,
        mintKP: arrowMintKP,
        sunnyRewarderKey: sunnyRewarder.rewarder,
      });
      await expectTX(initTX, "init").to.be.fulfilled;

      for (const stepTX of newArrowTXs) {
        await expectTX(stepTX, "new arrow").to.be.fulfilled;
      }

      arrowToken = Token.fromMint(arrowMintKP.publicKey, 6);
    });

    it("happy path", async () => {
      const createATATX = await getOrCreateATA({
        provider: sdk.provider,
        mint: lpToken.mintAccount,
        owner: sdk.provider.wallet.publicKey,
      });
      const mintTX = sdk.provider.newTX(
        [
          createATATX.instruction,
          SPLToken.createMintToInstruction(
            TOKEN_PROGRAM_ID,
            lpToken.mintAccount,
            createATATX.address,
            adminKP.publicKey,
            [],
            1_000
          ),
        ],
        [adminKP]
      );
      await expectTX(mintTX, "mint").to.be.fulfilled;

      expect(
        (
          await getTokenAccount(
            sdk.provider,
            await getATAAddress({
              mint: lpToken.mintAccount,
              owner: sdk.provider.wallet.publicKey,
            })
          )
        ).amount,
        "lp in wallet"
      ).to.bignumber.eq("1000");

      const stakeTX = sdk.stake({
        arrowMint: arrowToken.mintAccount,
        amount: new TokenAmount(lpToken, 1_000),
      });
      await expectTX(stakeTX, "stake").to.be.fulfilled;

      expect(
        (
          await getTokenAccount(
            sdk.provider,
            await getATAAddress({
              mint: lpToken.mintAccount,
              owner: sdk.provider.wallet.publicKey,
            })
          )
        ).amount,
        "lp in wallet"
      ).to.bignumber.eq("0");

      const burnTX = await sdk.unstake({
        arrowMint: arrowToken.mintAccount,
        amount: new TokenAmount(lpToken, 1_000),
      });
      await expectTX(burnTX, "burn").to.be.fulfilled;

      expect(
        (
          await getTokenAccount(
            sdk.provider,
            await getATAAddress({
              mint: lpToken.mintAccount,
              owner: sdk.provider.wallet.publicKey,
            })
          )
        ).amount,
        "tokens are back"
      ).to.bignumber.eq("1000");
    });
  });
});
