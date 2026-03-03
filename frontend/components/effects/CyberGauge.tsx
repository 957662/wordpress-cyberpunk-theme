/**
 * 赛博朋克仪表盘组件
 * 用于显示统计数据、进度等
 */

'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export interface CyberGaugeProps {
  value: number;
  max?: number;
  label?: string;
  unit?: string;
  color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  animate?: boolean;
  className?: string;
}

const colorMap = {
  cyan: { primary: '#00f0ff', secondary: 'rgba(0, 240, 255, 0.2)' },
  purple: { primary: '#9d00ff', secondary: 'rgba(157, 0, 255, 0.2)' },
  pink: { primary: '#ff0080', secondary: 'rgba(255, 0, 128, 0.2)' },
  yellow: { primary: '#f0ff00', secondary: 'rgba(240, 255, 0, 0.2)' },
  green: { primary: '#00ff88', secondary: 'rgba(0, 255, 136, 0.2)' },
};

const sizeMap = {
  sm: { width: 120, height: 80, strokeWidth: 8 },
  md: { width: 160, height: 100, strokeWidth: 10 },
  lg: { width: 200, height: 120, strokeWidth: 12 },
};

export function CyberGauge({
  value,
  max = 100,
  label,
  unit,
  color = 'cyan',
  size = 'md',
  showValue = true,
  animate = true,
  className,
}: CyberGaugeProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const { width, height, strokeWidth } = sizeMap[size];
  const colors = colorMap[color];

  const percentage = Math.min((value / max) * 100, 100);
  const radius = (width - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius * 0.75; // 270度
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  useEffect(() => {
    if (!animate) {
      setDisplayValue(value);
      return;
    }

    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    const stepDuration = duration / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(current);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [value, animate]);

  return (
    <div className={cn('relative', className)}>
      <svg width={width} height={height} className="transform -scale-x-100">
        {/* 背景轨道 */}
        <path
          d={`M ${strokeWidth / 2} ${height - strokeWidth / 2} A ${radius} ${radius} 0 1 1 ${width - strokeWidth / 2} ${height - strokeWidth / 2}`}
          fill="none"
          stroke={colors.secondary}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.25}
        />

        {/* 进度条 */}
        <motion.path
          d={`M ${strokeWidth / 2} ${height - strokeWidth / 2} A ${radius} ${radius} 0 1 1 ${width - strokeWidth / 2} ${height - strokeWidth / 2}`}
          fill="none"
          stroke={colors.primary}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.25}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * 0.25 + strokeDashoffset * 0.75 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{
            filter: `drop-shadow(0 0 8px ${colors.primary})`,
          }}
        />

        {/* 刻度线 */}
        {[0, 25, 50, 75, 100].map((tick) => {
          const angle = (tick / 100) * 270 - 135;
          const radian = (angle * Math.PI) / 180;
          const x1 = width / 2 + (radius - strokeWidth) * Math.cos(radian);
          const y1 = height - strokeWidth / 2 + (radius - strokeWidth) * Math.sin(radian);
          const x2 = width / 2 + (radius + strokeWidth) * Math.cos(radian);
          const y2 = height - strokeWidth / 2 + (radius + strokeWidth) * Math.sin(radian);

          return (
            <line
              key={tick}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={colors.primary}
              strokeWidth={2}
              opacity={tick <= percentage ? 1 : 0.3}
            />
          );
        })}
      </svg>

      {/* 中心内容 */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ paddingTop: height * 0.3 }}
      >
        {showValue && (
          <>
            <motion.div
              className="text-3xl font-display font-bold"
              style={{ color: colors.primary }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {Math.round(displayValue)}
              {unit}
            </motion.div>
            {label && (
              <div className="text-xs text-gray-500 mt-1">{label}</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CyberGauge;
