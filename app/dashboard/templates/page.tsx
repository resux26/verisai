import { createClient } from '@/lib/database/supabase/server';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FileText, Plus, Edit2, Trash2, Eye, Download, Search } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Templates | Crexto Dashboard',
};

export default async function ManageTemplatesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch user's templates
  let templates: any[] = [];
  try {
    const { data } = await supabase
      .from('cv_templates')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    templates = data || [];
  } catch (e) {
    // DB error
  }

  return (
    <div className="section py-10 animate-fade-in-up min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-10 border-b border-[var(--border-subtle)] pb-6">
        <div>
          <div className="text-sm text-[var(--text-tertiary)] mb-2 flex items-center gap-2">
            <Link href="/dashboard" className="hover:text-[var(--text-primary)]">Dashboard</Link>
            <span>/</span>
            <span className="text-[var(--text-secondary)]">Templates</span>
          </div>
          <h1 className="font-display text-3xl font-bold mb-2">My Templates</h1>
          <p className="text-[var(--text-secondary)]">
            Manage your uploaded CV and Resume templates.
          </p>
        </div>
        <Link href="/dashboard/templates/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> Upload New Template
          </Button>
        </Link>
      </div>

      {templates.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-[var(--border-subtle)] rounded-xl bg-[var(--bg-surface)] flex flex-col items-center justify-center max-w-2xl mx-auto">
          <FileText className="w-12 h-12 text-[var(--text-tertiary)] mb-4 opacity-50" />
          <h3 className="text-xl font-bold mb-2">No Templates Uploaded</h3>
          <p className="text-[var(--text-secondary)] mb-6 text-center max-w-sm mx-auto">
            Share your best CV formats with the community to earn reputation points and CRX tokens.
          </p>
          <Link href="/dashboard/templates/new">
            <Button>Upload Template</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {templates.map(t => (
            <Card key={t.id} className="!p-5 border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-[var(--border-hover)] transition-colors">
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-16 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center shrink-0">
                  {t.preview_path ? (
                    <img src={t.preview_path} alt={t.title} className="w-full h-full object-cover rounded opacity-80" />
                  ) : (
                    <FileText className="w-6 h-6 text-[var(--text-tertiary)] opacity-50" />
                  )}
                </div>
                
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-lg">{t.title}</h3>
                    <Badge variant={t.visibility === 'public' ? 'default' : 'secondary'} className="text-[10px]">
                      {t.visibility}
                    </Badge>
                  </div>
                  <div className="text-sm text-[var(--text-secondary)] mb-2">
                    {t.category} · {t.experience_level}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[var(--text-tertiary)]">
                    <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> {t.view_count}</span>
                    <span className="flex items-center gap-1.5"><Download className="w-3.5 h-3.5" /> {t.download_count}</span>
                    <span className="flex items-center gap-1.5"><Search className="w-3.5 h-3.5" /> {new Date(t.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:self-center">
                {t.visibility === 'public' && (
                  <Link href={`/career/templates/${t.id}`}>
                    <Button variant="outline" size="sm" className="gap-2 px-3">
                      <Eye className="w-3.5 h-3.5" /> View
                    </Button>
                  </Link>
                )}
                <Button variant="outline" size="sm" className="px-3" title="Edit Template">
                  <Edit2 className="w-3.5 h-3.5" />
                </Button>
                <Button variant="outline" size="sm" className="px-3 text-[var(--status-risk)] hover:text-white hover:bg-[var(--status-risk)] hover:border-[var(--status-risk)]" title="Delete Template">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
