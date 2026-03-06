/**
 * Async Boundary 组件
 * 处理异步组件的错误和加载状态
 */

'use client';

import React, { Component, ReactNode, Suspense } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { CyberLoader } from '../ui/CyberLoader';

interface Props {
  children: ReactNode;
  loading?: ReactNode;
  error?: ReactNode;
  pending?: boolean;
}

export const AsyncBoundary: React.FC<Props> = ({
  children,
  loading,
  error,
  pending = false,
}) => {
  const LoadingFallback = loading || <CyberLoader />;
  const ErrorFallback = error;

  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <Suspense fallback={pending ? LoadingFallback : null}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

export default AsyncBoundary;
