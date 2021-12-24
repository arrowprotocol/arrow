//! Addresses.

use anchor_lang::prelude::*;
use anchor_lang::solana_program;

/// The owner of all fee token accounts.
pub static ARROW_FEE_OWNER: Pubkey =
    static_pubkey::static_pubkey!("5ZhyZ5846xWtgm68k9Dg2WpechzcxVPxL3yD3zL3H1wm");

/// Bump seed of arrow fees
pub static ARROW_FEE_OWNER_BUMP: u8 = 255;

/// Seeds of [ARROW_FEE_OWNER].
pub static ARROW_FEE_OWNER_SEEDS: &[&[&[u8]]] = &[&[b"arrow-fees", &[ARROW_FEE_OWNER_BUMP]]];

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn test_fee_owner_address() {
        let (key, bump) = Pubkey::find_program_address(&[b"arrow-fees"], &crate::ID);
        assert_eq!(key, ARROW_FEE_OWNER);
        assert_eq!(bump, ARROW_FEE_OWNER_BUMP);
    }
}
