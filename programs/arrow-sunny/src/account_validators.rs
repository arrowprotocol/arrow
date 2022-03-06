//! Validate accounts

use anchor_lang::prelude::*;
use vipers::{assert_keys_eq, program_err};

use crate::*;

impl<'info> StakeCommon<'info> {
    /// Validates these accounts against an [ArrowMiner].
    pub fn validate_miner(&self, miner: &ArrowMiner) -> Result<()> {
        assert_keys_eq!(self.rewarder, miner.rewarder, "rewarder");
        assert_keys_eq!(self.quarry, miner.quarry, "quarry");
        assert_keys_eq!(self.miner, miner.miner, "miner");
        assert_keys_eq!(self.miner_vault, miner.miner_vault, "miner_vault");
        Ok(())
    }
}

impl Arrow {
    /// Gets the miner associated with the rewards mint.
    pub fn miner_for_rewards(&self, rewards_mint: Pubkey) -> Result<&ArrowMiner> {
        if rewards_mint == self.vendor_miner.rewards_mint {
            Ok(&self.vendor_miner)
        } else if rewards_mint == self.internal_miner.rewards_mint {
            Ok(&self.internal_miner)
        } else {
            program_err!(InvalidRewardsMint)
        }
    }
}
