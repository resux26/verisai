import { createClient } from '@/lib/database/supabase/server';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, ExternalLink, Hexagon } from 'lucide-react';
import Link from 'next/link';

export default async function MyProofsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const isDemo = !process.env.NEXT_PUBLIC_SUPABASE_URL || !user;
  
  let proofs = [];

  if (!isDemo && user) {
    const { data } = await supabase
      .from('proofs')
      .select('*, analyses(title, agent_type)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    proofs = data || [];
  }

  return (
    <div className="section py-10 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-10 border-b border-[var(--border-subtle)] pb-6 animate-fade-in-up">
        <div>
          <h1 className="font-display text-3xl font-bold mb-2">My Verified Proofs</h1>
          <p className="text-[var(--text-secondary)]">
            Your cryptographic records registered on Base Sepolia.
          </p>
        </div>
        <Link href="/verify">
          <Button variant="secondary">Verify a File</Button>
        </Link>
      </div>

      <div className="grid gap-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        {isDemo && (
          <Card className="p-6 border-[var(--border-subtle)]">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--status-good-bg)] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-[var(--status-good)]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Demo MacBook Analysis</h3>
                  <div className="text-sm text-[var(--text-secondary)] mt-1">Value Agent · Verified 2 days ago</div>
                </div>
              </div>
              <div className="sm:text-right shrink-0">
                <div className="text-xs text-[var(--text-tertiary)] mb-1">Status</div>
                <Badge variant="verified">On-chain</Badge>
              </div>
            </div>
            
            <div className="bg-[var(--bg-base)] p-4 rounded-lg border border-[var(--border-subtle)] mb-4 grid sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-[var(--text-tertiary)] block mb-1">Proof ID</span>
                <span className="text-[var(--accent-proof)]">#10284</span>
              </div>
              <div>
                <span className="text-[var(--text-tertiary)] block mb-1">Transaction</span>
                <span className="text-[var(--text-secondary)] truncate block">0x8a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z</span>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="ghost" size="sm" disabled>View Transaction <ExternalLink className="ml-2 w-4 h-4" /></Button>
              <Button size="sm">Public Link</Button>
            </div>
          </Card>
        )}

        {!isDemo && proofs.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-[var(--border-subtle)] rounded-xl bg-[var(--bg-surface)] flex flex-col items-center justify-center">
            <Hexagon className="w-16 h-16 text-[var(--text-tertiary)] mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">No Proofs Yet</h3>
            <p className="text-[var(--text-secondary)] mb-6">You haven't registered any analyses on the blockchain.</p>
            <Link href="/agents"><Button>Analyze & Register</Button></Link>
          </div>
        )}

        {!isDemo && proofs.map((p: any) => (
           <Card key={p.id} className="p-6 border-[var(--border-subtle)]">
           <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
             <div className="flex gap-4">
               <div className="w-12 h-12 rounded-xl bg-[var(--status-good-bg)] flex items-center justify-center shrink-0">
                 <ShieldCheck className="w-6 h-6 text-[var(--status-good)]" />
               </div>
               <div>
                 <h3 className="text-lg font-bold">{p.analyses?.title || 'Unknown Analysis'}</h3>
                 <div className="text-sm text-[var(--text-secondary)] mt-1 capitalize">{p.analyses?.agent_type || 'Custom'} Agent · Verified {new Date(p.created_at).toLocaleDateString()}</div>
               </div>
             </div>
             <div className="sm:text-right shrink-0">
               <div className="text-xs text-[var(--text-tertiary)] mb-1">Status</div>
               <Badge variant="verified">On-chain</Badge>
             </div>
           </div>
           
           <div className="bg-[var(--bg-base)] p-4 rounded-lg border border-[var(--border-subtle)] mb-4 grid sm:grid-cols-2 gap-4 text-xs font-mono">
             <div>
               <span className="text-[var(--text-tertiary)] block mb-1">Proof ID</span>
               <span className="text-[var(--accent-proof)]">#{p.proof_id_onchain}</span>
             </div>
             <div>
               <span className="text-[var(--text-tertiary)] block mb-1">Transaction</span>
               <span className="text-[var(--text-secondary)] truncate block">{p.transaction_hash}</span>
             </div>
           </div>

           <div className="flex justify-end gap-4">
             <Button variant="ghost" size="sm" asChild>
               <a href={`https://sepolia.basescan.org/tx/${p.transaction_hash}`} target="_blank" rel="noopener noreferrer">
                 Explorer <ExternalLink className="ml-2 w-4 h-4" />
               </a>
             </Button>
           </div>
         </Card>
        ))}
      </div>
    </div>
  );
}
