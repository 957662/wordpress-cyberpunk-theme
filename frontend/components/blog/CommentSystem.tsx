'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, ThumbsUp, Reply, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

export interface Comment {
  id: string;
  author: {
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
  replies?: Comment[];
  parentId?: string;
}

interface CommentSystemProps {
  postId: string | number;
  comments?: Comment[];
  onAddComment?: (content: string, parentId?: string) => Promise<Comment>;
  onLikeComment?: (commentId: string) => void;
  className?: string;
}

// ============================================================================
// Comment Item Component
// ============================================================================

interface CommentItemProps {
  comment: Comment;
  depth?: number;
  onReply?: (parentId: string) => void;
  onLike?: (commentId: string) => void;
  showReplies?: boolean;
  onToggleReplies?: (commentId: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  depth = 0,
  onReply,
  onLike,
  showReplies = true,
  onToggleReplies,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('relative', depth > 0 && 'ml-12 pl-6 border-l-2 border-gray-200 dark:border-gray-700')}
    >
      {/* Comment Header */}
      <div className="flex items-start gap-3 mb-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {comment.author.avatar ? (
            <img
              src={comment.author.avatar}
              alt={comment.author.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold">
              {comment.author.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {comment.author.name}
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
              <button
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                aria-label="More options"
              >
                <MoreVertical size={14} className="text-gray-500" />
              </button>
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            {comment.content}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-3">
            <button
              onClick={() => onLike?.(comment.id)}
              className={cn(
                'flex items-center gap-1.5 text-sm transition-colors',
                comment.isLiked
                  ? 'text-cyan-600 dark:text-cyan-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400'
              )}
            >
              <ThumbsUp size={14} className={comment.isLiked ? 'fill-current' : ''} />
              <span>{comment.likes || 0}</span>
            </button>

            <button
              onClick={() => onReply?.(comment.id)}
              className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            >
              <Reply size={14} />
              <span>回复</span>
            </button>

            {hasReplies && (
              <button
                onClick={() => {
                  setIsExpanded(!isExpanded);
                  onToggleReplies?.(comment.id);
                }}
                className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
              >
                <MessageSquare size={14} />
                <span>
                  {isExpanded ? '收起' : '展开'} {comment.replies?.length} 条回复
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Nested Replies */}
      {hasReplies && isExpanded && (
        <div className="space-y-4 mt-4">
          {comment.replies!.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              onReply={onReply}
              onLike={onLike}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

// ============================================================================
// Comment Form Component
// ============================================================================

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  onCancel?: () => void;
  placeholder?: string;
  buttonText?: string;
  replyTo?: string;
}

const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  onCancel,
  placeholder = '写下你的评论...',
  buttonText = '发表评论',
  replyTo,
}) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(content);
      setContent('');
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={replyTo ? `回复 @${replyTo}` : placeholder}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
        rows={3}
        disabled={isSubmitting}
      />

      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          支持 Markdown 语法
        </div>

        <div className="flex items-center gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              disabled={isSubmitting}
            >
              取消
            </button>
          )}
          <button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className={cn(
              'px-6 py-2 rounded-lg text-sm font-medium text-white',
              'bg-gradient-to-r from-cyan-500 to-purple-500',
              'hover:from-cyan-600 hover:to-purple-600',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'transition-all duration-200',
              'shadow-lg shadow-cyan-500/25'
            )}
          >
            {isSubmitting ? '发布中...' : buttonText}
          </button>
        </div>
      </div>
    </form>
  );
};

// ============================================================================
// Main Comment System Component
// ============================================================================

export const CommentSystem: React.FC<CommentSystemProps> = ({
  postId,
  comments = [],
  onAddComment,
  onLikeComment,
  className,
}) => {
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [localComments, setLocalComments] = useState<Comment[]>(comments);

  const handleAddComment = async (content: string, parentId?: string) => {
    if (!onAddComment) return;

    const newComment = await onAddComment(content, parentId);
    
    if (parentId) {
      // Add as reply
      setLocalComments((prev) =>
        prev.map((comment) =>
          comment.id === parentId
            ? {
                ...comment,
                replies: [...(comment.replies || []), newComment],
              }
            : comment
        )
      );
    } else {
      // Add as top-level comment
      setLocalComments((prev) => [newComment, ...prev]);
    }

    setReplyTo(null);
  };

  const handleLike = (commentId: string) => {
    if (!onLikeComment) return;

    onLikeComment(commentId);

    // Update local state
    const updateCommentLikes = (comments: Comment[]): Comment[] => {
      return comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            isLiked: !comment.isLiked,
          };
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: updateCommentLikes(comment.replies),
          };
        }
        return comment;
      });
    };

    setLocalComments(updateCommentLikes);
  };

  return (
    <div className={cn('space-y-8', className)}>
      {/* Comment Form */}
      <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          发表评论
        </h3>
        <CommentForm
          onSubmit={(content) => handleAddComment(content)}
          replyTo={replyTo || undefined}
          onCancel={replyTo ? () => setReplyTo(null) : undefined}
        />
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          评论 ({localComments.length})
        </h3>

        {localComments.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
            <p>还没有评论，快来抢沙发吧！</p>
          </div>
        ) : (
          <div className="space-y-6">
            {localComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onReply={(id) => {
                  const parentComment = localComments.find(c => c.id === id);
                  setReplyTo(parentComment?.author.name || id);
                }}
                onLike={handleLike}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSystem;
