import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ConnectButton } from '../wallet/ConnectButton';
import { TransactionStatus } from '../ui/TransactionStatus';
import { useRegisterProof } from '../../lib/blockchain/contract';
import Link from 'next/link';

interface RegistrationPanelProps {
  contentHash: string;
  analysisHash: string;
  agentType: string;
  title: string;
  isDemoMode?: boolean;
  metadataURI?: string;
}

export function RegistrationPanel({ 
  contentHash,
  analysisHash,
  agentType,
  title, 
  isDemoMode = false,
  metadataURI = ''
}: RegistrationPanelProps) {
  const { isConnected, address } = useAccount();
  const { registerProof, isPending, isConfirming, isConfirmed, hash, error } = useRegisterProof();
  const [demoStatus, setDemoStatus] = useState<'idle' | 'pending' | 'success'>('idle');
  const [dbSaved, setDbSaved] = useState(false);

  useEffect(() => {
    // When the transaction confirms on-chain, save the record to our Supabase DB
    if (isConfirmed && !dbSaved) {
      // Parse the ProofRegistered event from the receipt or just save the hashes directly.
      // We don't have the exact proofId here without parsing logs, so we'll just save what we know 
      // or rely on a generic ID for now (or a backend listener in a real prod app).
      // For this MVP, we'll pass a mock proofId since viem log parsing requires ABI and receipt.
      const saveToDb = async () => {
        try {
          await fetch('/api/proofs/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              proofId: Math.floor(Math.random() * 1000000).toString(), // Mock ID if we don't parse logs
              txHash: hash,
              contentHash,
              analysisHash,
              walletAddress: address
            })
          });
          setDbSaved(true);
        } catch (e) {
          console.error(e);
        }
      };
      saveToDb();
    }
  }, [isConfirmed, dbSaved, hash, contentHash, analysisHash, address]);

  const handleRegister = async () => {
    if (isDemoMode) {
      // Simulate demo transaction
      setDemoStatus('pending');
      setTimeout(() => setDemoStatus('success'), 3000);
      return;
    }
    
    try {
      await registerProof(contentHash, analysisHash, agentType, metadataURI);
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  const getStatus = () => {
    if (isDemoMode) return demoStatus;
    if (isPending || isConfirming) return 'pending';
    if (isConfirmed) return 'success';
    if (error) return 'error';
    return 'idle';
  };

  const status = getStatus();

  return (
    <Card className="flex flex-col gap-6 border-accent-secondary/30">
      <div>
        <h3 className="text-xl font-bold mb-2">Register On-Chain Proof</h3>
        <p className="text-text-secondary text-sm mb-4">
          Anchor this document's fingerprint to the blockchain to prove your ownership at this specific time.
        </p>
      </div>

      <div className="bg-bg-elevated rounded-lg p-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-text-tertiary">Document:</span>
          <span className="font-medium truncate max-w-[200px] sm:max-w-[300px]">{title || 'Untitled Document'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-tertiary">Type:</span>
          <span>{agentType || 'Unknown'}</span>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-bg-primary p-3 rounded border border-border-default">
            <div className="text-[10px] text-text-tertiary uppercase tracking-wider mb-1">Content Fingerprint</div>
            <div className="text-xs font-mono text-text-secondary truncate">{contentHash}</div>
          </div>
          <div className="bg-bg-primary p-3 rounded border border-border-default">
            <div className="text-[10px] text-text-tertiary uppercase tracking-wider mb-1">Analysis Fingerprint</div>
            <div className="text-xs font-mono text-text-secondary truncate">{analysisHash}</div>
          </div>
        </div>
      </div>

      {!isConnected && !isDemoMode ? (
        <div className="flex flex-col items-center justify-center p-6 border border-dashed border-border-default rounded-lg gap-4">
          <p className="text-sm text-center text-text-secondary">
            Connect your wallet to Base Sepolia testnet to register this proof.
          </p>
          <ConnectButton />
        </div>
      ) : status === 'idle' || status === 'error' ? (
        <Button 
          className="w-full py-4 text-lg shadow-glow" 
          onClick={handleRegister}
          disabled={!hash}
        >
          Register Proof On-Chain
        </Button>
      ) : null}

      <TransactionStatus 
        status={status} 
        hash={hash}
        errorMessage={error?.message}
      />

      {status === 'success' && (
        <div className="pt-4 flex flex-col gap-3 animate-fade-in">
          <Link href="/proofs" className="w-full">
            <Button variant="secondary" className="w-full">
              View My Proofs
            </Button>
          </Link>
        </div>
      )}
    </Card>
  );
}
