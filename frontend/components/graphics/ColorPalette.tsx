/**
 * CyberPress Color Palette Component
 *
 * 赛博朋克配色方案展示组件
 *
 * @example
 * ```tsx
 * import { ColorPalette } from '@/components/graphics/ColorPalette';
 *
 * <ColorPalette variant="compact" />
 * ```
 */

import React from 'react';

// 颜色接口
export interface Color {
  name: string;
  hex: string;
  rgb: string;
  usage: string;
}

// 颜色集合
const COLORS = {
  primary: [
    { name: '霓虹青', hex: '#00f0ff', rgb: 'rgb(0, 240, 255)', usage: '主要强调色' },
    { name: '赛博紫', hex: '#9d00ff', rgb: 'rgb(157, 0, 255)', usage: '次要强调色' },
    { name: '激光粉', hex: '#ff0080', rgb: 'rgb(255, 0, 128)', usage: '警告/重要' },
    { name: '电压黄', hex: '#f0ff00', rgb: 'rgb(240, 255, 0)', usage: '高亮/装饰' },
    { name: '矩阵绿', hex: '#00ff88', rgb: 'rgb(0, 255, 136)', usage: '成功状态' },
  ],
  neutral: [
    { name: '深空黑', hex: '#0a0a0f', rgb: 'rgb(10, 10, 15)', usage: '主背景' },
    { name: '深灰', hex: '#111111', rgb: 'rgb(17, 17, 17)', usage: '卡片背景' },
    { name: '中灰', hex: '#222222', rgb: 'rgb(34, 34, 34)', usage: '边框/分隔' },
    { name: '浅灰', hex: '#666666', rgb: 'rgb(102, 102, 102)', usage: '次要文字' },
    { name: '白色', hex: '#ffffff', rgb: 'rgb(255, 255, 255)', usage: '主要文字' },
  ],
};

// 渐变接口
export interface Gradient {
  name: string;
  value: string;
}

const GRADIENTS: Gradient[] = [
  {
    name: '主渐变',
    value: 'linear-gradient(135deg, #00f0ff 0%, #9d00ff 50%, #ff0080 100%)',
  },
  {
    name: '霓虹渐变',
    value: 'linear-gradient(90deg, #00f0ff 0%, #9d00ff 100%)',
  },
  {
    name: '热力渐变',
    value: 'linear-gradient(90deg, #9d00ff 0%, #ff0080 100%)',
  },
  {
    name: '冷光渐变',
    value: 'linear-gradient(180deg, #f0ff00 0%, #00f0ff 100%)',
  },
];

// 组件属性
export interface ColorPaletteProps {
  /** 显示变体 */
  variant?: 'full' | 'compact' | 'minimal';
  /** 额外的 CSS 类名 */
  className?: string;
}

/**
 * 单个颜色卡片
 */
const ColorCard: React.FC<{ color: Color; size?: 'small' | 'normal' }> = ({ color, size = 'normal' }) => {
  const sizeClass = size === 'small' ? 'w-20 h-20' : 'w-32 h-32';

  return (
    <div className={`flex flex-col items-center gap-2 ${size === 'normal' ? 'p-4' : 'p-2'}`}>
      <div
        className={`${sizeClass} rounded-lg shadow-lg transition-transform hover:scale-105`}
        style={{ backgroundColor: color.hex }}
      />
      <div className="text-center">
        <p className="text-sm font-semibold text-cyber-cyan">{color.name}</p>
        <p className="text-xs text-gray-400">{color.hex}</p>
        {size === 'normal' && (
          <p className="text-xs text-gray-500 mt-1">{color.usage}</p>
        )}
      </div>
    </div>
  );
};

/**
 * 完整配色方案
 */
