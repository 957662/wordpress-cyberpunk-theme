# 📚 CyberPress Platform - 文件使用指南

本文档详细说明了如何使用本次创建的所有文件和组件。

---

## 🎯 快速开始

### 1. 实用工具组件

#### CopyButton - 复制按钮

```tsx
import { CopyButton } from '@/components/utils';

// 基础用法
<CopyButton text="Hello, World!" />

// 带自定义标签
<CopyButton
  text="const hello = 'world';"
  label="复制代码"
  copiedLabel="已复制！"
  size="lg"
  variant="outline"
/>

// 带回调
<CopyButton
  text={shareUrl}
  onCopy={() => toast.success('链接已复制')}
/>
```

**配置选项**:
- `text`: 要复制的文本
- `label`: 按钮标签文本
- `copiedLabel`: 复制成功后的文本
- `size`: 'sm' | 'md' | 'lg'
- `variant`: 'default' | 'ghost' | 'outline'
- `showIcon`: 是否显示图标
- `onCopy`: 复制成功回调

---

#### LazyImage - 懒加载图片

```tsx
import { LazyImage } from '@/components/utils';

// 基础用法
<LazyImage
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
/>

// 带骨架屏
<LazyImage
  src="/hero.jpg"
  alt="Hero Image"
  width={1920}
  height={1080}
  placeholder="skeleton"
  fadeIn
/>

// 带模糊占位
<LazyImage
  src="/photo.jpg"
  alt="Photo"
  fill
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  priority
  quality={90}
/>

// 带回调
<LazyImage
  src="/avatar.jpg"
  alt="Avatar"
  width={200}
  height={200}
  onLoad={() => console.log('Loaded!')}
  onError={() => console.log('Error!')}
/>
```

**配置选项**:
- `src`: 图片地址
- `alt`: 图片描述
- `width/height`: 图片尺寸
- `fill`: 是否填充容器
- `placeholder`: 'blur' | 'empty' | 'skeleton'
- `blurDataURL`: 模糊占位图数据
- `threshold`: 触发加载的阈值 (0-1)
- `fadeIn`: 是否渐入动画
- `objectFit`: object-fit 值
- `priority`: 是否优先加载
- `quality`: 图片质量 (1-100)

---

#### ErrorBoundary - 错误边界

```tsx
import { ErrorBoundary, withErrorBoundary } from '@/components/utils';

// 基础用法
<ErrorBoundary>
  <App />
</ErrorBoundary>

// 带配置
<ErrorBoundary
  onError={(error, errorInfo) => {
    logErrorToService(error, errorInfo);
  }}
  showErrorDetails={process.env.NODE_ENV === 'development'}
  enableRetry
  enableReport
  reportEndpoint="/api/errors"
>
  <App />
</ErrorBoundary>

// 使用 HOC
const SafeComponent = withErrorBoundary(RiskyComponent, {
  fallback: <div>Something went wrong</div>,
  enableRetry: true,
});

// 自定义错误 UI
<ErrorBoundary
  fallback={
    <div className="error-page">
      <h1>Oops!</h1>
      <button onClick={() => window.location.reload()}>
        Reload
      </button>
    </div>
  }
>
  <App />
</ErrorBoundary>
```

**配置选项**:
- `fallback`: 自定义错误 UI
- `onError`: 错误回调
- `showErrorDetails`: 显示错误详情
- `resetOnPropsChange`: props 变化时重置
- `enableRetry`: 启用重试
- `enableReport`: 启用错误上报
- `reportEndpoint`: 上报端点

---

#### FileDropZone - 文件拖放上传

```tsx
import { FileDropZone } from '@/components/utils';

const [files, setFiles] = useState<File[]>();

// 基础用法
<FileDropZone
  onFilesDrop={(files) => setFiles(files)}
/>

// 限制图片类型
<FileDropZone
  onFilesDrop={handleUpload}
  accept="image/*"
  maxSize={5 * 1024 * 1024} // 5MB
  multiple
  maxFiles={10}
/>

// 自定义拖放区域
<FileDropZone onFilesDrop={handleUpload}>
  <div className="custom-dropzone">
    <UploadIcon />
    <p>Upload your files here</p>
  </div>
</FileDropZone>

// 禁用状态
<FileDropZone
  onFilesDrop={handleUpload}
  disabled={isUploading}
/>
```

