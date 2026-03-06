'use client';

/**
 * 博客详情页面
 * 使用 WordPress API 获取文章数据
 */

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePost, useRelatedPosts } from '@/hooks/api/use-posts';
import { ArticleDetail } from '@/components/blog/ArticleDetail';
import { CommentSection } from '@/components/blog/CommentSection';
import { RelatedPosts } from '@/components/blog/RelatedPosts';
import { CyberLoader } from '@/components/cyber/CyberLoader';
import { CyberButton } from '@/components/ui/CyberButton';
import { ArrowLeft } from 'lucide-react';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: post, isLoading, error } = usePostBySlug(slug);
  
  const { data: relatedPosts } = useRelatedPosts(
    post?.id,
    post?.category
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cyber-dark flex items-center justify-center">
        <div className="text-center">
          <CyberLoader size="lg" />
          <p className="mt-4 text-cyber-cyan animate-pulse">加载文章中...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-cyber-dark flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-cyber-pink mb-2">
            文章加载失败
          </h1>
          <p className="text-cyber-muted mb-6">
            {error?.message || '文章不存在或已被删除'}
          </p>
          <Link href="/blog">
            <CyberButton variant="primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回博客列表
            </CyberButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-cyber-dark"
    >
      {/* 返回按钮 */}
      <div className="sticky top-0 z-50 bg-cyber-dark/80 backdrop-blur-sm border-b border-cyber-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/blog">
            <CyberButton variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回博客
            </CyberButton>
          </Link>
        </div>
      </div>

      {/* 文章内容 */}
      <ArticleDetail post={post} />

      {/* 相关文章 */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-white mb-6">
            <span className="text-cyber-cyan">相关</span>文章
          </h2>
          <RelatedPosts posts={relatedPosts} />
        </section>
      )}

      {/* 评论区 */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <CommentSection postId={post.id} />
      </section>

      {/* 底部导航 */}
      <section className="max-w-4xl mx-auto px-4 py-8 border-t border-cyber-border">
        <div className="flex justify-between items-center">
          <Link href="/blog">
            <CyberButton variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回列表
            </CyberButton>
          </Link>
        </div>
      </section>
    </motion.div>
  );
}

// 导出一个 hook 用于在服务端获取数据
export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const { wpClient } = await import('@/lib/wordpress/client');
    const posts = await wpClient.getPostBySlug(params.slug);
    
    if (posts.length === 0) {
      return {
        title: '文章不存在',
      };
    }

    const post = posts[0];
    const excerpt = post.excerpt.rendered.replace(/<[^>]*>/g, '');
    
    return {
      title: post.title.rendered,
      description: excerpt.slice(0, 160),
      openGraph: {
        title: post.title.rendered,
        description: excerpt.slice(0, 160),
        type: 'article',
        publishedTime: post.date,
        authors: [post._embedded?.author?.[0]?.name || 'Unknown'],
      },
    };
  } catch {
    return {
      title: '文章加载失败',
    };
  }
}
