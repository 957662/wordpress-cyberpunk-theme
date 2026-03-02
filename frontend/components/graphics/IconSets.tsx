/**
 * CyberPress Icon Sets
 *
 * 常用图标组合组件 - 提供预设的图标组合
 *
 * @example
 * ```tsx
 * import { SocialIcons, TechStackIcons, NavigationIcons } from '@/components/graphics/IconSets';
 *
 * <SocialIcons variant="circle" />
 * <TechStackIcons stacked />
 * <NavigationIcons orientation="horizontal" />
 * ```
 */

import React from 'react';
import {
  GitHubIcon,
  TwitterIcon,
  LinkedInIcon,
  EmailIcon,
  RSSIcon,
} from './SVGIcons';
import {
  ShieldIcon,
  ZapIcon,
  RocketIcon,
  LightbulbIcon,
  GlobeIcon,
  BotIcon,
} from './AdditionalIcons';

// ==================== 社交媒体图标组合 ====================

export interface SocialIconsProps {
  /** 图标尺寸 */
  size?: number;
  /** 变体样式 */
  variant?: 'default' | 'circle' | 'glow' | 'minimal';
  /** 布局方向 */
  orientation?: 'horizontal' | 'vertical';
  /** 额外的 CSS 类名 */
  className?: string;
  /** 点击事件处理 */
  onIconClick?: (icon: string) => void;
}

/**
 * 社交媒体图标组合
 */
export const SocialIcons: React.FC<SocialIconsProps> = ({
  size = 24,
  variant = 'default',
  orientation = 'horizontal',
  className = '',
  onIconClick
}) => {
  const icons = [
    { name: 'github', component: GitHubIcon, href: 'https://github.com' },
    { name: 'twitter', component: TwitterIcon, href: 'https://twitter.com' },
    { name: 'linkedin', component: LinkedInIcon, href: 'https://linkedin.com' },
    { name: 'email', component: EmailIcon, href: 'mailto:contact@example.com' },
    { name: 'rss', component: RSSIcon, href: '/rss.xml' },
  ];

  const getVariantClasses = () => {
    switch (variant) {
      case 'circle':
        return 'bg-cyber-card rounded-full p-3 border border-cyber-border hover:border-cyber-cyan transition-all';
      case 'glow':
        return 'drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]';
      case 'minimal':
        return 'opacity-70 hover:opacity-100 transition-opacity';
      default:
        return '';
    }
  };

  const IconWrapper = ({ children, icon }: { children: React.ReactNode; icon: string }) => (
    <div
      className={`${getVariantClasses()} ${orientation === 'vertical' ? 'mb-2' : 'mr-4'} cursor-pointer hover:scale-110 transition-transform`}
      onClick={() => onIconClick?.(icon)}
    >
      {children}
    </div>
  );

  return (
    <div className={`flex ${orientation === 'vertical' ? 'flex-col' : 'flex-row'} ${className}`}>
      {icons.map((icon) => (
        <IconWrapper key={icon.name} icon={icon.name}>
          <icon.component size={size} />
        </IconWrapper>
      ))}
    </div>
  );
};

// ==================== 技术栈图标组合 ====================

export interface TechStackIconsProps {
  /** 图标尺寸 */
  size?: number;
  /** 布局方式 */
  layout?: 'grid' | 'flex' | 'stacked';
  /** 列数 (grid 布局) */
  columns?: number;
  /** 额外的 CSS 类名 */
  className?: string;
}

/**
 * 技术栈图标组合
 */
