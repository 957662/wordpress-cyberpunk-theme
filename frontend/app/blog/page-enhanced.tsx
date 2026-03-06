/**
 * Blog Page Enhanced
 * 增强版博客列表页面
 */

import { Metadata } from 'next';
import { BlogListEnhanced } from '@/components/blog/BlogListEnhanced';
import { BlogHero } from '@/components/blog/BlogHero';
import { useBlogPosts } from '@/hooks/api/useBlogPosts';
import { blogService } from '@/services/api/blog.service';
import { LoadingState } from '@/components/blog/LoadingState';

export const metadata: Metadata = {
  title: '博客 - CyberPress Platform',
  description: '探索技术、分享见解、记录成长',
  keywords: ['博客', '技术', '教程', '分享'],
};

interface BlogPageProps {
  searchParams: {
    page?: string;
    category?: string;
    tag?: string;
    search?: string;
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const page = parseInt(searchParams.page || '1', 10);
  const perPage = 12;

  // 获取文章数据
  const result = await blogService.getPosts({
    page,
    per_page: perPage,
    status: 'publish',
  });

  // 转换数据为 ArticleCardProps 格式
  const { adaptToArticleCardPropsList } = await import('@/lib/adapters/blog-adapter');
  const posts = adaptToArticleCardPropsList(result.posts);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Hero Section */}
      <BlogHero
        title="博客"
        description="探索技术、分享见解、记录成长"
        className="py-16"
      />

      {/* Blog List */}
      <div className="container mx-auto px-4 pb-16">
        <BlogListEnhanced
          posts={posts}
          loading={false}
          columns={3}
          layout="grid"
          variant="default"
          showStats={true}
          showFilters={true}
          showSearch={true}
          showPagination={true}
          currentPage={page}
          totalPages={result.totalPages}
          onPageChange={(newPage) => {
            // 处理分页变化
            const url = new URL(window.location.href);
            url.searchParams.set('page', String(newPage));
            window.location.href = url.toString();
          }}
        />
      </div>
    </div>
  );
}
