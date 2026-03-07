# CyberPress 新组件库

这是 CyberPress 平台全新创建的组件库，包含 10+ 个高质量、可复用的 React 组件。

## 🎨 组件列表

### 1. 标签输入组件 (TagInput)

支持标签添加、删除、自动补全、验证等功能。

**特性：**
- ✅ 支持回车、逗号分隔添加标签
- ✅ 自动补全建议
- ✅ 标签验证（长度、重复、格式）
- ✅ 标签云展示
- ✅ 赛博朋克风格设计

```tsx
import { TagInput, TagCloud } from '@/components/new-components'

function App() {
  const [tags, setTags] = useState(['React', 'TypeScript'])

  return (
    <>
      <TagInput
        value={tags}
        onChange={setTags}
        placeholder="输入标签后按回车..."
        suggestions={['React', 'Vue', 'Angular']}
        maxTags={10}
        maxLength={20}
      />
      <TagCloud tags={tags} onTagClick={(tag) => console.log(tag)} />
    </>
  )
}
```

### 2. 评分组件 (Rating)

支持星级评分、半星评分、评分统计等功能。

**特性：**
- ⭐ 完整的星级评分
- ⭐ 支持半星评分
- ⭐ 只读展示模式
- ⭐ 评分统计和分布
- ⭐ 多种颜色主题

```tsx
import { Rating, RatingDisplay, RatingStats } from '@/components/new-components'

function App() {
  const [rating, setRating] = useState(4)

  return (
    <>
      {/* 可交互评分 */}
      <Rating
        value={rating}
        onChange={setRating}
        allowHalf={true}
        showValue={true}
        size="lg"
        color="cyan"
      />

      {/* 只读展示 */}
      <RatingDisplay value={4.5} count={128} />

      {/* 评分统计 */}
      <RatingStats
        average={4.5}
        total={128}
        distribution={[2, 5, 15, 35, 71]}
      />
    </>
  )
}
```

### 3. 数据可视化组件 (DonutChart & BarChart)

支持甜甜圈图和柱状图展示。

**特性：**
- 📊 甜甜圈图
- 📊 垂直/水平柱状图
- 📊 自定义颜色
- 📊 动画效果
- 📊 图例和百分比显示

```tsx
import { DonutChart, BarChart } from '@/components/new-components'

function App() {
  const chartData = [
    { label: 'React', value: 40, color: '#61dafb' },
    { label: 'Vue', value: 30, color: '#42b883' },
    { label: 'Angular', value: 20, color: '#dd0031' },
  ]

  return (
    <>
      <DonutChart
        data={chartData}
        showLabels={true}
        showLegend={true}
        showPercentage={true}
        size={200}
        thickness={40}
      />

      <BarChart
        data={chartData}
        height={200}
        showValues={true}
        direction="vertical"
      />
    </>
  )
}
```

### 4. 树形视图组件 (TreeView)

支持普通树形和文件树展示。

**特性：**
- 🌳 展开/收起节点
- 🌳 自定义图标
- 🌳 节点选择
- 🌳 文件树专用组件
- 🌳 文件大小显示

```tsx
import { TreeView, FileTree } from '@/components/new-components'

function App() {
  const treeData = [
    {
      id: '1',
      label: '根目录',
      children: [
        { id: '1-1', label: '子项 1' },
        { id: '1-2', label: '子项 2' },
      ],
    },
  ]

  return (
    <>
      <TreeView
        data={treeData}
        onNodeClick={(node) => console.log(node)}
        showIcon={true}
      />

      <FileTree
        files={[...]}
        showInfo={true}
      />
    </>
  )
}
```

### 5. 颜色选择器组件 (ColorPicker)

完整的颜色选择功能。

**特性：**
- 🎨 可视化颜色选择
- 🎨 色相/饱和度/亮度调节
- 🎨 预设颜色
- 🎨 多种颜色格式
- 🎨 一键复制

