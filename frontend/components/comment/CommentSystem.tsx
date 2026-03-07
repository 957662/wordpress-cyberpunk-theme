'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Reply, ThumbsUp, Flag, User, Send, Trash2 } from 'lucide-react';

interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
  parentId?: string;
}

interface CommentSystemProps {
  postId: string;
  initialComments?: Comment[];
  currentUser?: {
    id: string;
    name: string;
    avatar?: string;
  };
  allowReplies?: boolean;
  allowLikes?: boolean;
  onCommentSubmit?: (content: string, parentId?: string) => Promise<void>;
  onCommentDelete?: (commentId: string) => Promise<void>;
  onCommentLike?: (commentId: string) => Promise<void>;
}

export default function CommentSystem({
  postId,
  initialComments = [],
  currentUser,
  allowReplies = true,
  allowLikes = true,
  onCommentSubmit,
  onCommentDelete,
  onCommentLike,
}: CommentSystemProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [replyContent, setReplyContent] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const handleSubmit = async (content: string, parentId?: string) => {
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (onCommentSubmit) {
        await onCommentSubmit(content, parentId);
      } else {
        // Demo mode: add comment locally
        const newCommentData: Comment = {
          id: `comment-${Date.now()}`,
          author: currentUser || {
            id: 'guest',
            name: '访客',
          },
          content,
          createdAt: new Date().toISOString(),
          likes: 0,
          isLiked: false,
          parentId,
        };

        if (parentId) {
          setComments(prev =>
            prev.map(comment => {
              if (comment.id === parentId) {
                return {
                  ...comment,
                  replies: [...(comment.replies || []), newCommentData],
                };
              }
              return comment;
            })
          );
        } else {
          setComments(prev => [newCommentData, ...prev]);
        }
      }

      setNewComment('');
      setReplyContent(prev => ({ ...prev, [parentId || '']: '' }));
      setReplyTo(null);
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      if (onCommentDelete) {
        await onCommentDelete(commentId);
      } else {
        // Demo mode: remove comment locally
        setComments(prev =>
          prev.map(comment => ({
            ...comment,
            replies: comment.replies?.filter(r => r.id !== commentId) || [],
          })).filter(c => c.id !== commentId)
        );
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const handleLike = async (commentId: string) => {
    if (!allowLikes || onCommentLike) {
      if (onCommentLike) {
        await onCommentLike(commentId);
      }
      return;
    }

    // Demo mode: toggle like locally
    setComments(prev =>
      prev.map(comment => {
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
            replies: comment.replies.map(reply =>
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
  };

  const renderComment = (comment: Comment, isReply = false) => {
    const canDelete = currentUser?.id === comment.author.id;
    const isReplying = replyTo === comment.id;

    return (
      <motion.div
        key={comment.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`${isReply ? 'ml-12 mt-3' : 'mt-4'}`}
      >
        <div className="bg-cyber-muted/30 rounded-lg p-4 border border-cyber-cyan/10 hover:border-cyber-cyan/30 transition-colors">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center text-cyber-dark font-bold">
                {comment.author.avatar ? (
                  <img
                    src={comment.author.avatar}
                    alt={comment.author.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </div>
              <div>
                <h4 className="font-semibold text-gray-200">{comment.author.name}</h4>
                <p className="text-xs text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {allowLikes && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleLike(comment.id)}
                  className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                    comment.isLiked
                      ? 'text-cyber-pink bg-cyber-pink/10'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-sm">{comment.likes}</span>
                </motion.button>
              )}

              {allowReplies && !isReply && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setReplyTo(isReplying ? null : comment.id)}
                  className="flex items-center gap-1 px-2 py-1 rounded text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-colors"
                >
                  <Reply className="w-4 h-4" />
                  <span className="text-sm">回复</span>
                </motion.button>
              )}

              {canDelete && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(comment.id)}
                  className="flex items-center gap-1 px-2 py-1 rounded text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          </div>

          {/* Content */}
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{comment.content}</p>

          {/* Reply Form */}
          <AnimatePresence>
            {isReplying && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4"
              >
                <div className="flex gap-3">
                  <textarea
                    value={replyContent[comment.id] || ''}
                    onChange={(e) => setReplyContent(prev => ({ ...prev, [comment.id]: e.target.value }))}
                    placeholder="写下你的回复..."
                    className="flex-1 bg-cyber-dark/50 border border-cyber-cyan/20 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyber-cyan/50 resize-none"
                    rows={3}
                  />
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSubmit(replyContent[comment.id] || '', comment.id)}
                    disabled={!replyContent[comment.id]?.trim() || isSubmitting}
                    className="px-4 py-2 bg-cyber-cyan text-cyber-dark rounded-lg font-semibold hover:bg-cyber-cyan/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2 space-y-2">
            {comment.replies.map(reply => renderComment(reply, true))}
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="w-6 h-6 text-cyber-cyan" />
        <h2 className="text-2xl font-bold text-gray-200">评论</h2>
        <span className="px-2 py-1 rounded-full bg-cyber-cyan/10 text-cyber-cyan text-sm font-medium">
          {comments.length}
        </span>
      </div>

      {/* New Comment Form */}
      <div className="mb-8 bg-cyber-muted/20 rounded-xl p-6 border border-cyber-cyan/20">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">发表评论</h3>
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center text-cyber-dark font-bold flex-shrink-0">
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-6 h-6" />
            )}
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="分享你的想法..."
              className="w-full bg-cyber-dark/50 border border-cyber-cyan/20 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyber-cyan/50 resize-none"
              rows={4}
            />
            <div className="flex justify-end mt-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSubmit(newComment)}
                disabled={!newComment.trim() || isSubmitting}
                className="px-6 py-2 bg-gradient-to-r from-cyber-cyan to-cyber-purple text-cyber-dark rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                发表评论
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        <AnimatePresence>
          {comments.length > 0 ? (
            comments.map(comment => renderComment(comment))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>还没有评论，快来发表第一条吧！</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
