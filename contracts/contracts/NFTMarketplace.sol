// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IZkVerifyAttestation {
    function verifyProofAttestation(
        uint256 _attestationId,
        bytes32 _leaf,
        bytes32[] calldata _merklePath,
        uint256 _leafCount,
        uint256 _index
    ) external view returns (bool);
}

contract NFTMarketplace {
    IZkVerifyAttestation public immutable zkVerify;
    IERC721 public nftContract;
    IERC20 public paymentToken;

    constructor(address zkVerifyAddress) {
        zkVerify = IZkVerifyAttestation(zkVerifyAddress);
    }

    struct Listing {
        address seller;
        uint256 tokenId;
        uint256 attestationId; // Stores the zkVerify attestation ID
        uint256 minPrice;
        uint256 maxPrice;
        bool active;
        Bid[] bids;
    }

    struct Bid {
        address bidder;
        uint256 amount;
    }

    mapping(uint256 => Listing) public listings;
    mapping(uint256 => Bid[]) public bidsForListing;
    uint256 public listingCounter;

    event ListingCreated(
        uint256 indexed listingId,
        address seller,
        uint256 tokenId
    );
    event ListingCancelled(uint256 indexed listingId);
    event BidSubmitted(
        uint256 indexed listingId,
        address bidder,
        uint256 amount
    );
    event SaleExecuted(uint256 indexed listingId, address buyer, uint256 price);

    // function getBid(
    //     uint256 listingId,
    //     uint256 bidIndex
    // ) public view returns (Bid memory) {
    //     return listingBids[listingId][bidIndex];
    // }

    function setNFTContract(address _nftContract) external {
        require(address(nftContract) == address(0), "NFT contract already set");
        nftContract = IERC721(_nftContract);
    }

    function setPaymentToken(address _paymentToken) external {
        require(
            address(paymentToken) == address(0),
            "Payment token already set"
        );
        paymentToken = IERC20(_paymentToken);
    }

    function createListing(
        uint256 tokenId,
        uint256 attestationId,
        uint256 minPrice,
        uint256 maxPrice
    ) external {
        require(nftContract.ownerOf(tokenId) == msg.sender, "Not token owner");
        require(
            nftContract.isApprovedForAll(msg.sender, address(this)),
            "Contract not approved"
        );

        listingCounter++;
        listings[listingCounter] = Listing({
            seller: msg.sender,
            tokenId: tokenId,
            attestationId: attestationId,
            minPrice: minPrice,
            maxPrice: maxPrice,
            active: true,
            bids: new Bid[](0)
        });

        emit ListingCreated(listingCounter, msg.sender, tokenId);
    }

    function cancelListing(uint256 listingId) external {
        Listing storage listing = listings[listingId];
        require(listing.seller == msg.sender, "Not seller");
        require(listing.active, "Not active");

        listing.active = false;
        emit ListingCancelled(listingId);
    }

    function submitBid(uint256 listingId, uint256 price) external {
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing not active");
        require(
            price >= listing.minPrice && price <= listing.maxPrice,
            "Price out of range"
        );
        require(
            paymentToken.balanceOf(msg.sender) >= price,
            "Insufficient balance"
        );

        bidsForListing[listingId].push(Bid(msg.sender, price));
        emit BidSubmitted(listingId, msg.sender, price);
    }

    function getBidsForListing(
        uint256 listingId
    ) external view returns (Bid[] memory) {
        return bidsForListing[listingId];
    }

    function executeSale(
        uint256 listingId,
        uint256 winnerIndex,
        bytes32 leaf,
        bytes32[] calldata merklePath,
        uint256 leafCount,
        uint256 index
    ) external {
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing not active");
        require(listing.seller == msg.sender, "Not seller");

        // Verify there are bids
        Bid[] storage bids = bidsForListing[listingId];
        require(bids.length > 0, "No bids");
        require(winnerIndex < bids.length, "Invalid winner index");

        require(
            zkVerify.verifyProofAttestation(
                listing.attestationId,
                leaf,
                merklePath,
                leafCount,
                index
            ),
            "Invalid proof"
        );

        Bid memory winningBid = bids[winnerIndex];
        listing.active = false;

        // Transfer NFT and tokens
        paymentToken.transferFrom(
            winningBid.bidder,
            listing.seller,
            winningBid.amount
        );
        nftContract.transferFrom(
            listing.seller,
            winningBid.bidder,
            listing.tokenId
        );

        emit SaleExecuted(listingId, winningBid.bidder, winningBid.amount);
    }
}