export const TechStackIcons: React.FC<TechStackIconsProps> = ({
  size = 32,
  layout = 'grid',
  columns = 4,
  className = ''
}) => {
  const techStack = [
    { name: 'Next.js', icon: '⚡️', color: '#00f0ff' },
    { name: 'React', icon: '⚛️', color: '#9d00ff' },
    { name: 'TypeScript', icon: '📘', color: '#ff0080' },
    { name: 'Tailwind', icon: '🎨', color: '#00ff88' },
    { name: 'WordPress', icon: '📝', color: '#00f0ff' },
    { name: 'Node.js', icon: '🟢', color: '#00ff88' },
    { name: 'Docker', icon: '🐳', color: '#00f0ff' },
    { name: 'Git', icon: '🔀', color: '#ff0080' },
  ];

  const gridStyle = layout === 'grid'
    ? { display: 'grid', gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap: '1rem' }
    : {};

  const Item = ({ tech }: { tech: typeof techStack[0] }) => (
    <div
      className="flex flex-col items-center justify-center p-4 bg-cyber-card rounded-lg border border-cyber-border hover:border-cyber-cyan transition-all group"
      style={{ minWidth: layout === 'stacked' ? '100%' : '80px' }}
    >
      <span
        className="text-2xl mb-2 group-hover:scale-110 transition-transform"
        style={{ filter: `drop-shadow(0 0 8px ${tech.color})` }}
      >
        {tech.icon}
      </span>
      <span className="text-xs text-cyber-cyan font-mono">{tech.name}</span>
    </div>
  );

  return (
    <div
      className={`${layout === 'flex' ? 'flex flex-wrap gap-4' : ''} ${className}`}
      style={gridStyle}
    >
      {techStack.map((tech) => (
        <Item key={tech.name} tech={tech} />
      ))}
    </div>
  );
};

// ==================== 功能特性图标组合 ====================

export interface FeatureIconsProps {
  /** 图标尺寸 */
  size?: number;
  /** 布局方式 */
  layout?: 'horizontal' | 'vertical' | 'grid';
  /** 显示动画 */
  animated?: boolean;
  /** 额外的 CSS 类名 */
  className?: string;
}

/**
 * 功能特性图标组合
 */
export const FeatureIcons: React.FC<FeatureIconsProps> = ({
  size = 48,
  layout = 'grid',
  animated = true,
  className = ''
}) => {
  const features = [
    {
      icon: ShieldIcon,
      title: '安全可靠',
      description: '企业级安全保障',
      color: '#00f0ff'
    },
    {
      icon: ZapIcon,
      title: '极速性能',
      description: '毫秒级响应速度',
      color: '#ff0080'
    },
    {
      icon: RocketIcon,
      title: '持续创新',
      description: '引领技术前沿',
      color: '#9d00ff'
    },
    {
      icon: LightbulbIcon,
      title: '智能便捷',
      description: 'AI 赋能体验',
      color: '#f0ff00'
    },
  ];

  const layoutClasses = {
    horizontal: 'flex flex-row gap-8',
    vertical: 'flex flex-col gap-6',
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
  };

  const FeatureCard = ({ feature }: { feature: typeof features[0] }) => (
    <div
      className={`flex flex-col items-center text-center p-6 bg-cyber-card rounded-xl border border-cyber-border hover:border-cyber-cyan transition-all group ${animated ? 'hover:scale-105' : ''}`}
    >
      <div
        className="mb-4 p-4 rounded-full bg-cyber-dark group-hover:drop-shadow-[0_0_12px_rgba(0,240,255,0.5)] transition-all"
        style={{ color: feature.color }}
      >
        <feature.icon size={size} />
      </div>
      <h3 className="text-lg font-semibold text-cyber-cyan mb-2 font-display">
        {feature.title}
      </h3>
      <p className="text-sm text-gray-400">
        {feature.description}
      </p>
    </div>
  );

  return (
    <div className={`${layoutClasses[layout]} ${className}`}>
      {features.map((feature, index) => (
        <FeatureCard key={index} feature={feature} />
      ))}
    </div>
  );
};

// ==================== 导航图标组合 ====================

export interface NavigationIconsProps {
  /** 当前激活的路由 */
  activePath?: string;
  /** 图标尺寸 */
  size?: number;
  /** 是否显示标签 */
  showLabels?: boolean;
  /** 点击回调 */
  onNavigate?: (path: string) => void;
  /** 额外的 CSS 类名 */
  className?: string;
}

/**
 * 导航图标组合
 */
