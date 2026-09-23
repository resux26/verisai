'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SharedReportHeader, FactsSection, ActionsQuestionsSection, DisclaimerSection } from './SharedReportHeader';
import { FileText, Users, Scale, DollarSign, Calendar, AlertOctagon, LogOut } from 'lucide-react';

interface DocumentReportProps {
  result: any;
}

function getImportanceVariant(importance: string): 'good' | 'caution' | 'risk' | 'default' {
  const i = importance?.toLowerCase();
  if (i === 'standard') return 'default';
  if (i === 'important') return 'caution';
  if (i === 'critical') return 'risk';
  return 'default';
}

function getSeverityVariant(severity: string): 'good' | 'caution' | 'risk' | 'default' {
  const s = severity?.toLowerCase();
  if (s === 'low') return 'good';
  if (s === 'moderate') return 'caution';
  if (s === 'high') return 'risk';
  return 'default';
}

export function DocumentReport({ result }: DocumentReportProps) {
  return (
    <div className="animate-fade-in-up pb-20 max-w-4xl">
      <SharedReportHeader
        agentType="document"
        verdict={result.verdict}
        confidence={result.confidence}
        summary={result.summary}
      />

      {/* Document Type & Parties */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Document Type */}
        <Card className="bg-[var(--bg-surface)] border-[var(--border-subtle)]">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-[var(--text-tertiary)]" />
            <span className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Document Type</span>
          </div>
          <div className="text-lg font-bold text-[var(--text-primary)]">
            {result.documentType?.replace(/_/g, ' ') || 'Unknown'}
          </div>
        </Card>

        {/* Parties */}
        {result.parties && result.parties.length > 0 && (
          <Card className="bg-[var(--bg-surface)] border-[var(--border-subtle)]">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-[var(--text-tertiary)]" />
              <span className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Parties ({result.parties.length})</span>
            </div>
            <div className="space-y-1">
              {result.parties.map((p: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-primary)] font-medium">{p.name}</span>
                  <span className="text-[10px] uppercase text-[var(--text-tertiary)] bg-[var(--bg-elevated)] px-2 py-0.5 rounded">
                    {p.role?.replace(/_/g, ' ')}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Key Obligations */}
      {result.keyObligations && result.keyObligations.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-[var(--text-secondary)]">
            <Scale className="w-4 h-4" /> Key Obligations ({result.keyObligations.length})
          </h3>
          <div className="space-y-2">
            {result.keyObligations.map((ob: any, i: number) => (
              <div key={i} className="bg-[var(--bg-surface)] p-3 rounded-lg border border-[var(--border-subtle)] text-sm">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-[var(--text-primary)]">{ob.obligation}</span>
                  <Badge variant={getImportanceVariant(ob.importance)} className="shrink-0 text-xs">{ob.importance}</Badge>
                </div>
                <div className="text-[10px] uppercase tracking-wider text-[var(--text-tertiary)]">
                  Party: {ob.party}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Financial Terms */}
      {result.financialTerms && result.financialTerms.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-[var(--accent-analysis)]">
            <DollarSign className="w-4 h-4" /> Financial Terms ({result.financialTerms.length})
          </h3>
          <div className="bg-[var(--bg-surface)] rounded-lg border border-[var(--border-subtle)] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border-subtle)]">
                  <th className="text-left p-3 text-xs font-semibold text-[var(--text-tertiary)] uppercase">Description</th>
                  <th className="text-right p-3 text-xs font-semibold text-[var(--text-tertiary)] uppercase">Amount</th>
                  <th className="text-right p-3 text-xs font-semibold text-[var(--text-tertiary)] uppercase hidden sm:table-cell">Frequency</th>
                </tr>
              </thead>
              <tbody>
                {result.financialTerms.map((ft: any, i: number) => (
                  <tr key={i} className="border-b border-[var(--border-subtle)] last:border-0">
                    <td className="p-3 text-[var(--text-primary)]">{ft.description}</td>
                    <td className="p-3 text-right font-mono font-medium text-[var(--text-primary)]">{ft.amount}</td>
                    <td className="p-3 text-right text-[var(--text-tertiary)] text-xs hidden sm:table-cell">
                      {ft.frequency?.replace(/_/g, ' ') || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Important Dates */}
      {result.importantDates && result.importantDates.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-[var(--text-secondary)]">
            <Calendar className="w-4 h-4" /> Important Dates ({result.importantDates.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {result.importantDates.map((d: any, i: number) => (
              <div key={i} className="bg-[var(--bg-surface)] p-3 rounded-lg border border-[var(--border-subtle)] text-sm">
                <div className="font-mono font-medium text-[var(--text-primary)]">{d.date}</div>
                <div className="text-xs text-[var(--text-secondary)] mt-0.5">{d.significance}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Unusual Clauses */}
      {result.unusualClauses && result.unusualClauses.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-[var(--status-caution)]">
            <AlertOctagon className="w-4 h-4" /> Unusual Clauses ({result.unusualClauses.length})
          </h3>
          <div className="space-y-2">
            {result.unusualClauses.map((uc: any, i: number) => (
              <div key={i} className="bg-[var(--status-caution-bg)]/30 p-4 rounded-lg border border-[var(--status-caution)]/20 text-sm">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-medium text-[var(--text-primary)]">{uc.clause}</span>
                  <Badge variant={getSeverityVariant(uc.severity)} className="shrink-0 text-xs">{uc.severity}</Badge>
                </div>
                <p className="text-[var(--text-secondary)] text-xs">{uc.concern}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Termination Conditions */}
      {result.terminationConditions && result.terminationConditions.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-[var(--text-secondary)]">
            <LogOut className="w-4 h-4" /> Termination Conditions
          </h3>
          <ul className="space-y-2 text-sm">
            {result.terminationConditions.map((tc: string, i: number) => (
              <li key={i} className="bg-[var(--bg-surface)] p-3 rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                {tc}
              </li>
            ))}
          </ul>
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
