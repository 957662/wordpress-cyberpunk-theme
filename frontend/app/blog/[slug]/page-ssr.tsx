/**
 * Blog Post Detail Page (Server-Side Rendered)
 *
 * 使用服务端数据获取的博客详情页
 * 集成阅读进度追踪系统
 */

import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/lib/data/posts';
import { ArticleDetail } from '@/components/blog/ArticleDetail';
import { ArticleHeader } from '@/components/blog/ArticleHeader';
import { ArticleFooter } from '@/components/blog/ArticleFooter';
import { CommentSystem } from '@/components/blog/CommentSystem';
import { ShareButtons } from '@/components/blog/ShareButtons';
import { RelatedPosts } from '@/components/blog/RelatedPosts';
import { TableOfContentsEnhanced } from '@/components/blog/TableOfContentsEnhanced';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const post = await getPostBySlug(params.slug);

    if (!post) {
      return {
        title: 'Post Not Found',
      };
    }

    return {
      title: `${post.title} - CyberPress Platform`,
      description: post.excerpt,
      keywords: post.tags.map(tag => tag.name),
      openGraph: {
        title: post.title,
        description: post.excerpt,
        images: post.featuredImage ? [post.featuredImage] : [],
        type: 'article',
        publishedTime: post.date,
        authors: post.author?.name ? [post.author.name] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt,
        images: post.featuredImage ? [post.featuredImage] : [],
      },
    };
  } catch {
    return {
      title: 'Post Not Found',
    };
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  // 提取标题用于目录
  const headings = post.content.match(/<h[2-3][^>]*>(.*?)<\/h[2-3]>/g) || [];

  return (
    <article className="min-h-screen bg-cyber-dark text-white">
      {/* Article Header */}
      <ArticleHeader post={post} />

      {/* Table of Contents - Sticky Sidebar */}
      {headings.length > 0 && (
        <div className="hidden lg:block fixed right-8 top-1/2 -translate-y-1/2 w-64 max-h-[60vh] overflow-y-auto">
          <TableOfContentsEnhanced content={post.content} />
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Share Buttons */}
        <div className="mb-8">
          <ShareButtons
            title={post.title}
            url={`${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`}
            excerpt={post.excerpt}
          />
        </div>

        {/* Article Content */}
        <ArticleDetail post={post} />

        {/* Article Footer */}
        <div className="mt-12">
          <ArticleFooter post={post} />
        </div>

        {/* Related Posts */}
        <div className="mt-16">
          <RelatedPosts
            currentPostId={post.id}
            categorySlug={post.category?.slug}
            tagSlugs={post.tags.map(tag => tag.slug)}
            maxPosts={3}
          />
        </div>

        {/* Comments Section */}
        <div className="mt-16">
          <CommentSystem postId={post.id} />
        </div>
      </div>

      {/* Reading Progress Indicator (Client Component) */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-cyber-dark/20 z-50">
        <div
          className="h-full bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink"
          id="reading-progress-bar"
          style={{ width: '0%' }}
        />
      </div>

      {/* Reading Progress Script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const progressBar = document.getElementById('reading-progress-bar');
              if (!progressBar) return;

              window.addEventListener('scroll', () => {
                const windowHeight = window.innerHeight;
                const documentHeight = document.documentElement.scrollHeight;
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
                progressBar.style.width = scrollPercentage + '%';
              });
            })();
          `,
        }}
      />
    </article>
  );
}

// Generate static params for static generation
export async function generateStaticParams() {
  // 如果使用静态生成，这里获取所有文章的 slug
  // 现在返回空数组使用 SSR
  return [];
}

// Revalidate page every 60 seconds
export const revalidate = 60;
