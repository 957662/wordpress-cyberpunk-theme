import React from 'react';
import { cn } from '@/lib/utils';
import { X, Info, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

export type NotificationBannerType = 'info' | 'success' | 'warning' | 'error';

interface NotificationBannerProps {
  type?: NotificationBannerType;
  title?: string;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const icons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
};

const colors = {
  info: 'bg-blue-900/30 border-blue-700 text-blue-200',
  success: 'bg-green-900/30 border-green-700 text-green-200',
  warning: 'bg-yellow-900/30 border-yellow-700 text-yellow-200',
  error: 'bg-red-900/30 border-red-700 text-red-200',
};

const iconColors = {
  info: 'text-blue-400',
  success: 'text-green-400',
  warning: 'text-yellow-400',
  error: 'text-red-400',
};

/**
 * NotificationBanner - 通知横幅组件
 * 用于显示重要的系统消息或通知
 */
export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  type = 'info',
  title,
  message,
  dismissible = false,
  onDismiss,
  className,
  action,
}) => {
  const Icon = icons[type];
  const colorScheme = colors[type];
  const iconColor = iconColors[type];

  return (
    <div className={cn(
      'border rounded-lg p-4',
      colorScheme,
      className
    )}>
      <div className="flex items-start">
        <div className={cn('flex-shrink-0', iconColor)}>
          <Icon className="w-5 h-5" />
        </div>

        <div className="ml-3 flex-1">
          {title && (
            <h3 className="font-semibold mb-1">{title}</h3>
          )}
          <p className="text-sm">{message}</p>

          {action && (
            <button
              onClick={action.onClick}
              className="mt-2 text-sm underline hover:no-underline"
            >
              {action.label}
            </button>
          )}
        </div>

        {dismissible && (
          <button
            onClick={onDismiss}
            className="ml-3 flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationBanner;
