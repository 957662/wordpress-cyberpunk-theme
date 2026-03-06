/**
 * GaugeChart - 仪表盘图组件
 * 赛博朋克风格的仪表盘
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

export interface GaugeChartProps {
  value: number;
  min?: number;
  max?: number;
  color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  size?: number;
  showValue?: boolean;
  label?: string;
  thresholds?: Array<{ value: number; color: string }>;
  className?: string;
}

export function GaugeChart({
  value,
  min = 0,
  max = 100,
  color = 'cyan',
  size = 200,
  showValue = true,
  label,
  thresholds,
  className,
}: GaugeChartProps) {
  const colors = {
    cyan: {
      stroke: '#00f0ff',
      glow: 'shadow-neon-cyan',
    },
    purple: {
      stroke: '#9d00ff',
      glow: 'shadow-neon-purple',
    },
    pink: {
      stroke: '#ff0080',
      glow: 'shadow-neon-pink',
    },
    yellow: {
      stroke: '#f0ff00',
      glow: 'shadow-neon-yellow',
    },
    green: {
      stroke: '#00ff88',
      glow: 'shadow-[0_0_10px_#00ff88]',
    },
  };

  const config = colors[color];
  const percentage = ((value - min) / (max - min)) * 100;

  // 使用阈值或默认颜色
  const getColor = (value: number) => {
    if (thresholds) {
      for (const threshold of thresholds) {
        if (value >= threshold.value) {
          return threshold.color;
        }
      }
    }
    return config.stroke;
  };

  const currentColor = getColor(value);

  // SVG 参数
  const centerX = 50;
  const centerY = 50;
  const radius = 40;
  const startAngle = -180;
  const endAngle = 0;
  const totalAngle = endAngle - startAngle;

  // 背景圆弧
  const startAngleRad = ((startAngle - 90) * Math.PI) / 180;
  const endAngleRad = ((endAngle - 90) * Math.PI) / 180;

  const bgStartX = centerX + radius * Math.cos(startAngleRad);
  const bgStartY = centerY + radius * Math.sin(startAngleRad);
  const bgEndX = centerX + radius * Math.cos(endAngleRad);
  const bgEndY = centerY + radius * Math.sin(endAngleRad);

  const bgPath = `M ${bgStartX} ${bgStartY} A ${radius} ${radius} 0 1 1 ${bgEndX} ${bgEndY}`;

  // 值圆弧
  const valueAngle = startAngle + (percentage / 100) * totalAngle;
  const valueAngleRad = ((valueAngle - 90) * Math.PI) / 180;

  const valueEndX = centerX + radius * Math.cos(valueAngleRad);
  const valueEndY = centerY + radius * Math.sin(valueAngleRad);

  const largeArc = percentage > 50 ? 1 : 0;
  const valuePath = `M ${bgStartX} ${bgStartY} A ${radius} ${radius} 0 ${largeArc} 1 ${valueEndX} ${valueEndY}`;

  return (
    <div className={cn('relative', className)} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* 背景圆弧 */}
        <path
          d={bgPath}
          fill="none"
          stroke="#2a2a4a"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* 值圆弧 */}
        <motion.path
          d={valuePath}
          fill="none"
          stroke={currentColor}
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            filter: `drop-shadow(0 0 6px ${currentColor})`,
          }}
        />

        {/* 刻度 */}
        {[0, 25, 50, 75, 100].map((tick) => {
          const tickAngle = startAngle + (tick / 100) * totalAngle;
          const tickAngleRad = ((tickAngle - 90) * Math.PI) / 180;
          const innerRadius = radius - 8;
          const outerRadius = radius - 4;

          const x1 = centerX + innerRadius * Math.cos(tickAngleRad);
          const y1 = centerY + innerRadius * Math.sin(tickAngleRad);
          const x2 = centerX + outerRadius * Math.cos(tickAngleRad);
          const y2 = centerY + outerRadius * Math.sin(tickAngleRad);

          return (
            <line
              key={tick}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#4a4a6a"
              strokeWidth="0.5"
            />
          );
        })}
      </svg>

      {/* 中心内容 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showValue && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center"
          >
            <div
              className="text-4xl font-bold font-display"
              style={{ color: currentColor }}
            >
              {value}
            </div>
            {label && (
              <div className="text-xs text-gray-500 mt-1">{label}</div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
