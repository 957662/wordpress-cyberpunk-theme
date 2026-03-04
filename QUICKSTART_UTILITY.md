# 🚀 实用组件快速开始指南

> CyberPress Platform - Utility Components Quick Start
> 创建日期: 2026-03-05

---

## ✨ 恭喜！您已成功创建 8 个实用组件

本次创建的组件包括：
- 📋 FAQ（常见问题）
- 🧭 Breadcrumb（面包屑导航）
- 🔝 Back to Top（回到顶部）
- 🌍 Language Switcher（语言切换器）
- 🎨 Theme Switcher（主题切换器）
- ☁️ Tag Cloud（标签云）
- 📤 Share Buttons（分享按钮）
- 📄 Pagination（分页）

---

## 🎯 快速开始（3 步）

### 步骤 1: 启动开发服务器

```bash
cd frontend
npm run dev
```

### 步骤 2: 访问演示页面

打开浏览器访问：
```
http://localhost:3000/showcase/utility-components
```

### 步骤 3: 复制代码到您的项目

从演示页面中复制您需要的组件代码。

---

## 📦 导入方式

### 方式一：批量导入（推荐）

```tsx
import {
  FAQ,
  Breadcrumb,
  BackToTop,
  LanguageSwitcher,
  ThemeSwitcher,
  TagCloud,
  ShareButtons,
  Pagination,
} from '@/components/index-new-components';
```

### 方式二：单独导入

```tsx
import { FAQ } from '@/components/ui/faq';
import { Breadcrumb } from '@/components/ui/breadcrumb';
// ... 其他组件
```

---

## 💡 使用示例

### 1. FAQ 组件

```tsx
import { FAQ, defaultFAQItems } from '@/components/index-new-components';

function MyFAQ() {
  return (
    <FAQ
      items={defaultFAQItems}
      variant="neon"
      color="cyan"
      allowMultiple={false}
    />
  );
}
```

### 2. 面包屑导航

```tsx
import { Breadcrumb } from '@/components/index-new-components';

function MyPage() {
  return (
    <>
      <Breadcrumb color="cyan" variant="minimal" />
      {/* 页面内容 */}
    </>
  );
}
```

### 3. 回到顶部按钮

```tsx
import { BackToTop } from '@/components/index-new-components';

function Layout({ children }) {
  return (
    <>
      {children}
      <BackToTop threshold={300} color="cyan" position="bottom-right" />
    </>
  );
}
```

### 4. 语言切换器

```tsx
import { LanguageSwitcher, defaultLanguages } from '@/components/index-new-components';

function LanguageSelector() {
  const [lang, setLang] = useState('zh-CN');

  return (
    <LanguageSwitcher
      languages={defaultLanguages}
      currentLanguage={lang}
      onLanguageChange={setLang}
      displayType="dropdown"
      showFlags
    />
  );
}
```

### 5. 分享按钮

```tsx
import { ShareButtons, platformPresets } from '@/components/index-new-components';

function ShareMyContent() {
  return (
    <ShareButtons
      url="https://yoursite.com/page"
      title="页面标题"
      platforms={platformPresets.social}
      layout="horizontal"
      color="cyan"
    />
  );
}
```

### 6. 分页组件

```tsx
import { Pagination } from '@/components/index-new-components';

function MyList() {
  const [page, setPage] = useState(1);

  return (
    <>
      {/* 内容列表 */}
      <Pagination
        currentPage={page}
        totalPages={10}
        onPageChange={setPage}
        color="cyan"
      />
    </>
  );
}
```

---

## 🎨 自定义样式

所有组件都支持以下自定义选项：

### 颜色主题

```tsx
<FAQ color="cyan" />      // 霓虹青（默认）
<FAQ color="purple" />    // 赛博紫
<FAQ color="pink" />      // 激光粉
<FAQ color="green" />     // 赛博绿
```

### 视觉变体

```tsx
<Breadcrumb variant="neon" />          // 霓虹风格（边框发光）
<Breadcrumb variant="holographic" />   // 全息风格（渐变背景）
<Breadcrumb variant="minimal" />       // 简约风格（低调设计）
```

### 尺寸规格

```tsx
<ShareButtons size="sm" />   // 小尺寸
<ShareButtons size="md" />   // 中等尺寸（默认）
<ShareButtons size="lg" />   // 大尺寸
```

---

## 📚 完整文档

查看详细的组件文档：
```bash
cat UTILITY_COMPONENTS_SUMMARY.md
```

---

## 🧪 测试组件

### 单独测试某个组件

创建一个测试页面 `app/test/components.tsx`：

```tsx
'use client';

import { FAQ, defaultFAQItems } from '@/components/index-new-components';

export default function ComponentTest() {
  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">FAQ 组件测试</h1>
      <FAQ items={defaultFAQItems} />
    </div>
  );
}
```

访问：`http://localhost:3000/test/components`

---

## 🔧 常见问题

### Q: 如何修改组件的默认样式？

A: 所有组件都接受 `className` 属性，可以添加自定义类名：

```tsx
<FAQ className="my-custom-faq" />
```

### Q: 组件支持服务端渲染吗？

A: 大部分组件都支持 SSR。对于需要客户端交互的组件（如 BackToTop），添加 `'use client'` 指令即可。

### Q: 如何禁用动画效果？

A: 组件使用 Framer Motion，可以通过设置 `animated={false}` 来禁用（如果组件支持）：

```tsx
<TagCloud animated={false} />
```

### Q: 组件可以用于商业项目吗？

A: 可以！所有组件都是开源的，采用 MIT 许可证。

---

## 📋 组件功能清单

| 组件 | 主要功能 | 变体数量 |
|------|---------|---------|
| FAQ | 常见问题展示 | 2 |
| Breadcrumb | 面包屑导航 | 1 |
| BackToTop | 回到顶部 | 3 |
| LanguageSwitcher | 语言切换 | 2 |
| ThemeSwitcher | 主题切换 | 3 |
| TagCloud | 标签云 | 4 |
| ShareButtons | 社交分享 | 4 |
| Pagination | 分页导航 | 5 |

---

## 🎉 下一步

1. ✅ 查看演示页面，了解每个组件的功能
2. ✅ 阅读组件文档，了解所有可配置选项
3. ✅ 在您的项目中使用这些组件
4. ✅ 根据需要自定义样式和行为

---

## 📞 获取帮助

- 📖 查看完整文档：`UTILITY_COMPONENTS_SUMMARY.md`
- 🎨 查看演示页面：`/showcase/utility-components`
- 🐛 报告问题：GitHub Issues
- 💬 讨论：GitHub Discussions

---

**祝您使用愉快！** 🚀

如有任何问题，请随时查阅文档或寻求帮助。
