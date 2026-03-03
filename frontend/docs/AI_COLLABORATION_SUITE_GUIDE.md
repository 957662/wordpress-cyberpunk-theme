# AI 协作套件使用指南

这个指南将帮助你快速上手使用 CyberPress Platform 的新 AI 协作组件。

## 📦 安装

所有组件已经包含在项目中，无需额外安装。

## 🚀 快速开始

### 1. 导入组件

```typescript
// 方式 1: 单独导入
import { AIChat } from '@/components/ai/ai-chat';
import { CollaborativeEditor } from '@/components/collaborative/collaborative-editor';

// 方式 2: 从索引文件导入
import {
  AIChat,
  CollaborativeEditor,
  TaskBoard,
  AdvancedSearch
} from '@/components/new-ai-collaboration-index';
```

### 2. 使用组件

#### AI 聊天助手

```tsx
import { AIChat } from '@/components/ai/ai-chat';

function MyPage() {
  return (
    <AIChat
      title="我的 AI 助手"
      placeholder="输入消息..."
      onSendMessage={async (message) => {
        // 调用你的 AI API
        const response = await fetch('/api/chat', {
          method: 'POST',
          body: JSON.stringify({ message })
        });
        const data = await response.json();
        return data.reply;
      }}
    />
  );
}
```

#### 协作白板

```tsx
import { CollaborativeWhiteboard } from '@/components/whiteboard/collaborative-whiteboard';

function WhiteboardPage() {
  return (
    <CollaborativeWhiteboard
      width={1200}
      height={800}
      currentUser={{
        id: 'user1',
        name: 'You',
        color: '#00f0ff'
      }}
      collaborators={[
        {
          id: 'user2',
          name: 'Alice',
          color: '#9d00ff'
        }
      ]}
      onStrokesChange={(strokes) => {
        // 保存白板数据
        console.log('Strokes updated:', strokes);
      }}
    />
  );
}
```

#### 代码分享卡片

```tsx
import { CodeSnippetCard } from '@/components/code-share/code-snippet-card';

function CodeGallery() {
  const snippet = {
    id: '1',
    title: 'React 组件示例',
    description: '一个简单的 React 组件',
    code: 'export default function App() { return <div>Hello</div>; }',
    language: 'typescript' as const,
    author: { name: 'Developer' },
    createdAt: new Date(),
    likes: 42,
    tags: ['React', 'TypeScript']
  };

  return (
    <CodeSnippetCard
      snippet={snippet}
      onLike={(id) => console.log('Liked:', id)}
      onBookmark={(id) => console.log('Bookmarked:', id)}
      onShare={(snippet) => console.log('Shared:', snippet.title)}
    />
  );
}
```

#### 文章摘要生成器

```tsx
import { ArticleSummaryGenerator } from '@/components/article-summary/article-summary-generator';

function SummaryPage() {
  return (
    <ArticleSummaryGenerator
      articleTitle="我的文章标题"
      articleContent="这是文章的完整内容..."
      onGenerate={async (content, options) => {
        // 调用 AI API 生成摘要
        const response = await fetch('/api/summarize', {
          method: 'POST',
          body: JSON.stringify({ content, options })
        });
        const data = await response.json();
        return data.summary;
      }}
    />
  );
}
```

#### 高级搜索

```tsx
import { AdvancedSearch } from '@/components/search-advanced/advanced-search';

function SearchPage() {
  return (
    <AdvancedSearch
      placeholder="搜索文章、作品集..."
      suggestions={['React', 'Python', 'AI']}
      onSearch={async (query, filters) => {
        // 执行搜索
        const response = await fetch('/api/search', {
          method: 'POST',
          body: JSON.stringify({ query, filters })
        });
        const data = await response.json();
        return data.results;
      }}
    />
  );
}
```

#### 任务看板

```tsx
import { TaskBoard } from '@/components/tasks/task-board';

function ProjectPage() {
  const tasks = [
    {
      id: '1',
      title: '完成设计',
      status: 'todo' as const,
      priority: 'high' as const,
      assignee: 'Alice',
      tags: ['Design'],
      createdAt: new Date()
    }
  ];

  return (
    <TaskBoard
      initialTasks={tasks}
      onTaskUpdate={(id, updates) => {
        // 更新任务
        console.log('Task updated:', id, updates);
      }}
      onTaskDelete={(id) => {
        // 删除任务
        console.log('Task deleted:', id);
      }}
    />
  );
}
```

#### 阅读进度追踪

```tsx
import { ReadingProgressTracker } from '@/components/reading-progress/reading-progress-tracker';

function ArticlePage() {
  return (
    <>
      <ReadingProgressTracker
        onStartReading={() => console.log('开始阅读')}
        onCompleteReading={() => console.log('阅读完成')}
        onProgressChange={(progress) => console.log(`进度: ${progress}%`)}
      />

      <article>
        {/* 你的文章内容 */}
      </article>
    </>
  );
}
```

#### 协作编辑器

```tsx
import { CollaborativeEditor } from '@/components/collaborative/collaborative-editor';

function EditorPage() {
  return (
    <CollaborativeEditor
      initialContent="# 标题\n\n内容..."
      currentUser={{
        id: 'user1',
        name: 'You',
        color: '#00f0ff'
      }}
      collaborators={[
        {
          id: 'user2',
          name: 'Alice',
          color: '#9d00ff'
        }
      ]}
      onSave={async (content) => {
        // 保存内容
        await fetch('/api/save', {
          method: 'POST',
          body: JSON.stringify({ content })
        });
      }}
      autoSave
      autoSaveInterval={30000}
    />
  );
}
```

## 🎨 自定义样式

所有组件都支持 `className` 属性来自定义样式：

```tsx
<AIChat className="my-custom-chat" />
```

## 🔧 配置选项

每个组件都有丰富的配置选项，可以根据需求进行调整。具体请参考各组件的 TypeScript 类型定义。

## 📚 完整示例

查看 `/app/examples/ai-collaboration-suite/page.tsx` 获取完整的使用示例。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这些组件！

## 📄 许可

MIT License
