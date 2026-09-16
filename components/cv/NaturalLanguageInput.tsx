import React, { useState } from 'react';
import { Bot, Sparkles, Send } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';

interface NaturalLanguageInputProps {
  onSubmit: (input: string) => void;
  isLoading: boolean;
}

export function NaturalLanguageInput({ onSubmit, isLoading }: NaturalLanguageInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSubmit(input);
    }
  };

  const samplePrompts = [
    "I'm a CSE student applying for a frontend developer job. I built a React e-commerce app and a Firebase chat app.",
    "I've been a graphic designer for 5 years, focusing on UI/UX for mobile apps. I want a portfolio summary.",
    "I'm a recent grad with a degree in data science. I know Python, SQL, and have a certificate in Machine Learning."
  ];

  return (
    <Card className="flex flex-col gap-6">
      <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-4">
        <Sparkles className="w-5 h-5 text-[#A855F7]" />
        <h3 className="text-lg font-semibold">Describe yourself naturally</h3>
      </div>
      
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
        Don't worry about formatting. Just tell our AI about your education, experience, skills, and the roles you're aiming for.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Textarea 
          placeholder="e.g., I'm a full-stack developer with 3 years of experience in Next.js and Tailwind..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-h-[150px]"
          disabled={isLoading}
        />
        
        <Button 
          type="submit" 
          disabled={!input.trim() || isLoading}
          isLoading={isLoading}
          className="self-end"
        >
          <Bot className="w-4 h-4 mr-2" />
          Generate Professional Profile
        </Button>
      </form>

      <div className="mt-4 pt-4 border-t border-[var(--border-subtle)]">
        <p className="text-xs font-medium text-[var(--text-tertiary)] mb-3">Try an example</p>
        <div className="flex flex-col gap-3">
          {samplePrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => setInput(prompt)}
              className="text-left text-sm text-[var(--text-secondary)] hover:text-[#A855F7] bg-[var(--bg-base)] p-3 rounded-xl border border-[var(--border-subtle)] hover:border-[#A855F7]/40 transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              "{prompt}"
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}
