/**
 * Loading Card Component
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingCardProps {
  className?: string;
}

export function LoadingCard({ className }: LoadingCardProps) {
  return (
    <div className={cn('animate-pulse bg-gray-800 rounded-lg p-4', className)}>
      <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
      <div className="h-3 bg-gray-700 rounded w-full mb-2"></div>
      <div className="h-3 bg-gray-700 rounded w-5/6 mb-2"></div>
      <div className="h-3 bg-gray-700 rounded w-4/6"></div>
    </div>
  );
}

export default LoadingCard;
