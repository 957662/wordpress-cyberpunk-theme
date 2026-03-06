/**
 * WordPress React Query Hooks
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { getWPClient, WPPost } from './client';

export const wpKeys = {
  all: ['wordpress'] as const,
  posts: () => [...wpKeys.all, 'posts'] as const,
  post: (id: number) => [...wpKeys.posts(), id] as const,
  postBySlug: (slug: string) => [...wpKeys.posts(), 'slug', slug] as const,
  search: (query: string) => [...wpKeys.all, 'search', query] as const,
};

export function usePosts(
  params?: any,
  options?: Omit<UseQueryOptions<WPPost[], Error>, 'queryKey' | 'queryFn'>
) {
  const client = getWPClient();

  return useQuery({
    queryKey: [...wpKeys.posts(), params],
    queryFn: () => client.getPosts(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
}

export function usePost(
  id: number,
  options?: Omit<UseQueryOptions<WPPost, Error>, 'queryKey' | 'queryFn'>
) {
  const client = getWPClient();

  return useQuery({
    queryKey: wpKeys.post(id),
    queryFn: () => client.getPost(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}

export function usePostBySlug(
  slug: string,
  options?: Omit<UseQueryOptions<WPPost, Error>, 'queryKey' | 'queryFn'>
) {
  const client = getWPClient();

  return useQuery({
    queryKey: wpKeys.postBySlug(slug),
    queryFn: () => client.getPostBySlug(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}

export function useSearch(
  query: string,
  params?: any,
  options?: Omit<UseQueryOptions<WPPost[], Error>, 'queryKey' | 'queryFn'>
) {
  const client = getWPClient();

  return useQuery({
    queryKey: [...wpKeys.search(query), params],
    queryFn: () => client.search(query, params),
    enabled: !!query && query.length > 2,
    staleTime: 2 * 60 * 1000,
    ...options,
  });
}
