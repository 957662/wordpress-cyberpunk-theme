# CyberPress 新功能组件

本文档介绍最新添加到 CyberPress 项目的新组件和功能。

## 📁 新增文件列表

### Hooks

#### 1. `useCollaboration.ts`
实时协作 Hook，支持多人实时编辑文档。

**功能：**
- 多用户光标追踪
- 选择内容同步
- 操作转换（OT）算法
- 在线状态管理
- WebSocket 集成

**使用示例：**
```tsx
const { collaborators, sendOperation, sendCursor } = useCollaboration({
  documentId: 'doc-123',
  userId: 'user-456',
  userName: 'John Doe',
  websocketUrl: 'wss://api.example.com/collaborate',
});
```

#### 2. `useGeolocation.ts`
地理位置定位 Hook，提供精确的位置信息和监控功能。

**功能：**
- 获取当前位置
- 持续监控位置变化
- 可配置精度和超时
- 错误处理
- 支持一次性获取和持续监听

**使用示例：**
```tsx
const { latitude, longitude, loading, getCurrentPosition } = useGeolocation({
  enableHighAccuracy: true,
  timeout: 5000,
});
```

### UI 组件

#### 1. `RealtimeNotification.tsx`
实时通知系统组件，提供美观的赛博朋克风格通知。

**功能：**
- 多种通知类型（info, success, warning, error）
- 自动消失和手动关闭
- 通知操作按钮
- 自定义位置和持续时间
- 便捷函数（showInfo, showSuccess 等）

**使用示例：**
```tsx
import { showSuccess, showError } from '@/components/ui/RealtimeNotification';

showSuccess('操作成功！', '完成');
showError('发生错误，请重试', '错误');

// 或作为组件使用
<RealtimeNotification position="top-right" />
```

#### 2. `PerformanceMonitor.tsx`
性能监控组件，实时显示应用的性能指标。

**功能：**
- 核心 Web 指标（FCP, LCP, CLS, TTFB）
- 页面加载时序
- 运行时指标（FPS, 内存使用）
- 颜色编码的评级系统
- 可配置的刷新频率
- 自定义显示的指标

**使用示例：**
```tsx
<PerformanceMonitor
  position="bottom-right"
  refreshInterval={1000}
  showMetrics={['fcp', 'lcp', 'fps']}
/>
```

### 服务

#### 1. `collaboration-service.ts`
协作服务，处理文档协作的核心逻辑。

**功能：**
- 文档状态管理
- 操作应用和转换
- 协作者管理
- 操作历史记录
- 文档差异计算
- 操作压缩优化

**使用示例：**
```ts
import collaborationService from '@/lib/services/collaboration-service';

// 获取或创建文档
const doc = collaborationService.getOrCreateDocument('doc-id', '初始内容');

// 应用操作
const updatedDoc = collaborationService.applyOperation('doc-id', {
  id: 'op-123',
  documentId: 'doc-id',
  userId: 'user-456',
  operation: [{ type: 'insert', position: 0, content: 'Hello' }],
  version: 0,
  timestamp: Date.now(),
});

// 订阅更新
const unsubscribe = collaborationService.subscribe('doc-id', (state) => {
  console.log('Document updated:', state);
});
```

### 工具函数

#### 1. `performance-utils-new.ts`
性能优化工具函数集合。

**功能：**
- 防抖和节流
- 请求空闲回调
- 批量 DOM 更新
- 延迟加载
- 资源预加载
- 性能测量和标记
- 视口检测
- 虚拟滚动计算
- 代码分割优化

**使用示例：**
```ts
import {
  debounce,
  throttle,
  markPerformance,
  measurePerformanceMark,
  isInViewport,
  calculateVisibleRange,
} from '@/lib/utils/performance-utils-new';

// 防抖函数
const debouncedSearch = debounce((query: string) => {
  console.log('Searching:', query);
}, 300);

// 性能测量
markPerformance('component-mount');
// ... 执行操作
measurePerformanceMark('render-time', 'component-mount', 'component-end');

// 视口检测
if (isInViewport(element)) {
  console.log('Element is visible!');
}
```

### 页面

