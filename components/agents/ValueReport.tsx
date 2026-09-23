'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SharedReportHeader, SignalsSection, FactsSection, ActionsQuestionsSection, DisclaimerSection } from './SharedReportHeader';
import { TrendingUp, TrendingDown, Minus, DollarSign, BarChart3, Tag } from 'lucide-react';

interface ValueReportProps {
  result: any;
}

function getPositionColor(position: string): string {
  switch (position) {
    case 'BELOW_MARKET': return 'var(--status-good)';
    case 'FAIR': return 'var(--status-good)';
    case 'ABOVE_MARKET': return 'var(--status-caution)';
    case 'SIGNIFICANTLY_ABOVE': return 'var(--status-risk)';
    default: return 'var(--text-secondary)';
  }
}

function getPositionLabel(position: string): string {
  switch (position) {
    case 'BELOW_MARKET': return 'Below Market';
    case 'FAIR': return 'Fair Price';
    case 'ABOVE_MARKET': return 'Above Market';
    case 'SIGNIFICANTLY_ABOVE': return 'Significantly Above';
    default: return 'Unknown';
  }
}

function getImpactIcon(impact: string) {
  if (impact === 'INCREASES_VALUE') return <TrendingUp className="w-4 h-4 text-[var(--status-good)]" />;
  if (impact === 'DECREASES_VALUE') return <TrendingDown className="w-4 h-4 text-[var(--status-risk)]" />;
  return <Minus className="w-4 h-4 text-[var(--text-tertiary)]" />;
}

export function ValueReport({ result }: ValueReportProps) {
  return (
    <div className="animate-fade-in-up pb-20 max-w-4xl">
      <SharedReportHeader
        agentType="value"
        verdict={result.verdict}
        confidence={result.confidence}
        summary={result.summary}
      />

      {/* Price Comparison Card */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Item Identified */}
        <Card className="bg-[var(--bg-surface)] border-[var(--border-subtle)]">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="w-4 h-4 text-[var(--text-tertiary)]" />
            <span className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Item</span>
          </div>
          <div className="text-sm font-medium text-[var(--text-primary)] line-clamp-2">
            {result.itemIdentified || 'Not identified'}
          </div>
        </Card>

        {/* Asking Price */}
        <Card className="bg-[var(--bg-surface)] border-[var(--border-subtle)]">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-[var(--text-tertiary)]" />
            <span className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Asking Price</span>
          </div>
          <div className="text-lg font-bold font-mono text-[var(--text-primary)]">
            {result.askingPrice || 'N/A'}
          </div>
        </Card>

        {/* Price Position */}
        <Card className="bg-[var(--bg-surface)] border-[var(--border-subtle)]">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-[var(--text-tertiary)]" />
            <span className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Position</span>
          </div>
          <div 
            className="text-lg font-bold"
            style={{ color: getPositionColor(result.pricePosition) }}
          >
            {getPositionLabel(result.pricePosition)}
          </div>
        </Card>
      </div>

      {/* Estimated Range */}
      {result.estimatedRange && (
        <div className="mb-8">
          <Card className="bg-[var(--bg-surface)] border-[var(--border-subtle)] border-l-4" style={{ borderLeftColor: 'var(--accent-analysis)' }}>
            <h3 className="text-sm font-semibold mb-3 text-[var(--text-secondary)]">
              AI Estimated Fair Market Range
            </h3>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-xs text-[var(--text-tertiary)] mb-1">Low</div>
                <div className="text-xl font-bold font-mono text-[var(--status-good)]">
                  {result.estimatedRange.low}
                </div>
              </div>
              <div className="flex-1 h-2 bg-[var(--bg-elevated)] rounded-full relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--status-good)] via-[var(--status-caution)] to-[var(--status-risk)] opacity-30" />
              </div>
              <div className="text-center">
                <div className="text-xs text-[var(--text-tertiary)] mb-1">High</div>
                <div className="text-xl font-bold font-mono text-[var(--status-risk)]">
                  {result.estimatedRange.high}
                </div>
              </div>
            </div>
            <div className="text-[10px] text-[var(--text-tertiary)] mt-2 text-center">
              Currency: {result.estimatedRange.currency || 'USD'}
            </div>
          </Card>
        </div>
      )}

      {/* Value Factors */}
      {result.valueFactors && result.valueFactors.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-[var(--text-secondary)]">
            <BarChart3 className="w-4 h-4" /> Value Factors ({result.valueFactors.length})
          </h3>
          <div className="space-y-2">
            {result.valueFactors.map((vf: any, i: number) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-[var(--bg-surface)] p-3 rounded-lg border border-[var(--border-subtle)] text-sm"
              >
                {getImpactIcon(vf.impact)}
                <div className="flex-1">
                  <span className="font-medium text-[var(--text-primary)]">{vf.factor}</span>
                  <p className="text-[var(--text-secondary)] text-xs mt-0.5">{vf.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Condition */}
      {result.conditionAssessment && (
        <div className="mb-8">
          <Card className="bg-[var(--bg-surface)] border-[var(--border-subtle)]">
            <h3 className="text-sm font-semibold mb-2 text-[var(--text-secondary)]">Condition Assessment</h3>
            <p className="text-sm text-[var(--text-secondary)]">{result.conditionAssessment}</p>
          </Card>
        </div>
      )}

      <SignalsSection positiveSignals={result.positiveSignals} concernSignals={result.concernSignals} />
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
