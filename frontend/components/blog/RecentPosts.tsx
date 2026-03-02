/**
 * RecentPosts Component
 * 侧边栏最新文章组件
 */

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { CyberCard } from '@/components/ui/CyberCard';
import { formatDate } from '@/lib/utils';
import type { Post } from '@/types/wordpress';

export interface RecentPostsProps {
  posts: Post[];
  title?: string;
  limit?: number;
}

export function RecentPosts({
  posts,
  title = '最新文章',
  limit = 5,
}: RecentPostsProps) {
  const displayPosts = posts.slice(0, limit);

  if (displayPosts.length === 0) {
    return null;
  }

  return (
    <CyberCard>
      <h3 className="text-lg font-display font-bold text-white mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-cyber-cyan rounded" />
        {title}
      </h3>

      <div className="space-y-4">
        {displayPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link href={`/blog/${post.slug}`}>
              <article className="group flex gap-3 p-2 rounded-lg hover:bg-cyber-cyan/5 transition-colors">
                {/* Thumbnail */}
                {post._embedded?.['wp:featuredmedia']?.[0]?.source_url ? (
                  <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                    <img
                      src={post._embedded['wp:featuredmedia'][0].source_url}
                      alt={post.title.rendered}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded bg-gradient-to-br from-cyber-cyan/20 to-cyber-purple/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold text-cyber-cyan/50">
                      {post.title.rendered.charAt(0)}
                    </span>
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4
                    className="text-sm font-semibold text-white line-clamp-2 mb-1 group-hover:text-cyber-cyan transition-colors"
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                  />
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(post.date)}</span>
                  </div>
                </div>
              </article>
            </Link>
          </motion.div>
        ))}
      </div>
    </CyberCard>
  );
}
