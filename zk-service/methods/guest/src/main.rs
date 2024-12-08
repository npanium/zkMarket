use risc0_zkvm::guest::env;

// risc0_zkvm::guest::entry!(main);

fn main() {
    let mode: i32 = env::read::<i32>();

    match mode {
        0 => check_range(),
        1 => check_funds(),
        _ => panic!("Invalid mode"),
    }
}

fn check_range() {
    let value = env::read::<i32>();
    let min = env::read::<i32>();
    let max = env::read::<i32>();

    let result = value >= min && value <= max;
    env::commit(&result);
}

fn check_funds() {
    let price = env::read::<i32>();
    let funds = env::read::<i32>();

    let result = funds >= price;
    env::commit(&result);
}
