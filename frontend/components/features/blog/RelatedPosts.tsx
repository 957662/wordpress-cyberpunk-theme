'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Image from 'next/image';
import Link from 'next/link';

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  tags?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  publishedAt: string;
  readTime?: number;
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface RelatedPostsProps {
  currentPostId: string;
  category?: string;
  tags?: string[];
  limit?: number;
  variant?: 'grid' | 'list' | 'compact';
  onFetchRelated?: (params: {
    postId: string;
    category?: string;
    tags?: string[];
    limit: number;
  }) => Promise<Post[]>;
}

export function RelatedPosts({
  currentPostId,
  category,
  tags = [],
  limit = 3,
  variant = 'grid',
  onFetchRelated,
}: RelatedPostsProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        if (onFetchRelated) {
          const relatedPosts = await onFetchRelated({
            postId: currentPostId,
            category,
            tags,
            limit,
          });
          setPosts(relatedPosts);
        } else {
          // Default implementation using mock data
          // In production, this would call your API
          const mockPosts: Post[] = [];
          setPosts(mockPosts);
        }
      } catch (err) {
        console.error('Failed to fetch related posts:', err);
        setError('Failed to load related posts');
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedPosts();
  }, [currentPostId, category, tags, limit, onFetchRelated]);

  if (loading) {
    return <RelatedPostsSkeleton variant={variant} count={limit} />;
  }

  if (error || posts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">相关文章</h2>

      {variant === 'grid' && <GridView posts={posts} />}
      {variant === 'list' && <ListView posts={posts} />}
      {variant === 'compact' && <CompactView posts={posts} />}
    </div>
  );
}

function GridView({ posts }: { posts: Post[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="h-full hover:border-cyber-cyan/50 transition-all duration-300 overflow-hidden group">
            <Link href={`/blog/${post.slug}`} className="block">
              {post.coverImage && (
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark to-transparent" />
                </div>
              )}

              <div className="p-4">
                <Badge variant="neon" size="sm" className="mb-2">
                  {post.category.name}
                </Badge>

                <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-cyber-cyan transition-colors">
                  {post.title}
                </h3>

                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </span>
                  {post.readTime && (
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {post.readTime} min read
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

function ListView({ posts }: { posts: Post[] }) {
  return (
    <div className="space-y-4">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Link href={`/blog/${post.slug}`}>
            <Card className="p-4 hover:border-cyber-cyan/50 transition-all duration-300 group">
              <div className="flex gap-4">
                {post.coverImage && (
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <Badge variant="neon" size="sm" className="mb-2">
                    {post.category.name}
                  </Badge>

                  <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-cyber-cyan transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-gray-400 text-sm mb-2 line-clamp-1">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </span>
                    {post.readTime && (
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {post.readTime} min read
                      </span>
                    )}
                  </div>
                </div>

                <ArrowRight className="text-cyber-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

function CompactView({ posts }: { posts: Post[] }) {
  return (
    <div className="space-y-2">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Link href={`/blog/${post.slug}`} className="block">
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-cyber-cyan/10 transition-colors group">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium line-clamp-1 group-hover:text-cyber-cyan transition-colors">
                  {post.title}
                </h4>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                  <Badge variant="ghost" size="sm">
                    {post.category.name}
                  </Badge>
                  {post.readTime && (
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {post.readTime}m
                    </span>
                  )}
                </div>
              </div>
              <ArrowRight size={16} className="text-cyber-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

function RelatedPostsSkeleton({
  variant,
  count,
}: {
  variant: string;
  count: number;
}) {
  if (variant === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <Card key={i} className="h-80 animate-pulse">
            <div className="h-48 bg-cyber-cyan/20 rounded-t-lg" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-cyber-cyan/20 rounded w-1/3" />
              <div className="h-6 bg-cyber-cyan/20 rounded w-3/4" />
              <div className="h-4 bg-cyber-cyan/20 rounded w-full" />
              <div className="h-4 bg-cyber-cyan/20 rounded w-1/2" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="flex gap-4">
              <div className="h-24 w-24 bg-cyber-cyan/20 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-cyber-cyan/20 rounded w-1/4" />
                <div className="h-6 bg-cyber-cyan/20 rounded w-3/4" />
                <div className="h-4 bg-cyber-cyan/20 rounded w-1/2" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-3 rounded-lg animate-pulse">
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-cyber-cyan/20 rounded w-3/4" />
            <div className="h-3 bg-cyber-cyan/20 rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
