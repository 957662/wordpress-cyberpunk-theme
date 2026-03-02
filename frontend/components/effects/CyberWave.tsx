'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface CyberWaveProps {
  className?: string;
  waveCount?: number;
  speed?: number;
  amplitude?: number;
  color?: 'cyan' | 'purple' | 'pink' | 'yellow';
}

/**
 * CyberWave - 赛博波浪效果
 * 多层波浪叠加，创建流动的光效
 */
export const CyberWave: React.FC<CyberWaveProps> = ({
  className = '',
  waveCount = 3,
  speed = 1,
  amplitude = 50,
  color = 'cyan'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const colors = {
    cyan: { primary: '#00f0ff', secondary: '#00a0aa' },
    purple: { primary: '#9d00ff', secondary: '#6600aa' },
    pink: { primary: '#ff0080', secondary: '#aa0055' },
    yellow: { primary: '#f0ff00', secondary: '#a0aa00' }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    const waves = Array.from({ length: waveCount }, (_, i) => ({
      offset: i * 0.5,
      frequency: 0.01 + i * 0.005,
      phase: i * Math.PI * 0.3,
      speed: (1 + i * 0.2) * speed,
      amplitude: amplitude * (1 - i * 0.15)
    }));

    let time = 0;

    const animate = () => {
      time += 0.016;

      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      waves.forEach((wave, index) => {
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        const { primary, secondary } = colors[color];

        gradient.addColorStop(0, `${primary}00`);
        gradient.addColorStop(0.5, `${primary}${Math.floor(40 - index * 10).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, `${secondary}00`);

        ctx.beginPath();
        ctx.moveTo(0, height / 2);

        for (let x = 0; x <= width; x += 5) {
          const y = height / 2 +
            Math.sin(x * wave.frequency + time * wave.speed + wave.phase) * wave.amplitude +
            Math.sin(x * wave.frequency * 2 + time * wave.speed * 1.5) * (wave.amplitude * 0.3);
          ctx.lineTo(x, y);
        }

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3 - index * 0.5;
        ctx.lineCap = 'round';
        ctx.stroke();

        // 添加发光效果
        ctx.shadowColor = primary;
        ctx.shadowBlur = 15 - index * 3;
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [waveCount, speed, amplitude, color]);

  return (
    <motion.div
      className={`relative w-full h-40 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
    </motion.div>
  );
};

export default CyberWave;
