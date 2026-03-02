/**
 * Showcase Page - 展示页面
 * 展示所有赛博朋克效果和组件
 */

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, Code } from 'lucide-react';

export default function ShowcasePage() {
  const features = [
    {
      title: '全息卡片',
      description: '带有3D倾斜效果和霓虹边框的卡片',
      route: '/components/card',
    },
    {
      title: '数字雨',
      description: '黑客帝国风格的矩阵雨效果',
      route: '/effects/matrix',
    },
    {
      title: '文字乱码',
      description: '从随机字符解密到目标文本',
      route: '/effects/scramble',
    },
    {
      title: '霓虹按钮',
      description: '带有电流动画和发光效果',
      route: '/components/button',
    },
  ];

  return (
    <main className="min-h-screen bg-cyber-dark">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* 网格背景 */}
        <div className="absolute inset-0 bg-cyber-grid opacity-20" />

        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyber-cyan/30 bg-cyber-cyan/10 mb-8">
              <Sparkles className="w-4 h-4 text-cyber-cyan" />
              <span className="text-cyber-cyan text-sm font-mono">FEATURE SHOWCASE</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-display font-bold mb-6">
              <span className="text-glow-cyan text-cyber-cyan">赛博朋克</span>
              <span className="text-white mx-4">x</span>
              <span className="text-glow-purple text-cyber-purple">组件库</span>
            </h1>

            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              探索 Next.js 和 Framer Motion 构建的炫酷 UI 组件和动画效果
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
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
            <p className="text-gray-400">体验未来科技感的 UI 组件</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="cyber-card group cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/30">
                    <Zap className="w-6 h-6 text-cyber-cyan" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-cyber-cyan transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 mb-4">{feature.description}</p>
                    <Link
                      href={feature.route}
                      className="inline-flex items-center gap-2 text-cyber-cyan hover:text-cyber-purple transition-colors"
                    >
                      查看演示
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Preview */}
      <section className="py-20 px-4 bg-cyber-dark">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-bold text-glow-purple mb-4">
              简单易用
            </h2>
            <p className="text-gray-400">一行代码，赛博朋克效果即刻呈现</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="cyber-code"
          >
            <pre className="text-sm">
              <code className="text-cyber-cyan">import</code> {'{'} <code className="text-cyber-pink">CyberButton</code> {'}'} <code className="text-cyber-cyan">from</code> <code className="text-cyber-yellow">'@/components/ui/CyberButton'</code>
              <br />
              <br />
              <code className="text-gray-500">// 使用赛博朋克按钮</code>
              <br />
              <code className="text-cyber-purple">&lt;CyberButton</code> <code className="text-cyber-yellow">variant</code>=<code className="text-cyber-green">"cyan"</code> <code className="text-cyber-purple">/&gt;</code>
              <br />
              &nbsp;&nbsp;点击我
              <br />
              <code className="text-cyber-purple">&lt;/CyberButton&gt;</code>
            </pre>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-cyber-darker to-cyber-dark">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Code className="w-16 h-16 text-cyber-cyan mx-auto mb-6" />
            <h2 className="text-4xl font-display font-bold text-white mb-4">
              准备好开始了吗？
            </h2>
            <p className="text-gray-400 mb-8 text-lg">
              立即探索所有组件和效果，打造你的赛博朋克风格网站
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/docs">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="cyber-button flex items-center gap-2"
                >
                  <span>查看文档</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <Link href="/blog">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="cyber-button !border-cyber-purple !text-cyber-purple hover:!bg-cyber-purple hover:!text-cyber-dark"
                >
                  返回博客
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
