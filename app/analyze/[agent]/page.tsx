'use client';

import React, { useState, use } from 'react';
import { FileUpload } from '@/components/ui/FileUpload';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { RegistrationPanel } from '@/components/proof/RegistrationPanel';
import { AgentReport } from '@/components/agents/AgentReport';
import { hashFile, readFileContent } from '@/lib/hashing/sha256';
import { AGENT_CONFIGS, isValidAgentId, type AgentId } from '@/lib/agents/config';
import { Search, ShieldCheck, TrendingUp, Eye, FileSearch, Briefcase, Blocks, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const AGENT_ICONS: Record<string, React.ReactNode> = {
  ShieldCheck: <ShieldCheck className="w-5 h-5" />,
  TrendingUp: <TrendingUp className="w-5 h-5" />,
  Eye: <Eye className="w-5 h-5" />,
  FileSearch: <FileSearch className="w-5 h-5" />,
  Briefcase: <Briefcase className="w-5 h-5" />,
  Blocks: <Blocks className="w-5 h-5" />,
};

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

  // Validate agent type
  if (!isValidAgentId(agentType)) {
    return (
      <div className="w-full min-h-[calc(100vh-64px)] flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-3xl font-bold mb-4">Agent Not Found</h1>
        <p className="text-[var(--text-secondary)] mb-6">
          There is no agent called &quot;{agentType}&quot;.
        </p>
        <Link href="/agents">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" /> View All Agents
          </Button>
        </Link>
      </div>
    );
  }

  const config = AGENT_CONFIGS[agentType as AgentId];
  const agentId = agentType as AgentId;

  const handleAnalyzeText = async () => {
    if (!textInput.trim()) return;
    
    setError(null);
    setAnalysisResult(null);
    setIsAnalyzing(true);
    setFile(null);

    try {
      // Create a hash for the text input
      const encoder = new TextEncoder();
      const data = encoder.encode(textInput);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      const computedHashHex = `0x${hash}`;
      setInputHash(computedHashHex);

      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          agentType: agentId, 
          fileContent: textInput, 
          isImage: false,
          title: `Text Analysis`,
          inputHash: computedHashHex
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || 'Analysis failed. Please try again.');
      }

      const result = await response.json();
      setAnalysisResult(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyze = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setTextInput('');
    setError(null);
    setAnalysisResult(null);
    setIsAnalyzing(true);
    
    try {
      const computedHash = await hashFile(uploadedFile);
      const computedHashHex = `0x${computedHash}`;
      setInputHash(computedHashHex);

      const { text, isImage } = await readFileContent(uploadedFile);
      
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          agentType: agentId, 
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

      const result = await response.json();
      setAnalysisResult(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setTextInput('');
    setAnalysisResult(null);
    setError(null);
    setInputHash('');
  };

  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex flex-col lg:flex-row">
      {/* LEFT PANE: INPUT */}
      <div className="w-full lg:w-[400px] xl:w-[450px] shrink-0 p-6 border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] lg:overflow-y-auto lg:h-[calc(100vh-64px)]">
        {/* Agent Header */}
        <Link href="/agents" className="inline-flex items-center gap-1.5 text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] mb-4 transition-colors">
          <ArrowLeft className="w-3 h-3" /> All Agents
        </Link>
        
        <div className="flex items-center gap-3 mb-2">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
            style={{ background: config.gradient }}
          >
            {AGENT_ICONS[config.icon]}
          </div>
          <div>
            <h1 className="font-display text-xl font-bold">{config.name}</h1>
            <p className="text-xs text-[var(--text-tertiary)] italic">&quot;{config.question}&quot;</p>
          </div>
        </div>
        
        <p className="text-sm text-[var(--text-secondary)] mb-6 leading-relaxed">
          {config.description}
        </p>

        {/* Input Tabs */}
        <div className="flex bg-[var(--bg-elevated)] p-1 rounded-lg mb-6 w-fit border border-[var(--border-subtle)]">
          {config.inputTypes.includes('file') && (
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'upload' ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
              Upload File
            </button>
          )}
          {(config.inputTypes.includes('text') || config.inputTypes.includes('url')) && (
            <button
              onClick={() => setActiveTab('text')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'text' ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
              {config.inputTypes.includes('url') ? 'Paste Text or Link' : 'Paste Text'}
            </button>
          )}
        </div>

        {/* Upload Tab */}
        {activeTab === 'upload' && !file && !analysisResult && (
          <div className="animate-fade-in">
            <FileUpload onFileSelect={handleAnalyze} isLoading={isAnalyzing} />
            <p className="text-xs text-[var(--text-tertiary)] mt-3 text-center">
              {config.uploadLabel}
            </p>
          </div>
        )}

        {/* Text Tab */}
        {activeTab === 'text' && !file && !analysisResult && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <textarea
              className="w-full h-44 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg p-4 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-1 resize-none placeholder:text-[var(--text-tertiary)]"
              style={{ borderColor: isAnalyzing ? config.accentHex : undefined }}
              placeholder={config.textPlaceholder}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              disabled={isAnalyzing}
            />
            <Button 
              onClick={handleAnalyzeText} 
              disabled={!textInput.trim() || isAnalyzing}
              isLoading={isAnalyzing}
            >
              Analyze with {config.name.replace(' Agent', '')}
            </Button>
          </div>
        )}

        {/* Examples */}
        {!file && !analysisResult && !isAnalyzing && (
          <div className="mt-6 pt-6 border-t border-[var(--border-subtle)]">
            <div className="text-xs font-semibold text-[var(--text-tertiary)] mb-3 uppercase tracking-wider">Try analyzing</div>
            <div className="space-y-2">
              {config.examples.map((ex, i) => (
                <div key={i} className="text-xs text-[var(--text-secondary)] bg-[var(--bg-base)] p-2.5 rounded-lg border border-[var(--border-subtle)]">
                  • {ex}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Evidence Summary (after analysis) */}
        {(file || (textInput && analysisResult)) && (
          <div className="bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg p-4 mb-6 animate-fade-in">
            <div className="text-xs font-semibold text-[var(--text-tertiary)] mb-1 uppercase tracking-wider">Evidence Analyzed</div>
            <div className="font-medium text-sm truncate">{file ? file.name : "Text Input"}</div>
            
            {inputHash && (
              <div className="mt-4 pt-4 border-t border-[var(--border-subtle)]">
                <div className="text-xs text-[var(--text-tertiary)] mb-1">Local Fingerprint (SHA-256)</div>
                <div className="font-mono text-[10px] text-[var(--text-secondary)] break-all">{inputHash}</div>
              </div>
            )}

            <Button variant="ghost" className="w-full mt-4 bg-[var(--bg-elevated)] text-xs py-2" onClick={handleReset}>
              Start Over
            </Button>
          </div>
        )}
      </div>

      {/* RIGHT PANE: ANALYSIS RESULT */}
      <div className="flex-1 p-6 md:p-10 bg-[var(--bg-base)] lg:overflow-y-auto lg:h-[calc(100vh-64px)] relative min-w-0">
        {/* Empty State */}
        {!isAnalyzing && !analysisResult && !error && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
            <Search className="w-16 h-16 mb-4" />
            <h3 className="text-xl font-medium">Awaiting Evidence</h3>
            <p className="text-sm">Provide input on the left to begin {config.name.replace(' Agent', '').toLowerCase()} analysis.</p>
          </div>
        )}

        {/* Loading State */}
        {isAnalyzing && (
          <div className="h-full flex flex-col items-center justify-center">
            <LoadingSpinner message={`${config.name} is analyzing your evidence...`} />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 bg-[var(--status-risk-bg)] text-[var(--status-risk)] border border-[var(--status-risk)]/30 rounded-lg">
            {error}
          </div>
        )}

        {/* Result — Agent-Specific Report */}
        {analysisResult && !isAnalyzing && (
          <>
            <AgentReport agentType={agentId} result={analysisResult} />

            {/* Registration Panel */}
            <div className="pt-8 border-t border-[var(--border-subtle)] max-w-4xl">
              <RegistrationPanel 
                contentHash={inputHash}
                analysisHash={analysisResult._analysisHash || '0x0000000000000000000000000000000000000000000000000000000000000000'}
                agentType={agentId}
                title={file?.name || 'Text Analysis'}
                isDemoMode={!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
