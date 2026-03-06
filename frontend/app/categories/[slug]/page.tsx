/**
 * Category Detail Page
 *
 * 显示特定分类下的所有文章
 */

import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCategoryBySlug, getPosts } from '@/lib/data';
import { BlogGrid } from '@/components/blog/BlogGrid';
import { motion } from 'framer-motion';
import { Folder, ArrowLeft, Rss, FileText } from 'lucide-react';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const category = await getCategoryBySlug(params.slug);

    if (!category) {
      return {
        title: 'Category Not Found',
      };
    }

    return {
      title: `${category.name} - CyberPress Platform`,
      description: category.description || `查看 ${category.name} 分类的所有文章`,
      openGraph: {
        title: category.name,
        description: category.description,
        type: 'website',
      },
    };
  } catch {
    return {
      title: 'Category Not Found',
    };
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const category = await getCategoryBySlug(params.slug);

  if (!category) {
    notFound();
  }

  // 获取该分类下的文章
  const { posts, pagination } = await getPosts({
    category: params.slug,
    perPage: 12,
  });

  return (
    <div className="min-h-screen bg-cyber-dark text-white">
      {/* Header */}
      <div className="relative pt-32 pb-16 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyber-cyan/20 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Breadcrumb */}
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-cyber-cyan transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              返回分类列表
            </Link>

            {/* Category Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-cyber-cyan/10 border-2 border-cyber-cyan rounded-full mb-6">
              <Folder className="w-10 h-10 text-cyber-cyan" />
            </div>

            {/* Category Name */}
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-purple">
                {category.name}
              </span>
            </h1>

            {/* Description */}
            {category.description && (
              <p className="text-xl text-gray-400 mb-8 max-w-3xl">
                {category.description}
              </p>
            )}

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyber-green" />
                <span>{pagination.totalItems || posts.length} 篇文章</span>
              </div>
              {category.count && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyber-cyan" />
                  <span>{category.count} 次发布</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>分类 ID: {category.id}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                href={`/rss/categories/${params.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-cyber-cyan/10 border border-cyber-cyan rounded-lg text-cyber-cyan hover:bg-cyber-cyan/20 transition-colors"
              >
                <Rss className="w-4 h-4" />
                订阅 RSS
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-4 py-2 bg-cyber-purple/10 border border-cyber-purple rounded-lg text-cyber-purple hover:bg-cyber-purple/20 transition-colors"
              >
                浏览所有文章
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Featured Post (if exists) */}
      {posts.length > 0 && posts[0] && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-8 bg-gradient-to-r from-cyber-cyan/10 to-cyber-purple/10 border-2 border-cyber-cyan/30 rounded-2xl"
          >
            <div className="flex items-center gap-2 text-cyber-cyan text-sm font-medium mb-4">
              <div className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
              精选文章
            </div>
            <Link href={`/blog/${posts[0].slug}`}>
              <h2 className="text-3xl font-bold text-white hover:text-cyber-cyan transition-colors mb-3">
                {posts[0].title}
              </h2>
              {posts[0].excerpt && (
                <p className="text-gray-400 line-clamp-2">
                  {posts[0].excerpt}
                </p>
              )}
            </Link>
          </motion.div>
        </div>
      )}

      {/* Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            所有文章
          </h2>
          <p className="text-gray-400">
            共 {pagination.totalItems || posts.length} 篇
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <Folder className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              该分类下暂无文章
            </h3>
            <p className="text-gray-400 mb-6">
              敬请期待更多内容
            </p>
            <Link
              href="/blog"
              className="inline-block px-6 py-3 bg-cyber-cyan text-white rounded-lg font-medium hover:bg-cyber-cyan/80 transition-colors"
            >
              浏览所有文章
            </Link>
          </div>
        ) : (
          <>
            <BlogGrid posts={posts} />

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <div className="flex gap-2">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <Link
                      key={page}
                      href={`/categories/${params.slug}?page=${page}`}
                      className={`
                        px-4 py-2 rounded-lg font-medium transition-colors
                        ${
                          page === 1
                            ? 'bg-cyber-cyan text-cyber-dark'
                            : 'bg-cyber-dark border border-cyber-border text-gray-400 hover:border-cyber-cyan hover:text-cyber-cyan'
                        }
                      `}
                    >
                      {page}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  // 如果使用静态生成，这里获取所有分类的 slug
  return [];
}

export const revalidate = 60;
