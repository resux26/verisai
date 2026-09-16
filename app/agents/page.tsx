import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, TrendingUp, Search, FileText, Briefcase, Hexagon } from 'lucide-react';

export default function AgentsDirectoryPage() {
  const agents = [
    {
      id: 'authenticity',
      name: 'Authenticity Agent',
      tagline: 'Is it real?',
      description: 'Assess whether an item, document, or listing appears genuine or suspicious.',
      icon: <Search className="w-8 h-8 text-[var(--accent-analysis)]" />,
      colorClass: 'bg-[var(--accent-analysis)]/10 group-hover:bg-[var(--accent-analysis)]/20',
      inputs: ['Images', 'PDFs', 'Screenshots']
    },
    {
      id: 'value',
      name: 'Value Agent',
      tagline: 'Is it worth it?',
      description: 'Understand if an asking price is reasonable based on the information supplied.',
      icon: <TrendingUp className="w-8 h-8 text-[var(--status-good)]" />,
      colorClass: 'bg-[var(--status-good)]/10 group-hover:bg-[var(--status-good)]/20',
      inputs: ['Product Listings', 'Screenshots']
    },
    {
      id: 'trust',
      name: 'Trust Agent',
      tagline: 'Can I trust it?',
      description: 'Analyze sellers, websites, and offers for risk signals and psychological pressure tactics.',
      icon: <ShieldCheck className="w-8 h-8 text-[var(--status-caution)]" />,
      colorClass: 'bg-[var(--status-caution)]/10 group-hover:bg-[var(--status-caution)]/20',
      inputs: ['Website Content', 'Screenshots', 'Text']
    },
    {
      id: 'document',
      name: 'Document Agent',
      tagline: 'What am I agreeing to?',
      description: 'Summarize complex contracts, invoices, and terms to highlight key obligations.',
      icon: <FileText className="w-8 h-8 text-[var(--status-info)]" />,
      colorClass: 'bg-[var(--status-info)]/10 group-hover:bg-[var(--status-info)]/20',
      inputs: ['PDFs', 'Contracts', 'Policies']
    },
    {
      id: 'career',
      name: 'Career Agent',
      tagline: 'Improve your profile.',
      description: 'Analyze how well your CV aligns with job descriptions and identify missing evidence.',
      icon: <Briefcase className="w-8 h-8 text-[#A855F7]" />,
      colorClass: 'bg-[#A855F7]/10 group-hover:bg-[#A855F7]/20',
      inputs: ['CVs', 'Job Descriptions']
    },
    {
      id: 'web3',
      name: 'Web3 Analyzer',
      tagline: 'What am I signing?',
      description: 'Translate complex blockchain transactions and contract interactions into human language.',
      icon: <Hexagon className="w-8 h-8 text-[var(--accent-proof)]" />,
      colorClass: 'bg-[var(--accent-proof)]/10 group-hover:bg-[var(--accent-proof)]/20',
      inputs: ['Transaction Data', 'Contract Output']
    }
  ];

  return (
    <div className="section py-12 md:py-16 animate-fade-in-up">
      <div className="text-center mb-12 md:mb-16">
        <h1 className="font-display text-4xl font-bold mb-4">VerisAI Agents</h1>
        <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
          Choose a specialized AI agent to analyze your information. Each agent is tuned for a specific purpose and produces structured, verifiable intelligence.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map(agent => (
          <Link key={agent.id} href={`/analyze/${agent.id}`} className="group">
            <Card className="h-full border-[var(--border-subtle)] hover:border-[var(--border-hover)] transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-[var(--bg-surface)]">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors ${agent.colorClass}`}>
                {agent.icon}
              </div>
              <h2 className="text-2xl font-bold mb-1 text-[var(--text-primary)]">{agent.name}</h2>
              <h3 className="text-[var(--text-tertiary)] font-medium mb-4 italic">"{agent.tagline}"</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-6 leading-relaxed">
                {agent.description}
              </p>
              
              <div className="mt-auto pt-4 border-t border-[var(--border-subtle)]">
                <div className="flex gap-2 flex-wrap">
                  {agent.inputs.slice(0, 2).map(input => (
                    <Badge key={input} variant="default" className="text-[10px] font-normal">
                      {input}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
