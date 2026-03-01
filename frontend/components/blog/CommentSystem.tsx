/**
 * 评论系统组件
 * 支持嵌套评论、回复和加载更多
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

// 评论类型
export interface Comment {
  id: number;
  author: {
    name: string;
    avatar?: string;
    url?: string;
  };
  content: string;
  date: string;
  parent?: number;
  replies?: Comment[];
}

export interface CommentSystemProps {
  postId: number;
  initialComments?: Comment[];
  onAddComment?: (data: {
    post: number;
    author_name: string;
    author_email: string;
    content: string;
    parent?: number;
  }) => Promise<Comment>;
  onLoadMore?: () => Promise<Comment[]>;
  allowReplies?: boolean;
  maxDepth?: number;
}

export const CommentSystem: React.FC<CommentSystemProps> = ({
  postId,
  initialComments = [],
  onAddComment,
  onLoadMore,
  allowReplies = true,
  maxDepth = 3,
}) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] useState<number | null>(null);
  const [showReplyForm, setShowReplyForm] = useState(false);

  // 新评论表单状态
  const [newComment, setNewComment] = useState({
    author_name: '',
    author_email: '',
    content: '',
  });

  // 加载评论
  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  // 提交评论
  const handleSubmit = async (parentId?: number) => {
    if (!onAddComment) return;

    const commentData = {
      post: postId,
      author_name: newComment.author_name,
      author_email: newComment.author_email,
      content: newComment.content,
      parent: parentId,
    };

    setLoading(true);
    try {
      const result = await onAddComment(commentData);

      if (parentId) {
        // 添加回复
        setComments((prev) => addReplyToComment(prev, parentId, result));
      } else {
        // 添加顶级评论
        setComments((prev) => [result, ...prev]);
      }

      // 重置表单
      setNewComment({ author_name: '', author_email: '', content: '' });
      setReplyingTo(null);
      setShowReplyForm(false);
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setLoading(false);
    }
  };

  // 递归添加回复到评论树
  const addReplyToComment = (comments: Comment[], parentId: number, reply: Comment): Comment[] => {
    return comments.map((comment) => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), reply],
        };
      }
      if (comment.replies) {
        return {
          ...comment,
          replies: addReplyToComment(comment.replies, parentId, reply),
        };
      }
      return comment;
    });
  };

  // 加载更多评论
  const handleLoadMore = async () => {
    if (!onLoadMore || loading) return;

    setLoading(true);
    try {
      const moreComments = await onLoadMore();
      setComments((prev) => [...prev, ...moreComments]);
    } catch (error) {
      console.error('Failed to load more comments:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comment-system space-y-6">
      {/* 评论区标题 */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold font-display">
          评论 ({comments.length})
        </h3>
      </div>

      {/* 评论表单 */}
      <Card className="p-6 border-cyber-cyan/20">
        <h4 className="text-lg font-semibold mb-4">发表评论</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="姓名 *"
              value={newComment.author_name}
              onChange={(e) =>
                setNewComment({ ...newComment, author_name: e.target.value })
              }
              placeholder="请输入您的姓名"
              required
            />
            <Input
              label="邮箱 *"
              type="email"
              value={newComment.author_email}
              onChange={(e) =>
                setNewComment({ ...newComment, author_email: e.target.value })
              }
              placeholder="请输入您的邮箱"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">评论内容 *</label>
            <textarea
              value={newComment.content}
              onChange={(e) =>
                setNewComment({ ...newComment, content: e.target.value })
              }
              placeholder="请输入您的评论..."
              rows={4}
              className="w-full px-4 py-2 bg-cyber-dark/50 border border-cyber-cyan/30 rounded-lg focus:outline-none focus:border-cyber-cyan focus:ring-2 focus:ring-cyber-cyan/20 transition-all"
              required
            />
          </div>
          <Button
            onClick={() => handleSubmit()}
            disabled={loading || !newComment.author_name || !newComment.author_email || !newComment.content}
            variant="primary"
            className="w-full md:w-auto"
          >
            {loading ? '提交中...' : '发表评论'}
          </Button>
        </div>
      </Card>

      {/* 评论列表 */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            depth={0}
            maxDepth={maxDepth}
            allowReplies={allowReplies}
            replyingTo={replyingTo}
            onReply={(id) => {
              setReplyingTo(id);
              setShowReplyForm(true);
            }}
            onCancelReply={() => {
              setReplyingTo(null);
              setShowReplyForm(false);
            }}
            onSubmitReply={handleSubmit}
            replyFormVisible={showReplyForm && replyingTo === comment.id}
            newComment={newComment}
            setNewComment={setNewComment}
            loading={loading}
          />
        ))}
      </div>

      {/* 加载更多按钮 */}
      {onLoadMore && (
        <div className="text-center">
          <Button
            onClick={handleLoadMore}
            disabled={loading}
            variant="outline"
            className="px-8"
          >
            {loading ? '加载中...' : '加载更多评论'}
          </Button>
        </div>
      )}

      {/* 暂无评论 */}
      {comments.length === 0 && !loading && (
        <Card className="p-12 text-center border-cyber-cyan/20">
          <p className="text-gray-400">暂无评论，快来抢沙发吧！</p>
        </Card>
      )}
    </div>
  );
};

