/**
 * Component Types for CyberPress Platform
 * Common component prop types and interfaces
 */

import { ReactNode, CSSProperties, MouseEvent, KeyboardEvent } from 'react';

/**
 * Base component props
 */
export interface BaseComponentProps {
  className?: string;
  style?: CSSProperties;
  id?: string;
  testId?: string;
}

/**
 * Variant type
 */
export type Variant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

/**
 * Size type
 */
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Color type
 */
export type Color = 'cyan' | 'purple' | 'pink' | 'green' | 'yellow' | 'red' | 'white' | 'black';

/**
 * Alignment type
 */
export type Alignment = 'left' | 'center' | 'right' | 'justify';

/**
 * Direction type
 */
export type Direction = 'horizontal' | 'vertical';

/**
 * Position type
 */
export type Position = 'top' | 'bottom' | 'left' | 'right' | 'center';

/**
 * Button component props
 */
export interface ButtonProps extends BaseComponentProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  color?: Color;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  rounded?: boolean;
  glow?: boolean;
  neon?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

/**
 * Input component props
 */
export interface InputProps extends BaseComponentProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  helperText?: string;
  icon?: ReactNode;
  size?: Size;
  fullWidth?: boolean;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
}

/**
 * Select component props
 */
export interface SelectProps extends BaseComponentProps {
  value?: string | string[];
  defaultValue?: string | string[];
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  helperText?: string;
  options: SelectOption[];
  multiple?: boolean;
  searchable?: boolean;
  size?: Size;
  fullWidth?: boolean;
  onChange?: (value: string | string[]) => void;
  onSearch?: (query: string) => void;
}

/**
 * Select option type
 */
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
  icon?: ReactNode;
}

/**
 * Checkbox component props
 */
export interface CheckboxProps extends BaseComponentProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  indeterminate?: boolean;
  label?: string;
  size?: Size;
  color?: Color;
  onChange?: (checked: boolean) => void;
}

/**
 * Radio component props
 */
export interface RadioProps extends BaseComponentProps {
  name: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  label?: string;
  size?: Size;
  color?: Color;
  onChange?: (value: string) => void;
}

/**
 * Switch component props
 */
export interface SwitchProps extends BaseComponentProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  label?: string;
  size?: Size;
  color?: Color;
  loading?: boolean;
  onChange?: (checked: boolean) => void;
}

/**
 * Textarea component props
 */
export interface TextareaProps extends BaseComponentProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  helperText?: string;
  rows?: number;
  maxLength?: number;
  showCount?: boolean;
  autoSize?: boolean | { minRows?: number; maxRows?: number };
  fullWidth?: boolean;
  onChange?: (value: string) => void;
}

/**
 * Modal component props
 */
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: Size | 'full';
  variant?: 'default' | 'neon' | 'holographic';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  footer?: ReactNode;
}

/**
 * Drawer component props
 */
export interface DrawerProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  size?: Size | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

/**
 * Dropdown component props
 */
export interface DropdownProps extends BaseComponentProps {
  trigger: ReactNode;
  children: ReactNode;
  placement?: Position;
  disabled?: boolean;
  triggerMode?: 'click' | 'hover';
}

/**
 * Tooltip component props
 */
export interface TooltipProps extends BaseComponentProps {
  content: ReactNode;
  children: ReactNode;
  placement?: Position;
  delay?: number;
  arrow?: boolean;
  disabled?: boolean;
}

/**
 * Popover component props
 */
export interface PopoverProps extends BaseComponentProps {
  trigger: ReactNode;
  content: ReactNode;
  placement?: Position;
  disabled?: boolean;
  triggerMode?: 'click' | 'hover';
}

/**
 * Card component props
 */
export interface CardProps extends BaseComponentProps {
  children: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  extra?: ReactNode;
  variant?: 'default' | 'neon' | 'holographic' | 'glass';
  hover?: boolean;
  glow?: boolean;
  scanLine?: boolean;
  cornerAccent?: boolean;
  onClick?: () => void;
}

/**
 * Badge component props
 */
