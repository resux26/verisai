import { createClient } from '@/lib/database/supabase/server';
import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Download, FileText, Share2, Tag, Calendar, User as UserIcon, BarChart } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data } = await supabase.from('cv_templates').select('title, description').eq('id', params.id).single();
  return {
    title: `${data?.title || 'CV Template'} | Crexto Career Studio`,
    description: data?.description || 'View and use this community CV template.',
  };
}

export default async function TemplateDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  // 1. Fetch Template
  const { data: template, error } = await supabase
    .from('cv_templates')
    .select('*, profiles(username, full_name, avatar_url)')
    .eq('id', params.id)
    .single();

  if (error) {
    console.error('Error fetching template details:', error);
    throw new Error(`Database error: ${error.message || JSON.stringify(error)}`);
  }

  if (!template) {
    throw new Error(`Template not found in DB for ID: ${params.id}`);
  }

  // 2. Increment view count (if we had a mutation for it, or just RPC. Skipping for simple read in MVP)
  // In a real app: await supabase.rpc('increment_template_view', { t_id: template.id });

  const p = template.profiles || {};

  return (
    <div className="min-h-screen pb-20 bg-[var(--bg-base)]">
      <div className="max-w-6xl mx-auto px-4 pt-10 sm:pt-16">
        
        {/* Breadcrumb */}
        <div className="text-sm text-[var(--text-tertiary)] mb-6 flex items-center gap-2">
          <Link href="/career/templates" className="hover:text-[var(--text-primary)] transition-colors">Templates</Link>
          <span>/</span>
          <span className="text-[var(--text-secondary)]">{template.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Preview */}
          <div className="lg:col-span-7">
            <Card className="!p-2 border-[var(--border-subtle)] bg-[var(--bg-elevated)] overflow-hidden shadow-2xl">
              <div className="aspect-[1/1.3] bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-md flex items-center justify-center relative overflow-hidden">
                {template.is_demo && (
                  <div className="absolute top-4 left-4 z-10">
                    
                  </div>
                )}
                {template.preview_path ? (
                  <img src={template.preview_path} alt={template.title} className="w-full h-full object-contain" />
                ) : (
                  <div className="flex flex-col items-center text-[var(--text-tertiary)] opacity-50">
                    <FileText className="w-24 h-24 mb-4" />
                    <p>No preview available</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column: Details & Actions */}
          <div className="lg:col-span-5 flex flex-col pt-4 lg:pt-0">
            <h1 className="font-display text-3xl sm:text-4xl font-bold mb-4">{template.title}</h1>
            
            {/* Author */}
            <Link href={`/u/${p.username}`} className="flex items-center gap-3 mb-6 group inline-flex max-w-fit">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                {p.avatar_url ? (
                  <img src={p.avatar_url} alt={p.username} className="w-full h-full rounded-full object-cover" />
                ) : (
                  p.full_name?.substring(0, 2).toUpperCase() || 'U'
                )}
              </div>
              <div>
                <div className="font-bold text-sm group-hover:text-[var(--accent-analysis)] transition-colors">{p.full_name}</div>
                <div className="text-xs text-[var(--text-tertiary)]">@{p.username}</div>
              </div>
            </Link>

            <p className="text-[var(--text-secondary)] text-lg mb-8 leading-relaxed">
              {template.description || 'No description provided.'}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                <div className="text-xs uppercase tracking-widest text-[var(--text-tertiary)] font-bold mb-1">Category</div>
                <div className="font-medium">{template.category}</div>
              </div>
              <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                <div className="text-xs uppercase tracking-widest text-[var(--text-tertiary)] font-bold mb-1">Experience</div>
                <div className="font-medium">{template.experience_level || 'Any'}</div>
              </div>
              <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                <div className="text-xs uppercase tracking-widest text-[var(--text-tertiary)] font-bold mb-1">Industry</div>
                <div className="font-medium">{template.industry || 'Any'}</div>
              </div>
              <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                <div className="text-xs uppercase tracking-widest text-[var(--text-tertiary)] font-bold mb-1">Downloads</div>
                <div className="font-medium font-mono">{template.download_count}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 mt-auto">
              <Link href={`/analyze/career?templateId=${template.id}`} className="w-full">
                <Button className="w-full py-6 text-lg shadow-glow">
                  Use This Template
                </Button>
              </Link>
              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1">
                  <Download className="w-4 h-4 mr-2" /> Download Source
                </Button>
                <Button variant="outline" className="px-4 shrink-0">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
