/**
 * CyberPress Graphics Manifest - 图形素材清单展示页面
 *
 * 展示所有可用的 Logo、图标、插画和装饰元素
 */

'use client';

import React, { useState } from 'react';
import { MainLogo, SquareLogo } from '@/components/graphics/Logos';
import { GlowingLogo, RotatingLogo, PulseLogo, HologramLogo, GlitchLogo } from '@/components/graphics/LogoVariants';
import {
  MenuIcon,
  SearchIcon,
  ArrowIcon,
  HeartIcon,
  StarIcon,
  GitHubIcon,
  CodeIcon,
  UserIcon,
  SettingsIcon,
  CheckIcon,
  WarningIcon,
  ErrorIcon,
  InfoIcon,
} from '@/components/icons';
import { NeuralNetworkIcon, QuantumCoreIcon } from '@/components/graphics/CyberIcons';
import {
  TerminalIcon,
  LockIcon,
  ChipIcon,
  DatabaseIcon,
  CloudDownloadIcon,
  ServerIcon,
  MailIcon,
} from '@/components/graphics/AdditionalIcons';
import {
  HeroIllustration,
  ErrorIllustration,
  LoadingIllustration,
  EmptyIllustration,
  SuccessIllustration,
} from '@/components/graphics/Illustrations';

export default function GraphicsManifestPage() {
  const [activeTab, setActiveTab] = useState<'logos' | 'icons' | 'illustrations' | 'patterns'>('logos');
  const [isDark, setIsDark] = useState(true);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-cyber-dark' : 'bg-gray-100'}`}>
      {/* Header */}
      <header className="border-b border-cyber-border bg-cyber-card">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-purple">
                Graphics Manifest
              </h1>
              <p className={isDark ? 'text-cyber-muted mt-2' : 'text-gray-600 mt-2'}>
                CyberPress 图形素材完整清单
              </p>
            </div>
            <button
              onClick={() => setIsDark(!isDark)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-cyber-cyan hover:shadow-neon-cyan transition-all"
            >
              <span className="text-cyber-cyan">{isDark ? '🌙' : '☀️'}</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-6">
            <TabButton active={activeTab === 'logos'} onClick={() => setActiveTab('logos')}>
              🎯 Logo
            </TabButton>
            <TabButton active={activeTab === 'icons'} onClick={() => setActiveTab('icons')}>
              🎨 图标
            </TabButton>
            <TabButton active={activeTab === 'illustrations'} onClick={() => setActiveTab('illustrations')}>
              🖼️ 插画
            </TabButton>
            <TabButton active={activeTab === 'patterns'} onClick={() => setActiveTab('patterns')}>
              ✨ 装饰
            </TabButton>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'logos' && <LogosSection isDark={isDark} />}
        {activeTab === 'icons' && <IconsSection isDark={isDark} />}
        {activeTab === 'illustrations' && <IllustrationsSection isDark={isDark} />}
        {activeTab === 'patterns' && <PatternsSection isDark={isDark} />}
      </main>
    </div>
  );
}

