export const dynamic = 'force-dynamic';
/**
 * Blog Detail Page
 * 博客详情页面（服务端渲染）
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { wordpressDataService } from '@/services/blog/wordpress-data-service';
import { BlogDetailNew } from '@/components/blog/BlogDetailNew';
import { CommentSystem } from '@/components/blog/CommentSystem';
import { RelatedPosts } from '@/components/blog/RelatedPosts';
import { ReadingProgress } from '@/components/blog/ReadingProgress';

interface BlogDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const post = await wordpressDataService.getPostBySlug(params.slug);

  if (!post) {
    return {
      title: '文章未找到',
    };
  }

  return {
    title: `${post.title} - CyberPress Blog`,
    description: post.excerpt,
    keywords: post.tags.map((tag) => tag.name),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
    },
  };
}

export default async function BlogDetailPage({
  params,
}: BlogDetailPageProps) {
  const post = await wordpressDataService.getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-cyber-dark">
      {/* Reading Progress Bar */}
      <ReadingProgress postId={post.id} />

      {/* Article Content */}
      <BlogDetailNew post={post} />

      {/* Related Posts */}
      <div className="container mx-auto px-4 py-12">
        <RelatedPosts
          currentPostId={post.id}
          categories={post.category.map((c) => c.id)}
          tags={post.tags.map((t) => t.id)}
        />
      </div>

      {/* Comments */}
      <div className="container mx-auto px-4 py-12">
        <CommentSystem postId={post.id} />
      </div>
    </article>
  );
}
