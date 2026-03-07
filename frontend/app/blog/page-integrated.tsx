/**
 * Blog List Page - Integrated Version
 *
 * Complete blog listing with filtering and search
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { CyberButton } from '@/components/ui/CyberButton';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SkeletonCard } from '@/components/ui/Skeleton';

export const metadata: Metadata = {
  title: '博客文章 | CyberPress',
  description: '探索我们的最新博客文章，涵盖技术、设计和创意',
};

// Mock data - will be replaced with WordPress API
const mockPosts = [
  {
    id: 1,
    title: '探索赛博朋克设计美学',
    excerpt: '从《银翼杀手》到《赛博朋克2077》，深入解析赛博朋克风格的视觉元素与设计原则。',
    slug: 'exploring-cyberpunk-aesthetics',
    date: '2024-03-01',
    readTime: 8,
    category: { name: '设计', slug: 'design' },
    author: { name: 'CyberPress Team' },
    featuredImage: null,
  },
  {
    id: 2,
    title: 'Next.js 14 完全指南',
    excerpt: 'Server Components、App Router、Server Actions - 全面掌握 Next.js 14 的革命性特性。',
    slug: 'nextjs-14-complete-guide',
    date: '2024-02-28',
    readTime: 12,
    category: { name: '技术', slug: 'tech' },
    author: { name: 'Tech Editor' },
    featuredImage: null,
  },
  {
    id: 3,
    title: '构建无头 CMS 博客系统',
    excerpt: '使用 WordPress 作为无头 CMS，Next.js 构建前端，打造现代化的内容管理解决方案。',
    slug: 'building-headless-cms-blog',
    date: '2024-02-25',
    readTime: 10,
    category: { name: '教程', slug: 'tutorial' },
    author: { name: 'Dev Team' },
    featuredImage: null,
  },
];

async function getPosts() {
  // In production, this would fetch from WordPress API
  // const response = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp/v2/posts?_embed`);
  // const posts = await response.json();
  return mockPosts;
}

async function getCategories() {
  // In production, this would fetch from WordPress API
  return [
    { id: 1, name: '技术', slug: 'tech', count: 15 },
    { id: 2, name: '设计', slug: 'design', count: 8 },
    { id: 3, name: '教程', slug: 'tutorial', count: 12 },
    { id: 4, name: '随笔', slug: 'thoughts', count: 5 },
  ];
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { category?: string; tag?: string; search?: string };
}) {
  const posts = await getPosts();
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* Header */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyber-cyan/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyber-purple/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-white">博客</span>
              <span className="text-cyber-cyan">文章</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              探索技术、设计与创意的交汇点
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Categories */}
                <Card>
                  <h3 className="text-lg font-bold text-white mb-4">分类</h3>
                  <ul className="space-y-2">
                    {categories.map(category => (
                      <li key={category.id}>
                        <Link
                          href={`/blog?category=${category.slug}`}
                          className="flex items-center justify-between text-gray-300 hover:text-cyber-cyan transition-colors"
                        >
                          <span>{category.name}</span>
                          <Badge variant="default" size="sm">{category.count}</Badge>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </aside>

            {/* Posts Grid */}
            <div className="lg:col-span-3">
              <Suspense fallback={<BlogListSkeleton />}>
                <BlogList posts={posts} />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function BlogList({ posts }: { posts: typeof mockPosts }) {
  if (posts.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-gray-400">暂无文章</p>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Link href={`/blog/${post.slug}`}>
            <Card hover glow>
              <div className="mb-4">
                <Badge variant="primary">{post.category.name}</Badge>
              </div>

              <h2 className="text-2xl font-bold text-white mb-3 hover:text-cyber-cyan transition-colors">
                {post.title}
              </h2>

              <p className="text-gray-400 mb-4 line-clamp-2">
                {post.excerpt}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.readTime} 分钟
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {post.author.name}
                </span>
              </div>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

function BlogListSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
