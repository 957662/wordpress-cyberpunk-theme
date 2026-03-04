/**
 * Utility Types for CyberPress Platform
 * Common TypeScript utility types and interfaces
 */

/**
 * Make specific properties optional
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Make specific properties required
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * Deep partial type
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Deep required type
 */
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

/**
 * Make readonly properties mutable
 */
export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

/**
 * Make mutable properties readonly
 */
export type Immutable<T> = {
  +readonly [P in keyof T]: T[P];
};

/**
 * Extract promise type
 */
export type Awaited<T> = T extends Promise<infer U> ? U : T;

/**
 * Extract array item type
 */
export type ArrayItem<T> = T extends (infer U)[] ? U : never;

/**
 * Extract function return type
 */
export type ReturnType<T extends (...args: any[]) => any> = T extends (
  ...args: any[]
) => infer R
  ? R
  : any;

/**
 * Extract function parameters
 */
export type Parameters<T extends (...args: any[]) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never;

/**
 * Make specific properties nullable
 */
export type Nullable<T, K extends keyof T> = Omit<T, K> & {
  [P in K]: T[P] | null;
};

/**
 * Make all properties nullable
 */
export type NullableAll<T> = {
  [P in keyof T]: T[P] | null;
};

/**
 * Omit multiple keys from type
 */
export type OmitMultiple<T, K extends keyof T> = Omit<T, K>;

/**
 * Pick multiple keys from type
 */
export type PickMultiple<T, K extends keyof T> = Pick<T, K>;

/**
 * Union to intersection
 */
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

/**
 * Get required keys of type
 */
export type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

/**
 * Get optional keys of type
 */
export type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

/**
 * Get readonly keys of type
 */
export type ReadonlyKeys<T> = {
  [K in keyof T]-?: Equal<{-readonly [P in K]: T[K]}, { -readonly [P in K]: T[K]}>
    ? never
    : K;
}[keyof T];

/**
 * Get mutable keys of type
 */
export type MutableKeys<T> = {
  [K in keyof T]-?: Equal<{ -readonly [P in K]: T[K] }, { [P in K]: T[K] }>
    ? never
    : K;
}[keyof T];

/**
 * Type equality check
 */
export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <
  T
>() => T extends Y ? 1 : 2
  ? true
  : false;

/**
 * Merge two types
 */
export type Merge<T, U> = Omit<T, keyof U> & U;

/**
 * Deep merge two types
 */
export type DeepMerge<T, U> = {
  [K in keyof T | keyof U]?: K extends keyof U
    ? K extends keyof T
      ? U[K] extends object
        ? T[K] extends object
          ? DeepMerge<T[K], U[K]>
          : U[K]
        : U[K]
      : never
    : K extends keyof T
    ? T[K]
    : never;
};

/**
 * Exclude undefined from type
 */
export type NonUndefined<T> = T extends undefined ? never : T;

/**
 * Exclude null and undefined from type
 */
export type NonNullable<T> = T extends null | undefined ? never : T;

/**
 * Make function parameters optional
 */
export type OptionalArgs<T extends (...args: any[]) => any> = (
  ...args: Partial<Parameters<T>>
) => ReturnType<T>;

/**
 * Async function return type
 */
export type AsyncReturnType<T extends (...args: any[]) => Promise<any>> = Awaited<
  ReturnType<T>
>;

/**
 * Event handler type
 */
export type EventHandler<T = Event> = (event: T) => void;

/**
 * Change event handler type
 */
export type ChangeHandler<T = EventTarget> = EventHandler<
  ChangeEvent<T>
>;

/**
 * Form event types
 */
export interface FormEvent<T = Element> extends React SyntheticEvent<T> {
  target: T & EventTarget;
}

export interface ChangeEvent<T = Element> extends React.SyntheticEvent<T> {
  target: T & EventTarget;
}

export interface EventTarget {
  value: string;
  name: string;
  type?: string;
  checked?: boolean;
  files?: FileList | null;
}

/**
 * CSS properties type
 */
export type CSSProperties = React.CSSProperties;

/**
 * HTML element type
 */
export type HTMLElement = HTMLDivElement | HTMLSpanElement | HTMLButtonElement | HTMLInputElement | HTMLAnchorElement | HTMLImageElement;

/**
 * Component props type
 */
export type ComponentProps<T extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>> =
  React.ComponentProps<T>;

/**
 * Children type
 */
export type Children = React.ReactNode;

/**
 * Style type
 */
export type Style = CSSProperties | string | undefined;

/**
 * Class name type
 */
export type ClassName = string | undefined | null | false | ClassName[];

/**
 * ID type
 */
export type ID = string | number;

/**
 * Timestamp type
 */
export type Timestamp = number | string | Date;

/**
 * Date range type
 */
export interface DateRange {
  start: Date;
  end: Date;
}

/**
 * Pagination type
 */
export interface Pagination {
  page: number;
  pageSize: number;
  total?: number;
}

/**
 * Sort type
 */
export interface Sort {
  field: string;
  order: 'asc' | 'desc';
}

/**
 * Filter type
 */
export interface Filter<T = any> {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains' | 'startsWith' | 'endsWith';
  value: T;
}

/**
 * Query params type
 */
export interface QueryParams {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Response type
 */
export interface Response<T = any, E = Error> {
  data?: T;
  error?: E;
  status: number;
  statusText: string;
  headers?: Record<string, string>;
}

/**
 * API response type
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

/**
 * Paginated response type
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

/**
 * List item type
 */
export interface ListItem {
  id: ID;
  label: string;
  value: any;
  disabled?: boolean;
}

/**
 * Select option type
 */
export interface SelectOption {
  value: any;
  label: string;
  disabled?: boolean;
  group?: string;
}

/**
 * Table column type
 */
export interface TableColumn<T = any> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: number;
  align?: 'left' | 'center' | 'right';
}

/**
 * Form field type
 */
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: SelectOption[];
  rules?: ValidationRule[];
}

/**
 * Validation rule type
 */
export interface ValidationRule {
  required?: boolean;
  pattern?: RegExp;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  custom?: (value: any) => boolean | string;
  message?: string;
}

/**
 * Error type
 */
export interface Error {
  message: string;
  code?: string;
  field?: string;
  stack?: string;
}

/**
 * Loading state type
 */
export interface LoadingState {
  isLoading: boolean;
  isLoaded: boolean;
  error: Error | null;
}

/**
 * Async state type
 */
export interface AsyncState<T> extends LoadingState {
  data: T | null;
}

/**
 * Theme type
 */
export type Theme = 'light' | 'dark' | 'auto';

/**
 * Color scheme type
 */
export type ColorScheme = 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';

/**
 * Breakpoint type
 */
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Device type
 */
export type Device = 'mobile' | 'tablet' | 'desktop';

/**
 * Orientation type
 */
export type Orientation = 'portrait' | 'landscape';
