import { createClient } from '@/lib/database/supabase/server';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Search, Download, Eye, FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crexto AI CV Templates | Career Templates',
  description: 'Browse community-created CV and resume templates optimized for AI screening and ATS systems.',
};

export default async function TemplateGalleryPage() {
  const supabase = await createClient();

  let templates: any[] = [];

  try {
    const { data } = await supabase
      .from('cv_templates')
      .select('*, profiles(username, full_name)')
      .eq('visibility', 'public')
      .order('created_at', { ascending: false })
      .limit(20);
    templates = data || [];
  } catch (e) {
    // DB error
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] py-16">
        <div className="max-w-[1200px] mx-auto px-4 text-center animate-fade-in-up">
          <Badge variant="accent" className="mb-6 uppercase tracking-widest text-[10px]">
            Career Studio
          </Badge>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Community CV Templates
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-8">
            Build better applications with community-created CV templates. Found a great format? Upload it to earn reputation.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/dashboard/templates">
              <Button>Upload Template</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 pt-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        
        {/* Basic Filters placeholder for UI */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-[var(--border-subtle)] pb-6">
          {['All', 'ATS Friendly', 'Modern', 'Executive', 'Creative', 'Technical'].map(t => (
            <button key={t} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${t === 'All' ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]' : 'bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
              {t}
            </button>
          ))}
        </div>

        {templates.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-[var(--border-subtle)] rounded-xl bg-[var(--bg-surface)] flex flex-col items-center justify-center">
            <FileText className="w-12 h-12 text-[var(--text-tertiary)] mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">No Templates Yet</h3>
            <p className="text-[var(--text-secondary)] mb-6">Be the first to share a CV template with the community.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {templates.map(t => (
              <Link key={t.id} href={`/career/templates/${t.id}`} className="group">
                <Card className="h-full border-[var(--border-subtle)] hover:border-[var(--accent-analysis)]/50 transition-colors overflow-hidden flex flex-col !p-0">
                  {/* Preview Area */}
                  <div className="aspect-[1/1.2] bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)] relative overflow-hidden flex items-center justify-center group-hover:bg-[var(--bg-hover)] transition-colors">
                    {t.is_demo && (
                      <div className="absolute top-2 left-2 z-10">
                        
                      </div>
                    )}
                    {t.preview_path ? (
                      <img src={t.preview_path} alt={t.title} className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 transition-opacity" />
                    ) : (
                      <FileText className="w-16 h-16 text-[var(--text-tertiary)] opacity-30" />
                    )}
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <Button variant="primary" className="shadow-xl">View Details</Button>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-base mb-1 group-hover:text-[var(--accent-analysis)] transition-colors line-clamp-1">{t.title}</h3>
                    
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <span className="text-[10px] px-2 py-0.5 rounded-sm bg-[var(--bg-elevated)] text-[var(--text-secondary)]">{t.category}</span>
                      {t.experience_level && <span className="text-[10px] px-2 py-0.5 rounded-sm bg-[var(--bg-elevated)] text-[var(--text-secondary)]">{t.experience_level}</span>}
                    </div>

                    <div className="mt-auto pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-tertiary)]">
                      <span className="truncate pr-2">By @{t.profiles?.username || 'unknown'}</span>
                      <span className="flex items-center gap-1 shrink-0 font-mono"><Download className="w-3 h-3"/> {t.download_count}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
