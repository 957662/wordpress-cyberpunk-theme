# 新组件快速参考指南

## 🚀 快速开始

### 导入组件

```typescript
import {
  // 阅读进度
  ReadingProgress,
  ReadingProgressRing,
  
  // 代码分享
  CodeShare,
  CodeShareModal,
  
  // 文章摘要
  ArticleSummary,
  
  // 协作编辑
  CollaborativeEditing,
  
  // AI 助手
  AIAssistant,
  
  // 图标
  CyberIcon,
  IconGallery,
} from '@/components';
```

---

## 📖 阅读进度组件

### ReadingProgress - 线性进度条

```tsx
<ReadingProgress 
  height={3}
  position="top"
  showPercentage={true}
/>
```

**Props:**
- `height?: number` - 进度条高度（默认: 3px）
- `position?: 'top' | 'bottom'` - 位置
- `showPercentage?: boolean` - 显示百分比
- `color?: string` - 自定义颜色

### ReadingProgressRing - 环形指示器

```tsx
<ReadingProgressRing 
  size={120}
  strokeWidth={8}
  showIcon={true}
/>
```

**Props:**
- `size?: number` - 尺寸（默认: 120px）
- `strokeWidth?: number` - 描边宽度
- `showIcon?: boolean` - 显示图标

**路由:** `/examples/reading-progress`

---

## 💻 代码分享组件

### CodeShare - 代码展示

```tsx
<CodeShare
  code={codeString}
  language="typescript"
  filename="example.tsx"
  showFilename={true}
  theme="dark"
  showLineNumbers={true}
/>
```

**Props:**
- `code: string` - 代码内容
- `language?: string` - 编程语言
- `filename?: string` - 文件名
- `showFilename?: boolean` - 显示文件名
- `theme?: 'dark' | 'synthwave'` - 主题
- `showLineNumbers?: boolean` - 显示行号

**支持语言:** typescript, javascript, python, java, cpp, go, rust, html, css, json, markdown 等

### CodeShareModal - 代码分享模态框

```tsx
const [isOpen, setIsOpen] = useState(false);

<CodeShareModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  initialCode={codeString}
  initialLanguage="typescript"
/>
```

**路由:** `/examples/code-share`

---

## 📝 文章摘要组件

### ArticleSummary - AI 摘要

```tsx
<ArticleSummary
  content={articleContent}
  defaultExpanded={false}
/>
```

**Props:**
- `content: string` - 文章内容
- `defaultExpanded?: boolean` - 默认展开
- `className?: string` - 自定义样式

**功能:**
- AI 自动生成摘要
- 关键点提取
- 主要收获总结
- 一键复制

**路由:** `/examples/article-summary`

---

## 👥 协作编辑组件

### CollaborativeEditing - 实时协作

```tsx
<CollaborativeEditing
  content={documentContent}
  currentUser={currentUser}
  collaborators={users}
  readOnly={false}
  autoSaveInterval={30000}
  onChange={(content) => console.log(content)}
/>
```

**Props:**
- `content: string` - 文档内容
- `currentUser: User` - 当前用户
- `collaborators?: User[]` - 协作者列表
- `readOnly?: boolean` - 只读模式
- `autoSaveInterval?: number` - 自动保存间隔
- `onChange?: (content) => void` - 变更回调

**User 接口:**
```typescript
interface User {
  id: string;
  name: string;
  color: string;
  isOnline: boolean;
}
```

**路由:** `/examples/collaborative`

---

## 🤖 AI 助手组件

### AIAssistant - 智能助手

```tsx
<AIAssistant
  defaultOpen={false}
  welcomeMessage="你好！我是 AI 助手"
  suggestions={[
    '如何优化 React 性能？',
    '解释 TypeScript 泛型',
  ]}
/>
```

**Props:**
- `defaultOpen?: boolean` - 默认打开
- `welcomeMessage?: string` - 欢迎消息
- `suggestions?: string[]` - 建议问题

**功能:**
- 智能对话
- 快捷操作
- 建议问题
- 实时打字效果
- 最小化/展开

**路由:** `/examples/ai-assistant`

---

## 🎨 图标组件

