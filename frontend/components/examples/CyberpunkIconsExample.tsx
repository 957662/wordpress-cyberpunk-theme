'use client';

/**
 * CyberPress Cyberpunk Icons Usage Example
 *
 * This file demonstrates how to use the new cyberpunk-themed icon components
 * in real-world scenarios.
 */

import React, { useState } from 'react';
import {
  NeuralNetworkIcon,
  QuantumCoreIcon,
  DataStreamIcon,
  HologramDisplayIcon,
  MicrochipIcon,
} from '@/components/icons/cyberpunk';

/**
 * Example 1: Feature Cards with Cyberpunk Icons
 * Perfect for showcasing AI, performance, and tech features
 */
export function FeatureCardsExample() {
  const features = [
    {
      title: 'AI Powered',
      description: 'Advanced machine learning algorithms',
      icon: NeuralNetworkIcon,
      color: 'cyan' as const,
    },
    {
      title: 'Quantum Speed',
      description: 'Lightning-fast processing power',
      icon: QuantumCoreIcon,
      color: 'purple' as const,
    },
    {
      title: 'Real-time Data',
      description: 'Instant data synchronization',
      icon: DataStreamIcon,
      color: 'green' as const,
    },
    {
      title: 'AR Ready',
      description: 'Immersive holographic displays',
      icon: HologramDisplayIcon,
      color: 'cyan' as const,
    },
    {
      title: 'Hardware Integration',
      description: 'Seamless chip connectivity',
      icon: MicrochipIcon,
      color: 'green' as const,
    },
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-cyber-cyan">
          Cyberpunk Technology
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-cyber-card border border-cyber-border rounded-lg p-8 hover:border-cyber-cyan transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,240,255,0.3)]"
              >
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <IconComponent
                    size={80}
                    color={feature.color}
                    animated={true}
                    className="group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-3 text-white text-center">
                  {feature.title}
                </h3>
                <p className="text-cyber-gray text-center">
                  {feature.description}
                </p>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/5 to-cyber-purple/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/**
 * Example 2: Animated Loading Screen
 * Using cyberpunk icons during page load
 */
export function CyberpunkLoadingScreen() {
  const [loading, setLoading] = useState(true);

  // Simulate loading completion
  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cyber-darker">
      <div className="text-center">
        {/* Spinning Quantum Core */}
        <div className="flex justify-center mb-8">
          <QuantumCoreIcon size={120} color="cyan" animated={true} />
        </div>

        {/* Loading Text */}
        <div className="text-cyber-cyan text-2xl font-mono animate-pulse">
          INITIALIZING SYSTEM...
        </div>

        {/* Progress Bar */}
        <div className="mt-8 w-64 mx-auto">
          <div className="h-1 bg-cyber-border rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple animate-[loading_3s_ease-in-out_infinite]" style={{ width: '60%' }} />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}

/**
 * Example 3: Interactive Tech Dashboard
 * Showcasing multiple cyberpunk icons with interactivity
 */
