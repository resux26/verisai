'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Hash, FileCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function VerifySearchPage() {
  const router = useRouter();
  const [proofId, setProofId] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (proofId.trim()) {
      router.push(`/verify/${proofId.trim()}`);
    }
  };

  return (
    <div className="section w-full max-w-3xl py-20 flex flex-col items-center">
      <div className="text-center mb-12 animate-fade-in-up">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-glow text-accent-primary mb-6">
          <FileCheck className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Verify a Proof</h1>
        <p className="text-text-secondary text-lg max-w-xl mx-auto">
          Look up a cryptographic proof by its ID to check its registration details and verify the integrity of the original file.
        </p>
      </div>

      <Card className="w-full p-8 animate-fade-in-up stagger-1">
        <form onSubmit={handleSearch} className="flex flex-col gap-4">
          <label className="text-sm font-medium text-text-secondary">Enter Proof ID</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Hash className="w-5 h-5 text-text-tertiary" />
              </div>
              <Input 
                value={proofId}
                onChange={(e) => setProofId(e.target.value)}
                placeholder="e.g. 1"
                className="pl-10 text-lg py-3"
                type="number"
                min="1"
              />
            </div>
            <Button 
              type="submit" 
              className="py-3 px-8"
              disabled={!proofId.trim()}
            >
              <Search className="w-4 h-4 mr-2" /> Search
            </Button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-border-default">
          <h3 className="text-sm font-medium text-text-secondary mb-3">Try checking a Sample Proof:</h3>
          <div className="flex gap-2">
            {[1, 2, 3].map((id) => (
              <Button 
                key={id}
                variant="ghost" 
                className="bg-bg-secondary border border-border-default"
                onClick={() => router.push(`/verify/${id}`)}
              >
                Demo Proof #{id}
              </Button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
