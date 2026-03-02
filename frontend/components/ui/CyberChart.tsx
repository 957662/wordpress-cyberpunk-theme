'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface CyberChartProps {
  data: ChartData[];
  type?: 'bar' | 'line' | 'pie' | 'area';
  title?: string;
  showLegend?: boolean;
  showGrid?: boolean;
  height?: number;
  animated?: boolean;
  className?: string;
}

/**
 * CyberChart - 赛博朋克风格图表组件
 *
 * 支持多种图表类型，带动画效果
 */
export function CyberChart({
  data,
  type = 'bar',
  title,
  showLegend = true,
  showGrid = true,
  height = 300,
  animated = true,
  className = '',
}: CyberChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置高清屏支持
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // 绘制图表
    drawChart(ctx, rect.width, height);

  }, [data, type, hoveredIndex]);

  const drawChart = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);

    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // 绘制网格
    if (showGrid) {
      drawGrid(ctx, padding, chartWidth, chartHeight);
    }

    // 根据类型绘制图表
    switch (type) {
      case 'bar':
        drawBarChart(ctx, padding, chartWidth, chartHeight);
        break;
      case 'line':
        drawLineChart(ctx, padding, chartWidth, chartHeight);
        break;
      case 'pie':
        drawPieChart(ctx, width, height);
        break;
      case 'area':
        drawAreaChart(ctx, padding, chartWidth, chartHeight);
        break;
    }
  };

  const drawGrid = (ctx: CanvasRenderingContext2D, padding: number, width: number, height: number) => {
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.1)';
    ctx.lineWidth = 1;

    // 水平线
    for (let i = 0; i <= 5; i++) {
      const y = padding + (height / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + width, y);
      ctx.stroke();
    }

    // 垂直线
    for (let i = 0; i <= data.length; i++) {
      const x = padding + (width / data.length) * i;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, padding + height);
      ctx.stroke();
    }
  };

  const drawBarChart = (ctx: CanvasRenderingContext2D, padding: number, width: number, height: number) => {
    const maxValue = Math.max(...data.map((d) => d.value));
    const barWidth = (width / data.length) * 0.6;
    const gap = (width / data.length) * 0.4;

    data.forEach((item, index) => {
      const x = padding + (width / data.length) * index + gap / 2;
      const barHeight = (item.value / maxValue) * height;
      const y = padding + height - barHeight;

      // 绘制柱状图
      const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
      const color = item.color || '#00f0ff';
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, `${color}33`);

      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);

      // 高亮效果
      if (index === hoveredIndex) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, barWidth, barHeight);
      }

      // 绘制标签
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(item.label, x + barWidth / 2, padding + height + 20);

      // 绘制数值
      ctx.fillText(item.value.toString(), x + barWidth / 2, y - 10);
    });
  };

  const drawLineChart = (ctx: CanvasRenderingContext2D, padding: number, width: number, height: number) => {
    const maxValue = Math.max(...data.map((d) => d.value));
    const points = data.map((item, index) => ({
      x: padding + (width / (data.length - 1)) * index,
      y: padding + height - (item.value / maxValue) * height,
    }));

    // 绘制填充区域
    ctx.beginPath();
    ctx.moveTo(points[0].x, padding + height);
    points.forEach((point) => ctx.lineTo(point.x, point.y));
    ctx.lineTo(points[points.length - 1].x, padding + height);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(0, padding, 0, padding + height);
    gradient.addColorStop(0, 'rgba(0, 240, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 240, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fill();

    // 绘制线条
    ctx.beginPath();
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2;
    points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.stroke();

    // 绘制点
    points.forEach((point, index) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = index === hoveredIndex ? '#ffffff' : '#00f0ff';
      ctx.fill();
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 标签
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(data[index].label, point.x, padding + height + 20);
    });
  };

  const drawPieChart = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 40;
    const total = data.reduce((sum, item) => sum + item.value, 0);

    let currentAngle = -Math.PI / 2;

    data.forEach((item, index) => {
      const sliceAngle = (item.value / total) * Math.PI * 2;
      const endAngle = currentAngle + sliceAngle;

      // 绘制扇形
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, index === hoveredIndex ? radius * 1.05 : radius, currentAngle, endAngle);
      ctx.closePath();

      const color = item.color || `hsl(${(index * 360) / data.length}, 70%, 50%)`;
      ctx.fillStyle = color;
      ctx.fill();

      ctx.strokeStyle = '#0a0a0f';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 绘制标签
      const midAngle = currentAngle + sliceAngle / 2;
      const labelRadius = radius * 0.7;
      const labelX = centerX + Math.cos(midAngle) * labelRadius;
      const labelY = centerY + Math.sin(midAngle) * labelRadius;

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${item.label}`, labelX, labelY);
      ctx.font = '10px sans-serif';
      ctx.fillText(`${Math.round((item.value / total) * 100)}%`, labelX, labelY + 12);

      currentAngle = endAngle;
    });
  };

  const drawAreaChart = (ctx: CanvasRenderingContext2D, padding: number, width: number, height: number) => {
    const maxValue = Math.max(...data.map((d) => d.value));
    const points = data.map((item, index) => ({
      x: padding + (width / (data.length - 1)) * index,
      y: padding + height - (item.value / maxValue) * height,
    }));

    // 绘制填充区域
    ctx.beginPath();
    ctx.moveTo(points[0].x, padding + height);
    points.forEach((point) => ctx.lineTo(point.x, point.y));
    ctx.lineTo(points[points.length - 1].x, padding + height);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(0, padding, 0, padding + height);
    gradient.addColorStop(0, 'rgba(157, 0, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(157, 0, 255, 0.1)');
    ctx.fillStyle = gradient;
    ctx.fill();

    // 绘制线条
    ctx.beginPath();
    ctx.strokeStyle = '#9d00ff';
    ctx.lineWidth = 3;
    points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.stroke();

    // 绘制点和标签
    points.forEach((point, index) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = index === hoveredIndex ? '#ffffff' : '#9d00ff';
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(data[index].label, point.x, padding + height + 20);
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const padding = 40;
    const chartWidth = rect.width - padding * 2;

    // 计算悬停的数据点
    if (type === 'pie') {
      const centerX = rect.width / 2;
      const centerY = height / 2;
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const radius = Math.min(rect.width, height) / 2 - 40;

      if (distance <= radius) {
        let angle = Math.atan2(dy, dx);
        if (angle < -Math.PI / 2) angle += Math.PI * 2;
        angle += Math.PI / 2;

        const total = data.reduce((sum, item) => sum + item.value, 0);
        let currentAngle = 0;

        for (let i = 0; i < data.length; i++) {
          const sliceAngle = (data[i].value / total) * Math.PI * 2;
          if (angle >= currentAngle && angle < currentAngle + sliceAngle) {
            setHoveredIndex(i);
            return;
          }
          currentAngle += sliceAngle;
        }
      }
      setHoveredIndex(null);
    } else {
      const segmentWidth = chartWidth / data.length;
      const index = Math.floor((x - padding) / segmentWidth);

      if (index >= 0 && index < data.length) {
        setHoveredIndex(index);
      } else {
        setHoveredIndex(null);
      }
    }
  };

  return (
    <div className={className}>
      {title && (
        <motion.h3
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg font-semibold text-white mb-4"
        >
          {title}
        </motion.h3>
      )}
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredIndex(null)}
        style={{ width: '100%', height: `${height}px` }}
        className="cursor-crosshair"
      />
      {showLegend && (
        <div className="flex flex-wrap gap-4 mt-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: item.color || `hsl(${(index * 360) / data.length}, 70%, 50%)` }}
              />
              <span className="text-sm text-gray-300">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CyberChart;
