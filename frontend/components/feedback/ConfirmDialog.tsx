import React from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';

export type ConfirmDialogType = 'warning' | 'info' | 'success' | 'danger';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: ConfirmDialogType;
  onConfirm: () => void;
  onCancel: () => void;
  className?: string;
}

const icons = {
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle,
  danger: XCircle,
};

const colors = {
  warning: 'text-yellow-500',
  info: 'text-blue-500',
  success: 'text-green-500',
  danger: 'text-red-500',
};

const buttonColors = {
  warning: 'bg-yellow-600 hover:bg-yellow-700',
  info: 'bg-blue-600 hover:bg-blue-700',
  success: 'bg-green-600 hover:bg-green-700',
  danger: 'bg-red-600 hover:bg-red-700',
};

/**
 * ConfirmDialog - 确认对话框组件
 * 用于需要用户确认的操作
 */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmLabel = '确认',
  cancelLabel = '取消',
  type = 'warning',
  onConfirm,
  onCancel,
  className,
}) => {
  if (!open) return null;

  const Icon = icons[type];
  const iconColor = colors[type];
  const buttonColor = buttonColors[type];

  return (
    <div className={cn(
      'fixed inset-0 z-50 flex items-center justify-center',
      'bg-black/50 backdrop-blur-sm',
      className
    )}>
      <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex items-start space-x-4">
          <div className={cn('flex-shrink-0', iconColor)}>
            <Icon className="w-6 h-6" />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-100 mb-2">
              {title}
            </h3>

            <p className="text-gray-400 mb-6">
              {message}
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                {cancelLabel}
              </button>

              <button
                onClick={onConfirm}
                className={cn(
                  'px-4 py-2 text-white rounded-lg transition-colors',
                  buttonColor
                )}
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
