# CyberPress Platform - 服务层 API 参考

## 📚 目录

- [WordPress 服务](#wordpress-服务)
- [Analytics 服务](#analytics-服务)
- [AI 分析服务](#ai-分析服务)
- [通知服务](#通知服务)
- [缓存服务](#缓存服务)
- [推荐服务](#推荐服务)

---

## WordPress 服务

### WordPressClient

WordPress REST API 客户端类。

#### 构造函数

```typescript
constructor(config: WPConfig)
```

**参数:**
- `config.baseUrl` (string): WordPress 站点 URL
- `config.username?` (string): 用户名（用于认证）
- `config.password?` (string): 应用密码
- `config.timeout?` (number): 请求超时时间（毫秒）

#### 方法

##### 文章 API

**getPosts**
```typescript
async getPosts(params?: WordPressPostsQueryParams): Promise<WordPressPost[]>
```
获取文章列表。

**参数:**
- `page?` (number): 页码
- `per_page?` (number): 每页数量
- `search?` (string): 搜索关键词
- `categories?` (number): 分类 ID
- `tags?` (number): 标签 ID
- `orderby?` ('date' | 'relevance' | 'id' | 'title' | 'slug'): 排序字段
- `order?` ('asc' | 'desc'): 排序方向
- `_embed?` (boolean): 是否嵌入关联数据

**返回:** `Promise<WordPressPost[]>`

---

**getPost**
```typescript
async getPost(id: number, params?: { _embed?: boolean }): Promise<WordPressPost>
```
获取单篇文章。

**参数:**
- `id` (number): 文章 ID
- `_embed?` (boolean): 是否嵌入关联数据

**返回:** `Promise<WordPressPost>`

---

**getPostBySlug**
```typescript
async getPostBySlug(slug: string): Promise<WordPressPost>
```
通过 slug 获取文章。

**参数:**
- `slug` (string): 文章 slug

**返回:** `Promise<WordPressPost>`

---

**createPost**
```typescript
async createPost(post: Partial<WordPressPost>): Promise<WordPressPost>
```
创建文章（需要认证）。

**参数:**
- `post.title` (string): 文章标题
- `post.content` (string): 文章内容
- `post.excerpt?` (string): 摘要
- `post.status?` ('publish' | 'draft'): 状态

**返回:** `Promise<WordPressPost>`

---

**updatePost**
```typescript
async updatePost(id: number, post: Partial<WordPressPost>): Promise<WordPressPost>
```
更新文章（需要认证）。

**参数:**
- `id` (number): 文章 ID
- `post` (Partial<WordPressPost>): 更新数据

**返回:** `Promise<WordPressPost>`

---

**deletePost**
```typescript
async deletePost(id: number, force?: boolean): Promise<void>
```
删除文章（需要认证）。

**参数:**
- `id` (number): 文章 ID
- `force?` (boolean): 是否永久删除

---

##### 分类 API

**getCategories**
```typescript
async getCategories(params?: WordPressCategoriesQueryParams): Promise<WordPressCategory[]>
```
获取分类列表。

**参数:**
- `hide_empty?` (boolean): 隐藏空分类
- `per_page?` (number): 每页数量

**返回:** `Promise<WordPressCategory[]>`

---

**getCategory**
```typescript
async getCategory(id: number): Promise<WordPressCategory>
```
获取单个分类。

---

##### 标签 API

**getTags**
```typescript
async getTags(params?: WordPressTagsQueryParams): Promise<WordPressTag[]>
```
获取标签列表。

---

**getTag**
```typescript
async getTag(id: number): Promise<WordPressTag>
```
获取单个标签。

---

##### 评论 API

**getComments**
```typescript
async getComments(params?: WordPressCommentsQueryParams): Promise<WordPressComment[]>
```
获取评论列表。

**参数:**
- `post?` (number): 文章 ID
- `status?` (string): 评论状态

**返回:** `Promise<WordPressComment[]>`

---

**createComment**
```typescript
async createComment(comment: Partial<WordPressComment>): Promise<WordPressComment>
```
创建评论。

---

##### 媒体 API

**getMedia**
```typescript
async getMedia(params?: { per_page?: number }): Promise<WPMedia[]>
```
获取媒体列表。

---

**uploadMedia**
```typescript
async uploadMedia(file: File): Promise<WPMedia>
```
上传媒体文件。

---

##### 用户 API

**getUsers**
```typescript
async getUsers(params?: { per_page?: number }): Promise<WordPressUser[]>
```
获取用户列表。

---

**getUser**
```typescript
async getUser(id: number): Promise<WordPressUser>
```
获取单个用户。

---

### React Hooks

#### usePosts

```typescript
function usePosts(params?: UsePostsParams): UseQueryResult<WordPressPost[]>
```

**参数:**
- `params?` (UsePostsParams): 查询参数
- `params.enabled?` (boolean): 是否启用查询

**返回:** `UseQueryResult<WordPressPost[]>`

**示例:**
```typescript
const { data: posts, isLoading, error } = usePosts({
  per_page: 10,
  categories: 5,
  _embed: true,
});
```

---

#### usePost

```typescript
function usePost(id: number, options?: UseQueryOptions): UseQueryResult<WordPressPost>
```

**示例:**
```typescript
const { data: post } = usePost(123);
```

---

#### usePostBySlug

```typescript
function usePostBySlug(slug: string): UseQueryResult<WordPressPost>
```

**示例:**
```typescript
const { data: post } = usePostBySlug('my-post-slug');
```

---

#### useFeaturedPosts

```typescript
function useFeaturedPosts(limit?: number): UseQueryResult<WordPressPost[]>
```

**示例:**
```typescript
const { data: featuredPosts } = useFeaturedPosts(5);
```

---

#### useCategories

```typescript
function useCategories(params?: {
  hide_empty?: boolean;
  per_page?: number;
}): UseQueryResult<WordPressCategory[]>
```

---

#### useTags

```typescript
function useTags(params?: {
  hide_empty?: boolean;
  per_page?: number;
}): UseQueryResult<WordPressTag[]>
```

---

#### useComments

```typescript
function useComments(postId?: number): UseQueryResult<WordPressComment[]>
```

---

#### useSearch

```typescript
function useSearch(query: string, enabled?: boolean): UseQueryResult<any[]>
```

**示例:**
```typescript
const { data: results } = useSearch(searchTerm, searchTerm.length >= 3);
```

---

### Mutations

#### useCreatePost

```typescript
function useCreatePost(): UseMutationResult<WordPressPost, Error, CreatePostData>
```

**示例:**
```typescript
const createPost = useCreatePost();

createPost.mutate({
  title: 'New Post',
  content: 'Post content',
  status: 'draft',
});
```

---

#### useUpdatePost

```typescript
function useUpdatePost(): UseMutationResult<WordPressPost, Error, UpdatePostData>
```

---

#### useDeletePost

```typescript
function useDeletePost(): UseMutationResult<void, Error, number>
```

---

#### useCreateComment

```typescript
function useCreateComment(): UseMutationResult<WordPressComment, Error, CreateCommentData>
```

---

#### useUploadMedia

```typescript
function useUploadMedia(): UseMutationResult<WPMedia, Error, File>
```

---

## Analytics 服务

### AnalyticsService

数据分析服务类。

#### 构造函数

```typescript
constructor(config: AnalyticsConfig)
```

**参数:**
- `config.enabled` (boolean): 是否启用
- `config.apiEndpoint?` (string): API 端点
- `config.batchSize?` (number): 批量大小
- `config.flushInterval?` (number): 刷新间隔（毫秒）

#### 方法

##### trackPageView

```typescript
trackPageView(path: string, title: string, metadata?: Record<string, any>): void
```
追踪页面浏览。

**参数:**
- `path` (string): 页面路径
- `title` (string): 页面标题
- `metadata?` (Record<string, any>): 额外元数据

---

##### trackEvent

```typescript
trackEvent(category: string, action: string, label?: string, value?: number): void
```
追踪自定义事件。

**参数:**
- `category` (string): 事件类别
- `action` (string): 事件动作
- `label?` (string): 事件标签
- `value?` (number): 事件值

**示例:**
```typescript
analytics.trackEvent('Engagement', 'Click', 'Share Button', 1);
```

---

##### trackPostView

```typescript
async trackPostView(postId: number, postTitle: string): Promise<void>
```
追踪文章浏览。

---

##### trackComment

```typescript
trackComment(postId: number, postTitle: string): void
```
追踪评论。

---

##### trackLike

```typescript
trackLike(entityType: 'post' | 'comment', entityId: number, title?: string): void
```
追踪点赞。

---

##### trackSearch

```typescript
trackSearch(query: string, resultsCount: number): void
```
追踪搜索。

---

##### getStats

```typescript
async getStats(startDate?: Date, endDate?: Date): Promise<AnalyticsStats>
```
获取统计数据。

---

## AI 分析服务

### AIAnalyzerService

AI 内容分析服务。

#### 方法

##### analyzeContent

```typescript
async analyzeContent(content: string, title?: string): Promise<AnalysisResult>
```
分析内容。

**返回:**
```typescript
{
  summary: string;           // 摘要
  keywords: string[];        // 关键词
  sentiment: 'positive' | 'neutral' | 'negative';  // 情感
  topics: string[];          // 主题
  readingTime: number;       // 阅读时间（分钟）
  language: string;          // 语言
  suggestedTags: string[];   // 推荐标签
  suggestedCategory?: string; // 推荐分类
}
```

---

##### checkQuality

```typescript
async checkQuality(content: string, title?: string): Promise<ContentQuality>
```
检查内容质量。

**返回:**
```typescript
{
  score: number;           // 总分 (0-100)
  readability: number;     // 可读性 (0-100)
  engagement: number;      // 参与度 (0-100)
  seo: number;            // SEO (0-100)
  issues: Array<{         // 问题列表
    type: 'error' | 'warning' | 'info';
    message: string;
    suggestion?: string;
  }>;
}
```

---

##### analyzeSEO

```typescript
async analyzeSEO(content: string, title: string, metaDescription?: string): Promise<SEOAnalysis>
```
分析 SEO。

---

##### generateSummary

```typescript
async generateSummary(content: string, maxLength?: number): Promise<string>
```
生成摘要。

---

##### suggestTags

```typescript
async suggestTags(content: string, title?: string, limit?: number): Promise<string[]>
```
推荐标签。

---

## 通知服务

### NotificationService

实时通知服务。

#### 方法

##### connect

```typescript
connect(userId: number, token: string): void
```
连接到 WebSocket 服务器。

---

##### on

```typescript
on(type: string | '*', callback: (notification: Notification) => void): () => void
```
订阅通知。

**返回:** 取消订阅函数

**示例:**
```typescript
const unsubscribe = notifications.on('comment', (notification) => {
  console.log('New comment:', notification);
});

// 取消订阅
unsubscribe();
```

---

##### onConnectionChange

```typescript
onConnectionChange(callback: (connected: boolean) => void): () => void
```
订阅连接状态变化。

---

##### getNotifications

```typescript
getNotifications(): Notification[]
```
获取所有通知。

---

##### getUnreadNotifications

```typescript
getUnreadNotifications(): Notification[]
```
获取未读通知。

---

##### markAsRead

```typescript
async markAsRead(notificationId: string): Promise<void>
```
标记为已读。

---

##### markAllAsRead

```typescript
async markAllAsRead(): Promise<void>
```
全部标记为已读。

---

##### getStats

```typescript
getStats(): NotificationStats
```
获取通知统计。

**返回:**
```typescript
{
  total: number;           // 总数
  unread: number;          // 未读数
  byType: Record<string, number>;  // 按类型统计
}
```

---

##### updatePreferences

```typescript
async updatePreferences(preferences: Partial<NotificationPreferences>): Promise<void>
```
更新通知偏好。

---

##### requestPermission

```typescript
async requestPermission(): Promise<NotificationPermission>
```
请求浏览器通知权限。

---

## 缓存服务

### CacheService

缓存管理服务。

#### 方法

##### set

```typescript
set<T>(key: string, value: T, options?: CacheOptions): void
```
设置缓存。

**参数:**
- `key` (string): 缓存键
- `value` (T): 缓存值
- `options.ttl?` (number): 过期时间（毫秒）
- `options.persistent?` (boolean): 是否持久化
- `options.metadata?` (Record<string, any>): 元数据

---

##### get

```typescript
get<T>(key: string): T | null
```
获取缓存。

---

##### has

```typescript
has(key: string): boolean
```
检查缓存是否存在。

---

##### delete

```typescript
delete(key: string): boolean
```
删除缓存。

---

##### clear

```typescript
clear(): void
```
清空所有缓存。

---

##### getOrSet

```typescript
getOrSet<T>(key: string, factory: () => T | Promise<T>, options?: CacheOptions): T | Promise<T>
```
获取或设置缓存。

**示例:**
```typescript
const data = await cache.getOrSet('posts', async () => {
  const response = await fetch('/api/posts');
  return response.json();
}, { ttl: 60000 });
```

---

##### getByPattern

```typescript
getByPattern(pattern: string): Map<string, any>
```
通过模式匹配获取缓存。

**示例:**
```typescript
const posts = cache.getByPattern('post:*');
```

---

##### deleteByPattern

```typescript
deleteByPattern(pattern: string): number
```
通过模式匹配删除缓存。

---

##### getStats

```typescript
getStats(): CacheStats
```
获取缓存统计。

**返回:**
```typescript
{
  size: number;        // 缓存条目数
  hits: number;        // 命中次数
  misses: number;      // 未命中次数
  hitRate: number;     // 命中率 (0-1)
  keys: string[];      // 所有键
}
```

---

##### cleanExpired

```typescript
cleanExpired(): number
```
清理过期缓存。

---

## 推荐服务

### EnhancedRecommendationService

增强推荐服务（后端 Python）。

#### 方法

##### get_personalized_recommendations

```python
async def get_personalized_recommendations(
    user_id: int,
    limit: int = 10,
    exclude_post_ids: Optional[List[int]] = None,
) -> List[Post]
```
获取个性化推荐。

**参数:**
- `user_id` (int): 用户 ID
- `limit` (int): 推荐数量
- `exclude_post_ids` (List[int]): 排除的文章 ID

**返回:** `List[Post]`

---

##### get_similar_posts

```python
async def get_similar_posts(
    post_id: int,
    limit: int = 5
) -> List[Post]
```
获取相似文章。

---

##### get_trending_posts

```python
async def get_trending_posts(
    days: int = 7,
    limit: int = 10
) -> List[Post]
```
获取热门文章。

**参数:**
- `days` (int): 天数
- `limit` (int): 数量

---

## 工具函数

### 前端

```typescript
// 缓存便捷函数
import { cache, getCached, setCached, deleteCached, clearCache } from '@/services';

// WordPress 客户端
import { getWordPressClient } from '@/services';
const wpClient = getWordPressClient();

// Analytics
import { initAnalytics, getAnalytics } from '@/services';
const analytics = initAnalytics(config);

// AI 分析器
import { initAIAnalyzer, getAIAnalyzer } from '@/services';
const analyzer = initAIAnalyzer(config);

// 通知服务
import { getNotificationService } from '@/services';
const notifications = getNotificationService();

// 缓存服务
import { getCacheService } from '@/services';
const cache = getCacheService();
```

### 后端

```python
# 推荐服务
from app.services.recommendation_service_enhanced import EnhancedRecommendationService

service = EnhancedRecommendationService(db)
recommendations = await service.get_personalized_recommendations(user_id=1)
```

---

**最后更新:** 2026-03-08
