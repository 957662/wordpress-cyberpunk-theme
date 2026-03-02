/**
 * 模拟数据
 * 用于开发和测试
 */

import { BlogPost, PortfolioItem, WPCategory, WPTag } from '@/types';

// ============ 模拟分类 ============
export const mockCategories: WPCategory[] = [
  { id: 1, name: '技术', slug: 'tech', description: '技术相关文章', count: 15 },
  { id: 2, name: '设计', slug: 'design', description: '设计相关文章', count: 8 },
  { id: 3, name: '生活', slug: 'life', description: '生活随笔', count: 12 },
  { id: 4, name: '教程', slug: 'tutorial', description: '教程系列', count: 20 },
  { id: 5, name: '思考', slug: 'thoughts', description: '个人思考', count: 5 },
];

// ============ 模拟标签 ============
export const mockTags: WPTag[] = [
  { id: 1, name: 'React', slug: 'react', count: 10 },
  { id: 2, name: 'Next.js', slug: 'nextjs', count: 8 },
  { id: 3, name: 'TypeScript', slug: 'typescript', count: 7 },
  { id: 4, name: 'Tailwind CSS', slug: 'tailwind', count: 6 },
  { id: 5, name: 'WordPress', slug: 'wordpress', count: 5 },
  { id: 6, name: 'UI/UX', slug: 'ui-ux', count: 9 },
  { id: 7, name: '性能优化', slug: 'performance', count: 4 },
  { id: 8, name: '赛博朋克', slug: 'cyberpunk', count: 3 },
];

// ============ 模拟文章 ============
export const mockPosts: BlogPost[] = [
  {
    id: 1,
    title: { rendered: '探索 Next.js 14 App Router 的新特性' },
    slug: 'exploring-nextjs-14-app-router',
    content: { rendered: '<p>Next.js 14 带来了许多激动人心的新特性...</p>' },
    excerpt: { rendered: 'Next.js 14 带来了许多激动人心的新特性...' },
    date: '2024-01-15T10:00:00',
    modified: '2024-01-15T10:00:00',
    featured_media: 1,
    categories: [1, 4],
    tags: [2, 3],
    author: 1,
    _embedded: {
      'wp:featuredmedia': [
        {
          source_url: 'https://picsum.photos/1200/630?random=1',
          alt_text: 'Next.js 14',
        },
      ],
      author: [
        {
          id: 1,
          name: 'CyberPress',
          avatar_urls: { '96': 'https://api.dicebear.com/7.x/avataaars/svg?seed=CyberPress' },
        },
      ],
    },
  },
  {
    id: 2,
    title: { rendered: '构建赛博朋克风格的 Tailwind CSS 主题' },
    slug: 'building-cyberpunk-tailwind-theme',
    content: { rendered: '<p>赛博朋克风格以其独特的视觉吸引力...</p>' },
    excerpt: { rendered: '赛博朋克风格以其独特的视觉吸引力...' },
    date: '2024-01-14T14:30:00',
    modified: '2024-01-14T14:30:00',
    featured_media: 2,
    categories: [2, 4],
    tags: [4, 8],
    author: 1,
    _embedded: {
      'wp:featuredmedia': [
        {
          source_url: 'https://picsum.photos/1200/630?random=2',
          alt_text: 'Tailwind CSS',
        },
      ],
      author: [
        {
          id: 1,
          name: 'CyberPress',
          avatar_urls: { '96': 'https://api.dicebear.com/7.x/avataaars/svg?seed=CyberPress' },
        },
      ],
    },
  },
  {
    id: 3,
    title: { rendered: 'WordPress REST API 完全指南' },
    slug: 'wordpress-rest-api-complete-guide',
    content: { rendered: '<p>WordPress REST API 为开发者提供了强大的接口...</p>' },
    excerpt: { rendered: 'WordPress REST API 为开发者提供了强大的接口...' },
    date: '2024-01-13T09:00:00',
    modified: '2024-01-13T09:00:00',
    featured_media: 3,
    categories: [1, 4],
    tags: [5],
    author: 1,
    _embedded: {
      'wp:featuredmedia': [
        {
          source_url: 'https://picsum.photos/1200/630?random=3',
          alt_text: 'WordPress',
        },
      ],
      author: [
        {
          id: 1,
          name: 'CyberPress',
          avatar_urls: { '96': 'https://api.dicebear.com/7.x/avataaars/svg?seed=CyberPress' },
        },
      ],
    },
  },
  {
    id: 4,
    title: { rendered: 'TypeScript 最佳实践指南' },
    slug: 'typescript-best-practices',
    content: { rendered: '<p>TypeScript 为 JavaScript 项目带来了类型安全...</p>' },
    excerpt: { rendered: 'TypeScript 为 JavaScript 项目带来了类型安全...' },
    date: '2024-01-12T16:00:00',
    modified: '2024-01-12T16:00:00',
    featured_media: 4,
    categories: [1, 4],
    tags: [3],
    author: 1,
    _embedded: {
      'wp:featuredmedia': [
        {
          source_url: 'https://picsum.photos/1200/630?random=4',
          alt_text: 'TypeScript',
        },
      ],
      author: [
        {
          id: 1,
          name: 'CyberPress',
          avatar_urls: { '96': 'https://api.dicebear.com/7.x/avataaars/svg?seed=CyberPress' },
        },
      ],
    },
  },
  {
    id: 5,
    title: { rendered: 'Framer Motion 动画实战教程' },
    slug: 'framer-motion-animation-tutorial',
    content: { rendered: '<p>Framer Motion 是一个强大的 React 动画库...</p>' },
    excerpt: { rendered: 'Framer Motion 是一个强大的 React 动画库...' },
    date: '2024-01-11T11:00:00',
    modified: '2024-01-11T11:00:00',
    featured_media: 5,
    categories: [2, 4],
    tags: [6],
    author: 1,
    _embedded: {
      'wp:featuredmedia': [
        {
          source_url: 'https://picsum.photos/1200/630?random=5',
          alt_text: 'Framer Motion',
        },
      ],
      author: [
        {
          id: 1,
          name: 'CyberPress',
          avatar_urls: { '96': 'https://api.dicebear.com/7.x/avataaars/svg?seed=CyberPress' },
        },
      ],
    },
  },
];

