/**
 * 网站页脚
 */

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { GitHubIcon, TwitterIcon, HeartIcon } from '@/components/icons';
import { Logo } from '@/components/icons';

const socialLinks = [
  { name: 'GitHub', href: 'https://github.com', icon: GitHubIcon },
  { name: 'Twitter', href: 'https://twitter.com', icon: TwitterIcon },
];

const footerLinks = [
  { name: '首页', href: '/' },
  { name: '博客', href: '/blog' },
  { name: '作品集', href: '/portfolio' },
  { name: '关于', href: '/about' },
];

export function Footer() {
  return (
    <footer className="border-t border-cyber-border bg-cyber-darker">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Logo className="w-8 h-8 text-cyber-cyan" />
              <span className="font-display font-bold text-xl text-white">
                CYBERPRESS
              </span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              基于 WordPress + Next.js 的赛博朋克风格博客平台，
              探索未来科技与设计的完美融合。
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-cyber-muted rounded-lg border border-cyber-border hover:border-cyber-cyan hover:text-cyber-cyan text-gray-400 transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-bold text-white mb-4">快速链接</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-cyber-cyan transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-display font-bold text-white mb-4">订阅更新</h3>
            <p className="text-gray-400 text-sm mb-4">
              获取最新文章和项目动态
            </p>
            <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-2 bg-cyber-muted border border-cyber-border rounded text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-2 bg-cyber-cyan text-cyber-dark font-medium rounded hover:bg-cyber-cyan/90 transition-colors"
              >
                订阅
              </motion.button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-cyber-border">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
            <p>
              © {new Date().getFullYear()} CyberPress. All rights reserved.
            </p>
            <p className="flex items-center mt-4 md:mt-0">
              Made with
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="mx-1"
              >
                <HeartIcon className="w-4 h-4 text-cyber-pink" />
              </motion.span>
              by AI Development Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
