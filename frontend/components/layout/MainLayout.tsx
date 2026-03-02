'use client';

/**
 * 主布局组件
 */

import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CyberButton } from '@/components/ui/CyberButton';

interface MainLayoutProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  sidebar?: ReactNode;
  className?: string;
}

export function MainLayout({
  children,
  header,
  footer,
  sidebar,
  className,
}: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // 监听滚动显示"返回顶部"按钮
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setShowScrollTop(window.scrollY > 300);
    });
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={cn('min-h-screen bg-cyber-dark', className)}>
      {/* Header */}
      {header || (
        <header className="sticky top-0 z-50 border-b border-cyber-border bg-cyber-dark/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center">
                <a href="/" className="text-2xl font-display font-bold">
                  <span className="text-cyber-cyan">CYBER</span>
                  <span className="text-cyber-purple">PRESS</span>
                </a>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                <a
                  href="/blog"
                  className="text-gray-300 hover:text-cyber-cyan transition-colors"
                >
                  博客
                </a>
                <a
                  href="/portfolio"
                  className="text-gray-300 hover:text-cyber-cyan transition-colors"
                >
                  作品集
                </a>
                <a
                  href="/about"
                  className="text-gray-300 hover:text-cyber-cyan transition-colors"
                >
                  关于
                </a>
                <a
                  href="/contact"
                  className="text-gray-300 hover:text-cyber-cyan transition-colors"
                >
                  联系
                </a>
              </nav>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-cyber-cyan/10 transition-colors"
                aria-label="Toggle menu"
              >
                {sidebarOpen ? (
                  <X className="w-6 h-6 text-cyber-cyan" />
                ) : (
                  <Menu className="w-6 h-6 text-cyber-cyan" />
                )}
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-64 bg-cyber-darker border-l border-cyber-border z-50 md:hidden"
            >
              <div className="p-4">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-cyber-cyan/10"
                >
                  <X className="w-6 h-6 text-cyber-cyan" />
                </button>

                <nav className="mt-12 flex flex-col space-y-4">
                  <a
                    href="/blog"
                    className="text-lg text-gray-300 hover:text-cyber-cyan transition-colors py-2"
                    onClick={() => setSidebarOpen(false)}
                  >
                    博客
                  </a>
                  <a
                    href="/portfolio"
                    className="text-lg text-gray-300 hover:text-cyber-cyan transition-colors py-2"
                    onClick={() => setSidebarOpen(false)}
                  >
                    作品集
                  </a>
                  <a
                    href="/about"
                    className="text-lg text-gray-300 hover:text-cyber-cyan transition-colors py-2"
                    onClick={() => setSidebarOpen(false)}
                  >
                    关于
                  </a>
                  <a
                    href="/contact"
                    className="text-lg text-gray-300 hover:text-cyber-cyan transition-colors py-2"
                    onClick={() => setSidebarOpen(false)}
                  >
                    联系
                  </a>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex">
        {/* Sidebar (Desktop) */}
        {sidebar && (
          <aside className="hidden lg:block w-64 border-r border-cyber-border min-h-screen sticky top-16 h-[calc(100vh-4rem)]">
            <div className="p-6">{sidebar}</div>
          </aside>
        )}

        {/* Content */}
        <div className="flex-1">{children}</div>
      </main>

      {/* Footer */}
      {footer || (
        <footer className="border-t border-cyber-border bg-cyber-darker">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid md:grid-cols-4 gap-8">
              {/* Brand */}
              <div className="md:col-span-2">
                <a href="/" className="text-2xl font-display font-bold">
                  <span className="text-cyber-cyan">CYBER</span>
                  <span className="text-cyber-purple">PRESS</span>
                </a>
                <p className="mt-4 text-gray-400">
                  基于 Next.js 14 和 WordPress 的赛博朋克风格博客平台
                </p>
              </div>

              {/* Links */}
              <div>
                <h3 className="text-white font-semibold mb-4">快速链接</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="/blog" className="text-gray-400 hover:text-cyber-cyan transition-colors">
                      博客
                    </a>
                  </li>
                  <li>
                    <a href="/portfolio" className="text-gray-400 hover:text-cyber-cyan transition-colors">
                      作品集
                    </a>
                  </li>
                  <li>
                    <a href="/about" className="text-gray-400 hover:text-cyber-cyan transition-colors">
                      关于
                    </a>
                  </li>
                  <li>
                    <a href="/contact" className="text-gray-400 hover:text-cyber-cyan transition-colors">
                      联系
                    </a>
                  </li>
                </ul>
              </div>

              {/* Social */}
              <div>
                <h3 className="text-white font-semibold mb-4">社交媒体</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-cyber-cyan transition-colors">
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-cyber-cyan transition-colors">
                      Twitter
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-cyber-cyan transition-colors">
                      LinkedIn
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Copyright */}
            <div className="mt-8 pt-8 border-t border-cyber-border text-center text-gray-500 text-sm">
              <p>© {new Date().getFullYear()} CyberPress. All rights reserved.</p>
            </div>
          </div>
        </footer>
      )}

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-cyber-cyan text-cyber-dark shadow-neon-cyan hover:shadow-neon-cyan hover:scale-110 transition-all"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