export const NavigationIcons: React.FC<NavigationIconsProps> = ({
  activePath = '/',
  size = 24,
  showLabels = false,
  onNavigate,
  className = ''
}) => {
  const navItems = [
    { name: '首页', path: '/', icon: '🏠' },
    { name: '博客', path: '/blog', icon: '📝' },
    { name: '作品', path: '/portfolio', icon: '🖼️' },
    { name: '关于', path: '/about', icon: '👤' },
    { name: '联系', path: '/contact', icon: '✉️' },
  ];

  return (
    <nav className={`flex flex-col gap-2 ${className}`}>
      {navItems.map((item) => (
        <button
          key={item.path}
          onClick={() => onNavigate?.(item.path)}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            activePath === item.path
              ? 'bg-cyber-cyan/10 text-cyber-cyan border-l-2 border-cyber-cyan'
              : 'text-gray-400 hover:text-cyber-cyan hover:bg-cyber-card'
          }`}
        >
          <span className="text-xl">{item.icon}</span>
          {showLabels && (
            <span className="font-medium">{item.name}</span>
          )}
        </button>
      ))}
    </nav>
  );
};

// ==================== 操作按钮图标组合 ====================

export interface ActionButtonsProps {
  /** 按钮尺寸 */
  size?: 'sm' | 'md' | 'lg';
  /** 按钮配置 */
  actions?: Array<{
    label: string;
    icon: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }>;
  /** 额外的 CSS 类名 */
  className?: string;
}

/**
 * 操作按钮图标组合
 */
export const ActionButtons: React.FC<ActionButtonsProps> = ({
  size = 'md',
  actions,
  className = ''
}) => {
  const defaultActions = [
    { label: '编辑', icon: '✏️', onClick: () => {}, variant: 'secondary' },
    { label: '保存', icon: '💾', onClick: () => {}, variant: 'primary' },
    { label: '删除', icon: '🗑️', onClick: () => {}, variant: 'danger' },
  ];

  const buttonActions = actions || defaultActions;

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const variantClasses = {
    primary: 'bg-cyber-cyan text-cyber-dark hover:bg-cyber-cyan/80',
    secondary: 'bg-cyber-card text-cyber-cyan border border-cyber-cyan hover:bg-cyber-cyan/10',
    danger: 'bg-cyber-pink text-white hover:bg-cyber-pink/80',
  };

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {buttonActions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          className={`${sizeClasses[size]} ${variantClasses[action.variant || 'secondary']} rounded-lg font-medium transition-all flex items-center gap-2 hover:scale-105`}
        >
          <span>{action.icon}</span>
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  );
};

// ==================== 状态图标组合 ====================

export interface StatusBadgesProps {
  /** 状态列表 */
  statuses?: Array<{
    label: string;
    status: 'online' | 'offline' | 'busy' | 'away';
  }>;
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg';
  /** 额外的 CSS 类名 */
  className?: string;
}

/**
 * 状态徽章组合
 */
export const StatusBadges: React.FC<StatusBadgesProps> = ({
  statuses,
  size = 'md',
  className = ''
}) => {
  const defaultStatuses = [
    { label: '在线', status: 'online' as const },
    { label: '离开', status: 'away' as const },
    { label: '忙碌', status: 'busy' as const },
  ];

  const statusList = statuses || defaultStatuses;

  const statusColors = {
    online: 'bg-cyber-green',
    offline: 'bg-gray-500',
    busy: 'bg-cyber-pink',
    away: 'bg-cyber-yellow',
  };

  const sizeClasses = {
    sm: 'w-2 h-2 text-xs',
    md: 'w-2.5 h-2.5 text-sm',
    lg: 'w-3 h-3 text-base',
  };

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {statusList.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-2 px-3 py-1.5 bg-cyber-card rounded-full border border-cyber-border"
        >
          <span
            className={`${sizeClasses[size]} ${statusColors[item.status]} rounded-full animate-pulse`}
          />
          <span className="text-sm text-gray-300">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default {
  SocialIcons,
  TechStackIcons,
  FeatureIcons,
  NavigationIcons,
  ActionButtons,
  StatusBadges,
};
