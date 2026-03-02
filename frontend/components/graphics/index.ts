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

// ==================== 主题图标 ====================
export {
  SunIcon as SunIconTheme,
  MoonIcon as MoonIconTheme,
  ThemeToggleIcon,
  SystemThemeIcon,
  AutoThemeIcon,
  PaletteIcon,
  ContrastIcon,
} from './ThemeIcons';

export type { ThemeToggleIconProps } from './ThemeIcons';

// ==================== 社交图标 ====================
export {
  GitHubIcon as GitHubIconSocial,
  TwitterIcon,
  LinkedInIcon,
  EmailIcon as EmailIconSocial,
  RSSIcon as RSSIconSocial,
  DiscordIcon,
  YouTubeIcon,
  DribbbleIcon,
} from './SocialIcons';

export type { SocialIconProps } from './SocialIcons';

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

// ==================== 赛博朋克图标 (最新) ====================
export {
  NeuralNetworkIcon,
  QuantumCoreIcon,
  DataStreamDecoration,
} from './CyberIcons';

export type { CyberIconProps } from './CyberIcons';

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

// ==================== 补充图标 (v2.0 新增) ====================
export {
  // 安全图标
  ShieldIcon,
  ShieldLockIcon,
  // 性能图标
  ZapIcon,
  FlameIcon,
  AccelerationIcon,
  // 创新图标
  RocketIcon,
  LightbulbIcon,
  CrystalBallIcon,
  // 数据图标
  DatabaseClusterIcon,
  ChartGrowthIcon,
  AnalyticsIcon,
  // 通信图标
  BotIcon,
  WiFiIcon,
  SatelliteIcon,
  // 工具图标
  WrenchIcon,
  MagicWandIcon,
  PaletteIcon,
  // 文件图标
  FileSearchIcon,
  CodeFileIcon,
  ArchiveIcon,
  // 其他图标
  StampIcon,
  MapMarkerIcon,
  GlobeIcon,
  CurrencyIcon,
} from './AdditionalIcons';

// ==================== 背景图案 (v2.0 新增) ====================
export {
  // 网格类
  CyberGridPattern,
  DotMatrixPattern,
  // 多边形类
  HexagonPattern,
  HoneycombPattern,
  TrianglePattern,
  DiamondPattern,
  // 电路类
  CircuitPattern,
  // 波浪类
  WavePattern,
  RadialPattern,
  // 特殊效果类
  MatrixPattern,
  CyberCompositePattern,
  HologramPattern,
} from './BackgroundPatterns';

export type { PatternProps } from './BackgroundPatterns';

// ==================== 3D 图标 (v2.0 新增) ====================
export {
  Cube3DIcon,
  Pyramid3DIcon,
  Sphere3DIcon,
  Cylinder3DIcon,
  Torus3DIcon,
  Cone3DIcon,
} from './Icon3D';

export type { Icon3DProps } from './Icon3D';

// ==================== 补充插画 (v2.0 新增) ====================
export {
  RobotIllustration,
  SpaceIllustration,
  NeuralNetworkIllustration,
  DataCenterIllustration,
} from './AdditionalIllustrations';

export type { IllustrationProps as AdditionalIllustrationProps } from './AdditionalIllustrations';

// ==================== 图标组合 (v2.0 新增) ====================
export {
  SocialIcons,
  TechStackIcons,
  FeatureIcons,
  NavigationIcons,
  ActionButtons,
  StatusBadges,
} from './IconSets';

export type {
  SocialIconsProps,
  TechStackIconsProps,
  FeatureIconsProps,
  NavigationIconsProps,
  ActionButtonsProps,
  StatusBadgesProps,
} from './IconSets';

// ==================== 图标工厂 ====================
export {
  DynamicIcon,
  IconGroup,
  IconButton,
  IconBadge,
  getIconColorClass,
  getIconSize,
} from './IconFactory';

export type { DynamicIconProps, IconGroupProps, IconButtonProps, IconBadgeProps } from './IconFactory';

// ==================== 动画图标 (Phase 2 新增) ====================
export {
  PulsingIcon,
  RotatingIcon,
  BouncingIcon,
  GlowingIcon,
  GlitchIcon,
  TypingIcon,
  FloatingIcon,
} from './AnimatedIcons';

export type {
  AnimatedIconProps,
  PulsingIconProps,
  RotatingIconProps,
  BouncingIconProps,
  GlowingIconProps,
  GlitchIconProps,
  TypingIconProps,
  FloatingIconProps,
} from './AnimatedIcons';

// ==================== 图标展示组件 (Phase 2 新增) ====================
export {
  IconGrid,
  IconGallery,
  IconToolbar,
  IconComparison,
  IconSizePreview,
} from './IconShowcase';

export type {
  IconData,
  IconShowcaseProps,
  IconCategoryData,
  IconGalleryProps,
  IconToolbarProps,
  IconComparisonProps,
  IconSizePreviewProps,
} from './IconShowcase';

// ==================== 响应式图标 (Phase 2 新增) ====================
export {
  ResponsiveIcon,
  AdaptiveIcon,
  FluidIcon,
  ContainerAwareIcon,
  ResponsiveIconGroup,
  ViewportRelativeIcon,
} from './ResponsiveIcons';

export type {
  ResponsiveIconProps,
  AdaptiveIconProps,
  FluidIconProps,
  ContainerAwareIconProps,
  ResponsiveIconGroupProps,
  ViewportRelativeIconProps,
} from './ResponsiveIcons';

