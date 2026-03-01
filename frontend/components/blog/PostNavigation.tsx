'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
}

interface PostNavigationProps {
  previousPost?: Post;
  nextPost?: Post;
  className?: string;
  variant?: 'default' | 'minimal' | 'detailed';
}

export const PostNavigation: React.FC<PostNavigationProps> = ({
  previousPost,
  nextPost,
  className,
  variant = 'default',
}) => {
  const hasNavigation = previousPost || nextPost;

  if (!hasNavigation) {
    return null;
  }

  if (variant === 'minimal') {
    return (
      <nav
        className={cn(
          'flex items-center justify-between py-8 border-t border-b border-dark-700',
          className
        )}
      >
        {previousPost ? (
          <Link
            href={`/blog/${previousPost.slug}`}
            className="flex items-center gap-2 text-gray-400 hover:text-cyber-cyan transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">上一篇</span>
          </Link>
        ) : (
          <div />
        )}

        {nextPost ? (
          <Link
            href={`/blog/${nextPost.slug}`}
            className="flex items-center gap-2 text-gray-400 hover:text-cyber-cyan transition-colors group"
          >
            <span className="text-sm">下一篇</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        ) : (
          <div />
        )}
      </nav>
    );
  }

  return (
    <nav
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 gap-4 py-8 border-t border-b border-dark-700',
        className
      )}
    >
      {previousPost && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href={`/blog/${previousPost.slug}`}
            className="block p-6 rounded-lg bg-dark-800/50 hover:bg-dark-800 border border-dark-700 hover:border-cyber-cyan/30 transition-all group"
          >
            <div className="flex items-center gap-2 mb-3 text-cyber-cyan">
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-semibold">上一篇</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-200 group-hover:text-white transition-colors mb-2">
              {previousPost.title}
            </h3>
            {previousPost.excerpt && (
              <p className="text-sm text-gray-400 line-clamp-2">
                {previousPost.excerpt}
              </p>
            )}
          </Link>
        </motion.div>
      )}

      {nextPost && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(previousPost ? 'md:col-start-2' : 'md:col-start-1')}
        >
          <Link
            href={`/blog/${nextPost.slug}`}
            className="block p-6 rounded-lg bg-dark-800/50 hover:bg-dark-800 border border-dark-700 hover:border-cyber-cyan/30 transition-all group"
          >
            <div className="flex items-center justify-end gap-2 mb-3 text-cyber-cyan">
              <span className="text-sm font-semibold">下一篇</span>
              <ChevronRight className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-200 group-hover:text-white transition-colors mb-2 text-right">
              {nextPost.title}
            </h3>
            {nextPost.excerpt && (
              <p className="text-sm text-gray-400 line-clamp-2 text-right">
                {nextPost.excerpt}
              </p>
            )}
          </Link>
        </motion.div>
      )}
    </nav>
  );
};

interface BreadcrumbNavProps {
  items: Array<{
    label: string;
    href?: string;
  }>;
  className?: string;
}

export const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ items, className }) => {
  return (
    <nav
      className={cn('flex items-center gap-2 text-sm text-gray-400 mb-6', className)}
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <span className="text-gray-600">/</span>
          )}
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-cyber-cyan transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-200">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

interface ChapterNavigationProps {
  chapters: Array<{
    id: string;
    title: string;
    slug: string;
  }>;
  currentChapter: string;
  className?: string;
}

export const ChapterNavigation: React.FC<ChapterNavigationProps> = ({
  chapters,
  currentChapter,
  className,
}) => {
  const currentIndex = useMemo(
    () => chapters.findIndex((ch) => ch.slug === currentChapter),
    [chapters, currentChapter]
  );

  const previousChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  return (
    <nav
      className={cn(
        'flex items-center justify-between py-4 border-t border-b border-dark-700',
        className
      )}
    >
      {previousChapter ? (
        <Link
          href={`#${previousChapter.slug}`}
          className="flex items-center gap-2 text-gray-400 hover:text-cyber-cyan transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <div className="text-left">
            <div className="text-xs text-gray-500">上一章</div>
            <div className="text-sm">{previousChapter.title}</div>
          </div>
        </Link>
      ) : (
        <div />
      )}

      <div className="hidden sm:flex items-center gap-2">
        {chapters.map((chapter, index) => (
          <Link
            key={chapter.id}
            href={`#${chapter.slug}`}
            className={cn(
              'w-2 h-2 rounded-full transition-colors',
              index === currentIndex
                ? 'bg-cyber-cyan'
                : 'bg-gray-700 hover:bg-gray-600'
            )}
            title={chapter.title}
          />
        ))}
      </div>

      {nextChapter ? (
        <Link
          href={`#${nextChapter.slug}`}
          className="flex items-center gap-2 text-gray-400 hover:text-cyber-cyan transition-colors"
        >
          <div className="text-right">
            <div className="text-xs text-gray-500">下一章</div>
            <div className="text-sm">{nextChapter.title}</div>
          </div>
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
};

export default PostNavigation;
