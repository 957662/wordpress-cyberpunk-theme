/**
 * Services Index
 * 服务模块索引
 */

// AI 服务
export { aiService, AIService } from './ai-service';
export type {
  ChatMessage,
  ChatCompletionOptions,
  TextCompletionResponse,
  ImageGenerationOptions,
  GeneratedImage,
  SummarizationOptions,
  SentimentAnalysisResult,
  KeywordExtractionResult,
} from './ai-service';

// 评论 API 服务
export { CommentApiService } from './comment-api.service';
export type { CommentStats, CommentActivityLog } from './comment-api.service';

// 推荐服务
export { RecommendationService } from './recommendation-service';

// 阅读列表服务
export { ReadingListService } from './reading-list-service';

// 点赞服务
export { LikeService } from './like-service';

// 性能监控服务
export { PerformanceMonitor } from './performance-monitor';
