//! Crate events

use anchor_lang::prelude::*;

/// Emitted when a [crate::Arrow] is created.
#[event]
pub struct NewArrowEvent {
    /// The [crate::Arrow].
    #[index]
    pub arrow: Pubkey,
    /// The beneficiary of the [crate::Arrow].
    pub beneficiary: Pubkey,
    /// The pool.
    pub pool: Pubkey,
    /// The mint of the staked token.
    pub vendor_mint: Pubkey,
    /// Timestamp of the event.
    pub timestamp: i64,
}

/// Emitted when [crate::Arrow] tokens are minted.
#[event]
pub struct MintEvent {
    /// The [crate::Arrow].
    #[index]
    pub arrow: Pubkey,
    /// Depositor
    #[index]
    pub depositor: Pubkey,
    /// Amount of tokens.
    pub amount: u64,
    /// Timestamp of the event.
    pub timestamp: i64,
}

/// Emitted when [crate::Arrow] tokens are burned.
#[event]
pub struct BurnEvent {
    /// The [crate::Arrow].
    #[index]
    pub arrow: Pubkey,
    /// Depositor
    #[index]
    pub depositor: Pubkey,
    /// Amount of tokens.
    pub amount: u64,
    /// Timestamp of the event.
    pub timestamp: i64,
}
