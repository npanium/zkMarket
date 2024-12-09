export async function generateProof(value: number, min: number, max: number) {
  // Initial proof request
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_RISC0_SERVER}/check_range`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value, min, max }),
    }
  );

  const { job_id } = await response.json();
  return job_id;
}

export async function checkProofStatus(jobId: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_RISC0_SERVER}/job/${jobId}`
  );
  const result = await response.json();
  return result;
}
