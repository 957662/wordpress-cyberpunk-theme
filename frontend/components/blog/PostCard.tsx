'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Eye, Heart } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface PostCardProps {
  id: string | number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime?: string;
  category?: string;
  tags?: string[];
  featuredImage?: string;
  author?: {
    name: string;
    avatar?: string;
  };
  views?: number;
  likes?: number;
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
}

const variants = {
  default: 'group relative cyber-card',
  featured: 'group relative cyber-card featured col-span-full lg:col-span-2',
  compact: 'group relative cyber-card compact',
};

export function PostCard({
  slug,
  title,
  excerpt,
  date,
  readTime = '5 分钟',
  category,
  tags = [],
  featuredImage,
  author,
  views,
  likes,
  variant = 'default',
  className,
}: PostCardProps) {
  const cardVariant = variants[variant];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(cardVariant, className)}
    >
      {/* Featured Image */}
      {featuredImage && variant !== 'compact' && (
        <Link href={`/blog/${slug}`} className="block overflow-hidden rounded-lg">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="aspect-video w-full bg-gradient-to-br from-cyber-cyan/20 to-cyber-purple/20"
          >
            <img
              src={featuredImage}
              alt={title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </Link>
      )}

      {/* Category Badge */}
      {category && (
        <div className="mb-3">
          <Link
            href={`/blog?category=${category}`}
            className="inline-block"
          >
            <span className="px-3 py-1 text-xs font-mono bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 rounded-full hover:bg-cyber-cyan/20 transition-colors">
              {category}
            </span>
          </Link>
        </div>
      )}

      {/* Title */}
      <Link href={`/blog/${slug}`}>
        <motion.h2
          className="text-xl font-bold text-white mb-3 group-hover:text-cyber-cyan transition-colors line-clamp-2"
          whileHover={{ x: 4 }}
        >
          {title}
        </motion.h2>
      </Link>

      {/* Excerpt */}
      {variant !== 'compact' && (
        <p className="text-gray-400 mb-4 line-clamp-3">{excerpt}</p>
      )}

      {/* Meta Info */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
        <span className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {date}
        </span>
        {readTime && (
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {readTime}
          </span>
        )}
        {views && (
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {views}
          </span>
        )}
        {likes && (
          <span className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            {likes}
          </span>
        )}
      </div>

      {/* Tags */}
      {tags.length > 0 && variant !== 'compact' && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.slice(0, 3).map((tag) => (
            <Link
              key={tag}
              href={`/blog?tag=${tag}`}
              className="px-2 py-1 text-xs bg-cyber-muted border border-cyber-border rounded text-gray-400 hover:border-cyber-cyan hover:text-cyber-cyan transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}

      {/* Author */}
      {author && variant !== 'compact' && (
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center">
            {author.avatar ? (
              <img
                src={author.avatar}
                alt={author.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-white text-sm font-bold">
                {author.name.charAt(0)}
              </span>
            )}
          </div>
          <span className="text-sm text-gray-400">{author.name}</span>
        </div>
      )}

      {/* Read More Link */}
      <Link
        href={`/blog/${slug}`}
        className="inline-flex items-center gap-2 text-cyber-cyan hover:text-cyber-pink transition-colors group/link"
      >
        <span className="text-sm font-medium">阅读全文</span>
        <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
      </Link>
    </motion.article>
  );
}

export function FeaturedPostCard(props: PostCardProps) {
  return <PostCard {...props} variant="featured" />;
}

export function CompactPostCard(props: PostCardProps) {
  return <PostCard {...props} variant="compact" />;
}
