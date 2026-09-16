'use client';

import React, { useState, use } from 'react';
import { FileUpload } from '@/components/ui/FileUpload';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { RegistrationPanel } from '@/components/proof/RegistrationPanel';
import { hashFile, readFileContent, toBytes32 } from '@/lib/hashing/sha256';
import { AlertTriangle, CheckCircle2, Info, Lightbulb, Search, MessageSquareWarning, ArrowRight } from 'lucide-react';

export default function AnalyzeWorkspacePage({ params }: { params: Promise<{ agent: string }> }) {
  const unwrappedParams = use(params);
  const agentType = unwrappedParams.agent;

  const [file, setFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState<string>('');
  const [inputHash, setInputHash] = useState<string>('');
  
  const [activeTab, setActiveTab] = useState<'upload' | 'text'>('upload');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyzeText = async () => {
    if (!textInput.trim()) return;
    
    setError(null);
    setAnalysisResult(null);
    setIsAnalyzing(true);
    setFile(null); // Clear file if text was used

    try {
      // Create a pseudo-file hash for the text input
      const crypto = await import('crypto');
      const hash = crypto.createHash('sha256').update(textInput).digest('hex');
      const computedHashHex = `0x${hash}`;
      setInputHash(computedHashHex);

      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          agentType, 
          fileContent: textInput, 
          isImage: false,
          title: `Text Snippet / URL`,
          inputHash: computedHashHex
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || 'Analysis failed. Please try again.');
      }

      const data = await response.json();
      setAnalysisResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyze = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setTextInput(''); // Clear text if file was used
    setError(null);
    setAnalysisResult(null);
    setIsAnalyzing(true);
    
    try {
      // 1. Hash the file locally
      const computedHash = await hashFile(uploadedFile);
      const computedHashHex = `0x${computedHash}`;
      setInputHash(computedHashHex);

      // 2. Read content
      const { text, isImage } = await readFileContent(uploadedFile);
      
      // 3. Send to AI
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          agentType, 
          fileContent: text, 
          isImage,
          title: uploadedFile.name,
          inputHash: computedHashHex
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || 'Analysis failed. Please try again.');
      }

      const data = await response.json();
      setAnalysisResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getVerdictStatus = (verdict: string) => {
    const v = verdict.toLowerCase();
    if (v.includes('fair') || v.includes('low') || v.includes('safe') || v.includes('strong')) return 'good';
    if (v.includes('medium') || v.includes('moderate') || v.includes('caution')) return 'caution';
    if (v.includes('high') || v.includes('expensive') || v.includes('weak')) return 'risk';
    return 'default';
  };

  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex flex-col lg:flex-row">
      {/* LEFT PANE: INPUT */}
      <div className="w-full lg:w-[400px] xl:w-[450px] shrink-0 p-6 border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] lg:overflow-y-auto lg:h-[calc(100vh-64px)]">
        <h1 className="font-display text-3xl font-bold mb-2 capitalize">{agentType} Agent</h1>
        <p className="text-sm text-[var(--text-secondary)] mb-8 leading-relaxed">
          Upload evidence (screenshot, document, or code) for the AI to analyze.
        </p>

        <div className="flex bg-[var(--bg-elevated)] p-1 rounded-lg mb-6 w-fit border border-[var(--border-subtle)]">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'upload' ? 'bg-[var(--accent-analysis)]/20 text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            Upload File
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'text' ? 'bg-[var(--accent-analysis)]/20 text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            Paste Text or Link
          </button>
        </div>

        {activeTab === 'upload' && !file && (
          <FileUpload onFileSelect={handleAnalyze} isLoading={isAnalyzing} />
        )}

        {activeTab === 'text' && !file && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <textarea
              className="w-full h-40 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg p-4 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-analysis)] focus:ring-1 focus:ring-[var(--accent-analysis)] resize-none placeholder:text-[var(--text-tertiary)]"
              placeholder="Paste a link to a product, copy-paste a contract, or write down a claim you want verified..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              disabled={isAnalyzing}
            />
            <Button 
              onClick={handleAnalyzeText} 
              disabled={!textInput.trim() || isAnalyzing}
              isLoading={isAnalyzing}
            >
              Analyze Input
            </Button>
          </div>
        )}

        {(file || (textInput && analysisResult)) && (
          <div className="bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg p-4 mb-6">
            <div className="text-xs font-semibold text-[var(--text-tertiary)] mb-1 uppercase tracking-wider">Evidence Analyzed</div>
            <div className="font-medium text-sm truncate">{file ? file.name : "Text Snippet"}</div>
            
            <div className="mt-4 pt-4 border-t border-[var(--border-subtle)]">
              <div className="text-xs text-[var(--text-tertiary)] mb-1">Local Fingerprint (SHA-256)</div>
              <div className="font-mono text-[10px] text-[var(--text-secondary)] break-all">{inputHash}</div>
            </div>

            <Button variant="ghost" className="w-full mt-4 bg-[var(--bg-elevated)] text-xs py-2" onClick={() => {
              setFile(null);
              setTextInput('');
              setAnalysisResult(null);
              setError(null);
            }}>
              Start Over
            </Button>
          </div>
        )}
      </div>

      {/* RIGHT PANE: ANALYSIS */}
      <div className="flex-1 p-6 md:p-10 bg-[var(--bg-base)] lg:overflow-y-auto lg:h-[calc(100vh-64px)] relative min-w-0">
        {!isAnalyzing && !analysisResult && !error && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
            <Search className="w-16 h-16 mb-4" />
            <h3 className="text-xl font-medium">Awaiting Evidence</h3>
            <p className="text-sm">Provide input on the left to begin analysis.</p>
          </div>
        )}

        {isAnalyzing && (
          <div className="h-full flex flex-col items-center justify-center">
            <LoadingSpinner message="Extracting evidence and building analysis..." />
          </div>
        )}

        {error && (
          <div className="p-4 bg-[var(--status-risk-bg)] text-[var(--status-risk)] border border-[var(--status-risk)]/30 rounded-lg">
            {error}
          </div>
        )}

        {analysisResult && !isAnalyzing && (
          <div className="animate-fade-in-up pb-20 max-w-4xl">
            {/* Verdict Header */}
            <div className={`p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] mb-8 shadow-md`}>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                <div>
                  <div className="text-xs font-semibold text-[var(--text-tertiary)] mb-2 uppercase tracking-wider">AI Verdict</div>
                  {/* @ts-ignore - The variant string is typed, but status is dynamic */}
                  <Badge variant={getVerdictStatus(analysisResult.verdict)} className="text-xl md:text-2xl font-bold px-4 py-1.5">
                    {analysisResult.verdict}
                  </Badge>
                </div>
                <div className="sm:text-right">
                  <div className="text-xs text-[var(--text-tertiary)] mb-1 uppercase tracking-wider">Confidence</div>
                  <div className="text-xl md:text-2xl font-bold font-mono text-[var(--accent-analysis)]">{analysisResult.confidence}%</div>
                </div>
              </div>
              <p className="text-sm md:text-base font-medium leading-relaxed">{analysisResult.summary}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Positive Signals */}
              <Card className="border-[var(--status-good)]/20 bg-[var(--status-good-bg)]/30">
                <h3 className="text-sm font-semibold flex items-center gap-2 mb-4 text-[var(--status-good)]">
                  <CheckCircle2 className="w-4 h-4" /> Positive Signals
                </h3>
                <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                  {analysisResult.positiveSignals?.map((s: string, i: number) => <li key={i}>• {s}</li>)}
                  {(!analysisResult.positiveSignals || analysisResult.positiveSignals.length === 0) && <li className="italic opacity-50">None identified</li>}
                </ul>
              </Card>

              {/* Concerns */}
              <Card className="border-[var(--status-risk)]/20 bg-[var(--status-risk-bg)]/30">
                <h3 className="text-sm font-semibold flex items-center gap-2 mb-4 text-[var(--status-risk)]">
                  <AlertTriangle className="w-4 h-4" /> Concerns
                </h3>
                <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                  {analysisResult.concernSignals?.map((s: string, i: number) => <li key={i}>• {s}</li>)}
                  {(!analysisResult.concernSignals || analysisResult.concernSignals.length === 0) && <li className="italic opacity-50">None identified</li>}
                </ul>
              </Card>
            </div>

            {/* Extracted Facts */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-[var(--text-secondary)]">
                <Search className="w-4 h-4" /> Extracted Facts
              </h3>
              <div className="bg-[var(--bg-surface)] rounded-lg p-4 text-sm border border-[var(--border-subtle)] space-y-2 text-[var(--text-secondary)]">
                {analysisResult.extractedFacts?.map((f: string, i: number) => (
                  <div key={i} className="pb-2 border-b border-[var(--border-subtle)] last:border-0 last:pb-0">{f}</div>
                ))}
              </div>
            </div>

            {/* Recommendations & Missing Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-[var(--accent-analysis)]">
                  <Lightbulb className="w-4 h-4" /> Recommended Actions
                </h3>
                <ul className="space-y-2 text-sm">
                  {analysisResult.recommendations?.map((r: string, i: number) => (
                    <li key={i} className="flex gap-2 bg-[var(--bg-surface)] p-3 rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                      <ArrowRight className="w-4 h-4 shrink-0 mt-0.5 text-[var(--accent-analysis)]" /> {r}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-[var(--status-caution)]">
                  <MessageSquareWarning className="w-4 h-4" /> Questions to Ask
                </h3>
                <ul className="space-y-2 text-sm">
                  {analysisResult.questionsForUser?.map((q: string, i: number) => (
                    <li key={i} className="flex gap-2 bg-[var(--bg-surface)] p-3 rounded-lg text-[var(--text-secondary)] border-l-2 border-[var(--status-caution)]">
                      {q}
                    </li>
                  ))}
                  {analysisResult.missingInformation?.map((m: string, i: number) => (
                    <li key={`m${i}`} className="flex gap-2 bg-[var(--bg-surface)] p-3 rounded-lg text-[var(--text-secondary)] border-l-2 border-[var(--border-hover)] italic">
                      Missing: {m}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="text-xs text-[var(--text-tertiary)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-3 rounded-lg mb-8 flex gap-2 leading-relaxed">
              <Info className="w-4 h-4 shrink-0" />
              {analysisResult.disclaimer}
            </div>

            {/* Registration Panel */}
            <div className="pt-8 border-t border-[var(--border-subtle)]">
              <RegistrationPanel 
                contentHash={inputHash}
                analysisHash={analysisResult._analysisHash || '0x0000000000000000000000000000000000000000000000000000000000000000'}
                agentType={agentType}
                title={file?.name || 'Untitled Analysis'}
                isDemoMode={!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID}
              />
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
