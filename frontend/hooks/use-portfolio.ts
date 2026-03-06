/**
 * Portfolio Hooks
 *
 * Custom React hooks for portfolio functionality
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

import type { PortfolioItem, PortfolioFilters } from '../lib/services/portfolio-service';
import { portfolioService } from '../lib/services/portfolio-service';

// =====================================================
// usePortfolio Hook
// =====================================================

export interface UsePortfolioResult {
  items: PortfolioItem[];
  featured: PortfolioItem[];
  total: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  isError: boolean;
  error?: Error;
  refetch: () => void;
  setPage: (page: number) => void;
}

export interface UsePortfolioParams {
  page?: number;
  per_page?: number;
  featured?: boolean;
  technology?: string;
  search?: string;
  enabled?: boolean;
}

export function usePortfolio(params: UsePortfolioParams = {}): UsePortfolioResult {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [featured, setFeatured] = useState<PortfolioItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(params.page || 1);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | undefined>();

  const fetchPortfolio = useCallback(async () => {
    if (params.enabled === false) {
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setError(undefined);

    try {
      const response = await portfolioService.getPortfolioItems({
        page: currentPage,
        per_page: params.per_page || 12,
        featured: params.featured,
        technology: params.technology,
        search: params.search,
      });

      setItems(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err : new Error('Failed to fetch portfolio'));
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, params]);

  // Fetch featured items separately
  const fetchFeatured = useCallback(async () => {
    try {
      const items = await portfolioService.getFeaturedPortfolio(6);
      setFeatured(items);
    } catch (err) {
      console.error('Failed to fetch featured portfolio:', err);
    }
  }, []);

  useEffect(() => {
    fetchPortfolio();
    fetchFeatured();
  }, [fetchPortfolio, fetchFeatured]);

  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return {
    items,
    featured,
    total,
    totalPages,
    currentPage,
    isLoading,
    isError,
    error,
    refetch: fetchPortfolio,
    setPage,
  };
}

// =====================================================
// usePortfolioItem Hook
// =====================================================

export interface UsePortfolioItemResult {
  item: PortfolioItem | null;
  isLoading: boolean;
  isError: boolean;
  error?: Error;
}

export function usePortfolioItem(slug: string, enabled: boolean = true): UsePortfolioItemResult {
  const [item, setItem] = useState<PortfolioItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    if (!enabled || !slug) {
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setError(undefined);

    portfolioService
      .getPortfolioItem(slug)
      .then(setItem)
      .catch((err) => {
        setIsError(true);
        setError(err instanceof Error ? err : new Error('Failed to fetch portfolio item'));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [slug, enabled]);

  return {
    item,
    isLoading,
    isError,
    error,
  };
}

// =====================================================
// usePortfolioTechnologies Hook
// =====================================================

export function usePortfolioTechnologies(): string[] {
  const [technologies, setTechnologies] = useState<string[]>([]);

  useEffect(() => {
    portfolioService
      .getPortfolioTechnologies()
      .then(setTechnologies)
      .catch(console.error);
  }, []);

  return technologies;
}

// =====================================================
// usePortfolioSearch Hook
// =====================================================

export interface UsePortfolioSearchResult {
  results: PortfolioItem[];
  isLoading: boolean;
  search: (query: string, filters?: PortfolioFilters) => Promise<void>;
  clearSearch: () => void;
  query: string;
}

export function usePortfolioSearch() {
  const [results, setResults] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');

  const search = useCallback(async (searchQuery: string, filters?: PortfolioFilters) => {
    if (!searchQuery.trim()) {
      return;
    }

    setIsLoading(true);
    setQuery(searchQuery);

    try {
      const items = await portfolioService.searchPortfolioItems(searchQuery, filters);
      setResults(items);
    } catch (err) {
      console.error('Portfolio search failed:', err);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setResults([]);
    setQuery('');
  }, []);

  return {
    results,
    isLoading,
    search,
    clearSearch,
    query,
  };
}
