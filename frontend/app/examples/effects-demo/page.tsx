'use client';

/**
 * 特效展示页面
 * 展示各种赛博朋克风格的动画效果
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Eye, Code } from 'lucide-react';
import { CyberButton } from '@/components/ui/CyberButton';
import { TypingEffect } from '@/components/effects/TypingEffect';
import { MagneticWrapper } from '@/components/effects/MagneticWrapper';
import { cn } from '@/lib/utils';

export default function EffectsDemoPage() {
  const [typingText, setTypingText] = useState('赛博朋克风格动画效果展示');

  const effects = [
    {
      id: 1,
      title: '打字机效果',
      description: '逐字显示文本，支持多轮循环',
      icon: <Code className="w-6 h-6" />,
      demo: (
        <div className="cyber-card p-6">
          <TypingEffect
            text={['赛博朋克风格', '动画效果展示', '交互式体验']}
            speed={100}
            delay={2000}
            loop={true}
          />
        </div>
      ),
    },
    {
      id: 2,
      title: '磁性按钮',
      description: '鼠标靠近时按钮被"吸"向光标',
      icon: <Zap className="w-6 h-6" />,
      demo: (
        <div className="flex items-center justify-center gap-6 p-6">
          <MagneticWrapper strength={0.5}>
            <CyberButton variant="primary" size="lg">
              悬停试试
            </CyberButton>
          </MagneticWrapper>
          <MagneticWrapper strength={0.3}>
            <CyberButton variant="secondary" size="lg">
              磁性效果
            </CyberButton>
          </MagneticWrapper>
        </div>
      ),
    },
    {
      id: 3,
      title: '发光按钮',
      description: '霓虹灯光效果，悬停时增强',
      icon: <Sparkles className="w-6 h-6" />,
      demo: (
        <div className="flex items-center justify-center gap-6 p-6">
          <CyberButton variant="primary" size="lg" className="shadow-neon-cyan">
            青色光晕
          </CyberButton>
          <CyberButton variant="secondary" size="lg" className="shadow-neon-purple">
            紫色光晕
          </CyberButton>
          <CyberButton variant="glow" size="lg" className="shadow-neon-pink">
            粉色光晕
          </CyberButton>
        </div>
      ),
    },
    {
      id: 4,
      title: '故障效果',
      description: '赛博朋克风格的故障动画',
      icon: <Eye className="w-6 h-6" />,
      demo: (
        <div className="flex items-center justify-center p-6">
          <motion.h1
            className="text-4xl font-bold text-white relative"
            animate={{
              textShadow: [
                '2px 0 #ff0080, -2px 0 #00f0ff',
                '-2px 0 #ff0080, 2px 0 #00f0ff',
                '2px 0 #ff0080, -2px 0 #00f0ff',
              ],
            }}
            transition={{
              duration: 0.3,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          >
            GLITCH
          </motion.h1>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* Header */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyber-cyan/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyber-purple/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-display font-bold mb-6"
          >
            <span className="text-white">特效</span>
            <span className="text-cyber-cyan">展示</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 mb-8"
          >
            探索各种赛博朋克风格的交互效果
          </motion.p>
        </div>
      </section>

      {/* Effects Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {effects.map((effect, index) => (
              <motion.div
                key={effect.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="cyber-card p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-cyber-cyan/20 rounded-lg text-cyber-cyan">
                    {effect.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{effect.title}</h2>
                    <p className="text-sm text-gray-400">{effect.description}</p>
                  </div>
                </div>

                <div className="mt-4 bg-cyber-muted/50 rounded-lg overflow-hidden">
                  {effect.demo}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section className="py-12 px-4 bg-cyber-muted/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="cyber-card p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-4">交互式体验</h2>
            <p className="text-gray-400 mb-6">尝试与页面上的元素进行交互，感受流畅的动画效果</p>

            <div className="flex flex-wrap gap-4 justify-center">
              <MagneticWrapper strength={0.4}>
                <CyberButton variant="primary" size="lg">
                  主要按钮
                </CyberButton>
              </MagneticWrapper>
              <MagneticWrapper strength={0.4}>
                <CyberButton variant="secondary" size="lg">
                  次要按钮
                </CyberButton>
              </MagneticWrapper>
              <MagneticWrapper strength={0.4}>
                <CyberButton variant="outline" size="lg">
                  轮廓按钮
                </CyberButton>
              </MagneticWrapper>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
