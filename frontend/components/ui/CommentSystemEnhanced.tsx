/**
 * 增强型评论系统
 * 支持嵌套评论、点赞、排序、实时更新
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface Comment {
  id: string;
  author: {
    name: string;
    avatar?: string;
    url?: string;
  };
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  parentId?: string;
  likes?: number;
  isLiked?: boolean;
  replies?: Comment[];
}

export interface CommentSystemEnhancedProps {
  comments: Comment[];
  onAddComment: (content: string, parentId?: string) => Promise<void>;
  onDeleteComment?: (id: string) => Promise<void>;
  onLikeComment?: (id: string) => Promise<void>;
  onEditComment?: (id: string, content: string) => Promise<void>;
  currentUser?: {
    name: string;
    avatar?: string;
  };
  allowReplies?: boolean;
  allowLikes?: boolean;
  allowEditing?: boolean;
  allowDeleting?: boolean;
  maxDepth?: number;
  sortBy?: 'newest' | 'oldest' | 'popular';
  className?: string;
}

export function CommentSystemEnhanced({
  comments,
  onAddComment,
  onDeleteComment,
  onLikeComment,
  onEditComment,
  currentUser,
  allowReplies = true,
  allowLikes = true,
  allowEditing = false,
  allowDeleting = false,
  maxDepth = 3,
  sortBy = 'newest',
  className,
}: CommentSystemEnhancedProps) {
  const [sortByValue, setSortByValue] = useState(sortBy);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sortedComments = React.useMemo(() => {
    const sorted = [...comments];
    switch (sortByValue) {
      case 'newest':
        return sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      case 'oldest':
        return sorted.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      case 'popular':
        return sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      default:
        return sorted;
    }
  }, [comments, sortByValue]);

  const handleSubmit = async (content: string, parentId?: string) => {
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAddComment(content, parentId);
      setNewComment('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (id: string, content: string) => {
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onEditComment?.(id, content);
      setEditingId(null);
      setEditContent('');
    } catch (error) {
      console.error('Failed to edit comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这条评论吗？')) return;

    setIsSubmitting(true);
    try {
      await onDeleteComment?.(id);
    } catch (error) {
      console.error('Failed to delete comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (id: string) => {
    try {
      await onLikeComment?.(id);
    } catch (error) {
      console.error('Failed to like comment:', error);
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* 排序选项 */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">评论 ({comments.length})</h3>

        <select
          value={sortByValue}
          onChange={(e) => setSortByValue(e.target.value as any)}
          className="px-3 py-1.5 bg-cyber-dark border-2 border-cyber-purple/30 rounded-lg focus:border-cyber-cyan focus:outline-none text-sm"
        >
          <option value="newest">最新</option>
          <option value="oldest">最早</option>
          <option value="popular">最热</option>
        </select>
      </div>

      {/* 新评论输入框 */}
      <CommentForm
        currentUser={currentUser}
        value={newComment}
        onChange={setNewComment}
        onSubmit={() => handleSubmit(newComment)}
        isSubmitting={isSubmitting}
        placeholder="写下你的评论..."
      />

      {/* 评论列表 */}
      <div className="space-y-4">
        <AnimatePresence>
          {sortedComments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              depth={0}
              maxDepth={maxDepth}
              currentUser={currentUser}
              replyingTo={replyingTo}
              editingId={editingId}
              editContent={editContent}
              isSubmitting={isSubmitting}
              allowReplies={allowReplies}
              allowLikes={allowLikes}
              allowEditing={allowEditing}
              allowDeleting={allowDeleting}
              onReply={(id) => setReplyingTo(id)}
              onCancelReply={() => setReplyingTo(null)}
              onSubmitReply={(content) => handleSubmit(content, comment.id)}
              onStartEdit={(id, content) => {
                setEditingId(id);
                setEditContent(content);
              }}
              onCancelEdit={() => {
                setEditingId(null);
                setEditContent('');
              }}
              onSaveEdit={(id, content) => handleEdit(id, content)}
              onLike={handleLike}
              onDelete={handleDelete}
              onEditChange={setEditContent}
            />
          ))}
        </AnimatePresence>
      </div>

      {comments.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p>还没有评论，来抢沙发吧！</p>
        </div>
      )}
    </div>
  );
}

