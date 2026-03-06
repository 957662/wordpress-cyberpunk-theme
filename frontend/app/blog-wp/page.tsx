/**
 * WordPress 集成博客列表页
 * 展示如何使用 WordPress API 获取文章数据
 */

import { getServerPosts, getServerCategories, getServerTags } from '@/lib/wordpress/server-client';
import { BlogGrid } from '@/components/blog/BlogGrid';
import { BlogStatsCard } from '@/components/blog/BlogStatsCard';
import { CategoryList } from '@/components/blog/CategoryList';
import { TagCloud } from '@/components/blog/TagCloud';
import { NewsletterCard } from '@/components/blog/NewsletterCard';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // 5 分钟

interface BlogPageProps {
  searchParams: {
    category?: string;
    tag?: string;
    page?: string;
    search?: string;
  };
}

export default async function WordPressBlogPage({ searchParams }: BlogPageProps) {
  const page = parseInt(searchParams.page || '1');
  const perPage = 12;

  // 获取文章数据
  const posts = await getServerPosts({
    page,
    per_page: perPage,
    ...(searchParams.category && { categories: [parseInt(searchParams.category)] }),
    ...(searchParams.tag && { tags: [parseInt(searchParams.tag)] }),
    ...(searchParams.search && { search: searchParams.search }),
    orderby: 'date',
    order: 'desc',
    _embed: true,
  });

  // 获取分类和标签
  const categories = await getServerCategories();
  const tags = await getServerTags();

  // 计算统计数据
  const totalPosts = posts.length;
  const totalCategories = categories.length;
  const totalTags = tags.length;

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* Header */}
      <header className="relative py-16 border-b border-cyber-border">
        <div className="absolute inset-0 bg-cyber-grid opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
              <span className="text-glow-cyan text-cyber-cyan">技术</span>
              <span className="text-glow-purple text-cyber-purple">博客</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              探索前沿技术，分享开发经验
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <BlogStatsCard
                title="文章总数"
                value={totalPosts}
                icon="📝"
                color="cyan"
              />
              <BlogStatsCard
                title="分类数量"
                value={totalCategories}
                icon="📁"
                color="purple"
              />
              <BlogStatsCard
                title="标签数量"
                value={totalTags}
                icon="🏷️"
                color="pink"
              />
            </div>

            {/* Posts Grid */}
            {posts.length > 0 ? (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    最新文章
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    共 {totalPosts} 篇文章
                  </p>
                </div>

                <BlogGrid
                  posts={posts}
                  columns={3}
                  gap="md"
                  showExcerpt={true}
                  showAuthor={true}
                  showReadingTime={true}
                  showTags={true}
                  variant="default"
                />
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  暂无文章
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchParams.search
                    ? `没有找到与 "${searchParams.search}" 相关的文章`
                    : '还没有发布任何文章'}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="space-y-6 sticky top-8">
              {/* Categories */}
              <CategoryList
                categories={categories.slice(0, 10)}
                selectedCategory={searchParams.category}
              />

              {/* Tags */}
              <TagCloud
                tags={tags.slice(0, 20)}
                selectedTag={searchParams.tag}
              />

              {/* Newsletter */}
              <NewsletterCard
                title="订阅我们的新闻通讯"
                description="获取最新的技术文章和见解"
                buttonText="订阅"
              />
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-cyber-border mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-400 text-sm">
            Powered by WordPress REST API & Next.js
          </p>
        </div>
      </footer>
    </div>
  );
}

// SEO 元数据
export async function generateMetadata({ searchParams }: BlogPageProps) {
  const title = searchParams.search
    ? `搜索: ${searchParams.search} - 技术博客`
    : '技术博客 - 探索前沿技术';

  const description = searchParams.search
    ? `搜索结果: ${searchParams.search}`
    : '探索前沿技术，分享开发经验';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  };
}
