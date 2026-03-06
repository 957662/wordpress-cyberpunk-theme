'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, AlertCircle, Clock, Ban } from 'lucide-react';

type StatusType = 'success' | 'error' | 'warning' | 'pending' | 'banned';

interface StatusBadgeProps {
  status: StatusType;
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'outline' | 'subtle';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  text,
  size = 'md',
  variant = 'solid',
  className
}) => {
  const config = {
    success: {
      icon: CheckCircle,
      color: 'green',
      text: text || '成功',
      classes: {
        solid: 'bg-cyber-green/20 text-cyber-green border-cyber-green/50',
        outline: 'bg-transparent text-cyber-green border-cyber-green',
        subtle: 'bg-cyber-green/10 text-cyber-green border-transparent'
      }
    },
    error: {
      icon: XCircle,
      color: 'pink',
      text: text || '失败',
      classes: {
        solid: 'bg-cyber-pink/20 text-cyber-pink border-cyber-pink/50',
        outline: 'bg-transparent text-cyber-pink border-cyber-pink',
        subtle: 'bg-cyber-pink/10 text-cyber-pink border-transparent'
      }
    },
    warning: {
      icon: AlertCircle,
      color: 'yellow',
      text: text || '警告',
      classes: {
        solid: 'bg-cyber-yellow/20 text-cyber-yellow border-cyber-yellow/50',
        outline: 'bg-transparent text-cyber-yellow border-cyber-yellow',
        subtle: 'bg-cyber-yellow/10 text-cyber-yellow border-transparent'
      }
    },
    pending: {
      icon: Clock,
      color: 'cyan',
      text: text || '处理中',
      classes: {
        solid: 'bg-cyber-cyan/20 text-cyber-cyan border-cyber-cyan/50',
        outline: 'bg-transparent text-cyber-cyan border-cyber-cyan',
        subtle: 'bg-cyber-cyan/10 text-cyber-cyan border-transparent'
      }
    },
    banned: {
      icon: Ban,
      color: 'purple',
      text: text || '已封禁',
      classes: {
        solid: 'bg-cyber-purple/20 text-cyber-purple border-cyber-purple/50',
        outline: 'bg-transparent text-cyber-purple border-cyber-purple',
        subtle: 'bg-cyber-purple/10 text-cyber-purple border-transparent'
      }
    }
  };

  const { icon: Icon, text: defaultText, classes } = config[status];
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center border rounded-full font-medium',
        sizeClasses[size],
        classes[variant],
        className
      )}
    >
      <Icon className={iconSizes[size]} />
      <span>{defaultText}</span>
    </span>
  );
};

// 点状状态指示器
export const StatusDot: React.FC<{
  status: StatusType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ status, size = 'md', className }) => {
  const colorMap = {
    success: 'bg-cyber-green',
    error: 'bg-cyber-pink',
    warning: 'bg-cyber-yellow',
    pending: 'bg-cyber-cyan',
    banned: 'bg-cyber-purple'
  };

  const sizeMap = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  return (
    <span className={cn('relative flex h-3 items-center', className)}>
      <span className={cn(
        'inline-flex rounded-full',
        sizeMap[size],
        colorMap[status]
      )}>
        <span className={cn(
          'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
          colorMap[status]
        )} />
      </span>
    </span>
  );
};

// 状态标签组
export const StatusBadgeGroup: React.FC<{
  statuses: Array<{
    type: StatusType;
    text?: string;
  }>;
  className?: string;
}> = ({ statuses, className }) => {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {statuses.map((status, index) => (
        <StatusBadge
          key={index}
          status={status.type}
          text={status.text}
          size="sm"
          variant="outline"
        />
      ))}
    </div>
  );
};

// 进度状态标签
export const ProgressBadge: React.FC<{
  step: number;
  total: number;
  className?: string;
}> = ({ step, total, className }) => {
  const percentage = (step / total) * 100;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-sm text-gray-400">
        步骤 {step} / {total}
      </span>
      <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-cyber-cyan transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm text-cyber-cyan">
        {Math.round(percentage)}%
      </span>
    </div>
  );
};

export default StatusBadge;
