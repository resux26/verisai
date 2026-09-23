import { createClient } from '@/lib/database/supabase/server';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { History, Search, FileText, ShieldCheck, TrendingUp, Eye, FileSearch, Briefcase, Blocks } from 'lucide-react';

const AGENT_COLORS: Record<string, string> = {
  authenticity: '#10B981',
  value: '#3B82F6',
  trust: '#F59E0B',
  document: '#8B5CF6',
  career: '#EC4899',
  web3: '#06B6D4',
};

export default async function HistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const isDemo = !process.env.NEXT_PUBLIC_SUPABASE_URL;

  let analyses: any[] = [];

  if (!isDemo) {
    const { data } = await supabase
      .from('analyses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);
    analyses = data || [];
  }

  return (
    <div className="section py-10 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-10 border-b border-[var(--border-subtle)] pb-6 animate-fade-in-up">
        <div>
          <h1 className="font-display text-3xl font-bold mb-2 flex items-center gap-3">
            <History className="w-7 h-7 text-[var(--accent-analysis)]" />
            Analysis History
          </h1>
          <p className="text-[var(--text-secondary)]">
            All your past AI analyses in one place.
          </p>
        </div>
        <Link href="/agents">
          <Button>New Analysis</Button>
        </Link>
      </div>

      <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        {analyses.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-[var(--border-subtle)] rounded-xl bg-[var(--bg-surface)] flex flex-col items-center justify-center">
            <Search className="w-16 h-16 text-[var(--text-tertiary)] mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">No Analyses Yet</h3>
            <p className="text-[var(--text-secondary)] mb-6">Run your first AI analysis to see it here.</p>
            <Link href="/agents"><Button>Choose an Agent</Button></Link>
          </div>
        )}

        {analyses.map((a: any) => (
          <Card key={a.id} className="p-4 border-[var(--border-subtle)] hover:border-[var(--border-hover)] transition-colors">
            <div className="flex items-center gap-4">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
                style={{ background: AGENT_COLORS[a.agent_type] || '#6B7280' }}
              >
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm truncate">{a.title}</div>
                <div className="text-xs text-[var(--text-tertiary)] mt-0.5 capitalize">
                  {a.agent_type} Agent · {new Date(a.created_at).toLocaleDateString()} · {new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                {a.structured_result?.verdict && (
                  <Badge variant="default" className="text-xs hidden sm:inline-flex">
                    {a.structured_result.verdict}
                  </Badge>
                )}
                {a.structured_result?.confidence && (
                  <span className="text-xs font-mono font-bold text-[var(--accent-analysis)]">
                    {a.structured_result.confidence}%
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
