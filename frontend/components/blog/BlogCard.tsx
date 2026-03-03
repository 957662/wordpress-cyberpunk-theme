'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatRelativeTime, extractExcerpt } from '@/lib/utils/format';

interface BlogCardProps {
  post: {
    id: number;
    title: { rendered: string };
    excerpt: { rendered: string };
    date: string;
    slug: string;
    _embedded?: {
      'wp:featuredmedia'?: Array<{
        source_url: string;
        alt_text: string;
      }>;
      'wp:term'?: Array<Array<{
        id: number;
        name: string;
        slug: string;
      }>>;
      author?: Array<{
        name: string;
      }>;
    };
  };
  className?: string;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, className }) => {
  const featuredImage =
    post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const categories = post._embedded?.['wp:term']?.[0] || [];
  const author = post._embedded?.author?.[0]?.name || 'Admin';

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className={cn(
        'group relative overflow-hidden rounded-lg',
        'border border-cyber-cyan/30 bg-deep-black/80 backdrop-blur-sm',
        'hover:border-cyber-cyan transition-all duration-300',
        className
      )}
    >
      {/* 特色图片 */}
      {featuredImage && (
        <Link href={`/blog/${post.slug}`}>
          <div className="relative aspect-video overflow-hidden">
            <motion.img
              src={featuredImage}
              alt={post.title.rendered}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-transparent to-transparent opacity-60" />
          </div>
        </Link>
      )}

      {/* 内容 */}
      <div className="p-6">
        {/* 分类标签 */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {categories.slice(0, 3).map((category) => (
              <Link
                key={category.id}
                href={`/blog?category=${category.slug}`}
                className="text-xs font-mono px-2 py-1 rounded bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 hover:bg-cyber-cyan/20 transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}

        {/* 标题 */}
        <Link href={`/blog/${post.slug}`}>
          <h3
            className="text-xl font-bold mb-3 text-white group-hover:text-cyber-cyan transition-colors line-clamp-2"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
        </Link>

        {/* 摘要 */}
        <p
          className="text-gray-400 text-sm mb-4 line-clamp-3"
          dangerouslySetInnerHTML={{ __html: extractExcerpt(post.excerpt.rendered, 150) }}
        />

        {/* 元信息 */}
        <div className="flex items-center gap-4 text-xs text-gray-500 font-mono">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <time dateTime={post.date}>{formatRelativeTime(post.date)}</time>
          </div>
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>{author}</span>
          </div>
        </div>
      </div>

      {/* 装饰线 */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-cyber-cyan to-cyber-purple group-hover:w-full transition-all duration-500" />
    </motion.article>
  );
};

export default BlogCard;
