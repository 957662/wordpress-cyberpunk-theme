'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Calendar, Clock, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  publishedAt: string;
  readingTime: number;
  category: string;
  tags: string[];
}

interface RelatedPostsProps {
  posts: Post[];
  currentPostId: string;
  className?: string;
}

export function RelatedPosts({
  posts,
  currentPostId,
  className,
}: RelatedPostsProps) {
  const relatedPosts = posts
    .filter((post) => post.id !== currentPostId)
    .slice(0, 3);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center gap-3">
        <TrendingUp className="text-cyber-cyan" size={24} />
        <h2 className="text-2xl font-bold text-white">Related Posts</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {relatedPosts.map((post, index) => (
          <RelatedPostCard key={post.id} post={post} index={index} />
        ))}
      </div>
    </div>
  );
}

interface RelatedPostCardProps {
  post: Post;
  index: number;
}

function RelatedPostCard({ post, index }: RelatedPostCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <Link href={`/blog/${post.slug}`}>
        <div className="relative bg-cyber-dark/80 border border-cyber-cyan/30 rounded-lg overflow-hidden h-full flex flex-col">
          {/* Cover Image */}
          {post.coverImage && (
            <div className="relative h-48 overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark via-transparent to-transparent" />

              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-cyber-cyan/90 text-cyber-dark text-xs font-bold rounded-full">
                  {post.category}
                </span>
              </div>
            </div>
          )}

          {/* Content */}
          <div className={cn('p-4 flex-1 flex flex-col', !post.coverImage && 'pt-6')}>
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-cyber-purple/20 text-cyber-purple text-xs rounded border border-cyber-purple/30"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-cyber-cyan transition-colors">
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-1">
              {post.excerpt}
            </p>

            {/* Meta Info */}
            <div className="flex items-center gap-4 text-xs text-gray-500 pt-3 border-t border-cyber-cyan/20">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{post.readingTime} min read</span>
              </div>
            </div>

            {/* Read More Link */}
            <div className="flex items-center gap-2 text-cyber-cyan text-sm font-semibold mt-4 group-hover:text-cyber-pink transition-colors">
              Read More
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Hover Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyber-cyan/10 to-cyber-purple/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>
      </Link>
    </motion.div>
  );
}

// Skeleton loader for related posts
export function RelatedPostsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 bg-cyber-cyan/30 rounded animate-pulse" />
        <div className="h-8 w-48 bg-cyber-dark/60 rounded animate-pulse" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="bg-cyber-dark/60 border border-cyber-cyan/30 rounded-lg overflow-hidden"
          >
            <div className="h-48 bg-cyber-dark/40 animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-4 w-20 bg-cyber-dark/40 rounded animate-pulse" />
              <div className="h-6 w-full bg-cyber-dark/40 rounded animate-pulse" />
              <div className="h-4 w-full bg-cyber-dark/40 rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-cyber-dark/40 rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-cyber-dark/40 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
