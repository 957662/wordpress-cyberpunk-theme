/**
 * CommentItem Component
 * 评论项组件
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Reply, MoreVertical, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TimeAgo } from '@/components/ui';
import { Avatar } from '@/components/ui/avatar';

export interface CommentItemProps {
  id: string;
  author: {
    name: string;
    avatar?: string;
    url?: string;
  };
  content: string;
  createdAt: string;
  updatedAt?: string;
  likes?: number;
  dislikes?: number;
  isLiked?: boolean;
  isDisliked?: boolean;
  isAuthor?: boolean;
  replies?: CommentItemProps[];
  onReply?: (id: string) => void;
  onLike?: (id: string) => void;
  onDislike?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onReport?: (id: string) => void;
  variant?: 'default' | 'nested' | 'threaded';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  id,
  author,
  content,
  createdAt,
  updatedAt,
  likes = 0,
  dislikes = 0,
  isLiked = false,
  isDisliked = false,
  isAuthor = false,
  replies = [],
  onReply,
  onLike,
  onDislike,
  onEdit,
  onDelete,
  onReport,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const [showReplies, setShowReplies] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const sizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const handleReplySubmit = () => {
    if (replyContent.trim()) {
      onReply?.(id);
      setReplyContent('');
      setIsReplying(false);
    }
  };

  return (
    <div
      className={cn(
        'relative',
        variant === 'nested' && 'ml-8 pl-4 border-l-2 border-cyber-border',
        className
      )}
    >
      {/* Main Comment */}
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <Avatar
            src={author.avatar}
            alt={author.name}
            size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'}
            className={cn(
              isAuthor && 'ring-2 ring-cyber-cyan'
            )}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className={cn('font-semibold text-white', sizeStyles[size])}>
              {author.name}
            </span>
            {isAuthor && (
              <span className="px-2 py-0.5 text-xs bg-cyber-cyan/20 text-cyber-cyan rounded-full">
                作者
              </span>
            )}
            <span className="text-xs text-gray-500">
              <TimeAgo date={createdAt} />
            </span>
          </div>

          {/* Comment Content */}
          <div
            className={cn(
              'text-gray-300 mb-3 prose prose-invert prose-sm max-w-none',
              sizeStyles[size]
            )}
            dangerouslySetInnerHTML={{ __html: content }}
          />

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Like */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onLike?.(id)}
              className={cn(
                'flex items-center gap-1 text-sm transition-colors',
                isLiked ? 'text-cyber-cyan' : 'text-gray-500 hover:text-gray-300'
              )}
            >
              <ThumbsUp size={16} />
              <span>{likes > 0 && likes}</span>
            </motion.button>

            {/* Dislike */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDislike?.(id)}
              className={cn(
                'flex items-center gap-1 text-sm transition-colors',
                isDisliked ? 'text-cyber-pink' : 'text-gray-500 hover:text-gray-300'
              )}
            >
              <ThumbsDown size={16} />
              <span>{dislikes > 0 && dislikes}</span>
            </motion.button>

            {/* Reply */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsReplying(!isReplying)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              <Reply size={16} />
              <span>回复</span>
            </motion.button>

            {/* More Options */}
            <div className="relative group">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-500 hover:text-gray-300 transition-colors"
              >
                <MoreVertical size={16} />
              </motion.button>

              {/* Dropdown Menu */}
              <div className="absolute left-0 top-full mt-2 w-48 bg-cyber-card border border-cyber-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="py-1">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(id)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-cyber-cyan/10 hover:text-cyber-cyan transition-colors"
                    >
                      编辑
                    </button>
                  )}
                  {onReport && (
                    <button
                      onClick={() => onReport(id)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-cyber-pink/10 hover:text-cyber-pink transition-colors flex items-center gap-2"
                    >
                      <Flag size={14} />
                      举报
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(id)}
                      className="w-full px-4 py-2 text-left text-sm text-cyber-pink hover:bg-cyber-pink/10 transition-colors"
                    >
                      删除
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Reply Form */}
          <AnimatePresence>
            {isReplying && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4"
              >
                <div className="space-y-2">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="写下你的回复..."
                    className="w-full px-3 py-2 bg-cyber-dark border border-cyber-border rounded-lg text-white placeholder-gray-500 focus:border-cyber-cyan focus:outline-none focus:ring-2 focus:ring-cyber-cyan/20 resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsReplying(false)}
                      className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      取消
                    </button>
                    <button
                      onClick={handleReplySubmit}
                      disabled={!replyContent.trim()}
                      className="px-4 py-2 text-sm bg-cyber-cyan text-cyber-dark rounded-lg hover:bg-cyber-cyan/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      回复
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Replies Toggle */}
          {replies && replies.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowReplies(!showReplies)}
              className="mt-3 text-sm text-cyber-cyan hover:text-cyber-cyan/80 transition-colors"
            >
              {showReplies ? '隐藏' : '查看'} {replies.length} 条回复
            </motion.button>
          )}
        </div>
      </div>

      {/* Nested Replies */}
      <AnimatePresence>
        {showReplies && replies && replies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 space-y-4"
          >
            {replies.map((reply) => (
              <CommentItem
                key={reply.id}
                {...reply}
                variant="nested"
                size={size}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommentItem;
