import { createClient } from '@/lib/database/supabase/server';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowRight, FileText, Hexagon, Search, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If missing API keys, show Demo dashboard
  const isDemo = !process.env.NEXT_PUBLIC_SUPABASE_URL || !user;

  let analyses = [];
  let proofs = [];

  if (!isDemo && user) {
    const { data: userAnalyses } = await supabase
      .from('analyses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);
    
    analyses = userAnalyses || [];

    const { data: userProofs } = await supabase
      .from('proofs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    proofs = userProofs || [];
  }

  return (
    <div className="section py-10 animate-fade-in-up min-h-screen">
      <div className="flex justify-between items-end mb-10 border-b border-border-default pb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-text-secondary">
            {isDemo ? 'Welcome to the Demo Dashboard.' : `Welcome back, ${user.email}`}
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/agents">
            <Button>Analyze Something <ArrowRight className="w-4 h-4 ml-2" /></Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 rounded-full bg-[var(--accent-analysis-dim)] flex items-center justify-center">
              <Search className="w-5 h-5 text-[var(--accent-analysis)]" />
            </div>
            <div className="text-3xl font-bold">{isDemo ? '12' : analyses.length}</div>
          </div>
          <div className="text-sm font-semibold text-[var(--text-secondary)]">AI Analyses</div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 rounded-full bg-[var(--status-good-bg)] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[var(--status-good)]" />
            </div>
            <div className="text-3xl font-bold">{isDemo ? '4' : proofs.length}</div>
          </div>
          <div className="text-sm font-semibold text-[var(--text-secondary)]">Verified Proofs</div>
        </Card>
        
        <Card className="p-6 opacity-50 bg-[var(--bg-base)]">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center">
              <FileText className="w-5 h-5 text-[var(--text-secondary)]" />
            </div>
            <div className="text-3xl font-bold">0</div>
          </div>
          <div className="text-sm font-semibold text-[var(--text-secondary)]">Career Docs</div>
        </Card>

        <Card className="p-6 opacity-50 bg-[var(--bg-base)]">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center">
              <Hexagon className="w-5 h-5 text-[var(--text-secondary)]" />
            </div>
            <div className="text-3xl font-bold">1</div>
          </div>
          <div className="text-sm font-semibold text-[var(--text-secondary)]">Connected Wallet</div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Recent Analyses</h2>
            <Link href="/history" className="text-sm text-accent-primary hover:underline">View All</Link>
          </div>
          
          <div className="space-y-4">
            {isDemo && (
              <Card className="p-4 bg-[var(--bg-surface)] flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border-[var(--border-subtle)]">
                <div>
                  <div className="font-bold">Used MacBook Pro 14"</div>
                  <div className="text-xs text-[var(--text-tertiary)]">Value Agent • 2 hours ago</div>
                </div>
                <div className="shrink-0"><span className="badge badge-good">Fair Value</span></div>
              </Card>
            )}
            {!isDemo && analyses.length === 0 && (
              <div className="text-center py-10 bg-bg-secondary rounded border border-dashed border-border-hover text-text-secondary">
                No analyses yet. Start exploring agents to generate intelligence.
              </div>
            )}
            {analyses.map((a: any) => (
              <Card key={a.id} className="p-4 bg-[var(--bg-surface)] border-[var(--border-subtle)] flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                  <div className="font-bold">{a.title}</div>
                  <div className="text-xs text-[var(--text-tertiary)] capitalize">{a.agent_type} Agent • {new Date(a.created_at).toLocaleDateString()}</div>
                </div>
                <div className="shrink-0 text-xs font-semibold text-[var(--accent-analysis)] bg-[var(--accent-analysis-dim)] px-2 py-1 rounded">
                  {a.structured_result?.verdict || 'Done'}
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Recent Proofs</h2>
            <Link href="/proofs" className="text-sm text-accent-primary hover:underline">View All</Link>
          </div>
          
          <div className="space-y-4">
             {isDemo && (
              <Card className="p-4 bg-[var(--bg-surface)] border-[var(--border-subtle)]">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-mono text-sm text-[var(--accent-proof)]">Proof #10284</div>
                  <div className="text-xs text-[var(--text-tertiary)]">Base Sepolia</div>
                </div>
                <div className="text-sm font-medium">Used MacBook Pro 14" Analysis</div>
              </Card>
            )}
             {!isDemo && proofs.length === 0 && (
              <div className="text-center py-10 bg-bg-secondary rounded border border-dashed border-border-hover text-text-secondary">
                No proofs registered yet.
              </div>
            )}
             {proofs.map((p: any) => (
              <Card key={p.id} className="p-4 bg-[var(--bg-surface)] border-[var(--border-subtle)]">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-mono text-sm text-[var(--accent-proof)]">Proof #{p.proof_id_onchain}</div>
                  <div className="text-xs text-[var(--text-tertiary)]">{p.blockchain_network}</div>
                </div>
                <div className="text-xs font-mono truncate text-[var(--text-secondary)] opacity-50">{p.transaction_hash}</div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
