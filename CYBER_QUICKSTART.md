# 🚀 CyberPress 赛博朋克组件快速开始

## 📦 新增组件概览

本次更新新增了 **11 个文件**，包含约 **4,500 行代码**：

| 组件 | 描述 | 路径 |
|------|------|------|
| CyberLoader | 赛博朋克加载器 | `components/ui/CyberLoader.tsx` |
| NeonProgress | 霓虹进度条 | `components/ui/NeonProgress.tsx` |
| CyberToggle | 赛博朋克开关 | `components/ui/CyberToggle.tsx` |
| useGeolocation | 地理位置 Hook | `hooks/useGeolocation.ts` |
| useIdle | 闲置检测 Hook | `hooks/useIdle.ts` |
| math-utils | 数学工具库 | `lib/utils/math-utils.ts` |
| url-utils | URL 工具库 | `lib/utils/url-utils.ts` |
| StatsWidget | 统计小部件 | `components/widgets/StatsWidget.tsx` |
| ClockWidget | 时钟小部件 | `components/widgets/ClockWidget.tsx` |
| Dashboard | 仪表板示例 | `app/examples/dashboard/page.tsx` |
| Loaders Demo | 加载器演示 | `app/examples/cyber-loaders/page.tsx` |

---

## 🎨 快速使用示例

### 1. CyberLoader - 加载器

```tsx
import { CyberLoader } from '@/components/ui';

// 基础用法
<CyberLoader variant="spinner" color="cyan" size="lg" />

// 带文字
<CyberLoader variant="matrix" showText text="系统加载中..." />

// 进度模式
<CyberLoader
  variant="bars"
  progress={75}
  showProgress
  text="下载中..."
/>

// 全屏加载
<CyberLoader
  variant="pulse"
  fullscreen
  color="purple"
/>
```

### 2. NeonProgress - 进度条

```tsx
import { NeonProgress } from '@/components/ui';

// 线性进度条
<NeonProgress value={75} color="cyan" showPercentage />

// 圆形进度条
<NeonProgress
  value={50}
  variant="circular"
  color="purple"
  label="处理中"
/>

// 分段进度条
<NeonProgress
  value={90}
  variant="segmented"
  color="pink"
  showLabel
  label="上传进度"
/>
```

### 3. CyberToggle - 开关

```tsx
import { CyberToggle } from '@/components/ui';

const [enabled, setEnabled] = useState(false);

// 基础用法
<CyberToggle
  checked={enabled}
  onChange={setEnabled}
  color="cyan"
/>

// 霓虹效果
<CyberToggle
  variant="neon"
  color="purple"
  showLabel
  labelOn="开启"
  labelOff="关闭"
/>

// 全息效果
<CyberToggle variant="hologram" color="green" />
```

### 4. StatsWidget - 统计卡片

```tsx
import { StatsWidget } from '@/components/widgets';
import { Users, TrendingUp } from 'lucide-react';

<StatsWidget
  stats={[
    {
      label: '总用户数',
      value: 12543,
      trend: { value: 12.5, period: '较上周' },
      icon: <Users />,
      color: 'cyan',
    },
    {
      label: '增长率',
      value: 67.8,
      suffix: '%',
      trend: { value: 8.2, period: '较上月' },
      icon: <TrendingUp />,
      color: 'purple',
    },
  ]}
  variant="neon"
  glow
/>
```

### 5. ClockWidget - 时钟

```tsx
import { ClockWidget } from '@/components/widgets';

// 霓虹数字时钟
<ClockWidget
  variant="neon"
  color="cyan"
  showDate
  showSeconds
  glow
/>

// 模拟时钟
<ClockWidget
  variant="analog"
  color="purple"
  timezone="Asia/Shanghai"
/>

// 简约时钟
<ClockWidget variant="minimal" format="12h" />
```

### 6. useGeolocation - 地理位置

```tsx
import { useGeolocation } from '@/hooks';

function MyComponent() {
  const { location, error, loading } = useGeolocation({
    enableHighAccuracy: true,
    timeout: 10000,
  });

  if (loading) return <div>定位中...</div>;
  if (error) return <div>定位失败: {error.message}</div>;

  return (
    <div>
      <p>纬度: {location.latitude}</p>
      <p>经度: {location.longitude}</p>
    </div>
  );
}
```

### 7. useIdle - 闲置检测

```tsx
import { useIdle } from '@/hooks';

function MyComponent() {
  const isIdle = useIdle({ idleTime: 5000 });

  return (
    <div>
      {isIdle ? (
        <p>用户已闲置 5 秒</p>
      ) : (
        <p>用户活跃中</p>
      )}
    </div>
  );
}
```

### 8. 数学工具

