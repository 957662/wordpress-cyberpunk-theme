/**
 * CyberPress SVG Icons Library
 *
 * 内联 SVG 图标库，提供完整的赛博朋克风格图标
 *
 * @example
 * ```tsx
 * import { HomeIcon, GitHubIcon, SearchIcon } from '@/components/graphics/SVGIcons';
 *
 * <HomeIcon size={24} className="text-cyber-cyan" />
 * <GitHubIcon size={20} />
 * ```
 */

import React from 'react';

// 图标基础属性
export interface SVGIconProps {
  /** 图标尺寸 */
  size?: number;
  /** 额外的 CSS 类名 */
  className?: string;
  /** 是否使用发光效果 */
  glow?: boolean;
  /** 自定义颜色 */
  color?: string;
  /** 点击事件 */
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

// ==================== 导航图标 ====================

/**
 * 首页图标 - 霓虹六边形房子
 */
export const HomeIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <path
      d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.1"
    />
    <path
      d="M9 22V12H15V22"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SVGIcon>
);

/**
 * 博客图标 - 数字文档
 */
export const BlogIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <path
      d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.1"
    />
    <path
      d="M14 2V8H20"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 13H8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M16 17H8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M10 9H9H8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </SVGIcon>
);

/**
 * 作品集图标 - 网格画廊
 */
export const PortfolioIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <rect
      x="3"
      y="3"
      width="7"
      height="7"
      stroke="currentColor"
      strokeWidth="2"
      fill="currentColor"
      fillOpacity="0.1"
    />
    <rect
      x="14"
      y="3"
      width="7"
      height="7"
      stroke="currentColor"
      strokeWidth="2"
      fill="currentColor"
      fillOpacity="0.1"
    />
    <rect
      x="14"
      y="14"
      width="7"
      height="7"
      stroke="currentColor"
      strokeWidth="2"
      fill="currentColor"
      fillOpacity="0.1"
    />
    <rect
      x="3"
      y="14"
      width="7"
      height="7"
      stroke="currentColor"
      strokeWidth="2"
      fill="currentColor"
      fillOpacity="0.1"
    />
  </SVGIcon>
);

/**
 * 关于图标 - 用户信息
 */
export const AboutIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <circle
      cx="12"
      cy="8"
      r="4"
      stroke="currentColor"
      strokeWidth="2"
      fill="currentColor"
      fillOpacity="0.1"
    />
    <path
      d="M20 21C20 16.5817 16.4183 13 12 13C7.58172 13 4 16.5817 4 21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </SVGIcon>
);

/**
 * 搜索图标 - 放大镜
 */
export const SearchIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <circle
      cx="11"
      cy="11"
      r="8"
      stroke="currentColor"
      strokeWidth="2"
      fill="currentColor"
      fillOpacity="0.1"
    />
    <path
      d="M21 21L16.65 16.65"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </SVGIcon>
);

/**
 * 菜单图标 - 汉堡菜单
 */
export const MenuIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <path
      d="M3 12H21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M3 6H21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M3 18H21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </SVGIcon>
);

/**
 * 关闭图标 - X
 */
export const CloseIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <path
      d="M18 6L6 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M6 6L18 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </SVGIcon>
);

// ==================== 社交媒体图标 ====================

/**
 * GitHub 图标
 */
export const GitHubIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <path
      d="M9 19C4 20.5 4 16.5 2 16M22 12V19C22 19.5304 21.7893 20.0391 21.4142 20.4142C21.0391 20.7893 20.5304 21 20 21H4C3.46957 21 2.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V12C2 8.68629 4.68629 6 8 6H16C19.3137 6 22 8.68629 22 12Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.1"
    />
    <path
      d="M15 11L12 14L9 11"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SVGIcon>
);

/**
 * Twitter/X 图标
 */
export const TwitterIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <path
      d="M4 4L11 11M20 20L11 11M11 11L20 4M11 11L4 20"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SVGIcon>
);