export const ColorPalette: React.FC<ColorPaletteProps> = ({
  variant = 'full',
  className = ''
}) => {
  if (variant === 'minimal') {
    return (
      <div className={`flex gap-4 ${className}`}>
        {COLORS.primary.map(color => (
          <div key={color.hex} className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded"
              style={{ backgroundColor: color.hex }}
            />
            <span className="text-xs text-gray-400">{color.name}</span>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`space-y-6 ${className}`}>
        {/* 主色系 */}
        <div>
          <h3 className="text-sm font-semibold text-cyber-cyan mb-3">主色系</h3>
          <div className="flex flex-wrap gap-4">
            {COLORS.primary.map(color => (
              <ColorCard key={color.hex} color={color} size="small" />
            ))}
          </div>
        </div>

        {/* 中性色 */}
        <div>
          <h3 className="text-sm font-semibold text-cyber-purple mb-3">中性色</h3>
          <div className="flex flex-wrap gap-4">
            {COLORS.neutral.map(color => (
              <ColorCard key={color.hex} color={color} size="small" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* 主色系 */}
      <div>
        <h3 className="text-lg font-semibold text-cyber-cyan mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyber-cyan" />
          主色系 - Primary Colors
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {COLORS.primary.map(color => (
            <ColorCard key={color.hex} color={color} />
          ))}
        </div>
      </div>

      {/* 中性色 */}
      <div>
        <h3 className="text-lg font-semibold text-cyber-purple mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyber-purple" />
          中性色 - Neutral Colors
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {COLORS.neutral.map(color => (
            <ColorCard key={color.hex} color={color} />
          ))}
        </div>
      </div>

      {/* 渐变 */}
      <div>
        <h3 className="text-lg font-semibold text-cyber-pink mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyber-pink" />
          渐变组合 - Gradients
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {GRADIENTS.map((gradient, index) => (
            <div key={index} className="space-y-2">
              <div
                className="h-24 rounded-lg shadow-lg"
                style={{ background: gradient.value }}
              />
              <p className="text-sm text-gray-400 text-center">{gradient.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 代码示例 */}
      <div>
        <h3 className="text-lg font-semibold text-cyber-yellow mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyber-yellow" />
          CSS 代码 - CSS Code
        </h3>
        <div className="bg-dark-gray rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-gray-300">
{`:root {
  /* 主色系 */
  --color-cyan: #00f0ff;
  --color-purple: #9d00ff;
  --color-pink: #ff0080;
  --color-yellow: #f0ff00;
  --color-green: #00ff88;

  /* 中性色 */
  --color-black: #0a0a0f;
  --color-dark-gray: #111111;
  --color-medium-gray: #222222;
  --color-light-gray: #666666;
  --color-white: #ffffff;

  /* 渐变 */
  --gradient-main: linear-gradient(135deg, #00f0ff 0%, #9d00ff 50%, #ff0080 100%);
}`}
          </pre>
        </div>
      </div>

      {/* Tailwind 配置 */}
      <div>
        <h3 className="text-lg font-semibold text-cyber-cyan mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyber-cyan" />
          Tailwind CSS - Tailwind Config
        </h3>
        <div className="bg-dark-gray rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-gray-300">
{`// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'cyber-cyan': '#00f0ff',
        'cyber-purple': '#9d00ff',
        'cyber-pink': '#ff0080',
        'cyber-yellow': '#f0ff00',
        'cyber-green': '#00ff88',
        'deep-black': '#0a0a0f',
        'dark-gray': '#111111',
        'medium-gray': '#222222',
        'light-gray': '#666666',
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(135deg, #00f0ff 0%, #9d00ff 50%, #ff0080 100%)',
        'neon-gradient': 'linear-gradient(90deg, #00f0ff 0%, #9d00ff 100%)',
      },
    },
  },
}`}
          </pre>
        </div>
      </div>
    </div>
  );
};

/**
 * 快速颜色选择器
 */
export const ColorPicker: React.FC<{
  value: string;
  onChange: (color: string) => void;
  className?: string;
}> = ({ value, onChange, className = '' }) => {
  const allColors = [...COLORS.primary, ...COLORS.neutral];

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {allColors.map(color => (
        <button
          key={color.hex}
          className={`w-8 h-8 rounded transition-transform hover:scale-110 ${
            value === color.hex ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : ''
          }`}
          style={{ backgroundColor: color.hex }}
          onClick={() => onChange(color.hex)}
          title={color.name}
        />
      ))}
    </div>
  );
};

/**
 * 颜色样本按钮
 */
export const ColorSwatch: React.FC<{
  color: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}> = ({ color, size = 'md', className = '', onClick }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-lg cursor-pointer transition-transform hover:scale-105 shadow-lg ${className}`}
      style={{ backgroundColor: color }}
      onClick={onClick}
    />
  );
};

export default ColorPalette;
