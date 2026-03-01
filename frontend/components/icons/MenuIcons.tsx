/**
 * 菜单相关图标组件
 */

import React from 'react';
import { Icon, IconProps } from '@/components/icons';

export const MenuIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <Icon className={className} size={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M4 6H20M4 12H20M4 18H20"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Icon>
);

export const CloseIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <Icon className={className} size={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M18 6L6 18M6 6L18 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Icon>
);

export const ChevronDownIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <Icon className={className} size={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M6 9L12 15L18 9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);

export const ChevronUpIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <Icon className={className} size={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M18 15L12 9L6 15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);

export const ChevronLeftIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <Icon className={className} size={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M15 18L9 12L15 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);

export const ChevronRightIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <Icon className={className} size={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M9 18L15 12L9 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);

export const HamburgerIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <Icon className={className} size={size} viewBox="0 0 24 24" fill="none">
    <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" />
    <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" />
    <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" />
  </Icon>
);

export const MoreVerticalIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <Icon className={className} size={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="5" r="1.5" fill="currentColor" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    <circle cx="12" cy="19" r="1.5" fill="currentColor" />
  </Icon>
);

export const MoreHorizontalIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <Icon className={className} size={size} viewBox="0 0 24 24" fill="none">
    <circle cx="5" cy="12" r="1.5" fill="currentColor" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    <circle cx="19" cy="12" r="1.5" fill="currentColor" />
  </Icon>
);

export const ExpandIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <Icon className={className} size={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M15 3H21V9M9 21H3V15M21 3L14 10M3 21L10 14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);

export const MinimizeIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <Icon className={className} size={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M8 3V5H4V8H2V3H8ZM22 16V21H16V19H20V16H22ZM16 3H22V8H20V5H16V3ZM8 16V19H4V21H2V16H8Z"
      fill="currentColor"
    />
  </Icon>
);

export const MaximizeIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <Icon className={className} size={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M8 3H3V8M16 3H21V8M8 21H3V16M16 21H21V16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);

export const GridIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <Icon className={className} size={size} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" />
    <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" />
    <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" />
    <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" />
  </Icon>
);

export const ListIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <Icon className={className} size={size} viewBox="0 0 24 24" fill="none">
    <line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" />
    <line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" />
    <line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" />
    <circle cx="3" cy="6" r="1.5" fill="currentColor" />
    <circle cx="3" cy="12" r="1.5" fill="currentColor" />
    <circle cx="3" cy="18" r="1.5" fill="currentColor" />
  </Icon>
);

export const DashboardIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <Icon className={className} size={size} viewBox="0 0 24 24" fill="none">
    <rect
      x="3"
      y="3"
      width="7"
      height="9"
      stroke="currentColor"
      strokeWidth="2"
      rx="1"
    />
    <rect
      x="14"
      y="3"
      width="7"
      height="5"
      stroke="currentColor"
      strokeWidth="2"
      rx="1"
    />
    <rect
      x="14"
      y="12"
      width="7"
      height="9"
      stroke="currentColor"
      strokeWidth="2"
      rx="1"
    />
    <rect
      x="3"
      y="16"
      width="7"
      height="5"
      stroke="currentColor"
      strokeWidth="2"
      rx="1"
    />
  </Icon>
);
