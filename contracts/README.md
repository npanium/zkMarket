````markdown
# NFT Marketplace with Zero Knowledge Proof Verification

This project implements a decentralized NFT marketplace with ZK proof verification using the zkVerify protocol.

## Features

- Create NFT listings with min/max price ranges
- Place bids on listings using ERC20 tokens
- Verify ZK proofs before executing sales
- Batch attestation support

## Smart Contracts

- `NFTMarketplace.sol`: Main marketplace contract
- `MockERC721.sol`: Mock NFT contract for testing
- `MockERC20.sol`: Mock ERC20 token for testing
- `MockZkVerify.sol`: Mock ZK verifier for testing

## Getting Started

Install dependencies:

```bash
npm install
```
````

Run tests:

```bash
npx hardhat test
```

Deploy:

```bash
npx hardhat run scripts/deploy.ts
```

## Testing

Tests cover:

- Listing creation
- Bid submission
- Sale execution with ZK proof verification
- Invalid bid handling
- Payment token transfers

## Architecture

The marketplace uses:

- ERC721 for NFTs
- ERC20 for payments
- zkVerify for proof verification
- OpenZeppelin contracts for security

## Requirements

- Node.js v14+
- Hardhat
- OpenZeppelin Contracts
- TypeScript

## License

MIT

```

```