#### 1. `ai-assistant/page.tsx`
AI 助手功能页面，展示所有 AI 相关功能。

**功能：**
- 功能卡片展示
- 使用示例
- 特性说明
- 响应式设计
- 赛博朋克风格

**访问路径：** `/ai-assistant`

### 类型定义

#### 1. `new-components.d.ts`
所有新组件的 TypeScript 类型定义。

**包含类型：**
- AI 助手类型
- 通知类型
- 性能监控类型
- 协作类型
- 地理位置类型
- WebSocket 类型
- 表单类型
- 响应式类型
- 等等...

## 🚀 快速开始

### 1. 使用实时通知

```tsx
'use client';

import { showSuccess, showInfo } from '@/components/ui/RealtimeNotification';
import { CyberButton } from '@/components/ui';

export default function MyPage() {
  const handleClick = () => {
    // 显示成功通知
    showSuccess('操作成功完成！');

    // 显示信息通知（带自定义配置）
    showInfo('这是一条信息', '提示');
  };

  return (
    <div>
      <CyberButton onClick={handleClick}>显示通知</CyberButton>
    </div>
  );
}
```

### 2. 使用性能监控

```tsx
'use client';

import { PerformanceMonitor } from '@/components/ui';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <PerformanceMonitor position="bottom-right" />
    </>
  );
}
```

### 3. 使用协作 Hook

```tsx
'use client';

import { useCollaboration } from '@/hooks/useCollaboration';

export default function CollaborativeEditor() {
  const { collaborators, sendOperation, isCollaborating } = useCollaboration({
    documentId: 'doc-123',
    userId: 'user-456',
    userName: 'John Doe',
    websocketUrl: 'wss://api.example.com/collaborate',
    onUserJoined: (user) => {
      console.log('User joined:', user.name);
    },
  });

  return (
    <div>
      <div>协作者: {collaborators.length}</div>
      <div>状态: {isCollaborating ? '已连接' : '未连接'}</div>
    </div>
  );
}
```

### 4. 使用地理位置

```tsx
'use client';

import { useGeolocation } from '@/hooks/useGeolocation';

export default function LocationTracker() {
  const { latitude, longitude, loading, error } = useGeolocation({
    enableHighAccuracy: true,
  });

  if (loading) return <div>获取位置中...</div>;
  if (error) return <div>错误: {error.message}</div>;

  return (
    <div>
      <p>纬度: {latitude}</p>
      <p>经度: {longitude}</p>
    </div>
  );
}
```

## 📦 组件导出

所有新组件都可以通过统一的入口文件导入：

```tsx
// 导入所有新组件
import {
  AIAssistant,
  RealtimeNotification,
  PerformanceMonitor,
  useCollaboration,
  useGeolocation,
  collaborationService,
  // ... 等等
} from '@/components/new-components';
```

## 🎨 自定义主题

所有组件都支持赛博朋克主题的颜色变量：

- `cyber-cyan`: 青色 (#00f0ff)
- `cyber-purple`: 紫色 (#9d00ff)
- `cyber-pink`: 粉色 (#ff0080)
- `cyber-yellow`: 黄色 (#f0ff00)
- `cyber-green`: 绿色 (#00ff88)

## 📝 开发注意事项

1. **客户端组件**: 所有新组件都是客户端组件，使用 `'use client'` 指令
2. **TypeScript**: 所有组件都有完整的类型定义
3. **响应式**: 所有组件都支持响应式设计
4. **性能**: 使用了各种性能优化技术（防抖、节流、虚拟滚动等）
5. **可访问性**: 组件包含适当的 ARIA 属性和键盘导航支持

## 🧪 测试

新组件包含相应的测试文件，可以使用以下命令运行测试：

```bash
npm run test
```

## 📚 相关文档

- [项目 README](../README.md)
- [组件文档](../docs/GRAPHICS_DELIVERABLES.md)
- [开发指南](../docs/DEVELOPMENT.md)
- [API 文档](../docs/API.md)

## 🤝 贡献

欢迎贡献新的组件和功能！请遵循项目的贡献指南。

## 📄 许可证

MIT License - 详见项目根目录的 LICENSE 文件

---

**最后更新**: 2026-03-06
**版本**: 1.0.0
