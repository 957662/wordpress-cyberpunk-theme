# 🚀 新组件快速参考

## 📍 组件位置与导入

```typescript
// 方式1: 从总索引导入
import { 
  ChatInterface, 
  CodeSandbox, 
  VoiceAssistant,
  RealTimeChart,
  DraggableList,
  SortableGrid,
  SmartForm,
  RealTimeEditor,
  ModelViewer
} from '@/components/index-new-features';

// 方式2: 从分类目录导入
import { ChatInterface } from '@/components/ai';
import { RealTimeChart } from '@/components/charts';
import { DraggableList } from '@/components/dnd';
import { SmartForm } from '@/components/forms';
import { RealTimeEditor } from '@/components/collaboration';
import { ModelViewer } from '@/components/3d';
```

## 🎯 组件速查表

| 组件 | 分类 | 路径 | 功能描述 |
|------|------|------|----------|
| ChatInterface | AI | `/components/ai` | AI聊天界面 |
| CodeSandbox | AI | `/components/ai` | 代码沙盒编辑器 |
| VoiceAssistant | AI | `/components/ai` | 语音助手 |
| RealTimeChart | 图表 | `/components/charts` | 实时数据图表 |
| DraggableList | 拖拽 | `/components/dnd` | 可拖拽列表 |
| SortableGrid | 拖拽 | `/components/dnd` | 可拖拽网格 |
| SmartForm | 表单 | `/components/forms` | 智能表单 |
| RealTimeEditor | 协作 | `/components/collaboration` | 实时协作编辑器 |
| ModelViewer | 3D | `/components/3d` | 3D模型查看器 |

## 💡 快速示例

### 1. AI聊天界面
```tsx
<ChatInterface
  messages={messages}
  onSendMessage={async (msg) => await ai.chat(msg)}
  placeholder="输入消息..."
/>
```

### 2. 实时图表
```tsx
<RealTimeChart
  type="line"
  data={data}
  updateInterval={1000}
  color="#06b6d4"
/>
```

### 3. 拖拽列表
```tsx
<DraggableList
  items={items}
  onChange={setItems}
  onAdd={() => addItem()}
/>
```

### 4. 智能表单
```tsx
<SmartForm
  fields={formFields}
  onSubmit={handleSubmit}
  enableAI={true}
/>
```

## 🔗 示例页面路由

| 页面 | 路由 | 说明 |
|------|------|------|
| AI组件 | `/examples/ai` | 所有AI组件演示 |
| 图表 | `/examples/charts` | 实时图表示例 |
| 拖拽 | `/examples/dnd` | 拖拽排序示例 |
| 表单 | `/examples/forms` | 智能表单示例 |

## 📦 主要Props

### ChatInterface
- `messages`: 消息数组
- `onSendMessage`: 发送消息回调
- `placeholder`: 输入框占位符
- `isLoading`: 加载状态

### RealTimeChart
- `type`: 'line' | 'bar' | 'area'
- `data`: 数据点数组
- `updateInterval`: 更新间隔(ms)
- `color`: 主题颜色

### DraggableList
- `items`: 列表项数组
- `onChange`: 排序回调
- `onRemove`: 删除回调
- `showHandles`: 显示拖拽手柄

### SmartForm
- `fields`: 表单字段配置
- `onSubmit`: 提交回调
- `enableAI`: 启用AI建议
- `showProgress`: 显示进度条

### RealTimeEditor
- `content`: 编辑器内容
- `onChange`: 内容变更回调
- `connectedUsers`: 在线用户
- `autoSave`: 自动保存

### ModelViewer
- `modelUrl`: 模型URL
- `autoRotate`: 自动旋转
- `showControls`: 显示控制
- `backgroundColor`: 背景色

## 🎨 主题定制

所有组件支持赛博朋克主题色：

```typescript
// 主题颜色
const colors = {
  cyan: '#06b6d4',
  purple: '#8b5cf6',
  pink: '#ec4899',
  yellow: '#f59e0b',
  green: '#10b981'
};
```

## ⚡ 性能优化

- 使用 `React.memo` 优化重渲染
- 虚拟滚动处理大列表
- 懒加载3D模型
- 防抖/节流用户输入

## 🔧 常见配置

### TypeScript配置
```json
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

### Tailwind配置
```js
module.exports = {
  theme: {
    extend: {
      colors: {
        'cyber-cyan': '#06b6d4',
        'cyber-purple': '#8b5cf6',
        'cyber-pink': '#ec4899'
      }
    }
  }
}
```

## 📚 更多资源

- [完整文档](./NEW_COMPONENTS_GUIDE_2026.md)
- [API参考](./docs/api-reference.md)
- [最佳实践](./docs/best-practices.md)
- [迁移指南](./docs/migration-guide.md)

---

**最后更新**: 2026-03-03
**版本**: 1.0.0
