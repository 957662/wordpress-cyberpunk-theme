import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API 响应类型
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  timestamp?: number;
}

// 分页请求参数
export interface PaginationParams {
  page: number;
  pageSize: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

// 分页响应数据
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 创建 axios 实例
const createApiInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // 请求拦截器
  instance.interceptors.request.use(
    (config) => {
      // 从 localStorage 获取 token
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // 添加时间戳防止缓存
      if (config.method === 'get') {
        config.params = {
          ...config.params,
          _t: Date.now()
        };
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      const res = response.data as ApiResponse;
      
      // 根据业务状态码处理
      if (res.code !== 200) {
        return Promise.reject(new Error(res.message || '请求失败'));
      }
      
      return response;
    },
    (error) => {
      // 处理 HTTP 错误状态码
      if (error.response) {
        switch (error.response.status) {
          case 401:
            // 未授权，跳转登录
            window.location.href = '/login';
            break;
          case 403:
            console.error('没有权限访问');
            break;
          case 404:
            console.error('请求的资源不存在');
            break;
          case 500:
            console.error('服务器错误');
            break;
          default:
            console.error('请求失败:', error.response.data?.message || error.message);
        }
      } else if (error.request) {
        console.error('网络错误，请检查您的网络连接');
      } else {
        console.error('请求配置错误:', error.message);
      }
      
      return Promise.reject(error);
    }
  );

  return instance;
};

// API 客户端类
class ApiClient {
  private instance: AxiosInstance;

  constructor(baseURL: string = '/api') {
    this.instance = createApiInstance(baseURL);
  }

  // GET 请求
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<ApiResponse<T>>(url, config);
    return response.data.data;
  }

  // POST 请求
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.post<ApiResponse<T>>(url, data, config);
    return response.data.data;
  }

  // PUT 请求
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.put<ApiResponse<T>>(url, data, config);
    return response.data.data;
  }

  // PATCH 请求
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.patch<ApiResponse<T>>(url, data, config);
    return response.data.data;
  }

  // DELETE 请求
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<ApiResponse<T>>(url, config);
    return response.data.data;
  }

  // 上传文件
  async upload<T = any>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.instance.post<ApiResponse<T>>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      }
    });

    return response.data.data;
  }

  // 下载文件
  async download(url: string, filename?: string): Promise<void> {
    const response = await this.instance.get(url, {
      responseType: 'blob'
    });

    const blob = new Blob([response.data]);
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename || 'download';
    link.click();
    window.URL.revokeObjectURL(link.href);
  }
}

// 创建默认 API 客户端实例
export const api = new ApiClient();

// API 服务类
export class ApiService {
  constructor(private client: ApiClient = api) {}

  // 用户相关 API
  async login(email: string, password: string) {
    return this.client.post('/auth/login', { email, password });
  }

  async register(data: { email: string; password: string; name: string }) {
    return this.client.post('/auth/register', data);
  }

  async logout() {
    return this.client.post('/auth/logout');
  }

  async getCurrentUser() {
    return this.client.get('/user/me');
  }

  // 文章相关 API
  async getArticles(params: PaginationParams & { category?: string; tag?: string }) {
    return this.client.get<PaginatedResponse<any>>('/articles', { params });
  }

  async getArticle(id: string) {
    return this.client.get(`/articles/${id}`);
  }

  async createArticle(data: any) {
    return this.client.post('/articles', data);
  }

  async updateArticle(id: string, data: any) {
    return this.client.put(`/articles/${id}`, data);
  }

  async deleteArticle(id: string) {
    return this.client.delete(`/articles/${id}`);
  }

  // 评论相关 API
  async getComments(articleId: string, params: PaginationParams) {
    return this.client.get<PaginatedResponse<any>>(`/articles/${articleId}/comments`, { params });
  }

  async createComment(articleId: string, content: string) {
    return this.client.post(`/articles/${articleId}/comments`, { content });
  }

  // 文件上传 API
  async uploadImage(file: File, onProgress?: (progress: number) => void) {
    return this.client.upload('/upload/image', file, onProgress);
  }

  // 搜索 API
  async search(query: string, params: PaginationParams) {
    return this.client.get<PaginatedResponse<any>>('/search', {
      params: { q: query, ...params }
    });
  }

  // 统计数据 API
  async getDashboardStats() {
    return this.client.get('/dashboard/stats');
  }

  async getActivityChart(days: number = 7) {
    return this.client.get('/dashboard/activity', { params: { days } });
  }
}

// 创建默认服务实例
export const apiService = new ApiService();
