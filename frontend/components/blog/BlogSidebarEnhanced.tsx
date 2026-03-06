/**
 * BlogSidebarEnhanced - 增强版博客侧边栏
 * 集成分类、标签、热门文章等功能
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { BlogCategory, BlogTag, PostListItem } from '@/lib/wordpress/types';

export interface BlogSidebarEnhancedProps {
  categories?: BlogCategory[];
  tags?: BlogTag[];
  popularPosts?: PostListItem[];
  recentPosts?: PostListItem[];
  showNewsletter?: boolean;
  showCategories?: boolean;
  showTags?: boolean;
  showPopularPosts?: boolean;
  showRecentPosts?: boolean;
  className?: string;
}

export function BlogSidebarEnhanced({
  categories = [],
  tags = [],
  popularPosts = [],
  recentPosts = [],
  showNewsletter = true,
  showCategories = true,
  showTags = true,
  showPopularPosts = true,
  showRecentPosts = true,
  className,
}: BlogSidebarEnhancedProps) {
  // 渲染分类部分
  const renderCategories = () => {
    if (!showCategories || categories.length === 0) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-cyber-cyan rounded" />
          分类
        </h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/blog/category/${category.slug}`}
              className={cn(
                'flex items-center justify-between px-4 py-2',
                'bg-cyber-dark/60 border border-cyber-cyan/20 rounded-lg',
                'hover:border-cyber-cyan/50 hover:bg-cyber-cyan/10',
                'transition-all group'
              )}
            >
              <span className="text-cyber-muted/70 group-hover:text-white transition-colors">
                {category.name}
              </span>
              <span className="text-sm text-cyber-cyan/60 font-medium">
                {category.count || 0}
              </span>
            </Link>
          ))}
        </div>
      </motion.div>
    );
  };

  // 渲染标签云
  const renderTags = () => {
    if (!showTags || tags.length === 0) return null;

    const popularTags = tags
      .filter(tag => (tag.count || 0) > 0)
      .sort((a, b) => (b.count || 0) - (a.count || 0))
      .slice(0, 20);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-cyber-purple rounded" />
          热门标签
        </h3>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <Link
              key={tag.id}
              href={`/blog/tag/${tag.slug}`}
              className={cn(
                'px-3 py-1.5 text-sm rounded-full',
                'bg-cyber-purple/20 text-cyber-purple/90',
                'border border-cyber-purple/30',
                'hover:bg-cyber-purple/30 hover:border-cyber-purple/50',
                'transition-all'
              )}
              style={{
                fontSize: `${Math.max(0.75, Math.min(1, (tag.count || 0) / 10))}rem`,
              }}
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      </motion.div>
    );
  };

  // 渲染热门文章
  const renderPopularPosts = () => {
    if (!showPopularPosts || popularPosts.length === 0) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-cyber-pink rounded" />
          热门文章
        </h3>
        <div className="space-y-3">
          {popularPosts.slice(0, 5).map((post, index) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className={cn(
                'flex gap-3 p-3 rounded-lg',
                'bg-cyber-dark/60 border border-cyber-cyan/20',
                'hover:border-cyber-cyan/50 hover:bg-cyber-cyan/10',
                'transition-all group'
              )}
            >
              <div className={cn(
                'flex-shrink-0 w-8 h-8 rounded',
                'bg-gradient-to-br from-cyber-cyan to-cyber-purple',
                'flex items-center justify-center text-white font-bold text-sm'
              )}>
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white line-clamp-2 group-hover:text-cyber-cyan transition-colors">
                  {post.title}
                </h4>
                {post.readingTime && (
                  <p className="text-xs text-cyber-muted/50 mt-1">
                    {post.readingTime} 分钟阅读
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
    );
  };

  // 渲染最新文章
  const renderRecentPosts = () => {
    if (!showRecentPosts || recentPosts.length === 0) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-cyber-green rounded" />
          最新文章
        </h3>
        <div className="space-y-3">
          {recentPosts.slice(0, 5).map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className={cn(
                'flex gap-3 p-3 rounded-lg',
                'bg-cyber-dark/60 border border-cyber-cyan/20',
                'hover:border-cyber-cyan/50 hover:bg-cyber-cyan/10',
                'transition-all group'
              )}
            >
              {post.featuredImage && (
                <div className="flex-shrink-0 w-16 h-12 rounded overflow-hidden">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white line-clamp-2 group-hover:text-cyber-cyan transition-colors">
                  {post.title}
                </h4>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
    );
  };

  // 渲染订阅框
  const renderNewsletter = () => {
    if (!showNewsletter) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <div className={cn(
          'p-6 rounded-lg',
          'bg-gradient-to-br from-cyber-cyan/20 to-cyber-purple/20',
          'border-2 border-cyber-cyan/30'
        )}>
          <h3 className="text-lg font-bold text-white mb-2">
            订阅更新
          </h3>
          <p className="text-sm text-cyber-muted/70 mb-4">
            获取最新文章和技术资讯
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // 处理订阅逻辑
            }}
            className="space-y-2"
          >
            <input
              type="email"
              placeholder="your@email.com"
              required
              className={cn(
                'w-full px-4 py-2',
                'bg-cyber-dark/80 border border-cyber-cyan/30 rounded',
                'text-white placeholder:text-cyber-muted/50',
                'focus:outline-none focus:border-cyber-cyan/60',
                'transition-all'
              )}
            />
            <button
              type="submit"
              className={cn(
                'w-full px-4 py-2',
                'bg-gradient-to-r from-cyber-cyan to-cyber-purple',
                'text-white font-medium rounded',
                'hover:opacity-90 transition-opacity'
              )}
            >
              订阅
            </button>
          </form>
        </div>
      </motion.div>
    );
  };

  return (
    <aside className={cn('w-full space-y-6', className)}>
      {renderNewsletter()}
      {renderCategories()}
      {renderTags()}
      {renderPopularPosts()}
      {renderRecentPosts()}
    </aside>
  );
}

export default BlogSidebarEnhanced;
