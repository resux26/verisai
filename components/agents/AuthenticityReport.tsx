'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SharedReportHeader, SignalsSection, FactsSection, ActionsQuestionsSection, DisclaimerSection } from './SharedReportHeader';
import { ShieldCheck, AlertOctagon, Search, CheckCircle } from 'lucide-react';

interface AuthenticityReportProps {
  result: any;
}

function getSeverityVariant(severity: string): 'good' | 'caution' | 'risk' | 'default' {
  const s = severity?.toLowerCase();
  if (s === 'minor') return 'good';
  if (s === 'moderate') return 'caution';
  if (s === 'critical') return 'risk';
  return 'default';
}

function getDirectionColor(direction: string): string {
  return direction === 'SUPPORTS_AUTHENTICITY' 
    ? 'var(--status-good)' 
    : 'var(--status-risk)';
}

export function AuthenticityReport({ result }: AuthenticityReportProps) {
  return (
    <div className="animate-fade-in-up pb-20 max-w-4xl">
      <SharedReportHeader
        agentType="authenticity"
        verdict={result.verdict}
        confidence={result.confidence}
        summary={result.summary}
      />

      {/* Evidence Quality */}
      {result.evidenceQuality && (
        <div className="mb-8">
          <Card className="bg-[var(--bg-surface)] border-[var(--border-subtle)]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-[var(--text-secondary)]">
                <Search className="w-4 h-4" /> Evidence Quality
              </h3>
              <Badge variant={
                result.evidenceQuality === 'HIGH' ? 'good' :
                result.evidenceQuality === 'MODERATE' ? 'caution' : 'risk'
              }>
                {result.evidenceQuality}
              </Badge>
            </div>
          </Card>
        </div>
      )}

      {/* Authenticity Signals */}
      {result.authenticitySignals && result.authenticitySignals.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-[var(--text-secondary)]">
            <ShieldCheck className="w-4 h-4" /> Authenticity Signals ({result.authenticitySignals.length})
          </h3>
          <div className="space-y-2">
            {result.authenticitySignals.map((sig: any, i: number) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-[var(--bg-surface)] p-3 rounded-lg border border-[var(--border-subtle)] text-sm"
              >
                <div 
                  className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                  style={{ backgroundColor: getDirectionColor(sig.direction) }}
                />
                <div className="flex-1">
                  <span className="text-[var(--text-primary)]">{sig.signal}</span>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[10px] uppercase tracking-wider text-[var(--text-tertiary)]">
                      {sig.weight} • {sig.direction === 'SUPPORTS_AUTHENTICITY' ? 'Supports' : 'Challenges'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inconsistencies */}
      {result.inconsistencies && result.inconsistencies.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-[var(--status-risk)]">
            <AlertOctagon className="w-4 h-4" /> Inconsistencies Detected ({result.inconsistencies.length})
          </h3>
          <div className="space-y-2">
            {result.inconsistencies.map((inc: any, i: number) => (
              <div
                key={i}
                className="bg-[var(--status-risk-bg)]/30 p-3 rounded-lg border border-[var(--status-risk)]/20 text-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[var(--text-primary)]">{inc.description}</span>
                  <Badge variant={getSeverityVariant(inc.severity)} className="shrink-0 text-xs">
                    {inc.severity}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <SignalsSection positiveSignals={result.positiveSignals} concernSignals={result.concernSignals} />
      <FactsSection facts={result.extractedFacts} />

      {/* Verification Suggestions */}
      {result.verificationSuggestions && result.verificationSuggestions.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-[var(--accent-analysis)]">
            <CheckCircle className="w-4 h-4" /> How to Verify
          </h3>
          <div className="space-y-2">
            {result.verificationSuggestions.map((vs: string, i: number) => (
              <div key={i} className="flex gap-3 bg-[var(--bg-surface)] p-3 rounded-lg border border-[var(--border-subtle)] text-sm text-[var(--text-secondary)]">
                <span className="text-[var(--accent-analysis)] font-bold shrink-0">{i + 1}.</span>
                {vs}
              </div>
            ))}
          </div>
        </div>
      )}

      <ActionsQuestionsSection
        recommendations={result.recommendations}
        questionsForUser={result.questionsForUser}
        missingInformation={result.missingInformation}
      />
      <DisclaimerSection disclaimer={result.disclaimer} />
    </div>
  );
}
