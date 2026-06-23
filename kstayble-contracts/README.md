# KStayble Smart Contracts

This directory contains the core smart contracts for the KStayble ecosystem, implementing a permissioned stablecoin system for verified foreign tourists in Korea.

## Contract Overview

### 1. ForeignerSBT.sol
- **Purpose**: Non-transferable NFT (Soulbound Token) for identity verification
- **Features**: One-per-user SBT, non-transferable, owner-controlled minting/burning
- **Location**: `src/ForeignerSBT.sol`

### 2. forKRW.sol  
- **Purpose**: KRW-pegged stablecoin exclusively for SBT holders
- **Features**: Permissioned access, loyalty rewards, transfer restrictions
- **Location**: `src/forKRW.sol`

## Architecture

```
ForeignerSBT (Identity Layer) ←→ forKRW (Stablecoin Layer)
        ↓                              ↓
   Verification Check    ←→    Transfer Authorization
```

## Foundry Development Environment

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

-   **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
-   **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
-   **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
-   **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy KStayble Contracts

```shell
# Deploy to local testnet (Anvil)
$ forge script script/Deploy.s.sol:DeployScript --rpc-url http://localhost:8545 --private-key <your_private_key> --broadcast

# Deploy to MemeCore testnet (Insectarium)
$ forge script script/Deploy.s.sol:DeployScript --rpc-url https://rpc.insectarium.memecore.net --private-key <your_private_key> --broadcast --verify

# Deploy to MemeCore mainnet
$ forge script script/Deploy.s.sol:DeployScript --rpc-url <memecore_mainnet_rpc> --private-key <your_private_key> --broadcast --verify
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
