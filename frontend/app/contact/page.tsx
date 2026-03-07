/**
 * Contact Page
 * 联系页面
 */

'use client';

import { Metadata } from 'next';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  MessageSquare,
  Send,
  Github,
  Twitter,
  Linkedin,
  MapPin,
  Phone,
} from 'lucide-react';
import { CyberButton } from '@/components/ui/CyberButton';
import { toast } from 'react-hot-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 这里添加实际的提交逻辑
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success('消息已发送！我们会尽快回复。');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('发送失败，请稍后再试。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: '邮箱',
      value: 'contact@cyberpress.com',
      href: 'mailto:contact@cyberpress.com',
    },
    {
      icon: MapPin,
      label: '地址',
      value: '中国 · 北京',
      href: null,
    },
    {
      icon: Phone,
      label: '电话',
      value: '+86 123 4567 8900',
      href: 'tel:+8612345678900',
    },
  ];

  const socialLinks = [
    {
      name: 'GitHub',
      icon: Github,
      href: 'https://github.com',
      color: 'hover:text-white',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      href: 'https://twitter.com',
      color: 'hover:text-cyber-cyan',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: 'https://linkedin.com',
      color: 'hover:text-cyber-purple',
    },
  ];

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
              <MessageSquare className="w-4 h-4 text-cyber-cyan" />
              <span className="text-sm text-cyber-cyan">联系我们</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              <span className="text-white">取得</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink bg-300% animate-gradient">
                联系
              </span>
            </h1>

            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              有任何问题或建议？我们随时倾听您的声音
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-white mb-8">联系方式</h2>

              <div className="space-y-6 mb-12">
                {contactInfo.map((info) => (
                  <div
                    key={info.label}
                    className="cyber-card p-6 flex items-center gap-4"
                  >
                    <div className="w-12 h-12 bg-cyber-cyan/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-cyber-cyan" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">{info.label}</div>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="text-white hover:text-cyber-cyan transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <div className="text-white">{info.value}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">关注我们</h3>
                <div className="flex gap-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-12 h-12 bg-cyber-muted rounded-lg flex items-center justify-center text-gray-400 transition-all hover:scale-110 ${social.color}`}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="cyber-card p-8 border border-cyber-cyan/30">
                <h2 className="text-2xl font-bold text-white mb-8">发送消息</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      姓名 *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-cyber-dark border border-cyber-border rounded-lg text-white placeholder-gray-500 focus:border-cyber-cyan focus:outline-none focus:ring-2 focus:ring-cyber-cyan/20 transition-all"
                      placeholder="您的姓名"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      邮箱 *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-cyber-dark border border-cyber-border rounded-lg text-white placeholder-gray-500 focus:border-cyber-cyan focus:outline-none focus:ring-2 focus:ring-cyber-cyan/20 transition-all"
                      placeholder="your@email.com"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                      主题 *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-cyber-dark border border-cyber-border rounded-lg text-white focus:border-cyber-cyan focus:outline-none focus:ring-2 focus:ring-cyber-cyan/20 transition-all"
                    >
                      <option value="">选择主题</option>
                      <option value="general">一般咨询</option>
                      <option value="support">技术支持</option>
                      <option value="feedback">反馈建议</option>
                      <option value="business">商务合作</option>
                      <option value="other">其他</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      消息 *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-cyber-dark border border-cyber-border rounded-lg text-white placeholder-gray-500 focus:border-cyber-cyan focus:outline-none focus:ring-2 focus:ring-cyber-cyan/20 transition-all resize-none"
                      placeholder="请输入您的消息..."
                    />
                  </div>

                  {/* Submit Button */}
                  <CyberButton
                    type="submit"
                    variant="primary"
                    fullWidth
                    size="lg"
                    disabled={isSubmitting}
                    icon={<Send className="w-5 h-5" />}
                  >
                    {isSubmitting ? '发送中...' : '发送消息'}
                  </CyberButton>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-cyber-dark/50">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">常见问题</h2>
            <p className="text-gray-400">快速找到答案</p>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                q: '如何投稿文章？',
                a: '您可以通过注册账号后，在用户中心提交您的文章。我们的编辑团队会审核后发布。',
              },
              {
                q: '是否支持API访问？',
                a: '是的，我们提供完整的 REST API。详情请查看我们的开发者文档。',
              },
              {
                q: '如何报告问题？',
                a: '您可以通过上方的联系表单或直接在 GitHub 上提交 Issue。',
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="cyber-card p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-gray-400">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cyber-border py-8 px-4 text-center text-gray-500 text-sm">
        <p>© 2024 CyberPress. 由 AI 开发团队构建 🤖</p>
      </footer>
    </div>
  );
}
