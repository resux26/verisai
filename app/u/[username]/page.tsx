import { createClient } from '@/lib/database/supabase/server';
import { Card } from '@/components/ui/Card';
import { notFound } from 'next/navigation';
import { ShieldCheck, Hexagon, User } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const unwrappedParams = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', unwrappedParams.username)
    .single();

  if (!profile) {
    notFound();
  }

  const { data: proofs } = await supabase
    .from('proofs')
    .select('*, analyses(title, agent_type, is_public)')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })
    .limit(20);
    
  // Filter for only public analyses
  const publicProofs = proofs?.filter(p => p.analyses?.is_public) || [];

  return (
    <div className="section py-10 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-6 mb-12 animate-fade-in-up">
          <div className="w-24 h-24 rounded-full bg-bg-elevated flex items-center justify-center overflow-hidden border border-border-default shadow-glow">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.full_name || profile.username} className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-text-tertiary" />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{profile.full_name || profile.username}</h1>
            <p className="text-accent-secondary mb-2">@{profile.username}</p>
            {profile.bio && <p className="text-text-secondary text-sm max-w-lg">{profile.bio}</p>}
          </div>
        </div>

        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-border-default pb-4">
          <ShieldCheck className="w-5 h-5 text-accent-primary" /> Public Proofs
        </h2>

        <div className="grid gap-4">
          {publicProofs.length === 0 && (
            <div className="py-10 text-center border border-dashed border-border-default rounded-xl bg-bg-secondary text-text-secondary">
              <Hexagon className="w-10 h-10 mx-auto mb-2 opacity-50" />
              {profile.username} has no public proofs.
            </div>
          )}

          {publicProofs.map((p: any) => (
            <Card key={p.id} className="p-4 bg-bg-secondary border-border-default flex justify-between items-center hover:border-accent-primary/50 transition-colors">
              <div>
                <div className="font-bold">{p.analyses?.title}</div>
                <div className="text-xs text-text-tertiary capitalize mt-1">
                  {p.analyses?.agent_type} Agent • Proof #{p.proof_id_onchain}
                </div>
              </div>
              <div className="flex gap-2">
                <div className="text-[10px] font-bold text-color-success bg-color-success-bg px-2 py-1 rounded inline-block h-min">ON-CHAIN</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
