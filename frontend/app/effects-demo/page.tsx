/**
 * 特效组件演示页面
 * 展示所有赛博朋克风格特效
 */

'use client';

import {
  GlitchText,
  NeonBorder,
  TypewriterText,
  HologramCard,
  Scanlines,
  GlowOrb,
  TextScramble,
  MatrixRain,
  CyberGrid,
} from '@/components/effects';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { motion } from 'framer-motion';

export default function EffectsDemoPage() {
  return (
    <main className="min-h-screen bg-cyber-dark relative overflow-hidden">
      {/* 背景特效 */}
      <MatrixRain opacity={0.1} />

      {/* 发光球体装饰 */}
      <div className="fixed top-20 left-20 pointer-events-none">
        <GlowOrb color="rgba(0, 240, 255, 0.2)" size={300} blur={150} />
      </div>
      <div className="fixed bottom-20 right-20 pointer-events-none">
        <GlowOrb color="rgba(157, 0, 255, 0.2)" size={400} blur={200} />
      </div>

      <div className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* 页面标题 */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-display font-bold mb-4">
              <GlitchText text="赛博朋克特效" />
            </h1>
            <p className="text-gray-400 text-lg">
              探索 CyberPress 的视觉特效系统
            </p>
          </motion.div>

          {/* 特效展示 */}
          <div className="space-y-12">
            {/* 文字特效 */}
            <section className="cyber-card">
              <h2 className="text-2xl font-display font-bold text-white mb-6">
                文字特效
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {/* GlitchText */}
                <div className="space-y-4">
                  <h3 className="text-cyber-cyan font-semibold">故障文字效果</h3>
                  <div className="bg-cyber-darker p-6 rounded-lg">
                    <GlitchText text="CYBERPUNK" />
                  </div>
                </div>

                {/* TypewriterText */}
                <div className="space-y-4">
                  <h3 className="text-cyber-cyan font-semibold">打字机效果</h3>
                  <div className="bg-cyber-darker p-6 rounded-lg">
                    <TypewriterText
                      text="欢迎来到赛博空间..."
                      speed={100}
                      cursor
                    />
                  </div>
                </div>

                {/* TextScramble */}
                <div className="space-y-4">
                  <h3 className="text-cyber-cyan font-semibold">文字乱码解密</h3>
                  <div className="bg-cyber-darker p-6 rounded-lg">
                    <TextScramble text="系统已启动" delay={0} />
                  </div>
                </div>
              </div>
            </section>

            {/* 边框特效 */}
            <section className="cyber-card">
              <h2 className="text-2xl font-display font-bold text-white mb-6">
                边框特效
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <NeonBorder color="cyan">
                  <div className="p-6">
                    <h3 className="text-cyber-cyan font-semibold mb-2">青色边框</h3>
                    <p className="text-gray-400">霓虹发光边框效果</p>
                  </div>
                </NeonBorder>

                <NeonBorder color="purple">
                  <div className="p-6">
                    <h3 className="text-cyber-purple font-semibold mb-2">紫色边框</h3>
                    <p className="text-gray-400">神秘的紫色光芒</p>
                  </div>
                </NeonBorder>

                <NeonBorder color="pink">
                  <div className="p-6">
                    <h3 className="text-cyber-pink font-semibold mb-2">粉色边框</h3>
                    <p className="text-gray-400">赛博朋克经典配色</p>
                  </div>
                </NeonBorder>
              </div>
            </section>

            {/* 3D 卡片效果 */}
            <section className="cyber-card">
              <h2 className="text-2xl font-display font-bold text-white mb-6">
                3D 全息卡片
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <HologramCard intensity={0.6}>
                  <div className="cyber-card">
                    <h3 className="text-xl font-display font-bold text-white mb-4">
                      移动鼠标体验 3D 效果
                    </h3>
                    <p className="text-gray-400">
                      这张卡片会根据鼠标位置产生 3D 倾斜效果，
                      模拟全息投影的视觉体验。
                    </p>
                  </div>
                </HologramCard>

                <HologramCard intensity={0.8} glow>
                  <div className="cyber-card">
                    <h3 className="text-xl font-display font-bold text-white mb-4">
                      带发光效果
                    </h3>
                    <p className="text-gray-400">
                      发光效果增强了全息投影的感觉，
                      让卡片看起来更加真实。
                    </p>
                  </div>
                </HologramCard>
              </div>
            </section>

            {/* 背景特效 */}
            <section className="cyber-card">
              <h2 className="text-2xl font-display font-bold text-white mb-6">
                背景特效
              </h2>
              <div className="space-y-8">
                <div className="relative bg-cyber-darker p-6 rounded-lg overflow-hidden min-h-[200px]">
                  <CyberGrid animated />
                  <div className="relative z-10">
                    <h3 className="text-cyber-cyan font-semibold mb-2">赛博网格</h3>
                    <p className="text-gray-400">透视效果的动态网格背景</p>
                  </div>
                </div>

                <div className="relative bg-cyber-darker p-6 rounded-lg overflow-hidden min-h-[200px]">
                  <Scanlines animated />
                  <div className="relative z-10">
                    <h3 className="text-cyber-cyan font-semibold mb-2">扫描线效果</h3>
                    <p className="text-gray-400">CRT 显示器风格的扫描线</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* 使用说明 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 cyber-card"
          >
            <h2 className="text-2xl font-display font-bold text-white mb-6">
              使用说明
            </h2>
            <div className="space-y-4 text-gray-400">
              <div>
                <h3 className="text-cyber-cyan font-semibold mb-2">导入方式</h3>
                <pre className="bg-cyber-darker p-4 rounded-lg overflow-x-auto">
                  <code className="text-cyber-cyan">
                    {`import { GlitchText, NeonBorder, HologramCard } from '@/components/effects';`}
                  </code>
                </pre>
              </div>
              <div>
                <h3 className="text-cyber-cyan font-semibold mb-2">性能提示</h3>
                <p>某些特效（如 MatrixRain）可能会消耗较多性能，建议根据实际需求谨慎使用。</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
