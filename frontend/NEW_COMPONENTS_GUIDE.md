# 新创建的组件使用指南

> 创建日期: 2026-03-07
> 版本: 1.0.0

本文档介绍了本次创建的新组件及其使用方法。

## 📦 已创建的组件

### 1. 表单组件 (Forms)

#### CyberInput - 赛博朋克输入框

全功能的赛博朋克风格输入框组件，支持多种变体和颜色主题。

**特性：**
- ✅ 多种颜色主题（cyan、purple、pink、green）
- ✅ 三种变体（default、filled、outlined）
- ✅ 密码显示/隐藏
- ✅ 可清除功能
- ✅ 左侧图标支持
- ✅ 错误提示
- ✅ 帮助文本
- ✅ 动画效果

**使用示例：**

```tsx
import { CyberInput } from '@/components/forms';

// 基础用法
<CyberInput
  label="用户名"
  placeholder="请输入用户名"
  color="cyan"
/>

// 密码输入框
<CyberInput
  type="password"
  label="密码"
  placeholder="请输入密码"
/>

// 带图标的输入框
<CyberInput
  label="搜索"
  icon={<Search />}
  placeholder="搜索文章..."
  clearable
/>

// 带错误提示
<CyberInput
  label="邮箱"
  type="email"
  error="请输入有效的邮箱地址"
/>

// 搜索输入框
import { CyberSearchInput } from '@/components/forms';

<CyberSearchInput
  placeholder="搜索..."
  onSearch={(value) => console.log('搜索:', value)}
/>
```

**Props：**

```typescript
interface CyberInputProps {
  label?: string;           // 标签
  error?: string;           // 错误信息
  helperText?: string;      // 帮助文本
  variant?: 'default' | 'filled' | 'outlined';  // 变体
  color?: 'cyan' | 'purple' | 'pink' | 'green'; // 颜色
  icon?: React.ReactNode;   // 左侧图标
  onIconClick?: () => void; // 图标点击事件
  clearable?: boolean;      // 是否可清除
  onClear?: () => void;     // 清除事件
  animate?: boolean;        // 是否显示动画
}
```

---

### 2. 分享组件 (Share)

#### SocialShareButtons - 社交分享按钮

完整的社交分享功能组件，支持多个主流社交平台。

**特性：**
- ✅ 支持多平台（Twitter、Facebook、LinkedIn、Email、微信）
- ✅ 复制链接功能
- ✅ 水平/垂直布局
- ✅ 三种尺寸
- ✅ 显示/隐藏标签
- ✅ 原生分享 API 支持

**使用示例：**

```tsx
import { SocialShareButtons, QuickShareButton } from '@/components/share';

// 基础用法
<SocialShareButtons
  url="https://example.com/post/123"
  title="文章标题"
  description="文章描述"
/>

// 垂直布局
<SocialShareButtons
  url="https://example.com/post/123"
  title="文章标题"
  variant="vertical"
  size="lg"
  showLabel
/>

// 快速分享按钮
<QuickShareButton
  url="https://example.com/post/123"
  title="文章标题"
  description="文章描述"
/>
```

**Props：**

```typescript
interface SocialShareButtonsProps {
  url: string;                        // 分享的链接
  title: string;                      // 分享的标题
  description?: string;               // 分享的描述
  variant?: 'horizontal' | 'vertical'; // 布局方式
  size?: 'sm' | 'md' | 'lg';          // 尺寸
  showLabel?: boolean;                // 是否显示标签
}
```

---

### 3. 仪表盘组件 (Dashboard)

#### MiniChart - 迷你图表

用于显示小型趋势图的轻量级图表组件。

**特性：**
- ✅ 折线图和面积图
- ✅ 平滑曲线支持
- ✅ 数据点显示
- ✅ 趋势指示器
- ✅ 多种颜色主题
- ✅ 动画效果

**使用示例：**

```tsx
import { MiniChart, MiniBarChart } from '@/components/dashboard';

// 折线图
<MiniChart
  data={[10, 20, 15, 30, 25, 40, 35]}
  color="cyan"
  height={80}
  showArea
  smooth
/>

// 柱状图
<MiniBarChart
  data={[10, 20, 15, 30, 25, 40, 35]}
  color="purple"
  height={80}
/>
```

**Props：**

```typescript
interface MiniChartProps {
  data: number[];                      // 数据数组
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
  height?: number;                     // 高度（px）
  showArea?: boolean;                  // 是否显示区域
  showDots?: boolean;                  // 是否显示数据点
  smooth?: boolean;                    // 是否平滑曲线
}
```

---

### 4. 工具函数 (Utils)

#### format-utils - 格式化工具

