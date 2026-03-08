/**
 * Cyber Features Showcase Page
 * 赛博朋克特色功能展示页面
 *
 * 展示项目中的特色组件和功能
 */

'use client';

import { motion } from 'framer-motion';
import { Sparkles, Cpu, Zap, Eye } from 'lucide-react';
import { QuantumRandom } from '@/components/ui/QuantumRandom';
import { CyberWeather } from '@/components/ui/CyberWeather';
import { HoloChat } from '@/components/ui/HoloChat';
import { Card3D, Card3DExample, card3DData } from '@/components/ui/Card3D';

export default function CyberFeaturesPage() {
  const handleChatMessage = async (message: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `收到消息："${message}"。这是一个赛博朋克风格的 AI 助手，我正在为你提供帮助！`;
  };

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* 头部 */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-cyber-border/50 bg-cyber-dark/80 backdrop-blur-xl sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink">
                  赛博朋克特色功能
                </span>
              </h1>
              <p className="text-gray-400">
                探索 CyberPress 平台的独特组件和交互效果
              </p>
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            >
              <Cpu className="w-12 h-12 text-cyber-cyan" />
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* 主内容 */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* 介绍部分 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-cyber-cyan" />
            <span className="text-sm text-cyber-cyan">特色功能展示</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            体验赛博朋克风格的交互组件
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            这些独特的组件融合了未来科技感与赛博朋克美学，为用户提供沉浸式的交互体验
          </p>
        </motion.section>

        {/* 量子随机数生成器 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-cyber-cyan/20 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-cyber-cyan" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">量子随机数生成器</h3>
              <p className="text-gray-400 text-sm">模拟量子态叠加的随机数生成</p>
            </div>
          </div>
          <div className="max-w-2xl mx-auto">
            <QuantumRandom min={1} max={1000} />
          </div>
        </motion.section>

        {/* 赛博天气组件 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-cyber-purple/20 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-cyber-purple" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">赛博天气组件</h3>
              <p className="text-gray-400 text-sm">未来风格的天气显示界面</p>
            </div>
          </div>
          <div className="max-w-md mx-auto">
            <CyberWeather autoUpdate={true} />
          </div>
        </motion.section>

        {/* 全息聊天界面 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-cyber-pink/20 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-cyber-pink" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">全息聊天界面</h3>
              <p className="text-gray-400 text-sm">AI 聊天界面与全息效果</p>
            </div>
          </div>
          <div className="max-w-2xl mx-auto">
            <HoloChat
              onSendMessage={handleChatMessage}
              botName="Cyber Assistant"
            />
          </div>
        </motion.section>

        {/* 3D 卡片组件 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-cyber-yellow/20 rounded-lg flex items-center justify-center">
              <Cpu className="w-6 h-6 text-cyber-yellow" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">3D 翻转卡片</h3>
              <p className="text-gray-400 text-sm">交互式 3D 效果的卡片组件</p>
            </div>
          </div>
          <Card3DExample />
        </motion.section>

        {/* 特性列表 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6 mt-16"
        >
          {[
            {
              title: '量子随机',
              description: '模拟量子态叠加和坍缩的随机数生成过程',
              color: 'cyan',
            },
            {
              title: '全息天气',
              description: '带有动态效果和全息感的天气显示组件',
              color: 'purple',
            },
            {
              title: 'AI 聊天',
              description: '全息风格的 AI 聊天界面，支持多轮对话',
              color: 'pink',
            },
            {
              title: '3D 卡片',
              description: '支持 3D 翻转和鼠标跟随效果的交互卡片',
              color: 'yellow',
            },
            {
              title: '实时更新',
              description: '所有组件支持实时数据更新和动画效果',
              color: 'green',
            },
            {
              title: '响应式设计',
              description: '完美适配各种屏幕尺寸和设备类型',
              color: 'orange',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -5 }}
              className="cyber-card p-6 border border-cyber-border/50 hover:border-cyber-cyan/50 transition-all duration-300"
            >
              <div className={`w-12 h-12 bg-cyber-${feature.color}/20 rounded-lg flex items-center justify-center mb-4`}>
                <Sparkles className={`w-6 h-6 text-cyber-${feature.color}`} />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">{feature.title}</h4>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.section>

        {/* 使用指南 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 cyber-card p-8 border border-cyber-cyan/30"
        >
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            如何使用这些组件
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-cyber-cyan mb-4">安装</h4>
              <div className="bg-cyber-dark p-4 rounded-lg border border-cyber-border/50 font-mono text-sm">
                <p className="text-gray-300"># 导入组件</p>
                <p className="text-cyber-cyan">import {'{'} QuantumRandom {'}'} from '@/components/ui/QuantumRandom';</p>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-cyber-purple mb-4">使用</h4>
              <div className="bg-cyber-dark p-4 rounded-lg border border-cyber-border/50 font-mono text-sm">
                <p className="text-gray-300"># 在组件中使用</p>
                <p className="text-cyber-purple">&lt;QuantumRandom min={1} max={100} /&gt;</p>
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      {/* 页脚 */}
      <footer className="border-t border-cyber-border/50 mt-16 py-8 text-center text-gray-500 text-sm">
        <p>© 2024 CyberPress Platform. 赛博朋克特色功能展示</p>
        <p className="mt-2">由 AI 开发团队构建 🤖</p>
      </footer>
    </div>
  );
}
