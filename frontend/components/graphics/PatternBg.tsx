'use client';

import React from 'react';

interface PatternBackgroundProps {
  variant: 'hex' | 'dots' | 'lines';
  className?: string;
  opacity?: number;
  children?: React.ReactNode;
}

const patternMap = {
  hex: 'url(/patterns/cyber-hex-dense.svg)',
  dots: 'url(/patterns/cyber-dots.svg)',
  lines: 'url(/patterns/cyber-lines.svg)',
};

export const PatternBackground: React.FC<PatternBackgroundProps> = ({
  variant,
  className = '',
  opacity = 0.5,
  children,
}) => {
  return (
    <div
      className={`relative ${className}`}
      style={{
        backgroundImage: patternMap[variant],
        opacity,
      }}
    >
      {children}
    </div>
  );
};

export default PatternBackground;
