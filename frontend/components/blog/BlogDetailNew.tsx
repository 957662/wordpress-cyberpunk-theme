'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react';
import type { BlogPost } from '@/types/models/blog';
import { formatDate, cn } from '@/lib/utils';
import { BlogCard } from './BlogCard';
import { CommentSystem } from './CommentSystem';
import { ShareButtons } from './ShareButtons';
import { ReadingProgressBar } from './ReadingProgressBar';
import { TableOfContents } from './TableOfContents';

export interface BlogDetailNewProps {
  post: BlogPost;
  relatedPosts?: BlogPost[];
}

/**
 * BlogDetailNew - 新的博客详情组件
 */
export function BlogDetailNew({
  post,
  relatedPosts = [],
}: BlogDetailNewProps) {
  const [readingProgress, setReadingProgress] = useState(0);
  const [showToc, setShowToc] = useState(false);
  const [tocItems, setTocItems] = useState<Array<{
    id: string;
    text: string;
    level: number;
  }>>([]);

  // 监听滚动进度
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 提取目录
  useEffect(() => {
    const extractHeadings = () => {
      const content = document.querySelector('.prose');
      if (!content) return;

      const headings = content.querySelectorAll('h2, h3, h4');
      const items = Array.from(headings).map((heading, index) => {
        const id = `heading-${index}`;
        heading.id = id;
        return {
          id,
          text: heading.textContent || '',
          level: parseInt(heading.tagName.charAt(1)),
        };
      });

      setTocItems(items);
      setShowToc(items.length > 0);
    };

    // 延迟执行以确保 DOM 已渲染
    setTimeout(extractHeadings, 100);
  }, [post]);

  const handleScrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // 导航栏高度
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <article className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 阅读进度条 */}
      <ReadingProgressBar progress={readingProgress} />

      {/* 顶部导航 */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/blog"
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              返回博客
            </Link>

            <div className="flex items-center gap-4">
              <ShareButtons
                title={post.title}
                url={typeof window !== 'undefined' ? window.location.href : ''}
                className="flex gap-2"
              />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* 主内容区 */}
          <div className="lg:col-span-3">
            {/* 文章头部 */}
            <header className="mb-12">
              {/* 分类和标签 */}
              {post.categories && post.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/blog?category=${category.id}`}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200 hover:bg-cyan-200 dark:hover:bg-cyan-800 transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}

              {/* 标题 */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                {post.title}
              </h1>

              {/* 摘要 */}
              {post.excerpt && (
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              {/* 元信息 */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                {/* 作者 */}
                {post.author && (
                  <div className="flex items-center gap-2">
                    <User size={18} />
                    <span>{post.author}</span>
                  </div>
                )}

                {/* 日期 */}
                {post.date && (
                  <div className="flex items-center gap-2">
                    <Calendar size={18} />
                    <time dateTime={post.date}>
                      {formatDate(post.date)}
                    </time>
                  </div>
                )}

                {/* 阅读时间 */}
                {post.readingTime && (
                  <div className="flex items-center gap-2">
                    <Clock size={18} />
                    <span>{post.readingTime} 分钟阅读</span>
                  </div>
                )}
              </div>

              {/* 标签 */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag.id}
                      href={`/blog?tag=${tag.id}`}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              )}
            </header>

            {/* 特色图片 */}
            {post.featuredImage && (
              <div className="mb-12 rounded-lg overflow-hidden shadow-lg">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-auto"
                />
              </div>
            )}

            {/* 文章内容 */}
            <div className="prose prose-lg dark:prose-invert max-w-none mb-16">
              {post.content && (
                <div
                  dangerouslySetInnerHTML={{ __html: post.content }}
                  className="prose prose-lg dark:prose-invert max-w-none"
                />
              )}
            </div>

            {/* 分享按钮 */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mb-12">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  分享这篇文章
                </h3>
                <ShareButtons
                  title={post.title}
                  url={typeof window !== 'undefined' ? window.location.href : ''}
                />
              </div>
            </div>

            {/* 作者信息 */}
            {post.author && (
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 mb-12">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                    {post.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {post.author}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      这是一篇精彩的文章，希望对你有所帮助。如果你有任何问题或想法，欢迎在评论区留言讨论。
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 评论区 */}
            <CommentSystem postId={post.id} />
          </div>

          {/* 侧边栏 */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* 目录 */}
              {showToc && tocItems.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    目录
                  </h3>
                  <nav>
                    <TableOfContents
                      items={tocItems}
                      onHeadingClick={handleScrollToHeading}
                    />
                  </nav>
                </div>
              )}

              {/* 相关文章 */}
              {relatedPosts.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    相关文章
                  </h3>
                  <div className="space-y-4">
                    {relatedPosts.map((relatedPost) => (
                      <BlogCard
                        key={relatedPost.id}
                        post={relatedPost}
                        variant="compact"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}

export default BlogDetailNew;
