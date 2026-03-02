/**
 * Admin Layout Component
 * 管理后台布局组件
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Tag,
  MessageSquare,
  Users,
  Settings,
  Image as ImageIcon,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
  Search,
  Moon,
  Sun,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: number | string;
  children?: NavItem[];
}

const NAVIGATION: NavItem[] = [
  {
    title: '仪表板',
    href: '/admin',
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    title: '文章管理',
    href: '/admin/posts',
    icon: <FileText className="w-5 h-5" />,
    badge: 12,
  },
  {
    title: '分类管理',
    href: '/admin/categories',
    icon: <FolderOpen className="w-5 h-5" />,
  },
  {
    title: '标签管理',
    href: '/admin/tags',
    icon: <Tag className="w-5 h-5" />,
  },
  {
    title: '评论管理',
    href: '/admin/comments',
    icon: <MessageSquare className="w-5 h-5" />,
    badge: 5,
  },
  {
    title: '媒体库',
    href: '/admin/media',
    icon: <ImageIcon className="w-5 h-5" />,
  },
  {
    title: '用户管理',
    href: '/admin/users',
    icon: <Users className="w-5 h-5" />,
  },
  {
    title: '系统设置',
    href: '/admin/settings',
    icon: <Settings className="w-5 h-5" />,
  },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* 侧边栏遮罩 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 侧边栏 */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-gray-800 border-r border-gray-700 transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold text-white">CyberPress</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* 导航菜单 */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {NAVIGATION.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative group',
                    isActive
                      ? 'bg-cyan-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  )}
                >
                  {item.icon}
                  <span className="flex-1">{item.title}</span>
                  {item.badge && (
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded-full text-xs font-medium',
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-cyan-600/20 text-cyan-400'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight
                    className={cn(
                      'w-4 h-4 transition-transform absolute right-2',
                      isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* 底部用户信息 */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-700/50">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold">
                A
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">管理员</p>
                <p className="text-xs text-gray-400 truncate">admin@cyberpress.com</p>
              </div>
              <button className="text-gray-400 hover:text-white">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* 主内容区 */}
      <div className="lg:ml-64">
        {/* 顶部导航栏 */}
        <header className="sticky top-0 z-30 h-16 bg-gray-800/80 backdrop-blur-sm border-b border-gray-700">
          <div className="flex items-center justify-between h-full px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-gray-400 hover:text-white"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* 搜索框 */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索..."
                  className="w-64 pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* 主题切换 */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* 通知 */}
              <button className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* 用户菜单 */}
              <button className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-700 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                  A
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* 主内容 */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

// 统计卡片组件
export function StatCard({
  title,
  value,
  change,
  icon,
  color = 'cyan',
}: {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  color?: 'cyan' | 'purple' | 'green' | 'orange' | 'red' | 'blue';
}) {
  const colorClasses = {
    cyan: 'from-cyan-500 to-cyan-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
    blue: 'from-blue-500 to-blue-600',
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-white`}
        >
          {icon}
        </div>
        {change && (
          <span
            className={cn(
              'text-sm font-medium',
              change.startsWith('+') ? 'text-green-400' : 'text-red-400'
            )}
          >
            {change}
          </span>
        )}
      </div>
      <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
      <p className="text-gray-400 text-sm">{title}</p>
    </div>
  );
}

// 面包屑组件
export function Breadcrumb({
  items,
}: {
  items: Array<{ title: string; href?: string }>;
}) {
  return (
    <nav className="flex items-center gap-2 text-sm mb-6">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight className="w-4 h-4 text-gray-500" />}
          {item.href ? (
            <Link
              href={item.href}
              className="text-gray-400 hover:text-cyan-500 transition-colors"
            >
              {item.title}
            </Link>
          ) : (
            <span className="text-gray-300">{item.title}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

// 页面标题组件
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
        {description && <p className="text-gray-400">{description}</p>}
      </div>
      {actions && <div className="flex gap-3">{actions}</div>}
    </div>
  );
}
