{ pkgs, ci }:
pkgs.stdenvNoCC.mkDerivation {
  name = "shell";
  nativeBuiltInputs = (pkgs.lib.optionals pkgs.stdenv.isDarwin [
    pkgs.darwin.apple_sdk.frameworks.AppKit
    pkgs.darwin.apple_sdk.frameworks.IOKit
    pkgs.darwin.apple_sdk.frameworks.Foundation
  ]);
  buildInputs = with pkgs; [ ci rustup cargo-deps gh ];
}
