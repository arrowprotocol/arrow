//! Sunny Anchor client.

use anchor_lang::prelude::*;

declare_id!("SPQR4kT3q2oUKEJes2L6NNSBCiPW9SfuhkuqC9bp6Sx");

#[program]
pub mod sunny_anchor {
    use super::*;

    pub fn init_vault(_ctx: Context<InitVault>, _bump: u8) -> Result<()> {
        Ok(())
    }

    pub fn init_miner(_ctx: Context<InitMiner>, _bump: u8) -> Result<()> {
        Ok(())
    }

    pub fn deposit_vendor(_ctx: Context<QuarryStakeVendor>) -> Result<()> {
        Ok(())
    }

    pub fn stake_internal(_ctx: Context<QuarryStakeInternal>) -> Result<()> {
        Ok(())
    }

    pub fn unstake_internal(_ctx: Context<QuarryStakeInternal>, _amount: u64) -> Result<()> {
        Ok(())
    }

    pub fn withdraw_vendor(_ctx: Context<QuarryStakeVendor>, _amount: u64) -> Result<()> {
        Ok(())
    }

    pub fn withdraw_from_vault(_ctx: Context<WithdrawFromVault>) -> Result<()> {
        Ok(())
    }

    pub fn claim_rewards(_ctx: Context<ClaimRewards>) -> Result<()> {
        Ok(())
    }
}

#[account]
#[derive(Copy, Debug, Default)]
pub struct Pool {
    pub creator: Pubkey,
    pub quarry: Pubkey,
    pub bump: u8,
    pub rewarder: Pubkey,
    pub rewards_mint: Pubkey,
    pub vendor_mint: Pubkey,
    pub internal_mint: Pubkey,
    pub admin: Pubkey,
    pub pending_admin: Pubkey,
    pub fees: Fees,
    pub vault_count: u64,
    pub total_vendor_balance: u64,
    pub total_internal_balance: u64,
    pub total_rewards_claimed: u64,
    pub total_rewards_fees_paid: u64,
}

#[account]
#[derive(Copy, Debug, Default)]
pub struct Vault {
    pub pool: Pubkey,
    pub owner: Pubkey,
    pub bump: u8,
    pub index: u64,
    pub vendor_balance: u64,
    pub internal_balance: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Debug, Default)]
pub struct Fees {
    pub claim_fee: MegaBPS,
    pub vendor_fee: MegaBPS,
    pub withdraw_fee: MegaBPS,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Debug, Default)]
pub struct MegaBPS {
    pub mega_bps: u64,
}

#[derive(Accounts)]
pub struct InitVault<'info> {
    pub pool: UncheckedAccount<'info>,
    pub owner: UncheckedAccount<'info>,
    #[account(mut)]
    pub vault: UncheckedAccount<'info>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: UncheckedAccount<'info>,
}

#[derive(Accounts)]
pub struct InitMiner<'info> {
    pub pool: UncheckedAccount<'info>,
    pub vault: UncheckedAccount<'info>,
    #[account(mut)]
    pub miner: UncheckedAccount<'info>,
    #[account(mut)]
    pub quarry: UncheckedAccount<'info>,
    pub rewarder: UncheckedAccount<'info>,
    pub token_mint: UncheckedAccount<'info>,
    pub miner_vault: UncheckedAccount<'info>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub mine_program: UncheckedAccount<'info>,
    pub system_program: UncheckedAccount<'info>,
    pub token_program: UncheckedAccount<'info>,
}

#[derive(Accounts)]
pub struct WithdrawFromVault<'info> {
    pub owner: Signer<'info>,
    pub pool: UncheckedAccount<'info>,
    #[account(mut)]
    pub vault: UncheckedAccount<'info>,
    #[account(mut)]
    pub vault_token_account: UncheckedAccount<'info>,
    #[account(mut)]
    pub token_destination: UncheckedAccount<'info>,
    #[account(mut)]
    pub fee_destination: UncheckedAccount<'info>,
    pub token_program: UncheckedAccount<'info>,
}

#[derive(Accounts)]
pub struct ClaimRewards<'info> {
    #[account(mut)]
    pub mint_wrapper: UncheckedAccount<'info>,
    pub mint_wrapper_program: UncheckedAccount<'info>,
    #[account(mut)]
    pub minter: UncheckedAccount<'info>,
    #[account(mut)]
    pub rewards_token_mint: UncheckedAccount<'info>,
    #[account(mut)]
    pub rewards_token_account: UncheckedAccount<'info>,
    #[account(mut)]
    pub claim_fee_token_account: UncheckedAccount<'info>,
    #[account(mut)]
    pub stake_token_account: UncheckedAccount<'info>,
    pub stake: QuarryStake<'info>,
}

#[derive(Accounts)]
pub struct QuarryStakeVendor<'info> {
    pub vault_owner: Signer<'info>,
    #[account(mut)]
    pub vault_vendor_token_account: UncheckedAccount<'info>,
    pub stake: QuarryStake<'info>,
}

#[derive(Accounts)]
pub struct QuarryStakeInternal<'info> {
    pub vault_owner: Signer<'info>,
    #[account(mut)]
    pub internal_mint: UncheckedAccount<'info>,
    #[account(mut)]
    pub internal_mint_token_account: UncheckedAccount<'info>,
    pub stake: QuarryStake<'info>,
}

#[derive(Accounts)]
pub struct QuarryStake<'info> {
    #[account(mut)]
    pub pool: UncheckedAccount<'info>,
    #[account(mut)]
    pub vault: UncheckedAccount<'info>,
    pub rewarder: UncheckedAccount<'info>,
    #[account(mut)]
    pub quarry: UncheckedAccount<'info>,
    #[account(mut)]
    pub miner: UncheckedAccount<'info>,
    #[account(mut)]
    pub miner_vault: UncheckedAccount<'info>,
    pub token_program: UncheckedAccount<'info>,
    pub mine_program: UncheckedAccount<'info>,
    pub clock: UncheckedAccount<'info>,
}
