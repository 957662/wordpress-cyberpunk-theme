/**
 * WordPress 高级集成示例
 * 展示评论系统、搜索、缓存等高级功能
 */

'use client';

import React, { useState } from 'react';
import { usePostBySlug, usePostComments, usePostComment, useSearch } from '@/lib/wordpress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Send, User, Mail, MessageSquare, Clock, Loader2, AlertCircle } from 'lucide-react';

export default function WordPressAdvancedIntegrationPage() {
  const [commentForm, setCommentForm] = useState({
    author: '',
    email: '',
    content: '',
  });
  const [searchQuery, setSearchQuery] = useState('');

  // 获取示例文章
  const { data: post, isLoading: postLoading } = usePostBySlug('hello-world');

  // 获取文章评论
  const { data: comments, isLoading: commentsLoading } = usePostComments(post?.id || 0);

  // 提交评论
  const commentMutation = usePostComment();

  // 搜索
  const { data: searchResults, isLoading: searchLoading } = useSearch(searchQuery, {
    enabled: searchQuery.length >= 2,
  });

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!post) return;

    try {
      await commentMutation.mutateAsync({
        postId: post.id,
        content: commentForm.content,
        author: commentForm.author,
        authorEmail: commentForm.email,
      });

      // 清空表单
      setCommentForm({ author: '', email: '', content: '' });
      alert('评论提交成功！');
    } catch (error) {
      alert('评论提交失败，请重试。');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            WordPress 高级集成示例
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            评论系统、搜索、缓存等高级功能演示
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="comments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="comments">评论系统</TabsTrigger>
            <TabsTrigger value="search">全文搜索</TabsTrigger>
            <TabsTrigger value="cache">缓存策略</TabsTrigger>
          </TabsList>

          {/* 评论系统 */}
          <TabsContent value="comments" className="space-y-6">
            {/* 文章内容 */}
            {postLoading ? (
              <Card>
                <CardContent className="py-12">
                  <div className="flex items-center justify-center">
                    <Loader2 className="animate-spin text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ) : post ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">{post.title?.rendered}</CardTitle>
                  <CardDescription className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <User size={14} />
                      {post._embedded?.author?.[0]?.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {formatDate(post.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare size={14} />
                      {comments?.length || 0} 条评论
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.content?.rendered || '' }}
                  />
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-gray-600 dark:text-gray-400">
                    文章未找到
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 评论列表 */}
            {post && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare size={20} />
                    评论 ({comments?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {commentsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="animate-spin text-gray-400" />
                    </div>
                  ) : comments && comments.length > 0 ? (
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <Avatar>
                            <AvatarFallback>
                              {comment.author_name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{comment.author_name}</span>
                              <span className="text-xs text-gray-500">
                                {formatDate(comment.date)}
                              </span>
                            </div>
                            <div
                              className="text-gray-700 dark:text-gray-300"
                              dangerouslySetInnerHTML={{ __html: comment.content?.rendered || '' }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-600 dark:text-gray-400 py-8">
                      暂无评论，快来发表第一条评论吧！
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* 提交评论表单 */}
            {post && (
              <Card>
                <CardHeader>
                  <CardTitle>发表评论</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitComment} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">姓名</label>
                        <Input
                          value={commentForm.author}
                          onChange={(e) => setCommentForm({ ...commentForm, author: e.target.value })}
                          placeholder="请输入您的姓名"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">邮箱</label>
                        <Input
                          type="email"
                          value={commentForm.email}
                          onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
                          placeholder="请输入您的邮箱"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">评论内容</label>
                      <Textarea
                        value={commentForm.content}
                        onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                        placeholder="请输入您的评论..."
                        rows={4}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={commentMutation.isPending}
                      className="w-full md:w-auto"
                    >
                      {commentMutation.isPending ? (
                        <>
                          <Loader2 className="animate-spin mr-2" size={16} />
                          提交中...
                        </>
                      ) : (
                        <>
                          <Send size={16} className="mr-2" />
                          提交评论
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* 全文搜索 */}
          <TabsContent value="search" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>全文搜索</CardTitle>
                <CardDescription>
                  搜索 WordPress 网站中的所有内容
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="输入至少2个字符开始搜索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {searchLoading && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="animate-spin text-gray-400" />
                  </div>
                )}

                {searchResults && searchResults.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      找到 {searchResults.length} 个结果
                    </p>
                    {searchResults.map((result: any) => (
                      <Card key={result.id} className="p-4">
                        <h3 className="font-semibold mb-1">{result.title?.rendered}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {result.excerpt?.rendered?.replace(/<[^>]*>/g, '').slice(0, 150)}...
                        </p>
                        <Badge variant="outline" className="mt-2">
                          {result.type}
                        </Badge>
                      </Card>
                    ))}
                  </div>
                )}

                {searchQuery.length >= 2 && !searchLoading && (!searchResults || searchResults.length === 0) && (
                  <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                    <p>未找到相关内容</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 缓存策略 */}
          <TabsContent value="cache" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>React Query 缓存策略</CardTitle>
                <CardDescription>
                  自动缓存和重新验证数据，提升用户体验
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">缓存配置</h3>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`// 文章列表：缓存 5 分钟
staleTime: 5 * 60 * 1000

// 单篇文章：缓存 10 分钟
staleTime: 10 * 60 * 1000

// 分类/标签：缓存 15 分钟
staleTime: 15 * 60 * 1000

// 媒体文件：缓存 30 分钟
staleTime: 30 * 60 * 1000`}
                  </pre>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">自动重新验证</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>窗口重新聚焦时重新获取数据</li>
                    <li>网络重新连接时重新获取数据</li>
                    <li>数据过期时自动后台刷新</li>
                    <li>变更操作后自动使缓存失效</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">手动控制</h3>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`// 使缓存失效
const { invalidatePosts } = useInvalidatePosts();

// 刷新文章列表
invalidatePosts();

// 预取数据
const { prefetchPost } = usePrefetchPost();

// 预取文章详情
prefetchPost(123);`}
                  </pre>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">优点</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>减少 API 请求次数</li>
                    <li>提升页面加载速度</li>
                    <li>更好的用户体验</li>
                    <li>自动处理错误和重试</li>
                    <li>支持乐观更新</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
