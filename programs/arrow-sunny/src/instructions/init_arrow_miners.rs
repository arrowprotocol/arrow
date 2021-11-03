//! [crate::arrow_sunny::init_arrow_miners] instruction processor.

use crate::{ArrowMiner, InitArrowMiners, InitMiner};
use anchor_lang::prelude::*;
use vipers::{assert_ata, assert_keys_eq, validate::Validate};

impl<'info> InitArrowMiners<'info> {
    /// Initializes the miners.
    pub fn init_arrow_miners(
        &mut self,
        vendor_miner_bump: u8,
        internal_miner_bump: u8,
    ) -> ProgramResult {
        let arrow = &mut self.arrow;
        arrow.vendor_miner =
            ArrowMiner::create_for_vault(&self.vendor_miner, &self.pool.key(), &self.vault.key());
        arrow.internal_miner =
            ArrowMiner::create_for_vault(&self.internal_miner, &self.pool.key(), &self.vault.key());

        self.init_vendor_miner(vendor_miner_bump)?;
        self.init_internal_miner(internal_miner_bump)?;
        Ok(())
    }

    fn init_vendor_miner(&self, bump: u8) -> ProgramResult {
        sunny_anchor::cpi::init_miner(
            CpiContext::new(
                self.sunny_program.to_account_info(),
                sunny_anchor::cpi::accounts::InitMiner {
                    pool: self.pool.to_account_info(),
                    vault: self.vault.to_account_info(),

                    miner: self.vendor_miner.miner.to_account_info(),
                    quarry: self.vendor_miner.quarry.to_account_info(),
                    rewarder: self.vendor_miner.rewarder.to_account_info(),
                    token_mint: self.vendor_miner.token_mint.to_account_info(),
                    miner_vault: self.vendor_miner.miner_vault.to_account_info(),

                    payer: self.payer.to_account_info(),
                    mine_program: self.mine_program.to_account_info(),
                    system_program: self.system_program.to_account_info(),
                    token_program: self.token_program.to_account_info(),
                },
            ),
            bump,
        )
    }

    fn init_internal_miner(&self, bump: u8) -> ProgramResult {
        sunny_anchor::cpi::init_miner(
            CpiContext::new(
                self.sunny_program.to_account_info(),
                sunny_anchor::cpi::accounts::InitMiner {
                    pool: self.pool.to_account_info(),
                    vault: self.vault.to_account_info(),

                    miner: self.internal_miner.miner.to_account_info(),
                    quarry: self.internal_miner.quarry.to_account_info(),
                    rewarder: self.internal_miner.rewarder.to_account_info(),
                    token_mint: self.internal_miner.token_mint.to_account_info(),
                    miner_vault: self.internal_miner.miner_vault.to_account_info(),

                    payer: self.payer.to_account_info(),
                    mine_program: self.mine_program.to_account_info(),
                    system_program: self.system_program.to_account_info(),
                    token_program: self.token_program.to_account_info(),
                },
            ),
            bump,
        )
    }
}

impl<'info> ArrowMiner {
    fn create_for_vault(
        init_miner: &InitMiner<'info>,
        pool_key: &Pubkey,
        vault_key: &Pubkey,
    ) -> Self {
        Self {
            mint: init_miner.token_mint.key(),
            miner: init_miner.miner.key(),
            rewarder: init_miner.rewarder.key(),
            quarry: init_miner.quarry.key(),
            miner_vault: init_miner.miner_vault.key(),
            rewards_mint: init_miner.rewarder.rewards_token_mint,
            mint_wrapper: init_miner.rewarder.mint_wrapper,
            claim_fee_token_account: init_miner.rewarder.claim_fee_token_account,
            vault_staked_token_account: spl_associated_token_account::get_associated_token_address(
                vault_key,
                &init_miner.token_mint.key(),
            ),
            vault_rewards_token_account: spl_associated_token_account::get_associated_token_address(
                vault_key,
                &init_miner.rewarder.rewards_token_mint,
            ),
            sunny_pool_rewards_fee_account:
                spl_associated_token_account::get_associated_token_address(
                    pool_key,
                    &init_miner.rewarder.rewards_token_mint,
                ),
        }
    }
}

impl<'info> Validate<'info> for InitArrowMiners<'info> {
    fn validate(&self) -> ProgramResult {
        // ensure our Arrow has not yet been initialized.
        self.arrow.internal_miner.assert_not_initialized()?;
        self.arrow.vendor_miner.assert_not_initialized()?;

        // ensure we are using the Arrow's pool and vault
        assert_keys_eq!(self.arrow.pool, *self.pool);
        assert_keys_eq!(self.arrow.vault, *self.vault);

        // validate Pool fields
        assert_keys_eq!(self.pool.quarry, *self.vendor_miner.quarry);
        assert_keys_eq!(self.pool.rewarder, *self.vendor_miner.rewarder);
        assert_keys_eq!(
            self.pool.rewards_mint,
            self.vendor_miner.rewarder.rewards_token_mint,
        );
        assert_keys_eq!(
            self.pool.vendor_mint,
            self.vendor_miner.quarry.token_mint_key,
        );
        assert_keys_eq!(
            self.pool.internal_mint,
            self.internal_miner.quarry.token_mint_key,
        );

        // validate consistency of miner structs
        self.internal_miner.validate()?;
        self.vendor_miner.validate()?;
        Ok(())
    }
}

impl ArrowMiner {
    fn assert_not_initialized(&self) -> ProgramResult {
        require!(
            *self == ArrowMiner::default(),
            InitArrowMinersAlreadyInitialized
        );
        Ok(())
    }
}

impl<'info> Validate<'info> for InitMiner<'info> {
    fn validate(&self) -> ProgramResult {
        assert_keys_eq!(
            self.quarry.rewarder_key,
            *self.rewarder,
            "vendor_miner.quarry.rewarder_key"
        );
        assert_ata!(
            *self.miner_vault,
            *self.miner,
            *self.token_mint,
            "miner_vault"
        );
        assert_keys_eq!(
            self.quarry.token_mint_key,
            *self.token_mint,
            "quarry.token_mint_key"
        );
        Ok(())
    }
}
