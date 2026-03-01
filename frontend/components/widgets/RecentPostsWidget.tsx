/**
 * 最新文章 Widget
 * 显示最近的博客文章列表
 */

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { CalendarIcon, ArrowIcon } from '@/components/icons';
import { Widget } from './base/Widget';
import type { Post } from '@/types/wordpress';

export interface RecentPostsWidgetProps {
  /** 文章列表 */
  posts: Post[];
  /** 显示数量 */
  count?: number;
  /** 是否显示日期 */
  showDate?: boolean;
  /** 是否显示摘要 */
  showExcerpt?: boolean;
  /** Widget 标题 */
  title?: string;
  /** 自定义类名 */
  className?: string;
}

export function RecentPostsWidget({
  posts,
  count = 5,
  showDate = true,
  showExcerpt = false,
  title = '最新文章',
  className,
}: RecentPostsWidgetProps) {
  const displayPosts = posts.slice(0, count);

  return (
    <Widget title={title} className={className}>
      <div className="space-y-4">
        {displayPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <Link
              href={`/blog/${post.slug}`}
              className="block p-3 rounded-lg bg-cyber-dark/50 border border-cyber-border hover:border-cyber-cyan transition-all duration-300 group-hover:shadow-neon-cyan"
            >
              <h4 className="font-medium text-white mb-2 line-clamp-2 group-hover:text-cyber-cyan transition-colors">
                {post.title.rendered}
              </h4>

              {showExcerpt && post.excerpt && (
                <p
                  className="text-sm text-gray-400 mb-2 line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                />
              )}

              {showDate && post.date && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <CalendarIcon className="w-3 h-3" />
                  <time dateTime={post.date}>
                    {format(new Date(post.date), 'yyyy-MM-dd', { locale: zhCN })}
                  </time>
                </div>
              )}

              <motion.div
                className="flex items-center gap-1 text-cyber-cyan text-sm mt-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
              >
                <span>阅读更多</span>
                <ArrowIcon className="w-4 h-4" />
              </motion.div>
            </Link>
          </motion.div>
        ))}

        {displayPosts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>暂无文章</p>
          </div>
        )}
      </div>
    </Widget>
  );
}
