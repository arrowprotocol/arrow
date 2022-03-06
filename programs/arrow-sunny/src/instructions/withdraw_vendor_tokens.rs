//! [crate::arrow_sunny::withdraw_vendor_tokens] instruction processor.

use crate::{DepositVendor, WithdrawVendorTokens};
use anchor_lang::prelude::*;
use vipers::{assert_keys_eq, validate::Validate};

impl<'info> WithdrawVendorTokens<'info> {
    /// Withdraws vendor tokens
    pub fn withdraw_vendor_tokens(&self, amount: u64) -> Result<()> {
        self.stake
            .withdraw_vendor_tokens(self.sunny_pool_fee_destination.to_account_info(), amount)
    }
}

impl<'info> DepositVendor<'info> {
    /// Withdraws vendor tokens from the vault to any address.
    /// Ensure that this instruction is called right after [Self::unstake].
    fn withdraw_vendor_tokens(
        &self,
        fee_destination: AccountInfo<'info>,
        amount: u64,
    ) -> Result<()> {
        let signer_seeds: &[&[&[u8]]] = gen_arrow_signer_seeds!(self.arrow);
        sunny_anchor::cpi::withdraw_vendor(
            CpiContext::new(
                self.sunny_program.to_account_info(),
                sunny_anchor::cpi::accounts::QuarryStakeVendor {
                    vault_owner: self.arrow.to_account_info(),
                    vault_vendor_token_account: self.vault_vendor_token_account.to_account_info(),
                    stake: sunny_anchor::cpi::accounts::QuarryStake {
                        rewarder: self.vendor_stake.rewarder.to_account_info(),
                        quarry: self.vendor_stake.quarry.to_account_info(),
                        miner: self.vendor_stake.miner.to_account_info(),
                        miner_vault: self.vendor_stake.miner_vault.to_account_info(),

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

        sunny_anchor::cpi::withdraw_from_vault(
            CpiContext::new(
                self.sunny_program.to_account_info(),
                sunny_anchor::cpi::accounts::WithdrawFromVault {
                    owner: self.arrow.to_account_info(),
                    pool: self.pool.to_account_info(),
                    vault: self.vault.to_account_info(),
                    vault_token_account: self.vault_vendor_token_account.to_account_info(),
                    token_destination: self.depositor_staked_tokens.to_account_info(),
                    fee_destination: fee_destination.to_account_info(),
                    token_program: self.token_program.to_account_info(),
                },
            )
            .with_signer(signer_seeds),
        )
    }
}

impl<'info> Validate<'info> for WithdrawVendorTokens<'info> {
    fn validate(&self) -> Result<()> {
        self.stake.validate()?;
        assert_keys_eq!(self.sunny_pool_fee_destination.owner, self.stake.arrow.pool);
        assert_keys_eq!(
            self.sunny_pool_fee_destination.mint,
            self.stake.arrow.vendor_miner.mint
        );
        Ok(())
    }
}
