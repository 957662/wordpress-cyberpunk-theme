/**
 * 管理后台布局组件
 * 包含侧边栏导航和顶部栏
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { authService } from '@/lib/services/auth';

export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  {
    name: '仪表盘',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: '文章管理',
    href: '/admin/posts',
    icon: FileText,
  },
  {
    name: '媒体库',
    href: '/admin/media',
    icon: ImageIcon,
  },
  {
    name: '用户管理',
    href: '/admin/users',
    icon: Users,
  },
  {
    name: '设置',
    href: '/admin/settings',
    icon: Settings,
  },
];

export interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const user = authService.getCurrentUser();

  const handleLogout = async () => {
    await authService.logout();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* 移动端遮罩 */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* 侧边栏 */}
      <motion.aside
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : -320,
        }}
        className="fixed top-0 left-0 z-50 h-full w-80 bg-cyber-dark/95 backdrop-blur-xl border-r border-cyber-cyan/20 lg:translate-x-0 lg:static lg:z-0"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-cyber-cyan/10">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyber-cyan to-cyber-purple rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">CP</span>
              </div>
              <div>
                <h1 className="text-lg font-bold font-display">CyberPress</h1>
                <p className="text-xs text-gray-400">管理后台</p>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-cyber-dark/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 导航菜单 */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                    isActive
                      ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/30'
                      : 'text-gray-400 hover:bg-cyber-dark/50 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <Badge variant="primary" size="sm">
                      {item.badge}
                    </Badge>
                  )}
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isActive ? 'opacity-100' : 'opacity-0 -translate-x-2'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* 用户信息 */}
          <div className="p-4 border-t border-cyber-cyan/10">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-cyber-dark/50">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyber-purple to-cyber-pink flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0) || user?.username?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {user?.name || user?.username}
                </p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="flex-shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* 主内容区 */}
      <div className="lg:ml-80">
        {/* 顶部栏 */}
        <header className="sticky top-0 z-30 bg-cyber-dark/80 backdrop-blur-xl border-b border-cyber-cyan/10">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-cyber-dark/50 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* 面包屑 */}
              <nav className="hidden md:flex items-center gap-2 text-sm text-gray-400">
                <Link
                  href="/admin"
                  className="hover:text-cyber-cyan transition-colors"
                >
                  后台
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-white">
                  {navigation.find((item) => pathname === item.href || pathname.startsWith(item.href + '/'))?.name ||
                    '页面'}
                </span>
              </nav>
            </div>

            <div className="flex items-center gap-3">
              {/* 快速操作 */}
              <Link href="/admin/posts/new">
                <Button variant="primary" size="sm">
                  新建文章
                </Button>
              </Link>

              {/* 查看网站 */}
              <Link href="/" target="_blank">
                <Button variant="outline" size="sm">
                  查看网站
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* 页面内容 */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
