import React from 'react';
import { CheckCircle2, Clock, XCircle, ExternalLink } from 'lucide-react';
import { getExplorerUrl } from '../../lib/utils/format';
import { Card } from './Card';

interface TransactionStatusProps {
  status: 'idle' | 'pending' | 'success' | 'error';
  hash?: string;
  errorMessage?: string;
}

export function TransactionStatus({ status, hash, errorMessage }: TransactionStatusProps) {
  if (status === 'idle') return null;

  const isPending = status === 'pending';
  const isSuccess = status === 'success';
  const isError = status === 'error';

  return (
    <Card className={`p-4 flex flex-col gap-3 animate-slide-down ${
      isPending ? 'tx-pending bg-color-warning-bg border-color-warning/20' : 
      isSuccess ? 'tx-confirmed bg-color-success-bg border-color-success/20' : 
      'tx-failed bg-color-error-bg border-color-error/20'
    }`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">
          {isPending && <Clock className="w-5 h-5 text-color-warning animate-pulse" />}
          {isSuccess && <CheckCircle2 className="w-5 h-5 text-color-success" />}
          {isError && <XCircle className="w-5 h-5 text-color-error" />}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-semibold mb-1 ${
            isPending ? 'text-color-warning' : 
            isSuccess ? 'text-color-success' : 'text-color-error'
          }`}>
            {isPending && 'Transaction Pending...'}
            {isSuccess && 'Transaction Confirmed!'}
            {isError && 'Transaction Failed'}
          </h4>
          
          {isPending && (
            <p className="text-xs text-text-secondary">
              Please wait while your transaction is confirmed on the blockchain.
            </p>
          )}
          
          {isSuccess && (
            <p className="text-xs text-text-secondary">
              Your proof has been successfully registered on-chain.
            </p>
          )}
          
          {isError && errorMessage && (
            <p className="text-xs text-color-error/80 break-words line-clamp-2" title={errorMessage}>
              {errorMessage}
            </p>
          )}

          {hash && (
            <a 
              href={getExplorerUrl(hash)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-accent-primary hover:text-accent-secondary transition-colors"
            >
              View on Explorer <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}
