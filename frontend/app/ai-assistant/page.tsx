'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles, Code, Image as ImageIcon, MessageSquare, Zap } from 'lucide-react';
import { CyberButton } from '@/components/ui';
import { GlitchText } from '@/components/effects/GlitchText';
import { ParticleBackground } from '@/components/effects/ParticleBackground';

export default function AIAssistantPage() {
  const [activeTab, setActiveTab] = useState<'chat' | 'code' | 'image'>('chat');

  const features = [
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: '智能对话',
      description: '与 AI 助手进行自然语言对话，获取即时帮助',
      color: 'cyan',
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: '代码生成',
      description: '自动生成、优化和解释代码，提高开发效率',
      color: 'purple',
    },
    {
      icon: <ImageIcon className="w-6 h-6" />,
      title: '图像生成',
      description: '使用 AI 生成赛博朋克风格的图像和插画',
      color: 'pink',
    },
  ];

  const examples = [
    { input: '如何使用 Next.js 14 的 App Router？', category: '聊天' },
    { input: '生成一个 React 组件的类型定义', category: '代码' },
    { input: '创建一个赛博朋克风格的 Logo', category: '图像' },
    { input: '解释 TypeScript 中的泛型', category: '聊天' },
    { input: '优化这段 CSS 代码', category: '代码' },
    { input: '生成一个未来城市的概念图', category: '图像' },
  ];

  return (
    <div className="min-h-screen bg-cyber-dark relative overflow-hidden">
      {/* 粒子背景 */}
      <ParticleBackground />

      {/* 页面头部 */}
      <section className="relative pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-cyber-cyan/20 border-2 border-cyber-cyan shadow-neon-cyan"
            >
              <Bot className="w-10 h-10 text-cyber-cyan" />
            </motion.div>

            {/* 标题 */}
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
              <GlitchText text="AI 助手" />
            </h1>

            {/* 副标题 */}
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              驱动您的创作流程，从代码到图像，AI 助手随时待命
            </p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <CyberButton
                size="lg"
                icon={<Sparkles className="w-5 h-5" />}
                onClick={() => setActiveTab('chat')}
              >
                开始使用
              </CyberButton>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 功能卡片 */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              AI 功能概览
            </h2>
            <p className="text-gray-400 text-center">
              选择适合您需求的 AI 工具
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => {
                  if (feature.title === '智能对话') setActiveTab('chat');
                  if (feature.title === '代码生成') setActiveTab('code');
                  if (feature.title === '图像生成') setActiveTab('image');
                }}
                className="group p-6 rounded-xl border border-cyber-border bg-cyber-card/50 backdrop-blur-sm cursor-pointer hover:border-cyber-cyan/50 transition-all"
              >
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-cyber-${feature.color}/20 text-cyber-${feature.color} group-hover:scale-110 transition-transform`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-cyber-cyan transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 示例 */}
      <section className="py-12 px-4 bg-cyber-dark/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              尝试这些示例
            </h2>
            <p className="text-gray-400 text-center">
              点击任意示例开始体验
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            {examples.map((example, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  if (example.category === '聊天') setActiveTab('chat');
                  if (example.category === '代码') setActiveTab('code');
                  if (example.category === '图像') setActiveTab('image');
                }}
                className="p-4 rounded-lg border border-cyber-border bg-cyber-card/30 hover:border-cyber-cyan/50 cursor-pointer transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded bg-cyber-cyan/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-cyber-cyan" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-300 group-hover:text-white transition-colors line-clamp-2">
                      {example.input}
                    </p>
                    <p className="text-xs text-cyber-cyan mt-1">{example.category}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 特性说明 */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              为什么选择 CyberPress AI？
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-xl border border-cyber-border bg-gradient-to-br from-cyber-cyan/10 to-transparent"
            >
              <h3 className="text-xl font-semibold text-cyber-cyan mb-3">
                ⚡ 即时响应
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                AI 助手提供毫秒级响应，无需等待，立即获得所需帮助。
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-xl border border-cyber-border bg-gradient-to-br from-cyber-purple/10 to-transparent"
            >
              <h3 className="text-xl font-semibold text-cyber-purple mb-3">
                🎯 精准理解
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                先进的自然语言处理技术，准确理解您的需求和上下文。
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-xl border border-cyber-border bg-gradient-to-br from-cyber-pink/10 to-transparent"
            >
              <h3 className="text-xl font-semibold text-cyber-pink mb-3">
                🚀 持续学习
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                AI 模型不断学习和优化，提供越来越准确和有用的回答。
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-xl border border-cyber-border bg-gradient-to-br from-cyber-green/10 to-transparent"
            >
              <h3 className="text-xl font-semibold text-cyber-green mb-3">
                🔒 隐私保护
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                所有数据都经过加密处理，确保您的隐私和安全。
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center p-12 rounded-2xl bg-gradient-to-br from-cyber-cyan/10 via-cyber-purple/10 to-cyber-pink/10 border border-cyber-border backdrop-blur-sm"
          >
            <Bot className="w-16 h-16 text-cyber-cyan mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              准备好体验 AI 的强大功能了吗？
            </h2>
            <p className="text-gray-300 mb-8">
              立即开始使用 CyberPress AI 助手，让 AI 为您的创作赋能
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <CyberButton
                size="lg"
                icon={<Sparkles className="w-5 h-5" />}
                onClick={() => setActiveTab('chat')}
              >
                开始对话
              </CyberButton>
              <CyberButton
                size="lg"
                variant="outline"
                onClick={() => window.open('/docs/ai', '_blank')}
              >
                查看文档
              </CyberButton>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
