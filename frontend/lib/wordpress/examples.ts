/**
 * WordPress 集成使用示例
 * 展示如何使用 WordPress API 集成功能
 */

'use client';

import { useState } from 'react';
import {
  useWordPressPosts,
  useWordPressPostBySlug,
  useWordPressCategories,
  useWordPressTags,
  useWordPressSearch,
} from './wordpress-integration';
import { BlogList, BlogGrid } from '@/components/blog';
import type { BlogCardData } from '@/types/blog';

// ============================================================================
// 示例 1: 基础文章列表
// ============================================================================

export function BasicPostListExample() {
  const { data: posts, loading, error } = useWordPressPosts({
    per_page: 10,
    orderby: 'date',
    order: 'desc',
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <BlogList posts={posts.map((p: any) => ({ ...p, title: p.title || '' }))} />;
}

// ============================================================================
// 示例 2: 带分页的文章列表
// ============================================================================

export function PaginatedPostListExample() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: posts, loading, error } = useWordPressPosts({
    page: currentPage,
    per_page: 12,
    _embed: true,
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <BlogGrid
        posts={posts.map((p: any) => ({ ...p, title: p.title || '' }))}
        columns={3}
      />
      {/* 分页组件 */}
      <div className="flex justify-center gap-2 mt-8">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          上一页
        </button>
        <span>Page {currentPage}</span>
        <button onClick={() => setCurrentPage(p => p + 1)}>
          下一页
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// 示例 3: 搜索功能
// ============================================================================

export function SearchExample() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: results, loading } = useWordPressSearch(searchQuery, 1, 10);

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search articles..."
        className="w-full px-4 py-2 border rounded"
      />
      {loading && <div>Searching...</div>}
      {results && results.length > 0 && (
        <BlogList posts={results.map((p: any) => ({ ...p, title: p.title || '' }))} />
      )}
    </div>
  );
}

// ============================================================================
// 示例 4: 分类和标签筛选
// ============================================================================

export function FilteredPostsExample() {
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [selectedTag, setSelectedTag] = useState<number | undefined>();

  const { data: categories } = useWordPressCategories();
  const { data: tags } = useWordPressTags();
  const { data: posts, loading } = useWordPressPosts({
    categories: selectedCategory ? [selectedCategory] : undefined,
    tags: selectedTag ? [selectedTag] : undefined,
    _embed: true,
  });

  return (
    <div>
      {/* 分类筛选 */}
      <div className="mb-4">
        <select
          value={selectedCategory || ''}
          onChange={(e) => setSelectedCategory(e.target.value ? parseInt(e.target.value) : undefined)}
          className="px-4 py-2 border rounded"
        >
          <option value="">All Categories</option>
          {categories?.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* 标签筛选 */}
      <div className="mb-4">
        <select
          value={selectedTag || ''}
          onChange={(e) => setSelectedTag(e.target.value ? parseInt(e.target.value) : undefined)}
          className="px-4 py-2 border rounded"
        >
          <option value="">All Tags</option>
          {tags?.map(tag => (
            <option key={tag.id} value={tag.id}>{tag.name}</option>
          ))}
        </select>
      </div>

      {/* 文章列表 */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <BlogList posts={posts.map((p: any) => ({ ...p, title: p.title || '' }))} />
      )}
    </div>
  );
}

// ============================================================================
// 示例 5: 文章详情页
// ============================================================================

export function PostDetailExample({ slug }: { slug: string }) {
  const { data: post, loading, error } = useWordPressPostBySlug(slug);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <article className="max-w-3xl mx-auto py-8">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
      )}

      <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
        {post.author && (
          <div>
            <span>By {post.author.name}</span>
          </div>
        )}
        {post.publishedAt && (
          <div>
            <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
          </div>
        )}
        {post.readingTime && (
          <div>
            <span>{post.readingTime} min read</span>
          </div>
        )}
      </div>

      {post.category && (
        <div className="mb-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            {post.category}
          </span>
        </div>
      )}

      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content || '' }}
      />

      {post.tags && post.tags.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

// ============================================================================
// 示例 6: 服务端渲染 (SSR)
// ============================================================================

// 在 page.tsx 中使用
/*
import { getServerPostBySlug, getServerPosts } from '@/lib/wordpress';

export default async function BlogPage() {
  const posts = await getServerPosts({ per_page: 10 });

  return <BlogGrid posts={posts} />;
}

export async function generateStaticParams() {
  const posts = await getServerPosts({ per_page: 100 });

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// [slug]/page.tsx
export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getServerPostBySlug(params.slug);

  if (!post) return notFound();

  return <PostDetail post={post} />;
}
*/

// ============================================================================
// 示例 7: 使用工具函数
// ============================================================================

import { WordPressUrlUtils, WordPressSEOUtils, WordPressContentUtils } from './utils';

export function UtilityExample(post: BlogCardData) {
  // 构建 URL
  const postUrl = WordPressUrlUtils.buildPostUrl('https://example.com', post.slug || '');

  // 生成 SEO 数据
  const openGraph = WordPressSEOUtils.generateOpenGraph(post, 'https://example.com');

  // 处理内容
  const excerpt = WordPressContentUtils.truncateExcerpt(post.content || '', 160);

  return (
    <div>
      <a href={postUrl}>
        <h2>{post.title}</h2>
      </a>
      <p>{excerpt}</p>
    </div>
  );
}

// ============================================================================
// 示例 8: 错误处理
// ============================================================================

export function ErrorHandlingExample() {
  const { data: posts, loading, error } = useWordPressPosts({
    per_page: 10,
  });

  if (loading) {
    return <div className="animate-pulse">Loading posts...</div>;
  }

  if (error) {
    // 自定义错误处理
    if (error.message.includes('fetch')) {
      return <div>Network error. Please check your connection.</div>;
    }
    if (error.message.includes('404')) {
      return <div>No posts found.</div>;
    }
    return <div>An error occurred: {error.message}</div>;
  }

  return <BlogList posts={posts.map((p: any) => ({ ...p, title: p.title || '' }))} />;
}

// ============================================================================
// 示例 9: 缓存管理
// ============================================================================

import { getWordPressClient } from './wordpress-integration';

export function CacheManagementExample() {
  const handleClearCache = () => {
    const client = getWordPressClient();
    client.clearCache();
    alert('Cache cleared!');
  };

  const handleRefetch = () => {
    window.location.reload();
  };

  return (
    <div className="flex gap-4">
      <button onClick={handleRefetch}>Refresh</button>
      <button onClick={handleClearCache}>Clear Cache</button>
    </div>
  );
}
