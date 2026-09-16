import React from 'react';
import Link from 'next/link';
import { Hexagon } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] mt-auto py-12">
      <div className="max-w-[1200px] mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded flex items-center justify-center text-white" style={{ background: 'var(--gradient-analysis)' }}>
            <Hexagon className="w-3 h-3 fill-white/20" />
          </div>
          <span className="font-display font-bold tracking-tight">
            Veris<span className="text-[var(--accent-proof)] text-sm">AI</span>
          </span>
        </div>
        
        <p className="text-sm text-[var(--text-tertiary)]">
          Know before you trust. <br className="md:hidden" />
          <span className="hidden md:inline"> · </span> AI + Blockchain verification.
        </p>

        <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
          <Link href="/about" className="hover:text-[var(--accent-analysis)] transition-colors">
            About
          </Link>
          <a href="https://basescan.org" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent-analysis)] transition-colors">
            Base Explorer
          </a>
        </div>
      </div>
    </footer>
  );
}
