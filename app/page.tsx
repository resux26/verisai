import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, CheckCircle2, TrendingUp, Search, Zap, Eye, FileText, Lock } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="section py-16 md:py-24 flex flex-col items-center text-center relative overflow-hidden">
        
        <div className="absolute top-0 w-full h-[500px] bg-gradient-radial from-[var(--accent-analysis-dim)]/30 to-transparent -z-10" />

        <div className="animate-fade-in-up w-full">
          <h1 className="font-display font-extrabold mb-6 tracking-tight leading-tight" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
            Know before you{' '}
            <span className="gradient-text">trust.</span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto mb-10 leading-relaxed">
            AI analyzes products, documents, offers, digital work and Web3 activity — then gives you clear evidence, risks and next steps.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/agents">
              <Button size="lg" className="w-full sm:w-auto font-bold text-lg px-8">
                Start an AI Analysis
              </Button>
            </Link>
            <Link href="/explore">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto font-bold text-lg px-8">
                Explore Proofs
              </Button>
            </Link>
          </div>
        </div>

        {/* MOCKUP ANALYSIS CARD */}
        <div className="w-full max-w-4xl mx-auto mt-16 md:mt-20 animate-fade-in-up stagger-1">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 text-left">
            {/* Left side: Upload */}
            <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 md:p-8 flex flex-col justify-center" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
              <div className="text-xs font-semibold text-[var(--text-tertiary)] mb-6">What are you checking?</div>
              
              <div className="w-full h-28 md:h-32 border-2 border-dashed border-[var(--border-hover)] rounded-xl flex items-center justify-center bg-[var(--bg-base)] mb-6 cursor-not-allowed opacity-70">
                <div className="text-center text-[var(--text-secondary)]">
                  <Search className="w-7 h-7 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Upload / paste / describe</p>
                </div>
              </div>

              <div className="p-4 bg-[var(--bg-base)] rounded-lg border border-[var(--border-subtle)] mb-6 hover:border-[var(--border-hover)] transition-colors">
                <div className="text-xs text-[var(--text-tertiary)] mb-1">Example prompt:</div>
                <div className="text-sm font-medium">"Is this used laptop worth $650?"</div>
              </div>

              <Button className="w-full" disabled>Analyze with AI</Button>
            </Card>

            {/* Right side: Result */}
            <Card className="border-[var(--status-good)]/20 bg-[var(--status-good-bg)]/30 p-6 md:p-8 flex flex-col" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 0 40px rgba(34,197,94,0.06)' }}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-xs font-semibold text-[var(--text-tertiary)] mb-2">Value Assessment</div>
                  <Badge variant="good" className="text-sm px-3 py-1">Fair Value</Badge>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[var(--text-tertiary)] mb-1">Confidence</div>
                  <div className="text-xl font-bold font-mono text-[var(--accent-analysis)]">82%</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-xs text-[var(--text-tertiary)] mb-1">Estimated range:</div>
                <div className="font-mono font-bold">$580–$700</div>
              </div>

              <div className="space-y-2.5 text-sm mb-6 flex-1">
                <div className="flex gap-2 text-[var(--status-good)]"><CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> Strong specifications</div>
                <div className="flex gap-2 text-[var(--status-caution)]"><TrendingUp className="w-4 h-4 shrink-0 mt-0.5" /> Battery health unknown</div>
                <div className="flex gap-2 text-[var(--status-caution)]"><TrendingUp className="w-4 h-4 shrink-0 mt-0.5" /> Warranty unclear</div>
              </div>

              <div className="border-t border-[var(--border-subtle)] pt-6">
                <Button className="w-full" variant="proof" disabled>Create On-Chain Proof</Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* WHY VERISAI */}
      <section className="section py-16 md:py-20 bg-[var(--bg-surface)] border-t border-b border-[var(--border-subtle)]">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-display text-3xl font-bold">Why VerisAI</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-[var(--accent-analysis-dim)] flex items-center justify-center mx-auto mb-4">
              <Eye className="w-6 h-6 text-[var(--accent-analysis)]" />
            </div>
            <h3 className="text-lg font-bold mb-2">AI Understands</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">Extracts the facts from messy screenshots and complicated documents.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-[var(--accent-analysis-dim)] flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-[var(--accent-analysis)]" />
            </div>
            <h3 className="text-lg font-bold mb-2">AI Analyzes</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">Assesses value, authenticity, and trust factors instantly.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-[var(--accent-analysis-dim)] flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-[var(--accent-analysis)]" />
            </div>
            <h3 className="text-lg font-bold mb-2">AI Explains</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">Provides clear reasons, identifies missing info, and suggests questions.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-[var(--accent-proof-dim)] flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-[var(--accent-proof)]" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-[var(--accent-proof)]">Blockchain Proves</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">Registers immutable fingerprints on Base Sepolia for public verification.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
