# 🚀 新组件快速参考

## AI & 智能组件

### AIChatAssistant
```tsx
import { AIChatAssistant } from '@/components';

<AIChatAssistant endpoint="/api/ai/chat" />
```

### VoiceSearch
```tsx
import { VoiceSearch } from '@/components';

<VoiceSearch onSearch={(q) => console.log(q)} language="zh-CN" />
```

---

## 表单 & 输入

### SmartFormBuilder
```tsx
import { SmartFormBuilder } from '@/components';

<SmartFormBuilder onSave={(schema) => console.log(schema)} />
```

### DragDropUpload
```tsx
import { DragDropUpload } from '@/components';

<DragDropUpload
  onUpload={async (files) => await upload(files)}
  accept="image/*"
  multiple
/>
```

---

## 数据 & 可视化

### DataChart
```tsx
import { DataChart } from '@/components';

// 折线图
<DataChart type="line" data={data} title="趋势" />

// 柱状图
<DataChart type="bar" data={data} title="统计" />

// 饼图
<DataChart type="pie" data={data} title="占比" />
```

### StatsGrid
```tsx
import { StatsGrid } from '@/components';

<StatsGrid
  stats={[
    { title: '访问量', value: '12,345', change: 12.5 },
    { title: '用户数', value: '1,234', change: -5.2 },
  ]}
/>
```

---

## 列表 & 性能

### VirtualizedList
```tsx
import { VirtualizedList } from '@/components';

<VirtualizedList
  items={items}
  renderItem={(item) => <ItemCard data={item} />}
  itemHeight={60}
  height={600}
/>
```

---

## 协作 & 编辑

### CollaborativeEditor
```tsx
import { CollaborativeEditor } from '@/components';

<CollaborativeEditor
  content={content}
  onChange={setContent}
  currentUser={{ id: '1', name: '张三', color: '#00f0ff' }}
  onlineUsers={users}
/>
```

---

## 通知 & 反馈

### NotificationCenter
```tsx
import { NotificationCenter } from '@/components';

<NotificationCenter
  notifications={notifications}
  onMarkAsRead={(id) => markRead(id)}
  onDelete={(id) => remove(id)}
/>
```

---

## 任务 & 管理

### TaskManager
```tsx
import { TaskManager } from '@/components';

<TaskManager
  lists={lists}
  onListsChange={setLists}
/>
```

---

## PWA & 安装

### PWAInstallPrompt
```tsx
import { PWAInstallPrompt } from '@/components';

<PWAInstallPrompt delay={5000} title="安装应用" />
```

### usePWAInstall Hook
```tsx
import { usePWAInstall } from '@/components';

function InstallButton() {
  const { isInstallable, install } = usePWAInstall();
  return isInstallable ? <button onClick={install}>安装</button> : null;
}
```

---

## 🛠️ AI 服务

### 基础使用
```typescript
import { aiService } from '@/services';

// 聊天对话
const stream = await aiService.chat([{ role: 'user', content: '你好' }]);
for await (const chunk of stream) console.log(chunk);

// 文本摘要
const summary = await aiService.summarizeText(text, { maxLength: 200 });

// 情感分析
const sentiment = await aiService.analyzeSentiment(text);

// 关键词提取
const keywords = await aiService.extractKeywords(text, 10);
```

### 高级功能
```typescript
// 图像生成
const images = await aiService.generateImage({
  prompt: '赛博朋克城市',
  size: '1024x1024',
});

// 文本翻译
const translated = await aiService.translateText(text, 'English');

// 语法检查
const checked = await aiService.checkGrammar(text);

// 代码生成
const code = await aiService.generateCode('创建一个登录表单', 'typescript');
```

---

## 📋 Props 速查表

### AIChatAssistant
- `endpoint`: API 端点
- `initialMessage`: 初始消息
- `maxMessages`: 最大消息数 (默认: 50)
- `themeColor`: 主题颜色 (默认: #00f0ff)

### VoiceSearch
- `onSearch`: 搜索回调
- `language`: 语言 (默认: zh-CN)
- `maxDuration`: 最大时长 ms (默认: 10000)
- `showVisualization`: 显示可视化 (默认: true)

### SmartFormBuilder
- `onSave`: 保存回调
- `initialSchema`: 初始配置
- `previewMode`: 预览模式 (默认: false)
- `readOnly`: 只读模式 (默认: false)

### DataChart
- `type`: 图表类型 (line|bar|pie|area|radar)
- `data`: 数据数组
- `title`: 标题
- `height`: 高度 (默认: 300)
- `colorScheme`: 颜色主题 (cyan|purple|green|orange|rainbow)

### VirtualizedList
- `items`: 数据项
- `renderItem`: 渲染函数
- `itemHeight`: 项目高度
- `height`: 容器高度
- `onLoadMore`: 加载更多回调

### CollaborativeEditor
- `content`: 内容
- `onChange`: 变更回调
- `currentUser`: 当前用户
- `onlineUsers`: 在线用户
- `language`: 语言模式

### NotificationCenter
- `notifications`: 通知数组
- `onMarkAsRead`: 标记已读
- `onDelete`: 删除通知
- `position`: 位置 (默认: top-right)

### TaskManager
- `lists`: 任务列表
- `onListsChange`: 列表变更回调
- `onCreateTask`: 创建任务
- `onUpdateTask`: 更新任务

### PWAInstallPrompt
- `delay`: 延迟显示 ms (默认: 5000)
- `showFrequency`: 显示频率 (默认: 3)
- `title`: 标题
- `description`: 描述
- `position`: 位置 (默认: bottom-right)

---

## 🎨 主题颜色

```typescript
const colors = {
  cyan: '#00f0ff',
  purple: '#9d00ff',
  pink: '#ff0080',
  yellow: '#f0ff00',
  green: '#00ff88',
};
```

---

## 🔧 常见配置

### 启用所有功能
```tsx
<AIChatAssistant
  endpoint="/api/ai/chat"
  maxMessages={100}
  showSessions={true}
  themeColor="#00f0ff"
  defaultExpanded={false}
/>
```

### 性能优化配置
```tsx
<VirtualizedList
  items={largeDataset}
  renderItem={ItemComponent}
  itemHeight={80}
  height="80vh"
  overscan={5}
  onLoadMore={loadMore}
/>
```

### 完整表单配置
```tsx
<SmartFormBuilder
  onSave={handleSave}
  initialSchema={{
    name: '用户注册',
    description: '创建您的账户',
    fields: [
      { id: '1', type: 'email', label: '邮箱', required: true },
      { id: '2', type: 'password', label: '密码', required: true },
    ],
    settings: {
      submitButtonText: '注册',
      successMessage: '注册成功！',
    },
    theme: {
      primaryColor: '#00f0ff',
      borderRadius: 'md',
      style: 'cyberpunk',
    },
  }}
/>
```

---

## 📚 更多资源

- [完整使用指南](./NEW_FEATURES_GUIDE.md)
- [组件索引](../components/index.ts)
- [服务文档](../services/index.ts)
- [TypeScript 类型](../components/*/*.tsx)

---

**快速上手**: 1. 导入组件 → 2. 配置 Props → 3. 使用组件 ✨
