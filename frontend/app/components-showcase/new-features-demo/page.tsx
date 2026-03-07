'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ParticleNetwork,
  CyberLoadingSpinner,
  PerformanceMonitor,
  CyberAIAssistant,
  CyberCodeEditor,
  CyberDataChart,
} from '@/components/NEW_FEATURES_EXPORT';
import { Code, Sparkles, BarChart3, MessageSquare, Zap, Activity } from 'lucide-react';

export default function NewFeaturesDemo() {
  const [code, setCode] = useState(`// CyberPress Platform - 示例代码
import { useState } from 'react';

export function Example() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Hello, CyberPress!</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>
        Increment
      </button>
    </div>
  );
}`);

  const [chartData] = useState([
    { label: '一月', value: 65 },
    { label: '二月', value: 85 },
    { label: '三月', value: 45 },
    { label: '四月', value: 95 },
    { label: '五月', value: 75 },
    { label: '六月', value: 55 },
  ]);

  const handleAIMessage = async (message: string) => {
    // 模拟 AI 响应
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return `我收到了你的消息："${message}"。这是一个演示响应，实际使用时请连接真实的 AI API。`;
  };

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* 背景粒子效果 */}
      <ParticleNetwork particleCount={50} connectionDistance={120} mouseDistance={150} />

      {/* 性能监控 */}
      <PerformanceMonitor position="top-right" />

      {/* AI 助手 */}
      <CyberAIAssistant
        position="bottom-right"
        theme="cyan"
        greeting="👋 欢迎使用 CyberPress 新功能演示！"
        suggestions={[
          '介绍这些新功能',
          '如何使用粒子特效？',
          '性能监控如何工作？',
          '代码编辑器有什么特性？',
        ]}
        onSendMessage={handleAIMessage}
      />

      {/* 主内容 */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* 标题 */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-6xl font-bold mb-4 text-glow-cyan">
            CyberPress Platform
          </h1>
          <p className="text-xl text-gray-400">新功能组件演示</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Sparkles className="w-5 h-5 text-cyber-cyan" />
            <span className="text-cyber-cyan">最新创建的高级组件</span>
          </div>
        </motion.div>

        {/* 功能网格 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* 1. 粒子网络效果 */}
          <motion.div
            className="bg-cyber-card/50 backdrop-blur-md border border-cyber-cyan/30 rounded-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-cyber-cyan/10 rounded-lg">
                <Activity className="w-6 h-6 text-cyber-cyan" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-cyber-cyan">粒子网络效果</h3>
                <p className="text-sm text-gray-400">ParticleNetwork</p>
              </div>
            </div>

            <div className="bg-cyber-dark/50 rounded-lg p-4 mb-4 relative overflow-hidden" style={{ height: '200px' }}>
              <ParticleNetwork
                particleCount={30}
                connectionDistance={100}
                mouseDistance={120}
                colors={['#00f0ff', '#9d00ff', '#ff0080']}
              />
            </div>

            <p className="text-gray-300 text-sm mb-4">
              交互式粒子动画效果，支持鼠标交互，可自定义粒子数量、连接距离和颜色。
            </p>

            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-cyber-cyan/10 text-cyber-cyan text-xs rounded-full">
                Canvas
              </span>
              <span className="px-3 py-1 bg-cyber-cyan/10 text-cyber-cyan text-xs rounded-full">
                动画
              </span>
              <span className="px-3 py-1 bg-cyber-cyan/10 text-cyber-cyan text-xs rounded-full">
                交互
              </span>
            </div>
          </motion.div>

          {/* 2. 赛博加载动画 */}
          <motion.div
            className="bg-cyber-card/50 backdrop-blur-md border border-cyber-purple/30 rounded-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-cyber-purple/10 rounded-lg">
                <Zap className="w-6 h-6 text-cyber-purple" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-cyber-purple">赛博加载动画</h3>
                <p className="text-sm text-gray-400">CyberLoadingSpinner</p>
              </div>
            </div>

            <div className="bg-cyber-dark/50 rounded-lg p-8 mb-4 flex items-center justify-center">
              <CyberLoadingSpinner
                size="lg"
                color="purple"
                text="加载中..."
                showPercentage
              />
            </div>

            <p className="text-gray-300 text-sm mb-4">
              霓虹风格的加载动画，支持多种尺寸、颜色和进度显示。
            </p>

            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-cyber-purple/10 text-cyber-purple text-xs rounded-full">
                动画
              </span>
              <span className="px-3 py-1 bg-cyber-purple/10 text-cyber-purple text-xs rounded-full">
                加载
              </span>
              <span className="px-3 py-1 bg-cyber-purple/10 text-cyber-purple text-xs rounded-full">
                进度
              </span>
            </div>
          </motion.div>

          {/* 3. 代码编辑器 */}
          <motion.div
            className="bg-cyber-card/50 backdrop-blur-md border border-cyber-pink/30 rounded-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-cyber-pink/10 rounded-lg">
                <Code className="w-6 h-6 text-cyber-pink" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-cyber-pink">代码编辑器</h3>
                <p className="text-sm text-gray-400">CyberCodeEditor</p>
              </div>
            </div>

            <div className="mb-4">
              <CyberCodeEditor
                value={code}
                onChange={setCode}
                language="typescript"
                theme="dark"
                height="250px"
                showLineNumbers
                showActions
              />
            </div>

            <p className="text-gray-300 text-sm mb-4">
              功能丰富的代码编辑器，支持语法高亮、行号、复制、下载等功能。
            </p>

            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-cyber-pink/10 text-cyber-pink text-xs rounded-full">
                编辑器
              </span>
              <span className="px-3 py-1 bg-cyber-pink/10 text-cyber-pink text-xs rounded-full">
                语法高亮
              </span>
              <span className="px-3 py-1 bg-cyber-pink/10 text-cyber-pink text-xs rounded-full">
                工具
              </span>
            </div>
          </motion.div>

          {/* 4. 数据图表 */}
          <motion.div
            className="bg-cyber-card/50 backdrop-blur-md border border-cyber-green/30 rounded-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-cyber-green/10 rounded-lg">
                <BarChart3 className="w-6 h-6 text-cyber-green" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-cyber-green">数据图表</h3>
                <p className="text-sm text-gray-400">CyberDataChart</p>
              </div>
            </div>

            <div className="mb-4">
              <CyberDataChart
                data={chartData}
                type="bar"
                title="月度数据统计"
                description="展示赛博朋克风格的数据可视化"
                theme="green"
                height={250}
                animated
              />
            </div>

            <p className="text-gray-300 text-sm mb-4">
              支持多种图表类型的可视化组件，包括柱状图、折线图、饼图等。
            </p>

            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-cyber-green/10 text-cyber-green text-xs rounded-full">
                图表
              </span>
              <span className="px-3 py-1 bg-cyber-green/10 text-cyber-green text-xs rounded-full">
                可视化
              </span>
              <span className="px-3 py-1 bg-cyber-green/10 text-cyber-green text-xs rounded-full">
                数据
              </span>
            </div>
          </motion.div>
        </div>

        {/* AI 助手说明 */}
        <motion.div
          className="bg-cyber-card/50 backdrop-blur-md border border-cyber-cyan/30 rounded-lg p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-cyber-cyan/10 rounded-lg">
              <MessageSquare className="w-6 h-6 text-cyber-cyan" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-cyber-cyan">AI 智能助手</h3>
              <p className="text-sm text-gray-400">CyberAIAssistant</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-lg font-semibold text-cyber-cyan mb-3">核心功能</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-cyber-cyan">✓</span>
                  <span>实时对话交互</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyber-cyan">✓</span>
                  <span>快捷建议提示</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyber-cyan">✓</span>
                  <span>打字机动画效果</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyber-cyan">✓</span>
                  <span>多主题支持</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyber-cyan">✓</span>
                  <span>自定义 AI 集成</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-cyber-cyan mb-3">使用方式</h4>
              <div className="bg-cyber-dark/50 rounded-lg p-4 text-sm">
                <pre className="text-gray-300 overflow-x-auto">
{`<CyberAIAssistant
  theme="cyan"
  greeting="你好！"
  suggestions={['建议1', '建议2']}
  onSendMessage={async (msg) => {
    return 'AI回复';
  }}
/>`}
                </pre>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-400 mb-4">
              点击右下角的 AI 助手图标开始体验智能对话功能
            </p>
            <motion.button
              className="px-6 py-3 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-lg text-cyber-cyan hover:bg-cyber-cyan/20 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              打开 AI 助手
            </motion.button>
          </div>
        </motion.div>

        {/* 页脚 */}
        <motion.div
          className="text-center mt-16 text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="text-sm">
            Built with ❤️ using Next.js 14 + TypeScript + Framer Motion
          </p>
          <p className="text-xs mt-2 text-cyber-cyan">
            CyberPress Platform - 赛博朋克风格博客平台
          </p>
        </motion.div>
      </div>
    </div>
  );
}
