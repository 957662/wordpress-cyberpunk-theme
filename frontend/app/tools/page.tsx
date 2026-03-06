/**
 * Tools Page - 实用工具页面
 * 展示各种实用工具
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Code, Image as ImageIcon, Zap } from 'lucide-react';
import { PasswordGenerator } from '@/components/tools/PasswordGenerator';

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* Header */}
      <div className="border-b border-cyber-cyan/20 bg-gradient-to-b from-cyber-cyan/5 to-transparent">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h1 className="text-4xl font-bold text-white mb-4">
              实用工具
            </h1>
            <p className="text-gray-400">
              开发者和设计师的在线工具箱，提升您的工作效率
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Password Generator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <PasswordGenerator />
          </motion.div>

          {/* More Tools Coming Soon */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              {
                title: '代码格式化',
                description: '格式化和美化各种编程语言代码',
                icon: Code,
                status: '即将推出'
              },
              {
                title: '图片压缩',
                description: '在线压缩图片，优化加载速度',
                icon: ImageIcon,
                status: '即将推出'
              },
              {
                title: 'JSON 工具',
                description: 'JSON 格式化、验证和转换',
                icon: Zap,
                status: '即将推出'
              }
            ].map((tool, index) => (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="cyber-card p-6 rounded-xl opacity-60"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-cyber-dark/50 rounded-lg">
                    <tool.icon className="w-6 h-6 text-cyber-cyan" />
                  </div>
                  <h3 className="font-semibold text-white">{tool.title}</h3>
                </div>
                <p className="text-sm text-gray-400 mb-3">{tool.description}</p>
                <div className="inline-block px-3 py-1 bg-cyber-purple/10 text-cyber-purple text-xs rounded-full">
                  {tool.status}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
