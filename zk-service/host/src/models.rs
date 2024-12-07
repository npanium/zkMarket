use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use tokio::sync::{mpsc, Mutex};

#[derive(Clone, Deserialize)]
pub struct RangeCheck {
    pub value: i32,
    pub min: i32,
    pub max: i32,
}

#[derive(Clone, Deserialize)]
pub struct FundsCheck {
    pub proposed_price: i32,
    pub available_funds: i32,
}

#[derive(Serialize)]
pub struct ProofResponse {
    pub result: bool,
    pub inner_hex: String,
    pub journal_hex: String,
    pub image_id_hex: String,
}

#[derive(Serialize)]
pub struct JobResponse {
    pub job_id: String,
}

#[derive(Serialize)]
pub struct JobStatus {
    pub status: String,
    pub proof: Option<ProofResponse>,
}

pub struct AppState {
    pub jobs: Mutex<HashMap<String, JobStatus>>,
    pub tx: mpsc::Sender<(String, ProofWorkerInput)>,
}

pub enum ProofWorkerInput {
    Range(RangeCheck),
    Funds(FundsCheck),
}
