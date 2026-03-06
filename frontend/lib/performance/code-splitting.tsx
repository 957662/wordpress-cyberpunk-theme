/**
 * Code Splitting Utilities - 代码分割工具
 * 用于动态导入组件和页面，优化加载性能
 */

import { lazy, Suspense, ComponentType } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * 加载状态组件
 */
interface LoadingStateProps {
  className?: string;
  message?: string;
}

export function LoadingState({ className, message = '加载中...' }: LoadingStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8',
        'bg-cyber-dark/50 rounded-lg',
        'border border-cyber-cyan/20',
        className
      )}
    >
      <Loader2 className="w-8 h-8 text-cyber-cyan animate-spin mb-4" />
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  );
}

/**
 * 错误边界组件
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: ComponentType<{ error?: Error; retry: () => void }>;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Component error:', error, errorInfo);
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error} retry={this.retry} />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error, retry }: { error?: Error; retry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-cyber-dark/50 rounded-lg border border-cyber-pink/20">
      <div className="text-cyber-pink text-4xl mb-4">⚠️</div>
      <h3 className="text-lg font-semibold mb-2">加载失败</h3>
      <p className="text-muted-foreground text-sm mb-4">
        {error?.message || '组件加载时发生错误'}
      </p>
      <button
        onClick={retry}
        className="px-4 py-2 bg-cyber-cyan text-black rounded-lg hover:bg-cyber-cyan/80 transition-colors"
      >
        重试
      </button>
    </div>
  );
}

/**
 * 动态导入包装器
 */
interface DynamicImportOptions {
  loadingComponent?: ComponentType;
  errorComponent?: ComponentType<{ error?: Error; retry: () => void }>;
  fallback?: React.ReactNode;
}

export function dynamicImport<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options: DynamicImportOptions = {}
): T {
  const LazyComponent = lazy(importFunc);

  const WrappedComponent = (props: React.ComponentProps<T>) => {
    return (
      <ErrorBoundary fallback={options.errorComponent}>
        <Suspense fallback={options.fallback || <LoadingState />}>
          <LazyComponent {...props} />
        </Suspense>
      </ErrorBoundary>
    );
  };

  return WrappedComponent as T;
}

/**
 * 预加载组件
 */
export function preloadComponent(importFunc: () => Promise<any>): void {
  importFunc();
}

/**
 * 路由级代码分割配置
 */

// 博客相关页面
export const BlogListPage = dynamicImport(
  () => import('@/app/blog/page'),
  { fallback: <LoadingState message="加载博客列表..." /> }
);

export const BlogDetailPage = dynamicImport(
  () => import('@/app/blog/[id]/page'),
  { fallback: <LoadingState message="加载文章详情..." /> }
);

// 用户相关页面
export const ProfilePage = dynamicImport(
  () => import('@/app/profile/page'),
  { fallback: <LoadingState message="加载个人资料..." /> }
);

export const SettingsPage = dynamicImport(
  () => import('@/app/settings/page'),
  { fallback: <LoadingState message="加载设置..." /> }
);

// 管理相关页面
export const DashboardPage = dynamicImport(
  () => import('@/app/admin/page'),
  { fallback: <LoadingState message="加载仪表盘..." /> }
);

export const EditorPage = dynamicImport(
  () => import('@/app/admin/editor/page'),
  { fallback: <LoadingState message="加载编辑器..." /> }
);

// 功能组件
export const CommentSystem = dynamicImport(
  () => import('@/components/comments/CommentSystem'),
  { fallback: <LoadingState message="加载评论..." /> }
);

export const ShareDialog = dynamicImport(
  () => import('@/components/share/ShareDialog'),
  { fallback: null }
);

export const SearchModal = dynamicImport(
  () => import('@/components/search/SearchModal'),
  { fallback: null }
);

/**
 * 按需加载工具函数
 */

// 检测用户是否在 viewport 中
export function useInViewport(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [inViewport, setInViewport] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInViewport(entry.isIntersecting);
      },
      { threshold: 0.1, ...options }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return inViewport;
}

/**
 * 懒加载图片组件
 */
interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
}

export function LazyImage({
  src,
  alt,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwYTBhMGYiLz48L3N2Zz4=',
  className,
  ...props
}: LazyImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const inViewport = useInViewport(imgRef);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <img
      ref={imgRef}
      src={inViewport ? src : placeholder}
      alt={alt}
      className={cn(
        'transition-opacity duration-300',
        !isLoaded && 'opacity-0',
        isLoaded && 'opacity-100',
        className
      )}
      onLoad={() => setIsLoaded(true)}
      loading="lazy"
      {...props}
    />
  );
}

/**
 * 虚拟滚动列表
 */
interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
}

export function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 3,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        {visibleItems.map((item, index) => (
          <div
            key={startIndex + index}
            style={{
              position: 'absolute',
              top: (startIndex + index) * itemHeight,
              height: itemHeight,
              width: '100%',
            }}
          >
            {renderItem(item, startIndex + index)}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 资源预加载
 */
export function preloadImage(src: string): void {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  document.head.appendChild(link);
}

export function preloadStyle(href: string): void {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'style';
  link.href = href;
  document.head.appendChild(link);
}

export function preloadScript(src: string): void {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'script';
  link.href = src;
  document.head.appendChild(link);
}

/**
 * 批量预加载资源
 */
export function preloadResources(resources: {
  images?: string[];
  styles?: string[];
  scripts?: string[];
}): void {
  resources.images?.forEach(preloadImage);
  resources.styles?.forEach(preloadStyle);
  resources.scripts?.forEach(preloadScript);
}

export default {
  LoadingState,
  ErrorBoundary,
  dynamicImport,
  preloadComponent,
  useInViewport,
  LazyImage,
  VirtualList,
  preloadImage,
  preloadStyle,
  preloadScript,
  preloadResources,
};
