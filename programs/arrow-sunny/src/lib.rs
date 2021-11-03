//! Sunny protocol integration for Arrow.
#![deny(rustdoc::all)]
#![allow(rustdoc::missing_doc_code_examples)]

#[macro_use]
mod macros;

mod account_validators;
mod instructions;

pub mod addresses;
pub mod events;
pub mod state;

use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};
use sunny_anchor::{Pool, Vault};
use vipers::validate::Validate;

pub use events::*;
pub use state::*;

declare_id!("ARoWLTBWoWrKMvxEiaE2EH9DrWyV7mLpKywGDWxBGeq9");

/// [arrow_sunny] program.
#[program]
pub mod arrow_sunny {
    use super::*;

    /// Creates a new [Arrow].
    #[access_control(ctx.accounts.validate())]
    pub fn new_arrow(ctx: Context<NewArrow>, bump: u8, vault_bump: u8) -> ProgramResult {
        ctx.accounts.init_vault(vault_bump)?;
        ctx.accounts.init_arrow(bump)
    }

    /// Initializes the [Arrow]'s miners.
    #[access_control(ctx.accounts.validate())]
    pub fn init_arrow_miners(
        ctx: Context<InitArrowMiners>,
        vendor_miner_bump: u8,
        internal_miner_bump: u8,
    ) -> ProgramResult {
        ctx.accounts
            .init_arrow_miners(vendor_miner_bump, internal_miner_bump)
    }

    /// Stakes tokens into an [Arrow].
    #[access_control(ctx.accounts.validate())]
    pub fn deposit_vendor(ctx: Context<DepositVendor>, amount: u64) -> ProgramResult {
        ctx.accounts.deposit_vendor(amount)
    }

    /// Stakes the internal tokens.
    ///
    /// Anybody can call this function, but ideally it is called right after [deposit_vendor].
    /// This ensures that the staked tokens are always earning maximum yield.
    #[access_control(ctx.accounts.validate())]
    pub fn stake_internal(ctx: Context<StakeInternal>) -> ProgramResult {
        ctx.accounts.stake_internal()
    }

    /// Unstakes tokens from an [Arrow].
    #[access_control(ctx.accounts.validate())]
    pub fn unstake_internal(ctx: Context<UnstakeInternal>, amount: u64) -> ProgramResult {
        ctx.accounts.unstake_internal(amount)
    }

    /// Withdraws vendor tokens from an [Arrow] into an account.
    ///
    /// **IMPORTANT**: A user should take care to ensure that this is called in the same transaction
    /// as [unstake_internal], otherwise someone else can withdraw their tokens.
    #[access_control(ctx.accounts.validate())]
    pub fn withdraw_vendor_tokens(
        ctx: Context<WithdrawVendorTokens>,
        amount: u64,
    ) -> ProgramResult {
        ctx.accounts.withdraw_vendor_tokens(amount)
    }

    /// Claims tokens, keeping them within the vault.
    /// Fees are not removed from the vault at this time.
    #[access_control(ctx.accounts.validate())]
    pub fn claim(ctx: Context<Claim>) -> ProgramResult {
        ctx.accounts.claim()
    }

    /// Withdraws all claimed rewards to the beneficiary.
    /// One should call [claim] first.
    #[access_control(ctx.accounts.validate())]
    pub fn withdraw_rewards_to_beneficiary(
        ctx: Context<WithdrawRewardsToBeneficiary>,
    ) -> ProgramResult {
        ctx.accounts.withdraw_rewards_to_beneficiary()
    }
}

// --------------------------------
// Context Structs
// --------------------------------

/// Accounts for [arrow_sunny::new_arrow].
#[derive(Accounts)]
#[instruction(bump: u8)]
pub struct NewArrow<'info> {
    /// The [Arrow].
    #[account(
        init,
        seeds = [
            b"arrow".as_ref(),
            arrow_mint.key().to_bytes().as_ref()
        ],
        bump = bump,
        payer = payer
    )]
    pub arrow: Box<Account<'info, Arrow>>,

    /// [Mint] of the [Arrow].
    /// One may choose a [Mint] that uniquely describes their pool
    /// via `solana-keygen grind`.
    pub arrow_mint: Box<Account<'info, Mint>>,

    /// Payer of the initialization.
    #[account(mut)]
    pub payer: Signer<'info>,

    /// The recipient of the [Arrow]'s rewards.
    pub beneficiary: UncheckedAccount<'info>,

    /// The Sunny pool.
    pub pool: Box<Account<'info, Pool>>,
    /// Sunny vault
    #[account(mut)]
    pub vault: UncheckedAccount<'info>,
    /// The [Mint] which is staked into pools.
    pub vendor_mint: Box<Account<'info, Mint>>,

    /// Sunny.
    pub sunny_program: Program<'info, sunny_anchor::program::SunnyAnchor>,
    /// System program.
    pub system_program: Program<'info, System>,
}

