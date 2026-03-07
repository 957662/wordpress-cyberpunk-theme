/**
 * Blog Quick Start Guide - 快速开始指南组件
 * 帮助开发者快速集成博客功能
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Copy, CheckCircle } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

function CodeBlock({ code, language = 'typescript' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <pre className="bg-cyber-muted/50 border border-cyber-cyan/20 rounded-lg p-4 overflow-x-auto">
        <code className="text-sm text-cyber-cyan">{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 rounded bg-cyber-cyan/10 hover:bg-cyber-cyan/20 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Copy code"
      >
        {copied ? (
          <CheckCircle className="w-4 h-4 text-cyber-green" />
        ) : (
          <Copy className="w-4 h-4 text-cyber-cyan" />
        )}
      </button>
    </div>
  );
}

interface StepProps {
  number: number;
  title: string;
  description: string;
  code?: string;
  children?: React.ReactNode;
}

function Step({ number, title, description, code, children }: StepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: number * 0.1 }}
      className="relative pl-8 pb-8 border-l-2 border-cyber-cyan/20 last:pb-0"
    >
      <div className="absolute left-0 top-0 w-6 h-6 -translate-x-1/2 bg-cyber-dark border-2 border-cyber-cyan rounded-full flex items-center justify-center">
        <span className="text-xs font-bold text-cyber-cyan">{number}</span>
      </div>

      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-glow-cyan text-cyber-cyan">
          {title}
        </h3>
        <p className="text-gray-400">{description}</p>
        {code && <CodeBlock code={code} />}
        {children}
      </div>
    </motion.div>
  );
}

export function BlogQuickStartGuide() {
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('basic');

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* Header */}
      <header className="border-b border-cyber-cyan/20 bg-cyber-muted/50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-glow-cyan text-cyber-cyan mb-2">
            博客系统集成指南
          </h1>
          <p className="text-gray-400">
            快速集成 WordPress 博客功能到你的应用
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('basic')}
            className={`px-6 py-2 rounded-lg transition-all ${
              activeTab === 'basic'
                ? 'bg-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan'
                : 'bg-cyber-muted/50 border border-gray-700 text-gray-400 hover:border-gray-600'
            }`}
          >
            基础集成
          </button>
          <button
            onClick={() => setActiveTab('advanced')}
            className={`px-6 py-2 rounded-lg transition-all ${
              activeTab === 'advanced'
                ? 'bg-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan'
                : 'bg-cyber-muted/50 border border-gray-700 text-gray-400 hover:border-gray-600'
            }`}
          >
            高级功能
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'basic' ? (
            <motion.div
              key="basic"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <Step
                number={1}
                title="安装依赖"
                description="首先安装必要的依赖包"
                code="npm install @tanstack/react-query axios"
              />

              <Step
                number={2}
                title="配置环境变量"
                description="在 .env.local 中配置 WordPress API 地址"
                code="NEXT_PUBLIC_WORDPRESS_URL=https://your-wordpress-site.com"
              />

              <Step
                number={3}
                title="创建博客页面"
                description="创建一个简单的博客列表页面"
                code={`import { BlogGrid } from '@/components/blog/BlogGrid';
import { usePosts } from '@/lib/hooks/useWordPress';

export default function BlogPage() {
  const { data: postsData, isLoading } = usePosts();

  if (isLoading) return <div>Loading...</div>;

  return (
    <BlogGrid
      posts={postsData?.posts || []}
      loading={isLoading}
      columns={3}
    />
  );
}`}
              />

              <Step
                number={4}
                title="创建文章详情页"
                description="创建显示单篇文章的页面"
                code={`import { usePost } from '@/lib/hooks/useWordPress';
import { ArticleDetail } from '@/components/blog/ArticleDetail';

export default function PostPage({ params }) {
  const { data: post, isLoading } = usePost(params.slug);

  if (isLoading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  return <ArticleDetail post={post} />;
}`}
              />

              <Step
                number={5}
                title="运行应用"
                description="启动开发服务器查看效果"
                code="npm run dev"
              >
                <div className="mt-4 p-4 bg-cyber-green/10 border border-cyber-green/30 rounded-lg">
                  <div className="flex items-center gap-2 text-cyber-green">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">完成!</span>
                  </div>
                  <p className="mt-2 text-gray-400 text-sm">
                    现在访问 http://localhost:3000/blog 查看你的博客
                  </p>
                </div>
              </Step>
            </motion.div>
          ) : (
            <motion.div
              key="advanced"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Step
                number={1}
                title="添加搜索功能"
                description="集成实时搜索到你的博客"
                code={`import { BlogSearch } from '@/components/blog/BlogSearch';
import { useState } from 'react';

export function BlogPageWithSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: postsData } = usePosts({ search: searchQuery });

  return (
    <>
      <BlogSearch onSearch={setSearchQuery} />
      <BlogGrid posts={postsData?.posts || []} />
    </>
  );
}`}
              />

              <Step
                number={2}
                title="添加分类过滤"
                description="允许用户按分类筛选文章"
                code={`import { CategoryFilter } from '@/components/blog/CategoryFilter';
import { useCategories } from '@/lib/hooks/useWordPress';

export function BlogPageWithCategories() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const { data: categories } = useCategories();
  const { data: postsData } = usePosts({
    categories: selectedCategory ? [selectedCategory] : undefined,
  });

  return (
    <>
      <CategoryFilter
        categories={categories || []}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      <BlogGrid posts={postsData?.posts || []} />
    </>
  );
}`}
              />

              <Step
                number={3}
                title="无限滚动加载"
                description="使用无限滚动替代传统分页"
                code={`import { useInfinitePosts } from '@/lib/hooks/useWordPress';
import { BlogGrid } from '@/components/blog/BlogGrid';

export function BlogPageWithInfiniteScroll() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePosts();

  const allPosts = data?.pages.flatMap(page => page.posts) || [];

  return (
    <>
      <BlogGrid posts={allPosts} />
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </button>
      )}
    </>
  );
}`}
              />

              <Step
                number={4}
                title="添加评论系统"
                description="集成 WordPress 原生评论"
                code={`import { CommentSystem } from '@/components/blog/CommentSystem';
import { useComments, useCreateComment } from '@/lib/hooks/useWordPress';

export function PostWithComments({ postId }) {
  const { data: comments } = useComments(postId);
  const createComment = useCreateComment();

  const handleSubmit = (commentData) => {
    createComment.mutate({
      postId,
      ...commentData,
    });
  };

  return (
    <CommentSystem
      comments={comments || []}
      onSubmit={handleSubmit}
    />
  );
}`}
              />

              <Step
                number={5}
                title="缓存和性能优化"
                description="配置 React Query 缓存策略"
                code={`// lib/store.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
    },
  },
});

// app/layout.tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/store';

export default function RootLayout({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}`}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tips Section */}
        <div className="mt-12 p-6 bg-cyber-purple/10 border border-cyber-purple/30 rounded-lg">
          <h3 className="text-xl font-semibold text-glow-purple text-cyber-purple mb-4">
            💡 提示和最佳实践
          </h3>
          <ul className="space-y-2 text-gray-400">
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-cyber-green mt-0.5 flex-shrink-0" />
              <span>始终使用 TypeScript 类型以确保类型安全</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-cyber-green mt-0.5 flex-shrink-0" />
              <span>配置适当的缓存时间以减少 API 调用</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-cyber-green mt-0.5 flex-shrink-0" />
              <span>使用骨架屏提升加载体验</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-cyber-green mt-0.5 flex-shrink-0" />
              <span>实现错误边界以优雅地处理错误</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-cyber-green mt-0.5 flex-shrink-0" />
              <span>使用 Next.js Image 组件优化图片加载</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
