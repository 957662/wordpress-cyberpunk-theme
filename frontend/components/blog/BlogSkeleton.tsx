/**
 * BlogSkeleton - 博客骨架屏组件
 * 用于显示加载状态
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';
import type { BlogViewType } from '@/types/models/blog';

interface BlogSkeletonProps {
  view?: BlogViewType;
  count?: number;
  className?: string;
}

export function BlogSkeleton({
  view = 'grid',
  count = 6,
  className,
}: BlogSkeletonProps) {
  const CardSkeleton = () => (
    <div className="rounded-xl bg-slate-800/50 border border-slate-700 overflow-hidden">
      {/* 图片骨架 */}
      <div className="aspect-video bg-slate-700/50 animate-pulse" />

      {/* 内容骨架 */}
      <div className="p-4 space-y-3">
        {/* 标题骨架 */}
        <div className="h-6 bg-slate-700/50 rounded animate-pulse w-3/4" />

        {/* 摘要骨架 */}
        <div className="space-y-2">
          <div className="h-4 bg-slate-700/50 rounded animate-pulse" />
          <div className="h-4 bg-slate-700/50 rounded animate-pulse w-1/2" />
        </div>

        {/* 元信息骨架 */}
        <div className="flex items-center gap-4 pt-2">
          <div className="h-4 w-16 bg-slate-700/50 rounded animate-pulse" />
          <div className="h-4 w-16 bg-slate-700/50 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );

  const ListSkeleton = () => (
    <div className="rounded-xl bg-slate-800/50 border border-slate-700 p-6">
      <div className="flex gap-4">
        {/* 图片骨架 */}
        <div className="w-32 h-24 flex-shrink-0 bg-slate-700/50 rounded-lg animate-pulse" />

        {/* 内容骨架 */}
        <div className="flex-1 space-y-3">
          {/* 标题骨架 */}
          <div className="h-6 bg-slate-700/50 rounded animate-pulse w-3/4" />

          {/* 摘要骨架 */}
          <div className="space-y-2">
            <div className="h-4 bg-slate-700/50 rounded animate-pulse w-full" />
            <div className="h-4 bg-slate-700/50 rounded animate-pulse w-2/3" />
          </div>

          {/* 元信息骨架 */}
          <div className="flex items-center gap-4">
            <div className="h-4 w-16 bg-slate-700/50 rounded animate-pulse" />
            <div className="h-4 w-20 bg-slate-700/50 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );

  const CompactSkeleton = () => (
    <div className="rounded-lg bg-slate-800/50 border border-slate-700 p-4 space-y-3">
      {/* 标题骨架 */}
      <div className="h-5 bg-slate-700/50 rounded animate-pulse w-full" />

      {/* 元信息骨架 */}
      <div className="flex items-center gap-3">
        <div className="h-3 w-12 bg-slate-700/50 rounded animate-pulse" />
        <div className="h-3 w-12 bg-slate-700/50 rounded animate-pulse" />
      </div>
    </div>
  );

  return (
    <div
      className={cn(
        view === 'grid'
          ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3'
          : view === 'list'
          ? 'space-y-6 max-w-4xl mx-auto'
          : 'grid gap-4 sm:grid-cols-2 lg:grid-cols-4',
        className
      )}
    >
      {Array.from({ length: count }).map((_, index) => {
        const key = `skeleton-${index}`;

        if (view === 'list') {
          return <ListSkeleton key={key} />;
        }

        if (view === 'compact') {
          return <CompactSkeleton key={key} />;
        }

        return <CardSkeleton key={key} />;
      })}
    </div>
  );
}

export default BlogSkeleton;
