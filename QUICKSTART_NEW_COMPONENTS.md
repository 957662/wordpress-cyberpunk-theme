# 🚀 新组件快速开始指南

欢迎使用全新开发的高级组件库!本指南将帮助你快速上手。

## 📦 快速安装

所有组件已经集成到项目中,无需额外安装。只需按照以下步骤导入即可。

## 1️⃣ 实时搜索建议组件

### 基础用法

```tsx
'use client'

import { RealtimeSearchSuggestions } from '@/components/new-components'

export default function MyPage() {
  return (
    <div>
      <RealtimeSearchSuggestions
        placeholder="搜索文章、标签、作者..."
        onSearch={(query) => {
          console.log('用户搜索:', query)
          // 执行搜索逻辑
        }}
        onSelect={(item) => {
          console.log('用户选择了:', item)
          // 跳转到详情页
        }}
      />
    </div>
  )
}
```

### 高级配置

```tsx
<RealtimeSearchSuggestions
  placeholder="搜索..."
  showHistory={true}        // 显示搜索历史
  showTrending={true}       // 显示热门搜索
  maxSuggestions={10}       // 最多显示10条建议
  onSearch={(query) => {
    // 处理搜索
  }}
  onSelect={(item) => {
    // 处理选择
  }}
/>
```

## 2️⃣ 阅读历史组件

### 基础用法

```tsx
import { ReadingHistory } from '@/components/new-components'

export default function MyPage() {
  return (
    <ReadingHistory
      limit={20}              // 最多显示20条
      showFilters={true}      // 显示过滤器
      showSearch={true}       // 显示搜索框
    />
  )
}
```

## 3️⃣ 高级数据可视化组件

### 基础用法

```tsx
import { AdvancedDataChart } from '@/components/new-components'

export default function MyPage() {
  const chartData = {
    datasets: [
      {
        id: 'views',
        name: '浏览量',
        color: '#00f0ff',
        data: [
          { label: '周一', value: 1200 },
          { label: '周二', value: 1900 },
          { label: '周三', value: 1500 },
        ],
      },
    ],
  }

  return (
    <AdvancedDataChart
      title="本周数据"
      datasets={chartData.datasets}
      chartType="line"
      height={300}
    />
  )
}
```

## 4️⃣ 社交分享组件

### 卡片模式

```tsx
import { EnhancedSocialShare } from '@/components/new-components'

<EnhancedSocialShare
  title="文章标题"
  description="文章描述"
  url="https://example.com/post/1"
  tags={['React', 'NextJS']}
  variant="card"
/>
```

## 5️⃣ 代码沙盒组件

### 基础用法

```tsx
import { CodeSandbox } from '@/components/new-components'

export default function MyPage() {
  const exampleCode = `console.log('Hello, World!')`

  return (
    <CodeSandbox
      initialCode={exampleCode}
      language="javascript"
      showConsole={true}
    />
  )
}
```

## 🎨 常见使用场景

### 场景1: 博客页面添加搜索

```tsx
// app/blog/page.tsx
import { RealtimeSearchSuggestions } from '@/components/new-components'

export default function BlogPage() {
  return (
    <div>
      <RealtimeSearchSuggestions
        placeholder="搜索文章..."
        onSearch={(query) => {
          router.push(\`/search?q=\${query}\`)
        }}
      />
    </div>
  )
}
```

### 场景2: 文章详情页添加分享

```tsx
// app/blog/[slug]/page.tsx
import { EnhancedSocialShare } from '@/components/new-components'

export default function PostPage({ post }) {
  return (
    <article>
      <h1>{post.title}</h1>
      <EnhancedSocialShare
        title={post.title}
        url={\`https://example.com/blog/\${post.slug}\`}
        variant="card"
      />
    </article>
  )
}
```

---

**祝你使用愉快!** 🎉
