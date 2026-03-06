'use client';

/**
 * BlogPostWithReadingProgress
 *
 * 完整的博客文章展示组件
 * 集成阅读进度追踪系统
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Calendar,
  User,
  Tag,
  ArrowLeft,
  Share2,
  Bookmark,
} from 'lucide-react';
import Link from 'next/link';
import { DetailedReadingStats } from '@/components/reading-progress-system';
import { ShareButtons } from './ShareButtons';
import { CommentSystem } from './CommentSystem';
import { RelatedPosts } from './RelatedPosts';
import type { BlogPost } from '@/types/models/blog';

interface BlogPostWithReadingProgressProps {
  post: BlogPost;
}

export function BlogPostWithReadingProgress({
  post,
}: BlogPostWithReadingProgressProps) {
  const [activeHeading, setActiveHeading] = useState<string>('');

  // 目录点击滚动
  const handleHeadingClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // 监听滚动，更新当前激活的标题
  useEffect(() => {
    const headings = document.querySelectorAll('h2, h3');
    const observerOptions = {
      rootMargin: '-100px 0px -66%',
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveHeading(entry.target.id);
        }
      });
    }, observerOptions);

    headings.forEach((heading) => {
      if (heading.id) {
        observer.observe(heading);
      }
    });

    return () => observer.disconnect();
  }, []);

  // 提取标题生成目录
  const extractHeadings = (content: string) => {
    const temp = document.createElement('div');
    temp.innerHTML = content;
    const headings = temp.querySelectorAll('h2, h3');

    return Array.from(headings).map((heading, index) => ({
      id: `heading-${index}`,
      text: heading.textContent || '',
      level: parseInt(heading.tagName.substring(1)),
    }));
  };

  const headings = extractHeadings(post.content || '');

  // 给内容添加 ID
  const contentWithIds = post.content
    ? post.content.replace(/<h([2-3])([^>]*)>(.*?)<\/h\1>/g, (match, level, attrs, text) => {
        const index = headings.findIndex(h => h.text === text);
        return `<h${level}${attrs} id="heading-${index}">${text}</h${level}>`;
      })
    : '';

  return (
    <div className="min-h-screen bg-cyber-dark text-white">
      {/* Reading Progress System */}
      <DetailedReadingStats content={contentWithIds} theme="cyan" position="top" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-cyber-border/50 bg-cyber-dark/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-cyber-cyan transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              返回博客
            </Link>

            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-400 hover:text-cyber-cyan transition-colors">
                <Bookmark className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-cyber-cyan transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Article Header */}
      <header className="relative pt-32 pb-12 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyber-cyan/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyber-purple/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Category Badge */}
            {post.category && (
              <Link
                href={`/categories/${post.category.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-full text-cyber-cyan text-sm font-medium mb-6 hover:bg-cyber-cyan/20 transition-colors"
              >
                <Tag className="w-4 h-4" />
                {post.category.name}
              </Link>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
              <span className="inline-flex items-center gap-2">
                <User className="w-4 h-4" />
                {post.author?.name || 'Unknown'}
              </span>
              <span className="inline-flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(post.date).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.readingTime || 5} 分钟阅读
              </span>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {post.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/tags/${tag.slug}`}
                    className="px-3 py-1 bg-cyber-purple/10 border border-cyber-purple/30 rounded-full text-cyber-purple text-xs hover:bg-cyber-purple/20 transition-colors"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Table of Contents - Sidebar */}
          {headings.length > 0 && (
            <aside className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24">
                <h3 className="text-sm font-semibold text-white mb-4">目录</h3>
                <nav className="space-y-2">
                  {headings.map((heading) => (
                    <button
                      key={heading.id}
                      onClick={() => handleHeadingClick(heading.id)}
                      className={`
                        block w-full text-left text-sm transition-colors
                        ${heading.level === 3 ? 'pl-4' : ''}
                        ${
                          activeHeading === heading.id
                            ? 'text-cyber-cyan font-medium'
                            : 'text-gray-400 hover:text-white'
                        }
                      `}
                    >
                      {heading.text}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>
          )}

          {/* Article Content */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <article
                className="prose prose-lg prose-invert max-w-none
                          prose-headings:font-display prose-headings:font-bold
                          prose-h2:text-3xl prose-h2:text-cyber-cyan prose-h2:mt-12 prose-h2:mb-6
                          prose-h3:text-2xl prose-h3:text-cyber-purple prose-h3:mt-8 prose-h3:mb-4
                          prose-p:text-gray-300 prose-p:leading-relaxed
                          prose-a:text-cyber-cyan prose-a:no-underline hover:prose-a:underline
                          prose-strong:text-white prose-strong:font-semibold
                          prose-code:text-cyber-pink prose-code:bg-cyber-pink/10
                          prose-pre:bg-cyber-dark prose-pre:border prose-pre:border-cyber-border
                          prose-blockquote:border-l-4 prose-blockquote:border-cyber-cyan prose-blockquote:bg-cyber-cyan/5
                          prose-img:rounded-lg prose-img:shadow-lg
                          prose-ul:list-disc prose-ol:list-decimal"
                dangerouslySetInnerHTML={{ __html: contentWithIds }}
              />
            </motion.div>

            {/* Share Buttons */}
            <div className="mt-12 pt-8 border-t border-cyber-border">
              <ShareButtons
                title={post.title}
                url={`${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`}
                excerpt={post.excerpt}
              />
            </div>

            {/* Related Posts */}
            <div className="mt-16">
              <RelatedPosts
                currentPostId={post.id}
                categorySlug={post.category?.slug}
                tagSlugs={post.tags.map((tag) => tag.slug)}
                maxPosts={3}
              />
            </div>

            {/* Comments */}
            <div className="mt-16">
              <CommentSystem postId={post.id} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-cyber-border mt-20 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-400 text-sm">
            感谢阅读！如果这篇文章对你有帮助，请考虑分享给更多人。
          </p>
        </div>
      </footer>
    </div>
  );
}
