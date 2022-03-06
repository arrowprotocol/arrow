//! [crate::arrow_sunny::claim] instruction processor.

use crate::Claim;
use anchor_lang::prelude::*;
use vipers::validate::Validate;
use vipers::*;

impl<'info> Claim<'info> {
    /// Claims tokens.
    pub fn claim(&self) -> Result<()> {
        sunny_anchor::cpi::claim_rewards(CpiContext::new(
            self.sunny_program.to_account_info(),
            sunny_anchor::cpi::accounts::ClaimRewards {
                mint_wrapper: self.mint_wrapper.to_account_info(),
                mint_wrapper_program: self.mint_wrapper_program.to_account_info(),
                minter: self.minter.to_account_info(),
                rewards_token_mint: self.rewards_token_mint.to_account_info(),
                rewards_token_account: self.vault_rewards_token_account.to_account_info(),
                claim_fee_token_account: self.claim_fee_token_account.to_account_info(),
                stake_token_account: self.stake_token_account.to_account_info(),
                stake: sunny_anchor::cpi::accounts::QuarryStake {
                    rewarder: self.stake.rewarder.to_account_info(),
                    quarry: self.stake.quarry.to_account_info(),
                    miner: self.stake.miner.to_account_info(),
                    miner_vault: self.stake.miner_vault.to_account_info(),

                    pool: self.pool.to_account_info(),
                    vault: self.vault.to_account_info(),
                    token_program: self.token_program.to_account_info(),
                    mine_program: self.mine_program.to_account_info(),
                    clock: self.clock.to_account_info(),
                },
            },
        ))
    }
}

impl<'info> Validate<'info> for Claim<'info> {
    fn validate(&self) -> Result<()> {
        let rewards_mint = self.rewards_token_mint.key();

        // rewards token accounts
        assert_keys_eq!(self.vault_rewards_token_account.owner, self.vault);
        assert_keys_eq!(self.vault_rewards_token_account.mint, rewards_mint);

        // mine
        // figure out which miner we are
        let miner = self.arrow.miner_for_rewards(rewards_mint)?;
        assert_keys_eq!(self.claim_fee_token_account, miner.claim_fee_token_account);
        self.stake.validate_miner(miner)?;

        // mint wrapper
        assert_keys_eq!(self.mint_wrapper, miner.mint_wrapper);
        assert_keys_eq!(self.minter.mint_wrapper, self.mint_wrapper);

        assert_keys_eq!(self.arrow.pool, self.pool);
        assert_keys_eq!(self.arrow.vault, self.vault);

        Ok(())
    }
}
