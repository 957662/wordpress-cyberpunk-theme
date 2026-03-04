# Badge 组件

徽章组件用于显示状态、标签或计数。

## 导入

```tsx
import { Badge } from '@/components/ui/Badge';
```

## 基础用法

```tsx
<Badge>Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="info">Info</Badge>
```

## 赛博朋克变体

```tsx
<Badge variant="neon">Neon Badge</Badge>
<Badge variant="cyber">Cyber Badge</Badge>
<Badge variant="holographic">Holographic</Badge>
```

## 尺寸

```tsx
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>
```

## 带图标

```tsx
<Badge icon={<Check className="w-3 h-3" />}>
  Completed
</Badge>
```

## 可关闭

```tsx
<Badge closable onClose={() => console.log('closed')}>
  Closable Badge
</Badge>
```

## API

### Badge Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| variant | `'default' \| 'success' \| 'warning' \| 'error' \| 'info' \| 'neon' \| 'cyber' \| 'holographic'` | `'default'` | 徽章变体 |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | 徽章尺寸 |
| icon | `React.ReactNode` | - | 图标 |
| closable | `boolean` | `false` | 是否可关闭 |
| onClose | `() => void` | - | 关闭回调 |
| className | `string` | - | 自定义类名 |
| children | `React.ReactNode` | - | 徽章内容 |
