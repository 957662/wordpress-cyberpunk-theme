/**
 * useTags Hook
 * 标签数据管理Hook
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/services/api';

/**
 * 获取标签列表
 */
export function useTags(params?: {
  page?: number;
  per_page?: number;
  search?: string;
}) {
  return useQuery({
    queryKey: ['tags', params],
    queryFn: () => api.tags.getTags(params),
    staleTime: 15 * 60 * 1000, // 15分钟
  });
}

/**
 * 获取标签详情
 */
export function useTag(id: number) {
  return useQuery({
    queryKey: ['tag', id],
    queryFn: () => api.tags.getTag(id),
    enabled: !!id,
    staleTime: 15 * 60 * 1000, // 15分钟
  });
}

/**
 * 创建标签
 */
export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; slug?: string }) =>
      api.tags.createTag(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}

/**
 * 更新标签
 */
export function useUpdateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      api.tags.updateTag(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tag', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}

/**
 * 删除标签
 */
export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.tags.deleteTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}
