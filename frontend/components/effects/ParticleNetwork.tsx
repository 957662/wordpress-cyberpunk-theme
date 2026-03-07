'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

interface ParticleNetworkProps {
  particleCount?: number;
  connectionDistance?: number;
  mouseDistance?: number;
  colors?: string[];
  className?: string;
}

export function ParticleNetwork({
  particleCount = 80,
  connectionDistance = 150,
  mouseDistance = 200,
  colors = ['#00f0ff', '#9d00ff', '#ff0080'],
  className = '',
}: ParticleNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationFrameRef = useRef<number>();

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

    // Initialize particles
    const initParticles = () => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          x: Math.random() * canvas.offsetWidth,
          y: Math.random() * canvas.offsetHeight,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          alpha: Math.random() * 0.5 + 0.2,
        });
      }
      setParticles(newParticles);
    };

    initParticles();

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      setParticles((prevParticles) => {
        const updatedParticles = prevParticles.map((particle) => {
          // Update position
          let x = particle.x + particle.vx;
          let y = particle.y + particle.vy;

          // Bounce off walls
          if (x < 0 || x > canvas.offsetWidth) {
            particle.vx *= -1;
            x = Math.max(0, Math.min(canvas.offsetWidth, x));
          }
          if (y < 0 || y > canvas.offsetHeight) {
            particle.vy *= -1;
            y = Math.max(0, Math.min(canvas.offsetHeight, y));
          }

          // Mouse interaction
          const dx = mouseRef.current.x - x;
          const dy = mouseRef.current.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouseDistance) {
            const force = (mouseDistance - distance) / mouseDistance;
            particle.vx += (dx / distance) * force * 0.02;
            particle.vy += (dy / distance) * force * 0.02;
          }

          // Damping
          particle.vx *= 0.99;
          particle.vy *= 0.99;

          // Draw particle
          ctx.beginPath();
          ctx.arc(x, y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
          ctx.globalAlpha = particle.alpha;
          ctx.fill();

          // Draw connections
          prevParticles.forEach((otherParticle, index) => {
            if (index === prevParticles.indexOf(particle)) return;

            const odx = otherParticle.x - x;
            const ody = otherParticle.y - y;
            const odistance = Math.sqrt(odx * odx + ody * ody);

            if (odistance < connectionDistance) {
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              const gradient = ctx.createLinearGradient(x, y, otherParticle.x, otherParticle.y);
              gradient.addColorStop(0, colors[0] + '40');
              gradient.addColorStop(1, colors[1] + '40');
              ctx.strokeStyle = gradient;
              ctx.globalAlpha = (1 - odistance / connectionDistance) * 0.3;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          });

          return { ...particle, x, y };
        });

        return updatedParticles;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [particleCount, connectionDistance, mouseDistance, colors]);

  return (
    <motion.canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    />
  );
}

export default ParticleNetwork;
