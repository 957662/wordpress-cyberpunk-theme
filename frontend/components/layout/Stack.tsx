'use client';

import React, { ReactNode } from 'react';

interface StackProps {
  children: ReactNode[];
  spacing?: number;
  direction?: 'vertical' | 'horizontal';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'space-between';
  className?: string;
}

export function Stack({
  children,
  spacing = 16,
  direction = 'vertical',
  align = 'start',
  justify = 'start',
  className = '',
}: StackProps) {
  const isVertical = direction === 'vertical';

  const alignClasses = {
    start: isVertical ? 'items-start' : 'justify-start',
    center: isVertical ? 'items-center' : 'justify-center',
    end: isVertical ? 'items-end' : 'justify-end',
    stretch: isVertical ? 'items-stretch' : 'justify-stretch',
  };

  const justifyClasses = {
    start: isVertical ? 'justify-start' : 'items-start',
    center: isVertical ? 'justify-center' : 'items-center',
    end: isVertical ? 'justify-end' : 'items-end',
    'space-between': isVertical ? 'justify-between' : 'content-between',
  };

  return (
    <div
      className={`flex ${isVertical ? 'flex-col' : 'flex-row'} ${alignClasses[align]} ${justifyClasses[justify]} ${className}`}
      style={{ gap: `${spacing}px` }}
    >
      {children}
    </div>
  );
}
