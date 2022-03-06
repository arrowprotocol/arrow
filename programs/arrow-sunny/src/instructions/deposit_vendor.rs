//! [crate::arrow_sunny::deposit_vendor] instruction processor.

use crate::*;
use anchor_lang::prelude::*;
use anchor_spl::token;
use vipers::validate::Validate;
use vipers::*;

impl<'info> DepositVendor<'info> {
    /// Deposits into the vendor.
    pub fn deposit_vendor(&self, amount: u64) -> Result<()> {
        token::transfer(
            CpiContext::new(
                self.token_program.to_account_info(),
                token::Transfer {
                    from: self.depositor_staked_tokens.to_account_info(),
                    to: self.vault_vendor_token_account.to_account_info(),
                    authority: self.arrow_stake.depositor.to_account_info(),
                },
            ),
            amount,
        )?;

        let signer_seeds: &[&[&[u8]]] = gen_arrow_signer_seeds!(self.arrow);
        sunny_anchor::cpi::deposit_vendor(
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
        )?;

        token::mint_to(
            CpiContext::new(
                self.token_program.to_account_info(),
                token::MintTo {
                    mint: self.arrow_stake.arrow_mint.to_account_info(),
                    to: self.arrow_stake.depositor_arrow_tokens.to_account_info(),
                    authority: self.arrow.to_account_info(),
                },
            )
            .with_signer(signer_seeds),
            amount,
        )?;

        emit!(MintEvent {
            arrow: self.arrow.key(),
            depositor: self.arrow_stake.depositor.key(),
            amount,
            timestamp: Clock::get()?.unix_timestamp
        });

        Ok(())
    }
}

impl<'info> Validate<'info> for DepositVendor<'info> {
    fn validate(&self) -> Result<()> {
        assert_keys_eq!(self.arrow_stake.arrow_mint, self.arrow.mint);

        // depositor
        assert_keys_eq!(
            self.depositor_staked_tokens.owner,
            self.arrow_stake.depositor
        );
        assert_keys_eq!(
            self.depositor_staked_tokens.mint,
            self.arrow.vendor_miner.mint
        );
        self.arrow_stake.validate()?;

        // stake
        self.vendor_stake.validate_miner(&self.arrow.vendor_miner)?;
        assert_keys_eq!(self.pool, self.arrow.pool, "pool");
        assert_keys_eq!(self.vault, self.arrow.vault, "vault");

        assert_keys_eq!(self.vault_vendor_token_account.owner, self.vault);
        assert_keys_eq!(
            self.vault_vendor_token_account.mint,
            self.arrow.vendor_miner.mint
        );

        Ok(())
    }
}
