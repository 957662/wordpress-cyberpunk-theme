'use client';

/**
 * 新组件演示页面
 * 展示最近创建的赛博朋克风格组件
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CyberClock,
  PasswordStrength,
  WeatherCard,
  MusicPlayer,
  TaskManager,
  CodePreview,
} from '@/components/ui';

// 示例音乐列表
const sampleTracks = [
  {
    id: '1',
    title: 'Neon Dreams',
    artist: 'Cyber Orchestra',
    album: 'Digital Horizons',
    duration: 245,
  },
  {
    id: '2',
    title: 'Electric Pulse',
    artist: 'Synth Wave',
    album: 'Future City',
    duration: 198,
  },
  {
    id: '3',
    title: 'Midnight Run',
    artist: 'Night Drive',
    album: 'Streets of Fire',
    duration: 312,
  },
  {
    id: '4',
    title: 'Data Stream',
    artist: 'Binary Beats',
    album: 'System Override',
    duration: 276,
  },
];

// 示例代码
const sampleCode = `// TypeScript React Component
import { useState, useEffect } from 'react';

interface CyberButtonProps {
  variant?: 'primary' | 'secondary';
  onClick: () => void;
  children: React.ReactNode;
}

export function CyberButton({
  variant = 'primary',
  onClick,
  children,
}: CyberButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={\`
        px-6 py-3 rounded-lg font-bold
        transition-all duration-300
        \${variant === 'primary'
          ? 'bg-cyber-cyan text-black'
          : 'bg-cyber-purple text-white'
        }
        \${isHovered ? 'scale-105 shadow-neon' : ''}
      \`}
    >
      {children}
    </button>
  );
}`;

export default function NewComponentsDemo() {
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl font-display font-bold text-white mb-4">
              新组件展示
            </h1>
            <p className="text-xl text-cyber-cyan">
              CyberPress Platform 赛博朋克风格组件库
            </p>
          </motion.div>
        </div>

        {/* Components Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 1. Cyber Clock */}
          <div className="space-y-4">
            <h2 className="text-2xl font-display font-bold text-white mb-4">
              ⏰ 赛博时钟
            </h2>
            <div className="bg-cyber-card border border-cyber-border rounded-xl p-6">
              <div className="flex justify-center mb-4">
                <CyberClock variant="digital" size="md" theme="cyan" />
              </div>
              <div className="flex justify-center">
                <CyberClock variant="analog" size="md" theme="purple" />
              </div>
            </div>
          </div>

          {/* 2. Weather Card */}
          <div className="space-y-4">
            <h2 className="text-2xl font-display font-bold text-white mb-4">
              🌤️ 天气卡片
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <WeatherCard
                city="上海"
                temperature={28}
                weather="sunny"
                description="晴朗"
                size="md"
              />
              <WeatherCard
                city="东京"
                temperature={22}
                weather="rainy"
                description="中雨"
                size="md"
              />
              <WeatherCard
                city="纽约"
                temperature={15}
                weather="cloudy"
                description="多云"
                size="md"
              />
              <WeatherCard
                city="伦敦"
                temperature={8}
                weather="stormy"
                description="雷暴"
                size="md"
              />
            </div>
          </div>

          {/* 3. Password Strength */}
          <div className="space-y-4">
            <h2 className="text-2xl font-display font-bold text-white mb-4">
              🔒 密码强度检测
            </h2>
            <div className="bg-cyber-card border border-cyber-border rounded-xl p-6">
              <PasswordStrength
                value={password}
                onChange={setPassword}
                placeholder="请输入密码..."
                minLength={8}
                showRequirements={true}
              />
            </div>
          </div>

          {/* 4. Music Player */}
          <div className="space-y-4">
            <h2 className="text-2xl font-display font-bold text-white mb-4">
              🎵 音乐播放器
            </h2>
            <MusicPlayer tracks={sampleTracks} showPlaylist={true} />
          </div>

          {/* 5. Task Manager */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-display font-bold text-white mb-4">
              ✅ 任务管理器
            </h2>
            <TaskManager
              initialTasks={[
                {
                  id: '1',
                  title: '完成项目文档',
                  description: '编写详细的 API 文档和使用指南',
                  priority: 'high',
                  completed: false,
                  createdAt: new Date(),
                },
                {
                  id: '2',
                  title: '代码审查',
                  description: '审查 PR #123 的代码变更',
                  priority: 'medium',
                  completed: true,
                  createdAt: new Date(),
                },
                {
                  id: '3',
                  title: '更新依赖',
                  description: '升级到最新的 Next.js 版本',
                  priority: 'low',
                  completed: false,
                  createdAt: new Date(),
                },
              ]}
              showProgress={true}
            />
          </div>

          {/* 6. Code Preview */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-display font-bold text-white mb-4">
              💻 代码预览
            </h2>
            <CodePreview
              code={sampleCode}
              language="typescript"
              title="CyberButton.tsx"
              showLineNumbers={true}
              showCopy={true}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-gray-500">
            所有组件均使用 TypeScript + React + Tailwind CSS + Framer Motion 构建
          </p>
        </div>
      </div>
    </div>
  );
}
