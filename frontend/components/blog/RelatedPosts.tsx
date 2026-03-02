'use client';

import React from 'react';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export interface RelatedPost {
  id: string | number;
  title: string;
  excerpt: string;
  slug: string;
  coverImage?: string;
  date: string;
  readTime: number;
  category?: string;
  tags?: string[];
}

export interface RelatedPostsProps {
  posts: RelatedPost[];
  title?: string;
  layout?: 'grid' | 'list';
  maxPosts?: number;
  className?: string;
}

/**
 * RelatedPosts - 相关文章推荐组件
 * 
 * @example
 * ```tsx
 * <RelatedPosts
 *   posts={relatedPosts}
 *   title="You might also like"
 *   layout="grid"
 *   maxPosts={3}
 * />
 * ```
 */
export const RelatedPosts: React.FC<RelatedPostsProps> = ({
  posts,
  title = 'Related Posts',
  layout = 'grid',
  maxPosts = 3,
  className = '',
}) => {
  const displayPosts = posts.slice(0, maxPosts);

  if (displayPosts.length === 0) {
    return null;
  }

  return (
    <div className={`my-12 ${className}`}>
      <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>

      {layout === 'grid' ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayPosts.map((post, index) => (
            <RelatedPostCard key={post.id || index} post={post} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {displayPosts.map((post, index) => (
            <RelatedPostListItem key={post.id || index} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Grid card component
 */
const RelatedPostCard: React.FC<{ post: RelatedPost }> = ({ post }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0 }}
    >
      <Link href={`/blog/${post.slug}`} className="block group">
        <div className="border border-gray-800 rounded-lg overflow-hidden bg-[#0a0a0f] hover:border-cyber-cyan/50 transition-all">
          {post.coverImage && (
            <div className="relative h-48 overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}

          <div className="p-4">
            {post.category && (
              <span className="text-xs font-medium text-cyber-cyan mb-2 block">
                {post.category}
              </span>
            )}

            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyber-cyan transition-colors line-clamp-2">
              {post.title}
            </h3>

            <p className="text-sm text-gray-400 mb-3 line-clamp-2">
              {post.excerpt}
            </p>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <time>{new Date(post.date).toLocaleDateString()}</time>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{post.readTime} min</span>
              </div>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {post.tags.slice(0, 3).map(tag => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 rounded bg-cyber-purple/10 text-cyber-purple"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

/**
 * List item component
 */
const RelatedPostListItem: React.FC<{ post: RelatedPost }> = ({ post }) => {
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <div className="flex gap-4 p-4 border border-gray-800 rounded-lg bg-[#0a0a0f] hover:border-cyber-cyan/30 transition-all">
        {post.coverImage && (
          <div className="flex-shrink-0 w-24 h-24 relative rounded overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyber-cyan transition-colors">
            {post.title}
          </h3>

          <p className="text-sm text-gray-400 mb-2 line-clamp-2">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <time>{new Date(post.date).toLocaleDateString()}</time>
            <span>·</span>
            <span>{post.readTime} min read</span>
          </div>
        </div>

        <ArrowRight className="flex-shrink-0 w-5 h-5 text-gray-600 group-hover:text-cyber-cyan transition-colors" />
      </div>
    </Link>
  );
};

/**
 * Inline related posts (compact version)
 */
export const RelatedPostsInline: React.FC<{
  posts: RelatedPost[];
  className?: string;
}> = ({ posts, className = '' }) => {
  if (posts.length === 0) return null;

  return (
    <div className={`border-t border-gray-800 pt-6 mt-8 ${className}`}>
      <h4 className="text-sm font-bold text-gray-400 mb-4">MORE FROM THE BLOG</h4>
      <div className="space-y-3">
        {posts.map((post, index) => (
          <Link
            key={post.id || index}
            href={`/blog/${post.slug}`}
            className="group flex items-start gap-3"
          >
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyber-purple/10 text-cyber-purple flex items-center justify-center text-xs font-bold group-hover:bg-cyber-purple/20 transition-colors">
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <h5 className="text-sm font-medium text-gray-300 group-hover:text-cyber-cyan transition-colors line-clamp-2">
                {post.title}
              </h5>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts;
