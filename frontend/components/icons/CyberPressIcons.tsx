/**
 * CyberPress Icon Library - 统一导出
 *
 * 赛博朋克风格的完整图标库
 *
 * @example
 * ```tsx
 * // 导入所有图标
 * import * as Icons from '@/components/icons/CyberPressIcons';
 *
 * // 使用图标
 * <Icons.SearchIcon size={24} variant="cyan" />
 * <Icons.GitHubIcon size={32} variant="purple" />
 *
 * // 或按需导入
 * import { SearchIcon, GitHubIcon } from '@/components/icons/CyberPressIcons';
 * ```
 */

// ==================== 导航图标 ====================
export { default as HomeIcon } from './HomeIcon';
export { default as BlogIcon } from './BlogIcon';
export { default as PortfolioIcon } from './PortfolioIcon';
export { default as SearchIcon } from './SearchIcon';
export { default as ArrowRightIcon } from './ArrowRightIcon';
export { default as ArrowLeftIcon } from './ArrowLeftIcon';
export { default as ArrowIcon } from './ArrowIcon';
export { default as ChevronRightIcon } from './ChevronRightIcon';
export { default as ChevronLeftIcon } from './ChevronLeftIcon';
export { default as ChevronUpIcon } from './ChevronUpIcon';
export { default as ChevronDownIcon } from './ChevronDownIcon';

// ==================== 社交媒体图标 ====================
export { default as GitHubIcon } from './GitHubIcon';
export { default as TwitterIcon } from './TwitterIcon';
export { default as DiscordIcon } from './DiscordIcon';
export { default as YouTubeIcon } from './YouTubeIcon';
export { default as DribbbleIcon } from './DribbbleIcon';
export { default as LinkedInIcon } from './LinkedInIcon';
export { default as EmailIcon } from './EmailIcon';
export { default as RSSIcon } from './RSSIcon';

// ==================== UI 元素图标 ====================
export { default as CalendarIcon } from './CalendarIcon';
export { default as TagIcon } from './TagIcon';
export { default as StarIcon } from './StarIcon';
export { default as UserIcon } from './UserIcon';
export { default as SettingsIcon } from './SettingsIcon';
export { default as CodeIcon } from './CodeIcon';
export { default as TerminalIcon } from './TerminalIcon';
export { default as CheckIcon } from './CheckIcon';
export { default as WarningIcon } from './WarningIcon';
export { default as ErrorIcon } from './ErrorIcon';
export { default as InfoIcon } from './InfoIcon';
export { default as ShieldLockIcon } from './ShieldLockIcon';
export { default as LockIcon } from './LockIcon';
export { default as UnlockIcon } from './UnlockIcon';
export { default as EyeIcon } from './EyeIcon';
export { default as EyeOffIcon } from './EyeOffIcon';
export { default as ThemeIcon } from './ThemeIcon';

// ==================== 操作图标 ====================
export { default as MenuIcon } from './MenuIcon';
export { default as CloseIcon } from './CloseIcon';
export { default as LoadingIcon } from './LoadingIcon';
export { default as ExternalLinkIcon } from './ExternalLinkIcon';
export { default as HeartIcon } from './HeartIcon';
export { default as CommentIcon } from './CommentIcon';
export { default as ShareIcon } from './ShareIcon';
export { default as CopyIcon } from './CopyIcon';
export { default as FilterIcon } from './FilterIcon';
export { default as SortIcon } from './SortIcon';
export { default as DownloadIcon } from './DownloadIcon';
export { default as UploadIcon } from './UploadIcon';
export { default as EditIcon } from './EditIcon';
export { default as TrashIcon } from './TrashIcon';
export { default as SaveIcon } from './SaveIcon';
export { default as RefreshIcon } from './RefreshIcon';
export { default as BookmarkIcon } from './BookmarkIcon';

// ==================== 文件系统图标 ====================
export { default as FileIcon } from './FileIcon';
export { default as ArchiveIcon } from './ArchiveIcon';
export { default as FolderIcon } from './FolderIcon';

// ==================== 媒体图标 ====================
export { default as MusicIcon } from './MusicIcon';
export { default as CameraIcon } from './CameraIcon';
export { default as VideoIcon } from './VideoIcon';
export { default as MicIcon } from './MicIcon';

// ==================== 状态图标 ====================
export { default as OnlineIcon } from './OnlineIcon';
export { default as OfflineIcon } from './OfflineIcon';
export { default as SyncIcon } from './SyncIcon';

