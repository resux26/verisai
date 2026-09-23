import { createClient } from '@/lib/database/supabase/server';
import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Trophy, FileText, ShieldCheck, MapPin, Link as LinkIcon, Calendar, User as UserIcon, Search } from 'lucide-react';
import Link from 'next/link';

export default async function PublicProfilePage({ params }: { params: { username: string } }) {
  const supabase = await createClient();
  const username = params.username;

  // 1. Fetch Profile and Reputation
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, user_reputation(*)')
    .eq('username', username)
    .single();

  if (!profile) {
    notFound();
  }

  const rep = profile.user_reputation?.[0] || { total_points: 0, level_name: 'Explorer', analyses_count: 0, proofs_count: 0 };

  // 2. Fetch Public Analyses
  const { data: publicAnalyses } = await supabase
    .from('analyses')
    .select('id, title, agent_type, created_at, structured_result')
    .eq('user_id', profile.id)
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(10);

  // 3. Fetch Public Templates
  const { data: publicTemplates } = await supabase
    .from('cv_templates')
    .select('id, title, category, experience_level, download_count, view_count, created_at')
    .eq('user_id', profile.id)
    .eq('visibility', 'public')
    .order('created_at', { ascending: false })
    .limit(10);

  return (
    <div className="min-h-screen pb-20">
      {/* Cover / Header Area */}
      <div className="h-48 md:h-64 bg-gradient-to-br from-[var(--bg-elevated)] to-[#1a1b26] border-b border-[var(--border-subtle)] relative" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-16 sm:-mt-24 mb-8 sm:mb-12 flex flex-col sm:flex-row gap-6 sm:items-end">
          {/* Avatar */}
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-[var(--bg-primary)] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl sm:text-5xl font-bold text-white shadow-xl shrink-0">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.username} className="w-full h-full rounded-full object-cover" />
            ) : (
              profile.full_name?.substring(0, 2).toUpperCase() || 'U'
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 pb-2">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              {profile.full_name}
              
            </h1>
            <p className="text-[var(--text-secondary)] text-lg mb-4">@{profile.username}</p>
            
            <div className="flex flex-wrap gap-4 text-sm text-[var(--text-tertiary)]">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> Joined {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>
          
          {/* Rank/Reputation Highlight */}
          <Card className="!p-4 sm:!p-6 border-[var(--border-subtle)] bg-[var(--bg-surface)] shrink-0 w-full sm:w-auto text-center sm:text-right">
            <div className="text-[10px] uppercase tracking-widest text-[var(--text-tertiary)] font-bold mb-1">Reputation</div>
            <div className="text-3xl font-bold font-mono text-[var(--accent-analysis)] mb-1">
              {rep.total_points.toLocaleString()}
            </div>
            <Badge variant="secondary" className="bg-[var(--bg-elevated)]">{rep.level_name}</Badge>
          </Card>
        </div>

        {/* Bio if exists */}
        {profile.bio && (
          <div className="text-[var(--text-secondary)] max-w-3xl mb-10 text-lg leading-relaxed">
            {profile.bio}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar (Stats) */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="!p-5 border-[var(--border-subtle)]">
              <h3 className="font-bold mb-4 uppercase text-xs tracking-wider text-[var(--text-tertiary)]">Community Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <FileText className="w-4 h-4" /> Analyses
                  </div>
                  <div className="font-mono font-bold">{rep.analyses_count || 0}</div>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <ShieldCheck className="w-4 h-4" /> Verified Proofs
                  </div>
                  <div className="font-mono font-bold">{rep.proofs_count || 0}</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Public Templates */}
            <section>
              <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[var(--accent-analysis)]" />
                Published CV Templates
              </h2>
              {(!publicTemplates || publicTemplates.length === 0) ? (
                <div className="p-8 border-2 border-dashed border-[var(--border-subtle)] rounded-xl text-center text-[var(--text-tertiary)]">
                  No public templates yet.
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {publicTemplates.map(t => (
                    <Card key={t.id} className="!p-4 border-[var(--border-subtle)] hover:border-[var(--border-hover)] transition-colors">
                      <Link href={`/career/templates/${t.id}`}>
                        <div className="font-bold mb-1">{t.title}</div>
                        <div className="text-xs text-[var(--text-secondary)] mb-3">{t.category} · {t.experience_level}</div>
                        <div className="flex items-center gap-4 text-[11px] text-[var(--text-tertiary)]">
                          <span>{t.download_count} downloads</span>
                          <span>{t.view_count} views</span>
                        </div>
                      </Link>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            {/* Public Analyses */}
            <section>
              <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
                <Search className="w-5 h-5 text-[var(--accent-proof)]" />
                Public Analyses
              </h2>
              {(!publicAnalyses || publicAnalyses.length === 0) ? (
                <div className="p-8 border-2 border-dashed border-[var(--border-subtle)] rounded-xl text-center text-[var(--text-tertiary)]">
                  No public analyses shared yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {publicAnalyses.map(a => (
                    <Card key={a.id} className="!p-4 border-[var(--border-subtle)] hover:border-[var(--border-hover)] transition-colors">
                      <Link href={`/verify/${a.id}`}>
                        <div className="flex justify-between items-start mb-1">
                          <div className="font-bold text-sm">{a.title}</div>
                          {a.structured_result?.confidence != null && (
                            <span className="text-xs font-mono font-bold text-[var(--accent-analysis)]">
                              {a.structured_result.confidence}%
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[var(--text-secondary)] capitalize">
                          {a.agent_type} Agent · {new Date(a.created_at).toLocaleDateString()}
                        </div>
                      </Link>
                    </Card>
                  ))}
                </div>
              )}
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
