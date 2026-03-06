'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Search,
  Check,
  X,
  Trash2,
  Reply,
  Flag,
  MoreVertical,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import {
  getComments,
  updateComment,
  deleteComment,
  buildCommentTree,
  type WPComment,
} from '@/lib/wordpress/comments';

export default function CommentsManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'hold' | 'spam'>('all');
  const queryClient = useQueryClient();

  // 获取评论列表
  const { data: commentsData, isLoading } = useQuery({
    queryKey: ['admin', 'comments', statusFilter],
    queryFn: async () => {
      const status = statusFilter === 'all' ? undefined : statusFilter;
      return getComments({ status, per_page: 100 });
    },
  });

  // 审核通过评论
  const approveMutation = useMutation({
    mutationFn: async ({ id, token }: { id: number; token: string }) => {
      return updateComment(id, { status: 'hold' }, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'comments'] });
    },
  });

  // 拒绝评论
  const rejectMutation = useMutation({
    mutationFn: async ({ id, token }: { id: number; token: string }) => {
      return updateComment(id, { status: 'hold' }, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'comments'] });
    },
  });

  // 删除评论
  const deleteCommentMutation = useMutation({
    mutationFn: async ({ id, token }: { id: number; token: string }) => {
      return deleteComment(id, token, true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'comments'] });
    },
  });

  // 标记为垃圾
  const spamMutation = useMutation({
    mutationFn: async ({ id, token }: { id: number; token: string }) => {
      return updateComment(id, { status: 'spam' }, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'comments'] });
    },
  });

  const handleApprove = async (commentId: number) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        await approveMutation.mutateAsync({ id: commentId, token });
      } catch (error) {
        alert('操作失败：' + (error as Error).message);
      }
    }
  };

  const handleReject = async (commentId: number) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        await rejectMutation.mutateAsync({ id: commentId, token });
      } catch (error) {
        alert('操作失败：' + (error as Error).message);
      }
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!confirm('确定要删除这条评论吗？')) return;

    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        await deleteCommentMutation.mutateAsync({ id: commentId, token });
      } catch (error) {
        alert('删除失败：' + (error as Error).message);
      }
    }
  };

  const handleSpam = async (commentId: number) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        await spamMutation.mutateAsync({ id: commentId, token });
      } catch (error) {
        alert('操作失败：' + (error as Error).message);
      }
    }
  };

  const filteredComments = commentsData?.data.filter(comment => {
    const content = comment.content.rendered.toLowerCase();
    const author = comment.author_name.toLowerCase();
    const matchesSearch =
      content.includes(searchQuery.toLowerCase()) ||
      author.includes(searchQuery.toLowerCase());
    return matchesSearch;
  }) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            评论管理
          </h1>
          <p className="text-gray-400">
            共 {commentsData?.total || 0} 条评论
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyber-cyan/20 flex items-center justify-center">
              <Check className="w-5 h-5 text-cyber-cyan" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {commentsData?.data.filter(c => c.status === 'approved').length || 0}
              </p>
              <p className="text-sm text-gray-400">已通过</p>
            </div>
          </div>
        </Card>

        <Card variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyber-yellow/20 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-cyber-yellow" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {commentsData?.data.filter(c => c.status === 'hold').length || 0}
              </p>
              <p className="text-sm text-gray-400">待审核</p>
            </div>
          </div>
        </Card>

        <Card variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyber-pink/20 flex items-center justify-center">
              <Flag className="w-5 h-5 text-cyber-pink" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {commentsData?.data.filter(c => c.status === 'spam').length || 0}
              </p>
              <p className="text-sm text-gray-400">垃圾评论</p>
            </div>
          </div>
        </Card>

        <Card variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyber-purple/20 flex items-center justify-center">
              <MoreVertical className="w-5 h-5 text-cyber-purple" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {commentsData?.total || 0}
              </p>
              <p className="text-sm text-gray-400">总计</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card variant="glass" className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              type="search"
              placeholder="搜索评论内容或作者..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            {(['all', 'hold', 'approved', 'spam'] as const).map((status) => (
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
                 status === 'hold' ? '待审核' :
                 status === 'approved' ? '已通过' : '垃圾评论'}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Comments List */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-400">
          加载中...
        </div>
      ) : filteredComments.length === 0 ? (
        <Card variant="glass" className="p-12 text-center">
          <p className="text-gray-400">暂无评论</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredComments.map((comment, index) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                variant="glass"
                className={`p-4 transition-colors ${
                  comment.status === 'hold' ? 'border-cyber-yellow/30' :
                  comment.status === 'spam' ? 'border-cyber-pink/30' :
                  ''
                }`}
              >
                <div className="flex gap-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">
                      {comment.author_name.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-white mb-1">
                          {comment.author_name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {new Date(comment.date).toLocaleString('zh-CN')}
                          {comment.author_email && ` · ${comment.author_email}`}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        comment.status === 'approved' ? 'bg-cyber-green/20 text-cyber-green' :
                        comment.status === 'hold' ? 'bg-cyber-yellow/20 text-cyber-yellow' :
                        'bg-cyber-pink/20 text-cyber-pink'
                      }`}>
                        {comment.status === 'approved' ? '已通过' :
                         comment.status === 'hold' ? '待审核' : '垃圾'}
                      </span>
                    </div>

                    <div
                      className="text-gray-300 text-sm mb-3"
                      dangerouslySetInnerHTML={{ __html: comment.content.rendered }}
                    />

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {comment.status === 'hold' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleApprove(comment.id)}
                            className="text-cyber-green hover:text-cyber-green hover:bg-cyber-green/10"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            通过
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSpam(comment.id)}
                            className="text-cyber-pink hover:text-cyber-pink hover:bg-cyber-pink/10"
                          >
                            <Flag className="w-4 h-4 mr-1" />
                            垃圾
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(comment.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        删除
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
