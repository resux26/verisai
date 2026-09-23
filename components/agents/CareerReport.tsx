'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SharedReportHeader, FactsSection, ActionsQuestionsSection, DisclaimerSection } from './SharedReportHeader';
import { Briefcase, Target, TrendingUp, TrendingDown, Search, Star, Zap, GraduationCap } from 'lucide-react';

interface CareerReportProps {
  result: any;
}

function getQualityVariant(quality: string): 'good' | 'caution' | 'risk' | 'default' {
  const q = quality?.toUpperCase();
  if (q === 'EXCELLENT' || q === 'GOOD') return 'good';
  if (q === 'NEEDS_WORK') return 'caution';
  if (q === 'WEAK' || q === 'INSUFFICIENT') return 'risk';
  return 'default';
}

function getPriorityColor(priority: string): string {
  switch (priority?.toUpperCase()) {
    case 'HIGH': return 'var(--status-risk)';
    case 'MEDIUM': return 'var(--status-caution)';
    case 'LOW': return 'var(--status-good)';
    default: return 'var(--text-secondary)';
  }
}

export function CareerReport({ result }: CareerReportProps) {
  return (
    <div className="animate-fade-in-up pb-20 max-w-4xl">
      <SharedReportHeader
        agentType="career"
        verdict={result.verdict}
        confidence={result.confidence}
        summary={result.summary}
      />

      {/* Profile Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {result.profileType && (
          <Card className="bg-[var(--bg-surface)] border-[var(--border-subtle)] !p-4">
            <div className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Type</div>
            <div className="text-sm font-bold text-[var(--text-primary)]">{result.profileType?.replace(/_/g, ' ')}</div>
          </Card>
        )}
        {result.overallQuality && (
          <Card className="bg-[var(--bg-surface)] border-[var(--border-subtle)] !p-4">
            <div className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Quality</div>
            <Badge variant={getQualityVariant(result.overallQuality)} className="text-xs">
              {result.overallQuality?.replace(/_/g, ' ')}
            </Badge>
          </Card>
        )}
        {result.atsCompatibility && (
          <Card className="bg-[var(--bg-surface)] border-[var(--border-subtle)] !p-4">
            <div className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">ATS Ready</div>
            <Badge variant={getQualityVariant(result.atsCompatibility)} className="text-xs">
              {result.atsCompatibility}
            </Badge>
          </Card>
        )}
        {result.experienceLevel && (
          <Card className="bg-[var(--bg-surface)] border-[var(--border-subtle)] !p-4">
            <div className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Level</div>
            <div className="text-sm font-bold text-[var(--text-primary)]">
              <GraduationCap className="w-3 h-3 inline mr-1" />
              {result.experienceLevel}
            </div>
          </Card>
        )}
      </div>

      {/* Role Alignment */}
      {result.roleAlignment && result.roleAlignment !== 'NOT_APPLICABLE' && (
        <div className="mb-8">
          <Card className="bg-[var(--bg-surface)] border-[var(--border-subtle)] border-l-4" style={{ borderLeftColor: result.roleAlignment === 'STRONG' ? 'var(--status-good)' : result.roleAlignment === 'MODERATE' ? 'var(--status-caution)' : 'var(--status-risk)' }}>
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-[var(--text-tertiary)]" />
              <div>
                <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">Role Alignment</div>
                <div className="text-lg font-bold text-[var(--text-primary)]">{result.roleAlignment?.replace(/_/g, ' ')}</div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Strengths & Improvements side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Strength Areas */}
        {result.strengthAreas && result.strengthAreas.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-[var(--status-good)]">
              <Star className="w-4 h-4" /> Strengths ({result.strengthAreas.length})
            </h3>
            <div className="space-y-2">
              {result.strengthAreas.map((sa: any, i: number) => (
                <div key={i} className="bg-[var(--status-good-bg)]/30 p-3 rounded-lg border border-[var(--status-good)]/20 text-sm">
                  <div className="font-medium text-[var(--text-primary)] flex items-center gap-1.5">
                    <TrendingUp className="w-3 h-3 text-[var(--status-good)]" />
                    {sa.area}
                  </div>
                  <p className="text-[var(--text-secondary)] text-xs mt-1">{sa.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Improvement Areas */}
        {result.improvementAreas && result.improvementAreas.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-[var(--status-caution)]">
              <Zap className="w-4 h-4" /> Improve ({result.improvementAreas.length})
            </h3>
            <div className="space-y-2">
              {result.improvementAreas.map((ia: any, i: number) => (
                <div key={i} className="bg-[var(--bg-surface)] p-3 rounded-lg border border-[var(--border-subtle)] text-sm">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-medium text-[var(--text-primary)] flex items-center gap-1.5">
                      <TrendingDown className="w-3 h-3" style={{ color: getPriorityColor(ia.priority) }} />
                      {ia.area}
                    </span>
                    <span
                      className="text-[10px] font-bold uppercase shrink-0 px-1.5 py-0.5 rounded"
                      style={{ color: getPriorityColor(ia.priority) }}
                    >
                      {ia.priority}
                    </span>
                  </div>
                  <p className="text-[var(--text-secondary)] text-xs">{ia.suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Missing Keywords */}
      {result.missingKeywords && result.missingKeywords.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-[var(--accent-analysis)]">
            <Search className="w-4 h-4" /> Missing Keywords
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.missingKeywords.map((kw: string, i: number) => (
              <span
                key={i}
                className="px-3 py-1.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-full text-xs font-medium text-[var(--text-secondary)] border-dashed"
              >
                + {kw}
              </span>
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
