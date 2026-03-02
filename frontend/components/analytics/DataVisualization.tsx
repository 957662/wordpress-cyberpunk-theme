'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, BarChart3, PieChart, Activity, Zap } from 'lucide-react';

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface ChartProps {
  title?: string;
  data: DataPoint[];
  type?: 'bar' | 'line' | 'pie' | 'area';
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  animate?: boolean;
  className?: string;
}

export const DataVisualization: React.FC<ChartProps> = ({
  title,
  data,
  type = 'bar',
  height = 300,
  showGrid = true,
  showLegend = true,
  animate = true,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !animate) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;
    let progress = 0;

    const draw = () => {
      progress += 0.02;
      if (progress > 1) progress = 1;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const maxValue = Math.max(...data.map(d => d.value));
      const padding = 40;
      const chartWidth = canvas.width - padding * 2;
      const chartHeight = canvas.height - padding * 2;

      if (type === 'bar') {
        const barWidth = chartWidth / data.length;
        const gap = barWidth * 0.2;

        data.forEach((point, index) => {
          const x = padding + index * barWidth + gap / 2;
          const barHeight = (point.value / maxValue) * chartHeight * progress;
          const y = canvas.height - padding - barHeight;

          // Draw bar
          const gradient = ctx.createLinearGradient(x, y, x, canvas.height - padding);
          gradient.addColorStop(0, point.color || '#00f0ff');
          gradient.addColorStop(1, `${point.color || '#00f0ff'}33`);

          ctx.fillStyle = gradient;
          ctx.fillRect(x, y, barWidth - gap, barHeight);

          // Draw glow effect
          ctx.shadowColor = point.color || '#00f0ff';
          ctx.shadowBlur = 10;
          ctx.fillRect(x, y, barWidth - gap, barHeight);
          ctx.shadowBlur = 0;

          // Draw label
          ctx.fillStyle = '#9ca3af';
          ctx.font = '12px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(point.label, x + (barWidth - gap) / 2, canvas.height - padding + 20);

          // Draw value
          ctx.fillStyle = '#ffffff';
          ctx.fillText(
            point.value.toString(),
            x + (barWidth - gap) / 2,
            y - 10
          );
        });
      }

      if (progress < 1) {
        animationFrame = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [data, type, animate]);

  const calculateChange = () => {
    if (data.length < 2) return { value: 0, percentage: 0, trend: 'neutral' as const };
    const current = data[data.length - 1].value;
    const previous = data[data.length - 2].value;
    const change = current - previous;
    const percentage = previous > 0 ? (change / previous) * 100 : 0;
    const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';
    return { value: change, percentage, trend };
  };

  const { value: changeValue, percentage, trend } = calculateChange();
  const total = data.reduce((sum, point) => sum + point.value, 0);
  const average = total / data.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-dark-bg/50 border border-cyber-cyan/30 rounded-xl overflow-hidden ${className}`}
    >
      {/* Header */}
      {title && (
        <div className="bg-gradient-to-r from-dark-bg to-dark-bg/80 border-b border-cyber-cyan/30 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold">{title}</h3>
            <div className="flex items-center gap-2">
              {trend === 'up' && <TrendingUp className="w-5 h-5 text-green-400" />}
              {trend === 'down' && <TrendingDown className="w-5 h-5 text-red-400" />}
              <span className={`text-sm font-medium ${
                trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400'
              }`}>
                {trend !== 'neutral' && `${percentage > 0 ? '+' : ''}${percentage.toFixed(1)}%`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 p-4 border-b border-dark-border">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-cyber-cyan" />
            <span className="text-xs text-gray-400">总计</span>
          </div>
          <p className="text-2xl font-bold text-white">{total.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <BarChart3 className="w-4 h-4 text-cyber-purple" />
            <span className="text-xs text-gray-400">平均</span>
          </div>
          <p className="text-2xl font-bold text-white">{average.toFixed(1)}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-cyber-pink" />
            <span className="text-xs text-gray-400">峰值</span>
          </div>
          <p className="text-2xl font-bold text-white">{Math.max(...data.map(d => d.value))}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="p-4">
        <canvas
          ref={canvasRef}
          width={800}
          height={height}
          className="w-full"
          style={{ height: `${height}px` }}
        />
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="flex flex-wrap gap-3 px-4 pb-4">
          {data.map((point, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: point.color || '#00f0ff',
                  boxShadow: `0 0 10px ${point.color || '#00f0ff'}`
                }}
              />
              <span className="text-sm text-gray-400">{point.label}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

// Mini sparkline component
interface SparklineProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
  showArea?: boolean;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  color = '#00f0ff',
  width = 100,
  height = 30,
  showArea = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (data.length < 2) return;

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * canvas.width;
      const y = canvas.height - ((value - min) / range) * canvas.height;
      return { x, y };
    });

    // Draw area
    if (showArea) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, canvas.height);
      points.forEach(point => ctx.lineTo(point.x, point.y));
      ctx.lineTo(points[points.length - 1].x, canvas.height);
      ctx.closePath();

      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, `${color}66`);
      gradient.addColorStop(1, `${color}00`);
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    // Draw line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach(point => ctx.lineTo(point.x, point.y));
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw dots
    points.forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    });
  }, [data, color, showArea]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="w-full"
      style={{ height: `${height}px` }}
    />
  );
};

// Metric card component
interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  sparkline?: number[];
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon,
  color = 'cyan',
  sparkline,
  className = ''
}) => {
  const colors = {
    cyan: 'from-cyber-cyan/20 to-cyber-cyan/5 border-cyber-cyan/30',
    purple: 'from-cyber-purple/20 to-cyber-purple/5 border-cyber-purple/30',
    pink: 'from-cyber-pink/20 to-cyber-pink/5 border-cyber-pink/30',
    green: 'from-green-400/20 to-green-400/5 border-green-400/30'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`
        bg-gradient-to-br ${colors[color]} border rounded-xl p-4
        hover:shadow-lg transition-all duration-300
        ${className}
      `}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-xs text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>

      {change !== undefined && (
        <div className="flex items-center gap-2">
          {change > 0 ? (
            <TrendingUp className="w-4 h-4 text-green-400" />
          ) : change < 0 ? (
            <TrendingDown className="w-4 h-4 text-red-400" />
          ) : null}
          <span className={`text-sm font-medium ${
            change > 0 ? 'text-green-400' : change < 0 ? 'text-red-400' : 'text-gray-400'
          }`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
          <span className="text-xs text-gray-500">vs last period</span>
        </div>
      )}

      {sparkline && (
        <div className="mt-3">
          <Sparkline
            data={sparkline}
            color={color === 'cyan' ? '#00f0ff' : color === 'purple' ? '#9d00ff' : color === 'pink' ? '#ff0080' : '#4ade80'}
          />
        </div>
      )}
    </motion.div>
  );
};

export default DataVisualization;
