import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { PROOFLY_REGISTRY_ABI } from './abi';
import { hardhat } from 'wagmi/chains';
import { toBytes32 } from '../hashing/sha256';

export const PROOFLY_REGISTRY_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; 

export function useRegisterProof() {
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash });

  const registerProof = async (contentHash: string, analysisHash: string, agentType: string, metadataURI: string = '') => {
    writeContract({
      address: PROOFLY_REGISTRY_ADDRESS as `0x${string}`,
      abi: PROOFLY_REGISTRY_ABI,
      functionName: 'registerProof',
      args: [toBytes32(contentHash), toBytes32(analysisHash), metadataURI, agentType],
      chain: hardhat,
    });
  };


  return {
    registerProof,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error
  };
}

export function useGetProof(proofId: bigint | number) {
  return useReadContract({
    address: PROOFLY_REGISTRY_ADDRESS as `0x${string}`,
    abi: PROOFLY_REGISTRY_ABI,
    functionName: 'getProof',
    args: [BigInt(proofId)],
    query: {
      enabled: !!proofId,
    }
  });
}

export function useGetProofByHash(contentHashStr: string) {
  const bytes32Hash = contentHashStr ? toBytes32(contentHashStr) : '0x0000000000000000000000000000000000000000000000000000000000000000';
  
  return useReadContract({
    address: PROOFLY_REGISTRY_ADDRESS as `0x${string}`,
    abi: PROOFLY_REGISTRY_ABI,
    functionName: 'getProofByHash',
    args: [bytes32Hash],
    query: {
      enabled: !!contentHashStr,
    }
  });
}

export function useGetProofsByOwner(ownerAddress: string | undefined) {
  return useReadContract({
    address: PROOFLY_REGISTRY_ADDRESS as `0x${string}`,
    abi: PROOFLY_REGISTRY_ABI,
    functionName: 'getProofsByOwner',
    args: [ownerAddress as `0x${string}`],
    query: {
      enabled: !!ownerAddress,
    }
  });
}
