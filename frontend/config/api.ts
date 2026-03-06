/**
 * API Configuration
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const API endpoints = {
  // Auth
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    me: '/auth/me',
    refresh: '/auth/refresh',
  },

  // Blog
  blog: {
    list: '/blog',
    get: (slug: string) => `/blog/${slug}`,
    related: (slug: string) => `/blog/${slug}/related`,
    categories: '/blog/categories',
    tags: '/blog/tags',
    search: '/blog/search',
    trending: '/blog/trending',
    like: (slug: string) => `/blog/${slug}/like`,
    bookmark: (slug: string) => `/blog/${slug}/bookmark`,
    bookmarks: '/blog/bookmarks',
  },

  // Comments
  comments: {
    list: '/comments',
    add: '/comments',
    get: (id: string) => `/comments/${id}`,
    update: (id: string) => `/comments/${id}`,
    delete: (id: string) => `/comments/${id}`,
    like: (id: string) => `/comments/${id}/like`,
  },

  // Social
  social: {
    follow: '/social/follow',
    followers: (userId: string) => `/social/followers/${userId}`,
    following: (userId: string) => `/social/following/${userId}`,
    checkFollowing: (userId: string) => `/social/following/check/${userId}`,
  },

  // User
  user: {
    profile: '/auth/profile',
    update: '/auth/profile',
    avatar: '/auth/avatar',
  },
};

export default API;
