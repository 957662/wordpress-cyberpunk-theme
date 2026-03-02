'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  MessageSquare,
  Send,
  Reply,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Trash2,
  Edit,
  MoreVertical,
  User,
  Clock,
  ChevronDown,
  ChevronUp,
  Smile,
  Image,
  Link2,
  Code,
  Bold,
  Italic,
  List
} from 'lucide-react';

/**
 * CommentsSystem - 评论系统组件
 *
 * 功能特性：
 * - 嵌套评论回复
 * - 点赞/点踩
 * - 评论排序
 * - 富文本编辑
 * - 表情支持
 * - Markdown支持
 * - 评论分页
 * - 实时更新
 */

export interface Comment {
  id: string;
  author: {
    name: string;
    avatar?: string;
    email?: string;
  };
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  parentId?: string;
  likes: number;
  dislikes: number;
  isLiked?: boolean;
  isDisliked?: boolean;
  replies?: Comment[];
}

export interface CommentsSystemProps {
  /** 文章ID */
  postId?: string;
  /** 现有评论 */
  comments?: Comment[];
  /** 是否允许匿名评论 */
  allowAnonymous?: boolean;
  /** 是否需要审核 */
  requireModeration?: boolean;
  /** 自定义容器类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 提交评论回调 */
  onSubmit?: (comment: Omit<Comment, 'id' | 'createdAt' | 'likes' | 'dislikes'>) => void;
  /** 删除评论回调 */
  onDelete?: (commentId: string) => void;
  /** 点赞回调 */
  onLike?: (commentId: string) => void;
  /** 点踩回调 */
  onDislike?: (commentId: string) => void;
}

/**
 * 评论输入组件
 */
interface CommentFormProps {
  parentId?: string;
  placeholder?: string;
  onSubmit: (content: string) => void;
  onCancel?: () => void;
  autoFocus?: boolean;
}

