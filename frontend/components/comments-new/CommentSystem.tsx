'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Trash2, Reply, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  updatedAt?: string;
  parentId?: string;
  replies?: Comment[];
  likesCount?: number;
  isLiked?: boolean;
}

interface CommentSystemProps {
  postId: string;
  comments: Comment[];
  onAddComment: (content: string, parentId?: string) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
  onLikeComment?: (commentId: string) => Promise<void>;
  className?: string;
}

const CommentSystem: React.FC<CommentSystemProps> = ({
  postId,
  comments,
  onAddComment,
  onDeleteComment,
  onLikeComment,
  className = '',
}) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAddComment(newComment);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (!replyContent.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAddComment(replyContent, parentId);
      setReplyContent('');
      setReplyTo(null);
    } catch (error) {
      console.error('Failed to reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      await onDeleteComment(commentId);
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const CommentItem: React.FC<{ comment: Comment; depth?: number }> = ({
    comment,
    depth = 0
  }) => {
    const isCurrentUser = user?.id === comment.author.id;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`${depth > 0 ? 'ml-8 mt-4' : 'mb-6'}`}
      >
        <div className="bg-cyber-dark/50 backdrop-blur-sm border border-cyber-cyan/30 rounded-lg p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyber-purple to-cyber-pink flex items-center justify-center text-white font-bold">
                {comment.author.avatar ? (
                  <img
                    src={comment.author.avatar}
                    alt={comment.author.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User size={20} />
                )}
              </div>
              <div>
                <div className="font-semibold text-white">
                  {comment.author.name}
                  {isCurrentUser && (
                    <span className="ml-2 text-xs text-cyber-cyan/70">(You)</span>
                  )}
                </div>
                <div className="text-xs text-cyber-muted">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Actions */}
            {isCurrentUser && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleDelete(comment.id)}
                className="p-2 text-cyber-pink hover:bg-cyber-pink/20 rounded transition-colors"
              >
                <Trash2 size={16} />
              </motion.button>
            )}
          </div>

          {/* Content */}
          <p className="text-cyber-white/90 mb-3 whitespace-pre-wrap">
            {comment.content}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {user && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                className="flex items-center gap-1.5 text-sm text-cyber-purple hover:text-cyber-cyan transition-colors"
              >
                <Reply size={16} />
                Reply
              </motion.button>
            )}

            {onLikeComment && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onLikeComment(comment.id)}
                className={`flex items-center gap-1.5 text-sm transition-colors ${
                  comment.isLiked
                    ? 'text-cyber-pink'
                    : 'text-cyber-muted hover:text-cyber-pink'
                }`}
              >
                <MessageSquare size={16} />
                {comment.likesCount || 0}
              </motion.button>
            )}
          </div>

          {/* Reply Form */}
          <AnimatePresence>
            {replyTo === comment.id && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={(e) => handleReply(e, comment.id)}
                className="mt-4"
              >
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write your reply..."
                  rows={3}
                  className="w-full px-4 py-3 bg-cyber-dark/50 border border-cyber-cyan/30 rounded-lg text-white placeholder-cyber-muted/50 focus:outline-none focus:border-cyber-cyan/60 resize-none"
                />
                <div className="flex justify-end gap-2 mt-2">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setReplyTo(null)}
                    className="px-4 py-2 text-sm text-cyber-muted hover:text-white transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!replyContent.trim() || isSubmitting}
                    className="px-4 py-2 text-sm bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/50 rounded hover:bg-cyber-purple/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                  >
                    <Send size={16} />
                    Reply
                  </motion.button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-4">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
            ))}
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <section className={`bg-cyber-dark/30 backdrop-blur-md border border-cyber-cyan/30 rounded-lg p-6 ${className}`}>
      <h2 className="text-2xl font-bold text-cyber-cyan mb-6 flex items-center gap-2">
        <MessageSquare size={24} />
        Comments ({comments.length})
      </h2>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            rows={4}
            className="w-full px-4 py-3 bg-cyber-dark/50 border border-cyber-cyan/30 rounded-lg text-white placeholder-cyber-muted/50 focus:outline-none focus:border-cyber-cyan/60 resize-none"
          />
          <div className="flex justify-end mt-3">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!newComment.trim() || isSubmitting}
              className="px-6 py-2.5 bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/50 rounded hover:bg-cyber-purple/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              <Send size={18} />
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </motion.button>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-cyber-purple/10 border border-cyber-purple/30 rounded-lg text-center">
          <p className="text-cyber-purple">
            Please <Link href="/login" className="underline hover:text-cyber-cyan">login</Link> to leave a comment
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        ) : (
          <div className="text-center py-8 text-cyber-muted">
            No comments yet. Be the first to share your thoughts!
          </div>
        )}
      </div>
    </section>
  );
};

export default CommentSystem;
