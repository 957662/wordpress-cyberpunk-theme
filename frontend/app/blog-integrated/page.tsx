import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { wpClient } from '@/lib/wordpress-client';
import { BlogDetail } from '@/components/blog/BlogDetail';
import { CommentSystem } from '@/components/comment/comment-system-enhanced';
import { ReadingProgressEnhanced } from '@/components/reading/reading-progress-enhanced';
import { FeaturedPosts } from '@/components/blog/FeaturedPosts';
import { RecentPosts } from '@/components/blog/RecentPosts';
import { RelatedPosts } from '@/components/blog/RelatedPosts';
import { TagList } from '@/components/blog/TagList';
import { AuthorCard } from '@/components/blog/AuthorCard';

interface BlogPageProps {
  params: {
    slug: string;
  };
}

// 生成静态参数
export async function generateStaticParams() {
  try {
    const posts = await wpClient.getPosts({ per_page: 100 });

    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch {
    return [];
  }
}

// 生成元数据
export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  try {
    const post = await wpClient.getPostBySlug(params.slug);

    if (!post) {
      return {
        title: '文章未找到',
      };
    }

    return {
      title: post.title.rendered,
      description: post.excerpt.rendered.replace(/<[^>]*>/g, ''),
      openGraph: {
        title: post.title.rendered,
        description: post.excerpt.rendered.replace(/<[^>]*>/g, ''),
        type: 'article',
        publishedTime: post.date,
        modifiedTime: post.modified,
        authors: [post.author.toString()],
      },
    };
  } catch {
    return {
      title: '加载失败',
    };
  }
}

