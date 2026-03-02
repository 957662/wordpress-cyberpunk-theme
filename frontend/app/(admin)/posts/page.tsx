'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  User,
  Tag,
  MoreVertical,
  Download,
  Upload,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { toast } from 'react-hot-toast';

interface Post {
  id: string;
  title: string;
  slug: string;
  status: 'publish' | 'draft' | 'pending';
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  category: string;
  tags: string[];
  date: string;
  modified: string;
  views: number;
  comments: number;
  featured: boolean;
  excerpt?: string;
}

interface PostsResponse {
  data: Post[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

const statusColors = {
  publish: 'bg-cyber-green/20 text-cyber-green',
  draft: 'bg-cyber-yellow/20 text-cyber-yellow',
  pending: 'bg-cyber-cyan/20 text-cyber-cyan',
};

const statusLabels = {
  publish: '已发布',
  draft: '草稿',
  pending: '待审核',
};

export default function PostsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const queryClient = useQueryClient();

  const { data: postsData, isLoading } = useQuery<PostsResponse>({
    queryKey: ['admin', 'posts', currentPage, selectedStatus, selectedCategory, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        perPage: '20',
        ...(selectedStatus !== 'all' && { status: selectedStatus }),
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(searchQuery && { search: searchQuery }),
      });

      const response = await apiClient.get(`/admin/posts?${params}`);
      return response.data;
    },
  });

  const { data: categories } = useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/categories');
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (postId: string) => {
      await apiClient.delete(`/admin/posts/${postId}`);
    },
    onSuccess: () => {
      toast.success('文章已删除');
      queryClient.invalidateQueries({ queryKey: ['admin', 'posts'] });
    },
    onError: () => {
      toast.error('删除失败');
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (postIds: string[]) => {
      await Promise.all(postIds.map(id => apiClient.delete(`/admin/posts/${id}`)));
    },
    onSuccess: () => {
      toast.success('批量删除成功');
      setSelectedPosts(new Set());
      queryClient.invalidateQueries({ queryKey: ['admin', 'posts'] });
    },
  });

  const handleDelete = (postId: string) => {
    if (confirm('确定要删除这篇文章吗？此操作不可撤销。')) {
      deleteMutation.mutate(postId);
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`确定要删除选中的 ${selectedPosts.size} 篇文章吗？`)) {
      bulkDeleteMutation.mutate(Array.from(selectedPosts));
    }
  };

  const togglePostSelection = (postId: string) => {
    const newSelected = new Set(selectedPosts);
    if (newSelected.has(postId)) {
      newSelected.delete(postId);
    } else {
      newSelected.add(postId);
    }
    setSelectedPosts(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedPosts.size === postsData?.data.length) {
      setSelectedPosts(new Set());
    } else {
      setSelectedPosts(new Set(postsData?.data.map(p => p.id) || []));
    }
  };

  return (
    <div className="min-h-screen bg-cyber-dark p-6">
      {/* 页面标题 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold text-glow-cyan text-cyber-cyan mb-2">
            文章管理
          </h1>
          <p className="text-gray-400">管理您的所有文章内容</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => window.location.href = '/admin/posts/import'}
            className="px-4 py-2 rounded-lg bg-cyber-muted text-gray-300 hover:bg-cyber-muted/80 transition-all flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            导入
          </button>

          <button
            onClick={() => window.location.href = '/admin/posts/export'}
            className="px-4 py-2 rounded-lg bg-cyber-muted text-gray-300 hover:bg-cyber-muted/80 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            导出
          </button>

          <a
            href="/admin/posts/new"
            className="px-6 py-2 rounded-lg bg-cyber-cyan text-cyber-dark font-medium hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            新建文章
          </a>
        </div>
      </motion.div>

      {/* 工具栏 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="cyber-card p-6 rounded-lg mb-6"
      >
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* 搜索 */}
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="搜索文章标题、内容..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-cyber-dark border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan outline-none transition-all"
            />
          </div>

          {/* 筛选 */}
          <div className="flex gap-3 items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 bg-cyber-dark border border-gray-700 rounded-lg text-white focus:border-cyber-cyan outline-none"
              >
                <option value="all">所有状态</option>
                <option value="publish">已发布</option>
                <option value="draft">草稿</option>
                <option value="pending">待审核</option>
              </select>
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-cyber-dark border border-gray-700 rounded-lg text-white focus:border-cyber-cyan outline-none"
            >
              <option value="all">所有分类</option>
              {categories?.map((cat: any) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* 视图切换 */}
            <div className="flex gap-2 bg-cyber-dark rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded transition-all ${
                  viewMode === 'table'
                    ? 'bg-cyber-cyan text-cyber-dark'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-all ${
                  viewMode === 'grid'
                    ? 'bg-cyber-cyan text-cyber-dark'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* 批量操作 */}
        {selectedPosts.size > 0 && (
          <div className="mt-4 flex items-center gap-4 p-3 bg-cyber-cyan/10 rounded-lg border border-cyber-cyan/30">
            <span className="text-sm text-cyber-cyan">
              已选择 {selectedPosts.size} 篇文章
            </span>
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 rounded bg-cyber-pink text-white hover:bg-cyber-pink/80 transition-all flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              批量删除
            </button>
            <button
              onClick={() => setSelectedPosts(new Set())}
              className="text-sm text-gray-400 hover:text-white transition-all"
            >
              取消选择
            </button>
          </div>
        )}
      </motion.div>

      {/* 文章列表 */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyber-cyan"></div>
        </div>
      ) : viewMode === 'table' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="cyber-card rounded-lg overflow-hidden"
        >
          <table className="w-full">
            <thead className="bg-cyber-muted/50">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedPosts.size === postsData?.data.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-600 text-cyber-cyan focus:ring-cyber-cyan"
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">标题</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">状态</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">分类</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">作者</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">浏览</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">评论</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">日期</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {postsData?.data.map((post, index) => (
                <motion.tr
                  key={post.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-cyber-muted/30 transition-all"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedPosts.has(post.id)}
                      onChange={() => togglePostSelection(post.id)}
                      className="w-4 h-4 rounded border-gray-600 text-cyber-cyan focus:ring-cyber-cyan"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <p className="text-white font-medium line-clamp-1">{post.title}</p>
                        {post.excerpt && (
                          <p className="text-sm text-gray-500 line-clamp-1 mt-1">{post.excerpt}</p>
                        )}
                      </div>
                      {post.featured && (
                        <span className="px-2 py-1 rounded bg-cyber-yellow/20 text-cyber-yellow text-xs">
                          精选
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[post.status]}`}>
                      {statusLabels[post.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-300">{post.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {post.author.avatar && (
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-6 h-6 rounded-full"
                        />
                      )}
                      <span className="text-gray-300">{post.author.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-300">{post.views.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-300">{post.comments}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded hover:bg-cyber-cyan/20 text-gray-400 hover:text-cyber-cyan transition-all"
                        title="预览"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                      <a
                        href={`/admin/posts/${post.id}/edit`}
                        className="p-2 rounded hover:bg-cyber-purple/20 text-gray-400 hover:text-cyber-purple transition-all"
                        title="编辑"
                      >
                        <Edit2 className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-2 rounded hover:bg-cyber-pink/20 text-gray-400 hover:text-cyber-pink transition-all"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {postsData?.data.length === 0 && (
            <div className="text-center py-20">
              <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">暂无文章</p>
              <a
                href="/admin/posts/new"
                className="text-cyber-cyan hover:underline"
              >
                创建第一篇文章 →
              </a>
            </div>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {postsData?.data.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="cyber-card p-6 rounded-lg hover:border-cyber-cyan/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <input
                  type="checkbox"
                  checked={selectedPosts.has(post.id)}
                  onChange={() => togglePostSelection(post.id)}
                  className="w-4 h-4 rounded border-gray-600 text-cyber-cyan focus:ring-cyber-cyan"
                />
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[post.status]}`}>
                  {statusLabels[post.status]}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{post.title}</h3>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 rounded bg-cyber-purple/20 text-cyber-purple text-xs">
                  {post.category}
                </span>
                {post.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="px-2 py-1 rounded bg-cyber-muted text-gray-400 text-xs">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {post.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    {post.comments}
                  </span>
                </div>
                <span>{new Date(post.date).toLocaleDateString()}</span>
              </div>

              <div className="flex gap-2">
                <a
                  href={`/admin/posts/${post.id}/edit`}
                  className="flex-1 px-4 py-2 rounded bg-cyber-purple/20 text-cyber-purple hover:bg-cyber-purple/30 transition-all text-center text-sm"
                >
                  编辑
                </a>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="px-4 py-2 rounded bg-cyber-pink/20 text-cyber-pink hover:bg-cyber-pink/30 transition-all text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* 分页 */}
      {postsData && postsData.meta.totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex items-center justify-between"
        >
          <p className="text-gray-400 text-sm">
            显示 {((currentPage - 1) * 20) + 1} - {Math.min(currentPage * 20, postsData.meta.total)} / 共 {postsData.meta.total} 篇
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-cyber-muted text-gray-300 hover:bg-cyber-muted/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              上一页
            </button>

            {Array.from({ length: postsData.meta.totalPages }, (_, i) => i + 1)
              .filter(page => {
                const nearCurrent = Math.abs(page - currentPage) <= 2;
                const isStartOrEnd = page === 1 || page === postsData.meta.totalPages;
                return nearCurrent || isStartOrEnd;
              })
              .map((page, idx, arr) => {
                const prevPage = arr[idx - 1];
                const showEllipsis = prevPage && page - prevPage > 1;

                return (
                  <span key={page}>
                    {showEllipsis && (
                      <span className="px-2 text-gray-500">...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        currentPage === page
                          ? 'bg-cyber-cyan text-cyber-dark'
                          : 'bg-cyber-muted text-gray-300 hover:bg-cyber-muted/80'
                      }`}
                    >
                      {page}
                    </button>
                  </span>
                );
              })}

            <button
              onClick={() => setCurrentPage(p => Math.min(postsData!.meta.totalPages, p + 1))}
              disabled={currentPage === postsData?.meta.totalPages}
              className="px-4 py-2 rounded-lg bg-cyber-muted text-gray-300 hover:bg-cyber-muted/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              下一页
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
