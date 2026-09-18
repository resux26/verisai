import React from 'react';
import Link from 'next/link';
import { Hexagon } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] mt-auto py-12">
      <div className="max-w-[1200px] mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="Crexto AI Logo" className="h-6 w-auto object-contain" />
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