// ==================== 工具图标 ====================
export { default as GlobeIcon } from './GlobeIcon';
export { default as ZapIcon } from './ZapIcon';
export { default as BellIcon } from './BellIcon';

// ==================== 赛博科技图标 ====================
export { default as CyberIcon } from './CyberIcon';
export { default as CpuIcon } from './CpuIcon';
export { default as ChipIcon } from './ChipIcon';
export { default as DatabaseIcon } from './DatabaseIcon';
export { default as NetworkIcon } from './NetworkIcon';
export { default as HologramIcon } from './HologramIcon';

// ==================== Logo 相关 ====================
export { default as LogoIcon } from './LogoIcon';
export { default as LogoMark } from './CyberPressLogo';

// ==================== 特效图标 ====================
export { default as CyberGlitchIcon } from './CyberGlitchIcon';
export { default as CyberMatrixIcon } from './CyberMatrixIcon';
export { default as CyberNodeIcon } from './CyberNodeIcon';
export { default as CyberShieldIcon } from './CyberShieldIcon';
export { default as CyberHoloIcon } from './CyberHoloIcon';
export { default as CyberDataIcon } from './CyberDataIcon';

// ==================== 图标集合导出 ====================
export { default as NavigationIcons } from './NavigationIcons';
export { default as SocialIcons } from './SocialIcons';
export { default as ThemeIcons } from './ThemeIcons';
export { default as UtilityIcons } from './UtilityIcons';
export { default as FeatureIcons } from './FeatureIcons';
export { default as StatusIcons } from './StatusIcons';
export { default as SpecialEffectsIcons } from './SpecialEffectsIcons';
export { default as DecorativeIcons } from './DecorativeIcons';
export { default as MediaIcons } from './MediaIcons';
export { default as MenuIcons } from './MenuIcons';

// ==================== 类型定义 ====================

/**
 * 图标尺寸类型
 */
export type IconSize = 12 | 16 | 20 | 24 | 32 | 48 | 64;

/**
 * 图标颜色变体
 */
export type IconVariant = 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';

/**
 * 基础图标属性
 */
export interface BaseIconProps {
  /** 图标尺寸 */
  size?: IconSize | number;
  /** 颜色变体 */
  variant?: IconVariant;
  /** 额外的 CSS 类名 */
  className?: string;
  /** 是否启用动画 */
  animated?: boolean;
  /** 自定义颜色 */
  color?: string;
  /** 点击事件 */
  onClick?: () => void;
}

/**
 * 导出所有图标类型
 */
export type IconComponent = React.FC<BaseIconProps>;

/**
 * 图标映射类型 - 用于动态图标渲染
 */
export interface IconMap {
  [key: string]: IconComponent;
}

/**
 * 预设的图标映射
 */
export const iconMap: IconMap = {
  // 导航
  home: HomeIcon,
  blog: BlogIcon,
  portfolio: PortfolioIcon,
  search: SearchIcon,

  // 社交
  github: GitHubIcon,
  twitter: TwitterIcon,
  discord: DiscordIcon,
  youtube: YouTubeIcon,
  dribbble: DribbbleIcon,
  linkedin: LinkedInIcon,
  email: EmailIcon,
  rss: RSSIcon,

  // UI 元素
  calendar: CalendarIcon,
  tag: TagIcon,
  star: StarIcon,
  user: UserIcon,
  settings: SettingsIcon,
  code: CodeIcon,
  terminal: TerminalIcon,
  check: CheckIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
  shield: ShieldLockIcon,
  lock: LockIcon,
  unlock: UnlockIcon,
  eye: EyeIcon,
  eyeOff: EyeOffIcon,
  theme: ThemeIcon,

  // 操作
  menu: MenuIcon,
  close: CloseIcon,
  loading: LoadingIcon,
  externalLink: ExternalLinkIcon,
  heart: HeartIcon,
  comment: CommentIcon,
  share: ShareIcon,
  copy: CopyIcon,
  filter: FilterIcon,
  sort: SortIcon,
  download: DownloadIcon,
  upload: UploadIcon,
  edit: EditIcon,
  trash: TrashIcon,
  save: SaveIcon,
  refresh: RefreshIcon,
  bookmark: BookmarkIcon,

  // 文件
  file: FileIcon,
  archive: ArchiveIcon,
  folder: FolderIcon,

  // 媒体
  music: MusicIcon,
  camera: CameraIcon,
  video: VideoIcon,
  mic: MicIcon,

  // 状态
  online: OnlineIcon,
  offline: OfflineIcon,
  sync: SyncIcon,

  // 工具
  globe: GlobeIcon,
  zap: ZapIcon,
  bell: BellIcon,

  // 赛博科技
  cyber: CyberIcon,
  cpu: CpuIcon,
  chip: ChipIcon,
  database: DatabaseIcon,
  network: NetworkIcon,
  hologram: HologramIcon,
};

