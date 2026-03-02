import { Metadata } from 'next';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Zap,
  Cpu,
  Shield,
  Rocket,
} from 'lucide-react';
import { GlitchText } from '@/components/effects/GlitchText';
import { TypewriterText } from '@/components/effects/TypewriterText';
import { ParticleBackground } from '@/components/effects/ParticleBackground';
import { Logo } from '@/components/icons';

export const metadata: Metadata = {
  title: 'CyberPress - 赛博朋克风格博客平台',
  description: '基于 WordPress + Next.js 的现代化博客平台，探索未来科技与设计的完美融合',
};

// 特性数据
const features = [
  {
    icon: <Zap className="w-8 h-8" />,
    title: '极致性能',
    description: 'Next.js 14 App Router 提供极致的加载速度和用户体验',
    color: 'cyber-cyan',
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: '安全可靠',
    description: 'WordPress Headless CMS 架构，安全性与灵活性兼备',
    color: 'cyber-purple',
  },
  {
    icon: <Cpu className="w-8 h-8" />,
    title: 'AI 增强',
    description: '智能内容推荐、自动标签生成、AI 写作助手',
    color: 'cyber-pink',
  },
  {
    icon: <Rocket className="w-8 h-8" />,
    title: '易于部署',
    description: 'Docker 容器化部署，一键启动，开箱即用',
    color: 'cyber-yellow',
  },
];

// 技术栈数据
const techStack = [
  { name: 'Next.js 14', color: 'bg-white' },
  { name: 'TypeScript', color: 'bg-blue-500' },
  { name: 'Tailwind CSS', color: 'bg-cyan-400' },
  { name: 'Framer Motion', color: 'bg-purple-500' },
  { name: 'WordPress', color: 'bg-blue-600' },
  { name: 'Docker', color: 'bg-blue-400' },
  { name: 'React Query', color: 'bg-red-500' },
  { name: 'Zustand', color: 'bg-yellow-500' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* 粒子背景 */}
      <ParticleBackground />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* 扫描线效果 */}
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,240,255,0.02)_50%)] bg-[length:100%_4px] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Logo 动画 */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="flex justify-center mb-8"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-cyber-cyan blur-3xl opacity-20 animate-pulse" />
                <Logo className="w-24 h-24 text-cyber-cyan relative" />
              </div>
            </motion.div>

            {/* 主标题 */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-8xl font-display font-bold mb-6"
            >
              <GlitchText text="CYBERPRESS" />
            </motion.h1>

            {/* 打字机副标题 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-400 mb-8 h-8"
            >
              <TypewriterText
                texts={[
                  '赛博朋克风格博客平台',
                  '探索未来科技与设计',
                  'WordPress + Next.js',
                ]}
              />
            </motion.div>

            {/* 描述文本 */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed"
            >
              基于现代化的技术栈，打造极致用户体验的博客平台。
              <br />
              融合赛博朋克美学与尖端科技，开启内容创作新纪元。
            </motion.p>

            {/* CTA 按钮组 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <Link href="/blog">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-8 py-4 bg-gradient-to-r from-cyber-cyan to-cyber-purple rounded-lg font-semibold text-cyber-dark overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    开始探索
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                </motion.button>
              </Link>

              <Link href="/portfolio">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border-2 border-cyber-cyan text-cyber-cyan rounded-lg font-semibold hover:bg-cyber-cyan/10 transition-colors"
                >
                  查看作品集
                </motion.button>
              </Link>
            </motion.div>

            {/* 快速导航卡片 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            >
              <Link href="/blog">
                <motion.div
                  whileHover={{ y: -5, borderColor: '#00f0ff' }}
                  className="p-6 rounded-xl border border-cyber-border bg-cyber-card/50 backdrop-blur-sm cursor-pointer group"
                >
                  <BookOpen className="w-10 h-10 text-cyber-cyan mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold text-white mb-2">博客文章</h3>
                  <p className="text-gray-400 text-sm">探索技术文章、教程和见解</p>
                </motion.div>
              </Link>

              <Link href="/portfolio">
                <motion.div
                  whileHover={{ y: -5, borderColor: '#9d00ff' }}
                  className="p-6 rounded-xl border border-cyber-border bg-cyber-card/50 backdrop-blur-sm cursor-pointer group"
                >
                  <Briefcase className="w-10 h-10 text-cyber-purple mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold text-white mb-2">作品集</h3>
                  <p className="text-gray-400 text-sm">查看我们的项目和案例</p>
                </motion.div>
              </Link>

              <Link href="/about">
                <motion.div
                  whileHover={{ y: -5, borderColor: '#ff0080' }}
                  className="p-6 rounded-xl border border-cyber-border bg-cyber-card/50 backdrop-blur-sm cursor-pointer group"
                >
                  <Cpu className="w-10 h-10 text-cyber-pink mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold text-white mb-2">关于我们</h3>
                  <p className="text-gray-400 text-sm">了解项目背景和团队信息</p>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* 滚动提示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-cyber-cyan/50 rounded-full flex items-start justify-center p-2"
          >
            <div className="w-1 h-2 bg-cyber-cyan rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              核心特性
            </h2>
            <p className="text-gray-400 text-lg">
              专为现代 Web 设计的功能和体验
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="p-6 rounded-xl border border-cyber-border bg-gradient-to-br from-cyber-card to-cyber-muted hover:border-cyber-cyan/50 transition-all group"
              >
                <div className={`text-${feature.color} mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-24 bg-cyber-darker relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-cyan/5 via-transparent to-cyber-purple/5" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              技术栈
            </h2>
            <p className="text-gray-400 text-lg">
              采用最新的技术和工具构建
            </p>
          </motion.div>

          <div className="flex flex-wrap items-center justify-center gap-4 max-w-4xl mx-auto">
            {techStack.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="px-6 py-3 rounded-full bg-cyber-card border border-cyber-border text-white font-medium hover:border-cyber-cyan transition-all cursor-default"
              >
                {tech.name}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center p-12 rounded-2xl bg-gradient-to-br from-cyber-cyan/10 via-cyber-purple/10 to-cyber-pink/10 border border-cyber-border backdrop-blur-sm"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              准备好开始了吗？
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              加入我们，探索赛博朋克风格的内容创作平台。
              <br />
              体验未来科技与设计的完美融合。
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/blog">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-cyber-cyan to-cyber-purple rounded-lg font-semibold text-cyber-dark shadow-lg shadow-cyber-cyan/20"
                >
                  浏览文章
                </motion.button>
              </Link>

              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border-2 border-cyber-cyan text-cyber-cyan rounded-lg font-semibold hover:bg-cyber-cyan/10 transition-colors"
                >
                  联系我们
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-cyber-darker">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { value: '100+', label: '组件数量' },
              { value: '20+', label: '页面模板' },
              { value: '10+', label: '特效效果' },
              { value: '∞', label: '可能性' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-display font-bold text-cyber-cyan mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
