# 快速参考 - 新组件速查表

## 🚀 快速导入

```tsx
// AI 组件
import { AIFormGenerator } from '@/components/ai';

// 搜索组件
import { AISmartSearch } from '@/components/search';

// 白板组件
import { CollaborativeWhiteboard } from '@/components/whiteboard';

// WebSocket 服务
import { useWebSocket, createWebSocketService } from '@/services/websocket';
```

---

## 📖 基础用法

### AIFormGenerator

```tsx
<AIFormGenerator
  onGenerate={async (prompt) => ({
    title: 'My Form',
    fields: [
      { id: 'name', type: 'text', label: 'Name', required: true }
    ]
  })}
  onExport={(form, format) => console.log(form, format)}
/>
```

### AISmartSearch

```tsx
<AISmartSearch
  onSearch={async (query, filters) => {
    const results = await searchAPI(query, filters);
    return results;
  }}
  showFilters={true}
  debounceMs={300}
/>
```

### CollaborativeWhiteboard

```tsx
<CollaborativeWhiteboard
  users={[{ id: '1', name: 'User', color: '#00f0ff' }]}
  currentUser={{ id: '1', name: 'User', color: '#00f0ff' }}
  onSave={(elements) => saveToAPI(elements)}
  onExport={(dataUrl) => downloadImage(dataUrl)}
/>
```

### WebSocket Hook

```tsx
const { isConnected, send } = useWebSocket('ws://localhost:8080', {
  onMessage: (msg) => console.log(msg),
  onOpen: () => console.log('Connected')
});

// 发送消息
send('chat', { text: 'Hello!' });
```

---

## 🎨 Props 速查

### AIFormGenerator

| Prop | 类型 | 必填 | 默认值 |
|------|------|------|--------|
| onGenerate | (prompt) => Promise<Form> | ✅ | - |
| onExport | (form, format) => void | ❌ | - |
| placeholder | string | ❌ | "Describe your form..." |

### AISmartSearch

| Prop | 类型 | 必填 | 默认值 |
|------|------|------|--------|
| onSearch | (query, filters) => Promise<Result[]> | ✅ | - |
| showFilters | boolean | ❌ | true |
| showHistory | boolean | ❌ | true |
| debounceMs | number | ❌ | 300 |

### CollaborativeWhiteboard

| Prop | 类型 | 必填 | 默认值 |
|------|------|------|--------|
| users | User[] | ❌ | [] |
| currentUser | User | ❌ | - |
| onSave | (elements) => void | ❌ | - |
| onExport | (dataUrl) => void | ❌ | - |

### useWebSocket

| 参数 | 类型 | 必填 | 默认值 |
|------|------|------|--------|
| url | string | ✅ | - |
| onMessage | (msg) => void | ❌ | - |
| onOpen | () => void | ❌ | - |
| reconnectInterval | number | ❌ | 3000 |

---

## 🎯 常见场景

### 场景1: 创建注册表单

```tsx
<AIFormGenerator
  onGenerate={async (prompt) => {
    if (prompt.includes('registration')) {
      return {
        title: 'User Registration',
        fields: [
          { id: 'username', type: 'text', label: 'Username', required: true },
          { id: 'email', type: 'email', label: 'Email', required: true },
          { id: 'password', type: 'password', label: 'Password', required: true }
        ]
      };
    }
  }}
/>
```

### 场景2: 实时聊天

```tsx
const { isConnected, send } = useWebSocket('ws://localhost:8080/chat', {
  onMessage: (msg) => {
    if (msg.type === 'message') {
      setMessages(prev => [...prev, msg.data]);
    }
  }
});

// 发送消息
const sendMessage = (text) => {
  send('message', { text, timestamp: Date.now() });
};
```

### 场景3: 协作绘图

```tsx
const [users, setUsers] = useState([
  { id: '1', name: 'You', color: '#00f0ff' }
]);

useWebSocket('ws://localhost:8080/whiteboard', {
  onMessage: (msg) => {
    if (msg.type === 'user-joined') {
      setUsers(prev => [...prev, msg.data.user]);
    }
  }
});

<CollaborativeWhiteboard users={users} currentUser={users[0]} />
```

---

## 🎨 自定义样式

所有组件支持 `className` prop：

```tsx
<AIFormGenerator
  className="my-custom-class"
  onGenerate={handleGenerate}
/>

<style jsx>{`
  .my-custom-class {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    border-radius: 16px;
  }
`}</style>
```

---

## 🐛 调试技巧

### 启用 WebSocket 调试

```tsx
const ws = createWebSocketService(
  { url: 'ws://localhost:8080', debug: true },
  { onMessage: (msg) => console.log('Received:', msg) }
);
```

### 查看搜索结果

```tsx
<AISmartSearch
  onSearch={async (query) => {
    console.log('Searching for:', query);
    const results = await searchAPI(query);
    console.log('Found:', results.length);
    return results;
  }}
/>
```

---

## 📚 更多资源

- [完整文档](./NEW_COMPONENTS_GUIDE_2026.md)
- [创建报告](./FILES_CREATION_REPORT_2026_03_03_FINAL.md)
- [组件总览](./COMPONENTS.md)

---

**提示**: 所有组件都已集成到项目中，可以直接导入使用！
