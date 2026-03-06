/**
 * WordPress React Query Hooks
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wpClient } from './client-new';
import { Post, Category, Tag, Author, Comment, PostFilters } from '@/types/blog';

export function usePosts(filters: PostFilters = {}) {
  return useQuery({
    queryKey: ['posts', filters],
    queryFn: async () => {
      const res = await wpClient.getPosts({
        page: filters.page,
        per_page: filters.pageSize,
        search: filters.search,
        orderby: filters.sortBy,
        order: filters.sortOrder,
      });
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function usePost(id: string | number) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const res = await wpClient.getPost(id);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await wpClient.getCategories({ per_page: 100 });
      return res.data;
    },
    staleTime: 30 * 60 * 1000,
  });
}

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const res = await wpClient.getTags({ per_page: 100 });
      return res.data;
    },
    staleTime: 30 * 60 * 1000,
  });
}

export function useAuthors() {
  return useQuery({
    queryKey: ['authors'],
    queryFn: async () => {
      const res = await wpClient.getAuthors({ per_page: 100 });
      return res.data;
    },
    staleTime: 60 * 60 * 1000,
  });
}

export function useComments(postId: string | number) {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const res = await wpClient.getComments({ post: postId });
      return res.data;
    },
    enabled: !!postId,
  });
}