// Tab Button Component
function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition-all ${
        active
          ? 'bg-cyber-cyan text-cyber-dark shadow-neon-cyan'
          : 'bg-cyber-card text-cyber-cyan border border-cyber-cyan hover:bg-cyber-cyan/10'
      }`}
    >
      {children}
    </button>
  );
}

// Logos Section
function LogosSection({ isDark }: { isDark: boolean }) {
  return (
    <div className="space-y-8">
      {/* Basic Logos */}
      <section>
        <h2 className={`text-2xl font-display mb-6 ${isDark ? 'text-cyber-cyan' : 'text-gray-900'}`}>
          基础 Logo (Basic Logos)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LogoCard name="MainLogo" logo={<MainLogo width={200} />} isDark={isDark} />
          <LogoCard name="SquareLogo" logo={<SquareLogo size={100} />} isDark={isDark} />
        </div>
      </section>

      {/* Animated Logos */}
      <section>
        <h2 className={`text-2xl font-display mb-6 ${isDark ? 'text-cyber-cyan' : 'text-gray-900'}`}>
          动画 Logo (Animated Logos)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LogoCard name="GlowingLogo" logo={<GlowingLogo size={100} />} isDark={isDark} />
          <LogoCard name="RotatingLogo" logo={<RotatingLogo size={100} />} isDark={isDark} />
          <LogoCard name="PulseLogo" logo={<PulseLogo size={100} />} isDark={isDark} />
          <LogoCard name="HologramLogo" logo={<HologramLogo size={100} />} isDark={isDark} />
          <LogoCard name="GlitchLogo" logo={<GlitchLogo size={100} />} isDark={isDark} />
        </div>
      </section>
    </div>
  );
}

// Icons Section
function IconsSection({ isDark }: { isDark: boolean }) {
  return (
    <div className="space-y-8">
      {/* Basic Icons */}
      <section>
        <h2 className={`text-2xl font-display mb-6 ${isDark ? 'text-cyber-cyan' : 'text-gray-900'}`}>
          基础图标 (Basic Icons)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <IconCard name="MenuIcon" icon={<MenuIcon size={32} />} isDark={isDark} />
          <IconCard name="SearchIcon" icon={<SearchIcon size={32} />} isDark={isDark} />
          <IconCard name="ArrowIcon" icon={<ArrowIcon size={32} direction="up" />} isDark={isDark} />
          <IconCard name="HeartIcon" icon={<HeartIcon size={32} />} isDark={isDark} />
          <IconCard name="StarIcon" icon={<StarIcon size={32} />} isDark={isDark} />
          <IconCard name="GitHubIcon" icon={<GitHubIcon size={32} />} isDark={isDark} />
          <IconCard name="CodeIcon" icon={<CodeIcon size={32} />} isDark={isDark} />
          <IconCard name="UserIcon" icon={<UserIcon size={32} />} isDark={isDark} />
          <IconCard name="SettingsIcon" icon={<SettingsIcon size={32} />} isDark={isDark} />
          <IconCard name="CheckIcon" icon={<CheckIcon size={32} />} isDark={isDark} />
          <IconCard name="WarningIcon" icon={<WarningIcon size={32} />} isDark={isDark} />
          <IconCard name="ErrorIcon" icon={<ErrorIcon size={32} />} isDark={isDark} />
          <IconCard name="InfoIcon" icon={<InfoIcon size={32} />} isDark={isDark} />
        </div>
      </section>

      {/* Cyber Icons */}
      <section>
        <h2 className={`text-2xl font-display mb-6 ${isDark ? 'text-cyber-cyan' : 'text-gray-900'}`}>
          赛博图标 (Cyber Icons)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <IconCard name="NeuralNetworkIcon" icon={<NeuralNetworkIcon size={100} />} isDark={isDark} large />
          <IconCard name="QuantumCoreIcon" icon={<QuantumCoreIcon size={100} />} isDark={isDark} large />
        </div>
      </section>

      {/* Additional Icons */}
      <section>
        <h2 className={`text-2xl font-display mb-6 ${isDark ? 'text-cyber-cyan' : 'text-gray-900'}`}>
          附加图标 (Additional Icons)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <IconCard name="TerminalIcon" icon={<TerminalIcon size={32} />} isDark={isDark} />
          <IconCard name="LockIcon" icon={<LockIcon size={32} />} isDark={isDark} />
          <IconCard name="ChipIcon" icon={<ChipIcon size={32} />} isDark={isDark} />
          <IconCard name="DatabaseIcon" icon={<DatabaseIcon size={32} />} isDark={isDark} />
          <IconCard name="CloudDownloadIcon" icon={<CloudDownloadIcon size={32} />} isDark={isDark} />
          <IconCard name="ServerIcon" icon={<ServerIcon size={32} />} isDark={isDark} />
          <IconCard name="MailIcon" icon={<MailIcon size={32} />} isDark={isDark} />
        </div>
      </section>
    </div>
  );
}

// Illustrations Section
function IllustrationsSection({ isDark }: { isDark: boolean }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <IllustrationCard
          name="HeroIllustration"
          illustration={<HeroIllustration width={400} height={300} />}
          isDark={isDark}
        />
        <IllustrationCard
          name="ErrorIllustration"
          illustration={<ErrorIllustration width={300} height={250} />}
          isDark={isDark}
        />
        <IllustrationCard
          name="LoadingIllustration"
          illustration={<LoadingIllustration width={200} height={150} />}
          isDark={isDark}
        />
        <IllustrationCard
          name="EmptyIllustration"
          illustration={<EmptyIllustration width={250} height={200} />}
          isDark={isDark}
        />
        <IllustrationCard
          name="SuccessIllustration"
          illustration={<SuccessIllustration width={200} height={160} />}
          isDark={isDark}
        />
      </div>
    </div>
  );
}

// Patterns Section
function PatternsSection({ isDark }: { isDark: boolean }) {
  const patterns = [
    { name: 'Grid Pattern', path: '/patterns/grid.svg' },
    { name: 'Circuit Pattern', path: '/patterns/circuit.svg' },
    { name: 'Scanlines Pattern', path: '/patterns/scanlines.svg' },
    { name: 'Noise Pattern', path: '/patterns/noise.svg' },
    { name: 'Hexagon Pattern', path: '/patterns/hexagon.svg' },
    { name: 'Matrix Pattern', path: '/patterns/matrix.svg' },
  ];

  const backgrounds = [
    { name: 'Hero Background', path: '/backgrounds/hero-bg.svg' },
    { name: 'Card Background', path: '/backgrounds/card-bg.svg' },
    { name: 'Loading Background', path: '/backgrounds/loading-bg.svg' },
  ];

  return (
    <div className="space-y-8">
      {/* SVG Patterns */}
      <section>
        <h2 className={`text-2xl font-display mb-6 ${isDark ? 'text-cyber-cyan' : 'text-gray-900'}`}>
          SVG 图案 (SVG Patterns)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {patterns.map((pattern) => (
            <PatternCard key={pattern.name} name={pattern.name} path={pattern.path} isDark={isDark} />
          ))}
        </div>
      </section>

      {/* Backgrounds */}
      <section>
        <h2 className={`text-2xl font-display mb-6 ${isDark ? 'text-cyber-cyan' : 'text-gray-900'}`}>
          背景图 (Backgrounds)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {backgrounds.map((bg) => (
            <PatternCard key={bg.name} name={bg.name} path={bg.path} isDark={isDark} />
          ))}
        </div>
      </section>
    </div>
  );
}

// Card Components
function LogoCard({ name, logo, isDark }: { name: string; logo: React.ReactNode; isDark: boolean }) {
  return (
    <div
      className={`p-6 rounded-lg flex flex-col items-center gap-4 transition-all hover:scale-105 ${
        isDark
          ? 'bg-cyber-card border border-cyber-border hover:border-cyber-cyan'
          : 'bg-white border border-gray-200 hover:border-blue-500'
      }`}
    >
      <div className="flex items-center justify-center">{logo}</div>
      <span className={`text-sm font-mono ${isDark ? 'text-cyber-muted' : 'text-gray-600'}`}>{name}</span>
    </div>
  );
}

function IconCard({
  name,
  icon,
  isDark,
  large = false,
}: {
  name: string;
  icon: React.ReactNode;
  isDark: boolean;
  large?: boolean;
}) {
  return (
    <div
      className={`p-4 rounded-lg flex flex-col items-center gap-3 transition-all hover:scale-105 ${
        isDark
          ? 'bg-cyber-card border border-cyber-border hover:border-cyber-cyan'
          : 'bg-white border border-gray-200 hover:border-blue-500'
      }`}
    >
      <div className={`flex items-center justify-center ${large ? 'w-32 h-32' : 'w-16 h-16'}`}>{icon}</div>
      <span className={`text-xs font-mono text-center ${isDark ? 'text-cyber-muted' : 'text-gray-600'}`}>{name}</span>
    </div>
  );
}

function IllustrationCard({
  name,
  illustration,
  isDark,
}: {
  name: string;
  illustration: React.ReactNode;
  isDark: boolean;
}) {
  return (
    <div
      className={`p-6 rounded-lg flex flex-col items-center gap-4 transition-all hover:scale-105 ${
        isDark
          ? 'bg-cyber-card border border-cyber-border hover:border-cyber-cyan'
          : 'bg-white border border-gray-200 hover:border-blue-500'
      }`}
    >
      {illustration}
      <span className={`text-sm font-mono ${isDark ? 'text-cyber-muted' : 'text-gray-600'}`}>{name}</span>
    </div>
  );
}

function PatternCard({ name, path, isDark }: { name: string; path: string; isDark: boolean }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`p-4 rounded-lg ${
        isDark ? 'bg-cyber-card border border-cyber-border' : 'bg-white border border-gray-200'
      }`}
    >
      <div className="aspect-square rounded bg-cyber-dark mb-3 overflow-hidden">
        {!imageError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={path}
            alt={name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-cyber-muted text-sm">
            Image not found
          </div>
        )}
      </div>
      <span className={`text-xs font-mono ${isDark ? 'text-cyber-muted' : 'text-gray-600'}`}>{name}</span>
      </div>
  );
}
