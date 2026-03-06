/**
 * 文章系列导航组件
 * 用于展示同一系列文章的导航
 */

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, List } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ArticleSeriesProps {
  /**
   * 系列标题
   */
  title: string;
  /**
   * 系列描述
   */
  description?: string;
  /**
   * 系列中的文章列表
   */
  articles: Array<{
    slug: string;
    title: string;
    description?: string;
    order: number;
  }>;
  /**
   * 当前文章的 slug
   */
  currentSlug: string;
  /**
   * 自定义样式类名
   */
  className?: string;
}

export function SeriesNavigation({
  title,
  description,
  articles,
  currentSlug,
  className,
}: ArticleSeriesProps) {
  // 找到当前文章的索引
  const currentIndex = articles.findIndex((article) => article.slug === currentSlug);

  if (currentIndex === -1) return null;

  const prevArticle = currentIndex > 0 ? articles[currentIndex - 1] : null;
  const nextArticle = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;
  const progress = ((currentIndex + 1) / articles.length) * 100;

  return (
    <div
      className={cn(
        'cyber-card p-6 space-y-6',
        className
      )}
    >
      {/* 系列信息 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <List className="w-5 h-5 text-cyber-cyan" />
            {title}
          </h3>
          <span className="text-sm text-gray-400">
            {currentIndex + 1} / {articles.length}
          </span>
        </div>

        {description && (
          <p className="text-sm text-gray-400">{description}</p>
        )}

        {/* 进度条 */}
        <div className="h-1 bg-cyber-border rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* 导航按钮 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 上一篇文章 */}
        {prevArticle ? (
          <Link href={`/blog/${prevArticle.slug}`} className="group">
            <motion.div
              whileHover={{ x: -4 }}
              className={cn(
                'p-4 rounded-lg border border-cyber-border/50',
                'bg-cyber-dark/50 hover:bg-cyber-cyan/5',
                'transition-all duration-300',
                'text-left'
              )}
            >
              <div className="flex items-center gap-2 text-cyber-cyan text-sm mb-2">
                <ArrowLeft className="w-4 h-4" />
                <span>上一篇</span>
              </div>
              <h4 className="text-white font-medium group-hover:text-cyber-cyan transition-colors">
                {prevArticle.title}
              </h4>
              {prevArticle.description && (
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                  {prevArticle.description}
                </p>
              )}
            </motion.div>
          </Link>
        ) : (
          <div className="p-4 rounded-lg border border-dashed border-cyber-border/30 opacity-50">
            <p className="text-sm text-gray-500">已经是第一篇了</p>
          </div>
        )}

        {/* 下一篇文章 */}
        {nextArticle ? (
          <Link href={`/blog/${nextArticle.slug}`} className="group">
            <motion.div
              whileHover={{ x: 4 }}
              className={cn(
                'p-4 rounded-lg border border-cyber-border/50',
                'bg-cyber-dark/50 hover:bg-cyber-purple/5',
                'transition-all duration-300',
                'text-right'
              )}
            >
              <div className="flex items-center justify-end gap-2 text-cyber-purple text-sm mb-2">
                <span>下一篇</span>
                <ArrowRight className="w-4 h-4" />
              </div>
              <h4 className="text-white font-medium group-hover:text-cyber-purple transition-colors">
                {nextArticle.title}
              </h4>
              {nextArticle.description && (
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                  {nextArticle.description}
                </p>
              )}
            </motion.div>
          </Link>
        ) : (
          <div className="p-4 rounded-lg border border-dashed border-cyber-border/30 opacity-50">
            <p className="text-sm text-gray-500 text-right">已经是最后一篇了</p>
          </div>
        )}
      </div>

      {/* 文章列表 */}
      <details className="group">
        <summary className="cursor-pointer list-none">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'w-full px-4 py-2 rounded-lg',
              'bg-cyber-dark/50 hover:bg-cyber-dark',
              'border border-cyber-border/50',
              'text-sm text-gray-400 hover:text-white',
              'transition-all duration-300'
            )}
          >
            查看完整系列 ({articles.length} 篇文章)
          </motion.button>
        </summary>

        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="mt-4 space-y-2"
        >
          {articles.map((article, index) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className={cn(
                'block p-3 rounded-lg transition-all duration-300',
                'hover:bg-cyber-muted',
                article.slug === currentSlug
                  ? 'bg-cyber-cyan/10 border border-cyber-cyan/30'
                  : 'border border-transparent'
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    'flex-shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center',
                    article.slug === currentSlug
                      ? 'bg-cyber-cyan text-cyber-dark'
                      : 'bg-cyber-border text-gray-400'
                  )}
                >
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <h4
                    className={cn(
                      'text-sm font-medium',
                      article.slug === currentSlug ? 'text-cyber-cyan' : 'text-white'
                    )}
                  >
                    {article.title}
                  </h4>
                  {article.description && (
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                      {article.description}
                    </p>
                  )}
                </div>
                {article.slug === currentSlug && (
                  <span className="flex-shrink-0 text-xs text-cyber-cyan">当前</span>
                )}
              </div>
            </Link>
          ))}
        </motion.div>
      </details>
    </div>
  );
}