**配置选项**:
- `onFilesDrop`: 文件放置回调
- `accept`: 接受的文件类型
- `multiple`: 是否允许多文件
- `maxSize`: 最大文件大小（字节）
- `maxFiles`: 最大文件数量
- `disabled`: 是否禁用
- `children`: 自定义拖放区域

---

### 2. 性能优化组件

#### VirtualScroll - 虚拟滚动

```tsx
import { VirtualScroll, VirtualGrid } from '@/components/performance';

// 虚拟列表
<VirtualScroll
  items={items}
  itemHeight={80}
  containerHeight={600}
  renderItem={(item, index) => (
    <div key={index} className="p-4 border">
      {item.name}
    </div>
  )}
  overscan={5}
  onEndReached={() => loadMore()}
  endReachedThreshold={200}
  loading={isLoading}
  loadingComponent={<div>Loading more...</div>}
  emptyComponent={<div>No items</div>}
/>

// 虚拟网格
<VirtualGrid
  items={products}
  itemHeight={300}
  containerHeight={800}
  columns={3}
  gap={16}
  renderItem={(product) => (
    <ProductCard key={product.id} data={product} />
  )}
  onScroll={(scrollTop) => console.log('Scrolled to', scrollTop)}
/>
```

**VirtualScroll 配置**:
- `items`: 数据数组
- `itemHeight`: 单项高度
- `containerHeight`: 容器高度
- `renderItem`: 渲染函数
- `overscan`: 缓冲区数量
- `onScroll`: 滚动回调
- `onEndReached`: 到达底部回调
- `endReachedThreshold`: 触发距离
- `loading`: 加载状态
- `loadingComponent`: 加载组件
- `emptyComponent`: 空数据组件

**VirtualGrid 额外配置**:
- `columns`: 列数
- `gap`: 间距

---

#### PerformanceMonitor - 性能监控

```tsx
import { PerformanceMonitor } from '@/components/performance';

// 完整监控
<PerformanceMonitor
  position="bottom-right"
  showFPS
  showMemory
  showTiming
  showResources
  showCoreWebVitals
  updateInterval={1000}
  onMetricsUpdate={(metrics) => {
    analytics.track('performance', metrics);
  }}
/>

// 最小监控
<PerformanceMonitor
  position="top-left"
  showFPS
  showCoreWebVitals
/>

// 开发环境监控
{process.env.NODE_ENV === 'development' && (
  <PerformanceMonitor
    position="bottom-right"
    showFPS
    showMemory
    showTiming
    showCoreWebVitals
  />
)}
```

**配置选项**:
- `position`: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
- `showFPS`: 显示帧率
- `showMemory`: 显示内存
- `showTiming`: 显示加载时间
- `showResources`: 显示资源数量
- `showCoreWebVitals`: 显示核心指标
- `updateInterval`: 更新间隔（毫秒）
- `onMetricsUpdate`: 指标更新回调

**监控指标**:
- FPS (Frames Per Second)
- 内存使用量
- FCP (First Contentful Paint)
- LCP (Largest Contentful Paint)
- FID (First Input Delay)
- CLS (Cumulative Layout Shift)
- TTFB (Time to First Byte)

---

### 3. 高级 Hooks

#### useWebSocket - WebSocket 连接

```tsx
import { useWebSocket, useWebSocketWithAutoReconnect } from '@/hooks';

// 基础用法
function Chat() {
  const {
    isConnected,
    isConnecting,
    error,
    sendMessage,
    sendJsonMessage,
    disconnect,
  } = useWebSocket('ws://localhost:8080', {
    onOpen: () => console.log('Connected'),
    onMessage: (event) => console.log('Message:', event.data),
    onError: (event) => console.error('Error:', event),
    onClose: (event) => console.log('Closed'),
    reconnectInterval: 3000,
    reconnectAttempts: 5,
    heartbeatInterval: 30000,
  });

  return (
    <div>
      <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      <button onClick={() => sendMessage('Hello')}>
        Send Message
      </button>
      <button onClick={() => sendJsonMessage({ type: 'chat', text: 'Hello' })}>
        Send JSON
      </button>
    </div>
  );
}

// 带消息历史
function ChatWithHistory() {
  const { isConnected, messages, lastMessage, sendMessage } =
    useWebSocketWithAutoReconnect('wss://api.example.com/chat');

  return (
    <div>
      {messages.map((msg, i) => (
        <div key={i}>{msg.data}</div>
      ))}
      <input
        onSubmit={(e) => {
          sendMessage(e.currentTarget.value);
          e.currentTarget.value = '';
        }}
      />
    </div>
  );
}
```

