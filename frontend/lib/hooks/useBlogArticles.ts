/**
 * 博客文章数据获取 Hook
 * 提供文章列表、分类、标签等数据的获取逻辑
 */

'use client';

import { useState, useEffect, useMemo } from 'react';

// 文章数据类型（与 BlogHome 组件保持一致）
export interface Article {
  id: string | number;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  author: {
    name: string;
    avatar?: string;
  };
  categories: Array<{
    name: string;
    slug: string;
    color?: string;
  }>;
  tags?: Array<{
    name: string;
    slug: string;
  }>;
  publishedAt: string;
  readTime: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
}

// Hook 状态
interface UseBlogArticlesResult {
  articles: Article[];
  categories: string[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// 模拟数据（实际项目中应该从 API 获取）
const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Next.js 14 App Router 完全指南',
    slug: 'nextjs-14-app-router-guide',
    excerpt: '深入了解 Next.js 14 的 App Router 特性，包括服务器组件、客户端组件、路由组织等核心概念和最佳实践。',
    featuredImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
    author: {
      name: 'AI 开发者',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ai-dev',
    },
    categories: [
      { name: '前端开发', slug: 'frontend', color: 'from-cyber-cyan to-blue-500' },
    ],
    tags: [
      { name: 'Next.js', slug: 'nextjs' },
      { name: 'React', slug: 'react' },
      { name: 'Web开发', slug: 'web-dev' },
    ],
    publishedAt: '2024-01-15T10:00:00Z',
    readTime: 15,
    viewCount: 1234,
    likeCount: 89,
    commentCount: 23,
  },
  {
    id: '2',
    title: 'TypeScript 高级类型技巧',
    slug: 'typescript-advanced-types',
    excerpt: '掌握 TypeScript 的高级类型系统，包括泛型、条件类型、映射类型等强大特性，让你的代码更加健壮。',
    featuredImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop',
    author: {
      name: 'AI 开发者',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ai-dev',
    },
    categories: [
      { name: '编程语言', slug: 'programming', color: 'from-cyber-purple to-pink-500' },
    ],
    tags: [
      { name: 'TypeScript', slug: 'typescript' },
      { name: '类型系统', slug: 'type-system' },
    ],
    publishedAt: '2024-01-14T14:30:00Z',
    readTime: 12,
    viewCount: 856,
    likeCount: 67,
    commentCount: 15,
  },
  {
    id: '3',
    title: '赛博朋克设计系统构建',
    slug: 'cyberpunk-design-system',
    excerpt: '如何构建一个完整的赛博朋克风格设计系统，包括颜色、排版、组件和动画效果。',
    featuredImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop',
    author: {
      name: 'AI 设计师',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ai-designer',
    },
    categories: [
      { name: 'UI设计', slug: 'ui-design', color: 'from-cyber-pink to-red-500' },
    ],
    tags: [
      { name: '设计系统', slug: 'design-system' },
      { name: '赛博朋克', slug: 'cyberpunk' },
      { name: 'UI/UX', slug: 'ui-ux' },
    ],
    publishedAt: '2024-01-13T09:15:00Z',
    readTime: 20,
    viewCount: 2341,
    likeCount: 156,
    commentCount: 42,
  },
  {
    id: '4',
    title: 'Tailwind CSS 3.4 新特性解析',
    slug: 'tailwind-css-3-4-features',
    excerpt: '探索 Tailwind CSS 3.4 版本的新特性，包括新的工具类、性能优化和开发体验改进。',
    author: {
      name: 'AI 开发者',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ai-dev',
    },
    categories: [
      { name: 'CSS', slug: 'css', color: 'from-green-400 to-emerald-500' },
    ],
    tags: [
      { name: 'Tailwind CSS', slug: 'tailwind' },
      { name: 'CSS框架', slug: 'css-framework' },
    ],
    publishedAt: '2024-01-12T16:45:00Z',
    readTime: 8,
    viewCount: 567,
    likeCount: 45,
    commentCount: 8,
  },
  {
    id: '5',
    title: 'Framer Motion 动画实战',
    slug: 'framer-motion-animation-guide',
    excerpt: '学习如何使用 Framer Motion 创建流畅的动画效果，包括手势动画、布局动画和页面过渡。',
    featuredImage: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&h=400&fit=crop',
    author: {
      name: 'AI 动画师',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ai-animator',
    },
    categories: [
      { name: '动画', slug: 'animation', color: 'from-yellow-400 to-orange-500' },
    ],
    tags: [
      { name: 'Framer Motion', slug: 'framer-motion' },
      { name: 'React动画', slug: 'react-animation' },
    ],
    publishedAt: '2024-01-11T11:20:00Z',
    readTime: 18,
    viewCount: 1089,
    likeCount: 92,
    commentCount: 31,
  },
  {
    id: '6',
    title: 'React Server Components 深度解析',
    slug: 'react-server-components',
    excerpt: '全面理解 React Server Components 的工作原理、使用场景和最佳实践。',
    author: {
      name: 'AI 架构师',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ai-architect',
    },
    categories: [
      { name: '前端开发', slug: 'frontend', color: 'from-cyber-cyan to-blue-500' },
    ],
    tags: [
      { name: 'React', slug: 'react' },
      { name: '服务器组件', slug: 'server-components' },
    ],
    publishedAt: '2024-01-10T13:00:00Z',
    readTime: 14,
    viewCount: 743,
    likeCount: 58,
    commentCount: 19,
  },
];

export function useBlogArticles(): UseBlogArticlesResult {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 提取所有分类
  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    articles.forEach((article) => {
      article.categories.forEach((cat) => {
        categorySet.add(cat.name);
      });
    });
    return ['全部', ...Array.from(categorySet)];
  }, [articles]);

  // 获取文章数据
  const fetchArticles = async () => {
    setLoading(true);
    setError(null);

    try {
      // 模拟 API 请求延迟
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 实际项目中，这里应该调用真实的 API
      // const response = await fetch('/api/articles');
      // const data = await response.json();
      // setArticles(data);

      // 使用模拟数据
      setArticles(mockArticles);
    } catch (err) {
      setError('获取文章失败，请稍后重试');
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return {
    articles,
    categories,
    loading,
    error,
    refetch: fetchArticles,
  };
}

export default useBlogArticles;
