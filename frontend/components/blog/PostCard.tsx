/**
 * PostCard Component
 * 文章卡片组件
 */

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Eye } from 'lucide-react';
import type { Post } from '@/types';

interface PostCardProps {
  post: Post;
  index?: number;
}

export function PostCard({ post, index = 0 }: PostCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const readTime = Math.ceil((post.content?.length || 0) / 1000);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="cyber-card group cursor-pointer h-full"
    >
      {post.featured_media && (
        <div className="relative mb-4 overflow-hidden rounded-lg aspect-video">
          <img
            src={post.featured_media}
            alt={post.title.rendered}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark/80 to-transparent" />
        </div>
      )}

      {post.categories && post.categories.length > 0 && (
        <div className="mb-3">
          <span className="inline-block px-3 py-1 text-xs font-mono bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 rounded-full">
            {post.categories[0].name}
          </span>
        </div>
      )}

      <h2 className="text-xl font-bold text-white mb-3 group-hover:text-cyber-cyan transition-colors line-clamp-2">
        <div dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
      </h2>

      {post.excerpt && (
        <p
          className="text-gray-400 mb-4 line-clamp-3 text-sm"
          dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
        />
      )}

      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {formatDate(post.date)}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {readTime} 分钟
        </span>
        {post.view_count && (
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {post.view_count}
          </span>
        )}
      </div>

      <Link
        href={`/blog/${post.slug}`}
        className="inline-flex items-center gap-2 text-cyber-cyan hover:text-cyber-pink transition-colors text-sm font-medium"
      >
        <span>阅读全文</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </motion.article>
  );
}

export default PostCard;
