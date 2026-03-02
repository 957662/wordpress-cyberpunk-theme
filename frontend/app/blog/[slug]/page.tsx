import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { BlogDetail } from '@/components/blog/BlogDetail';
import { CommentSystem } from '@/components/blog/CommentSystem';
import { RelatedPosts } from '@/components/blog/RelatedPosts';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { PostSkeleton } from '@/components/blog/PostSkeleton';
import { CyberGrid } from '@/components/effects/CyberGrid';
import { Scanlines } from '@/components/effects/ScanLines';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WP_API_URL}/wp/v2/posts?slug=${params.slug}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      return {
        title: 'Post Not Found | CyberPress',
      };
    }

    const posts = await response.json();

    if (!posts || posts.length === 0) {
      return {
        title: 'Post Not Found | CyberPress',
      };
    }

    const post = posts[0];

    return {
      title: `${post.title.rendered} | CyberPress`,
      description: post.excerpt?.rendered?.replace(/<[^>]*>/g, '') || '',
      openGraph: {
        title: post.title.rendered,
        description: post.excerpt?.rendered?.replace(/<[^>]*>/g, '') || '',
        type: 'article',
        publishedTime: post.date,
        modifiedTime: post.modified,
        authors: [post.yoast_head_json?.author || 'CyberPress'],
        images: post.yoast_head_json?.og_image || [],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title.rendered,
        description: post.excerpt?.rendered?.replace(/<[^>]*>/g, '') || '',
      },
      keywords: post.yoast_head_json?.schema?.['@graph']?.[0]?.keywords || [],
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Blog Post | CyberPress',
    };
  }
}

// Generate static params for static generation
export async function generateStaticParams() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WP_API_URL}/wp/v2/posts?per_page=100&_fields=slug`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      return [];
    }

    const posts = await response.json();

    return posts.map((post: { slug: string }) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  return (
    <main className="min-h-screen relative">
      {/* Background Effects */}
      <CyberGrid className="fixed inset-0 opacity-30 pointer-events-none" />
      <Scanlines className="fixed inset-0 opacity-10 pointer-events-none" />

      <div className="relative z-10">
        {/* Blog Post Detail */}
        <article className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
            {/* Main Content */}
            <div className="space-y-8">
              <Suspense fallback={<PostSkeleton />}>
                <BlogDetail slug={params.slug} />
              </Suspense>

              {/* Comments */}
              <Suspense fallback={<PostSkeleton />}>
                <CommentSystem postSlug={params.slug} />
              </Suspense>
            </div>

            {/* Sidebar */}
            <aside className="space-y-8">
              {/* Table of Contents */}
              <Suspense fallback={<div className="animate-pulse bg-cyber-card rounded-lg h-64" />}>
                <TableOfContents slug={params.slug} />
              </Suspense>

              {/* Related Posts */}
              <Suspense fallback={<div className="animate-pulse bg-cyber-card rounded-lg h-64" />}>
                <RelatedPosts
                  slug={params.slug}
                  limit={5}
                />
              </Suspense>
            </aside>
          </div>
        </article>
      </div>
    </main>
  );
}

// Revalidate every hour
export const revalidate = 3600;
