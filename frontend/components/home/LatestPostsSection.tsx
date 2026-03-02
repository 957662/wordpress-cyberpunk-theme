'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  readTime: string;
  category: string;
  image?: string;
}

export interface LatestPostsSectionProps {
  posts?: Post[];
  title?: string;
  subtitle?: string;
  viewAllHref?: string;
}

const LatestPostsSection: React.FC<LatestPostsSectionProps> = ({
  posts = [],
  title = '最新文章',
  subtitle = '探索最新内容',
  viewAllHref = '/blog',
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="relative py-20 overflow-hidden">
      {/* 背景 */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900" />

      {/* 内容 */}
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex items-center justify-between"
        >
          <div>
            <p className="mb-4 text-sm font-semibold tracking-widest text-cyan-400 uppercase">
              {subtitle}
            </p>
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              {title}
            </h2>
          </div>
          <Link
            href={viewAllHref}
            className="hidden md:inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors group"
          >
            <span>查看全部</span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* 文章网格 */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden rounded-xl border border-cyan-500/20 bg-gradient-to-br from-gray-900 to-gray-800 transition-all hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20"
            >
              {/* 背景动画 */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {/* 封面图 */}
              {post.image && (
                <div className="relative aspect-video overflow-hidden">
                  <div
                    className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${post.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
                </div>
              )}

              <div className="p-6">
                {/* 分类 */}
                <span className="mb-3 inline-block rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400 border border-cyan-500/30">
                  {post.category}
                </span>

                {/* 标题 */}
                <Link href={`/blog/${post.slug}`}>
                  <h3 className="mb-3 text-xl font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                </Link>

                {/* 摘要 */}
                <p className="mb-4 text-sm text-gray-400 line-clamp-2">
                  {post.excerpt}
                </p>

                {/* 元信息 */}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <time>{post.date}</time>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                {/* 阅读更多 */}
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <span>阅读全文</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {/* 扫描线效果 */}
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(0,240,255,0.03)_50%,transparent_100%)] bg-[length:100%_4px] opacity-50" />
            </motion.div>
          ))}
        </motion.div>

        {/* 移动端查看全部 */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>查看全部文章</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestPostsSection;
