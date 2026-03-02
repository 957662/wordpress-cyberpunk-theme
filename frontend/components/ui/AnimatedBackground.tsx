'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

interface AnimatedBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export default function AnimatedBackground({
  children,
  className = '',
}: AnimatedBackgroundProps) {
  const { scrollYProgress } = useScroll();
  const y = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <div className={`relative ${className}`}>
      {/* Gradient Background */}
      <div className="fixed inset-0 bg-cyber-dark">
        {/* Animated gradient */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(157, 0, 255, 0.15), transparent 50%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(circle at 80% 20%, rgba(0, 240, 255, 0.15), transparent 50%)',
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Grid overlay */}
      <div
        className="fixed inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #00f0ff 1px, transparent 1px),
            linear-gradient(to bottom, #00f0ff 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// Simplified version with just grid
export function GridBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-cyber-dark">
      <div
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #00f0ff 1px, transparent 1px),
            linear-gradient(to bottom, #00f0ff 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// Animated gradient background
export function GradientBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-cyber-dark overflow-hidden">
      <motion.div
        className="fixed inset-0 opacity-30"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          background: 'linear-gradient(45deg, #0a0a0f 0%, #1a0a2e 25%, #0a0a0f 50%, #0a1a2e 75%, #0a0a0f 100%)',
          backgroundSize: '400% 400%',
        }}
      />

      {/* Floating orbs */}
      <motion.div
        className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyber-cyan/10 blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="fixed bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cyber-purple/10 blur-3xl"
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
