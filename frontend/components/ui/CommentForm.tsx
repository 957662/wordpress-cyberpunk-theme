'use client';

import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CommentData {
  author: string;
  email: string;
  content: string;
  parentId?: number;
}

interface CommentFormProps {
  onSubmit: (comment: CommentData) => Promise<void>;
  replyTo?: {
    id: number;
    author: string;
  } | null;
  onCancelReply?: () => void;
  className?: string;
}

export const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  replyTo = null,
  onCancelReply,
  className,
}) => {
  const [formData, setFormData] = useState({
    author: '',
    email: '',
    content: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof CommentData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CommentData, string>> = {};

    if (!formData.author.trim()) {
      newErrors.author = '请输入您的名字';
    }

    if (!formData.email.trim()) {
      newErrors.email = '请输入邮箱地址';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }

    if (!formData.content.trim()) {
      newErrors.content = '请输入评论内容';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        parentId: replyTo?.id,
      });
      
      // Reset form on success
      setFormData({
        author: '',
        email: '',
        content: '',
      });
      setErrors({});
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof CommentData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-4', className)}>
      {replyTo && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-cyber-cyan/5 border border-cyber-cyan/20">
          <span className="text-sm text-gray-300">
            回复 <span className="font-semibold text-cyber-cyan">{replyTo.author}</span>
          </span>
          <button
            type="button"
            onClick={onCancelReply}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            取消
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="author"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            名字 *
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className={cn(
              'w-full px-4 py-2',
              'rounded-lg',
              'border border-cyber-cyan/20',
              'bg-cyber-dark/80',
              'text-white placeholder-gray-500',
              'focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50',
              'transition-colors',
              errors.author && 'border-cyber-pink/50'
            )}
            placeholder="您的名字"
          />
          {errors.author && (
            <p className="mt-1 text-sm text-cyber-pink">{errors.author}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            邮箱 *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={cn(
              'w-full px-4 py-2',
              'rounded-lg',
              'border border-cyber-cyan/20',
              'bg-cyber-dark/80',
              'text-white placeholder-gray-500',
              'focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50',
              'transition-colors',
              errors.email && 'border-cyber-pink/50'
            )}
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-cyber-pink">{errors.email}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          评论内容 *
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows={5}
          className={cn(
            'w-full px-4 py-2',
            'rounded-lg',
            'border border-cyber-cyan/20',
            'bg-cyber-dark/80',
            'text-white placeholder-gray-500',
            'focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50',
            'transition-colors resize-none',
            errors.content && 'border-cyber-pink/50'
          )}
          placeholder="写下您的想法..."
        />
        {errors.content && (
          <p className="mt-1 text-sm text-cyber-pink">{errors.content}</p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            'flex items-center gap-2 px-6 py-2',
            'rounded-lg',
            'bg-cyber-cyan text-cyber-dark',
            'font-semibold',
            'hover:bg-cyber-cyan/80',
            'focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-all duration-200'
          )}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              提交中...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              发表评论
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
