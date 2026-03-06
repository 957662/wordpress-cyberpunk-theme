/**
 * WordPress REST API Client
 * 用于与 WordPress 后端通信
 */

import axios, { AxiosInstance, AxiosError } from 'axios';

export interface WPConfig {
  baseURL: string;
  timeout?: number;
  auth?: {
    username: string;
    password: string;
  };
}

export interface WPPost {
  id: number;
  date: string;
  date_gmt: string;
  guid: { rendered: string };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string; protected: boolean };
  excerpt: { rendered: string; protected: boolean };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: any[];
  categories: number[];
  tags: number[];
  _links: any;
}

export class WordPressClient {
  private client: AxiosInstance;

  constructor(config: WPConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (config.auth) {
      this.client.defaults.auth = {
        username: config.auth.username,
        password: config.auth.password,
      };
    }

    this.client.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response) {
          console.error('WordPress API Error:', error.response.data);
        } else if (error.request) {
          console.error('WordPress API No Response:', error.request);
        } else {
          console.error('WordPress API Request Error:', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  async getPosts(params?: any): Promise<WPPost[]> {
    const response = await this.client.get<WPPost[]>('/wp/v2/posts', { params });
    return response.data;
  }

  async getPost(id: number): Promise<WPPost> {
    const response = await this.client.get<WPPost>(`/wp/v2/posts/${id}`);
    return response.data;
  }

  async getPostBySlug(slug: string): Promise<WPPost> {
    const response = await this.client.get<WPPost[]>('/wp/v2/posts', {
      params: { slug },
    });
    return response.data[0];
  }

  async search(query: string, params?: any): Promise<WPPost[]> {
    const response = await this.client.get<WPPost[]>('/wp/v2/search', {
      params: {
        search: query,
        subtype: params?.subtype || ['post', 'page'],
        per_page: params?.per_page || 10,
        page: params?.page || 1,
      },
    });
    return response.data;
  }
}

let wpClientInstance: WordPressClient | null = null;

export function createWPClient(config: WPConfig): WordPressClient {
  wpClientInstance = new WordPressClient(config);
  return wpClientInstance;
}

export function getWPClient(): WordPressClient {
  if (!wpClientInstance) {
    throw new Error('WordPress client not initialized. Call createWPClient first.');
  }
  return wpClientInstance;
}

export default WordPressClient;
