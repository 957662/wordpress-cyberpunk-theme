export const dynamic = 'force-dynamic';
/**
 * Blog Page
 * 博客列表页面（服务端渲染）
 */

import { Metadata } from 'next';
import { wordpressDataService } from '@/services/blog/wordpress-data-service';
import { BlogList } from '@/components/blog';
import { BlogHero } from '@/components/blog/BlogHero';
import { BlogSearch } from '@/components/blog/BlogSearch';

interface BlogPageProps {
  searchParams: {
    page?: string;
    category?: string;
    tag?: string;
    search?: string;
  };
}

export async function generateMetadata({
  searchParams,
}: BlogPageProps): Promise<Metadata> {
  const { search } = searchParams;

  return {
    title: search ? `搜索: ${search} - CyberPress Blog` : 'CyberPress Blog',
    description: '探索我们的最新文章、教程和技术见解',
    keywords: ['blog', 'articles', 'tutorials', 'tech'],
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const page = parseInt(searchParams.page || '1', 10);
  const category = searchParams.category;
  const tag = searchParams.tag;
  const search = searchParams.search;

  // 获取文章数据
  const { posts, total, totalPages } = await wordpressDataService.getPosts({
    page,
    per_page: 12,
    categories: category ? [parseInt(category, 10)] : undefined,
    tags: tag ? [parseInt(tag, 10)] : undefined,
    search: search || undefined,
  });

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* Hero Section */}
      <BlogHero
        title={search ? `搜索结果: ${search}` : '博客'}
        description={search ? `找到 ${total} 篇相关文章` : '探索最新的技术文章和见解'}
      />

      {/* Search Bar */}
      <div className="container mx-auto px-4 py-8">
        <BlogSearch />
      </div>

      {/* Blog List */}
      <div className="container mx-auto px-4 py-8">
        <BlogList
          posts={posts}
          currentPage={page}
          totalPages={totalPages}
          totalItems={total}
        />
      </div>
    </div>
  );
}
