'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { CyberCard } from '@/components/ui/CyberCard';
import { Alert } from '@/components/ui/Alert';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  MoreVertical
} from 'lucide-react';
import Link from 'next/link';

type PostStatus = 'published' | 'draft' | 'scheduled' | 'archived';

type Post = {
  id: string;
  title: string;
  excerpt: string;
  status: PostStatus;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  category: string;
  tags: string[];
  views: number;
  comments: number;
  createdAt: string;
  publishedAt?: string;
};

export default function AdminPostsPage() {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PostStatus | 'all'>('all');
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // TODO: 从 API 获取文章数据
  // useEffect(() => {
  //   fetchPosts();
  // }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeletePost = async (id: string) => {
    if (!confirm('确定要删除这篇文章吗？')) return;

    try {
      const response = await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('删除失败');
      setPosts(posts.filter((p) => p.id !== id));
      setMessage({ type: 'success', text: '文章已删除' });
    } catch (err) {
      setMessage({ type: 'error', text: '删除失败' });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPosts.size === 0) return;
    if (!confirm(`确定要删除选中的 ${selectedPosts.size} 篇文章吗？`)) return;

    try {
      await fetch('/api/admin/posts/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedPosts) }),
      });
      setPosts(posts.filter((p) => !selectedPosts.has(p.id)));
      setSelectedPosts(new Set());
      setMessage({ type: 'success', text: '批量删除成功' });
    } catch (err) {
      setMessage({ type: 'error', text: '批量删除失败' });
    }
  };

  const getStatusColor = (status: PostStatus) => {
    switch (status) {
      case 'published':
        return 'bg-green-500/20 text-green-400';
      case 'draft':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'scheduled':
        return 'bg-blue-500/20 text-blue-400';
      case 'archived':
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusLabel = (status: PostStatus) => {
    switch (status) {
      case 'published':
        return '已发布';
      case 'draft':
        return '草稿';
      case 'scheduled':
        return '定时';
      case 'archived':
        return '归档';
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyber-dark">
        <p className="text-gray-400">权限不足</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-dark py-8">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* 页面标题 */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                <FileText className="w-8 h-8 text-cyber-cyan" />
                文章管理
              </h1>
              <p className="text-gray-400 mt-1">管理所有文章内容</p>
            </div>
            <Link href="/admin/posts/new">
              <Button className="bg-gradient-to-r from-cyber-cyan to-cyber-purple flex items-center gap-2">
                <Plus className="w-4 h-4" />
                新建文章
              </Button>
            </Link>
          </div>

          {/* 消息提示 */}
          {message && (
            <Alert
              type={message.type}
              message={message.text}
              onClose={() => setMessage(null)}
            />
          )}

          {/* 统计卡片 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: '全部', value: posts.length, color: 'cyber-cyan' },
              { label: '已发布', value: posts.filter((p) => p.status === 'published').length, color: 'green-500' },
              { label: '草稿', value: posts.filter((p) => p.status === 'draft').length, color: 'yellow-500' },
              { label: '定时', value: posts.filter((p) => p.status === 'scheduled').length, color: 'blue-500' },
            ].map((stat) => (
              <CyberCard key={stat.label} className="p-4">
                <p className={`text-2xl font-bold text-${stat.color}`}>{stat.value}</p>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </CyberCard>
            ))}
          </div>

          {/* 搜索和过滤 */}
          <CyberCard className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索文章..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyber-cyan"
                />
              </div>
              <div className="flex gap-2">
                {(['all', 'published', 'draft', 'scheduled'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                      statusFilter === status
                        ? 'bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white'
                        : 'bg-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    <Filter className="w-4 h-4 inline mr-1" />
                    {status === 'all' ? '全部' : getStatusLabel(status as PostStatus)}
                  </button>
                ))}
              </div>
            </div>
          </CyberCard>

          {/* 批量操作 */}
          {selectedPosts.size > 0 && (
            <CyberCard className="p-4 border-cyber-cyan">
              <div className="flex items-center justify-between">
                <span className="text-white">已选择 {selectedPosts.size} 篇文章</span>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setSelectedPosts(new Set())}
                    variant="secondary"
                  >
                    取消选择
                  </Button>
                  <Button
                    onClick={handleBulkDelete}
                    variant="danger"
                    className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    批量删除
                  </Button>
                </div>
              </div>
            </CyberCard>
          )}

          {/* 文章列表 */}
          <CyberCard className="overflow-hidden">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block w-12 h-12 border-4 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">暂无文章</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedPosts.size === filteredPosts.length}
                          onChange={(e) =>
                            setSelectedPosts(
                              e.target.checked
                                ? new Set(filteredPosts.map((p) => p.id))
                                : new Set()
                            )
                          }
                          className="w-4 h-4 rounded border-gray-600 bg-gray-700"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-gray-400 font-medium">标题</th>
                      <th className="px-4 py-3 text-left text-gray-400 font-medium">状态</th>
                      <th className="px-4 py-3 text-left text-gray-400 font-medium">分类</th>
                      <th className="px-4 py-3 text-left text-gray-400 font-medium">作者</th>
                      <th className="px-4 py-3 text-left text-gray-400 font-medium">浏览</th>
                      <th className="px-4 py-3 text-left text-gray-400 font-medium">评论</th>
                      <th className="px-4 py-3 text-left text-gray-400 font-medium">发布时间</th>
                      <th className="px-4 py-3 text-left text-gray-400 font-medium">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {filteredPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-gray-800/50 transition-colors">
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            checked={selectedPosts.has(post.id)}
                            onChange={(e) => {
                              const newSelected = new Set(selectedPosts);
                              if (e.target.checked) {
                                newSelected.add(post.id);
                              } else {
                                newSelected.delete(post.id);
                              }
                              setSelectedPosts(newSelected);
                            }}
                            className="w-4 h-4 rounded border-gray-600 bg-gray-700"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-white font-medium">{post.title}</div>
                          <div className="text-gray-400 text-sm truncate max-w-xs">
                            {post.excerpt}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 rounded text-xs ${getStatusColor(post.status)}`}>
                            {getStatusLabel(post.status)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-gray-400">{post.category}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            {post.author.avatar && (
                              <img
                                src={post.author.avatar}
                                alt={post.author.name}
                                className="w-6 h-6 rounded-full"
                              />
                            )}
                            <span className="text-gray-400">{post.author.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-400">{post.views}</td>
                        <td className="px-4 py-4 text-gray-400">{post.comments}</td>
                        <td className="px-4 py-4 text-gray-400 text-sm">
                          {post.publishedAt
                            ? new Date(post.publishedAt).toLocaleDateString()
                            : new Date(post.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <Link href={`/blog/${post.id}`}>
                              <Button variant="ghost" size="sm" className="p-2">
                                <Eye className="w-4 h-4 text-gray-400 hover:text-cyber-cyan" />
                              </Button>
                            </Link>
                            <Link href={`/admin/posts/${post.id}/edit`}>
                              <Button variant="ghost" size="sm" className="p-2">
                                <Edit className="w-4 h-4 text-gray-400 hover:text-cyber-cyan" />
                              </Button>
                            </Link>
                            <Button
                              onClick={() => handleDeletePost(post.id)}
                              variant="ghost"
                              size="sm"
                              className="p-2"
                            >
                              <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CyberCard>
        </motion.div>
      </div>
    </div>
  );
}
