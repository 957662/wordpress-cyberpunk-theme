/**
 * UI 组件导出索引
 */

export { Button } from './Button';
export { Card } from './Card';
export { Input } from './Input';
export { Badge } from './Badge';
export { Modal } from './Modal';
export { SearchBar } from './SearchBar';
export { Pagination } from './Pagination';
export { ProgressBar } from './ProgressBar';
export { Toast } from './Toast';
export { Tooltip } from './Tooltip';

export type { ButtonProps } from './Button';
export type { CardProps } from './Card';
export type { InputProps } from './Input';
export type { BadgeProps } from './Badge';
export type { ModalProps } from './Modal';
export type { SearchBarProps } from './SearchBar';
export type { PaginationProps } from './Pagination';
export type { ProgressBarProps } from './ProgressBar';

// 新增导出
export { NotificationContainer, useNotification } from './Notification';
export { Table } from './Table';
export { CodeBlock, InlineCode, Terminal } from './CodeBlock';
export { TagCloud, CategoryList } from './TagCloud';
export { ContactForm, NewsletterForm } from './ContactForm';

// 最新组件
export { Avatar } from './Avatar';
export type { AvatarProps } from './Avatar';

export { Skeleton, SkeletonText, SkeletonCard, SkeletonList } from './Skeleton';
export type { SkeletonProps, SkeletonTextProps, SkeletonCardProps, SkeletonListProps } from './Skeleton';

export { Dropdown } from './Dropdown';
export type { DropdownProps, DropdownOption } from './Dropdown';

export { Tabs } from './Tabs';
export type { TabsProps, Tab } from './Tabs';

export { Divider, AnimatedDivider } from './Divider';
export type { DividerProps, AnimatedDividerProps } from './Divider';

export { Chip, ChipGroup } from './Chip';
export type { ChipProps, ChipGroupProps } from './Chip';

export { Progress, CircularProgress } from './Progress';
export type { ProgressProps, CircularProgressProps } from './Progress';

export { Timeline } from './Timeline';
export type { TimelineProps, TimelineItem } from './Timeline';

export { Accordion } from './Accordion';
export type { AccordionProps, AccordionItem } from './Accordion';

export { Rating } from './Rating';
export type { RatingProps } from './Rating';

export { Carousel } from './Carousel';
export type { CarouselProps, CarouselItem } from './Carousel';

// 新增组件导出
export { Alert, AlertList } from './Alert';
export type { AlertProps, AlertListProps, AlertVariant } from './Alert';

export { Breadcrumb, BreadcrumbSchema } from './Breadcrumb';
export type { BreadcrumbProps, BreadcrumbItem, BreadcrumbSchemaProps } from './Breadcrumb';

export { Steps, StepContent, StepNavigation } from './Steps';
export type { StepsProps, Step, StepContentProps, StepNavigationProps } from './Steps';

export { EmptyState, NotFoundState, NoPermissionState, LoadErrorState } from './EmptyState';
export type { EmptyStateProps, NotFoundStateProps, NoPermissionStateProps, LoadErrorStateProps } from './EmptyState';

export { BackToTop, BackToTopWithProgress } from './BackToTop';
export type { BackToTopProps, BackToTopWithProgressProps } from './BackToTop';

// 新创建的高级组件
export {
  BarChart,
  LineChart,
  PieChart,
  StatCard,
  StatsGrid,
  DashboardOverview,
} from './DataCharts';
export type {
  ChartDataPoint,
  TimeSeriesData,
  BarChartProps,
  LineChartProps,
  PieChartProps,
  StatCardProps,
  StatsGridProps,
  DashboardOverviewProps,
} from './DataCharts';

export {
  FormBuilder,
  FormFieldComponent,
  useFormBuilder,
} from './FormBuilder';
export type {
  FieldType,
  FieldOption,
  FormField,
  FormConfig,
  FormBuilderProps,
} from './FormBuilder';

export { CodeEditor, CodeBlock } from './CodeEditor';
export type {
  Language,
  EditorTheme,
  CodeEditorProps,
  CodeBlockProps,
} from './CodeEditor';

export { AvatarUpload, AvatarGroup, ProfileCard } from './AvatarUpload';
export type {
  AvatarUploadProps,
  AvatarGroupProps,
  ProfileCardProps,
} from './AvatarUpload';