/// Accounts for [arrow_sunny::init_arrow_miners].
#[derive(Accounts)]
pub struct InitArrowMiners<'info> {
    /// The [Arrow].
    #[account(mut)]
    pub arrow: Box<Account<'info, Arrow>>,
    /// Payer of the initialization.
    #[account(mut)]
    pub payer: Signer<'info>,

    /// The Sunny pool.
    pub pool: Box<Account<'info, Pool>>,
    /// The Sunny vault.
    pub vault: Box<Account<'info, Vault>>,

    /// The Internal miner to create.
    pub internal_miner: InitMiner<'info>,
    /// The Vendor miner to create.
    pub vendor_miner: InitMiner<'info>,

    /// Mine program.
    pub mine_program: Program<'info, quarry_mine::program::QuarryMine>,
    /// Sunny program.
    pub sunny_program: Program<'info, sunny_anchor::program::SunnyAnchor>,
    /// System program.
    pub system_program: Program<'info, System>,
    /// Token program.
    pub token_program: Program<'info, Token>,
}

/// Miner accounts used in [arrow_sunny::init_arrow_miners].
#[derive(Accounts)]
pub struct InitMiner<'info> {
    /// Rewarder
    pub rewarder: Box<Account<'info, quarry_mine::Rewarder>>,
    /// The [quarry_mine::Quarry] to stake into.
    #[account(mut)]
    pub quarry: Box<Account<'info, quarry_mine::Quarry>>,
    /// The miner. This is unchecked as it should not be initialized.
    #[account(mut)]
    pub miner: UncheckedAccount<'info>,
    /// Account holding the miner's tokens
    pub miner_vault: Box<Account<'info, TokenAccount>>,
    /// Mint of the token
    pub token_mint: Box<Account<'info, Mint>>,
}

/// Accounts for [arrow_sunny::deposit_vendor].
#[derive(Accounts)]
pub struct DepositVendor<'info> {
    /// Arrow
    pub arrow: Box<Account<'info, Arrow>>,
    /// Arrow staking accounts
    pub arrow_stake: ArrowStake<'info>,

    /// Depositor's staked tokens
    #[account(mut)]
    pub depositor_staked_tokens: Box<Account<'info, TokenAccount>>,

    /// Vault's vendor tokens
    #[account(mut)]
    pub vault_vendor_token_account: Box<Account<'info, TokenAccount>>,

    /// Vendor stake accounts.
    pub vendor_stake: StakeCommon<'info>,

    /// Sunny pool
    #[account(mut)]
    pub pool: Box<Account<'info, Pool>>,
    /// Sunny vault
    #[account(mut)]
    pub vault: Box<Account<'info, Vault>>,

    /// token program
    pub token_program: Program<'info, Token>,
    /// Mine program
    pub mine_program: Program<'info, quarry_mine::program::QuarryMine>,
    /// Sunny program
    pub sunny_program: Program<'info, sunny_anchor::program::SunnyAnchor>,
    /// Clock sysvar
    pub clock: Sysvar<'info, Clock>,
}

/// Accounts for [arrow_sunny::stake_internal].
#[derive(Accounts)]
pub struct StakeInternal<'info> {
    /// Arrow
    pub arrow: Box<Account<'info, Arrow>>,

    /// Internal mint
    #[account(mut)]
    pub internal_mint: Box<Account<'info, Mint>>,
    /// Vault internal tokens
    #[account(mut)]
    pub vault_internal_token_account: Box<Account<'info, TokenAccount>>,

    /// Internal stake
    pub internal_stake: StakeCommon<'info>,
    /// Sunny Pool
    #[account(mut)]
    pub pool: Box<Account<'info, Pool>>,
    /// Sunny Vault
    #[account(mut)]
    pub vault: Box<Account<'info, Vault>>,

    /// token program
    pub token_program: Program<'info, Token>,
    /// mine program
    pub mine_program: Program<'info, quarry_mine::program::QuarryMine>,
    /// sunny program
    pub sunny_program: Program<'info, sunny_anchor::program::SunnyAnchor>,
    /// clock sysvar
    pub clock: Sysvar<'info, Clock>,
}

/// Accounts for [arrow_sunny::unstake_internal].
#[derive(Accounts)]
pub struct UnstakeInternal<'info> {
    /// Arrow staking accounts
    pub arrow_stake: ArrowStake<'info>,
    /// Staking accounts
    pub stake: StakeInternal<'info>,
}

/// Common accounts for minting/burning arrows
#[derive(Accounts)]
pub struct ArrowStake<'info> {
    /// Mint of the arrow.
    #[account(mut)]
    pub arrow_mint: Box<Account<'info, Mint>>,
    /// Depositor creating arrows.
    pub depositor: Signer<'info>,
    /// Arrow tokens of the depositor
    #[account(mut)]
    pub depositor_arrow_tokens: Box<Account<'info, TokenAccount>>,
}

