# 🚀 高级功能快速启动指南

> **最后更新**: 2026-03-07
> **组件版本**: 1.0.0

---

## 📦 新组件概览

本次更新新增了 **4 个高级功能组件**，大幅提升文章阅读和协作体验：

| 组件 | 功能 | 文件大小 | 推荐度 |
|------|------|----------|--------|
| ArticleSummaryAI | AI 智能摘要 | 450 行 | ⭐⭐⭐ |
| ArticleVoiceReader | 语音朗读 | 550 行 | ⭐⭐⭐ |
| ArticleVersionHistory | 版本历史 | 650 行 | ⭐⭐ |
| CollaborativeAnnotations | 协作注释 | 750 行 | ⭐⭐⭐ |

---

## 🔧 安装依赖

首先，确保安装了所需的依赖包：

```bash
cd frontend
npm install framer-motion date-fns lucide-react clsx tailwind-merge
```

如果没有 `package.json` 中的依赖，请添加：

```json
{
  "dependencies": {
    "framer-motion": "^11.0.0",
    "date-fns": "^3.0.0",
    "lucide-react": "^0.344.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  }
}
```

---

## 📚 快速开始

### 1. AI 文章摘要生成器

#### 基础用法

```tsx
import { ArticleSummaryAI } from '@/components/blog/ArticleSummaryAI';

export default function ArticlePage() {
  return (
    <ArticleSummaryAI
      content="你的文章内容..."
      title="文章标题"
    />
  );
}
```

#### 高级用法

```tsx
<ArticleSummaryAI
  content={post.content}
  title={post.title}
  length="medium"                    // 摘要长度: short | medium | long
  showKeyPoints={true}               // 显示关键点
  showTTS={true}                     // 显示语音朗读按钮
  language="zh"                      // 语言: zh | en
  defaultExpanded={true}             // 默认展开
  onSummaryGenerated={(summary) => {
    console.log('摘要:', summary.summary);
    console.log('关键点:', summary.keyPoints);
    console.log('难度:', summary.difficulty);
  }}
/>
```

#### 使用场景
- 📝 博客文章摘要
- 📚 文档内容总结
- 📰 新闻文章要点
- 🎓 学术论文概述

---

### 2. 文章语音朗读系统

#### 基础用法

```tsx
import { ArticleVoiceReader } from '@/components/blog/ArticleVoiceReader';

export default function ArticlePage() {
  return (
    <ArticleVoiceReader
      content="你的文章内容..."
    />
  );
}
```

#### 高级用法

```tsx
<ArticleVoiceReader
  content={post.content}
  autoHighlight={true}               // 高亮当前朗读内容
  showAdvancedSettings={true}        // 显示高级设置
  initialSettings={{
    rate: 1,                         // 语速: 0.1-10
    pitch: 1,                        // 音调: 0-2
    volume: 1,                       // 音量: 0-1
    lang: 'zh-CN',                   // 语言
  }}
  onStateChange={(state) => {
    // state: 'idle' | 'playing' | 'paused' | 'stopped'
    console.log('播放状态:', state);
  }}
  onProgress={(current, total) => {
    console.log(`进度: ${current}/${total}`);
  }}
/>
```

#### 使用场景
- 🎙️ 无障碍阅读
- 🚗 驾驶时听文章
- 🏃 运动时学习
- 👀 视觉辅助

---

### 3. 文章版本历史系统

#### 基础用法

```tsx
import { ArticleVersionHistory } from '@/components/blog/ArticleVersionHistory';

export default function ArticlePage() {
  const versions = [
    {
      id: '1',
      version: 1,
      title: '初版',
      content: '内容...',
      author: { id: '1', name: '张三' },
      createdAt: new Date('2024-01-01'),
      changes: { added: 100, modified: 50, removed: 10 },
    },
    // ...更多版本
  ];

  return (
    <ArticleVersionHistory
      articleId="123"
      versions={versions}
    />
  );
}
```

#### 高级用法

```tsx
<ArticleVersionHistory
  articleId={post.id}
  versions={post.versions}
  showFullContent={true}             // 显示完整内容
  defaultExpanded={true}             // 默认展开
  onRestore={(version) => {
    // 恢复到指定版本
    restoreVersion(version.id);
  }}
  onDelete={(versionId) => {
    // 删除版本
    deleteVersion(versionId);
  }}
  onCompare={(from, to) => {
    // 对比两个版本
    compareVersions(from.id, to.id);
  }}
/>
```