export interface BadgeProps extends BaseComponentProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  color?: Color;
  glow?: boolean;
  pulse?: boolean;
  dot?: boolean;
  count?: number;
  max?: number;
  showZero?: boolean;
}

/**
 * Avatar component props
 */
export interface AvatarProps extends BaseComponentProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: Size;
  variant?: 'circle' | 'square' | 'rounded';
  glow?: boolean;
  border?: boolean;
  status?: 'online' | 'offline' | 'away' | 'busy';
}

/**
 * Progress component props
 */
export interface ProgressProps extends BaseComponentProps {
  value: number;
  max?: number;
  variant?: Variant;
  size?: Size;
  showLabel?: boolean;
  animated?: boolean;
  glow?: boolean;
  color?: Color;
}

/**
 * Tabs component props
 */
export interface TabsProps extends BaseComponentProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  variant?: 'default' | 'neon' | 'pill';
}

/**
 * Tab component props
 */
export interface TabProps extends BaseComponentProps {
  value: string;
  children: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
}

/**
 * Accordion component props
 */
export interface AccordionProps extends BaseComponentProps {
  defaultValue: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  children: ReactNode;
  multiple?: boolean;
  collapsible?: boolean;
}

/**
 * Accordion item props
 */
export interface AccordionItemProps extends BaseComponentProps {
  value: string;
  children: ReactNode;
  disabled?: boolean;
}

/**
 * List component props
 */
export interface ListProps extends BaseComponentProps {
  items: ListItemType[];
  itemKey?: string;
  renderItem?: (item: ListItemType, index: number) => ReactNode;
  emptyText?: string;
  loading?: boolean;
  size?: Size;
}

/**
 * List item type
 */
export interface ListItemType {
  id: string | number;
  title: string;
  description?: string;
  icon?: ReactNode;
  extra?: ReactNode;
  disabled?: boolean;
}

/**
 * Table component props
 */
export interface TableProps<T = any> extends BaseComponentProps {
  data: T[];
  columns: ColumnType<T>[];
  rowKey?: keyof T | ((record: T) => string);
  loading?: boolean;
  emptyText?: string;
  pagination?: PaginationProps;
  sort?: SortProps;
  onRow?: (record: T, index: number) => {
    onClick?: () => void;
    onDoubleClick?: () => void;
  };
}

/**
 * Table column type
 */
export interface ColumnType<T = any> {
  key: string;
  title: string;
  dataIndex?: keyof T | string[];
  render?: (value: any, record: T, index: number) => ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: number;
  align?: Alignment;
  fixed?: 'left' | 'right';
}

/**
 * Pagination props
 */
export interface PaginationProps {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: (total: number, range: [number, number]) => string;
  pageSizeOptions?: number[];
  onChange?: (page: number, pageSize: number) => void;
}

/**
 * Sort props
 */
export interface SortProps {
  field?: string;
  order?: 'asc' | 'desc';
  onChange?: (field: string, order: 'asc' | 'desc') => void;
}

/**
 * Skeleton component props
 */
export interface SkeletonProps extends BaseComponentProps {
  loading?: boolean;
  children: ReactNode;
  variant?: 'text' | 'circle' | 'rect' | 'custom';
  count?: number;
  animation?: 'pulse' | 'wave' | 'none';
}

/**
 * Empty state component props
 */
export interface EmptyStateProps extends BaseComponentProps {
  image?: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
}

/**
 * Alert component props
 */
export interface AlertProps extends BaseComponentProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message?: string;
  closable?: boolean;
  showIcon?: boolean;
  onClose?: () => void;
}

/**
 * Notification component props
 */
export interface NotificationProps extends BaseComponentProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  duration?: number;
  closable?: boolean;
  showIcon?: boolean;
  onClose?: () => void;
}

/**
 * Loading spinner component props
 */
export interface LoadingProps extends BaseComponentProps {
  size?: Size;
  color?: Color;
  fullscreen?: boolean;
  text?: string;
}

/**
 * Divider component props
 */
export interface DividerProps extends BaseComponentProps {
  orientation?: 'horizontal' | 'vertical';
  dashed?: boolean;
  label?: string;
  labelPosition?: 'start' | 'center' | 'end';
}
