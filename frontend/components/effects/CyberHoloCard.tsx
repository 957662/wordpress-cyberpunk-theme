'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CyberHoloCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  glowColor?: string;
  borderColor?: string;
  gridSize?: number;
  holographic?: boolean;
  scanlines?: boolean;
  glitch?: boolean;
  onClick?: () => void;
}

export const CyberHoloCard: React.FC<CyberHoloCardProps> = ({
  children,
  className,
  intensity = 1,
  glowColor = 'rgb(0, 240, 255)',
  borderColor = 'rgba(0, 240, 255, 0.5)',
  gridSize = 50,
  holographic = true,
  scanlines = true,
  glitch = false,
  onClick,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [`${10 * intensity}deg`, `-${10 * intensity}deg`]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [`-${10 * intensity}deg`, `${10 * intensity}deg`]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  // Random glitch effect
  React.useEffect(() => {
    if (!glitch || !isHovered) return;

    const triggerGlitch = () => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        triggerGlitch();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [glitch, isHovered]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={cn(
        'relative perspective-1000 cursor-pointer',
        className
      )}
    >
      {/* Glow effect */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute -inset-1 rounded-lg blur-md"
          style={{
            background: glowColor,
            opacity: 0.3 * intensity,
          }}
        />
      )}

      {/* Main card */}
      <motion.div
        animate={glitchActive ? {
          x: [0, -5, 5, -5, 5, 0],
          y: [0, 2, -2, 2, -2, 0],
        } : {}}
        transition={{ duration: 0.2 }}
        className={cn(
          'relative bg-cyber-dark/80 backdrop-blur-sm border rounded-lg overflow-hidden',
          'transition-all duration-300',
          isHovered && 'shadow-2xl'
        )}
        style={{
          borderColor: isHovered ? glowColor : borderColor,
          borderWidth: '2px',
        }}
      >
        {/* Holographic gradient overlay */}
        {holographic && (
          <motion.div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              background: `
                linear-gradient(
                  115deg,
                  transparent 20%,
                  ${glowColor} 30%,
                  transparent 40%,
                  transparent 60%,
                  ${glowColor} 70%,
                  transparent 80%
                )
              `,
              backgroundSize: '200% 200%',
            }}
            animate={isHovered ? {
              backgroundPosition: ['0% 0%', '100% 100%'],
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        )}

        {/* Grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(${borderColor} 1px, transparent 1px),
              linear-gradient(90deg, ${borderColor} 1px, transparent 1px)
            `,
            backgroundSize: `${gridSize}px ${gridSize}px`,
          }}
        />

        {/* Scanlines */}
        {scanlines && (
          <div
            className="absolute inset-0 pointer-events-none opacity-5"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.1) 2px, rgba(0, 0, 0, 0.1) 4px)',
            }}
          />
        )}

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 pointer-events-none" style={{ borderColor: glowColor }} />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 pointer-events-none" style={{ borderColor: glowColor }} />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 pointer-events-none" style={{ borderColor: glowColor }} />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 pointer-events-none" style={{ borderColor: glowColor }} />

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>

        {/* Holographic shimmer */}
        {isHovered && holographic && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(105deg, transparent 40%, ${glowColor}20 45%, ${glowColor}40 50%, ${glowColor}20 55%, transparent 60%)`,
            }}
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 0.5,
            }}
          />
        )}
      </motion.div>

      {/* Ambient particles */}
      {isHovered && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: glowColor,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [1, 0, 1],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 1 + i * 0.2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </>
      )}
    </motion.div>
  );
};

export default CyberHoloCard;
