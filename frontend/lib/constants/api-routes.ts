/**
 * API Routes Constants
 * API 路由常量
 */

export const API_ROUTES = {
  // 认证
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    LOGOUT: '/api/v1/auth/logout',
    REFRESH: '/api/v1/auth/refresh',
    VERIFY: '/api/v1/auth/verify',
    FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
    RESET_PASSWORD: '/api/v1/auth/reset-password',
  },

  // 用户
  USERS: {
    LIST: '/api/v1/users',
    ME: '/api/v1/users/me',
    DETAIL: (id: number) => `/api/v1/users/${id}`,
    UPDATE: (id: number) => `/api/v1/users/${id}`,
    DELETE: (id: number) => `/api/v1/users/${id}`,
    FOLLOWERS: (id: number) => `/api/v1/users/${id}/followers`,
    FOLLOWING: (id: number) => `/api/v1/users/${id}/following`,
    AVATAR: (id: number) => `/api/v1/users/${id}/avatar`,
  },

  // 文章
  POSTS: {
    LIST: '/api/v1/posts',
    FEATURED: '/api/v1/posts/featured',
    TRENDING: '/api/v1/posts/trending',
    DETAIL: (slug: string) => `/api/v1/posts/${slug}`,
    UPDATE: (id: number) => `/api/v1/posts/${id}`,
    DELETE: (id: number) => `/api/v1/posts/${id}`,
    LIKE: (id: number) => `/api/v1/posts/${id}/like`,
    BOOKMARK: (id: number) => `/api/v1/posts/${id}/bookmark`,
    SHARE: (id: number) => `/api/v1/posts/${id}/share`,
  },

  // 分类
  CATEGORIES: {
    LIST: '/api/v1/categories',
    DETAIL: (slug: string) => `/api/v1/categories/${slug}`,
    POSTS: (slug: string) => `/api/v1/categories/${slug}/posts`,
  },

  // 标签
  TAGS: {
    LIST: '/api/v1/tags',
    DETAIL: (slug: string) => `/api/v1/tags/${slug}`,
    POSTS: (slug: string) => `/api/v1/tags/${slug}/posts`,
  },

  // 评论
  COMMENTS: {
    LIST: (postId: number) => `/api/v1/posts/${postId}/comments`,
    CREATE: (postId: number) => `/api/v1/posts/${postId}/comments`,
    DETAIL: (postId: number, commentId: number) =>
      `/api/v1/posts/${postId}/comments/${commentId}`,
    UPDATE: (postId: number, commentId: number) =>
      `/api/v1/posts/${postId}/comments/${commentId}`,
    DELETE: (postId: number, commentId: number) =>
      `/api/v1/posts/${postId}/comments/${commentId}`,
    LIKE: (postId: number, commentId: number) =>
      `/api/v1/posts/${postId}/comments/${commentId}/like`,
  },

  // 通知
  NOTIFICATIONS: {
    LIST: '/api/v1/notifications',
    UNREAD: '/api/v1/notifications/unread',
    MARK_READ: (id: number) => `/api/v1/notifications/${id}/read`,
    MARK_ALL_READ: '/api/v1/notifications/read-all',
  },

  // 搜索
  SEARCH: {
    POSTS: '/api/v1/search/posts',
    USERS: '/api/v1/search/users',
    ALL: '/api/v1/search',
  },

  // 媒体
  MEDIA: {
    LIST: '/api/v1/media',
    UPLOAD: '/api/v1/media/upload',
    DETAIL: (id: number) => `/api/v1/media/${id}`,
    DELETE: (id: number) => `/api/v1/media/${id}`,
  },

  // 社交
  SOCIAL: {
    FOLLOW: (userId: number) => `/api/v1/social/follow/${userId}`,
    UNFOLLOW: (userId: number) => `/api/v1/social/unfollow/${userId}`,
    FOLLOWERS: (userId: number) => `/api/v1/social/${userId}/followers`,
    FOLLOWING: (userId: number) => `/api/v1/social/${userId}/following`,
  },

  // 分析
  ANALYTICS: {
    VIEWS: '/api/v1/analytics/views',
    POPULAR: '/api/v1/analytics/popular',
    STATS: '/api/v1/analytics/stats',
  },

  // 设置
  SETTINGS: {
    GENERAL: '/api/v1/settings/general',
    PROFILE: '/api/v1/settings/profile',
    NOTIFICATIONS: '/api/v1/settings/notifications',
    PRIVACY: '/api/v1/settings/privacy',
  },
} as const;

// WordPress REST API 路由
export const WP_API_ROUTES = {
  POSTS: '/wp/v2/posts',
  PAGES: '/wp/v2/pages',
  CATEGORIES: '/wp/v2/categories',
  TAGS: '/wp/v2/tags',
  MEDIA: '/wp/v2/media',
  COMMENTS: '/wp/v2/comments',
  USERS: '/wp/v2/users',
  SEARCH: '/wp/v2/search',
} as const;
