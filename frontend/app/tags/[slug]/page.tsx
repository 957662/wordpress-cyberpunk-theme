/**
 * Tag Detail Page
 *
 * 显示特定标签下的所有文章
 */

import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTagBySlug, getPosts } from '@/lib/data';
import { BlogGrid } from '@/components/blog/BlogGrid';
import { motion } from 'framer-motion';
import { Tag, ArrowLeft, Rss } from 'lucide-react';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const tag = await getTagBySlug(params.slug);

    if (!tag) {
      return {
        title: 'Tag Not Found',
      };
    }

    return {
      title: `${tag.name} - CyberPress Platform`,
      description: `查看所有 tagged with "${tag.name}" 的文章`,
      openGraph: {
        title: tag.name,
        type: 'website',
      },
    };
  } catch {
    return {
      title: 'Tag Not Found',
    };
  }
}

export default async function TagPage({ params }: PageProps) {
  const tag = await getTagBySlug(params.slug);

  if (!tag) {
    notFound();
  }

  // 获取该标签下的文章
  const { posts } = await getPosts({
    tag: params.slug,
    perPage: 12,
  });

  return (
    <div className="min-h-screen bg-cyber-dark text-white">
      {/* Header */}
      <div className="relative pt-32 pb-16 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyber-purple/20 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Breadcrumb */}
            <Link
              href="/tags"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-cyber-cyan transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              返回标签列表
            </Link>

            {/* Tag Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-cyber-purple/10 border-2 border-cyber-purple rounded-full mb-6">
              <Tag className="w-10 h-10 text-cyber-purple" />
            </div>

            {/* Tag Name */}
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-purple to-cyber-pink">
                #{tag.name}
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-400 mb-8">
              {tag.description || `查看所有 tagged with "${tag.name}" 的文章`}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyber-green" />
                <span>{posts.length} 篇文章</span>
              </div>
              {tag.count && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyber-cyan" />
                  <span>{tag.count} 次引用</span>
                </div>
              )}
            </div>

            {/* RSS Feed Link */}
            <Link
              href={`/rss/tags/${params.slug}`}
              className="inline-flex items-center gap-2 mt-8 px-4 py-2 bg-cyber-purple/10 border border-cyber-purple rounded-lg text-cyber-purple hover:bg-cyber-purple/20 transition-colors"
            >
              <Rss className="w-4 h-4" />
              订阅此标签的 RSS
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <Tag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              该标签下暂无文章
            </h3>
            <p className="text-gray-400 mb-6">
              敬请期待更多内容
            </p>
            <Link
              href="/blog"
              className="inline-block px-6 py-3 bg-cyber-purple text-white rounded-lg font-medium hover:bg-cyber-purple/80 transition-colors"
            >
              浏览所有文章
            </Link>
          </div>
        ) : (
          <BlogGrid posts={posts} />
        )}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  // 如果使用静态生成，这里获取所有标签的 slug
  return [];
}

export const revalidate = 60;
