'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Home,
  FileText,
  Briefcase,
  User,
  Search,
  Moon,
  Sun,
  Github,
  Twitter,
  Linkedin
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useTheme } from 'next-themes';

const navigation = [
  { name: '首页', href: '/', icon: Home },
  { name: '博客', href: '/blog', icon: FileText },
  { name: '作品集', href: '/portfolio', icon: Briefcase },
  { name: '关于', href: '/about', icon: User },
];

const socialLinks = [
  { name: 'GitHub', href: 'https://github.com', icon: Github },
  { name: 'Twitter', href: 'https://twitter.com', icon: Twitter },
  { name: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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

  const NavLink = ({ item }: { item: typeof navigation[0] }) => {
    const isActive = pathname === item.href;
    const Icon = item.icon;

    return (
      <Link
        href={item.href}
        className={cn(
          'relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300',
          'hover:bg-cyber-cyan/10',
          isActive
            ? 'text-cyber-cyan bg-cyber-cyan/10'
            : 'text-gray-400 hover:text-cyber-cyan'
        )}
        onClick={() => setIsOpen(false)}
      >
        <Icon className="w-4 h-4" />
        <span>{item.name}</span>
        {isActive && (
          <motion.div
            layoutId="navbar-indicator"
            className="absolute inset-0 bg-cyber-cyan/10 rounded-lg"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
      </Link>
    );
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-cyber-dark/80 backdrop-blur-xl border-b border-cyber-border/50'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center"
            >
              <span className="text-white font-bold text-lg">C</span>
            </motion.div>
            <span className="text-xl font-display font-bold">
              <span className="text-cyber-cyan">CYBER</span>
              <span className="text-cyber-purple">PRESS</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navigation.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            {mounted && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg hover:bg-cyber-muted transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-cyber-yellow" />
                ) : (
                  <Moon className="w-5 h-5 text-cyber-purple" />
                )}
              </motion.button>
            )}

            {/* Search Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:flex p-2 rounded-lg hover:bg-cyber-muted transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-gray-400" />
            </motion.button>

            {/* Social Links */}
            <div className="hidden lg:flex items-center gap-2">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -2 }}
                    className="p-2 rounded-lg hover:bg-cyber-muted transition-colors"
                    aria-label={link.name}
                  >
                    <Icon className="w-4 h-4 text-gray-400 hover:text-cyber-cyan" />
                  </motion.a>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-cyber-muted transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-gray-400" />
              ) : (
                <Menu className="w-6 h-6 text-gray-400" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-cyber-border/50 bg-cyber-dark/95 backdrop-blur-xl"
          >
            <div className="px-4 py-6 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                    pathname === item.href
                      ? 'text-cyber-cyan bg-cyber-cyan/10'
                      : 'text-gray-400 hover:text-cyber-cyan hover:bg-cyber-muted'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}

              {/* Mobile Social Links */}
              <div className="pt-6 mt-6 border-t border-cyber-border">
                <div className="flex items-center justify-center gap-4">
                  {socialLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <motion.a
                        key={link.name}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ y: -2 }}
                        className="p-3 rounded-lg bg-cyber-muted hover:bg-cyber-cyan/10 transition-colors"
                        aria-label={link.name}
                      >
                        <Icon className="w-5 h-5 text-gray-400 hover:text-cyber-cyan" />
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
