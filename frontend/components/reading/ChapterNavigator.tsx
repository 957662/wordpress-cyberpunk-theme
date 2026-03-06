'use client';

/**
 * ChapterNavigator - 章节导航组件
 * 提供文章章节的快速导航和进度展示
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  List,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  BookOpen,
  Clock,
  CheckCircle2,
  Circle,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Chapter {
  id: string;
  title: string;
  slug: string;
  estimatedTime: number; // 分钟
  wordCount: number;
  completed: boolean;
  current?: boolean;
}

export interface ChapterNavigatorProps {
  chapters: Chapter[];
  currentChapterId?: string;
  onChapterChange?: (chapterId: string) => void;
  position?: 'sidebar' | 'floating' | 'inline';
  variant?: 'full' | 'minimal' | 'compact';
  showProgress?: boolean;
  showTime?: boolean;
  className?: string;
}

export function ChapterNavigator({
  chapters,
  currentChapterId,
  onChapterChange,
  position = 'sidebar',
  variant = 'full',
  showProgress = true,
  showTime = true,
  className,
}: ChapterNavigatorProps) {
  const [isOpen, setIsOpen] = useState(position === 'sidebar');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentScrollProgress, setCurrentScrollProgress] = useState<Record<string, number>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  // 计算当前章节
  const currentIndex = chapters.findIndex((ch) => ch.id === currentChapterId);
  const currentChapter = chapters[currentIndex];

  // 计算整体进度
  const completedCount = chapters.filter((ch) => ch.completed).length;
  const totalProgress = (completedCount / chapters.length) * 100;

  // 自动检测当前章节（如果未指定）
  useEffect(() => {
    if (!currentChapterId && chapters.length > 0) {
      const observerCallback = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          const chapterId = entry.target.getAttribute('data-chapter-id');
          if (chapterId && entry.isIntersecting) {
            // 找到对应的章节并标记为当前
            setCurrentScrollProgress((prev) => ({
              ...prev,
              [chapterId]: entry.intersectionRatio,
            }));
          }
        });
      };

      const observer = new IntersectionObserver(observerCallback, {
        threshold: [0, 0.25, 0.5, 0.75, 1],
      });

      // 观察所有章节元素
      chapters.forEach((chapter) => {
        const element = document.querySelector(`[data-chapter-id="${chapter.id}"]`);
        if (element) observer.observe(element);
      });

      return () => observer.disconnect();
    }
  }, [chapters, currentChapterId]);

  // 跳转到指定章节
  const handleChapterClick = (chapterId: string) => {
    const element = document.querySelector(`[data-chapter-id="${chapterId}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      onChapterChange?.(chapterId);
    }

    // 在浮动模式下，点击后关闭菜单
    if (position === 'floating') {
      setIsOpen(false);
    }
  };

  // 跳转到上一章/下一章
  const navigateChapter = (direction: 'prev' | 'next') => {
    let newIndex = currentIndex;
    if (direction === 'prev' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else if (direction === 'next' && currentIndex < chapters.length - 1) {
      newIndex = currentIndex + 1;
    }

    if (newIndex !== currentIndex) {
      handleChapterClick(chapters[newIndex].id);
    }
  };

  // 渲染完整模式
  const renderFull = () => (
    <div className="space-y-2">
      {/* 进度概览 */}
      {showProgress && (
        <div className="mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">阅读进度</span>
            <span className="text-sm font-semibold text-cyber-cyan">
              {completedCount}/{chapters.length}
            </span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${totalProgress}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink"
            />
          </div>
        </div>
      )}

      {/* 章节列表 */}
      <div className="space-y-1">
        {chapters.map((chapter, index) => {
          const isCurrent = chapter.id === currentChapterId;
          const isCompleted = chapter.completed;

          return (
            <motion.button
              key={chapter.id}
              onClick={() => handleChapterClick(chapter.id)}
              className={cn(
                'w-full text-left p-3 rounded-lg border transition-all',
                'hover:bg-gray-800/50',
                isCurrent && 'bg-cyber-cyan/10 border-cyber-cyan/50',
                isCompleted && !isCurrent && 'bg-green-500/10 border-green-500/30',
                !isCurrent && !isCompleted && 'border-transparent'
              )}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start gap-3">
                {/* 状态图标 */}
                <div className="flex-shrink-0 mt-0.5">
                  {isCurrent ? (
                    <Loader2 className="w-4 h-4 text-cyber-cyan animate-spin" />
                  ) : isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-600" />
                  )}
                </div>

                {/* 章节信息 */}
                <div className="flex-1 min-w-0">
                  <div
                    className={cn(
                      'text-sm font-medium mb-1',
                      isCurrent && 'text-cyber-cyan',
                      isCompleted && 'text-green-400',
                      !isCurrent && !isCompleted && 'text-gray-300'
                    )}
                  >
                    {index + 1}. {chapter.title}
                  </div>

                  {/* 元信息 */}
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    {showTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {chapter.estimatedTime} 分钟
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      {chapter.wordCount} 字
                    </span>
                  </div>
                </div>

                {/* 当前阅读进度 */}
                {isCurrent && showProgress && currentScrollProgress[chapter.id] !== undefined && (
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 relative">
                      <svg className="transform -rotate-90 w-full h-full">
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="3"
                          fill="none"
                        />
                        <motion.circle
                          cx="24"
                          cy="24"
                          r="20"
                          stroke="#00f0ff"
                          strokeWidth="3"
                          fill="none"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{
                            pathLength: currentScrollProgress[chapter.id] || 0,
                          }}
                          transition={{ duration: 0.3 }}
                          style={{
                            strokeDasharray: '125.6',
                            strokeDashoffset: 0,
                          }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-semibold text-cyber-cyan">
                          {Math.round((currentScrollProgress[chapter.id] || 0) * 100)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );

  // 渲染最小模式
  const renderMinimal = () => (
    <div className="flex items-center gap-2">
      <button
        onClick={() => navigateChapter('prev')}
        disabled={currentIndex <= 0}
        className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex-1 text-center">
        <div className="text-sm font-medium text-white">
          {currentChapter?.title || '选择章节'}
        </div>
        <div className="text-xs text-gray-400">
          {currentIndex + 1} / {chapters.length}
        </div>
      </div>

      <button
        onClick={() => navigateChapter('next')}
        disabled={currentIndex >= chapters.length - 1}
        className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );

  // 渲染紧凑模式
  const renderCompact = () => (
    <div className="space-y-1">
      {chapters.map((chapter, index) => {
        const isCurrent = chapter.id === currentChapterId;
        const isCompleted = chapter.completed;

        return (
          <button
            key={chapter.id}
            onClick={() => handleChapterClick(chapter.id)}
            className={cn(
              'w-full text-left px-3 py-2 rounded text-sm transition-all',
              'hover:bg-gray-800/50',
              isCurrent && 'bg-cyber-cyan/10 text-cyber-cyan font-medium',
              isCompleted && !isCurrent && 'text-green-400',
              !isCurrent && !isCompleted && 'text-gray-400'
            )}
          >
            <span className="inline-block w-6">{index + 1}.</span>
            {chapter.title}
          </button>
        );
      })}
    </div>
  );

  // 侧边栏布局
  if (position === 'sidebar') {
    return (
      <div
        ref={containerRef}
        className={cn(
          'relative',
          isCollapsed ? 'w-12' : 'w-72',
          'transition-all duration-300',
          className
        )}
      >
        {/* 折叠/展开按钮 */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -left-8 top-4 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>

        {/* 内容区域 */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="cyber-card p-4 bg-cyber-dark/50 border border-cyber-border overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <List className="w-5 h-5 text-cyber-cyan" />
                  章节导航
                </h3>
              </div>

              {variant === 'full' && renderFull()}
              {variant === 'minimal' && renderMinimal()}
              {variant === 'compact' && renderCompact()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // 浮动按钮布局
  if (position === 'floating') {
    return (
      <div className="fixed bottom-24 right-4 z-40">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
              className="cyber-card p-4 bg-cyber-dark/95 backdrop-blur-xl border border-cyber-border mb-3 max-w-sm max-h-[60vh] overflow-y-auto"
            >
              {variant === 'full' && renderFull()}
              {variant === 'minimal' && renderMinimal()}
              {variant === 'compact' && renderCompact()}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'p-3 rounded-full shadow-lg transition-colors',
            isOpen
              ? 'bg-cyber-pink hover:bg-cyber-pink/80'
              : 'bg-cyber-cyan hover:bg-cyber-cyan/80'
          )}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Menu className="w-6 h-6 text-white" />
          )}
        </motion.button>
      </div>
    );
  }

  // 内联布局
  return (
    <div className={cn('cyber-card p-4 bg-cyber-dark/50 border border-cyber-border', className)}>
      <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
        <List className="w-5 h-5 text-cyber-cyan" />
        章节导航
      </h3>

      {variant === 'full' && renderFull()}
      {variant === 'minimal' && renderMinimal()}
      {variant === 'compact' && renderCompact()}
    </div>
  );
}

export default ChapterNavigator;
