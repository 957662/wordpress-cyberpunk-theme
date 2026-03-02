/**
 * 六边形网格组件
 * 创建赛博朋克风格的六边形网格背景
 */

'use client';

import { useEffect, useRef } from 'react';

export interface HexagonGridProps {
  size?: number;
  gap?: number;
  color?: string;
  hoverColor?: string;
  className?: string;
  interactive?: boolean;
}

export function HexagonGrid({
  size = 30,
  gap = 2,
  color = 'rgba(0, 240, 255, 0.1)',
  hoverColor = 'rgba(0, 240, 255, 0.4)',
  className = '',
  interactive = true,
}: HexagonGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

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

    // 鼠标移动事件
    const handleMouseMove = (e: MouseEvent) => {
      if (interactive) {
        mouseRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // 绘制六边形
    const drawHexagon = (x: number, y: number, size: number, fillColor: string) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const hx = x + size * Math.cos(angle);
        const hy = y + size * Math.sin(angle);
        if (i === 0) {
          ctx.moveTo(hx, hy);
        } else {
          ctx.lineTo(hx, hy);
        }
      }
      ctx.closePath();
      ctx.fillStyle = fillColor;
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    // 计算距离
    const distance = (x1: number, y1: number, x2: number, y2: number) => {
      return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    };

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const hexRadius = size;
      const hexHeight = hexRadius * 2;
      const hexWidth = Math.sqrt(3) * hexRadius;
      const xStep = hexWidth + gap;
      const yStep = hexHeight * 0.75 + gap;

      for (let row = 0; row < canvas.height / yStep + 1; row++) {
        for (let col = 0; col < canvas.width / xStep + 1; col++) {
          const x = col * xStep + (row % 2 === 0 ? 0 : xStep / 2);
          const y = row * yStep;

          let fillColor = color;

          // 交互效果
          if (interactive) {
            const dist = distance(x, y, mouseRef.current.x, mouseRef.current.y);
            if (dist < 100) {
              const opacity = 1 - dist / 100;
              fillColor = hoverColor.replace('0.4', `${opacity * 0.4}`);
            }
          }

          drawHexagon(x, y, hexRadius - gap, fillColor);
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      cancelAnimationFrame(animationId);
    };
  }, [size, gap, color, hoverColor, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: -1 }}
    />
  );
}

export default HexagonGrid;
