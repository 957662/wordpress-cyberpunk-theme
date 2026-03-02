'use client';

import React from 'react';
import { cn } from '@/lib/utils/classname';

export interface CyberLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  variant?: 'default' | 'glow' | 'neon' | 'hologram';
  required?: boolean;
}

export const CyberLabel = React.forwardRef<HTMLLabelElement, CyberLabelProps>(
  ({ className, variant = 'default', required, children, ...props }, ref) => {
    const variantStyles = {
      default: 'text-cyan-400',
      glow: 'text-fuchsia-400',
      neon: 'text-pink-400',
      hologram: 'text-purple-400',
    };

    return (
      <label
        ref={ref}
        className={cn(
          'block text-sm font-medium mb-2',
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    );
  }
);

CyberLabel.displayName = 'CyberLabel';

export default CyberLabel;
