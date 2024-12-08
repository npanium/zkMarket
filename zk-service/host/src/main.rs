use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use methods::{RANGE_CHECKER_ELF, RANGE_CHECKER_ID};
use risc0_zkvm::{default_prover, ExecutorEnv};
use std::collections::HashMap;
use tokio::sync::{mpsc, Mutex};
use uuid::Uuid;

mod models;
use models::*;

async fn generate_proof(input: ProofWorkerInput) -> ProofResponse {
    match input {
        ProofWorkerInput::Range(data) => {
            let env = ExecutorEnv::builder()
                .write(&(0_i32))
                .unwrap()
                .write(&data.value)
                .unwrap()
                .write(&data.min)
                .unwrap()
                .write(&data.max)
                .unwrap()
                .build()
                .unwrap();

            let prover = default_prover();
            let receipt = prover.prove(env, RANGE_CHECKER_ELF).unwrap().receipt;

            // Start-- zkVerify

            // Proof
            let inner_hex = hex::encode(bincode::serialize(&receipt.inner).unwrap()); //TODO: remove hex::encode() wrap. check example

            // Public inputs
            let journal_hex = hex::encode(bincode::serialize(&receipt.journal).unwrap()); //TODO: remove hex::encode() wrap. check example

            // vk
            let mut image_id_hex = String::new();
            for &value in &RANGE_CHECKER_ID {
                image_id_hex.push_str(&format!("{:08x}", value.to_be()));
            }
            // End-- zkVerify

            let result: bool = receipt.journal.decode().unwrap();

            ProofResponse {
                result,
                inner_hex,
                journal_hex,
                image_id_hex,
            }
        }
        ProofWorkerInput::Funds(data) => {
            let env = ExecutorEnv::builder()
                .write(&(1_i32))
                .unwrap() // mode
                .write(&data.proposed_price)
                .unwrap()
                .write(&data.available_funds)
                .unwrap()
                .build()
                .unwrap();

            let prover = default_prover();
            let receipt = prover.prove(env, RANGE_CHECKER_ELF).unwrap().receipt;

            // Start-- zkVerify

            // Proof
            let inner_hex = hex::encode(bincode::serialize(&receipt.inner).unwrap());
            println!("Proof done: {}", inner_hex);
            // Public inputs
            let journal_hex = hex::encode(bincode::serialize(&receipt.journal).unwrap());
            // vk
            let mut image_id_hex = String::new();
            for &value in &RANGE_CHECKER_ID {
                image_id_hex.push_str(&format!("{:08x}", value.to_be()));
            }
            // End-- zkVerify

            let result: bool = receipt.journal.decode().unwrap();

            ProofResponse {
                result,
                inner_hex,
                journal_hex,
                image_id_hex,
            }
        }
    }
}

async fn check_range(data: web::Json<RangeCheck>, state: web::Data<AppState>) -> impl Responder {
    let job_id = Uuid::new_v4().to_string();

    state.jobs.lock().await.insert(
        job_id.clone(),
        JobStatus {
            status: "processing".to_string(),
            proof: None,
        },
    );

    state
        .tx
        .send((job_id.clone(), ProofWorkerInput::Range(data.0)))
        .await
        .unwrap();

    HttpResponse::Accepted().json(JobResponse { job_id })
}

async fn get_job_status(job_id: web::Path<String>, state: web::Data<AppState>) -> impl Responder {
    let job_id = job_id.into_inner();
    if let Some(status) = state.jobs.lock().await.get(&job_id) {
        HttpResponse::Ok().json(status)
    } else {
        HttpResponse::NotFound().finish()
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let (tx, mut rx) = mpsc::channel::<(String, ProofWorkerInput)>(32);
    let jobs = Mutex::new(HashMap::new());
    let state = web::Data::new(AppState { jobs, tx });

    // Spawn worker
    let state_clone = state.clone();
    tokio::spawn(async move {
        while let Some((job_id, input)) = rx.recv().await {
            let proof = generate_proof(input).await;
            state_clone.jobs.lock().await.insert(
                job_id,
                JobStatus {
                    status: "completed".to_string(),
                    proof: Some(proof),
                },
            );
        }
    });

    HttpServer::new(move || {
        App::new()
            .app_data(state.clone())
            .route("/check_range", web::post().to(check_range))
            .route("/job/{job_id}", web::get().to(get_job_status))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
