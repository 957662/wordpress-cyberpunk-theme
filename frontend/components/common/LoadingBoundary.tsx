/**
 * 加载边界组件
 * 处理组件加载状态和错误
 */

'use client';

import React, { Suspense, ReactNode } from 'react';
import { motion } from 'framer-motion';

export interface LoadingBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  error?: ReactNode;
  delay?: number;
}

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

/**
 * 加载中 Spinner 组件
 */
export function Spinner({ size = 'md', color = '#00f0ff' }: SpinnerProps) {
  const sizeMap = {
    sm: 20,
    md: 32,
    lg: 48,
  };

  return (
    <div className="flex items-center justify-center">
      <motion.div
        className="rounded-full border-2 border-t-transparent"
        style={{
          width: sizeMap[size],
          height: sizeMap[size],
          borderColor: color,
          borderTopColor: 'transparent',
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
}

/**
 * 霓虹加载效果
 */
export function NeonSpinner({ size = 'md' }: SpinnerProps) {
  const sizeMap = {
    sm: 20,
    md: 40,
    lg: 60,
  };

  return (
    <div className="flex items-center justify-center">
      <motion.div
        className="relative"
        style={{ width: sizeMap[size], height: sizeMap[size] }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border-2 border-cyber-cyan"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeOut',
            }}
            style={{
              boxShadow: '0 0 10px #00f0ff, 0 0 20px #00f0ff',
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}

/**
 * 骨架屏加载组件
 */
export function Skeleton({
  className,
  variant = 'default',
}: {
  className?: string;
  variant?: 'default' | 'text' | 'circle' | 'rect';
}) {
  const baseClass = 'animate-pulse bg-cyber-muted rounded';

  const variantClass = {
    default: 'h-4 w-full',
    text: 'h-4 w-3/4',
    circle: 'rounded-full',
    rect: 'rounded-md',
  };

  return (
    <div
      className={`${baseClass} ${variantClass[variant]} ${className || ''}`}
      style={{
        background: 'linear-gradient(90deg, #1a1a2e 25%, #2a2a4a 50%, #1a1a2e 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
      }}
    />
  );
}

/**
 * 骨架卡片组件
 */
export function CardSkeleton() {
  return (
    <div className="border border-cyber-border rounded-lg p-4 space-y-3">
      <div className="flex items-center space-x-3">
        <Skeleton variant="circle" className="h-10 w-10" />
        <div className="space-y-2 flex-1">
          <Skeleton variant="text" className="h-4" />
          <Skeleton variant="text" className="h-3 w-2/3" />
        </div>
      </div>
      <Skeleton className="h-32 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  );
}

/**
 * 列表骨架组件
 */
export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3">
          <Skeleton variant="circle" className="h-10 w-10" />
          <div className="space-y-2 flex-1">
            <Skeleton variant="text" className="h-4" />
            <Skeleton variant="text" className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * 加载边界组件
 */
export function LoadingBoundary({
  children,
  fallback,
  error,
  delay = 200,
}: LoadingBoundaryProps) {
  const [showFallback, setShowFallback] = React.useState(delay === 0);
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => setShowFallback(true), delay);
      return () => clearTimeout(timer);
    }
  }, [delay]);

  React.useEffect(() => {
    const handleError = () => setHasError(true);
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError && error) {
    return <>{error}</>;
  }

  return (
    <Suspense
      fallback={
        showFallback ? (
          fallback || (
            <div className="flex items-center justify-center min-h-[200px]">
              <NeonSpinner size="lg" />
            </div>
          )
        ) : null
      }
    >
      {children}
    </Suspense>
  );
}

/**
 * 页面加载组件
 */
export function PageLoader({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cyber-darker">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <NeonSpinner size="lg" />
        <motion.p
          className="mt-4 text-cyber-cyan"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {message}
        </motion.p>
      </motion.div>
    </div>
  );
}

/**
 * 内联加载组件
 */
export function InlineLoader({ size = 'sm', text }: { size?: 'sm' | 'md'; text?: string }) {
  return (
    <div className="flex items-center space-x-2">
      <Spinner size={size} />
      {text && <span className="text-sm text-cyber-muted">{text}</span>}
    </div>
  );
}

/**
 * 按钮加载组件
 */
export function ButtonLoader({ loading, children }: { loading: boolean; children: ReactNode }) {
  return (
    <button
      disabled={loading}
      className="relative inline-flex items-center justify-center px-4 py-2 bg-cyber-cyan text-cyber-dark rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-cyber-cyan rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Spinner size="sm" color="#0a0a0f" />
        </motion.div>
      )}
      <span className={loading ? 'invisible' : ''}>{children}</span>
    </button>
  );
}

export default LoadingBoundary;
