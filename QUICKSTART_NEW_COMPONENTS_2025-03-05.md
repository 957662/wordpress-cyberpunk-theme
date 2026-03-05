# CyberPress 新组件快速使用指南

## 📦 组件清单

本次共创建 **9 个生产就绪的组件**，涵盖加载、性能、SEO、PWA、主题、功能和工具等多个方面。

| 组件 | 文件路径 | 功能描述 |
|------|---------|----------|
| CyberSpinner | `loading/CyberSpinner.tsx` | 5种赛博朋克风格加载器 |
| ScanLineLoader | `loading/ScanLineLoader.tsx` | 扫描线、全息投影加载效果 |
| CoreWebVitals | `performance/CoreWebVitals.tsx` | Web Vitals 性能监控 |
| MetaTags | `seo/MetaTags.tsx` | SEO 元标签和结构化数据 |
| PWAInstallPrompt | `pwa/InstallPrompt.tsx` | PWA 安装提示（支持 iOS） |
| ThemeCustomizer | `theme/ThemeCustomizer.tsx` | 4种预设主题 + 自定义颜色 |
| NotificationCenter | `features/NotificationCenter.tsx` | 通知中心系统 |
| QuickActions | `features/QuickActions.tsx` | 快捷操作 + 命令面板 |
| ErrorBoundary | `utility/ErrorBoundary.tsx` | 错误边界和处理 |

---

## 🚀 快速开始

### 1️⃣ 加载组件

```tsx
import { 
  CyberSpinner, 
  PulseLoader, 
  GlitchTextLoader,
  MatrixRainLoader,
  ProgressBar 
} from '@/components/loading';

// 基础用法
<CyberSpinner size="md" color="cyan" />

// 脉冲加载器
<PulseLoader size="lg" color="purple" />

// 故障文字加载
<GlitchTextLoader text="LOADING" />

// 矩阵雨效果
<MatrixRainLoader width={200} height={150} />

// 进度条
<ProgressBar 
  progress={75} 
  color="cyan" 
  height={8} 
  showLabel 
/>
```

**可用选项：**
- `size`: 'sm' | 'md' | 'lg'
- `color`: 'cyan' | 'purple' | 'pink' | 'green'
- `className`: 自定义样式类
- `progress`: 进度百分比 (0-100)

---

### 2️⃣ 性能监控

```tsx
import { PerformanceMonitor, CoreWebVitals } from '@/components/performance';

// 在根布局中使用
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        
        {/* 性能监控面板 */}
        <PerformanceMonitor 
          position="bottom-right"
          showDetails={true}
          updateInterval={1000}
        />
        
        {/* Web Vitals 指标 */}
        <CoreWebVitals 
          showThreshold={true}
        />
      </body>
    </html>
  );
}
```

**监控指标：**
- FPS（帧率）
- 内存使用
- LCP（最大内容绘制）
- FID（首次输入延迟）
- CLS（累积布局偏移）

---

### 3️⃣ SEO 优化

```tsx
import { 
  MetaTags, 
  generateArticleStructuredData,
  generateBreadcrumbStructuredData 
} from '@/components/seo';

export default function ArticlePage({ article }) {
  // 生成文章结构化数据
  const structuredData = generateArticleStructuredData({
    title: article.title,
    description: article.excerpt,
    publishDate: article.publishedAt,
    modifiedDate: article.updatedAt,
    author: {
      name: article.author.name,
      url: article.author.url
    },
    image: article.coverImage,
    url: `https://cyberpress.com/articles/${article.slug}`,
    publisher: {
      name: 'CyberPress',
      logo: 'https://cyberpress.com/logo.png'
    }
  });

  // 生成面包屑结构化数据
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Home', url: 'https://cyberpress.com' },
    { name: 'Articles', url: 'https://cyberpress.com/articles' },
    { name: article.title, url: `https://cyberpress.com/articles/${article.slug}` }
  ]);

  return (
    <>
      <MetaTags
        title={article.title}
        description={article.excerpt}
        keywords={article.tags.join(', ')}
        ogImage={article.coverImage}
        ogType="article"
        twitterCard="summary_large_image"
        canonical={`https://cyberpress.com/articles/${article.slug}`}
        noIndex={false}
        structuredData={structuredData}
        alternateLanguages={{
          'en': `https://cyberpress.com/en/articles/${article.slug}`,
          'zh': `https://cyberpress.com/zh/articles/${article.slug}`
        }}
      />
      <article>{/* 文章内容 */}</article>
    </>
  );
}
```

---

### 4️⃣ PWA 安装提示

```tsx
import { PWAInstallPrompt, IOSInstallInstructions } from '@/components/pwa';

export default function App() {
  return (
    <>
      <PWAInstallPrompt />
      <IOSInstallInstructions />
    </>
  );
}
```

**特性：**
- 自动检测安装状态
- Chrome/Edge 原生安装提示
- iOS 专用安装说明
- 记住用户选择

---

### 5️⃣ 主题自定义

```tsx
import { ThemeCustomizer, useCustomTheme } from '@/components/theme';

