/**
 * 博客列表页面
 * 完整的博客文章展示、搜索、筛选功能
 */

import { Metadata } from 'next';
import { useBlogArticles } from '@/lib/hooks/useBlogArticles';
import { BlogHome } from '@/components/blog/BlogHome';
import { LoaderIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: '博客文章 - CyberPress Platform',
  description: '探索技术、分享见解、记录成长',
  keywords: ['博客', '技术文章', '教程', 'Next.js', 'React', 'TypeScript'],
};

export default function BlogPage() {
  // 在服务端组件中，我们需要使用不同的方式获取数据
  // 这里使用客户端组件来处理数据获取
  return <BlogPageClient />;
}

function BlogPageClient() {
  const { articles, categories, loading, error } = useBlogArticles();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cyber-dark via-gray-950 to-cyber-dark flex items-center justify-center">
        <div className="text-center">
          <LoaderIcon className="w-12 h-12 text-cyber-cyan animate-spin mx-auto mb-4" />
          <p className="text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cyber-dark via-gray-950 to-cyber-dark flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">加载失败</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return <BlogHome articles={articles} categories={categories} />;
}
