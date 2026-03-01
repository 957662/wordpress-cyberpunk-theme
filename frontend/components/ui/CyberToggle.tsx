'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface CyberToggleProps {
  /**
   * 是否选中
   */
  checked?: boolean;

  /**
   * 默认是否选中
   */
  defaultChecked?: boolean;

  /**
   * 变化回调
   */
  onChange?: (checked: boolean) => void;

  /**
   * 是否禁用
   */
  disabled?: boolean;

  /**
   * 霓虹颜色
   */
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';

  /**
   * 尺寸
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * 开关类型
   */
  variant?: 'default' | 'glow' | 'neon' | 'hologram';

  /**
   * 是否显示图标
   */
  showIcon?: boolean;

  /**
   * 开启状态的文字
   */
  labelOn?: string;

  /**
   * 关闭状态的文字
   */
  labelOff?: string;

  /**
   * 是否显示标签
   */
  showLabel?: boolean;

  /**
   * 标签位置
   */
  labelPosition?: 'left' | 'right' | 'top' | 'bottom';

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 自定义ID
   */
  id?: string;

  /**
   * 名称（用于表单）
   */
  name?: string;
}

const colorMap = {
  cyan: {
    primary: '#00f0ff',
    secondary: '#00a0aa',
    glow: 'rgba(0, 240, 255, 0.6)',
  },
  purple: {
    primary: '#9d00ff',
    secondary: '#6a00aa',
    glow: 'rgba(157, 0, 255, 0.6)',
  },
  pink: {
    primary: '#ff0080',
    secondary: '#aa0055',
    glow: 'rgba(255, 0, 128, 0.6)',
  },
  green: {
    primary: '#00ff41',
    secondary: '#00aa2b',
    glow: 'rgba(0, 255, 65, 0.6)',
  },
  yellow: {
    primary: '#f0ff00',
    secondary: '#a0aa00',
    glow: 'rgba(240, 255, 0, 0.6)',
  },
};

const sizeMap = {
  sm: { width: 44, height: 24, thumb: 20 },
  md: { width: 52, height: 28, thumb: 24 },
  lg: { width: 64, height: 32, thumb: 28 },
};

/**
 * CyberToggle - 赛博朋克风格开关组件
 *
 * 提供多种赛博朋克风格的开关效果
 *
 * @example
 * ```tsx
 * <CyberToggle checked={state} onChange={setState} />
 * <CyberToggle variant="neon" color="cyan" showLabel labelOn="开启" labelOff="关闭" />
 * <CyberToggle variant="hologram" color="purple" />
 * ```
 */
export const CyberToggle: React.FC<CyberToggleProps> = ({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  disabled = false,
  color = 'cyan',
  size = 'md',
  variant = 'default',
  showIcon = true,
  labelOn = 'ON',
  labelOff = 'OFF',
  showLabel = false,
  labelPosition = 'right',
  className = '',
  id,
  name,
}) => {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : internalChecked;

  const colors = colorMap[color];
  const dimensions = sizeMap[size];

  const handleChange = useCallback(() => {
    if (disabled) return;

    const newChecked = !checked;
    if (!isControlled) {
      setInternalChecked(newChecked);
    }
    onChange?.(newChecked);
  }, [checked, disabled, isControlled, onChange]);

  const renderToggle = () => (
    <motion.button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      id={id}
      name={name}
      onClick={handleChange}
      className="relative rounded-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
      style={{
        width: dimensions.width,
        height: dimensions.height,
        backgroundColor: checked ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.4)',
        border: `1px solid ${checked ? colors.primary : colors.secondary}`,
        boxShadow: checked
          ? `0 0 ${variant === 'glow' ? 20 : variant === 'neon' ? 15 : 10}px ${colors.glow}`
          : undefined,
      }}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {/* 扫描线效果 */}
      {checked && (variant === 'neon' || variant === 'hologram') && (
        <motion.div
          className="absolute inset-0 rounded-full overflow-hidden pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                ${colors.primary} 2px,
                ${colors.primary} 4px
              )`,
              opacity: 0.2,
            }}
          />
        </motion.div>
      )}

      {/* 全息网格效果 */}
      {checked && variant === 'hologram' && (
        <motion.div
          className="absolute inset-0 rounded-full overflow-hidden pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(${colors.primary}20 1px, transparent 1px),
                linear-gradient(90deg, ${colors.primary}20 1px, transparent 1px)
              `,
              backgroundSize: '4px 4px',
            }}
          />
        </motion.div>
      )}

      {/* 滑块 */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 rounded-full flex items-center justify-center"
        style={{
          width: dimensions.thumb,
          height: dimensions.thumb,
          left: checked ? dimensions.width - dimensions.thumb - 2 : 2,
          backgroundColor: checked ? colors.primary : '#333',
          boxShadow: checked
            ? `0 0 ${variant === 'neon' ? 15 : 10}px ${colors.glow}`
            : '0 2px 4px rgba(0,0,0,0.2)',
        }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {/* 图标 */}
        {showIcon && (
          <AnimatePresence mode="wait">
            {checked ? (
              <motion.svg
                key="check"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                style={{ color: '#000' }}
              >
                <path
                  d="M10 3L4.5 8.5L2 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            ) : (
              <motion.svg
                key="close"
                initial={{ scale: 0, rotate: 90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: -90 }}
                transition={{ duration: 0.2 }}
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                style={{ color: '#fff' }}
              >
                <path
                  d="M9 3L3 9M3 3L9 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </motion.svg>
            )}
          </AnimatePresence>
        )}

        {/* 光晕效果 */}
        {checked && variant !== 'default' && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${colors.glow}, transparent)`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.8, 0.4, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </motion.div>

      {/* 脉冲效果 */}
      {checked && variant === 'glow' && (
        <>
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full"
              style={{
                border: `1px solid ${colors.primary}`,
              }}
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{
                scale: [1, 1.3],
                opacity: [0.8, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.75,
                ease: 'easeOut',
              }}
            />
          ))}
        </>
      )}

      {/* 状态标签 */}
      {showLabel && variant !== 'default' && (
        <div className="absolute inset-x-0 top-full mt-1 flex justify-between text-xs font-mono">
          <span style={{ color: checked ? colors.primary : '#666' }}>
            {labelOff}
          </span>
          <span style={{ color: checked ? colors.primary : '#666' }}>
            {labelOn}
          </span>
        </div>
      )}
    </motion.button>
  );

  const renderLabel = () => {
    if (!showLabel) return null;
    const labelText = checked ? labelOn : labelOff;

    return (
      <motion.span
        className="font-mono text-sm font-medium"
        style={{
          color: checked ? colors.primary : '#999',
          textShadow: checked ? `0 0 10px ${colors.glow}` : undefined,
        }}
        animate={{
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {labelText}
      </motion.span>
    );
  };

  const getLayout = () => {
    const label = renderLabel();
    const toggle = renderToggle();

    if (!label) return toggle;

    const labelClass = labelPosition === 'left' || labelPosition === 'right' ? 'mx-3' : 'my-2';
    const flexClass =
      labelPosition === 'left' || labelPosition === 'right'
        ? 'flex-row items-center'
        : 'flex-col items-center';

    return (
      <div className={`flex ${flexClass} ${className}`}>
        {labelPosition === 'left' || labelPosition === 'top' ? (
          <>
            {<span className={labelClass}>{label}</span>}
            {toggle}
          </>
        ) : (
          <>
            {toggle}
            {<span className={labelClass}>{label}</span>}
          </>
        )}
      </div>
    );
  };

  return getLayout();
};

export default CyberToggle;
