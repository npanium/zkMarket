# RISC0 Range Checker with zkVerify Integration

A zero-knowledge proof system that verifies range checks and fund sufficiency without revealing actual values.

## Features

- Range validation for seller prices
- Fund sufficiency checks for buyers
- Async proof generation
- REST API endpoints
- Integration with zkVerify

## Prerequisites

- Rust
- cargo-risczero
- RISC0 toolchain

## Installation

```bash
cargo risczero new range-checker --guest-name range_checker
cd range-checker
```

Copy provided files to:

- `src/main.rs`
- `src/models.rs`
- `methods/guest/src/main.rs`

## Dependencies

Add to Cargo.toml:

```toml
[dependencies]
actix-web = "4.0"
serde = { version = "1.0", features = ["derive"] }
bincode = "1.3"
hex = "0.4"
uuid = { version = "1.0", features = ["v4"] }
tokio = { version = "1.0", features = ["full"] }
```

## API Endpoints

- POST `/check_range` - Validate value within range
- POST `/check_funds` - Check fund sufficiency
- GET `/job/{job_id}` - Get proof generation status

## Usage

```bash
# Start server
cargo run --release

# Dev mode
RISC0_DEV_MODE=1 cargo run --release

# Test range check
curl -X POST http://localhost:8080/check_range \
  -H "Content-Type: application/json" \
  -d '{"value":35,"min":0,"max":100}'

# Check job status
curl http://localhost:8080/job/<job_id>
```

## zkVerify Integration

The system generates three components for zkVerify:

- Proof (inner_hex)
- Public inputs (journal_hex)
- Verification key (image_id_hex)
