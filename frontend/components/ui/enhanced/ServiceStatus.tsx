'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// =====================================================
// 服务状态类型
// =====================================================

export type ServiceStatus = 'healthy' | 'degraded' | 'down' | 'unknown' | 'checking';

export interface ServiceCheck {
  name: string;
  url: string;
  status: ServiceStatus;
  responseTime?: number;
  lastCheck?: Date;
  error?: string;
}

// =====================================================
// 单个服务状态组件
// =====================================================

interface ServiceIndicatorProps {
  service: ServiceCheck;
  showDetails?: boolean;
}

export function ServiceIndicator({ service, showDetails = false }: ServiceIndicatorProps) {
  const getStatusIcon = () => {
    switch (service.status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-cyber-green" />;
      case 'degraded':
        return <AlertCircle className="w-5 h-5 text-cyber-yellow" />;
      case 'down':
        return <XCircle className="w-5 h-5 text-cyber-pink" />;
      case 'checking':
        return <Clock className="w-5 h-5 text-cyber-cyan animate-spin" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (service.status) {
      case 'healthy':
        return '正常';
      case 'degraded':
        return '降级';
      case 'down':
        return '故障';
      case 'checking':
        return '检测中';
      default:
        return '未知';
    }
  };

  const getStatusColor = () => {
    switch (service.status) {
      case 'healthy':
        return 'text-cyber-green';
      case 'degraded':
        return 'text-cyber-yellow';
      case 'down':
        return 'text-cyber-pink';
      case 'checking':
        return 'text-cyber-cyan';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-900/50 border border-gray-800 rounded-lg hover:border-cyber-cyan/50 transition-all">
      {getStatusIcon()}

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-white font-medium">{service.name}</span>
          <span className={`text-xs ${getStatusColor()}`}>{getStatusText()}</span>
        </div>

        {showDetails && (
          <div className="mt-1 space-y-1">
            {service.responseTime !== undefined && (
              <p className="text-xs text-gray-500">
                响应时间: {service.responseTime}ms
              </p>
            )}
            {service.lastCheck && (
              <p className="text-xs text-gray-500">
                最后检查: {service.lastCheck.toLocaleTimeString()}
              </p>
            )}
            {service.error && (
              <p className="text-xs text-cyber-pink">{service.error}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// =====================================================
// 服务状态面板组件
// =====================================================

interface ServiceStatusPanelProps {
  services: ServiceCheck[];
  onRefresh?: () => void;
  autoRefresh?: boolean;
  refreshInterval?: number;
  showDetails?: boolean;
}

export function ServiceStatusPanel({
  services,
  onRefresh,
  autoRefresh = false,
  refreshInterval = 30000,
  showDetails = false,
}: ServiceStatusPanelProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!autoRefresh || !onRefresh) return;

    const interval = setInterval(() => {
      onRefresh();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, onRefresh]);

  const handleRefresh = async () => {
    if (!onRefresh || isRefreshing) return;

    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  const overallStatus = (): ServiceStatus => {
    if (services.some(s => s.status === 'down')) return 'down';
    if (services.some(s => s.status === 'degraded')) return 'degraded';
    if (services.some(s => s.status === 'checking')) return 'checking';
    if (services.every(s => s.status === 'healthy')) return 'healthy';
    return 'unknown';
  };

  const getStatusColor = (status: ServiceStatus) => {
    switch (status) {
      case 'healthy':
        return 'from-cyber-green/20 to-cyber-green/5 border-cyber-green/30';
      case 'degraded':
        return 'from-cyber-yellow/20 to-cyber-yellow/5 border-cyber-yellow/30';
      case 'down':
        return 'from-cyber-pink/20 to-cyber-pink/5 border-cyber-pink/30';
      case 'checking':
        return 'from-cyber-cyan/20 to-cyber-cyan/5 border-cyber-cyan/30';
      default:
        return 'from-gray-700/20 to-gray-700/5 border-gray-700/30';
    }
  };

  const status = overallStatus();

  return (
    <div className={`bg-gradient-to-b ${getStatusColor(status)} border rounded-xl p-6`}>
      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">系统状态</h3>
          <p className="text-sm text-gray-400">
            {status === 'healthy' && '所有服务正常运行'}
            {status === 'degraded' && '部分服务降级运行'}
            {status === 'down' && '部分服务不可用'}
            {status === 'checking' && '正在检测服务状态'}
            {status === 'unknown' && '无法确定服务状态'}
          </p>
        </div>

        {onRefresh && (
          <motion.button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-4 py-2 bg-cyber-cyan/10 hover:bg-cyber-cyan/20 text-cyber-cyan rounded-lg transition-colors disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isRefreshing ? '刷新中...' : '刷新'}
          </motion.button>
        )}
      </div>

      {/* 服务列表 */}
      <div className="space-y-2">
        {services.map((service, index) => (
          <motion.div
            key={service.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ServiceIndicator service={service} showDetails={showDetails} />
          </motion.div>
        ))}
      </div>

      {/* 最后更新时间 */}
      {services[0]?.lastCheck && (
        <p className="mt-4 text-xs text-gray-500 text-center">
          最后更新: {services[0].lastCheck.toLocaleString()}
        </p>
      )}
    </div>
  );
}

// =====================================================
// 服务状态 Hook
// =====================================================

export function useServiceStatus(serviceUrls: Record<string, string>) {
  const [services, setServices] = useState<ServiceCheck[]>(
    Object.entries(serviceUrls).map(([name, url]) => ({
      name,
      url,
      status: 'unknown' as ServiceStatus,
    }))
  );

  const checkServices = async () => {
    const startTime = Date.now();

    const checkPromises = services.map(async (service) => {
      const serviceStartTime = Date.now();

      try {
        const response = await fetch(service.url, {
          method: 'HEAD',
          cache: 'no-cache',
        });

        const responseTime = Date.now() - serviceStartTime;

        return {
          ...service,
          status: response.ok ? 'healthy' : 'degraded',
          responseTime,
          lastCheck: new Date(),
          error: undefined,
        };
      } catch (error) {
        return {
          ...service,
          status: 'down' as ServiceStatus,
          lastCheck: new Date(),
          error: error instanceof Error ? error.message : '连接失败',
        };
      }
    });

    const results = await Promise.all(checkPromises);
    setServices(results);
  };

  useEffect(() => {
    checkServices();
  }, []);

  return {
    services,
    checkServices,
    overallStatus: services.some(s => s.status === 'down')
      ? 'down'
      : services.some(s => s.status === 'degraded')
      ? 'degraded'
      : services.every(s => s.status === 'healthy')
      ? 'healthy'
      : 'unknown',
  };
}

// =====================================================
// 小型服务状态指示器
// =====================================================

interface MiniServiceIndicatorProps {
  status: ServiceStatus;
  showText?: boolean;
  className?: string;
}

export function MiniServiceIndicator({
  status,
  showText = false,
  className = '',
}: MiniServiceIndicatorProps) {
  const getColor = () => {
    switch (status) {
      case 'healthy':
        return 'bg-cyber-green shadow-neon-green';
      case 'degraded':
        return 'bg-cyber-yellow shadow-neon-yellow';
      case 'down':
        return 'bg-cyber-pink shadow-neon-pink';
      case 'checking':
        return 'bg-cyber-cyan animate-pulse';
      default:
        return 'bg-gray-500';
    }
  };

  const getText = () => {
    switch (status) {
      case 'healthy':
        return '正常';
      case 'degraded':
        return '降级';
      case 'down':
        return '故障';
      case 'checking':
        return '检测中';
      default:
        return '未知';
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`w-2 h-2 rounded-full ${getColor()}`} />
      {showText && (
        <span className="text-xs text-gray-400">{getText()}</span>
      )}
    </div>
  );
}

// =====================================================
// 默认导出
// =====================================================

export default ServiceStatusPanel;
