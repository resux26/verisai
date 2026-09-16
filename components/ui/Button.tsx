import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'proof';
  size?: 'default' | 'sm' | 'lg';
  isLoading?: boolean;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'default', isLoading, asChild, children, disabled, ...props }, ref) => {
    const variants: Record<string, string> = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      outline: 'btn-secondary',
      ghost: 'btn-ghost',
      proof: 'btn-proof',
    };

    const sizes: Record<string, string> = {
      default: '',
      sm: 'text-sm px-4 py-1.5 min-h-[36px]',
      lg: 'text-lg px-8 py-3 min-h-[48px]',
    };

    const btnClass = `${variants[variant]} ${sizes[size]} ${className}`.trim();

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        ref,
        className: btnClass,
        ...props
      });
    }

    return (
      <button
        ref={ref}
        className={btnClass}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
