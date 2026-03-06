/**
 * Post 类型定义
 * 博客文章的数据结构
 */

export interface Post {
  /**
   * 文章 ID
   */
  id: string | number;

  /**
   * 文章标题
   */
  title: string;

  /**
   * 文章别名/URL 路径
   */
  slug: string;

  /**
   * 文章摘要
   */
  excerpt?: string;

  /**
   * 文章内容（HTML 或 Markdown）
   */
  content?: string;

  /**
   * 特色图片 URL
   */
  featuredImage?: string;

  /**
   * 发布日期
   */
  date: Date | string;

  /**
   * 修改日期
   */
  modified?: Date | string;

  /**
   * 作者名称
   */
  author?: string;

  /**
   * 作者 ID
   */
  authorId?: string | number;

  /**
   * 分类
   */
  category?: string;

  /**
   * 分类 ID
   */
  categoryId?: string | number;

  /**
   * 标签列表
   */
  tags?: string[];

  /**
   * 阅读时间（分钟）
   */
  readTime?: number;

  /**
   * 浏览次数
   */
  views?: number;

  /**
   * 点赞数
   */
  likes?: number;

  /**
   * 评论数
   */
  commentCount?: number;

  /**
   * 是否为特色文章
   */
  featured?: boolean;

  /**
   * 文章状态
   */
  status?: 'draft' | 'publish' | 'pending' | 'private';

  /**
   * SEO 元数据
   */
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };

  /**
   * 自定义字段
   */
  meta?: Record<string, any>;
}

/**
 * WordPress API 响应格式
 */
export interface WordPressPost {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
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

/**
 * 文章列表响应
 */
export interface PostsResponse {
  posts: Post[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * 文章查询参数
 */
export interface PostQueryParams {
  page?: number;
  perPage?: number;
  category?: string | number;
  tag?: string | number;
  search?: string;
  author?: string | number;
  orderBy?: 'date' | 'title' | 'modified';
  order?: 'asc' | 'desc';
  status?: string;
}
