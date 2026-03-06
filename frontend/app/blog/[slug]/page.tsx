'use client';

/**
 * 博客详情页面
 * 完整的文章阅读体验
 */

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Eye, Heart, MessageSquare, Bookmark, Share2 } from 'lucide-react';
import { CommentSystem } from '@/components/blog/CommentSystem';
import { SocialShare } from '@/components/blog/SocialShare';
import { ReadingProgressIndicator } from '@/components/blog/ReadingProgressIndicator';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { RelatedPosts } from '@/components/blog/RelatedPosts';
import { AuthorBio } from '@/components/blog/AuthorBio';
import { LikeButton } from '@/components/blog/LikeButton';
import { BookmarkButton } from '@/components/blog/BookmarkButton';
import { ArticleCard } from '@/components/blog/ArticleCard';
import { usePost, useRelatedPosts, formatDate, formatRelativeTime } from '@/lib/hooks/use-wordpress';
import { cn } from '@/lib/utils';

// 模拟文章数据（实际应该从API获取）
const mockPost = {
  id: '1',
  title: 'Next.js 14 App Router 完全指南 - 深入理解现代React开发',
  slug: 'nextjs-14-app-router-guide',
  excerpt: '深入了解 Next.js 14 的新特性，包括 App Router、Server Components 和 Streaming 等前沿技术...',
  content: `
    <h2>介绍</h2>
    <p>Next.js 14 带来了许多令人兴奋的新特性，其中最重要的是 App Router。这是一个全新的路由系统，基于 React Server Components 构建，提供了更好的性能和开发体验。</p>
    
    <h2>什么是 App Router？</h2>
    <p>App Router 是 Next.js 13+ 中引入的新路由系统，它使用 <code>app</code> 目录而不是传统的 <code>pages</code> 目录。这个新的路由系统带来了许多优势：</p>
    
    <ul>
      <li>支持 React Server Components</li>
      <li>更好的布局系统</li>
      <li>简化的数据获取</li>
      <li>改进的错误处理</li>
      <li>更好的 TypeScript 支持</li>
    </ul>
    
    <h2>Server Components vs Client Components</h2>
    <p>React Server Components (RSC) 是 React 18 引入的新特性。它们允许你在服务器上渲染组件，从而减少客户端 JavaScript 的负担。</p>
    
    <h3>Server Components 的优势</h3>
    <p>Server Components 有几个主要优势：</p>
    
    <ol>
      <li><strong>减少客户端 JavaScript</strong>：服务器组件的代码不会发送到客户端</li>
      <li><strong>直接访问后端资源</strong>：可以直接在服务器组件中查询数据库</li>
      <li><strong>自动代码分割</strong>：只有客户端组件会被打包并发送到浏览器</li>
      <li><strong>更好的性能</strong>：减少了客户端的渲染负担</li>
    </ol>
    
    <h2>数据获取</h2>
    <p>在 App Router 中，数据获取变得更加简单。你可以直接在组件中使用 async/await：</p>
    
    <pre><code>async function BlogPost({ id }) {
  const post = await fetchPost(id);
  
  return (
    &lt;article&gt;
      &lt;h1&gt;{post.title}&lt;/h1&gt;
      &lt;p&gt;{post.content}&lt;/p&gt;
    &lt;/article&gt;
  );
}</code></pre>
    
    <h2>Streaming 和 Suspense</h2>
    <p>Next.js 14 支持 React Suspense，允许你流式传输页面内容。这意味着页面的一部分可以先加载，而其他部分在数据准备好后再加载：</p>
    
    <pre><code>&lt;Suspense fallback={&lt;Loading /&gt;}&gt;
  &lt;BlogPosts /&gt;
&lt;/Suspense&gt;</code></pre>
    
    <h2>结论</h2>
    <p>Next.js 14 的 App Router 为现代 Web 开发提供了强大的工具。通过 React Server Components、简化的数据获取和改进的性能，它使得构建高性能的应用变得前所未有的简单。</p>
  `,
  featuredImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200',
  author: {
    name: 'AI 助手',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AI',
    id: 1,
    bio: '专注于前端开发和 AI 技术',
    website: 'https://example.com',
  },
  categories: [
    { id: 1, name: '前端开发', slug: 'frontend', color: '#00f0ff' },
  ],
  tags: [
    { id: 1, name: 'Next.js', slug: 'nextjs' },
    { id: 2, name: 'React', slug: 'react' },
    { id: 3, name: 'TypeScript', slug: 'typescript' },
  ],
  publishedAt: '2024-03-01T10:00:00Z',
  modifiedAt: '2024-03-02T15:30:00Z',
  readTime: 8,
  viewCount: 1234,
  likeCount: 89,
  commentCount: 23,
  status: 'publish',
};

