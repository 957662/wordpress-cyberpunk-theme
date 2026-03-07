/**
 * Blog Post Detail Page
 *
 * Single blog post page with comments, sharing, and related posts
 */

'use client';

import { useParams } from 'next/navigation';
import { usePost, usePostComments, usePosts } from '@/hooks/use-wordpress';
import { ArticleHeader } from '@/components/blog/ArticleHeader';
import { ArticleContent } from '@/components/blog/ArticleContent';
import { ArticleFooter } from '@/components/blog/ArticleFooter';
import { ArticleNavigation } from '@/components/blog/ArticleNavigation';
import { CommentSystem } from '@/components/blog/CommentSystem';
import { RelatedPosts } from '@/components/blog/RelatedPosts';
import { ShareButtons } from '@/components/blog/ShareButtons';
import { ReadingProgress } from '@/components/blog/ReadingProgress';
import { LoadingSpinner } from '@/components/blog/LoadingSpinner';
import { EmptyState } from '@/components/blog/EmptyState';
import { adaptPost } from '@/lib/wordpress/adapters';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  // Fetch post data
  const {
    data: post,
    isLoading,
    error,
  } = usePost(slug, { enabled: !!slug });

  // Fetch comments
  const { data: comments = [], isLoading: commentsLoading } = usePostComments(
    post?.id || 0,
    { enabled: !!post?.id }
  );

  // Fetch related posts (same category)
  const { data: relatedPosts = [] } = usePosts(
    {
      per_page: 4,
      categories: post?.categories?.[0]?.id,
      exclude: post?.id ? [post.id] : undefined,
    },
    { enabled: !!post?.id }
  );

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" color="cyan" />
      </div>
    );
  }

  // Show error state
  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EmptyState
          type="error"
          title="Post Not Found"
          description="The blog post you're looking for doesn't exist or has been removed."
          action={{
            label: 'Back to Blog',
            onClick: () => window.location.href = '/blog',
          }}
        />
      </div>
    );
  }

  // Adapt post data
  const adaptedPost = adaptPost(post);

  // Handle navigation
  const handleNavigate = (slug: string) => {
    window.location.href = `/blog/${slug}`;
  };

  return (
    <>
      {/* Reading Progress Bar */}
      <ReadingProgress
        position="top"
        color="cyan"
        size="medium"
        showPercentage
      />

      <article className="min-h-screen bg-cyber-dark">
        {/* Article Header */}
        <ArticleHeader
          title={adaptedPost.title}
          excerpt={adaptedPost.excerpt}
          author={{
            name: adaptedPost.author.name,
            avatar: adaptedPost.author.avatar,
          }}
          publishedAt={adaptedPost.date}
          readingTime={adaptedPost.readingTime}
          category={adaptedPost.categories[0]}
          featuredImage={adaptedPost.featuredImage}
          className="container mx-auto px-4 py-12"
        />

        {/* Share Buttons */}
        <div className="container mx-auto px-4 mb-8">
          <ShareButtons
            title={adaptedPost.title}
            url={typeof window !== 'undefined' ? window.location.href : adaptedPost.link}
            excerpt={adaptedPost.excerpt}
            variant="default"
            size="md"
          />
        </div>

        {/* Article Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <ArticleContent
              content={adaptedPost.content}
              className="prose prose-lg prose-invert max-w-none
                        prose-headings:text-cyber-cyan
                        prose-a:text-cyber-pink
                        prose-strong:text-cyber-cyan
                        prose-code:text-cyber-purple
                        prose-pre:bg-cyber-muted"
            />
          </div>
        </div>

        {/* Article Footer */}
        <div className="container mx-auto px-4 py-12">
          <ArticleFooter
            tags={adaptedPost.tags}
            author={{
              name: adaptedPost.author.name,
              avatar: adaptedPost.author.avatar,
            }}
            className="max-w-4xl mx-auto"
          />
        </div>

        {/* Article Navigation */}
        <div className="container mx-auto px-4 py-8">
          <ArticleNavigation
            previousPost={undefined} // TODO: Fetch previous post
            nextPost={undefined} // TODO: Fetch next post
            onNavigate={handleNavigate}
            className="max-w-4xl mx-auto"
          />
        </div>

        {/* Comments Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <CommentSystem
              postId={adaptedPost.id}
              comments={comments.map(comment => ({
                id: String(comment.id),
                author: {
                  name: comment.author_name,
                  avatar: comment.author_avatar_urls?.['96'],
                },
                content: comment.content.rendered,
                createdAt: comment.date,
                likes: 0,
                replies: [],
              }))}
              className="cyber-card p-8"
            />
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-cyber-cyan mb-8">Related Posts</h2>
              <RelatedPosts
                currentPostId={adaptedPost.id}
                posts={relatedPosts.map(p => adaptPost(p))}
                type="related"
                limit={4}
                layout="grid"
              />
            </div>
          </div>
        )}
      </article>
    </>
  );
}
