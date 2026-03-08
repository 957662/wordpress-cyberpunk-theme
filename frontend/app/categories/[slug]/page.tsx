'use client';

/**
 * Category Page
 * 分类页面 - 显示特定分类的所有文章
 */

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import { CyberButton } from '@/components/ui/CyberButton';

// 模拟分类数据
const categories: Record<string, { name: string; description: string; color: string }> = {
  tech: {
    name: '技术',
    description: '探索前沿技术、编程技巧和开发经验',
    color: '#00f0ff'
  },
  design: {
    name: '设计',
    description: 'UI/UX 设计、视觉创意和设计趋势',
    color: '#9d00ff'
  },
  tutorial: {
    name: '教程',
    description: '实战教程、学习指南和最佳实践',
    color: '#ff0080'
  },
  thoughts: {
    name: '随笔',
    description: '个人思考、行业观察和经验分享',
    color: '#f0ff00'
  }
};

// 模拟文章数据
const mockPosts = [
  {
    id: 1,
    title: 'Next.js 14 App Router 完全指南',
    slug: 'nextjs-14-app-router-guide',
    excerpt: '深入了解 Next.js 14 的 App Router，包括 Server Components、并行路由和拦截路由等高级特性。',
    date: '2024-03-01',
    readTime: 12,
    author: { name: 'Tech Editor', avatar: null }
  },
  {
    id: 2,
    title: 'TypeScript 高级类型系统实战',
    slug: 'typescript-advanced-types',
    excerpt: '掌握 TypeScript 的高级类型特性，包括条件类型、映射类型和模板字面量类型。',
    date: '2024-02-28',
    readTime: 10,
    author: { name: 'TypeScript Master', avatar: null }
  },
  {
    id: 3,
    title: '构建高性能 React 应用',
    slug: 'building-high-performance-react-apps',
    excerpt: '学习 React 性能优化的最佳实践，包括代码分割、懒加载和状态管理优化。',
    date: '2024-02-25',
    readTime: 15,
    author: { name: 'React Expert', avatar: null }
  },
  {
    id: 4,
    title: 'Tailwind CSS 设计系统搭建',
    slug: 'tailwind-css-design-system',
    excerpt: '使用 Tailwind CSS 构建可维护、可扩展的设计系统，提升团队协作效率。',
    date: '2024-02-20',
    readTime: 8,
    author: { name: 'CSS Architect', avatar: null }
  },
  {
    id: 5,
    title: 'Framer Motion 动画艺术',
    slug: 'framer-motion-animation-art',
    excerpt: '创建令人惊叹的动画效果，提升用户体验和产品质感。',
    date: '2024-02-15',
    readTime: 11,
    author: { name: 'Motion Designer', avatar: null }
  },
  {
    id: 6,
    title: 'WordPress Headless CMS 实战',
    slug: 'wordpress-headless-cms-guide',
    excerpt: '使用 WordPress 作为无头 CMS，结合现代前端框架构建高性能网站。',
    date: '2024-02-10',
    readTime: 14,
    author: { name: 'CMS Expert', avatar: null }
  }
];

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const category = categories[slug];

  if (!category) {
    return (
      <div className="min-h-screen bg-cyber-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">分类不存在</h1>
          <Link href="/blog">
            <CyberButton variant="primary">返回博客</CyberButton>
          </Link>
        </div>
      </div>
    );
  }

  const posts = mockPosts; // 实际项目中应根据 slug 从 API 获取

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse opacity-20"
            style={{ backgroundColor: category.color }}
          />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyber-purple/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Category Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{
              backgroundColor: `${category.color}20`,
              border: `1px solid ${category.color}40`
            }}>
              <span className="text-sm font-medium" style={{ color: category.color }}>
                {category.name}
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 leading-tight">
              <span className="text-white">{category.name}</span>
            </h1>

            <p className="text-xl text-gray-400 mb-8 max-w-2xl">
              {category.description}
            </p>

            {/* Stats */}
            <div className="flex gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <span className="text-cyber-cyan font-bold">{posts.length}</span>
                <span>篇文章</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-cyber-cyan font-bold">50K+</span>
                <span>次阅读</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="cyber-card group hover:border-cyber-cyan/50 transition-all"
              >
                <Link href={`/blog/${post.slug}`}>
                  {/* Category Badge */}
                  <div className="p-6">
                    <div className="mb-4">
                      <span
                        className="inline-block px-3 py-1 text-xs font-mono rounded-full"
                        style={{
                          backgroundColor: `${category.color}20`,
                          color: category.color,
                          border: `1px solid ${category.color}40`
                        }}
                      >
                        {category.name}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-white mb-3 group-hover:text-cyber-cyan transition-colors">
                      {post.title}
                    </h2>

                    <p className="text-gray-400 mb-4 line-clamp-2 text-sm">
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
                    </div>

                    <div className="mt-4 flex items-center text-cyber-cyan font-medium group-hover:gap-2 transition-all">
                      <span>阅读更多</span>
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Pagination */}
      <section className="py-12 px-4 border-t border-cyber-border/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center gap-2">
            <CyberButton variant="outline" size="sm" disabled>
              上一页
            </CyberButton>
            <CyberButton variant="primary" size="sm">
              1
            </CyberButton>
            <CyberButton variant="outline" size="sm">
              2
            </CyberButton>
            <CyberButton variant="outline" size="sm">
              3
            </CyberButton>
            <CyberButton variant="outline" size="sm">
              下一页
            </CyberButton>
          </div>
        </div>
      </section>

      {/* Related Categories */}
      <section className="py-20 px-4 bg-cyber-dark/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">探索更多分类</h2>
            <p className="text-gray-400">发现不同主题的精彩内容</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(categories).map(([key, cat]) => (
              <Link
                key={key}
                href={`/categories/${key}`}
                className="cyber-card p-6 text-center group hover:border-cyber-cyan/50 transition-all"
              >
                <div
                  className="w-12 h-12 rounded-lg mx-auto mb-4 flex items-center justify-center text-xl font-bold"
                  style={{
                    backgroundColor: `${cat.color}20`,
                    border: `1px solid ${cat.color}40`
                  }}
                >
                  {cat.name[0]}
                </div>
                <h3 className="text-lg font-semibold text-white group-hover:text-cyber-cyan transition-colors">
                  {cat.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