#### 使用场景
- 📚 Wiki 文档管理
- 📝 博客文章修订
- 📄 合同版本追踪
- 🎯 内容回滚

---

### 4. 协作注释系统

#### 基础用法

```tsx
import { CollaborativeAnnotations } from '@/components/blog/CollaborativeAnnotations';

export default function ArticlePage() {
  return (
    <CollaborativeAnnotations
      content="你的文章内容..."
      articleId="123"
      userId="user-456"
    />
  );
}
```

#### 高级用法

```tsx
<CollaborativeAnnotations
  content={post.content}
  articleId={post.id}
  userId={user.id}
  currentUser={{
    id: user.id,
    name: user.name,
    avatar: user.avatar,
    color: '#00f0ff',              // 用户颜色
  }}
  annotations={annotations}         // 现有注释
  showSidebar={true}                // 显示侧边栏
  onAnnotationAdd={(annotation) => {
    // 添加注释
    addAnnotation(annotation);
  }}
  onAnnotationUpdate={(id, updates) => {
    // 更新注释
    updateAnnotation(id, updates);
  }}
  onAnnotationDelete={(id) => {
    // 删除注释
    deleteAnnotation(id);
  }}
  onReplyAdd={(annotationId, reply) => {
    // 添加回复
    addReply(annotationId, reply);
  }}
  onLike={(annotationId, userId) => {
    // 点赞
    likeAnnotation(annotationId, userId);
  }}
/>
```

#### 使用场景
- 📚 协作文档编辑
- 📝 文章审阅
- 💬 内容讨论
- 🎓 教学批注

---

## 🎨 完整集成示例

### 文章详情页面

