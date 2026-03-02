/**
 * 赛博网格组件
 * 创建动态的赛博朋克风格网格背景效果
 */

'use client';

import { useEffect, useRef } from 'react';

export interface CyberGridProps {
  color?: 'cyan' | 'purple' | 'pink' | 'yellow';
  density?: 'low' | 'medium' | 'high';
  animation?: boolean;
  className?: string;
}

export function CyberGrid({
  color = 'cyan',
  density = 'medium',
  animation = true,
  className = '',
}: CyberGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const colors = {
    cyan: 'rgba(0, 240, 255, 0.15)',
    purple: 'rgba(157, 0, 255, 0.15)',
    pink: 'rgba(255, 0, 128, 0.15)',
    yellow: 'rgba(240, 255, 0, 0.15)',
  };

  const gridSize = {
    low: 60,
    medium: 40,
    high: 20,
  };

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

    let offset = 0;

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const size = gridSize[density];
      const gridColor = colors[color];

      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;

      // 绘制垂直线
      for (let x = offset % size; x < canvas.width; x += size) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // 绘制水平线
      for (let y = offset % size; y < canvas.height; y += size) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // 绘制交叉点
      const dotSize = 2;
      ctx.fillStyle = colors[color].replace('0.15', '0.4');

      for (let x = offset % size; x < canvas.width; x += size) {
        for (let y = offset % size; y < canvas.height; y += size) {
          if (Math.random() > 0.7) {
            ctx.beginPath();
            ctx.arc(x, y, dotSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      if (animation) {
        offset += 0.2;
      }

      requestAnimationFrame(drawGrid);
    };

    drawGrid();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [color, density, animation]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: -1 }}
    />
  );
}

export default CyberGrid;
