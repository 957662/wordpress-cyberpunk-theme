'use client';

/**
 * 阅读时间计算器组件
 * 根据内容长度计算预估阅读时间
 */

import { useEffect, useState, useMemo } from 'react';
import { Clock, BookOpen, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ReadingTimeCalculatorProps {
  content: string;
  wordsPerMinute?: number;
  images?: number;
  showWords?: boolean;
  showViews?: boolean;
  views?: number;
  variant?: 'simple' | 'detailed' | 'compact';
  className?: string;
}

export function ReadingTimeCalculator({
  content,
  wordsPerMinute = 200,
  images = 0,
  showWords = false,
  showViews = false,
  views = 0,
  variant = 'simple',
  className = '',
}: ReadingTimeCalculatorProps) {
  // 计算字数
  const wordCount = useMemo(() => {
    // 移除 HTML 标签
    const textContent = content.replace(/<[^>]*>/g, '');
    // 移除多余空格
    const cleanText = textContent.trim();
    // 英文按单词数,中文按字符数
    const englishWords = cleanText.match(/[a-zA-Z]+/g)?.length || 0;
    const chineseChars = cleanText.match(/[\u4e00-\u9fa5]/g)?.length || 0;
    return englishWords + chineseChars;
  }, [content]);

  // 计算阅读时间 (考虑图片时间)
  const readingTime = useMemo(() => {
    const readingTimeMinutes = wordCount / wordsPerMinute;
    const imageTime = images * 0.2; // 每张图片增加 12 秒
    const totalMinutes = readingTimeMinutes + imageTime;
    return Math.ceil(totalMinutes);
  }, [wordCount, wordsPerMinute, images]);

  // 格式化阅读时间
  const formatReadingTime = (minutes: number) => {
    if (minutes < 1) return '少于 1 分钟';
    if (minutes < 60) return `${minutes} 分钟`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours} 小时 ${remainingMinutes} 分钟` : `${hours} 小时`;
  };

  // 格式化浏览量
  const formatViews = (viewCount: number) => {
    if (viewCount >= 1000000) return `${(viewCount / 1000000).toFixed(1)}M`;
    if (viewCount >= 1000) return `${(viewCount / 1000).toFixed(1)}K`;
    return viewCount.toLocaleString();
  };

  // 渲染不同变体
  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-3 text-sm text-cyber-muted', className)}>
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          <span>{formatReadingTime(readingTime)}</span>
        </div>

        {showWords && (
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            <span>{wordCount.toLocaleString()} 字</span>
          </div>
        )}

        {showViews && views > 0 && (
          <div className="flex items-center gap-1.5">
            <Eye className="w-4 h-4" />
            <span>{formatViews(views)} 阅读</span>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={cn('space-y-2', className)}>
        <div className="flex items-center justify-between p-3 rounded-lg bg-cyber-muted/30 border border-cyber-border">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyber-cyan" />
            <span className="text-sm text-cyber-muted">预计阅读时间</span>
          </div>
          <span className="font-semibold text-white">{formatReadingTime(readingTime)}</span>
        </div>

        {showWords && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-cyber-muted/30 border border-cyber-border">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyber-purple" />
              <span className="text-sm text-cyber-muted">文章字数</span>
            </div>
            <span className="font-semibold text-white">{wordCount.toLocaleString()} 字</span>
          </div>
        )}

        {showViews && views > 0 && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-cyber-muted/30 border border-cyber-border">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-cyber-pink" />
              <span className="text-sm text-cyber-muted">浏览量</span>
            </div>
            <span className="font-semibold text-white">{formatViews(views)}</span>
          </div>
        )}
      </div>
    );
  }

  // 默认简单变体
  return (
    <div className={cn('flex items-center gap-4 text-sm', className)}>
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyber-muted/30 border border-cyber-border">
        <Clock className="w-4 h-4 text-cyber-cyan" />
        <span className="text-cyber-muted">
          阅读时间: <span className="font-semibold text-white">{formatReadingTime(readingTime)}</span>
        </span>
      </div>

      {showWords && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyber-muted/30 border border-cyber-border">
          <BookOpen className="w-4 h-4 text-cyber-purple" />
          <span className="text-cyber-muted">
            <span className="font-semibold text-white">{wordCount.toLocaleString()}</span> 字
          </span>
        </div>
      )}

      {showViews && views > 0 && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyber-muted/30 border border-cyber-border">
          <Eye className="w-4 h-4 text-cyber-pink" />
          <span className="text-cyber-muted">
            <span className="font-semibold text-white">{formatViews(views)}</span> 阅读
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * 阅读进度指示器
 */
export interface ReadingProgressProps {
  contentRef: React.RefObject<HTMLElement>;
  className?: string;
}

export function ReadingProgress({ contentRef, className = '' }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;

      const element = contentRef.current;
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementTop = rect.top;
      const elementHeight = rect.height;
      const scrollableDistance = elementHeight - windowHeight;

      if (scrollableDistance <= 0) {
        setProgress(100);
        return;
      }

      const scrolled = -elementTop;
      const currentProgress = (scrolled / scrollableDistance) * 100;
      setProgress(Math.max(0, Math.min(100, currentProgress)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [contentRef]);

  return (
    <div className={cn('w-full h-1 bg-cyber-dark', className)}>
      <div
        className="h-full bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

/**
 * 文章指标卡片
 */
export interface ArticleMetricsProps {
  readingTime: number;
  wordCount: number;
  views?: number;
  likes?: number;
  comments?: number;
  publishDate?: string;
  className?: string;
}

export function ArticleMetrics({
  readingTime,
  wordCount,
  views,
  likes,
  comments,
  publishDate,
  className = '',
}: ArticleMetricsProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-3', className)}>
      <div className="p-4 rounded-lg bg-cyber-muted/30 border border-cyber-border">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-cyber-cyan" />
          <span className="text-xs text-cyber-muted">阅读时间</span>
        </div>
        <p className="text-lg font-semibold text-white">
          {readingTime < 60 ? `${readingTime} 分钟` : `${Math.floor(readingTime / 60)} 小时`}
        </p>
      </div>

      <div className="p-4 rounded-lg bg-cyber-muted/30 border border-cyber-border">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-4 h-4 text-cyber-purple" />
          <span className="text-xs text-cyber-muted">文章字数</span>
        </div>
        <p className="text-lg font-semibold text-white">{wordCount.toLocaleString()}</p>
      </div>

      {views !== undefined && (
        <div className="p-4 rounded-lg bg-cyber-muted/30 border border-cyber-border">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-4 h-4 text-cyber-pink" />
            <span className="text-xs text-cyber-muted">浏览量</span>
          </div>
          <p className="text-lg font-semibold text-white">{views.toLocaleString()}</p>
        </div>
      )}

      {(likes !== undefined || comments !== undefined) && (
        <div className="p-4 rounded-lg bg-cyber-muted/30 border border-cyber-border">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-cyber-muted">互动</span>
          </div>
          <div className="flex gap-3">
            {likes !== undefined && (
              <p className="text-sm font-semibold text-white">
                {likes.toLocaleString()} 赞
              </p>
            )}
            {comments !== undefined && (
              <p className="text-sm font-semibold text-white">
                {comments.toLocaleString()} 评
              </p>
            )}
          </div>
        </div>
      )}

      {publishDate && (
        <div className="col-span-2 p-4 rounded-lg bg-cyber-muted/30 border border-cyber-border">
          <p className="text-xs text-cyber-muted mb-1">发布时间</p>
          <p className="text-sm font-semibold text-white">{formatDate(publishDate)}</p>
        </div>
      )}
    </div>
  );
}

export default ReadingTimeCalculator;
