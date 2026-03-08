'use client';

/**
 * Newsletter Subscription Page
 * 新闻订阅页面
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, Sparkles, Bell } from 'lucide-react';
import { CyberButton } from '@/components/ui/CyberButton';

export default function NewsletterPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyber-cyan/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyber-purple/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-cyber-cyan" />
              <span className="text-sm text-cyber-cyan">订阅我们的新闻通讯</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 leading-tight">
              <span className="text-white">获取</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink">
                最新资讯
              </span>
            </h1>

            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              每周精选文章、技术趋势和设计灵感，直接发送到您的收件箱。无垃圾邮件，随时取消订阅。
            </p>
          </motion.div>
        </div>
      </section>

      {/* Subscription Form Section */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="cyber-card p-8 md:p-12 border border-cyber-cyan/30"
          >
            {isSubmitted ? (
              <div className="text-center py-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.5 }}
                  className="w-20 h-20 bg-cyber-green/20 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-10 h-10 text-cyber-green" />
                </motion.div>

                <h2 className="text-3xl font-bold text-white mb-4">
                  订阅成功！
                </h2>

                <p className="text-gray-400 mb-8">
                  感谢您的订阅！我们已向 <span className="text-cyber-cyan">{email}</span> 发送了一封确认邮件，请查收。
                </p>

                <CyberButton
                  variant="outline"
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail('');
                  }}
                >
                  返回
                </CyberButton>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-cyber-cyan/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-8 h-8 text-cyber-cyan" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    输入您的邮箱
                  </h2>
                  <p className="text-gray-400 text-sm">
                    加入 {Math.floor(Math.random() * 5000) + 1000}+ 订阅者的行列
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      电子邮箱
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full px-4 py-3 bg-cyber-dark border border-cyber-border rounded-lg text-white placeholder-gray-500 focus:border-cyber-cyan focus:outline-none focus:ring-2 focus:ring-cyber-cyan/20 transition-all"
                    />
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      id="terms"
                      type="checkbox"
                      required
                      className="mt-1 w-4 h-4 bg-cyber-dark border-cyber-border rounded focus:ring-cyber-cyan focus:ring-2"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-400">
                      我同意接收新闻通讯，并了解可以随时取消订阅。
                    </label>
                  </div>

                  <CyberButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    disabled={isLoading}
                    icon={<Bell className="w-5 h-5" />}
                  >
                    {isLoading ? '提交中...' : '立即订阅'}
                  </CyberButton>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-cyber-dark/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">订阅者专属权益</h2>
            <p className="text-gray-400">成为订阅者，获取更多价值</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '📰',
                title: '精选内容',
                description: '每周精选高质量文章，节省您的时间'
              },
              {
                icon: '🚀',
                title: '抢先阅读',
                description: '新文章提前发布，订阅者优先阅读'
              },
              {
                icon: '💎',
                title: '独家资源',
                description: '订阅者专属资源、教程和工具推荐'
              },
              {
                icon: '🎯',
                title: '个性化推荐',
                description: '根据您的兴趣定制内容推荐'
              },
              {
                icon: '📊',
                title: '行业洞察',
                description: '深度技术分析和行业趋势报告'
              },
              {
                icon: '🎁',
                title: '特别福利',
                description: '定期抽奖、活动和特别优惠'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="cyber-card p-6 text-center group hover:border-cyber-cyan/50 transition-all"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyber-cyan transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">常见问题</h2>
            <p className="text-gray-400">关于订阅的疑问解答</p>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                q: '如何取消订阅？',
                a: '每封邮件底部都有取消订阅链接，点击即可随时取消。'
              },
              {
                q: '多久发送一次邮件？',
                a: '我们每周发送一次精选内容，重要消息可能会额外发送。'
              },
              {
                q: '我的邮箱会泄露吗？',
                a: '绝对不会。我们严格遵守隐私政策，您的邮箱仅用于发送通讯。'
              },
              {
                q: '订阅是免费的吗？',
                a: '是的，我们的新闻通讯完全免费，永久免费。'
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="cyber-card p-6 border border-cyber-border/50"
              >
                <h3 className="text-lg font-semibold text-cyber-cyan mb-2">{faq.q}</h3>
                <p className="text-gray-400">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-cyber-dark/50 to-cyber-dark">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="cyber-card p-12 border border-cyber-purple/30"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              还在等什么？
            </h2>
            <p className="text-gray-400 mb-8">
              立即订阅，加入我们的社区，一起探索科技的无限可能
            </p>
            {!isSubmitted && (
              <CyberButton
                variant="primary"
                size="lg"
                icon={<Mail className="w-5 h-5" />}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                立即订阅
              </CyberButton>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
