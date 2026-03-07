'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  FileText,
  Briefcase,
  User,
  Mail,
  Menu,
  X,
  Search,
  Moon,
  Sun,
  Github,
  Twitter,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: '首页', href: '/', icon: Home },
  { name: '博客', href: '/blog', icon: FileText },
  { name: '作品集', href: '/portfolio', icon: Briefcase },
  { name: '关于', href: '/about', icon: User },
  { name: '联系', href: '/contact', icon: Mail },
];

const socialLinks = [
  { name: 'GitHub', href: 'https://github.com', icon: Github },
  { name: 'Twitter', href: 'https://twitter.com', icon: Twitter },
];

interface NavigationProps {
  className?: string;
}

export function Navigation({ className }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Close mobile menu when route changes
    setIsOpen(false);
  }, [pathname]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={cn('hidden lg:flex items-center gap-1', className)}>
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'relative px-4 py-2 rounded-lg transition-all duration-200',
                'flex items-center gap-2 text-sm font-medium',
                isActive
                  ? 'text-cyber-cyan bg-cyber-cyan/10'
                  : 'text-gray-300 hover:text-cyber-cyan hover:bg-cyber-cyan/5'
              )}
            >
              <Icon className="w-4 h-4" />
              {item.name}

              {isActive && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute inset-0 bg-cyber-cyan/10 rounded-lg border border-cyber-cyan/20"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden relative z-50 p-2 rounded-lg text-gray-400 hover:text-cyber-cyan hover:bg-cyber-cyan/10 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Mobile Menu */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-cyber-card border-l border-cyber-border z-50 lg:hidden"
            >
              <div className="flex flex-col h-full p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="text-xl font-display font-bold">
                    <span className="text-cyber-cyan">CYBER</span>
                    <span className="text-cyber-purple">PRESS</span>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg text-gray-400 hover:text-cyber-cyan hover:bg-cyber-cyan/10 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 space-y-2">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                          isActive
                            ? 'bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20'
                            : 'text-gray-300 hover:bg-cyber-cyan/5 hover:text-cyber-cyan'
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>

                {/* Theme Toggle */}
                <div className="pt-6 border-t border-cyber-border">
                  <button
                    onClick={toggleTheme}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-cyber-cyan/5 hover:text-cyber-cyan transition-all"
                  >
                    {isDark ? (
                      <Sun className="w-5 h-5" />
                    ) : (
                      <Moon className="w-5 h-5" />
                    )}
                    <span className="font-medium">
                      {isDark ? '浅色模式' : '深色模式'}
                    </span>
                  </button>
                </div>

                {/* Social Links */}
                <div className="pt-6 border-t border-cyber-border">
                  <div className="flex gap-3">
                    {socialLinks.map((social) => {
                      const Icon = social.icon;
                      return (
                        <a
                          key={social.name}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-cyber-border text-gray-400 hover:text-cyber-cyan hover:border-cyber-cyan/30 transition-all"
                        >
                          <Icon className="w-5 h-5" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

interface NavActionsProps {
  className?: string;
}

export function NavActions({ className }: NavActionsProps) {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg text-gray-400 hover:text-cyber-cyan hover:bg-cyber-cyan/10 transition-colors"
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </button>

      {/* Search */}
      <Link
        href="/search"
        className="p-2 rounded-lg text-gray-400 hover:text-cyber-cyan hover:bg-cyber-cyan/10 transition-colors"
        aria-label="Search"
      >
        <Search className="w-5 h-5" />
      </Link>

      {/* CTA Button */}
      <Link
        href="/newsletter"
        className="hidden sm:inline-flex px-4 py-2 bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-cyber-cyan/50 transition-all duration-300"
      >
        订阅
      </Link>
    </div>
  );
}
