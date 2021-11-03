//! Addresses.

use anchor_lang::prelude::*;

/// The owner of all fee token accounts.
pub mod fee_owner {
    use anchor_lang::declare_id;
    declare_id!("5ZhyZ5846xWtgm68k9Dg2WpechzcxVPxL3yD3zL3H1wm");
}

/// Owner of arrow fees
pub static ARROW_FEE_OWNER: Pubkey = fee_owner::ID;
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