const mockRelatedPosts = [
  {
    id: '2',
    title: 'React Server Components 深度解析',
    slug: 'react-server-components',
    excerpt: '理解 React Server Components 的工作原理...',
    featuredImage: 'https://images.unsplash.com/photo-1633356122102-3fe601e05fa2?w=800',
    author: { name: '前端专家', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Frontend' },
    categories: [{ id: 1, name: '前端开发', slug: 'frontend', color: '#00f0ff' }],
    tags: [{ id: 2, name: 'React', slug: 'react' }],
    publishedAt: '2024-02-28T10:00:00Z',
    readTime: 6,
    viewCount: 876,
    likeCount: 56,
    commentCount: 12,
  },
  {
    id: '3',
    title: 'TypeScript 高级技巧与实践',
    slug: 'typescript-advanced-tips',
    excerpt: '掌握 TypeScript 的高级特性...',
    featuredImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
    author: { name: '开发者', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dev' },
    categories: [{ id: 1, name: '前端开发', slug: 'frontend', color: '#00f0ff' }],
    tags: [{ id: 3, name: 'TypeScript', slug: 'typescript' }],
    publishedAt: '2024-02-25T10:00:00Z',
    readTime: 10,
    viewCount: 1543,
    likeCount: 98,
    commentCount: 28,
  },
];

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [post, setPost] = useState(mockPost);
  const [loading, setLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [activeHeading, setActiveHeading] = useState('');

  // 处理返回
  const handleBack = () => {
    router.back();
  };

  // 处理点赞
  const handleLike = () => {
    setIsLiked(!isLiked);
    // 这里应该调用API
  };

  // 处理收藏
  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // 这里应该调用API
  };

  // 处理分享
  const handleShare = () => {
    setShowShareDialog(!showShareDialog);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-800 rounded w-1/3" />
            <div className="h-12 bg-gray-800 rounded" />
            <div className="h-64 bg-gray-800 rounded" />
            <div className="space-y-4">
              <div className="h-4 bg-gray-800 rounded" />
              <div className="h-4 bg-gray-800 rounded" />
              <div className="h-4 bg-gray-800 rounded w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* 阅读进度指示器 */}
      <ReadingProgressIndicator />

      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* 返回按钮 */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回博客</span>
        </motion.button>

        {/* 文章头部 */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          {/* 分类 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories.map((category) => (
              <span
                key={category.id}
                className="px-3 py-1 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500"
              >
                {category.name}
              </span>
            ))}
          </div>

          {/* 标题 */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>

          {/* 摘要 */}
          <p className="text-xl text-gray-400 mb-8">
            {post.excerpt}
          </p>

          {/* 元信息 */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readTime} 分钟阅读</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{post.viewCount} 阅读</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span>{post.likeCount} 赞</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span>{post.commentCount} 评论</span>
            </div>
          </div>

          {/* 标签 */}
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <a
                key={tag.id}
                href={`/tags/${tag.slug}`}
                className="text-sm text-gray-400 hover:text-cyan-400 transition-colors"
              >
                #{tag.name}
              </a>
            ))}
          </div>

          {/* 作者信息 */}
          <div className="flex items-center gap-4 mt-8 pt-8 border-t border-gray-800">
            {post.author.avatar && (
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-12 h-12 rounded-full"
              />
            )}
            <div>
              <p className="text-white font-semibold">{post.author.name}</p>
              <p className="text-sm text-gray-500">{post.author.bio}</p>
            </div>
          </div>
        </motion.header>

        {/* 特色图片 */}
        {post.featuredImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12 rounded-2xl overflow-hidden shadow-2xl"
          >
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-auto"
            />
          </motion.div>
        )}

        {/* 操作按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-4 mb-8"
        >
          <LikeButton
            postId={post.id}
            isLiked={isLiked}
            likeCount={post.likeCount}
            onLike={handleLike}
          />
          <BookmarkButton
            postId={post.id}
            isBookmarked={isBookmarked}
            onBookmark={handleBookmark}
          />
          <button
            onClick={handleShare}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg transition-all',
              'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
            )}
          >
            <Share2 className="w-4 h-4" />
            <span>分享</span>
          </button>
        </motion.div>

        {/* 文章内容 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="prose prose-invert prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* 分享按钮 */}
        {showShareDialog && (
          <SocialShare
            title={post.title}
            url={`/blog/${post.slug}`}
            onClose={() => setShowShareDialog(false)}
          />
        )}

        {/* 目录 */}
        <TableOfContents
          content={post.content}
          activeHeading={activeHeading}
          onHeadingChange={setActiveHeading}
        />

        {/* 作者详情 */}
        <AuthorBio author={post.author} />

        {/* 相关文章 */}
        <RelatedPosts
          posts={mockRelatedPosts.map(p => ({
            ...p,
            publishedAt: p.publishedAt,
            readTime: p.readTime,
            viewCount: p.viewCount,
            likeCount: p.likeCount,
            commentCount: p.commentCount,
          }))}
        />

        {/* 评论区 */}
        <CommentSystem postId={post.id} />
      </article>
    </div>
  );
}
