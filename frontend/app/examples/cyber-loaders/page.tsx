'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CyberLoader } from '@/components/ui/CyberLoader';
import { NeonProgress } from '@/components/ui/NeonProgress';
import { CyberToggle } from '@/components/ui/CyberToggle';
import { NeonCard, NeonCardHeader, NeonCardBody } from '@/components/ui/NeonCard';
import { GlitchText } from '@/components/ui/GlitchText';
import { Button } from '@/components/ui/Button';

export default function CyberLoadersExamplePage() {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState<'cyan' | 'purple' | 'pink' | 'green' | 'yellow'>('cyan');
  const [selectedVariant, setSelectedVariant] = useState<'linear' | 'circular' | 'segmented'>('linear');

  const colors: Array<'cyan' | 'purple' | 'pink' | 'green' | 'yellow'> = ['cyan', 'purple', 'pink', 'green', 'yellow'];
  const variants: Array<'linear' | 'circular' | 'segmented'> = ['linear', 'circular', 'segmented'];
  const loaderVariants = ['spinner', 'dots', 'bars', 'pulse', 'matrix'] as const;

  const startProgress = () => {
    setIsLoading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoading(false);
          return 100;
        }
        return prev + Math.random() * 5;
      });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 p-8">
      {/* 标题 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <GlitchText text="赛博加载器演示" intensity="high" />
        <p className="text-gray-400 mt-2">探索各种赛博朋克风格的加载动画</p>
      </motion.div>

      {/* 加载器展示 */}
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 基础加载器 */}
        <NeonCard color={selectedColor} intensity="medium">
          <NeonCardHeader title="基础加载器" />
          <NeonCardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loaderVariants.map((variant) => (
                <div key={variant} className="flex flex-col items-center gap-4 p-6 rounded-lg bg-black/20">
                  <CyberLoader variant={variant} color={selectedColor} size="lg" />
                  <p className="text-sm font-mono text-gray-400 capitalize">{variant}</p>
                </div>
              ))}
            </div>
          </NeonCardBody>
        </NeonCard>

        {/* 带文字的加载器 */}
        <NeonCard color="purple" intensity="medium">
          <NeonCardHeader title="带文字的加载器" />
          <NeonCardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col items-center gap-4 p-6 rounded-lg bg-black/20">
                <CyberLoader variant="spinner" color="purple" showText text="加载中..." />
              </div>
              <div className="flex flex-col items-center gap-4 p-6 rounded-lg bg-black/20">
                <CyberLoader variant="matrix" color="green" showText text="系统初始化..." />
              </div>
            </div>
          </NeonCardBody>
        </NeonCard>

        {/* 进度条 */}
        <NeonCard color="pink" intensity="medium">
          <NeonCardHeader title="进度条" />
          <NeonCardBody>
            <div className="space-y-8">
              {/* 控制面板 */}
              <div className="flex flex-wrap items-center gap-4 p-4 rounded bg-black/20">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-400">颜色:</label>
                  <div className="flex gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded border-2 transition-all ${
                          selectedColor === color ? 'border-white scale-110' : 'border-gray-600'
                        }`}
                        style={{
                          backgroundColor: color === 'cyan' ? '#00f0ff' :
                                         color === 'purple' ? '#9d00ff' :
                                         color === 'pink' ? '#ff0080' :
                                         color === 'green' ? '#00ff41' : '#f0ff00',
                        }}
                        onClick={() => setSelectedColor(color)}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-400">类型:</label>
                  <div className="flex gap-2">
                    {variants.map((variant) => (
                      <button
                        key={variant}
                        className={`px-4 py-2 rounded text-sm font-mono transition-all ${
                          selectedVariant === variant
                            ? 'bg-white text-black'
                            : 'bg-black/40 text-gray-400 hover:bg-black/60'
                        }`}
                        onClick={() => setSelectedVariant(variant)}
                      >
                        {variant}
                      </button>
                    ))}
                  </div>
                </div>

                <Button onClick={startProgress} disabled={isLoading}>
                  {isLoading ? '加载中...' : '开始进度'}
                </Button>
              </div>

              {/* 进度条展示 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <NeonProgress
                    value={progress}
                    color={selectedColor}
                    variant={selectedVariant}
                    showPercentage
                    label="下载进度"
                  />
                  <NeonProgress
                    value={Math.min(progress + 20, 100)}
                    color="purple"
                    variant="linear"
                    showPercentage
                    label="上传进度"
                  />
                </div>

                {selectedVariant === 'circular' && (
                  <div className="flex justify-center">
                    <NeonProgress
                      value={progress}
                      color={selectedColor}
                      variant="circular"
                      showPercentage
                    />
                  </div>
                )}
              </div>
            </div>
          </NeonCardBody>
        </NeonCard>

        {/* 开关组件 */}
        <NeonCard color="green" intensity="medium">
          <NeonCardHeader title="赛博开关" />
          <NeonCardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {colors.map((color) => (
                <div key={color} className="space-y-4 p-6 rounded bg-black/20">
                  <p className="text-sm font-mono text-gray-400 capitalize mb-4">颜色: {color}</p>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Default</span>
                      <CyberToggle color={color} variant="default" />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Glow</span>
                      <CyberToggle color={color} variant="glow" />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Neon</span>
                      <CyberToggle color={color} variant="neon" />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Hologram</span>
                      <CyberToggle color={color} variant="hologram" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </NeonCardBody>
        </NeonCard>

        {/* 尺寸变体 */}
        <NeonCard color="yellow" intensity="low">
          <NeonCardHeader title="尺寸变体" />
          <NeonCardBody>
            <div className="flex flex-wrap items-center gap-8 p-6">
              {['sm', 'md', 'lg', 'xl'].map((size) => (
                <div key={size} className="flex flex-col items-center gap-3">
                  <CyberLoader variant="spinner" color="yellow" size={size as any} />
                  <p className="text-xs font-mono text-gray-400">{size}</p>
                </div>
              ))}
            </div>
          </NeonCardBody>
        </NeonCard>

        {/* 全屏加载器 */}
        <NeonCard color="cyan" intensity="low">
          <NeonCardHeader title="全屏加载器" />
          <NeonCardBody>
            <Button
              onClick={() => {
                // 模拟全屏加载器
                const loader = document.createElement('div');
                document.body.appendChild(loader);
                const root = ReactDOM.createRoot(loader);
                root.render(
                  <CyberLoader
                    variant="matrix"
                    color="cyan"
                    size="xl"
                    showText
                    text="加载系统..."
                    fullscreen
                    progress={75}
                    showProgress
                  />
                );
                setTimeout(() => {
                  root.unmount();
                  document.body.removeChild(loader);
                }, 3000);
              }}
            >
              显示全屏加载器 (3秒)
            </Button>
          </NeonCardBody>
        </NeonCard>
      </div>
    </div>
  );
}