/**
 * 简洁版系列导航（仅显示上一篇/下一篇）
 */
export interface SimpleSeriesNavProps {
  prevArticle?: {
    slug: string;
    title: string;
  };
  nextArticle?: {
    slug: string;
    title: string;
  };
  className?: string;
}

export function SimpleSeriesNav({
  prevArticle,
  nextArticle,
  className,
}: SimpleSeriesNavProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-4',
        className
      )}
    >
      {prevArticle ? (
        <Link href={`/blog/${prevArticle.slug}`} className="group">
          <motion.div
            whileHover={{ x: -4 }}
            className={cn(
              'p-4 rounded-lg border border-cyber-border/50',
              'bg-cyber-dark/50 hover:bg-cyber-cyan/5',
              'transition-all duration-300'
            )}
          >
            <div className="flex items-center gap-2 text-cyber-cyan text-sm mb-2">
              <ArrowLeft className="w-4 h-4" />
              <span>上一篇</span>
            </div>
            <h4 className="text-white font-medium group-hover:text-cyber-cyan transition-colors line-clamp-2">
              {prevArticle.title}
            </h4>
          </motion.div>
        </Link>
      ) : (
        <div />
      )}

      {nextArticle ? (
        <Link href={`/blog/${nextArticle.slug}`} className="group">
          <motion.div
            whileHover={{ x: 4 }}
            className={cn(
              'p-4 rounded-lg border border-cyber-border/50',
              'bg-cyber-dark/50 hover:bg-cyber-purple/5',
              'transition-all duration-300'
            )}
          >
            <div className="flex items-center justify-end gap-2 text-cyber-purple text-sm mb-2">
              <span>下一篇</span>
              <ArrowRight className="w-4 h-4" />
            </div>
            <h4 className="text-white font-medium group-hover:text-cyber-purple transition-colors line-clamp-2">
              {nextArticle.title}
            </h4>
          </motion.div>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}

/**
 * 系列进度条组件
 */
export interface SeriesProgressProps {
  /**
   * 当前进度
   */
  current: number;
  /**
   * 总数
   */
  total: number;
  /**
   * 颜色主题
   */
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  /**
   * 是否显示百分比
   */
  showPercentage?: boolean;
  /**
   * 自定义样式类名
   */
  className?: string;
}

export function SeriesProgress({
  current,
  total,
  color = 'cyan',
  showPercentage = false,
  className,
}: SeriesProgressProps) {
  const progress = (current / total) * 100;

  const colorStyles = {
    cyan: 'bg-cyber-cyan',
    purple: 'bg-cyber-purple',
    pink: 'bg-cyber-pink',
    green: 'bg-cyber-green',
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">
          系列进度
        </span>
        {showPercentage && (
          <span className="text-white font-medium">
            {Math.round(progress)}%
          </span>
        )}
        <span className="text-gray-400">
          {current} / {total}
        </span>
      </div>

      <div className="h-2 bg-cyber-border rounded-full overflow-hidden">
        <motion.div
          className={cn('h-full', colorStyles[color])}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export default SeriesNavigation;
