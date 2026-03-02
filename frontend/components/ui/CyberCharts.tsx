/**
 * 赛博朋克风格数据可视化组件
 * 霓虹发光效果的图表组件
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// 柱状图
export interface CyberBarChartProps {
  data: Array<{ label: string; value: number; color?: 'cyan' | 'purple' | 'pink' | 'green' }>;
  height?: number;
  showLabels?: boolean;
  showValues?: boolean;
  className?: string;
}

export function CyberBarChart({
  data,
  height = 200,
  showLabels = true,
  showValues = true,
  className,
}: CyberBarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));

  const colors = {
    cyan: 'bg-cyber-cyan shadow-[0_0_10px_rgba(0,240,255,0.5)]',
    purple: 'bg-cyber-purple shadow-[0_0_10px_rgba(157,0,255,0.5)]',
    pink: 'bg-cyber-pink shadow-[0_0_10px_rgba(255,0,128,0.5)]',
    green: 'bg-cyber-green shadow-[0_0_10px_rgba(0,255,136,0.5)]',
  };

  return (
    <div className={cn('cyber-card p-6', className)}>
      <div className="flex items-end gap-2" style={{ height: `${height}px` }}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * (height - 30);
          const colorClass = colors[item.color || 'cyan'];

          return (
            <motion.div
              key={item.label}
              className="flex-1 flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {showValues && (
                <span className="text-xs font-mono text-white">{item.value}</span>
              )}

              <div className="relative w-full flex-1 flex items-end">
                <motion.div
                  className={cn('w-full rounded-t', colorClass)}
                  initial={{ height: 0 }}
                  animate={{ height: `${barHeight}px` }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                />
              </div>

              {showLabels && (
                <span className="text-xs text-gray-400 truncate w-full text-center">
                  {item.label}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// 折线图
export interface CyberLineChartProps {
  data: Array<{ label: string; value: number }>;
  height?: number;
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  showDots?: boolean;
  showArea?: boolean;
  className?: string;
}

export function CyberLineChart({
  data,
  height = 200,
  color = 'cyan',
  showDots = true,
  showArea = true,
  className,
}: CyberLineChartProps) {
  const colors = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    green: '#00ff88',
  };

  const lineColor = colors[color];
  const maxValue = Math.max(...data.map((d) => d.value));
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - (d.value / maxValue) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className={cn('cyber-card p-6', className)}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full"
        style={{ height: `${height}px` }}
      >
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
          </linearGradient>
        </defs>

        {showArea && (
          <motion.path
            d={`M 0,100 L ${points} L 100,100 Z`}
            fill={`url(#gradient-${color})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
        )}

        <motion.path
          d={`M ${points}`}
          fill="none"
          stroke={lineColor}
          strokeWidth="0.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: `drop-shadow(0 0 3px ${lineColor})` }}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1 }}
        />

        {showDots &&
          data.map((d, i) => {
            const x = (i / (data.length - 1)) * 100;
            const y = 100 - (d.value / maxValue) * 100;

            return (
              <motion.circle
                key={i}
                cx={x}
                cy={y}
                r="1.5"
                fill={lineColor}
                style={{ filter: `drop-shadow(0 0 2px ${lineColor})` }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
              />
            );
          })}
      </svg>

      <div className="flex justify-between mt-2 text-xs text-gray-500">
        {data.map((d, i) => (
          <span key={i} className={i % Math.ceil(data.length / 5) === 0 ? '' : 'hidden'}>
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// 饼图
export interface CyberPieChartProps {
  data: Array<{ label: string; value: number; color: 'cyan' | 'purple' | 'pink' | 'green' }>;
  size?: number;
  showLabels?: boolean;
  showPercentage?: boolean;
  className?: string;
}

export function CyberPieChart({
  data,
  size = 200,
  showLabels = true,
  showPercentage = true,
  className,
}: CyberPieChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let currentAngle = 0;

  const colors = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    green: '#00ff88',
  };

  const getSlicePath = (startAngle: number, endAngle: number, radius: number) => {
    const x1 = 50 + radius * 50 * Math.cos((startAngle * Math.PI) / 180);
    const y1 = 50 + radius * 50 * Math.sin((startAngle * Math.PI) / 180);
    const x2 = 50 + radius * 50 * Math.cos((endAngle * Math.PI) / 180);
    const y2 = 50 + radius * 50 * Math.sin((endAngle * Math.PI) / 180);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `M 50,50 L ${x1},${y1} A ${radius * 50},${radius * 50} 0 ${largeArc},1 ${x2},${y2} Z`;
  };

  return (
    <div className={cn('cyber-card p-6', className)}>
      <div className="flex flex-col md:flex-row items-center gap-8">
        <svg
          viewBox="0 0 100 100"
          className="flex-shrink-0"
          style={{ width: size, height: size }}
        >
          {data.map((item, index) => {
            const angle = (item.value / total) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            currentAngle += angle;

            const path = getSlicePath(startAngle, endAngle, 0.8);
            const color = colors[item.color];

            return (
              <motion.g
                key={item.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                style={{ transformOrigin: 'center' }}
              >
                <path
                  d={path}
                  fill={color}
                  stroke="#0a0a0f"
                  strokeWidth="0.5"
                  style={{ filter: `drop-shadow(0 0 5px ${color})` }}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
              </motion.g>
            );
          })}
        </svg>

        {showLabels && (
          <div className="space-y-3">
            {data.map((item) => {
              const percentage = ((item.value / total) * 100).toFixed(1);
              const color = colors[item.color];

              return (
                <div key={item.label} className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{
                      backgroundColor: color,
                      boxShadow: `0 0 10px ${color}`,
                    }}
                  />
                  <div className="flex-1">
                    <div className="text-white text-sm">{item.label}</div>
                    <div className="text-gray-500 text-xs">{item.value}</div>
                  </div>
                  {showPercentage && (
                    <div className="text-sm font-mono font-bold" style={{ color }}>
                      {percentage}%
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// 仪表盘
export interface CyberGaugeProps {
  value: number;
  min?: number;
  max?: number;
  label?: string;
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  size?: number;
  showValue?: boolean;
  className?: string;
}

export function CyberGauge({
  value,
  min = 0,
  max = 100,
  label,
  color = 'cyan',
  size = 200,
  showValue = true,
  className,
}: CyberGaugeProps) {
  const colors = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    green: '#00ff88',
  };

  const gaugeColor = colors[color];
  const percentage = ((value - min) / (max - min)) * 100;
  const angle = (percentage / 100) * 180;

  return (
    <div className={cn('cyber-card p-6 flex flex-col items-center', className)}>
      <svg viewBox="0 0 100 60" style={{ width: size, height: size * 0.6 }}>
        <defs>
          <linearGradient id={`gauge-gradient-${color}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={gaugeColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={gaugeColor} stopOpacity="1" />
          </linearGradient>
        </defs>

        <path
          d="M 10,50 A 40,40 0 0,1 90,50"
          fill="none"
          stroke="#1a1a2e"
          strokeWidth="8"
          strokeLinecap="round"
        />

        <motion.path
          d={`M 10,50 A 40,40 0 ${angle > 90 ? 1 : 0},1 ${10 + 40 * (1 - Math.cos((angle * Math.PI) / 180))},${50 - 40 * Math.sin((angle * Math.PI) / 180)}`}
          fill="none"
          stroke={`url(#gauge-gradient-${color})`}
          strokeWidth="8"
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 5px ${gaugeColor})` }}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1 }}
        />

        {[0, 25, 50, 75, 100].map((tick) => {
          const tickAngle = (tick / 100) * 180;
          const x1 = 50 + 30 * Math.cos((tickAngle * Math.PI) / 180);
          const y1 = 50 - 30 * Math.sin((tickAngle * Math.PI) / 180);
          const x2 = 50 + 35 * Math.cos((tickAngle * Math.PI) / 180);
          const y2 = 50 - 35 * Math.sin((tickAngle * Math.PI) / 180);

          return (
            <line
              key={tick}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#4a4a6a"
              strokeWidth="1"
            />
          );
        })}
      </svg>

      <div className="text-center -mt-8">
        {showValue && (
          <div
            className="text-4xl font-bold font-mono"
            style={{
              color: gaugeColor,
              textShadow: `0 0 20px ${gaugeColor}`,
            }}
          >
            {value}
          </div>
        )}
        {label && <div className="text-sm text-gray-400 mt-1">{label}</div>}
      </div>
    </div>
  );
}
