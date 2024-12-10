import {
  MockERC721,
  NFTMarketplace,
  MockZkVerify,
  MockERC20,
} from "../typechain-types";
import { expect } from "chai";
import { ethers } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

type Listing = {
  seller: string;
  tokenId: bigint;
  attestationId: bigint;
  minPrice: bigint;
  maxPrice: bigint;
  active: boolean;
  bids: Array<{ bidder: string; amount: bigint }>;
};

interface Bid {
  bidder: string;
  amount: bigint;
}

describe("NFTMarketplace", function () {
  let marketplace: NFTMarketplace;
  let mockNFT: MockERC721;
  let zkVerify: MockZkVerify;
  let owner: HardhatEthersSigner;
  let seller: HardhatEthersSigner;
  let buyer: HardhatEthersSigner;
  let mockPaymentToken: MockERC20; // Add mock ERC20 token

  const TOKEN_ID = 1n;
  const MOCK_ATTESTATION_ID = 1n;
  const MIN_PRICE = ethers.parseEther("0.1");
  const MAX_PRICE = ethers.parseEther("0.5");
  const BID_AMOUNT = ethers.parseEther("0.2");

  beforeEach(async function () {
    [owner, seller, buyer] = await ethers.getSigners();

    // Deploy mock contracts
    const MockNFT = await ethers.getContractFactory("MockERC721");
    mockNFT = await MockNFT.deploy();

    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockPaymentToken = await MockERC20.deploy();

    const MockZkVerify = await ethers.getContractFactory("MockZkVerify");
    zkVerify = await MockZkVerify.deploy();

    // Deploy marketplace
    const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
    marketplace = await NFTMarketplace.deploy(await zkVerify.getAddress());

    // Initialize marketplace
    await marketplace.setNFTContract(await mockNFT.getAddress());
    await marketplace.setPaymentToken(await mockPaymentToken.getAddress());

    // Setup NFT
    await mockNFT.mint(seller.address, TOKEN_ID);
    await mockNFT
      .connect(seller)
      .setApprovalForAll(await marketplace.getAddress(), true);

    // Setup payment token
    await mockPaymentToken.mint(buyer.address, ethers.parseEther("1.0"));
    await mockPaymentToken
      .connect(buyer)
      .approve(await marketplace.getAddress(), ethers.parseEther("1.0"));
  });

  describe("Bidding", function () {
    beforeEach(async function () {
      await marketplace
        .connect(seller)
        .createListing(TOKEN_ID, MOCK_ATTESTATION_ID, MIN_PRICE, MAX_PRICE);
    });

    it("Should submit a bid successfully", async function () {
      await marketplace.connect(buyer).submitBid(1n, BID_AMOUNT);

      const bids = await marketplace.getBidsForListing(1n);
      expect(bids[0].bidder).to.equal(buyer.address);
      expect(bids[0].amount).to.equal(BID_AMOUNT);
    });

    it("Should fail if bid is outside price range", async function () {
      const lowBid = MIN_PRICE - 1n;
      await expect(
        marketplace.connect(buyer).submitBid(1n, lowBid)
      ).to.be.revertedWith("Price out of range");
    });
  });

  describe("Sale Execution", function () {
    beforeEach(async function () {
      await marketplace
        .connect(seller)
        .createListing(TOKEN_ID, MOCK_ATTESTATION_ID, MIN_PRICE, MAX_PRICE);

      await marketplace.connect(buyer).submitBid(1n, BID_AMOUNT);
    });

    it("Should execute sale with valid proof", async function () {
      console.log("Bids:", await marketplace.getBidsForListing(1n));
      await zkVerify.setVerificationResult(true);

      const tx = await marketplace
        .connect(seller)
        .executeSale(1n, 0n, ethers.randomBytes(32), [], 1n, 0n);

      await tx.wait();
      expect(await mockNFT.ownerOf(TOKEN_ID)).to.equal(buyer.address);
    });

    it("Should fail with invalid proof", async function () {
      await zkVerify.setVerificationResult(false);

      await expect(
        marketplace
          .connect(seller)
          .executeSale(1n, 0n, ethers.randomBytes(32), [], 1n, 0n)
      ).to.be.revertedWith("Invalid proof");
    });
  });
});
