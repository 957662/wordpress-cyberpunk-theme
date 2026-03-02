/**
 * Section 章节组件
 * 用于页面内容的分组
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  container?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  py?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export function Section({
  children,
  className = '',
  id,
  container = true,
  size = 'lg',
  py = 'lg',
}: SectionProps) {
  const paddingY = {
    none: '',
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16 md:py-20',
    xl: 'py-20 md:py-28',
  };

  const ContentElement = container ? 'section' : 'div';

  const content = (
    <ContentElement
      id={id}
      className={cn(paddingY[py], className)}
    >
      {children}
    </ContentElement>
  );

  if (container) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {content}
      </div>
    );
  }

  return content;
}

// ============ Section Header ============
interface SectionHeaderProps {
  title: string;
  description?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export function SectionHeader({
  title,
  description,
  align = 'center',
  className = '',
}: SectionHeaderProps) {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div className={cn('mb-12', alignClasses[align], className)}>
      <h2 className="text-3xl md:text-4xl font-display font-bold text-glow-cyan text-cyber-cyan mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}

export default Section;
