'use client';

import React, { useState } from 'react';
import { FileUpload } from '@/components/ui/FileUpload';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { FileFingerprint } from '@/components/proof/FileFingerprint';
import { DocumentAnalysis } from '@/components/proof/DocumentAnalysis';
import { RegistrationPanel } from '@/components/proof/RegistrationPanel';
import { hashFile, readFileContent } from '@/lib/hashing/sha256';
import { Badge } from '@/components/ui/Badge';
import { Info } from 'lucide-react';

export default function ProofStudio() {
  const [file, setFile] = useState<File | null>(null);
  const [hash, setHash] = useState<string>('');
  const [isHashing, setIsHashing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const processFile = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setError(null);
    setAnalysisData(null);
    setHash('');
    
    try {
      // 1. Hash the file locally
      setIsHashing(true);
      const computedHash = await hashFile(uploadedFile);
      setHash(`0x${computedHash}`);
      setIsHashing(false);

      // 2. Read content and send to AI
      setIsAnalyzing(true);
      const { text, isImage } = await readFileContent(uploadedFile);
      
      const response = await fetch('/api/ai/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileContent: text, isImage })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze document');
      }

      const data = await response.json();
      
      // If we got a mock response because API key is missing
      if (data.summary?.includes('Gemini API key is not configured')) {
        setIsDemoMode(true);
      }
      
      setAnalysisData(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while processing the file');
    } finally {
      setIsHashing(false);
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setHash('');
    setAnalysisData(null);
    setError(null);
  };

  return (
    <div className="section w-full py-12">
      <div className="mb-8 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">AI Proof Studio</h1>
        <p className="text-text-secondary text-lg">
          Upload any digital document. Our AI will analyze it, generate a unique cryptographic fingerprint, 
          and help you permanently register it on the blockchain.
        </p>
      </div>

      {!file && (
        <div className="max-w-4xl mx-auto mt-12">
          <FileUpload onFileSelect={processFile} isLoading={isHashing || isAnalyzing} />
        </div>
      )}

      {(isHashing || isAnalyzing) && (
        <LoadingSpinner 
          message={isHashing ? "Generating cryptographic fingerprint..." : "AI is analyzing your document..."} 
          className="my-16"
        />
      )}

      {error && (
        <div className="p-4 bg-color-error-bg text-color-error rounded-lg border border-color-error/20 my-8 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={handleReset} className="text-sm underline hover:text-white">Try Again</button>
        </div>
      )}

      {file && hash && analysisData && !isHashing && !isAnalyzing && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 animate-fade-in-up">
          {/* Left Column: Analysis & Hash */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex items-center justify-between bg-bg-secondary p-4 rounded-lg border border-border-default">
              <div className="flex flex-col">
                <span className="text-sm font-medium">Selected File:</span>
                <span className="text-text-secondary text-sm">{file.name}</span>
              </div>
              <button 
                onClick={handleReset}
                className="text-sm text-accent-primary hover:text-accent-secondary"
              >
                Change File
              </button>
            </div>
            
            <FileFingerprint hash={hash} />
            <DocumentAnalysis data={analysisData} onChange={setAnalysisData} />
            
            {isDemoMode && (
              <div className="flex items-start gap-3 p-4 bg-color-info-bg border border-color-info/20 rounded-lg text-sm text-color-info">
                <Info className="w-5 h-5 shrink-0 mt-0.5" />
                <p>
                  <strong>Demo Mode:</strong> You are seeing sample analysis data because the Gemini API key is not configured. 
                  You can still register this proof on the testnet using a connected wallet.
                </p>
              </div>
            )}
          </div>
          
          {/* Right Column: Registration */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-24">
              <RegistrationPanel 
                contentHash={hash} 
                analysisHash={'0x0000000000000000000000000000000000000000000000000000000000000000'}
                agentType={analysisData.documentType}
                title={file?.name || 'Unknown'} 
                isDemoMode={!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID} // Simple check for true demo vs testnet demo
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
