/**
 * 反馈小部件 - 用于收集用户反馈
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageIcon, CloseIcon, SendIcon, StarIcon } from '@/components/icons';
import { Button } from '@/components/ui/Button';
import { Rating } from '@/components/ui/Rating';
import { cn } from '@/lib/utils';

export interface FeedbackData {
  rating?: number;
  category: string;
  message: string;
  email?: string;
}

export interface FeedbackWidgetProps {
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  onSubmit?: (feedback: FeedbackData) => void | Promise<void>;
  showEmail?: boolean;
  showRating?: boolean;
  categories?: string[];
  title?: string;
  successMessage?: string;
}

const categories = [
  '功能建议',
  '问题反馈',
  '使用体验',
  '其他',
];

export function FeedbackWidget({
  className,
  position = 'bottom-right',
  onSubmit,
  showEmail = false,
  showRating = true,
  categories: customCategories,
  title = '反馈',
  successMessage = '感谢您的反馈！',
}: FeedbackWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  const positionStyles = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) return;

    setIsSubmitting(true);

    const feedback: FeedbackData = {
      rating: showRating ? rating : undefined,
      category,
      message,
      email: showEmail ? email : undefined,
    };

    try {
      await onSubmit?.(feedback);
      setSubmitted(true);

      // 重置表单
      setTimeout(() => {
        setCategory('');
        setMessage('');
        setEmail('');
        setRating(0);
        setSubmitted(false);
        setIsOpen(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn('fixed z-50', positionStyles[position], className)}>
      {/* 反馈表单 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="mb-4 w-80 bg-cyber-card border border-cyber-border rounded-lg shadow-neon-cyan overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-cyber-border">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold text-cyber-cyan">{title}</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyber-green/20 text-cyber-green mb-4">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-300">{successMessage}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* 评分 */}
                  {showRating && (
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        您的评分
                      </label>
                      <Rating
                        value={rating}
                        onChange={setRating}
                        max={5}
                        size="md"
                      />
                    </div>
                  )}

                  {/* 分类 */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      反馈类型
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-cyber-dark border border-cyber-border rounded-lg text-white focus:outline-none focus:border-cyber-cyan"
                      required
                    >
                      <option value="">请选择</option>
                      {(customCategories || categories).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* 消息 */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      详细描述
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="请描述您的反馈..."
                      rows={4}
                      className="w-full px-3 py-2 bg-cyber-dark border border-cyber-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan resize-none"
                      required
                    />
                  </div>

                  {/* 邮箱 */}
                  {showEmail && (
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        邮箱（可选）
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full px-3 py-2 bg-cyber-dark border border-cyber-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan"
                      />
                    </div>
                  )}

                  {/* 提交按钮 */}
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    isLoading={isSubmitting}
                    loadingText="提交中..."
                    disabled={!message.trim() || !category}
                    rightIcon={<SendIcon className="w-4 h-4" />}
                  >
                    提交反馈
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 触发按钮 */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-14 h-14 bg-cyber-cyan text-cyber-dark rounded-full shadow-neon-cyan hover:shadow-neon-cyan transition-all"
        aria-label="打开反馈"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CloseIcon className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageIcon className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