```tsx
'use client';

import { useState } from 'react';
import { ArticleSummaryAI } from '@/components/blog/ArticleSummaryAI';
import { ArticleVoiceReader } from '@/components/blog/ArticleVoiceReader';
import { ArticleVersionHistory } from '@/components/blog/ArticleVersionHistory';
import { CollaborativeAnnotations } from '@/components/blog/CollaborativeAnnotations';

export default function ArticleDetailPage({ post, user }) {
  const [annotations, setAnnotations] = useState(post.annotations || []);
  const [activeTab, setActiveTab] = useState('read');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 主内容区 */}
        <div className="lg:col-span-2 space-y-8">
          {/* 文章标题 */}
          <h1 className="text-4xl font-bold text-white">{post.title}</h1>

          {/* 文章元信息 */}
          <div className="flex items-center space-x-4 text-gray-400">
            <span>{post.author}</span>
            <span>•</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>

          {/* Tab 切换 */}
          <div className="flex space-x-2 border-b border-gray-700">
            <button
              onClick={() => setActiveTab('read')}
              className={`px-4 py-2 transition-colors ${
                activeTab === 'read'
                  ? 'text-cyber-cyan border-b-2 border-cyber-cyan'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              阅读
            </button>
            <button
              onClick={() => setActiveTab('annotate')}
              className={`px-4 py-2 transition-colors ${
                activeTab === 'annotate'
                  ? 'text-cyber-cyan border-b-2 border-cyber-cyan'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              批注
            </button>
          </div>

          {/* 阅读模式 */}
          {activeTab === 'read' && (
            <article className="prose prose-invert max-w-none">
              {post.content}
            </article>
          )}

          {/* 批注模式 */}
          {activeTab === 'annotate' && (
            <CollaborativeAnnotations
              content={post.content}
              articleId={post.id}
              userId={user.id}
              currentUser={user}
              annotations={annotations}
              onAnnotationAdd={(annotation) => {
                setAnnotations([...annotations, { ...annotation, id: Date.now().toString() }]);
              }}
              onAnnotationUpdate={(id, updates) => {
                setAnnotations(annotations.map(a =>
                  a.id === id ? { ...a, ...updates } : a
                ));
              }}
              onAnnotationDelete={(id) => {
                setAnnotations(annotations.filter(a => a.id !== id));
              }}
            />
          )}
        </div>

        {/* 侧边栏 */}
        <aside className="space-y-6">
          {/* AI 摘要 */}
          <ArticleSummaryAI
            content={post.content}
            title={post.title}
            length="medium"
          />

          {/* 语音朗读 */}
          <ArticleVoiceReader
            content={post.content}
            autoHighlight
          />

          {/* 版本历史 */}
          {post.versions && post.versions.length > 0 && (
            <ArticleVersionHistory
              articleId={post.id}
              versions={post.versions}
              onRestore={(version) => {
                console.log('恢复版本:', version);
              }}
            />
          )}
        </aside>
      </div>
    </div>
  );
}
```

---

## 🔧 类型定义

### ArticleSummary 类型

```typescript
import type { ArticleSummary } from '@/components/blog/ArticleSummaryAI';

interface ArticleSummary {
  summary: string;                   // 摘要内容
  keyPoints: Array<{
    id: string;
    text: string;
    importance: number;              // 0-1
  }>;
  readingTime: number;               // 阅读时间（分钟）
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}
```

### Annotation 类型

```typescript
import type { Annotation } from '@/components/blog/CollaborativeAnnotations';

interface Annotation {
  id: string;
  articleId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userColor?: string;
  content: string;
  position: {
    start: number;
    end: number;
    text: string;
  };
  replies: Array<{
    id: string;
    userId: string;
    userName: string;
    content: string;
    createdAt: Date;
    likes: number;
    likedBy?: string[];
  }>;
  likes: number;
  likedBy?: string[];
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  isResolved?: boolean;
}
```

### ArticleVersion 类型

```typescript
import type { ArticleVersion } from '@/components/blog/ArticleVersionHistory';

interface ArticleVersion {
  id: string;
  version: number;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  changes?: {
    added?: number;
    removed?: number;
    modified?: number;
  };
  tags?: string[];
  description?: string;
}
```

---

## 🎯 最佳实践

### 1. 性能优化

```tsx
import { memo } from 'react';

// 使用 memo 优化重渲染
const OptimizedArticleSummary = memo(ArticleSummaryAI);

// 懒加载大型组件
const CollaborativeAnnotations = dynamic(
  () => import('@/components/blog/CollaborativeAnnotations'),
  { ssr: false }
);
```

### 2. 错误处理

```tsx
<ArticleSummaryAI
  content={post.content || ''}
  onError={(error) => {
    console.error('摘要生成失败:', error);
    // 显示错误提示
  }}
/>
```

### 3. 加载状态

```tsx
const [isLoading, setIsLoading] = useState(true);

{isLoading ? (
  <div>加载中...</div>
) : (
  <ArticleSummaryAI content={post.content} />
)}
```

---

## 🐛 故障排除

### 问题 1: 样式不正确

**解决方案**: 确保 Tailwind CSS 配置正确

```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 问题 2: 动画卡顿

**解决方案**: 检查 Framer Motion 是否正确安装

```bash
npm install framer-motion
```

### 问题 3: 类型错误

**解决方案**: 确保 TypeScript 版本 >= 5.0

```bash
npm install typescript@latest
```

---

## 📚 相关文档

- [完整开发报告](./DEVELOPMENT_TASKS_DELIVERY_REPORT_2026-03-07.md)
- [项目 README](./README.md)
- [组件文档](./frontend/docs/)
- [API 文档](./API_DOCUMENTATION.md)

---

## 💡 提示和技巧

### 1. 自定义主题

所有组件都支持 `className` 属性，可以轻松自定义样式：

```tsx
<ArticleSummaryAI
  content={post.content}
  className="my-custom-class"
/>
```

### 2. 事件监听

利用回调函数实现业务逻辑：

```tsx
<ArticleSummaryAI
  onSummaryGenerated={(summary) => {
    // 保存到数据库
    saveSummary(summary);
    // 发送分析事件
    trackEvent('summary_generated');
  }}
/>
```

### 3. 组合使用

多个组件可以无缝组合使用：

```tsx
<div>
  <ArticleSummaryAI content={content} />
  <ArticleVoiceReader content={content} />
  <ArticleVersionHistory versions={versions} />
</div>
```

---

**祝您使用愉快！** 🎉

如有问题，请查看文档或提交 Issue。
