use methods::{RANGE_CHECKER_ELF, RANGE_CHECKER_ID};
use risc0_zkvm::{default_prover, ExecutorEnv};

fn check_range(value: i32, min: i32, max: i32) {
    let env = ExecutorEnv::builder()
        .write(&(0_i32))
        .unwrap() // mode
        .write(&value)
        .unwrap()
        .write(&min)
        .unwrap()
        .write(&max)
        .unwrap()
        .build()
        .unwrap();

    let prover = default_prover();
    let receipt = prover.prove(env, RANGE_CHECKER_ELF).unwrap().receipt;
    let result: bool = receipt.journal.decode().unwrap();

    println!(
        "Value {} is within range [{}, {}]: {}",
        value, min, max, result
    );
}

fn check_sufficient_funds(proposed_price: i32, available_funds: i32) {
    let env = ExecutorEnv::builder()
        .write(&(1_i32))
        .unwrap() // mode
        .write(&proposed_price)
        .unwrap()
        .write(&available_funds)
        .unwrap()
        .build()
        .unwrap();

    let prover = default_prover();
    let receipt = prover.prove(env, RANGE_CHECKER_ELF).unwrap().receipt;
    let result: bool = receipt.journal.decode().unwrap();

    println!(
        "Buyer has sufficient funds ({}) for price {}: {}",
        available_funds, proposed_price, result
    );
}

fn main() {
    // Test range check
    check_range(35, 0, 100);

    // Test funds check
    check_sufficient_funds(50, 100);
}
