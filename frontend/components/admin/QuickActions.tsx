'use client';

import { motion } from 'framer-motion';
import { FileText, Image, Users, Settings, MessageSquare, BarChart3, Zap, Database } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface QuickAction {
  label: string;
  description: string;
  icon: any;
  href: string;
  color: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
  badge?: number;
}

const quickActions: QuickAction[] = [
  {
    label: '新建文章',
    description: '创建新的博客文章',
    icon: FileText,
    href: '/admin/posts/new',
    color: 'cyan',
  },
  {
    label: '上传媒体',
    description: '添加图片、视频等',
    icon: Image,
    href: '/admin/media',
    color: 'purple',
  },
  {
    label: '管理评论',
    description: '审核和管理评论',
    icon: MessageSquare,
    href: '/admin/comments',
    color: 'pink',
    badge: 5,
  },
  {
    label: '用户管理',
    description: '管理网站用户',
    icon: Users,
    href: '/admin/users',
    color: 'green',
  },
  {
    label: '数据统计',
    description: '查看网站数据',
    icon: BarChart3,
    href: '/admin/analytics',
    color: 'yellow',
  },
  {
    label: '系统设置',
    description: '配置网站选项',
    icon: Settings,
    href: '/admin/settings',
    color: 'cyan',
  },
];

const systemActions: QuickAction[] = [
  {
    label: '性能优化',
    description: '清理缓存、优化数据库',
    icon: Zap,
    href: '/admin/performance',
    color: 'green',
  },
  {
    label: '数据库管理',
    description: '备份、恢复数据库',
    icon: Database,
    href: '/admin/database',
    color: 'purple',
  },
];

interface QuickActionsProps {
  variant?: 'dashboard' | 'sidebar';
}

export function QuickActions({ variant = 'dashboard' }: QuickActionsProps) {
  const router = useRouter();

  const handleActionClick = (href: string) => {
    router.push(href);
  };

  if (variant === 'sidebar') {
    return (
      <div className="space-y-2">
        {quickActions.slice(0, 4).map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              onClick={() => handleActionClick(action.href)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-cyber-muted/50 transition-all group"
            >
              <div className={`p-2 rounded-lg bg-cyber-${action.color}-500/20 group-hover:bg-cyber-${action.color}-500/30 transition-all`}>
                <Icon className={`w-5 h-5 text-cyber-${action.color}`} />
              </div>
              <div className="text-left flex-1">
                <p className="text-sm font-medium text-white">{action.label}</p>
                <p className="text-xs text-gray-500">{action.description}</p>
              </div>
              {action.badge && (
                <span className={`px-2 py-1 rounded-full bg-cyber-${action.color} text-cyber-dark text-xs font-bold`}>
                  {action.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 内容管理 */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-cyber-cyan" />
          内容管理
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleActionClick(action.href)}
                className="cyber-card p-6 rounded-lg text-left hover:border-cyber-cyan/50 transition-all group relative overflow-hidden"
              >
                {/* 背景光效 */}
                <div className={`absolute top-0 right-0 w-24 h-24 bg-cyber-${action.color}-500/10 rounded-full blur-2xl group-hover:bg-cyber-${action.color}-500/20 transition-all`} />

                <div className="relative">
                  <div className={`flex items-center justify-between mb-4`}>
                    <div className={`p-3 rounded-lg bg-cyber-${action.color}-500/20 group-hover:bg-cyber-${action.color}-500/30 transition-all`}>
                      <Icon className={`w-6 h-6 text-cyber-${action.color}`} />
                    </div>
                    {action.badge && (
                      <span className={`px-2 py-1 rounded-full bg-cyber-${action.color} text-cyber-dark text-xs font-bold`}>
                        {action.badge}
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-white mb-1">{action.label}</h4>
                  <p className="text-sm text-gray-400">{action.description}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 系统操作 */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-cyber-purple" />
          系统操作
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {systemActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 + 0.3 }}
                onClick={() => handleActionClick(action.href)}
                className="cyber-card p-4 rounded-lg text-left hover:border-cyber-purple/50 transition-all group flex items-center gap-4"
              >
                <div className={`p-3 rounded-lg bg-cyber-${action.color}-500/20 group-hover:bg-cyber-${action.color}-500/30 transition-all`}>
                  <Icon className={`w-6 h-6 text-cyber-${action.color}`} />
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-bold text-white">{action.label}</h4>
                  <p className="text-sm text-gray-400">{action.description}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * 迷你快速操作组件（用于仪表板）
 */
export function MiniQuickActions() {
  const router = useRouter();

  const miniActions = quickActions.slice(0, 4);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {miniActions.map((action) => {
        const Icon = action.icon;
        return (
          <motion.button
            key={action.label}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push(action.href)}
            className="cyber-card p-4 rounded-lg text-center group"
          >
            <div className={`p-3 rounded-lg bg-cyber-${action.color}-500/20 group-hover:bg-cyber-${action.color}-500/30 transition-all mx-auto mb-3`}>
              <Icon className={`w-6 h-6 text-cyber-${action.color}`} />
            </div>
            <p className="text-sm font-medium text-white">{action.label}</p>
            {action.badge && (
              <span className={`inline-block mt-2 px-2 py-0.5 rounded-full bg-cyber-${action.color} text-cyber-dark text-xs font-bold`}>
                {action.badge}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

/**
 * 快速操作下拉菜单
 */
export function QuickActionsDropdown() {
  return (
    <div className="w-64">
      <div className="p-2 border-b border-gray-800">
        <p className="px-3 py-2 text-xs font-bold text-gray-500 uppercase">快速操作</p>
      </div>
      <div className="p-2 space-y-1 max-h-96 overflow-y-auto">
        {[...quickActions, ...systemActions].map((action) => {
          const Icon = action.icon;
          return (
            <a
              key={action.label}
              href={action.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-cyber-muted/50 transition-all group"
            >
              <div className={`p-2 rounded bg-cyber-${action.color}-500/20 group-hover:bg-cyber-${action.color}-500/30 transition-all`}>
                <Icon className={`w-4 h-4 text-cyber-${action.color}`} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-white">{action.label}</p>
                <p className="text-xs text-gray-500">{action.description}</p>
              </div>
              {action.badge && (
                <span className={`px-2 py-0.5 rounded-full bg-cyber-${action.color} text-cyber-dark text-xs font-bold`}>
                  {action.badge}
                </span>
              )}
            </a>
          );
        })}
      </div>
      <div className="p-2 border-t border-gray-800">
        <a
          href="/admin"
          className="flex items-center justify-center px-3 py-2 rounded-lg bg-cyber-muted hover:bg-cyber-muted/80 transition-all text-sm text-gray-300"
        >
          查看所有功能
        </a>
      </div>
    </div>
  );
}
