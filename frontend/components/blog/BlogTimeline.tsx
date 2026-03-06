/**
 * BlogTimeline - 博客时间线组件
 * 以时间线形式展示博客文章
 */

'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BlogCardNew } from './BlogCardNew';
import { Post } from '@/types';
import { formatPublishDate } from '@/lib/utils/blog-helpers';

export interface BlogTimelineProps {
  posts: Post[];
  groupBy?: 'year' | 'month' | 'year-month';
  showEmptyGroups?: boolean;
  className?: string;
}

export const BlogTimeline: React.FC<BlogTimelineProps> = ({
  posts,
  groupBy = 'year-month',
  showEmptyGroups = false,
  className,
}) => {
  // 按时间分组文章
  const groupedPosts = useMemo(() => {
    const groups: Record<string, Post[]> = {};

    posts.forEach(post => {
      const date = new Date(post.publishedAt || post.createdAt);
      let key: string;

      switch (groupBy) {
        case 'year':
          key = date.getFullYear().toString();
          break;
        case 'month':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        case 'year-month':
        default:
          key = `${date.getFullYear()}年${date.getMonth() + 1}月`;
          break;
      }

      if (!groups[key]) {
        groups[key] = [];
      }

      groups[key].push(post);
    });

    // 按时间倒序排序
    const sortedGroups: Record<string, Post[]> = {};
    Object.keys(groups)
      .sort()
      .reverse()
      .forEach(key => {
        sortedGroups[key] = groups[key].sort((a, b) => {
          const dateA = new Date(a.publishedAt || a.createdAt).getTime();
          const dateB = new Date(b.publishedAt || b.createdAt).getTime();
          return dateB - dateA;
        });
      });

    return sortedGroups;
  }, [posts, groupBy]);

  // 格式化分组标题
  const formatGroupTitle = (key: string): string => {
    if (groupBy === 'year-month') {
      return key;
    }

    if (groupBy === 'year') {
      return `${key}年`;
    }

    if (groupBy === 'month') {
      const [year, month] = key.split('-');
      return `${year}年${parseInt(month)}月`;
    }

    return key;
  };

  // 获取分组统计
  const getGroupStats = (groupPosts: Post[]) => {
    return {
      count: groupPosts.length,
      totalViews: groupPosts.reduce((sum, post) => sum + (post.views || 0), 0),
      totalLikes: groupPosts.reduce((sum, post) => sum + (post.likes || 0), 0),
    };
  };

  if (Object.keys(groupedPosts).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <Calendar className="w-16 h-16 text-gray-700 mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">暂无文章</h3>
        <p className="text-gray-400 text-sm">还没有发布任何文章</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-12', className)}>
      {Object.entries(groupedPosts).map(([key, groupPosts], groupIndex) => {
        const stats = getGroupStats(groupPosts);

        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.1 }}
          >
            {/* 分组标题 */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-lg">
                <Calendar className="w-5 h-5 text-cyber-cyan" />
                <h2 className="text-lg font-bold text-cyber-cyan">
                  {formatGroupTitle(key)}
                </h2>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>{stats.count} 篇文章</span>
                {stats.totalViews > 0 && (
                  <span>{stats.totalViews} 次浏览</span>
                )}
                {stats.totalLikes > 0 && (
                  <span>{stats.totalLikes} 个赞</span>
                )}
              </div>

              <div className="flex-1 h-px bg-gradient-to-r from-cyber-cyan/30 to-transparent" />
            </div>

            {/* 时间线 */}
            <div className="relative pl-8 border-l-2 border-cyber-cyan/30 space-y-6">
              {groupPosts.map((post, postIndex) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: groupIndex * 0.1 + postIndex * 0.05 }}
                  className="relative"
                >
                  {/* 时间线节点 */}
                  <div className="absolute left-[-39px] top-6 w-5 h-5 rounded-full bg-cyber-cyan border-4 border-gray-900" />

                  {/* 发布日期标签 */}
                  <div className="mb-2">
                    <span className="inline-block px-3 py-1 text-xs font-mono text-cyber-cyan bg-cyber-cyan/10 rounded-full">
                      {formatPublishDate(post.publishedAt || post.createdAt)}
                    </span>
                  </div>

                  {/* 文章卡片 */}
                  <BlogCardNew post={post} variant="default" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default BlogTimeline;
