'use client';

/**
 * 赛博朋克风格天气卡片组件
 * 支持多种天气状态和动画效果
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, CloudRain, CloudSnow, CloudLightning, Sun, Wind, Droplets } from 'lucide-react';
import { cn } from '@/lib/utils';

export type WeatherType = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy' | 'windy';

export interface WeatherCardProps {
  city: string;
  temperature: number;
  weather: WeatherType;
  humidity?: number;
  windSpeed?: number;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  className?: string;
}

export function WeatherCard({
  city,
  temperature,
  weather,
  humidity = 65,
  windSpeed = 12,
  description,
  size = 'md',
  showDetails = true,
  className,
}: WeatherCardProps) {
  const weatherConfig = {
    sunny: {
      icon: Sun,
      label: '晴天',
      color: '#f0ff00',
      bgGradient: 'from-yellow-500/20 to-orange-500/20',
    },
    cloudy: {
      icon: Cloud,
      label: '多云',
      color: '#9ca3af',
      bgGradient: 'from-gray-500/20 to-gray-600/20',
    },
    rainy: {
      icon: CloudRain,
      label: '雨天',
      color: '#00f0ff',
      bgGradient: 'from-blue-500/20 to-cyan-500/20',
    },
    snowy: {
      icon: CloudSnow,
      label: '雪天',
      color: '#ffffff',
      bgGradient: 'from-blue-200/20 to-white/20',
    },
    stormy: {
      icon: CloudLightning,
      label: '雷暴',
      color: '#9d00ff',
      bgGradient: 'from-purple-500/20 to-pink-500/20',
    },
    windy: {
      icon: Wind,
      label: '大风',
      color: '#00ff88',
      bgGradient: 'from-green-500/20 to-teal-500/20',
    },
  };

  const config = weatherConfig[weather];
  const Icon = config.icon;

  const sizeMap = {
    sm: {
      card: 'p-4',
      icon: 'w-12 h-12',
      temp: 'text-3xl',
      city: 'text-lg',
    },
    md: {
      card: 'p-6',
      icon: 'w-20 h-20',
      temp: 'text-5xl',
      city: 'text-xl',
    },
    lg: {
      card: 'p-8',
      icon: 'w-28 h-28',
      temp: 'text-7xl',
      city: 'text-2xl',
    },
  };

  const currentSize = sizeMap[size];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ scale: 1.02, rotateY: 5 }}
      className={cn(
        'relative overflow-hidden rounded-2xl border-2 border-cyber-border',
        'bg-gradient-to-br bg-cyber-dark/80 backdrop-blur-sm',
        config.bgGradient,
        currentSize.card,
        className
      )}
      style={{
        boxShadow: `0 0 30px ${config.color}30, inset 0 0 30px ${config.color}10`,
      }}
    >
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, ${config.color} 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* City Name */}
        <motion.h3
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className={cn('font-display font-bold text-white mb-2', currentSize.city)}
        >
          {city}
        </motion.h3>

        {/* Main Content */}
        <div className="flex items-center justify-between gap-4">
          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className={cn('flex-shrink-0', currentSize.icon)}
            style={{ color: config.color }}
          >
            <Icon className="w-full h-full drop-shadow-lg" />
          </motion.div>

          {/* Temperature */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="text-right"
          >
            <div className={cn('font-display font-bold text-white', currentSize.temp)}>
              {temperature}°
            </div>
            {description && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm text-gray-400 mt-1"
              >
                {description}
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Weather Label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium"
          style={{
            backgroundColor: `${config.color}20`,
            color: config.color,
            border: `1px solid ${config.color}50`,
          }}
        >
          {config.label}
        </motion.div>

        {/* Details */}
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-4 pt-4 border-t border-cyber-border grid grid-cols-2 gap-3"
          >
            {/* Humidity */}
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-cyber-cyan" />
              <div>
                <div className="text-xs text-gray-500">湿度</div>
                <div className="text-sm font-semibold text-white">{humidity}%</div>
              </div>
            </div>

            {/* Wind Speed */}
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-cyber-green" />
              <div>
                <div className="text-xs text-gray-500">风速</div>
                <div className="text-sm font-semibold text-white">{windSpeed} km/h</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Glow Effect */}
      <motion.div
        className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: config.color }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
}

export default WeatherCard;