// 评论项组件
interface CommentItemProps {
  comment: Comment;
  depth: number;
  maxDepth: number;
  allowReplies: boolean;
  replyingTo: number | null;
  onReply: (id: number) => void;
  onCancelReply: () => void;
  onSubmitReply: (parentId?: number) => void;
  replyFormVisible: boolean;
  newComment: { author_name: string; author_email: string; content: string };
  setNewComment: (data: any) => void;
  loading: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  depth,
  maxDepth,
  allowReplies,
  replyingTo,
  onReply,
  onCancelReply,
  onSubmitReply,
  replyFormVisible,
  newComment,
  setNewComment,
  loading,
}) => {
  const canReply = allowReplies && depth < maxDepth;
  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${depth > 0 ? 'ml-8 md:ml-12' : ''}`}
    >
      <Card className="p-6 border-cyber-purple/20 hover:border-cyber-purple/40 transition-all">
        <div className="flex items-start gap-4">
          {/* 头像 */}
          <div className="flex-shrink-0">
            {comment.author.avatar ? (
              <img
                src={comment.author.avatar}
                alt={comment.author.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-cyber-purple/50"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyber-purple to-cyber-pink flex items-center justify-center text-white font-bold text-lg">
                {comment.author.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* 评论内容 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h4 className="font-semibold text-lg">
                {comment.author.url ? (
                  <a
                    href={comment.author.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-cyber-cyan transition-colors"
                  >
                    {comment.author.name}
                  </a>
                ) : (
                  comment.author.name
                )}
              </h4>
              <span className="text-gray-400 text-sm">
                {formatDate(comment.date)}
              </span>
            </div>

            <div
              className="prose prose-invert max-w-none text-gray-300"
              dangerouslySetInnerHTML={{ __html: comment.content }}
            />

            {/* 回复按钮 */}
            {canReply && (
              <button
                onClick={() => onReply(comment.id)}
                className="mt-4 text-sm text-cyber-cyan hover:text-cyber-purple transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                回复
              </button>
            )}

            {/* 回复表单 */}
            {replyFormVisible && (
              <div className="mt-4 space-y-3 p-4 bg-cyber-dark/30 rounded-lg border border-cyber-cyan/20">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <span>回复 {comment.author.name}</span>
                  <button
                    onClick={onCancelReply}
                    className="text-gray-400 hover:text-white"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div>
                  <Input
                    label="姓名 *"
                    value={newComment.author_name}
                    onChange={(e) =>
                      setNewComment({ ...newComment, author_name: e.target.value })
                    }
                    placeholder="请输入您的姓名"
                    size="sm"
                  />
                </div>
                <div>
                  <Input
                    label="邮箱 *"
                    type="email"
                    value={newComment.author_email}
                    onChange={(e) =>
                      setNewComment({ ...newComment, author_email: e.target.value })
                    }
                    placeholder="请输入您的邮箱"
                    size="sm"
                  />
                </div>
                <div>
                  <textarea
                    value={newComment.content}
                    onChange={(e) =>
                      setNewComment({ ...newComment, content: e.target.value })
                    }
                    placeholder="请输入回复内容..."
                    rows={3}
                    className="w-full px-3 py-2 bg-cyber-dark/50 border border-cyber-cyan/30 rounded-lg focus:outline-none focus:border-cyber-cyan transition-all text-sm"
                  />
                </div>
                <Button
                  onClick={() => onSubmitReply(comment.id)}
                  disabled={loading || !newComment.author_name || !newComment.author_email || !newComment.content}
                  variant="primary"
                  size="sm"
                >
                  {loading ? '提交中...' : '提交回复'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* 嵌套回复 */}
      {hasReplies && (
        <div className="mt-4 space-y-4">
          {comment.replies!.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              maxDepth={maxDepth}
              allowReplies={allowReplies}
              replyingTo={replyingTo}
              onReply={onReply}
              onCancelReply={onCancelReply}
              onSubmitReply={onSubmitReply}
              replyFormVisible={false}
              newComment={newComment}
              setNewComment={setNewComment}
              loading={loading}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default CommentSystem;
