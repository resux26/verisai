import React from 'react';
import Link from 'next/link';
import { AGENT_IDS, AGENT_CONFIGS } from '@/lib/agents/config';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] mt-auto">
      <div className="max-w-[1200px] mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <img src="/logo.png" alt="Crexto AI Logo" className="h-9 w-auto object-contain drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
            </Link>
            <p className="text-sm text-[var(--text-tertiary)] leading-relaxed mb-4">
              Know before you trust.
              <br />
              AI intelligence + blockchain verification.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5">
              <li><Link href="/agents" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">AI Agents</Link></li>
              <li><Link href="/how-it-works" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">How It Works</Link></li>
              <li><Link href="/explore" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Explore Proofs</Link></li>
              <li><Link href="/verify" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Verify a Proof</Link></li>
              <li><Link href="/career" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Career Studio</Link></li>
            </ul>
          </div>

          {/* Agents */}
          <div>
            <h4 className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-4">Agents</h4>
            <ul className="space-y-2.5">
              {AGENT_IDS.map(id => (
                <li key={id}>
                  <Link href={`/analyze/${id}`} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                    {AGENT_CONFIGS[id].name.replace(' Agent', '')}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5">
              <li><Link href="/about" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">About</Link></li>
              <li>
                <a href="https://sepolia.basescan.org" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                  Base Explorer ↗
                </a>
              </li>
              <li><Link href="/login" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Sign In</Link></li>
              <li><Link href="/register" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Create Account</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[var(--border-subtle)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[var(--text-tertiary)]">
            © {currentYear} Crexto AI. All rights reserved. Running on Base Sepolia testnet.
          </p>
          <div className="flex items-center gap-4 text-xs text-[var(--text-tertiary)]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-good)] animate-pulse" />
              Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
