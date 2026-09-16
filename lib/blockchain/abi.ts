/**
 * ProoflyRegistry ABI — generated from the Solidity contract.
 * Only includes the functions and events we need.
 */
export const PROOFLY_REGISTRY_ABI = [
  {
    type: 'function',
    name: 'registerProof',
    inputs: [
      { name: 'contentHash', type: 'bytes32', internalType: 'bytes32' },
      { name: 'analysisHash', type: 'bytes32', internalType: 'bytes32' },
      { name: 'metadataURI', type: 'string', internalType: 'string' },
      { name: 'agentType', type: 'string', internalType: 'string' },
    ],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getProof',
    inputs: [{ name: 'proofId', type: 'uint256', internalType: 'uint256' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct ProoflyRegistry.Proof',
        components: [
          { name: 'id', type: 'uint256', internalType: 'uint256' },
          { name: 'owner', type: 'address', internalType: 'address' },
          { name: 'contentHash', type: 'bytes32', internalType: 'bytes32' },
          { name: 'analysisHash', type: 'bytes32', internalType: 'bytes32' },
          { name: 'timestamp', type: 'uint256', internalType: 'uint256' },
          { name: 'metadataURI', type: 'string', internalType: 'string' },
          { name: 'agentType', type: 'string', internalType: 'string' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getProofByHash',
    inputs: [{ name: 'contentHash', type: 'bytes32', internalType: 'bytes32' }],
    outputs: [{ name: '', type: 'uint256[]', internalType: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getProofsByOwner',
    inputs: [{ name: 'owner', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256[]', internalType: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'proofCount',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'ProofRegistered',
    inputs: [
      { name: 'proofId', type: 'uint256', indexed: true, internalType: 'uint256' },
      { name: 'owner', type: 'address', indexed: true, internalType: 'address' },
      { name: 'contentHash', type: 'bytes32', indexed: false, internalType: 'bytes32' },
      { name: 'analysisHash', type: 'bytes32', indexed: false, internalType: 'bytes32' },
      { name: 'timestamp', type: 'uint256', indexed: false, internalType: 'uint256' },
      { name: 'agentType', type: 'string', indexed: false, internalType: 'string' },
    ],
  },
] as const;
