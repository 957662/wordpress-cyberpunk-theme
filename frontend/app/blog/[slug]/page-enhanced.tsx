import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogDetailEnhanced from '@/components/blog/BlogDetailEnhanced';
import BlogErrorBoundary from '@/components/error/BlogErrorBoundary';
import { blogService } from '@/services/blog/blog-service';

interface PageProps {
  params: {
    slug: string;
  };
}

/**
 * 生成静态参数（可选）
 */
export async function generateStaticParams() {
  try {
    const result = await blogService.getPosts({ perPage: 100 });

    return result.posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Failed to generate static params:', error);
    return [];
  }
}

/**
 * 生成元数据
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = params;

  try {
    const post = await blogService.getPostBySlug(slug);

    if (!post) {
      return {
        title: '文章未找到',
      };
    }

    return {
      title: post.title,
      description: post.excerpt || post.title,
      keywords: post.tags?.map((tag) => tag.name).join(', '),
      openGraph: {
        title: post.title,
        description: post.excerpt || post.title,
        type: 'article',
        publishedTime: post.date,
        authors: post.author ? [post.author] : [],
        images: post.featuredImage ? [post.featuredImage] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt || post.title,
        images: post.featuredImage ? [post.featuredImage] : [],
      },
    };
  } catch (error) {
    console.error('Failed to generate metadata:', error);
    return {
      title: '博客文章',
    };
  }
}

/**
 * 博客详情页面
 */
export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = params;

  try {
    // 获取文章数据
    const post = await blogService.getPostBySlug(slug);

    if (!post) {
      notFound();
    }

    // 并行获取相关数据
    const [relatedPosts] = await Promise.all([
      blogService.getRelatedPosts(post.id, 3),
    ]);

    return (
      <BlogErrorBoundary>
        <BlogDetailEnhanced
          post={post}
          relatedPosts={relatedPosts}
        />
      </BlogErrorBoundary>
    );
  } catch (error) {
    console.error('Failed to load blog post:', error);

    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            加载失败
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            文章加载失败，请稍后再试
          </p>
          <a
            href="/blog"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            返回博客列表
          </a>
        </div>
      </div>
    );
  }
}

/**
 * 生成静态参数（ISR 版本）
 */
export const revalidate = 3600; // 1 小时重新验证
