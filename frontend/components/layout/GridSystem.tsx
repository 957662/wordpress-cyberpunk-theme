'use client';

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GridProps {
  children: ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: number | string;
  align?: 'start' | 'center' | 'end' | 'stretch';
}

export const Grid: React.FC<GridProps> = ({
  children,
  className,
  cols = 3,
  gap = 4,
  align = 'stretch',
}) => {
  const colsClasses: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
    12: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6',
  };

  const alignClasses: Record<string, string> = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  return (
    <div
      className={cn(
        'grid',
        colsClasses[cols],
        alignClasses[align],
        typeof gap === 'number' ? `gap-${gap}` : gap,
        className
      )}
    >
      {children}
    </div>
  );
};

interface GridItemProps {
  children: ReactNode;
  className?: string;
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  spanMd?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  spanLg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  rowSpan?: 1 | 2 | 3 | 4 | 5 | 6;
}

export const GridItem: React.FC<GridItemProps> = ({
  children,
  className,
  span,
  spanMd,
  spanLg,
  rowSpan,
}) => {
  const spanClasses: Record<number, string> = {
    1: 'col-span-1',
    2: 'col-span-2',
    3: 'col-span-3',
    4: 'col-span-4',
    5: 'col-span-5',
    6: 'col-span-6',
    7: 'col-span-7',
    8: 'col-span-8',
    9: 'col-span-9',
    10: 'col-span-10',
    11: 'col-span-11',
    12: 'col-span-12',
  };

  const rowSpanClasses: Record<number, string> = {
    1: 'row-span-1',
    2: 'row-span-2',
    3: 'row-span-3',
    4: 'row-span-4',
    5: 'row-span-5',
    6: 'row-span-6',
  };

  return (
    <div
      className={cn(
        span && spanClasses[span],
        spanMd && `md:${spanClasses[spanMd]}`,
        spanLg && `lg:${spanClasses[spanLg]}`,
        rowSpan && rowSpanClasses[rowSpan],
        className
      )}
    >
      {children}
    </div>
  );
};

interface FlexGridProps {
  children: ReactNode;
  className?: string;
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  gap?: number | string;
}

export const FlexGrid: React.FC<FlexGridProps> = ({
  children,
  className,
  direction = 'row',
  wrap = 'wrap',
  justify = 'start',
  align = 'start',
  gap = 4,
}) => {
  const directionClasses: Record<string, string> = {
    row: 'flex-row',
    col: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'col-reverse': 'flex-col-reverse',
  };

  const wrapClasses: Record<string, string> = {
    nowrap: 'flex-nowrap',
    wrap: 'flex-wrap',
    'wrap-reverse': 'flex-wrap-reverse',
  };

  const justifyClasses: Record<string, string> = {
    start: 'justify-start',
    end: 'justify-end',
    center: 'justify-center',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  const alignClasses: Record<string, string> = {
    start: 'items-start',
    end: 'items-end',
    center: 'items-center',
    baseline: 'items-baseline',
    stretch: 'items-stretch',
  };

  return (
    <div
      className={cn(
        'flex',
        directionClasses[direction],
        wrapClasses[wrap],
        justifyClasses[justify],
        alignClasses[align],
        typeof gap === 'number' ? `gap-${gap}` : gap,
        className
      )}
    >
      {children}
    </div>
  );
};

export default Grid;
