import { NextResponse } from "next/server";
import { zkVerifySession } from "zkverifyjs";

export async function POST(req: Request) {
  let session;
  try {
    const { price, range, type } = await req.json();

    // 1. Generate RISC0 proof
    const proofRes = await fetch(
      `${process.env.NEXT_PUBLIC_RISC0_SERVER}/check_range`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          value: parseInt(price),
          min: getMinMax(range).min,
          max: getMinMax(range).max,
        }),
      }
    );

    const { job_id } = await proofRes.json();

    // 2. Poll for proof completion
    const proof = await pollForProof(job_id);

    console.log(`response from Rust: \n ${JSON.stringify(proof)}`);
    // 3. Submit to zkVerify
    session = await zkVerifySession
      .start()
      .Testnet()
      .withAccount(process.env.SUBSTRATE_SEED_PHRASE!);

    const { events, transactionResult } = await session
      .verify()
      .risc0()
      .execute({
        proofData: {
          proof: proof.inner_hex, // From RISC0 response
          publicSignals: proof.journal_hex, // From RISC0 response
          vk: proof.image_id_hex, // From RISC0 response
        },
      });

    const result = await transactionResult;

    return NextResponse.json({
      success: true,
      transactionInfo: result,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (session) {
      await session.close();
    }
  }
}

async function pollForProof(jobId: string, maxAttempts = 60) {
  for (let i = 0; i < maxAttempts; i++) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_RISC0_SERVER}/job/${jobId}`
    );
    const result = await response.json();

    if (result.status === "completed") {
      return result.proof;
    }
    if (result.status === "failed") {
      throw new Error("Proof generation failed");
    }

    await new Promise((r) => setTimeout(r, 5000));
  }
  throw new Error("Proof generation timed out");
}

function getMinMax(range: string) {
  const ranges = {
    LOW: "100-500",
    MID: "400-1500",
    HIGH: "1000-5000",
  };
  const [min, max] = ranges[range as keyof typeof ranges].split("-");
  return { min: parseInt(min), max: parseInt(max) };
}
