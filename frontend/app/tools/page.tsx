'use client';

import React from 'react';
import { ArticleImportExport } from '@/components/article-import/ArticleImportExport';
import { CyberCard } from '@/components/ui/CyberCard';
import { motion } from 'framer-motion';
import {
  Upload,
  Download,
  Settings,
  BarChart3,
  FileText,
  Zap
} from 'lucide-react';

export default function ToolsPage() {
  const tools = [
    {
      id: 'import-export',
      title: '文章导入导出',
      description: '批量导入或导出您的文章内容',
      icon: Upload,
      color: 'cyan',
    },
    {
      id: 'analytics',
      title: '数据分析',
      description: '查看详细的访问和互动统计',
      icon: BarChart3,
      color: 'purple',
      disabled: true,
    },
    {
      id: 'seo-optimizer',
      title: 'SEO 优化',
      description: '优化文章的搜索引擎排名',
      icon: Zap,
      color: 'pink',
      disabled: true,
    },
    {
      id: 'bulk-edit',
      title: '批量编辑',
      description: '批量修改文章属性和标签',
      icon: FileText,
      color: 'green',
      disabled: true,
    },
  ];

  return (
    <div className="min-h-screen bg-cyber-dark py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">工具箱</h1>
          <p className="text-gray-400">实用工具帮助您更高效地管理内容</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            const colorClasses = {
              cyan: 'text-cyber-cyan border-cyber-cyan/30 hover:border-cyber-cyan/50',
              purple: 'text-cyber-purple border-cyber-purple/30 hover:border-cyber-purple/50',
              pink: 'text-cyber-pink border-cyber-pink/30 hover:border-cyber-pink/50',
              green: 'text-green-400 border-green-500/30 hover:border-green-500/50',
            };

            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CyberCard
                  className={`h-full cursor-pointer transition-all ${
                    tool.disabled
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:scale-105 hover:shadow-lg hover:shadow-cyber-cyan/10'
                  } ${colorClasses[tool.color as keyof typeof colorClasses]}`}
                >
                  <div className="p-6">
                    <div className={`inline-flex p-3 rounded-lg bg-${
                      tool.color === 'cyan'
                        ? 'cyber-cyan/10'
                        : tool.color === 'purple'
                        ? 'cyber-purple/10'
                        : tool.color === 'pink'
                        ? 'cyber-pink/10'
                        : 'green-500/10'
                    } mb-4`}>
                      <Icon className={`w-6 h-6 text-${tool.color}-400`} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{tool.title}</h3>
                    <p className="text-gray-400 text-sm">{tool.description}</p>
                    {tool.disabled && (
                      <span className="inline-block mt-3 px-3 py-1 bg-gray-800 text-gray-500 text-xs rounded-full">
                        即将推出
                      </span>
                    )}
                  </div>
                </CyberCard>
              </motion.div>
            );
          })}
        </div>

        {/* 文章导入导出工具 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <CyberCard className="mb-8">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyber-cyan/10 rounded-lg">
                  <Upload className="w-6 h-6 text-cyber-cyan" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">文章导入导出</h2>
                  <p className="text-gray-400 text-sm">批量管理您的文章内容</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <ArticleImportExport />
            </div>
          </CyberCard>
        </motion.div>

        {/* 其他工具提示 */}
        <CyberCard>
          <div className="p-8 text-center">
            <Settings className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">更多工具即将推出</h3>
            <p className="text-gray-400">我们正在开发更多实用工具，敬请期待</p>
          </div>
        </CyberCard>
      </div>
    </div>
  );
}
