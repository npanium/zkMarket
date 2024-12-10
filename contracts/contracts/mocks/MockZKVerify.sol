// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MockZkVerify {
    bool private verificationResult;

    function setVerificationResult(bool result) external {
        verificationResult = result;
    }

    function verifyProofAttestation(
        uint256,
        bytes32,
        bytes32[] calldata,
        uint256,
        uint256
    ) external view returns (bool) {
        return verificationResult;
    }
}
