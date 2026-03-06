/**
 * API 路由配置
 */

export const API_ROUTES = {
  // 认证相关
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    LOGOUT: '/api/v1/auth/logout',
    REFRESH: '/api/v1/auth/refresh',
    ME: '/api/v1/auth/me',
    FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
    RESET_PASSWORD: '/api/v1/auth/reset-password',
    VERIFY_EMAIL: '/api/v1/auth/verify-email',
    RESEND_VERIFICATION: '/api/v1/auth/resend-verification',
    CHANGE_PASSWORD: '/api/v1/auth/change-password',
  },

  // 文章相关
  POSTS: {
    LIST: '/api/v1/posts',
    DETAIL: (id: string) => `/api/v1/posts/${id}`,
    BY_SLUG: (slug: string) => `/api/v1/posts/slug/${slug}`,
    CREATE: '/api/v1/posts',
    UPDATE: (id: string) => `/api/v1/posts/${id}`,
    DELETE: (id: string) => `/api/v1/posts/${id}`,
    LIKE: (id: string) => `/api/v1/posts/${id}/like`,
    BOOKMARK: (id: string) => `/api/v1/posts/${id}/bookmark`,
    VIEWS: (id: string) => `/api/v1/posts/${id}/views`,
    SEARCH: '/api/v1/posts/search',
    TRENDING: '/api/v1/posts/trending',
    FEATURED: '/api/v1/posts/featured',
    LATEST: '/api/v1/posts/latest',
    RELATED: (id: string) => `/api/v1/posts/${id}/related`,
    USER: (userId: string) => `/api/v1/posts/user/${userId}`,
    CATEGORY: (categoryId: string) => `/api/v1/posts/category/${categoryId}`,
    TAG: (tagId: string) => `/api/v1/posts/tag/${tagId}`,
  },

  // 评论相关
  COMMENTS: {
    LIST: (postId: string) => `/api/v1/comments/post/${postId}`,
    DETAIL: (id: string) => `/api/v1/comments/${id}`,
    CREATE: '/api/v1/comments',
    UPDATE: (id: string) => `/api/v1/comments/${id}`,
    DELETE: (id: string) => `/api/v1/comments/${id}`,
    LIKE: (id: string) => `/api/v1/comments/${id}/like`,
    REPORT: (id: string) => `/api/v1/comments/${id}/report`,
    REPLIES: (id: string) => `/api/v1/comments/${id}/replies`,
    SEARCH: '/api/v1/comments/search',
    USER: (userId: string) => `/api/v1/comments/user/${userId}`,
    ADMIN: '/api/v1/comments/admin',
    STATS: '/api/v1/comments/stats',
  },

  // 用户相关
  USERS: {
    LIST: '/api/v1/users',
    DETAIL: (id: string) => `/api/v1/users/${id}`,
    PROFILE: (username: string) => `/api/v1/users/profile/${username}`,
    UPDATE: (id: string) => `/api/v1/users/${id}`,
    DELETE: (id: string) => `/api/v1/users/${id}`,
    FOLLOW: (id: string) => `/api/v1/users/${id}/follow`,
    UNFOLLOW: (id: string) => `/api/v1/users/${id}/follow`,
    FOLLOWERS: (id: string) => `/api/v1/users/${id}/followers`,
    FOLLOWING: (id: string) => `/api/v1/users/${id}/following`,
    AVATAR: '/api/v1/users/avatar',
    SEARCH: '/api/v1/users/search',
    CHECK_USERNAME: (username: string) => `/api/v1/users/check-username/${username}`,
    CHECK_EMAIL: (email: string) => `/api/v1/users/check-email/${email}`,
  },

  // 分类相关
  CATEGORIES: {
    LIST: '/api/v1/categories',
    DETAIL: (id: string) => `/api/v1/categories/${id}`,
    CREATE: '/api/v1/categories',
    UPDATE: (id: string) => `/api/v1/categories/${id}`,
    DELETE: (id: string) => `/api/v1/categories/${id}`,
    POSTS: (id: string) => `/api/v1/categories/${id}/posts`,
  },

  // 标签相关
  TAGS: {
    LIST: '/api/v1/tags',
    DETAIL: (id: string) => `/api/v1/tags/${id}`,
    CREATE: '/api/v1/tags',
    UPDATE: (id: string) => `/api/v1/tags/${id}`,
    DELETE: (id: string) => `/api/v1/tags/${id}`,
    POSTS: (id: string) => `/api/v1/tags/${id}/posts`,
    POPULAR: '/api/v1/tags/popular',
  },

  // 通知相关
  NOTIFICATIONS: {
    LIST: '/api/v1/notifications',
    DETAIL: (id: string) => `/api/v1/notifications/${id}`,
    MARK_READ: (id: string) => `/api/v1/notifications/${id}/read`,
    MARK_ALL_READ: '/api/v1/notifications/read-all',
    DELETE: (id: string) => `/api/v1/notifications/${id}`,
    COUNT: '/api/v1/notifications/count',
    SETTINGS: '/api/v1/notifications/settings',
  },

  // 收藏相关
  BOOKMARKS: {
    LIST: '/api/v1/bookmarks',
    DETAIL: (id: string) => `/api/v1/bookmarks/${id}`,
    CREATE: '/api/v1/bookmarks',
    DELETE: (id: string) => `/api/v1/bookmarks/${id}`,
    FOLDERS: '/api/v1/bookmarks/folders',
    FOLDER: (folderId: string) => `/api/v1/bookmarks/folders/${folderId}`,
  },

  // 搜索相关
  SEARCH: {
    POSTS: '/api/v1/search/posts',
    USERS: '/api/v1/search/users',
    COMMENTS: '/api/v1/search/comments',
    SUGGEST: '/api/v1/search/suggest',
    RECENT: '/api/v1/search/recent',
  },

  // 媒体相关
  MEDIA: {
    LIST: '/api/v1/media',
    UPLOAD: '/api/v1/media/upload',
    DETAIL: (id: string) => `/api/v1/media/${id}`,
    DELETE: (id: string) => `/api/v1/media/${id}`,
    UPDATE: (id: string) => `/api/v1/media/${id}`,
  },

  // 统计相关
  STATS: {
    DASHBOARD: '/api/v1/stats/dashboard',
    POSTS: '/api/v1/stats/posts',
    USERS: '/api/v1/stats/users',
    COMMENTS: '/api/v1/stats/comments',
    ANALYTICS: '/api/v1/stats/analytics',
  },

  // 设置相关
  SETTINGS: {
    SITE: '/api/v1/settings/site',
    USER: '/api/v1/settings/user',
    EMAIL: '/api/v1/settings/email',
    SECURITY: '/api/v1/settings/security',
  },

  // 健康检查
  HEALTH: {
    CHECK: '/api/v1/health',
    VERSION: '/api/v1/version',
  },
} as const;

// 导出类型
export type ApiRoute = typeof API_ROUTES;
