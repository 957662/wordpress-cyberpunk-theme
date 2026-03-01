'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SpotlightEffectProps {
  children: React.ReactNode;
  className?: string;
  size?: number;
  color?: string;
}

export const SpotlightEffect: React.FC<SpotlightEffectProps> = ({
  children,
  className,
  size = 400,
  color = 'rgba(0, 240, 255, 0.15)',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePosition({ x, y });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn('relative overflow-hidden rounded-xl', className)}
    >
      <motion.div
        className="absolute pointer-events-none"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        }}
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      />
      {children}
    </div>
  );
};

interface RippleEffectProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  duration?: number;
}

export const RippleEffect: React.FC<RippleEffectProps> = ({
  children,
  className,
  color = 'rgba(0, 240, 255, 0.3)',
  duration = 600,
}) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = {
      id: Date.now(),
      x,
      y,
    };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, duration);
  };

  return (
    <div
      onClick={handleClick}
      className={cn('relative overflow-hidden', className)}
    >
      {children}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute pointer-events-none rounded-full"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
            backgroundColor: color,
          }}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{
            scale: 4,
            opacity: 0,
          }}
          transition={{ duration: duration / 1000 }}
        />
      ))}
    </div>
  );
};

interface WaveBackgroundProps {
  className?: string;
  color?: string;
  amplitude?: number;
  frequency?: number;
  speed?: number;
}

export const WaveBackground: React.FC<WaveBackgroundProps> = ({
  className,
  color = '#00f0ff',
  amplitude = 20,
  frequency = 0.01,
  speed = 0.02,
}) => {
  return (
    <div className={cn('absolute inset-0 pointer-events-none', className)}>
      <svg
        className="w-full h-full"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <motion.path
          fill={color}
          fillOpacity="0.1"
          d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          animate={{
            d: [
              'M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z',
              'M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,133.3C672,117,768,139,864,165.3C960,192,1056,224,1152,218.7C1248,213,1344,171,1392,149.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z',
              'M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />
      </svg>
    </div>
  );
};

interface FloatingElementsProps {
  children?: React.ReactNode;
  className?: string;
  count?: number;
  size?: number;
}

export const FloatingElements: React.FC<FloatingElementsProps> = ({
  children,
  className,
  count = 20,
  size = 4,
}) => {
  const elements = Array.from({ length: count }, (_, i) => i);

  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      {elements.map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-cyber-cyan/20"
          style={{
            width: Math.random() * size + 2,
            height: Math.random() * size + 2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
      {children}
    </div>
  );
};

interface GrainEffectProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export const GrainEffect: React.FC<GrainEffectProps> = ({
  children,
  className,
  intensity = 0.5,
}) => {
  return (
    <div className={cn('relative', className)}>
      {children}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: intensity,
        }}
      />
    </div>
  );
};

export default SpotlightEffect;
