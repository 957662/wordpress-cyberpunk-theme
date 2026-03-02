# 新组件使用指南

本文档介绍了最新创建的 UI 组件及其使用方法。

## 目录

1. [Transfer - 穿梭框](#transfer)
2. [SplitButton - 分割按钮](#splitbutton)
3. [FilterBar - 过滤栏](#filterbar)
4. [ActionBar - 操作栏](#actionbar)
5. [Resizable - 可调整大小](#resizable)
6. [VirtualScroll - 虚拟滚动](#virtualscroll)
7. [ExportButton - 导出按钮](#exportbutton)
8. [QuickView - 快速预览](#quickview)
9. [MasonryLayout - 瀑布流布局](#masonrylayout)
10. [CountdownTimer - 倒计时](#countdowntimer)
11. [ImageCompare - 图片对比](#imagecompare)
12. [Terminal - 终端](#terminal)
13. [SoundWave - 声波动画](#soundwave)
14. [TextScramble - 文字乱码](#textscramble)
15. [OrbitAnimation - 轨道动画](#orbitanimation)

---

## Transfer - 穿梭框

用于在两个列表之间移动项目的组件。

### 基础用法

```tsx
import { Transfer } from '@/components/ui';

const dataSource = [
  { id: '1', label: '项目 A' },
  { id: '2', label: '项目 B' },
  { id: '3', label: '项目 C' },
];

function App() {
  const [targetKeys, setTargetKeys] = useState<string[]>([]);

  return (
    <Transfer
      dataSource={dataSource}
      targetKeys={targetKeys}
      onChange={setTargetKeys}
      titles={['可选列表', '已选列表']}
    />
  );
}
```

### 带搜索功能

```tsx
<Transfer
  dataSource={dataSource}
  targetKeys={targetKeys}
  onChange={setTargetKeys}
  showSearch={true}
/>
```

---

## SplitButton - 分割按钮

一个按钮分成两部分：主要操作和下拉菜单。

### 基础用法

```tsx
import { SplitButton } from '@/components/ui';

function App() {
  return (
    <SplitButton
      mainAction={{
        label: '保存',
        onClick: () => console.log('保存'),
      }}
      actions={[
        {
          label: '保存并关闭',
          onClick: () => console.log('保存并关闭'),
        },
        {
          label: '保存为草稿',
          onClick: () => console.log('保存为草稿'),
        },
      ]}
      variant="primary"
    />
  );
}
```

---

## FilterBar - 过滤栏

用于展示和管理过滤条件的组件。

### 基础用法

```tsx
import { FilterBar } from '@/components/ui';

const filters = [
  {
    id: 'category',
    label: '分类',
    type: 'select',
    options: [
      { label: '技术', value: 'tech' },
      { label: '设计', value: 'design' },
    ],
  },
  {
    id: 'price',
    label: '价格',
    type: 'range',
    min: 0,
    max: 1000,
  },
];

function App() {
  const [activeFilters, setActiveFilters] = useState(filters);

  return (
    <FilterBar
      filters={activeFilters}
      onChange={setActiveFilters}
      onReset={() => console.log('重置过滤器')}
    />
  );
}
```

---

## ActionBar - 操作栏

用于展示页面或内容区域的操作按钮。

### 基础用法

```tsx
import { ActionBar } from '@/components/ui';

function App() {
  return (
    <ActionBar
      title="页面标题"
      subtitle="副标题"
      backAction={() => console.log('返回')}
      actions={[
        {
          id: 'save',
          label: '保存',
          icon: <SaveIcon />,
          onClick: () => console.log('保存'),
          variant: 'primary',
        },
        {
          id: 'delete',
          label: '删除',
          onClick: () => console.log('删除'),
          variant: 'danger',
        },
      ]}
    />
  );
}
```

---

## Resizable - 可调整大小

允许用户通过拖动边框来调整组件大小。

### 基础用法

```tsx
import { Resizable } from '@/components/ui';

function App() {
  return (
    <Resizable
      minWidth={200}
      maxWidth={800}
      minHeight={100}
      maxHeight={600}
      onResize={(size) => console.log('新大小:', size)}
    >
      <div>可调整大小的内容</div>
    </Resizable>
  );
}
```

### 带面板的Resizable

```tsx
import { ResizablePanel } from '@/components/ui';

<ResizablePanel
  title="可调整大小的面板"
  initialWidth={400}
  initialHeight={300}
>
  <p>面板内容</p>
</ResizablePanel>
```

---

## VirtualScroll - 虚拟滚动

高效渲染大量数据，只渲染可见区域的项目。

### 基础用法

```tsx
import { VirtualScroll } from '@/components/ui';

const items = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  label: `项目 ${i}`,
}));

function App() {
  return (
    <VirtualScroll
      items={items}
      itemHeight={50}
      renderItem={(item) => (
        <div className="p-4 border-b">{item.label}</div>
      )}
      height={400}
    />
  );
}
```

---

## ExportButton - 导出按钮

支持导出数据为多种格式（CSV、JSON、Excel等）。

### 基础用法

```tsx
import { ExportButton } from '@/components/ui';

const data = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 },
];

function App() {
  return (
    <ExportButton
      data={data}
      filename="用户数据"
      formats={['csv', 'json']}
      variant="primary"
    />
  );
}
```

---

## QuickView - 快速预览

在不离开当前页面的情况下预览内容。

### 基础用法

```tsx
import { QuickView } from '@/components/ui';

function App() {
  return (
    <QuickView
      trigger={<button>查看详情</button>}
      title="预览标题"
      content={<div>详细内容...</div>}
      size="lg"
    />
  );
}
```

### 图片预览

```tsx
import { QuickViewImage } from '@/components/ui';

<QuickViewImage
  src="/image.jpg"
  alt="图片描述"
  title="图片标题"
/>
```

---

## MasonryLayout - 瀑布流布局

不规则高度的元素以瀑布流方式排列。

### 基础用法

```tsx
import { MasonryLayout } from '@/components/ui';

const items = [
  {
    id: 1,
    height: 200,
    content: <img src="image1.jpg" alt="" />,
  },
  {
    id: 2,
    height: 300,
    content: <img src="image2.jpg" alt="" />,
  },
];

function App() {
  return (
    <MasonryLayout
      items={items}
      columnWidth={300}
      gap={16}
    />
  );
}
```

---

## CountdownTimer - 倒计时

支持多种倒计时显示格式和样式。

### 基础用法

```tsx
import { CountdownTimer } from '@/components/ui';

function App() {
  return (
    <CountdownTimer
      targetDate="2026-12-31"
      format="full"
      variant="neon"
      onComplete={() => console.log('倒计时结束')}
    />
  );
}
```

### 圆形倒计时

```tsx
import { CountdownCircle } from '@/components/ui';

<CountdownCircle
  targetDate="2026-12-31"
  size={200}
  color="cyan"
/>
```

---

## ImageCompare - 图片对比

用于对比两张图片的差异。

### 基础用法

```tsx
import { ImageCompare } from '@/components/ui';

function App() {
  return (
    <ImageCompare
      before="/before.jpg"
      after="/after.jpg"
      beforeLabel="修改前"
      afterLabel="修改后"
      height={400}
    />
  );
}
```

---

## Terminal - 终端

模拟终端界面，支持命令输入和输出。

### 基础用法

```tsx
import { Terminal } from '@/components/ui';

function App() {
  return (
    <Terminal
      title="命令行"
      onCommand={async (cmd) => {
        // 处理命令
        return `执行: ${cmd}`;
      }}
      height={400}
      theme="cyber"
    />
  );
}
```

---

## SoundWave - 声波动画

显示音频波形动画效果。

### 基础用法

```tsx
import { SoundWave } from '@/components/ui';

function App() {
  return (
    <SoundWave
      isPlaying={true}
      variant="bars"
      color="cyan"
      barCount={20}
    />
  );
}
```

### 音频可视化

```tsx
import { AudioVisualizer } from '@/components/ui';

<AudioVisualizer
  audioElement={audioRef.current}
  color="purple"
  fftSize={256}
/>
```

---

## TextScramble - 文字乱码

赛博朋克风格的文字解码动画效果。

### 基础用法

```tsx
import { TextScramble } from '@/components/ui';

function App() {
  return (
    <TextScramble
      text="Hello World"
      speed={50}
      scrambleLength={20}
    />
  );
}
```

### 打字机效果

```tsx
import { TypeWriter } from '@/components/ui';

<TypeWriter
  text="Welcome to CyberPress"
  speed={100}
  cursor={true}
  loop={true}
/>
```

---

## OrbitAnimation - 轨道动画

元素围绕中心点旋转的动画效果。

### 基础用法

```tsx
import { OrbitAnimation } from '@/components/ui';

function App() {
  return (
    <OrbitAnimation
      center={<div>中心</div>}
      items={[
        {
          id: '1',
          content: <div>项目1</div>,
          distance: 100,
          speed: 1,
        },
      ]}
      size={300}
    />
  );
}
```

### 雷达扫描

```tsx
import { RadarScan } from '@/components/ui';

<RadarScan
  items={[
    { x: 30, y: 40, label: '目标1' },
    { x: 60, y: 70, label: '目标2' },
  ]}
  size={300}
  color="cyan"
/>
```

---

## 总结

以上新创建的组件都具有以下特点：

- ✅ 完整的 TypeScript 类型支持
- ✅ 响应式设计
- ✅ 赛博朋克风格主题
- ✅ 丰富的自定义选项
- ✅ 完整的实现，无占位符
- ✅ 可直接使用

所有组件都位于 `/root/.openclaw/workspace/cyberpress-platform/frontend/components/ui/` 目录下。