### CyberIcon - 赛博图标

```tsx
import { Star } from 'lucide-react';

<CyberIcon
  icon={Star}
  size={32}
  color="cyan"
  glow={true}
  glowIntensity="high"
  spin={false}
  pulse={false}
/>
```

**Props:**
- `icon: LucideIcon` - Lucide 图标
- `size?: number` - 尺寸（默认: 24）
- `color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green'` - 颜色
- `customColor?: string` - 自定义颜色
- `glow?: boolean` - 发光效果
- `glowIntensity?: 'low' | 'medium' | 'high'` - 发光强度
- `spin?: boolean` - 旋转动画
- `pulse?: boolean` - 脉冲动画
- `bounce?: boolean` - 弹跳动画

**色彩选项:**
- Cyan (青色) - `#00f0ff`
- Purple (紫色) - `#9d00ff`
- Pink (粉色) - `#ff0080`
- Yellow (黄色) - `#f0ff00`
- Green (绿色) - `#4ade80`

### IconGallery - 图标画廊

```tsx
<IconGallery />
```

展示所有可用的图标，支持搜索、颜色选择和复制代码。

**路由:** `/examples/icons`

---

## 🎯 使用示例

### 博客文章页面

```tsx
import { ReadingProgress, ArticleSummary } from '@/components';

export default function BlogPost({ content }) {
  return (
    <article>
      {/* 顶部进度条 */}
      <ReadingProgress showPercentage />
      
      {/* 文章内容 */}
      <div className="prose">
        {content}
      </div>
      
      {/* 文章摘要 */}
      <ArticleSummary content={content} />
      
      {/* 环形返回顶部 */}
      <ReadingProgressRing />
    </article>
  );
}
```

### 代码教程页面

```tsx
import { CodeShare } from '@/components';

export default function CodeTutorial() {
  const exampleCode = `
    // 你的代码示例
    console.log('Hello, CyberPress!');
  `;
  
  return (
    <CodeShare
      code={exampleCode}
      language="typescript"
      filename="example.ts"
      showFilename
    />
  );
}
```

### 添加 AI 助手

```tsx
import { AIAssistant } from '@/components';

export default function Layout({ children }) {
  return (
    <>
      {children}
      
      {/* 全局 AI 助手 */}
      <AIAssistant
        defaultOpen={false}
        welcomeMessage="需要帮助吗？"
      />
    </>
  );
}
```

---

## 📱 响应式设计

所有组件都支持响应式设计，自动适配不同屏幕尺寸：

- 移动端: < 768px
- 平板: 768px - 1024px
- 桌面: > 1024px

---

## 🎨 主题定制

组件使用 Tailwind CSS 的赛博朋克主题：

```css
/* 在 globals.css 中 */
:root {
  --cyber-cyan: #00f0ff;
  --cyber-purple: #9d00ff;
  --cyber-pink: #ff0080;
  --cyber-yellow: #f0ff00;
  --cyber-dark: #0a0a0f;
  --cyber-border: rgba(0, 240, 255, 0.2);
}
```

---

## 🔧 故障排除

### 组件未找到

确保已更新 `components/index.ts`:

```typescript
export * from './reading-progress';
export * from './code-share';
export * from './article-summary';
export * from './collaborative';
export * from './ai';
export * from './icons';
```

### TypeScript 错误

确保安装了所有依赖：

```bash
npm install framer-motion react-syntax-highlighter lucide-react
```

### 样式问题

确保 Tailwind CSS 配置包含赛博朋克主题：

```javascript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        'cyber-cyan': '#00f0ff',
        'cyber-purple': '#9d00ff',
        'cyber-pink': '#ff0080',
        'cyber-yellow': '#f0ff00',
        'cyber-dark': '#0a0a0f',
      },
    },
  },
};
```

---

## 📚 更多资源

- 示例页面: `/examples/*`
- 组件文档: `NEW_COMPONENTS_CREATED_2026_03_03_FINAL.md`
- 文件清单: `FILES_CREATED_THIS_SESSION.txt`

---

**创建时间:** 2026-03-03
**版本:** 1.0.0
**框架:** Next.js 14 + React 18 + TypeScript
