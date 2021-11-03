# Arrow

[![License](https://img.shields.io/crates/l/arrow-sunny)](https://github.com/arrowprotocol/arrow/blob/master/LICENSE.md)
[![Build Status](https://img.shields.io/github/workflow/status/arrowprotocol/arrow/E2E/master)](https://github.com/arrowprotocol/arrow/actions/workflows/programs-e2e.yml?query=branch%3Amaster)
[![Contributors](https://img.shields.io/github/contributors/arrowprotocol/arrow)](https://github.com/arrowprotocol/arrow/graphs/contributors)

![Arrow](/images/banner.png)

Launch staking derivatives for the protocols you're already integrating with, redirecting yield to a different address.

We're in active development. For the latest updates, please join our community:

- Twitter: https://twitter.com/arrowprotocol/
- Keybase Chat: https://keybase.io/team/arrowverse

## About

Arrow allows individuals, protocols, and DAOs to launch staking derivatives which redirect yield to a different address. This allows protocols to directly benefit from integrating with underlying protocols that issue tokens via liquidity mining.

Potential users may include:

- **Lending protocols.** A lender may take Saber LPs as collateral. By using Arrow, the lending protocol only needs to accept their Arrow for the corresponding LP token as collateral, and earns Saber and Sunny tokens for doing so.
- **[Crates](https://crate.so).** As Crates can only hold tokens, they cannot directly integrate with farming pools. This tokenization allows the yields of underlying assets to get redirected to the creator of the Crate, or to the Crate itself, allowing for extremely composable yield aggregation.
- **Community fundraising.** A community can pool its yield-generating assets via an Arrow to help fund its operations. As these derivatives are tokens, the community has a very simple cap table they can use to ensure that its members are staking a minimum amount.
- **Charitable organizations.** One could create an Arrow which redirects yield to a charity, allowing users to donate to a cause without needing to spend any money. Notable prior work in this space includes [rTrees](https://rtrees.dappy.dev/), a DAO which plants trees from DAI yield.

Arrow's first integration is with the [Sunny Aggregator](https://sunny.ag). As Sunny is built on top of Quarry, we expect Sunny to integrate with any future Quarry pools. At the time of writing, this will allow users to redirect Sunny and Saber yields.

## Packages

| Package                | Description                           | Version                                                                                                             | Docs                                                                                          |
| :--------------------- | :------------------------------------ | :------------------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------- |
| `arrow-sunny`          | Sunny protocol integration for Arrow. | [![Crates.io](https://img.shields.io/crates/v/arrow-sunny)](https://crates.io/crates/arrow-sunny)                   | [![Docs.rs](https://docs.rs/arrow-sunny/badge.svg)](https://docs.rs/arrow-sunny)              |
| `@arrowprotocol/arrow` | TypeScript SDK for Arrow              | [![npm](https://img.shields.io/npm/v/@arrowprotocol/arrow.svg)](https://www.npmjs.com/package/@arrowprotocol/arrow) | [![Docs](https://img.shields.io/badge/docs-typedoc-blue)](https://docs.arrowprotocol.com/ts/) |

## Note

- **Arrow is in active development, so all APIs are subject to change.**
- **This code is unaudited. Use at your own risk.**

## Contribution

Thank you for your interest in contributing to Arrow Protocol! All contributions are welcome no
matter how big or small. This includes (but is not limited to) filing issues,
adding documentation, fixing bugs, creating examples, and implementing features.

If you'd like to contribute, please claim an issue by commenting, forking, and
opening a pull request, even if empty. This allows the maintainers to track who
is working on what issue as to not overlap work.

For simple documentation changes, feel free to just open a pull request.

If you're considering larger changes or self motivated features, please file an issue
and engage with the maintainers by posting in our [Keybase community](https://keybase.io/team/arrowverse).

## License

Arrow Protocol is licensed under [the Affero GPL 3.0 license](/LICENSE.md).

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in Arrow Protocol by you, as defined in the AGPL-3.0 license, shall be licensed as above, without any additional terms or conditions.
