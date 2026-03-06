'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Eye,
  User,
  Tag,
  Share2,
  Bookmark,
  Heart,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TableOfContentsEnhanced } from './TableOfContentsEnhanced';
import { CodeHighlighter } from './CodeHighlighter';
import { CommentSystemEnhanced } from './CommentSystemEnhanced';
import { RelatedPostsRecommended } from './RelatedPostsRecommended';
import { LikeButtonEnhanced } from './LikeButtonEnhanced';
import { BookmarkButtonEnhanced } from './BookmarkButtonEnhanced';
import { ShareButtons } from './ShareButtons';
import { ReadingProgress } from './ReadingProgress';

export interface Author {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  website?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  publishedAt: string | Date;
  updatedAt?: string | Date;
  readingTime: number;
  author: Author;
  category: Category;
  tags: Tag[];
  stats?: {
    views?: number;
    likes?: number;
    comments?: number;
  };
  relatedPosts?: BlogPost[];
}

export interface BlogDetailEnhancedNewProps {
  post: BlogPost;
  className?: string;
}

export const BlogDetailEnhancedNew: React.FC<BlogDetailEnhancedNewProps> = ({
  post,
  className = '',
}) => {
  const [headings, setHeadings] = useState<Array<{ id: string; text: string; level: number }>>([]);
  const [activeHeading, setActiveHeading] = useState<string>('');

  // 提取文章标题
  useEffect(() => {
    const extractHeadings = () => {
      const elements = document.querySelectorAll('#article-content h1, #article-content h2, #article-content h3');
      const headingsData = Array.from(elements).map((el, index) => ({
        id: `heading-${index}`,
        text: el.textContent || '',
        level: parseInt(el.tagName.substring(1)),
      }));
      setHeadings(headingsData);
    };

    extractHeadings();
  }, [post.content]);

  // 渲染文章内容（处理代码块）
  const renderContent = (content: string) => {
    // 简单的 Markdown 转 HTML 处理
    // 在实际应用中，应该使用专业的 Markdown 解析器
    return content;
  };

  return (
    <article className={cn('min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950', className)}>
      {/* 阅读进度条 */}
      <ReadingProgress />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* 返回按钮 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回博客</span>
            </Link>
          </motion.div>

          {/* 文章头部 */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            {/* 分类标签 */}
            <Link
              href={`/blog/category/${post.category.slug}`}
              className="inline-block px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-lg text-sm font-medium mb-4 hover:bg-cyan-500/20 transition-colors"
            >
              {post.category.name}
            </Link>

            {/* 标题 */}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>

            {/* 摘要 */}
            {post.excerpt && (
              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {/* 特色图片 */}
            {post.featuredImage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative h-96 mb-8 rounded-xl overflow-hidden border border-gray-800"
              >
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
            )}

            {/* 元信息 */}
            <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm">
              {/* 作者 */}
              <Link
                href={`/author/${post.author.id}`}
                className="flex items-center gap-2 hover:text-cyan-400 transition-colors"
              >
                {post.author.avatar ? (
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
                <span>{post.author.name}</span>
              </Link>

              {/* 发布日期 */}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={new Date(post.publishedAt).toISOString()}>
                  {new Date(post.publishedAt).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>

              {/* 阅读时间 */}
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readingTime} 分钟阅读</span>
              </div>

              {/* 浏览量 */}
              {post.stats?.views && (
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{post.stats.views} 次浏览</span>
                </div>
              )}
            </div>

            {/* 交互按钮 */}
            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-800">
              <LikeButtonEnhanced
                targetType="post"
                targetId={post.id}
                initialLiked={false}
                initialCount={post.stats?.likes || 0}
              />

              <BookmarkButtonEnhanced
                targetType="post"
                targetId={post.id}
                initialBookmarked={false}
              />

              <ShareButtons
                title={post.title}
                url={typeof window !== 'undefined' ? window.location.href : ''}
                excerpt={post.excerpt}
              />
            </div>
          </motion.header>

          {/* 文章主体 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-8"
          >
            {/* 主内容区 */}
            <div className="lg:col-span-3">
              <div
                id="article-content"
                className="prose prose-lg prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
              />

              {/* 标签 */}
              {post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-800">
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400 text-sm">标签</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag.id}
                        href={`/blog/tag/${tag.slug}`}
                        className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm hover:bg-gray-700 hover:text-cyan-400 transition-colors"
                      >
                        {tag.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* 作者信息 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-12 p-6 bg-gray-900/50 border border-gray-800 rounded-xl"
              >
                <div className="flex items-start gap-4">
                  {post.author.avatar ? (
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      width={64}
                      height={64}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{post.author.name}</h3>
                    {post.author.bio && (
                      <p className="text-gray-400 mb-3">{post.author.bio}</p>
                    )}
                    <Link
                      href={`/author/${post.author.id}`}
                      className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors text-sm"
                    >
                      查看更多文章
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>

              {/* 相关文章推荐 */}
              {post.relatedPosts && post.relatedPosts.length > 0 && (
                <RelatedPostsRecommended posts={post.relatedPosts} />
              )}

              {/* 评论区 */}
              <CommentSystemEnhanced postId={post.id} postTitle={post.title} />
            </div>

            {/* 侧边栏 */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24">
                {/* 目录导航 */}
                {headings.length > 0 && (
                  <TableOfContentsEnhanced
                    headings={headings}
                    showProgress={true}
                    minHeadingLevel={2}
                    maxHeadingLevel={3}
                  />
                )}
              </div>
            </aside>
          </motion.div>
        </div>
      </div>
    </article>
  );
};

export default BlogDetailEnhancedNew;
