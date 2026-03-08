/**
 * 新组件库导出文件
 *
 * 包含所有新创建的高级组件
 */

// 实时搜索组件
export { RealtimeSearchSuggestions } from '../search-advanced/RealtimeSearchSuggestions'
export type { SuggestionItem, RealtimeSearchSuggestionsProps } from '../search-advanced/RealtimeSearchSuggestions'

// 阅读历史组件
export { ReadingHistory } from '../reading/ReadingHistory'
export type { ReadingHistoryItem, ReadingHistoryProps } from '../reading/ReadingHistory'

// 高级数据图表组件
export { AdvancedDataChart } from '../analytics/AdvancedDataChart'
export type { ChartDataPoint, ChartDataset, AdvancedDataChartProps } from '../analytics/AdvancedDataChart'

// 社交分享组件
export { EnhancedSocialShare } from '../social-share/EnhancedSocialShare'
export type { SocialShareProps } from '../social-share/EnhancedSocialShare'

// 代码沙盒组件
export { CodeSandbox } from '../code-preview/CodeSandbox'
export type { CodeFile, CodeSandboxProps } from '../code-preview/CodeSandbox'
