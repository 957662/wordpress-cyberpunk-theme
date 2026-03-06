/**
 * Loading Spinner Component
 *
 * A collection of loading spinner animations for the CyberPress platform
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  variant?: 'default' | 'dots' | 'bars' | 'pulse';
  className?: string;
  fullScreen?: boolean;
  text?: string;
}

const sizeStyles = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

const colorStyles = {
  primary: 'border-cyber-cyan',
  secondary: 'border-cyber-purple',
  success: 'border-cyber-green',
  warning: 'border-cyber-yellow',
  error: 'border-cyber-pink',
};

export function LoadingSpinner({
  size = 'md',
  color = 'primary',
  variant = 'default',
  className,
  fullScreen = false,
  text,
}: LoadingSpinnerProps) {
  const containerClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50'
    : 'flex items-center justify-center';

  return (
    <div className={cn(containerClasses, className)}>
      <div className="flex flex-col items-center gap-4">
        {variant === 'default' && <DefaultSpinner size={size} color={color} />}
        {variant === 'dots' && <DotsSpinner size={size} color={color} />}
        {variant === 'bars' && <BarsSpinner size={size} color={color} />}
        {variant === 'pulse' && <PulseSpinner size={size} color={color} />}
        {text && <p className="text-sm text-gray-400 animate-pulse">{text}</p>}
      </div>
    </div>
  );
}

function DefaultSpinner({ size, color }: Pick<LoadingSpinnerProps, 'size' | 'color'>) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-t-transparent',
        sizeStyles[size],
        colorStyles[color]
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

function DotsSpinner({ size, color }: Pick<LoadingSpinnerProps, 'size' | 'color'>) {
  const dotSizes = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
  };

  return (
    <div className="flex gap-2" role="status" aria-label="Loading">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'rounded-full animate-bounce',
            dotSizes[size],
            colorStyles[color].replace('border', 'bg')
          )}
          style={{
            animationDelay: `${i * 0.15}s`,
            animationDuration: '0.6s',
          }}
        />
      ))}
    </div>
  );
}

function BarsSpinner({ size, color }: Pick<LoadingSpinnerProps, 'size' | 'color'>) {
  const barSizes = {
    sm: 'h-3 w-1',
    md: 'h-6 w-1.5',
    lg: 'h-8 w-2',
    xl: 'h-10 w-2.5',
  };

  return (
    <div className="flex gap-1 items-end" role="status" aria-label="Loading">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={cn(
            'rounded-sm animate-pulse',
            barSizes[size],
            colorStyles[color].replace('border', 'bg')
          )}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: '0.8s',
          }}
        />
      ))}
    </div>
  );
}

function PulseSpinner({ size, color }: Pick<LoadingSpinnerProps, 'size' | 'color'>) {
  return (
    <div className="relative" role="status" aria-label="Loading">
      <div
        className={cn(
          'animate-ping absolute inline-flex rounded-full opacity-75',
          sizeStyles[size],
          colorStyles[color].replace('border', 'bg')
        )}
      />
      <div
        className={cn(
          'relative inline-flex rounded-full',
          sizeStyles[size],
          colorStyles[color].replace('border', 'bg')
        )}
      />
    </div>
  );
}

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  count?: number;
}

export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  count = 1,
}: SkeletonProps) {
  const variantStyles = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-sm',
    rounded: 'rounded-md',
  };

  const skeletons = Array.from({ length: count });

  return (
    <>
      {skeletons.map((_, i) => (
        <div
          key={i}
          className={cn(
            'animate-pulse bg-gray-800',
            variantStyles[variant],
            className
          )}
          style={{ width, height }}
          aria-hidden="true"
        />
      ))}
    </>
  );
}

export function CardSkeleton() {
  return (
    <div className="border border-gray-800 rounded-lg p-4 space-y-4">
      <Skeleton variant="rectangular" height={200} className="w-full" />
      <Skeleton variant="text" width="75%" />
      <Skeleton variant="text" width="50%" />
      <div className="flex gap-2">
        <Skeleton variant="circular" width={32} height={32} />
        <Skeleton variant="text" width="60%" />
      </div>
    </div>
  );
}

export function BlogPostSkeleton() {
  return (
    <div className="border border-gray-800 rounded-lg overflow-hidden">
      <Skeleton variant="rectangular" height={240} className="w-full" />
      <div className="p-6 space-y-4">
        <div className="flex gap-2">
          <Skeleton variant="text" width={80} />
          <Skeleton variant="text" width={60} />
        </div>
        <Skeleton variant="text" width="90%" height={28} />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="80%" />
        <div className="flex items-center gap-3 pt-4">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width={120} />
            <Skeleton variant="text" width={80} />
          </div>
        </div>
      </div>
    </div>
  );
}

export interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export function LoadingButton({
  loading = false,
  loadingText = 'Loading...',
  children,
  disabled,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md',
        'bg-cyber-cyan text-black font-medium',
        'hover:bg-cyber-cyan/80 disabled:opacity-50 disabled:cursor-not-allowed',
        'transition-colors duration-200',
        className
      )}
      {...props}
    >
      {loading && <DefaultSpinner size="sm" color="primary" />}
      {loading ? loadingText : children}
    </button>
  );
}

export function PageLoading({ text = 'Loading...' }: { text?: string }) {
  return <LoadingSpinner fullScreen size="lg" variant="default" text={text} />;
}

export default LoadingSpinner;
