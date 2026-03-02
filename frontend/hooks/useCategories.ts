/**
 * useCategories Hook
 * 分类数据管理Hook
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/services/api';

/**
 * 获取分类列表
 */
export function useCategories(params?: {
  page?: number;
  per_page?: number;
  search?: string;
}) {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => api.categories.getCategories(params),
    staleTime: 15 * 60 * 1000, // 15分钟
  });
}

/**
 * 获取分类详情
 */
export function useCategory(id: number) {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => api.categories.getCategory(id),
    enabled: !!id,
    staleTime: 15 * 60 * 1000, // 15分钟
  });
}

/**
 * 创建分类
 */
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; description?: string; slug?: string }) =>
      api.categories.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

/**
 * 更新分类
 */
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      api.categories.updateCategory(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['category', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

/**
 * 删除分类
 */
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.categories.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}
