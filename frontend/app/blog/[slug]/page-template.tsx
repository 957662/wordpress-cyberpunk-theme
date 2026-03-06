import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, User, Eye, ArrowLeft, ArrowRight } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { getPostBySlug, getPosts } from '@/lib/data';
import { CommentSystem } from '@/components/blog/CommentSystem';
import { RelatedPosts } from '@/components/blog/RelatedPosts';
import { ShareButtons, FloatingShareButton } from '@/components/blog/ShareButtons';
import { ReadingProgress } from '@/components/blog/ReadingProgress';
import type { BlogPost } from '@/types/models/blog';

// ============================================================================
// Generate Metadata
// ============================================================================

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug({ slug: params.slug });

  if (!post) {
    return {
      title: '文章未找到',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: post.featuredImage ? [post.featuredImage] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  };
}

// ============================================================================
// Generate Static Params
// ============================================================================

export async function generateStaticParams() {
  const { posts } = await getPosts({ perPage: 100 });

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// ============================================================================
// Page Component
// ============================================================================

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostBySlug({ slug: params.slug });

  if (!post) {
    notFound();
  }

  // Get related posts (same category or tags)
  const { posts: relatedPosts } = await getPosts({
    perPage: 4,
    category: post.category?.id.toString(),
  });

  return (
    <article className="min-h-screen">
      {/* Reading Progress Bar */}
      <ReadingProgress position="top" color="gradient" />

      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>返回博客</span>
        </Link>
      </div>

      {/* Article Header */}
      <header className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Category */}
          {post.category && (
            <Link
              href={`/blog?category=${post.category.slug}`}
              className="inline-block mb-4"
            >
              <span className="px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-sm font-medium hover:opacity-90 transition-opacity">
                {post.category.name}
              </span>
            </Link>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400 mb-8">
            {/* Author */}
            <div className="flex items-center gap-2">
              {post.author.avatar ? (
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                  {post.author.name.charAt(0)}
                </div>
              )}
              <span className="font-medium">{post.author.name}</span>
            </div>

            <span>•</span>

            {/* Date */}
            <div className="flex items-center gap-1.5">
              <Calendar size={16} />
              <time dateTime={post.publishedAt}>
                {formatDate(post.publishedAt)}
              </time>
            </div>

            <span>•</span>

            {/* Reading Time */}
            {post.readingTime && (
              <>
                <div className="flex items-center gap-1.5">
                  <Clock size={16} />
                  <span>{post.readingTime} 分钟阅读</span>
                </div>
              </>
            )}

            {post.views !== undefined && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Eye size={16} />
                  <span>{post.views} 阅读</span>
                </div>
              </>
            )}
          </div>

          {/* Share Buttons */}
          <div className="flex items-center justify-between pb-8 border-b border-gray-200 dark:border-gray-800">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              分享这篇文章
            </span>
            <ShareButtons
              title={post.title}
              url={`${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`}
              excerpt={post.excerpt}
              variant="minimal"
            />
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="container mx-auto px-4 mb-12">
          <div className="max-w-5xl mx-auto">
            <div className="relative aspect-[21/9] rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-800">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              />
            </div>
          </div>
        </div>
      )}

      {/* Article Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Content */}
          <div
            className={cn(
              'prose prose-lg dark:prose-invert max-w-none',
              'prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white',
              'prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl',
              'prose-p:text-gray-700 dark:prose-p:text-gray-300 leading-relaxed',
              'prose-a:text-cyan-600 dark:prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline',
              'prose-strong:text-gray-900 dark:prose-strong:text-white',
              'prose-code:text-cyan-600 dark:prose-code:text-cyan-400',
              'prose-pre:bg-gray-900 dark:prose-pre:bg-black',
              'prose-blockquote:border-l-4 prose-blockquote:border-cyan-500',
              'prose-img:rounded-lg'
            )}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                相关标签
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/blog?tag=${tag.slug}`}
                    className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm hover:bg-cyan-100 dark:hover:bg-cyan-900/30 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Author Bio */}
      <div className="container mx-auto px-4 py-12 bg-gray-50 dark:bg-gray-800/30">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {post.author.avatar ? (
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                  {post.author.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {post.author.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                作者介绍内容...
              </p>
              <Link
                href={`/author/${post.author.id}`}
                className="inline-flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-medium hover:gap-3 transition-all"
              >
                <span>查看更多文章</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <RelatedPosts
            currentPostId={post.id}
            posts={relatedPosts}
            type="related"
            layout="grid"
          />
        </div>
      </div>

      {/* Comments */}
      <div className="container mx-auto px-4 py-16 bg-gray-50 dark:bg-gray-800/30">
        <div className="max-w-4xl mx-auto">
          <CommentSystem postId={post.id} />
        </div>
      </div>

      {/* Floating Share Button */}
      <FloatingShareButton
        title={post.title}
        url={`${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`}
        excerpt={post.excerpt}
      />
    </article>
  );
}