提供各种数据格式化功能的工具函数库。

**功能列表：**

```typescript
import {
  formatNumber,          // 数字格式化
  formatCurrency,        // 货币格式化
  formatPercentage,      // 百分比格式化
  formatFileSize,        // 文件大小格式化
  formatRelativeTime,    // 相对时间格式化
  formatDate,            // 日期格式化
  formatTimeRange,       // 时间范围格式化
  formatReadingTime,     // 阅读时间格式化
  truncateText,          // 文本截断
  highlightSearchTerm,   // 高亮搜索词
  formatUrl,             // URL 格式化
  formatPhoneNumber,     // 电话号码格式化
  formatIdCard,          // 身份证号格式化
  formatEmail,           // 邮箱格式化
  toTitleCase,           // 转换为标题格式
  generateRandomString,  // 生成随机字符串
  formatJson,            // JSON 格式化
  parseUserAgent,        // 解析用户代理
} from '@/lib/utils-new/format-utils';
```

**使用示例：**

```typescript
// 数字格式化
formatNumber(1234567.89);  // "1,234,567.89"

// 货币格式化
formatCurrency(1234.56, 'CNY', 'zh-CN');  // "¥1,234.56"

// 文件大小格式化
formatFileSize(1536000);  // "1.46 MB"

// 相对时间
formatRelativeTime('2026-03-07');  // "2天前"

// 阅读时间
formatReadingTime(1000);  // "5分钟"

// 文本截断
truncateText('这是一段很长的文本...', 10);  // "这是一段很长的..."

// 高亮搜索词
highlightSearchTerm('搜索功能很强大', '搜索');  // 返回带 mark 标签的 ReactNode

// 用户代理解析
parseUserAgent(navigator.userAgent);
// { browser: 'Chrome', os: 'Windows', device: 'Desktop' }
```

---

## 🎨 完整示例

### 博客文章页面

```tsx
import { CyberInput } from '@/components/forms';
import { SocialShareButtons } from '@/components/share';
import { MiniChart } from '@/components/dashboard';
import { formatReadingTime, formatRelativeTime } from '@/lib/utils-new/format-utils';

export default function BlogPostPage() {
  return (
    <div className="space-y-6">
      {/* 文章信息 */}
      <div>
        <h1 className="text-3xl font-bold">文章标题</h1>
        <p className="text-gray-400">
          发布于 {formatRelativeTime('2026-03-07')}
          · 阅读时间 {formatReadingTime(1000)}
        </p>
      </div>

      {/* 搜索框 */}
      <CyberSearchInput
        placeholder="搜索相关文章..."
        onSearch={(value) => console.log(value)}
      />

      {/* 阅读趋势 */}
      <div>
        <h3 className="text-sm mb-2">阅读趋势</h3>
        <MiniChart
          data={[100, 150, 120, 180, 200, 170, 220]}
          color="cyan"
          height={80}
          showArea
          smooth
        />
      </div>

      {/* 分享按钮 */}
      <SocialShareButtons
        url="https://example.com/post/123"
        title="文章标题"
        description="文章描述"
      />
    </div>
  );
}
```

---

## 📝 注意事项

### 样式依赖

这些组件使用了 Tailwind CSS 和自定义的赛博朋克颜色变量。确保你的项目中定义了这些颜色：

```css
/* tailwind.config.js */
module.exports = {
  theme: {
    extend: {
      colors: {
        'cyber-dark': '#0a0a0f',
        'cyber-cyan': '#00f0ff',
        'cyber-purple': '#9d00ff',
        'cyber-pink': '#ff0080',
        'cyber-green': '#00ff88',
        'cyber-yellow': '#f0ff00',
        'cyber-muted': '#1a1a2e',
      },
    },
  },
};
```

### 依赖项

确保安装了以下依赖：

```bash
npm install framer-motion lucide-react clsx tailwind-merge
```

### TypeScript

所有组件都提供了完整的 TypeScript 类型定义，可以直接获得类型提示。

---

## 🚀 快速开始

1. **导入组件**
```typescript
import { CyberInput } from '@/components/forms';
```

2. **使用组件**
```tsx
<CyberInput label="用户名" color="cyan" />
```

3. **自定义样式**
```tsx
<CyberInput
  label="自定义样式"
  className="custom-class"
  style={{ ... }}
/>
```

---

## 📚 更多资源

- [项目 README](../../README.md)
- [组件库文档](../docs/COMPONENT_LIBRARY.md)
- [样式指南](../docs/STYLE_GUIDE.md)
- [API 文档](../docs/API_REFERENCE.md)

---

**创建时间**: 2026-03-07
**维护者**: AI Development Team
**许可证**: MIT
