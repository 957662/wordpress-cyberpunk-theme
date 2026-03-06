'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

export function Avatar({
  src,
  alt,
  fallback,
  size = 'md',
  className,
  ...props
}: AvatarProps) {
  const [error, setError] = React.useState(false);

  if (src && !error) {
    return (
      <div
        className={cn(
          'relative rounded-full overflow-hidden bg-cyber-dark border-2 border-cyber-cyan/30',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        <img
          src={src}
          alt={alt || 'Avatar'}
          className="w-full h-full object-cover"
          onError={() => setError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative rounded-full overflow-hidden bg-cyber-dark/80 border-2 border-cyber-cyan/30 flex items-center justify-center',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {fallback || (
        <svg className="w-1/2 h-1/2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      )}
    </div>
  );
}
