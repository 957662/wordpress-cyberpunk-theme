/**
 * BlogDetailPage - 博客详情页面主组件
 * 完整的文章详情页面，包含内容、作者信息、相关文章等
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Eye, Heart, MessageCircle, Share2, Bookmark, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useBlogPost } from '@/hooks/use-blog-data';
import { useReadingProgress } from '@/hooks/useReadingProgress';
import type { BlogPost } from '@/types/models/blog';
import { cn } from '@/lib/utils/cn';
import { formatDistanceToNow } from '@/lib/utils/format';

// 导入子组件
import { ArticleHeader } from './ArticleHeader';
import { ArticleContent } from './ArticleContent';
import { AuthorCard } from './AuthorCard';
import { RelatedPosts } from './RelatedPosts';
import { CommentSection } from './CommentSection';
import { ArticleActions } from './ArticleActions';
import { TableOfContents } from './TableOfContents';
import { ReadingProgressBar } from './ReadingProgressBar';
import { ArticleSkeleton } from './ArticleSkeleton';
import { ErrorMessage } from './ErrorMessage';

interface BlogDetailPageProps {
  slug: string;
  className?: string;
}

export function BlogDetailPage({ slug, className }: BlogDetailPageProps) {
  const router = useRouter();
  const { data: post, isLoading, isError, error } = useBlogPost(slug);
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);

  const readingProgress = useReadingProgress();

  // 滚动到顶部
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  // 处理书签
  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    // TODO: 调用 API
  };

  // 处理点赞
  const handleLike = () => {
    setLiked(!liked);
    // TODO: 调用 API
  };

  // 处理分享
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.error('分享失败:', err);
      }
    }
  };

  // 加载状态
  if (isLoading) {
    return <ArticleSkeleton />;
  }

  // 错误状态
  if (isError || !post) {
    return (
      <ErrorMessage
        title="文章不存在"
        description={error?.message || '无法找到该文章，可能已被删除或移动'}
        action={{
          label: '返回博客',
          onClick: () => router.push('/blog'),
        }}
      />
    );
  }

  return (
    <div className={cn('min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950', className)}>
      {/* 阅读进度条 */}
      <ReadingProgressBar progress={readingProgress} />

      {/* 返回按钮 */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="container mx-auto px-4 pt-8"
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回
        </button>
      </motion.div>

      {/* 文章头部 */}
      <ArticleHeader post={post} />

      {/* 主内容区 */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
          {/* 左侧：文章内容 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* 文章元信息 */}
            <div className="mb-8 flex flex-wrap items-center gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readingTime} 分钟阅读</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{post.viewCount} 次浏览</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className={cn('w-4 h-4', liked && 'fill-red-500 text-red-500')} />
                <span>{post.likeCount + (liked ? 1 : 0)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span>{post.commentCount} 条评论</span>
              </div>
              <div className="ml-auto text-slate-500">
                {formatDistanceToNow(new Date(post.publishedAt))}发布
              </div>
            </div>

            {/* 文章操作栏 */}
            <div className="mb-8">
              <ArticleActions
                liked={liked}
                bookmarked={bookmarked}
                onLike={handleLike}
                onBookmark={handleBookmark}
                onShare={handleShare}
                onCommentsToggle={() => setShowComments(!showComments)}
              />
            </div>

            {/* 文章内容 */}
            <article className="prose prose-lg prose-invert max-w-none mb-12">
              <ArticleContent content={post.content} />
            </article>

            {/* 标签 */}
            {post.tags.length > 0 && (
              <div className="mb-8 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <a
                    key={tag.id}
                    href={`/blog?tag=${tag.slug}`}
                    className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-sm hover:bg-cyan-900/50 hover:text-cyan-400 transition-colors"
                  >
                    #{tag.name}
                  </a>
                ))}
              </div>
            )}

            {/* 作者卡片 */}
            <div className="mb-8">
              <AuthorCard author={post.author} />
            </div>

            {/* 相关文章 */}
            <RelatedPosts currentPostId={post.id} categories={post.category} />

            {/* 评论区 */}
            {showComments && (
              <div className="mt-12">
                <CommentSection postId={post.id} />
              </div>
            )}
          </motion.div>

          {/* 右侧：侧边栏 */}
          <aside className="hidden lg:block space-y-8">
            {/* 目录 */}
            {tocOpen && (
              <div className="sticky top-8">
                <TableOfContents content={post.content} />
              </div>
            )}

            {/* 快速操作 */}
            <div className="sticky top-8 rounded-lg border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
              <h3 className="mb-4 font-semibold text-slate-200">快速操作</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setTocOpen(!tocOpen)}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors',
                    tocOpen
                      ? 'bg-cyan-900/20 text-cyan-400'
                      : 'text-slate-400 hover:bg-slate-800'
                  )}
                >
                  <Bookmark className="w-4 h-4" />
                  目录
                </button>
                <button
                  onClick={handleBookmark}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors',
                    bookmarked
                      ? 'bg-purple-900/20 text-purple-400'
                      : 'text-slate-400 hover:bg-slate-800'
                  )}
                >
                  <Bookmark className="w-4 h-4" />
                  {bookmarked ? '已收藏' : '收藏'}
                </button>
                <button
                  onClick={handleShare}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm text-slate-400 hover:bg-slate-800 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  分享
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default BlogDetailPage;
