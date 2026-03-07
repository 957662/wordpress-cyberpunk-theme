'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Heart,
  Share2,
  Send,
  Trash2,
  Edit2,
  Flag,
  Reply,
  ChevronDown,
  ChevronUp,
  User,
  Clock,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from '@/lib/utils/date';

export interface Comment {
  id: string;
  postId: string;
  parentId?: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    url?: string;
  };
  content: string;
  createdAt: string;
  updatedAt?: string;
  likes: number;
  isLiked: boolean;
  status: 'approved' | 'pending' | 'spam' | 'trash';
  replies?: Comment[];
}

export interface CommentSystemProps {
  postId: string;
  initialComments?: Comment[];
  currentUser?: {
    id: string;
    name: string;
    avatar?: string;
    email?: string;
  };
  enableReplies?: boolean;
  enableLikes?: boolean;
  enableSorting?: boolean;
  enableModeration?: boolean;
  maxDepth?: number;
  className?: string;
  onSubmit?: (data: {
    postId: string;
    content: string;
    parentId?: string;
    author: {
      name: string;
      email: string;
    };
  }) => Promise<Comment>;
  onLike?: (commentId: string) => Promise<void>;
  onDelete?: (commentId: string) => Promise<void>;
  onEdit?: (commentId: string, content: string) => Promise<void>;
  onReply?: (commentId: string, content: string) => Promise<Comment>;
  onLoadMore?: () => Promise<Comment[]>;
}

type SortOption = 'newest' | 'oldest' | 'popular';

