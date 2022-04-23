//! Account structs
#![deny(missing_docs)]

use anchor_lang::{prelude::*, solana_program::pubkey::PUBKEY_BYTES};

/// An Arrow.
#[account]
#[derive(Copy, Debug, Default, PartialEq, Eq)]
pub struct Arrow {
    /// The [Arrow]'s mint.
    pub mint: Pubkey,
    /// Bump.
    pub bump: u8,
    /// The beneficiary of the [Arrow]'s staking rewards.
    /// This account must be the owner of any token account that staking rewards
    /// are claimed to.
    pub beneficiary: Pubkey,

    /// The [sunny_anchor::Pool].
    pub pool: Pubkey,
    /// The [sunny_anchor::Vault].
    pub vault: Pubkey,
    /// Vendor miner
    pub vendor_miner: ArrowMiner,
    /// Internal miner
    pub internal_miner: ArrowMiner,
}

impl Arrow {
    /// Number of bytes in an [Arrow].
    pub const LEN: usize = PUBKEY_BYTES + 1 + PUBKEY_BYTES * 3 + ArrowMiner::LEN * 2;
}

/// Miner information for an [Arrow].
/// We put this information here to make it easier to find/validate the addresses
/// when calling functions.
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Debug, Default, PartialEq, Eq)]
pub struct ArrowMiner {
    /// Mint of the token to stake.
    pub mint: Pubkey,
    /// Rewarder
    pub rewarder: Pubkey,
    /// Quarry
    pub quarry: Pubkey,
    /// Miner
    pub miner: Pubkey,
    /// Miner token account
    pub miner_vault: Pubkey,
    /// Mint of the token given out as rewards.
    pub rewards_mint: Pubkey,
    /// Mint wrapper associated with the Rewarder.
    pub mint_wrapper: Pubkey,
    /// Token account to send claim fees to.
    pub claim_fee_token_account: Pubkey,
    /// The vault's ATA holding mint.
    pub vault_staked_token_account: Pubkey,
    /// The vault's ATA holding the rewards.
    pub vault_rewards_token_account: Pubkey,
    /// The account holding the rewards fees.
    pub sunny_pool_rewards_fee_account: Pubkey,
}

impl ArrowMiner {
    /// Number of bytes in an [ArrowMiner].
    pub const LEN: usize = PUBKEY_BYTES * 11;
}
