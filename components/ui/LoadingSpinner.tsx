import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export function LoadingSpinner({ message, className = '' }: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 p-8 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-accent-primary opacity-20 animate-ping"></div>
        <Loader2 className="w-10 h-10 text-accent-primary animate-spin relative z-10" />
      </div>
      {message && <p className="text-text-secondary font-medium animate-pulse">{message}</p>}
    </div>
  );
}
