/**
 * Products API Service
 * Handles all product-related API calls
 */

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  features: string[];
  popular?: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  currency: string;
  features: string[];
  popular?: boolean;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  features?: string[];
  popular?: boolean;
  active?: boolean;
}

class ProductsService {
  private baseUrl = `${API_BASE_URL}/products`;

  /**
   * Get all products
   */
  async getProducts(params?: {
    skip?: number;
    limit?: number;
    active?: boolean;
  }): Promise<Product[]> {
    try {
      const response = await axios.get<Product[]>(this.baseUrl, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  /**
   * Get a single product by ID
   */
  async getProduct(id: string): Promise<Product> {
    try {
      const response = await axios.get<Product>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new product
   */
  async createProduct(data: CreateProductDto): Promise<Product> {
    try {
      const response = await axios.post<Product>(this.baseUrl, data);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  /**
   * Update an existing product
   */
  async updateProduct(id: string, data: UpdateProductDto): Promise<Product> {
    try {
      const response = await axios.patch<Product>(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a product
   */
  async deleteProduct(id: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get featured products
   */
  async getFeaturedProducts(): Promise<Product[]> {
    try {
      const response = await axios.get<Product[]>(`${this.baseUrl}/featured`);
      return response.data;
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const productsService = new ProductsService();
