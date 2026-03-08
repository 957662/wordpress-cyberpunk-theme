'use client';

/**
 * BlogPostEnhanced - 增强的博客文章组件
 * 集成所有高级功能：代码高亮、目录、评论、社交分享
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Tag, Eye, Heart, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { CodeBlock } from '@/components/blog/core/CodeBlock';
import { TableOfContents } from '@/components/blog/core/TableOfContents';
import { CommentSystem } from '@/components/blog/core/CommentSystem';
import { SocialActions } from '@/components/social/core/SocialActions';
import { cn, formatRelativeTime } from '@/lib/utils';

interface BlogPostEnhancedProps {
  post: {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    author: {
      id: string;
      name: string;
      slug?: string;
      avatar?: string | null;
    };
    category: {
      id: string;
      name: string;
      slug: string;
      color?: string;
    };
    tags: Array<{
      id: string;
      name: string;
      slug: string;
    }>;
    coverImage?: string | null;
    publishedAt: string;
    readTime?: number;
    stats?: {
      views?: number;
      likes?: number;
      comments?: number;
    };
  };
  className?: string;
}

export function BlogPostEnhanced({ post, className }: BlogPostEnhancedProps) {
  const [activeHeading, setActiveHeading] = useState('');

  // 处理内容中的代码块
  const processContent = (content: string) => {
    // 这里可以添加代码高亮处理逻辑
    return content;
  };

  return (
    <article className={cn('max-w-4xl mx-auto', className)}>
      {/* 文章头部 */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        {/* 面包屑 */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-cyber-cyan transition-colors">
            首页
          </Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-cyber-cyan transition-colors">
            博客
          </Link>
          <span>/</span>
          <span className="text-gray-400">{post.title}</span>
        </nav>

        {/* 分类标签 */}
        <div className="mb-4">
          <Link
            href={`/categories/${post.category.slug}`}
            className="inline-block px-4 py-1.5 text-sm font-mono rounded-full transition-all hover:scale-105"
            style={{
              backgroundColor: `${post.category.color}20`,
              color: post.category.color,
              border: `1px solid ${post.category.color}40`,
            }}
          >
            {post.category.name}
          </Link>
        </div>

        {/* 标题 */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          {post.title}
        </h1>

        {/* 摘要 */}
        <p className="text-xl text-gray-400 mb-8 leading-relaxed">
          {post.excerpt}
        </p>

        {/* 封面图片 */}
        {post.coverImage && (
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-8 border border-cyber-border">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* 元信息 */}
        <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-8 pb-8 border-b border-cyber-border">
          {/* 作者 */}
          <Link
            href={post.author.slug ? `/authors/${post.author.slug}` : '#'}
            className="flex items-center gap-3 group"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center overflow-hidden">
              {post.author.avatar ? (
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={48}
                  height={48}
                  className="object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <div className="font-medium text-white group-hover:text-cyber-cyan transition-colors">
                {post.author.name}
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-6">
            {/* 发布日期 */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <time dateTime={post.publishedAt}>
                {formatRelativeTime(post.publishedAt)}
              </time>
            </div>

            {/* 阅读时间 */}
            {post.readTime && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime} 分钟</span>
              </div>
            )}

            {/* 统计信息 */}
            {post.stats && (
              <>
                {post.stats.views && (
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{post.stats.views}</span>
                  </div>
                )}
                {post.stats.likes && (
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    <span>{post.stats.likes}</span>
                  </div>
                )}
                {post.stats.comments && (
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.stats.comments}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* 标签 */}
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/tags/${tag.slug}`}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-cyber-dark border border-cyber-border rounded-full text-gray-400 hover:border-cyber-cyan hover:text-cyber-cyan transition-all hover:scale-105"
            >
              <Tag className="w-3 h-3" />
              {tag.name}
            </Link>
          ))}
        </div>

        {/* 社交操作 */}
        <div className="mb-8">
          <SocialActions
            postId={post.id}
            initialLikes={post.stats?.likes}
            initialViews={post.stats?.views}
            initialComments={post.stats?.comments}
          />
        </div>
      </motion.header>

      {/* 文章主体和侧边栏 */}
      <div className="grid lg:grid-cols-[1fr_280px] gap-8">
        {/* 文章内容 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="prose prose-invert prose-cyber max-w-none"
        >
          <div
            dangerouslySetInnerHTML={{ __html: processContent(post.content) }}
          />

          {/* 代码块示例 */}
          <CodeBlock
            code={`// 示例代码
const example = "Hello, CyberPress!";
console.log(example);`}
            language="typescript"
            filename="example.ts"
          />
        </motion.div>

        {/* 侧边栏 */}
        <aside className="space-y-6">
          {/* 目录导航 */}
          <div className="sticky top-20 cyber-card p-4 border border-cyber-border">
            <TableOfContents />
          </div>
        </aside>
      </div>

      {/* 评论区 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-12 pt-8 border-t border-cyber-border"
      >
        <CommentSystem postId={post.id} />
      </motion.div>
    </article>
  );
}

export default BlogPostEnhanced;
