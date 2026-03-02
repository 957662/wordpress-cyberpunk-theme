'use client';

import { useEffect, useRef } from 'react';

interface CodeRainProps {
  fontSize?: number;
  chars?: string;
  color?: string;
}

export default function CodeRain({
  fontSize = 14,
  chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン',
  color = '#00f0ff',
}: CodeRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    let lastTime = 0;
    const fps = 30;
    const frameInterval = 1000 / fps;

    const draw = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;

      if (deltaTime >= frameInterval) {
        lastTime = currentTime - (deltaTime % frameInterval);

        ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

        for (let i = 0; i < drops.length; i++) {
          const char = chars[Math.floor(Math.random() * chars.length)];

          const isHighlight = Math.random() > 0.98;
          if (isHighlight) {
            ctx.fillStyle = '#ffffff';
            ctx.shadowBlur = 10;
            ctx.shadowColor = color;
          } else {
            ctx.fillStyle = color;
            ctx.shadowBlur = 0;
          }

          const x = i * fontSize;
          const y = drops[i] * fontSize;
          ctx.fillText(char, x, y);

          ctx.shadowBlur = 0;

          if (y > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }

          drops[i]++;
        }
      }

      requestAnimationFrame(draw);
    };

    requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [fontSize, chars, color]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-20"
      style={{ zIndex: 1 }}
    />
  );
}
