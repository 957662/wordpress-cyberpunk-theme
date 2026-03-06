/**
 * WordPress 集成示例页面
 * 展示如何使用 WordPress API 获取和显示数据
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePosts, useCategories, useTags, usePostBySlug } from '@/lib/wordpress';
import { BlogList, BlogGrid, BlogHero } from '@/components/blog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Grid, List, BookOpen, FolderOpen, Tag as TagIcon, Loader2 } from 'lucide-react';

export default function WordPressIntegrationPage() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [selectedTag, setSelectedTag] = useState<number | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // 获取分类列表
  const { data: categories, isLoading: categoriesLoading } = useCategories({
    perPage: 100,
    hideEmpty: true,
  });

  // 获取标签列表
  const { data: tags, isLoading: tagsLoading } = useTags({
    perPage: 100,
    hideEmpty: true,
  });

  // 获取文章列表
  const { data: posts, isLoading: postsLoading, error: postsError } = usePosts({
    page: currentPage,
    perPage: viewMode === 'grid' ? 9 : 10,
    category: selectedCategory,
    tag: selectedTag,
    search: searchQuery || undefined,
    orderBy: 'date',
    order: 'desc',
  });

  // 示例：根据 slug 获取单篇文章（硬编码示例）
  const { data: featuredPost } = usePostBySlug('hello-world');

  const handleCategoryChange = (categoryId?: number) => {
    setSelectedCategory(categoryId);
    setSelectedTag(undefined);
    setCurrentPage(1);
  };

  const handleTagChange = (tagId?: number) => {
    setSelectedTag(tagId);
    setSelectedCategory(undefined);
    setCurrentPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                WordPress 集成示例
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                展示如何使用 WordPress REST API
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('grid')}>
                <Grid className="w-4 h-4 mr-1" />
                网格
              </Button>
              <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('list')}>
                <List className="w-4 h-4 mr-1" />
                列表
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="posts">文章列表</TabsTrigger>
            <TabsTrigger value="categories">分类</TabsTrigger>
            <TabsTrigger value="tags">标签</TabsTrigger>
            <TabsTrigger value="code">代码示例</TabsTrigger>
          </TabsList>

          {/* 文章列表标签页 */}
          <TabsContent value="posts" className="space-y-6">
            {/* 搜索框 */}
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSearch} className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      type="search"
                      placeholder="搜索文章..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button type="submit">搜索</Button>
                  {searchQuery && (
                    <Button type="button" variant="outline" onClick={() => setSearchQuery('')}>
                      清除
                    </Button>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* 特色文章（如果有） */}
            {featuredPost && !selectedCategory && !selectedTag && !searchQuery && (
              <div className="mb-8">
                <BlogHero post={{
                  id: String(featuredPost.id),
                  title: featuredPost.title?.rendered || '',
                  slug: featuredPost.slug,
                  excerpt: featuredPost.excerpt?.rendered || '',
                  content: featuredPost.content?.rendered || '',
                  featuredImage: featuredPost._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
                  category: featuredPost._embedded?.['wp:term']?.[0]?.[0]?.name || null,
                  author: featuredPost._embedded?.author?.[0]?.name || 'Unknown',
                  date: featuredPost.date,
                  readingTime: Math.ceil((featuredPost.content?.rendered?.length || 0) / 1000),
                }} />
              </div>
            )}

            {/* 分类和标签筛选 */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FolderOpen size={18} />
                    分类筛选
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {categoriesLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant={selectedCategory === undefined ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => handleCategoryChange(undefined)}
                      >
                        全部
                      </Badge>
                      {categories?.map((category) => (
                        <Badge
                          key={category.id}
                          variant={selectedCategory === category.id ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => handleCategoryChange(category.id)}
                        >
                          {category.name} ({category.count})
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TagIcon size={18} />
                    标签筛选
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {tagsLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant={selectedTag === undefined ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => handleTagChange(undefined)}
                      >
                        全部
                      </Badge>
                      {tags?.slice(0, 20).map((tag) => (
                        <Badge
                          key={tag.id}
                          variant={selectedTag === tag.id ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => handleTagChange(tag.id)}
                        >
                          #{tag.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* 文章列表/网格 */}
            {postsLoading ? (
              <Card>
                <CardContent className="py-12">
                  <div className="flex flex-col items-center justify-center">
                    <Loader2 className="animate-spin text-gray-400 w-8 h-8 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">加载中...</p>
                  </div>
                </CardContent>
              </Card>
            ) : postsError ? (
              <Card>
                <CardContent className="py-12">
                  <div className="flex flex-col items-center justify-center text-red-600 dark:text-red-400">
                    <BookOpen className="w-8 h-8 mb-4" />
                    <p className="font-medium">加载失败</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      请检查 WordPress API 配置
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : posts && posts.length > 0 ? (
              viewMode === 'grid' ? (
                <BlogGrid
                  posts={posts.map((post) => ({
                    id: String(post.id),
                    title: post.title?.rendered || '',
                    slug: post.slug,
                    excerpt: post.excerpt?.rendered || '',
                    content: post.content?.rendered || '',
                    featuredImage: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
                    category: post._embedded?.['wp:term']?.[0]?.[0]?.name || null,
                    author: post._embedded?.author?.[0]?.name || 'Unknown',
                    date: post.date,
                    readingTime: Math.ceil((post.content?.rendered?.length || 0) / 1000),
                  }))}
                  currentPage={currentPage}
                  totalPages={Number((posts as any).totalPages) || 1}
                  onPageChange={setCurrentPage}
                />
              ) : (
                <BlogList
                  posts={posts.map((post) => ({
                    id: String(post.id),
                    title: post.title?.rendered || '',
                    slug: post.slug,
                    excerpt: post.excerpt?.rendered || '',
                    content: post.content?.rendered || '',
                    featuredImage: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
                    category: post._embedded?.['wp:term']?.[0]?.[0]?.name || null,
                    author: post._embedded?.author?.[0]?.name || 'Unknown',
                    date: post.date,
                    readingTime: Math.ceil((post.content?.rendered?.length || 0) / 1000),
                  }))}
                  currentPage={currentPage}
                  totalPages={Number((posts as any).totalPages) || 1}
                  onPageChange={setCurrentPage}
                />
              )
            ) : (
              <Card>
                <CardContent className="py-12">
                  <div className="flex flex-col items-center justify-center">
                    <BookOpen className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">暂无文章</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* 分类标签页 */}
          <TabsContent value="categories" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>所有分类</CardTitle>
                <CardDescription>WordPress 网站中的所有文章分类</CardDescription>
              </CardHeader>
              <CardContent>
                {categoriesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="animate-spin text-gray-400" />
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories?.map((category) => (
                      <Link
                        key={category.id}
                        href={`/blog?category=${category.id}`}
                        className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                      >
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {category.name}
                        </h3>
                        {category.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                            {category.description}
                          </p>
                        )}
                        <Badge variant="secondary">{category.count} 篇文章</Badge>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 标签标签页 */}
          <TabsContent value="tags" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>所有标签</CardTitle>
                <CardDescription>WordPress 网站中的所有文章标签</CardDescription>
              </CardHeader>
              <CardContent>
                {tagsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="animate-spin text-gray-400" />
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {tags?.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="outline"
                        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        #{tag.name} ({tag.count})
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 代码示例标签页 */}
          <TabsContent value="code" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>使用示例</CardTitle>
                <CardDescription>如何在组件中使用 WordPress API</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 获取文章列表 */}
                <div>
                  <h3 className="font-semibold mb-2">1. 获取文章列表</h3>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import { usePosts } from '@/lib/wordpress';

function MyComponent() {
  const { data: posts, isLoading, error } = usePosts({
    page: 1,
    perPage: 10,
    category: 1,  // 可选：分类 ID
    tag: 2,       // 可选：标签 ID
    search: '',   // 可选：搜索关键词
  });

  if (isLoading) return <div>加载中...</div>;
  if (error) return <div>加载失败</div>;

  return (
    <div>
      {posts?.map(post => (
        <div key={post.id}>{post.title.rendered}</div>
      ))}
    </div>
  );
}`}
                  </pre>
                </div>

                {/* 获取单篇文章 */}
                <div>
                  <h3 className="font-semibold mb-2">2. 获取单篇文章</h3>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import { usePostBySlug } from '@/lib/wordpress';

function PostPage({ slug }) {
  const { data: post, isLoading } = usePostBySlug(slug);

  if (isLoading) return <div>加载中...</div>;

  return (
    <article>
      <h1>{post?.title.rendered}</h1>
      <div dangerouslySetInnerHTML={{
        __html: post?.content.rendered
      }} />
    </article>
  );
}`}
                  </pre>
                </div>

                {/* 使用适配器 */}
                <div>
                  <h3 className="font-semibold mb-2">3. 使用数据适配器</h3>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import { adaptWPPost } from '@/lib/wordpress';

function MyComponent() {
  const { data: wpPost } = usePost(1);

  if (!wpPost) return null;

  // 转换为应用内部格式
  const post = adaptWPPost(wpPost);

  return (
    <BlogCard post={post} />
  );
}`}
                  </pre>
                </div>

                {/* 环境变量配置 */}
                <div>
                  <h3 className="font-semibold mb-2">4. 环境变量配置</h3>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`# .env.local
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-site.com/wp-json
NEXT_PUBLIC_WORDPRESS_API_KEY=your-api-key-if-needed
`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>WordPress 集成示例页面 - 使用 React Query 和 WordPress REST API</p>
        </div>
      </footer>
    </div>
  );
}
