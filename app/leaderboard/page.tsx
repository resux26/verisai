import { createClient } from '@/lib/database/supabase/server';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Trophy, Star, TrendingUp, Search, User as UserIcon, Medal, Info, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crexto AI Community Leaderboard | Top Contributors',
  description: 'Explore the contributors building reputation through useful AI analyses and community knowledge on Crexto.',
};

const MEDAL_COLORS = [
  'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]',
  'text-slate-300 drop-shadow-[0_0_8px_rgba(203,213,225,0.5)]',
  'text-amber-600 drop-shadow-[0_0_8px_rgba(217,119,6,0.5)]'
];

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let topUsers: any[] = [];
  const currentUserRank = null;

  try {
    // Note: We use a raw select and order, since this is MVP.
    // In production, we'd use a materialized view for scale.
    const { data: repData } = await supabase
      .from('user_reputation')
      .select('*, profiles(username, full_name, avatar_url)')
      .order('total_points', { ascending: false })
      .limit(5);

    if (repData && repData.length > 0) {
      topUsers = repData;
    }
  } catch (e) {
    // Silently fail if DB is not ready
  }

  return (
    <div className="min-h-screen pb-20 relative">
      {/* Background elements */}
      <div className="absolute top-0 w-full h-[500px] bg-gradient-to-b from-[#1a1b26] to-transparent -z-10 pointer-events-none" />
      <div className="absolute top-0 w-full h-full bg-[url('/noise.png')] opacity-[0.03] -z-10 pointer-events-none mix-blend-overlay" />
      
      <div className="max-w-[1000px] mx-auto px-4 pt-16 md:pt-24 animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="accent" className="mb-6 uppercase tracking-widest text-[10px]">
            Community Leaderboard
          </Badge>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Top 5 Contributors
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Build reputation through useful analysis, verified knowledge, and meaningful contributions.
          </p>
        </div>

        {/* Filters */}
        <div className="flex justify-center mb-10">
          <div className="flex bg-[var(--bg-elevated)] p-1 rounded-xl border border-[var(--border-subtle)]">
            <button className="px-4 py-2 text-sm font-semibold rounded-lg bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm">
              Overall
            </button>
            <button className="px-4 py-2 text-sm font-medium rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
              This Week
            </button>
            <button className="px-4 py-2 text-sm font-medium rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
              This Month
            </button>
          </div>
        </div>

        {topUsers.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-[var(--border-subtle)] rounded-xl bg-[var(--bg-surface)] flex flex-col items-center justify-center">
            <Trophy className="w-12 h-12 text-[var(--text-tertiary)] mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">Leaderboard Empty</h3>
            <p className="text-[var(--text-secondary)] mb-6">Run the database seed script to populate demo users.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:gap-6 max-w-4xl mx-auto">

            
            {/* Top 3 Podium Style on Desktop, Stack on Mobile */}
            <div className="flex flex-col md:flex-row gap-4 mb-4 md:items-end justify-center md:h-[280px]">
              
              {/* Rank 2 (Left) */}
              {topUsers[1] && (
                <div className="w-full md:w-1/3 order-2 md:order-1 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <LeaderboardCard user={topUsers[1]} rank={2} isTop3={true} />
                </div>
              )}
              
              {/* Rank 1 (Center) */}
              {topUsers[0] && (
                <div className="w-full md:w-1/3 order-1 md:order-2 animate-fade-in-up md:-translate-y-6">
                  <LeaderboardCard user={topUsers[0]} rank={1} isTop3={true} />
                </div>
              )}
              
              {/* Rank 3 (Right) */}
              {topUsers[2] && (
                <div className="w-full md:w-1/3 order-3 md:order-3 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <LeaderboardCard user={topUsers[2]} rank={3} isTop3={true} />
                </div>
              )}
            </div>

            {/* Ranks 4 and 5 (Compact Rows) */}
            <div className="flex flex-col gap-3 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              {topUsers.slice(3, 5).map((u, i) => (
                <LeaderboardRow key={u.user_id} user={u} rank={4 + i} />
              ))}
            </div>
          </div>
        )}

        {/* Your Rank Section */}
        {user && (
          <div className="mt-16 max-w-4xl mx-auto">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-4">Your Crexto Rank</h3>
            <Card className="!p-0 border-[var(--border-subtle)] bg-[var(--bg-elevated)] overflow-hidden">
              <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[var(--accent-analysis)]/10 flex items-center justify-center border border-[var(--accent-analysis)]/20">
                    <UserIcon className="w-6 h-6 text-[var(--accent-analysis)]" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold">{user.email?.split('@')[0]}</h4>
                    <p className="text-sm text-[var(--text-secondary)]">You haven't earned reputation yet.</p>
                  </div>
                </div>
                <Link href="/agents">
                  <Button variant="outline" className="shrink-0 bg-transparent">
                    Start Your First Analysis
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function LeaderboardCard({ user, rank, isTop3 }: { user: any, rank: number, isTop3: boolean }) {
  const isRank1 = rank === 1;
  const p = user.profiles || {};
  
  return (
    <Link href={`/u/${p.username}`} className="block h-full group">
      <Card className={`
        relative h-full transition-all duration-300
        border-[var(--border-subtle)] hover:border-[var(--accent-analysis)]/40
        ${isRank1 ? 'bg-gradient-to-b from-[#1E212B] to-[#12141A] !p-6 shadow-[0_0_30px_rgba(99,102,241,0.05)]' : '!p-5 bg-[var(--bg-surface)]'}
      `}>
        {/* Rank Badge */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <div className={`
            flex items-center justify-center w-8 h-8 rounded-full border-2 border-[var(--bg-primary)] font-bold text-sm shadow-lg
            ${isRank1 ? 'bg-yellow-400 text-yellow-950' : rank === 2 ? 'bg-slate-300 text-slate-900' : 'bg-amber-600 text-white'}
          `}>
            #{rank}
          </div>
        </div>

        <div className="flex flex-col items-center text-center mt-6">
          <div className={`
            rounded-full flex items-center justify-center text-white font-bold mb-4 ring-4
            ${isRank1 ? 'w-20 h-20 text-2xl ring-[var(--accent-analysis)]/20 bg-gradient-to-br from-[#6366f1] to-[#a855f7]' : 'w-16 h-16 text-xl ring-[var(--border-subtle)] bg-gradient-to-br from-slate-600 to-slate-800'}
          `}>
            {p.full_name?.substring(0, 2).toUpperCase() || 'U'}
          </div>
          
          <h3 className={`font-bold truncate w-full ${isRank1 ? 'text-xl mb-1' : 'text-lg mb-0.5'}`}>
            {p.full_name}
          </h3>
          <p className="text-sm text-[var(--text-tertiary)] mb-5">@{p.username}</p>

          <div className={`
            w-full rounded-xl flex flex-col items-center justify-center mb-4
            ${isRank1 ? 'bg-[var(--accent-analysis)]/10 py-4 px-2' : 'bg-[var(--bg-base)] border border-[var(--border-subtle)] py-3 px-2'}
          `}>
            <div className={`font-mono font-bold leading-none mb-1 ${isRank1 ? 'text-3xl text-[var(--accent-analysis)]' : 'text-2xl text-[var(--text-primary)]'}`}>
              {user.total_points.toLocaleString()}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-[var(--text-tertiary)] font-bold">REP</div>
          </div>

          <div className="w-full flex justify-between text-xs text-[var(--text-secondary)] pt-4 border-t border-[var(--border-subtle)]">
            <span className="flex items-center gap-1.5"><Search className="w-3.5 h-3.5 opacity-50"/> {user.analyses_count || 0}</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 opacity-50"/> {user.proofs_count || 0}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

function LeaderboardRow({ user, rank }: { user: any, rank: number }) {
  const p = user.profiles || {};
  return (
    <Link href={`/u/${p.username}`} className="block group">
      <Card className="!p-4 sm:!px-6 border-[var(--border-subtle)] hover:border-[var(--border-hover)] bg-[var(--bg-surface)] transition-colors flex items-center justify-between gap-4">
        
        <div className="flex items-center gap-4 min-w-0">
          <div className="text-sm font-bold text-[var(--text-tertiary)] w-6 shrink-0">#{rank}</div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {p.full_name?.substring(0, 2).toUpperCase() || 'U'}
          </div>
          <div className="min-w-0 truncate pr-4">
            <h3 className="font-bold text-base truncate">{p.full_name}</h3>
            <p className="text-xs text-[var(--text-tertiary)] truncate">@{p.username}</p>
          </div>
        </div>

        <div className="flex items-center gap-8 shrink-0">
          <div className="hidden sm:flex items-center gap-4 text-xs text-[var(--text-tertiary)]">
            <span title="Analyses">{user.analyses_count || 0} analyses</span>
            <span title="Proofs">{user.proofs_count || 0} proofs</span>
          </div>
          
          <div className="text-right">
            <div className="font-mono font-bold text-base sm:text-lg text-[var(--text-primary)]">
              {user.total_points.toLocaleString()}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-[var(--text-tertiary)] font-bold">REP</div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
