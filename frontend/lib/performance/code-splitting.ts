/**
 * 代码分割工具
 * 用于动态导入和懒加载组件、模块
 */

import { ComponentType } from 'react';

/**
 * 动态导入组件的配置选项
 */
export interface DynamicImportOptions {
  /** 加载中显示的组件 */
  fallback?: React.ComponentType;
  /** 加载失败时显示的组件 */
  error?: React.ComponentType<{ error: Error; retry: () => void }>;
  /** 延迟加载时间（毫秒） */
  delay?: number;
  /** 超时时间（毫秒） */
  timeout?: number;
}

/**
 * 带加载状态的组件状态
 */
interface LoadableComponentState<T> {
  Component: ComponentType<T> | null;
  loading: boolean;
  error: Error | null;
}

/**
 * 动态导入组件
 * @param importFn 导入函数
 * @param options 配置选项
 */
export function dynamicImport<T = {}>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options: DynamicImportOptions = {}
): React.ComponentType<T> {
  const { fallback: Fallback, error: Error, delay = 200, timeout = 10000 } = options;

  return function DynamicComponent(props: T) {
    const [state, setState] = React.useState<LoadableComponentState<T>>({
      Component: null,
      loading: true,
      error: null,
    });

    React.useEffect(() => {
      let isMounted = true;
      let timeoutId: NodeJS.Timeout;

      const loadComponent = async () => {
        try {
          // 模拟延迟，避免闪烁
          if (delay > 0) {
            await new Promise((resolve) => setTimeout(resolve, delay));
          }

          // 设置超时
          timeoutId = setTimeout(() => {
            if (isMounted) {
              setState({
                Component: null,
                loading: false,
                error: new Error(`Component load timeout after ${timeout}ms`),
              });
            }
          }, timeout);

          const loadedModule = await importFn();

          if (isMounted) {
            clearTimeout(timeoutId);
            setState({
              Component: loadedModule.default,
              loading: false,
              error: null,
            });
          }
        } catch (error) {
          if (isMounted) {
            clearTimeout(timeoutId);
            setState({
              Component: null,
              loading: false,
              error: error as Error,
            });
          }
        }
      };

      loadComponent();

      return () => {
        isMounted = false;
        clearTimeout(timeoutId);
      };
    }, [importFn]);

    if (state.error) {
      return Error ? React.createElement(Error, { error: state.error, retry: () => window.location.reload() }) : React.createElement('div', null, 'Failed to load component');
    }

    if (state.loading || !state.Component) {
      return Fallback ? React.createElement(Fallback) : React.createElement('div', null, 'Loading...');
    }

    return React.createElement(state.Component, props);
  };
}

/**
 * 预加载模块
 * @param importFn 导入函数
 */
export async function preloadModule<T>(importFn: () => Promise<T>): Promise<void> {
  try {
    await importFn();
  } catch (error) {
    console.warn('Module preloading failed:', error);
  }
}

/**
 * 预加载图片
 * @param src 图片URL
 */
export function preloadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * 批量预加载图片
 * @param urls 图片URL数组
 */
export async function preloadImages(urls: string[]): Promise<HTMLImageElement[]> {
  const promises = urls.map((url) => preloadImage(url));
  return Promise.all(promises);
}

/**
 * 路由级别的代码分割配置
 */
export const routes = {
  // 首页
  home: () => import('@/app/page'),

  // 博客
  blog: () => import('@/app/blog/page'),
  blogPost: (slug: string) => import(`@/app/blog/${slug}/page`),

  // 作品集
  portfolio: () => import('@/app/portfolio/page'),
  portfolioProject: (slug: string) => import(`@/app/portfolio/${slug}/page`),

  // 用户
  profile: () => import('@/app/user/profile/page'),
  settings: () => import('@/app/user/settings/page'),

  // 管理
  admin: () => import('@/app/admin/page'),
  adminPosts: () => import('@/app/admin/posts/page'),
  adminMedia: () => import('@/app/admin/media/page'),
};

/**
 * 组件级别的代码分割配置
 */