// ==================== 主题感知图标 (Phase 2 新增) ====================
export {
  ThemedIcon,
  AutoThemedIcon,
  ThemeToggleIcon,
  ThemedIconGroup,
  ThemeStatusIcon,
  ThemedIconButton,
} from './ThemedIcons';

export type {
  ThemedIconProps,
  AutoThemedIconProps,
  ThemeToggleIconProps,
  ThemedIconGroupProps,
  ThemeStatusIconProps,
  ThemedIconButtonProps,
} from './ThemedIcons';

// ==================== 可访问性图标 (Phase 2 新增) ====================
export {
  AccessibleIcon,
  IconWithText,
  IconWithTooltip,
  KeyboardNavigableIcon,
  VisuallyHiddenText,
  IconButtonGroup,
} from './AccessibleIcons';

export type {
  AccessibleIconProps,
  IconWithTextProps,
  IconWithTooltipProps,
  KeyboardNavigableIconProps,
  VisuallyHiddenTextProps,
  IconButtongroupProps,
} from './AccessibleIcons';

// ==================== 配置 ====================
export {
  CYBER_COLORS,
  GRADIENTS,
  SHADOWS,
  SIZES,
  ANIMATIONS,
  ICON_CONFIG,
  LOGO_CONFIG,
  ILLUSTRATION_CONFIG,
  THEME_CONFIG,
  GRAPHICS_CONFIG,
  getColor,
  getGradient,
  getShadow,
  getIconConfig,
  getLogoConfig,
  getIllustrationConfig,
  getThemeConfig,
} from './config';

export type { CyberColor, GradientType } from './config';

// ==================== 工具函数 ====================
export {
  hexToRgb,
  rgbToHex,
  getLuminance,
  getContrastRatio,
  getContrastColor,
  adjustBrightness,
  blendColors,
  svgToString,
  downloadSVG,
  svgToPng,
  downloadPNG,
  calculateAspectRatio,
  sizeToPx,
  generateUniqueId,
  toKebabCase,
  toPascalCase,
  isValidHexColor,
  isValidSvgElement,
  isValidSize,
  prefersReducedMotion,
  prefersDarkMode,
  prefersHighContrast,
  debounce,
  throttle,
  delay,
  utils,
} from './utils';

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
  DISCORD: 'discord',
  YOUTUBE: 'youtube',
  DRIBBBLE: 'dribbble',

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

// 赛博朋克图标类型常量
export const CYBER_ICON_TYPES = {
  NEURAL_NETWORK: 'neural-network',
  QUANTUM_CORE: 'quantum-core',
  DATA_STREAM: 'data-stream',
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
  // v2.0 新增
  ROBOT: 'robot',
  SPACE: 'space',
  NEURAL_NETWORK: 'neural-network',
  DATA_CENTER: 'data-center',
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
  const iconMap: Record<string, React.ComponentType<any>> = {
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
    discord: DiscordIcon,
    youtube: YouTubeIcon,
    dribbble: DribbbleIcon,

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

    // 赛博朋克图标
    'neural-network': NeuralNetworkIcon,
    'quantum-core': QuantumCoreIcon,
    'data-stream': DataStreamDecoration,
  };

  return iconMap[name] || null;
};

/**
 * 根据名称获取 Logo 组件
 * @param variant Logo 变体
 * @returns Logo 组件或 null
 */
export const getLogoByVariant = (variant: string) => {
  const logoMap: Record<string, React.ComponentType<any>> = {
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
  const illustrationMap: Record<string, React.ComponentType<any>> = {
    'cyber-city': CyberCityIllustration,
    'code-screen': CodeScreenIllustration,
    network: NetworkIllustration,
    'server-rack': ServerRackIllustration,
    'circuit-board': CircuitBoardIllustration,
    workspace: WorkspaceIllustration,
    // v2.0 新增
    robot: RobotIllustration,
    space: SpaceIllustration,
    'neural-network': NeuralNetworkIllustration,
    'data-center': DataCenterIllustration,
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

  // Factory
  DynamicIcon,
  IconButton,

  // Phase 2: Animated Icons
  AnimatedIcons: {
    PulsingIcon,
    RotatingIcon,
    BouncingIcon,
    GlowingIcon,
    GlitchIcon,
    TypingIcon,
    FloatingIcon,
  },

  // Phase 2: Icon Showcase
  IconShowcase: {
    IconGrid,
    IconGallery,
    IconToolbar,
    IconComparison,
    IconSizePreview,
  },

  // Phase 2: Responsive Icons
  ResponsiveIcons: {
    ResponsiveIcon,
    AdaptiveIcon,
    FluidIcon,
    ContainerAwareIcon,
    ResponsiveIconGroup,
    ViewportRelativeIcon,
  },

  // Phase 2: Themed Icons
  ThemedIcons: {
    ThemedIcon,
    AutoThemedIcon,
    ThemeToggleIcon,
    ThemedIconGroup,
    ThemeStatusIcon,
    ThemedIconButton,
  },

  // Phase 2: Accessible Icons
  AccessibleIcons: {
    AccessibleIcon,
    IconWithText,
    IconWithTooltip,
    KeyboardNavigableIcon,
    VisuallyHiddenText,
    IconButtonGroup,
  },

  // Constants
  ICON_NAMES,
  LOGO_VARIANTS,
  DECORATION_TYPES,
  ILLUSTRATION_NAMES,

  // Config
  GRAPHICS_CONFIG,

  // Utils
  utils,

  // Helpers
  getIconByName,
  getLogoByVariant,
  getIllustrationByName,
};
