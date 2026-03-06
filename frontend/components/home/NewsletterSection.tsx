/**
 * NewsletterSection Component
 * 邮件订阅组件
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { EmailIcon, SendIcon } from '@/components/graphics';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('请输入邮箱地址');
      return;
    }

    // 简单的邮箱验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('请输入有效的邮箱地址');
      return;
    }

    setIsLoading(true);

    // 模拟 API 调用
    setTimeout(() => {
      toast.success('订阅成功！感谢您的关注');
      setEmail('');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative p-8 md:p-12 bg-gradient-to-br from-cyber-card to-cyber-muted border border-cyber-border rounded-2xl overflow-hidden"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 bg-cyber-grid opacity-5" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-cyan/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyber-purple/10 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative z-10">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-cyber-cyan to-cyber-purple rounded-full flex items-center justify-center">
              <EmailIcon size={32} className="text-white" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-orbitron font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-purple">
            订阅我们的通讯
          </h2>

          {/* Description */}
          <p className="text-gray-400 text-center mb-8 max-w-xl mx-auto">
            获取最新的文章、技术见解和项目更新。我们承诺不发送垃圾邮件。
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-6 py-4 bg-cyber-dark border-2 border-cyber-border rounded-lg text-white placeholder-gray-500 focus:border-cyber-cyan focus:outline-none transition-colors"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-4 bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white font-orbitron font-bold rounded-lg hover:shadow-neon-cyan transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>提交中...</span>
                </>
              ) : (
                <>
                  <SendIcon size={20} />
                  <span>订阅</span>
                </>
              )}
            </button>
          </form>

          {/* Privacy Note */}
          <p className="text-xs text-gray-500 text-center mt-4">
            订阅即表示您同意我们的隐私政策。您可以随时取消订阅。
          </p>
        </div>

        {/* Corner Decorations */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-cyber-cyan" />
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyber-cyan" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-cyber-cyan" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-cyber-cyan" />
      </motion.div>
    </div>
  );
};

export default NewsletterSection;