/// Common accounts for staking actions.
/// We do not deserialize the accounts here to save on compute units,
/// but also because we just check equality anyway.
#[derive(Accounts)]
pub struct StakeCommon<'info> {
    /// Rewarder
    pub rewarder: UncheckedAccount<'info>,
    /// Quarry
    #[account(mut)]
    pub quarry: UncheckedAccount<'info>,
    /// Miner
    #[account(mut)]
    pub miner: UncheckedAccount<'info>,
    /// Miner vault
    #[account(mut)]
    pub miner_vault: UncheckedAccount<'info>,
}

/// Accounts for [arrow_sunny::withdraw_vendor_tokens].
#[derive(Accounts)]
pub struct WithdrawVendorTokens<'info> {
    /// Stake accounts
    pub stake: DepositVendor<'info>,
    /// Sunny pool fee account for the vendor tokens.
    #[account(mut)]
    pub sunny_pool_fee_destination: Account<'info, TokenAccount>,
}

/// Accounts for [arrow_sunny::claim].
#[derive(Accounts)]
pub struct Claim<'info> {
    /// The [Arrow] we are claiming.
    pub arrow: Box<Account<'info, Arrow>>,

    /// Vault account holding rewards tokens
    #[account(mut)]
    pub vault_rewards_token_account: Box<Account<'info, TokenAccount>>,

    // Quarry Mine accounts
    /// This account just gets equality checked, so we don't need to deserialize it.
    #[account(mut)]
    pub claim_fee_token_account: UncheckedAccount<'info>,
    /// This account is a dummy and doesn't get used. It must have the
    /// Quarry mint, but this is checked by Sunny.
    #[account(mut)]
    pub stake_token_account: UncheckedAccount<'info>,
    /// Staking accounts
    pub stake: StakeCommon<'info>,

    // Quarry Mint wrapper accounts
    // These are checked by Sunny, so we do not check them here to save
    // compute units.
    /// Quarry mint wrapper
    #[account(mut)]
    pub mint_wrapper: UncheckedAccount<'info>,
    /// Quarry minter
    #[account(mut)]
    pub minter: Box<Account<'info, quarry_mint_wrapper::Minter>>,
    /// Mint of the rewards token.
    #[account(mut)]
    pub rewards_token_mint: Box<Account<'info, Mint>>,

    // Sunny accounts
    // equality checked, so no need to deserialize
    /// Sunny pool
    #[account(mut)]
    pub pool: UncheckedAccount<'info>,
    /// Sunny vault
    #[account(mut)]
    pub vault: UncheckedAccount<'info>,

    // Programs and sysvars
    /// Quarry mine program
    pub mine_program: Program<'info, quarry_mine::program::QuarryMine>,
    /// Mint wrapper program
    pub mint_wrapper_program: Program<'info, quarry_mint_wrapper::program::QuarryMintWrapper>,
    /// Sunny program
    pub sunny_program: Program<'info, sunny_anchor::program::SunnyAnchor>,
    /// Token program
    pub token_program: Program<'info, Token>,
    /// Clock sysvar
    pub clock: Sysvar<'info, Clock>,
}

/// Accounts for [arrow_sunny::withdraw_rewards_to_beneficiary].
#[derive(Accounts)]
pub struct WithdrawRewardsToBeneficiary<'info> {
    /// The [Arrow] we are claiming.
    pub arrow: Box<Account<'info, Arrow>>,

    // Rewards token accounts
    /// Beneficiary.
    #[account(mut)]
    pub beneficiary_account: Box<Account<'info, TokenAccount>>,
    /// Arrow protocol fees ATA
    #[account(mut)]
    pub arrow_fee_account: Box<Account<'info, TokenAccount>>,
    /// Sunny pool fees ATA
    #[account(mut)]
    pub sunny_pool_fee_account: Box<Account<'info, TokenAccount>>,
    /// Arrow staging ATA
    #[account(mut)]
    pub arrow_staging_account: Box<Account<'info, TokenAccount>>,
    /// Vault rewards tokens ATA
    #[account(mut)]
    pub vault_rewards_token_account: Box<Account<'info, TokenAccount>>,

    // Sunny accounts
    /// Sunny pool.
    pub pool: Box<Account<'info, Pool>>,
    /// Sunny vault.
    #[account(mut)]
    pub vault: Box<Account<'info, Vault>>,

    /// Sunny program
    pub sunny_program: Program<'info, sunny_anchor::program::SunnyAnchor>,
    /// Token program
    pub token_program: Program<'info, Token>,
}

#[error]
pub enum ErrorCode {
    #[msg("Invalid rewards mint.")]
    InvalidRewardsMint,

    #[msg("The Arrow's mint's authority must be the arrow.", offset = 10)]
    NewArrowMintAuthorityInvalid,
    #[msg("The Arrow's freeze authority must be the arrow.")]
    NewArrowFreezeAuthorityInvalid,
    #[msg("Arrow mint must have zero supply")]
    NewArrowNonZeroSupply,
    #[msg("Arrow decimals must match the staked token")]
    NewArrowDecimalMismatch,

    #[msg("Miners already initialized.", offset = 20)]
    InitArrowMinersAlreadyInitialized,
}
