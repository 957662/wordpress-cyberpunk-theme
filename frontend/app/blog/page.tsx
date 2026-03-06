import { Metadata } from 'next';
import { BlogGrid } from '@/components/blog/BlogGrid';
import { BlogHero } from '@/components/blog/BlogHero';
import { wpClient } from '@/lib/wordpress/client';

export const metadata: Metadata = {
  title: '博客 - CyberPress Platform',
  description: '探索我们的最新文章和技术见解',
};

async function getPosts() {
  try {
    const posts = await wpClient.getPosts({
      per_page: 12,
      status: 'publish',
    });
    return posts;
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <BlogHero
        title="博客"
        description="探索最新的技术文章和见解"
        backgroundColor="from-cyber-dark to-cyber-muted"
      />

      {/* Blog Grid */}
      <div className="container mx-auto px-4 py-12">
        <BlogGrid
          posts={posts}
          columns={3}
          emptyMessage="暂无文章发布"
        />
      </div>
    </main>
  );
}
