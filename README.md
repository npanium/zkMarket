# zkMarket: Zero-Knowledge Dark Marketplace Infrastructure

A modular dark marketplace infrastructure that enables private trading while maintaining price range transparency using zero-knowledge proofs.

## Project Context

zkMarket is being developed as a component of two larger initiatives:

1. **Blockchain Gods**: An upcoming blockchain-based game where zkMarket will serve as the private trading infrastructure for in-game assets and resources.

2. **zkGameKit**: A comprehensive toolkit for blockchain game developers, where zkMarket will be one of several zero-knowledge components that can be easily integrated into gaming projects.

The goal is to create a reusable marketplace infrastructure that maintains the thrill of trading while preventing market manipulation through privacy-preserving mechanics.

## Overview

zkMarket comprises three main components:

- Frontend interface for listing creation and order management
- RISC0-based zero-knowledge proof service
- Smart contracts for trade settlement (pending integration)

The system allows users to trade assets privately while proving their prices fall within public ranges, preventing market manipulation while maintaining trader privacy.

## Project Structure

```
/frontend           # Next.js frontend application
/zk-service         # RISC0 proof generation service
/contracts          # Smart contracts (pending integration)
```

## Features

Implemented:

- Private order creation with ZK proofs
- Range-based price verification
- zkVerify protocol integration
- Async proof generation
- Order management UI

Pending:

- Smart contract integration
- Wallet connectivity
- Asset transfer execution
- Order matching system

## Technical Stack

- Frontend: Next.js 14.0.3, TypeScript, shadcn/ui
- ZK Service: Rust, RISC0, zkVerify protocol
- Smart Contracts: Solidity (pending integration)

## Development Hurdles

1. zkVerify Integration

   - Complex protocol structure understanding
   - Documentation gaps for newer features
   - Version compatibility issues with zkverifyjs

2. RISC0 Challenges

   - Version mismatch between zkVerify (v1.0.1) and latest RISC0 (v1.2.0)
   - Migration from SP1 knowledge base to RISC0
   - Development environment setup complexities

3. Time Constraints
   - Smart contract integration pending
   - Limited testing coverage
   - Incomplete wallet integration

## Potential Use Cases

1. Gaming Integration (Primary Focus)

   - Integration with Blockchain Gods game economy
   - Component of zkGameKit for other game developers
   - Private in-game item trading
   - Cross-game asset exchanges
   - NFT marketplace integration

2. Central Trading Hub

   - Unified marketplace for multiple games
   - Cross-project asset trading
   - Standardized trading interface

3. DeFi Integration
   - Private OTC trading
   - Range-based order books
   - Cross-chain asset swaps

## Future Plans

Short Term:

- Complete smart contract integration
- Add wallet connectivity
- Implement order matching logic
- Enhance error handling
- Add comprehensive testing
- Integration with Blockchain Gods game mechanics

Long Term:

- Create SDK for easy integration
- Build central hub interface
- Add multi-chain support
- Implement advanced privacy features
- Create documentation portal
- Complete zkGameKit integration
- Expand gaming-specific features

## Project Vision

zkMarket aims to become a standardized component that projects can easily integrate for private trading functionality. The goal is to create a unified trading infrastructure that maintains privacy while ensuring fair market practices.

## Getting Started

See individual component READMEs for specific setup instructions:

- [Frontend Setup](/frontend/README.md)
- [ZK Service Setup](/zk-service/README.md)
- [Smart Contracts Setup](/contracts/README.md)

## Contributing

While this project was initially created for a hackathon, contributions are welcome. Areas that need attention:

- Smart contract integration
- Testing coverage
- Documentation improvements
- SDK development

## License

MIT

## Acknowledgments

- zkVerify team for protocol support
- RISC0 documentation and community
- Hackathon organizers and mentors
