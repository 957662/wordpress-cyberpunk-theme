# 新组件快速入门指南

本指南将帮助您快速开始使用本次创建的新组件。

## 📊 图表组件

### BarChart - 柱状图

```tsx
import { BarChart } from '@/components/charts';

function MyComponent() {
  const data = [
    { label: '一月', value: 1200 },
    { label: '二月', value: 1900 },
    { label: '三月', value: 1500 },
  ];

  return (
    <BarChart
      data={data}
      title="月度销售数据"
      height={300}
      colorScheme="cyan"
      showGrid
      showLabels
      showValues
    />
  );
}
```

**支持的配置：**
- `data`: 图表数据
- `title`: 标题
- `height`: 高度
- `showGrid`: 显示网格
- `showLabels`: 显示标签
- `showValues`: 显示数值
- `colorScheme`: 颜色方案 (cyan, purple, pink, green, orange, blue)
- `orientation`: 方向 (vertical, horizontal)

### PieChart - 饼图

```tsx
import { PieChart } from '@/components/charts';

function MyComponent() {
  const data = [
    { label: '技术', value: 45 },
    { label: '生活', value: 25 },
    { label: '随笔', value: 20 },
  ];

  return (
    <PieChart
      data={data}
      title="分类统计"
      size={300}
      showLegend
      innerRadius={50}
    />
  );
}
```

### AreaChart - 面积图

```tsx
import { AreaChart } from '@/components/charts';

function MyComponent() {
  const data = [
    { x: '1月', y: 100 },
    { x: '2月', y: 150 },
    { x: '3月', y: 120 },
  ];

  return (
    <AreaChart
      data={data}
      title="访问趋势"
      height={200}
      curve="smooth"
      fill
      colorScheme="purple"
    />
  );
}
```

## ⏱️ 计时器组件

### Stopwatch - 秒表

```tsx
import { Stopwatch } from '@/components/timer';

function TimerPage() {
  return (
    <Stopwatch
      title="计时器"
      showLaps={true}
      colorScheme="cyan"
    />
  );
}
```

### IntervalTimer - 间歇训练计时器

```tsx
import { IntervalTimer } from '@/components/timer';

function WorkoutTimer() {
  return (
    <IntervalTimer
      title="HIIT 训练"
      defaultWorkTime={30}
      defaultRestTime={10}
      defaultRounds={8}
      colorScheme="orange"
    />
  );
}
```

### CountdownTimer - 倒计时

```tsx
import { CountdownTimer } from '@/components/timer';

function Countdown() {
  const targetDate = new Date('2026-12-31');
  
  return (
    <CountdownTimer
      targetDate={targetDate}
      title="新年倒计时"
      colorScheme="purple"
    />
  );
}
```

## 🌐 网络组件

### NetworkStatus - 网络状态

```tsx
import { NetworkStatus } from '@/components/network';

function Layout() {
  return (
    <>
      <NetworkStatus
        showDetails={true}
        position="top-right"
      />
      {/* 其他内容 */}
    </>
  );
}
```

### SpeedTest - 网络测速

```tsx
import { SpeedTest } from '@/components/network';

function NetworkPage() {
  return (
    <SpeedTest
      title="网络测速"
      showHistory={true}
      maxHistory={10}
    />
  );
}
```

## 📁 上传组件

### FileDropzone - 文件上传

```tsx
import { FileDropzone } from '@/components/upload';

function UploadPage() {
  const handleUpload = async (files) => {
    // 处理上传逻辑
    console.log('上传文件:', files);
  };

  return (
    <FileDropzone
      onUpload={handleUpload}
      accept="image/*,.pdf,.doc"
      maxSize={10 * 1024 * 1024} // 10MB
      maxFiles={5}
      multiple={true}
      colorScheme="cyan"
    />
  );
}
```

### ImageCropper - 图片裁剪

```tsx
import { ImageCropper } from '@/components/upload';

function AvatarUpload() {
  const handleCrop = async (blob) => {
    // 处理裁剪后的图片
    console.log('裁剪完成:', blob);
  };

  return (
    <ImageCropper
      image="/path/to/image.jpg"
      onCrop={handleCrop}
      aspectRatio={1}
      circular={true}
      colorScheme="purple"
    />
  );
}
```

## 🎣 自定义 Hooks

### useClipboard - 剪贴板

```tsx
import { useClipboard } from '@/hooks';

function CopyButton({ text }) {
  const { hasCopied, onCopy } = useClipboard(text);

  return (
    <button onClick={onCopy}>
      {hasCopied ? '已复制!' : '复制'}
    </button>
  );
}
```

### useToggle - 切换状态

```tsx
import { useToggle } from '@/hooks';

function ToggleButton() {
  const [isOn, toggle, setToggle] = useToggle(false);

  return (
    <button onClick={toggle}>
      {isOn ? '开启' : '关闭'}
    </button>
  );
}
```

## 📊 仪表盘页面

访问 `/dashboard` 查看完整的数据仪表盘示例，包含：
- 统计卡片
- 访问量趋势图
- 热门文章排行
- 分类分布
- 最近活动列表

## 🎨 主题配置

所有组件都支持赛博朋克风格的颜色方案：

```tsx
// 霓虹青
colorScheme="cyan"

// 赛博紫
colorScheme="purple"

// 激光粉
colorScheme="pink"

// 电压黄
colorScheme="yellow"

// 矩阵绿
colorScheme="green"

// 火焰橙
colorScheme="orange"
```

## 🔧 实用工具

### 日期工具

```tsx
import { formatDate, relativeTime } from '@/lib/utils/helpers/date';

// 格式化日期
formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss');
// 输出: 2026-03-03 14:30:00

// 相对时间
relativeTime(new Date(Date.now() - 3600000));
// 输出: 1小时前
```

### 字符串工具

```tsx
import { slugify, formatFileSize } from '@/lib/utils/helpers/string';

// 生成 slug
slugify('Hello World');
// 输出: hello-world

// 格式化文件大小
formatFileSize(1024 * 1024);
// 输出: 1 MB
```

## 📦 类型定义

所有组件都有完整的 TypeScript 类型定义：

```tsx
import type { 
  BarData, 
  BarChartProps,
  FileWithPreview,
  Notification,
  // ... 更多类型
} from '@/components/charts';
```

## 🚀 快速开始

1. 确保已安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

3. 访问示例页面：
- 仪表盘: http://localhost:3000/dashboard
- 组件示例: http://localhost:3000/examples/new-components

## 📝 注意事项

1. 所有组件都是客户端组件，需要在文件顶部添加 `'use client'`
2. 使用 `@/` 别名导入项目内的模块
3. 组件支持响应式设计，自动适配移动端
4. 动画效果使用 Framer Motion，确保流畅体验

## 🎯 下一步

- 查看组件源码了解实现细节
- 根据需求自定义组件样式
- 结合 Zustand 进行状态管理
- 添加更多交互功能

---
更新时间: 2026-03-03
