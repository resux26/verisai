'use client';

import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { AGENT_CONFIGS, type AgentId } from '@/lib/agents/config';
import { Info, CheckCircle2, AlertTriangle, Search, Lightbulb, ArrowRight, MessageSquareWarning, HelpCircle } from 'lucide-react';

interface SharedReportHeaderProps {
  agentType: AgentId;
  verdict: string;
  confidence: number;
  summary: string;
}

function getVerdictVariant(verdict: string): 'good' | 'caution' | 'risk' | 'default' {
  const v = verdict.toLowerCase();
  if (v.includes('fair') || v.includes('low concern') || v.includes('low risk') || v.includes('safe') || v.includes('strong') || v.includes('great') || v.includes('standard') || v.includes('excellent') || v.includes('good')) return 'good';
  if (v.includes('medium') || v.includes('moderate') || v.includes('caution') || v.includes('slightly') || v.includes('needs') || v.includes('mostly') || v.includes('unusual')) return 'caution';
  if (v.includes('high') || v.includes('expensive') || v.includes('weak') || v.includes('critical') || v.includes('unknown') || v.includes('insufficient')) return 'risk';
  return 'default';
}

function getConfidenceColor(confidence: number): string {
  if (confidence >= 75) return 'var(--status-good)';
  if (confidence >= 50) return 'var(--status-caution)';
  return 'var(--status-risk)';
}

export function SharedReportHeader({ agentType, verdict, confidence, summary }: SharedReportHeaderProps) {
  const config = AGENT_CONFIGS[agentType];
  
  return (
    <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] mb-8 shadow-md">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
        <div>
          <div className="text-xs font-semibold text-[var(--text-tertiary)] mb-2 uppercase tracking-wider">
            {config?.name || 'AI'} Assessment
          </div>
          <Badge variant={getVerdictVariant(verdict)} className="text-xl md:text-2xl font-bold px-4 py-1.5">
            {verdict}
          </Badge>
        </div>
        <div className="sm:text-right">
          <div className="text-xs text-[var(--text-tertiary)] mb-1 uppercase tracking-wider">Confidence</div>
          <div 
            className="text-xl md:text-2xl font-bold font-mono"
            style={{ color: getConfidenceColor(confidence) }}
          >
            {confidence}%
          </div>
        </div>
      </div>
      <p className="text-sm md:text-base font-medium leading-relaxed">{summary}</p>
    </div>
  );
}

// ============================================================================
// SHARED SECTIONS — reusable across agent reports
// ============================================================================

interface SignalsSectionProps {
  positiveSignals?: string[];
  concernSignals?: string[];
}

export function SignalsSection({ positiveSignals, concernSignals }: SignalsSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="glass-card p-5 border-[var(--status-good)]/20 bg-[var(--status-good-bg)]/30">
        <h3 className="text-sm font-semibold flex items-center gap-2 mb-4 text-[var(--status-good)]">
          <CheckCircle2 className="w-4 h-4" /> Positive Signals
        </h3>
        <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
          {positiveSignals?.map((s, i) => <li key={i}>• {s}</li>)}
          {(!positiveSignals || positiveSignals.length === 0) && <li className="italic opacity-50">None identified</li>}
        </ul>
      </div>

      <div className="glass-card p-5 border-[var(--status-risk)]/20 bg-[var(--status-risk-bg)]/30">
        <h3 className="text-sm font-semibold flex items-center gap-2 mb-4 text-[var(--status-risk)]">
          <AlertTriangle className="w-4 h-4" /> Concerns
        </h3>
        <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
          {concernSignals?.map((s, i) => <li key={i}>• {s}</li>)}
          {(!concernSignals || concernSignals.length === 0) && <li className="italic opacity-50">None identified</li>}
        </ul>
      </div>
    </div>
  );
}

interface FactsSectionProps {
  facts?: string[];
}

export function FactsSection({ facts }: FactsSectionProps) {
  if (!facts || facts.length === 0) return null;
  
  return (
    <div className="mb-8">
      <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-[var(--text-secondary)]">
        <Search className="w-4 h-4" /> Extracted Facts
      </h3>
      <div className="bg-[var(--bg-surface)] rounded-lg p-4 text-sm border border-[var(--border-subtle)] space-y-2 text-[var(--text-secondary)]">
        {facts.map((f, i) => (
          <div key={i} className="pb-2 border-b border-[var(--border-subtle)] last:border-0 last:pb-0">{f}</div>
        ))}
      </div>
    </div>
  );
}

interface ActionsQuestionsProps {
  recommendations?: string[];
  questionsForUser?: string[];
  missingInformation?: string[];
}

export function ActionsQuestionsSection({ recommendations, questionsForUser, missingInformation }: ActionsQuestionsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div>
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-[var(--accent-analysis)]">
          <Lightbulb className="w-4 h-4" /> Recommended Actions
        </h3>
        <ul className="space-y-2 text-sm">
          {recommendations?.map((r, i) => (
            <li key={i} className="flex gap-2 bg-[var(--bg-surface)] p-3 rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)]">
              <ArrowRight className="w-4 h-4 shrink-0 mt-0.5 text-[var(--accent-analysis)]" /> {r}
            </li>
          ))}
          {(!recommendations || recommendations.length === 0) && (
            <li className="text-[var(--text-tertiary)] italic text-sm">No specific actions recommended.</li>
          )}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-[var(--status-caution)]">
          <MessageSquareWarning className="w-4 h-4" /> Questions to Ask
        </h3>
        <ul className="space-y-2 text-sm">
          {questionsForUser?.map((q, i) => (
            <li key={i} className="flex gap-2 bg-[var(--bg-surface)] p-3 rounded-lg text-[var(--text-secondary)] border-l-2 border-[var(--status-caution)]">
              {q}
            </li>
          ))}
          {missingInformation?.map((m, i) => (
            <li key={`m${i}`} className="flex gap-2 bg-[var(--bg-surface)] p-3 rounded-lg text-[var(--text-secondary)] border-l-2 border-[var(--border-hover)] italic">
              <HelpCircle className="w-4 h-4 shrink-0 mt-0.5 text-[var(--text-tertiary)]" />
              Missing: {m}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

interface DisclaimerProps {
  disclaimer?: string;
}

export function DisclaimerSection({ disclaimer }: DisclaimerProps) {
  if (!disclaimer) return null;
  
  return (
    <div className="text-xs text-[var(--text-tertiary)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-3 rounded-lg mb-8 flex gap-2 leading-relaxed">
      <Info className="w-4 h-4 shrink-0" />
      {disclaimer}
    </div>
  );
}
