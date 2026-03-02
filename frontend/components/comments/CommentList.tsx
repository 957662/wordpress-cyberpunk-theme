'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { User, Reply, Trash2, Flag } from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  createdAt: string;
  parentId?: string;
  likes: number;
  isLiked?: boolean;
}

interface CommentListProps {
  comments: Comment[];
  onReply?: (commentId: string, content: string) => void;
  onDelete?: (commentId: string) => void;
  onLike?: (commentId: string) => void;
  onReport?: (commentId: string) => void;
  currentUser?: {
    id: string;
    name: string;
    avatar?: string;
  };
  colorScheme?: 'cyan' | 'purple' | 'pink' | 'green' | 'orange' | 'blue';
  className?: string;
}

const colorSchemes = {
  cyan: {
    primary: 'from-cyan-500 to-blue-500',
    secondary: 'text-cyan-400',
    border: 'border-cyan-500/30',
    bg: 'bg-cyan-500/10',
    glow: 'shadow-cyan-500/20',
  },
  purple: {
    primary: 'from-purple-500 to-pink-500',
    secondary: 'text-purple-400',
    border: 'border-purple-500/30',
    bg: 'bg-purple-500/10',
    glow: 'shadow-purple-500/20',
  },
  pink: {
    primary: 'from-pink-500 to-rose-500',
    secondary: 'text-pink-400',
    border: 'border-pink-500/30',
    bg: 'bg-pink-500/10',
    glow: 'shadow-pink-500/20',
  },
  green: {
    primary: 'from-green-500 to-emerald-500',
    secondary: 'text-green-400',
    border: 'border-green-500/30',
    bg: 'bg-green-500/10',
    glow: 'shadow-green-500/20',
  },
  orange: {
    primary: 'from-orange-500 to-amber-500',
    secondary: 'text-orange-400',
    border: 'border-orange-500/30',
    bg: 'bg-orange-500/10',
    glow: 'shadow-orange-500/20',
  },
  blue: {
    primary: 'from-blue-500 to-cyan-500',
    secondary: 'text-blue-400',
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/10',
    glow: 'shadow-blue-500/20',
  },
};

export const CommentList: React.FC<CommentListProps> = ({
  comments,
  onReply,
  onDelete,
  onLike,
  onReport,
  currentUser,
  colorScheme = 'cyan',
  className = '',
}) => {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const colors = colorSchemes[colorScheme];

  // 构建评论树
  const buildCommentTree = (comments: Comment[]) => {
    const map = new Map<string, Comment & { replies: Comment[] }>();
    const roots: (Comment & { replies: Comment[] })[] = [];

    // 初始化 map
    comments.forEach(comment => {
      map.set(comment.id, { ...comment, replies: [] });
    });

    // 构建树
    comments.forEach(comment => {
      const node = map.get(comment.id)!;
      if (comment.parentId) {
        const parent = map.get(comment.parentId);
        if (parent) {
          parent.replies.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    return roots;
  };

  const commentTree = buildCommentTree(comments);

  const handleReply = (commentId: string) => {
    if (replyContent.trim() && onReply) {
      onReply(commentId, replyContent);
      setReplyContent('');
      setReplyingTo(null);
    }
  };

  const toggleReplies = (commentId: string) => {
    const newExpanded = new Set(expandedReplies);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedReplies(newExpanded);
  };

  const renderComment = (comment: Comment & { replies: Comment[] }, depth: number = 0) => {
    const isAuthor = currentUser && comment.author === currentUser.name;
    const hasReplies = comment.replies.length > 0;
    const showReplies = expandedReplies.has(comment.id);

    return (
      <motion.div
        key={comment.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`${depth > 0 ? 'ml-8 md:ml-12' : ''} mb-4`}
      >
        <div
          className={`relative backdrop-blur-sm bg-gray-900/60 border ${colors.border} rounded-lg p-4 ${colors.glow} hover:shadow-lg transition-all duration-300`}
        >
          {/* 头像和用户信息 */}
          <div className="flex items-start gap-3 mb-3">
            <div
              className={`w-10 h-10 rounded-full bg-gradient-to-br ${colors.primary} flex items-center justify-center flex-shrink-0`}
            >
              {comment.avatar ? (
                <img
                  src={comment.avatar}
                  alt={comment.author}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-white">{comment.author}</span>
                {isAuthor && (
                  <span className={`px-2 py-0.5 text-xs rounded-full ${colors.bg} ${colors.secondary}`}>
                    作者
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-400">
                {formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                  locale: zhCN,
                })}
              </span>
            </div>
          </div>

          {/* 评论内容 */}
          <div className="text-gray-200 mb-3 leading-relaxed whitespace-pre-wrap">
            {comment.content}
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center gap-2 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onLike?.(comment.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${colors.bg} ${colors.secondary} hover:opacity-80`}
            >
              <span className="text-sm">{comment.likes}</span>
              <span className="text-sm">赞</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${colors.bg} ${colors.secondary} hover:opacity-80`}
            >
              <Reply className="w-4 h-4" />
              <span className="text-sm">回复</span>
            </motion.button>

            {hasReplies && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleReplies(comment.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${colors.bg} ${colors.secondary} hover:opacity-80`}
              >
                <span className="text-sm">{showReplies ? '收起' : '展开'}</span>
                <span className="text-sm">({comment.replies.length})</span>
              </motion.button>
            )}

            {isAuthor && onDelete && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onDelete(comment.id)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all bg-red-500/10 text-red-400 hover:opacity-80"
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-sm">删除</span>
              </motion.button>
            )}

            {onReport && !isAuthor && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onReport(comment.id)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all bg-gray-500/10 text-gray-400 hover:opacity-80"
              >
                <Flag className="w-4 h-4" />
                <span className="text-sm">举报</span>
              </motion.button>
            )}
          </div>

          {/* 回复输入框 */}
          <AnimatePresence>
            {replyingTo === comment.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-3"
              >
                <textarea
                  value={replyContent}
                  onChange={e => setReplyContent(e.target.value)}
                  placeholder="写下你的回复..."
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 resize-none"
                  rows={3}
                />
                <div className="flex gap-2 mt-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleReply(comment.id)}
                    disabled={!replyContent.trim()}
                    className={`px-4 py-2 rounded-lg bg-gradient-to-r ${colors.primary} text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    发送回复
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyContent('');
                    }}
                    className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600"
                  >
                    取消
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 子评论 */}
        {hasReplies && showReplies && (
          <div className="mt-2">
            {comment.replies.map(reply => renderComment({ ...reply, replies: [] }, depth + 1))}
          </div>
        )}
      </motion.div>
    );
  };

  if (comments.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-gray-400 mb-2">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-lg">暂无评论</p>
          <p className="text-sm">成为第一个评论的人吧！</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="space-y-2">
        {commentTree.map(comment => renderComment(comment))}
      </div>
    </div>
  );
};

export default CommentList;
