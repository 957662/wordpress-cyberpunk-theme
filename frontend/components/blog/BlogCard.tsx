/**
 * BlogCard - 博客文章卡片组件
 * 支持多种布局样式和动画效果
 */

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export interface BlogCardProps {
  post: {
    id: number | string;
    title: string;
    excerpt: string;
    content?: string;
    slug: string;
    date: string;
    author?: {
      name: string;
    };
    categories?: Array<{
      id: number;
      name: string;
      slug: string;
    }>;
    featuredImage?: {
      sourceUrl: string;
      altText?: string;
    } | null;
    readingTime?: number;
  };
  variant?: 'default' | 'horizontal' | 'compact' | 'featured';
  showExcerpt?: boolean;
  className?: string;
}

const BlogCard: React.FC<BlogCardProps> = ({
  post,
  variant = 'default',
  showExcerpt = true,
  className,
}) => {
  const cardVariants = {
    default: 'flex flex-col',
    horizontal: 'flex flex-col md:flex-row gap-6',
    compact: 'flex flex-col',
    featured: 'flex flex-col relative overflow-hidden',
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
      className={cn(
        'group rounded-xl bg-gray-900/50 border border-gray-800 overflow-hidden transition-all duration-300',
        'hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10',
        cardVariants[variant],
        className
      )}
    >
      {post.featuredImage?.sourceUrl && (
        <Link href={`/blog/${post.slug}`} className="relative overflow-hidden block">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="aspect-video w-full relative"
          >
            <Image
              src={post.featuredImage.sourceUrl}
              alt={post.featuredImage.altText || post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </motion.div>
        </Link>
      )}

      <div className="flex flex-col p-6 flex-1">
        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.categories.slice(0, 2).map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                #{category.name}
              </Link>
            ))}
          </div>
        )}

        <Link href={`/blog/${post.slug}`}>
          <motion.h3
            className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-cyan-400 transition-colors"
            whileHover={{ x: 4 }}
          >
            {post.title}
          </motion.h3>
        </Link>

        {showExcerpt && variant !== 'compact' && (
          <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
            {post.excerpt}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-4">
          {post.author && (
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5" />
              <span>{post.author.name}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>{format(new Date(post.date), 'yyyy-MM-dd', { locale: zhCN })}</span>
          </div>
          {post.readingTime && (
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.readingTime} 分钟</span>
            </div>
          )}
        </div>

        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors group/link"
        >
          <span>阅读更多</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
        </Link>
      </div>
    </motion.article>
  );
};

export default BlogCard;
