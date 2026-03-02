/**
 * 评论表单组件
 * 完整实现评论提交功能，替换原来的 TODO 占位符
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, User, Mail } from 'lucide-react';
import { useSubmitComment } from '@/lib/wordpress/hooks';
import { toast } from '@/components/ui/ToastProvider';

interface CommentFormProps {
  postId: number;
  parentId?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
  showCancel?: boolean;
}

interface CommentFormData {
  author_name: string;
  author_email: string;
  content: string;
}

export function CommentForm({
  postId,
  parentId = 0,
  onSuccess,
  onCancel,
  showCancel = false,
}: CommentFormProps) {
  const [formData, setFormData] = useState<CommentFormData>({
    author_name: '',
    author_email: '',
    content: '',
  });
  const [errors, setErrors] = useState<Partial<CommentFormData>>({});

  const { submitComment, loading, error, success } = useSubmitComment();

  const validateForm = (): boolean => {
    const newErrors: Partial<CommentFormData> = {};

    if (!formData.author_name.trim()) {
      newErrors.author_name = '请输入您的姓名';
    }

    if (!formData.author_email.trim()) {
      newErrors.author_email = '请输入您的邮箱';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.author_email)) {
      newErrors.author_email = '请输入有效的邮箱地址';
    }

    if (!formData.content.trim()) {
      newErrors.content = '请输入评论内容';
    } else if (formData.content.trim().length < 10) {
      newErrors.content = '评论内容至少需要 10 个字符';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const success = await submitComment({
      post: postId,
      parent: parentId,
      author_name: formData.author_name,
      author_email: formData.author_email,
      content: formData.content,
    });

    if (success) {
      toast.success('评论提交成功！等待审核');
      setFormData({
        author_name: '',
        author_email: '',
        content: '',
      });
      onSuccess?.();
    } else {
      toast.error(error || '评论提交失败');
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // 清除该字段的错误
    if (errors[name as keyof CommentFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="cyber-card p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-cyber-cyan/10 rounded-lg">
          <MessageSquare className="w-5 h-5 text-cyber-cyan" />
        </div>
        <h3 className="text-lg font-bold text-white">
          {parentId > 0 ? '回复评论' : '发表评论'}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 姓名 */}
        <div>
          <label htmlFor="author_name" className="block text-sm font-medium text-gray-400 mb-2">
            姓名 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              id="author_name"
              name="author_name"
              value={formData.author_name}
              onChange={handleInputChange}
              placeholder="请输入您的姓名"
              className={`w-full pl-10 pr-4 py-3 bg-cyber-dark/50 border rounded-lg
                focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50 transition-all
                ${errors.author_name ? 'border-red-500' : 'border-cyber-border'}
                text-white placeholder-gray-500`}
            />
          </div>
          {errors.author_name && (
            <p className="mt-1 text-sm text-red-500">{errors.author_name}</p>
          )}
        </div>

        {/* 邮箱 */}
        <div>
          <label htmlFor="author_email" className="block text-sm font-medium text-gray-400 mb-2">
            邮箱 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="email"
              id="author_email"
              name="author_email"
              value={formData.author_email}
              onChange={handleInputChange}
              placeholder="请输入您的邮箱"
              className={`w-full pl-10 pr-4 py-3 bg-cyber-dark/50 border rounded-lg
                focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50 transition-all
                ${errors.author_email ? 'border-red-500' : 'border-cyber-border'}
                text-white placeholder-gray-500`}
            />
          </div>
          {errors.author_email && (
            <p className="mt-1 text-sm text-red-500">{errors.author_email}</p>
          )}
        </div>

        {/* 评论内容 */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-400 mb-2">
            评论内容 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="请输入您的评论（至少 10 个字符）"
            rows={5}
            className={`w-full px-4 py-3 bg-cyber-dark/50 border rounded-lg
              focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50 transition-all
              ${errors.content ? 'border-red-500' : 'border-cyber-border'}
              text-white placeholder-gray-500 resize-none`}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-500">{errors.content}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {formData.content.length} / 2000 字符
          </p>
        </div>

        {/* 提示信息 */}
        <div className="text-xs text-gray-500">
          <p>• 您的评论将在审核后显示</p>
          <p>• 请文明发言，遵守社区规范</p>
          <p>• 支持Markdown语法</p>
        </div>

        {/* 按钮 */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3
              bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan rounded-lg
              hover:bg-cyber-cyan/20 hover:border-cyber-cyan transition-all
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyber-cyan"></div>
                <span>提交中...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>提交评论</span>
              </>
            )}
          </button>

          {showCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-cyber-dark/50 border border-cyber-border text-gray-400 rounded-lg
                hover:border-gray-500 hover:text-white transition-all"
            >
              取消
            </button>
          )}
        </div>
      </form>
    </motion.div>
  );
}

export default CommentForm;
