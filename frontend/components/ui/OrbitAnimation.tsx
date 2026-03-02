/**
 * OrbitAnimation Component - 轨道动画组件
 * 元素围绕中心点旋转的动画效果
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState, useRef } from 'react';

export interface OrbitItem {
  id: string;
  content: React.ReactNode;
  size?: number;
  distance?: number;
  speed?: number;
  direction?: 'clockwise' | 'counterclockwise';
  color?: string;
}

export interface OrbitAnimationProps {
  center?: React.ReactNode;
  items?: OrbitItem[];
  className?: string;
  size?: number;
  orbitWidth?: number;
  color?: 'cyan' | 'purple' | 'pink' | 'yellow';
  speed?: number;
  showOrbitPath?: boolean;
}

export function OrbitAnimation({
  center,
  items = [],
  className,
  size = 300,
  orbitWidth = 2,
  color = 'cyan',
  speed = 1,
  showOrbitPath = true,
}: OrbitAnimationProps) {
  const colors = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    yellow: '#eab308',
  };

  const currentColor = colors[color];

  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      {/* 轨道路径 */}
      {showOrbitPath && (
        <motion.div
          className="absolute rounded-full border border-dashed"
          style={{
            width: size * 0.8,
            height: size * 0.8,
            borderColor: currentColor,
            borderWidth: orbitWidth,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20 / speed, repeat: Infinity, ease: 'linear' }}
        />
      )}

      {/* 中心元素 */}
      <div className="absolute z-10">{center}</div>

      {/* 轨道上的元素 */}
      {items.map((item, index) => {
        const itemSize = item.size || 40;
        const distance = (item.distance || 120) * (size / 300);
        const itemSpeed = (item.speed || 1) * speed;
        const itemDirection = item.direction === 'counterclockwise' ? -1 : 1;
        const duration = 10 / itemSpeed;
        const startAngle = (index / items.length) * 360;

        return (
          <motion.div
            key={item.id}
            className="absolute"
            style={{
              width: itemSize,
              height: itemSize,
            }}
            initial={{ rotate: startAngle }}
            animate={{ rotate: startAngle + 360 * itemDirection }}
            transition={{ duration: duration, repeat: Infinity, ease: 'linear' }}
          >
            <div
              className="absolute"
              style={{
                left: distance,
                top: -itemSize / 2,
                backgroundColor: item.color || currentColor,
              }}
            >
              {item.content}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/**
 * SolarSystem Component - 太阳系动画
 */
export interface SolarSystemProps {
  className?: string;
  size?: number;
  animate?: boolean;
  showLabels?: boolean;
}

export function SolarSystem({
  className,
  size = 400,
  animate = true,
  showLabels = false,
}: SolarSystemProps) {
  const planets = [
    { name: '水星', color: '#b5b5b5', size: 8, distance: 40, speed: 4.15 },
    { name: '金星', color: '#e6c87a', size: 12, distance: 60, speed: 1.62 },
    { name: '地球', color: '#6b93d6', size: 14, distance: 85, speed: 1 },
    { name: '火星', color: '#c1440e', size: 10, distance: 110, speed: 0.53 },
    { name: '木星', color: '#d8ca9d', size: 28, distance: 150, speed: 0.084 },
    { name: '土星', color: '#f4d59e', size: 24, distance: 190, speed: 0.034 },
  ];

  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      {/* 太阳 */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 40,
          height: 40,
          background: 'radial-gradient(circle, #ffd700, #ff8c00)',
          boxShadow: '0 0 40px #ffd700',
        }}
        animate={animate ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* 行星轨道和行星 */}
      {planets.map((planet) => (
        <div key={planet.name} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {/* 轨道 */}
          <div
            className="absolute rounded-full border border-cyber-border/30"
            style={{
              width: planet.distance * 2,
              height: planet.distance * 2,
              left: -planet.distance,
              top: -planet.distance,
            }}
          />

          {/* 行星 */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: planet.size,
              height: planet.size,
              backgroundColor: planet.color,
              left: -planet.size / 2,
              top: -planet.distance - planet.size / 2,
              boxShadow: `0 0 ${planet.size}px ${planet.color}`,
            }}
            animate={
              animate
                ? {
                    rotate: 360,
                  }
                : {}
            }
            transition={{
              duration: 10 / planet.speed,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {showLabels && (
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-cyber-text whitespace-nowrap">
                {planet.name}
              </span>
            )}
          </motion.div>
        </div>
      ))}
    </div>
  );
}

/**
 * AtomAnimation Component - 原子动画
 */
export interface AtomAnimationProps {
  className?: string;
  size?: number;
  electronCount?: number;
  color?: 'cyan' | 'purple' | 'pink' | 'yellow';
  speed?: number;
}

export function AtomAnimation({
  className,
  size = 200,
  electronCount = 3,
  color = 'cyan',
  speed = 1,
}: AtomAnimationProps) {
  const colors = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    yellow: '#eab308',
  };

  const currentColor = colors[color];

  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      {/* 原子核 */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 20,
          height: 20,
          background: `radial-gradient(circle, ${currentColor}, ${currentColor}40)`,
          boxShadow: `0 0 20px ${currentColor}`,
        }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* 电子轨道 */}
      {Array.from({ length: electronCount }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-current opacity-60"
          style={{
            width: size * 0.8,
            height: size * 0.8,
            color: currentColor,
          }}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 3 / speed,
            repeat: Infinity,
            ease: 'linear',
            delay: i * 0.5,
          }}
        >
          {/* 电子 */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 8,
              height: 8,
              backgroundColor: currentColor,
              boxShadow: `0 0 10px ${currentColor}`,
              left: -4,
              top: '50%',
              marginTop: -4,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

/**
 * RadarScan Component - 雷达扫描动画
 */
export interface RadarScanProps {
  items?: Array<{ x: number; y: number; label?: string }>;
  className?: string;
  size?: number;
  color?: 'cyan' | 'purple' | 'pink' | 'yellow';
  speed?: number;
}

export function RadarScan({
  items = [],
  className,
  size = 300,
  color = 'cyan',
  speed = 1,
}: RadarScanProps) {
  const colors = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    yellow: '#eab308',
  };

  const currentColor = colors[color];

  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      {/* 雷达网格 */}
      <div className="absolute rounded-full border-2 border-current opacity-20" style={{ color: currentColor, width: size * 0.3, height: size * 0.3 }} />
      <div className="absolute rounded-full border-2 border-current opacity-20" style={{ color: currentColor, width: size * 0.5, height: size * 0.5 }} />
      <div className="absolute rounded-full border-2 border-current opacity-20" style={{ color: currentColor, width: size * 0.7, height: size * 0.7 }} />
      <div className="absolute rounded-full border-2 border-current opacity-30" style={{ color: currentColor, width: size * 0.9, height: size * 0.9 }} />

      {/* 扫描线 */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size,
          height: size,
          background: `conic-gradient(from 0deg, ${currentColor}40 0%, transparent 30%)`,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 4 / speed, repeat: Infinity, ease: 'linear' }}
      />

      {/* 目标点 */}
      {items.map((item, index) => (
        <motion.div
          key={index}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            backgroundColor: currentColor,
            boxShadow: `0 0 10px ${currentColor}`,
          }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
        >
          {item.label && (
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-cyber-text whitespace-nowrap">
              {item.label}
            </span>
          )}
        </motion.div>
      ))}
    </div>
  );
}
