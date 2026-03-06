/**
 * Data Layer - Unified Exports
 *
 * Central export point for all server-side data fetching functions.
 */

// Posts
export {
  getPosts,
  getPostBySlug,
  searchPosts,
  type GetPostsParams,
  type PostsResponse,
  type GetPostBySlugParams,
} from './posts';

// Categories & Tags
export {
  getAllCategories,
  getAllTags,
  getCategoryBySlug,
  getTagBySlug,
  getPopularCategories,
  getPopularTags,
  type CategoryWithPostCount,
  type TagWithPostCount,
} from './categories';

// Adapters
export {
  adaptWordPressPost,
  adaptWordPressPosts,
  isWordPressPost,
  adaptPost,
  adaptPosts,
  type WordPressPostRaw,
} from './adapter';