```tsx
import { lerp, clamp, random, degreesToRadians } from '@/lib/utils';

// 线性插值
const value = lerp(0, 100, 0.5); // 50

// 数值限制
const clamped = clamp(150, 0, 100); // 100

// 随机数
const rand = random(0, 100); // 0-100

// 角度转换
const radians = degreesToRadians(90); // π/2
```

### 9. URL 工具

```tsx
import {
  buildQueryString,
  parseQueryString,
  isValidUrl,
  isExternalUrl
} from '@/lib/utils';

// 构建查询字符串
const query = buildQueryString({ foo: 'bar', baz: [1, 2, 3] });
// "foo=bar&baz=1&baz=2&baz=3"

// 解析查询字符串
const params = parseQueryString(query);
// { foo: "bar", baz: ["1", "2", "3"] }

// URL 验证
if (isValidUrl(url)) {
  // 处理有效 URL
}

// 检查外部链接
if (isExternalUrl(url)) {
  // 添加 rel="noopener noreferrer"
}
```

---

## 🎯 颜色主题

所有组件支持统一的颜色主题：

```typescript
type ThemeColor =
  | 'cyan'    // #00f0ff - 霓虹青
  | 'purple'  // #9d00ff - 赛博紫
  | 'pink'    // #ff0080 - 激光粉
  | 'green'   // #00ff41 - 矩阵绿
  | 'yellow'  // #f0ff00 - 电压黄
  | 'blue'    // #0066ff - 电光蓝
```

---

## 📐 尺寸规范

```typescript
type Size = 'sm' | 'md' | 'lg' | 'xl';
```

| 尺寸 | 用途 |
|------|------|
| sm | 小型组件、紧凑布局 |
| md | 默认大小、常规使用 |
| lg | 重要内容、突出显示 |
| xl | 标题、主视觉元素 |

---

## 🌐 查看演示

启动开发服务器：

```bash
cd frontend
npm run dev
```

访问演示页面：

- **仪表板**: http://localhost:3000/examples/dashboard
- **加载器演示**: http://localhost:3000/examples/cyber-loaders

---

## 💡 完整示例

### 赛博朋克风格的数据卡片

```tsx
import { NeonCard, NeonCardHeader, NeonCardBody } from '@/components/ui';
import { StatsWidget } from '@/components/widgets';
import { ClockWidget } from '@/components/widgets';
import { CyberButton } from '@/components/ui';

export function CyberDashboard() {
  const stats = [
    {
      label: '总访问量',
      value: 125643,
      trend: { value: 12.5, period: '较上周' },
      color: 'cyan' as const,
    },
    {
      label: '活跃用户',
      value: 8432,
      trend: { value: 8.2, period: '较上周' },
      color: 'purple' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-black p-8">
      {/* 标题和时钟 */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-cyan-400">
          数据中心
        </h1>
        <ClockWidget variant="neon" color="cyan" />
      </div>

      {/* 统计卡片 */}
      <StatsWidget stats={stats} variant="neon" glow />

      {/* 操作按钮 */}
      <div className="mt-8 flex gap-4">
        <CyberButton variant="primary" size="lg">
          刷新数据
        </CyberButton>
        <CyberButton variant="secondary" size="lg">
          导出报告
        </CyberButton>
      </div>
    </div>
  );
}
```

---

## 🔧 配置选项

### Tailwind 配置

确保 `tailwind.config.ts` 包含赛博朋克颜色：

```typescript
module.exports = {
  theme: {
    extend: {
      colors: {
        cyber: {
          cyan: '#00f0ff',
          purple: '#9d00ff',
          pink: '#ff0080',
          green: '#00ff41',
          yellow: '#f0ff00',
        },
      },
    },
  },
};
```

### TypeScript 类型

所有组件都有完整的类型定义：

```typescript
import type {
  CyberLoaderProps,
  NeonProgressProps,
  CyberToggleProps,
  StatItem,
  ClockWidgetProps,
  GeolocationState,
  IdleOptions,
} from '@/components/ui';
```

---

## 📚 更多资源

- **完整文档**: `CYBER_FILES_REPORT.md`
- **组件源码**: `frontend/components/ui/`
- **Hooks 源码**: `frontend/hooks/`
- **工具函数**: `frontend/lib/utils/`
- **示例代码**: `frontend/app/examples/`

---

## ❓ 常见问题

### Q: 如何自定义颜色？
A: 可以通过 `style` 属性覆盖颜色：

```tsx
<CyberLoader
  color="cyan"
  style={{ '--cyber-primary': '#ff0000' } as React.CSSProperties}
/>
```

### Q: 如何禁用动画？
A: 大多数组件支持 `animated={false}` 属性。

### Q: 如何处理 SSR？
A: 使用 `'use client'` 指令标记客户端组件。

---

## 🎉 开始构建

现在您可以使用这些强大的赛博朋克组件来构建您的应用了！

祝您开发愉快！ 🚀

---

**最后更新**: 2026-03-02
