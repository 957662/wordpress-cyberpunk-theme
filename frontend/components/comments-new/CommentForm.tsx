'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Smile } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommentFormProps {
  postId: string;
  parentId?: string;
  onSuccess?: (comment: Comment) => void;
  onCancel?: () => void;
  className?: string;
  placeholder?: string;
  submitLabel?: string;
  showAvatar?: boolean;
  userAvatar?: string;
  userName?: string;
}

interface Comment {
  id: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  createdAt: Date;
}

export function CommentForm({
  postId,
  parentId,
  onSuccess,
  onCancel,
  className,
  placeholder = 'Write a comment...',
  submitLabel = 'Post Comment',
  showAvatar = true,
  userAvatar,
  userName = 'Anonymous',
}: CommentFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        content: content.trim(),
        author: {
          name: userName,
          avatar: userAvatar,
        },
        createdAt: new Date(),
      };

      setContent('');
      onSuccess?.(newComment);
    } catch (err) {
      setError('Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className={cn('relative', className)}
    >
      <div className="flex gap-3">
        {showAvatar && (
          <div className="flex-shrink-0">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName}
                className="w-10 h-10 rounded-full object-cover border-2 border-cyber-cyan/30"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center text-white font-bold text-sm">
                {getInitials(userName)}
              </div>
            )}
          </div>
        )}

        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            rows={3}
            className={cn(
              'w-full px-4 py-3 rounded-lg border resize-none',
              'bg-cyber-dark/50 backdrop-blur-sm',
              'border-cyber-cyan/30 focus:border-cyber-cyan/50',
              'text-white placeholder-gray-500',
              'focus:outline-none focus:ring-2 focus:ring-cyber-cyan/20',
              'transition-all'
            )}
            disabled={isSubmitting}
          />

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-sm text-pink-500"
            >
              {error}
            </motion.p>
          )}

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-2 rounded-lg hover:bg-cyber-cyan/10 text-gray-400 hover:text-cyber-cyan transition-colors"
                title="Add emoji"
              >
                <Smile className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              {onCancel && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
                >
                  Cancel
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isSubmitting || !content.trim()}
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium',
                  'bg-gradient-to-r from-cyber-cyan to-cyber-purple',
                  'text-white',
                  'hover:shadow-lg hover:shadow-cyber-cyan/20',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'transition-all'
                )}
              >
                {isSubmitting ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                    />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {submitLabel}
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.form>
  );
}

export default CommentForm;
