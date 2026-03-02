'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { CyberCard } from '@/components/ui/CyberCard';
import { Alert } from '@/components/ui/Alert';
import {
  MessageSquare,
  Search,
  Filter,
  Trash2,
  Check,
  X,
  Reply,
  User,
  Clock
} from 'lucide-react';
import Image from 'next/image';

type CommentStatus = 'pending' | 'approved' | 'rejected' | 'spam';

type Comment = {
  id: string;
  post: {
    id: string;
    title: string;
  };
  author: {
    name: string;
    email: string;
    avatar?: string;
  };
  content: string;
  status: CommentStatus;
  createdAt: string;
  parentComment?: {
    id: string;
    author: string;
  };
};

export default function AdminCommentsPage() {
  const { user } = useAuthStore();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CommentStatus | 'all'>('all');
  const [selectedComments, setSelectedComments] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const filteredComments = comments.filter((comment) => {
    const matchesSearch =
      comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || comment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApproveComment = async (id: string) => {
    try {
      await fetch(`/api/admin/comments/${id}/approve`, { method: 'POST' });
      setComments(
        comments.map((c) => (c.id === id ? { ...c, status: 'approved' as CommentStatus } : c))
      );
      setMessage({ type: 'success', text: '评论已批准' });
    } catch (err) {
      setMessage({ type: 'error', text: '操作失败' });
    }
  };

  const handleRejectComment = async (id: string) => {
    try {
      await fetch(`/api/admin/comments/${id}/reject`, { method: 'POST' });
      setComments(
        comments.map((c) => (c.id === id ? { ...c, status: 'rejected' as CommentStatus } : c))
      );
      setMessage({ type: 'success', text: '评论已拒绝' });
    } catch (err) {
      setMessage({ type: 'error', text: '操作失败' });
    }
  };

  const handleDeleteComment = async (id: string) => {
    if (!confirm('确定要删除这条评论吗？')) return;

    try {
      await fetch(`/api/admin/comments/${id}`, { method: 'DELETE' });
      setComments(comments.filter((c) => c.id !== id));
      setSelectedComments(new Set([...selectedComments].filter((commentId) => commentId !== id)));
      setMessage({ type: 'success', text: '评论已删除' });
    } catch (err) {
      setMessage({ type: 'error', text: '删除失败' });
    }
  };

  const handleBulkApprove = async () => {
    if (selectedComments.size === 0) return;

    try {
      await fetch('/api/admin/comments/bulk-approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedComments) }),
      });
      setComments(
        comments.map((c) =>
          selectedComments.has(c.id) ? { ...c, status: 'approved' as CommentStatus } : c
        )
      );
      setSelectedComments(new Set());
      setMessage({ type: 'success', text: '批量批准成功' });
    } catch (err) {
      setMessage({ type: 'error', text: '操作失败' });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedComments.size === 0) return;
    if (!confirm(`确定要删除选中的 ${selectedComments.size} 条评论吗？`)) return;

    try {
      await fetch('/api/admin/comments/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedComments) }),
      });
      setComments(comments.filter((c) => !selectedComments.has(c.id)));
      setSelectedComments(new Set());
      setMessage({ type: 'success', text: '批量删除成功' });
    } catch (err) {
      setMessage({ type: 'error', text: '批量删除失败' });
    }
  };

  const handleSubmitReply = async () => {
    if (!replyTo || !replyContent.trim()) return;

    try {
      const response = await fetch('/api/admin/comments/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commentId: replyTo,
          content: replyContent,
        }),
      });

      if (!response.ok) throw new Error('回复失败');

      setMessage({ type: 'success', text: '回复已发布' });
      setReplyTo(null);
      setReplyContent('');
    } catch (err) {
      setMessage({ type: 'error', text: '回复失败' });
    }
  };

  const getStatusColor = (status: CommentStatus) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 text-green-400';
      case 'rejected':
        return 'bg-red-500/20 text-red-400';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'spam':
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusLabel = (status: CommentStatus) => {
    switch (status) {
      case 'approved':
        return '已批准';
      case 'rejected':
        return '已拒绝';
      case 'pending':
        return '待审核';
      case 'spam':
        return '垃圾';
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
                <MessageSquare className="w-8 h-8 text-cyber-pink" />
                评论管理
              </h1>
              <p className="text-gray-400 mt-1">管理所有用户评论</p>
            </div>
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
              { label: '全部', value: comments.length, color: 'cyber-cyan' },
              { label: '待审核', value: comments.filter((c) => c.status === 'pending').length, color: 'yellow-500' },
              { label: '已批准', value: comments.filter((c) => c.status === 'approved').length, color: 'green-500' },
              { label: '垃圾', value: comments.filter((c) => c.status === 'spam').length, color: 'gray-500' },
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
                  placeholder="搜索评论..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyber-cyan"
                />
              </div>
              <div className="flex gap-2">
                {(['all', 'pending', 'approved', 'rejected', 'spam'] as const).map((status) => (
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
                    {status === 'all' ? '全部' : getStatusLabel(status as CommentStatus)}
                  </button>
                ))}
              </div>
            </div>
          </CyberCard>

          {/* 批量操作 */}
          {selectedComments.size > 0 && (
            <CyberCard className="p-4 border-cyber-cyan">
              <div className="flex items-center justify-between">
                <span className="text-white">已选择 {selectedComments.size} 条评论</span>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setSelectedComments(new Set())}
                    variant="secondary"
                  >
                    取消选择
                  </Button>
                  <Button
                    onClick={handleBulkApprove}
                    className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    批量批准
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

          {/* 评论列表 */}
          <CyberCard className="overflow-hidden">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block w-12 h-12 border-4 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredComments.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">暂无评论</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-800">
                {filteredComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-4 hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex gap-4">
                      {/* 选择复选框 */}
                      <input
                        type="checkbox"
                        checked={selectedComments.has(comment.id)}
                        onChange={(e) => {
                          const newSelected = new Set(selectedComments);
                          if (e.target.checked) {
                            newSelected.add(comment.id);
                          } else {
                            newSelected.delete(comment.id);
                          }
                          setSelectedComments(newSelected);
                        }}
                        className="mt-4 w-4 h-4 rounded border-gray-600 bg-gray-700"
                      />

                      {/* 作者头像 */}
                      <div className="flex-shrink-0">
                        {comment.author.avatar ? (
                          <Image
                            src={comment.author.avatar}
                            alt={comment.author.name}
                            width={48}
                            height={48}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center text-white font-bold">
                            {comment.author.name[0].toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* 评论内容 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white">
                                {comment.author.name}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(comment.status)}`}>
                                {getStatusLabel(comment.status)}
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(comment.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <p className="text-gray-300 mb-3">{comment.content}</p>

                        <p className="text-sm text-cyber-cyan mb-3">
                          文章: {comment.post.title}
                        </p>

                        {/* 回复编辑器 */}
                        {replyTo === comment.id && (
                          <div className="mb-3">
                            <textarea
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              placeholder="输入回复内容..."
                              rows={3}
                              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyber-cyan"
                            />
                            <div className="flex gap-2 mt-2">
                              <Button
                                onClick={handleSubmitReply}
                                size="sm"
                                className="bg-gradient-to-r from-cyber-cyan to-cyber-purple"
                              >
                                发布回复
                              </Button>
                              <Button
                                onClick={() => {
                                  setReplyTo(null);
                                  setReplyContent('');
                                }}
                                size="sm"
                                variant="secondary"
                              >
                                取消
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* 操作按钮 */}
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleApproveComment(comment.id)}
                            size="sm"
                            variant="secondary"
                            className="text-green-500 hover:bg-green-500/20"
                            disabled={comment.status === 'approved'}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleRejectComment(comment.id)}
                            size="sm"
                            variant="secondary"
                            className="text-red-500 hover:bg-red-500/20"
                            disabled={comment.status === 'rejected'}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => setReplyTo(comment.id)}
                            size="sm"
                            variant="secondary"
                            className="text-cyber-cyan hover:bg-cyber-cyan/20"
                          >
                            <Reply className="w-4 h-4" />
                            回复
                          </Button>
                          <Button
                            onClick={() => handleDeleteComment(comment.id)}
                            size="sm"
                            variant="danger"
                            className="bg-red-600 hover:bg-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                            删除
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CyberCard>
        </motion.div>
      </div>
    </div>
  );
}
