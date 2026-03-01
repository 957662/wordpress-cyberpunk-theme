'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Code, Zap, Globe } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-cyber-dark">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* 网格背景 */}
        <div className="absolute inset-0 bg-cyber-grid opacity-20" />
        
        {/* 动画粒子 */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyber-cyan rounded-full"
              initial={{
                x: Math.random() * 100 + '%',
                y: Math.random() * 100 + '%',
                opacity: 0,
              }}
              animate={{
                y: [null, '-100%'],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* 标签 */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyber-cyan/30 bg-cyber-cyan/10 mb-8">
              <span className="w-2 h-2 bg-cyber-cyan rounded-full animate-pulse" />
              <span className="text-cyber-cyan text-sm font-mono">SYSTEM ONLINE</span>
            </div>

            {/* 主标题 */}
            <h1 className="text-6xl md:text-8xl font-display font-bold mb-6">
              <span className="text-glow-cyan text-cyber-cyan">CYBER</span>
              <span className="text-glow-purple text-cyber-purple">PRESS</span>
            </h1>

            {/* 副标题 */}
            <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-2xl mx-auto">
              基于 <span className="text-cyber-cyan">WordPress</span> +{' '}
              <span className="text-cyber-purple">Next.js</span> 的赛博朋克博客平台
            </p>

            {/* CTA 按钮 */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/blog">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="cyber-button flex items-center gap-2"
                >
                  <span>探索博客</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <Link href="/about">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="cyber-button !border-cyber-purple !text-cyber-purple hover:!bg-cyber-purple hover:!text-cyber-dark"
                >
                  了解更多
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* 底部渐变 */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cyber-dark to-transparent" />
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-cyber-darker">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-bold text-glow-cyan mb-4">
              核心特性
            </h2>
            <p className="text-gray-400">探索赛博朋克风格的现代博客体验</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Code,
                title: '现代技术栈',
                description: 'Next.js 14 + TypeScript + Tailwind CSS，构建极致性能体验',
                color: 'cyan',
              },
              {
                icon: Zap,
                title: '流畅动画',
                description: 'Framer Motion 驱动的丝滑动画，沉浸式交互体验',
                color: 'purple',
              },
              {
                icon: Globe,
                title: 'Headless CMS',
                description: 'WordPress REST API 作为后端，灵活的内容管理',
                color: 'pink',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="cyber-card group"
              >
                <feature.icon
                  className={`w-12 h-12 mb-4 text-cyber-${feature.color} group-hover:scale-110 transition-transform`}
                />
                <h3 className="text-xl font-display font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-cyber-border">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500 text-sm">
            © 2024 CyberPress. 由 AI 开发团队自动构建 🤖
          </p>
        </div>
      </footer>
    </main>
  );
}
