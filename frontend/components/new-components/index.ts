/**
 * 新组件导出索引
 *
 * 本文件导出所有新创建的组件，方便其他模块导入使用
 */

// 标签输入组件
export { TagInput, TagCloud } from '@/components/tag-input/TagInput'
export type { TagInputProps, TagCloudProps } from '@/components/tag-input/TagInput'

// 评分组件
export {
  Rating,
  RatingDisplay,
  RatingStats,
} from '@/components/rating/Rating'
export type {
  RatingProps,
  RatingDisplayProps,
  RatingStatsProps,
} from '@/components/rating/Rating'

// 数据可视化组件
export {
  DonutChart,
  BarChart,
} from '@/components/data-viz/DonutChart'
export type {
  ChartData,
  DonutChartProps,
  BarChartProps,
} from '@/components/data-viz/DonutChart'

// 树形视图组件
export { TreeView, FileTree } from '@/components/tree-view/TreeView'
export type {
  TreeNode,
  TreeViewProps,
  FileNode,
  FileTreeProps,
} from '@/components/tree-view/TreeView'

// 颜色选择器组件
export { ColorPicker } from '@/components/color-picker/ColorPicker'
export type { ColorPickerProps } from '@/components/color-picker/ColorPicker'

// 代码编辑器组件
export {
  CodeEditor,
  CodePreview,
} from '@/components/code-editor/CodeEditor'
export type {
  CodeEditorProps,
  CodePreviewProps,
} from '@/components/code-editor/CodeEditor'

// 文件上传组件
export { FileUpload } from '@/components/file-upload/FileUpload'
export type {
  FileUploadProps,
  UploadFile,
} from '@/components/file-upload/FileUpload'

// 时间轴组件
export {
  Timeline,
  MilestoneTimeline,
} from '@/components/timeline/Timeline'
export type {
  TimelineEvent,
  TimelineProps,
  MilestoneTimelineProps,
} from '@/components/timeline/Timeline'

// 搜索组件
export { SearchInput } from '@/components/search/SearchInput'
export type { SearchInputProps } from '@/components/search/SearchInput'

// 虚拟列表组件
export {
  VirtualList,
  InfiniteVirtualList,
} from '@/components/virtual-list/VirtualList'
export type {
  VirtualListProps,
} from '@/components/virtual-list/VirtualList'

// Toast 通知组件
export { Toast, toast } from '@/components/toast/Toast'
export type {
  ToastProps,
  ToastType,
} from '@/components/toast/Toast'

/**
 * 使用示例：
 *
 * ```tsx
 * // 导入单个组件
 * import { TagInput } from '@/components/new-components'
 *
 * // 导入多个组件
 * import { TagInput, Rating, DonutChart } from '@/components/new-components'
 *
 * // 导入类型
 * import type { TagInputProps, RatingProps } from '@/components/new-components'
 * ```
 */
