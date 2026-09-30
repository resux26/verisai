import React from 'react';
import { Card } from '@/components/ui/Card';
import { FileText, Download, BookOpen, Presentation, ExternalLink, Shield, Sparkles } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Docs | Crexto AI — Pitch Deck & White Paper',
  description: 'Download the official Crexto AI pitch deck and white paper. Learn about our vision, technology, tokenomics, and roadmap.',
};

const documents = [
  {
    id: 'pitch-deck',
    title: 'Pitch Deck',
    description: 'A comprehensive overview of the Crexto AI platform — our vision, market opportunity, product architecture, business model, and growth strategy. Perfect for investors and partners.',
    icon: Presentation,
    accentColor: 'var(--accent-analysis)',
    accentDim: 'var(--accent-analysis-dim)',
    gradient: 'var(--gradient-analysis)',
    shadowGlow: 'var(--shadow-glow)',
    fileName: 'Crexto_AI_Pitch_Deck.pdf',
    filePath: '/docs/Crexto_AI_Pitch_Deck.pdf',
    tags: ['Investors', 'Partners', 'Overview'],
  },
  {
    id: 'white-paper',
    title: 'White Paper',
    description: 'A deep technical dive into the Crexto AI protocol — covering our AI verification engine, cryptographic proof system, on-chain architecture, tokenomics, and governance model.',
    icon: BookOpen,
    accentColor: 'var(--accent-proof)',
    accentDim: 'var(--accent-proof-dim)',
    gradient: 'linear-gradient(180deg, #EAB308 0%, #CA8A04 100%)',
    shadowGlow: 'var(--shadow-glow-proof)',
    fileName: 'Crexto_AI_White_Paper.pdf',
    filePath: '/docs/Crexto_AI_White_Paper.pdf',
    tags: ['Technical', 'Protocol', 'Tokenomics'],
  },
];

export default function DocsPage() {
  return (
    <div className="section w-full max-w-4xl py-16 animate-fade-in-up">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md"
          style={{ background: 'var(--gradient-analysis)' }}
        >
          <FileText className="w-6 h-6" />
        </div>
        <h1 className="font-display text-4xl font-bold">Docs</h1>
      </div>
      <p className="text-lg text-[var(--text-secondary)] leading-relaxed mb-12 max-w-2xl">
        Download our official documents to learn everything about Crexto AI — from the high-level vision to the deep technical architecture.
      </p>

      {/* Documents Grid */}
      <div className="grid gap-8">
        {documents.map((doc) => {
          const Icon = doc.icon;
          return (
            <Card
              key={doc.id}
              className="relative overflow-hidden group transition-all duration-300 hover:border-[var(--border-hover)]"
              style={{ boxShadow: 'var(--shadow-md)' }}
            >
              {/* Subtle glow accent on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at 10% 50%, ${doc.accentDim} 0%, transparent 60%)`,
                }}
              />

              <div className="relative z-10 flex flex-col md:flex-row gap-6 p-2">
                {/* Icon block */}
                <div
                  className="w-16 h-16 shrink-0 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110"
                  style={{ background: doc.gradient }}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-display font-bold mb-2" style={{ color: doc.accentColor }}>
                    {doc.title}
                  </h2>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-4">
                    {doc.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {doc.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs font-medium rounded-full border"
                        style={{
                          color: doc.accentColor,
                          borderColor: doc.accentDim,
                          backgroundColor: doc.accentDim,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Download Button */}
                  <a
                    href={doc.filePath}
                    download={doc.fileName}
                    id={`download-${doc.id}`}
                    className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 hover:shadow-lg active:scale-[0.97]"
                    style={{ background: doc.gradient }}
                  >
                    <Download className="w-4 h-4" />
                    Download {doc.title}
                  </a>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Info section */}
      <div className="mt-16 grid md:grid-cols-2 gap-6">
        <div className="flex gap-3 p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <Shield className="w-6 h-6 text-[var(--accent-analysis)] shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">Open & Transparent</h3>
            <p className="text-xs text-[var(--text-tertiary)] leading-relaxed">
              All documents are freely available. We believe in building trust through transparency — no gated downloads, no email walls.
            </p>
          </div>
        </div>
        <div className="flex gap-3 p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <Sparkles className="w-6 h-6 text-[var(--accent-proof)] shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">Living Documents</h3>
            <p className="text-xs text-[var(--text-tertiary)] leading-relaxed">
              These documents are updated as the project evolves. Check back for the latest versions as we ship new features and reach new milestones.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-12 text-center pt-8 border-t border-[var(--border-subtle)]">
        <p className="text-[var(--text-tertiary)] text-sm">
          Have questions after reading?{' '}
          <a href="mailto:contact@crexto.ai" className="text-[var(--accent-analysis)] hover:underline">
            Reach out to us
          </a>
          {' '}or explore the{' '}
          <a href="/how-it-works" className="text-[var(--accent-analysis)] hover:underline">
            How It Works
          </a>
          {' '}page for a quick overview.
        </p>
      </div>
    </div>
  );
}
