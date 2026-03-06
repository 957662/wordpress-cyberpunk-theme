/**
 * 评论表单组件
 * 用于文章评论
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button/Button';
import { cn } from '@/lib/utils';

export interface CommentFormProps {
  postId: string;
  parentId?: string;
  replyTo?: string;
  onSubmit?: (data: { content: string; parentId?: string }) => Promise<void>;
  onCancel?: () => void;
  placeholder?: string;
}

export function CommentForm({
  postId,
  parentId,
  replyTo,
  onSubmit,
  onCancel,
  placeholder = '写下你的评论...',
}: CommentFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit?.({ content: content.trim(), parentId });
      setContent('');
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {replyTo && (
        <div className="flex items-center justify-between p-3 bg-cyber-cyan/5 border border-cyber-cyan/20 rounded-lg">
          <span className="text-sm text-gray-400">
            回复 <span className="text-cyber-cyan font-medium">@{replyTo}</span>
          </span>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-sm text-gray-500 hover:text-cyber-pink transition-colors"
            >
              取消
            </button>
          )}
        </div>
      )}

      <div className="relative">
        <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className={cn(
            'w-full pl-10 pr-4 py-3 rounded-lg text-gray-100 placeholder-gray-500',
            'bg-cyber-dark/50 border border-cyber-border/50',
            'focus:outline-none focus:border-cyber-cyan/50 focus:ring-2 focus:ring-cyber-cyan/20',
            'transition-all duration-200 resize-none',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          disabled={isSubmitting}
        />
        <div className="absolute bottom-3 right-3 text-xs text-gray-600">
          {content.length} 字符
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            取消
          </Button>
        )}
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={!content.trim() || content.length < 2}
          leftIcon={<Send className="w-4 h-4" />}
        >
          发表评论
        </Button>
      </div>

      <div className="text-xs text-gray-600">
        请遵守评论规范,文明发言
      </div>
    </motion.form>
  );
}
