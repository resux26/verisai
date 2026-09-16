import React from 'react';

type BadgeVariant = 'verified' | 'pending' | 'error' | 'demo' | 'accent' | 'proof' | 'good' | 'caution' | 'risk' | 'default';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ className = '', variant = 'default', children, ...props }: BadgeProps) {
  const variantClasses: Record<string, string> = {
    default: 'bg-bg-elevated text-text-secondary border border-border-subtle',
    verified: 'badge-verified',
    pending: 'badge-pending',
    error: 'badge-error',
    demo: 'badge-demo',
    accent: 'badge-accent',
    proof: 'badge-proof',
    good: 'badge-good',
    caution: 'badge-caution',
    risk: 'badge-risk',
  };

  const dotColors: Record<string, string> = {
    good: 'bg-status-good',
    verified: 'bg-status-good',
    caution: 'bg-status-caution',
    pending: 'bg-status-caution',
    risk: 'bg-status-risk',
    error: 'bg-status-risk',
    proof: 'bg-accent-proof',
  };

  const dotColor = dotColors[variant];

  return (
    <span className={`badge ${variantClasses[variant] || variantClasses.default} ${className}`} {...props}>
      {dotColor && <span className={`w-1.5 h-1.5 rounded-full ${dotColor} shrink-0`} />}
      {children}
    </span>
  );
}
