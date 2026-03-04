# Card 组件

卡片组件用于组织和展示内容。

## 导入

```tsx
import { Card } from '@/components/ui/Card';
```

## 基础用法

```tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

## 赛博朋克变体

```tsx
<Card variant="neon">
  <h3>Neon Card</h3>
  <p>带有霓虹发光效果</p>
</Card>

<Card variant="cyber">
  <h3>Cyber Card</h3>
  <p>赛博朋克风格</p>
</Card>

<Card variant="holographic">
  <h3>Holographic Card</h3>
  <p>全息投影效果</p>
</Card>
```

## 带图片

```tsx
Card>
  <div className="relative h-48 bg-gradient-to-br from-cyan-500 to-purple-500" />
  <CardContent className="pt-4">
    <h3 className="text-lg font-semibold text-white mb-2">
      Image Card
    </h3>
    <p className="text-gray-400">
      Card with image
    </p>
  </CardContent>
</Card>
```

## 可交互

```tsx
<Card
  clickable
  onClick={() => console.log('clicked')}
  className="hover:shadow-lg hover:shadow-cyan-500/20"
>
  <h3>Clickable Card</h3>
  <p>Click me!</p>
</Card>
```

## API

### Card Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| variant | `'default' \| 'neon' \| 'cyber' \| 'holographic' \| 'glass'` | `'default'` | 卡片变体 |
| clickable | `boolean` | `false` | 是否可点击 |
| onClick | `() => void` | - | 点击回调 |
| className | `string` | - | 自定义类名 |
| children | `React.ReactNode` | - | 卡片内容 |

### CardHeader Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| className | `string` | - | 自定义类名 |
| children | `React.ReactNode` | - | 头部内容 |

### CardTitle Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| className | `string` | - | 自定义类名 |
| children | `React.ReactNode` | - | 标题内容 |

### CardDescription Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| className | `string` | - | 自定义类名 |
| children | `React.ReactNode` | - | 描述内容 |

### CardContent Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| className | `string` | - | 自定义类名 |
| children | `React.ReactNode` | - | 内容 |

### CardFooter Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| className | `string` | - | 自定义类名 |
| children | `React.ReactNode` | - | 底部内容 |
