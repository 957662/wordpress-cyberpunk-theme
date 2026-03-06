'use client';

import React from 'react';
import { CyberPressLogo } from '@/components/graphics/LogoVariants';
import { CyberTechIcon } from '@/components/graphics/CyberTechIcons';
import { NeonButton } from '@/components/graphics/NeonButton';
import { NeonCard } from '@/components/graphics/NeonCard';
import { HolographicCard } from '@/components/graphics/HolographicCard';
import { CyberLoader } from '@/components/graphics/CyberLoaderComponent';
import { CyberIllustration } from '@/components/graphics/CyberIllustrationComponent';
import { NeonText } from '@/components/graphics/NeonTextComponent';
import { CyberGlow } from '@/components/graphics/CyberGlowComponent';
import { HomeIcon, SearchIcon, GitHubIcon, CodeIcon, TerminalIcon, DatabaseIcon } from '@/components/icons';

export default function GraphicsShowcasePage() {
  return (
    <main className="min-h-screen bg-cyber-black">
      {/* Header */}
      <header className="border-b border-cyber-gray bg-cyber-dark">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <CyberPressLogo variant="neon" size={150} />
          <nav className="flex gap-6">
            <a href="#logos" className="text-cyber-cyan hover:text-cyber-purple transition-colors">Logos</a>
            <a href="#icons" className="text-cyber-cyan hover:text-cyber-purple transition-colors">Icons</a>
            <a href="#components" className="text-cyber-cyan hover:text-cyber-purple transition-colors">Components</a>
            <a href="#effects" className="text-cyber-cyan hover:text-cyber-purple transition-colors">Effects</a>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">

        {/* Hero Section */}
        <section className="text-center space-y-6">
          <NeonText variant="cyan" size="xl" intensity="high">
            CyberPress Graphics System
          </NeonText>
          <p className="text-cyber-gray-200 text-lg">
            赛博朋克风格图形组件库 - 完整的视觉设计系统
          </p>
        </section>

        {/* Logo Section */}
        <section id="logos" className="space-y-6">
          <h2 className="text-3xl font-bold text-cyber-cyan">Logo Variants</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <HolographicCard>
              <div className="flex flex-col items-center gap-4">
                <CyberPressLogo variant="neon" size={200} />
                <p className="text-cyber-gray-200">Neon Version</p>
              </div>
            </HolographicCard>
            <HolographicCard>
              <div className="flex flex-col items-center gap-4">
                <CyberPressLogo variant="minimal" size={200} />
                <p className="text-cyber-gray-200">Minimal Version</p>
              </div>
            </HolographicCard>
            <HolographicCard>
              <div className="flex flex-col items-center gap-4">
                <CyberPressLogo variant="animated" size={200} />
                <p className="text-cyber-gray-200">Animated Version</p>
              </div>
            </HolographicCard>
          </div>
        </section>

        {/* Basic Icons Section */}
        <section id="icons" className="space-y-6">
          <h2 className="text-3xl font-bold text-cyber-cyan">Basic Icons</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <NeonCard variant="cyan" className="flex flex-col items-center gap-2">
              <HomeIcon size={32} />
              <span className="text-sm text-cyber-gray-200">Home</span>
            </NeonCard>
            <NeonCard variant="purple" className="flex flex-col items-center gap-2">
              <SearchIcon size={32} />
              <span className="text-sm text-cyber-gray-200">Search</span>
            </NeonCard>
            <NeonCard variant="pink" className="flex flex-col items-center gap-2">
              <GitHubIcon size={32} />
              <span className="text-sm text-cyber-gray-200">GitHub</span>
            </NeonCard>
            <NeonCard variant="cyan" className="flex flex-col items-center gap-2">
              <CodeIcon size={32} />
              <span className="text-sm text-cyber-gray-200">Code</span>
            </NeonCard>
            <NeonCard variant="purple" className="flex flex-col items-center gap-2">
              <TerminalIcon size={32} />
              <span className="text-sm text-cyber-gray-200">Terminal</span>
            </NeonCard>
            <NeonCard variant="pink" className="flex flex-col items-center gap-2">
              <DatabaseIcon size={32} />
              <span className="text-sm text-cyber-gray-200">Database</span>
            </NeonCard>
          </div>
        </section>

        {/* Tech Icons Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-cyber-cyan">Cyber Tech Icons</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <HolographicCard>
              <div className="flex flex-col items-center gap-4">
                <CyberTechIcon name="cpu" size={64} animated />
                <NeonText variant="cyan" size="lg">CPU</NeonText>
              </div>
            </HolographicCard>
            <HolographicCard>
              <div className="flex flex-col items-center gap-4">
                <CyberTechIcon name="neural" size={64} animated />
                <NeonText variant="purple" size="lg">Neural</NeonText>
              </div>
            </HolographicCard>
            <HolographicCard>
              <div className="flex flex-col items-center gap-4">
                <CyberTechIcon name="dataflow" size={64} animated />
                <NeonText variant="pink" size="lg">Data Flow</NeonText>
              </div>
            </HolographicCard>
            <HolographicCard>
              <div className="flex flex-col items-center gap-4">
                <CyberTechIcon name="grid" size={64} animated />
                <NeonText variant="yellow" size="lg">Grid</NeonText>
              </div>
            </HolographicCard>
            <HolographicCard>
              <div className="flex flex-col items-center gap-4">
                <CyberTechIcon name="eye" size={64} animated />
                <NeonText variant="cyan" size="lg">Eye</NeonText>
              </div>
            </HolographicCard>
            <HolographicCard>
              <div className="flex flex-col items-center gap-4">
                <CyberTechIcon name="shield" size={64} animated />
                <NeonText variant="purple" size="lg">Shield</NeonText>
              </div>
            </HolographicCard>
          </div>
        </section>

        {/* Buttons Section */}
        <section id="components" className="space-y-6">
          <h2 className="text-3xl font-bold text-cyber-cyan">Neon Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <NeonButton variant="cyan" size="sm">Small Cyan</NeonButton>
            <NeonButton variant="purple" size="md">Medium Purple</NeonButton>
            <NeonButton variant="pink" size="lg">Large Pink</NeonButton>
            <NeonButton variant="yellow" size="md">Medium Yellow</NeonButton>
          </div>
        </section>

        {/* Cards Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-cyber-cyan">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <NeonCard variant="cyan" glow>
              <h3 className="text-xl font-bold text-cyber-cyan mb-2">Cyan Card</h3>
              <p className="text-cyber-gray-200">
                A cyber card with neon cyan glow effect and hover interaction.
              </p>
            </NeonCard>
            <NeonCard variant="purple" glow>
              <h3 className="text-xl font-bold text-cyber-purple mb-2">Purple Card</h3>
              <p className="text-cyber-gray-200">
                A cyber card with neon purple glow effect and hover interaction.
              </p>
            </NeonCard>
            <NeonCard variant="pink" glow>
              <h3 className="text-xl font-bold text-cyber-pink mb-2">Pink Card</h3>
              <p className="text-cyber-gray-200">
                A cyber card with neon pink glow effect and hover interaction.
              </p>
            </NeonCard>
          </div>
        </section>

        {/* Holographic Card Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-cyber-cyan">Holographic Card</h2>
          <HolographicCard hover>
            <div className="flex items-start gap-6">
              <CyberTechIcon name="neural" size={80} />
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-cyber-cyan mb-2">Holographic Effect</h3>
                <p className="text-cyber-gray-200 mb-4">
                  This card features a holographic gradient overlay with scanline effects.
                  It creates a futuristic cyberpunk appearance perfect for tech showcases.
                </p>
                <div className="flex gap-2">
                  <NeonButton variant="cyan" size="sm">Learn More</NeonButton>
                  <NeonButton variant="purple" size="sm">Demo</NeonButton>
                </div>
              </div>
            </div>
          </HolographicCard>
        </section>

        {/* Neon Text Section */}
        <section id="effects" className="space-y-6">
          <h2 className="text-3xl font-bold text-cyber-cyan">Neon Text Effects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <HolographicCard>
              <NeonText variant="cyan" size="xl" intensity="high">
                Cyan Neon Text
              </NeonText>
              <p className="text-cyber-gray-200 mt-2">High intensity cyan glow</p>
            </HolographicCard>
            <HolographicCard>
              <NeonText variant="purple" size="xl" intensity="high">
                Purple Neon Text
              </NeonText>
              <p className="text-cyber-gray-200 mt-2">High intensity purple glow</p>
            </HolographicCard>
            <HolographicCard>
              <NeonText variant="pink" size="xl" intensity="high">
                Pink Neon Text
              </NeonText>
              <p className="text-cyber-gray-200 mt-2">High intensity pink glow</p>
            </HolographicCard>
            <HolographicCard>
              <NeonText variant="yellow" size="xl" intensity="high">
                Yellow Neon Text
              </NeonText>
              <p className="text-cyber-gray-200 mt-2">High intensity yellow glow</p>
            </HolographicCard>
          </div>
        </section>

        {/* Glow Effects Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-cyber-cyan">Glow Effects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CyberGlow color="cyan" intensity="low">
              <div className="bg-cyber-dark p-6 rounded-lg text-center">
                <NeonText variant="cyan" size="lg">Low</NeonText>
              </div>
            </CyberGlow>
            <CyberGlow color="purple" intensity="medium">
              <div className="bg-cyber-dark p-6 rounded-lg text-center">
                <NeonText variant="purple" size="lg">Medium</NeonText>
              </div>
            </CyberGlow>
            <CyberGlow color="pink" intensity="high">
              <div className="bg-cyber-dark p-6 rounded-lg text-center">
                <NeonText variant="pink" size="lg">High</NeonText>
              </div>
            </CyberGlow>
          </div>
        </section>

        {/* Loaders Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-cyber-cyan">Loading Animations</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <HolographicCard>
              <div className="flex flex-col items-center gap-4">
                <CyberLoader color="cyan" size={48} />
                <NeonText variant="cyan" size="md">Cyan</NeonText>
              </div>
            </HolographicCard>
            <HolographicCard>
              <div className="flex flex-col items-center gap-4">
                <CyberLoader color="purple" size={48} />
                <NeonText variant="purple" size="md">Purple</NeonText>
              </div>
            </HolographicCard>
            <HolographicCard>
              <div className="flex flex-col items-center gap-4">
                <CyberLoader color="pink" size={48} />
                <NeonText variant="pink" size="md">Pink</NeonText>
              </div>
            </HolographicCard>
            <HolographicCard>
              <div className="flex flex-col items-center gap-4">
                <CyberLoader color="yellow" size={48} />
                <NeonText variant="yellow" size="md">Yellow</NeonText>
              </div>
            </HolographicCard>
          </div>
        </section>

        {/* Illustrations Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-cyber-cyan">Illustrations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <HolographicCard>
              <div className="flex flex-col items-center gap-4">
                <CyberIllustration name="portal" width={400} height={300} />
                <NeonText variant="cyan" size="lg">Cyber Portal</NeonText>
              </div>
            </HolographicCard>
            <HolographicCard>
              <div className="flex flex-col items-center gap-4">
                <CyberIllustration name="waveform" width={400} height={200} />
                <NeonText variant="purple" size="lg">Digital Waveform</NeonText>
              </div>
            </HolographicCard>
          </div>
        </section>

        {/* Color Palette Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-cyber-cyan">Color Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <HolographicCard>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-cyber-cyan shadow-neon-cyan" />
                <NeonText variant="cyan" size="sm">Cyan</NeonText>
                <p className="text-xs text-cyber-gray-300">#00f0ff</p>
              </div>
            </HolographicCard>
            <HolographicCard>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-cyber-purple shadow-neon-purple" />
                <NeonText variant="purple" size="sm">Purple</NeonText>
                <p className="text-xs text-cyber-gray-300">#9d00ff</p>
              </div>
            </HolographicCard>
            <HolographicCard>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-cyber-pink shadow-neon-pink" />
                <NeonText variant="pink" size="sm">Pink</NeonText>
                <p className="text-xs text-cyber-gray-300">#ff0080</p>
              </div>
            </HolographicCard>
            <HolographicCard>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-cyber-yellow" />
                <NeonText variant="yellow" size="sm">Yellow</NeonText>
                <p className="text-xs text-cyber-gray-300">#f0ff00</p>
              </div>
            </HolographicCard>
            <HolographicCard>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-cyber-green border-2 border-cyber-green" />
                <NeonText variant="cyan" size="sm" className="text-cyber-green">Green</NeonText>
                <p className="text-xs text-cyber-gray-300">#00ff88</p>
              </div>
            </HolographicCard>
          </div>
        </section>

        {/* Usage Code Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-cyber-cyan">Quick Start</h2>
          <HolographicCard>
            <pre className="text-cyber-gray-200 text-sm overflow-x-auto">
{`// Import components
import { CyberPressLogo, NeonButton, NeonCard } from '@/components/graphics';
import { HomeIcon, SearchIcon } from '@/components/icons';

// Use in your component
export default function Page() {
  return (
    <div className="bg-cyber-black min-h-screen p-8">
      <CyberPressLogo variant="neon" size={200} />

      <NeonCard variant="cyan" glow>
        <h3 className="text-cyber-cyan">Welcome</h3>
        <p className="text-cyber-gray-200">CyberPress Graphics System</p>
        <NeonButton variant="purple">Get Started</NeonButton>
      </NeonCard>
    </div>
  );
}`}
            </pre>
          </HolographicCard>
        </section>

      </div>

      {/* Footer */}
      <footer className="border-t border-cyber-gray bg-cyber-dark mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <NeonText variant="cyan" size="md">
            CyberPress Graphics System v2.0
          </NeonText>
          <p className="text-cyber-gray-300 mt-2">
            Complete visual design system for cyberpunk aesthetics
          </p>
        </div>
      </footer>

    </main>
  );
}
