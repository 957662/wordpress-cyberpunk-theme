import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleDetail } from '@/components/blog/ArticleDetail';
import { BlogSidebar } from '@/components/blog/BlogSidebar';
import { wpClient } from '@/lib/wordpress/client';

interface PageProps {
  params: {
    slug: string;
  };
}

async function getPost(slug: string) {
  try {
    const post = await wpClient.getPostBySlug(slug);
    return post;
  } catch (error) {
    console.error('Failed to fetch post:', error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getPost(params.slug);

  if (!post) {
    return {
      title: '文章未找到',
    };
  }

  return {
    title: `${post.title.rendered.replace(/<[^>]*>/g, '')} - CyberPress Platform`,
    description: post.excerpt.rendered.replace(/<[^>]*>/g, ''),
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <ArticleDetail post={post} />
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <BlogSidebar />
          </aside>
        </div>
      </div>
    </main>
  );
}
