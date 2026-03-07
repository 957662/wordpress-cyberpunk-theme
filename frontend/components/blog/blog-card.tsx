'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, Eye, Heart, MessageCircle, Bookmark, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  coverImage?: string;
  publishedAt: string;
  readingTime: number;
  author?: {
    name: string;
    avatar?: string;
  };
  category?: string;
  tags?: string[];
  views?: number;
  likes?: number;
  comments?: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

interface BlogCardProps {
  post: BlogPost;
  variant?: 'default' | 'featured' | 'compact' | 'horizontal';
  className?: string;
}

export function BlogCard({ post, variant = 'default', className }: BlogCardProps) {
  if (variant === 'featured') {
    return <FeaturedBlogCard post={post} className={className} />;
  }

  if (variant === 'compact') {
    return <CompactBlogCard post={post} className={className} />;
  }

  if (variant === 'horizontal') {
    return <HorizontalBlogCard post={post} className={className} />;
  }

  return <DefaultBlogCard post={post} className={className} />;
}

// Default Card
function DefaultBlogCard({ post, className }: { post: BlogPost; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className={className}
    >
      <Link href={`/blog/${post.slug}`}>
        <div className="group relative bg-cyber-dark/80 border border-cyber-cyan/30 rounded-xl overflow-hidden h-full flex flex-col">
          {/* Cover Image */}
          {post.coverImage && (
            <div className="relative h-56 overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark via-transparent to-transparent" />

              {/* Category Badge */}
              {post.category && (
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 bg-cyber-cyan/90 text-cyber-dark text-sm font-bold rounded-full">
                    {post.category}
                  </span>
                </div>
              )}

              {/* Bookmark Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  // Handle bookmark
                }}
                className="absolute top-4 right-4 p-2 bg-cyber-dark/60 backdrop-blur-sm rounded-full text-white hover:text-cyber-pink transition-colors"
              >
                <Bookmark size={18} className={post.isBookmarked ? 'fill-current' : ''} />
              </button>
            </div>
          )}

          {/* Content */}
          <div className={cn('p-6 flex-1 flex flex-col', !post.coverImage && 'pt-6')}>
            {/* Title */}
            <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-cyber-cyan transition-colors">
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
              {post.excerpt}
            </p>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
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

            {/* Meta Info */}
            <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-cyber-cyan/20">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{post.readingTime} min</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {post.views !== undefined && (
                  <div className="flex items-center gap-1">
                    <Eye size={14} />
                    <span>{post.views}</span>
                  </div>
                )}
                {post.likes !== undefined && (
                  <div className="flex items-center gap-1">
                    <Heart size={14} className={post.isLiked ? 'fill-current text-pink-500' : ''} />
                    <span>{post.likes}</span>
                  </div>
                )}
                {post.comments !== undefined && (
                  <div className="flex items-center gap-1">
                    <MessageCircle size={14} />
                    <span>{post.comments}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Hover Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyber-cyan/10 to-cyber-purple/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-xl" />
        </div>
      </Link>
    </motion.div>
  );
}

// Featured Card
function FeaturedBlogCard({ post, className }: { post: BlogPost; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={className}
    >
      <Link href={`/blog/${post.slug}`}>
        <div className="group relative bg-cyber-dark/80 border-2 border-cyber-cyan/40 rounded-2xl overflow-hidden">
          {/* Large Cover Image */}
          {post.coverImage && (
            <div className="relative h-80 overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark via-cyber-dark/50 to-transparent" />

              {/* Featured Badge */}
              <div className="absolute top-6 left-6">
                <span className="px-4 py-2 bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white text-sm font-bold rounded-full shadow-lg">
                  Featured
                </span>
              </div>

              {post.category && (
                <div className="absolute top-6 right-6">
                  <span className="px-4 py-2 bg-cyber-dark/60 backdrop-blur-sm text-cyber-cyan text-sm font-bold rounded-full border border-cyber-cyan/50">
                    {post.category}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 group-hover:text-cyber-cyan transition-colors">
              {post.title}
            </h2>

            <p className="text-gray-300 text-lg mb-6 line-clamp-2">
              {post.excerpt}
            </p>

            {/* Author & Meta */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {post.author?.avatar && (
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-cyber-cyan"
                  />
                )}
                <div>
                  <p className="text-white font-semibold">{post.author?.name}</p>
                  <p className="text-gray-400 text-sm">
                    {formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-cyber-cyan">
                <span>Read More</span>
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Animated Border */}
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-cyber-cyan/50 rounded-2xl transition-colors pointer-events-none" />
        </div>
      </Link>
    </motion.div>
  );
}

// Compact Card
function CompactBlogCard({ post, className }: { post: BlogPost; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 4 }}
      className={className}
    >
      <Link href={`/blog/${post.slug}`}>
        <div className="group flex gap-4 p-4 bg-cyber-dark/60 border border-cyber-cyan/20 rounded-lg hover:border-cyber-cyan/50 transition-all">
          {/* Thumbnail */}
          {post.coverImage && (
            <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold mb-1 line-clamp-2 group-hover:text-cyber-cyan transition-colors">
              {post.title}
            </h4>

            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>{formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}</span>
              <span>•</span>
              <span>{post.readingTime} min read</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// Horizontal Card
function HorizontalBlogCard({ post, className }: { post: BlogPost; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={className}
    >
      <Link href={`/blog/${post.slug}`}>
        <div className="group relative bg-cyber-dark/80 border border-cyber-cyan/30 rounded-xl overflow-hidden flex flex-col md:flex-row h-full">
          {/* Cover Image */}
          {post.coverImage && (
            <div className="relative w-full md:w-72 h-48 md:h-auto flex-shrink-0">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-cyber-dark md:hidden" />

              {post.category && (
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 bg-cyber-cyan/90 text-cyber-dark text-sm font-bold rounded-full">
                    {post.category}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white mb-3 line-clamp-2 group-hover:text-cyber-cyan transition-colors">
                {post.title}
              </h3>

              <p className="text-gray-400 mb-4 line-clamp-2">
                {post.excerpt}
              </p>

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
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
            </div>

            {/* Meta */}
            <div className="flex items-center justify-between text-sm text-gray-500 pt-4 mt-4 border-t border-cyber-cyan/20">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>{formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{post.readingTime} min read</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-cyber-cyan">
                <span>Read More</span>
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Hover Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyber-cyan/10 to-cyber-purple/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-xl" />
        </div>
      </Link>
    </motion.div>
  );
}

// Skeleton Loader
export function BlogCardSkeleton({ variant = 'default' }: { variant?: BlogCardProps['variant'] }) {
  return (
    <div className="bg-cyber-dark/60 border border-cyber-cyan/30 rounded-xl overflow-hidden">
      <div className="h-56 bg-cyber-dark/40 animate-pulse" />
      <div className="p-6 space-y-3">
        <div className="h-6 w-3/4 bg-cyber-dark/40 rounded animate-pulse" />
        <div className="h-4 w-full bg-cyber-dark/40 rounded animate-pulse" />
        <div className="h-4 w-2/3 bg-cyber-dark/40 rounded animate-pulse" />
        <div className="flex gap-2 pt-4">
          <div className="h-6 w-16 bg-cyber-dark/40 rounded-full animate-pulse" />
          <div className="h-6 w-16 bg-cyber-dark/40 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
