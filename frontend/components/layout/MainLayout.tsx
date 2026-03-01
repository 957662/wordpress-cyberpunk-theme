'use client';

import React, { ReactNode, useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
  showSidebar?: boolean;
  sidebarPosition?: 'left' | 'right';
  headerVariant?: 'default' | 'transparent' | 'solid';
  footerVariant?: 'default' | 'minimal' | 'enhanced';
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  className,
  showSidebar = false,
  sidebarPosition = 'right',
  headerVariant = 'default',
  footerVariant = 'default',
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-dark-900">
      <Header
        variant={headerVariant}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onSearchClick={() => setSearchOpen(!searchOpen)}
        isSidebarOpen={sidebarOpen}
      />

      <AnimatePresence>
        {sidebarOpen && (
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            position={sidebarPosition}
          />
        )}
      </AnimatePresence>

      <main
        className={cn(
          'flex-1 relative',
          showSidebar && sidebarPosition === 'left' && 'md:ml-64',
          showSidebar && sidebarPosition === 'right' && 'md:mr-64',
          className
        )}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>

      <Footer variant={footerVariant} />
    </div>
  );
};

interface BlogLayoutProps {
  children: ReactNode;
  className?: string;
}

export const BlogLayout: React.FC<BlogLayoutProps> = ({ children, className }) => {
  return (
    <MainLayout className={className}>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </article>
    </MainLayout>
  );
};

interface AdminLayoutProps {
  children: ReactNode;
  className?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, className }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-dark-900">
      {/* Admin Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-dark-800 border-r border-dark-700 transform transition-transform duration-300 ease-in-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-6 border-b border-dark-700">
            <h1 className="text-xl font-bold text-cyber-cyan">Admin Panel</h1>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {/* Navigation items would go here */}
            <a
              href="/admin/dashboard"
              className="flex items-center px-4 py-2 text-gray-300 rounded-lg hover:bg-dark-700 hover:text-white transition-colors"
            >
              <span className="mr-3">📊</span>
              Dashboard
            </a>
            <a
              href="/admin/posts"
              className="flex items-center px-4 py-2 text-gray-300 rounded-lg hover:bg-dark-700 hover:text-white transition-colors"
            >
              <span className="mr-3">📝</span>
              Posts
            </a>
            <a
              href="/admin/media"
              className="flex items-center px-4 py-2 text-gray-300 rounded-lg hover:bg-dark-700 hover:text-white transition-colors"
            >
              <span className="mr-3">🖼️</span>
              Media
            </a>
            <a
              href="/admin/settings"
              className="flex items-center px-4 py-2 text-gray-300 rounded-lg hover:bg-dark-700 hover:text-white transition-colors"
            >
              <span className="mr-3">⚙️</span>
              Settings
            </a>
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div
        className={cn(
          'flex-1 transition-all duration-300',
          sidebarOpen ? 'md:ml-64' : 'ml-0'
        )}
      >
        <main className={cn('h-full overflow-auto', className)}>
          {children}
        </main>
      </div>
    </div>
  );
};

interface LandingLayoutProps {
  children: ReactNode;
  className?: string;
  showFooter?: boolean;
}

export const LandingLayout: React.FC<LandingLayoutProps> = ({
  children,
  className,
  showFooter = true,
}) => {
  return (
    <div className="min-h-screen bg-dark-900">
      <main className={cn('relative', className)}>
        {children}
      </main>
      {showFooter && <Footer variant="minimal" />}
    </div>
  );
};

export default MainLayout;
