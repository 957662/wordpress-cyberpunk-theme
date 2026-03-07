/**
 * 新功能组件类型定义
 *
 * @version 1.0.0
 * @last-updated 2026-03-07
 */

// ============================================
// 粒子网络组件类型
// ============================================

export interface ParticleNetworkProps {
  particleCount?: number;
  connectionDistance?: number;
  mouseDistance?: number;
  colors?: string[];
  className?: string;
}

// ============================================
// 加载动画组件类型
// ============================================

import { HTMLMotionProps } from 'framer-motion';

export interface CyberLoadingSpinnerProps extends HTMLMotionProps<'div'> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
  text?: string;
  showPercentage?: boolean;
  duration?: number;
}

// ============================================
// 性能监控组件类型
// ============================================

export interface PerformanceMetrics {
  fps: number;
  memory: number;
  timing: {
    domContentLoaded: number;
    loadComplete: number;
    firstPaint: number;
    firstContentfulPaint: number;
  };
  network: {
    downlink: number;
    rtt: number;
    saveData: boolean;
  };
}

export interface PerformanceMonitorProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  showFPS?: boolean;
  showMemory?: boolean;
  showTiming?: boolean;
  showNetwork?: boolean;
  updateInterval?: number;
  className?: string;
}

// ============================================
// AI 助手组件类型
// ============================================

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

export interface CyberAIAssistantProps {
  position?: 'bottom-right' | 'bottom-left';
  theme?: 'cyan' | 'purple' | 'pink';
  greeting?: string;
  suggestions?: string[];
  onSendMessage?: (message: string) => Promise<string>;
  className?: string;
}

// ============================================
// 代码编辑器组件类型
// ============================================

export interface CyberCodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: string;
  theme?: 'dark' | 'light';
  readOnly?: boolean;
  showLineNumbers?: boolean;
  showHeader?: boolean;
  showActions?: boolean;
  height?: string;
  minHeight?: string;
  maxHeight?: string;
  placeholder?: string;
  onCopy?: () => void;
  onDownload?: () => void;
  onUpload?: (file: File) => void;
  className?: string;
}

// ============================================
// 数据图表组件类型
// ============================================

export interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface CyberDataChartProps {
  data: DataPoint[];
  type?: 'bar' | 'line' | 'area' | 'pie';
  title?: string;
  description?: string;
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  animated?: boolean;
  theme?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
  onDataPointClick?: (point: DataPoint) => void;
  className?: string;
}

// ============================================
// 工具类型
// ============================================

export type CyberTheme = 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';

export type CyberSize = 'sm' | 'md' | 'lg' | 'xl';

export type CyberPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export type CyberChartType = 'bar' | 'line' | 'area' | 'pie';

export type CyberLanguage =
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'java'
  | 'cpp'
  | 'csharp'
  | 'html'
  | 'css'
  | 'json'
  | 'markdown'
  | 'bash'
  | 'sql'
  | 'rust'
  | 'go'
  | 'php'
  | 'ruby'
  | 'swift'
  | 'kotlin'
  | 'xml'
  | 'yaml';

// ============================================
// 配置类型
// ============================================

export interface CyberColors {
  primary: string;
  glow: string;
  bg: string;
}

export interface CyberThemeColors {
  cyan: CyberColors;
  purple: CyberColors;
  pink: CyberColors;
  green: CyberColors;
  yellow: CyberColors;
}

// ============================================
// 事件处理器类型
// ============================================

export type CyberEventHandler<T = void> = () => T;

export type CyberChangeHandler<T> = (value: T) => void;

export type CyberAsyncHandler<T = any, R = any> = (value: T) => Promise<R>;

// ============================================
// 默认值
// ============================================

export const DEFAULT_PARTICLE_COUNT = 80;

export const DEFAULT_CONNECTION_DISTANCE = 150;

export const DEFAULT_MOUSE_DISTANCE = 200;

export const DEFAULT_UPDATE_INTERVAL = 1000;

export const DEFAULT_CHART_HEIGHT = 300;

export const DEFAULT_EDITOR_HEIGHT = '400px';

// ============================================
// 颜色配置
// ============================================

export const CYBER_COLORS: CyberThemeColors = {
  cyan: {
    primary: '#00f0ff',
    glow: 'rgba(0, 240, 255, 0.3)',
    bg: 'rgba(0, 240, 255, 0.05)',
  },
  purple: {
    primary: '#9d00ff',
    glow: 'rgba(157, 0, 255, 0.3)',
    bg: 'rgba(157, 0, 255, 0.05)',
  },
  pink: {
    primary: '#ff0080',
    glow: 'rgba(255, 0, 128, 0.3)',
    bg: 'rgba(255, 0, 128, 0.05)',
  },
  green: {
    primary: '#00ff88',
    glow: 'rgba(0, 255, 136, 0.3)',
    bg: 'rgba(0, 255, 136, 0.05)',
  },
  yellow: {
    primary: '#f0ff00',
    glow: 'rgba(240, 255, 0, 0.3)',
    bg: 'rgba(240, 255, 0, 0.05)',
  },
};
