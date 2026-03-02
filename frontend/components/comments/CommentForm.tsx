'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Paperclip, Smile, Image as ImageIcon } from 'lucide-react';

export interface CommentFormData {
  content: string;
  author: string;
  email?: string;
  website?: string;
}

interface CommentFormProps {
  onSubmit: (data: CommentFormData) => void;
  currentUser?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  placeholder?: string;
  submitLabel?: string;
  showUserFields?: boolean;
  colorScheme?: 'cyan' | 'purple' | 'pink' | 'green' | 'orange' | 'blue';
  className?: string;
  disabled?: boolean;
}

const colorSchemes = {
  cyan: {
    primary: 'from-cyan-500 to-blue-500',
    secondary: 'text-cyan-400',
    border: 'border-cyan-500/30',
    bg: 'bg-cyan-500/10',
    focus: 'focus:border-cyan-500',
    glow: 'shadow-cyan-500/20',
  },
  purple: {
    primary: 'from-purple-500 to-pink-500',
    secondary: 'text-purple-400',
    border: 'border-purple-500/30',
    bg: 'bg-purple-500/10',
    focus: 'focus:border-purple-500',
    glow: 'shadow-purple-500/20',
  },
  pink: {
    primary: 'from-pink-500 to-rose-500',
    secondary: 'text-pink-400',
    border: 'border-pink-500/30',
    bg: 'bg-pink-500/10',
    focus: 'focus-border-pink-500',
    glow: 'shadow-pink-500/20',
  },
  green: {
    primary: 'from-green-500 to-emerald-500',
    secondary: 'text-green-400',
    border: 'border-green-500/30',
    bg: 'bg-green-500/10',
    focus: 'focus:border-green-500',
    glow: 'shadow-green-500/20',
  },
  orange: {
    primary: 'from-orange-500 to-amber-500',
    secondary: 'text-orange-400',
    border: 'border-orange-500/30',
    bg: 'bg-orange-500/10',
    focus: 'focus:border-orange-500',
    glow: 'shadow-orange-500/20',
  },
  blue: {
    primary: 'from-blue-500 to-cyan-500',
    secondary: 'text-blue-400',
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/10',
    focus: 'focus:border-blue-500',
    glow: 'shadow-blue-500/20',
  },
};

export const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  currentUser,
  placeholder = '写下你的评论...',
  submitLabel = '发表评论',
  showUserFields = true,
  colorScheme = 'cyan',
  className = '',
  disabled = false,
}) => {
  const colors = colorSchemes[colorScheme];
  const [formData, setFormData] = useState<CommentFormData>({
    content: '',
    author: currentUser?.name || '',
    email: currentUser?.email || '',
    website: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData(prev => ({ ...prev, content: '' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof CommentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div
        className={`backdrop-blur-sm bg-gray-900/60 border ${colors.border} rounded-xl p-6 ${colors.glow}`}
      >
        {/* 用户信息字段 */}
        {showUserFields && !currentUser && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">昵称 *</label>
              <input
                type="text"
                value={formData.author}
                onChange={e => handleChange('author', e.target.value)}
                placeholder="你的昵称"
                required
                className={`w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none ${colors.focus} transition-colors`}
                disabled={disabled}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">邮箱 *</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => handleChange('email', e.target.value)}
                placeholder="your@email.com"
                required
                className={`w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none ${colors.focus} transition-colors`}
                disabled={disabled}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">网站</label>
              <input
                type="url"
                value={formData.website}
                onChange={e => handleChange('website', e.target.value)}
                placeholder="https://example.com"
                className={`w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none ${colors.focus} transition-colors`}
                disabled={disabled}
              />
            </div>
          </div>
        )}

        {/* 当前用户信息 */}
        {currentUser && (
          <div className={`flex items-center gap-3 mb-4 p-3 rounded-lg ${colors.bg}`}>
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${colors.primary} flex items-center justify-center`}>
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-white font-semibold">{currentUser.name[0]}</span>
              )}
            </div>
            <div>
              <p className="text-white font-medium">{currentUser.name}</p>
              <p className="text-gray-400 text-sm">以游客身份发表评论</p>
            </div>
          </div>
        )}

        {/* 工具栏 */}
        <div className="flex items-center gap-2 mb-2">
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg ${colors.bg} ${colors.secondary} hover:opacity-80 transition-opacity`}
            title="插入图片"
          >
            <ImageIcon className="w-4 h-4" />
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg ${colors.bg} ${colors.secondary} hover:opacity-80 transition-opacity`}
            title="上传附件"
          >
            <Paperclip className="w-4 h-4" />
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg ${colors.bg} ${colors.secondary} hover:opacity-80 transition-opacity`}
            title="插入表情"
          >
            <Smile className="w-4 h-4" />
          </motion.button>
          <div className="flex-1" />
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPreview(!showPreview)}
            className={`px-3 py-1.5 text-sm rounded-lg ${colors.bg} ${colors.secondary} hover:opacity-80 transition-opacity`}
          >
            {showPreview ? '编辑' : '预览'}
          </motion.button>
        </div>

        {/* 内容输入框 */}
        <div className="relative">
          {showPreview ? (
            <div className="min-h-[120px] p-4 bg-gray-800/30 border border-gray-700 rounded-lg text-gray-200 whitespace-pre-wrap">
              {formData.content || <span className="text-gray-500">预览将显示在这里...</span>}
            </div>
          ) : (
            <textarea
              value={formData.content}
              onChange={e => handleChange('content', e.target.value)}
              placeholder={placeholder}
              required
              rows={4}
              className={`w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none ${colors.focus} transition-colors resize-none`}
              disabled={disabled}
            />
          )}
        </div>

        {/* 提交按钮 */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-gray-400 text-sm">
            支持 Markdown 格式
          </p>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!formData.content.trim() || isSubmitting || disabled}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r ${colors.primary} text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed ${colors.glow}`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                发送中...
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

      {/* 提示信息 */}
      <div className="text-xs text-gray-400 space-y-1">
        <p>• 你的邮箱地址不会被公开</p>
        <p>• 必填项已标注 *</p>
        <p>• 评论将在审核后显示</p>
      </div>
    </form>
  );
};

export default CommentForm;
