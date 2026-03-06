/**
 * API Configuration
 * API 配置文件
 */

/**
 * WordPress API 配置
 */
export const wordpressConfig = {
  // API 基础 URL
  baseURL: process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://your-site.com/wp-json',

  // 认证信息（如果需要）
  username: process.env.NEXT_PUBLIC_WORDPRESS_USERNAME || '',
  password: process.env.NEXT_PUBLIC_WORDPRESS_APP_PASSWORD || '',

  // 请求超时时间（毫秒）
  timeout: 30000,

  // 每页默认数量
  defaultPerPage: 10,

  // 最大每页数量
  maxPerPage: 100,

  // 缓存配置
  cache: {
    // 默认缓存时间（毫秒）
    defaultTTL: 5 * 60 * 1000, // 5分钟

    // 文章详情缓存时间
    postDetailTTL: 10 * 60 * 1000, // 10分钟

    // 分类/标签缓存时间
    taxonomyTTL: 30 * 60 * 1000, // 30分钟

    // 作者信息缓存时间
    authorTTL: 60 * 60 * 1000, // 1小时

    // 启用缓存
    enabled: true,
  },

  // 重试配置
  retry: {
    // 最大重试次数
    maxRetries: 3,

    // 重试延迟（毫秒）
    retryDelay: 1000,

    // 重试状态码
    retryStatusCodes: [408, 429, 500, 502, 503, 504],
  },

  // 请求头
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

/**
 * 应用 API 配置
 */
export const apiConfig = {
  // 基础 URL
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',

  // 超时时间
  timeout: 30000,

  // 重试配置
  retry: {
    maxRetries: 2,
    retryDelay: 1000,
  },

  // 缓存配置
  cache: {
    enabled: true,
    defaultTTL: 5 * 60 * 1000,
  },
};

/**
 * 图片优化配置
 */
export const imageConfig = {
  // 默认图片质量
  quality: 75,

  // 支持的图片格式
  formats: ['image/webp', 'image/avif'],

  // 图片尺寸
  sizes: {
    thumbnail: 150,
    small: 300,
    medium: 600,
    large: 1200,
    xlarge: 1920,
  },

  // 占位符
  placeholder: '/images/placeholder.jpg',

  // 懒加载
  lazyLoad: true,

  // 图片域名白名单
  domains: [
    'your-wordpress-site.com',
    'cdn.your-wordpress-site.com',
    'secure.gravatar.com',
  ],
};

/**
 * 分页配置
 */
export const paginationConfig = {
  // 默认每页数量
  defaultPageSize: 10,

  // 每页数量选项
  pageSizeOptions: [6, 10, 20, 50],

  // 最大每页数量
  maxPageSize: 100,

  // 显示的页码数量
  pageRange: 5,

  // 无限滚动配置
  infiniteScroll: {
    // 每次加载数量
    pageSize: 10,

    // 触发距离（像素）
    threshold: 200,

    // 最大加载次数
    maxLoadTimes: 10,
  },
};

/**
 * 搜索配置
 */
export const searchConfig = {
  // 最小搜索字符数
  minChars: 2,

  // 搜索延迟（毫秒）
  debounceTime: 300,

  // 最大结果数
  maxResults: 50,

  // 搜索历史
  history: {
    enabled: true,
    maxSize: 10,
    storageKey: 'search-history',
  },

  // 搜索建议
  suggestions: {
    enabled: true,
    maxSuggestions: 5,
  },
};

/**
 * 缓存键前缀
 */
export const cacheKeys = {
  posts: 'posts',
  post: 'post',
  categories: 'categories',
  category: 'category',
  tags: 'tags',
  tag: 'tag',
  authors: 'authors',
  author: 'author',
  comments: 'comments',
  search: 'search',
};

/**
 * Query Key 工厂
 */
export const queryKeys = {
  // 文章
  posts: (params?: any) => [cacheKeys.posts, params] as const,
  post: (id: number | string) => [cacheKeys.post, id] as const,
  postBySlug: (slug: string) => [cacheKeys.post, slug] as const,

  // 分类
  categories: (params?: any) => [cacheKeys.categories, params] as const,
  category: (id: number | string) => [cacheKeys.category, id] as const,

  // 标签
  tags: (params?: any) => [cacheKeys.tags, params] as const,
  tag: (id: number | string) => [cacheKeys.tag, id] as const,

  // 作者
  authors: (params?: any) => [cacheKeys.authors, params] as const,
  author: (id: number | string) => [cacheKeys.author, id] as const,

  // 评论
  comments: (postId: number) => [cacheKeys.comments, postId] as const,

  // 搜索
  search: (query: string, params?: any) => [cacheKeys.search, query, params] as const,

  // 无限滚动
  infinitePosts: (params?: any) => ['infinite', cacheKeys.posts, params] as const,
};

/**
 * 导出所有配置
 */
export const config = {
  wordpress: wordpressConfig,
  api: apiConfig,
  image: imageConfig,
  pagination: paginationConfig,
  search: searchConfig,
  cacheKeys,
  queryKeys,
};
