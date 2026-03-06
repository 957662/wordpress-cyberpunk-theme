'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Filter,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';
import { wpClient, WPPost } from '@/lib/wordpress/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function PostsManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'publish' | 'draft' | 'pending'>('all');
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  // 获取文章列表
  const { data: postsData, isLoading } = useQuery({
    queryKey: ['admin', 'posts', page, statusFilter],
    queryFn: async () => {
      return wpClient.getPosts({
        page,
        perPage: 20,
        _embed: true,
      });
    },
  });

  // 删除文章
  const deleteMutation = useMutation({
    mutationFn: async (postId: number) => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_WP_API_URL}/wp/v2/posts/${postId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error('Failed to delete post');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'posts'] });
    },
  });

  const handleDelete = async (postId: number) => {
    if (confirm('确定要删除这篇文章吗？')) {
      try {
        await deleteMutation.mutateAsync(postId);
      } catch (error) {
        alert('删除失败：' + (error as Error).message);
      }
    }
  };

  const filteredPosts = postsData?.data.filter(post => {
    const title = post.title.rendered.toLowerCase();
    const matchesSearch = title.includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            文章管理
          </h1>
          <p className="text-gray-400">
            共 {postsData?.total || 0} 篇文章
          </p>
        </div>
        <Link href="/admin/posts/new">
          <Button className="bg-cyber-cyan text-cyber-dark hover:bg-cyber-cyan/80">
            <Plus className="w-4 h-4 mr-2" />
            新建文章
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card variant="glass" className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              type="search"
              placeholder="搜索文章标题..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            {(['all', 'publish', 'draft', 'pending'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  statusFilter === status
                    ? 'bg-cyber-cyan text-cyber-dark'
                    : 'bg-cyber-muted text-gray-400 hover:text-white'
                }`}
              >
                {status === 'all' ? '全部' :
                 status === 'publish' ? '已发布' :
                 status === 'draft' ? '草稿' : '待审核'}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Posts List */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-400">
          加载中...
        </div>
      ) : filteredPosts.length === 0 ? (
        <Card variant="glass" className="p-12 text-center">
          <p className="text-gray-400">暂无文章</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                variant="glass"
                className="p-4 hover:border-cyber-cyan/30 transition-colors group"
              >
                <div className="flex items-start gap-4">
                  {/* Status Indicator */}
                  <div className={`w-3 h-3 rounded-full mt-2 ${
                    post.status === 'publish' ? 'bg-cyber-green' :
                    post.status === 'draft' ? 'bg-cyber-yellow' :
                    'bg-cyber-pink'
                  }`} />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-semibold text-white mb-1 group-hover:text-cyber-cyan transition-colors"
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.date).toLocaleDateString('zh-CN')}
                      </span>
                      <span>
                        {post.status === 'publish' ? '已发布' :
                         post.status === 'draft' ? '草稿' : '待审核'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link href={`/blog/${post.slug}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href={`/admin/posts/${post.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {postsData && postsData.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            上一页
          </Button>
          <span className="px-4 py-2 text-gray-400">
            第 {page} / {postsData.totalPages} 页
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.min(postsData.totalPages, p + 1))}
            disabled={page === postsData.totalPages}
          >
            下一页
          </Button>
        </div>
      )}
    </div>
  );
}
