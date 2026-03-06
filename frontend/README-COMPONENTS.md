# CyberPress 组件库文档

## 📦 组件列表

### 基础组件 (Basic)

#### Button 按钮
完整的按钮组件，支持多种样式和状态。

**变体:**
- `primary` - 主要按钮，青色渐变背景
- `secondary` - 次要按钮，紫色渐变背景
- `outline` - 轮廓按钮，只有边框
- `ghost` - 幽灵按钮，无背景
- `danger` - 危险按钮，粉色渐变背景

**尺寸:**
- `sm` - 小尺寸
- `md` - 中尺寸 (默认)
- `lg` - 大尺寸

**特性:**
- 加载状态
- 左右图标
- 全宽选项
- 禁用状态

```tsx
<Button variant="primary" size="md" isLoading>
  点击我
</Button>
```

---

#### Input 输入框
文本输入组件。

**特性:**
- 前后缀
- 错误状态
- 禁用状态
- 字符计数

```tsx
<Input
  placeholder="请输入..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

---

#### Select 选择器
下拉选择组件。

**特性:**
- 单选/多选
- 分组选项
- 搜索过滤
- 虚拟滚动

---

#### Checkbox 复选框
复选框组件。

**特性:**
- 单独使用
- 复选框组
- 不确定状态

```tsx
<Checkbox checked={value} onCheckedChange={setValue}>
  同意条款
</Checkbox>
```

---

#### Radio 单选框
单选框组件。

**特性:**
- 单选组
- 预设选项
- 描述文本

```tsx
<RadioGroup value={value} onChange={setValue}>
  <Radio value="option1" label="选项一" />
  <Radio value="option2" label="选项二" />
</RadioGroup>
```

---

#### Slider 滑块
滑块选择组件。

**类型:**
- 单值滑块
- 范围滑块

**特性:**
- 垂直/水平
- 刻度标记
- 步进设置
- 数值显示

```tsx
<Slider
  value={[50]}
  onChange={setValue}
  showValue
  label="音量"
/>
```

---

### 反馈组件 (Feedback)

#### Progress 进度条
进度展示组件。

**类型:**
- 线性进度条
- 圆形进度条

**颜色变体:**
- `cyan` - 青色
- `purple` - 紫色
- `pink` - 粉色
- `green` - 绿色
- `yellow` - 黄色

```tsx
<Progress value={75} showLabel variant="cyan" />
<CircularProgress value={75} size={120} />
```

---

#### Skeleton 骨架屏
加载占位符组件。

**预设:**
- `SkeletonText` - 文本骨架
- `SkeletonAvatar` - 头像骨架
- `SkeletonCard` - 卡片骨架
- `SkeletonList` - 列表骨架
- `SkeletonTable` - 表格骨架

```tsx
<SkeletonText lines={3} />
<SkeletonAvatar size={40} />
```

---

#### EmptyState 空状态
空状态展示组件。

**类型:**
- `empty` - 空内容
- `search` - 搜索
- `error` - 错误
- `no-results` - 无结果
- `success` - 成功

```tsx
<EmptyState
  type="empty"
  action={{
    label: '创建内容',
    onClick: handleCreate
  }}
/>
```

---

### 导航组件 (Navigation)

#### Tabs 选项卡
选项卡切换组件。

**特性:**
- 水平/垂直
- 动画指示器
- 懒加载内容

```tsx
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">选项1</TabsTrigger>
    <TabsTrigger value="tab2">选项2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">内容1</TabsContent>
  <TabsContent value="tab2">内容2</TabsContent>
</Tabs>
```

---

#### Accordion 手风琴
可折叠内容组件。

**特性:**
- 单选/多选展开
- 动画过渡

```tsx
<Accordion>
  <AccordionItem value="item1">
    <AccordionTrigger>标题1</AccordionTrigger>
    <AccordionContent>内容1</AccordionContent>
  </AccordionItem>
</Accordion>
```

---

#### Tooltip 提示框
鼠标悬停提示组件。

**位置:**
- `top` - 上方
- `bottom` - 下方
- `left` - 左侧
- `right` - 右侧

**对齐:**
- `start` - 起始对齐
- `center` - 居中对齐
- `end` - 结束对齐

```tsx
<Tooltip content="提示信息" side="top">
  <Button>悬停查看</Button>