/**
 * LinkedIn 图标
 */
export const LinkedInIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <rect
      x="2"
      y="2"
      width="20"
      height="20"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
      fill="currentColor"
      fillOpacity="0.1"
    />
    <path
      d="M8 11V17"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M8 8V8.01"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M12 17V13C12 11.8954 12.8954 11 14 11C15.1046 11 16 11.8954 16 13V17"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </SVGIcon>
);

/**
 * Email 图标
 */
export const EmailIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <path
      d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
      stroke="currentColor"
      strokeWidth="2"
      fill="currentColor"
      fillOpacity="0.1"
    />
    <path
      d="M22 6L12 13L2 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SVGIcon>
);

/**
 * RSS 图标
 */
export const RSSIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <path
      d="M4 11C7.31371 11 10 13.6863 10 17"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M4 5C10.0751 5 15 9.92487 15 16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle
      cx="5"
      cy="19"
      r="1"
      fill="currentColor"
    />
  </SVGIcon>
);

// ==================== UI 图标 ====================

/**
 * 用户图标
 */
export const UserIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <path
      d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="12"
      cy="7"
      r="4"
      stroke="currentColor"
      strokeWidth="2"
      fill="currentColor"
      fillOpacity="0.1"
    />
  </SVGIcon>
);

/**
 * 设置图标
 */
export const SettingsIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <circle
      cx="12"
      cy="12"
      r="3"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SVGIcon>
);

/**
 * 通知铃铛图标
 */
export const BellIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <path
      d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 13 4 15 4 15H20C20 15 18 13 18 8Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.1"
    />
    <path
      d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SVGIcon>
);

/**
 * 评论图标
 */
export const CommentIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <path
      d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9675 18.7293C15.6252 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.1"
    />
  </SVGIcon>
);

// ==================== 操作图标 ====================

/**
 * 编辑图标
 */
export const EditIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <path
      d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SVGIcon>
);

/**
 * 删除图标
 */
export const DeleteIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <path
      d="M3 6H5H21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.1"
    />
    <path
      d="M10 11V17"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M14 11V17"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </SVGIcon>
);

/**
 * 保存图标
 */
export const SaveIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <path
      d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.1"
    />
    <path
      d="M17 21V13H7V21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 3V8H15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SVGIcon>
);

/**
 * 复制图标
 */
export const CopyIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <rect
      x="9"
      y="9"
      width="13"
      height="13"
      rx="2"
      ry="2"
      stroke="currentColor"
      strokeWidth="2"
      fill="currentColor"
      fillOpacity="0.1"
    />
    <path
      d="M5 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SVGIcon>
);

/**
 * 下载图标
 */
export const DownloadIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <path
      d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 10L12 15L17 10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 15V3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SVGIcon>
);

/**
 * 上传图标
 */
export const UploadIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <path
      d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17 8L12 3L7 8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 3V15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SVGIcon>
);

// ==================== 状态图标 ====================

/**
 * 检查图标
 */
export const CheckIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <path
      d="M20 6L9 17L4 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SVGIcon>
);

/**
 * 警告图标
 */
export const WarningIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <path
      d="M10.29 3.86L1.81999 18C1.64536 18.3024 1.55298 18.6453 1.55199 18.9945C1.551 19.3437 1.64141 19.6871 1.81442 19.9905C1.98744 20.2939 2.23734 20.5468 2.53886 20.7234C2.84038 20.9 3.18279 20.9946 3.53199 21H20.468C20.8172 20.9946 21.1596 20.9 21.4611 20.7234C21.7626 20.5468 22.0126 20.2939 22.1856 19.9905C22.3586 19.6871 22.449 19.3437 22.448 18.9945C22.447 18.6453 22.3546 18.3024 22.18 18L13.71 3.86C13.5317 3.56602 13.2808 3.32311 12.9812 3.15448C12.6816 2.98585 12.3437 2.89727 12 2.89727C11.6563 2.89727 11.3184 2.98585 11.0188 3.15448C10.7192 3.32311 10.4683 3.56602 10.29 3.86Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.1"
    />
    <path
      d="M12 9V13"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 17H12.01"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SVGIcon>
);

