import React from 'react';
import { Card } from '../ui/Card';
import { CheckCircle2, XCircle } from 'lucide-react';
import { formatHash } from '../../lib/utils/format';

interface VerificationResultProps {
  isMatch: boolean;
  uploadedHash: string;
  registeredHash: string;
}

export function VerificationResult({ isMatch, uploadedHash, registeredHash }: VerificationResultProps) {
  return (
    <Card className={`border-2 animate-fade-in-up ${
      isMatch 
        ? 'border-color-success/50 bg-color-success-bg' 
        : 'border-color-error/50 bg-color-error-bg'
    }`}>
      <div className="flex flex-col items-center text-center gap-4 py-4">
        {isMatch ? (
          <>
            <div className="w-16 h-16 rounded-full bg-color-success/20 flex items-center justify-center text-color-success mb-2">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-color-success">MATCH VERIFIED</h3>
            <p className="text-sm text-text-primary max-w-md">
              The uploaded file exactly matches the cryptographic fingerprint registered on the blockchain. 
              It has not been altered since it was registered.
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-color-error/20 flex items-center justify-center text-color-error mb-2">
              <XCircle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-color-error">DOES NOT MATCH</h3>
            <p className="text-sm text-text-primary max-w-md">
              The uploaded file&apos;s fingerprint does not match the blockchain record. 
              This could mean the file was altered, or you uploaded the wrong file.
            </p>
          </>
        )}

        <div className="w-full max-w-lg mt-6 bg-bg-primary rounded-lg border border-border-default overflow-hidden text-left">
          <div className="grid grid-cols-2 text-xs uppercase tracking-wider text-text-tertiary bg-bg-secondary p-3 border-b border-border-default">
            <div>Uploaded File Hash</div>
            <div>Registered Hash</div>
          </div>
          <div className="grid grid-cols-2 p-3 font-mono text-[10px] sm:text-xs">
            <div className={`break-all pr-2 ${isMatch ? 'text-text-primary' : 'text-color-error'}`}>
              {formatHash(uploadedHash, 32)}
            </div>
            <div className="break-all pl-2 border-l border-border-default text-text-primary">
              {formatHash(registeredHash, 32)}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
