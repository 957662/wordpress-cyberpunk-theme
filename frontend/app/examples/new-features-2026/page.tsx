'use client';

/**
 * 新功能示例页面 - 2026-03-03
 * 展示本次创建的新组件和工具
 */

import { useState } from 'react';
import { AIAssistant } from '@/components/ai/AIAssistant';
import { AIChatPanel } from '@/components/ai/AIChatPanel';
import { LineChart } from '@/components/charts/LineChart';
import storage from '@/services/storage';
import bus from '@/services/eventBus';
import { cn } from '@/lib/cn';
import { motion } from 'framer-motion';

export default function NewFeatures2026Page() {
  const [chartData] = useState([
    { x: 0, y: 10, label: '一月' },
    { x: 1, y: 25, label: '二月' },
    { x: 2, y: 15, label: '三月' },
    { x: 3, y: 30, label: '四月' },
    { x: 4, y: 20, label: '五月' },
    { x: 5, y: 45, label: '六月' },
  ]);

  const handleSendMessage = async (message: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    bus.emit('ai:message', { message });
    storage.setLocal('lastMessage', message);

    return `我收到了你的消息:"${message}"。这是一个演示响应。`;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            新功能示例 - 2026
          </h1>
          <p className="text-gray-400 mt-2">
            展示本次会话创建的新组件和工具
          </p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-12">
        {/* AI 助手 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-cyan-400">AI 助手组件</h2>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">AI 聊天面板</h3>
              <div className="h-[400px]">
                <AIChatPanel
                  onSend={async (msg) => handleSendMessage(msg)}
                  placeholder="输入消息..."
                />
              </div>
            </div>
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">AI 助手浮窗</h3>
              <p className="text-gray-400">
                点击右下角的按钮打开 AI 助手浮窗
              </p>
            </div>
          </div>
        </section>

        {/* 图表 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-cyan-400">折线图组件</h2>
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <div className="flex justify-center">
              <LineChart
                lines={[
                  {
                    data: chartData,
                    color: '#06b6d4',
                    label: '数据',
                    fill: true,
                    gradient: true,
                  },
                ]}
                width={800}
                height={400}
              />
            </div>
          </div>
        </section>

        {/* 服务层 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-cyan-400">服务层</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">存储服务</h3>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    storage.setLocal('demo', { time: Date.now() });
                    alert('已保存');
                  }}
                  className="w-full px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg"
                >
                  保存数据
                </button>
                <button
                  onClick={() => {
                    const data = storage.getLocal('demo');
                    alert(data ? JSON.stringify(data) : '无数据');
                  }}
                  className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg"
                >
                  读取数据
                </button>
              </div>
            </div>

            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">事件总线</h3>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    bus.emit('demo:event', { message: 'Hello!' });
                    alert('已发布');
                  }}
                  className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg"
                >
                  发布事件
                </button>
                <div className="text-xs text-gray-500">
                  当前事件数量: {bus.count()}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 工具库 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-cyan-400">工具库示例</h2>
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <pre className="text-sm text-gray-300 overflow-x-auto">
{`// cn() - 类名合并
cn('px-4', 'py-2', 'bg-cyan-500')

// 条件类名
cn('base-class', isActive && 'active-class')`}
            </pre>
          </div>
        </section>
      </main>

      <AIAssistant
        onSend={handleSendMessage}
        theme="cyan"
        title="演示助手"
        welcomeMessage="你好!我是演示助手。"
      />

      <footer className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-xl mt-12">
        <div className="container mx-auto px-6 py-6 text-center text-gray-400 text-sm">
          <p>CyberPress Platform - 2026-03-03</p>
        </div>
      </footer>
    </div>
  );
}
