'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Filter,
  Search,
  MoreVertical
} from 'lucide-react';
import { CyberCard } from '@/components/ui/CyberCard';
import { CyberButton } from '@/components/ui/CyberButton';
import { CyberInput } from '@/components/ui/CyberInput';
import toast from 'react-hot-toast';

interface ScheduledPost {
  id: string;
  title: string;
  excerpt: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'scheduled' | 'published' | 'failed';
  category: string;
  tags: string[];
}

export const ContentScheduler: React.FC = () => {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([
    {
      id: '1',
      title: '如何使用 TypeScript 5.4',
      excerpt: '探索 TypeScript 最新版本的特性和改进...',
      scheduledDate: '2024-03-15',
      scheduledTime: '09:00',
      status: 'scheduled',
      category: '技术',
      tags: ['TypeScript', '前端开发'],
    },
    {
      id: '2',
      title: 'Next.js 14 完全指南',
      excerpt: '深入了解 Next.js 14 的新功能和最佳实践...',
      scheduledDate: '2024-03-18',
      scheduledTime: '14:00',
      status: 'scheduled',
      category: '教程',
      tags: ['Next.js', 'React'],
    },
  ]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPost, setEditingPost] = useState<ScheduledPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // 新建文章表单
  const [newPost, setNewPost] = useState({
    title: '',
    excerpt: '',
    scheduledDate: '',
    scheduledTime: '',
    category: '',
    tags: [] as string[],
  });

  // 标签输入
  const [tagInput, setTagInput] = useState('');

  const categories = ['技术', '教程', '随笔', '新闻'];
  const statusFilters = ['all', 'scheduled', 'published', 'failed'];

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.scheduledDate || !newPost.scheduledTime) {
      toast.error('请填写必填字段');
      return;
    }

    const post: ScheduledPost = {
      id: Date.now().toString(),
      ...newPost,
      status: 'scheduled',
    };

    setScheduledPosts([...scheduledPosts, post]);
    setShowCreateModal(false);
    resetForm();
    toast.success('文章已安排发布');
  };

  const handleUpdatePost = () => {
    if (!editingPost) return;

    setScheduledPosts(
      scheduledPosts.map((post) =>
        post.id === editingPost.id ? { ...editingPost } : post
      )
    );
    setEditingPost(null);
    toast.success('文章已更新');
  };

  const handleDeletePost = (id: string) => {
    if (!confirm('确定要删除这篇文章吗？')) return;
    setScheduledPosts(scheduledPosts.filter((post) => post.id !== id));
    toast.success('文章已删除');
  };

  const resetForm = () => {
    setNewPost({
      title: '',
      excerpt: '',
      scheduledDate: '',
      scheduledTime: '',
      category: '',
      tags: [],
    });
    setTagInput('');
  };

  const addTag = () => {
    if (tagInput && !newPost.tags.includes(tagInput)) {
      setNewPost({ ...newPost, tags: [...newPost.tags, tagInput] });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setNewPost({ ...newPost, tags: newPost.tags.filter((t) => t !== tag) });
  };

  const filteredPosts = scheduledPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === 'all' || post.category === filterCategory;
    const matchesStatus =
      filterStatus === 'all' || post.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: ScheduledPost['status']) => {
    const colors = {
      scheduled: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      published: 'bg-green-500/20 text-green-400 border-green-500/30',
      failed: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return colors[status];
  };

  const getStatusLabel = (status: ScheduledPost['status']) => {
    const labels = {
      scheduled: '待发布',
      published: '已发布',
      failed: '发布失败',
    };
    return labels[status];
  };

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-cyber-purple/20 blur-lg rounded-lg"></div>
            <div className="relative bg-cyber-dark border border-cyber-purple/50 rounded-lg p-2">
              <Calendar className="w-6 h-6 text-cyber-purple" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">内容排期</h2>
            <p className="text-gray-400 text-sm">管理您的文章发布计划</p>
          </div>
        </div>

        <CyberButton
          variant="neon"
          size="md"
          onClick={() => setShowCreateModal(true)}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          安排发布
        </CyberButton>
      </div>

      {/* 筛选栏 */}
      <CyberCard>
        <div className="p-4 flex flex-wrap items-center gap-4">
          {/* 搜索 */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="搜索文章..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-cyber-dark border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:border-cyber-cyan focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* 分类筛选 */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 bg-cyber-dark border border-gray-800 rounded-lg text-white focus:border-cyber-cyan focus:outline-none transition-colors"
            >
              <option value="all">所有分类</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* 状态筛选 */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-cyber-dark border border-gray-800 rounded-lg text-white focus:border-cyber-cyan focus:outline-none transition-colors"
          >
            <option value="all">所有状态</option>
            {statusFilters
              .filter((s) => s !== 'all')
              .map((status) => (
                <option key={status} value={status}>
                  {getStatusLabel(status as ScheduledPost['status'])}
                </option>
              ))}
          </select>
        </div>
      </CyberCard>

      {/* 文章列表 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">
          已安排 {filteredPosts.length} 篇文章
        </h3>

        {filteredPosts.length === 0 ? (
          <CyberCard className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">暂无排期文章</p>
            <p className="text-gray-500 text-sm mt-1">点击上方按钮安排文章发布</p>
          </CyberCard>
        ) : (
          <div className="grid gap-4">
            {filteredPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group"
              >
                <CyberCard className="hover:border-cyber-purple/50 transition-all">
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      {/* 内容 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-white font-semibold truncate">
                            {post.title}
                          </h4>
                          <span
                            className={`px-2 py-0.5 text-xs rounded-full border ${getStatusColor(
                              post.status
                            )}`}
                          >
                            {getStatusLabel(post.status)}
                          </span>
                        </div>

                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                          {post.excerpt}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {post.scheduledDate}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.scheduledTime}
                          </div>
                          <span className="px-2 py-0.5 bg-cyber-cyan/10 text-cyber-cyan rounded">
                            {post.category}
                          </span>
                        </div>

                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {post.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 bg-gray-800 text-gray-400 text-xs rounded"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* 操作按钮 */}
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditingPost(post)}
                          className="p-2 text-gray-400 hover:text-cyber-cyan hover:bg-cyber-cyan/10 rounded-lg transition-colors"
                          title="编辑"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </CyberCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* 创建/编辑模态框 */}
      <AnimatePresence>
        {(showCreateModal || editingPost) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowCreateModal(false);
              setEditingPost(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-cyber-dark border border-cyber-purple/50 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-xl font-bold text-white mb-6">
                {editingPost ? '编辑排期' : '安排发布'}
              </h3>

              <div className="space-y-4">
                {/* 标题 */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    标题 *
                  </label>
                  <input
                    type="text"
                    value={editingPost ? editingPost.title : newPost.title}
                    onChange={(e) =>
                      editingPost
                        ? setEditingPost({ ...editingPost, title: e.target.value })
                        : setNewPost({ ...newPost, title: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-cyber-dark border border-gray-800 rounded-lg text-white focus:border-cyber-cyan focus:outline-none transition-colors"
                    placeholder="输入文章标题"
                  />
                </div>

                {/* 摘要 */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    摘要
                  </label>
                  <textarea
                    value={editingPost ? editingPost.excerpt : newPost.excerpt}
                    onChange={(e) =>
                      editingPost
                        ? setEditingPost({ ...editingPost, excerpt: e.target.value })
                        : setNewPost({ ...newPost, excerpt: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 bg-cyber-dark border border-gray-800 rounded-lg text-white focus:border-cyber-cyan focus:outline-none transition-colors resize-none"
                    placeholder="输入文章摘要"
                  />
                </div>

                {/* 日期和时间 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      发布日期 *
                    </label>
                    <input
                      type="date"
                      value={editingPost ? editingPost.scheduledDate : newPost.scheduledDate}
                      onChange={(e) =>
                        editingPost
                          ? setEditingPost({ ...editingPost, scheduledDate: e.target.value })
                          : setNewPost({ ...newPost, scheduledDate: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-cyber-dark border border-gray-800 rounded-lg text-white focus:border-cyber-cyan focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      发布时间 *
                    </label>
                    <input
                      type="time"
                      value={editingPost ? editingPost.scheduledTime : newPost.scheduledTime}
                      onChange={(e) =>
                        editingPost
                          ? setEditingPost({ ...editingPost, scheduledTime: e.target.value })
                          : setNewPost({ ...newPost, scheduledTime: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-cyber-dark border border-gray-800 rounded-lg text-white focus:border-cyber-cyan focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* 分类 */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    分类
                  </label>
                  <select
                    value={editingPost ? editingPost.category : newPost.category}
                    onChange={(e) =>
                      editingPost
                        ? setEditingPost({ ...editingPost, category: e.target.value })
                        : setNewPost({ ...newPost, category: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-cyber-dark border border-gray-800 rounded-lg text-white focus:border-cyber-cyan focus:outline-none transition-colors"
                  >
                    <option value="">选择分类</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 标签 */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    标签
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      className="flex-1 px-3 py-2 bg-cyber-dark border border-gray-800 rounded-lg text-white focus:border-cyber-cyan focus:outline-none transition-colors"
                      placeholder="输入标签后按回车"
                    />
                    <CyberButton variant="outline" onClick={addTag}>
                      添加
                    </CyberButton>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(editingPost ? editingPost.tags : newPost.tags).map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-cyber-cyan/10 text-cyber-cyan rounded-lg text-sm flex items-center gap-2"
                      >
                        #{tag}
                        <button
                          onClick={() =>
                            editingPost
                              ? setEditingPost({
                                  ...editingPost,
                                  tags: editingPost.tags.filter((t) => t !== tag),
                                })
                              : removeTag(tag)
                          }
                          className="hover:text-red-400 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* 按钮 */}
                <div className="flex gap-3 pt-4 border-t border-gray-800">
                  <CyberButton
                    variant="outline"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingPost(null);
                      resetForm();
                    }}
                    className="flex-1"
                  >
                    取消
                  </CyberButton>
                  <CyberButton
                    variant="neon"
                    onClick={editingPost ? handleUpdatePost : handleCreatePost}
                    className="flex-1"
                  >
                    {editingPost ? '更新' : '安排发布'}
                  </CyberButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
