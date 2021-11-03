macro_rules! gen_arrow_signer_seeds {
    ($arrow: expr) => {
        &[&[b"arrow", &$arrow.mint.to_bytes(), &[$arrow.bump]]]
    };
}
