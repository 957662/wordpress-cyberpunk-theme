/**
 * Newsletter Subscription Page
 * 新闻订阅页面
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import { CyberButton } from '@/components/ui';
import Link from 'next/link';

export default function NewsletterPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* Header */}
      <header className="border-b border-cyber-border/50 bg-cyber-dark/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-display font-bold">
                <span className="text-cyber-cyan">CYBER</span>
                <span className="text-cyber-purple">PRESS</span>
              </span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/blog" className="text-sm text-gray-300 hover:text-cyber-cyan">
                博客
              </Link>
              <Link href="/about" className="text-sm text-gray-300 hover:text-cyber-cyan">
                关于
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyber-cyan/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyber-purple/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="max-w-4xl mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyber-cyan/20 to-cyber-purple/20 rounded-full mb-6">
              <Mail className="w-10 h-10 text-cyber-cyan" />
            </div>
            <h1 className="text-5xl font-display font-bold text-white mb-4">
              订阅我们的
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink">
                新闻通讯
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              每周精选文章、技术趋势和设计灵感,直接发送到您的收件箱。无垃圾邮件,随时取消。
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="cyber-card bg-cyber-dark/80 backdrop-blur-sm border border-cyber-border p-8 md:p-12"
          >
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-cyber-green/20 rounded-full mb-4">
                  <CheckCircle className="w-8 h-8 text-cyber-green" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">订阅成功!</h2>
                <p className="text-gray-400 mb-6">
                  感谢您的订阅。我们已向您的邮箱发送了一封确认邮件,请查收。
                </p>
                <Link href="/">
                  <CyberButton variant="outline">
                    返回首页
                  </CyberButton>
                </Link>
              </motion.div>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      邮箱地址
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full px-4 py-3 bg-cyber-dark border border-cyber-border rounded-lg text-white placeholder-gray-500 focus:border-cyber-cyan focus:ring-2 focus:ring-cyber-cyan/20 focus:outline-none transition-all"
                    />
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      className="mt-1 w-4 h-4 rounded border-cyber-border bg-cyber-dark text-cyber-cyan focus:ring-cyber-cyan focus:ring-offset-0"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-400">
                      我同意接收新闻通讯,并了解可以随时取消订阅。
                    </label>
                  </div>

                  <CyberButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={isSubmitting}
                    icon={<ArrowRight className="w-5 h-5" />}
                  >
                    {isSubmitting ? '订阅中...' : '立即订阅'}
                  </CyberButton>
                </form>

                <div className="mt-8 pt-8 border-t border-cyber-border">
                  <p className="text-sm text-gray-500 text-center">
                    🔒 我们尊重您的隐私,绝不会分享您的邮箱地址。
                  </p>
                </div>
              </>
            )}
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 grid md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: Sparkles,
                title: '精选内容',
                description: '每周精选最佳文章和教程',
              },
              {
                icon: '🎯',
                title: '个性化推荐',
                description: '基于您的兴趣定制内容',
              },
              {
                icon: '📱',
                title: '移动友好',
                description: '在任何设备上完美阅读',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="cyber-card bg-cyber-dark/50 border border-cyber-border/50 p-6 text-center"
              >
                <div className="text-3xl mb-3">{feature.icon === 'string' ? feature.icon : <feature.icon className="w-8 h-8 text-cyber-cyan mx-auto" />}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-cyber-border py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>© 2024 CyberPress. 由 AI 开发团队构建 🤖</p>
        </div>
      </footer>
    </div>
  );
}
