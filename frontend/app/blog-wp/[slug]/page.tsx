/**
 * WordPress 文章详情页
 * 展示如何使用 WordPress API 获取单篇文章数据
 */

import { getServerPostBySlug, getServerPosts } from '@/lib/wordpress/server-client';
import { notFound } from 'next/navigation';
import { ArticleFooter } from '@/components/blog/ArticleFooter';
import { ShareButtons } from '@/components/blog/ShareButtons';
import { LikeButton } from '@/components/blog/LikeButton';
import { BookmarkButton } from '@/components/blog/BookmarkButton';
import { ReadingProgress } from '@/components/blog/ReadingProgress';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { CommentListEnhanced } from '@/components/blog/CommentListEnhanced';
import { RelatedPosts } from '@/components/blog/RelatedPosts';
import { AuthorCard } from '@/components/blog/AuthorCard';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 600; // 10 分钟

interface PostPageProps {
  params: {
    slug: string;
  };
}

export default async function WordPressPostPage({ params }: PostPageProps) {
  const post = await getServerPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  // 获取相关文章（同分类的文章）
  const relatedPosts = await getServerPosts({
    per_page: 3,
    ...(post.categories && post.categories.length > 0 && {
      categories: [parseInt(post.categories[0].id as string)],
    }),
    exclude: [parseInt(post.id as string)],
    _embed: true,
  });

  return (
    <>
      {/* 阅读进度条 */}
      <ReadingProgress />

      <article className="min-h-screen bg-cyber-dark">
        {/* Article Header */}
        <header className="relative py-12 border-b border-cyber-border">
          <div className="absolute inset-0 bg-cyber-grid opacity-10" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            {/* Breadcrumb */}
            <nav className="mb-6 text-sm">
              <ol className="flex items-center space-x-2 text-gray-400">
                <li>
                  <Link href="/blog-wp" className="hover:text-cyber-cyan transition-colors">
                    首页
                  </Link>
                </li>
                <li>/</li>
                <li>
                  <Link href="/blog-wp" className="hover:text-cyber-cyan transition-colors">
                    博客
                  </Link>
                </li>
                <li>/</li>
                <li className="text-gray-600 dark:text-gray-400">{post.title}</li>
              </ol>
            </nav>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
              {/* Author */}
              {post.author && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800">
                    {post.author.avatar && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <span className="font-medium">{post.author.name}</span>
                </div>
              )}

              {/* Date */}
              {post.publishedAt && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
              )}

              {/* Reading Time */}
              {post.readingTime && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{post.readingTime} 分钟阅读</span>
                </div>
              )}

              {/* Category */}
              {post.category && (
                <div>
                  <Link
                    href={`/blog-wp?category=${post.categories?.[0]?.id}`}
                    className="inline-flex items-center px-3 py-1 bg-cyber-cyan/10 text-cyber-cyan rounded-full text-sm font-medium hover:bg-cyber-cyan/20 transition-colors"
                  >
                    {post.category}
                  </Link>
                </div>
              )}
            </div>

            {/* Cover Image */}
            {post.coverImage && (
              <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800 mb-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <LikeButton postId={post.id.toString()} />
              <BookmarkButton postId={post.id.toString()} />
              <ShareButtons
                title={post.title}
                url={`/blog-wp/${post.slug}`}
                description={post.excerpt}
              />
            </div>
          </div>
        </header>

        {/* Article Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Excerpt */}
              {post.excerpt && (
                <div className="prose prose-lg max-w-none mb-8">
                  <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              )}

              {/* Content */}
              <div
                className="prose prose-lg prose-cyber max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content || '' }}
              />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide mb-4">
                    标签
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/blog-wp?tag=${tag}`}
                        className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <ArticleFooter
                prevPost={null}
                nextPost={null}
                onShare={() => {}}
              />
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Table of Contents */}
                {post.content && (
                  <TableOfCards content={post.content} />
                )}

                {/* Author Card */}
                {post.author && (
                  <AuthorCard
                    name={post.author.name}
                    avatar={post.author.avatar}
                    bio="技术博主，分享前端开发和设计经验"
                    slug={post.author.slug}
                  />
                )}
              </div>
            </aside>
          </div>
        </main>

        {/* Comments Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-cyber-border">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            评论
          </h2>
          <CommentListEnhanced postId={post.id.toString()} />
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-cyber-border">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              相关文章
            </h2>
            <RelatedPosts posts={relatedPosts} />
          </section>
        )}
      </article>
    </>
  );
}

// SEO 元数据
export async function generateMetadata({ params }: PostPageProps) {
  const post = await getServerPostBySlug(params.slug);

  if (!post) {
    return {};
  }

  const title = `${post.title} - 技术博客`;
  const description = post.excerpt || post.content?.substring(0, 160);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author?.name],
      images: post.coverImage ? [post.coverImage] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

// 生成静态参数
export async function generateStaticParams() {
  const posts = await getServerPosts({ per_page: 100 });

  return posts.map((post) => ({
    slug: post.slug,
  }));
}
