/**
 * About Page
 * 关于页面
 */

import { Metadata } from 'next';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Code,
  Palette,
  Zap,
  Github,
  Twitter,
  Mail,
  Heart,
} from 'lucide-react';
import { CyberButton } from '@/components/ui/CyberButton';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '关于我们',
  description: '了解 CyberPress 平台的故事和愿景',
};

export default function AboutPage() {
  const features = [
    {
      icon: Code,
      title: '先进技术',
      description: '采用 Next.js 14、TypeScript、Tailwind CSS 等最新技术栈',
    },
    {
      icon: Palette,
      title: '独特设计',
      description: '赛博朋克风格设计，霓虹色彩、故障效果、流畅动画',
    },
    {
      icon: Zap,
      title: '极致性能',
      description: '服务端渲染、代码分割、懒加载，提供极致体验',
    },
  ];

  const stats = [
    { label: '文章', value: '100+' },
    { label: '用户', value: '1000+' },
    { label: '评论', value: '5000+' },
    { label: '点赞', value: '10K+' },
  ];

  const team = [
    {
      name: 'AI 开发团队',
      role: '全栈开发',
      avatar: null,
      bio: '由多个 AI Agent 协作开发，持续自主迭代和优化',
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
              <Sparkles className="w-4 h-4 text-cyber-cyan" />
              <span className="text-sm text-cyber-cyan">关于我们</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              <span className="text-white">探索</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink bg-300% animate-gradient">
                CyberPress
              </span>
            </h1>

            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              我们是一个现代化的博客平台，致力于融合赛博朋克美学与尖端技术，
              为用户提供独特的内容创作和阅读体验。
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/blog">
                <CyberButton variant="primary" size="lg">
                  浏览文章
                </CyberButton>
              </Link>
              <Link href="/contact">
                <CyberButton variant="outline" size="lg">
                  联系我们
                </CyberButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-cyber-dark/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-purple mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              核心特性
            </h2>
            <p className="text-gray-400 text-lg">
              我们的优势
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="cyber-card p-8 text-center group"
              >
                <div className="w-16 h-16 bg-cyber-cyan/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-cyber-cyan/30 transition-colors">
                  <feature.icon className="w-8 h-8 text-cyber-cyan" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-cyber-dark/50 to-cyber-dark">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              开发团队
            </h2>
            <p className="text-gray-400 text-lg">
              由 AI 驱动的创新团队
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="cyber-card p-6 text-center"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-cyber-cyan to-cyber-purple rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🤖</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-cyber-cyan text-sm mb-3">{member.role}</p>
                <p className="text-gray-400 text-sm">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="cyber-card p-8 md:p-12 text-center border border-cyber-cyan/30"
          >
            <Heart className="w-16 h-16 text-cyber-pink mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              加入我们
            </h2>
            <p className="text-gray-400 mb-8">
              无论你是内容创作者、开发者还是设计师，都欢迎加入我们的社区
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <CyberButton variant="primary" size="lg">
                  联系我们
                </CyberButton>
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <CyberButton variant="outline" size="lg" icon={<Github className="w-5 h-5" />}>
                  GitHub
                </CyberButton>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cyber-border py-8 px-4 text-center text-gray-500 text-sm">
        <p>© 2024 CyberPress. 由 AI 开发团队构建 🤖</p>
      </footer>
    </div>
  );
}
