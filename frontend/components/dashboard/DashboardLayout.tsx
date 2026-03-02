/**
 * DashboardLayout Component
 * 仪表板布局组件
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  ChevronRight,
  LogOut,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

const navigation = [
  {
    name: '仪表板',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: '文章管理',
    href: '/dashboard/posts',
    icon: FileText,
  },
  {
    name: '用户管理',
    href: '/dashboard/users',
    icon: Users,
  },
  {
    name: '通知',
    href: '/dashboard/notifications',
    icon: Bell,
  },
  {
    name: '设置',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || isMobileMenuOpen) && (
          <>
            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              />
            )}

            {/* Sidebar */}
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={cn(
                'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-cyber-card border-r border-cyber-border',
                'transform transition-transform duration-300 ease-in-out'
              )}
            >
              <div className="flex flex-col h-full">
                {/* Logo */}
                <div className="flex items-center justify-between p-4 border-b border-cyber-border">
                  <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center">
                      <span className="text-lg font-bold text-white">C</span>
                    </div>
                    <span className="font-display font-bold text-lg hidden sm:block">
                      <span className="text-cyber-cyan">Cyber</span>
                      <span className="text-cyber-purple">Press</span>
                    </span>
                  </Link>

                  {/* Close Mobile Menu */}
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4">
                  <ul className="space-y-1">
                    {navigation.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <li key={item.name}>
                          <Link href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                            <motion.button
                              whileHover={{ x: 4 }}
                              className={cn(
                                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                                isActive
                                  ? 'bg-cyber-cyan/10 text-cyber-cyan'
                                  : 'text-gray-400 hover:text-white hover:bg-cyber-border'
                              )}
                            >
                              <item.icon className="w-5 h-5" />
                              <span className="font-medium">{item.name}</span>
                              {isActive && (
                                <motion.div
                                  layoutId="sidebar-indicator"
                                  className="ml-auto w-1.5 h-1.5 rounded-full bg-cyber-cyan"
                                />
                              )}
                            </motion.button>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-cyber-border">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-cyber-dark">
                    <Avatar
                      src="/api/placeholder/40/40"
                      alt="User"
                      size="sm"
                      className="ring-2 ring-cyber-cyan"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">Admin User</p>
                      <p className="text-xs text-gray-500 truncate">admin@cyberpress.com</p>
                    </div>
                  </div>

                  <Link href="/dashboard/settings" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" size="sm" fullWidth className="mt-3 justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      设置
                    </Button>
                  </Link>

                  <Button variant="ghost" size="sm" fullWidth className="mt-2 justify-start text-red-400 hover:text-red-300">
                    <LogOut className="w-4 h-4 mr-2" />
                    退出登录
                  </Button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={cn('transition-all duration-300', isSidebarOpen ? 'lg:ml-64' : '')}>
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-cyber-dark/80 backdrop-blur-md border-b border-cyber-border">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-4">
              {/* Sidebar Toggle */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-cyber-border transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-cyber-border transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Search */}
              <div className="hidden sm:block relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="搜索..."
                  className="pl-9 bg-cyber-card border-cyber-border"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>

              <Link href="/">
                <Button variant="outline" size="sm">
                  查看网站
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
