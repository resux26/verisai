import { createClient } from '@/lib/database/supabase/server';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ArrowRight, Search, ShieldCheck, BarChart3, Wallet, History, FileText } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AGENT_CONFIGS, type AgentId } from '@/lib/agents/config';
import { getUserTokenData } from '@/lib/token/service';

const AGENT_COLORS: Record<string, string> = {
  authenticity: '#10B981',
  value: '#3B82F6',
  trust: '#F59E0B',
  document: '#8B5CF6',
  career: '#EC4899',
  web3: '#06B6D4',
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch real data
  let analyses: any[] = [];
  let proofs: any[] = [];
  let totalAnalyses = 0;
  let totalProofs = 0;
  
  // Token and Reputation
  const tokenData = await getUserTokenData();
  const reputation = tokenData?.reputation || { total_points: 0, level_name: 'Explorer' };
  const tokenAccount = tokenData?.tokenAccount || { token_balance: 0 };
  const recentEvents = tokenData?.transactions || [];

  try {
    const { data: userAnalyses, count: analysisCount } = await supabase
      .from('analyses')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);
    
    analyses = userAnalyses || [];
    totalAnalyses = analysisCount || analyses.length;

    const { data: userProofs, count: proofCount } = await supabase
      .from('proofs')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    proofs = userProofs || [];
    totalProofs = proofCount || proofs.length;
  } catch (e) {
    // DB may not be fully set up
  }

  // Compute agent usage breakdown
  const agentUsage: Record<string, number> = {};
  analyses.forEach((a: any) => {
    const agent = a.agent_type || 'unknown';
    agentUsage[agent] = (agentUsage[agent] || 0) + 1;
  });

  return (
    <div className="section py-10 animate-fade-in-up min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-10 border-b border-[var(--border-subtle)] pb-6">
        <div>
          <h1 className="font-display text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-[var(--text-secondary)]">
            Welcome back, {user.email?.split('@')[0]}
          </p>
        </div>
        <Link href="/agents">
          <Button>New Analysis <ArrowRight className="w-4 h-4 ml-2" /></Button>
        </Link>
      </div>

      {/* Large Stats Grid (Puvexa Style) */}
      <div className="flex flex-wrap justify-between items-center gap-8 mb-16 px-4 md:px-12 text-center">
        <div>
          <div className="text-4xl md:text-5xl font-bold font-mono tracking-tight mb-2">
            {totalAnalyses > 0 ? `${totalAnalyses}+` : '0'}
          </div>
          <div className="text-sm text-[var(--text-secondary)] font-medium">Analyses Run</div>
        </div>
        
        <div>
          <div className="text-4xl md:text-5xl font-bold font-mono tracking-tight mb-2">
            {totalProofs > 0 ? `${totalProofs}+` : '0'}
          </div>
          <div className="text-sm text-[var(--text-secondary)] font-medium">Proofs Registered</div>
        </div>
        
        <div>
          <div className="text-4xl md:text-5xl font-bold font-mono tracking-tight mb-2">
            {reputation.total_points > 0 ? `${reputation.total_points.toLocaleString()}+` : '0'}
          </div>
          <div className="text-sm text-[var(--text-secondary)] font-medium">Reputation Points</div>
        </div>

        <div>
          <div className="text-4xl md:text-5xl font-bold font-mono tracking-tight mb-2">
            {tokenAccount.token_balance > 0 ? `${tokenAccount.token_balance.toLocaleString()}+` : '0'}
          </div>
          <div className="text-sm text-[var(--text-secondary)] font-medium">CRX Earned</div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Recent Analyses */}
        <div>
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <History className="w-4 h-4 text-[var(--text-tertiary)]" />
              Recent Analyses
            </h2>
            <Link href="/history" className="text-xs text-[var(--accent-analysis)] hover:underline">View All</Link>
          </div>
          
          <div className="space-y-3">
            {analyses.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-[var(--border-subtle)] rounded-xl bg-[var(--bg-surface)]">
                <Search className="w-10 h-10 text-[var(--text-tertiary)] mx-auto mb-3 opacity-50" />
                <p className="text-sm text-[var(--text-secondary)] mb-4">No analyses yet</p>
                <Link href="/agents"><Button size="sm">Start Your First Analysis</Button></Link>
              </div>
            )}
            {analyses.map((a: any) => {
              const agentConfig = AGENT_CONFIGS[a.agent_type as AgentId];
              return (
                <Card key={a.id} className="!p-4 border-[var(--border-subtle)] hover:border-[var(--border-hover)] transition-colors">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-white shrink-0"
                      style={{ background: agentConfig?.gradient || AGENT_COLORS[a.agent_type] || '#6B7280' }}
                    >
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">{a.title}</div>
                      <div className="text-[11px] text-[var(--text-tertiary)] capitalize">
                        {a.agent_type} · {new Date(a.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                      {a.structured_result?.verdict && (
                        <Badge variant="default" className="text-[10px] hidden sm:inline-flex">
                          {a.structured_result.verdict}
                        </Badge>
                      )}
                      {a.structured_result?.confidence != null && (
                        <span className="text-xs font-mono font-bold text-[var(--accent-analysis)]">
                          {a.structured_result.confidence}%
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Proofs */}
        <div>
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--text-tertiary)]" />
              Recent Proofs
            </h2>
            <Link href="/proofs" className="text-xs text-[var(--accent-proof)] hover:underline">View All</Link>
          </div>
          
          <div className="space-y-3">
            {proofs.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-[var(--border-subtle)] rounded-xl bg-[var(--bg-surface)]">
                <ShieldCheck className="w-10 h-10 text-[var(--text-tertiary)] mx-auto mb-3 opacity-50" />
                <p className="text-sm text-[var(--text-secondary)] mb-4">No proofs registered yet</p>
                <p className="text-xs text-[var(--text-tertiary)] max-w-xs mx-auto">
                  Run an analysis, then create an on-chain proof to anchor it permanently.
                </p>
              </div>
            )}
            {proofs.map((p: any) => (
              <Card key={p.id} className="!p-4 border-[var(--border-subtle)] hover:border-[var(--border-hover)] transition-colors">
                <div className="flex justify-between items-center mb-1.5">
                  <div className="font-mono text-sm font-bold text-[var(--accent-proof)]">
                    Proof #{p.proof_id_onchain || '—'}
                  </div>
                  <span className="text-[10px] text-[var(--text-tertiary)]">{p.blockchain_network || 'Base Sepolia'}</span>
                </div>
                <div className="font-mono text-[11px] text-[var(--text-secondary)] truncate opacity-50">
                  {p.transaction_hash || 'No tx hash'}
                </div>
                <div className="text-[11px] text-[var(--text-tertiary)] mt-1">
                  {new Date(p.created_at).toLocaleDateString()}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Agent Usage Breakdown */}
      {Object.keys(agentUsage).length > 0 && (
        <div className="mt-10 pt-8 border-t border-[var(--border-subtle)]">
          <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[var(--text-tertiary)]" />
            Agent Usage
          </h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(agentUsage).map(([agent, count]) => {
              const config = AGENT_CONFIGS[agent as AgentId];
              return (
                <div 
                  key={agent}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)]"
                >
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ background: config?.accentHex || '#6B7280' }}
                  />
                  <span className="text-sm font-medium capitalize">{agent}</span>
                  <span className="text-xs font-mono text-[var(--text-tertiary)]">×{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Activity (Token Events) */}
      {recentEvents.length > 0 && (
        <div className="mt-10 pt-8 border-t border-[var(--border-subtle)]">
          <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
            <History className="w-4 h-4 text-[var(--text-tertiary)]" />
            Recent Activity
          </h2>
          <div className="space-y-3 max-w-2xl">
            {recentEvents.map((tx: any) => (
              <div key={tx.id} className="flex justify-between items-center p-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                <div>
                  <div className="text-sm font-medium">{tx.description}</div>
                  <div className="text-xs text-[var(--text-tertiary)]">{new Date(tx.created_at).toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-[var(--accent-analysis)]">+{tx.amount} CRX</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
