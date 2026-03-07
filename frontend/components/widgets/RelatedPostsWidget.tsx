/**
 * 相关文章 Widget
 * 显示与当前文章相关的其他文章（基于标签或分类）
 */

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { TagIcon, FolderIcon, ArrowIcon } from '@/components/icons';
import { Widget } from './base/Widget';
import { cn } from '@/lib/utils';
import type { Post } from '@/types/wordpress';

export interface RelatedPostsWidgetProps {
  /** 当前文章 */
  currentPost: Post;
  /** 所有文章列表（用于筛选相关文章） */
  allPosts: Post[];
  /** 显示数量 */
  count?: number;
  /** 相关性判断方式 */
  relateBy?: 'tags' | 'categories' | 'both';
  /** Widget 标题 */
  title?: string;
  /** 是否显示标签/分类 */
  showTaxonomy?: boolean;
  /** 自定义类名 */
  className?: string;
}

export function RelatedPostsWidget({
  currentPost,
  allPosts,
  count = 5,
  relateBy = 'both',
  title = '相关文章',
  showTaxonomy = true,
  className,
}: RelatedPostsWidgetProps) {
  // 计算文章相关度
  const calculateRelevance = (post: Post) => {
    if (post.id === currentPost.id) return 0;

    let score = 0;
    const currentTags = currentPost.tags || [];
    const currentCategories = currentPost.categories || [];
    const postTags = post.tags || [];
    const postCategories = post.categories || [];

    // 基于标签的相关度
    if (relateBy === 'tags' || relateBy === 'both') {
      const commonTags = currentTags.filter(tag => postTags.includes(tag));
      score += commonTags.length * 2; // 标签权重更高
    }

    // 基于分类的相关度
    if (relateBy === 'categories' || relateBy === 'both') {
      const commonCategories = currentCategories.filter(cat =>
        postCategories.includes(cat)
      );
      score += commonCategories.length;
    }

    return score;
  };

  // 获取相关文章
  const relatedPosts = [...allPosts]
    .map(post => ({
      post,
      relevance: calculateRelevance(post),
    }))
    .filter(item => item.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, count)
    .map(item => item.post);

  // 如果没有相关文章，显示最新文章
  const fallbackPosts = relatedPosts.length === 0
    ? allPosts
        .filter(post => post.id !== currentPost.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, count)
    : [];

  const displayPosts = relatedPosts.length > 0 ? relatedPosts : fallbackPosts;
  const isFallback = relatedPosts.length === 0;

  return (
    <Widget title={title} className={className}>
      <div className="space-y-4">
        {displayPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              href={`/blog/${post.slug}`}
              className="group block p-4 rounded-lg bg-cyber-dark/50 border border-cyber-border hover:border-cyber-purple transition-all duration-300 hover:shadow-neon-purple"
            >
              {/* 标题 */}
              <h4 className="font-medium text-white mb-2 line-clamp-2 group-hover:text-cyber-purple transition-colors">
                {post.title.rendered}
              </h4>

              {/* 摘要 */}
              {post.excerpt && (
                <p
                  className="text-sm text-gray-400 mb-3 line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                />
              )}

              {/* 分类/标签 */}
              {showTaxonomy && (
                <div className="flex items-center gap-2 mb-3">
                  {post.categories && post.categories.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-cyber-purple">
                      <FolderIcon className="w-3 h-3" />
                      <span>{post.categories.length} 个分类</span>
                    </div>
                  )}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-cyber-cyan">
                      <TagIcon className="w-3 h-3" />
                      <span>{post.tags.length} 个标签</span>
                    </div>
                  )}
                </div>
              )}

              {/* 阅读更多 */}
              <div className="flex items-center gap-2 text-sm text-cyber-purple group-hover:gap-3 transition-all">
                <span>阅读全文</span>
                <ArrowIcon className="w-4 h-4" />
              </div>
            </Link>
          </motion.div>
        ))}

        {displayPosts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <TagIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>暂无相关文章</p>
          </div>
        )}

        {/* 提示信息 */}
        {isFallback && displayPosts.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/30 text-xs text-cyber-cyan">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>未找到基于标签/分类的相关文章，以下显示最新文章</span>
          </div>
        )}
      </div>
    </Widget>
  );
}
