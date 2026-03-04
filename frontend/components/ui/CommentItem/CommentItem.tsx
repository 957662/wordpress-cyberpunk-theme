/**
 * CyberPress Platform - CommentItem Component
 * 评论项组件 - 赛博朋克风格
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export interface CommentItemProps {
  id: string;
  author: {
    name: string;
    avatar?: string;
    url?: string;
  };
  content: string;
  createdAt: string;
  likes?: number;
  isLiked?: boolean;
  replies?: CommentItemProps[];
  onLike?: (id: string) => void;
  onReply?: (id: string, content: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export function CommentItem({
  id,
  author,
  content,
  createdAt,
  likes = 0,
  isLiked = false,
  replies = [],
  onLike,
  onReply,
  onDelete,
  className,
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [showReplies, setShowReplies] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleReply = () => {
    if (replyContent.trim() && onReply) {
      onReply(id, replyContent);
      setReplyContent('');
      setShowReplyForm(false);
    }
  };

  const handleDelete = () => {
    if (onDelete && !isDeleting) {
      setIsDeleting(true);
      setTimeout(() => {
        onDelete(id);
      }, 300);
    }
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return '刚刚';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} 分钟前`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} 小时前`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} 天前`;
    return date.toLocaleDateString('zh-CN');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'relative bg-cyber-card border border-cyber-border rounded-lg p-4 space-y-3',
        'hover:border-cyber-cyan/30 transition-colors duration-200',
        isDeleting && 'opacity-0 scale-95',
        className
      )}
    >
      {/* 装饰线 */}
      <div className="absolute left-0 top-4 bottom-4 w-1 bg-gradient-to-b from-cyber-cyan to-cyber-purple rounded-r" />

      <div className="flex space-x-3 pl-3">
        {/* 头像 */}
        <div className="flex-shrink-0">
          {author.avatar ? (
            <img
              src={author.avatar}
              alt={author.name}
              className="w-10 h-10 rounded-full border-2 border-cyber-cyan/30"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center text-cyber-dark font-bold">
              {author.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* 内容 */}
        <div className="flex-1 min-w-0">
          {/* 作者信息 */}
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-semibold text-cyber-cyan">{author.name}</span>
            <span className="text-cyber-muted text-sm">·</span>
            <span className="text-cyber-muted text-sm">{timeAgo(createdAt)}</span>
          </div>

          {/* 评论内容 */}
          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{content}</p>

          {/* 操作按钮 */}
          <div className="flex items-center space-x-4 mt-3">
            {/* 点赞 */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onLike?.(id)}
              className={cn(
                'flex items-center space-x-1 text-sm transition-colors',
                isLiked ? 'text-cyber-pink' : 'text-cyber-muted hover:text-cyber-cyan'
              )}
            >
              <svg
                className="w-4 h-4"
                fill={isLiked ? 'currentColor' : 'none'}
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              {likes > 0 && <span>{likes}</span>}
            </motion.button>

            {/* 回复 */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-sm text-cyber-muted hover:text-cyber-cyan transition-colors"
            >
              回复
            </motion.button>

            {/* 删除 */}
            {onDelete && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDelete}
                className="text-sm text-cyber-muted hover:text-cyber-pink transition-colors"
              >
                删除
              </motion.button>
            )}
          </div>

          {/* 回复表单 */}
          {showReplyForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 space-y-2"
            >
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="写下你的回复..."
                rows={3}
                className={cn(
                  'w-full px-3 py-2 text-sm rounded-lg border border-cyber-border',
                  'bg-cyber-darker text-gray-300 placeholder-gray-500',
                  'focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50 focus:border-cyber-cyan',
                  'resize-none transition-all duration-200'
                )}
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setShowReplyForm(false);
                    setReplyContent('');
                  }}
                  className="px-3 py-1.5 text-sm text-cyber-muted hover:text-cyber-cyan transition-colors"
                >
                  取消
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReply}
                  disabled={!replyContent.trim()}
                  className={cn(
                    'px-4 py-1.5 text-sm font-medium rounded-lg',
                    'bg-cyber-cyan text-cyber-dark',
                    'hover:bg-cyber-cyan/90',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'transition-colors duration-200'
                  )}
                >
                  发送
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* 子评论 */}
          {replies.length > 0 && (
            <div className="mt-4">
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="text-sm text-cyber-cyan hover:text-cyber-purple transition-colors flex items-center space-x-1"
              >
                <svg
                  className={cn(
                    'w-4 h-4 transition-transform duration-200',
                    showReplies && 'rotate-90'
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span>{showReplies ? '收起' : '展开'} {replies.length} 条回复</span>
              </button>

              {showReplies && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 space-y-3 pl-4 border-l-2 border-cyber-border"
                >
                  {replies.map((reply) => (
                    <CommentItem
                      key={reply.id}
                      {...reply}
                      onLike={onLike}
                      onReply={onReply}
                    />
                  ))}
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
