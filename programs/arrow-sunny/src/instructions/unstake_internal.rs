//! [crate::arrow_sunny::unstake_internal] instruction processor.

use crate::*;
use anchor_lang::prelude::*;
use anchor_spl::token;
use vipers::{assert_keys_eq, validate::Validate};

impl<'info> UnstakeInternal<'info> {
    /// Unstakes from the internal miner and burns arrow tokens.
    pub fn unstake_internal(&self, amount: u64) -> ProgramResult {
        self.arrow_stake
            .burn(amount, self.stake.token_program.to_account_info())?;
        self.stake.sunny_unstake_internal(amount)?;

        emit!(BurnEvent {
            arrow: self.stake.arrow.key(),
            depositor: self.arrow_stake.depositor.key(),
            amount,
            timestamp: Clock::get()?.unix_timestamp
        });

        Ok(())
    }
}

impl<'info> ArrowStake<'info> {
    fn burn(&self, amount: u64, token_program: AccountInfo<'info>) -> ProgramResult {
        token::burn(
            CpiContext::new(
                token_program,
                token::Burn {
                    mint: self.arrow_mint.to_account_info(),
                    to: self.depositor_arrow_tokens.to_account_info(),
                    authority: self.depositor.to_account_info(),
                },
            ),
            amount,
        )
    }
}

impl<'info> StakeInternal<'info> {
    fn sunny_unstake_internal(&self, amount: u64) -> ProgramResult {
        let signer_seeds: &[&[&[u8]]] = gen_arrow_signer_seeds!(self.arrow);
        sunny_anchor::cpi::unstake_internal(
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
            amount,
        )?;

        Ok(())
    }
}

impl<'info> Validate<'info> for UnstakeInternal<'info> {
    fn validate(&self) -> ProgramResult {
        assert_keys_eq!(*self.arrow_stake.arrow_mint, self.stake.arrow.mint);
        self.arrow_stake.validate()?;
        self.stake.validate()?;
        Ok(())
    }
}

impl<'info> Validate<'info> for ArrowStake<'info> {
    fn validate(&self) -> ProgramResult {
        assert_keys_eq!(self.depositor_arrow_tokens.mint, *self.arrow_mint);
        assert_keys_eq!(self.depositor_arrow_tokens.owner, self.depositor);
        Ok(())
    }
}
