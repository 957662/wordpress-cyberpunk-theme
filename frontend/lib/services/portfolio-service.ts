/**
 * Portfolio Service
 *
 * Service for portfolio items and projects
 */

import { apiClient } from '../api-client';

// =====================================================
// Types
// =====================================================

export interface PortfolioItem {
  id: number;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  featured_image?: string;
  demo_url?: string;
  source_url?: string;
  technologies?: string[];
  status: 'draft' | 'publish' | 'private';
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
  gallery?: PortfolioGalleryItem[];
}

export interface PortfolioGalleryItem {
  id: number;
  portfolio_item_id: number;
  image_url: string;
  thumbnail_url?: string;
  alt_text?: string;
  caption?: string;
  sort_order: number;
}

export interface PortfolioFilters {
  technology?: string;
  featured?: boolean;
  search?: string;
}

// =====================================================
// Portfolio API
// =====================================================

/**
 * Get all portfolio items
 */
export async function getPortfolioItems(
  params: {
    per_page?: number;
    page?: number;
    status?: 'publish' | 'draft';
    featured?: boolean;
    search?: string;
    technology?: string;
  } = {},
): Promise<{ data: PortfolioItem[]; total: number; totalPages: number }> {
  try {
    const response = await apiClient.get('/portfolio', { params });
    return {
      data: response.data,
      total: parseInt(response.headers['x-wp-total'] || '0', 10),
      totalPages: parseInt(response.headers['x-wp-totalpages'] || '0', 10),
    };
  } catch (error) {
    console.error('Error fetching portfolio items:', error);
    return { data: [], total: 0, totalPages: 0 };
  }
}

/**
 * Get a single portfolio item by slug
 */
export async function getPortfolioItem(slug: string): Promise<PortfolioItem> {
  try {
    const response = await apiClient.get(`/portfolio/${slug}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching portfolio item ${slug}:`, error);
    throw error;
  }
}

/**
 * Get featured portfolio items
 */
export async function getFeaturedPortfolio(
  limit: number = 6,
): Promise<PortfolioItem[]> {
  try {
    const response = await apiClient.get('/portfolio', {
      params: {
        per_page: limit,
        featured: true,
        status: 'publish',
        orderby: 'sort_order',
        order: 'asc',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching featured portfolio:', error);
    return [];
  }
}

/**
 * Get unique technologies from portfolio items
 */
export async function getPortfolioTechnologies(): Promise<string[]> {
  try {
    const response = await apiClient.get('/portfolio/technologies');
    return response.data;
  } catch (error) {
    console.error('Error fetching technologies:', error);
    return [];
  }
}

/**
 * Search portfolio items
 */
export async function searchPortfolioItems(
  query: string,
  filters?: PortfolioFilters,
): Promise<PortfolioItem[]> {
  try {
    const response = await apiClient.get('/portfolio', {
      params: {
        search: query,
        technology: filters?.technology,
        featured: filters?.featured,
        status: 'publish',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching portfolio:', error);
    return [];
  }
}

// =====================================================
// Portfolio Service Object
// =====================================================

export const portfolioService = {
  getPortfolioItems,
  getPortfolioItem,
  getFeaturedPortfolio,
  getPortfolioTechnologies,
  searchPortfolioItems,
};

export default portfolioService;
