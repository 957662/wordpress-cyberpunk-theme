/**
 * 实时数据图表组件
 * CyberPress Platform
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface DataPoint {
  timestamp: number;
  value: number;
  label?: string;
}

interface RealTimeChartProps {
  data: DataPoint[];
  maxDataPoints?: number;
  updateInterval?: number;
  color?: string;
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  yAxisFormat?: (value: number) => string;
  xAxisFormat?: (timestamp: number) => string;
  onDataUpdate?: (data: DataPoint[]) => void;
  className?: string;
}

export const RealTimeChart: React.FC<RealTimeChartProps> = ({
  data: initialData,
  maxDataPoints = 20,
  updateInterval = 1000,
  color = '#00f0ff',
  height = 200,
  showGrid = true,
  showTooltip = true,
  yAxisFormat = (value) => value.toString(),
  xAxisFormat = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  },
  onDataUpdate,
  className = '',
}) => {
  const [data, setData] = useState<DataPoint[]>(initialData);
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // 更新数据
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) => {
        const lastPoint = prevData[prevData.length - 1];
        const newValue = lastPoint ? lastPoint.value + (Math.random() - 0.5) * 10 : 50;

        const newDataPoint: DataPoint = {
          timestamp: Date.now(),
          value: Math.max(0, Math.min(100, newValue)),
        };

        const newData = [...prevData, newDataPoint];

        // 限制数据点数量
        if (newData.length > maxDataPoints) {
          newData.shift();
        }

        if (onDataUpdate) {
          onDataUpdate(newData);
        }

        return newData;
      });
    }, updateInterval);

    return () => clearInterval(interval);
  }, [maxDataPoints, updateInterval, onDataUpdate]);

  // 绘制图表
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布尺寸
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = rect.width;
    const height = rect.height;
    const padding = { top: 20, right: 20, bottom: 30, left: 50 };

    // 清除画布
    ctx.clearRect(0, 0, width, height);

    // 计算数据范围
    const values = data.map((d) => d.value);
    const minValue = Math.min(...values, 0);
    const maxValue = Math.max(...values, 100);
    const valueRange = maxValue - minValue;

    // 坐标转换函数
    const xScale = (index: number) => {
      return padding.left + (index / (data.length - 1)) * (width - padding.left - padding.right);
    };

    const yScale = (value: number) => {
      return height - padding.bottom - ((value - minValue) / valueRange) * (height - padding.top - padding.bottom);
    };

    // 绘制网格
    if (showGrid) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;

      // 水平网格线
      for (let i = 0; i <= 5; i++) {
        const y = padding.top + (i / 5) * (height - padding.top - padding.bottom);
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();

        // Y轴标签
        const value = maxValue - (i / 5) * valueRange;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(yAxisFormat(value), padding.left - 10, y + 3);
      }

      // 垂直网格线
      const xStep = Math.max(1, Math.floor(data.length / 5));
      for (let i = 0; i < data.length; i += xStep) {
        const x = xScale(i);
        ctx.beginPath();
        ctx.moveTo(x, padding.top);
        ctx.lineTo(x, height - padding.bottom);
        ctx.stroke();

        // X轴标签
        if (data[i]) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.font = '10px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(xAxisFormat(data[i].timestamp), x, height - padding.bottom + 15);
        }
      }
    }

    // 绘制数据线
    if (data.length > 1) {
      // 创建渐变
      const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
      gradient.addColorStop(0, color + '40');
      gradient.addColorStop(1, color + '00');

      // 绘制填充区域
      ctx.beginPath();
      ctx.moveTo(xScale(0), height - padding.bottom);

      data.forEach((point, index) => {
        ctx.lineTo(xScale(index), yScale(point.value));
      });

      ctx.lineTo(xScale(data.length - 1), height - padding.bottom);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // 绘制线条
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      data.forEach((point, index) => {
        const x = xScale(index);
        const y = yScale(point.value);

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // 绘制数据点
      data.forEach((point, index) => {
        const x = xScale(index);
        const y = yScale(point.value);

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();

        // 高亮最后一个点
        if (index === data.length - 1) {
          ctx.beginPath();
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.arc(x, y, 6, 0, Math.PI * 2);
          ctx.stroke();
        }
      });
    }

    // 绘制鼠标悬停效果
    if (hoveredPoint && mousePosition) {
      const index = data.findIndex((d) => d.timestamp === hoveredPoint.timestamp);
      if (index !== -1) {
        const x = xScale(index);
        const y = yScale(hoveredPoint.value);

        // 绘制垂直线
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.moveTo(x, padding.top);
        ctx.lineTo(x, height - padding.bottom);
        ctx.stroke();
        ctx.setLineDash([]);

        // 绘制高亮点
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }, [data, color, showGrid, hoveredPoint, mousePosition, height, yAxisFormat, xAxisFormat]);

  // 处理鼠标移动
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!showTooltip) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const padding = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = rect.width;
    const chartWidth = width - padding.left - padding.right;

    // 找到最近的数据点
    if (x >= padding.left && x <= width - padding.right) {
      const index = Math.round(((x - padding.left) / chartWidth) * (data.length - 1));
      if (index >= 0 && index < data.length) {
        setHoveredPoint(data[index]);
        setMousePosition({ x, y });
      }
    } else {
      setHoveredPoint(null);
      setMousePosition(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
    setMousePosition(null);
  };

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        width={600}
        height={height}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full"
        style={{ height: `${height}px` }}
      />

      {/* Tooltip */}
      {showTooltip && hoveredPoint && mousePosition && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bg-cyber-dark/95 border border-cyber-cyan/30 rounded-lg px-3 py-2 pointer-events-none"
          style={{
            left: Math.min(mousePosition.x + 10, 500),
            top: mousePosition.y - 50,
          }}
        >
          <div className="text-xs text-cyber-cyan mb-1">
            {xAxisFormat(hoveredPoint.timestamp)}
          </div>
          <div className="text-lg font-bold text-white">
            {yAxisFormat(hoveredPoint.value)}
          </div>
        </motion.div>
      )}

      {/* 图例 */}
      <div className="flex items-center gap-2 mt-2">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="text-xs text-gray-400">实时数据</span>
      </div>
    </div>
  );
};

export default RealTimeChart;
