'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CyberButton } from '@/components/effects/CyberButton';
import { DigitalClock } from '@/components/effects/DigitalClock';
import { HoloBadge } from '@/components/effects/HoloBadge';
import { CyberCounter } from '@/components/effects/CyberCounter';
import { NeonProgressBar } from '@/components/effects/NeonProgressBar';
import { DataStream } from '@/components/effects/DataStream';
import { ChatAssistant } from '@/components/ai/ChatAssistant';
import { Card } from '@/components/ui/Card';

/**
 * 新组件展示页面
 * 展示所有新创建的赛博朋克风格组件
 */
export default function NewComponentsPage() {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [progress1, setProgress1] = useState(0);
  const [progress2, setProgress2] = useState(0);

  // 动画计数器
  React.useEffect(() => {
    setTimeout(() => setCount1(1234), 500);
    setTimeout(() => setCount2(98.7), 500);
    setTimeout(() => setProgress1(75), 500);
    setTimeout(() => setProgress2(45), 500);
  }, []);

  const handleSendMessage = async (message: string): Promise<string> => {
    // 模拟AI响应
    return new Promise((resolve) => {
      setTimeout(() => {
        const responses = [
          `你说"${message}"，这很有趣！`,
          `我理解你的意思了。关于"${message}"，我可以提供一些帮助。`,
          `这是一个关于"${message}"的好问题。`,
        ];
        resolve(responses[Math.floor(Math.random() * responses.length)]);
      }, 1000);
    });
  };

  return (
    <main className="min-h-screen bg-cyber-dark">
      {/* 数据流背景 */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <DataStream direction="horizontal" color="cyan" density="sparse" size={200} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
            <span className="text-glow-cyan text-cyber-cyan">新组件</span>
            <span className="text-white">展示</span>
          </h1>
          <p className="text-gray-400 text-lg">
            探索最新创建的赛博朋克风格组件
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* CyberButton */}
          <Card variant="hologram">
            <h2 className="text-2xl font-display font-bold text-cyber-cyan mb-4">
              CyberButton 赛博按钮
            </h2>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <CyberButton color="cyan">青色按钮</CyberButton>
                <CyberButton color="purple" variant="secondary">紫色次要</CyberButton>
                <CyberButton color="pink" variant="outline" glitch>故障边框</CyberButton>
              </div>
              <div className="flex flex-wrap gap-3">
                <CyberButton color="green" size="sm">小尺寸</CyberButton>
                <CyberButton color="yellow" size="lg">大尺寸</CyberButton>
                <CyberButton color="cyan" loading>加载中</CyberButton>
              </div>
            </div>
          </Card>

          {/* DigitalClock */}
          <Card variant="hologram">
            <h2 className="text-2xl font-display font-bold text-cyber-purple mb-4">
              DigitalClock 数字时钟
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
              <DigitalClock theme="cyan" showSeconds showDate format="24h" />
              <DigitalClock theme="purple" format="12h" />
              <DigitalClock theme="pink" showSeconds showDay />
            </div>
          </Card>

          {/* HoloBadge */}
          <Card variant="hologram">
            <h2 className="text-2xl font-display font-bold text-cyber-pink mb-4">
              HoloBadge 全息徽章
            </h2>
            <div className="flex flex-wrap gap-4">
              <HoloBadge color="cyan" size="sm">新功能</HoloBadge>
              <HoloBadge color="purple">推荐</HoloBadge>
              <HoloBadge color="pink" size="lg" enable3D>高级版</HoloBadge>
              <HoloBadge color="gold" enable3D>VIP</HoloBadge>
            </div>
          </Card>

          {/* CyberCounter */}
          <Card variant="hologram">
            <h2 className="text-2xl font-display font-bold text-cyber-green mb-4">
              CyberCounter 数字计数器
            </h2>
            <div className="space-y-6">
              <div className="text-center">
                <CyberCounter value={count1} color="cyan" size="xl" glow suffix="+" />
                <p className="text-gray-400 text-sm mt-2">用户数量</p>
              </div>
              <div className="text-center">
                <CyberCounter value={count2} color="purple" decimals={1} suffix="%" />
                <p className="text-gray-400 text-sm mt-2">完成率</p>
              </div>
              <div className="text-center">
                <CyberCounter value={50000} color="pink" prefix="$" separator />
                <p className="text-gray-400 text-sm mt-2">收入</p>
              </div>
            </div>
          </Card>

          {/* NeonProgressBar */}
          <Card variant="hologram">
            <h2 className="text-2xl font-display font-bold text-cyber-cyan mb-4">
              NeonProgressBar 霓虹进度条
            </h2>
            <div className="space-y-6">
              <NeonProgressBar value={progress1} color="cyan" showPercentage glow />
              <NeonProgressBar value={progress2} color="purple" label="处理中..." striped />
              <NeonProgressBar value={60} color="pink" height="lg" showValue />
              <NeonProgressBar value={85} color="green" glow striped showPercentage />
            </div>
          </Card>

          {/* DataStream */}
          <Card variant="hologram">
            <h2 className="text-2xl font-display font-bold text-cyber-yellow mb-4">
              DataStream 数据流
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-32 border border-cyber-border rounded overflow-hidden">
                <DataStream direction="vertical" color="cyan" density="normal" showCharacters />
              </div>
              <div className="h-32 border border-cyber-border rounded overflow-hidden">
                <DataStream direction="vertical" color="green" charset="binary" density="dense" />
              </div>
              <div className="h-32 border border-cyber-border rounded overflow-hidden col-span-2">
                <DataStream direction="horizontal" color="purple" density="sparse" />
              </div>
            </div>
          </Card>
        </div>

        {/* 说明文字 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-400">
            所有组件都支持自定义颜色、尺寸和动画效果
          </p>
          <p className="text-gray-500 text-sm mt-2">
            尝试悬停在组件上查看交互效果
          </p>
        </motion.div>
      </div>

      {/* AI 聊天助手 */}
      <ChatAssistant
        title="AI 助手演示"
        welcomeMessage="你好！我是 AI 助手。点击下方按钮测试各种赛博朋克组件，或与我聊天！"
        onSendMessage={handleSendMessage}
        themeColor="cyan"
      />
    </main>
  );
}
