'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Cpu, HardDrive, Zap, Memory, Network, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
  color: string;
  threshold?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  icon,
  trend,
  color,
  threshold = 80,
}) => {
  const numericValue = typeof value === 'number' ? value : parseFloat(value.toString());
  const isWarning = numericValue > threshold;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`relative overflow-hidden rounded-xl border-2 p-4 backdrop-blur-xl ${
        isWarning
          ? 'bg-red-900/20 border-red-500/50 shadow-red-500/20'
          : `bg-cyber-dark/50 ${color} shadow-lg`
      }`}
    >
      {/* Scanline Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none animate-pulse" />

      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-cyber-cyan/70 text-xs font-semibold uppercase tracking-wider mb-1">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold ${
              isWarning ? 'text-red-400' : 'text-white'
            }`}>
              {value}
            </span>
            <span className="text-cyber-cyan/50 text-sm">{unit}</span>
          </div>
        </div>

        <div className={`flex-shrink-0 p-2 rounded-lg ${
          isWarning
            ? 'bg-red-500/20 text-red-400'
            : 'bg-cyber-cyan/20 text-cyber-cyan'
        }`}>
          {icon}
        </div>
      </div>

      {trend && (
        <div className="flex items-center gap-1 mt-2">
          {trend === 'up' ? (
            <TrendingUp className="w-3 h-3 text-cyber-green" />
          ) : trend === 'down' ? (
            <TrendingDown className="w-3 h-3 text-cyber-green" />
          ) : null}
          <span className="text-xs text-cyber-cyan/50">
            {trend === 'up' ? '上升' : trend === 'down' ? '下降' : '稳定'}
          </span>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mt-3 h-1 bg-cyber-muted/30 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(numericValue, 100)}%` }}
          transition={{ duration: 0.5 }}
          className={`h-full ${
            isWarning
              ? 'bg-gradient-to-r from-red-500 to-red-400'
              : 'bg-gradient-to-r from-cyber-cyan to-cyber-purple'
          }`}
        />
      </div>
    </motion.div>
  );
};

interface SystemMonitorProps {
  refreshInterval?: number;
  showDetails?: boolean;
  compact?: boolean;
}

export const SystemMonitor: React.FC<SystemMonitorProps> = ({
  refreshInterval = 2000,
  showDetails = true,
  compact = false,
}) => {
  const [metrics, setMetrics] = useState({
    cpu: 45,
    memory: 62,
    disk: 78,
    network: 23,
    fps: 60,
    latency: 42,
  });

  const [history, setHistory] = useState({
    cpu: [] as number[],
    memory: [] as number[],
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsRefreshing(true);
      // Simulate metrics changes
      setMetrics(prev => ({
        cpu: Math.max(10, Math.min(100, prev.cpu + (Math.random() - 0.5) * 20)),
        memory: Math.max(20, Math.min(95, prev.memory + (Math.random() - 0.5) * 10)),
        disk: Math.max(30, Math.min(90, prev.disk + (Math.random() - 0.5) * 5)),
        network: Math.max(0, Math.min(100, prev.network + (Math.random() - 0.5) * 30)),
        fps: Math.max(30, Math.min(144, prev.fps + (Math.random() - 0.5) * 10)),
        latency: Math.max(10, Math.min(200, prev.latency + (Math.random() - 0.5) * 20)),
      }));

      setHistory(prev => ({
        cpu: [...prev.cpu.slice(-19), metrics.cpu].slice(-20),
        memory: [...prev.memory.slice(-19), metrics.memory].slice(-20),
      }));

      setTimeout(() => setIsRefreshing(false), 300);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, metrics]);

  const getTrend = (metric: keyof typeof history) => {
    const data = history[metric];
    if (data.length < 2) return 'stable';
    const diff = data[data.length - 1] - data[0];
    if (Math.abs(diff) < 5) return 'stable';
    return diff > 0 ? 'up' : 'down';
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  if (compact) {
    return (
      <div className="flex items-center gap-4 p-3 bg-cyber-dark/50 border border-cyber-cyan/30 rounded-lg backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyber-cyan animate-pulse" />
          <span className="text-white text-sm font-semibold">系统监控</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-cyber-cyan/70">CPU: {metrics.cpu.toFixed(0)}%</span>
          <span className="text-cyber-cyan/70">内存: {metrics.memory.toFixed(0)}%</span>
          <span className="text-cyber-cyan/70">{metrics.fps.toFixed(0)} FPS</span>
        </div>
        <button
          onClick={handleRefresh}
          className={`ml-auto p-1 rounded transition-colors ${
            isRefreshing ? 'animate-spin' : ''
          }`}
        >
          <RefreshCw className="w-3 h-3 text-cyber-cyan/50 hover:text-cyber-cyan" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyber-green rounded-full border-2 border-cyber-dark animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">系统监控</h2>
            <p className="text-cyber-cyan/50 text-xs">实时性能指标</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-xs text-cyber-cyan/50">
            <div className="w-2 h-2 bg-cyber-green rounded-full animate-pulse" />
            <span>实时更新</span>
          </div>
          <button
            onClick={handleRefresh}
            className={`p-2 bg-cyber-cyan/20 rounded-lg hover:bg-cyber-cyan/30 transition-colors ${
              isRefreshing ? 'animate-spin' : ''
            }`}
          >
            <RefreshCw className="w-4 h-4 text-cyber-cyan" />
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          title="CPU 使用率"
          value={metrics.cpu.toFixed(0)}
          unit="%"
          icon={<Cpu className="w-5 h-5" />}
          trend={getTrend('cpu')}
          color="border-cyber-cyan/50 shadow-cyber-cyan/20"
          threshold={80}
        />

        <MetricCard
          title="内存使用"
          value={metrics.memory.toFixed(0)}
          unit="%"
          icon={<Memory className="w-5 h-5" />}
          trend={getTrend('memory')}
          color="border-cyber-purple/50 shadow-cyber-purple/20"
          threshold={85}
        />

        <MetricCard
          title="磁盘空间"
          value={metrics.disk.toFixed(0)}
          unit="%"
          icon={<HardDrive className="w-5 h-5" />}
          color="border-cyber-pink/50 shadow-cyber-pink/20"
          threshold={90}
        />

        <MetricCard
          title="网络流量"
          value={metrics.network.toFixed(0)}
          unit="Mbps"
          icon={<Network className="w-5 h-5" />}
          color="border-cyber-green/50 shadow-cyber-green/20"
          threshold={100}
        />

        <MetricCard
          title="帧率"
          value={metrics.fps.toFixed(0)}
          unit="FPS"
          icon={<Zap className="w-5 h-5" />}
          color="border-cyber-yellow/50 shadow-cyber-yellow/20"
          threshold={30}
        />

        <MetricCard
          title="延迟"
          value={metrics.latency.toFixed(0)}
          unit="ms"
          icon={<Activity className="w-5 h-5" />}
          color="border-cyber-cyan/50 shadow-cyber-cyan/20"
          threshold={100}
        />
      </div>

      {/* History Chart */}
      {showDetails && history.cpu.length > 1 && (
        <div className="bg-cyber-dark/50 border border-cyber-cyan/30 rounded-xl p-4 backdrop-blur-xl">
          <h3 className="text-sm font-semibold text-cyber-cyan mb-3">性能趋势</h3>
          <div className="flex items-end gap-1 h-20">
            {history.cpu.map((value, index) => (
              <motion.div
                key={index}
                initial={{ height: 0 }}
                animate={{ height: `${value}%` }}
                transition={{ duration: 0.3 }}
                className="flex-1 bg-gradient-to-t from-cyber-cyan to-cyber-purple rounded-t"
                style={{ opacity: 0.3 + (index / history.cpu.length) * 0.7 }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemMonitor;
