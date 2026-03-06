'use client'

import Link from 'next/link'
import { Terminal, Github, Twitter, Linkedin, Mail } from 'lucide-react'

const footerLinks = {
  product: [
    { name: '首页', href: '/' },
    { name: '博客', href: '/blog' },
    { name: '作品集', href: '/portfolio' },
    { name: '关于', href: '/about' },
  ],
  resources: [
    { name: '文档', href: '/docs' },
    { name: '教程', href: '/tutorials' },
    { name: '示例', href: '/examples' },
    { name: 'API', href: '/api' },
  ],
  company: [
    { name: '关于我们', href: '/about' },
    { name: '联系方式', href: '/contact' },
    { name: '隐私政策', href: '/privacy' },
    { name: '服务条款', href: '/terms' },
  ],
}

const socialLinks = [
  { name: 'GitHub', icon: Github, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'LinkedIn', icon: Linkedin, href: '#' },
  { name: 'Email', icon: Mail, href: 'mailto:contact@cyberpress.dev' },
]

export function Footer() {
  return (
    <footer className="border-t border-[var(--cyber-border)] bg-[var(--cyber-darker)]">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--cyber-cyan)] to-[var(--cyber-purple)] rounded-lg flex items-center justify-center">
                <Terminal className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold font-orbitron text-glow-cyan">
                CyberPress
              </span>
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              基于 WordPress 和 Next.js 构建的现代化博客平台，
              为开发者打造极致的内容创作体验。
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="p-2 rounded-lg bg-[var(--cyber-card)] hover:bg-[var(--cyber-muted)] hover:border hover:border-[var(--cyber-cyan)] transition-all group"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5 text-gray-400 group-hover:text-[var(--cyber-cyan)]" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-4 text-[var(--cyber-cyan)]">产品</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-[var(--cyber-cyan)] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-semibold mb-4 text-[var(--cyber-purple)]">资源</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-[var(--cyber-purple)] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-4 text-[var(--cyber-pink)]">公司</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-[var(--cyber-pink)] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[var(--cyber-border)]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © 2026 CyberPress. All rights reserved.
            </p>
            <p className="text-sm text-gray-500">
              Built with{' '}
              <span className="text-[var(--cyber-pink)]">♥</span>
              {' '}using Next.js & WordPress
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
