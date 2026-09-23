import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AGENT_CONFIGS, AGENT_IDS } from '@/lib/agents/config';
import { ShieldCheck, TrendingUp, Eye, FileSearch, Briefcase, Blocks } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crexto AI Agents | Specialized Intelligence',
  description: 'Choose a specialized AI agent to analyze your information. Each agent is tuned for a specific purpose and produces a unique, structured intelligence report.',
};

const ICON_MAP: Record<string, React.ReactNode> = {
  ShieldCheck: <ShieldCheck className="w-8 h-8" />,
  TrendingUp: <TrendingUp className="w-8 h-8" />,
  Eye: <Eye className="w-8 h-8" />,
  FileSearch: <FileSearch className="w-8 h-8" />,
  Briefcase: <Briefcase className="w-8 h-8" />,
  Blocks: <Blocks className="w-8 h-8" />,
};

export default function AgentsDirectoryPage() {
  return (
    <div className="section py-12 md:py-16 animate-fade-in-up">
      <div className="text-center mb-12 md:mb-16">
        <h1 className="font-display text-4xl font-bold mb-4">Crexto AI Agents</h1>
        <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
          Choose a specialized AI agent to analyze your information. Each agent is tuned for a specific purpose and produces a unique, structured intelligence report.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {AGENT_IDS.map(agentId => {
          const config = AGENT_CONFIGS[agentId];
          return (
            <Link key={agentId} href={`/analyze/${agentId}`} className="group">
              <Card className="h-full border-[var(--border-subtle)] hover:border-[var(--border-hover)] transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-[var(--bg-surface)]">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 text-white group-hover:scale-110 group-hover:shadow-lg"
                  style={{ background: config.gradient }}
                >
                  {ICON_MAP[config.icon]}
                </div>
                <h2 className="text-2xl font-bold mb-1 text-[var(--text-primary)]">{config.name}</h2>
                <h3 className="text-[var(--text-tertiary)] font-medium mb-4 italic">&quot;{config.tagline}&quot;</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-6 leading-relaxed">
                  {config.description}
                </p>
                
                <div className="mt-auto pt-4 border-t border-[var(--border-subtle)]">
                  <div className="flex gap-2 flex-wrap">
                    {config.examples.slice(0, 2).map(example => (
                      <Badge key={example} variant="default" className="text-[10px] font-normal">
                        {example.length > 30 ? example.substring(0, 30) + '...' : example}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
