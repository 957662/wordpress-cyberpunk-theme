'use client'

import { useQuery } from '@tanstack/react-query'
import { wpClient, wpKeys } from '@/lib/wordpress/client'

interface UsePortfolioParams {
  page?: number
  perPage?: number
  category?: string
  search?: string
}

export function usePortfolioItems(params: UsePortfolioParams = {}) {
  return useQuery({
    queryKey: [...wpKeys.portfolio(), params],
    queryFn: () => wpClient.getPortfolioItems(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function usePortfolioItem(slug: string) {
  return useQuery({
    queryKey: wpKeys.portfolioItem(slug),
    queryFn: () => wpClient.getPortfolioItem(slug),
    enabled: !!slug,
  })
}
