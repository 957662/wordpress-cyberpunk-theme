/**
 * AI 协作套件组件索引
 *
 * 这个文件导出了所有新创建的 AI 和协作相关组件
 * 方便在其他地方导入使用
 */

// AI 组件
export { AIChat } from './ai/ai-chat';

// 白板组件
export { CollaborativeWhiteboard } from './whiteboard/collaborative-whiteboard';

// 代码分享组件
export { CodeSnippetCard } from './code-share/code-snippet-card';
export type { Language, CodeSnippet } from './code-share/code-snippet-card';

// 文章摘要组件
export { ArticleSummaryGenerator } from './article-summary/article-summary-generator';
export type { SummaryLength, SummaryStyle, SummaryOptions } from './article-summary/article-summary-generator';

// 高级搜索组件
export { AdvancedSearch } from './search-advanced/advanced-search';
export type { SearchCategory, SortOption, SearchFilters, SearchResult } from './search-advanced/advanced-search';

// 阅读进度组件
export { ReadingProgressTracker, ChapterProgress } from './reading-progress/reading-progress-tracker';

// 协作编辑组件
export { CollaborativeEditor } from './collaborative/collaborative-editor';

// 任务管理组件
export { TaskBoard } from './tasks/task-board';
export type { TaskPriority, TaskStatus, Task } from './tasks/task-board';

// 便捷导入 - 一次性导入所有组件
export const AICollaborationComponents = {
  // AI
  AIChat,

  // 协作
  CollaborativeWhiteboard,
  CollaborativeEditor,

  // 内容
  CodeSnippetCard,
  ArticleSummaryGenerator,

  // 搜索
  AdvancedSearch,

  // 阅读
  ReadingProgressTracker,
  ChapterProgress,

  // 任务
  TaskBoard
};

// 类型导出
export type {
  // 代码分享
  Language as CodeLanguage,
  CodeSnippet,

  // 文章摘要
  SummaryLength,
  SummaryStyle,
  SummaryOptions,

  // 搜索
  SearchCategory,
  SortOption,
  SearchFilters,
  SearchResult,

  // 任务
  TaskPriority,
  TaskStatus,
  Task
};
