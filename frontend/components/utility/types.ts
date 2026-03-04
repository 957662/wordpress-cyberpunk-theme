/**
 * Utility Components Types
 */

import { ReactNode } from 'react';

// Countdown Timer
export interface CountdownTimerProps {
  targetDate: Date | string | number;
  onComplete?: () => void;
  format?: 'full' | 'short' | 'minimal';
  className?: string;
  showLabels?: boolean;
  variant?: 'default' | 'neon' | 'cyber';
}

// Id Generator
export interface IdGeneratorProps {
  prefix?: string;
  length?: number;
  onGenerate?: (id: string) => void;
  autoGenerate?: boolean;
  format?: 'uuid' | 'nanoid' | 'custom';
  className?: string;
}

// Json Viewer
export interface JsonViewerProps {
  data: any;
  expandDepth?: number;
  className?: string;
  variant?: 'default' | 'neon' | 'cyber';
  enableClipboard?: boolean;
  enableSearch?: boolean;
}

// QR Code
export interface QrCodeProps {
  value: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  bgColor?: string;
  fgColor?: string;
  className?: string;
  logo?: string;
  logoSize?: number;
  variant?: 'default' | 'neon';
}

// Gradient Text
export interface GradientTextProps {
  children: ReactNode;
  colors?: string[];
  className?: string;
  direction?: 'horizontal' | 'vertical' | 'diagonal';
  animate?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Rating
export interface RatingProps {
  value?: number;
  total?: number;
  readonly?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  allowHalf?: boolean;
  variant?: 'default' | 'neon' | 'cyber';
  showValue?: boolean;
}

// File Upload
export interface FileUploadProps {
  onChange?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  className?: string;
  variant?: 'default' | 'neon' | 'cyber';
  dropZoneHeight?: string;
}

// Progress Bar
export interface ProgressBarProps {
  value?: number;
  showPercentage?: boolean;
  label?: string;
  className?: string;
  variant?: 'default' | 'neon' | 'cyber' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  striped?: boolean;
}

// Timeline
export interface TimelineItem {
  time: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  status?: 'default' | 'success' | 'warning' | 'error';
}

export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
  variant?: 'default' | 'neon' | 'cyber';
  direction?: 'vertical' | 'horizontal';
}

// Tooltip
export interface TooltipProps {
  children: React.ReactElement;
  content: string | React.ReactNode;
  trigger?: 'hover' | 'click' | 'focus';
  placement?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
  variant?: 'default' | 'neon' | 'cyber';
  arrow?: boolean;
}
