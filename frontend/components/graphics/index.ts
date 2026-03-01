/**
 * CyberPress Graphics Components
 *
 * 图形组件库统一导出
 *
 * @example
 * ```tsx
 * // 导入图标
 * import { HomeIcon, GitHubIcon, SearchIcon } from '@/components/graphics';
 *
 * // 导入 Logo
 * import { MainLogo, SquareLogo } from '@/components/graphics';
 *
 * // 导入装饰元素
 * import { CornerBracket, DividerLine, LoadingRing } from '@/components/graphics';
 *
 * // 导入插画
 * import { CyberCityIllustration, CodeScreenIllustration } from '@/components/graphics';
 * ```
 */

// ==================== SVG 图标 ====================
export {
  // 导航图标
  HomeIcon,
  BlogIcon,
  PortfolioIcon,
  AboutIcon,
  SearchIcon,
  MenuIcon,
  CloseIcon,

  // 社交媒体图标
  GitHubIcon,
  TwitterIcon,
  LinkedInIcon,
  EmailIcon,
  RSSIcon,

  // UI 图标
  UserIcon,
  SettingsIcon,
  BellIcon,
  CommentIcon,

  // 操作图标
  EditIcon,
  DeleteIcon,
  SaveIcon,
  CopyIcon,
  DownloadIcon,
  UploadIcon,

  // 状态图标
  CheckIcon,
  WarningIcon,
  ErrorIcon,
  InfoIcon,
  LockIcon,
  UnlockIcon,

  // 主题图标
  SunIcon,
  MoonIcon,

  // 媒体图标
  ImageIcon,
  VideoIcon,
  CodeIcon,
  FolderIcon,
  TagIcon,
  CalendarIcon,
  ClockIcon,

  // 开发图标
  TerminalIcon,
  DatabaseIcon,
  ServerIcon,
  CloudIcon,

  // 其他图标
  ExternalLinkIcon,
  StarIcon,
  HeartIcon,
  ShareIcon,
  FilterIcon,
  SortIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  RefreshIcon,
} from './SVGIcons';

export type { SVGIconProps } from './SVGIcons';

// ==================== Logo 组件 ====================
export {
  MainLogo,
  SquareLogo,
  FaviconLogo,
  MinimalLogo,
  TextLogo,
  WatermarkLogo,
  AnimatedLogo,
} from './Logos';

export type { LogoProps } from './Logos';

// ==================== 装饰元素 ====================
export {
  CornerBracket,
  DividerLine,
  LoadingRing,
  PulseLoader,
  HexLoader,
  PatternBackground,
  TechBorder,
  Scanlines,
  GlitchOverlay,
} from './Decorations';

export type {
  CornerBracketProps,
  DividerLineProps,
  LoadingRingProps,
  PatternBackgroundProps,
  TechBorderProps,
  DecorationProps,
} from './Decorations';

// ==================== 插画组件 ====================
export {
  CyberCityIllustration,
  CodeScreenIllustration,
  NetworkIllustration,
  ServerRackIllustration,
  CircuitBoardIllustration,
  WorkspaceIllustration,
} from './Illustrations';

export type { IllustrationProps } from './Illustrations';

// ==================== 常量 ====================

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
  DELETE: 'delete',
  SAVE: 'save',
  COPY: 'copy',
  DOWNLOAD: 'download',
  UPLOAD: 'upload',

  // Status
  CHECK: 'check',
  WARNING: 'warning',
  ERROR: 'error',
  INFO: 'info',
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
  TAG: 'tag',
  CALENDAR: 'calendar',
  CLOCK: 'clock',

  // Dev
  TERMINAL: 'terminal',
  DATABASE: 'database',
  SERVER: 'server',
  CLOUD: 'cloud',

  // Other
  EXTERNAL_LINK: 'external-link',
  STAR: 'star',
  HEART: 'heart',
  SHARE: 'share',
  FILTER: 'filter',
  SORT: 'sort',
  ARROW_UP: 'arrow-up',
  ARROW_DOWN: 'arrow-down',
  ARROW_LEFT: 'arrow-left',
  ARROW_RIGHT: 'arrow-right',
  REFRESH: 'refresh',
} as const;

// Logo 变体常量
export const LOGO_VARIANTS = {
  MAIN: 'main',
  SQUARE: 'square',
  FAVICON: 'favicon',
  MINIMAL: 'minimal',
  TEXT: 'text',
  WATERMARK: 'watermark',
  ANIMATED: 'animated',
} as const;

// 装饰类型常量
export const DECORATION_TYPES = {
  CORNER_BRACKET: 'corner-bracket',
  DIVIDER_LINE: 'divider-line',
  LOADING_RING: 'loading-ring',
  PULSE_LOADER: 'pulse-loader',
  HEX_LOADER: 'hex-loader',
  PATTERN_BACKGROUND: 'pattern-background',
  TECH_BORDER: 'tech-border',
  SCANLINES: 'scanlines',
  GLITCH_OVERLAY: 'glitch-overlay',
} as const;

