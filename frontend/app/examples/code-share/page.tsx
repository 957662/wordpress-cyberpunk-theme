'use client';

/**
 * Code Share Examples - 代码分享组件示例
 */

import { useState } from 'react';
import { CodeShare } from '@/components/code-share';
import { CodeShareModal } from '@/components/code-share';
import { CyberButton } from '@/components/ui';

const exampleCode = `/**
 * 赛博朋克风格代码示例
 * 展示代码分享组件的功能
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CyberCardProps {
  title: string;
  description: string;
}

export function CyberCard({ title, description }: CyberCardProps) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // 组件挂载时的初始化逻辑
    console.log('Card mounted:', title);
  }, [title]);

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="cyber-card p-6"
      onClick={() => setIsActive(!isActive)}
    >
      <h2 className="text-2xl font-bold text-cyber-cyan mb-3">
        {title}
      </h2>
      <p className="text-gray-300">
        {description}
      </p>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-4 bg-cyber-dark/50 rounded-lg"
        >
          <p className="text-sm text-cyber-purple">
            卡片已激活！
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}`;

const pythonExample = `# Python 代码示例
from typing import List, Optional
import asyncio

class CyberProcessor:
    """赛博朋克风格数据处理器"""
    
    def __init__(self, name: str):
        self.name = name
        self.data: List[dict] = []
    
    async def process_data(self, items: List[dict]) -> Optional[dict]:
        """异步处理数据"""
        try:
            # 模拟异步处理
            await asyncio.sleep(1)
            
            result = {
                'processor': self.name,
                'count': len(items),
                'status': 'success'
            }
            
            return result
            
        except Exception as e:
            print(f"Error processing data: {e}")
            return None
    
    def __repr__(self) -> str:
        return f"CyberProcessor(name='{self.name}')"

# 使用示例
processor = CyberProcessor("AI-Engine")
result = await processor.process_data([{'id': 1}, {'id': 2}])
print(result)`;

export default function CodeShareExamples() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cyber-dark">
      <div className="max-w-6xl mx-auto px-4 py-20">
        {/* 头部 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            代码分享组件
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            支持语法高亮、复制、下载等功能的代码展示组件
          </p>
          <CyberButton
            onClick={() => setIsModalOpen(true)}
            icon={<span className="text-lg">+</span>}
          >
            创建代码分享
          </CyberButton>
        </div>

        {/* TypeScript 示例 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-cyber-cyan mb-4">
            TypeScript 代码
          </h2>
          <CodeShare
            code={exampleCode}
            language="typescript"
            filename="CyberCard.tsx"
            showFilename
            theme="dark"
          />
        </div>

        {/* Python 示例 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-cyber-purple mb-4">
            Python 代码
          </h2>
          <CodeShare
            code={pythonExample}
            language="python"
            filename="processor.py"
            showFilename
            theme="synthwave"
          />
        </div>

        {/* 内联代码示例 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-cyber-pink mb-4">
            紧凑模式（无文件名）
          </h2>
          <CodeShare
            code={`console.log('Hello, CyberPress!');`}
            language="javascript"
            showFilename={false}
          />
        </div>

        {/* 使用说明 */}
        <div className="cyber-card p-6">
          <h2 className="text-xl font-bold text-white mb-4">功能特性</h2>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-cyber-cyan">✓</span>
              <span>支持多种编程语言的语法高亮</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyber-cyan">✓</span>
              <span>一键复制代码到剪贴板</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyber-cyan">✓</span>
              <span>下载代码为文件</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyber-cyan">✓</span>
              <span>展开/收起长代码</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyber-cyan">✓</span>
              <span>赛博朋克和 Synthwave 主题</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyber-cyan">✓</span>
              <span>行号显示</span>
            </li>
          </ul>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-white mb-3">使用方法</h3>
            <pre className="bg-cyber-dark/50 p-4 rounded-lg overflow-x-auto text-sm text-gray-300">
{`import { CodeShare } from '@/components/code-share';

<CodeShare
  code={codeString}
  language="typescript"
  filename="example.tsx"
  showFilename
  theme="dark"
  showLineNumbers
/>`}
            </pre>
          </div>
        </div>
      </div>

      {/* 代码分享模态框 */}
      <CodeShareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