</Tooltip>
```

---

#### Menu 菜单
下拉菜单组件。

**子组件:**
- `MenuTrigger` - 触发器
- `MenuContent` - 菜单内容
- `MenuItem` - 菜单项
- `MenuLabel` - 标签
- `MenuSeparator` - 分隔线

```tsx
<Menu>
  <MenuTrigger>
    <Button>打开菜单</Button>
  </MenuTrigger>
  <MenuContent>
    <MenuItem>选项1</MenuItem>
    <MenuItem>选项2</MenuItem>
  </MenuContent>
</Menu>
```

---

#### CommandMenu 命令菜单
命令面板组件 (⌘K)。

**特性:**
- 搜索过滤
- 快捷键支持
- 分组显示
- 键盘导航

```tsx
<CommandMenu
  groups={[
    {
      label: '操作',
      items: [
        { id: '1', label: '新建', action: () => {} }
      ]
    }
  ]}
/>
```

---

### 数据展示 (Data Display)

#### Card 卡片
卡片容器组件。

**变体:**
- `default` - 默认
- `neon` - 霓虹边框
- `glass` - 玻璃态
- `hologram` - 全息效果

**发光颜色:**
- `cyan` - 青色
- `purple` - 紫色
- `pink` - 粉色
- `yellow` - 黄色

```tsx
<Card variant="neon" glowColor="cyan" hover>
  内容
</Card>
```

---

#### Badge 徽章
徽章标签组件。

**颜色变体:**
- `cyan`, `purple`, `pink`, `green`, `yellow`, `red`, `gray`

**特性:**
- 发光效果
- 点状指示
- 图标支持

**预设组件:**
- `StatusBadge` - 状态徽章
- `CountBadge` - 计数徽章
- `NewBadge` - 新标签
- `HotBadge` - 热门标签

```tsx
<Badge variant="cyan">标签</Badge>
<StatusBadge status="online" />
<CountBadge count={99} />
```

---

#### Avatar 头像
头像组件。

**形状:**
- `circle` - 圆形
- `square` - 方形
- `rounded` - 圆角

**状态指示:**
- `online` - 在线
- `offline` - 离线
- `away` - 离开
- `busy` - 忙碌

**预设组件:**
- `UserAvatar` - 用户头像
- `BotAvatar` - 机器人头像
- `AvatarGroup` - 头像组

```tsx
<Avatar src="/avatar.jpg" alt="用户" size="md" />
<UserAvatar name="Alice" />
<AvatarGroup avatars={[...]} />
```

---

## 🎨 赛博朋克特色

### 霓虹发光效果
所有主要组件都支持霓虹发光效果，通过 `shadow-neon-*` 类实现。

### 渐变色
使用 `from-cyber-cyan to-cyber-purple` 等渐变类。

### 动画效果
组件内置 Framer Motion 动画：
- 悬停缩放
- 点击反馈
- 进入/退出动画

### 扫描线效果
部分组件支持扫描线动画效果。

---

## 📖 使用指南

### 安装依赖
```bash
npm install framer-motion clsx tailwind-merge lucide-react
```

### 导入组件
```tsx
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
```

### 使用 Tailwind 类
```tsx
<Button className="bg-cyber-cyan text-cyber-dark">
  点击
</Button>
```

---

## 🎯 最佳实践

1. **颜色使用**
   - 主要操作使用 `cyber-cyan`
   - 次要操作使用 `cyber-purple`
   - 危险操作使用 `cyber-pink`

2. **间距**
   - 使用 `gap-*` 类控制间距
   - 卡片内边距默认为 `p-6`

3. **动画**
   - 悬停动画使用 `hover:scale-*`
   - 过渡时间统一使用 `duration-200`

4. **可访问性**
   - 所有交互元素支持键盘导航
   - 颜色对比度符合 WCAG 标准

---

## 📝 更新日志

### v1.0.0 (2026-03-07)
- 初始版本发布
- 50+ 基础组件
- 赛博朋克设计系统
- 完整的 TypeScript 类型

---

**设计团队:** CyberPress AI Design Team
**最后更新:** 2026-03-07
