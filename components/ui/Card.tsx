import React, { forwardRef } from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  static?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', static: isStatic, children, ...props }, ref) => {
    const baseClass = isStatic ? 'glass-card-static' : 'glass-card';
    return (
      <div ref={ref} className={`${baseClass} p-6 ${className}`} {...props}>
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';
