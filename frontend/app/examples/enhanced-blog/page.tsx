'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Eye, Heart, Bookmark, Share2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';

// Import the new components we created
import { CommentSystem, type Comment } from '@/components/features/blog/CommentSystem';
import { TableOfContents } from '@/components/features/blog/TableOfContents';
import { CodeHighlight } from '@/components/features/blog/CodeHighlight';
import { RelatedPosts } from '@/components/features/blog/RelatedPosts';
import { ReadingTime, useEstimatedReadingTime } from '@/components/features/blog/ReadingTime';
import { EnhancedShareButton } from '@/components/features/social/EnhancedShareButton';
import { LikeButton } from '@/components/features/social/LikeButton';
import { BookmarkButton } from '@/components/features/BookmarkButton';

export default function EnhancedBlogExample() {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  // Sample blog post data
  const post = {
    id: '1',
    title: '如何构建高性能的 Next.js 14 应用',
    slug: 'building-high-performance-nextjs-14-apps',
    content: `
      <h2>引言</h2>
      <p>Next.js 14 带来了许多令人兴奋的新特性和性能改进。本文将深入探讨如何利用这些特性构建高性能的 Web 应用。</p>

      <h2>1. 使用 App Router</h2>
      <p>App Router 是 Next.js 13 引入的新路由系统，它在 14 版本中得到了进一步的完善。App Router 基于React Server Components构建，可以显著提升应用性能。</p>

      <pre><code class="language-typescript">// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}</code></pre>

      <h2>2. 优化图片加载</h2>
      <p>使用 Next.js Image 组件可以自动优化图片加载，包括懒加载、响应式图片和自动格式化。</p>

      <pre><code class="language-tsx">import Image from 'next/image'

export function ProfileImage() {
  return (
    <Image
      src="/profile.jpg"
      alt="Profile"
      width={500}
      height={500}
      priority
    />
  )
}</code></pre>

      <h2>3. 使用 Server Actions</h2>
      <p>Server Actions 允许你在服务器上直接运行异步函数，而无需创建 API 端点。这简化了数据变更操作。</p>

      <pre><code class="language-typescript">'use server'

export async function createPost(formData: FormData) {
  const title = formData.get('title')
  // 处理表单数据
  revalidatePath('/posts')
}</code></pre>

      <h2>4. 实现流式渲染</h2>
      <p>流式渲染可以让页面的一部分先加载并显示，而不必等待整个页面加载完成。</p>

      <pre><code class="language-tsx">import { Suspense } from 'react'

export default function Page() {
  return (
    <div>
      <Header />
      <Suspense fallback={<Loading />}>
        <Posts />
      </Suspense>
    </div>
  )
}</code></pre>

      <h2>5. 使用部分预渲染</h2>
      <p>部分预渲染（PPR）结合了静态和动态渲染的优势，可以为特定路由构建静态外壳，同时保持动态内容的能力。</p>

      <h2>总结</h2>
      <p>通过合理使用这些特性，我们可以构建出性能优异的 Next.js 应用。记住，性能优化是一个持续的过程，需要不断地监测和改进。</p>
    `,
    author: {
      id: '1',
      name: '张三',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    },
    category: {
      id: '1',
      name: '前端开发',
      slug: 'frontend',
    },
    tags: [
      { id: '1', name: 'Next.js', slug: 'nextjs' },
      { id: '2', name: 'React', slug: 'react' },
      { id: '3', name: '性能优化', slug: 'performance' },
    ],
    publishedAt: '2024-03-06T10:00:00Z',
    updatedAt: '2024-03-06T10:00:00Z',
    readTime: 8,
    views: 1234,
    likes: 56,
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
  };

  // Calculate reading time with progress
  const { totalReadingTime, timeElapsed, timeRemaining, progress } =
    useEstimatedReadingTime(post.content);

  // Sample comments data
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      content: '这篇文章写得很好！学到了很多。',
      author: {
        id: '2',
        name: '李四',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      },
      postId: post.id,
      createdAt: '2024-03-06T12:00:00Z',
      likes: 5,
      isLiked: false,
      replies: [
        {
          id: '2',
          content: '同意！特别是关于 Server Actions 的部分。',
          author: {
            id: '3',
            name: '王五',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
          },
          postId: post.id,
          parentId: '1',
          createdAt: '2024-03-06T12:30:00Z',
          likes: 2,
          isLiked: true,
        },
      ],
    },
  ]);

  // Sample related posts
  const relatedPosts = [
    {
      id: '2',
      title: 'React Server Components 完全指南',
      slug: 'react-server-components-guide',
      excerpt: '深入了解 React Server Components 的工作原理和最佳实践。',
      category: post.category,
      publishedAt: '2024-03-05T10:00:00Z',
      readTime: 10,
    },
    {
      id: '3',
      title: 'TypeScript 5.0 新特性详解',
      slug: 'typescript-5-new-features',
      excerpt: '探索 TypeScript 5.0 带来的新特性和改进。',
      category: post.category,
      publishedAt: '2024-03-04T10:00:00Z',
      readTime: 6,
    },
    {
      id: '4',
      title: 'Web 性能优化最佳实践',
      slug: 'web-performance-optimization',
      excerpt: '学习如何优化 Web 应用的加载速度和运行性能。',
      category: post.category,
      publishedAt: '2024-03-03T10:00:00Z',
      readTime: 12,
    },
  ];

  const handleAddComment = async (content: string, parentId?: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      content,
      author: {
        id: '1',
        name: '张三',
        avatar: post.author.avatar,
      },
      postId: post.id,
      parentId,
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
    };

    if (parentId) {
      // Add as reply
      return newComment;
    } else {
      // Add as top-level comment
      setComments([newComment, ...comments]);
      return newComment;
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    setComments(comments.filter(c => c.id !== commentId));
  };

  const handleUpdateComment = async (commentId: string, content: string) => {
    setComments(
      comments.map(c =>
        c.id === commentId ? { ...c, content } : c
      )
    );
  };

  const handleLikeComment = async (commentId: string) => {
    setComments(
      comments.map(c => {
        if (c.id === commentId) {
          return {
            ...c,
            isLiked: !c.isLiked,
            likes: c.isLiked ? (c.likes || 0) - 1 : (c.likes || 0) + 1,
          };
        }
        return c;
      })
    );
  };

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-br from-cyber-purple/20 to-cyber-cyan/20">
        {post.coverImage && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${post.coverImage})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark via-transparent to-transparent" />
        <div className="relative container mx-auto px-4 h-full flex items-end pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <Badge variant="neon" className="mb-4">
              {post.category.name}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Avatar src={post.author.avatar} alt={post.author.name} size="sm" />
                <span>{post.author.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{new Date(post.publishedAt).toLocaleDateString('zh-CN')}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{totalReadingTime.minutes}分钟阅读</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye size={14} />
                <span>{post.views}次阅读</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Actions Bar */}
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <LikeButton
                    postId={post.id}
                    initialLiked={liked}
                    initialCount={post.likes}
                    onLike={() => setLiked(!liked)}
                  />
                  <BookmarkButton
                    postId={post.id}
                    initialBookmarked={bookmarked}
                    onBookmark={() => setBookmarked(!bookmarked)}
                  />
                </div>
                <EnhancedShareButton
                  url={typeof window !== 'undefined' ? window.location.href : ''}
                  title={post.title}
                  description={post.content.slice(0, 160).replace(/<[^>]*>/g, '')}
                  imageUrl={post.coverImage}
                  variant="dropdown"
                />
              </div>
            </Card>

            {/* Reading Progress */}
            {progress > 0 && (
              <Card className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">阅读进度</span>
                    <span className="text-cyber-cyan">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 bg-cyber-dark rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>已读: {timeElapsed}</span>
                    <span>剩余: {timeRemaining}</span>
                  </div>
                </div>
              </Card>
            )}

            {/* Content */}
            <Card className="p-8">
              <div
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </Card>

            {/* Tags */}
            <Card className="p-4">
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <Badge key={tag.id} variant="ghost" size="sm">
                    #{tag.name}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Comments Section */}
            <Card className="p-8">
              <CommentSystem
                postId={post.id}
                initialComments={comments}
                onAddComment={handleAddComment}
                onDeleteComment={handleDeleteComment}
                onUpdateComment={handleUpdateComment}
                onLikeComment={handleLikeComment}
                allowReplies={true}
                maxDepth={3}
              />
            </Card>

            {/* Related Posts */}
            <RelatedPosts
              currentPostId={post.id}
              category={post.category.slug}
              tags={post.tags.map(t => t.slug)}
              limit={3}
              variant="grid"
              onFetchRelated={async () => relatedPosts}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Table of Contents */}
              <Card className="p-4">
                <h3 className="font-bold mb-4">目录</h3>
                <TableOfContents
                  content={post.content}
                  className="space-y-2"
                />
              </Card>

              {/* Author Info */}
              <Card className="p-4">
                <h3 className="font-bold mb-4">作者</h3>
                <div className="flex items-center gap-3 mb-3">
                  <Avatar src={post.author.avatar} alt={post.author.name} size="md" />
                  <div>
                    <div className="font-bold">{post.author.name}</div>
                    <div className="text-sm text-gray-400">前端开发者</div>
                  </div>
                </div>
                <Button variant="neon" size="sm" className="w-full">
                  关注
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
