'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface CyberDataChartProps {
  data: DataPoint[];
  type?: 'bar' | 'line' | 'area' | 'pie';
  title?: string;
  description?: string;
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  animated?: boolean;
  theme?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
  onDataPointClick?: (point: DataPoint) => void;
  className?: string;
}

const themeColors = {
  cyan: ['#00f0ff', '#00c8d4', '#00a0a8', '#007870', '#005038'],
  purple: ['#9d00ff', '#8300d4', '#6900a8', '#4f007c', '#350050'],
  pink: ['#ff0080', '#d4006a', '#aa0054', '#80003e', '#560028'],
  green: ['#00ff88', '#00d470', '#00a858', '#007c40', '#005028'],
  yellow: ['#f0ff00', '#c8d400', '#a0a800', '#787c00', '#505000'],
};

export function CyberDataChart({
  data,
  type = 'bar',
  title,
  description,
  height = 300,
  showGrid = true,
  showTooltip = true,
  showLegend = true,
  animated = true,
  theme = 'cyan',
  onDataPointClick,
  className = '',
}: CyberDataChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipData, setTooltipData] = useState<DataPoint | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const colors = themeColors[theme];

  useEffect(() => {
    if (!canvasRef.current || type === 'bar') return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Setup
    const padding = 60;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const maxValue = Math.max(...data.map((d) => d.value));

    if (type === 'line' || type === 'area') {
      // Draw line chart
      ctx.beginPath();
      ctx.strokeStyle = colors[0];
      ctx.lineWidth = 3;

      data.forEach((point, index) => {
        const x = padding + (index / (data.length - 1)) * chartWidth;
        const y = canvas.height - padding - (point.value / maxValue) * chartHeight;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // Fill area for area chart
      if (type === 'area') {
        ctx.lineTo(padding + chartWidth, canvas.height - padding);
        ctx.lineTo(padding, canvas.height - padding);
        ctx.closePath();
        ctx.fillStyle = `${colors[0]}20`;
        ctx.fill();
      }

      // Draw points
      data.forEach((point, index) => {
        const x = padding + (index / (data.length - 1)) * chartWidth;
        const y = canvas.height - padding - (point.value / maxValue) * chartHeight;

        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = colors[index % colors.length];
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    } else if (type === 'pie') {
      // Draw pie chart
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) - padding;
      const total = data.reduce((sum, point) => sum + point.value, 0);

      let startAngle = -Math.PI / 2;

      data.forEach((point, index) => {
        const sliceAngle = (point.value / total) * Math.PI * 2;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        ctx.closePath();

        ctx.fillStyle = point.color || colors[index % colors.length];
        ctx.fill();
        ctx.strokeStyle = '#0a0a0f';
        ctx.lineWidth = 2;
        ctx.stroke();

        startAngle += sliceAngle;
      });
    }
  }, [data, type, colors]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setTooltipPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setTooltipData(data[index]);
    }
    setHoveredPoint(index);
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
    setTooltipData(null);
  };

  const calculatePercentage = (value: number) => {
    const total = data.reduce((sum, point) => sum + point.value, 0);
    return ((value / total) * 100).toFixed(1);
  };

  const calculateTrend = (value: number, index: number) => {
    if (index === 0) return 'neutral';
    const previousValue = data[index - 1].value;
    if (value > previousValue) return 'up';
    if (value < previousValue) return 'down';
    return 'neutral';
  };

  return (
    <div className={`bg-cyber-dark/50 border rounded-lg p-6 ${className}`} style={{ borderColor: `${colors[0]}40` }}>
      {/* Header */}
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-xl font-bold mb-2" style={{ color: colors[0], textShadow: `0 0 10px ${colors[0]}60` }}>
              {title}
            </h3>
          )}
          {description && <p className="text-gray-400 text-sm">{description}</p>}
        </div>
      )}

      {/* Chart */}
      <div
        ref={containerRef}
        className="relative"
        style={{ height: `${height}px` }}
        onMouseLeave={handleMouseLeave}
      >
        {type === 'bar' && (
          <div className="absolute inset-0 flex items-end justify-around gap-4 px-8 pb-8">
            {data.map((point, index) => (
              <motion.div
                key={index}
                className="relative flex-1 max-w-16 group cursor-pointer"
                initial={{ height: 0 }}
                animate={{ height: animated ? `${(point.value / Math.max(...data.map((d) => d.value))) * 100}%` : `${(point.value / Math.max(...data.map((d) => d.value))) * 100}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                style={{
                  backgroundColor: point.color || colors[index % colors.length],
                  boxShadow: `0 0 20px ${point.color || colors[index % colors.length]}60`,
                  borderRadius: '8px 8px 0 0',
                }}
                onMouseMove={(e) => handleMouseMove(e, index)}
                onMouseLeave={handleMouseLeave}
                onClick={() => onDataPointClick?.(point)}
                whileHover={{ scale: 1.05 }}
              >
                {/* Trend Indicator */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex items-center gap-1">
                  {calculateTrend(point.value, index) === 'up' && (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  )}
                  {calculateTrend(point.value, index) === 'down' && (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                  {calculateTrend(point.value, index) === 'neutral' && (
                    <Minus className="w-4 h-4 text-gray-400" />
                  )}
                </div>

                {/* Value Label */}
                <motion.div
                  className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm font-bold whitespace-nowrap"
                  style={{ color: point.color || colors[index % colors.length] }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  {point.value}
                </motion.div>
              </motion.div>
            ))}
          </div>
        )}

        {(type === 'line' || type === 'area') && (
          <canvas
            ref={canvasRef}
            width={containerRef.current?.offsetWidth || 600}
            height={height}
            className="absolute inset-0"
          />
        )}

        {type === 'pie' && (
          <canvas
            ref={canvasRef}
            width={containerRef.current?.offsetWidth || 600}
            height={height}
            className="absolute inset-0"
          />
        )}

        {/* Grid */}
        {showGrid && type === 'bar' && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="absolute left-0 right-0 border-t border-dashed"
                style={{
                  top: `${(index / 5) * 100}%`,
                  borderColor: `${colors[0]}20`,
                }}
              />
            ))}
          </div>
        )}

        {/* Tooltip */}
        {showTooltip && hoveredPoint !== null && tooltipData && (
          <motion.div
            className="absolute z-10 px-4 py-2 rounded-lg shadow-lg pointer-events-none"
            style={{
              left: tooltipPosition.x + 10,
              top: tooltipPosition.y - 10,
              backgroundColor: `${colors[0]}20`,
              border: `1px solid ${colors[0]}`,
              backdropFilter: 'blur(10px)',
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className="text-sm font-semibold mb-1" style={{ color: colors[0] }}>
              {tooltipData.label}
            </div>
            <div className="text-lg font-bold" style={{ color: colors[0] }}>
              {tooltipData.value}
            </div>
            <div className="text-xs text-gray-400">
              {calculatePercentage(tooltipData.value)}%
            </div>
          </motion.div>
        )}
      </div>

      {/* Legend */}
      {showLegend && type !== 'bar' && (
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          {data.map((point, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <div
                className="w-4 h-4 rounded"
                style={{
                  backgroundColor: point.color || colors[index % colors.length],
                  boxShadow: `0 0 10px ${point.color || colors[index % colors.length]}60`,
                }}
              />
              <span className="text-sm text-gray-300">{point.label}</span>
              <span className="text-sm font-semibold" style={{ color: colors[0] }}>
                {point.value}
              </span>
            </motion.div>
          ))}
        </div>
      )}

      {/* X-axis Labels */}
      {type === 'bar' && (
        <div className="mt-4 flex justify-around px-8">
          {data.map((point, index) => (
            <div
              key={index}
              className="text-xs text-gray-400 text-center max-w-16 truncate"
              title={point.label}
            >
              {point.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CyberDataChart;
