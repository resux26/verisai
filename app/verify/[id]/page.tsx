'use client';

import React, { useState, useEffect, use } from 'react';
import { useGetProof } from '@/lib/blockchain/contract';
import { DEMO_PROOFS } from '@/lib/demo/sampleData';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { FileUpload } from '@/components/ui/FileUpload';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { VerificationResult } from '@/components/proof/VerificationResult';
import { CopyButton } from '@/components/ui/CopyButton';
import { hashFile } from '@/lib/hashing/sha256';
import { formatDate, truncateAddress, getExplorerUrl } from '@/lib/utils/format';
import { ExternalLink, ShieldCheck, FileText, User, Calendar, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function VerifyProofPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const proofId = unwrappedParams.id;
  
  const { data: onChainProof, isLoading: isContractLoading, error: contractError } = useGetProof(proofId as any);
  
  const [proofData, setProofData] = useState<any>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Verification states
  const [uploadedHash, setUploadedHash] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [matchResult, setMatchResult] = useState<boolean | null>(null);

  useEffect(() => {
    // If we have on-chain data, use it
    if (onChainProof && Array.isArray(onChainProof) && onChainProof.length >= 7) {
      // Wagmi returns tuple as array
      setProofData({
        id: onChainProof[0].toString(),
        owner: onChainProof[1],
        contentHash: onChainProof[2],
        analysisHash: onChainProof[3],
        timestamp: Number(onChainProof[4]),
        metadataURI: onChainProof[5],
        agentType: onChainProof[6],
      });
      setIsDemo(false);
      setLoading(false);
    } else if (!isContractLoading) {
      // Fallback to demo data if contract call failed (e.g. no provider, wrong network) or returned nothing
      const demoData = DEMO_PROOFS.find(p => p.id.toString() === proofId);
      if (demoData) {
        setProofData({
          ...demoData,
          contentHash: `0x${demoData.fileHash}` // Maintain compatibility with demo data shape for MVP
        });
        setIsDemo(true);
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
  }, [onChainProof, isContractLoading, proofId]);

  const handleVerifyFile = async (file: File) => {
    if (!proofData) return;
    
    setIsVerifying(true);
    setMatchResult(null);
    
    try {
      const computedHash = await hashFile(file);
      const computedHashHex = `0x${computedHash}`;
      
      setUploadedHash(computedHashHex);
      setMatchResult(computedHashHex === proofData.contentHash);
    } catch (err) {
      console.error("Error hashing file:", err);
    } finally {
      setIsVerifying(false);
    }
  };

  if (loading) {
    return <div className="section min-h-[60vh] flex items-center justify-center"><LoadingSpinner message="Fetching proof data from blockchain..." /></div>;
  }

  if (!proofData) {
    return (
      <div className="section min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-color-error mb-4">Proof Not Found</h1>
        <p className="text-text-secondary mb-8">We couldn't find a proof with ID #{proofId} on the Base Sepolia network.</p>
        <Link href="/verify" className="text-accent-primary hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </Link>
      </div>
    );
  }

  return (
    <div className="section w-full py-12 max-w-5xl">
      <Link href="/verify" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Search
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-color-success-bg flex items-center justify-center text-color-success">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              Proof #{proofId}
              <Badge variant="verified">Verified on-chain</Badge>
              {isDemo && <Badge variant="demo">Demo Data</Badge>}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-bg-secondary border border-border-default rounded-lg p-1">
          <span className="text-xs text-text-tertiary px-2">Share Proof:</span>
          <CopyButton value={typeof window !== 'undefined' ? window.location.href : ''} className="bg-bg-elevated px-3 py-1.5 rounded-md text-xs hover:bg-bg-hover" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Proof Details */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <Card className="flex flex-col gap-5 bg-bg-secondary/50">
            <h3 className="font-semibold text-lg border-b border-border-default pb-2">Registry Details</h3>
            
            <div className="flex flex-col gap-1">
              <span className="text-xs text-text-tertiary uppercase flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Agent Type
              </span>
              <span className="font-medium capitalize">{proofData.agentType || 'Unknown'}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-text-tertiary uppercase flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Registered Owner
              </span>
              <div className="flex items-center gap-2 font-mono text-sm bg-bg-elevated px-2 py-1 rounded border border-border-default w-fit">
                <span className="text-accent-secondary">{truncateAddress(proofData.owner, 8, 6)}</span>
                <CopyButton value={proofData.owner} iconOnly />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-text-tertiary uppercase flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Registration Date
              </span>
              <span className="font-medium">{formatDate(proofData.timestamp)}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-text-tertiary uppercase flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Unix Timestamp
              </span>
              <span className="font-mono text-sm">{proofData.timestamp}</span>
            </div>

            {proofData.txHash && (
              <div className="mt-2 pt-4 border-t border-border-default">
                <a 
                  href={getExplorerUrl(proofData.txHash)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-primary hover:text-accent-secondary"
                >
                  View Transaction on Explorer <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}
          </Card>

          <Card className="bg-bg-secondary/30">
            <h4 className="text-sm font-semibold mb-2">What does this prove?</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              This blockchain record proves that the exact cryptographic fingerprint (SHA-256) of a specific file was registered by the owner's wallet address at the timestamp shown. 
              It does <strong>not</strong> prove the contents of the file are factually true.
            </p>
          </Card>
        </div>

        {/* Right Column: Verification Action */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card>
            <h3 className="text-xl font-semibold mb-2">Verify a File</h3>
            <p className="text-sm text-text-secondary mb-6">
              Do you have a copy of this document? Upload it below to cryptographically verify if it matches this exact blockchain record. The file is hashed in your browser and never uploaded.
            </p>

            <div className="mb-6 p-4 bg-bg-secondary border border-border-default rounded-lg">
              <div className="text-xs text-text-tertiary uppercase mb-1">Registered Content Fingerprint</div>
              <div className="font-mono text-sm text-accent-secondary break-all">
                {proofData.contentHash}
              </div>
            </div>

            <div className="mb-6 p-4 bg-bg-secondary border border-border-default rounded-lg">
              <div className="text-xs text-text-tertiary uppercase mb-1">Registered Analysis Fingerprint</div>
              <div className="font-mono text-sm text-accent-secondary break-all">
                {proofData.analysisHash || 'N/A'}
              </div>
            </div>

            {!isVerifying && matchResult === null && (
              <FileUpload onFileSelect={handleVerifyFile} />
            )}

            {isVerifying && (
              <div className="py-12 border-2 border-dashed border-border-default rounded-xl bg-bg-secondary/30">
                <LoadingSpinner message="Hashing uploaded file & verifying..." />
              </div>
            )}

            {matchResult !== null && !isVerifying && (
              <div className="flex flex-col gap-4">
                <VerificationResult 
                  isMatch={matchResult} 
                  uploadedHash={uploadedHash} 
                  registeredHash={proofData.contentHash} 
                />
                
                <div className="flex justify-center mt-2">
                  <button 
                    onClick={() => setMatchResult(null)}
                    className="text-sm text-text-secondary hover:text-white underline"
                  >
                    Verify a different file
                  </button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
