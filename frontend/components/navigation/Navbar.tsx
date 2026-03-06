/**
 * Navbar Component
 * 赛博朋克风格导航栏
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { MenuIcon, CloseIcon, SearchIcon, GitHubIcon, MoonIcon, SunIcon } from '@/components/graphics';
import { useTheme } from 'next-themes';

const navLinks = [
  { name: '首页', href: '/' },
  { name: '博客', href: '/blog' },
  { name: '作品集', href: '/portfolio' },
  { name: '关于', href: '/about' },
  { name: '联系', href: '/contact' },
];

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-cyber-dark/80 backdrop-blur-xl border-b border-cyber-border/50'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-2xl font-orbitron font-bold"
              >
                <span className="text-cyber-cyan group-hover:text-cyber-pink transition-colors">
                  CYBER
                </span>
                <span className="text-cyber-purple group-hover:text-cyber-cyan transition-colors">
                  PRESS
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-gray-300 hover:text-cyber-cyan transition-colors relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyber-cyan group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              {mounted && (
                <button
                  onClick={toggleTheme}
                  className="p-2 text-gray-400 hover:text-cyber-cyan transition-colors"
                  aria-label="切换主题"
                >
                  {theme === 'dark' ? <SunIcon size={20} /> : <MoonIcon size={20} />}
                </button>
              )}

              {/* Search */}
              <Link
                href="/search"
                className="hidden sm:block p-2 text-gray-400 hover:text-cyber-cyan transition-colors"
              >
                <SearchIcon size={20} />
              </Link>

              {/* GitHub */}
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:block p-2 text-gray-400 hover:text-cyber-cyan transition-colors"
              >
                <GitHubIcon size={20} />
              </a>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-400 hover:text-cyber-cyan transition-colors"
              >
                {isMobileMenuOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden fixed top-16 left-0 right-0 z-40 bg-cyber-dark/95 backdrop-blur-xl border-b border-cyber-border"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-3 px-4 text-lg font-medium text-gray-300 hover:text-cyber-cyan hover:bg-cyber-cyan/10 rounded-lg transition-all"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
