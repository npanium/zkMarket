// deploy/marketplace.ts
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ZKVERIFY_ADDRESS = {
  curtis: "0x82941a739E74eBFaC72D0d0f8E81B1Dac2f586D5",
  sepolia: "0x209f82A06172a8d96CF2c95aD8c42316E80695c1",
  arbitrumSepolia: "0x82941a739E74eBFaC72D0d0f8E81B1Dac2f586D5",
} as const;

export default buildModule("NFTMarketplace", (m) => {
  const network =
    (process.env.NETWORK as keyof typeof ZKVERIFY_ADDRESS) || "curtis";
  const zkVerifyAddress = ZKVERIFY_ADDRESS[network];

  // Deploy the marketplace with constructor arguments
  const marketplace = m.contract("NFTMarketplace", [zkVerifyAddress], {
    value: BigInt(0),
  });

  m.call(marketplace, "initialize", [], {
    // Optional initialization parameters
  });

  return { marketplace };
});
