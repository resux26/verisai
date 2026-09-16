import React from 'react';
import Link from 'next/link';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { CopyButton } from '../ui/CopyButton';
import { formatDate, formatHash } from '../../lib/utils/format';
import { ExternalLink, FileText } from 'lucide-react';

interface ProofCardProps {
  proof: {
    id: string | number;
    title: string;
    documentType: string;
    timestamp: number;
    fileHash: string;
    summary?: string;
    isDemo?: boolean;
  };
}

export function ProofCard({ proof }: ProofCardProps) {
  const verifyUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/verify/${proof.id}`;

  return (
    <Card className="flex flex-col h-full bg-bg-secondary/50 hover:bg-bg-secondary transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-bg-elevated rounded-lg text-accent-primary shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-lg leading-tight line-clamp-1" title={proof.title}>
              {proof.title || 'Untitled Document'}
            </h3>
            <div className="text-xs text-text-tertiary mt-0.5">{proof.documentType}</div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge variant="verified">Verified</Badge>
          {proof.isDemo && <Badge variant="demo" className="text-[10px] py-0.5 px-2">Demo</Badge>}
        </div>
      </div>

      {proof.summary && (
        <p className="text-sm text-text-secondary mb-4 line-clamp-2 flex-grow">
          {proof.summary}
        </p>
      )}

      <div className="mt-auto space-y-3 pt-4 border-t border-border-default">
        <div className="flex justify-between text-xs">
          <span className="text-text-tertiary">Registered:</span>
          <span className="font-medium">{formatDate(proof.timestamp)}</span>
        </div>
        
        <div className="flex justify-between items-center text-xs">
          <span className="text-text-tertiary">Hash:</span>
          <span className="font-mono text-text-secondary bg-bg-elevated px-1.5 py-0.5 rounded">
            {formatHash(proof.fileHash, 16)}
          </span>
        </div>

        <div className="flex gap-2 pt-2">
          <Link href={`/verify/${proof.id}`} className="flex-1">
            <button className="w-full py-1.5 flex items-center justify-center gap-1.5 text-sm font-medium bg-bg-elevated hover:bg-bg-hover text-text-primary rounded-md transition-colors">
              View Proof <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </Link>
          <div className="flex-1 flex items-center justify-center bg-bg-elevated hover:bg-bg-hover rounded-md transition-colors">
            <CopyButton value={verifyUrl} className="w-full py-1.5" />
          </div>
        </div>
      </div>
    </Card>
  );
}
