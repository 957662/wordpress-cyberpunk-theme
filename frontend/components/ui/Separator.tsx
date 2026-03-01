/**
 * 分隔线组件
 */

'use client';

import { cn } from '@/lib/utils';

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'horizontal' | 'vertical';
  decorative?: boolean;
  label?: string;
}

export function Separator({
  variant = 'horizontal',
  decorative = true,
  label,
  className,
  ...props
}: SeparatorProps) {
  const baseStyles = 'shrink-0 bg-cyber-border';

  const variants = {
    horizontal: 'h-px w-full',
    vertical: 'h-full w-px',
  };

  if (label && variant === 'horizontal') {
    return (
      <div className={cn('relative my-4', className)} {...props}>
        <div className="absolute inset-0 flex items-center">
          <span className={cn(baseStyles, variants[variant])} />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-cyber-dark px-4 text-sm text-gray-400">
            {label}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(baseStyles, variants[variant], className)}
      role={decorative ? 'none' : 'separator'}
      aria-orientation={variant}
      {...props}
    />
  );
}

export default Separator;
