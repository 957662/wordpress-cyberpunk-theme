'use client';

/**
 * 博客列表页面
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BlogCard } from '@/components/blog/BlogCard';
import { AdvancedSearch, SearchFilters } from '@/components/search/AdvancedSearch';
import { CyberButton } from '@/components/ui/CyberButton';
import { LoaderIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

// 模拟数据
const mockPosts = [
  {
    id: '1',
    title: 'Next.js 14 App Router 完全指南',
    excerpt: '深入了解 Next.js 14 的新特性，包括 App Router、Server Components 和 Streaming 等前沿技术...',
    content: '',
    author: {
      name: 'AI 助手',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AI',
    },
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    category: '前端开发',
    tags: ['Next.js', 'React', 'Web开发'],
    publishedAt: '2024-03-01',
    readingTime: 8,
    views: 1234,
    likes: 89,
    comments: 23,
  },
  {
    id: '2',
    title: '赛博朋克风格 UI 设计指南',
    excerpt: '探索如何使用 Tailwind CSS 和 Framer Motion 创建令人惊叹的赛博朋克风格用户界面...',
    content: '',
    author: {
      name: '设计师',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Designer',
    },
    coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
    category: 'UI设计',
    tags: ['设计', 'CSS', '动画'],
    publishedAt: '2024-02-28',
    readingTime: 6,
    views: 892,
    likes: 67,
    comments: 15,
  },
  {
    id: '3',
    title: 'TypeScript 高级技巧与实践',
    excerpt: '掌握 TypeScript 的高级特性，提升代码质量和开发效率...',
    content: '',
    author: {
      name: '开发者',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dev',
    },
    coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
    category: '编程',
    tags: ['TypeScript', 'JavaScript', '编程'],
    publishedAt: '2024-02-25',
    readingTime: 10,
    views: 2341,
    likes: 156,
    comments: 42,
  },
  {
    id: '4',
    title: 'Docker 容器化部署实战',
    excerpt: '从零开始学习 Docker，掌握容器化部署的核心概念和最佳实践...',
    content: '',
    author: {
      name: '运维专家',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ops',
    },
    coverImage: 'https://images.unsplash.com/photo-1667372393119-c3b0c9e33f8c?w=800',
    category: '运维',
    tags: ['Docker', 'DevOps', '部署'],
    publishedAt: '2024-02-20',
    readingTime: 12,
    views: 1567,
    likes: 98,
    comments: 31,
  },
  {
    id: '5',
    title: 'React Server Components 深度解析',
    excerpt: '理解 React Server Components 的工作原理，以及如何在项目中有效使用...',
    content: '',
    author: {
      name: '前端专家',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Frontend',
    },
    coverImage: 'https://images.unsplash.com/photo-1633356122102-3fe601e05fa2?w=800',
    category: '前端开发',
    tags: ['React', 'Next.js', 'SSR'],
    publishedAt: '2024-02-15',
    readingTime: 9,
    views: 1876,
    likes: 112,
    comments: 28,
  },
  {
    id: '6',
    title: 'GraphQL API 设计最佳实践',
    excerpt: '学习如何设计高效、可扩展的 GraphQL API，包括 Schema 设计、性能优化等...',
    content: '',
    author: {
      name: '后端工程师',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Backend',
    },
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
    category: '后端开发',
    tags: ['GraphQL', 'API', 'Node.js'],
    publishedAt: '2024-02-10',
    readingTime: 11,
    views: 1432,
    likes: 87,
    comments: 19,
  },
];

const categories = ['前端开发', '后端开发', 'UI设计', '运维', '编程', '数据库'];
const tags = ['Next.js', 'React', 'TypeScript', 'Docker', 'GraphQL', 'Node.js', 'CSS', '设计', 'DevOps'];

export default function BlogPage() {
  const [posts, setPosts] = useState(mockPosts);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());

  const handleSearch = async (filters: SearchFilters) => {
    setLoading(true);

    // 模拟搜索延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    let filtered = [...mockPosts];

    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(
        post =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query)
      );
    }

    if (filters.categories.length > 0) {
      filtered = filtered.filter(post => filters.categories.includes(post.category));
    }

    if (filters.tags.length > 0) {
      filtered = filtered.filter(post =>
        post.tags.some(tag => filters.tags.includes(tag))
      );
    }

    setPosts(filtered);
    setLoading(false);
  };

  const handleBookmark = (id: string) => {
    setBookmarks(prev => {
      const newBookmarks = new Set(prev);
      if (newBookmarks.has(id)) {
        newBookmarks.delete(id);
      } else {
        newBookmarks.add(id);
      }
      return newBookmarks;
    });
  };

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* Header */}
      <section className="relative py-20 px-4 border-b border-cyber-border">
        <div className="absolute inset-0 bg-cyber-grid opacity-10" />
        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
              <span className="text-glow-cyan text-cyber-cyan">技术</span>
              <span className="text-glow-purple text-cyber-purple">博客</span>
            </h1>
            <p className="text-xl text-gray-400">
              探索前沿技术，分享开发经验
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 px-4 border-b border-cyber-border">
        <div className="max-w-6xl mx-auto">
          <AdvancedSearch
            onSearch={handleSearch}
            categories={categories}
            tags={tags}
          />
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-gray-400">
              共 <span className="text-cyber-cyan font-bold">{posts.length}</span> 篇文章
            </p>
            <div className="flex gap-2">
              <CyberButton
                variant={viewMode === 'grid' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                网格
              </CyberButton>
              <CyberButton
                variant={viewMode === 'list' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                列表
              </CyberButton>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <LoaderIcon className="w-8 h-8 text-cyber-cyan animate-spin" />
            </div>
          )}

          {/* Posts Grid */}
          {!loading && posts.length > 0 && (
            <div
              className={cn(
                'grid gap-6',
                viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2'
              )}
            >
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <BlogCard
                    {...post}
                    variant={viewMode === 'grid' ? 'default' : 'compact'}
                    isBookmarked={bookmarks.has(post.id)}
                    onBookmark={handleBookmark}
                  />
                </motion.div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">没有找到匹配的文章</p>
              <p className="text-gray-600 mt-2">尝试调整搜索条件</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
