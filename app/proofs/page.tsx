import { createClient } from '@/lib/database/supabase/server';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, ExternalLink, Search } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AGENT_CONFIGS, type AgentId } from '@/lib/agents/config';

export default async function MyProofsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  let proofs: any[] = [];

  try {
    const { data } = await supabase
      .from('proofs')
      .select('*, analyses(title, agent_type)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    proofs = data || [];
  } catch (e) {
    // DB may not be set up
  }

  return (
    <div className="section py-10 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-10 border-b border-[var(--border-subtle)] pb-6 animate-fade-in-up">
        <div>
          <h1 className="font-display text-3xl font-bold mb-2 flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-[var(--accent-proof)]" />
            My Verified Proofs
          </h1>
          <p className="text-[var(--text-secondary)]">
            Your cryptographic records registered on Base Sepolia.
          </p>
        </div>
        <Link href="/verify">
          <Button variant="secondary">Verify a File</Button>
        </Link>
      </div>

      <div className="grid gap-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        {proofs.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-[var(--border-subtle)] rounded-xl bg-[var(--bg-surface)] flex flex-col items-center justify-center">
            <ShieldCheck className="w-16 h-16 text-[var(--text-tertiary)] mb-4 opacity-30" />
            <h3 className="text-xl font-bold mb-2">No Proofs Yet</h3>
            <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
              Run an AI analysis, then create an on-chain proof to anchor it permanently on the blockchain.
            </p>
            <Link href="/agents"><Button>Analyze &amp; Register</Button></Link>
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