export function TechDashboardExample() {
  const [activeSystem, setActiveSystem] = useState<string | null>(null);

  const systems = [
    { id: 'neural', name: 'Neural Network', icon: NeuralNetworkIcon, status: 'active' },
    { id: 'quantum', name: 'Quantum Core', icon: QuantumCoreIcon, status: 'active' },
    { id: 'data', name: 'Data Stream', icon: DataStreamIcon, status: 'idle' },
    { id: 'hologram', name: 'Hologram Display', icon: HologramDisplayIcon, status: 'active' },
    { id: 'chip', name: 'Microchip Interface', icon: MicrochipIcon, status: 'idle' },
  ];

  return (
    <div className="min-h-screen bg-cyber-dark p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-cyber-cyan mb-4">
            SYSTEM DASHBOARD
          </h1>
          <p className="text-cyber-gray font-mono">
            CYBERPRESS PLATFORM v2.1.0
          </p>
        </div>

        {/* System Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {systems.map((system) => {
            const IconComponent = system.icon;
            const isActive = activeSystem === system.id;

            return (
              <button
                key={system.id}
                onClick={() => setActiveSystem(isActive ? null : system.id)}
                className={`
                  relative bg-cyber-card border-2 rounded-lg p-6
                  transition-all duration-300
                  ${isActive
                    ? 'border-cyber-cyan shadow-[0_0_30px_rgba(0,240,255,0.4)] scale-105'
                    : 'border-cyber-border hover:border-cyber-purple'
                  }
                `}
              >
                {/* Status Indicator */}
                <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${
                  system.status === 'active' ? 'bg-cyber-green animate-pulse' : 'bg-cyber-gray'
                }`} />

                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <IconComponent
                    size={64}
                    color={isActive ? 'cyan' : 'purple'}
                    animated={isActive}
                  />
                </div>

                {/* System Name */}
                <h3 className={`text-lg font-semibold text-center ${
                  isActive ? 'text-cyber-cyan' : 'text-white'
                }`}>
                  {system.name}
                </h3>

                {/* Status Text */}
                <p className="text-sm text-cyber-gray text-center mt-2">
                  {system.status === 'active' ? 'OPERATIONAL' : 'STANDBY'}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active System Details */}
        {activeSystem && (
          <div className="bg-cyber-card border-2 border-cyber-cyan rounded-lg p-8 animate-fadeIn">
            <h2 className="text-2xl font-bold text-cyber-cyan mb-4 font-mono">
              &gt; SYSTEM DETAILS: {activeSystem.toUpperCase()}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-cyber-gray mb-1">STATUS</div>
                <div className="text-cyber-green">ACTIVE</div>
              </div>
              <div>
                <div className="text-cyber-gray mb-1">LOAD</div>
                <div className="text-cyber-cyan">
                  {Math.floor(Math.random() * 30 + 40)}%
                </div>
              </div>
              <div>
                <div className="text-cyber-gray mb-1">UPTIME</div>
                <div className="text-cyber-purple">
                  {Math.floor(Math.random() * 100 + 50)}h
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

/**
 * Example 4: Icon Size Variants
 * Demonstrating responsive icon sizes
 */
export function IconSizeVariants() {
  const sizes = [48, 64, 96, 128];
  const colors: Array<'cyan' | 'purple' | 'pink'> = ['cyan', 'purple', 'pink'];

  return (
    <div className="p-8 bg-cyber-dark">
      <h2 className="text-3xl font-bold text-cyber-cyan mb-8 text-center">
        Icon Size Variants
      </h2>

      <div className="flex flex-wrap justify-center items-end gap-8">
        {sizes.map((size, index) => (
          <div key={size} className="text-center">
            <NeuralNetworkIcon
              size={size}
              color={colors[index % colors.length]}
              animated={true}
              className="mb-4"
            />
            <div className="text-white font-mono">
              {size}px
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Example 5: Color Theme Selector
 * Interactive color theme switching
 */
export function ColorThemeSelector() {
  const [selectedColor, setSelectedColor] = useState<'cyan' | 'purple' | 'pink'>('cyan');

  const colors: Array<{ value: 'cyan' | 'purple' | 'pink'; label: string; hex: string }> = [
    { value: 'cyan', label: 'Neon Cyan', hex: '#00f0ff' },
    { value: 'purple', label: 'Cyber Purple', hex: '#9d00ff' },
    { value: 'pink', label: 'Laser Pink', hex: '#ff0080' },
  ];

  return (
    <div className="p-8 bg-cyber-dark min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-3xl font-bold text-white mb-12 text-center">
        Color Theme Selector
      </h2>

      {/* Icon Display */}
      <div className="mb-12">
        <QuantumCoreIcon size={200} color={selectedColor} animated={true} />
      </div>

      {/* Color Buttons */}
      <div className="flex gap-4 flex-wrap justify-center">
        {colors.map((color) => (
          <button
            key={color.value}
            onClick={() => setSelectedColor(color.value)}
            className={`
              px-6 py-3 rounded-lg font-semibold transition-all duration-300
              ${selectedColor === color.value
                ? 'scale-110 shadow-lg'
                : 'opacity-70 hover:opacity-100'
              }
            `}
            style={{
              backgroundColor: color.hex,
              color: '#000',
              boxShadow: selectedColor === color.value
                ? `0 0 20px ${color.hex}`
                : 'none',
            }}
          >
            {color.label}
          </button>
        ))}
      </div>

      {/* Current Color Info */}
      <div className="mt-8 text-center">
        <div className="text-cyber-gray mb-2">Current Color</div>
        <div className="text-2xl font-mono" style={{ color: colors.find(c => c.value === selectedColor)?.hex }}>
          {colors.find(c => c.value === selectedColor)?.hex.toUpperCase()}
        </div>
      </div>
    </div>
  );
}

// Export all examples
export default {
  FeatureCardsExample,
  CyberpunkLoadingScreen,
  TechDashboardExample,
  IconSizeVariants,
  ColorThemeSelector,
};
