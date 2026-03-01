import React from 'react';
/**
 * 媒体相关图标组件
 */

import { Icon, IconProps } from '@/components/icons';

export const PlayIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <Icon className={className} size={size} viewBox="0 0 24 24" fill="none">
    <polygon
      points="5 3 19 12 5 21 5 3"
      fill="currentColor"
    />
  </Icon>
);

export const PauseIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <Icon className={className} size={size} viewBox="0 0 24 24" fill="none">
    <rect x="6" y="4" width="4" height="16" fill="currentColor" />
    <rect x="14" y="4" width="4" height="16" fill="currentColor" />
  </Icon>
);

export const StopIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <Icon className={className} size={size} viewBox="0 0 24 24" fill="none">
    <rect x="6" y="6" width="12" height="12" fill="currentColor" />
  </Icon>
);

export const SkipBackIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <Icon className={className} size={size} viewBox="0 0 24 24" fill="none">
    <polygon
      points="19 20 9 12 19 4 19 20"
      fill="currentColor"
    />
    <line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </Icon>
);

export const SkipForwardIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <Icon className={className} size={size} viewBox="0 0 24 24" fill="none">
    <polygon
      points="5 4 15 12 5 20 5 4"
      fill="currentColor"
    />
    <line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </Icon>
);

export const VolumeIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <Icon className={className} size={size} viewBox="0 0 24 24" fill="none">
    <polygon
      points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"
      fill="currentColor"
    />
    <path
      d="M19.07 4.93C17.53 3.4 15.29 2.65 13 2.93V5.07C14.76 4.79 16.54 5.34 17.95 6.76C19.37 8.18 19.91 9.95 19.64 11.72H21.78C22.06 9.43 21.3 7.19 19.07 4.93ZM15.54 8.46C14.77 7.7 13.73 7.33 12.71 7.44V9.58C13.19 9.48 13.71 9.66 14.12 10.07C14.53 10.49 14.71 11 14.61 11.48H16.75C16.86 10.46 16.49 9.42 15.54 8.46Z"
      fill="currentColor"
    />
  </Icon>
);

export const MuteIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <Icon className={className} size={size} viewBox="0 0 24 24" fill="none">
    <polygon
      points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"
      fill="currentColor"
    />
    <line
      x1="23"
      y1="9"
      x2="17"
      y2="15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="17"
      y1="9"
      x2="23"
      y2="15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Icon>
);

export const ImageIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <Icon className={className} size={size} viewBox="0 0 24 24" fill="none">
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="2"
      ry="2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
    <polyline
      points="21 15 16 10 5 21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);

export const VideoIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <Icon className={className} size={size} viewBox="0 0 24 24" fill="none">
    <polygon
      points="23 7 16 12 23 17 23 7"
      fill="currentColor"
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
    />
  </Icon>
);

export const MusicIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <Icon className={className} size={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M9 18V5L12 2L21 5V18C21 19.66 19.66 21 18 21C16.34 21 15 19.66 15 18C15 16.34 16.34 15 18 15C18.71 15 19.36 15.27 19.85 15.71V6.25L12 4.25V18C12 19.66 10.66 21 9 21C7.34 21 6 19.66 6 18C6 16.34 7.34 15 9 15C9.71 15 10.36 15.27 10.85 15.71V6.25L9 5.5V18Z"
      fill="currentColor"
    />
  </Icon>
);

export const CameraIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <Icon className={className} size={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M23 19C23 20.1 22.1 21 21 21H3C1.9 21 1 20.1 1 19V8C1 6.9 1.9 6 3 6H7L9 4H15L17 6H21C22.1 6 23 6.9 23 8V19Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <circle
      cx="12"
      cy="13"
      r="4"
      stroke="currentColor"
      strokeWidth="2"
    />
  </Icon>
);

export const MicrophoneIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <Icon className={className} size={size} viewBox="0 0 24 24" fill="none">
    <rect
      x="9"
      y="1"
      width="6"
      height="12"
      rx="3"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M5 10V11C5 14.866 8.13401 18 12 18C15.866 18 19 14.866 19 11V10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="12"
      y1="18"
      x2="12"
      y2="23"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="8"
      y1="23"
      x2="16"
      y2="23"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Icon>
);

export const FilmIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <Icon className={className} size={size} viewBox="0 0 24 24" fill="none">
    <rect
      x="2"
      y="2"
      width="20"
      height="20"
      rx="2.18"
      ry="2.18"
      stroke="currentColor"
      strokeWidth="2"
    />
    <line
      x1="7"
      y1="2"
      x2="7"
      y2="22"
      stroke="currentColor"
      strokeWidth="2"
    />
    <line
      x1="17"
      y1="2"
      x2="17"
      y2="22"
      stroke="currentColor"
      strokeWidth="2"
    />
    <line
      x1="2"
      y1="12"
      x2="22"
      y2="12"
      stroke="currentColor"
      strokeWidth="2"
    />
    <line
      x1="2"
      y1="7"
      x2="7"
      y2="7"
      stroke="currentColor"
      strokeWidth="2"
    />
    <line
      x1="2"
      y1="17"
      x2="7"
      y2="17"
      stroke="currentColor"
      strokeWidth="2"
    />
    <line
      x1="17"
      y1="17"
      x2="22"
      y2="17"
      stroke="currentColor"
      strokeWidth="2"
    />
    <line
      x1="17"
      y1="7"
      x2="22"
      y2="7"
      stroke="currentColor"
      strokeWidth="2"
    />
  </Icon>
);

export const CastIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <Icon className={className} size={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6C2 4.89543 2.89543 4 4 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20H13"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="15" r="2" fill="currentColor" />
  </Icon>
);

export const RadioIcon: React.FC<IconProps> = ({ className, size = 24 }) => (
  <Icon className={className} size={size} viewBox="0 0 24 24" fill="none">
    <rect
      x="2"
      y="7"
      width="20"
      height="14"
      rx="2"
      ry="2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M16 21V5C16 3.89543 16.8954 3 18 3C19.1046 3 20 3.89543 20 5V21"
      stroke="currentColor"
      strokeWidth="2"
    />
  </Icon>
);