// 页面组件
export default async function BlogPage({ params }: BlogPageProps) {
  let post;
  let relatedPosts: any[] = [];
  let recentPosts: any[] = [];
  let featuredPosts: any[] = [];
  let categories: any[] = [];
  let tags: any[] = [];

  try {
    // 获取文章详情（包含嵌入数据）
    const posts = await wpClient.getPostsWithEmbedded({
      slug: [params.slug],
      per_page: 1,
    });

    post = posts[0];

    if (!post) {
      notFound();
    }

    // 并行获取相关数据
    const [
      relatedData,
      recentData,
      featuredData,
      categoriesData,
      tagsData,
    ] = await Promise.all([
      // 相关文章（相同分类）
      post.categories?.length
        ? wpClient.getPosts({
            categories: post.categories,
            exclude: [post.id],
            per_page: 4,
          })
        : Promise.resolve([]),
      // 最新文章
      wpClient.getLatestPosts(5),
      // 特色文章
      wpClient.getStickyPosts({ per_page: 3 }),
      // 分类
      wpClient.getCategories({ per_page: 20 }),
      // 标签
      wpClient.getTags({ per_page: 30 }),
    ]);

    relatedPosts = relatedData;
    recentPosts = recentData;
    featuredPosts = featuredData;
    categories = categoriesData;
    tags = tagsData;
  } catch (error) {
    console.error('Failed to load blog post:', error);
    notFound();
  }

  // 提取嵌入数据
  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
  const author = post._embedded?.author?.[0];
  const terms = post._embedded?.['wp:term'] || [];
  const postCategories = terms[0] || [];
  const postTags = terms[1] || [];

  // 特色图片 URL
  const featuredImageUrl =
    featuredMedia?.source_url ||
    featuredMedia?.media_details?.sizes?.large?.source_url ||
    featuredMedia?.media_details?.sizes?.medium?.source_url ||
    featuredMedia?.media_details?.sizes?.thumbnail?.source_url ||
    '/images/placeholder.jpg';

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* 文章主体 */}
      <article className="relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-cyber-cyan/5 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyber-purple/20 via-transparent to-transparent" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* 文章头部 */}
          <header className="mb-12">
            {/* 面包屑 */}
            <nav className="mb-6 text-sm">
              <ol className="flex items-center gap-2 text-gray-400">
                <li>
                  <a href="/" className="hover:text-cyber-cyan transition-colors">
                    首页
                  </a>
                </li>
                <li>/</li>
                <li>
                  <a href="/blog" className="hover:text-cyber-cyan transition-colors">
                    博客
                  </a>
                </li>
                <li>/</li>
                <li className="text-cyber-cyan">{post.title.rendered}</li>
              </ol>
            </nav>

            {/* 标题 */}
            <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink bg-clip-text text-transparent">
                {post.title.rendered}
              </span>
            </h1>

            {/* 元信息 */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
              {/* 作者 */}
              {author && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-purple flex items-center justify-center text-white font-bold text-xs">
                    {author.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-white">{author.name}</span>
                </div>
              )}

              {/* 日期 */}
              <div className="flex items-center gap-1">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>

              {/* 分类 */}
              {postCategories.length > 0 && (
                <div className="flex items-center gap-2">
                  {postCategories.map((cat: any) => (
                    <a
                      key={cat.id}
                      href={`/blog?category=${cat.slug}`}
                      className="px-2 py-1 rounded bg-cyber-cyan/10 text-cyber-cyan hover:bg-cyber-cyan/20 transition-colors"
                    >
                      {cat.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* 特色图片 */}
            {featuredMedia && (
              <div className="mt-8 overflow-hidden rounded-2xl border border-cyber-cyan/20">
                <img
                  src={featuredImageUrl}
                  alt={post.title.rendered}
                  className="w-full h-auto"
                  loading="eager"
                />
              </div>
            )}

            {/* 标签 */}
            {postTags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {postTags.map((tag: any) => (
                  <a
                    key={tag.id}
                    href={`/blog?tag=${tag.slug}`}
                    className="px-3 py-1 rounded-full bg-cyber-muted/50 text-gray-300 text-sm hover:bg-cyber-cyan/10 hover:text-cyber-cyan transition-colors"
                  >
                    #{tag.name}
                  </a>
                ))}
              </div>
            )}
          </header>

          {/* 文章内容 */}
          <div className="relative">
            <BlogDetail post={post} />
          </div>

          {/* 文章底部 */}
          <footer className="mt-12 pt-8 border-t border-cyber-cyan/20">
            {/* 作者卡片 */}
            {author && (
              <AuthorCard
                author={{
                  id: author.id,
                  name: author.name,
                  avatar: author.avatar_urls?.['96'],
                  bio: author.description,
                  url: author.link,
                }}
                className="mb-8"
              />
            )}

            {/* 分享和收藏 */}
            <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-cyber-muted/30 border border-cyber-cyan/10">
              <div className="text-sm text-gray-400">
                感谢阅读！如果觉得有帮助，欢迎分享给更多人。
              </div>
              <div className="flex gap-2">
                {/* 分享按钮组件可以放在这里 */}
                <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white text-sm hover:shadow-lg hover:shadow-cyber-cyan/20 transition-all">
                  分享文章
                </button>
              </div>
            </div>
          </footer>
        </div>
      </article>

      {/* 侧边栏区域 */}
      <aside className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 主内容区域 */}
          <div className="md:col-span-2 space-y-8">
            {/* 相关文章 */}
            {relatedPosts.length > 0 && (
              <RelatedPosts posts={relatedPosts} currentPostId={post.id} />
            )}

            {/* 评论区 */}
            <section className="scroll-mt-20" id="comments">
              <CommentSystem
                postId={post.id.toString()}
                enableReplies={true}
                enableLikes={true}
                enableSorting={true}
              />
            </section>
          </div>

          {/* 侧边栏 */}
          <div className="space-y-6">
            {/* 特色文章 */}
            {featuredPosts.length > 0 && (
              <FeaturedPosts posts={featuredPosts} />
            )}

            {/* 最新文章 */}
            {recentPosts.length > 0 && (
              <RecentPosts posts={recentPosts} />
            )}

            {/* 分类列表 */}
            {categories.length > 0 && (
              <div className="p-4 rounded-xl bg-cyber-muted/30 border border-cyber-cyan/10">
                <h3 className="mb-4 text-lg font-bold text-white">分类</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <a
                      key={cat.id}
                      href={`/blog?category=${cat.slug}`}
                      className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-cyber-muted/50 transition-colors group"
                    >
                      <span className="text-gray-300 group-hover:text-cyber-cyan transition-colors">
                        {cat.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {cat.count}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* 标签云 */}
            {tags.length > 0 && (
              <TagList tags={tags} />
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}

// 加载状态
export function Loading() {
  return (
    <div className="min-h-screen bg-cyber-dark flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 border-4 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400">加载中...</p>
      </div>
    </div>
  );
}
