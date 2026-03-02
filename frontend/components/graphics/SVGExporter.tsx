/**
 * CyberPress SVG Exporter
 *
 * SVG 图标导出工具 - 将内联 SVG 组件导出为独立文件
 */

import React from 'react';
import {
  HomeIcon,
  BlogIcon,
  PortfolioIcon,
  AboutIcon,
  SearchIcon,
  MenuIcon,
  CloseIcon,
  GitHubIcon,
  TwitterIcon,
  LinkedInIcon,
  EmailIcon,
  RSSIcon,
  UserIcon,
  SettingsIcon,
  BellIcon,
  CommentIcon,
  EditIcon,
  DeleteIcon,
  SaveIcon,
  CopyIcon,
  DownloadIcon,
  UploadIcon,
  CheckIcon,
  WarningIcon,
  ErrorIcon,
  InfoIcon,
  LockIcon,
  UnlockIcon,
  SunIcon,
  MoonIcon,
  ImageIcon,
  VideoIcon,
  CodeIcon,
  FolderIcon,
  TagIcon,
  CalendarIcon,
  ClockIcon,
  TerminalIcon,
  DatabaseIcon,
  ServerIcon,
  CloudIcon,
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

// 图标映射表
const iconComponents = {
  // 导航图标
  'home': HomeIcon,
  'blog': BlogIcon,
  'portfolio': PortfolioIcon,
  'about': AboutIcon,
  'search': SearchIcon,
  'menu': MenuIcon,
  'close': CloseIcon,

  // 社交图标
  'github': GitHubIcon,
  'twitter': TwitterIcon,
  'linkedin': LinkedInIcon,
  'email': EmailIcon,
  'rss': RSSIcon,

  // UI 图标
  'user': UserIcon,
  'settings': SettingsIcon,
  'bell': BellIcon,
  'comment': CommentIcon,

  // 操作图标
  'edit': EditIcon,
  'delete': DeleteIcon,
  'save': SaveIcon,
  'copy': CopyIcon,
  'download': DownloadIcon,
  'upload': UploadIcon,

  // 状态图标
  'check': CheckIcon,
  'warning': WarningIcon,
  'error': ErrorIcon,
  'info': InfoIcon,
  'lock': LockIcon,
  'unlock': UnlockIcon,

  // 主题图标
  'sun': SunIcon,
  'moon': MoonIcon,

  // 媒体图标
  'image': ImageIcon,
  'video': VideoIcon,
  'code': CodeIcon,
  'folder': FolderIcon,
  'tag': TagIcon,
  'calendar': CalendarIcon,
  'clock': ClockIcon,

  // 开发图标
  'terminal': TerminalIcon,
  'database': DatabaseIcon,
  'server': ServerIcon,
  'cloud': CloudIcon,

  // 其他图标
  'external-link': ExternalLinkIcon,
  'star': StarIcon,
  'heart': HeartIcon,
  'share': ShareIcon,
  'filter': FilterIcon,
  'sort': SortIcon,
  'arrow-up': ArrowUpIcon,
  'arrow-down': ArrowDownIcon,
  'arrow-left': ArrowLeftIcon,
  'arrow-right': ArrowRightIcon,
  'refresh': RefreshIcon,
};

export type IconName = keyof typeof iconComponents;

/**
 * 获取图标的 SVG 字符串
 */
export const getIconSVG = (
  iconName: IconName,
  options: {
    size?: number;
    color?: string;
    strokeWidth?: number;
  } = {}
): string => {
  const IconComponent = iconComponents[iconName];
  if (!IconComponent) {
    throw new Error(`Icon "${iconName}" not found`);
  }

  const { size = 24, color = 'currentColor', strokeWidth = 2 } = options;

  // 渲染组件到 HTML 字符串
  const svg = `
    <svg
      width="${size}"
      height="${size}"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      ${getIconPaths(iconName, color, strokeWidth)}
    </svg>
  `;

  return svg.replace(/\s+/g, ' ').trim();
};

/**
 * 获取图标的 path 数据
 */
const getIconPaths = (iconName: IconName, color: string, strokeWidth: number): string => {
  // 这里是简化版本，实际应该从组件中提取 path
  // 你可以根据需要扩展这个函数
  const paths: Record<IconName, string[]> = {
    'home': [
      `<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>`,
      `<polyline points="9,22 9,12 15,12 15,22" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>`,
    ],
    'search': [
      `<circle cx="11" cy="11" r="8" stroke="${color}" stroke-width="${strokeWidth}"/>`,
      `<line x1="21" y1="21" x2="16.65" y2="16.65" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round"/>`,
    ],
    'menu': [
      `<line x1="3" y1="12" x2="21" y2="12" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round"/>`,
      `<line x1="3" y1="6" x2="21" y2="6" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round"/>`,
      `<line x1="3" y1="18" x2="21" y2="18" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round"/>`,
    ],
    'close': [
      `<line x1="18" y1="6" x2="6" y2="18" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round"/>`,
      `<line x1="6" y1="6" x2="18" y2="18" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round"/>`,
    ],
    // ... 其他图标的 path 定义
  };

  return (paths[iconName] || []).join('\n  ');
};

/**
 * 下载图标为 SVG 文件
 */
export const downloadIconSVG = (
  iconName: IconName,
  options: {
    size?: number;
    color?: string;
    strokeWidth?: number;
    filename?: string;
  } = {}
): void => {
  const { size = 24, filename = `${iconName}.svg` } = options;

  const svg = getIconSVG(iconName, options);
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * 批量导出所有图标
 */
export const exportAllIcons = (options: {
  size?: number;
  color?: string;
  format?: 'svg' | 'png';
} = {}): void => {
  const iconNames = Object.keys(iconComponents) as IconName[];

  iconNames.forEach((iconName, index) => {
    // 延迟执行，避免浏览器阻止多次下载
    setTimeout(() => {
      downloadIconSVG(iconName, {
        ...options,
        filename: `icon-${iconName}.svg`,
      });
    }, index * 100);
  });
};

/**
 * React Hook: 下载图标
 */
export const useIconDownload = () => {
  const download = React.useCallback((
    iconName: IconName,
    options?: Parameters<typeof downloadIconSVG>[1]
  ) => {
    downloadIconSVG(iconName, options);
  }, []);

  const downloadAll = React.useCallback((
    options?: Parameters<typeof exportAllIcons>[0]
  ) => {
    exportAllIcons(options);
  }, []);

  return { download, downloadAll };
};

/**
 * 图标预览组件
 */
interface IconPreviewProps {
  iconName: IconName;
  size?: number;
  color?: string;
  showName?: boolean;
  onDownload?: () => void;
}

export const IconPreview: React.FC<IconPreviewProps> = ({
  iconName,
  size = 48,
  color = '#00f0ff',
  showName = true,
  onDownload,
}) => {
  const IconComponent = iconComponents[iconName];

  if (!IconComponent) {
    return <div>Icon not found</div>;
  }

  return (
    <div className="flex flex-col items-center gap-2 p-4 bg-cyber-card rounded-lg hover:bg-cyber-muted transition-colors cursor-pointer group">
      <div className="p-3 bg-cyber-dark rounded-lg group-hover:shadow-lg group-hover:shadow-cyber-cyan/20 transition-all">
        <IconComponent size={size} color={color} />
      </div>
      {showName && (
        <span className="text-sm text-gray-400 capitalize">{iconName}</span>
      )}
      {onDownload && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDownload();
          }}
          className="mt-2 px-3 py-1 text-xs bg-cyber-cyan/20 text-cyber-cyan rounded hover:bg-cyber-cyan/30 transition-colors"
        >
          下载 SVG
        </button>
      )}
    </div>
  );
};

/**
 * 图标网格展示组件
 */
interface IconGridProps {
  icons?: IconName[];
  size?: number;
  color?: string;
  downloadable?: boolean;
}

export const IconGrid: React.FC<IconGridProps> = ({
  icons,
  size = 32,
  color = '#00f0ff',
  downloadable = false,
}) => {
  const allIcons = icons || (Object.keys(iconComponents) as IconName[]);

  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
      {allIcons.map((iconName) => (
        <IconPreview
          key={iconName}
          iconName={iconName}
          size={size}
          color={color}
          onDownload={
            downloadable
              ? () => downloadIconSVG(iconName, { size: 64, color })
              : undefined
          }
        />
      ))}
    </div>
  );
};

export default {
  getIconSVG,
  downloadIconSVG,
  exportAllIcons,
  useIconDownload,
  IconPreview,
  IconGrid,
  iconComponents,
};
