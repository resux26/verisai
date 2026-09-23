'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FileText, ArrowLeft, Upload, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function NewTemplatePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;

    try {
      // Direct call to an API route to handle the upload
      const res = await fetch('/api/career/templates/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, description })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload template');
      }

      router.push('/dashboard/templates');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="section py-10 animate-fade-in-up min-h-screen">
      <div className="max-w-2xl mx-auto">
        
        <div className="mb-6 flex items-center gap-4">
          <Link href="/dashboard/templates">
            <Button variant="ghost" className="!p-2"><ArrowLeft className="w-5 h-5" /></Button>
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold">Upload CV Template</h1>
            <p className="text-[var(--text-secondary)] text-sm">Share your format with the community</p>
          </div>
        </div>

        <Card className="!p-6 sm:!p-8 border-[var(--border-subtle)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {error && (
              <div className="p-4 bg-[var(--status-risk)]/10 text-[var(--status-risk)] border border-[var(--status-risk)]/20 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-2">Template Title</label>
              <input 
                name="title"
                required
                type="text" 
                placeholder="e.g. Modern Tech Executive"
                className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg p-3 text-sm focus:border-[var(--text-primary)] outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Category</label>
              <select 
                name="category"
                required
                className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg p-3 text-sm focus:border-[var(--text-primary)] outline-none transition-colors"
              >
                <option value="ATS Friendly">ATS Friendly</option>
                <option value="Modern">Modern</option>
                <option value="Executive">Executive</option>
                <option value="Creative">Creative</option>
                <option value="Academic">Academic</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Description</label>
              <textarea 
                name="description"
                rows={4}
                placeholder="Describe what makes this template effective..."
                className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg p-3 text-sm focus:border-[var(--text-primary)] outline-none transition-colors"
              />
            </div>

            <div className="p-6 border-2 border-dashed border-[var(--border-subtle)] rounded-lg text-center bg-[var(--bg-base)] hover:border-[var(--text-primary)] transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-[var(--text-tertiary)] mx-auto mb-2" />
              <div className="text-sm font-bold mb-1">Click to upload template file</div>
              <div className="text-xs text-[var(--text-tertiary)]">PDF, DOCX, or Figma Link (Max 5MB)</div>
              {/* Note: File upload input is hidden for this mock implementation */}
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-bold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Uploading...</>
              ) : (
                'Publish Template'
              )}
            </Button>
            <p className="text-xs text-center text-[var(--text-tertiary)]">
              You will earn community reputation and tokens for sharing.
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
