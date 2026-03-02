/**
 * 实时图表组件
 * 支持动态数据更新、多种图表类型、自定义主题
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import {
  Line,
  Bar,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap
} from 'lucide-react';

export interface DataPoint {
  timestamp: number;
  value: number;
  label?: string;
}

export interface RealTimeChartProps {
  data?: DataPoint[];
  type?: 'line' | 'bar' | 'area';
  title?: string;
  height?: number;
  maxDataPoints?: number;
  updateInterval?: number;
  showStats?: boolean;
  showGrid?: boolean;
  color?: string;
  className?: string;
  onDataUpdate?: (data: DataPoint[]) => void;
}

export function RealTimeChart({
  data: initialData = [],
  type = 'line',
  title,
  height = 300,
  maxDataPoints = 50,
  updateInterval,
  showStats = true,
  showGrid = true,
  color = '#06b6d4',
  className,
  onDataUpdate
}: RealTimeChartProps) {
  const [data, setData] = useState<DataPoint[]>(initialData);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // 添加新数据点
  const addDataPoint = (point: DataPoint) => {
    setData(prevData => {
      const newData = [...prevData, point];
      if (newData.length > maxDataPoints) {
        newData.shift();
      }
      return newData;
    });
  };

  // 模拟实时数据
  useEffect(() => {
    if (updateInterval) {
      const interval = setInterval(() => {
        const newPoint: DataPoint = {
          timestamp: Date.now(),
          value: Math.random() * 100,
          label: new Date().toLocaleTimeString()
        };
        addDataPoint(newPoint);
      }, updateInterval);

      return () => clearInterval(interval);
    }
  }, [updateInterval, maxDataPoints]);

  // 通知数据更新
  useEffect(() => {
    if (onDataUpdate) {
      onDataUpdate(data);
    }
  }, [data, onDataUpdate]);

  // 绘制图表
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    const padding = 40;

    // 清空画布
    ctx.clearRect(0, 0, width, height);

    // 计算数据范围
    const values = data.map(d => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue || 1;

    // 绘制网格
    if (showGrid) {
      ctx.strokeStyle = 'rgba(75, 85, 99, 0.2)';
      ctx.lineWidth = 1;

      // 水平网格线
      for (let i = 0; i <= 5; i++) {
        const y = padding + (height - 2 * padding) * (i / 5);
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
      }

      // 垂直网格线
      const xStep = (width - 2 * padding) / (data.length - 1 || 1);
      for (let i = 0; i < data.length; i += 5) {
        const x = padding + i * xStep;
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, height - padding);
        ctx.stroke();
      }
    }

    // 绘制数据
    const xStep = (width - 2 * padding) / (data.length - 1 || 1);

    if (type === 'line' || type === 'area') {
      // 绘制线条
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;

      data.forEach((point, index) => {
        const x = padding + index * xStep;
        const y =
          height -
          padding -
          ((point.value - minValue) / range) * (height - 2 * padding);

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // 绘制填充区域
      if (type === 'area') {
        ctx.lineTo(padding + (data.length - 1) * xStep, height - padding);
        ctx.lineTo(padding, height - padding);
        ctx.closePath();
        ctx.fillStyle = `${color}20`;
        ctx.fill();
      }

      // 绘制数据点
      data.forEach((point, index) => {
        const x = padding + index * xStep;
        const y =
          height -
          padding -
          ((point.value - minValue) / range) * (height - 2 * padding);

        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      });
    } else if (type === 'bar') {
      const barWidth = xStep * 0.8;

      data.forEach((point, index) => {
        const x = padding + index * xStep;
        const barHeight =
          ((point.value - minValue) / range) * (height - 2 * padding);
        const y = height - padding - barHeight;

        ctx.fillStyle = color;
        ctx.fillRect(x - barWidth / 2, y, barWidth, barHeight);
      });
    }

    // 绘制Y轴标签
    ctx.fillStyle = '#9ca3af';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';

    for (let i = 0; i <= 5; i++) {
      const value = minValue + (range * i) / 5;
      const y = padding + (height - 2 * padding) * (i / 5);
      ctx.fillText(value.toFixed(1), padding - 10, y + 4);
    }
  }, [data, type, color, showGrid]);

  // 计算统计数据
  const stats = React.useMemo(() => {
    if (data.length === 0) return null;

    const values = data.map(d => d.value);
    const current = values[values.length - 1];
    const previous = values[values.length - 2] || current;
    const change = ((current - previous) / (previous || 1)) * 100;
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);

    return { current, change, avg, max, min };
  }, [data]);

  return (
    <Card className={cn('p-4', className)}>
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-cyber-cyan">{title}</h3>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyber-cyan animate-pulse" />
          </div>
        </div>
      )}

      {showStats && stats && (
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div>
            <div className="text-xs text-cyber-muted">当前值</div>
            <div className="text-lg font-bold text-cyber-cyan">
              {stats.current.toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-xs text-cyber-muted">变化</div>
            <div className="flex items-center gap-1">
              {stats.change >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span
                className={cn(
                  'text-lg font-bold',
                  stats.change >= 0 ? 'text-green-500' : 'text-red-500'
                )}
              >
                {Math.abs(stats.change).toFixed(1)}%
              </span>
            </div>
          </div>
          <div>
            <div className="text-xs text-cyber-muted">平均</div>
            <div className="text-lg font-bold text-cyber-purple">
              {stats.avg.toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-xs text-cyber-muted">范围</div>
            <div className="text-sm font-bold text-cyber-pink">
              {stats.min.toFixed(1)} - {stats.max.toFixed(1)}
            </div>
          </div>
        </div>
      )}

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={600}
          height={height}
          className="w-full"
        />
      </div>

      {/* 图例 */}
      <div className="flex items-center justify-center gap-6 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-cyber-muted">数据</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-3 h-3 text-cyber-cyan" />
          <span className="text-cyber-muted">实时更新</span>
        </div>
      </div>
    </Card>
  );
}
