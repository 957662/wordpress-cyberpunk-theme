/**
 * 热门文章 Widget
 * 基于浏览量或评论数显示热门文章
 */

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { TrendingUpIcon, EyeIcon, MessageIcon, CalendarIcon } from '@/components/icons';
import { Widget } from './base/Widget';
import { cn } from '@/lib/utils';
import type { Post } from '@/types/wordpress';

export interface PopularPostsWidgetProps {
  /** 文章列表 */
  posts: Post[];
  /** 显示数量 */
  count?: number;
  /** 排序方式 */
  sortBy?: 'views' | 'comments' | 'recent';
  /** Widget 标题 */
  title?: string;
  /** 是否显示排名徽章 */
  showRank?: boolean;
  /** 是否显示统计数据 */
  showStats?: boolean;
  /** 自定义类名 */
  className?: string;
}

export function PopularPostsWidget({
  posts,
  count = 5,
  sortBy = 'views',
  title = '热门文章',
  showRank = true,
  showStats = true,
  className,
}: PopularPostsWidgetProps) {
  // 根据排序方式对文章进行排序
  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === 'views') {
      // 使用自定义字段或模拟浏览量
      const aViews = (a as any).views || 0;
      const bViews = (b as any).views || 0;
      return bViews - aViews;
    } else if (sortBy === 'comments') {
      // 根据评论数排序
      return (b.comment_count || 0) - (a.comment_count || 0);
    } else {
      // 按时间排序
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  const displayPosts = sortedPosts.slice(0, count);

  // 获取排名样式
  const getRankStyle = (rank: number) => {
    const styles = [
      'bg-gradient-to-br from-yellow-500 to-orange-500 text-white shadow-neon-yellow', // 第1名
      'bg-gradient-to-br from-gray-400 to-gray-500 text-white', // 第2名
      'bg-gradient-to-br from-orange-600 to-orange-700 text-white', // 第3名
      'bg-cyber-muted text-gray-400', // 其他
    ];
    return styles[rank - 1] || styles[3];
  };

  return (
    <Widget title={title} className={className}>
      <div className="space-y-3">
        {displayPosts.map((post, index) => {
          const views = (post as any).views || 0;
          const comments = post.comment_count || 0;

          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="group flex items-start gap-3 p-3 rounded-lg bg-cyber-dark/50 border border-cyber-border hover:border-cyber-pink transition-all duration-300 hover:shadow-neon-pink"
              >
                {/* 排名徽章 */}
                {showRank && (
                  <div className={cn(
                    'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm',
                    getRankStyle(index + 1)
                  )}>
                    {index + 1}
                  </div>
                )}

                {/* 文章信息 */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-white mb-1 line-clamp-2 group-hover:text-cyber-pink transition-colors">
                    {post.title.rendered}
                  </h4>

                  {/* 统计信息 */}
                  {showStats && (
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      {sortBy === 'views' && (
                        <div className="flex items-center gap-1">
                          <EyeIcon className="w-3 h-3" />
                          <span>{views.toLocaleString()} 次浏览</span>
                        </div>
                      )}

                      {sortBy === 'comments' && (
                        <div className="flex items-center gap-1">
                          <MessageIcon className="w-3 h-3" />
                          <span>{comments} 条评论</span>
                        </div>
                      )}

                      {sortBy === 'recent' && post.date && (
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-3 h-3" />
                          <span>
                            {new Date(post.date).toLocaleDateString('zh-CN')}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 热门图标 */}
                {index < 3 && (
                  <motion.div
                    initial={{ rotate: 0 }}
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                    className="flex-shrink-0"
                  >
                    <TrendingUpIcon className={cn(
                      'w-5 h-5',
                      index === 0 && 'text-yellow-500',
                      index === 1 && 'text-gray-400',
                      index === 2 && 'text-orange-600'
                    )} />
                  </motion.div>
                )}
              </Link>
            </motion.div>
          );
        })}

        {displayPosts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <TrendingUpIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>暂无热门文章</p>
          </div>
        )}
      </div>
    </Widget>
  );
}
