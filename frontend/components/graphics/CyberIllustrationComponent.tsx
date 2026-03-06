'use client';

import React from 'react';
import Image from 'next/image';

interface IllustrationProps {
  name: 'portal' | 'waveform';
  width?: number;
  height?: number;
  className?: string;
}

const illustrationMap = {
  portal: '/illustrations/cyber-portal.svg',
  waveform: '/illustrations/digital-waveform.svg',
};

export const CyberIllustration: React.FC<IllustrationProps> = ({
  name,
  width = 400,
  height = 300,
  className = '',
}) => {
  const src = illustrationMap[name];

  if (!src) {
    return null;
  }

  return (
    <div className={`inline-flex ${className}`}>
      <Image
        src={src}
        alt={name}
        width={width}
        height={height}
        className="drop-shadow-[0_0_20px_rgba(0,240,255,0.4)]"
      />
    </div>
  );
};

export default CyberIllustration;
