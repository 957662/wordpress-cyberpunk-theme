'use client';

/**
 * ReadingTracker - 高级阅读进度追踪器
 * 支持多种显示模式：顶部进度条、侧边圆环、底部控制栏
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Clock,
  BarChart3,
  ChevronUp,
  ChevronDown,
  Minimize2,
  Maximize2,
  Eye,
  Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ReadingProgress {
  percentage: number;
  currentSection: number;
  totalSections: number;
  timeSpent: number;
  estimatedTimeRemaining: number;
  wordsRead: number;
  totalWords: number;
}

export interface Section {
  id: string;
  title: string;
  element: HTMLElement | null;
  progress: number;
}

export interface ReadingTrackerProps {
  contentRef?: React.RefObject<HTMLElement>;
  sections?: string[];
  totalWords?: number;
  averageReadingSpeed?: number; // words per minute
  showPosition?: 'top' | 'bottom' | 'both';
  variant?: 'linear' | 'circular' | 'minimal';
  className?: string;
}

export function ReadingTracker({
  contentRef,
  sections = [],
  totalWords = 1000,
  averageReadingSpeed = 200,
  showPosition = 'top',
  variant = 'linear',
  className,
}: ReadingTrackerProps) {
  const [progress, setProgress] = useState<ReadingProgress>({
    percentage: 0,
    currentSection: 0,
    totalSections: sections.length,
    timeSpent: 0,
    estimatedTimeRemaining: 0,
    wordsRead: 0,
    totalWords: totalWords,
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [activeSections, setActiveSections] = useState<Section[]>([]);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef<Date>(new Date());

  // 初始化章节
  useEffect(() => {
    if (sections.length > 0 && contentRef?.current) {
      const sectionElements: Section[] = sections.map((title, index) => ({
        id: `section-${index}`,
        title,
        element: contentRef.current?.querySelector(`[data-section="${index}"]`) as HTMLElement,
        progress: 0,
      }));
      setActiveSections(sectionElements);
    }
  }, [sections, contentRef]);

  // 计算阅读进度
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef?.current) return;

      const element = contentRef.current;
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // 计算已滚动的内容高度
      const scrollTop = window.scrollY - element.offsetTop;
      const contentHeight = element.offsetHeight;
      const visibleHeight = windowHeight - rect.top;

      // 计算进度百分比
      let percentage = 0;
      if (rect.top <= 0 && rect.bottom >= windowHeight) {
        // 内容完全在视口中
        percentage = Math.abs(scrollTop) / (contentHeight - windowHeight) * 100;
      } else if (rect.top > 0) {
        // 内容还未开始
        percentage = 0;
      } else if (rect.bottom < windowHeight) {
        // 内容已结束
        percentage = 100;
      } else {
        // 部分可见
        percentage = Math.abs(scrollTop) / contentHeight * 100;
      }

      percentage = Math.min(100, Math.max(0, percentage));

      // 计算当前章节
      let currentSection = 0;
      activeSections.forEach((section, index) => {
        if (section.element) {
          const sectionRect = section.element.getBoundingClientRect();
          if (sectionRect.top <= windowHeight / 2) {
            currentSection = index;
            section.progress = Math.min(
              100,
              Math.max(0, ((windowHeight - sectionRect.top) / sectionRect.offsetHeight) * 100)
            );
          }
        }
      });

      // 计算阅读数据
      const timeSpent = (Date.now() - startTimeRef.current.getTime()) / 1000 / 60; // 分钟
      const wordsRead = Math.round((percentage / 100) * totalWords);
      const estimatedTimeRemaining =
        percentage > 0 ? ((100 - percentage) / 100) * (totalWords / averageReadingSpeed) : totalWords / averageReadingSpeed;

      setProgress({
        percentage: Math.round(percentage),
        currentSection,
        totalSections: sections.length,
        timeSpent: Math.round(timeSpent * 10) / 10,
        estimatedTimeRemaining: Math.round(estimatedTimeRemaining),
        wordsRead,
        totalWords,
      });
    };

    // 节流滚动事件
    const throttledHandleScroll = () => {
      if (scrollTimeoutRef.current) return;
      scrollTimeoutRef.current = setTimeout(() => {
        handleScroll();
        scrollTimeoutRef.current = undefined;
      }, 100);
    };

    window.addEventListener('scroll', throttledHandleScroll);
    handleScroll(); // 初始计算

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [contentRef, activeSections, totalWords, averageReadingSpeed]);

  // 自动隐藏/显示控制栏
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleAutoHide = () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY;

      if (isScrollingDown && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleAutoHide, { passive: true });
    return () => window.removeEventListener('scroll', handleAutoHide);
  }, []);

  // 跳转到指定章节
  const scrollToSection = (index: number) => {
    const section = activeSections[index];
    if (section.element) {
      section.element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // 渲染线性进度条
  const renderLinearProgress = () => (
    <div className="relative w-full h-2 bg-gray-800 rounded-full overflow-hidden">
      <motion.div
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink"
        initial={{ width: 0 }}
        animate={{ width: `${progress.percentage}%` }}
        transition={{ duration: 0.3 }}
      />
      {/* 发光效果 */}
      <motion.div
        className="absolute top-0 h-full w-1 bg-white/50 blur-sm"
        animate={{ left: `${progress.percentage}%` }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );

  // 渲染圆形进度
  const renderCircularProgress = () => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress.percentage / 100) * circumference;

    return (
      <div className="relative w-20 h-20">
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="4"
            fill="none"
          />
          <motion.circle
            cx="40"
            cy="40"
            r={radius}
            stroke="url(#gradient)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.3 }}
            style={{
              strokeDasharray: circumference,
            }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00f0ff" />
              <stop offset="50%" stopColor="#9d00ff" />
              <stop offset="100%" stopColor="#ff0080" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-white">{progress.percentage}%</span>
        </div>
      </div>
    );
  };

  // 渲染统计信息
  const renderStats = () => (
    <div className="flex items-center gap-6 text-sm">
      <div className="flex items-center gap-2 text-gray-400">
        <BookOpen className="w-4 h-4" />
        <span>{progress.wordsRead}/{progress.totalWords} 字</span>
      </div>
      <div className="flex items-center gap-2 text-gray-400">
        <Clock className="w-4 h-4" />
        <span>{progress.timeSpent} 分钟</span>
      </div>
      <div className="flex items-center gap-2 text-cyber-cyan">
        <Target className="w-4 h-4" />
        <span>约 {progress.estimatedTimeRemaining} 分钟剩余</span>
      </div>
    </div>
  );

  // 渲染章节导航
  const renderSectionNav = () => {
    if (sections.length === 0) return null;

    return (
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {sections.map((section, index) => (
          <motion.button
            key={index}
            onClick={() => scrollToSection(index)}
            className={cn(
              'flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              index === progress.currentSection
                ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40'
                : 'bg-gray-800/50 text-gray-400 hover:text-white border border-transparent'
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {index + 1}. {section}
          </motion.button>
        ))}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* 顶部进度条 */}
          {(showPosition === 'top' || showPosition === 'both') && (
            <motion.div
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              exit={{ y: -100 }}
              className={cn(
                'fixed top-0 left-0 right-0 z-50 bg-cyber-dark/90 backdrop-blur-xl border-b border-cyber-border',
                className
              )}
            >
              <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                  {/* 进度显示 */}
                  <div className="flex items-center gap-4">
                    {variant === 'circular' ? renderCircularProgress() : (
                      <div className="flex-1 min-w-[200px]">
                        {renderLinearProgress()}
                      </div>
                    )}
                    {variant !== 'minimal' && (
                      <div className="hidden md:block">
                        {renderStats()}
                      </div>
                    )}
                  </div>

                  {/* 控制按钮 */}
                  <div className="flex items-center gap-2">
                    {sections.length > 0 && (
                      <motion.button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isExpanded ? (
                          <Minimize2 className="w-4 h-4" />
                        ) : (
                          <Maximize2 className="w-4 h-4" />
                        )}
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* 展开的章节导航 */}
                <AnimatePresence>
                  {isExpanded && sections.length > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pt-4 border-t border-cyber-border"
                    >
                      {renderSectionNav()}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* 底部迷你控制栏 */}
          {(showPosition === 'bottom' || showPosition === 'both') && (
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className={cn(
                'fixed bottom-0 left-0 right-0 z-50 bg-cyber-dark/90 backdrop-blur-xl border-t border-cyber-border',
                className
              )}
            >
              <div className="max-w-7xl mx-auto px-4 py-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm">
                    {variant === 'circular' ? (
                      <div className="w-10 h-10">{renderCircularProgress()}</div>
                    ) : (
                      <div className="w-32">{renderLinearProgress()}</div>
                    )}
                    <span className="text-gray-400">{progress.percentage}%</span>
                  </div>

                  {sections.length > 0 && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => scrollToSection(Math.max(0, progress.currentSection - 1))}
                        disabled={progress.currentSection === 0}
                        className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <span className="text-xs text-gray-400 min-w-[60px] text-center">
                        {sections[progress.currentSection]}
                      </span>
                      <button
                        onClick={() => scrollToSection(
                          Math.min(sections.length - 1, progress.currentSection + 1)
                        )}
                        disabled={progress.currentSection === sections.length - 1}
                        className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}

export default ReadingTracker;
