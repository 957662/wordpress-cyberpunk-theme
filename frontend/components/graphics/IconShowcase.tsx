/**
 * Icon Showcase Component
 * 展示所有可用图标的示例组件
 */

'use client';

import {
  NotificationIcon,
  ThemeToggleIcon,
  DatabaseCyberIcon,
  RocketLaunchIcon,
  BrainAIIcon,
  TerminalCodeIcon,
  SmartphoneIcon,
  LayoutGridIcon,
  PuzzleIcon,
} from '../icons/CyberIcons';

import {
  Home,
  Search,
  Settings,
  Github,
  Twitter,
  Heart,
  Star,
  Shield,
  Zap,
  Code,
  Database,
  Cpu,
  Wifi,
  Globe,
} from '../icons';

const iconCategories = [
  {
    title: 'Custom Cyber Icons',
    icons: [
      { Component: NotificationIcon, name: 'Notification' },
      { Component: ThemeToggleIcon, name: 'Theme Toggle' },
      { Component: DatabaseCyberIcon, name: 'Database Cyber' },
      { Component: RocketLaunchIcon, name: 'Rocket' },
      { Component: BrainAIIcon, name: 'AI Brain' },
      { Component: TerminalCodeIcon, name: 'Terminal Code' },
      { Component: SmartphoneIcon, name: 'Smartphone' },
      { Component: LayoutGridIcon, name: 'Layout Grid' },
      { Component: PuzzleIcon, name: 'Puzzle' },
    ],
  },
  {
    title: 'Navigation',
    icons: [
      { Component: Home, name: 'Home' },
      { Component: Search, name: 'Search' },
      { Component: Settings, name: 'Settings' },
    ],
  },
  {
    title: 'Social',
    icons: [
      { Component: Github, name: 'GitHub' },
      { Component: Twitter, name: 'Twitter' },
    ],
  },
  {
    title: 'UI Elements',
    icons: [
      { Component: Heart, name: 'Heart' },
      { Component: Star, name: 'Star' },
      { Component: Shield, name: 'Shield' },
      { Component: Zap, name: 'Zap' },
    ],
  },
  {
    title: 'Tech & Code',
    icons: [
      { Component: Code, name: 'Code' },
      { Component: Database, name: 'Database' },
      { Component: Cpu, name: 'CPU' },
      { Component: Wifi, name: 'WiFi' },
      { Component: Globe, name: 'Globe' },
    ],
  },
];

export function IconShowcase() {
  return (
    <div className="min-h-screen bg-cyber-dark p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-cyber-cyan mb-8 text-center">
          CyberPress Icon Library
        </h1>

        {iconCategories.map((category) => (
          <div key={category.title} className="mb-12">
            <h2 className="text-2xl font-semibold text-cyber-purple mb-4">
              {category.title}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {category.icons.map(({ Component, name }) => (
                <div
                  key={name}
                  className="group relative bg-cyber-card border border-cyber-border rounded-lg p-6 hover:border-cyber-cyan transition-all duration-300 hover:shadow-neon-cyan"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-3 bg-cyber-dark rounded-lg group-hover:scale-110 transition-transform">
                      <Component size={32} className="text-cyber-cyan" />
                    </div>

                    <span className="text-xs text-cyber-secondary text-center">
                      {name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Usage Guide */}
        <div className="mt-16 bg-cyber-card border border-cyber-border rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-cyber-cyan mb-4">
            Usage Guide
          </h2>

          <div className="space-y-4 text-cyber-primary">
            <div>
              <h3 className="text-lg font-medium text-cyber-purple mb-2">
                Custom Icons
              </h3>
              <pre className="bg-cyber-dark p-4 rounded-lg overflow-x-auto text-sm">
{`import { NotificationIcon, ThemeToggleIcon } from '@/components/icons/CyberIcons';

<NotificationIcon size={24} className="text-cyber-cyan" />
<ThemeToggleIcon size={20} className="text-cyber-purple" />`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-cyber-purple mb-2">
                Lucide Icons
              </h3>
              <pre className="bg-cyber-dark p-4 rounded-lg overflow-x-auto text-sm">
{`import { Home, Search, Github } from '@/components/icons';

<Home className="w-6 h-6 text-cyber-cyan" />
<Search size={24} className="text-cyber-purple" />
<Github className="w-8 h-8 text-cyber-pink" />`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
