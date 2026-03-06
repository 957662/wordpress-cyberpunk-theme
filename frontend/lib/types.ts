export interface Post {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string
  date: string
  modified: string
  status: 'publish' | 'draft' | 'pending'
  author: Author
  categories: Category[]
  tags: Tag[]
  featured_media?: number
  featured_image_url?: string
  link: string
  yoast_head_json?: SEO
}

export interface Author {
  id: number
  name: string
  url: string
  description: string
  avatar_urls?: Record<string, string>
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string
  count: number
  link: string
}

export interface Tag {
  id: number
  name: string
  slug: string
  description: string
  count: number
  link: string
}

export interface SEO {
  title: string
  description: string
  canonical: string
  og_locale: string
  og_type: string
  og_title: string
  og_description: string
  og_url: string
  og_site_name: string
  article_modified_time: string
  twitter_card: string
}

export interface PortfolioItem {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string
  date: string
  status: 'publish' | 'draft'
  featured_image_url?: string
  project_url?: string
  github_url?: string
  technologies?: string[]
  client?: string
  year?: number
  categories: Category[]
  tags: Tag[]
}

export interface Comment {
  id: number
  post: number
  parent: number
  author: {
    id: number
    name: string
    url: string
    avatar_urls?: Record<string, string>
  }
  date: string
  content: string
  status: 'approved' | 'pending' | 'spam' | 'trash'
}

export interface User {
  id: number
  name: string
  email: string
  url: string
  description: string
  avatar_urls?: Record<string, string>
  roles?: string[]
  capabilities?: Record<string, boolean>
}

export interface ApiResponse<T> {
  data: T
  headers: Record<string, string>
  status: number
}

export interface PaginatedResponse<T> {
  data: T[]
  headers: Record<string, string>
  totalPages: number
  totalItems: number
}

export interface SearchParams {
  keyword?: string
  category?: string
  tag?: string
  author?: string
  page?: number
  perPage?: number
  orderBy?: 'date' | 'title' | 'modified'
  order?: 'asc' | 'desc'
}
