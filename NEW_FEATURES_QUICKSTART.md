# 🚀 Phase 3 新功能快速开始指南

**更新日期**: 2026-03-03

---

## ✨ 新增功能概览

本次更新为 CyberPress Platform 带来了以下新功能：

- 👥 **用户关注系统** - 关注用户、查看粉丝
- 🔔 **通知系统** - 实时通知、偏好设置
- ✍️ **Markdown 编辑器** - 实时预览、语法高亮
- 🎨 **增强 UI 组件** - 阅读进度、图片灯箱等

---

## 📦 快速使用

### 1. 用户关注功能

#### 基础使用
```tsx
import { FollowButton } from '@/components/social';

<FollowButton
  userId="user-123"
  username="张三"
  isFollowing={false}
  onFollowChange={(isFollowing) => console.log('已关注:', isFollowing)}
/>
```

#### 显示统计
```tsx
import { FollowStatsCard } from '@/components/social';

<FollowStatsCard
  userId="user-123"
  variant="default"
  onStatClick={(type) => {
    // type: 'followers' | 'following'
    console.log('点击了:', type);
  }}
/>
```

#### 显示粉丝列表
```tsx
import { FollowersList } from '@/components/social';

<FollowersList
  userId="user-123"
  type="followers"  // 或 'following'
/>
```

#### 使用 Hook
```tsx
import { useFollow } from '@/hooks/custom-hooks';

function UserProfile({ userId }) {
  const {
    isFollowing,
    isLoading,
    stats,
    toggleFollow,
  } = useFollow({ userId, autoLoadStats: true });

  return (
    <div>
      <button onClick={toggleFollow}>
        {isFollowing ? '取消关注' : '关注'}
      </button>
      <p>粉丝: {stats?.followerCount}</p>
    </div>
  );
}
```

---

### 2. 通知系统

#### 通知下拉组件
```tsx
import { NotificationDropdown } from '@/components/notification';

// 在导航栏中使用
function Navbar() {
  return (
    <div>
      {/* 其他导航项 */}
      <NotificationDropdown />
    </div>
  );
}
```

#### 通知设置页面
```tsx
import { NotificationSettings } from '@/components/notification';

function SettingsPage() {
  return (
    <div className="container">
      <h1>通知设置</h1>
      <NotificationSettings />
    </div>
  );
}
```

#### 使用 Hook
```tsx
import { useNotifications } from '@/hooks/custom-hooks';

function NotificationCenter() {
  const {
    notifications,
    stats,
    isLoading,
    markAsRead,
    markAllAsRead,
  } = useNotifications({ pollInterval: 30000 });

  return (
    <div>
      <h2>通知 ({stats.unread} 未读)</h2>
      <button onClick={markAllAsRead}>全部已读</button>
      {notifications.map(notification => (
        <div key={notification.id}>
          {notification.title}
        </div>
      ))}
    </div>
  );
}
```

---

### 3. Markdown 编辑器

#### 基础编辑器
```tsx
import { MarkdownEditor } from '@/components/markdown-editor';

function PostEditor() {
  const [content, setContent] = useState('');

  return (
    <MarkdownEditor
      value={content}
      onChange={setContent}
      placeholder="开始写作..."
      minHeight="400px"
      showPreview
    />
  );
}
```

#### 只读模式
```tsx
<MarkdownEditor
  value={markdownContent}
  onChange={() => {}}
  showPreview
  readOnly
/>
```

#### 代码块组件
```tsx
import { CodeBlock } from '@/components/ui';

function CodeExample() {
  return (
    <CodeBlock
      code="console.log('Hello, World!');"
      language="javascript"
      title="example.js"
      showLineNumbers
    />
  );
}
```

---

### 4. 增强 UI 组件

#### 阅读进度条
```tsx
import { ReadingProgressBar } from '@/components/ui';

// 在文章页面顶部
function ArticlePage() {
  return (
    <>
      <ReadingProgressBar
        color="var(--cyber-primary)"
        position="top"
        showPercentage
      />
      <article>
        {/* 文章内容 */}
      </article>
    </>
  );
}
```

#### 图片灯箱
```tsx
import { ImageLightbox } from '@/components/ui';

<ImageLightbox
  src="/path/to/image.jpg"
  alt="图片描述"
>
  <img src="/path/to/image.jpg" alt="缩略图" className="rounded-lg" />
</ImageLightbox>
```

#### 文章目录
```tsx
import { TableOfContents } from '@/components/ui';

function ArticleLayout() {
  return (
    <div className="flex gap-8">
      <aside className="w-64">
        <TableOfContents offset={100} />
      </aside>
      <main className="flex-1">
        <article>
          {/* 文章内容，会自动提取 h1-h6 标题 */}
        </article>
      </main>
    </div>
  );
}
```

