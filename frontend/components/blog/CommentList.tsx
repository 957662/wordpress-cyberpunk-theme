/**
 * 评论列表组件
 * 完整实现评论展示和回复功能
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Clock, MessageSquare, ThumbsUp, Reply } from 'lucide-react';
import { useComments } from '@/lib/wordpress/hooks';
import { CommentForm } from './CommentForm';

interface Comment {
  id: number;
  author_name: string;
  author_url?: string;
  date: string;
  content: { rendered: string };
  parent: number;
}

interface CommentListProps {
  postId: number;
  maxDepth?: number;
}

function CommentItem({
  comment,
  postId,
  depth = 0,
  maxDepth = 3,
  onReplySuccess,
}: {
  comment: Comment;
  postId: number;
  depth?: number;
  maxDepth?: number;
  onReplySuccess?: () => void;
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return diffMinutes === 0 ? '刚刚' : `${diffMinutes}分钟前`;
      }
      return `${diffHours}小时前`;
    } else if (diffDays === 1) {
      return '昨天';
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else {
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
  };

  // 移除 HTML 标签
  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const handleReplySuccess = () => {
    setShowReplyForm(false);
    onReplySuccess?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative ${depth > 0 ? 'ml-8 md:ml-12' : ''}`}
    >
      {/* 左侧连接线 */}
      {depth > 0 && (
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-cyber-cyan/50 to-transparent" />
      )}

      <div className="bg-cyber-dark/30 border border-cyber-border rounded-lg p-4 hover:border-cyber-cyan/50 transition-all">
        {/* 评论头部 */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            {/* 头像 */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center text-white font-bold">
              {comment.author_name.charAt(0).toUpperCase()}
            </div>

            {/* 作者信息 */}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">
                  {comment.author_name}
                </span>
                {depth === 0 && (
                  <span className="px-2 py-0.5 text-xs bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 rounded-full">
                    楼主
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                <Clock className="w-3 h-3" />
                <time dateTime={comment.date}>{formatDate(comment.date)}</time>
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center gap-2">
            {depth < maxDepth && (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-400 hover:text-cyber-cyan hover:bg-cyber-cyan/10 rounded-lg transition-all"
              >
                <Reply className="w-3 h-3" />
                <span>回复</span>
              </button>
            )}
          </div>
        </div>

        {/* 评论内容 */}
        <div className="text-gray-300 text-sm leading-relaxed mb-3">
          {stripHtml(comment.content.rendered)}
        </div>

        {/* 评论底部 */}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <button className="flex items-center gap-1 hover:text-cyber-cyan transition-colors">
            <ThumbsUp className="w-3 h-3" />
            <span>点赞</span>
          </button>
          <button className="hover:text-cyber-cyan transition-colors">
            举报
          </button>
        </div>

        {/* 回复表单 */}
        <AnimatePresence>
          {showReplyForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4"
            >
              <CommentForm
                postId={postId}
                parentId={comment.id}
                onSuccess={handleReplySuccess}
                onCancel={() => setShowReplyForm(false)}
                showCancel
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function CommentList({ postId, maxDepth = 3 }: CommentListProps) {
  const { data: comments, loading, error, refetch } = useComments(postId);

  // 构建评论树
  const buildCommentTree = (flatComments: Comment[]): Comment[] => {
    const commentMap = new Map();
    const rootComments: Comment[] = [];

    // 先创建所有评论的映射
    flatComments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // 构建树形结构
    flatComments.forEach(comment => {
      if (comment.parent === 0) {
        rootComments.push(commentMap.get(comment.id));
      } else {
        const parent = commentMap.get(comment.parent);
        if (parent) {
          if (!parent.replies) parent.replies = [];
          parent.replies.push(commentMap.get(comment.id));
        }
      }
    });

    return rootComments;
  };

  // 渲染评论树
  const renderCommentTree = (comments: Comment[], depth: number = 0) => {
    return comments.map(comment => (
      <div key={comment.id}>
        <CommentItem
          comment={comment}
          postId={postId}
          depth={depth}
          maxDepth={maxDepth}
          onReplySuccess={refetch}
        />
        {(comment as any).replies && (comment as any).replies.length > 0 && (
          <div className="mt-4">
            {renderCommentTree((comment as any).replies, depth + 1)}
          </div>
        )}
      </div>
    ));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-cyber-muted" />
              <div className="flex-1">
                <div className="h-4 bg-cyber-muted rounded w-24 mb-2" />
                <div className="h-3 bg-cyber-muted rounded w-32" />
              </div>
            </div>
            <div className="h-16 bg-cyber-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">加载评论失败：{error}</p>
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-500">暂无评论，快来抢沙发吧！</p>
      </div>
    );
  }

  const commentTree = buildCommentTree(comments);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-cyber-cyan" />
          <span>评论 ({comments.length})</span>
        </h3>
        <button
          onClick={() => refetch()}
          className="text-sm text-cyber-cyan hover:text-cyber-pink transition-colors"
        >
          刷新
        </button>
      </div>

      <div className="space-y-6">
        {renderCommentTree(commentTree)}
      </div>
    </div>
  );
}

export default CommentList;
