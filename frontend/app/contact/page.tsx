'use client';

/**
 * 联系页面
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, MapPin, Github, Twitter, Linkedin } from 'lucide-react';
import { ContactForm } from '@/components/forms/ContactForm';
import { CyberCard } from '@/components/ui/CyberCard';

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleFormSubmit = async (data: any) => {
    // 模拟表单提交
    await new Promise(resolve => setTimeout(resolve, 1000));
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* Header */}
      <section className="relative py-20 px-4 border-b border-cyber-border">
        <div className="absolute inset-0 bg-cyber-grid opacity-10" />
        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
              <span className="text-glow-cyan text-cyber-cyan">联系</span>
              <span className="text-glow-purple text-cyber-purple">我们</span>
            </h1>
            <p className="text-xl text-gray-400">
              有问题或建议？我们随时为您提供帮助
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* 联系信息 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-display font-bold text-white mb-6">
                联系方式
              </h2>
              <p className="text-gray-400 mb-8">
                我们重视您的反馈和意见。请通过以下方式与我们联系，或填写表单，我们会尽快回复您。
              </p>

              <div className="space-y-6">
                {/* 邮箱 */}
                <CyberCard className="p-6 hover:border-cyber-cyan/50 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-cyber-cyan/10">
                      <Mail className="w-6 h-6 text-cyber-cyan" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">电子邮件</h3>
                      <a
                        href="mailto:contact@cyberpress.com"
                        className="text-cyber-cyan hover:text-cyber-cyan/80 transition-colors"
                      >
                        contact@cyberpress.com
                      </a>
                    </div>
                  </div>
                </CyberCard>

                {/* 地址 */}
                <CyberCard className="p-6 hover:border-cyber-purple/50 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-cyber-purple/10">
                      <MapPin className="w-6 h-6 text-cyber-purple" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">地址</h3>
                      <p className="text-gray-400">
                        中国，北京市，朝阳区<br />
                        赛博科技园区 A栋 1001室
                      </p>
                    </div>
                  </div>
                </CyberCard>

                {/* 社交媒体 */}
                <CyberCard className="p-6 hover:border-cyber-pink/50 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-cyber-pink/10">
                      <MessageSquare className="w-6 h-6 text-cyber-pink" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-3">社交媒体</h3>
                      <div className="flex gap-3">
                        <a
                          href="#"
                          className="p-2 rounded border border-cyber-border hover:border-cyber-cyan hover:text-cyber-cyan transition-all"
                          aria-label="GitHub"
                        >
                          <Github className="w-5 h-5" />
                        </a>
                        <a
                          href="#"
                          className="p-2 rounded border border-cyber-border hover:border-cyber-cyan hover:text-cyber-cyan transition-all"
                          aria-label="Twitter"
                        >
                          <Twitter className="w-5 h-5" />
                        </a>
                        <a
                          href="#"
                          className="p-2 rounded border border-cyber-border hover:border-cyber-cyan hover:text-cyber-cyan transition-all"
                          aria-label="LinkedIn"
                        >
                          <Linkedin className="w-5 h-5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </CyberCard>
              </div>
            </motion.div>

            {/* 联系表单 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <CyberCard className="p-8">
                <h2 className="text-3xl font-display font-bold text-white mb-6">
                  发送消息
                </h2>

                {formSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyber-cyan/20 text-cyber-cyan mb-4">
                      <Send className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      消息已发送！
                    </h3>
                    <p className="text-gray-400">
                      感谢您的留言，我们会尽快回复您。
                    </p>
                    <button
                      onClick={() => setFormSubmitted(false)}
                      className="mt-6 text-cyber-cyan hover:text-cyber-cyan/80 underline"
                    >
                      发送另一条消息
                    </button>
                  </motion.div>
                ) : (
                  <ContactForm onSubmit={handleFormSubmit} />
                )}
              </CyberCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 border-t border-cyber-border">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              常见问题
            </h2>
            <p className="text-gray-400">
              这里有一些常见问题的解答
            </p>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                q: '如何投稿文章？',
                a: '您可以通过发送电子邮件到 editorial@cyberpress.com 来投稿。请在邮件中包含您的文章大纲或完整草稿。',
              },
              {
                q: '是否接受广告合作？',
                a: '是的，我们接受相关领域的广告合作。请联系 ads@cyberpress.com 了解更多详情。',
              },
              {
                q: '如何报告网站问题？',
                a: '如果您发现网站有任何问题，请通过 GitHub Issues 或发送邮件到 support@cyberpress.com 报告。',
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <CyberCard className="p-6 hover:border-cyber-cyan/30 transition-all">
                  <h3 className="text-lg font-semibold text-cyber-cyan mb-2">
                    {faq.q}
                  </h3>
                  <p className="text-gray-400">{faq.a}</p>
                </CyberCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
