# 新组件使用指南

本文档介绍新创建的高级组件的使用方法。

## 📚 目录

1. [AI 聊天助手](#ai-chat-assistant)
2. [语音搜索](#voice-search)
3. [智能表单生成器](#smart-form-builder)
4. [数据可视化图表](#data-chart)
5. [PWA 安装提示](#pwa-install-prompt)
6. [虚拟滚动列表](#virtualized-list)
7. [拖拽上传](#drag-drop-upload)
8. [实时协作编辑器](#collaborative-editor)
9. [通知中心](#notification-center)
10. [任务管理器](#task-manager)
11. [AI 服务](#ai-service)

---

## 1. AI Chat Assistant

AI 聊天助手组件，支持流式响应、多轮对话、上下文记忆。

### 基础用法

```tsx
import { AIChatAssistant } from '@/components';

export default function Page() {
  return (
    <AIChatAssistant
      endpoint="/api/ai/chat"
      initialMessage="你好！我是AI助手，有什么可以帮助你的吗？"
      themeColor="#00f0ff"
      defaultExpanded={false}
    />
  );
}
```

### 高级用法

```tsx
import { AIChatAssistant } from '@/components';

export default function Page() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <AIChatAssistant
      endpoint="/api/ai/chat"
      maxMessages={100}
      showSessions={true}
      themeColor="#9d00ff"
      defaultExpanded={true}
      className="custom-chat"
    />
  );
}
```

### Props

| Prop | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| endpoint | string | '/api/ai/chat' | API 端点 |
| initialMessage | string | '你好！...' | 初始消息 |
| maxMessages | number | 50 | 最大消息数 |
| showSessions | boolean | true | 显示会话历史 |
| themeColor | string | '#00f0ff' | 主题颜色 |
| defaultExpanded | boolean | false | 默认展开 |

---

## 2. Voice Search

语音搜索组件，支持语音识别、实时反馈、多语言。

### 基础用法

```tsx
import { VoiceSearch } from '@/components';

export default function Page() {
  const handleSearch = (query: string) => {
    console.log('搜索:', query);
  };

  return (
    <VoiceSearch
      onSearch={handleSearch}
      language="zh-CN"
      placeholder="点击麦克风开始语音搜索..."
    />
  );
}
```

### 高级用法

```tsx
import { VoiceSearch } from '@/components';

export default function Page() {
  return (
    <VoiceSearch
      onSearch={(query) => {
        // 处理搜索
        router.push(`/search?q=${encodeURIComponent(query)}`);
      }}
      language="en-US"
      maxDuration={15000}
      showVisualization={true}
    />
  );
}
```

### Props

| Prop | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| onSearch | (query: string) => void | - | 搜索回调 |
| language | string | 'zh-CN' | 语言代码 |
| maxDuration | number | 10000 | 最大时长(ms) |
| showVisualization | boolean | true | 显示可视化 |
| placeholder | string | '点击...' | 占位符 |

---

## 3. Smart Form Builder

智能表单生成器，支持动态字段、验证、自定义主题。

### 基础用法

```tsx
import { SmartFormBuilder } from '@/components';

export default function Page() {
  const handleSave = (schema) => {
    console.log('表单配置:', schema);
  };

  return (
    <SmartFormBuilder
      onSave={handleSave}
      initialSchema={{
        name: '联系表单',
        description: '请填写您的信息',
      }}
    />
  );
}
```

### 预览模式

```tsx
<SmartFormBuilder
  initialSchema={mySchema}
  previewMode={true}
  readOnly={true}
/>
```

### Props

| Prop | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| onSave | (schema) => void | - | 保存回调 |
| initialSchema | Partial<FormSchema> | - | 初始配置 |
| previewMode | boolean | false | 预览模式 |
| readOnly | boolean | false | 只读模式 |

---

## 4. Data Chart

数据可视化图表组件，支持多种图表类型。

### 折线图

```tsx
import { DataChart } from '@/components';

export default function Page() {
  const data = [
    { label: '1月', value: 100 },
    { label: '2月', value: 200 },
    { label: '3月', value: 150 },
  ];

  return (
    <DataChart
      type="line"
      data={data}
      title="月度趋势"
      height={300}
      colorScheme="cyan"
    />
  );
}
```

### 柱状图

```tsx
<DataChart
  type="bar"
  data={data}
  title="销售数据"
  height={400}
  showLegend={true}
/>
```

### 饼图

```tsx
<DataChart
  type="pie"
  data={[
    { label: '类别A', value: 30 },
    { label: '类别B', value: 50 },
    { label: '类别C', value: 20 },
  ]}
  title="分布占比"
/>
```

### 统计卡片

```tsx
import { StatsGrid } from '@/components';

<StatsGrid
  stats={[
    { title: '总访问量', value: '12,345', change: 12.5 },
    { title: '新用户', value: '1,234', change: -5.2 },
  ]}
/>
```

---

## 5. PWA Install Prompt

PWA 安装提示组件。

### 基础用法

```tsx
import { PWAInstallPrompt } from '@/components';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <PWAInstallPrompt
          delay={5000}
          showFrequency={3}
          title="安装应用"
          description="获得更好的体验"
        />
      </body>
    </html>
  );
}
```

### Hook 用法

```tsx
import { usePWAInstall } from '@/components';

export default function InstallButton() {
  const { isInstallable, install } = usePWAInstall();

  if (!isInstallable) return null;

  return (
    <button onClick={install}>
      安装应用
    </button>
  );
}
```

---

## 6. Virtualized List

虚拟滚动列表组件。

### 基础用法

```tsx
import { VirtualizedList } from '@/components';

export default function Page() {
  const items = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
  }));

  return (
    <VirtualizedList
      items={items}
      renderItem={(item, index) => (
        <div className="p-4 border-b">
          {item.name}
        </div>
      )}
      itemHeight={60}
      height={600}
    />
  );
}
```

### 动态高度

```tsx
<VirtualizedList
  items={items}
  renderItem={(item) => <ItemComponent data={item} />}
  itemHeight={(item) => item.height}
  height="80vh"
  onLoadMore={loadMore}
  hasMore={hasMore}
/>
```

---

## 7. Drag & Drop Upload

拖拽上传组件。

### 基础用法

```tsx
import { DragDropUpload } from '@/components';

export default function Page() {
  const handleUpload = async (files) => {
    // 上传逻辑
    await uploadToServer(files);
  };

  return (
    <DragDropUpload
      onUpload={handleUpload}
      accept="image/*"
      multiple={true}
      maxSize={5 * 1024 * 1024} // 5MB
    />
  );
}
```

### 高级用法

```tsx
<DragDropUpload
  onUpload={handleUpload}
  onRemove={(file) => console.log('删除:', file)}
  accept="image/*,video/*,.pdf"
  multiple={true}
  maxFiles={20}
  maxSize={10 * 1024 * 1024}
  showPreview={true}
  dragText="拖拽文件到这里"
/>
```

---

## 8. Collaborative Editor

实时协作编辑器。

### 基础用法

```tsx
import { CollaborativeEditor } from '@/components';

export default function Page() {
  const [content, setContent] = useState('');

  return (
    <CollaborativeEditor
      content={content}
      onChange={setContent}
      currentUser={{
        id: 'user-1',
        name: '张三',
        color: '#00f0ff',
      }}
      onlineUsers={[
        { id: 'user-2', name: '李四', color: '#9d00ff' },
      ]}
      language="markdown"
    />
  );
}
```

---

## 9. Notification Center

通知中心组件。

### 基础用法

```tsx
import { NotificationCenter, type Notification } from '@/components';

export default function Page() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  return (
    <NotificationCenter
      notifications={notifications}
      onMarkAsRead={(id) => {
        setNotifications(prev =>
          prev.map(n =>
            n.id === id ? { ...n, read: true } : n
          )
        );
      }}
      onDelete={(id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }}
      onMarkAllAsRead={() => {
        setNotifications(prev =>
          prev.map(n => ({ ...n, read: true }))
        );
      }}
    />
  );
}
```

---

## 10. Task Manager

任务管理器组件。

### 基础用法

```tsx
import { TaskManager, type TaskList } from '@/components';

export default function Page() {
  const [lists, setLists] = useState<TaskList[]>([
    {
      id: 'list-1',
      name: '待办',
      tasks: [
        {
          id: 'task-1',
          title: '完成项目文档',
          status: 'todo',
          priority: 'high',
          tags: ['文档', '重要'],
          createdAt: new Date(),
        },
      ],
    },
  ]);

  return (
    <TaskManager
      lists={lists}
      onListsChange={setLists}
    />
  );
}
```

---

## 11. AI Service

AI 服务模块。

### 聊天对话

```typescript
import { aiService } from '@/services';

// 流式响应
const stream = await aiService.chat([
  { role: 'user', content: '你好' }
]);

for await (const chunk of stream) {
  console.log(chunk);
}

// 非流式响应
const response = await aiService.chat(messages, { stream: false });
```

### 文本摘要

```typescript
const summary = await aiService.summarizeText(longText, {
  maxLength: 200,
  format: 'bullets',
});
```

### 情感分析

```typescript
const sentiment = await aiService.analyzeSentiment(text);
console.log(sentiment.sentiment); // 'positive' | 'neutral' | 'negative'
console.log(sentiment.score); // -1 to 1
```

### 关键词提取

```typescript
const keywords = await aiService.extractKeywords(text, 10);
console.log(keywords.keywords);
```

### 图像生成

```typescript
const images = await aiService.generateImage({
  prompt: '一只赛博朋克风格的猫',
  size: '1024x1024',
  style: 'vivid',
});
```

---

## 💡 提示

1. **类型导入**：大多数组件都导出了相关的 TypeScript 类型
2. **自定义样式**：所有组件都支持 `className` 属性进行样式定制
3. **响应式设计**：组件均支持移动端和桌面端
4. **性能优化**：虚拟滚动等组件已内置性能优化

---

## 📦 完整示例

查看 `frontend/app/examples/` 目录获取完整的使用示例。

---

**创建时间**: 2026-03-03
**版本**: 1.0.0
**维护者**: AI Development Team
