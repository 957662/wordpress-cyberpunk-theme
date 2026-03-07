/**
 * Mock Data for Development
 * 开发环境使用的模拟数据
 */

import { BlogPost } from '@/types/models';

// ============================================================================
// Mock Posts
// ============================================================================

export const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: '探索赛博朋克设计美学',
    excerpt: '从《银翼杀手》到《赛博朋克2077》，深入解析赛博朋克风格的视觉元素与设计原则。',
    content: '',
    slug: 'exploring-cyberpunk-aesthetics',
    date: '2024-03-01',
    readingTime: 8,
    author: 'CyberPress Team',
    category: '设计',
    tags: ['设计', '赛博朋克', 'UI/UX'],
    featuredImage: '/images/cyberpunk-design.jpg',
  },
  {
    id: '2',
    title: 'Next.js 14 完全指南',
    excerpt: 'Server Components、App Router、Server Actions - 全面掌握 Next.js 14 的革命性特性。',
    content: '',
    slug: 'nextjs-14-complete-guide',
    date: '2024-02-28',
    readingTime: 12,
    author: 'Tech Editor',
    category: '技术',
    tags: ['Next.js', 'React', 'Web开发'],
    featuredImage: '/images/nextjs-14.jpg',
  },
  {
    id: '3',
    title: '构建无头 CMS 博客系统',
    excerpt: '使用 WordPress 作为无头 CMS，Next.js 构建前端，打造现代化的内容管理解决方案。',
    content: '',
    slug: 'building-headless-cms-blog',
    date: '2024-02-25',
    readingTime: 10,
    author: 'Dev Team',
    category: '教程',
    tags: ['WordPress', 'Headless CMS', 'Next.js'],
    featuredImage: '/images/headless-cms.jpg',
  },
  {
    id: '4',
    title: 'TypeScript 高级类型技巧',
    excerpt: '掌握条件类型、映射类型、模板字面量类型等高级特性。',
    content: '',
    slug: 'typescript-advanced-types',
    date: '2024-03-02',
    readingTime: 6,
    author: 'TypeScript Master',
    category: '技术',
    tags: ['TypeScript', '前端'],
    featuredImage: '/images/typescript.jpg',
  },
  {
    id: '5',
    title: 'Framer Motion 动画艺术',
    excerpt: '创建令人惊叹的动画效果，提升用户体验。',
    content: '',
    slug: 'framer-motion-animations',
    date: '2024-03-01',
    readingTime: 7,
    author: 'Motion Designer',
    category: '设计',
    tags: ['动画', 'React', 'Framer Motion'],
    featuredImage: '/images/framer-motion.jpg',
  },
  {
    id: '6',
    title: 'Tailwind CSS 最佳实践',
    excerpt: '构建可维护、可扩展的 Tailwind CSS 项目。',
    content: '',
    slug: 'tailwind-css-best-practices',
    date: '2024-02-28',
    readingTime: 5,
    author: 'CSS Expert',
    category: '技术',
    tags: ['Tailwind CSS', 'CSS', '前端'],
    featuredImage: '/images/tailwind-css.jpg',
  },
];

// ============================================================================
// User Posts
// ============================================================================

export const mockUserPosts: BlogPost[] = [
  {
    id: '101',
    title: '我的第一篇博客',
    excerpt: '这是我在 CyberPress 平台发布的第一篇文章。',
    content: '',
    slug: 'my-first-blog-post',
    date: '2024-01-15',
    readingTime: 3,
    author: '赛博用户',
    category: '随笔',
    tags: ['生活', '博客'],
  },
  {
    id: '102',
    title: 'React Hooks 深度解析',
    excerpt: '深入理解 React Hooks 的工作原理和最佳实践。',
    content: '',
    slug: 'react-hooks-deep-dive',
    date: '2024-02-10',
    readingTime: 15,
    author: '赛博用户',
    category: '技术',
    tags: ['React', 'JavaScript', '前端'],
  },
  {
    id: '103',
    title: '2024年前端开发趋势',
    excerpt: '探索2024年前端开发的最新趋势和技术栈。',
    content: '',
    slug: 'frontend-trends-2024',
    date: '2024-02-20',
    readingTime: 8,
    author: '赛博用户',
    category: '技术',
    tags: ['前端', '趋势', '技术'],
  },
];

// ============================================================================
// User Liked Posts
// ============================================================================

export const mockUserLiked: BlogPost[] = [
  mockPosts[0],
  mockPosts[1],
  {
    id: '201',
    title: 'CSS Grid 布局完全指南',
    excerpt: '从基础到高级，全面掌握 CSS Grid 布局系统。',
    content: '',
    slug: 'css-grid-complete-guide',
    date: '2024-02-15',
    readingTime: 10,
    author: 'CSS Master',
    category: '技术',
    tags: ['CSS', '布局', '前端'],
  },
];

// ============================================================================
// User Saved/Bookmarked Posts
// ============================================================================

