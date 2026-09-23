import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AGENT_CONFIGS, AGENT_IDS } from '@/lib/agents/config';
import {
  Upload, Brain, BarChart3, Lightbulb, Scale, Shield, CheckCircle,
  ArrowRight, ArrowDown, ShieldCheck, TrendingUp, Eye, FileSearch, Briefcase, Blocks,
  FileText, Hash, Wallet, ExternalLink
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How It Works | Crexto AI',
  description: 'From raw evidence to verifiable proof — a 7-step AI intelligence workflow that helps you understand, decide, and optionally prove.',
};

const ICON_MAP: Record<string, React.ReactNode> = {
  ShieldCheck: <ShieldCheck className="w-5 h-5" />,
  TrendingUp: <TrendingUp className="w-5 h-5" />,
  Eye: <Eye className="w-5 h-5" />,
  FileSearch: <FileSearch className="w-5 h-5" />,
  Briefcase: <Briefcase className="w-5 h-5" />,
  Blocks: <Blocks className="w-5 h-5" />,
};

const WORKFLOW_STEPS = [
  {
    number: '01',
    title: 'Bring Your Evidence',
    subtitle: 'INPUT',
    description: 'Upload a screenshot, paste a product listing, share a contract, or describe a situation. Our agents accept images, PDFs, text, URLs, and raw data.',
    icon: <Upload className="w-7 h-7" />,
    accent: '#3B82F6',
    details: [
      'Screenshots of product listings or websites',
      'PDF contracts, invoices, and legal documents',
      'Blockchain transaction hashes or wallet data',
      'Copy-pasted text from emails or messages',
      'URLs to online stores or project pages',
    ],
  },
  {
    number: '02',
    title: 'Choose a Specialized Agent',
    subtitle: 'SELECT',
    description: 'Each of our six agents is trained for a specific domain. The agent you choose determines the analysis framework, the questions asked, and the structure of your report.',
    icon: <Brain className="w-7 h-7" />,
    accent: '#8B5CF6',
    details: [],
    showAgents: true,
  },
  {
    number: '03',
    title: 'AI Extracts & Analyzes',
    subtitle: 'PROCESS',
    description: 'Your chosen agent extracts objective facts from the evidence, identifies positive and negative signals, detects patterns, and builds a structured assessment — not a generic summary.',
    icon: <BarChart3 className="w-7 h-7" />,
    accent: '#EC4899',
    details: [
      'Extracts every verifiable fact from the input',
      'Identifies positive signals and red flags',
      'Detects pressure tactics, inconsistencies, or gaps',
      'Applies domain-specific evaluation frameworks',
    ],
  },
  {
    number: '04',
    title: 'Understand the Assessment',
    subtitle: 'REPORT',
    description: 'Receive a structured intelligence report with a clear verdict, confidence score, evidence breakdown, recommended actions, and questions you should be asking.',
    icon: <Lightbulb className="w-7 h-7" />,
    accent: '#F59E0B',
    details: [
      'Clear verdict with confidence percentage',
      'Positive signals vs. concerns side-by-side',
      'Agent-specific analysis (value factors, trust signals, contract clauses...)',
      'Actionable recommendations and missing information',
    ],
  },
  {
    number: '05',
    title: 'Make Your Decision',
    subtitle: 'DECIDE',
    description: 'Use the intelligence report to make an informed decision. The AI gives you the evidence and assessment — you decide what to do with it.',
    icon: <Scale className="w-7 h-7" />,
    accent: '#06B6D4',
    details: [
      'Crexto does not make decisions for you',
      'Reports include explicit disclaimers',
      'AI confidence reflects evidence quality, not certainty',
      'Always verify critical decisions independently',
    ],
  },
  {
    number: '06',
    title: 'Create On-Chain Proof',
    subtitle: 'PROVE',
    description: 'Optionally, anchor a cryptographic fingerprint of your analysis on the Base blockchain. This creates an immutable, timestamped record — without exposing your documents.',
    icon: <Shield className="w-7 h-7" />,
    accent: '#10B981',
    details: [
      'SHA-256 hash computed locally in your browser',
      'Only the fingerprint is stored on-chain — never the document',
      'Proves exact content existed at a specific time',
      'Connected to your wallet address for ownership',
    ],
  },
  {
    number: '07',
    title: 'Verify Anytime',
    subtitle: 'VERIFY',
    description: 'Anyone with the original file can re-hash it and compare against the blockchain record. If the hashes match, the file is proven to be identical to what was registered.',
    icon: <CheckCircle className="w-7 h-7" />,
    accent: '#22D3EE',
    details: [
      'Public verification — no account needed',
      'Hash comparison happens in the browser',
      'Permanent record on the blockchain',
      'Shareable proof links for any registered analysis',
    ],
  },
];

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="section py-12 md:py-20 text-center animate-fade-in-up">
        <Badge variant="accent" className="mb-6 text-xs px-4 py-1.5">
          Intelligence Workflow
        </Badge>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">How Crexto Works</h1>
        <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
          From raw evidence to verifiable proof — a 7-step AI intelligence workflow
          that helps you understand, decide, and optionally prove.
        </p>
      </section>

      {/* Workflow Steps */}
      <section className="section pb-16 md:pb-24">
        <div className="max-w-3xl mx-auto">
          {WORKFLOW_STEPS.map((step, index) => (
            <div key={step.number} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
              {/* Step Card */}
              <div className="relative pl-16 md:pl-20 pb-12">
                {/* Timeline line */}
                {index < WORKFLOW_STEPS.length - 1 && (
                  <div className="absolute left-[27px] md:left-[35px] top-16 bottom-0 w-px bg-[var(--border-subtle)]" />
                )}

                {/* Step number circle */}
                <div 
                  className="absolute left-0 md:left-2 top-0 w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${step.accent}, ${step.accent}cc)` }}
                >
                  {step.icon}
                </div>

                {/* Content */}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded" style={{ color: step.accent, background: `${step.accent}15` }}>
                      {step.subtitle}
                    </span>
                    <span className="text-xs text-[var(--text-tertiary)] font-mono">Step {step.number}</span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-3">{step.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">{step.description}</p>

                  {/* Details */}
                  {step.details.length > 0 && (
                    <div className="bg-[var(--bg-surface)] rounded-lg border border-[var(--border-subtle)] p-4">
                      <ul className="space-y-2">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex gap-2 text-sm text-[var(--text-secondary)]">
                            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: step.accent }} />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Agent Grid (for step 02) */}
                  {step.showAgents && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                      {AGENT_IDS.map((agentId) => {
                        const config = AGENT_CONFIGS[agentId];
                        return (
                          <Link
                            key={agentId}
                            href={`/analyze/${agentId}`}
                            className="flex items-center gap-2.5 p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-elevated)] transition-all text-sm group"
                          >
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 transition-transform group-hover:scale-110"
                              style={{ background: config.gradient }}
                            >
                              {ICON_MAP[config.icon]}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-xs text-[var(--text-primary)] truncate">{config.name.replace(' Agent', '')}</div>
                              <div className="text-[10px] text-[var(--text-tertiary)] truncate">{config.tagline}</div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy Architecture */}
      <section className="section py-16 md:py-20 bg-[var(--bg-surface)] border-t border-b border-[var(--border-subtle)]">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold mb-4">Privacy by Design</h2>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
            Your documents never leave your control. Here&apos;s how the system protects your data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            {
              icon: <Hash className="w-6 h-6 text-[var(--accent-analysis)]" />,
              title: 'Client-Side Hashing',
              desc: 'SHA-256 fingerprints are generated in your browser. The hash never depends on our servers.',
            },
            {
              icon: <FileText className="w-6 h-6 text-[var(--accent-analysis)]" />,
              title: 'Zero On-Chain Files',
              desc: 'Only the 64-character hash is stored on the blockchain. Your actual documents are never uploaded to the chain.',
            },
            {
              icon: <Wallet className="w-6 h-6 text-[var(--accent-proof)]" />,
              title: 'Your Keys, Your Proofs',
              desc: 'Proofs are tied to your wallet address. Only you can register proofs from your wallet.',
            },
          ].map((item, i) => (
            <Card key={i} className="text-center border-[var(--border-subtle)]">
              <div className="w-12 h-12 rounded-xl bg-[var(--bg-elevated)] flex items-center justify-center mx-auto mb-4">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section py-16 md:py-20 text-center">
        <h2 className="font-display text-3xl font-bold mb-4">Ready to start?</h2>
        <p className="text-[var(--text-secondary)] text-lg mb-8 max-w-lg mx-auto">
          Choose a specialized agent and submit your evidence. No account required for AI analysis.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/agents">
            <Button size="lg" className="font-bold px-8">
              Choose an Agent <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="/verify">
            <Button size="lg" variant="secondary" className="px-8">
              Verify a Proof
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