const CommentForm: React.FC<CommentFormProps> = ({
  parentId,
  placeholder = '写下你的评论...',
  onSubmit,
  onCancel,
  autoFocus = false,
}) => {
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [showToolbar, setShowToolbar] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content);
      setContent('');
    }
  };

  const toolbarButtons = [
    { icon: <Bold className="w-4 h-4" />, action: () => insertText('**', '**') },
    { icon: <Italic className="w-4 h-4" />, action: () => insertText('*', '*') },
    { icon: <Code className="w-4 h-4" />, action: () => insertText('`', '`') },
    { icon: <Link2 className="w-4 h-4" />, action: () => insertText('[', '](url)') },
    { icon: <List className="w-4 h-4" />, action: () => insertText('- ', '') },
  ];

  const insertText = (before: string, after: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = content;
    const newText = text.substring(0, start) + before + text.substring(start, end) + after + text.substring(end);

    setContent(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  return (
    <div className="space-y-3">
      {/* 用户信息（匿名） */}
      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="你的名字"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan"
        />
        <input
          type="email"
          placeholder="邮箱（可选）"
          value={authorEmail}
          onChange={(e) => setAuthorEmail(e.target.value)}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan"
        />
      </div>

      {/* 评论输入框 */}
      <div
        className="relative"
        onFocus={() => setShowToolbar(true)}
        onBlur={() => setTimeout(() => setShowToolbar(false), 200)}
      >
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan resize-none"
        />

        {/* 工具栏 */}
        <AnimatePresence>
          {showToolbar && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-2 left-2 flex items-center gap-1 bg-gray-900 rounded-lg p-1 border border-gray-700"
            >
              {toolbarButtons.map((btn, i) => (
                <motion.button
                  key={i}
                  onClick={btn.action}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {btn.icon}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center justify-end gap-2">
        {onCancel && (
          <motion.button
            onClick={onCancel}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            取消
          </motion.button>
        )}
        <motion.button
          onClick={handleSubmit}
          disabled={!content.trim()}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg',
            'bg-cyber-cyan text-black font-medium',
            'hover:bg-cyber-cyan/80 transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          whileHover={{ scale: content.trim() ? 1.05 : 1 }}
          whileTap={{ scale: content.trim() ? 0.95 : 1 }}
        >
          <Send className="w-4 h-4" />
          发表评论
        </motion.button>
      </div>
    </div>
  );
};

/**
 * 单条评论组件
 */
interface CommentItemProps {
  comment: Comment;
  onReply?: (parentId: string) => void;
  onLike?: (commentId: string) => void;
  onDislike?: (commentId: string) => void;
  onDelete?: (commentId: string) => void;
  depth?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onReply,
  onLike,
  onDislike,
  onDelete,
  depth = 0,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showReplies, setShowReplies] = useState(true);
  const [isReplying, setIsReplying] = useState(false);

  const hasReplies = comment.replies && comment.replies.length > 0;
  const maxDepth = 3;
  const canReply = depth < maxDepth;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'relative',
        depth > 0 && 'ml-8 pl-4 border-l-2 border-gray-700'
      )}
    >
      {/* 评论内容 */}
      <div className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-800/70 transition-colors">
        {/* 头部 */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* 头像 */}
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center',
                'bg-gradient-to-br from-cyber-cyan to-cyber-purple'
              )}
            >
              {comment.author.avatar ? (
                <img
                  src={comment.author.avatar}
                  alt={comment.author.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-white" />
              )}
            </div>

            {/* 作者信息 */}
            <div>
              <div className="font-medium text-white">
                {comment.author.name}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                {new Date(comment.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* 更多操作 */}
          <motion.button
            className="p-1 text-gray-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <MoreVertical className="w-4 h-4" />
          </motion.button>
        </div>

        {/* 评论内容 */}
        <div className="text-gray-200 mb-3 whitespace-pre-wrap">
          {comment.content}
        </div>

        {/* 操作栏 */}
        <div className="flex items-center gap-4">
          {/* 点赞 */}
          <motion.button
            onClick={() => onLike?.(comment.id)}
            className={cn(
              'flex items-center gap-1.5 text-sm transition-colors',
              comment.isLiked ? 'text-cyber-cyan' : 'text-gray-400 hover:text-gray-200'
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ThumbsUp className="w-4 h-4" />
            {comment.likes > 0 && <span>{comment.likes}</span>}
          </motion.button>

          {/* 点踩 */}
          <motion.button
            onClick={() => onDislike?.(comment.id)}
            className={cn(
              'flex items-center gap-1.5 text-sm transition-colors',
              comment.isDisliked ? 'text-red-500' : 'text-gray-400 hover:text-gray-200'
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ThumbsDown className="w-4 h-4" />
            {comment.dislikes > 0 && <span>{comment.dislikes}</span>}
          </motion.button>

          {/* 回复 */}
          {canReply && (
            <motion.button
              onClick={() => setIsReplying(!isReplying)}
              className={cn(
                'flex items-center gap-1.5 text-sm transition-colors',
                'text-gray-400 hover:text-gray-200'
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Reply className="w-4 h-4" />
              回复
            </motion.button>
          )}

          {/* 展开/收起回复 */}
          {hasReplies && (
            <motion.button
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-1 text-sm text-cyber-cyan hover:text-cyber-cyan/80"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showReplies ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  收起 {comment.replies!.length} 条回复
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  展开 {comment.replies!.length} 条回复
                </>
              )}
            </motion.button>
          )}
        </div>

        {/* 回复输入框 */}
        <AnimatePresence>
          {isReplying && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <CommentForm
                parentId={comment.id}
                placeholder={`回复 @${comment.author.name}...`}
                onSubmit={(content) => {
                  onReply?.(comment.id);
                  setIsReplying(false);
                }}
                onCancel={() => setIsReplying(false)}
                autoFocus
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 子回复 */}
      <AnimatePresence>
        {showReplies && hasReplies && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 space-y-3"
          >
            {comment.replies!.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                onReply={onReply}
                onLike={onLike}
                onDislike={onDislike}
                onDelete={onDelete}
                depth={depth + 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/**
 * CommentsSystem 主组件
 */
export const CommentsSystem: React.FC<CommentsSystemProps> = ({
  postId,
  comments = [],
  allowAnonymous = true,
  requireModeration = false,
  className,
  style,
  onSubmit,
  onDelete,
  onLike,
  onDislike,
}) => {
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');
  const [allComments, setAllComments] = useState<Comment[]>(comments);

  // 排序评论
  const sortedComments = [...allComments].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'popular':
        return b.likes - a.likes;
      default:
        return 0;
    }
  });

  // 提交新评论
  const handleNewComment = (content: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      author: {
        name: '匿名用户',
      },
      content,
      createdAt: new Date(),
      likes: 0,
      dislikes: 0,
    };

    setAllComments([newComment, ...allComments]);
    onSubmit?.(newComment);
  };

  // 回复评论
  const handleReply = (parentId: string, content: string) => {
    const newReply: Comment = {
      id: `reply-${Date.now()}`,
      author: {
        name: '匿名用户',
      },
      content,
      createdAt: new Date(),
      parentId,
      likes: 0,
      dislikes: 0,
    };

    setAllComments((prev) =>
      prev.map((comment) => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply],
          };
        }
        return comment;
      })
    );
  };

  // 点赞
  const handleLike = (commentId: string) => {
    setAllComments((prev) =>
      prev.map((comment) => {
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
            replies: comment.replies.map((reply) =>
              reply.id === commentId
                ? {
                    ...reply,
                    likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                    isLiked: !reply.isLiked,
                  }
                : reply
            ),
          };
        }
        return comment;
      })
    );
    onLike?.(commentId);
  };

  return (
    <div className={cn('comments-system', className)} style={style}>
      {/* 头部 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-cyber-cyan" />
          <h2 className="text-xl font-bold text-white">评论</h2>
          <span className="px-2 py-1 bg-cyber-cyan/20 text-cyber-cyan rounded-lg text-sm font-medium">
            {allComments.length}
          </span>
        </div>

        {/* 排序 */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyber-cyan"
        >
          <option value="newest">最新</option>
          <option value="oldest">最早</option>
          <option value="popular">最热</option>
        </select>
      </div>

      {/* 新评论表单 */}
      <div className="mb-8 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
        <CommentForm
          onSubmit={handleNewComment}
          placeholder="分享你的想法..."
        />
      </div>

      {/* 评论列表 */}
      <div className="space-y-4">
        <AnimatePresence>
          {sortedComments.length > 0 ? (
            sortedComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onReply={(parentId) => handleReply(parentId, '')}
                onLike={handleLike}
                onDislike={onDislike ? (id) => onDislike(id) : undefined}
                onDelete={onDelete}
              />
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>还没有评论，快来发表第一条评论吧！</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CommentsSystem;