// 插画名称常量
export const ILLUSTRATION_NAMES = {
  CYBER_CITY: 'cyber-city',
  CODE_SCREEN: 'code-screen',
  NETWORK: 'network',
  SERVER_RACK: 'server-rack',
  CIRCUIT_BOARD: 'circuit-board',
  WORKSPACE: 'workspace',
} as const;

// 分割线类型常量
export const DIVIDER_VARIANTS = {
  SIMPLE: 'simple',
  DOUBLE: 'double',
  DASHED: 'dashed',
  TECH: 'tech',
} as const;

// 图案类型常量
export const PATTERN_VARIANTS = {
  GRID: 'grid',
  DOTS: 'dots',
  HEXAGONS: 'hexagons',
  CIRCUIT: 'circuit',
} as const;

// ==================== 辅助函数 ====================

/**
 * 根据名称获取图标组件
 * @param name 图标名称
 * @returns 图标组件或 null
 */
export const getIconByName = (name: string) => {
  const iconMap: Record<string, React.ComponentType<SVGIconProps>> = {
    home: HomeIcon,
    blog: BlogIcon,
    portfolio: PortfolioIcon,
    about: AboutIcon,
    search: SearchIcon,
    menu: MenuIcon,
    close: CloseIcon,

    github: GitHubIcon,
    twitter: TwitterIcon,
    linkedin: LinkedInIcon,
    email: EmailIcon,
    rss: RSSIcon,

    user: UserIcon,
    settings: SettingsIcon,
    bell: BellIcon,
    comment: CommentIcon,

    edit: EditIcon,
    delete: DeleteIcon,
    save: SaveIcon,
    copy: CopyIcon,
    download: DownloadIcon,
    upload: UploadIcon,

    check: CheckIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
    lock: LockIcon,
    unlock: UnlockIcon,

    sun: SunIcon,
    moon: MoonIcon,

    image: ImageIcon,
    video: VideoIcon,
    code: CodeIcon,
    folder: FolderIcon,
    tag: TagIcon,
    calendar: CalendarIcon,
    clock: ClockIcon,

    terminal: TerminalIcon,
    database: DatabaseIcon,
    server: ServerIcon,
    cloud: CloudIcon,

    'external-link': ExternalLinkIcon,
    star: StarIcon,
    heart: HeartIcon,
    share: ShareIcon,
    filter: FilterIcon,
    sort: SortIcon,
    'arrow-up': ArrowUpIcon,
    'arrow-down': ArrowDownIcon,
    'arrow-left': ArrowLeftIcon,
    'arrow-right': ArrowRightIcon,
    refresh: RefreshIcon,
  };

  return iconMap[name] || null;
};

/**
 * 根据名称获取 Logo 组件
 * @param variant Logo 变体
 * @returns Logo 组件或 null
 */
export const getLogoByVariant = (variant: string) => {
  const logoMap: Record<string, React.ComponentType<LogoProps>> = {
    main: MainLogo,
    square: SquareLogo,
    favicon: FaviconLogo,
    minimal: MinimalLogo,
    text: TextLogo,
    watermark: WatermarkLogo,
    animated: AnimatedLogo,
  };

  return logoMap[variant] || null;
};

/**
 * 根据名称获取插画组件
 * @param name 插画名称
 * @returns 插画组件或 null
 */
export const getIllustrationByName = (name: string) => {
  const illustrationMap: Record<string, React.ComponentType<IllustrationProps>> = {
    'cyber-city': CyberCityIllustration,
    'code-screen': CodeScreenIllustration,
    network: NetworkIllustration,
    'server-rack': ServerRackIllustration,
    'circuit-board': CircuitBoardIllustration,
    workspace: WorkspaceIllustration,
  };

  return illustrationMap[name] || null;
};

// ==================== TypeScript 类型 ====================

export type IconName = typeof ICON_NAMES[keyof typeof ICON_NAMES];
export type LogoVariant = typeof LOGO_VARIANTS[keyof typeof LOGO_VARIANTS];
export type DecorationType = typeof DECORATION_TYPES[keyof typeof DECORATION_TYPES];
export type IllustrationName = typeof ILLUSTRATION_NAMES[keyof typeof ILLUSTRATION_NAMES];
export type DividerVariant = typeof DIVIDER_VARIANTS[keyof typeof DIVIDER_VARIANTS];
export type PatternVariant = typeof PATTERN_VARIANTS[keyof typeof PATTERN_VARIANTS];

// ==================== 默认导出 ====================

export default {
  // Icons
  HomeIcon,
  GitHubIcon,
  SearchIcon,

  // Logos
  MainLogo,
  SquareLogo,

  // Decorations
  CornerBracket,
  DividerLine,
  LoadingRing,

  // Illustrations
  CyberCityIllustration,
  CodeScreenIllustration,

  // Constants
  ICON_NAMES,
  LOGO_VARIANTS,
  DECORATION_TYPES,
  ILLUSTRATION_NAMES,

  // Helpers
  getIconByName,
  getLogoByVariant,
  getIllustrationByName,
};