**返回值**:
- `websocket`: WebSocket 实例
- `isConnected`: 是否已连接
- `isConnecting`: 是否正在连接
- `error`: 错误对象
- `sendMessage`: 发送文本消息
- `sendJsonMessage`: 发送 JSON 消息
- `connect`: 连接
- `disconnect`: 断开连接
- `reconnect`: 重新连接

**配置选项**:
- `onOpen`: 连接成功回调
- `onMessage`: 消息接收回调
- `onError`: 错误回调
- `onClose`: 连接关闭回调
- `reconnectInterval`: 重连间隔
- `reconnectAttempts`: 重连次数
- `heartbeatInterval`: 心跳间隔
- `heartbeatMessage`: 心跳消息

---

#### useServiceWorker - Service Worker 管理

```tsx
import { useServiceWorker, useServiceWorkerMessage } from '@/hooks';

// Service Worker 注册
function App() {
  const {
    supported,
    enabled,
    registered,
    isUpdateAvailable,
    update,
    skipWaiting,
    unregister,
  } = useServiceWorker('/sw.js', {
    onWaiting: (registration) => {
      // 显示更新可用通知
      showUpdateNotification();
    },
    onActive: () => {
      console.log('New service worker activated');
    },
    onSuccess: (registration) => {
      console.log('Service worker registered');
    },
  });

  return (
    <div>
      {isUpdateAvailable && (
        <div className="update-banner">
          <p>新版本可用！</p>
          <button onClick={skipWaiting}>立即更新</button>
          <button onClick={update}>稍后更新</button>
        </div>
      )}
    </div>
  );
}

// 消息通信
function Messages() {
  const { message, sendMessage } = useServiceWorkerMessage();

  React.useEffect(() => {
    if (message?.type === 'CACHE_UPDATED') {
      console.log('Cache updated:', message.data);
    }
  }, [message]);

  return (
    <button onClick={() => sendMessage({ type: 'SKIP_WAITING' })}>
      Skip Waiting
    </button>
  );
}
```

**返回值**:
- `supported`: 是否支持 SW
- `enabled`: 是否启用
- `registered`: 是否已注册
- `activated`: 是否已激活
- `installing`: 是否正在安装
- `waiting`: 是否等待激活
- `controller`: 是否有控制器
- `error`: 错误对象
- `update`: 检查更新
- `skipWaiting`: 跳过等待
- `unregister`: 注销 SW

**配置选项**:
- `onUpdate`: 更新可用回调
- `onWaiting`: 等待激活回调
- `onActive`: 激活回调
- `onSuccess`: 注册成功回调
- `onError`: 错误回调

---

#### useApi - API 请求管理

```tsx
import { useApi, useMutation, useInfiniteApi } from '@/hooks';

// 数据查询
function Posts() {
  const {
    data: posts,
    isLoading,
    isError,
    error,
    isSuccess,
    refetch,
    mutate,
  } = useApi(
    'posts',
    () => fetch('/api/posts').then(r => r.json()),
    {
      enabled: true,
      refetchInterval: 5000,
      refetchOnWindowFocus: true,
      onSuccess: (data) => console.log('Posts loaded:', data),
      onError: (error) => console.error('Error:', error),
      retry: 3,
      retryDelay: 1000,
    }
  );

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
      <button onClick={() => refetch()}>Refresh</button>
    </div>
  );
}

// 数据变更
function CreatePost() {
  const { mutate, isLoading, error } = useMutation(
    (data) => fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),
    {
      onSuccess: (data) => {
        toast.success('Post created!');
        // 刷新列表
        queryClient.invalidateQueries('posts');
      },
      onError: (error) => {
        toast.error('Failed to create post');
      },
    }
  );

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      mutate({
        title: formData.get('title'),
        content: formData.get('content'),
      });
    }}>
      <input name="title" />
      <textarea name="content" />
      <button disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  );
}

// 无限滚动
function InfinitePosts() {
  const {
    data: pages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteApi(
    'posts',
    (page) => fetch(`/api/posts?page=${page}`).then(r => r.json()),
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length === 0) return null;
        return allPages.length + 1;
      },
    }
  );

  return (
    <InfiniteScroll
      hasMore={hasNextPage}
      loadMore={fetchNextPage}
      isLoading={isFetchingNextPage}
    >
      {pages.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </InfiniteScroll>
  );
}
```

