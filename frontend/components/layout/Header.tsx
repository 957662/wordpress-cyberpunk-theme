/**
 * 网站头部导航
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MenuIcon, CloseIcon, SearchIcon, ThemeIcon, Logo } from '@/components/icons';
import { Button } from '@/components/ui/Button';
import { GlitchText } from '@/components/effects/GlitchText';
import { cn } from '@/lib/utils';

const navItems = [
  { name: '首页', href: '/' },
  { name: '博客', href: '/blog' },
  { name: '作品集', href: '/portfolio' },
  { name: '关于', href: '/about' },
];

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
          isScrolled
            ? 'bg-cyber-dark/80 backdrop-blur-lg border-b border-cyber-border'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Logo className="w-8 h-8 text-cyber-cyan" />
              </motion.div>
              <span className="font-display font-bold text-xl">
                <GlitchText text="CYBERPRESS" />
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative font-medium transition-colors hover:text-cyber-cyan',
                    pathname === item.href
                      ? 'text-cyber-cyan'
                      : 'text-gray-300'
                  )}
                >
                  {item.name}
                  {pathname === item.href && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-6 left-0 right-0 h-0.5 bg-cyber-cyan shadow-neon-cyan"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 text-gray-400 hover:text-cyber-cyan transition-colors"
                aria-label="搜索"
              >
                <SearchIcon className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 text-gray-400 hover:text-cyber-cyan transition-colors"
                aria-label="主题切换"
              >
                <ThemeIcon className="w-5 h-5" />
              </motion.button>

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="md:hidden p-2 text-gray-400 hover:text-cyber-cyan transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="菜单"
              >
                {isMenuOpen ? (
                  <CloseIcon className="w-6 h-6" />
                ) : (
                  <MenuIcon className="w-6 h-6" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 md:hidden bg-cyber-dark/95 backdrop-blur-lg"
          >
            <div className="flex flex-col items-center justify-center h-full space-y-8">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      'text-2xl font-display font-bold transition-colors',
                      pathname === item.href
                        ? 'text-cyber-cyan'
                        : 'text-gray-300 hover:text-cyber-cyan'
                    )}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-cyber-cyan"
              aria-label="关闭菜单"
            >
              <CloseIcon className="w-6 h-6" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
