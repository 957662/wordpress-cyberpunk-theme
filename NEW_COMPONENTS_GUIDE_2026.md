# 新组件使用指南

本文档介绍 CyberPress Platform 最新创建的组件及其使用方法。

## 📋 目录

- [AI 智能表单生成器](#ai-智能表单生成器)
- [智能搜索组件](#智能搜索组件)
- [协作白板](#协作白板)
- [WebSocket 服务](#websocket-服务)

---

## 🤖 AI 智能表单生成器

### 功能特性

- 使用自然语言描述自动生成表单
- 支持多种表单字段类型（文本、邮箱、选择框等）
- 实时预览和代码生成
- 支持导出 React/TSX 和 JSON 格式
- 赛博朋克风格 UI

### 基础使用

```tsx
import { AIFormGenerator } from '@/components/ai/AIFormGenerator';

function MyPage() {
  const handleGenerate = async (prompt: string) => {
    // 调用 AI API 生成表单
    const response = await fetch('/api/generate-form', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
    return response.json();
  };

  return (
    <AIFormGenerator
      onGenerate={handleGenerate}
      placeholder="描述你想要的表单..."
    />
  );
}
```

### Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| onGenerate | (prompt: string) => Promise<GeneratedForm> | - | 生成表单的回调函数 |
| onExport | (form: GeneratedForm, format: 'tsx' \| 'json' \| 'html') => void | - | 导出表单的回调函数 |
| className | string | - | 自定义类名 |
| placeholder | string | "Describe your form..." | 输入框占位符 |

### 示例

```tsx
<AIFormGenerator
  onGenerate={async (prompt) => {
    // 模拟 AI 生成
    return {
      title: 'Contact Form',
      fields: [
        { id: 'name', type: 'text', label: 'Name', required: true },
        { id: 'email', type: 'email', label: 'Email', required: true },
      ],
    };
  }}
  onExport={(form, format) => {
    console.log(`Exporting as ${format}:`, form);
  }}
/>
```

---

## 🔍 智能搜索组件

### 功能特性

- 自然语言搜索支持
- 智能建议和自动补全
- 搜索历史和热门搜索
- 高级筛选功能
- 实时搜索结果展示

### 基础使用

```tsx
import { AISmartSearch } from '@/components/search/AISmartSearch';

function MyPage() {
  const handleSearch = async (query: string, filters?: SearchFilters) => {
    const response = await fetch('/api/search', {
      method: 'POST',
      body: JSON.stringify({ query, filters }),
    });
    return response.json();
  };

  return (
    <AISmartSearch
      onSearch={handleSearch}
      placeholder="搜索任何内容..."
      showFilters={true}
      showHistory={true}
    />
  );
}
```

### Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| onSearch | (query: string, filters?: SearchFilters) => Promise<SearchResult[]> | - | 执行搜索的回调函数 |
| onSuggestionClick | (suggestion: SearchSuggestion) => void | - | 点击建议的回调 |
| placeholder | string | "Search anything..." | 搜索框占位符 |
| showFilters | boolean | true | 是否显示筛选功能 |
| showHistory | boolean | true | 是否显示搜索历史 |
| showTrending | boolean | true | 是否显示热门搜索 |
| debounceMs | number | 300 | 防抖延迟（毫秒） |
| className | string | - | 自定义类名 |

### 搜索结果类型

```typescript
interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  category?: string;
  relevance: number;
  timestamp?: Date;
}

interface SearchFilters {
  category?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  sortBy?: 'relevance' | 'date' | 'popularity';
}
```

### 示例

```tsx
<AISmartSearch
  onSearch={async (query, filters) => {
    const results = await searchService.search(query, {
      category: filters?.category,
      sortBy: filters?.sortBy || 'relevance',
    });
    return results;
  }}
  onSuggestionClick={(suggestion) => {
    console.log('Selected:', suggestion.text);
  }}
  showFilters={true}
  debounceMs={500}
/>
```

---

## 🎨 协作白板

### 功能特性

- 实时多人协作绘图
- 多种绘图工具（画笔、橡皮擦、形状等）
- 颜色和线宽调节
- 撤销/重做功能
- 导出为 PNG
- 显示在线用户
- 赛博朋克风格界面

### 基础使用

```tsx
import { CollaborativeWhiteboard } from '@/components/whiteboard';

function MyPage() {
  const users = [
    { id: '1', name: 'Alice', color: '#00f0ff' },
    { id: '2', name: 'Bob', color: '#9d00ff' },
  ];

  const currentUser = { id: '1', name: 'Alice', color: '#00f0ff' };

  return (
    <CollaborativeWhiteboard
      users={users}
      currentUser={currentUser}
      onSave={(elements) => {
        console.log('Saved:', elements);
      }}
      onExport={(dataUrl) => {
        console.log('Exported:', dataUrl);
      }}
    />
  );
}
```

### Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| onSave | (elements: DrawnElement[]) => void | - | 保存白板的回调函数 |
| onExport | (dataUrl: string) => void | - | 导出白板的回调函数 |
| users | User[] | [] | 在线用户列表 |
| currentUser | User | - | 当前用户信息 |
| className | string | - | 自定义类名 |

### 用户类型

```typescript
interface User {
  id: string;
  name: string;
  color: string;
}

interface DrawnElement {
  id: string;
  type: 'pencil' | 'eraser' | 'rectangle' | 'circle' | 'text' | 'image';
  points: Point[];
  color: string;
  lineWidth: number;
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  text?: string;
  image?: string;
}
```

### 示例

```tsx
<CollaborativeWhiteboard
  users={[
    { id: 'user1', name: '张三', color: '#00f0ff' },
    { id: 'user2', name: '李四', color: '#9d00ff' },
  ]}
  currentUser={{ id: 'user1', name: '张三', color: '#00f0ff' }}
  onSave={async (elements) => {
    await fetch('/api/whiteboard/save', {
      method: 'POST',
      body: JSON.stringify({ elements }),
    });
  }}
  onExport={(dataUrl) => {
    const link = document.createElement('a');
    link.download = 'whiteboard.png';
    link.href = dataUrl;
    link.click();
  }}
  className="h-screen"
/>
```

---

## 🌐 WebSocket 服务

### 功能特性

- 自动重连机制
- 心跳检测
- 消息队列
- 事件监听器
- TypeScript 支持
- React Hook 集成

### 基础使用

```typescript
import { createWebSocketService } from '@/services/websocket';

// 创建 WebSocket 服务
const ws = createWebSocketService(
  {
    url: 'ws://localhost:8080',
    reconnectInterval: 3000,
    maxReconnectAttempts: 10,
    heartbeatInterval: 30000,
    debug: true,
  },
  {
    onOpen: () => console.log('Connected'),
    onMessage: (message) => console.log('Received:', message),
    onClose: () => console.log('Disconnected'),
    onError: (error) => console.error('Error:', error),
  }
);

// 连接
ws.connect();

// 发送消息
ws.send('chat', { text: 'Hello!' });

// 监听特定事件
ws.on('chat', (data) => {
  console.log('Chat message:', data);
});

// 断开连接
ws.disconnect();
```

### React Hook 使用

```tsx
import { useWebSocket } from '@/services/websocket';

function ChatComponent() {
  const { isConnected, send, reconnect } = useWebSocket('ws://localhost:8080', {
    onMessage: (message) => {
      if (message.type === 'chat') {
        console.log('New message:', message.data);
      }
    },
    onOpen: () => {
      console.log('Connected to server');
    },
  });

  return (
    <div>
      <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      <button onClick={() => send('chat', { text: 'Hello!' })}>
        Send Message
      </button>
    </div>
  );
}
```

### API 参考

#### WebSocketService 类

| 方法 | 描述 |
|------|------|
| connect() | 连接到 WebSocket 服务器 |
| disconnect() | 断开连接 |
| send(type, data, id?) | 发送消息 |
| on(event, listener) | 添加事件监听器 |
| off(event, listener) | 移除事件监听器 |
| getReadyState() | 获取连接状态 |
| isConnected() | 是否已连接 |
| destroy() | 销毁服务实例 |

#### useWebSocket Hook

| 返回值 | 类型 | 描述 |
|--------|------|------|
| isConnected | boolean | 是否已连接 |
| reconnectAttempt | number | 当前重连次数 |
| send | (type, data) => void | 发送消息 |
| disconnect | () => void | 断开连接 |
| reconnect | () => void | 重新连接 |
| ws | WebSocketService | 服务实例 |

### 带认证的 WebSocket

```typescript
import { createAuthenticatedWebSocket } from '@/services/websocket';

const ws = createAuthenticatedWebSocket(
  'ws://localhost:8080',
  'your-auth-token',
  {
    onMessage: (message) => {
      console.log('Received:', message);
    },
  }
);

ws.connect();
```

---

## 📦 安装和导入

所有新组件都已添加到主组件索引中，可以直接导入使用：

```tsx
// AI 组件
import { AIFormGenerator } from '@/components/ai';
import { VoiceInput } from '@/components/voice';

// 搜索组件
import { AISmartSearch } from '@/components/search';

// 白板组件
import { CollaborativeWhiteboard } from '@/components/whiteboard';

// WebSocket 服务
import {
  createWebSocketService,
  useWebSocket,
  createAuthenticatedWebSocket,
} from '@/services/websocket';
```

---

## 🎯 快速开始示例

### 完整的协作编辑器页面

```tsx
'use client';

import { AIFormGenerator } from '@/components/ai';
import { AISmartSearch } from '@/components/search';
import { CollaborativeWhiteboard } from '@/components/whiteboard';
import { useWebSocket } from '@/services/websocket';

export default function CollaborationPage() {
  const { isConnected } = useWebSocket('ws://localhost:8080/ws', {
    onMessage: (message) => {
      console.log('WebSocket message:', message);
    },
  });

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* 连接状态 */}
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
      </div>

      {/* 智能搜索 */}
      <section>
        <h2 className="text-2xl font-bold mb-4">搜索</h2>
        <AISmartSearch
          onSearch={async (query) => {
            // 实现搜索逻辑
            return [];
          }}
        />
      </section>

      {/* 协作白板 */}
      <section>
        <h2 className="text-2xl font-bold mb-4">白板</h2>
        <CollaborativeWhiteboard
          users={[{ id: '1', name: 'You', color: '#00f0ff' }]}
          currentUser={{ id: '1', name: 'You', color: '#00f0ff' }}
        />
      </section>

      {/* AI 表单生成器 */}
      <section>
        <h2 className="text-2xl font-bold mb-4">表单生成器</h2>
        <AIFormGenerator
          onGenerate={async (prompt) => {
            // 实现 AI 生成逻辑
            return {
              title: 'Generated Form',
              fields: [],
            };
          }}
        />
      </section>
    </div>
  );
}
```

---

## 🔧 自定义样式

所有组件都支持通过 `className` prop 进行自定义样式：

```tsx
<AIFormGenerator
  className="custom-form-generator"
  onGenerate={handleGenerate}
/>

<style jsx>{`
  .custom-form-generator {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    border-radius: 16px;
  }
`}</style>
```

---

## 📚 相关文档

- [组件库总览](./COMPONENTS.md)
- [赛博朋克设计系统](./GRAPHICS_DESIGN.md)
- [快速开始指南](./QUICKSTART.md)

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这些组件！

---

**最后更新**: 2026-03-03
**版本**: 1.0.0
