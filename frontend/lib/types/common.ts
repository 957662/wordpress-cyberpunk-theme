/**
 * Common Types
 *
 * Shared type definitions used across the application
 */

// =====================================================
// API Types
// =====================================================

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, unknown>;
}

export interface PaginationMeta {
  total: number;
  perPage: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginationParams {
  page?: number;
  per_page?: number;
  limit?: number;
  offset?: number;
}

export interface SortParams {
  sort_by?: string;
  sort_order?: SortOrder;
}

export type SortOrder = 'asc' | 'desc';

export type SortableField<T> = keyof T | string;

// =====================================================
// Common Entity Types
// =====================================================

export interface BaseEntity {
  id: number | string;
  created_at: string;
  updated_at: string;
}

export interface Sluggable {
  slug: string;
}

export interface Publishable {
  status: 'draft' | 'publish' | 'private' | 'trash';
  published_at?: string;
}

export interface Timestamps {
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

// =====================================================
// User Types
// =====================================================

export interface User extends BaseEntity {
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  bio?: string;
  role: UserRole;
  status: UserStatus;
}

export type UserRole = 'subscriber' | 'contributor' | 'author' | 'editor' | 'administrator';

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'banned';

export interface UserProfile extends User {
  website?: string;
  location?: string;
  social_links?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

// =====================================================
// Media Types
// =====================================================

export interface Media extends BaseEntity {
  filename: string;
  url: string;
  file_path: string;
  mime_type: string;
  file_size: number;
  width?: number;
  height?: number;
  alt_text?: string;
  title?: string;
  description?: string;
  uploaded_by: number;
}

export interface ImageSizes {
  thumbnail?: string;
  medium?: string;
  large?: string;
  full?: string;
}

// =====================================================
// Search Types
// =====================================================

export interface SearchFilters {
  query?: string;
  category?: string;
  tags?: string[];
  date_from?: string;
  date_to?: string;
  author?: string;
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  facets?: SearchFacets;
}

export interface SearchFacets {
  categories?: FacetItem[];
  tags?: FacetItem[];
  authors?: FacetItem[];
  dates?: FacetItem[];
}

export interface FacetItem {
  value: string;
  count: number;
  label?: string;
}

// =====================================================
// Form Types
// =====================================================

export interface FormField {
  name: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio';
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: Array<{ value: string; label: string }>;
  validation?: ValidationRule[];
}

export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: string | number | RegExp;
  message: string;
}

export interface FormErrors {
  [fieldName: string]: string[];
}

// =====================================================
// UI Types
// =====================================================

export interface ToastProps {
  id?: string;
  title: string;
  message?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ComponentType;
  disabled?: boolean;
}

// =====================================================
// Config Types
// =====================================================

export interface SiteConfig {
  title: string;
  description: string;
  url: string;
  logo?: string;
  favicon?: string;
  language: string;
  timezone: string;
}

export interface SeoConfig {
  title: string;
  description: string;
  image?: string;
  url: string;
  type?: string;
  site_name?: string;
}

// =====================================================
// Theme Types
// =====================================================

export type ThemeMode = 'light' | 'dark' | 'auto';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
}

// =====================================================
// Utility Types
// =====================================================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type Nullable<T> = T | null;

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
