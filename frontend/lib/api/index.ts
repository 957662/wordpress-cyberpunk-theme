/**
 * API Index
 * 统一导出所有 API 接口
 */

// API Client
export { apiClient } from './client';
export { enhancedClient } from './enhanced-client';

// Posts API
export * from './posts';

// Categories API
export * from './categories';

// Tags API
export * from './tags';

// Comments API
export * from './comments';

// Media API
export * from './media';

// 便捷导入
import {
  getPosts,
  getPostBySlug,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from './posts';

import {
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  getPopularCategories,
} from './categories';

import {
  getTags,
  getTagById,
  getTagBySlug,
  getPopularTags,
} from './tags';

import {
  getComments,
  getCommentsByPostId,
  createComment,
  buildCommentTree,
} from './comments';

import {
  getMedia,
  getMediaById,
  uploadMedia,
  updateMedia,
  deleteMedia,
  getImages,
  getBestMediaUrl,
} from './media';

/**
 * WordPress API 统一接口
 */
export const wordpressApi = {
  // Posts
  posts: {
    list: getPosts,
    bySlug: getPostBySlug,
    byId: getPostById,
    create: createPost,
    update: updatePost,
    delete: deletePost,
  },

  // Categories
  categories: {
    list: getCategories,
    byId: getCategoryById,
    bySlug: getCategoryBySlug,
    popular: getPopularCategories,
  },

  // Tags
  tags: {
    list: getTags,
    byId: getTagById,
    bySlug: getTagBySlug,
    popular: getPopularTags,
  },

  // Comments
  comments: {
    list: getComments,
    byPost: getCommentsByPostId,
    create: createComment,
    buildTree: buildCommentTree,
  },

  // Media
  media: {
    list: getMedia,
    byId: getMediaById,
    upload: uploadMedia,
    update: updateMedia,
    delete: deleteMedia,
    images: getImages,
    bestUrl: getBestMediaUrl,
  },
};

export default wordpressApi;
