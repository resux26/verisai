// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ProoflyRegistry
 * @notice Minimal on-chain registry for document proof-of-existence.
 * @dev Stores SHA-256 file hashes with ownership and timestamps.
 *      Does NOT store actual documents — only fingerprints.
 *      Does NOT hold funds or create tokens.
 */
contract ProoflyRegistry {
    struct Proof {
        uint256 id;
        address owner;
        bytes32 contentHash;
        bytes32 analysisHash;
        uint256 timestamp;
        string metadataURI;
        string agentType;
    }

    uint256 public proofCount;

    // proofId => Proof
    mapping(uint256 => Proof) public proofs;

    // contentHash => array of proofIds
    mapping(bytes32 => uint256[]) public hashToProofIds;

    // owner => array of proofIds
    mapping(address => uint256[]) public ownerProofs;

    // owner + fileHash => bool (prevent duplicate registration by same owner)
    mapping(bytes32 => bool) private _ownerHashRegistered;

    event ProofRegistered(
        uint256 indexed proofId,
        address indexed owner,
        bytes32 contentHash,
        bytes32 analysisHash,
        uint256 timestamp,
        string agentType
    );

    /**
     * @notice Register a new proof of a document analysis.
     * @param contentHash SHA-256 hash of the input file/text
     * @param analysisHash SHA-256 hash of the structured AI analysis result
     * @param metadataURI URI pointing to off-chain metadata JSON
     * @param agentType The AI agent used (e.g., "authenticity", "value")
     * @return proofId The ID of the newly registered proof
     */
    function registerProof(
        bytes32 contentHash,
        bytes32 analysisHash,
        string calldata metadataURI,
        string calldata agentType
    ) external returns (uint256) {
        require(contentHash != bytes32(0), "Invalid content hash");
        require(analysisHash != bytes32(0), "Invalid analysis hash");

        // Prevent same owner from registering same content/analysis combo twice
        bytes32 ownerHashKey = keccak256(abi.encodePacked(msg.sender, contentHash, analysisHash));
        require(!_ownerHashRegistered[ownerHashKey], "Already registered by this owner");

        proofCount++;
        uint256 proofId = proofCount;

        proofs[proofId] = Proof({
            id: proofId,
            owner: msg.sender,
            contentHash: contentHash,
            analysisHash: analysisHash,
            timestamp: block.timestamp,
            metadataURI: metadataURI,
            agentType: agentType
        });

        hashToProofIds[contentHash].push(proofId);
        ownerProofs[msg.sender].push(proofId);
        _ownerHashRegistered[ownerHashKey] = true;

        emit ProofRegistered(proofId, msg.sender, contentHash, analysisHash, block.timestamp, agentType);

        return proofId;
    }

    /**
     * @notice Get a proof by its ID.
     */
    function getProof(uint256 proofId) external view returns (Proof memory) {
        require(proofId > 0 && proofId <= proofCount, "Invalid proof ID");
        return proofs[proofId];
    }

    /**
     * @notice Get all proof IDs associated with a content hash.
     */
    function getProofByHash(bytes32 contentHash) external view returns (uint256[] memory) {
        return hashToProofIds[contentHash];
    }

    /**
     * @notice Get all proof IDs owned by an address.
     */
    function getProofsByOwner(address owner) external view returns (uint256[] memory) {
        return ownerProofs[owner];
    }
}