/**
 * 错误/叉号图标
 */
export const ErrorIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="2"
      fill="currentColor"
      fillOpacity="0.1"
    />
    <path
      d="M15 9L9 15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 9L15 15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SVGIcon>
);

/**
 * 信息图标
 */
export const InfoIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="2"
      fill="currentColor"
      fillOpacity="0.1"
    />
    <path
      d="M12 16V12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 8H12.01"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SVGIcon>
);

/**
 * 锁定图标
 */
export const LockIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <rect
      x="3"
      y="11"
      width="18"
      height="11"
      rx="2"
      ry="2"
      stroke="currentColor"
      strokeWidth="2"
      fill="currentColor"
      fillOpacity="0.1"
    />
    <path
      d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SVGIcon>
);

/**
 * 解锁图标
 */
export const UnlockIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <rect
      x="3"
      y="11"
      width="18"
      height="11"
      rx="2"
      ry="2"
      stroke="currentColor"
      strokeWidth="2"
      fill="currentColor"
      fillOpacity="0.1"
    />
    <path
      d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SVGIcon>
);

// ==================== 主题图标 ====================

/**
 * 太阳图标
 */
export const SunIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <circle
      cx="12"
      cy="12"
      r="5"
      stroke="currentColor"
      strokeWidth="2"
      fill="currentColor"
      fillOpacity="0.2"
    />
    <path
      d="M12 1V3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 21V23"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.22 4.22L5.64 5.64"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.36 18.36L19.78 19.78"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1 12H3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 12H23"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.22 19.78L5.64 18.36"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.36 5.64L19.78 4.22"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SVGIcon>
);

/**
 * 月亮图标
 */
export const MoonIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <path
      d="M21 12.79A9 9 0 1 1 11.21 3C7.323 3.429 4.15 6.561 3.66 10.44C3.17 14.319 5.48 17.94 9.06 19.24C12.64 20.54 16.66 19.23 18.85 16.17C20.49 13.91 21.09 11.14 21 12.79Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.1"
    />
  </SVGIcon>
);

// ==================== 媒体图标 ====================

/**
 * 图片图标
 */
export const ImageIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="2"
      ry="2"
      stroke="currentColor"
      strokeWidth="2"
      fill="currentColor"
      fillOpacity="0.1"
    />
    <circle
      cx="8.5"
      cy="8.5"
      r="1.5"
      fill="currentColor"
    />
    <path
      d="M21 15L16 10L5 21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SVGIcon>
);

/**
 * 视频图标
 */
export const VideoIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <path
      d="M23 7L16 12L23 17V7Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.1"
    />
    <rect
      x="1"
      y="5"
      width="15"
      height="14"
      rx="2"
      ry="2"
      stroke="currentColor"
      strokeWidth="2"
      fill="currentColor"
      fillOpacity="0.1"
    />
  </SVGIcon>
);

/**
 * 代码图标
 */
export const CodeIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <polyline
      points="16 18 22 12 16 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <polyline
      points="8 6 2 12 8 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SVGIcon>
);

/**
 * 文件夹图标
 */
export const FolderIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <path
      d="M22 19C22 19.5304 21.7893 20.0391 21.4142 20.4142C21.0391 20.7893 20.5304 21 20 21H4C3.46957 21 2.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3H9L11 5H20C20.5304 5 21.0391 5.21071 21.4142 5.58579C21.7893 5.96086 22 6.46957 22 7V19Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.1"
    />
  </SVGIcon>
);

/**
 * 标签图标
 */
