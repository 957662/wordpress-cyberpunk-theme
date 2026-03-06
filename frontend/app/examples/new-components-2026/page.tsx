/**
 * New Components Showcase 2026
 * 新组件展示页面 - 2026年3月
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Image,
  Loader,
  TrendingUp,
  Settings,
  Zap,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EmptyState, EmptyStates } from '@/components/ui/EmptyState';
import { StatCard, StatCardGrid } from '@/components/ui/StatCard';
import { ProgressRing, GaugeProgress } from '@/components/ui/ProgressRing';
import { Confetti, ConfettiCannon } from '@/components/ui/Confetti';
import { KonamiCode } from '@/components/ui/KonamiCode';
import { formatBytes, formatDuration, formatNumber } from '@/lib/utils/format-enhanced';

export default function NewComponentsShowcase() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCannon, setShowCannon] = useState(false);
  const [activeTab, setActiveTab] = useState<'stats' | 'empty' | 'progress' | 'fun'>('stats');

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* Header */}
      <header className="border-b border-cyber-border/50 bg-cyber-dark/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink">
                新组件展示 2026
              </h1>
              <p className="text-gray-400 mt-1">
                最新创建的高级 UI 组件和工具函数
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCannon(true)}
              >
                🎉 庆祝
              </Button>
              <KonamiCode onActivate={() => setShowConfetti(true)} showHint />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-cyber-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            {[
              { id: 'stats', label: '统计卡片', icon: TrendingUp },
              { id: 'empty', label: '空状态', icon: FileText },
              { id: 'progress', label: '进度条', icon: Loader },
              { id: 'fun', label: '趣味组件', icon: Sparkles },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-cyber-cyan text-cyber-cyan'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* StatCardGrid */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-cyber-cyan" />
                统计卡片网格
              </h2>

              <StatCardGrid
                cards={[
                  {
                    title: '总访问量',
                    value: '1,234,567',
                    icon: TrendingUp,
                    trend: { value: 12.5, label: '较上周' },
                    description: '过去30天的访问量',
                    color: 'cyan',
                  },
                  {
                    title: '文章数量',
                    value: '156',
                    icon: FileText,
                    trend: { value: 8.2, label: '较上月' },
                    description: '已发布的文章',
                    color: 'purple',
                  },
                  {
                    title: '图片资源',
                    value: '3.2 GB',
                    icon: Image,
                    trend: { value: -2.1, label: '较上周' },
                    description: '占用存储空间',
                    color: 'pink',
                  },
                  {
                    title: '系统性能',
                    value: '98.5%',
                    icon: Zap,
                    trend: { value: 0.5, label: '稳定' },
                    description: '平均响应时间',
                    color: 'green',
                  },
                ]}
                columns={4}
              />
            </section>

            {/* StatCard Variants */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">
                不同颜色的统计卡片
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['cyan', 'purple', 'pink', 'green', 'yellow', 'orange'].map((color) => (
                  <StatCard
                    key={color}
                    title={`${color.toUpperCase()} 主题`}
                    value="999"
                    icon={Settings}
                    color={color as any}
                    description={`这是一个${color}主题的统计卡片`}
                  />
                ))}
              </div>
            </section>

            {/* Format Utils */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">
                格式化工具函数
              </h2>

              <div className="cyber-card p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">文件大小格式化</p>
                    <p className="text-white font-mono">{formatBytes(1234567890)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">时长格式化</p>
                    <p className="text-white font-mono">{formatDuration(3665)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">数字格式化</p>
                    <p className="text-white font-mono">{formatNumber(1234567.89)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">紧凑数字格式化</p>
                    <p className="text-white font-mono">{formatNumber(1234567)}</p>
                  </div>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {/* Empty States Tab */}
        {activeTab === 'empty' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* No Data */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">
                暂无数据
              </h2>
              <div className="cyber-card p-8">
                <EmptyStates.noData
                  description="这里还没有任何内容,开始添加吧!"
                  actionText="添加数据"
                  onAction={() => alert('点击了添加数据')}
                />
              </div>
            </section>

            {/* No Search Results */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">
                无搜索结果
              </h2>
              <div className="cyber-card p-8">
                <EmptyStates.noSearchResults
                  actionText="清除搜索"
                  onAction={() => alert('清除搜索')}
                />
              </div>
            </section>

            {/* Error State */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">
                错误状态
              </h2>
              <div className="cyber-card p-8">
                <EmptyStates.error
                  actionText="重试"
                  onAction={() => alert('重试加载')}
                />
              </div>
            </section>

            {/* Custom Empty State */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">
                自定义空状态
              </h2>
              <div className="cyber-card p-8">
                <EmptyState
                  title="自定义空状态"
                  description="这是一个完全自定义的空状态组件"
                  actionText="了解更多"
                  onAction={() => alert('了解更多')}
                  customIcon={
                    <div className="w-16 h-16 bg-gradient-to-br from-cyber-cyan to-cyber-purple rounded-full flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                  }
                />
              </div>
            </section>
          </motion.div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Progress Rings */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">
                环形进度条
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[75, 50, 25, 100].map((progress, index) => (
                  <div key={index} className="text-center">
                    <ProgressRing
                      progress={progress}
                      size={120}
                      color={['cyan', 'purple', 'pink', 'green'][index] as any}
                    />
                    <p className="text-gray-400 text-sm mt-2">进度 {progress}%</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Gauge Progress */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">
                仪表盘进度条
              </h2>

              <div className="flex justify-center gap-12">
                <GaugeProgress value={75} min={0} max={100} color="cyan" />
                <GaugeProgress value={50} min={0} max={100} color="purple" />
                <GaugeProgress value={90} min={0} max={100} color="pink" />
              </div>
            </section>

            {/* Custom Labels */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">
                自定义标签
              </h2>

              <div className="flex justify-center gap-12">
                <ProgressRing
                  progress={75}
                  size={150}
                  label={<span className="text-cyber-cyan">75%</span>}
                />
                <ProgressRing
                  progress={50}
                  size={150}
                  label={
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">50</div>
                      <div className="text-xs text-gray-400">完成</div>
                    </div>
                  }
                />
                <ProgressRing
                  progress={100}
                  size={150}
                  color="gradient"
                  label={<span className="text-2xl">✓</span>}
                />
              </div>
            </section>
          </motion.div>
        )}

        {/* Fun Tab */}
        {activeTab === 'fun' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Confetti */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">
                彩纸特效
              </h2>

              <div className="cyber-card p-8 text-center space-y-4">
                <p className="text-gray-400">
                  点击按钮触发彩纸特效,用于庆祝、成功等场景
                </p>

                <div className="flex justify-center gap-4">
                  <Button onClick={() => setShowConfetti(!showConfetti)}>
                    {showConfetti ? '停止' : '开始'} 彩纸
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowCannon(true)}
                  >
                    🎊 发射彩纸
                  </Button>
                </div>

                <Confetti
                  show={showConfetti}
                  count={150}
                  duration={5000}
                  onComplete={() => setShowConfetti(false)}
                />
                <ConfettiCannon
                  show={showCannon}
                  position="center"
                  count={100}
                />
              </div>
            </section>

            {/* Konami Code */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">
                Konami 秘籍
              </h2>

              <div className="cyber-card p-8">
                <p className="text-gray-400 mb-4">
                  在键盘上输入以下序列来触发彩蛋:
                </p>
                <div className="font-mono text-cyber-cyan text-lg mb-4">
                  ↑↑↓↓←→←→BA
                </div>
                <p className="text-gray-500 text-sm">
                  或者直接点击右上角的提示图标
                </p>

                <KonamiCode
                  onActivate={() => setShowConfetti(true)}
                  showHint
                />
              </div>
            </section>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-cyber-border py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500">
            新组件展示页面 · 创建于 2026年3月 ·
            <span className="text-cyber-cyan"> CyberPress Platform</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
