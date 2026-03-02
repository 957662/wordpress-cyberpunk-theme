/**
 * CyberPress Social Icons
 *
 * 社交媒体图标组件库
 *
 * @example
 * ```tsx
 * import { GitHubIcon, TwitterIcon, LinkedInIcon } from '@/components/graphics/SocialIcons';
 *
 * <GitHubIcon size={24} />
 * <TwitterIcon size={24} variant="purple" />
 * <LinkedInIcon size={24} glow />
 * ```
 */

import React from 'react';
import { SVGIconProps } from './SVGIcons';

export interface SocialIconProps extends SVGIconProps {
  /** 颜色变体 */
  variant?: 'cyan' | 'purple' | 'pink' | 'default';
}

/**
 * GitHub 图标
 */
export const GitHubIcon: React.FC<SocialIconProps> = ({
  size = 24,
  variant = 'default',
  className = '',
  ...props
}) => {
  const colors = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    default: 'currentColor',
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M9 19C9 19 10 20 12 20C14 20 15 19 15 19"
        stroke={colors[variant]}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        stroke={colors[variant]}
        strokeWidth="2"
        fill="currentColor"
        fillOpacity="0.1"
      />
      <path
        d="M12 8V16"
        stroke={colors[variant]}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8 12H16"
        stroke={colors[variant]}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

/**
 * Twitter/X 图标
 */
export const TwitterIcon: React.FC<SocialIconProps> = ({
  size = 24,
  variant = 'default',
  className = '',
  ...props
}) => {
  const colors = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    default: 'currentColor',
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M4 4L11 12L4 20"
        stroke={colors[variant]}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 4L13 12L20 20"
        stroke={colors[variant]}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 12H20"
        stroke={colors[variant]}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

/**
 * LinkedIn 图标
 */
export const LinkedInIcon: React.FC<SocialIconProps> = ({
  size = 24,
  variant = 'default',
  className = '',
  ...props
}) => {
  const colors = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    default: 'currentColor',
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="2"
        stroke={colors[variant]}
        strokeWidth="2"
        fill="currentColor"
        fillOpacity="0.1"
      />
      <path
        d="M7 17V10"
        stroke={colors[variant]}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M11 17V10"
        stroke={colors[variant]}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="7" cy="8" r="1" fill={colors[variant]} />
      <circle cx="11" cy="8" r="1" fill={colors[variant]} />
      <path
        d="M15 17V13C15 11.3431 16.3431 10 18 10V10C19.6569 10 21 11.3431 21 13V17"
        stroke={colors[variant]}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

/**
 * Email 图标
 */
export const EmailIcon: React.FC<SocialIconProps> = ({
  size = 24,
  variant = 'default',
  className = '',
  ...props
}) => {
  const colors = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    default: 'currentColor',
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <rect
        x="2"
        y="4"
        width="20"
        height="16"
        rx="2"
        stroke={colors[variant]}
        strokeWidth="2"
        fill="currentColor"
        fillOpacity="0.1"
      />
      <path
        d="M2 6L12 14L22 6"
        stroke={colors[variant]}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

/**
 * RSS 图标
 */
export const RSSIcon: React.FC<SocialIconProps> = ({
  size = 24,
  variant = 'default',
  className = '',
  ...props
}) => {
  const colors = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    default: 'currentColor',
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M4 11C8.41828 11 12 14.5817 12 19"
        stroke={colors[variant]}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M4 5C12.8366 5 20 12.1634 20 21"
        stroke={colors[variant]}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="5" cy="19" r="1" fill={colors[variant]} />
    </svg>
  );
};

/**
 * Discord 图标
 */
export const DiscordIcon: React.FC<SocialIconProps> = ({
  size = 24,
  variant = 'default',
  className = '',
  ...props
}) => {
  const colors = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    default: 'currentColor',
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={colors[variant]}
        strokeWidth="2"
        fill="currentColor"
        fillOpacity="0.1"
      />
      <circle cx="9" cy="10" r="1.5" fill={colors[variant]} />
      <circle cx="15" cy="10" r="1.5" fill={colors[variant]} />
      <path
        d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14"
        stroke={colors[variant]}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

/**
 * YouTube 图标
 */
export const YouTubeIcon: React.FC<SocialIconProps> = ({
  size = 24,
  variant = 'default',
  className = '',
  ...props
}) => {
  const colors = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    default: 'currentColor',
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <rect
        x="2"
        y="4"
        width="20"
        height="16"
        rx="4"
        stroke={colors[variant]}
        strokeWidth="2"
        fill="currentColor"
        fillOpacity="0.1"
      />
      <path
        d="M10 9L15 12L10 15V9Z"
        fill={colors[variant]}
      />
    </svg>
  );
};

/**
 * Dribbble 图标
 */
export const DribbbleIcon: React.FC<SocialIconProps> = ({
  size = 24,
  variant = 'default',
  className = '',
  ...props
}) => {
  const colors = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    default: 'currentColor',
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={colors[variant]}
        strokeWidth="2"
        fill="currentColor"
        fillOpacity="0.1"
      />
      <path
        d="M12 2C14 8 16 12 12 22"
        stroke={colors[variant]}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M2 12C8 12 14 10 22 12"
        stroke={colors[variant]}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default {
  GitHubIcon,
  TwitterIcon,
  LinkedInIcon,
  EmailIcon,
  RSSIcon,
  DiscordIcon,
  YouTubeIcon,
  DribbbleIcon,
};
