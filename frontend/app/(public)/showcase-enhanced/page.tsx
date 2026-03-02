/**
 * 增强版展示页面
 * 展示所有赛博朋克风格的特效和组件
 */

'use client';

import { Metadata } from 'next';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlitchText } from '@/components/effects/GlitchText';
import { TypewriterText } from '@/components/effects/TypewriterText';
import { ParticleBackground } from '@/components/effects/ParticleBackground';
import { CyberGrid, DataStream, HexagonGrid, CircuitBoard } from '@/components/features';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: '特效展示 - CyberPress Platform',
  description: '赛博朋克风格特效组件展示',
};

const effects = [
  {
    id: 'particles',
    name: '粒子背景',
    description: '动态粒子与连线效果',
    component: 'ParticleBackground',
  },
  {
    id: 'cyber-grid',
    name: '赛博网格',
    description: '动态网格背景',
    component: 'CyberGrid',
  },
  {
    id: 'data-stream',
    name: '数据流',
    description: '流动的数据粒子',
    component: 'DataStream',
  },
  {
    id: 'hexagon',
    name: '六边形网格',
    description: '交互式六边形图案',
    component: 'HexagonGrid',
  },
  {
    id: 'circuit',
    name: '电路板',
    description: '动态电路连接',
    component: 'CircuitBoard',
  },
];

const colors = [
  { name: '青色', value: 'cyan', hex: '#00f0ff' },
  { name: '紫色', value: 'purple', hex: '#9d00ff' },
  { name: '粉色', value: 'pink', hex: '#ff0080' },
  { name: '黄色', value: 'yellow', hex: '#f0ff00' },
  { name: '绿色', value: 'green', hex: '#00ff88' },
];

export default function ShowcaseEnhancedPage() {
  const [activeEffect, setActiveEffect] = useState('particles');
  const [activeColor, setActiveColor] = useState<'cyan' | 'purple' | 'pink' | 'yellow' | 'green'>('cyan');

  const renderEffect = () => {
    switch (activeEffect) {
      case 'particles':
        return <ParticleBackground count={50} color={activeColor} />;
      case 'cyber-grid':
        return <CyberGrid color={activeColor} density="medium" />;
      case 'data-stream':
        return <DataStream color={activeColor} direction="down" />;
      case 'hexagon':
        return <HexagonGrid />;
      case 'circuit':
        return <CircuitBoard />;
      default:
        return <ParticleBackground />;
    }
  };

  return (
    <div className="min-h-screen bg-cyber-dark relative overflow-hidden">
      {/* 效果背景 */}
      <div className="fixed inset-0">
        {renderEffect()}
      </div>

      {/* 扫描线 */}
      <div className="fixed inset-0 bg-[linear-gradient(transparent_50%,rgba(0,240,255,0.02)_50%)] bg-[length:100%_4px] pointer-events-none z-10" />

      {/* 内容 */}
      <div className="relative z-20">
        {/* Header */}
        <section className="min-h-screen flex items-center justify-center">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <GlitchText
                text="CYBERPRESS"
                className="text-6xl md:text-8xl font-display font-bold text-cyber-cyan mb-6"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-2xl text-gray-300 mb-8"
            >
              <TypewriterText
                texts={['赛博朋克风格特效', '动态背景效果', '交互式组件']}
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-gray-400 max-w-2xl mx-auto mb-12"
            >
              探索我们为 CyberPress Platform 创建的各种赛博朋克风格特效和组件。
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex gap-4 justify-center"
            >
              <Button
                variant="primary"
                onClick={() => document.getElementById('effects')?.scrollIntoView({ behavior: 'smooth' })}
              >
                探索特效
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open('https://github.com/cyberpress/platform', '_blank')}
              >
                查看代码
              </Button>
            </motion.div>
          </div>
        </section>

        {/* 特效选择器 */}
        <section id="effects" className="py-20">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-display font-bold text-white text-center mb-12"
            >
              选择特效
            </motion.h2>

            {/* 效果按钮 */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
              {effects.map((effect, index) => (
                <motion.button
                  key={effect.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveEffect(effect.id)}
                  className={`
                    p-6 rounded-lg border-2 transition-all
                    ${activeEffect === effect.id
                      ? 'border-cyber-cyan bg-cyber-cyan/10 shadow-neon-cyan'
                      : 'border-cyber-border bg-cyber-card hover:border-cyber-cyan/50'
                    }
                  `}
                >
                  <div className="text-white font-semibold mb-2">{effect.name}</div>
                  <div className="text-gray-400 text-sm">{effect.description}</div>
                </motion.button>
              ))}
            </div>

            {/* 颜色选择器 */}
            <div className="flex gap-4 justify-center mb-12">
              {colors.map((color) => (
                <motion.button
                  key={color.value}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setActiveColor(color.value as any)}
                  className={`
                    w-12 h-12 rounded-full border-2 transition-all
                    ${activeColor === color.value
                      ? 'border-white scale-110'
                      : 'border-transparent opacity-60 hover:opacity-100'
                    }
                  `}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>

            {/* 效果说明 */}
            <motion.div
              key={activeEffect}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto text-center"
            >
              <Badge variant="primary" className="mb-4">
                {effects.find(e => e.id === activeEffect)?.component}
              </Badge>
              <p className="text-gray-300">
                {effects.find(e => e.id === activeEffect)?.description}
              </p>
            </motion.div>
          </div>
        </section>

        {/* 使用示例 */}
        <section className="py-20 bg-cyber-darker">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-display font-bold text-white text-center mb-12"
            >
              使用示例
            </motion.h2>

            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-cyber-card border border-cyber-border rounded-lg p-6"
              >
                <pre className="text-sm text-gray-300 overflow-x-auto">
                  <code>{`import { ${effects.find(e => e.id === activeEffect)?.component} } from '@/components/features';

export default function Page() {
  return (
    <div>
      <${effects.find(e => e.id === activeEffect)?.component}
        color="${activeColor}"
        density="medium"
      />
    </div>
  );
}`}</code>
                </pre>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
