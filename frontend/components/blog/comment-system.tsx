'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Trash2, Reply, User, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  id: string;
  author: {
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  parentId?: string;
  replies?: Comment[];
}

interface CommentSystemProps {
  postId: string;
  initialComments?: Comment[];
  className?: string;
}

export function CommentSystem({
  postId,
  initialComments = [],
  className,
}: CommentSystemProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      toast({
        title: 'Error',
        description: 'Comment cannot be empty',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // API call to submit comment
      // await api.post(`/api/posts/${postId}/comments`, { content: newComment });

      // Optimistic update
      const comment: Comment = {
        id: `temp-${Date.now()}`,
        author: {
          name: 'Current User',
          avatar: '/avatar.jpg',
        },
        content: newComment,
        createdAt: new Date().toISOString(),
      };

      setComments([comment, ...comments]);
      setNewComment('');

      toast({
        title: 'Success',
        description: 'Comment posted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to post comment',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // API call to submit reply
      // await api.post(`/api/posts/${postId}/comments`, {
      //   content: replyContent,
      //   parentId,
      // });

      const reply: Comment = {
        id: `temp-${Date.now()}`,
        author: {
          name: 'Current User',
          avatar: '/avatar.jpg',
        },
        content: replyContent,
        createdAt: new Date().toISOString(),
        parentId,
      };

      setComments(
        comments.map((comment) =>
          comment.id === parentId
            ? { ...comment, replies: [...(comment.replies || []), reply] }
            : comment
        )
      );

      setReplyContent('');
      setReplyTo(null);

      toast({
        title: 'Success',
        description: 'Reply posted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to post reply',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      // await api.delete(`/api/posts/${postId}/comments/${commentId}`);

      setComments(comments.filter((comment) => comment.id !== commentId));

      toast({
        title: 'Success',
        description: 'Comment deleted',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete comment',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Comment Form */}
      <div className="bg-cyber-dark/80 border border-cyber-cyan/30 rounded-lg p-6">
        <h3 className="text-xl font-bold text-cyber-cyan mb-4 flex items-center gap-2">
          <MessageSquare size={24} />
          Leave a Comment
        </h3>

        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts..."
          className="w-full min-h-[120px] p-4 bg-cyber-dark border border-cyber-cyan/30 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-cyber-cyan transition-colors resize-none"
        />

        <div className="flex justify-end mt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmitComment}
            disabled={isSubmitting || !newComment.trim()}
            className={cn(
              'flex items-center gap-2 px-6 py-2 rounded-lg font-semibold',
              'bg-gradient-to-r from-cyber-cyan to-cyber-purple',
              'text-white',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'hover:shadow-lg hover:shadow-cyber-cyan/50',
              'transition-all duration-200'
            )}
          >
            <Send size={18} />
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </motion.button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-cyber-cyan flex items-center gap-2">
          <MessageSquare size={24} />
          Comments ({comments.length})
        </h3>

        <AnimatePresence>
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={() => setReplyTo(comment.id)}
              onDelete={() => handleDeleteComment(comment.id)}
              isReplying={replyTo === comment.id}
              replyContent={replyContent}
              onReplyChange={setReplyContent}
              onSubmitReply={() => handleSubmitReply(comment.id)}
              isSubmitting={isSubmitting}
            />
          ))}
        </AnimatePresence>

        {comments.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface CommentItemProps {
  comment: Comment;
  onReply: () => void;
  onDelete: () => void;
  isReplying: boolean;
  replyContent: string;
  onReplyChange: (content: string) => void;
  onSubmitReply: () => void;
  isSubmitting: boolean;
}

function CommentItem({
  comment,
  onReply,
  onDelete,
  isReplying,
  replyContent,
  onReplyChange,
  onSubmitReply,
  isSubmitting,
}: CommentItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-cyber-dark/60 border border-cyber-cyan/20 rounded-lg p-4 space-y-3"
    >
      {/* Comment Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-purple flex items-center justify-center">
            <User size={20} className="text-white" />
          </div>
          <div>
            <p className="font-semibold text-white">{comment.author.name}</p>
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <Clock size={12} />
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReply}
            className="p-2 text-cyber-cyan hover:text-cyber-pink transition-colors"
          >
            <Reply size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDelete}
            className="p-2 text-cyber-cyan hover:text-red-500 transition-colors"
          >
            <Trash2 size={18} />
          </motion.button>
        </div>
      </div>

      {/* Comment Content */}
      <p className="text-gray-300 pl-13">{comment.content}</p>

      {/* Reply Form */}
      <AnimatePresence>
        {isReplying && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="ml-13 space-y-3"
          >
            <textarea
              value={replyContent}
              onChange={(e) => onReplyChange(e.target.value)}
              placeholder="Write your reply..."
              className="w-full min-h-[80px] p-3 bg-cyber-dark border border-cyber-cyan/30 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-cyber-cyan transition-colors resize-none"
            />
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onSubmitReply}
                disabled={isSubmitting || !replyContent.trim()}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-semibold',
                  'bg-gradient-to-r from-cyber-cyan to-cyber-purple',
                  'text-white',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'transition-all duration-200'
                )}
              >
                {isSubmitting ? 'Posting...' : 'Reply'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onReplyChange('')}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-gray-700 text-white hover:bg-gray-600 transition-colors"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-13 space-y-3 border-l-2 border-cyber-cyan/30 pl-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={() => {}}
              onDelete={() => {}}
              isReplying={false}
              replyContent=""
              onReplyChange={() => {}}
              onSubmitReply={() => {}}
              isSubmitting={false}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