function App() {
  return (
    <>
      <ThemeCustomizer />
      {/* 应用内容 */}
    </>
  );
}

// 在组件中使用自定义主题
function MyComponent() {
  const colors = useCustomTheme();
  
  return (
    <div style={{ 
      color: colors.text,
      backgroundColor: colors.background 
    }}>
      内容
    </div>
  );
}
```

**预设主题：**
1. Cyberpunk（赛博朋克）- 默认
2. Neon Nights（霓虹之夜）
3. Matrix（矩阵）
4. Sunset（日落）

---

### 6️⃣ 通知中心

```tsx
import { NotificationCenter } from '@/components/features';

function Header() {
  return (
    <header className="flex items-center justify-between p-4">
      <h1>CyberPress</h1>
      <NotificationCenter />
    </header>
  );
}
```

**通知类型：**
- `info` - 信息通知
- `success` - 成功通知
- `warning` - 警告通知
- `error` - 错误通知

---

### 7️⃣ 快捷操作

```tsx
import { QuickActions, CommandPalette } from '@/components/features';

const actions = [
  {
    id: 'new-post',
    label: 'New Post',
    icon: <PlusIcon />,
    shortcut: '⌘N',
    onClick: () => router.push('/editor/new')
  },
  {
    id: 'search',
    label: 'Search',
    icon: <SearchIcon />,
    shortcut: '⌘K',
    onClick: () => alert('Search')
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <SettingsIcon />,
    onClick: () => router.push('/settings')
  }
];

function App() {
  return (
    <>
      <QuickActions 
        actions={actions}
        position="bottom-right"
      />
      
      <CommandPalette actions={actions} />
    </>
  );
}
```

---

### 8️⃣ 错误边界

```tsx
import { ErrorBoundary, useErrorHandler } from '@/components/utility';

function App() {
  return (
    <ErrorBoundary>
      <YourComponent />
    </ErrorBoundary>
  );
}

// 在组件中使用错误处理
function MyComponent() {
  const handleError = useErrorHandler();
  
  const fetchData = async () => {
    try {
      const data = await fetch('/api/data');
      // ...
    } catch (error) {
      handleError(error);
    }
  };
}
```

---

## 🎨 完整示例

将所有组件组合使用：

```tsx
import { 
  ErrorBoundary, 
  ThemeCustomizer 
} from '@/components';
import { 
  PerformanceMonitor, 
  CoreWebVitals 
} from '@/components/performance';
import { 
  NotificationCenter, 
  QuickActions 
} from '@/components/features';
import { PWAInstallPrompt } from '@/components/pwa';

const quickActions = [
  {
    id: 'home',
    label: 'Home',
    icon: <HomeIcon />,
    onClick: () => router.push('/')
  },
  {
    id: 'search',
    label: 'Search',
    icon: <SearchIcon />,
    shortcut: '⌘K',
    onClick: () => alert('Search')
  }
];

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <ThemeCustomizer />
          <PWAInstallPrompt />
          
          <header>
            <NotificationCenter />
          </header>
          
          <main>{children}</main>
          
          <QuickActions 
            actions={quickActions}
            position="bottom-right"
          />
          
          <PerformanceMonitor />
          <CoreWebVitals />
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

---

## 📝 TypeScript 类型

所有组件都包含完整的 TypeScript 类型定义：

```typescript
// 示例：MetaTags 组件类型
interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
  canonical?: string;
  noIndex?: boolean;
  structuredData?: Record<string, any>;
  alternateLanguages?: Record<string, string>;
}
```

---

## 🎯 最佳实践

1. **按需导入** - 只导入需要的组件
2. **性能优先** - 使用 `React.memo` 优化重渲染
3. **错误处理** - 使用 ErrorBoundary 包裹关键组件
4. **主题一致** - 使用 ThemeCustomizer 保持视觉一致性
5. **监控优化** - 使用 PerformanceMonitor 跟踪性能

---

## 🔧 自定义样式

所有组件都支持通过 `className` prop 自定义样式：

```tsx
<CyberSpinner 
  className="my-custom-spinner"
  style={{ 
    '--spinner-size': '48px',
    '--spinner-color': '#00f0ff' 
  } as React.CSSProperties}
/>
```

---

## 📚 相关文档

- [项目 README](README.md)
- [组件详细说明](COMPONENTS.md)
- [开发指南](DEVELOPMENT.md)
- [新组件创建总结](NEW_COMPONENTS_CREATED_2025-03-05.md)

---

## 🆘 获取帮助

如有问题，请：
1. 查看组件源码中的注释
2. 阅读 TypeScript 类型定义
3. 查看项目示例页面

---

**创建时间**: 2025-03-05  
**组件总数**: 9 个  
**代码行数**: ~2,000 行  
**状态**: ✅ 生产就绪

🎉 享受使用这些高质量的 CyberPress 组件！
