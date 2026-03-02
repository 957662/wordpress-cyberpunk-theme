import { metadata } from '@/app/layout';
import { WordPressClient } from '@/lib/wordpress/client';
import { notFound } from 'next/navigation';
import { BlogDetail } from '@/components/blog';
import { ReadingProgress, FontSizeAdjuster, ShareButtons, BookmarkButton, PrintButton } from '@/components/blog';
import { ArticlePrintToolbar } from '@/components/blog/PrintButton';

interface PageProps {
  params: {
    slug: string;
  };
}

/**
 * 博客文章详情页
 *
 * 展示单篇文章的完整内容，包含：
 * - 阅读进度条
 * - 字体大小调整
 * - 分享按钮
 * - 收藏功能
 * - 打印功能
 */
export default async function BlogPostPage({ params }: PageProps) {
  const wpClient = new WordPressClient();
  const post = await wpClient.getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="min-h-screen">
      {/* 阅读进度条 */}
      <ReadingProgress 
        position="top" 
        showPercentage={true}
        color="#00f0ff"
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 打印工具栏（仅在打印时显示） */}
        <ArticlePrintToolbar 
          title={post.title.rendered}
          showPrint={true}
          showFontSize={true}
          showDate={true}
        />

        {/* 文章头部工具栏 */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-cyber-cyan/20 no-print">
          <FontSizeAdjuster 
            minSize={14} 
            maxSize={24} 
            step={2}
            className="order-2 md:order-1"
          />
          
          <div className="flex items-center gap-2 order-1 md:order-2">
            <BookmarkButton 
              postId={post.id.toString()}
              title={post.title.rendered}
              url={`/blog/${params.slug}`}
              variant="pill"
              size="medium"
            />
            <PrintButton variant="pill" size="medium" />
          </div>
        </div>

        {/* 文章内容 */}
        <div data-article-content>
          <BlogDetail post={post} />
        </div>

        {/* 分享按钮 */}
        <div className="mt-12 pt-8 border-t border-cyber-cyan/20 no-print">
          <h3 className="text-lg font-bold text-cyber-cyan mb-4">分享这篇文章</h3>
          <ShareButtons 
            title={post.title.rendered}
            url={`/blog/${params.slug}`}
            description={post.excerpt?.rendered.replace(/<[^>]*>/g, '')}
            variant="pill"
            size="medium"
            showLabels={true}
          />
        </div>

        {/* 相关文章 */}
        {/* <RelatedPosts postId={post.id} /> */}
      </div>

      {/* 浮动分享按钮（侧边） */}
      <div className="no-print">
        {/* <FloatingShareButtons 
          title={post.title.rendered}
          url={`/blog/${params.slug}`}
          position="left"
          bottomOffset={120}
        /> */}
      </div>
    </article>
  );
}

/**
 * 生成静态参数
 */
export async function generateStaticParams() {
  const wpClient = new WordPressClient();
  const posts = await wpClient.getPosts({ perPage: 100 });

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

/**
 * 生成元数据
 */
export async function generateMetadata({ params }: PageProps) {
  const wpClient = new WordPressClient();
  const post = await wpClient.getPost(params.slug);

  if (!post) {
    return {};
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cyberpress.dev';
  const url = `${baseUrl}/blog/${params.slug}`;
  const excerpt = post.excerpt?.rendered.replace(/<[^>]*>/g, '') || '';

  return {
    title: post.title.rendered,
    description: excerpt.substring(0, 160),
    openGraph: {
      title: post.title.rendered,
      description: excerpt,
      url,
      siteName: 'CyberPress Platform',
      images: post.yoast_head_json?.og_image || [],
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: [post.yoast_head_json?.author || 'CyberPress'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title.rendered,
      description: excerpt,
      images: post.yoast_head_json?.og_image || [],
    },
    alternates: {
      canonical: url,
    },
  };
}
