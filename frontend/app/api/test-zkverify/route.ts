// app/api/test-zkverify/route.ts
import { NextResponse } from "next/server";
import { zkVerifySession } from "zkverifyjs";

export async function POST(req: Request) {
  const session = await zkVerifySession
    .start()
    .Testnet()
    .withAccount(process.env.SUBSTRATE_SEED_PHRASE!);
  // console.log(`Session: ${JSON.stringify(session)}`);
  const { events, transactionResult } = await session
    .verify()
    .risc0()
    .execute({
      proofData: {
        vk: "0xb09f9d12794960d2aff92e8d4e999b1ab78f37fe1d5274629b6cb8e340fee07e",
        proof:
          "0x030000000000000000000000d4112000ac3268524be15d77b6797f7ccc8a4175e2968c1a786a4be14ef6fe16fe998ed0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000100000000040000000000000001000000000000000000000000000000",
        publicSignals: "0x040000000000000001000000",
      },
    });

  events.on("includedInBlock", (eventData: any) => {
    console.log("Transaction included in block:", eventData);
  });

  events.on("finalized", (eventData: any) => {
    console.log("Transaction finalized:", eventData);
  });

  events.on("attestationConfirmed", (eventData: any) => {
    console.log("Attestation Event Raised:", eventData);
  });
  try {
    const result = await transactionResult;
    console.log(`Result: ${result}`);
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await session.close();
  }
}
