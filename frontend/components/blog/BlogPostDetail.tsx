'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, Clock, Tag, ArrowLeft, Share2 } from 'lucide-react';

// Types
interface Author {
  id: string;
  name: string;
  avatar: string;
  bio?: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  author: Author;
  category: Category;
  tags: Tag[];
  publishedAt: string;
  readingTime: number;
  views?: number;
}

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  publishedAt: string;
  readingTime: number;
}

interface BlogPostDetailProps {
  post: BlogPost;
  relatedPosts?: RelatedPost[];
  colorScheme?: 'cyan' | 'purple' | 'pink' | 'green' | 'orange';
  onShare?: () => void;
}

// Color schemes
const colorSchemes = {
  cyan: {
    primary: 'from-cyan-500 to-blue-500',
    text: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    glow: 'shadow-cyan-500/50',
  },
  purple: {
    primary: 'from-purple-500 to-pink-500',
    text: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    glow: 'shadow-purple-500/50',
  },
  pink: {
    primary: 'from-pink-500 to-rose-500',
    text: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/30',
    glow: 'shadow-pink-500/50',
  },
  green: {
    primary: 'from-green-500 to-emerald-500',
    text: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    glow: 'shadow-green-500/50',
  },
  orange: {
    primary: 'from-orange-500 to-amber-500',
    text: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    glow: 'shadow-orange-500/50',
  },
};

export const BlogPostDetail: React.FC<BlogPostDetailProps> = ({
  post,
  relatedPosts = [],
  colorScheme = 'cyan',
  onShare,
}) => {
  const [toc, setToc] = useState<Array<{ id: string; text: string; level: number }>>([]);
  const [activeHeading, setActiveHeading] = useState<string>('');

  const colors = colorSchemes[colorScheme];

  // Extract headings for table of contents
  useEffect(() => {
    const content = document.querySelector('.prose');
    if (!content) return;

    const headings = content.querySelectorAll('h2, h3');
    const tocData = Array.from(headings).map((heading, index) => ({
      id: `heading-${index}`,
      text: heading.textContent || '',
      level: parseInt(heading.tagName.charAt(1)),
    }));

    setToc(tocData);

    // Add IDs to headings
    headings.forEach((heading, index) => {
      heading.id = `heading-${index}`;
    });

    // Intersection Observer for active heading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    headings.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, [post.content]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <article className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className={`absolute inset-0 bg-gradient-to-br ${colors.primary} blur-3xl`} />
        </div>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="relative h-[60vh] w-full">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent" />
          </div>
        )}

        <div className="relative container mx-auto px-4 py-12">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link
              href="/blog"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${colors.bg} ${colors.text} border ${colors.border} hover:${colors.bg} transition-all duration-300`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回博客</span>
            </Link>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
          >
            {post.title}
          </motion.h1>

          {/* Meta Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap items-center gap-6 text-gray-400"
          >
            <div className="flex items-center gap-2">
              {post.author.avatar && (
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
              <User className="w-4 h-4" />
              <span>{post.author.name}</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(post.publishedAt).toLocaleDateString('zh-CN')}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readingTime} 分钟阅读</span>
            </div>

            {post.views && (
              <div className="flex items-center gap-2">
                <span>{post.views} 次浏览</span>
              </div>
            )}

            {onShare && (
              <button
                onClick={onShare}
                className={`flex items-center gap-2 px-3 py-1 rounded ${colors.bg} ${colors.text} hover:${colors.bg} transition-all`}
              >
                <Share2 className="w-4 h-4" />
                <span>分享</span>
              </button>
            )}
          </motion.div>

          {/* Category and Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center gap-3 mt-6"
          >
            <Link
              href={`/blog/category/${post.category.slug}`}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${colors.primary} text-white`}
            >
              <Tag className="w-3 h-3" />
              {post.category.name}
            </Link>

            {post.tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/blog/tag/${tag.slug}`}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${colors.bg} ${colors.text} border ${colors.border} hover:${colors.bg} transition-all`}
              >
                #{tag.name}
              </Link>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex-1"
          >
            {/* Table of Contents (Desktop) */}
            {toc.length > 0 && (
              <nav className="hidden lg:block mb-8 p-6 rounded-xl bg-gray-900/50 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4">目录</h3>
                <ul className="space-y-2">
                  {toc.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => scrollToHeading(item.id)}
                        className={`text-left text-sm transition-all ${
                          activeHeading === item.id
                            ? `${colors.text} font-medium`
                            : 'text-gray-400 hover:text-gray-300'
                        } ${item.level === 3 ? 'pl-4' : ''}`}
                      >
                        {item.text}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            {/* Article Content */}
            <div
              className="prose prose-invert prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </motion.div>

          {/* Sidebar */}
          <aside className="w-full lg:w-80 space-y-8">
            {/* Author Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="p-6 rounded-xl bg-gray-900/50 border border-gray-800"
            >
              <h3 className="text-lg font-semibold text-white mb-4">关于作者</h3>
              <div className="flex items-center gap-4 mb-4">
                {post.author.avatar && (
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                )}
                <div>
                  <h4 className="text-white font-medium">{post.author.name}</h4>
                  <p className="text-sm text-gray-400">作者</p>
                </div>
              </div>
              {post.author.bio && (
                <p className="text-sm text-gray-400">{post.author.bio}</p>
              )}
            </motion.div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="p-6 rounded-xl bg-gray-900/50 border border-gray-800"
              >
                <h3 className="text-lg font-semibold text-white mb-4">相关文章</h3>
                <div className="space-y-4">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      href={`/blog/${relatedPost.slug}`}
                      className="block group"
                    >
                      <div className="flex gap-3">
                        {relatedPost.featuredImage && (
                          <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                            <Image
                              src={relatedPost.featuredImage}
                              alt={relatedPost.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white text-sm font-medium group-hover:text-cyan-400 transition-colors line-clamp-2">
                            {relatedPost.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span>{relatedPost.readingTime} 分钟</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </aside>
        </div>
      </div>

      {/* Mobile TOC */}
      {toc.length > 0 && (
        <div className="lg:hidden fixed bottom-4 right-4 z-50">
          <details className="group">
            <summary className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg cursor-pointer">
              <Tag className="w-6 h-6" />
            </summary>
            <div className="absolute bottom-16 right-0 w-64 p-4 rounded-xl bg-gray-900 border border-gray-800 shadow-xl">
              <h3 className="text-white font-medium mb-3">目录</h3>
              <ul className="space-y-2 max-h-64 overflow-y-auto">
                {toc.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToHeading(item.id)}
                      className={`text-left text-sm transition-all ${
                        activeHeading === item.id
                          ? `${colors.text} font-medium`
                          : 'text-gray-400'
                      }`}
                    >
                      {item.text}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </details>
        </div>
      )}
    </article>
  );
};

export default BlogPostDetail;