// ============ 模拟作品集项目 ============
export const mockPortfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: 'AI 对话平台',
    slug: 'ai-chat-platform',
    description: '基于 GPT-4 的智能对话平台',
    content: '一个现代化的 AI 对话平台，支持多轮对话、上下文理解等功能。',
    featuredImage: 'https://picsum.photos/800/600?random=10',
    images: [
      'https://picsum.photos/800/600?random=10',
      'https://picsum.photos/800/600?random=11',
      'https://picsum.photos/800/600?random=12',
    ],
    technologies: ['React', 'Next.js', 'TypeScript', 'OpenAI API'],
    links: {
      demo: 'https://demo.example.com',
      github: 'https://github.com/example/ai-chat',
    },
    startDate: '2023-06-01',
    endDate: '2023-12-31',
    status: 'completed',
    featured: true,
    order: 1,
  },
  {
    id: 2,
    title: '电商管理系统',
    slug: 'ecommerce-admin',
    description: '全栈电商后台管理系统',
    content: '功能完整的电商后台管理系统，包含商品管理、订单处理、数据分析等功能。',
    featuredImage: 'https://picsum.photos/800/600?random=20',
    images: [
      'https://picsum.photos/800/600?random=20',
      'https://picsum.photos/800/600?random=21',
    ],
    technologies: ['Vue 3', 'Node.js', 'MongoDB', 'Element Plus'],
    links: {
      github: 'https://github.com/example/ecommerce-admin',
    },
    startDate: '2023-03-01',
    endDate: '2023-08-31',
    status: 'completed',
    featured: true,
    order: 2,
  },
  {
    id: 3,
    title: '实时协作工具',
    slug: 'realtime-collaboration',
    description: '团队实时协作白板',
    content: '支持多人实时协作的在线白板工具，使用 WebSocket 实现实时同步。',
    featuredImage: 'https://picsum.photos/800/600?random=30',
    images: ['https://picsum.photos/800/600?random=30'],
    technologies: ['React', 'WebSocket', 'Canvas API', 'Node.js'],
    links: {
      demo: 'https://collab.example.com',
      github: 'https://github.com/example/collab',
    },
    startDate: '2023-09-01',
    status: 'in-progress',
    featured: false,
    order: 3,
  },
  {
    id: 4,
    title: '数据可视化平台',
    slug: 'data-visualization',
    description: '企业级数据分析与可视化',
    content: '强大的数据分析平台，支持多种图表类型和实时数据更新。',
    featuredImage: 'https://picsum.photos/800/600?random=40',
    images: [
      'https://picsum.photos/800/600?random=40',
      'https://picsum.photos/800/600?random=41',
      'https://picsum.photos/800/600?random=42',
    ],
    technologies: ['React', 'D3.js', 'Python', 'FastAPI'],
    links: {
      demo: 'https://viz.example.com',
    },
    startDate: '2023-01-01',
    endDate: '2023-05-31',
    status: 'completed',
    featured: true,
    order: 4,
  },
];

// ============ 模拟用户 ============
export const mockUsers = [
  {
    id: 1,
    name: 'CyberPress',
    description: '赛博朋克风格博客平台',
    avatar_urls: {
      '96': 'https://api.dicebear.com/7.x/avataaars/svg?seed=CyberPress',
    },
  },
];

// ============ 模拟统计数据 ============
export const mockStats = {
  totalPosts: 45,
  totalViews: 12500,
  totalComments: 234,
  categories: 5,
  tags: 8,
};

// ============ 模拟热门文章 ============
export const mockPopularPosts = [
  { id: 1, title: 'Next.js 14 新特性', views: 1520 },
  { id: 2, title: 'Tailwind CSS 教程', views: 1245 },
  { id: 3, title: 'TypeScript 最佳实践', views: 980 },
  { id: 4, title: 'Framer Motion 动画', views: 876 },
  { id: 5, title: 'WordPress REST API', views: 765 },
];

// ============ 获取随机文章 ============
export function getRandomPost(): BlogPost {
  return mockPosts[Math.floor(Math.random() * mockPosts.length)];
}

// ============ 获取文章 by ID ============
export function getPostById(id: number): BlogPost | undefined {
  return mockPosts.find(post => post.id === id);
}

// ============ 获取文章 by Slug ============
export function getPostBySlug(slug: string): BlogPost | undefined {
  return mockPosts.find(post => post.slug === slug);
}

// ============ 获取作品集 by Slug ============
export function getPortfolioBySlug(slug: string): PortfolioItem | undefined {
  return mockPortfolioItems.find(item => item.slug === slug);
}
