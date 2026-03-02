'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showBackground?: boolean;
  showGrid?: boolean;
}

const containerSizeConfig = {
  sm: 'max-w-4xl',
  md: 'max-w-5xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-full',
};

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  className,
  containerSize = 'lg',
  showBackground = true,
  showGrid = true,
}) => {
  const containerClass = containerSizeConfig[containerSize];

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn('min-h-screen', className)}
    >
      {/* 背景 */}
      {showBackground && (
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
          {showGrid && (
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
          )}
        </div>
      )}

      {/* 内容 */}
      <div className={cn('mx-auto px-6 py-8', containerClass)}>
        {children}
      </div>
    </motion.main>
  );
};

export default PageLayout;