/**
 * 根据名称获取图标组件
 *
 * @example
 * ```tsx
 * import { getIcon } from '@/components/icons/CyberPressIcons';
 *
 * const MyIcon = getIcon('search');
 * <MyIcon size={24} variant="cyan" />
 * ```
 */
export function getIcon(name: string): IconComponent {
  return iconMap[name] || HomeIcon;
}

/**
 * 获取所有可用图标名称列表
 *
 * @example
 * ```tsx
 * import { getIconNames } from '@/components/icons/CyberPressIcons';
 *
 * const iconNames = getIconNames();
 * // ['home', 'blog', 'portfolio', 'search', ...]
 * ```
 */
export function getIconNames(): string[] {
  return Object.keys(iconMap);
}

/**
 * 图标分组
 */
export const iconGroups = {
  navigation: ['home', 'blog', 'portfolio', 'search'],
  social: ['github', 'twitter', 'discord', 'youtube', 'dribbble', 'linkedin', 'email', 'rss'],
  ui: ['calendar', 'tag', 'star', 'user', 'settings', 'code', 'terminal'],
  actions: ['menu', 'close', 'loading', 'share', 'download', 'upload', 'edit', 'trash', 'save'],
  files: ['file', 'archive', 'folder'],
  media: ['music', 'camera', 'video', 'mic'],
  status: ['online', 'offline', 'sync'],
  tools: ['globe', 'zap', 'bell'],
  cyber: ['cyber', 'cpu', 'chip', 'database', 'network', 'hologram'],
} as const;

/**
 * 获取指定分组的图标名称
 */
export function getIconsByGroup(group: keyof typeof iconGroups): string[] {
  return iconGroups[group] || [];
}

/**
 * 默认导出 - 所有图标
 */
export default {
  // 导航
  HomeIcon,
  BlogIcon,
  PortfolioIcon,
  SearchIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ChevronUpIcon,
  ChevronDownIcon,

  // 社交
  GitHubIcon,
  TwitterIcon,
  DiscordIcon,
  YouTubeIcon,
  DribbbleIcon,
  LinkedInIcon,
  EmailIcon,
  RSSIcon,

  // UI
  CalendarIcon,
  TagIcon,
  StarIcon,
  UserIcon,
  SettingsIcon,
  CodeIcon,
  TerminalIcon,
  CheckIcon,
  WarningIcon,
  ErrorIcon,
  InfoIcon,
  ShieldLockIcon,
  LockIcon,
  UnlockIcon,
  EyeIcon,
  EyeOffIcon,
  ThemeIcon,

  // 操作
  MenuIcon,
  CloseIcon,
  LoadingIcon,
  ExternalLinkIcon,
  HeartIcon,
  CommentIcon,
  ShareIcon,
  CopyIcon,
  FilterIcon,
  SortIcon,
  DownloadIcon,
  UploadIcon,
  EditIcon,
  TrashIcon,
  SaveIcon,
  RefreshIcon,
  BookmarkIcon,

  // 文件
  FileIcon,
  ArchiveIcon,
  FolderIcon,

  // 媒体
  MusicIcon,
  CameraIcon,
  VideoIcon,
  MicIcon,

  // 状态
  OnlineIcon,
  OfflineIcon,
  SyncIcon,

  // 工具
  GlobeIcon,
  ZapIcon,
  BellIcon,

  // 赛博科技
  CyberIcon,
  CpuIcon,
  ChipIcon,
  DatabaseIcon,
  NetworkIcon,
  HologramIcon,

  // Logo
  LogoIcon,
  LogoMark,

  // 特效
  CyberGlitchIcon,
  CyberMatrixIcon,
  CyberNodeIcon,
  CyberShieldIcon,
  CyberHoloIcon,
  CyberDataIcon,

  // 工具函数
  getIcon,
  getIconNames,
  getIconsByGroup,
  iconMap,
  iconGroups,
};
