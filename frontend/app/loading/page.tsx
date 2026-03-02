'use client';

import React from 'react';
import CyberLoader from '@/components/effects/CyberLoader';
import CyberGradientBackground from '@/components/effects/CyberGradientBackground';

export default function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <CyberGradientBackground speed={0.5} intensity={0.3}>
        <div className="relative z-10 flex flex-col items-center gap-8">
          <CyberLoader size="lg" text="Loading..." />
          <p className="text-cyan-400 text-sm">Preparing your cyber experience...</p>
        </div>
      </CyberGradientBackground>
    </div>
  );
}
