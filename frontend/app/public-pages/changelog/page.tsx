/**
 * 更新日志页面
 */

import { Metadata } from 'next';
import { motion } from 'framer-motion';
import { Calendar, Zap, Bug, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: '更新日志 | CyberPress',
  description: 'CyberPress 项目的更新历史和版本记录',
};

const changelogs = [
  {
    version: '2.0.0',
    date: '2026-03-01',
    status: 'latest',
    icon: <Sparkles className="w-6 h-6" />,
    color: 'cyber-cyan',
    changes: [
      {
        type: 'new',
        title: '全新设计系统',
        description: '引入赛博朋克主题，包含霓虹色彩、故障效果和全息卡片',
      },
      {
        type: 'new',
        title: 'AI 助手集成',
        description: '添加 AI 写作助手，支持智能内容生成和优化建议',
      },
      {
        type: 'improved',
        title: '性能优化',
        description: '页面加载速度提升 50%，优化图片加载和代码分割',
      },
      {
        type: 'fixed',
        title: 'Bug 修复',
        description: '修复移动端显示问题，改进触摸交互体验',
      },
    ],
  },
  {
    version: '1.5.0',
    date: '2026-02-15',
    icon: <Zap className="w-6 h-6" />,
    color: 'cyber-purple',
    changes: [
      {
        type: 'new',
        title: '实时协作',
        description: '支持多用户同时编辑和评论',
      },
      {
        type: 'new',
        title: '深色模式',
        description: '添加完整的深色主题支持',
      },
      {
        type: 'improved',
        title: 'SEO 优化',
        description: '改进 meta 标签和结构化数据',
      },
    ],
  },
  {
    version: '1.4.0',
    date: '2026-01-20',
    icon: <Calendar className="w-6 h-6" />,
    color: 'cyber-pink',
    changes: [
      {
        type: 'new',
        title: '搜索功能',
        description: '添加全文搜索和智能建议',
      },
      {
        type: 'improved',
        title: '评论系统',
        description: '重新设计评论界面，添加嵌套回复',
      },
      {
        type: 'fixed',
        title: '兼容性',
        description: '修复 Safari 浏览器兼容性问题',
      },
    ],
  },
  {
    version: '1.3.0',
    date: '2025-12-10',
    icon: <Bug className="w-6 h-6" />,
    color: 'cyber-yellow',
    changes: [
      {
        type: 'new',
        title: 'RSS 订阅',
        description: '支持 RSS 和 Atom 订阅源',
      },
      {
        type: 'improved',
        title: '缓存策略',
        description: '优化客户端和服务器缓存机制',
      },
    ],
  },
  {
    version: '1.0.0',
    date: '2025-11-01',
    icon: <Sparkles className="w-6 h-6" />,
    color: 'cyber-green',
    changes: [
      {
        type: 'new',
        title: '首次发布',
        description: 'CyberPress 1.0 正式发布',
      },
      {
        type: 'new',
        title: '核心功能',
        description: '博客发布、作品展示、用户评论等基础功能',
      },
    ],
  },
];

const changeTypeConfig = {
  new: {
    icon: <Sparkles className="w-4 h-4" />,
    label: '新增',
    color: 'text-cyber-green',
    bg: 'bg-cyber-green/10',
  },
  improved: {
    icon: <Zap className="w-4 h-4" />,
    label: '改进',
    color: 'text-cyber-cyan',
    bg: 'bg-cyber-cyan/10',
  },
  fixed: {
    icon: <Bug className="w-4 h-4" />,
    label: '修复',
    color: 'text-cyber-pink',
    bg: 'bg-cyber-pink/10',
  },
};

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-cyber-dark">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', duration: 0.8 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center"
            >
              <Calendar className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-5xl font-display font-bold text-white mb-4">
              更新日志
            </h1>
            <p className="text-gray-400">
              跟踪 CyberPress 的演进历程
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-cyber-border" />

            {/* Versions */}
            <div className="space-y-8">
              {changelogs.map((log, index) => (
                <motion.div
                  key={log.version}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative pl-20"
                >
                  {/* Timeline Dot */}
                  <div className={`absolute left-6 w-5 h-5 rounded-full bg-${log.color} border-4 border-cyber-dark`} />

                  {/* Version Card */}
                  <Card variant={log.status === 'latest' ? 'neon' : 'default'} glowColor={log.color as any}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`text-${log.color}`}>
                          {log.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-display font-bold text-white">
                              v{log.version}
                            </h2>
                            {log.status === 'latest' && (
                              <span className="px-2 py-0.5 bg-cyber-cyan text-cyber-dark text-xs font-bold rounded">
                                最新
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{log.date}</p>
                        </div>
                      </div>
                    </div>

                    {/* Changes */}
                    <div className="space-y-3">
                      {log.changes.map((change, changeIndex) => {
                        const config = changeTypeConfig[change.type as keyof typeof changeTypeConfig];
                        return (
                          <div key={changeIndex} className="flex gap-3">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${config.bg} ${config.color} flex items-center justify-center`}>
                              {config.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-xs font-medium ${config.color}`}>
                                  {config.label}
                                </span>
                                <h3 className="font-semibold text-white">
                                  {change.title}
                                </h3>
                              </div>
                              <p className="text-sm text-gray-400">
                                {change.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer Info */}
          <Card className="mt-12">
            <div className="text-center">
              <h3 className="text-xl font-display font-bold text-cyber-cyan mb-2">
                保持关注
              </h3>
              <p className="text-gray-300 mb-4">
                我们持续改进 CyberPress，定期发布新功能和修复。
              </p>
              <div className="flex justify-center gap-4">
                <a
                  href="https://github.com/cyberpress/cyberpress"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-cyber-muted border border-cyber-border rounded-lg text-gray-300 hover:border-cyber-cyan hover:text-cyber-cyan transition-colors"
                >
                  GitHub
                </a>
                <a
                  href="/rss.xml"
                  className="px-4 py-2 bg-cyber-muted border border-cyber-border rounded-lg text-gray-300 hover:border-cyber-cyan hover:text-cyber-cyan transition-colors"
                >
                  RSS 订阅
                </a>
              </div>
            </div>
          </Card>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
