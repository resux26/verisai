'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SharedReportHeader, SignalsSection, FactsSection, ActionsQuestionsSection, DisclaimerSection } from './SharedReportHeader';
import { Shield, AlertTriangle, Eye, Zap, MessageCircle } from 'lucide-react';

interface TrustReportProps {
  result: any;
}

function getSeverityVariant(severity: string): 'good' | 'caution' | 'risk' | 'default' {
  const s = severity?.toLowerCase();
  if (s === 'low') return 'good';
  if (s === 'medium') return 'caution';
  if (s === 'high' || s === 'critical') return 'risk';
  return 'default';
}

function getClaimColor(assessment: string): string {
  switch (assessment) {
    case 'VERIFIABLE': return 'var(--status-good)';
    case 'UNVERIFIABLE': return 'var(--status-caution)';
    case 'EXAGGERATED': return 'var(--status-caution)';
    case 'MISLEADING': return 'var(--status-risk)';
    default: return 'var(--text-secondary)';
  }
}

export function TrustReport({ result }: TrustReportProps) {
  return (
    <div className="animate-fade-in-up pb-20 max-w-4xl">
      <SharedReportHeader
        agentType="trust"
        verdict={result.verdict}
        confidence={result.confidence}
        summary={result.summary}
      />

      {/* Entity Card */}
      {(result.entityIdentified || result.entityType) && (
        <div className="mb-8">
          <Card className="bg-[var(--bg-surface)] border-[var(--border-subtle)]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Entity Under Assessment</div>
                <div className="text-lg font-bold text-[var(--text-primary)]">{result.entityIdentified || 'Unknown'}</div>
              </div>
              {result.entityType && (
                <Badge variant="default" className="text-xs">{result.entityType}</Badge>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Trust & Risk Signals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Trust Signals */}
        {result.trustSignals && result.trustSignals.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-[var(--status-good)]">
              <Shield className="w-4 h-4" /> Trust Signals ({result.trustSignals.length})
            </h3>
            <div className="space-y-2">
              {result.trustSignals.map((ts: any, i: number) => (
                <div key={i} className="bg-[var(--status-good-bg)]/30 p-3 rounded-lg border border-[var(--status-good)]/20 text-sm">
                  <div className="text-[var(--text-primary)]">{ts.signal}</div>
                  <div className="text-[10px] uppercase tracking-wider text-[var(--text-tertiary)] mt-1">
                    {ts.type} • {ts.weight}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Risk Signals */}
        {result.riskSignals && result.riskSignals.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-[var(--status-risk)]">
              <AlertTriangle className="w-4 h-4" /> Risk Signals ({result.riskSignals.length})
            </h3>
            <div className="space-y-2">
              {result.riskSignals.map((rs: any, i: number) => (
                <div key={i} className="bg-[var(--status-risk-bg)]/30 p-3 rounded-lg border border-[var(--status-risk)]/20 text-sm">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[var(--text-primary)]">{rs.signal}</span>
                    <Badge variant={getSeverityVariant(rs.severity)} className="shrink-0 text-xs">{rs.severity}</Badge>
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-[var(--text-tertiary)] mt-1">
                    {rs.type}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pressure Tactics */}
      {result.pressureTactics && result.pressureTactics.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-[var(--status-caution)]">
            <Zap className="w-4 h-4" /> Pressure Tactics Detected ({result.pressureTactics.length})
          </h3>
          <div className="bg-[var(--status-caution-bg)]/30 p-4 rounded-lg border border-[var(--status-caution)]/20">
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              {result.pressureTactics.map((pt: string, i: number) => (
                <li key={i} className="flex gap-2">
                  <Zap className="w-3 h-3 shrink-0 mt-1 text-[var(--status-caution)]" />
                  {pt}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Claim Analysis */}
      {result.claimAnalysis && result.claimAnalysis.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-[var(--text-secondary)]">
            <MessageCircle className="w-4 h-4" /> Claim Analysis ({result.claimAnalysis.length})
          </h3>
          <div className="space-y-2">
            {result.claimAnalysis.map((ca: any, i: number) => (
              <div key={i} className="bg-[var(--bg-surface)] p-3 rounded-lg border border-[var(--border-subtle)] text-sm">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[var(--text-primary)] italic">"{ca.claim}"</span>
                  <span 
                    className="shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded"
                    style={{ color: getClaimColor(ca.assessment) }}
                  >
                    {ca.assessment}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <FactsSection facts={result.extractedFacts} />
      <ActionsQuestionsSection
        recommendations={result.recommendations}
        questionsForUser={result.questionsForUser}
        missingInformation={result.missingInformation}
      />
      <DisclaimerSection disclaimer={result.disclaimer} />
    </div>
  );
}
