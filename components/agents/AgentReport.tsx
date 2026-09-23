'use client';

import React from 'react';
import type { AgentId } from '@/lib/agents/config';
import { AuthenticityReport } from './AuthenticityReport';
import { ValueReport } from './ValueReport';
import { TrustReport } from './TrustReport';
import { DocumentReport } from './DocumentReport';
import { CareerReport } from './CareerReport';
import { Web3Report } from './Web3Report';

interface AgentReportProps {
  agentType: AgentId;
  result: any;
}

/**
 * Renders the appropriate specialized report component
 * based on the agent type. Falls back to a generic JSON
 * display if the agent type is unrecognized.
 */
export function AgentReport({ agentType, result }: AgentReportProps) {
  switch (agentType) {
    case 'authenticity':
      return <AuthenticityReport result={result} />;
    case 'value':
      return <ValueReport result={result} />;
    case 'trust':
      return <TrustReport result={result} />;
    case 'document':
      return <DocumentReport result={result} />;
    case 'career':
      return <CareerReport result={result} />;
    case 'web3':
      return <Web3Report result={result} />;
    default:
      // Fallback for any future agents — show raw JSON
      return (
        <div className="animate-fade-in-up pb-20 max-w-4xl">
          <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] mb-8">
            <h3 className="text-lg font-bold mb-2">Analysis Result</h3>
            <pre className="text-xs font-mono text-[var(--text-secondary)] overflow-auto max-h-96 bg-[var(--bg-base)] p-4 rounded-lg">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      );
  }
}
