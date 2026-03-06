/**
 * 博客状态管理 Store
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  coverImage?: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: number;
  views: number;
  likes: number;
  comments: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

interface BlogStore {
  // 状态
  posts: BlogPost[];
  currentPost: BlogPost | null;
  loading: boolean;
  error: string | null;

  // 用户交互状态
  likedPosts: Set<string>;
  bookmarkedPosts: Set<string>;
  readingHistory: string[];

  // Actions
  setPosts: (posts: BlogPost[]) => void;
  setCurrentPost: (post: BlogPost | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // 点赞/取消点赞
  toggleLike: (postId: string) => void;
  isLiked: (postId: string) => boolean;

  // 收藏/取消收藏
  toggleBookmark: (postId: string) => void;
  isBookmarked: (postId: string) => boolean;

  // 阅读历史
  addToReadingHistory: (postId: string) => void;
  clearReadingHistory: () => void;
  isInReadingHistory: (postId: string) => boolean;

  // 更新文章
  updatePost: (postId: string, updates: Partial<BlogPost>) => void;

  // 重置
  reset: () => void;
}

const initialState = {
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
  likedPosts: new Set<string>(),
  bookmarkedPosts: new Set<string>(),
  readingHistory: [],
};

export const useBlogStore = create<BlogStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setPosts: (posts) => set({ posts }),

        setCurrentPost: (post) => set({ currentPost: post }),

        setLoading: (loading) => set({ loading }),

        setError: (error) => set({ error }),

        toggleLike: (postId) => {
          const { likedPosts, posts, currentPost } = get();
          const newLikedPosts = new Set(likedPosts);

          if (newLikedPosts.has(postId)) {
            newLikedPosts.delete(postId);
          } else {
            newLikedPosts.add(postId);
          }

          // 更新文章列表中的点赞状态
          const updatedPosts = posts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  isLiked: newLikedPosts.has(postId),
                  likes: post.likes + (newLikedPosts.has(postId) ? 1 : -1),
                }
              : post
          );

          // 更新当前文章
          let updatedCurrentPost = currentPost;
          if (currentPost?.id === postId) {
            updatedCurrentPost = {
              ...currentPost,
              isLiked: newLikedPosts.has(postId),
              likes: currentPost.likes + (newLikedPosts.has(postId) ? 1 : -1),
            };
          }

          set({
            likedPosts: newLikedPosts,
            posts: updatedPosts,
            currentPost: updatedCurrentPost,
          });
        },

        isLiked: (postId) => {
          return get().likedPosts.has(postId);
        },

        toggleBookmark: (postId) => {
          const { bookmarkedPosts, posts, currentPost } = get();
          const newBookmarkedPosts = new Set(bookmarkedPosts);

          if (newBookmarkedPosts.has(postId)) {
            newBookmarkedPosts.delete(postId);
          } else {
            newBookmarkedPosts.add(postId);
          }

          // 更新文章列表中的收藏状态
          const updatedPosts = posts.map((post) =>
            post.id === postId
              ? { ...post, isBookmarked: newBookmarkedPosts.has(postId) }
              : post
          );

          // 更新当前文章
          let updatedCurrentPost = currentPost;
          if (currentPost?.id === postId) {
            updatedCurrentPost = {
              ...currentPost,
              isBookmarked: newBookmarkedPosts.has(postId),
            };
          }

          set({
            bookmarkedPosts: newBookmarkedPosts,
            posts: updatedPosts,
            currentPost: updatedCurrentPost,
          });
        },

        isBookmarked: (postId) => {
          return get().bookmarkedPosts.has(postId);
        },

        addToReadingHistory: (postId) => {
          const { readingHistory } = get();
          const newHistory = [postId, ...readingHistory.filter((id) => id !== postId)].slice(
            0,
            50
          ); // 只保留最近50篇

          set({ readingHistory: newHistory });
        },

        clearReadingHistory: () => {
          set({ readingHistory: [] });
        },

        isInReadingHistory: (postId) => {
          return get().readingHistory.includes(postId);
        },

        updatePost: (postId, updates) => {
          const { posts, currentPost } = get();

          const updatedPosts = posts.map((post) =>
            post.id === postId ? { ...post, ...updates } : post
          );

          let updatedCurrentPost = currentPost;
          if (currentPost?.id === postId) {
            updatedCurrentPost = { ...currentPost, ...updates };
          }

          set({
            posts: updatedPosts,
            currentPost: updatedCurrentPost,
          });
        },

        reset: () => set(initialState),
      }),
      {
        name: 'blog-storage',
        partialize: (state) => ({
          likedPosts: Array.from(state.likedPosts),
          bookmarkedPosts: Array.from(state.bookmarkedPosts),
          readingHistory: state.readingHistory,
        }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            // 将数组转换回 Set
            state.likedPosts = new Set(state.likedPosts as unknown as string[]);
            state.bookmarkedPosts = new Set(state.bookmarkedPosts as unknown as string[]);
          }
        },
      }
    ),
    { name: 'BlogStore' }
  )
);