export function CommentSystem({
  postId,
  initialComments = [],
  currentUser,
  enableReplies = true,
  enableLikes = true,
  enableSorting = true,
  enableModeration = false,
  maxDepth = 3,
  className,
  onSubmit,
  onLike,
  onDelete,
  onEdit,
  onReply,
  onLoadMore,
}: CommentSystemProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAllReplies, setShowAllReplies] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 新评论表单状态
  const [newComment, setNewComment] = useState({
    name: '',
    email: '',
    content: '',
  });

  // 排序评论
  const sortedComments = useCallback(() => {
    const sorted = [...comments];

    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'oldest':
        return sorted.sort((a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case 'popular':
        return sorted.sort((a, b) => b.likes - a.likes);
      default:
        return sorted;
    }
  }, [comments, sortBy]);

  // 提交新评论
  const handleSubmit = async (parentId?: string) => {
    if (!newComment.content.trim()) {
      setError('评论内容不能为空');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (onSubmit) {
        const comment = await onSubmit({
          postId,
          content: newComment.content,
          parentId,
          author: {
            name: newComment.name,
            email: newComment.email,
          },
        });

        if (parentId) {
          // 添加回复
          setComments(prev => prev.map(c => {
            if (c.id === parentId) {
              return {
                ...c,
                replies: [...(c.replies || []), comment],
              };
            }
            return c;
          }));
          setReplyingTo(null);
        } else {
          // 添加顶级评论
          setComments(prev => [comment, ...prev]);
        }

        setNewComment({ name: '', email: '', content: '' });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '提交失败');
    } finally {
      setLoading(false);
    }
  };

  // 点赞评论
  const handleLike = async (commentId: string) => {
    if (!enableLikes || !onLike) return;

    try {
      await onLike(commentId);

      setComments(prev => prev.map(c => {
        if (c.id === commentId) {
          return {
            ...c,
            likes: c.isLiked ? c.likes - 1 : c.likes + 1,
            isLiked: !c.isLiked,
          };
        }
        return c;
      }));
    } catch (err) {
      console.error('点赞失败:', err);
    }
  };

  // 删除评论
  const handleDelete = async (commentId: string) => {
    if (!enableModeration || !onDelete) return;

    if (!confirm('确定要删除这条评论吗？')) return;

    try {
      await onDelete(commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (err) {
      console.error('删除失败:', err);
    }
  };

  // 切换回复显示
  const toggleReplies = (commentId: string) => {
    setShowAllReplies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  // 渲染单个评论
  const renderComment = (comment: Comment, depth: number = 0): React.ReactNode => {
    const isMaxDepth = depth >= maxDepth;
    const replies = comment.replies || [];
    const visibleReplies = showAllReplies.has(comment.id)
      ? replies
      : replies.slice(0, 2);

    return (
      <motion.div
        key={comment.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "relative",
          depth > 0 && "ml-8 pl-4 border-l-2 border-cyber-cyan/20"
        )}
      >
        {/* 评论内容 */}
        <div className="p-4 rounded-xl bg-cyber-muted/30 border border-cyber-cyan/10">
          {/* 作者信息 */}
          <div className="flex items-start gap-3 mb-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-purple flex items-center justify-center text-white font-bold">
              {comment.author.name.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-white">
                  {comment.author.name}
                </h4>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(comment.createdAt))}
                </span>
              </div>

              {editingId === comment.id ? (
                // 编辑模式
                <textarea
                  value={newComment.content}
                  onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                  className="w-full p-3 rounded-lg bg-cyber-dark border border-cyber-cyan/20 text-white focus:border-cyber-cyan focus:outline-none resize-none"
                  rows={3}
                  placeholder="编辑评论..."
                />
              ) : (
                // 显示模式
                <p className="text-gray-300 whitespace-pre-wrap">
                  {comment.content}
                </p>
              )}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center gap-2 ml-13">
            {/* 点赞 */}
            {enableLikes && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleLike(comment.id)}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-lg text-sm transition-all",
                  comment.isLiked
                    ? "bg-cyber-pink/20 text-cyber-pink"
                    : "bg-cyber-muted/50 text-gray-400 hover:text-cyber-pink"
                )}
              >
                <Heart className={cn("w-4 h-4", comment.isLiked && "fill-current")} />
                <span>{comment.likes}</span>
              </motion.button>
            )}

            {/* 回复 */}
            {enableReplies && !isMaxDepth && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-lg text-sm transition-all",
                  replyingTo === comment.id
                    ? "bg-cyber-cyan/20 text-cyber-cyan"
                    : "bg-cyber-muted/50 text-gray-400 hover:text-cyber-cyan"
                )}
              >
                <Reply className="w-4 h-4" />
                <span>回复</span>
              </motion.button>
            )}

            {/* 编辑/删除 (仅管理员) */}
            {enableModeration && currentUser && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setEditingId(editingId === comment.id ? null : comment.id)}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-sm bg-cyber-muted/50 text-gray-400 hover:text-cyber-cyan transition-all"
                >
                  <Edit2 className="w-4 h-4" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(comment.id)}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-sm bg-cyber-muted/50 text-gray-400 hover:text-cyber-pink transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </>
            )}

            {/* 保存/取消编辑 */}
            {editingId === comment.id && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (onEdit) {
                      onEdit(comment.id, newComment.content);
                      setEditingId(null);
                    }
                  }}
                  className="px-3 py-1 rounded-lg text-sm bg-cyber-green/20 text-cyber-green"
                >
                  保存
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setEditingId(null);
                    setNewComment({ ...newComment, content: '' });
                  }}
                  className="px-3 py-1 rounded-lg text-sm bg-cyber-muted/50 text-gray-400"
                >
                  取消
                </motion.button>
              </>
            )}
          </div>

          {/* 回复输入框 */}
          <AnimatePresence>
            {replyingTo === comment.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3"
              >
                <textarea
                  value={newComment.content}
                  onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                  className="w-full p-3 rounded-lg bg-cyber-dark border border-cyber-cyan/20 text-white focus:border-cyber-cyan focus:outline-none resize-none"
                  rows={3}
                  placeholder="写下你的回复..."
                />

                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="px-4 py-2 rounded-lg text-sm bg-cyber-muted/50 text-gray-400"
                  >
                    取消
                  </button>
                  <button
                    onClick={() => handleSubmit(comment.id)}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        发送中...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        发送回复
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 回复列表 */}
        {replies.length > 0 && (
          <div className="mt-3 space-y-3">
            {visibleReplies.map(reply => renderComment(reply, depth + 1))}

            {replies.length > 2 && (
              <button
                onClick={() => toggleReplies(comment.id)}
                className="flex items-center gap-2 text-sm text-cyber-cyan hover:text-cyber-purple transition-colors"
              >
                {showAllReplies.has(comment.id) ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    收起 {replies.length - 2} 条回复
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    展开 {replies.length - 2} 条回复
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* 标题栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-cyber-cyan" />
          <h2 className="text-xl font-bold text-white">
            评论 ({comments.length})
          </h2>
        </div>

        {enableSorting && (
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-1.5 rounded-lg bg-cyber-muted/50 border border-cyber-cyan/20 text-white text-sm focus:border-cyber-cyan focus:outline-none"
          >
            <option value="newest">最新</option>
            <option value="oldest">最早</option>
            <option value="popular">热门</option>
          </select>
        )}
      </div>

      {/* 新评论表单 */}
      <div className="p-4 rounded-xl bg-cyber-muted/30 border border-cyber-cyan/10">
        <textarea
          value={newComment.content}
          onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
          className="w-full p-3 rounded-lg bg-cyber-dark border border-cyber-cyan/20 text-white placeholder-gray-500 focus:border-cyber-cyan focus:outline-none resize-none"
          rows={4}
          placeholder="分享你的想法..."
        />

        {!currentUser && (
          <div className="grid grid-cols-2 gap-3 mt-3">
            <input
              type="text"
              value={newComment.name}
              onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
              className="px-3 py-2 rounded-lg bg-cyber-dark border border-cyber-cyan/20 text-white placeholder-gray-500 focus:border-cyber-cyan focus:outline-none"
              placeholder="你的名字"
            />
            <input
              type="email"
              value={newComment.email}
              onChange={(e) => setNewComment({ ...newComment, email: e.target.value })}
              className="px-3 py-2 rounded-lg bg-cyber-dark border border-cyber-cyan/20 text-white placeholder-gray-500 focus:border-cyber-cyan focus:outline-none"
              placeholder="邮箱地址"
            />
          </div>
        )}

        {error && (
          <p className="mt-2 text-sm text-cyber-pink">{error}</p>
        )}

        <div className="flex justify-end mt-3">
          <button
            onClick={() => handleSubmit()}
            disabled={loading || !newComment.content.trim()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-cyber-cyan/20 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                发送中...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                发表评论
              </>
            )}
          </button>
        </div>
      </div>

      {/* 评论列表 */}
      <div className="space-y-4">
        {sortedComments().length > 0 ? (
          sortedComments().map(comment => renderComment(comment))
        ) : (
          <div className="py-12 text-center text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>还没有评论，来发表第一条吧！</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentSystem;
