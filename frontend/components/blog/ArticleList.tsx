'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, User, Clock, Tag } from 'lucide-react';
import { WPPost } from '@/types/blog';
import { cn } from '@/lib/utils';

interface ArticleListProps {
  posts: WPPost[];
  className?: string;
}

export function ArticleList({ posts, className }: ArticleListProps) {
  if (posts.length === 0) {
    return (
      <div className="cyber-card p-12 text-center">
        <p className="text-gray-400 text-lg">暂无文章</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {posts.map((post, index) => (
        <motion.article
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="cyber-card group hover:border-cyber-cyan/50 transition-all duration-300"
        >
          <Link href={`/blog/${post.slug}`} className="block">
            <div className="flex flex-col md:flex-row gap-6">
              {/* 文章缩略图 */}
              {post.featured_media && (
                <div className="md:w-48 flex-shrink-0">
                  <div className="aspect-video md:aspect-square rounded-lg overflow-hidden bg-cyber-darker">
                    <img
                      src={post.featured_media}
                      alt={post.title?.rendered || ''}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
              )}

              {/* 文章内容 */}
              <div className="flex-1 min-w-0">
                {/* 文章标题 */}
                <h2 className="text-2xl font-display font-bold text-white mb-3 group-hover:text-cyber-cyan transition-colors line-clamp-2">
                  {post.title?.rendered && (
                    <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                  )}
                </h2>

                {/* 文章摘要 */}
                {post.excerpt?.rendered && (
                  <div
                    className="text-gray-400 mb-4 line-clamp-2 prose prose-invert prose-sm"
                    dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                  />
                )}

                {/* 元信息 */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  {/* 作者 */}
                  {post.author_data && (
                    <div className="flex items-center gap-1.5">
                      <User className="w-4 h-4" />
                      <span>{post.author_data.name}</span>
                    </div>
                  )}

                  {/* 发布日期 */}
                  {post.date && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(post.date).toLocaleDateString('zh-CN')}</span>
                    </div>
                  )}

                  {/* 阅读时间 */}
                  {post.reading_time && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>{post.reading_time} 分钟</span>
                    </div>
                  )}

                  {/* 分类 */}
                  {post.categories_data && post.categories_data.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-4 h-4" />
                      <div className="flex gap-2">
                        {post.categories_data.slice(0, 2).map((cat) => (
                          <span
                            key={cat.id}
                            className="text-cyber-cyan hover:text-cyber-cyan/80 transition-colors"
                          >
                            {cat.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        </motion.article>
      ))}
    </div>
  );
}

// 精简版文章列表（用于侧边栏）
export function ArticleListCompact({ posts, className }: ArticleListProps) {
  if (posts.length === 0) {
    return (
      <div className="p-4 text-center border border-cyber-border rounded-lg">
        <p className="text-gray-500 text-sm">暂无文章</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Link
            href={`/blog/${post.slug}`}
            className="block group p-3 rounded-lg hover:bg-cyber-cyan/5 transition-colors"
          >
            <h3 className="text-sm font-medium text-gray-300 group-hover:text-cyber-cyan transition-colors line-clamp-2 mb-1">
              {post.title?.rendered && (
                <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
              )}
            </h3>
            {post.date && (
              <p className="text-xs text-gray-600">
                {new Date(post.date).toLocaleDateString('zh-CN')}
              </p>
            )}
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
