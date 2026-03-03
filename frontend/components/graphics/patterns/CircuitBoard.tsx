'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CircuitBoardProps {
  lineColor?: string;
  nodeColor?: string;
  density?: 'low' | 'medium' | 'high';
  animated?: boolean;
  className?: string;
}

export const CircuitBoard: React.FC<CircuitBoardProps> = ({
  lineColor = '#06b6d4',
  nodeColor = '#d946ef',
  density = 'medium',
  animated = true,
  className,
}) => {
  const densityConfig = {
    low: { lines: 5, nodes: 8 },
    medium: { lines: 10, nodes: 15 },
    high: { lines: 15, nodes: 25 },
  };

  const config = densityConfig[density];

  // Generate random circuit lines
  const generateLines = () => {
    const lines = [];
    for (let i = 0; i < config.lines; i++) {
      const isHorizontal = Math.random() > 0.5;
      const start = Math.random() * 100;
      const length = 20 + Math.random() * 40;

      lines.push({
        isHorizontal,
        start,
        length,
        position: Math.random() * 100,
      });
    }
    return lines;
  };

  const lines = generateLines();

  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: 0.3 }}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Circuit Lines */}
        {lines.map((line, index) => (
          <motion.line
            key={index}
            x1={line.isHorizontal ? `${line.start}%` : `${line.position}%`}
            y1={line.isHorizontal ? `${line.position}%` : `${line.start}%`}
            x2={
              line.isHorizontal
                ? `${Math.min(100, line.start + line.length)}%`
                : `${line.position}%`
            }
            y2={
              line.isHorizontal
                ? `${line.position}%`
                : `${Math.min(100, line.start + line.length)}%`
            }
            stroke={lineColor}
            strokeWidth="1"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: animated ? 1 : 0,
              opacity: [0, 1, 0.5],
            }}
            transition={{
              duration: 2,
              delay: index * 0.1,
              repeat: animated ? Infinity : 0,
              repeatDelay: 3,
            }}
          />
        ))}

        {/* Circuit Nodes */}
        {[...Array(config.nodes)].map((_, index) => (
          <g key={`node-${index}`}>
            <motion.circle
              cx={`${20 + Math.random() * 60}%`}
              cy={`${20 + Math.random() * 60}%`}
              r="3"
              fill={nodeColor}
              filter="url(#glow)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1, 1.5, 1],
                opacity: [0, 1, 0.8, 1],
              }}
              transition={{
                duration: 2,
                delay: index * 0.15,
                repeat: animated ? Infinity : 0,
                repeatDelay: 4,
              }}
            />
            <motion.circle
              cx={`${20 + Math.random() * 60}%`}
              cy={`${20 + Math.random() * 60}%`}
              r="6"
              fill="none"
              stroke={nodeColor}
              strokeWidth="1"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 2, 3],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 2,
                delay: index * 0.15,
                repeat: animated ? Infinity : 0,
                repeatDelay: 4,
              }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
};

export default CircuitBoard;