// 评论项组件
function CommentItem({
  comment,
  depth,
  maxDepth,
  currentUser,
  replyingTo,
  editingId,
  editContent,
  isSubmitting,
  allowReplies,
  allowLikes,
  allowEditing,
  allowDeleting,
  onReply,
  onCancelReply,
  onSubmitReply,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onLike,
  onDelete,
  onEditChange,
}: any) {
  const isEditing = editingId === comment.id;
  const isReplying = replyingTo === comment.id;
  const canReply = depth < maxDepth;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn('relative', depth > 0 && 'ml-8 pl-4 border-l-2 border-cyber-purple/30')}
    >
      <div className="bg-cyber-purple/5 border border-cyber-purple/20 rounded-lg p-4">
        {/* 作者信息 */}
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-shrink-0">
            {comment.author.avatar ? (
              <img
                src={comment.author.avatar}
                alt={comment.author.name}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-cyber-cyan/20 flex items-center justify-center text-cyber-cyan font-semibold">
                {comment.author.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{comment.author.name}</span>
              <span className="text-xs text-gray-400">
                {formatRelativeTime(comment.createdAt)}
              </span>
              {comment.updatedAt && comment.updatedAt.getTime() !== comment.createdAt.getTime() && (
                <span className="text-xs text-gray-500">(已编辑)</span>
              )}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-2">
            {allowEditing && currentUser?.name === comment.author.name && (
              <button
                onClick={() => onStartEdit(comment.id, comment.content)}
                className="p-1 text-gray-400 hover:text-cyber-cyan transition-colors"
              >
                ✎
              </button>
            )}
            {allowDeleting && (
              <button
                onClick={() => onDelete(comment.id)}
                className="p-1 text-gray-400 hover:text-cyber-pink transition-colors"
              >
                🗑
              </button>
            )}
          </div>
        </div>

        {/* 评论内容 */}
        {isEditing ? (
          <CommentForm
            currentUser={currentUser}
            value={editContent}
            onChange={onEditChange}
            onSubmit={() => onSaveEdit(comment.id, editContent)}
            onCancel={onCancelEdit}
            isSubmitting={isSubmitting}
            placeholder="编辑评论..."
          />
        ) : (
          <div className="prose prose-invert max-w-none mb-3">
            {comment.content}
          </div>
        )}

        {/* 操作栏 */}
        <div className="flex items-center gap-4 text-sm">
          {allowLikes && (
            <button
              onClick={() => onLike(comment.id)}
              className={cn(
                'flex items-center gap-1 transition-colors',
                comment.isLiked ? 'text-cyber-pink' : 'text-gray-400 hover:text-cyber-pink'
              )}
            >
              <span>{comment.isLiked ? '❤️' : '🤍'}</span>
              <span>{comment.likes || 0}</span>
            </button>
          )}

          {allowReplies && canReply && !isReplying && (
            <button
              onClick={() => onReply(comment.id)}
              className="text-gray-400 hover:text-cyber-cyan transition-colors"
            >
              回复
            </button>
          )}
        </div>

        {/* 回复输入框 */}
        {isReplying && (
          <div className="mt-4">
            <CommentForm
              currentUser={currentUser}
              onSubmit={onSubmitReply}
              onCancel={onCancelReply}
              isSubmitting={isSubmitting}
              placeholder={`回复 ${comment.author.name}...`}
            />
          </div>
        )}
      </div>

      {/* 子评论 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              maxDepth={maxDepth}
              currentUser={currentUser}
              replyingTo={replyingTo}
              editingId={editingId}
              editContent={editContent}
              isSubmitting={isSubmitting}
              allowReplies={allowReplies}
              allowLikes={allowLikes}
              allowEditing={allowEditing}
              allowDeleting={allowDeleting}
              onReply={onReply}
              onCancelReply={onCancelReply}
              onSubmitReply={onSubmitReply}
              onStartEdit={onStartEdit}
              onCancelEdit={onCancelEdit}
              onSaveEdit={onSaveEdit}
              onLike={onLike}
              onDelete={onDelete}
              onEditChange={onEditChange}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

// 评论表单组件
function CommentForm({
  currentUser,
  value = '',
  onChange,
  onSubmit,
  onCancel,
  isSubmitting,
  placeholder,
}: any) {
  const [content, setContent] = useState(value);

  React.useEffect(() => {
    setContent(value);
  }, [value]);

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content);
      setContent('');
    }
  };

  return (
    <div className="space-y-3">
      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          onChange?.(e.target.value);
        }}
        placeholder={placeholder}
        rows={3}
        className="w-full px-4 py-3 bg-cyber-dark border-2 border-cyber-purple/30 rounded-lg focus:border-cyber-cyan focus:outline-none resize-none"
      />

      <div className="flex justify-end gap-2">
        {onCancel && (
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 border-2 border-cyber-purple/30 text-gray-400 rounded-lg hover:border-cyber-purple/50 disabled:opacity-50"
          >
            取消
          </button>
        )}
        <button
          onClick={handleSubmit}
          disabled={!content.trim() || isSubmitting}
          className="px-4 py-2 bg-cyber-cyan text-cyber-dark rounded-lg hover:bg-cyber-cyan/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '提交中...' : '发表评论'}
        </button>
      </div>
    </div>
  );
}

// 相对时间格式化
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return '刚刚';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} 分钟前`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} 小时前`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} 天前`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} 周前`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} 月前`;

  return `${Math.floor(diffInSeconds / 31536000)} 年前`;
}
