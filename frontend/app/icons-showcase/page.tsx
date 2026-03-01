/**
 * CyberPress Icon Showcase
 *
 * 展示所有可用的图标和效果
 */

import React from 'react';
import Image from 'next/image';
import { Logo } from '@/components/icons/Logo';

export default function IconsShowcase() {
  const iconCategories = [
    {
      name: 'Navigation Icons',
      icons: ['home', 'blog', 'portfolio', 'about', 'search']
    },
    {
      name: 'Social Icons',
      icons: ['github', 'twitter', 'linkedin', 'email', 'rss']
    },
    {
      name: 'UI Elements',
      icons: ['calendar', 'tag', 'star', 'heart', 'user', 'settings', 'terminal']
    },
    {
      name: 'Actions',
      icons: ['arrow-right', 'arrow-left', 'menu', 'close', 'code', 'share', 'filter']
    },
    {
      name: 'Files & Data',
      icons: ['folder', 'download', 'upload', 'copy', 'database', 'server', 'cloud']
    },
    {
      name: 'Editor',
      icons: ['edit', 'trash', 'save', 'refresh', 'lock', 'unlock', 'shield']
    },
    {
      name: 'Status',
      icons: ['check', 'alert', 'loading', 'eye', 'eye-off', 'bookmark', 'comment']
    },
    {
      name: 'Theme',
      icons: ['sun', 'moon', 'chevron-down', 'chevron-up', 'zap']
    }
  ];

  const effects = [
    { name: 'Neon Pulse', class: 'animate-neon-pulse text-neon-cyan' },
    { name: 'Float', class: 'animate-float' },
    { name: 'Spin', class: 'animate-spin' },
    { name: 'Bounce', class: 'animate-bounce' },
    { name: 'Pulse', class: 'animate-pulse' },
    { name: 'Glow', class: 'text-neon-cyan neon-glow' },
  ];

  return (
    <div className="min-h-screen bg-cyber-black text-cyber-gray-100 p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <header className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Logo size={120} variant="main" />
          </div>
          <h1 className="text-4xl font-bold text-cyber-cyan mb-4 neon-glow">
            CyberPress Icon Library
          </h1>
          <p className="text-cyber-gray-200 text-lg">
            赛博朋克风格图标库 - 45+ SVG 图标与动画效果
          </p>
        </header>

        {/* Logo Variants */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-cyber-purple mb-6 flex items-center gap-2">
            <span className="text-cyber-cyan">▶</span> Logo Variants
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass p-8 rounded-lg text-center">
              <Image
                src="/logo-main.svg"
                alt="Main Logo"
                width={120}
                height={120}
                className="mx-auto mb-4"
              />
              <p className="text-cyber-gray-200">Main Logo (200x200)</p>
            </div>
            <div className="glass p-8 rounded-lg text-center">
              <Image
                src="/logo-favicon.svg"
                alt="Favicon"
                width={64}
                height={64}
                className="mx-auto mb-4"
              />
              <p className="text-cyber-gray-200">Favicon (64x64)</p>
            </div>
            <div className="glass p-8 rounded-lg text-center">
              <Image
                src="/logo-square.svg"
                alt="Square Logo"
                width={120}
                height={120}
                className="mx-auto mb-4 rounded-lg"
              />
              <p className="text-cyber-gray-200">Square Logo (512x512)</p>
            </div>
          </div>
        </section>

        {/* Icon Categories */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-cyber-purple mb-6 flex items-center gap-2">
            <span className="text-cyber-cyan">▶</span> Icon Library
          </h2>

          {iconCategories.map((category) => (
            <div key={category.name} className="mb-12">
              <h3 className="text-xl font-semibold text-cyber-cyan mb-4">{category.name}</h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
                {category.icons.map((icon) => (
                  <div
                    key={icon}
                    className="glass p-4 rounded-lg text-center hover:neon-box-cyan transition-all cursor-pointer group"
                  >
                    <Image
                      src={`/icons/${icon}.svg`}
                      alt={icon}
                      width={32}
                      height={32}
                      className="mx-auto mb-2 group-hover:scale-110 transition-transform"
                    />
                    <p className="text-xs text-cyber-gray-300 truncate">{icon}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Animation Effects */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-cyber-purple mb-6 flex items-center gap-2">
            <span className="text-cyber-cyan">▶</span> Animation Effects
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {effects.map((effect) => (
              <div key={effect.name} className="glass p-6 rounded-lg text-center">
                <div className={`w-12 h-12 mx-auto mb-4 ${effect.class}`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <p className="text-sm text-cyber-gray-300">{effect.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Color Palette */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-cyber-purple mb-6 flex items-center gap-2">
            <span className="text-cyber-cyan">▶</span> Color Palette
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {[
              { name: 'Deep Black', hex: '#0a0a0f', class: 'bg-cyber-black' },
              { name: 'Neon Cyan', hex: '#00f0ff', class: 'bg-cyber-cyan' },
              { name: 'Cyber Purple', hex: '#9d00ff', class: 'bg-cyber-purple' },
              { name: 'Laser Pink', hex: '#ff0080', class: 'bg-cyber-pink' },
              { name: 'Voltage Yellow', hex: '#f0ff00', class: 'bg-cyber-yellow' },
            ].map((color) => (
              <div key={color.name} className="glass p-6 rounded-lg text-center">
                <div
                  className={`w-full h-20 rounded mb-4 ${color.class} neon-box-cyan`}
                ></div>
                <p className="text-sm font-semibold text-cyber-gray-100">{color.name}</p>
                <p className="text-xs text-cyber-gray-300">{color.hex}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Usage Examples */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-cyber-purple mb-6 flex items-center gap-2">
            <span className="text-cyber-cyan">▶</span> Usage Examples
          </h2>
          <div className="space-y-6">
            <div className="glass p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-cyber-cyan mb-4">Basic Usage</h3>
              <pre className="bg-cyber-dark p-4 rounded overflow-x-auto">
                <code className="text-sm text-cyber-gray-200">
{`import Image from 'next/image';

<Image src="/icons/home.svg" alt="Home" width={24} height={24} />`}
                </code>
              </pre>
            </div>

            <div className="glass p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-cyber-cyan mb-4">With Effects</h3>
              <pre className="bg-cyber-dark p-4 rounded overflow-x-auto">
                <code className="text-sm text-cyber-gray-200">
{`<Image
  src="/icons/star.svg"
  alt="Star"
  width={24}
  height={24}
  className="text-cyber-cyan neon-glow animate-neon-pulse"
/>`}
                </code>
              </pre>
            </div>

            <div className="glass p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-cyber-cyan mb-4">Using Logo Component</h3>
              <pre className="bg-cyber-dark p-4 rounded overflow-x-auto">
                <code className="text-sm text-cyber-gray-200">
{`import { Logo } from '@/components/icons/Logo';

<Logo size={200} variant="main" className="hover:scale-110" />`}
                </code>
              </pre>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-cyber-cyan/20">
          <p className="text-cyber-gray-300">
            CyberPress Platform - Cyberpunk Icon Library
          </p>
          <p className="text-sm text-cyber-gray-400 mt-2">
            Created: 2026-03-02 | Total Icons: 45+ | Total Files: 55+
          </p>
        </footer>

      </div>
    </div>
  );
}
