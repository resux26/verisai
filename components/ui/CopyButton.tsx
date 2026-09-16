import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  value: string;
  className?: string;
  iconOnly?: boolean;
}

export function CopyButton({ value, className = '', iconOnly = false }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center justify-center gap-1.5 transition-colors hover:text-text-primary ${
        copied ? 'text-color-success' : 'text-text-secondary'
      } ${className}`}
      title="Copy to clipboard"
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      {!iconOnly && <span className="text-xs font-medium">{copied ? 'Copied' : 'Copy'}</span>}
    </button>
  );
}
