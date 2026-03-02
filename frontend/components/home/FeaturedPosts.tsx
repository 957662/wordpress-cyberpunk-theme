'use client';

/**
 * FeaturedPosts - 精选文章展示组件
 *
 * 功能特性：
 * - 网格布局
 * - 悬停动画
 * - 分类标签
 * - 阅读时间
 * - 响应式设计
 */

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { ArticleCard } from '@/components/blog';

interface Post {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  readTime: number;
  category: {
    name: string;
    slug: string;
    color: string;
  };
  author: {
    name: string;
    avatar?: string | null;
  };
  featuredImage?: string | null;
  tags?: string[];
}

interface FeaturedPostsProps {
  posts: Post[];
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
  viewAllHref?: string;
  columns?: 2 | 3 | 4;
}

export function FeaturedPosts({
  posts,
  title = '精选文章',
  subtitle = '深度内容，值得一读',
  showViewAll = true,
  viewAllHref = '/blog?featured=true',
  columns = 3,
}: FeaturedPostsProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  }[columns];

  return (
    <section className="py-20 px-4 bg-cyber-dark/50">
      <div className="max-w-7xl mx-auto">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{title}</h2>
            {subtitle && <p className="text-gray-400">{subtitle}</p>}
          </div>

          {showViewAll && (
            <Link href={viewAllHref}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center gap-2 px-6 py-3 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-lg hover:bg-cyber-cyan/20 transition-all"
              >
                <span className="text-sm text-cyber-cyan">查看全部</span>
                <ArrowRight className="w-4 h-4 text-cyber-cyan group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          )}
        </motion.div>

        {/* 文章网格 */}
        <div className={`grid gap-8 ${gridCols}`}>
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ArticleCard post={post} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * FeaturedPostCard - 精选文章卡片（大尺寸）
 */
interface FeaturedPostCardProps {
  post: Post;
  index?: number;
}

export function FeaturedPostCard({ post, index = 0 }: FeaturedPostCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative cyber-card p-6 border-2 border-cyber-cyan/30 hover:border-cyber-cyan/60 transition-all duration-300"
    >
      {/* 精选标签 */}
      <div className="absolute -top-3 -right-3 px-3 py-1 bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white text-xs font-bold rounded-full">
        精选
      </div>

      <Link href={`/blog/${post.slug}`}>
        {/* 分类标签 */}
        <div className="mb-4">
          <span
            className="inline-block px-3 py-1 text-xs font-mono rounded-full"
            style={{
              backgroundColor: `${post.category.color}20`,
              color: post.category.color,
              border: `1px solid ${post.category.color}40`,
            }}
          >
            {post.category.name}
          </span>
        </div>

        {/* 标题 */}
        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyber-cyan transition-colors line-clamp-2">
          {post.title}
        </h3>

        {/* 摘要 */}
        <p className="text-gray-400 mb-4 line-clamp-3">{post.excerpt}</p>

        {/* 元信息 */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {post.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {post.readTime} 分钟
          </span>
        </div>

        {/* 阅读更多 */}
        <div className="flex items-center gap-2 text-cyber-cyan group-hover:text-cyber-pink transition-colors">
          <span className="text-sm">阅读全文</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>
    </motion.article>
  );
}

export default FeaturedPosts;
