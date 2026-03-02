/**
 * Category Service
 * Business logic layer for category operations
 */

import { WordPressClient } from '@/lib/wordpress/api-client';
import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { z } from 'zod';

// Types
export interface Category {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
  meta: any[];
  acf?: { [key: string]: any };
  yoast_head_json?: {
    title?: string;
    description?: string;
  };
}

export interface CategoryTreeItem extends Category {
  children?: CategoryTreeItem[];
  post_count?: number;
}

export interface CategoryInput {
  name: string;
  description?: string;
  slug?: string;
  parent?: number;
  acf?: { [key: string]: any };
}

// Validation Schemas
export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  slug: z.string().max(200).optional(),
  parent: z.number().optional(),
});

export const updateCategorySchema = createCategorySchema.partial().extend({
  id: z.number(),
});

// API Functions
const wpClient = new WordPressClient();

export async function getCategories(perPage: number = 100): Promise<Category[]> {
  try {
    const response = await wpClient.fetch<Category[]>(`/categories`, {
      params: {
        per_page: perPage,
        hide_empty: false,
        _fields: 'id,name,slug,description,count,parent,link,taxonomy',
      },
    });
    return response;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

export async function getCategory(id: number): Promise<Category> {
  try {
    const response = await wpClient.fetch<Category>(`/categories/${id}`);
    return response;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const response = await wpClient.fetch<Category[]>(`/categories`, {
      params: { slug },
    });

    if (!response || response.length === 0) {
      return null;
    }

    return response[0];
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    return null;
  }
}

export async function createCategory(input: CategoryInput): Promise<Category> {
  try {
    const response = await wpClient.fetch<Category>('/categories', {
      method: 'POST',
      data: input,
    });
    return response;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
}

export async function updateCategory(id: number, input: Partial<CategoryInput>): Promise<Category> {
  try {
    const response = await wpClient.fetch<Category>(`/categories/${id}`, {
      method: 'POST',
      data: input,
    });
    return response;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
}

export async function deleteCategory(id: number, force: boolean = false): Promise<void> {
  try {
    await wpClient.fetch(`/categories/${id}?force=${force}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
}

export function buildCategoryTree(categories: Category[]): CategoryTreeItem[] {
  const categoryMap = new Map<number, CategoryTreeItem>();
  const rootCategories: CategoryTreeItem[] = [];

  // First pass: create map and initialize children
  categories.forEach((category) => {
    categoryMap.set(category.id, { ...category, children: [] });
  });

  // Second pass: build tree structure
  categories.forEach((category) => {
    const categoryWithChildren = categoryMap.get(category.id)!;

    if (category.parent === 0) {
      rootCategories.push(categoryWithChildren);
    } else {
      const parent = categoryMap.get(category.parent);
      if (parent) {
        parent.children!.push(categoryWithChildren);
      }
    }
  });

  // Calculate post counts recursively
  const calculatePostCount = (category: CategoryTreeItem): number => {
    let count = category.count;
    if (category.children && category.children.length > 0) {
      count += category.children.reduce((sum, child) => sum + calculatePostCount(child), 0);
    }
    category.post_count = count;
    return count;
  };

  rootCategories.forEach((category) => calculatePostCount(category));

  return rootCategories;
}

export async function getCategoryTree(): Promise<CategoryTreeItem[]> {
  const categories = await getCategories();
  return buildCategoryTree(categories);
}

export function flattenCategoryTree(tree: CategoryTreeItem[]): Category[] {
  const result: Category[] = [];

  const flatten = (nodes: CategoryTreeItem[]) => {
    nodes.forEach((node) => {
      result.push(node);
      if (node.children && node.children.length > 0) {
        flatten(node.children);
      }
    });
  };

  flatten(tree);
  return result;
}

export function getCategoryBreadcrumbs(categoryId: number, categories: Category[]): Category[] {
  const breadcrumbs: Category[] = [];
  let currentCategory = categories.find((c) => c.id === categoryId);

  while (currentCategory) {
    breadcrumbs.unshift(currentCategory);
    if (currentCategory.parent === 0) {
      break;
    }
    currentCategory = categories.find((c) => c.id === currentCategory!.parent);
  }

  return breadcrumbs;
}

// React Query Hooks
export function useCategories(perPage: number = 100, options?: UseQueryOptions<Category[]>) {
  return useQuery({
    queryKey: ['categories', perPage],
    queryFn: () => getCategories(perPage),
    staleTime: 15 * 60 * 1000, // 15 minutes
    ...options,
  });
}

export function useCategory(id: number, options?: UseQueryOptions<Category>) {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => getCategory(id),
    enabled: !!id,
    staleTime: 15 * 60 * 1000,
    ...options,
  });
}

export function useCategoryBySlug(slug: string, options?: UseQueryOptions<Category | null>) {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: () => getCategoryBySlug(slug),
    enabled: !!slug,
    staleTime: 15 * 60 * 1000,
    ...options,
  });
}

export function useCategoryTree() {
  return useQuery({
    queryKey: ['category-tree'],
    queryFn: () => getCategoryTree(),
    staleTime: 15 * 60 * 1000,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CategoryInput) => createCategory(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['category-tree'] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: Partial<CategoryInput> }) =>
      updateCategory(id, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['category', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['category-tree'] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, force }: { id: number; force?: boolean }) => deleteCategory(id, force),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['category-tree'] });
    },
  });
}
