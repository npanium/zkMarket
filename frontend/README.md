# zkMarket

A zero-knowledge dark marketplace that lets users trade assets privately while proving price ranges without revealing exact amounts.

## Features

- Private order creation with ZK proofs
- Range-based price verification
- Order matching without exposing exact prices
- Integration with RISC0 for proof generation
- Proof verification through zkVerify protocol

## Tech Stack

- Next.js 14.0.3 (App Router)
- TypeScript
- Rust (RISC0 prover)
- zkVerify protocol
- shadcn/ui components

## Setup

```bash
# Install dependencies
npm install

# Add environment variables
SUBSTRATE_SEED_PHRASE=your_seed_phrase
NEXT_PUBLIC_RISC0_SERVER=http://localhost:8080

# Run development server
npm run dev

# Start RISC0 prover server (required)
cargo run # In the Rust project directory
```

## Project Structure

```
/app
  /api
    /create-listing    # Handles order creation & proof submission
    /test-zkverify    # Test endpoint for zkVerify submission
  /orders             # View active/past orders
  /create             # Create new listings
/components           # UI components
/utils               # Helper functions
```

## Current Status

Implemented:

- Frontend interface
- Order creation form
- Price range validation
- RISC0 proof generation (requires Rust server)
- zkVerify proof submission

## TODO

Smart Contracts (Not Yet Connected):

- Asset transfer execution
- Order matching logic
- Escrow functionality
- Settlement mechanism
- Trade verification

The project currently focuses on the frontend interface and ZK proof generation/verification. Smart contracts for actual asset transfers and order matching are created but pending integration due to hackathon time constraints.

## Testing

Test endpoints:

```bash
# Test create-listing (requires Rust server on port 8080)
curl -X POST http://localhost:3000/api/create-listing \
-H "Content-Type: application/json" \
-d '{"price":"300","range":"LOW","type":"SELL"}'

# Test zkVerify submission
curl -X POST http://localhost:3000/api/test-zkverify
```
