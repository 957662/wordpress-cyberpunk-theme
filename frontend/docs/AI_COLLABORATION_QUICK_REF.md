# AI 协作套件 - 快速参考

## 🚀 快速开始

### 导入组件
```typescript
import {
  AIChat,
  CollaborativeWhiteboard,
  CodeSnippetCard,
  ArticleSummaryGenerator,
  AdvancedSearch,
  ReadingProgressTracker,
  CollaborativeEditor,
  TaskBoard
} from '@/components/new-ai-collaboration-index';
```

---

## 📦 组件速查

### 1. AIChat - AI 聊天助手
```tsx
<AIChat
  title="AI 助手"
  onSendMessage={async (msg) => {
    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: msg })
    });
    const data = await res.json();
    return data.reply;
  }}
/>
```

### 2. CollaborativeWhiteboard - 协作白板
```tsx
<CollaborativeWhiteboard
  width={1200}
  height={800}
  currentUser={{ id: '1', name: 'You', color: '#00f0ff' }}
  onStrokesChange={(strokes) => console.log(strokes)}
/>
```

### 3. CodeSnippetCard - 代码卡片
```tsx
<CodeSnippetCard
  snippet={{
    id: '1',
    title: 'React 示例',
    code: 'export default function App() {}',
    language: 'typescript',
    author: { name: 'Dev' },
    createdAt: new Date(),
    likes: 42,
    tags: ['React']
  }}
  onLike={(id) => console.log('Like', id)}
/>
```

### 4. ArticleSummaryGenerator - 摘要生成器
```tsx
<ArticleSummaryGenerator
  articleTitle="标题"
  articleContent="内容..."
  onGenerate={async (content, options) => {
    const res = await fetch('/api/summarize', {
      method: 'POST',
      body: JSON.stringify({ content, options })
    });
    const data = await res.json();
    return data.summary;
  }}
/>
```

### 5. AdvancedSearch - 高级搜索
```tsx
<AdvancedSearch
  placeholder="搜索..."
  onSearch={async (query, filters) => {
    const res = await fetch('/api/search', {
      method: 'POST',
      body: JSON.stringify({ query, filters })
    });
    const data = await res.json();
    return data.results;
  }}
/>
```

### 6. ReadingProgressTracker - 阅读进度
```tsx
<ReadingProgressTracker
  onStartReading={() => console.log('开始')}
  onCompleteReading={() => console.log('完成')}
  onProgressChange={(p) => console.log(`进度: ${p}%`)}
/>
```

### 7. CollaborativeEditor - 协作编辑器
```tsx
<CollaborativeEditor
  initialContent="# 内容"
  currentUser={{ id: '1', name: 'You', color: '#00f0ff' }}
  onSave={async (content) => {
    await fetch('/api/save', {
      method: 'POST',
      body: JSON.stringify({ content })
    });
  }}
  autoSave
/>
```

### 8. TaskBoard - 任务看板
```tsx
<TaskBoard
  initialTasks={[
    {
      id: '1',
      title: '任务标题',
      status: 'todo',
      priority: 'high',
      assignee: 'Alice',
      createdAt: new Date()
    }
  ]}
  onTaskUpdate={(id, updates) => console.log('更新', id, updates)}
/>
```

---

## 🎨 样式定制

所有组件都支持 `className` 属性：
```tsx
<AIChat className="my-custom-class" />
```

---

## 🔗 常用链接

- **示例页面**: `/examples/ai-collaboration-suite`
- **完整文档**: `frontend/docs/AI_COLLABORATION_SUITE_GUIDE.md`
- **验证脚本**: `./frontend/verify-new-ai-components.sh`

---

## 💡 提示

- 所有组件都是响应式的
- 支持深色主题
- 使用 Framer Motion 实现流畅动画
- 完整的 TypeScript 类型支持
