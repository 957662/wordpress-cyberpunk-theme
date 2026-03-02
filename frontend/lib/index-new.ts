/**
 * 新功能导出索引
 * 集中导出所有新创建的工具和组件
 */

// ========== 文本处理工具 ==========
export * as TextUtils from './utils/text-utils';
export {
  truncateText,
  generateExcerpt,
  calculateReadingTime,
  countWords,
  highlightKeywords,
  toTitleCase,
  toSlug,
  slugToTitle,
  extractLinks,
  stripMarkdown,
  generateSections,
  detectLanguage,
  calculateSimilarity,
  extractKeywords,
} from './utils/text-utils';

// ========== SEO 工具 ==========
export * as SEOUtils from './seo/seo-utils';
export {
  generatePageMeta,
  generateStructuredData,
  generateBreadcrumbs,
  optimizeSlug,
  generateArticleUrl,
  generateKeywords,
  generateSeoExcerpt,
  checkSeo,
  generateCanonicalUrl,
  generateHreflangTags,
  calculateReadabilityScore,
} from './seo/seo-utils';

// ========== WordPress API 客户端 ==========
export * as WP from './wordpress/wp-client-enhanced';
export {
  postsApi,
  categoriesApi,
  tagsApi,
  mediaApi,
  usersApi,
  commentsApi,
  searchApi,
  acfApi,
  wpCache,
  wpApi,
} from './wordpress/wp-client-enhanced';

// ========== 类型定义 ==========
export type {
  PageMeta,
  BreadcrumbItem,
  SeoCheck,
  ArticleSeriesProps,
  SimpleSeriesNavProps,
  SeriesProgressProps,
} from './seo/seo-utils';

// ========== 组件快捷导出 ==========
export {
  // 社交分享
  SocialShare,
  SocialShareButton,
  FloatingShare,
  ShareCard,

  // 系列导航
  SeriesNavigation,
  SimpleSeriesNav,
  SeriesProgress,

  // 阅读进度
  ReadingProgress,
  CircularReadingProgress,
  SectionReadingProgress,
} from '../components/blog/SocialShare';

/**
 * 使用示例:
 *
 * import {
 *   calculateReadingTime,
 *   generatePageMeta,
 *   wpApi,
 *   SocialShare
 * } from '@/lib/index-new';
 */
