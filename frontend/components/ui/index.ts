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
export { InlineCode, Terminal } from './CodeBlock';
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

export { CodeEditor } from './CodeEditor';
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

export { Switch } from './Switch';
export type { SwitchProps } from './Switch';

// 最新创建的组件
export { QRCode, QRCodeButton } from './QRCode';
export type { QRCodeProps, QRCodeButtonProps } from './QRCode';

export { ImageGallery, ImageMasonry } from './ImageGallery';
export type { GalleryImage, ImageGalleryProps, ImageMasonryProps } from './ImageGallery';

export { VideoPlayer, AudioPlayer } from './VideoPlayer';
export type { VideoPlayerProps, AudioPlayerProps } from './VideoPlayer';

export { CountUp } from './CountUp';
export type { CountUpProps } from './CountUp';

export { PinCode, VerificationCode } from './PinCode';
export type { PinCodeProps, VerificationCodeProps } from './PinCode';

export { FileUpload, ImagePreview } from './FileUpload';
export type { FileUploadProps, ImagePreviewProps } from './FileUpload';

export { TimePicker, DateRangePicker } from './TimePicker';
export type { TimePickerProps, DateRangePickerProps } from './TimePicker';

// 最新创建的实用组件
export { ShareButton, ShareButtons } from './ShareButton';
export type { ShareButtonProps } from './ShareButton';

export { PrintButton, PrintPreview, PrintableArea } from './PrintButton';
export type { PrintButtonProps } from './PrintButton';

export { BookmarkButton, BookmarkList } from './BookmarkButton';
export type { BookmarkButtonProps, BookmarkItem } from './BookmarkButton';

export { FontSizeSelector, FontSizeQuickSelector } from './FontSizeSelector';
export type { FontSizeSelectorProps } from './FontSizeSelector';

export { Dialog } from './Dialog';
export type { DialogProps } from './Dialog';

export { Drawer } from './Drawer';
export type { DrawerProps } from './Drawer';

export { Toggle, RadioGroup } from './Toggle';
export type { ToggleProps, RadioGroupProps } from './Toggle';

export { SplitPane } from './SplitPane';
export type { SplitPaneProps } from './SplitPane';

export { TreeView } from './TreeView';
export type { TreeViewProps } from './TreeView';

export { LoadingState } from './LoadingState';
export type { LoadingStateProps } from './LoadingState';

export { ColorPicker } from './ColorPicker';
export type { ColorPickerProps } from './ColorPicker';

export { Draggable } from './Draggable';
export type { DraggableProps } from './Draggable';

export { InfiniteScroll } from './InfiniteScroll';
export type { InfiniteScrollProps } from './InfiniteScroll';

// 最新创建的高级UI组件
export { VirtualList } from './VirtualList';
export type { VirtualListProps } from './VirtualList';

export { Swipeable } from './Swipeable';
export type { SwipeableProps } from './Swipeable';

export { ContextMenu } from './ContextMenu';
export type { ContextMenuItem, ContextMenuProps } from './ContextMenu';

export { CommandPalette } from './CommandPalette';
export type { Command, CommandPaletteProps } from './CommandPalette';

export { NotificationBell } from './NotificationBell';
export type { Notification, NotificationBellProps } from './NotificationBell';

export { Marquee } from './Marquee';
export type { MarqueeProps } from './Marquee';

export { EllipsisText } from './EllipsisText';
export type { EllipsisTextProps } from './EllipsisText';

export { ScrollProgress } from './ScrollProgress';
export type { ScrollProgressProps } from './ScrollProgress';

export { RatingStars } from './RatingStars';
export type { RatingStarsProps } from './RatingStars';

export { ToggleSwitch } from './ToggleSwitch';
export type { ToggleSwitchProps } from './ToggleSwitch';

export { DonutChart } from './DonutChart';
export type { DataPoint, DonutChartProps } from './DonutChart';

export { UserCard } from './UserCard';
export type { UserCardProps } from './UserCard';

export { ActivityFeed } from './ActivityFeed';
export type { ActivityItem, ActivityFeedProps } from './ActivityFeed';

export { SearchInput } from './SearchInput';
export type { SearchHistoryItem, SearchInputProps } from './SearchInput';

export { Confetti } from './Confetti';
export type { ConfettiProps } from './Confetti';

export { FileDropZone } from './FileDropZone';
export type { FileDropZoneProps } from './FileDropZone';

export { EmojiPicker } from './EmojiPicker';
export type { EmojiPickerProps } from './EmojiPicker';

export { ProgressBar as CustomProgressBar } from './ProgressBar';
export type { ProgressBarProps } from './ProgressBar';

export { StatCard as CustomStatCard } from './StatCard';
export type { StatCardProps } from './StatCard';
