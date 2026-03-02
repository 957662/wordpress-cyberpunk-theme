'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface CyberSpectrumProps {
  className?: string;
  intensity?: number;
  speed?: number;
  bars?: number;
}

/**
 * CyberSpectrum - 赛博频谱分析器效果
 * 模拟音频频谱分析的可视化效果，带有霓虹发光
 */
export const CyberSpectrum: React.FC<CyberSpectrumProps> = ({
  className = '',
  intensity = 1,
  speed = 1,
  bars = 32
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置 canvas 尺寸
    const updateCanvasSize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // 频谱数据
    const spectrumData = new Array(bars).fill(0);
    const targetData = new Array(bars).fill(0);
    let time = 0;

    // 动画循环
    const animate = () => {
      time += 0.016 * speed;

      // 更新目标值
      for (let i = 0; i < bars; i++) {
        const noise = Math.sin(time * 2 + i * 0.3) * 0.5 + 0.5;
        const secondary = Math.cos(time * 1.5 + i * 0.2) * 0.3 + 0.7;
        targetData[i] = (noise * secondary * 100 * intensity);
      }

      // 平滑过渡
      for (let i = 0; i < bars; i++) {
        spectrumData[i] += (targetData[i] - spectrumData[i]) * 0.1;
      }

      // 清空画布
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      const barWidth = (width - 32) / bars;
      const gap = 2;

      // 绘制频谱条
      for (let i = 0; i < bars; i++) {
        const barHeight = (spectrumData[i] / 100) * (height * 0.8);
        const x = 16 + i * (barWidth + gap);
        const y = (height - barHeight) / 2;

        // 创建渐变
        const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);

        // 根据位置改变颜色
        const hue = (180 + (i / bars) * 120) % 360;
        gradient.addColorStop(0, `hsla(${hue}, 100%, 70%, 0)`);
        gradient.addColorStop(0.5, `hsla(${hue}, 100%, 60%, 0.8)`);
        gradient.addColorStop(1, `hsla(${hue}, 100%, 50%, 0)`);

        // 绘制发光效果
        ctx.shadowColor = `hsl(${hue}, 100%, 50%)`;
        ctx.shadowBlur = 20;

        // 绘制条形
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 4);
        ctx.fill();

        // 绘制镜像
        const mirrorGradient = ctx.createLinearGradient(x, y + barHeight, x, height);
        mirrorGradient.addColorStop(0, `hsla(${hue}, 100%, 60%, 0.3)`);
        mirrorGradient.addColorStop(1, `hsla(${hue}, 100%, 50%, 0)`);

        ctx.fillStyle = mirrorGradient;
        ctx.beginPath();
        ctx.roundRect(x, y + barHeight + 4, barWidth, barHeight * 0.3, 4);
        ctx.fill();

        ctx.shadowBlur = 0;
      }

      // 绘制中心线
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [bars, intensity, speed]);

  return (
    <motion.div
      className={`relative w-full h-32 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ imageRendering: 'crisp-edges' }}
      />

      {/* 装饰性边框 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyber-primary" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyber-secondary" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyber-secondary" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyber-primary" />
      </div>
    </motion.div>
  );
};

export default CyberSpectrum;
