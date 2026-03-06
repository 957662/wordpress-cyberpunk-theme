'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, TrendingUp, ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  category: string;
  tags: string[];
  readingTime: number;
  publishedAt: string;
  author: {
    name: string;
    avatar?: string;
  };
}

interface RelatedPostsRecommendedProps {
  currentPostId: string;
  currentPostTags?: string[];
  currentPostCategory?: string;
  limit?: number;
  className?: string;
}

/**
 * 相关文章推荐组件
 * 
 * 基于以下算法推荐相关文章:
 * 1. 共同标签权重: 40%
 * 2. 同类别权重: 30%
 * 3. 发布时间接近度: 20%
 * 4. 阅读时长相似度: 10%
 */
export default function RelatedPostsRecommended({
  currentPostId,
  currentPostTags = [],
  currentPostCategory = '',
  limit = 4,
  className = '',
}: RelatedPostsRecommendedProps) {
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [algorithm, setAlgorithm] = useState<'tags' | 'category' | 'hybrid'>('hybrid');

  useEffect(() => {
    fetchRelatedPosts();
  }, [currentPostId, currentPostTags, currentPostCategory]);

  const fetchRelatedPosts = async () => {
    setLoading(true);
    try {
      // 这里应该调用实际的 API
      // 暂时使用模拟数据
      const mockPosts: Post[] = [
        {
          id: '2',
          title: 'Next.js 14 App Router 完全指南',
          slug: 'nextjs-14-app-router-guide',
          excerpt: '深入了解 Next.js 14 的新特性，包括 App Router、Server Components 等...',
          coverImage: '/images/blog/nextjs-14.jpg',
          category: '前端开发',
          tags: ['Next.js', 'React', '前端框架'],
          readingTime: 15,
          publishedAt: '2024-03-05',
          author: {
            name: 'AI Developer',
            avatar: '/images/avatars/default.jpg',
          },
        },
        {
          id: '3',
          title: 'TypeScript 高级类型系统实战',
          slug: 'typescript-advanced-types',
          excerpt: '掌握 TypeScript 的高级类型系统，提升代码质量和开发效率...',
          category: '前端开发',
          tags: ['TypeScript', '类型系统', '前端'],
          readingTime: 12,
          publishedAt: '2024-03-03',
          author: {
            name: 'AI Developer',
          },
        },
        {
          id: '4',
          title: 'React Server Components 最佳实践',
          slug: 'react-server-components',
          excerpt: '探索 React Server Components 的使用场景和最佳实践...',
          category: '前端开发',
          tags: ['React', 'Server Components', '性能优化'],
          readingTime: 10,
          publishedAt: '2024-03-01',
          author: {
            name: 'AI Developer',
          },
        },
      ];

      // 计算相关度分数
      const scoredPosts = mockPosts
        .filter(post => post.id !== currentPostId)
        .map(post => ({
          ...post,
          score: calculateRelevanceScore(post, currentPostTags, currentPostCategory),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(({ score, ...post }) => post);

      setRelatedPosts(scoredPosts);
    } catch (error) {
      console.error('Failed to fetch related posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateRelevanceScore = (
    post: Post,
    tags: string[],
    category: string
  ): number => {
    let score = 0;

    // 共同标签权重: 40%
    const commonTags = post.tags.filter(tag => tags.includes(tag));
    score += (commonTags.length / Math.max(post.tags.length, tags.length)) * 40;

    // 同类别权重: 30%
    if (post.category === category) {
      score += 30;
    }

    // 阅读时长相似度: 10%
    // (假设当前文章的阅读时长是已知的)

    return score;
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="text-xl font-bold text-cyan-400">相关文章</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-40 bg-gray-800 rounded-lg mb-2" />
              <div className="h-4 bg-gray-800 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-800 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
          <TrendingUp className="w-6 h-6" />
          相关文章推荐
        </h3>
        
        {/* Algorithm selector */}
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value as any)}
          className="px-3 py-1.5 text-sm rounded-lg bg-gray-800 text-cyan-400 border border-cyan-500/30 focus:outline-none focus:border-cyan-500"
        >
          <option value="hybrid">综合推荐</option>
          <option value="tags">标签匹配</option>
          <option value="category">同类文章</option>
        </select>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {relatedPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={`/blog/${post.slug}`}>
              <motion.div
                className="group h-full p-4 rounded-lg bg-gray-900/50 border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300"
                whileHover={{ y: -4 }}
              >
                {/* Cover Image */}
                {post.coverImage && (
                  <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                  </div>
                )}

                {/* Category Badge */}
                <div className="mb-2">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    {post.category}
                  </span>
                </div>

                {/* Title */}
                <h4 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                  {post.title}
                </h4>

                {/* Excerpt */}
                <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                  {post.excerpt}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{post.readingTime} 分钟</span>
                  </div>
                  <div className="flex items-center gap-1 text-cyan-400 group-hover:translate-x-1 transition-transform">
                    <span>阅读更多</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {post.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded bg-purple-500/10 text-purple-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* View All Button */}
      <div className="text-center">
        <Link href="/blog">
          <motion.button
            className="px-6 py-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            查看所有文章
          </motion.button>
        </Link>
      </div>
    </div>
  );
}
