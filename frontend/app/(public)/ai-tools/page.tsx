'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Image as ImageIcon, Code2, MessageSquare } from 'lucide-react';
import { GlitchText } from '@/components/effects/GlitchText';
import { CyberCard } from '@/components/effects/CyberCard';
import { ChatAssistant } from '@/components/ai/ChatAssistant';
import { ImageGenerator } from '@/components/ai/ImageGenerator';
import { CodeAssistant } from '@/components/ai/CodeAssistant';

/**
 * AI 工具页面
 * 展示所有 AI 相关功能
 */
export default function AIToolsPage() {
  const [activeTool, setActiveTool] = React.useState<'chat' | 'image' | 'code'>('chat');

  const tools = [
    {
      id: 'chat' as const,
      name: 'AI 聊天助手',
      description: '智能对话，解答问题',
      icon: MessageSquare,
      color: 'cyan',
    },
    {
      id: 'image' as const,
      name: 'AI 图片生成',
      description: '文字转图片，创意无限',
      icon: ImageIcon,
      color: 'purple',
    },
    {
      id: 'code' as const,
      name: 'AI 代码助手',
      description: '生成代码，优化代码',
      icon: Code2,
      color: 'pink',
    },
  ];

  return (
    <div className="min-h-screen bg-cyber-darker">
      {/* 页面头部 */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyber-cyan/5 to-transparent" />
        <div className="container mx-auto px-4 py-12 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-8 h-8 text-cyber-cyan" />
              <GlitchText text="AI 工具集" size="3xl" themeColor="cyan" />
            </div>
            <p className="text-gray-400 text-lg">
              探索 AI 驱动的强大工具，提升创作效率
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* 工具选择侧边栏 */}
          <div className="lg:col-span-1">
            <CyberCard className="p-4 sticky top-4">
              <h2 className="font-display font-bold text-xl text-cyber-cyan mb-4">
                选择工具
              </h2>
              <div className="space-y-2">
                {tools.map((tool) => (
                  <motion.button
                    key={tool.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTool(tool.id)}
                    className={`
                      w-full p-4 rounded-lg border-2 transition-all
                      flex items-start gap-3 text-left
                      ${activeTool === tool.id
                        ? `border-${tool.color} bg-${tool.color}/10`
                        : 'border-cyber-border hover:border-gray-500'
                      }
                    `}
                  >
                    <tool.icon className={`w-6 h-6 text-${tool.color} flex-shrink-0 mt-1`} />
                    <div>
                      <h3 className="font-medium text-white mb-1">{tool.name}</h3>
                      <p className="text-sm text-gray-400">{tool.description}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </CyberCard>
          </div>

          {/* 工具内容区域 */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTool}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTool === 'chat' && (
                  <div>
                    <div className="mb-6">
                      <h2 className="font-display font-bold text-2xl text-cyber-cyan mb-2">
                        AI 聊天助手
                      </h2>
                      <p className="text-gray-400">
                        与 AI 智能助手对话，获取帮助、解答问题、提供建议
                      </p>
                    </div>
                    <ChatAssistant
                      themeColor="cyan"
                      className="fixed bottom-6 right-6"
                    />
                  </div>
                )}

                {activeTool === 'image' && (
                  <div>
                    <div className="mb-6">
                      <h2 className="font-display font-bold text-2xl text-cyber-purple mb-2">
                        AI 图片生成器
                      </h2>
                      <p className="text-gray-400">
                        使用 AI 生成赛博朋克风格的图片，支持多种艺术风格
                      </p>
                    </div>
                    <ImageGenerator themeColor="purple" />
                  </div>
                )}

                {activeTool === 'code' && (
                  <div>
                    <div className="mb-6">
                      <h2 className="font-display font-bold text-2xl text-cyber-pink mb-2">
                        AI 代码助手
                      </h2>
                      <p className="text-gray-400">
                        智能生成代码、优化代码、解释代码，支持多种编程语言
                      </p>
                    </div>
                    <CodeAssistant themeColor="pink" />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
