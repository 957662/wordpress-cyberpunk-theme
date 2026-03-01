'use client';

import React, { useRef, useEffect, useState } from 'react';

interface WarpTextProps {
  text: string;
  className?: string;
  speed?: number;
  intensity?: number;
}

export function WarpText({
  text,
  className = '',
  speed = 0.02,
  intensity = 5,
}: WarpTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    let animationFrame: number;

    const animate = () => {
      setTime((prev) => prev + speed);
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    ctx.font = 'bold 24px monospace';
    ctx.fillStyle = '#00f0ff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const chars = text.split('');
    const totalWidth = ctx.measureText(text).width;
    let x = (rect.width - totalWidth) / 2;

    chars.forEach((char, index) => {
      const charWidth = ctx.measureText(char).width;
      const offset = Math.sin(time + index * 0.3) * intensity;
      const scale = 1 + Math.sin(time * 2 + index * 0.2) * 0.1;

      ctx.save();
      ctx.translate(x + charWidth / 2, rect.height / 2 + offset);
      ctx.scale(scale, scale);
      ctx.fillText(char, 0, 0);
      ctx.restore();

      x += charWidth;
    });
  }, [text, time, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-32 ${className}`}
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
