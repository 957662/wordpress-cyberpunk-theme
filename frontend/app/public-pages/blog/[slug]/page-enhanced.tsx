/**
 * 博客详情页面 - 增强版
 * 完整实现文章展示、评论系统等功能
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Share2,
  Bookmark,
} from 'lucide-react';
import { usePostBySlug, useComments } from '@/lib/wordpress/hooks';
import { CommentList } from '@/components/blog/CommentList';
import { CommentForm } from '@/components/blog/CommentForm';
import { toast } from '@/components/ui/ToastProvider';

export default function BlogDetailEnhanced() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { data: post, loading: postLoading, error: postError } = usePostBySlug(slug);
  const { data: comments, refetch: refetchComments } = useComments(post?.id || 0);

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // 计算阅读时间
  const calculateReadTime = (content: string): string => {
    const wordsPerMinute = 200;
    const textLength = content.replace(/<[^>]*>/g, '').length;
    const minutes = Math.ceil(textLength / wordsPerMinute);
    return `${minutes} 分钟`;
  };

  // 分享功能
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title?.rendered || '',
          text: post?.excerpt?.rendered || '',
          url: window.location.href,
        });
        toast.success('分享成功！');
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      // 复制链接到剪贴板
      navigator.clipboard.writeText(window.location.href);
      toast.success('链接已复制到剪贴板');
    }
  };

  // 收藏功能
  const handleBookmark = () => {
    // TODO: 实现实际的收藏功能
    toast.success('已添加到收藏');
  };

  if (postLoading) {
    return (
      <div className="min-h-screen bg-cyber-dark flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyber-cyan mb-4"></div>
          <p className="text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  if (postError || !post) {
    return (
      <div className="min-h-screen bg-cyber-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">文章未找到</h1>
          <p className="text-gray-400 mb-6">{postError || '该文章不存在或已被删除'}</p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan rounded-lg hover:bg-cyber-cyan/20 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回博客列表</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-cyber-dark">
      {/* 导航栏 */}
      <nav className="border-b border-cyber-border bg-cyber-dark/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-2xl font-display font-bold"
            >
              <span className="text-cyber-cyan">CYBER</span>
              <span className="text-cyber-purple">PRESS</span>
            </Link>

            <div className="flex items-center gap-4">
              <Link
                href="/blog"
                className="text-gray-400 hover:text-cyber-cyan transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>返回列表</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* 文章头部 */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          {/* 标题 */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {post.title?.rendered}
          </h1>

          {/* 元信息 */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{calculateReadTime(post.content?.rendered || '')}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>作者 ID: {post.author}</span>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-cyber-dark/50 border border-cyber-border text-gray-400 rounded-lg hover:border-cyber-cyan hover:text-cyber-cyan transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>分享</span>
            </button>
            <button
              onClick={handleBookmark}
              className="flex items-center gap-2 px-4 py-2 bg-cyber-dark/50 border border-cyber-border text-gray-400 rounded-lg hover:border-cyber-purple hover:text-cyber-purple transition-all"
            >
              <Bookmark className="w-4 h-4" />
              <span>收藏</span>
            </button>
          </div>
        </motion.header>

        {/* 文章摘要 */}
        {post.excerpt?.rendered && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="cyber-card p-6 mb-8 text-lg text-gray-300 border-l-4 border-l-cyber-cyan"
            dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
          />
        )}

        {/* 文章内容 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-invert prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: post.content?.rendered || '' }}
        />

        {/* 文章标签 */}
        {post.tags && post.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="cyber-card p-6 mb-8"
          >
            <h3 className="text-sm font-semibold text-gray-400 mb-3">标签</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tagId) => (
                <span
                  key={tagId}
                  className="px-3 py-1 text-sm bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 rounded-full"
                >
                  标签 #{tagId}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </article>

      {/* 评论区 */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* 评论表单 */}
          <div className="mb-8">
            <CommentForm
              postId={post.id}
              onSuccess={refetchComments}
            />
          </div>

          {/* 评论列表 */}
          <CommentList postId={post.id} />
        </motion.div>
      </section>

      {/* 页脚 */}
      <footer className="border-t border-cyber-border py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            © 2024 CyberPress. 由 AI 开发团队自动构建 🤖
          </p>
        </div>
      </footer>
    </main>
  );
}
