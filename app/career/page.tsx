'use client';

import React, { useState, useRef } from 'react';
import { NaturalLanguageInput } from '@/components/cv/NaturalLanguageInput';
import { CVPreview } from '@/components/cv/CVPreview';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Printer, Download, RefreshCcw, Briefcase, FileSignature, Info } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import Link from 'next/link';

export default function CareerStudio() {
  const [cvData, setCvData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  const cvRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async (input: string) => {
    setIsGenerating(true);
    setError(null);
    setCvData(null);
    
    try {
      const response = await fetch('/api/ai/generate-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput: input })
      });

      if (!response.ok) {
        throw new Error('Failed to generate CV');
      }

      const data = await response.json();
      
      // Check if it's the static demo data
      if (data.name === 'Alex Johnson' && data.summary?.includes('Passionate frontend developer')) {
        setIsDemoMode(true);
      } else {
        setIsDemoMode(false);
      }

      setCvData(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while generating the CV');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="section w-full py-12">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-[#A855F7]" /> AI Career Studio
            </h1>
            <p className="text-[var(--text-secondary)] text-lg max-w-2xl">
              Transform your raw experience into a polished, professional CV in seconds. 
              Our AI structures, formats, and enhances your profile automatically.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link href="/career/templates">
              <Button variant="outline" className="h-10 border-[#A855F7]/30 text-[#A855F7]">Browse Templates</Button>
            </Link>
            <Link href="/dashboard/templates/new">
              <Button className="h-10 bg-[#A855F7] hover:bg-[#9333EA] text-white border-none shadow-glow">Upload Template</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input */}
        <div className="lg:col-span-5 flex flex-col gap-6 no-print">
          <NaturalLanguageInput onSubmit={handleGenerate} isLoading={isGenerating} />
          
          {error && (
            <div className="p-4 bg-[var(--status-risk-bg)] text-[var(--status-risk)] rounded-lg border border-[var(--status-risk)]/20 text-sm">
              {error}
            </div>
          )}

          {isDemoMode && cvData && (
            <div className="flex items-start gap-3 p-4 bg-[var(--status-info-bg)] border border-[var(--status-info)]/20 rounded-lg text-sm text-[var(--status-info)]">
              <Info className="w-5 h-5 shrink-0 mt-0.5" />
              <p>
                <strong>Preview Mode:</strong> The Gemini API key is not configured, so a sample CV is being displayed. 
                In production, this would be generated from your input.
              </p>
            </div>
          )}

          {cvData && (
            <Card className="flex flex-col gap-4 border-[var(--border-subtle)]">
              <h3 className="font-semibold text-lg border-b border-[var(--border-subtle)] pb-3">Actions</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handlePrint} className="flex-1">
                  <Printer className="w-4 h-4 mr-2" /> Print / PDF
                </Button>
                <Button variant="secondary" onClick={() => setCvData(null)} className="flex-1">
                  <RefreshCcw className="w-4 h-4 mr-2" /> Start Over
                </Button>
              </div>
              
              <div className="mt-4 pt-4 border-t border-[var(--border-subtle)]">
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  Satisfied with your CV? Export it as a PDF, then register a cryptographic proof of it on the blockchain to verify your authorship.
                </p>
                <Link href="/proof" className="w-full">
                  <Button variant="proof" className="w-full justify-center">
                    <FileSignature className="w-4 h-4 mr-2" /> Prove Ownership in Proof Studio
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </div>

        {/* Right Column: Preview */}
        <div className="lg:col-span-7">
          {isGenerating ? (
            <Card className="h-full min-h-[600px] flex items-center justify-center border-dashed">
              <LoadingSpinner message="Crafting your professional profile..." />
            </Card>
          ) : cvData ? (
            <div className="bg-white p-2 sm:p-4 rounded-xl shadow-lg overflow-hidden print:p-0 print:shadow-none print:bg-transparent">
              <CVPreview data={cvData} ref={cvRef} />
            </div>
          ) : (
            <Card className="h-full min-h-[600px] flex flex-col items-center justify-center border-dashed text-[var(--text-tertiary)] bg-[var(--bg-base)]">
              <FileSignature className="w-16 h-16 mb-4 opacity-20" />
              <p>Your generated CV will appear here</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
