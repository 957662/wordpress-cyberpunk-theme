/**
 * CyberInput - 赛博朋克风格输入框组件
 * 带有霓虹发光效果和动画的输入框
 */

'use client';

import { forwardRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CyberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'filled' | 'outlined';
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  icon?: React.ReactNode;
  onIconClick?: () => void;
  clearable?: boolean;
  onClear?: () => void;
  animate?: boolean;
}

const colorStyles = {
  cyan: {
    focus: 'focus:border-cyber-cyan focus:ring-cyber-cyan',
    glow: 'focus:shadow-[0_0_20px_rgba(0,240,255,0.3)]',
    label: 'text-cyber-cyan',
    icon: 'text-cyber-cyan',
  },
  purple: {
    focus: 'focus:border-cyber-purple focus:ring-cyber-purple',
    glow: 'focus:shadow-[0_0_20px_rgba(157,0,255,0.3)]',
    label: 'text-cyber-purple',
    icon: 'text-cyber-purple',
  },
  pink: {
    focus: 'focus:border-cyber-pink focus:ring-cyber-pink',
    glow: 'focus:shadow-[0_0_20px_rgba(255,0,128,0.3)]',
    label: 'text-cyber-pink',
    icon: 'text-cyber-pink',
  },
  green: {
    focus: 'focus:border-cyber-green focus:ring-cyber-green',
    glow: 'focus:shadow-[0_0_20px_rgba(0,255,136,0.3)]',
    label: 'text-cyber-green',
    icon: 'text-cyber-green',
  },
};

export const CyberInput = forwardRef<HTMLInputElement, CyberInputProps>(
  ({
    label,
    error,
    helperText,
    variant = 'default',
    color = 'cyan',
    icon,
    onIconClick,
    clearable = false,
    onClear,
    animate = true,
    className,
    type = 'text',
    value,
    ...props
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    const styles = colorStyles[color];
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
      props.onChange?.(e);
    };

    const handleClear = () => {
      onClear?.();
      setHasValue(false);
    };

    const baseInputClasses = cn(
      'w-full px-4 py-3 rounded-lg',
      'bg-cyber-dark/80 border',
      'text-white placeholder-gray-500',
      'font-mono text-sm',
      'transition-all duration-300',
      'outline-none',
      styles.focus,
      styles.glow,
      error && 'border-cyber-pink focus:border-cyber-pink focus:ring-cyber-pink',
      variant === 'filled' && 'bg-cyber-muted/50',
      variant === 'outlined' && 'bg-transparent border-2',
      icon && 'pl-12',
      (clearable || isPassword) && 'pr-12',
      className
    );

    const inputElement = (
      <div className="relative">
        <input
          ref={ref}
          type={inputType}
          value={value}
          onChange={handleChange}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className={baseInputClasses}
          {...props}
        />

        {/* 左侧图标 */}
        {icon && (
          <button
            type="button"
            onClick={onIconClick}
            className={cn(
              'absolute left-3 top-1/2 -translate-y-1/2',
              'transition-colors duration-300',
              styles.icon,
              onIconClick && 'cursor-pointer hover:opacity-80'
            )}
          >
            {icon}
          </button>
        )}

        {/* 右侧清除按钮 */}
        {clearable && hasValue && !isPassword && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={handleClear}
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2',
              'text-gray-400 hover:text-white',
              'transition-colors duration-300'
            )}
          >
            <X size={16} />
          </motion.button>
        )}

        {/* 密码显示/隐藏按钮 */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2',
              styles.icon,
              'transition-colors duration-300 hover:opacity-80'
            )}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}

        {/* 底部装饰线 */}
        {animate && (
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r"
            initial={{ width: 0 }}
            animate={{ width: isFocused ? '100%' : 0 }}
            transition={{ duration: 0.3 }}
            style={{
              backgroundImage: `linear-gradient(to right, ${
                color === 'cyan' ? '#00f0ff' :
                color === 'purple' ? '#9d00ff' :
                color === 'pink' ? '#ff0080' : '#00ff88'
              }, transparent)`,
            }}
          />
        )}
      </div>
    );

    return (
      <div className="relative">
        {/* 标签 */}
        {label && (
          <motion.label
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'block text-sm font-mono mb-2',
              isFocused ? styles.label : 'text-gray-400',
              'transition-colors duration-300'
            )}
          >
            {label}
          </motion.label>
        )}

        {/* 输入框 */}
        {animate ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {inputElement}
          </motion.div>
        ) : (
          inputElement
        )}

        {/* 错误信息 */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-1 text-xs text-cyber-pink font-mono"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* 帮助文本 */}
        {helperText && !error && (
          <p className="mt-1 text-xs text-gray-500 font-mono">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

CyberInput.displayName = 'CyberInput';

// 搜索输入框组件
export const CyberSearchInput: React.FC<
  Omit<CyberInputProps, 'icon'> & { onSearch?: (value: string) => void }
> = ({ onSearch, ...props }) => {
  return (
    <CyberInput
      {...props}
      icon={<Search size={18} />}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          onSearch?.(e.currentTarget.value);
        }
      }}
    />
  );
};

export default CyberInput;
