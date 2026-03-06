'use client';

import React from 'react';

interface HolographicCardProps {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
}

export const HolographicCard: React.FC<HolographicCardProps> = ({
  className = '',
  children,
  hover = true,
}) => {
  return (
    <div
      className={`
        relative
        bg-gradient-to-br
        from-cyan-500/10
        via-purple-500/10
        to-pink-500/10
        backdrop-blur-sm
        border
        border-cyan-500/30
        rounded-lg
        p-6
        overflow-hidden
        ${hover ? 'hover:border-cyan-400/60 transition-all duration-300' : ''}
        ${className}
      `}
    >
      {/* Holographic overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />

      {/* Scanlines effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,240,255,0.1) 2px, rgba(0,240,255,0.1) 4px)',
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default HolographicCard;
