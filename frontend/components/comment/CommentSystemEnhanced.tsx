'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Reply, Trash2, Edit2, ChevronDown, ChevronUp, ThumbsUp, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

// Types
export interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    role?: 'admin' | 'moderator' | 'user';
  };
  post_id: string;
  parent_id?: string;
  created_at: string;
  updated_at?: string;
  likes_count?: number;
  is_liked?: boolean;
  replies?: Comment[];
  status: 'approved' | 'pending' | 'spam';
}

export interface CommentSystemProps {
  postId: string;
  userId?: string;
  allowNested?: boolean;
  maxDepth?: number;
  showReplies?: boolean;
  autoLoadReplies?: boolean;
  enableModeration?: boolean;
  enableRealtime?: boolean;
  className?: string;
  apiBaseUrl?: string;
}

// Comment Item Component
interface CommentItemProps {
  comment: Comment;
  depth?: number;
  maxDepth?: number;
  onReply: (commentId: string, authorName: string) => void;
  onEdit: (comment: Comment) => void;
  onDelete: (commentId: string) => void;
  onLike: (commentId: string) => void;
  onToggleReplies?: (commentId: string) => void;
  showReplies?: boolean;
  enableModeration?: boolean;
  userId?: string;
  expandedReplies: Set<string>;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  depth = 0,
  maxDepth = 3,
  onReply,
  onEdit,
  onDelete,
  onLike,
  onToggleReplies,
  showReplies = true,
  enableModeration = false,
  userId,
  expandedReplies,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const canReply = depth < maxDepth;
  const canModerate = enableModeration && (userId === comment.author.id || comment.author.role === 'admin');
  const hasReplies = comment.replies && comment.replies.length > 0;
  const isExpanded = expandedReplies.has(comment.id);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={cn(
        'relative',
        depth > 0 && 'ml-8 md:ml-12 pl-6 border-l-2 border-cyber-cyan/20'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={cn(
        'p-4 rounded-lg cyber-card transition-all duration-300',
        isHovered && 'border-cyber-cyan/50 shadow-[0_0_20px_rgba(0,240,255,0.1)]'
      )}>
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {comment.author.avatar ? (
              <img
                src={comment.author.avatar}
                alt={comment.author.name}
                className="w-10 h-10 rounded-full border-2 border-cyber-cyan/30"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center text-white font-bold">
                {comment.author.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Author Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-white text-sm">{comment.author.name}</h4>
              {comment.author.role && comment.author.role !== 'user' && (
                <span className={cn(
                  'px-2 py-0.5 text-xs rounded-full',
                  comment.author.role === 'admin' && 'bg-cyber-pink/20 text-cyber-pink',
                  comment.author.role === 'moderator' && 'bg-cyber-cyan/20 text-cyber-cyan'
                )}>
                  {comment.author.role}
                </span>
              )}
            </div>
            <time className="text-xs text-cyber-muted">
              {new Date(comment.created_at).toLocaleString()}
            </time>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Like */}
            <button
              onClick={() => onLike(comment.id)}
              className={cn(
                'p-2 rounded-lg transition-all duration-300',
                'hover:bg-cyber-cyan/10 hover:text-cyber-cyan',
                comment.is_liked && 'text-cyber-cyan bg-cyber-cyan/10'
              )}
            >
              <ThumbsUp className="h-4 w-4" />
            </button>

            {/* Reply */}
            {canReply && (
              <button
                onClick={() => onReply(comment.id, comment.author.name)}
                className="p-2 rounded-lg hover:bg-cyber-cyan/10 hover:text-cyber-cyan transition-all duration-300"
              >
                <Reply className="h-4 w-4" />
              </button>
            )}

            {/* Edit/Delete */}
            {canModerate && (
              <>
                <button
                  onClick={() => onEdit(comment)}
                  className="p-2 rounded-lg hover:bg-cyber-yellow/10 hover:text-cyber-yellow transition-all duration-300"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(comment.id)}
                  className="p-2 rounded-lg hover:bg-cyber-pink/10 hover:text-cyber-pink transition-all duration-300"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
          {comment.content}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-cyber-muted/20">
          {/* Likes */}
          {comment.likes_count !== undefined && comment.likes_count > 0 && (
            <div className="flex items-center gap-1 text-xs text-cyber-muted">
              <ThumbsUp className="h-3 w-3" />
              <span>{comment.likes_count}</span>
            </div>
          )}

          {/* Toggle Replies */}
          {hasReplies && onToggleReplies && (
            <button
              onClick={() => onToggleReplies(comment.id)}
              className="flex items-center gap-1 text-xs text-cyber-cyan hover:text-cyber-cyan/80 transition-colors"
            >
              {comment.replies!.length} {comment.replies!.length === 1 ? 'reply' : 'replies'}
              {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          )}
        </div>

        {/* Nested Replies */}
        {hasReplies && showReplies && isExpanded && (
          <div className="mt-4 space-y-4">
            {comment.replies!.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                depth={depth + 1}
                maxDepth={maxDepth}
                onReply={onReply}
                onEdit={onEdit}
                onDelete={onDelete}
                onLike={onLike}
                onToggleReplies={onToggleReplies}
                showReplies={showReplies}
                enableModeration={enableModeration}
                userId={userId}
                expandedReplies={expandedReplies}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Comment Form Component
interface CommentFormProps {
  postId: string;
  parentId?: string;
  replyTo?: string;
  onCancelReply?: () => void;
  onSubmitSuccess?: () => void;
  apiBaseUrl?: string;
}

const CommentForm: React.FC<CommentFormProps> = ({
  postId,
  parentId,
  replyTo,
  onCancelReply,
  onSubmitSuccess,
  apiBaseUrl = '/api/comments',
}) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(apiBaseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: postId,
          parent_id: parentId,
          content: content.trim(),
        }),
      });

      if (!response.ok) throw new Error('Failed to submit comment');

      setContent('');
      if (onCancelReply) onCancelReply();
      if (onSubmitSuccess) onSubmitSuccess();
      toast.success('Comment submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {replyTo && (
        <div className="flex items-center justify-between p-3 bg-cyber-cyan/10 rounded-lg border border-cyber-cyan/30">
          <span className="text-sm text-cyber-cyan">
            Replying to <strong>{replyTo}</strong>
          </span>
          {onCancelReply && (
            <button
              type="button"
              onClick={onCancelReply}
              className="text-cyber-cyan hover:text-cyber-cyan/80"
            >
              Cancel
            </button>
          )}
        </div>
      )}

      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your comment..."
        rows={4}
        className={cn(
          'w-full px-4 py-3 rounded-lg cyber-card',
          'text-white placeholder:text-cyber-muted',
          'focus:outline-none focus:border-cyber-cyan focus:shadow-[0_0_20px_rgba(0,240,255,0.3)]',
          'resize-none transition-all duration-300'
        )}
      />

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => setContent('')}
          disabled={!content || isSubmitting}
          className="px-4 py-2 text-sm text-cyber-muted hover:text-white transition-colors disabled:opacity-50"
        >
          Clear
        </button>
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className={cn(
            'px-6 py-2 rounded-lg',
            'bg-gradient-to-r from-cyber-cyan to-cyber-purple',
            'text-white font-medium',
            'hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-all duration-300',
            'flex items-center gap-2'
          )}
        >
          {isSubmitting ? (
            <>Sending...</>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send
            </>
          )}
        </button>
      </div>
    </form>
  );
};

// Main Comment System Component
export const CommentSystemEnhanced: React.FC<CommentSystemProps> = ({
  postId,
  userId,
  allowNested = true,
  maxDepth = 3,
  showReplies = true,
  autoLoadReplies = true,
  enableModeration = false,
  enableRealtime = false,
  className,
  apiBaseUrl = '/api/comments',
}) => {
  const queryClient = useQueryClient();
  const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  // Fetch comments
  const { data: comments, isLoading, error } = useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const response = await fetch(`${apiBaseUrl}?post_id=${postId}`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      return response.json() as Promise<Comment[]>;
    },
    enabled: !!postId,
  });

  // Toggle replies
  const handleToggleReplies = useCallback((commentId: string) => {
    setExpandedReplies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  }, []);

  // Like comment
  const handleLike = useCallback(async (commentId: string) => {
    try {
      await fetch(`${apiBaseUrl}/${commentId}/like`, { method: 'POST' });
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    } catch (error) {
      toast.error('Failed to like comment');
    }
  }, [postId, apiBaseUrl, queryClient]);

  // Delete comment
  const handleDelete = useCallback(async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    try {
      await fetch(`${apiBaseUrl}/${commentId}`, { method: 'DELETE' });
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      toast.success('Comment deleted');
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  }, [postId, apiBaseUrl, queryClient]);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <MessageCircle className="h-6 w-6 text-cyber-cyan" />
        <h2 className="text-2xl font-bold text-white">
          Comments ({comments?.length || 0})
        </h2>
      </div>

      {/* Comment Form */}
      <CommentForm
        postId={postId}
        parentId={replyTo?.id}
        replyTo={replyTo?.name}
        onCancelReply={() => setReplyTo(null)}
        onSubmitSuccess={() => queryClient.invalidateQueries({ queryKey: ['comments', postId] })}
        apiBaseUrl={apiBaseUrl}
      />

      {/* Comments List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-cyber-card/50 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="p-6 text-center text-cyber-muted">
          Failed to load comments
        </div>
      ) : comments && comments.length > 0 ? (
        <div className="space-y-4">
          <AnimatePresence>
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                maxDepth={maxDepth}
                onReply={(id, name) => setReplyTo({ id, name })}
                onEdit={() => {}}
                onDelete={handleDelete}
                onLike={handleLike}
                onToggleReplies={handleToggleReplies}
                showReplies={showReplies}
                enableModeration={enableModeration}
                userId={userId}
                expandedReplies={expandedReplies}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="p-12 text-center text-cyber-muted">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No comments yet. Be the first to comment!</p>
        </div>
      )}
    </div>
  );
};

export default CommentSystemEnhanced;