```tsx
import { ColorPicker } from '@/components/new-components'

function App() {
  const [color, setColor] = useState('#00f0ff')

  return (
    <ColorPicker
      value={color}
      onChange={setColor}
      showPresets={true}
      format="hex"
    />
  )
}
```

### 6. 代码编辑器组件 (CodeEditor)

支持代码编辑和预览。

**特性：**
- 💻 语法高亮
- 💻 行号显示
- 💻 复制/下载代码
- 💻 全屏模式
- 💻 Tab 缩进支持

```tsx
import { CodeEditor, CodePreview } from '@/components/new-components'

function App() {
  const [code, setCode] = useState('console.log("Hello World")')

  return (
    <CodeEditor
      value={code}
      onChange={setCode}
      language="typescript"
      showLineNumbers={true}
      allowFullscreen={true}
      minHeight="200px"
    />
  )
}
```

### 7. 文件上传组件 (FileUpload)

支持拖拽上传和进度显示。

**特性：**
- 📁 拖拽上传
- 📁 多文件上传
- 📁 进度条显示
- 📁 文件验证
- 📁 文件预览

```tsx
import { FileUpload } from '@/components/new-components'

function App() {
  return (
    <FileUpload
      onFilesChange={(files) => console.log(files)}
      accept="image/*,.pdf"
      multiple={true}
      maxFiles={5}
      maxSize={10}
    />
  )
}
```

### 8. 时间轴组件 (Timeline)

支持垂直/水平时间轴展示。

**特性：**
- 📅 垂直/水平布局
- 📅 状态标记
- 📅 图片和标签支持
- 📅 响应式设计

```tsx
import { Timeline } from '@/components/new-components'

function App() {
  const events = [
    {
      id: '1',
      title: '项目启动',
      description: '开始开发',
      date: '2024-01',
      status: 'completed',
    },
  ]

  return (
    <Timeline
      events={events}
      layout="vertical"
      position="left"
      showLine={true}
    />
  )
}
```

### 9. 搜索组件 (SearchInput)

智能搜索输入框。

**特性：**
- 🔍 自动补全
- 🔍 搜索历史
- 🔍 热门搜索
- 🔍 键盘快捷键

```tsx
import { SearchInput } from '@/components/new-components'

function App() {
  return (
    <SearchInput
      placeholder="搜索文章、标签、作者..."
      onSearch={(query) => console.log(query)}
    />
  )
}
```

### 10. 虚拟列表组件 (VirtualList)

高性能大数据列表渲染。

**特性：**
- ⚡ 虚拟滚动
- ⚡ 无限加载
- ⚡ 高性能渲染
- ⚡ 自定义行高

```tsx
import { VirtualList } from '@/components/new-components'

function App() {
  const items = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    title: `项目 ${i}`,
  }))

  return (
    <VirtualList
      items={items}
      itemHeight={80}
      renderItem={(item) => <div>{item.title}</div>}
      containerHeight={400}
    />
  )
}
```

## 🚀 快速开始

### 安装依赖

确保已安装所有必需的依赖：

```bash
npm install framer-motion lucide-react clsx
```

### 导入使用

```tsx
// 导入单个组件
import { TagInput } from '@/components/new-components'

// 导入多个组件
import { TagInput, Rating, DonutChart } from '@/components/new-components'

// 导入类型
import type { TagInputProps, RatingProps } from '@/components/new-components'
```

## 📖 完整示例

访问 `/components-showcase` 页面查看所有组件的完整示例和交互演示。

## 🎯 设计规范

所有组件遵循以下设计规范：

- **颜色主题**: 赛博朋克风格（青色、紫色、粉色）
- **动画**: 使用 Framer Motion 实现流畅动画
- **响应式**: 支持桌面和移动设备
- **可访问性**: 遵循 WCAG 2.1 标准
- **TypeScript**: 完整的类型定义

## 🤝 贡献指南

欢迎贡献新组件或改进现有组件！

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📝 许可证

MIT License

---

**享受使用 CyberPress 组件库！** 🎉
