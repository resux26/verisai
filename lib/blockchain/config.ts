import { http, createConfig } from 'wagmi';
import { baseSepolia, hardhat } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

/**
 * Blockchain configuration for Crexto.
 * 
 * Uses Base Sepolia as the primary chain for proof registration.
 * Falls back to Hardhat for local development when
 * NEXT_PUBLIC_USE_LOCAL_CHAIN=true is set.
 */

const useLocalChain = process.env.NEXT_PUBLIC_USE_LOCAL_CHAIN === 'true';

export const config = useLocalChain
  ? createConfig({
      chains: [hardhat],
      ssr: true,
      connectors: [injected()],
      transports: {
        [hardhat.id]: http(),
      },
    })
  : createConfig({
      chains: [baseSepolia],
      ssr: true,
      connectors: [injected()],
      transports: {
        [baseSepolia.id]: http(),
      },
    });

/** The contract address for ProoflyRegistry */
export const PROOF_CONTRACT_ADDRESS = (
  process.env.NEXT_PUBLIC_PROOF_CONTRACT_ADDRESS ||
  '0x5FbDB2315678afecb367f032d93F642f64180aa3'
) as `0x${string}`;

/** Active chain info for display */
export const ACTIVE_CHAIN = useLocalChain ? hardhat : baseSepolia;
