import { createClient } from '@/lib/database/supabase/server';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, ExternalLink, Search, Globe } from 'lucide-react';
import Link from 'next/link';
import { AGENT_CONFIGS, type AgentId } from '@/lib/agents/config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore Proofs | Crexto AI',
  description: 'Publicly verified cryptographic records registered on Base Sepolia by the Crexto community.',
};

export default async function ExplorePage() {
  const supabase = await createClient();

  let proofs: any[] = [];

  try {
    const { data } = await supabase
      .from('proofs')
      .select('*, analyses(title, agent_type)')
      .order('created_at', { ascending: false })
      .limit(30);
    proofs = data || [];
  } catch (e) {
    // DB may not be fully set up
  }

  return (
    <div className="section py-10 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-10 border-b border-[var(--border-subtle)] pb-6 animate-fade-in-up">
        <div>
          <h1 className="font-display text-3xl font-bold mb-2 flex items-center gap-3">
            <Globe className="w-7 h-7 text-[var(--accent-proof)]" />
            Explore Proofs
          </h1>
          <p className="text-[var(--text-secondary)]">
            Publicly verified cryptographic records registered on Base Sepolia.
          </p>
        </div>
        <Link href="/verify">
          <Button variant="secondary">Verify a Proof</Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-10 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
        <Link href="/leaderboard" className="group">
          <Card className="!p-4 border-[var(--border-subtle)] hover:border-[var(--accent-analysis)]/50 transition-colors bg-[var(--bg-elevated)] flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/10 text-yellow-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm">Community Leaderboard</div>
              <div className="text-xs text-[var(--text-tertiary)]">Discover top contributors</div>
            </div>
          </Card>
        </Link>
        <Link href="/career/templates" className="group">
          <Card className="!p-4 border-[var(--border-subtle)] hover:border-[var(--accent-analysis)]/50 transition-colors bg-[var(--bg-elevated)] flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm">Career Templates</div>
              <div className="text-xs text-[var(--text-tertiary)]">Browse CV & Resume formats</div>
            </div>
          </Card>
        </Link>
      </div>

      <div className="mb-6 flex items-center gap-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-xl font-bold">Recent Proofs</h2>
      </div>

      <div className="grid gap-4 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
        {proofs.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-[var(--border-subtle)] rounded-xl bg-[var(--bg-surface)] flex flex-col items-center justify-center">
            <ShieldCheck className="w-16 h-16 text-[var(--text-tertiary)] mb-4 opacity-30" />
            <h3 className="text-xl font-bold mb-2">No Public Proofs Yet</h3>
            <p className="text-[var(--text-secondary)] mb-2 max-w-md mx-auto">
              The Crexto verification network is just getting started. Run an AI analysis and register the first on-chain proof.
            </p>
            <p className="text-xs text-[var(--text-tertiary)] mb-6">
              Proofs appear here once they are anchored on the blockchain.
            </p>
            <Link href="/agents"><Button>Be the First</Button></Link>
          </div>
        )}

        {proofs.map((p: any) => {
          const agentType = p.analyses?.agent_type as AgentId | undefined;
          const agentConfig = agentType ? AGENT_CONFIGS[agentType] : null;
          
          return (
            <Card key={p.id} className="!p-5 border-[var(--border-subtle)] hover:border-[var(--border-hover)] transition-colors">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                <div className="flex gap-4">
                  <div 
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0"
                    style={{ background: agentConfig?.gradient || 'linear-gradient(135deg, #6B7280, #4B5563)' }}
                  >
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold">{p.analyses?.title || 'Untitled Analysis'}</h3>
                    <div className="text-xs text-[var(--text-tertiary)] mt-0.5 capitalize">
                      {agentType || 'Custom'} Agent · {new Date(p.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <Badge variant="verified" className="shrink-0">On-Chain</Badge>
              </div>
              
              <div className="bg-[var(--bg-base)] p-3 rounded-lg border border-[var(--border-subtle)] grid sm:grid-cols-2 gap-3 text-xs font-mono mb-4">
                <div>
                  <span className="text-[var(--text-tertiary)] block mb-0.5">Proof ID</span>
                  <span className="text-[var(--accent-proof)] font-bold">#{p.proof_id_onchain}</span>
                </div>
                <div>
                  <span className="text-[var(--text-tertiary)] block mb-0.5">Transaction</span>
                  <span className="text-[var(--text-secondary)] truncate block">{p.transaction_hash}</span>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                {p.transaction_hash && (
                  <a 
                    href={`https://sepolia.basescan.org/tx/${p.transaction_hash}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    Explorer <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {p.proof_id_onchain && (
                  <Link 
                    href={`/verify/${p.proof_id_onchain}`}
                    className="flex items-center gap-1.5 text-xs text-[var(--accent-proof)] hover:underline"
                  >
                    <Search className="w-3 h-3" /> Verify
                  </Link>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
