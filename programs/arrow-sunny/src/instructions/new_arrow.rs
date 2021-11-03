//! [crate::arrow_sunny::new_arrow] instruction processor.

use crate::*;
use anchor_lang::prelude::*;
use vipers::{assert_keys_eq, validate::Validate};

impl<'info> NewArrow<'info> {
    /// Initializes the vault.
    pub fn init_vault(&self, bump: u8) -> ProgramResult {
        sunny_anchor::cpi::init_vault(
            CpiContext::new(
                self.sunny_program.to_account_info(),
                sunny_anchor::cpi::accounts::InitVault {
                    pool: self.pool.to_account_info(),
                    owner: self.arrow.to_account_info(),
                    vault: self.vault.to_account_info(),
                    payer: self.payer.to_account_info(),
                    system_program: self.system_program.to_account_info(),
                },
            ),
            bump,
        )
    }

    /// Initializes a new arrow.
    pub fn init_arrow(&mut self, bump: u8) -> ProgramResult {
        let arrow = &mut self.arrow;
        arrow.mint = self.arrow_mint.key();
        arrow.bump = bump;
        arrow.beneficiary = self.beneficiary.key();

        arrow.pool = self.pool.key();
        arrow.vault = self.vault.key();

        emit!(NewArrowEvent {
            arrow: arrow.key(),
            beneficiary: arrow.beneficiary,
            pool: self.pool.key(),
            vendor_mint: self.pool.vendor_mint,
            timestamp: Clock::get()?.unix_timestamp
        });

        Ok(())
    }
}

impl<'info> NewArrow<'info> {
    /// Validate the [Arrow]'s mint.
    fn validate_arrow_mint(&self) -> ProgramResult {
        assert_keys_eq!(
            self.arrow_mint.mint_authority.unwrap(),
            *self.arrow,
            "arrow_mint.mint_authority"
        );
        assert_keys_eq!(
            self.arrow_mint.freeze_authority.unwrap(),
            *self.arrow,
            "arrow_mint.freeze_authority"
        );
        require!(
            self.arrow_mint.decimals == self.vendor_mint.decimals,
            NewArrowDecimalMismatch
        );
        require!(self.arrow_mint.supply == 0, NewArrowNonZeroSupply);

        Ok(())
    }
}

impl<'info> Validate<'info> for NewArrow<'info> {
    fn validate(&self) -> ProgramResult {
        self.validate_arrow_mint()?;
        // ensure that the provided vendor mint
        // corresponds to the pool.
        // This is used for validating the arrow mint.
        assert_keys_eq!(self.pool.vendor_mint, *self.vendor_mint, "pool.vendor_mint");
        Ok(())
    }
}