export const mockBookmarks: BlogPost[] = [
  mockPosts[2],
  mockPosts[3],
  mockPosts[4],
  {
    id: '301',
    title: 'Web Performance Optimization',
    excerpt: '优化网页性能的最佳实践和技巧。',
    content: '',
    slug: 'web-performance-optimization',
    date: '2024-02-18',
    readingTime: 12,
    author: 'Performance Expert',
    category: '技术',
    tags: ['性能', '优化', 'Web'],
  },
  {
    id: '302',
    title: 'Design Systems for Scale',
    excerpt: '构建可扩展的设计系统。',
    content: '',
    slug: 'design-systems-scale',
    date: '2024-02-22',
    readingTime: 9,
    author: 'Design Lead',
    category: '设计',
    tags: ['设计系统', 'UI/UX', '设计'],
  },
  {
    id: '303',
    title: 'GraphQL vs REST API',
    excerpt: '比较 GraphQL 和 REST API 的优缺点。',
    content: '',
    slug: 'graphql-vs-rest',
    date: '2024-02-25',
    readingTime: 7,
    author: 'API Expert',
    category: '技术',
    tags: ['GraphQL', 'REST', 'API'],
  },
];

// ============================================================================
// Mock Comments
// ============================================================================

export const mockComments = [
  {
    id: '1',
    author: {
      name: '张三',
      avatar: '/images/avatar-zhang.jpg',
    },
    content: '这篇文章写得太好了！对我帮助很大。',
    createdAt: '2024-03-01T10:30:00Z',
    likes: 12,
    isLiked: false,
    replies: [
      {
        id: '1-1',
        author: {
          name: '作者回复',
          avatar: '/images/avatar-author.jpg',
        },
        content: '感谢你的支持！',
        createdAt: '2024-03-01T11:00:00Z',
        likes: 3,
        isLiked: false,
      },
    ],
  },
  {
    id: '2',
    author: {
      name: '李四',
    },
    content: '请问这个问题有其他解决方案吗？',
    createdAt: '2024-03-02T14:20:00Z',
    likes: 5,
    isLiked: true,
  },
];

// ============================================================================
// Mock Categories
// ============================================================================

export const mockCategories = [
  { id: '1', name: '技术', slug: 'tech', count: 45, color: '#00f0ff' },
  { id: '2', name: '设计', slug: 'design', count: 32, color: '#9d00ff' },
  { id: '3', name: '教程', slug: 'tutorial', count: 28, color: '#ff0080' },
  { id: '4', name: '随笔', slug: 'thoughts', count: 15, color: '#f0ff00' },
];

// ============================================================================
// Mock Tags
// ============================================================================

export const mockTags = [
  { id: '1', name: 'React', count: 25 },
  { id: '2', name: 'Next.js', count: 18 },
  { id: '3', name: 'TypeScript', count: 20 },
  { id: '4', name: 'CSS', count: 15 },
  { id: '5', name: 'JavaScript', count: 30 },
  { id: '6', name: '赛博朋克', count: 8 },
  { id: '7', name: 'UI/UX', count: 12 },
  { id: '8', name: '性能优化', count: 10 },
];

// ============================================================================
// Mock Users
// ============================================================================

export const mockUsers = [
  {
    id: 1,
    username: 'cyberuser',
    displayName: '赛博用户',
    avatar: '/images/avatar-cyberuser.jpg',
    bio: '热爱技术与设计的开发者',
    location: '上海',
    website: 'https://cyberuser.dev',
    joinedAt: '2023-01-15',
    stats: {
      posts: 42,
      followers: 1024,
      following: 256,
    },
  },
  {
    id: 2,
    username: 'designer',
    displayName: '设计师',
    avatar: '/images/avatar-designer.jpg',
    bio: '专注于UI/UX设计',
    location: '北京',
    website: 'https://designer.dev',
    joinedAt: '2023-03-20',
    stats: {
      posts: 28,
      followers: 512,
      following: 128,
    },
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * 根据 ID 获取文章
 */
export function getPostById(id: string): BlogPost | undefined {
  return [...mockPosts, ...mockUserPosts].find((post) => post.id === id);
}

/**
 * 根据 slug 获取文章
 */
export function getPostBySlug(slug: string): BlogPost | undefined {
  return [...mockPosts, ...mockUserPosts].find((post) => post.slug === slug);
}

/**
 * 获取相关文章
 */
export function getRelatedPosts(postId: string, limit = 3): BlogPost[] {
  const post = getPostById(postId);
  if (!post) return [];

  return mockPosts
    .filter((p) => p.id !== postId && (p.category === post.category || p.tags?.some((tag) => post.tags?.includes(tag))))
    .slice(0, limit);
}

/**
 * 搜索文章
 */
export function searchPosts(query: string): BlogPost[] {
  const lowerQuery = query.toLowerCase();
  return mockPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(lowerQuery) ||
      post.excerpt?.toLowerCase().includes(lowerQuery) ||
      post.category?.toLowerCase().includes(lowerQuery) ||
      post.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}
