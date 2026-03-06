'use client';

/**
 * 文章导航组件
 * 提供上一篇/下一篇文章的导航功能
 * 带有文章预览和悬浮效果
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  featuredImage?: string;
}

interface ArticleNavigationProps {
  previousArticle?: Article | null;
  nextArticle?: Article | null;
  className?: string;
  showThumbnails?: boolean;
}

export function ArticleNavigation({
  previousArticle,
  nextArticle,
  className = '',
  showThumbnails = true,
}: ArticleNavigationProps) {
  const [hovered, setHovered] = useState<'prev' | 'next' | null>(null);

  return (
    <nav
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 gap-4 mt-12',
        className
      )}
    >
      {/* 上一篇文章 */}
      {previousArticle ? (
        <NavigationCard
          article={previousArticle}
          direction="prev"
          showThumbnail={showThumbnails}
          isHovered={hovered === 'prev'}
          onHover={() => setHovered('prev')}
          onLeave={() => setHovered(null)}
        />
      ) : (
        <div className="hidden md:block" />
      )}

      {/* 下一篇文章 */}
      {nextArticle ? (
        <NavigationCard
          article={nextArticle}
          direction="next"
          showThumbnail={showThumbnails}
          isHovered={hovered === 'next'}
          onHover={() => setHovered('next')}
          onLeave={() => setHovered(null)}
        />
      ) : (
        <div className="hidden md:block" />
      )}
    </nav>
  );
}

interface NavigationCardProps {
  article: Article;
  direction: 'prev' | 'next';
  showThumbnail: boolean;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}

function NavigationCard({
  article,
  direction,
  showThumbnail,
  isHovered,
  onHover,
  onLeave,
}: NavigationCardProps) {
  const isPrev = direction === 'prev';
  const icon = isPrev ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />;
  const label = isPrev ? '上一篇' : '下一篇';
  const alignmentClass = isPrev ? 'text-left' : 'text-right';
  const flexAlignment = isPrev ? 'md:flex-row' : 'md:flex-row-reverse';
  const textAlignment = isPrev ? 'items-start' : 'items-end';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="relative group"
    >
      <Link
        href={`/blog/${article.slug}`}
        className={cn(
          'block h-full',
          'relative overflow-hidden rounded-lg',
          'bg-cyber-card border border-cyber-border',
          'hover:border-cyber-cyan/50 transition-all duration-300',
          'hover:shadow-lg hover:shadow-cyber-cyan/10'
        )}
      >
        {/* 背景渐变效果 */}
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300',
            isPrev
              ? 'from-cyber-cyan/20 to-transparent'
              : 'from-cyber-purple/20 to-transparent'
          )}
        />

        <div
          className={cn(
            'relative flex flex-col md:flex-row gap-4 p-6',
            flexAlignment,
            textAlignment
          )}
        >
          {/* 缩略图 */}
          {showThumbnail && article.featuredImage && (
            <div
              className={cn(
                'relative w-full md:w-32 h-32 flex-shrink-0 overflow-hidden rounded-md',
                isPrev ? 'md:order-2' : 'md:order-1'
              )}
            >
              <motion.img
                src={article.featuredImage}
                alt={article.title}
                className="w-full h-full object-cover"
                initial={{ scale: 1 }}
                animate={{ scale: isHovered ? 1.1 : 1 }}
                transition={{ duration: 0.3 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark/80 to-transparent" />
            </div>
          )}

          {/* 内容 */}
          <div className="flex-1 min-w-0">
            {/* 标签 */}
            <div
              className={cn(
                'flex items-center gap-2 mb-3',
                isPrev ? 'md:justify-start' : 'md:justify-end'
              )}
            >
              <BookOpen className="w-4 h-4 text-cyber-muted" />
              <span className="text-sm font-medium text-cyber-muted">
                {label}
              </span>
              <motion.div
                initial={false}
                animate={{ x: isHovered ? (isPrev ? -5 : 5) : 0 }}
                transition={{ duration: 0.2 }}
                className="text-cyber-cyan"
              >
                {icon}
              </motion.div>
            </div>

            {/* 标题 */}
            <motion.h3
              className={cn(
                'text-lg font-semibold text-white mb-2 line-clamp-2',
                'group-hover:text-cyber-cyan transition-colors duration-200'
              )}
              initial={false}
              animate={{ x: isHovered ? (isPrev ? -3 : 3) : 0 }}
              transition={{ duration: 0.2 }}
            >
              {article.title}
            </motion.h3>

            {/* 摘要 */}
            <AnimatePresence>
              {isHovered && article.excerpt && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="text-sm text-cyber-muted line-clamp-2">
                    {article.excerpt}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 底部边框效果 */}
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 h-[2px]',
            'bg-gradient-to-r from-transparent via-cyber-cyan to-transparent',
            'opacity-0 group-hover:opacity-100 transition-opacity duration-300'
          )}
        />
      </Link>
    </motion.div>
  );
}

export default ArticleNavigation;
