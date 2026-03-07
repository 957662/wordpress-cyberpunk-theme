/**
 * Blog Post Detail Page - WordPress Integration
 *
 * 博客详情页，集成 WordPress API
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { ArticleHeader } from '@/components/blog/ArticleHeader';
import { ArticleContent } from '@/components/blog/ArticleContent';
import { ArticleFooter } from '@/components/blog/ArticleFooter';
import { CommentSystem } from '@/components/blog/CommentSystem';
import { RelatedPosts } from '@/components/blog/RelatedPosts';
import { ShareButtons } from '@/components/blog/ShareButtons';
import { ReadingProgress } from '@/components/blog/ReadingProgress';
import { LoadingSpinner } from '@/components/blog/LoadingSpinner';
import { usePost, useComments, usePosts } from '@/lib/wordpress/react-hooks';
import { calculateReadingTime, formatDate } from '@/lib/wordpress/data-adapter';
import { cn } from '@/lib/utils';

export default function BlogPostPageIntegrated() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [showShare, setShowShare] = useState(false);

  // 获取文章详情
  const { data: post, isLoading: postLoading, error } = usePostBySlug(slug);

  // 获取评论
  const { data: comments, isLoading: commentsLoading } = useComments(
    post?.[0]?.id,
    {
      enabled: !!post?.[0]?.id,
    }
  );

  // 获取相关文章
  const { data: relatedPosts } = usePosts(
    {
      per_page: 4,
      exclude: post?.[0]?.id ? [post[0].id] : undefined,
      categories: post?.[0]?.categories,
      orderby: 'rand',
    },
    {
      enabled: !!post?.[0]?.id,
    }
  );

  // 滚动时显示分享按钮
  useEffect(() => {
    const handleScroll = () => {
      setShowShare(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (postLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-muted to-cyber-dark flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error || !post || post.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-muted to-cyber-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-cyber-pink mb-4">文章未找到</h1>
          <p className="text-gray-400 mb-6">您访问的文章不存在或已被删除</p>
          <button
            onClick={() => router.push('/blog')}
            className="cyber-button"
          >
            返回博客列表
          </button>
        </div>
      </div>
    );
  }

  const postData = post[0];
  const readingTime = calculateReadingTime(postData.content.rendered);

  return (
    <article className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-muted to-cyber-dark">
      {/* Reading Progress Bar */}
      <ReadingProgress />

      {/* Floating Share Button */}
      {showShare && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40"
        >
          <ShareButtons
            title={postData.title.rendered}
            url={typeof window !== 'undefined' ? window.location.href : postData.link}
            orientation="vertical"
          />
        </motion.div>
      )}

      {/* Article Header */}
      <ArticleHeader
        title={postData.title.rendered}
        date={formatDate(postData.date)}
        author={{
          id: postData.author,
          name: '作者',
          avatar: undefined,
        }}
        categories={postData.categories.map(catId => ({
          id: catId,
          name: '分类',
          slug: '',
          description: '',
          count: 0,
          link: '',
        }))}
        readingTime={readingTime}
        featuredImage={postData.featured_media
          ? String(postData.featured_media)
          : undefined
        }
      />

      {/* Article Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ArticleContent content={postData.content.rendered} />
          </motion.div>

          {/* Article Footer */}
          <ArticleFooter
            tags={postData.tags.map(tagId => ({
              id: tagId,
              name: '标签',
              slug: '',
              count: 0,
              link: '',
            }))}
            date={postData.date}
            onEdit={() => console.log('Edit post')}
          />

          {/* Share Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="my-8"
          >
            <ShareButtons
              title={postData.title.rendered}
              url={typeof window !== 'undefined' ? window.location.href : postData.link}
            />
          </motion.div>

          {/* Comments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <CommentSystem
              postId={postData.id}
              comments={comments || []}
              loading={commentsLoading}
            />
          </motion.div>

          {/* Related Posts */}
          {relatedPosts && relatedPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-16"
            >
              <RelatedPosts
                posts={relatedPosts.map(p => ({
                  id: String(p.id),
                  title: p.title.rendered,
                  excerpt: p.excerpt.rendered.replace(/<[^>]*>/g, ''),
                  slug: p.slug,
                  featuredImage: p.featured_media
                    ? String(p.featured_media)
                    : undefined,
                  date: p.date,
                  author: {
                    id: p.author,
                    name: '作者',
                  },
                  categories: [],
                  link: p.link,
                }))}
              />
            </motion.div>
          )}
        </div>
      </div>
    </article>
  );
}
