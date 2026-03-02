/**
 * CyberPress Additional Icons
 *
 * 补充的赛博朋克风格功能图标
 *
 * @example
 * ```tsx
 * import { ShieldIcon, ZapIcon, RocketIcon } from '@/components/graphics/AdditionalIcons';
 *
 * <ShieldIcon size={24} />
 * <ZapIcon size={24} glow />
 * <RocketIcon size={32} color="#00f0ff" />
 * ```
 */

import React from 'react';

export interface SVGIconProps {
  size?: number;
  className?: string;
  glow?: boolean;
  color?: string;
  onClick?: () => void;
}

// 基础图标组件
const SVGIcon: React.FC<SVGIconProps & { children: React.ReactNode }> = ({
  size = 24,
  className = '',
  glow = false,
  color,
  onClick,
  children
}) => {
  const glowClass = glow ? 'drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]' : '';
  const cursorClass = onClick ? 'cursor-pointer' : '';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${glowClass} ${cursorClass} ${className}`.trim()}
      onClick={onClick}
      style={{ color }}
    >
      {children}
    </svg>
  );
};

// ==================== 安全图标 ====================

/**
 * 盾牌图标 - 安全保护
 */
export const ShieldIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <path
      d="M12 2L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 12L11 14L15 10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SVGIcon>
);

/**
 * 锁图标 - 安全锁定
 */
export const ShieldLockIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <path
      d="M12 2L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect
      x="9"
      y="11"
      width="6"
      height="5"
      rx="1"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M10 11V9C10 7.89543 10.8954 7 12 7C13.1046 7 14 7.89543 14 9V11"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </SVGIcon>
);

// ==================== 性能图标 ====================

/**
 * 闪电图标 - 性能/速度
 */
export const ZapIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <polygon
      points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SVGIcon>
);

/**
 * 火焰图标 - 热门/活跃
 */
export const FlameIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <path
      d="M12 2C12 2 15 8 15 12C15 15.3137 12.3137 18 9 18C5.68629 18 3 15.3137 3 12C3 8 6 5 6 5C6 5 8 9 9 10C9 10 8.5 7 9 6C9 6 10.5 10 12 12C13.5 14 12 17 12 17C14.7614 17 17 14.7614 17 12C17 10.5 16.5 9 16 8C16 8 19 10 19 13C19 16.866 15.866 20 12 20C8.13401 20 5 16.866 5 13C5 9.5 7.5 6.5 7.5 6.5C7.5 6.5 10 9 12 10C12 8 12 5 12 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SVGIcon>
);

/**
 * 加速图标 - 性能提升
 */
export const AccelerationIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <path
      d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 12H22"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M18 8L22 12L18 16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SVGIcon>
);

// ==================== 创新图标 ====================

/**
 * 火箭图标 - 创新/启动
 */
export const RocketIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <path
      d="M4.5 16.5C4.5 16.5 5 14 7 12C9 10 12 2 12 2C12 2 15 10 17 12C19 14 19.5 16.5 19.5 16.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 2V22"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M15 19L12 22L9 19"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 12C5 12.5 3 13.5 2 15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M17 12C19 12.5 21 13.5 22 15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </SVGIcon>
);

/**
 * 灯泡图标 - 创意/想法
 */
export const LightbulbIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <path
      d="M9 18H15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M10 22H14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M12 2C8.13 2 5 5.13 5 9C5 11.38 6.19 13.47 8 14.74V17C8 17.55 8.45 18 9 18H15C15.55 18 16 17.55 16 17V14.74C17.81 13.47 19 11.38 19 9C19 5.13 15.87 2 12 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SVGIcon>
);

/**
 * 水晶球图标 - 未来/预测
 */
export const CrystalBallIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <circle
      cx="12"
      cy="12"
      r="8"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M12 8V16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M8 12H16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M20 20L16 16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </SVGIcon>
);

// ==================== 数据图标 ====================

/**
 * 数据库集群图标
 */
export const DatabaseClusterIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <ellipse
      cx="12"
      cy="5"
      rx="8"
      ry="3"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M4 5V14C4 16.2091 7.58172 18 12 18C16.4183 18 20 16.2091 20 14V5"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M4 14C4 16.2091 7.58172 18 12 18C16.4183 18 20 16.2091 20 14"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M8 21H16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="12" cy="21" r="1" fill="currentColor" />
  </SVGIcon>
);

/**
 * 图表增长图标
 */
export const ChartGrowthIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <path
      d="M3 3V16H21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M7 14L11 10L15 12L19 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19 6V10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M15 6H19"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </SVGIcon>
);

/**
 * 分析图标
 */
export const AnalyticsIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M7 14L10 11L13 13L17 9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="7" cy="14" r="1" fill="currentColor" />
    <circle cx="10" cy="11" r="1" fill="currentColor" />
    <circle cx="13" cy="13" r="1" fill="currentColor" />
    <circle cx="17" cy="9" r="1" fill="currentColor" />
  </SVGIcon>
);

// ==================== 通信图标 ====================

/**
 * 聊天机器人图标
 */
export const BotIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <rect
      x="3"
      y="11"
      width="18"
      height="10"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <circle cx="8" cy="16" r="1" fill="currentColor" />
    <circle cx="16" cy="16" r="1" fill="currentColor" />
    <path
      d="M6 11V7C6 4.23858 8.23858 2 11 2H13C15.7614 2 18 4.23858 18 7V11"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="10"
      y1="5"
      x2="10"
      y2="7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="14"
      y1="5"
      x2="14"
      y2="7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </SVGIcon>
);

/**
 * WiFi 图标
 */
export const WiFiIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <path
      d="M5 12.55C7.58097 10.1584 10.7362 8.82867 14 8.82867C17.2638 8.82867 20.419 10.1584 23 12.55"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M8.5 16C10.1512 14.6058 12.0363 13.8287 14 13.8287C15.9637 13.8287 17.8488 14.6058 19.5 16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="14" cy="20" r="1" fill="currentColor" />
  </SVGIcon>
);

/**
 * 卫星图标
 */
export const SatelliteIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <circle
      cx="12"
      cy="12"
      r="3"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M12 2V9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M12 15V22"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M2 12H9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M15 12H22"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M4.929 4.929L9.757 9.757"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M14.243 14.243L19.071 19.071"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M19.071 4.929L14.243 9.757"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M9.757 14.243L4.929 19.071"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </SVGIcon>
);

// ==================== 工具图标 ====================

/**
 * 修复工具图标
 */
export const WrenchIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <path
      d="M14.7 6.3C15.5 5.5 15.5 4.2 14.7 3.4L12.6 1.3C11.8 0.5 10.5 0.5 9.7 1.3L2 9L7 14L14.7 6.3Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 14L5 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M14.7 17.7C13.9 18.5 13.9 19.8 14.7 20.6L16.8 22.7C17.6 23.5 18.9 23.5 19.7 22.7L22 20.4L14.3 12.7L14.7 17.7Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SVGIcon>
);

/**
 * 魔法棒图标 - 快速操作
 */
export const MagicWandIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <path
      d="M18 2L4 16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M14 6L18 10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M2 18L6 22"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M16.5 5.5L18.5 7.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M14.5 7.5L16.5 9.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="8" cy="8" r="1" fill="currentColor" opacity="0.6" />
    <circle cx="19" cy="14" r="1" fill="currentColor" opacity="0.6" />
    <circle cx="21" cy="10" r="1.5" fill="currentColor" opacity="0.6" />
  </SVGIcon>
);

/**
 * 调色板图标 - 主题/样式
 */
export const PaletteIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <circle cx="8" cy="10" r="1.5" fill="currentColor" />
    <circle cx="12" cy="8" r="1.5" fill="currentColor" />
    <circle cx="16" cy="10" r="1.5" fill="currentColor" />
    <circle cx="8" cy="14" r="1.5" fill="currentColor" />
    <circle cx="16" cy="14" r="1.5" fill="currentColor" />
    <path
      d="M12 12V18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </SVGIcon>
);

// ==================== 文件图标 ====================

/**
 * 文件搜索图标
 */
export const FileSearchIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <path
      d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 2V8H20"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="11"
      cy="15"
      r="3"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M13 17L15 19"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </SVGIcon>
);

/**
 * 代码文件图标
 */
export const CodeFileIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <path
      d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 2V8H20"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 12L8 14L10 16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 12L16 14L14 16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SVGIcon>
);

/**
 * 压缩文件图标
 */
export const ArchiveIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <path
      d="M21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 8H21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M3 8L5 3H19L21 8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 12H14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M10 16H14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </SVGIcon>
);

// ==================== 其他图标 ====================

/**
 * 印章图标 - 认证
 */
export const StampIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <path
      d="M12 15L8 19H4V15L8 11L12 15Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 11L12 7L16 11L12 15L8 11Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 7V3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </SVGIcon>
);

/**
 * 地图标记图标
 */
export const MapMarkerIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <path
      d="M21 10C21 16 12 22 12 22C12 22 3 16 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
  </SVGIcon>
);

/**
 * 时区图标
 */
export const GlobeIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="2"
    />
    <ellipse
      cx="12"
      cy="12"
      rx="4"
      ry="10"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M2 12H22"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </SVGIcon>
);

/**
 * 货币图标 - 收益
 */
export const CurrencyIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M16 8H13C12.4696 8 11.9609 8.21071 11.5858 8.58579C11.2107 8.96086 11 9.46957 11 10C11 10.5304 11.2107 11.0391 11.5858 11.4142C11.9609 11.7893 12.4696 12 13 12H15C15.5304 12 16.0391 12.2107 16.4142 12.5858C16.7893 12.9609 17 13.4696 17 14C17 14.5304 16.7893 15.0391 16.4142 15.4142C16.0391 15.7893 15.5304 16 15 16H12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.5 6.5V17.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </SVGIcon>
);

export default {
  // 安全
  ShieldIcon,
  ShieldLockIcon,
  // 性能
  ZapIcon,
  FlameIcon,
  AccelerationIcon,
  // 创新
  RocketIcon,
  LightbulbIcon,
  CrystalBallIcon,
  // 数据
  DatabaseClusterIcon,
  ChartGrowthIcon,
  AnalyticsIcon,
  // 通信
  BotIcon,
  WiFiIcon,
  SatelliteIcon,
  // 工具
  WrenchIcon,
  MagicWandIcon,
  PaletteIcon,
  // 文件
  FileSearchIcon,
  CodeFileIcon,
  ArchiveIcon,
  // 其他
  StampIcon,
  MapMarkerIcon,
  GlobeIcon,
  CurrencyIcon,
};
