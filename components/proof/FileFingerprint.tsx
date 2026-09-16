import React from 'react';
import { Fingerprint } from 'lucide-react';
import { Card } from '../ui/Card';
import { CopyButton } from '../ui/CopyButton';

interface FileFingerprintProps {
  hash: string;
}

export function FileFingerprint({ hash }: FileFingerprintProps) {
  return (
    <Card className="border-accent-primary/20 bg-accent-primary/5">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-accent-primary/10 rounded-lg text-accent-primary shrink-0 mt-1">
          <Fingerprint className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold mb-1">File Fingerprint (SHA-256)</h3>
          <p className="text-sm text-text-secondary mb-3">
            This cryptographic hash uniquely represents your exact file. Even a single pixel or character change will result in a completely different hash. 
            <strong> Your actual file is never sent to the blockchain.</strong>
          </p>
          <div className="flex items-center gap-2">
            <div className="hash-display flex-1 overflow-x-auto whitespace-nowrap">
              {hash}
            </div>
            <CopyButton value={hash} iconOnly className="p-2 bg-bg-elevated rounded hover:bg-bg-hover shrink-0" />
          </div>
        </div>
      </div>
    </Card>
  );
}
