#!/usr/bin/env sh

cd $(dirname $0)/..

mkdir -p artifacts/programs/

# sunny
solana program dump SPQR4kT3q2oUKEJes2L6NNSBCiPW9SfuhkuqC9bp6Sx \
    artifacts/programs/sunny.so --url mainnet-beta

# quarry
curl -L https://github.com/QuarryProtocol/quarry/releases/download/v1.11.2/quarry_mine.so > \
    artifacts/programs/quarry_mine.so

curl -L https://github.com/QuarryProtocol/quarry/releases/download/v1.11.2/quarry_mint_wrapper.so > \
    artifacts/programs/quarry_mint_wrapper.so
