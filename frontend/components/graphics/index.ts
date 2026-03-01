/**
 * CyberPress Graphics Components
 *
 * 图形组件库导出
 *
 * @example
 * ```tsx
 * import { Icon, LogoDisplay, Illustration } from '@/components/graphics';
 *
 * <Icon name="home" size={24} />
 * <LogoDisplay variant="main" size={200} />
 * <Illustration name="cyber-city" />
 * ```
 */

export { Icon } from './Icon';
export type { IconProps } from './Icon';

export { LogoDisplay } from './LogoDisplay';
export type { LogoDisplayProps } from './LogoDisplay';

export { Illustration } from './Illustration';
export type { IllustrationProps } from './Illustration';

export { PatternBackground } from './PatternBackground';
export type { PatternBackgroundProps } from './PatternBackground';

export { Decoration } from './Decoration';
export type { DecorationProps } from './Decoration';

// 图标名称常量，避免硬编码
export const ICON_NAMES = {
  // Navigation
  HOME: 'home',
  BLOG: 'blog',
  PORTFOLIO: 'portfolio',
  ABOUT: 'about',
  SEARCH: 'search',
  MENU: 'menu',

  // Social
  GITHUB: 'github',
  TWITTER: 'twitter',
  LINKEDIN: 'linkedin',
  EMAIL: 'email',
  RSS: 'rss',

  // UI
  USER: 'user',
  SETTINGS: 'settings',
  BELL: 'bell',
  COMMENT: 'comment',

  // Actions
  EDIT: 'edit',
  TRASH: 'trash',
  SAVE: 'save',
  COPY: 'copy',
  DOWNLOAD: 'download',
  UPLOAD: 'upload',

  // Status
  CHECK: 'check',
  ALERT: 'alert',
  CLOSE: 'close',
  LOCK: 'lock',
  UNLOCK: 'unlock',

  // Theme
  SUN: 'sun',
  MOON: 'moon',

  // Media
  IMAGE: 'image',
  VIDEO: 'video',
  CODE: 'code',
  FOLDER: 'folder',

  // Dev
  TERMINAL: 'terminal',
  DATABASE: 'database',
  SERVER: 'server',
  CLOUD: 'cloud',
} as const;

// 插画名称常量
export const ILLUSTRATION_NAMES = {
  CYBER_CITY: 'cyber-city',
  DEVELOPER_WORKSPACE: 'developer-workspace',
  NETWORK_NODES: 'network-nodes',
  SERVER_RACK: 'server-rack',
  CODE_SCREEN: 'code-screen',
  CIRCUIT_BOARD: 'circuit-board',
  NETWORK_GLOBE: 'network-globe',
} as const;

// 图案名称常量
export const PATTERN_NAMES = {
  GRID: 'grid',
  CIRCUIT: 'circuit',
  SCANLINES: 'scanlines',
  NOISE: 'noise',
  HEXAGON: 'hexagon',
  MATRIX: 'matrix',
  HOLOGRAPHIC: 'holographic',
  HEX_GRID: 'hex-grid',
} as const;

// 装饰类型常量
export const DECORATION_TYPES = {
  CORNER_BRACKET: 'corner-bracket',
  DIVIDER: 'divider',
  LOADER: 'loader',
} as const;
