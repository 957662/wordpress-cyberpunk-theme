/**
 * Cyber Weather Widget
 * 赛博朋克风格天气组件
 *
 * 未来风格的天气显示，带有动态效果和全息感
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Cloud,
  CloudRain,
  CloudLightning,
  Snowflake,
  Sun,
  Wind,
  Droplets,
  Thermometer,
  Eye,
  Gauge,
} from 'lucide-react';

interface WeatherData {
  temp: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy';
  humidity: number;
  windSpeed: number;
  visibility: number;
  pressure: number;
  location: string;
  feelsLike: number;
}

interface CyberWeatherProps {
  weatherData?: WeatherData;
  className?: string;
  autoUpdate?: boolean;
  updateInterval?: number;
}

// 天气图标映射
const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  stormy: CloudLightning,
  snowy: Snowflake,
};

// 天气颜色映射
const weatherColors = {
  sunny: 'from-yellow-400 to-orange-500',
  cloudy: 'from-gray-400 to-gray-600',
  rainy: 'from-blue-400 to-blue-600',
  stormy: 'from-purple-500 to-pink-600',
  snowy: 'from-cyan-300 to-blue-400',
};

export function CyberWeather({
  weatherData,
  className = '',
  autoUpdate = false,
  updateInterval = 300000,
}: CyberWeatherProps) {
  const [weather, setWeather] = useState<WeatherData>(
    weatherData || {
      temp: 24,
      condition: 'sunny',
      humidity: 65,
      windSpeed: 12,
      visibility: 10,
      pressure: 1013,
      location: 'Neon City',
      feelsLike: 26,
    }
  );

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isGlitching, setIsGlitching] = useState(false);

  // 更新时间
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 自动更新天气数据（模拟）
  useEffect(() => {
    if (!autoUpdate) return;

    const interval = setInterval(() => {
      setWeather(prev => ({
        ...prev,
        temp: Math.round(20 + Math.random() * 10),
        humidity: Math.round(50 + Math.random() * 30),
        windSpeed: Math.round(5 + Math.random() * 20),
      }));
    }, updateInterval);

    return () => clearInterval(interval);
  }, [autoUpdate, updateInterval]);

  // 触发故障效果
  const triggerGlitch = () => {
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 200);
  };

  const WeatherIcon = weatherIcons[weather.condition];
  const colorClass = weatherColors[weather.condition];

  return (
    <div className={`cyber-card p-6 ${className}`}>
      {/* 位置和时间 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <motion.h2
            className="text-2xl font-bold text-white mb-1"
            onHoverStart={triggerGlitch}
          >
            {weather.location}
          </motion.h2>
          <p className="text-sm text-gray-400 font-mono">
            {currentTime.toLocaleTimeString('zh-CN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <motion.div
          animate={isGlitching ? {
            x: [0, -5, 5, -5, 5, 0],
            opacity: [1, 0.5, 1, 0.5, 1],
          } : {}}
          transition={{ duration: 0.2 }}
        >
          <WeatherIcon className="w-12 h-12 text-cyber-cyan" />
        </motion.div>
      </div>

      {/* 主温度显示 */}
      <div className="relative mb-8">
        <div className="flex items-end gap-4">
          <motion.div
            key={weather.temp}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative"
          >
            <span className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-cyber-cyan to-cyber-purple">
              {weather.temp}°
            </span>
          </motion.div>
          <div className="pb-4">
            <div className="text-gray-400 text-sm mb-1">体感温度</div>
            <div className="text-2xl font-semibold text-white">
              {weather.feelsLike}°
            </div>
          </div>
        </div>

        {/* 天气状况标签 */}
        <motion.div
          className="absolute -right-4 top-0 px-4 py-2 bg-gradient-to-r border border-white/20 rounded-full backdrop-blur-sm"
          style={{
            background: `linear-gradient(135deg, ${colorClass})`,
          }}
        >
          <span className="text-white text-sm font-semibold capitalize">
            {weather.condition === 'sunny' && '晴朗'}
            {weather.condition === 'cloudy' && '多云'}
            {weather.condition === 'rainy' && '小雨'}
            {weather.condition === 'stormy' && '雷暴'}
            {weather.condition === 'snowy' && '降雪'}
          </span>
        </motion.div>
      </div>

      {/* 天气详情网格 */}
      <div className="grid grid-cols-2 gap-4">
        {/* 湿度 */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-4 bg-cyber-dark/50 rounded-lg border border-cyber-border/50 group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
              <Droplets className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-gray-400 text-sm">湿度</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {weather.humidity}%
          </div>
          <div className="w-full bg-cyber-dark rounded-full h-1 mt-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
              initial={{ width: 0 }}
              animate={{ width: `${weather.humidity}%` }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>
        </motion.div>

        {/* 风速 */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-4 bg-cyber-dark/50 rounded-lg border border-cyber-border/50 group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center group-hover:bg-cyan-500/30 transition-colors">
              <Wind className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="text-gray-400 text-sm">风速</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {weather.windSpeed}
            <span className="text-sm text-gray-400 ml-1">km/h</span>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {weather.windSpeed < 10 ? '微风' : weather.windSpeed < 20 ? '和风' : '强风'}
          </div>
        </motion.div>

        {/* 能见度 */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-4 bg-cyber-dark/50 rounded-lg border border-cyber-border/50 group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
              <Eye className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-gray-400 text-sm">能见度</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {weather.visibility}
            <span className="text-sm text-gray-400 ml-1">km</span>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {weather.visibility > 10 ? '极佳' : weather.visibility > 5 ? '良好' : '较差'}
          </div>
        </motion.div>

        {/* 气压 */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-4 bg-cyber-dark/50 rounded-lg border border-cyber-border/50 group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center group-hover:bg-pink-500/30 transition-colors">
              <Gauge className="w-5 h-5 text-pink-400" />
            </div>
            <span className="text-gray-400 text-sm">气压</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {weather.pressure}
            <span className="text-sm text-gray-400 ml-1">hPa</span>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {weather.pressure > 1013 ? '高压' : '低压'}
          </div>
        </motion.div>
      </div>

      {/* 未来预报 */}
      <div className="mt-6 pt-6 border-t border-cyber-border/50">
        <h3 className="text-sm font-semibold text-gray-400 mb-4">未来 24 小时</h3>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {Array.from({ length: 6 }).map((_, i) => {
            const hour = (currentTime.getHours() + i * 4) % 24;
            const temp = Math.round(weather.temp + (Math.random() - 0.5) * 6);
            const conditions = ['sunny', 'cloudy', 'rainy'] as const;
            const condition = conditions[Math.floor(Math.random() * conditions.length)];
            const HourIcon = weatherIcons[condition];

            return (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1, y: -5 }}
                className="flex-shrink-0 w-16 p-3 bg-cyber-dark/50 rounded-lg border border-cyber-border/30 text-center"
              >
                <div className="text-xs text-gray-400 mb-2">
                  {hour.toString().padStart(2, '0')}:00
                </div>
                <HourIcon className="w-6 h-6 mx-auto mb-2 text-cyber-cyan" />
                <div className="text-lg font-bold text-white">{temp}°</div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 装饰性扫描线 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
        <motion.div
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-cyan/50 to-transparent"
          animate={{
            top: ['0%', '100%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
    </div>
  );
}

// 使用示例
export function CyberWeatherExample() {
  return (
    <div className="max-w-md mx-auto p-4">
      <CyberWeather autoUpdate={true} />
    </div>
  );
}
