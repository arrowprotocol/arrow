//! [crate::arrow_sunny::stake_internal] instruction processor.

use crate::StakeInternal;
use anchor_lang::prelude::*;
use vipers::{assert_keys_eq, validate::Validate};

impl<'info> StakeInternal<'info> {
    /// Stakes the full contents of the vault into the internal miner.
    pub fn stake_internal(&self) -> ProgramResult {
        let signer_seeds: &[&[&[u8]]] = gen_arrow_signer_seeds!(self.arrow);
        sunny_anchor::cpi::stake_internal(
            CpiContext::new(
                self.sunny_program.to_account_info(),
                sunny_anchor::cpi::accounts::QuarryStakeInternal {
                    vault_owner: self.arrow.to_account_info(),
                    internal_mint: self.internal_mint.to_account_info(),
                    internal_mint_token_account: self
                        .vault_internal_token_account
                        .to_account_info(),
                    stake: sunny_anchor::cpi::accounts::QuarryStake {
                        rewarder: self.internal_stake.rewarder.to_account_info(),
                        quarry: self.internal_stake.quarry.to_account_info(),
                        miner: self.internal_stake.miner.to_account_info(),
                        miner_vault: self.internal_stake.miner_vault.to_account_info(),

                        pool: self.pool.to_account_info(),
                        vault: self.vault.to_account_info(),
                        token_program: self.token_program.to_account_info(),
                        mine_program: self.mine_program.to_account_info(),
                        clock: self.clock.to_account_info(),
                    },
                },
            )
            .with_signer(signer_seeds),
        )
    }
}

impl<'info> Validate<'info> for StakeInternal<'info> {
    fn validate(&self) -> ProgramResult {
        assert_keys_eq!(self.arrow.internal_miner.mint, self.internal_mint);
        assert_keys_eq!(
            self.arrow.internal_miner.vault_staked_token_account,
            *self.vault_internal_token_account
        );

        assert_keys_eq!(self.arrow.pool, self.pool);
        assert_keys_eq!(self.arrow.vault, self.vault);
        self.internal_stake
            .validate_miner(&self.arrow.internal_miner)?;
        Ok(())
    }
}
