//! [crate::arrow_sunny::withdraw_rewards_to_beneficiary] instruction processor.

use crate::{addresses, WithdrawRewardsToBeneficiary};
use anchor_lang::prelude::*;
use anchor_spl::token;
use vipers::validate::Validate;
use vipers::*;

impl<'info> WithdrawRewardsToBeneficiary<'info> {
    /// Withdraws rewards tokens to the beneficiary.
    pub fn withdraw_rewards_to_beneficiary(&mut self) -> ProgramResult {
        let signer_seeds: &[&[&[u8]]] = gen_arrow_signer_seeds!(self.arrow);
        sunny_anchor::cpi::withdraw_from_vault(
            CpiContext::new(
                self.sunny_program.to_account_info(),
                sunny_anchor::cpi::accounts::WithdrawFromVault {
                    owner: self.arrow.to_account_info(),
                    pool: self.pool.to_account_info(),
                    vault: self.vault.to_account_info(),
                    vault_token_account: self.vault_rewards_token_account.to_account_info(),
                    token_destination: self.arrow_staging_account.to_account_info(),
                    fee_destination: self.sunny_pool_fee_account.to_account_info(),
                    token_program: self.token_program.to_account_info(),
                },
            )
            .with_signer(signer_seeds),
        )?;

        // reload to get the amount after Sunny's fees were applied
        self.arrow_staging_account.reload()?;
        let amount = self.arrow_staging_account.amount;
        if amount == 0 {
            msg!("no tokens to withdraw");
            return Ok(());
        }

        let signer_seeds: &[&[&[u8]]] = gen_arrow_signer_seeds!(self.arrow);
        let fees = unwrap_int!(amount.checked_div(10));
        let amount_minus_fees = unwrap_int!(amount.checked_sub(fees));

        token::transfer(
            CpiContext::new(
                self.token_program.to_account_info(),
                token::Transfer {
                    from: self.arrow_staging_account.to_account_info(),
                    to: self.beneficiary_account.to_account_info(),
                    authority: self.arrow.to_account_info(),
                },
            )
            .with_signer(signer_seeds),
            amount_minus_fees,
        )?;

        token::transfer(
            CpiContext::new(
                self.token_program.to_account_info(),
                token::Transfer {
                    from: self.arrow_staging_account.to_account_info(),
                    to: self.arrow_fee_account.to_account_info(),
                    authority: self.arrow.to_account_info(),
                },
            )
            .with_signer(signer_seeds),
            fees,
        )?;

        Ok(())
    }
}

impl<'info> Validate<'info> for WithdrawRewardsToBeneficiary<'info> {
    fn validate(&self) -> ProgramResult {
        let rewards_mint = self.beneficiary_account.mint;
        let miner = self.arrow.miner_for_rewards(rewards_mint)?;

        // rewards token accounts
        assert_ata!(
            *self.beneficiary_account,
            self.arrow.beneficiary,
            rewards_mint,
            "beneficiary_account"
        );
        assert_ata!(
            *self.arrow_fee_account,
            addresses::ARROW_FEE_OWNER,
            rewards_mint,
            "arrow_fee_account"
        );
        assert_ata!(
            *self.sunny_pool_fee_account,
            *self.pool,
            rewards_mint,
            "pool_fee_account"
        );
        assert_ata!(
            *self.arrow_staging_account,
            *self.arrow,
            rewards_mint,
            "arrow_staging_account"
        );
        assert_keys_eq!(
            *self.vault_rewards_token_account,
            miner.vault_rewards_token_account
        );

        assert_keys_eq!(self.arrow.pool, *self.pool, "pool");
        assert_keys_eq!(self.arrow.vault, *self.vault, "vault");

        Ok(())
    }
}