export const TagIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <path
      d="M20.59 13.41L13.42 20.58C13.2343 20.766 13.0137 20.9135 12.7709 21.0141C12.5281 21.1148 12.2678 21.1666 12.005 21.1666C11.7422 21.1666 11.4819 21.1148 11.2391 21.0141C10.9963 20.9135 10.7757 20.766 10.59 20.58L2 12V2H12L20.59 10.59C20.9625 10.9647 21.1716 11.4716 21.1716 12C21.1716 12.5284 20.9625 13.0353 20.59 13.41Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.1"
    />
    <path
      d="M7 7H7.01"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SVGIcon>
);

/**
 * 日历图标
 */
export const CalendarIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <rect
      x="3"
      y="4"
      width="18"
      height="18"
      rx="2"
      ry="2"
      stroke="currentColor"
      strokeWidth="2"
      fill="currentColor"
      fillOpacity="0.1"
    />
    <path
      d="M16 2V6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 2V6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 10H21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SVGIcon>
);

/**
 * 时钟图标
 */
export const ClockIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="2"
      fill="currentColor"
      fillOpacity="0.1"
    />
    <polyline
      points="12 6 12 12 16 14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SVGIcon>
);

// ==================== 开发图标 ====================

/**
 * 终端图标
 */
export const TerminalIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <polyline
      points="4 17 10 11 4 5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="12"
      y1="19"
      x2="20"
      y2="19"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <rect
      x="2"
      y="3"
      width="20"
      height="18"
      rx="2"
      ry="2"
      stroke="currentColor"
      strokeWidth="2"
      fill="currentColor"
      fillOpacity="0.05"
    />
  </SVGIcon>
);

/**
 * 数据库图标
 */
export const DatabaseIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <ellipse
      cx="12"
      cy="5"
      rx="9"
      ry="3"
      stroke="currentColor"
      strokeWidth="2"
      fill="currentColor"
      fillOpacity="0.1"
    />
    <path
      d="M21 12C21 13.66 16.97 15 12 15C7.03 15 3 13.66 3 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M3 5V19C3 20.66 7.03 22 12 22C16.97 22 21 20.66 21 19V5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SVGIcon>
);

/**
 * 服务器图标
 */
export const ServerIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <rect
      x="2"
      y="2"
      width="20"
      height="8"
      rx="2"
      ry="2"
      stroke="currentColor"
      strokeWidth="2"
      fill="currentColor"
      fillOpacity="0.1"
    />
    <rect
      x="2"
      y="14"
      width="20"
      height="8"
      rx="2"
      ry="2"
      stroke="currentColor"
      strokeWidth="2"
      fill="currentColor"
      fillOpacity="0.1"
    />
    <line
      x1="6"
      y1="6"
      x2="6.01"
      y2="6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="6"
      y1="18"
      x2="6.01"
      y2="18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </SVGIcon>
);

/**
 * 云图标
 */
export const CloudIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <path
      d="M18 10H17.5C17.1137 8.30462 16.1107 6.81355 14.6774 5.83677C13.2441 4.86 11.4862 4.46345 9.77254 4.72422C8.05884 4.985 6.51861 5.88385 5.46651 7.24154C4.41441 8.59923 3.92915 10.3176 4.11149 12.0292C4.29383 13.7408 5.12985 15.3173 6.446 16.418C7.76216 17.5186 9.45529 17.9619 11.11 17.65"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.1"
    />
    <path
      d="M17 10C18.5913 10 20.1174 10.6321 21.2426 11.7574C22.3679 12.8826 23 14.4087 23 16C23 17.5913 22.3679 19.1174 21.2426 20.2426C20.1174 21.3679 18.5913 22 17 22H11"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SVGIcon>
);

/**
 * 外部链接图标
 */
export const ExternalLinkIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <path
      d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 3H21V9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 14L21 3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SVGIcon>
);

/**
 * 星标图标
 */
export const StarIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <polygon
      points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.1"
    />
  </SVGIcon>
);

/**
 * 心形图标
 */
