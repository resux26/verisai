import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Coins, Zap, Shield, BarChart3, Users, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

import { getTokenConfig } from '@/lib/token/service';

export const metadata: Metadata = {
  title: 'CREXTO Token | Utility Ecosystem',
  description: 'The demo utility token that powers the Crexto verification network leaderboard.',
};

export default async function TokenPage() {
  const tokenConfig = await getTokenConfig() || {
    token_name: 'Crexto',
    token_symbol: 'CRX',
    status: 'Demo',
    total_supply: 1000000000,
    circulating_supply: 250000000,
    is_demo: true,
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="section py-16 md:py-24 text-center animate-fade-in-up">
        <Badge variant="accent" className="mb-6 text-xs px-4 py-1.5">
          {tokenConfig.is_demo ? 'Token Economy' : 'Token Ecosystem'}
        </Badge>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
          {tokenConfig.token_name} ({tokenConfig.token_symbol})
        </h1>
        <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-8">
          The simulated utility token that powers the Crexto verification network leaderboard and community rewards.
        </p>
        <div className="flex justify-center gap-4">
          <Badge variant="outline" className="text-sm px-4 py-2 border-purple-500/30 text-purple-400 bg-purple-500/10">
            Status: {tokenConfig.status}
          </Badge>
        </div>
      </section>

      {/* Token Utility */}
      <section className="section py-16 md:py-20 bg-[var(--bg-surface)] border-t border-b border-[var(--border-subtle)]">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="font-display text-3xl font-bold mb-4">Token Utility</h2>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
            {tokenConfig.token_symbol} is designed as a utility token with real functionality within the platform.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up stagger-1">
          {[
            {
              icon: <Zap className="w-6 h-6 text-[#F59E0B]" />,
              title: 'Premium Analyses',
              desc: 'Access deeper AI analysis with extended evidence processing, multi-agent comparisons, and priority queue.',
            },
            {
              icon: <Shield className="w-6 h-6 text-[var(--accent-proof)]" />,
              title: 'Proof Registration',
              desc: 'Use tokens to register on-chain proofs with reduced gas fees through sponsored transactions.',
            },
            {
              icon: <BarChart3 className="w-6 h-6 text-[var(--accent-analysis)]" />,
              title: 'Reputation Boost',
              desc: 'Stake tokens to boost your reputation score and unlock advanced community features.',
            },
            {
              icon: <Users className="w-6 h-6 text-[#EC4899]" />,
              title: 'Governance',
              desc: 'Vote on platform decisions — new agent types, feature priorities, and community policies.',
            },
            {
              icon: <Coins className="w-6 h-6 text-[#F59E0B]" />,
              title: 'Contributor Rewards',
              desc: 'Earn tokens by contributing quality analyses, verifying proofs, and helping build the intelligence network.',
            },
            {
              icon: <Lock className="w-6 h-6 text-[#8B5CF6]" />,
              title: 'API Access',
              desc: 'Use tokens to access the Crexto API for programmatic verification and batch analysis.',
            },
          ].map((item, i) => (
            <Card key={i} className="border-[var(--border-subtle)] hover:border-[var(--border-hover)] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[var(--bg-elevated)] flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Status */}
      <section className="section py-16 md:py-20 text-center">
        <div className="max-w-lg mx-auto animate-fade-in-up">
          <div className="w-16 h-16 rounded-2xl bg-[var(--bg-elevated)] flex items-center justify-center mx-auto mb-6 border border-purple-500/20">
            <Coins className="w-8 h-8 text-purple-500" />
          </div>
          <h2 className="font-display text-2xl font-bold mb-4">Economy Notice</h2>
          <p className="text-[var(--text-secondary)] mb-6">
            Tokens displayed on leaderboards and profiles are test tokens.
          </p>
          <div className="grid grid-cols-2 gap-4 text-left bg-[var(--bg-elevated)] p-4 rounded-xl border border-[var(--border-subtle)] mb-8">
            <div>
              <div className="text-xs text-[var(--text-tertiary)] uppercase font-bold tracking-wider mb-1">Total Supply</div>
              <div className="font-mono">{tokenConfig.total_supply.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--text-tertiary)] uppercase font-bold tracking-wider mb-1">Circulating</div>
              <div className="font-mono">{tokenConfig.circulating_supply.toLocaleString()}</div>
            </div>
          </div>
          <p className="text-xs text-[var(--status-risk)] mb-8 font-bold">
            DO NOT attempt to purchase CRX tokens. Any token claiming to be Crexto on DEXs is a scam.
          </p>
          <Link href="/agents">
            <Button size="lg">
              Start Using Crexto <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
