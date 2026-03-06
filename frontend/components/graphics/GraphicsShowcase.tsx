'use client';

import React from 'react';
import { CyberPressLogo } from './LogoVariants';
import { CyberTechIcon } from './CyberTechIcons';
import { NeonButton } from './NeonButton';
import { NeonCard } from './NeonCard';
import { HolographicCard } from './HolographicCard';
import { CyberLoader } from './CyberLoader';
import { CyberIllustration } from './CyberIllustrationComponent';
import { NeonText } from './NeonTextComponent';
import { CyberGlow } from './CyberGlowComponent';

export const GraphicsShowcase: React.FC = () => {
  return (
    <div className="min-h-screen bg-cyber-black p-8">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* Logo Section */}
        <section className="text-center space-y-6">
          <h2 className="text-3xl font-bold text-cyber-cyan">Logo Variants</h2>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="bg-cyber-dark p-6 rounded-lg">
              <CyberPressLogo variant="neon" size={200} />
              <p className="mt-2 text-cyber-gray-200">Neon</p>
            </div>
            <div className="bg-cyber-dark p-6 rounded-lg">
              <CyberPressLogo variant="minimal" size={200} />
              <p className="mt-2 text-cyber-gray-200">Minimal</p>
            </div>
            <div className="bg-cyber-dark p-6 rounded-lg">
              <CyberPressLogo variant="animated" size={200} />
              <p className="mt-2 text-cyber-gray-200">Animated</p>
            </div>
          </div>
        </section>

        {/* Tech Icons Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-cyber-cyan">Tech Icons</h2>
          <div className="flex flex-wrap gap-6">
            <CyberTechIcon name="cpu" size={48} animated />
            <CyberTechIcon name="neural" size={48} animated />
            <CyberTechIcon name="dataflow" size={48} animated />
            <CyberTechIcon name="grid" size={48} animated />
            <CyberTechIcon name="eye" size={48} animated />
            <CyberTechIcon name="shield" size={48} animated />
          </div>
        </section>

        {/* Buttons Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-cyber-cyan">Neon Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <NeonButton variant="cyan">Cyan Button</NeonButton>
            <NeonButton variant="purple">Purple Button</NeonButton>
            <NeonButton variant="pink">Pink Button</NeonButton>
            <NeonButton variant="yellow">Yellow Button</NeonButton>
          </div>
        </section>

        {/* Cards Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-cyber-cyan">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <NeonCard variant="cyan">
              <h3 className="text-xl font-bold text-cyber-cyan mb-2">Cyan Card</h3>
              <p className="text-cyber-gray-200">A cyber card with neon glow effect.</p>
            </NeonCard>
            <NeonCard variant="purple">
              <h3 className="text-xl font-bold text-cyber-purple mb-2">Purple Card</h3>
              <p className="text-cyber-gray-200">A cyber card with neon glow effect.</p>
            </NeonCard>
            <NeonCard variant="pink">
              <h3 className="text-xl font-bold text-cyber-pink mb-2">Pink Card</h3>
              <p className="text-cyber-gray-200">A cyber card with neon glow effect.</p>
            </NeonCard>
          </div>
        </section>

        {/* Holographic Card */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-cyber-cyan">Holographic Card</h2>
          <HolographicCard>
            <h3 className="text-xl font-bold text-cyber-cyan mb-2">Holographic Effect</h3>
            <p className="text-cyber-gray-200">
              A card with holographic gradient overlay and scanline effect.
            </p>
          </HolographicCard>
        </section>

        {/* Neon Text */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-cyber-cyan">Neon Text</h2>
          <div className="space-y-4">
            <NeonText variant="cyan" size="xl" intensity="high">
              Cyan Neon Text
            </NeonText>
            <NeonText variant="purple" size="xl" intensity="high">
              Purple Neon Text
            </NeonText>
            <NeonText variant="pink" size="xl" intensity="high">
              Pink Neon Text
            </NeonText>
            <NeonText variant="yellow" size="xl" intensity="high">
              Yellow Neon Text
            </NeonText>
          </div>
        </section>

        {/* Glow Effect */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-cyber-cyan">Glow Effects</h2>
          <div className="flex flex-wrap gap-6">
            <CyberGlow color="cyan" intensity="low">
              <div className="bg-cyber-dark px-6 py-3 rounded">Low Intensity</div>
            </CyberGlow>
            <CyberGlow color="purple" intensity="medium">
              <div className="bg-cyber-dark px-6 py-3 rounded">Medium Intensity</div>
            </CyberGlow>
            <CyberGlow color="pink" intensity="high">
              <div className="bg-cyber-dark px-6 py-3 rounded">High Intensity</div>
            </CyberGlow>
          </div>
        </section>

        {/* Loader */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-cyber-cyan">Loaders</h2>
          <div className="flex flex-wrap gap-8">
            <div className="text-center">
              <CyberLoader color="cyan" size={48} />
              <p className="mt-2 text-cyber-cyan">Cyan</p>
            </div>
            <div className="text-center">
              <CyberLoader color="purple" size={48} />
              <p className="mt-2 text-cyber-purple">Purple</p>
            </div>
            <div className="text-center">
              <CyberLoader color="pink" size={48} />
              <p className="mt-2 text-cyber-pink">Pink</p>
            </div>
            <div className="text-center">
              <CyberLoader color="yellow" size={48} />
              <p className="mt-2 text-cyber-yellow">Yellow</p>
            </div>
          </div>
        </section>

        {/* Illustrations */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-cyber-cyan">Illustrations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-cyber-dark p-6 rounded-lg">
              <CyberIllustration name="portal" width={400} height={300} />
              <p className="mt-2 text-center text-cyber-gray-200">Cyber Portal</p>
            </div>
            <div className="bg-cyber-dark p-6 rounded-lg">
              <CyberIllustration name="waveform" width={400} height={200} />
              <p className="mt-2 text-center text-cyber-gray-200">Digital Waveform</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default GraphicsShowcase;