---

### 4. 性能工具函数

```typescript
import {
  debounce,
  throttle,
  getCoreWebVitals,
  preloadResource,
  observePerformance,
} from '@/lib/performance';

// 防抖搜索
const debouncedSearch = debounce((query: string) => {
  searchAPI(query);
}, 300);

searchInput.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});

// 节流滚动
const throttledScroll = throttle(() => {
  checkLazyLoad();
}, 100);

window.addEventListener('scroll', throttledScroll);

// 获取 Core Web Vitals
const vitals = getCoreWebVitals();
console.log('FCP:', vitals.fcp);
console.log('LCP:', vitals.lcp);
console.log('CLS:', vitals.cls);

// 预加载关键资源
preloadResource('/hero-image.jpg', 'image');
preloadResource('/main-font.woff2', 'font');

// 性能监控
observePerformance((metrics) => {
  analytics.track('performance', {
    fcp: metrics.fcp,
    lcp: metrics.lcp,
    cls: metrics.cls,
  });
}, 10000);

// 资源预连接
preconnectTo('https://api.example.com');
dnsPrefetch('https://cdn.example.com');

// 批量 DOM 更新
batchUpdates([
  () => updateElement1(),
  () => updateElement2(),
  () => updateElement3(),
], 5);

// 懒加载组件
const HeavyComponent = lazyLoad(
  () => import('./HeavyComponent'),
  () => <div>Loading...</div>
);
```

---

## 🎨 完整示例

### 博客文章页面

```tsx
'use client';

import React from 'react';
import { CopyButton } from '@/components/utils';
import { LazyImage } from '@/components/utils';
import { ErrorBoundary } from '@/components/utils';
import { FileDropZone } from '@/components/utils';
import { useApi } from '@/hooks';
import { PerformanceMonitor } from '@/components/performance';

function BlogPost({ id }: { id: string }) {
  const { data: post, isLoading, error } = useApi(
    `post-${id}`,
    () => fetch(`/api/posts/${id}`).then(r => r.json())
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading post</div>;

  return (
    <article>
      <LazyImage
        src={post.coverImage}
        alt={post.title}
        width={1200}
        height={630}
        placeholder="blur"
        blurDataURL={post.blurDataURL}
        priority
      />

      <h1>{post.title}</h1>

      <div className="meta">
        <span>{post.author}</span>
        <span>{post.date}</span>
        <span>{post.readTime} min read</span>
      </div>

      <div className="content">
        {post.content}
      </div>

      <div className="actions">
        <CopyButton text={post.shareUrl} label="Share" />
        <CopyButton
          text={post.code}
          label="Copy Code"
          variant="outline"
        />
      </div>

      <FileDropZone
        onFilesDrop={(files) => uploadFiles(files)}
        accept="image/*"
        multiple
      />
    </article>
  );
}

export default function BlogPostPage({ params }: { params: { id: string } }) {
  return (
    <ErrorBoundary>
      <PerformanceMonitor position="bottom-right" showCoreWebVitals />
      <BlogPost id={params.id} />
    </ErrorBoundary>
  );
}
```

---

## 📞 支持

如有问题，请查阅：
- **组件文档**: frontend/components/
- **Hooks 文档**: frontend/hooks/
- **工具函数**: frontend/lib/performance/
- **项目 README**: frontend/README.md

---

**创建时间**: 2026-03-02
**版本**: 1.3.0
