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

// Code and Syntax
export { CodeHighlighter, InlineCode as CodeInline, CodeBlock } from './CodeHighlighter';

// Image and Media
export { ImageLightbox, useImageLightbox } from './ImageLightbox';

// Notifications
export { NotificationBadge } from './NotificationBadge';

// Forms
export { CyberInput } from './CyberInput';
export { CyberTextarea } from './CyberTextarea';
export type { CyberInputProps, CyberTextareaProps } from './CyberInput';

// Cyber Components
export { CyberButton } from './CyberButton';
export { CyberCard } from './CyberCard';
export { CyberLoader } from './CyberLoader';
export { CyberToggle } from './CyberToggle';
export { CyberProgress } from './CyberProgress';
export { CyberChart } from './CyberChart';
export type { CyberButtonProps, CyberCardProps, CyberLoaderProps } from './CyberButton';

// Enhanced Components
export { EnhancedForm } from './EnhancedForm';
export { EnhancedCodeBlock } from './EnhancedCodeBlock';
export type { EnhancedFormProps, FieldConfig } from './EnhancedForm';

// Data Display
export { DataTable } from './DataTable';
export { DataGrid } from './DataGrid';
export { DataCharts } from './DataCharts';
export type { DataTableProps, DataGridProps } from './DataTable';

// Search
export { SearchBarAdvanced } from './SearchBarAdvanced';
export { CommandPalette } from './CommandPalette';

// Effects
export { AnimatedBackground } from './AnimatedBackground';
export { AnimatedCounter } from './AnimatedCounter';
export { CursorTrail } from './CursorTrail';
export { Parallax as ParallaxEffect } from './Parallax';
export { RevealOnScroll } from './RevealOnScroll';
export { StickyScroll } from './StickyScroll';
export { Typewriter } from './Typewriter';

// Utility
export { CopyToClipboard } from './CopyToClipboard';
export { BookmarkButton } from './BookmarkButton';
export { ShareButton, ShareButtons } from './ShareButton';
export { PrintButton } from './PrintButton';
export { FontSizeSelector } from './FontSizeSelector';
export { RatingPicker } from './RatingPicker';
export { QRCode } from './QRCode';
export { PinCode } from './PinCode';

// 高级组件
export { AdvancedForm, FormBuilder } from './AdvancedForm';
export type { FieldConfig, FieldType } from './AdvancedForm';

export { DataTable } from './DataTable';
export type { Column } from './DataTable';

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

// 注意：ProgressBar 和 StatCard 已在前面导出，这里使用别名避免冲突
// export { ProgressBar as CustomProgressBar } from './ProgressBar';
// export { StatCard as CustomStatCard } from './StatCard';

// 最新创建的赛博朋克风格组件
export { CyberButton, CyberButtonGroup } from './CyberButton';
export type { CyberButtonProps, CyberButtonVariant, CyberButtonSize, CyberButtonGroupProps } from './CyberButton';

export { NeonCard, NeonCardHeader, NeonCardBody, NeonCardFooter } from './NeonCard';
export type { NeonCardProps, NeonColor, NeonCardHeaderProps, NeonCardBodyProps, NeonCardFooterProps } from './NeonCard';

export { GlitchText, GlitchTitle } from './GlitchText';
export type { GlitchTextProps, GlitchTitleProps, GlitchIntensity } from './GlitchText';

export { HologramPanel, HologramCard, HologramStat } from './HologramPanel';
export type { HologramPanelProps, HologramCardProps, HologramStatProps, HologramColor } from './HologramPanel';

// 新创建的赛博朋克功能组件
export { CyberLoader } from './CyberLoader';
export type { CyberLoaderProps } from './CyberLoader';

export { NeonProgress } from './NeonProgress';
export type { NeonProgressProps } from './NeonProgress';

export { CyberToggle } from './CyberToggle';
export type { CyberToggleProps } from './CyberToggle';

// 新创建的赛博朋克UI组件
export { CyberSelect } from './CyberSelect';
export type { CyberSelectProps } from './CyberSelect';

export { CyberCheckbox } from './CyberCheckbox';
export type { CyberCheckboxProps } from './CyberCheckbox';

export { CyberRadio } from './CyberRadio';
export type { CyberRadioProps } from './CyberRadio';

export { CyberSlider } from './CyberSlider';
export type { CyberSliderProps } from './CyberSlider';

export { CyberSwitch } from './CyberSwitch';
export type { CyberSwitchProps } from './CyberSwitch';

export { CyberLabel } from './CyberLabel';
export type { CyberLabelProps } from './CyberLabel';

export { CyberTooltip } from './CyberTooltip';
export type { CyberTooltipProps } from './CyberTooltip';

export { CyberDropdown } from './CyberDropdown';
export type { CyberDropdownProps, CyberDropdownOption } from './CyberDropdown';

export { CyberTag } from './CyberTag';
export type { CyberTagProps } from './CyberTag';

export { CyberNotification } from './CyberNotification';
export type { CyberNotificationProps } from './CyberNotification';

export { CyberAlert } from './CyberAlert';
export type { CyberAlertProps } from './CyberAlert';

export { CyberTabs } from './CyberTabs';
export type { CyberTabsProps, CyberTab } from './CyberTabs';

export { CyberAccordion } from './CyberAccordion';
export type { CyberAccordionProps, CyberAccordionItem } from './CyberAccordion';

export { CyberStepper } from './CyberStepper';
export type { CyberStepperProps, CyberStep } from './CyberStepper';

export { CyberTimeline } from './CyberTimeline';
export type { CyberTimelineProps, CyberTimelineItem } from './CyberTimeline';

// 最新添加的赛博朋克组件
export { CyberBadge, CyberPill, CyberCountBadge, CyberStatusBadge } from './CyberBadge';
export type { CyberBadgeProps, CyberPillProps, CyberCountBadgeProps, CyberStatusBadgeProps } from './CyberBadge';

export { CyberProgress, CyberCircularProgress, CyberProgressGroup } from './CyberProgress';
export type { CyberProgressProps, CyberCircularProgressProps, CyberProgressItem, CyberProgressGroupProps } from './CyberProgress';

export { CyberSlider, CyberSliderRange } from './CyberSlider';
export type { CyberSliderProps, CyberSliderRangeProps } from './CyberSlider';

export { CyberDataTable, CyberDataTablePagination } from './CyberDataTable';
export type { Column as CyberTableColumn, CyberDataTableProps, CyberDataTablePaginationProps } from './CyberDataTable';

export { CyberStatCard, CyberStatGrid } from './CyberStatCard';
export type { CyberStatCardProps, CyberStatGridProps } from './CyberStatCard';

export { CyberFileUpload } from './CyberFileUpload';
export type { FileItem as CyberFileItem, CyberFileUploadProps } from './CyberFileUpload';