export const components = {
  // 编辑器
  editor: () => import('@/components/editor/MarkdownEditor'),
  codeEditor: () => import('@/components/editor/CodeEditor'),

  // 图表
  lineChart: () => import('@/components/charts/LineChart'),
  barChart: () => import('@/components/charts/BarChart'),
  pieChart: () => import('@/components/charts/PieChart'),

  // 表单
  advancedForm: () => import('@/components/forms/AdvancedForm'),
  validationForm: () => import('@/components/forms/ValidationForm'),

  // 媒体
  imageGallery: () => import('@/components/gallery/ImageGallery'),
  videoPlayer: () => import('@/components/media/VideoPlayer'),

  // 3D
  threeScene: () => import('@/components/3d/ThreeScene'),
  modelViewer: () => import('@/components/3d/ModelViewer'),
};

/**
 * 智能预加载策略
 */
export class SmartPreloader {
  private loadedModules = new Set<string>();
  private loadedImages = new Set<string>();

  /**
   * 预加载用户可能访问的下一个路由
   */
  async preloadNextRoute(currentPath: string): Promise<void> {
    const routeMap: Record<string, () => Promise<any>> = {
      '/': routes.home,
      '/blog': routes.blog,
      '/portfolio': routes.portfolio,
      '/profile': routes.profile,
      '/admin': routes.admin,
    };

    // 基于当前路径预测下一个路由
    let nextRoute: string | null = null;

    if (currentPath === '/') {
      nextRoute = '/blog';
    } else if (currentPath.startsWith('/blog')) {
      nextRoute = '/portfolio';
    } else if (currentPath.startsWith('/portfolio')) {
      nextRoute = '/profile';
    }

    if (nextRoute && routeMap[nextRoute]) {
      const key = `route:${nextRoute}`;
      if (!this.loadedModules.has(key)) {
        await routeMap[nextRoute]();
        this.loadedModules.add(key);
      }
    }
  }

  /**
   * 预加载视口外的图片
   */
  async preloadImagesBelowFold(): Promise<void> {
    if (typeof document === 'undefined') return;

    const images = document.querySelectorAll('img[data-src]');
    const imageUrls = Array.from(images).slice(0, 5).map((img) => img.getAttribute('data-src')!);

    for (const url of imageUrls) {
      if (!this.loadedImages.has(url)) {
        try {
          await preloadImage(url);
          this.loadedImages.add(url);
        } catch (error) {
          console.warn(`Failed to preload image: ${url}`, error);
        }
      }
    }
  }

  /**
   * 预加载关键组件
   */
  async preloadCriticalComponents(): Promise<void> {
    const criticalComponents = [components.editor(), components.imageGallery()];

    try {
      await Promise.all(criticalComponents.map((comp) => comp()));
    } catch (error) {
      console.warn('Failed to preload critical components:', error);
    }
  }

  /**
   * 清除已加载的资源
   */
  clear(): void {
    this.loadedModules.clear();
    this.loadedImages.clear();
  }
}

// 导出单例实例
export const smartPreloader = new SmartPreloader();

/**
 * React Hook 用于智能预加载
 */
export function useSmartPreload() {
  React.useEffect(() => {
    // 组件挂载时预加载关键资源
    smartPreloader.preloadCriticalComponents();

    // 监听路由变化
    const handleRouteChange = () => {
      const currentPath = window.location.pathname;
      smartPreloader.preloadNextRoute(currentPath);
    };

    // 初始预加载
    handleRouteChange();

    // 设置定时预加载
    const intervalId = setInterval(() => {
      smartPreloader.preloadImagesBelowFold();
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);
}

/**
 * 创建懒加载包装器
 */
export function createLazyWrapper<T extends {}>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options: DynamicImportOptions = {}
): ComponentType<T> {
  return React.lazy(() => importFn());
}

/**
 * 批量懒加载组件
 */
export function createLazyComponents<T extends Record<string, () => Promise<any>>>(
  imports: T
): { [K in keyof T]: ComponentType<any> } {
  const result = {} as any;

  for (const [key, importFn] of Object.entries(imports)) {
    result[key] = React.lazy(() => importFn());
  }

  return result;
}
