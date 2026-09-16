import React from 'react';
import { Card } from '@/components/ui/Card';
import { Hexagon, Code, Shield, FileSignature, Cpu } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="section w-full max-w-4xl py-16 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md" style={{ background: 'var(--gradient-analysis)' }}>
          <Hexagon className="w-6 h-6 fill-white/20" />
        </div>
        <h1 className="font-display text-4xl font-bold">About VerisAI</h1>
      </div>

      <div className="prose prose-invert max-w-none">
        <p className="text-xl text-[var(--text-secondary)] leading-relaxed mb-12">
          VerisAI is a next-generation platform designed to help professionals, creators, and students build verifiable digital identities. We combine the generative power of Artificial Intelligence with the cryptographic immutability of Blockchain technology.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="flex flex-col gap-4">
            <Cpu className="w-8 h-8 text-[var(--accent-analysis)]" />
            <h3 className="text-xl font-semibold m-0">The Role of AI</h3>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed m-0">
              AI solves the creation and understanding problem. Our models can take informal descriptions and transform them into professional CVs. For document uploads, AI acts as an expert analyst, extracting structured metadata, summarizing content, and identifying the document type instantly.
            </p>
          </Card>

          <Card className="flex flex-col gap-4">
            <Shield className="w-8 h-8 text-[var(--accent-proof)]" />
            <h3 className="text-xl font-semibold m-0">The Role of Blockchain</h3>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed m-0">
              Blockchain solves the ownership and timestamping problem. By anchoring a cryptographic hash (SHA-256) of your file to a public ledger (Base Sepolia), you create an immutable record proving that <em>this exact file</em> was registered by <em>your wallet</em> at a <em>specific time</em>.
            </p>
          </Card>
        </div>

        <h2 className="text-2xl font-display font-bold mt-12 mb-6 border-b border-[var(--border-subtle)] pb-4">Privacy & Security Architecture</h2>
        <ul className="space-y-4 text-[var(--text-secondary)] mb-12 list-none pl-0">
          <li className="flex gap-3 bg-[var(--bg-surface)] p-4 rounded-lg border border-[var(--border-subtle)]">
            <Code className="w-6 h-6 text-[var(--accent-analysis)] shrink-0" />
            <div>
              <strong className="text-[var(--text-primary)] block mb-1">Client-Side Hashing</strong>
              Your files are hashed (SHA-256) directly in your browser. The cryptographic fingerprint is generated locally, ensuring the integrity check doesn't rely on our servers.
            </div>
          </li>
          <li className="flex gap-3 bg-[var(--bg-surface)] p-4 rounded-lg border border-[var(--border-subtle)]">
            <FileSignature className="w-6 h-6 text-[var(--accent-analysis)] shrink-0" />
            <div>
              <strong className="text-[var(--text-primary)] block mb-1">Zero On-Chain Files</strong>
              We <strong>never</strong> store your actual documents on the blockchain. We only store the 64-character hash. This ensures your private CVs, contracts, and proposals remain entirely confidential while still being verifiable.
            </div>
          </li>
        </ul>

        <h2 className="text-2xl font-display font-bold mb-6 border-b border-[var(--border-subtle)] pb-4">Technology Stack</h2>
        <div className="flex flex-wrap gap-3 mb-12">
          {['Next.js 15 App Router', 'TypeScript', 'Tailwind CSS', 'Google Gemini AI', 'Wagmi + Viem', 'Solidity', 'Base Sepolia Testnet'].map(tech => (
            <span key={tech} className="px-4 py-2 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg text-sm font-medium">
              {tech}
            </span>
          ))}
        </div>
      </div>
      
      <div className="mt-12 text-center pt-8 border-t border-[var(--border-subtle)]">
        <p className="text-[var(--text-tertiary)] text-sm">
          Built as a demonstration of AI and Web3 integration. <br />
          MVP running on Base Sepolia testnet.
        </p>
      </div>
    </div>
  );
}