export const HeartIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <path
      d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04096 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7564 11.2728 22.0329 10.6054C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.0621 22.0329 6.39464C21.7564 5.72718 21.351 5.12084 20.84 4.61Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.1"
    />
  </SVGIcon>
);

/**
 * 分享图标
 */
export const ShareIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <circle
      cx="18"
      cy="5"
      r="3"
      stroke="currentColor"
      strokeWidth="2"
      fill="currentColor"
      fillOpacity="0.1"
    />
    <circle
      cx="6"
      cy="12"
      r="3"
      stroke="currentColor"
      strokeWidth="2"
      fill="currentColor"
      fillOpacity="0.1"
    />
    <circle
      cx="18"
      cy="19"
      r="3"
      stroke="currentColor"
      strokeWidth="2"
      fill="currentColor"
      fillOpacity="0.1"
    />
    <line
      x1="8.59"
      y1="13.51"
      x2="15.42"
      y2="17.49"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="15.41"
      y1="6.51"
      x2="8.59"
      y2="10.49"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </SVGIcon>
);

/**
 * 过滤器图标
 */
export const FilterIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <polygon
      points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.1"
    />
  </SVGIcon>
);

/**
 * 排序图标
 */
export const SortIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <path
      d="M11 5H20"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 5H6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11 12H20"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 12H7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11 19H20"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 19H6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SVGIcon>
);

/**
 * 箭头向上图标
 */
export const ArrowUpIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <path
      d="M12 19V5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 12L12 5L19 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SVGIcon>
);

/**
 * 箭头向下图标
 */
export const ArrowDownIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <path
      d="M12 5V19"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19 12L12 19L5 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SVGIcon>
);

/**
 * 箭头向左图标
 */
export const ArrowLeftIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <path
      d="M19 12H5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 19L5 12L12 5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SVGIcon>
);

/**
 * 箭头向右图标
 */
export const ArrowRightIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <path
      d="M5 12H19"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 5L19 12L12 19"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SVGIcon>
);

/**
 * 刷新图标
 */
export const RefreshIcon: React.FC<SVGIconProps> = (props) => (
  <SVGIcon {...props}>
    <path
      d="M23 4V10H17"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20.49 15C20.1559 16.7428 19.2884 18.3271 17.9993 19.5119C16.7102 20.6967 15.0648 21.4244 13.3127 21.5936C11.5606 21.7628 9.80297 21.3648 8.30437 20.4568C6.80577 19.5487 5.64482 18.1792 4.98987 16.5441C4.33492 14.909 4.22069 13.0976 4.66467 11.3903C5.10864 9.68298 6.08615 8.17336 7.45365 7.08362C8.82115 5.99388 10.5032 5.38474 12.2385 5.34673C13.9738 5.30873 15.6805 5.84412 17.095 6.88L23 10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SVGIcon>
);

// 导出所有图标
export default {
  // 导航
  HomeIcon,
  BlogIcon,
  PortfolioIcon,
  AboutIcon,
  SearchIcon,
  MenuIcon,
  CloseIcon,

  // 社交
  GitHubIcon,
  TwitterIcon,
  LinkedInIcon,
  EmailIcon,
  RSSIcon,

  // UI
  UserIcon,
  SettingsIcon,
  BellIcon,
  CommentIcon,

  // 操作
  EditIcon,
  DeleteIcon,
  SaveIcon,
  CopyIcon,
  DownloadIcon,
  UploadIcon,

  // 状态
  CheckIcon,
  WarningIcon,
  ErrorIcon,
  InfoIcon,
  LockIcon,
  UnlockIcon,

  // 主题
  SunIcon,
  MoonIcon,

  // 媒体
  ImageIcon,
  VideoIcon,
  CodeIcon,
  FolderIcon,
  TagIcon,
  CalendarIcon,
  ClockIcon,

  // 开发
  TerminalIcon,
  DatabaseIcon,
  ServerIcon,
  CloudIcon,

  // 其他
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
};
