'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SharedReportHeader, FactsSection, ActionsQuestionsSection, DisclaimerSection } from './SharedReportHeader';
import { Blocks, ArrowRight, Shield, Key, Cpu, Fuel, Globe } from 'lucide-react';

interface Web3ReportProps {
  result: any;
}

function getRiskVariant(risk: string): 'good' | 'caution' | 'risk' | 'default' {
  const r = risk?.toUpperCase();
  if (r === 'SAFE' || r === 'LOW') return 'good';
  if (r === 'MODERATE') return 'caution';
  if (r === 'HIGH' || r === 'CRITICAL') return 'risk';
  return 'default';
}

function getDirectionIcon(direction: string) {
  switch (direction) {
    case 'SENT': return <span className="text-[var(--status-risk)]">↑ Sent</span>;
    case 'RECEIVED': return <span className="text-[var(--status-good)]">↓ Received</span>;
    case 'APPROVED': return <span className="text-[var(--status-caution)]">✓ Approved</span>;
    case 'LOCKED': return <span className="text-[var(--accent-proof)]">🔒 Locked</span>;
    default: return <span>{direction}</span>;
  }
}

export function Web3Report({ result }: Web3ReportProps) {
  return (
    <div className="animate-fade-in-up pb-20 max-w-4xl">
      <SharedReportHeader
        agentType="web3"
        verdict={result.verdict}
        confidence={result.confidence}
        summary={result.summary}
      />

      {/* Human Readable Summary */}
      {result.humanReadableSummary && (
        <div className="mb-8">
          <Card className="bg-[var(--bg-surface)] border-[var(--border-subtle)] border-l-4" style={{ borderLeftColor: 'var(--accent-analysis)' }}>
            <h3 className="text-sm font-semibold mb-2 text-[var(--text-secondary)]">
              💡 In Plain English
            </h3>
            <p className="text-sm text-[var(--text-primary)] leading-relaxed">{result.humanReadableSummary}</p>
          </Card>
        </div>
      )}

      {/* Interaction Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {result.interactionType && (
          <Card className="bg-[var(--bg-surface)] border-[var(--border-subtle)] !p-4">
            <div className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Type</div>
            <div className="text-sm font-bold text-[var(--text-primary)]">
              <Cpu className="w-3 h-3 inline mr-1" />
              {result.interactionType?.replace(/_/g, ' ')}
            </div>
          </Card>
        )}
        {result.network && (
          <Card className="bg-[var(--bg-surface)] border-[var(--border-subtle)] !p-4">
            <div className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Network</div>
            <div className="text-sm font-bold text-[var(--text-primary)]">
              <Globe className="w-3 h-3 inline mr-1" />
              {result.network}
            </div>
          </Card>
        )}
        {result.functionCalled && result.functionCalled !== 'N/A' && (
          <Card className="bg-[var(--bg-surface)] border-[var(--border-subtle)] !p-4">
            <div className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Function</div>
            <div className="text-sm font-bold font-mono text-[var(--accent-analysis)]">{result.functionCalled}()</div>
          </Card>
        )}
        {result.riskLevel && (
          <Card className="bg-[var(--bg-surface)] border-[var(--border-subtle)] !p-4">
            <div className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Risk</div>
            <Badge variant={getRiskVariant(result.riskLevel)} className="text-xs">{result.riskLevel}</Badge>
          </Card>
        )}
      </div>

      {/* Addresses */}
      {result.addresses && result.addresses.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-[var(--text-secondary)]">
            <Blocks className="w-4 h-4" /> Addresses Involved ({result.addresses.length})
          </h3>
          <div className="space-y-2">
            {result.addresses.map((addr: any, i: number) => (
              <div key={i} className="bg-[var(--bg-surface)] p-3 rounded-lg border border-[var(--border-subtle)] text-sm">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="font-mono text-xs text-[var(--text-primary)] break-all">{addr.address}</div>
                  <span className="text-[10px] uppercase font-bold text-[var(--text-tertiary)] bg-[var(--bg-elevated)] px-2 py-0.5 rounded shrink-0">
                    {addr.role}
                  </span>
                </div>
                {addr.label && addr.label !== 'Unknown' && (
                  <div className="text-xs text-[var(--accent-analysis)]">🏷 {addr.label}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assets Involved */}
      {result.assetsInvolved && result.assetsInvolved.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-[var(--text-secondary)]">
            <ArrowRight className="w-4 h-4" /> Assets ({result.assetsInvolved.length})
          </h3>
          <div className="bg-[var(--bg-surface)] rounded-lg border border-[var(--border-subtle)] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border-subtle)]">
                  <th className="text-left p-3 text-xs font-semibold text-[var(--text-tertiary)] uppercase">Asset</th>
                  <th className="text-right p-3 text-xs font-semibold text-[var(--text-tertiary)] uppercase">Amount</th>
                  <th className="text-right p-3 text-xs font-semibold text-[var(--text-tertiary)] uppercase">Direction</th>
                </tr>
              </thead>
              <tbody>
                {result.assetsInvolved.map((asset: any, i: number) => (
                  <tr key={i} className="border-b border-[var(--border-subtle)] last:border-0">
                    <td className="p-3 font-medium text-[var(--text-primary)]">{asset.asset}</td>
                    <td className={`p-3 text-right font-mono ${asset.amount === 'UNLIMITED' ? 'text-[var(--status-risk)] font-bold' : 'text-[var(--text-primary)]'}`}>
                      {asset.amount}
                    </td>
                    <td className="p-3 text-right text-xs">{getDirectionIcon(asset.direction)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Permissions Granted */}
      {result.permissionsGranted && result.permissionsGranted.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-[var(--status-caution)]">
            <Key className="w-4 h-4" /> Permissions Granted ({result.permissionsGranted.length})
          </h3>
          <div className="space-y-2">
            {result.permissionsGranted.map((perm: any, i: number) => (
              <div
                key={i}
                className={`p-3 rounded-lg border text-sm ${
                  perm.risk === 'CRITICAL' || perm.risk === 'HIGH'
                    ? 'bg-[var(--status-risk-bg)]/30 border-[var(--status-risk)]/20'
                    : perm.risk === 'MEDIUM'
                    ? 'bg-[var(--status-caution-bg)]/30 border-[var(--status-caution)]/20'
                    : 'bg-[var(--bg-surface)] border-[var(--border-subtle)]'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-[var(--text-primary)]">{perm.permission}</span>
                  <div className="flex gap-1.5 shrink-0">
                    <Badge variant={getRiskVariant(perm.risk)} className="text-xs">{perm.risk}</Badge>
                  </div>
                </div>
                <div className="text-[10px] uppercase tracking-wider text-[var(--text-tertiary)]">
                  Scope: {perm.scope}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gas Info */}
      {result.gasInfo && (
        <div className="mb-8">
          <Card className="bg-[var(--bg-surface)] border-[var(--border-subtle)] !p-4">
            <div className="flex items-center gap-2">
              <Fuel className="w-4 h-4 text-[var(--text-tertiary)]" />
              <span className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Gas</span>
            </div>
            <div className="text-sm text-[var(--text-secondary)] mt-1">{result.gasInfo}</div>
          </Card>
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
