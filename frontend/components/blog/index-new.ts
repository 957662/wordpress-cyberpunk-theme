/**
 * 博客组件统一导出
 *
 * 使用方式:
 * import { ArticleList, ArticleCard, NewsletterSubscribe } from '@/components/blog';
 */

// 文章列表组件
export { ArticleList, ArticleListCompact } from './ArticleList';

// 文章卡片组件
export { ArticleCard, ArticleCardGrid } from './ArticleCard';

// Newsletter 订阅
export { NewsletterSubscribe } from './NewsletterSubscribe';

// AI 摘要
export { AISummary, AISummaryInline } from './AISummary';

// 文章评分
export { ArticleRating, ArticleRatingCompact } from './ArticleRating';

// 阅读历史
export {
  ReadingHistory,
  ReadingHistoryInline,
  useReadingHistory
} from './ReadingHistory';

// 热门文章
export {
  TrendingArticles,
  TrendingArticlesCompact,
  TrendingArticlesLeaderboard
} from './TrendingArticles';

// 文章搜索
export { ArticleSearch, FullScreenSearch } from './ArticleSearch';

// 关注按钮
export {
  FollowButton,
  FollowButtonCompact,
  FollowButtonWithMenu
} from './FollowButton';

// 书签管理
export { BookmarkManager, QuickBookmark } from './BookmarkManager';
