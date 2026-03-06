/**
 * 博客列表页面 - 完整版本
 * 支持服务端渲染和客户端交互
 */

import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPosts, getCategories, getTags } from '@/lib/data';
import { BlogGrid } from '@/components/blog/BlogGrid';
import { BlogHero } from '@/components/blog/BlogHero';
import { CategoryFilter } from '@/components/blog/CategoryFilter';
import { BlogPagination } from '@/components/blog/Pagination';
import { EmptyState } from '@/components/blog/EmptyState';
import { SearchBar } from '@/components/blog/SearchBar';

// ============================================================================
// Types
// ============================================================================

interface BlogPageProps {
  searchParams: {
    page?: string;
    category?: string;
    tag?: string;
    search?: string;
  };
}

// ============================================================================
// Metadata
// ============================================================================

export async function generateMetadata({
  searchParams,
}: BlogPageProps): Promise<Metadata> {
  const category = searchParams.category;
  const tag = searchParams.tag;

  return {
    title: category ? `${category} - 文章列表` : tag ? `${tag} - 文章列表` : '博客',
    description: '浏览我们的最新文章和教程',
  };
}

// ============================================================================
// Page Component
// ============================================================================

/**
 * 博客列表页面
 */
export default async function BlogPage({ searchParams }: BlogPageProps) {
  // 解析查询参数
  const page = parseInt(searchParams.page || '1', 10);
  const categorySlug = searchParams.category;
  const tagSlug = searchParams.tag;
  searchParams.search = searchParams.search || '';

  // 获取数据
  const [
    postsData,
    categoriesData,
    tagsData,
  ] = await Promise.all([
    getPosts({
      page,
      perPage: 12,
      category: categorySlug,
      tag: tagSlug,
      search: searchParams.search,
    }),
    getCategories(),
    getTags(),
  ]);

  // 如果页码超出范围,返回404
  if (page > 1 && (postsData.posts.length === 0 || page > postsData.pagination.totalPages)) {
    notFound();
  }

  const { posts, pagination } = postsData;

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* Hero Section */}
      <BlogHero
        title="博客"
        description="探索最新技术文章、教程和见解"
      />

      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          {/* 主内容区 */}
          <div className="space-y-8">
            {/* 搜索和筛选 */}
            <div className="space-y-4">
              <SearchBar />
              <CategoryFilter
                categories={categoriesData}
                selectedCategory={categorySlug}
                onSelectCategory={(slug) => {
                  // 客户端路由跳转将在客户端组件中处理
                  console.log('Select category:', slug);
                }}
              />
            </div>

            {/* 文章列表 */}
            {posts.length === 0 ? (
              <EmptyState
                type={searchParams.search ? 'no-results' : 'no-posts'}
                title={searchParams.search ? '未找到结果' : '暂无文章'}
                description={
                  searchParams.search
                    ? `没有找到与 "${searchParams.search}" 相关的文章`
                    : '还没有发布任何文章'
                }
              />
            ) : (
              <>
                <BlogGrid posts={posts} />

                {/* 分页 */}
                {pagination.totalPages > 1 && (
                  <BlogPagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={(newPage) => {
                      // 客户端路由跳转将在客户端组件中处理
                      console.log('Change page:', newPage);
                    }}
                  />
                )}
              </>
            )}
          </div>

          {/* 侧边栏 */}
          <aside className="space-y-6">
            {/* 热门标签 */}
            <div className="rounded-lg border border-gray-800 bg-cyber-dark/50 p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-200">
                热门标签
              </h3>
              <div className="flex flex-wrap gap-2">
                {tagsData.slice(0, 15).map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/blog?tag=${tag.slug}`}
                    className="inline-flex items-center rounded-full bg-gray-800 px-3 py-1.5 text-sm text-gray-400 hover:bg-cyber-cyan/10 hover:text-cyber-cyan transition-colors"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* 分类列表 */}
            <div className="rounded-lg border border-gray-800 bg-cyber-dark/50 p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-200">
                分类
              </h3>
              <ul className="space-y-2">
                {categoriesData.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/blog?category=${category.slug}`}
                      className="flex items-center justify-between text-sm text-gray-400 hover:text-cyber-cyan transition-colors"
                    >
                      <span>{category.name}</span>
                      <span className="text-xs text-gray-600">
                        {category.count}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Static Generation
// ============================================================================

/**
 * 生成静态页面
 */
export async function generateStaticParams() {
  const posts = await getPosts({ perPage: 100 });
  const totalPages = Math.ceil(posts.pagination.total / 12);

  const params: BlogPageProps['searchParams'][] = [];

  // 生成前5页
  for (let page = 1; page <= Math.min(totalPages, 5); page++) {
    params.push({ page: String(page) });
  }

  return params;
}
