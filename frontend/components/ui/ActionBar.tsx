/**
 * ActionBar Component - 操作栏组件
 * 用于展示页面或内容区域的操作按钮
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';

export interface ActionButton {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  tooltip?: string;
}

export interface ActionBarProps {
  title?: string;
  subtitle?: string;
  actions?: ActionButton[];
  backAction?: () => void;
  className?: string;
  position?: 'top' | 'bottom' | 'sticky-top' | 'sticky-bottom';
  size?: 'sm' | 'md' | 'lg';
}

export function ActionBar({
  title,
  subtitle,
  actions = [],
  backAction,
  className,
  position = 'top',
  size = 'md',
}: ActionBarProps) {
  const sizes = {
    sm: 'h-12 px-3',
    md: 'h-16 px-4',
    lg: 'h-20 px-6',
  };

  const positionStyles = {
    top: 'relative',
    bottom: 'relative',
    'sticky-top': 'sticky top-0 z-40',
    'sticky-bottom': 'sticky bottom-0 z-40',
  };

  const buttonVariants = {
    primary: 'bg-cyber-cyan text-cyber-dark hover:bg-cyber-cyan/90',
    secondary: 'bg-cyber-purple text-white hover:bg-cyber-purple/90',
    outline: 'border border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan/10',
    ghost: 'text-cyber-cyan hover:bg-cyber-cyan/10',
    danger: 'bg-cyber-pink text-white hover:bg-cyber-pink/90',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: position === 'bottom' || position === 'sticky-bottom' ? 20 : -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "bg-cyber-card border-y border-cyber-border backdrop-blur-sm",
        positionStyles[position],
        sizes[size],
        className
      )}
    >
      <div className="flex items-center justify-between h-full max-w-7xl mx-auto">
        {/* 左侧：标题和返回按钮 */}
        <div className="flex items-center gap-3">
          {backAction && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={backAction}
              className="p-2 rounded-lg hover:bg-cyber-cyan/10 text-cyber-cyan transition-colors"
              aria-label="返回"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
          )}

          {(title || subtitle) && (
            <div className="flex flex-col">
              {title && (
                <h1 className="text-lg font-semibold text-cyber-text">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-sm text-cyber-text-secondary">
                  {subtitle}
                </p>
              )}
            </div>
          )}
        </div>

        {/* 右侧：操作按钮 */}
        {actions.length > 0 && (
          <div className="flex items-center gap-2">
            {actions.map((action, index) => (
              <motion.button
                key={action.id}
                whileHover={{ scale: action.disabled ? 1 : 1.02 }}
                whileTap={{ scale: action.disabled ? 1 : 0.98 }}
                onClick={action.onClick}
                disabled={action.disabled}
                title={action.tooltip || action.label}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  buttonVariants[action.variant || 'ghost']
                )}
              >
                {action.icon && <span className="flex-shrink-0">{action.icon}</span>}
                <span className="hidden sm:inline">{action.label}</span>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/**
 * ActionBarGroup Component - 操作栏分组组件
 * 用于将多个操作分组显示
 */
export interface ActionBarGroupProps {
  actions: ActionButton[];
  maxVisible?: number;
  className?: string;
}

export function ActionBarGroup({ actions, maxVisible = 3, className }: ActionBarGroupProps) {
  const [showMore, setShowMore] = useState(false);

  const visibleActions = actions.slice(0, maxVisible);
  const hiddenActions = actions.slice(maxVisible);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {visibleActions.map(action => (
        <motion.button
          key={action.id}
          whileHover={{ scale: action.disabled ? 1 : 1.02 }}
          whileTap={{ scale: action.disabled ? 1 : 0.98 }}
          onClick={action.onClick}
          disabled={action.disabled}
          title={action.tooltip || action.label}
          className={cn(
            "inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "border border-cyber-border bg-cyber-card hover:bg-cyber-cyan/10 text-cyber-text"
          )}
        >
          {action.icon && <span className="flex-shrink-0">{action.icon}</span>}
          <span>{action.label}</span>
        </motion.button>
      ))}

      {hiddenActions.length > 0 && (
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowMore(!showMore)}
            className="p-2 rounded-md border border-cyber-border bg-cyber-card hover:bg-cyber-cyan/10 text-cyber-text"
          >
            <MoreVertical className="w-4 h-4" />
          </motion.button>

          {showMore && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMore(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-full mt-2 z-20 min-w-[200px] bg-cyber-card border border-cyber-border rounded-lg shadow-lg overflow-hidden"
              >
                {hiddenActions.map(action => (
                  <button
                    key={action.id}
                    onClick={() => {
                      action.onClick();
                      setShowMore(false);
                    }}
                    disabled={action.disabled}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2 text-sm text-left transition-colors",
                      "hover:bg-cyber-cyan/10",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      action.variant === 'danger' ? "text-cyber-pink" : "text-cyber-text"
                    )}
                  >
                    {action.icon && <span className="flex-shrink-0">{action.icon}</span>}
                    <span>{action.label}</span>
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