#### 复制按钮
```tsx
import { CopyButton } from '@/components/ui';

<CopyButton
  text="要复制的文本内容"
  variant="button"
  label="复制代码"
  size="md"
/>
```

---

## 🎯 常用 Hooks

### LocalStorage Hook
```tsx
import { useLocalStorage } from '@/hooks/custom-hooks';

function Settings() {
  const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'dark');

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      切换主题
    </button>
  );
}
```

### 阅读进度 Hook
```tsx
import { useReadingProgress } from '@/hooks/custom-hooks';

function ProgressBar() {
  const { progress, isActive } = useReadingProgress();

  return (
    <div className="h-1 bg-gray-200">
      <div
        className="h-full bg-blue-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
```

### 防抖 Hook
```tsx
import { useDebounce } from '@/hooks/custom-hooks';

function SearchInput() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    // 使用 debouncedSearchTerm 执行搜索
    performSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
}
```

### 点击外部 Hook
```tsx
import { useClickOutside } from '@/hooks/custom-hooks';

function Dropdown() {
  const [isOpen, setIsOpen] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setIsOpen(false), isOpen);

  return (
    <div ref={ref}>
      {isOpen && <DropdownMenu />}
    </div>
  );
}
```

---

## 📚 演示页面

访问以下页面查看组件演示：

- `/examples/social-demo` - 社交功能演示
- `/examples/notification-demo` - 通知功能演示
- `/examples/editor-demo` - 编辑器功能演示

---

## 🎨 样式变体

### 按钮变体
```tsx
<FollowButton variant="default" />  // 主要样式
<FollowButton variant="outline" />  // 轮廓样式
<FollowButton variant="ghost" />    // 幽灵样式
```

### 尺寸变体
```tsx
<FollowButton size="sm" />   // 小号
<FollowButton size="md" />   // 中号（默认）
<FollowButton size="lg" />   // 大号
```

### 统计卡片变体
```tsx
<FollowStatsCard variant="default" />  // 完整卡片
<FollowStatsCard variant="compact" />  // 紧凑样式
<FollowStatsCard variant="minimal" />  // 最小样式
```

---

## 🔧 配置选项

### Markdown 编辑器
```tsx
<MarkdownEditor
  value={content}
  onChange={setContent}
  placeholder="开始输入..."
  minHeight="300px"           // 最小高度
  maxHeight="600px"           // 最大高度
  showPreview={true}          // 显示预览
  readOnly={false}            // 只读模式
/>
```

### 通知下拉
```tsx
<NotificationDropdown
  trigger={<CustomTrigger />}  // 自定义触发器
/>
```

### 阅读进度条
```tsx
<ReadingProgressBar
  color="#00ff00"              // 进度条颜色
  height={4}                    // 高度（像素）
  position="top"                // 位置：top | bottom
  showPercentage={true}         // 显示百分比
/>
```

---

## 🌍 国际化

组件支持中文，日期格式化使用 `date-fns` 的中文 locale：

```tsx
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

formatDistanceToNow(new Date(), { addSuffix: true, locale: zhCN });
// "3秒前"
```

---

## ♿ 无障碍支持

所有组件遵循 WCAG 2.1 标准：

- ✅ 键盘导航支持
- ✅ ARIA 标签完整
- ✅ 焦点管理
- ✅ 屏幕阅读器友好

---

## 🐛 问题排查

### 样式不生效
确保 Tailwind CSS 配置正确：
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './frontend/components/**/*.{js,ts,jsx,tsx}',
    './frontend/app/**/*.{js,ts,jsx,tsx}',
  ],
  // ...
}
```

### TypeScript 错误
确保类型定义文件已导入：
```tsx
import type { FollowStats, Notification } from '@/types';
```

### Hook 规则警告
确保只在组件顶层调用 Hook：
```tsx
// ✅ 正确
function Component() {
  const hook = useHook();
  return <div />;
}

// ❌ 错误
function Component() {
  if (condition) {
    const hook = useHook(); // 不要在条件语句中使用
  }
  return <div />;
}
```

---

## 📞 获取帮助

- 📖 查看完整文档: `NEW_COMPONENTS_CREATED_20260303.md`
- 🎯 查看演示页面: `/examples/*`
- 🐛 报告问题: GitHub Issues
- 💬 社区讨论: Discord

---

## 🎉 开始使用

现在就开始在你的项目中使用这些新组件吧！

```bash
# 访问演示页面
npm run dev
# 打开 http://localhost:3000/examples/social-demo
```

祝你使用愉快！🚀

---

**最后更新**: 2026-03-03
**版本**: v1.3.0
