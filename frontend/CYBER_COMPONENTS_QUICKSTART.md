# 赛博朋克组件快速开始指南

> 快速上手新创建的赛博朋克风格组件

## 📋 前置要求

- Node.js 18+
- Next.js 14+
- React 18+
- TypeScript 5+

## 🚀 安装步骤

### 1. 确保依赖已安装

```bash
npm install framer-motion lucide-react clsx tailwind-merge
```

### 2. 配置 Tailwind CSS

确保 `tailwind.config.ts` 包含赛博朋克颜色：

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  theme: {
    extend: {
      colors: {
        'cyber-dark': '#0a0a0f',
        'cyber-cyan': '#00f0ff',
        'cyber-purple': '#9d00ff',
        'cyber-pink': '#ff0080',
        'cyber-green': '#00ff88',
        'cyber-yellow': '#f0ff00',
      },
    },
  },
}
export default config
```

## 📦 组件使用示例

### CyberSelect - 选择器

```tsx
'use client';

import { useState } from 'react';
import { CyberSelect, SelectOption } from '@/components/forms/CyberSelect';

export default function MyComponent() {
  const [value, setValue] = useState<string>('');

  const options: SelectOption[] = [
    { value: '1', label: '选项 1' },
    { value: '2', label: '选项 2' },
    { value: '3', label: '选项 3' },
  ];

  return (
    <div className="p-4">
      <CyberSelect
        label="选择一个选项"
        options={options}
        value={value}
        onChange={setValue}
        placeholder="请选择"
        color="cyan"
        searchable
      />
    </div>
  );
}
```

### CyberToggle - 切换开关

```tsx
'use client';

import { useState } from 'react';
import { CyberToggle } from '@/components/ui/toggle/CyberToggle';

export default function MyComponent() {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="p-4">
      <CyberToggle
        checked={enabled}
        onChange={setEnabled}
        color="cyan"
        size="md"
        label="启用功能"
      />
    </div>
  );
}
```

### ActivityChart - 活动图表

```tsx
'use client';

import { ActivityChart } from '@/components/dashboard/ActivityChart';

export default function MyComponent() {
  const data = [
    { date: '2026-03-01', value: 100 },
    { date: '2026-03-02', value: 150 },
    { date: '2026-03-03', value: 120 },
    { date: '2026-03-04', value: 180 },
    { date: '2026-03-05', value: 200 },
  ];

  return (
    <div className="p-4">
      <ActivityChart
        data={data}
        color="cyan"
        height={200}
        showArea
        showDots
        showGrid
        smooth
      />
    </div>
  );
}
```

### 使用工具函数

```tsx
import {
  cn,
  formatCyberDate,
  calculateReadingTime,
  generateCyberId,
  getCyberColor,
} from '@/lib/utils/cyber-helpers';

export default function MyComponent() {
  // 合并类名
  const className = cn('px-4', 'py-2', 'bg-cyber-cyan');

  // 格式化日期
  const dateStr = formatCyberDate(new Date()); // "刚刚"

  // 计算阅读时间
  const readingTime = calculateReadingTime('文章内容...'); // "5 分钟"

  // 生成唯一ID
  const id = generateCyberId('post'); // "POST_xxx_xxx"

  // 获取颜色样式
  const colors = getCyberColor('cyan');
  console.log(colors.primary); // "#00f0ff"

  return <div className={className}>Hello</div>;
}
```

### 使用主题Hook

```tsx
'use client';

import { useCyberTheme } from '@/hooks/useCyberTheme';

export default function MyComponent() {
  const { theme, setColor, toggleDarkMode, colorStyles } = useCyberTheme();

  return (
    <div className="p-4">
      <button onClick={() => setColor('purple')}>
        紫色主题
      </button>

      <button onClick={toggleDarkMode}>
        切换暗色模式
      </button>

      <p style={{ color: colorStyles.primary }}>
        当前颜色: {theme.color}
      </p>
    </div>
  );
}
```

### 使用动画Hook

```tsx
'use client';

import { useCyberTypewriter, useCyberProgress } from '@/hooks/useCyberAnimation';

export default function MyComponent() {
  // 打字机效果
  const { currentText } = useCyberTypewriter(
    ['赛博朋克', '组件库', '展示'],
    { duration: 150, delay: 2000 }
  );

  // 进度动画
  const { progress, isComplete, reset } = useCyberProgress(2000);

  return (
    <div className="p-4">
      <h1 className="text-2xl">{currentText}</h1>

      <div className="w-full h-2 bg-gray-800 rounded">
        <div
          className="h-full bg-cyber-cyan"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p>{Math.round(progress)}%</p>

      {isComplete && (
        <button onClick={reset}>重新播放</button>
      )}
    </div>
  );
}
```

## 🎨 完整示例页面

创建 `app/demo/page.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { CyberSelect } from '@/components/forms/CyberSelect';
import { CyberToggle } from '@/components/ui/toggle/CyberToggle';
import { ActivityChart } from '@/components/dashboard/ActivityChart';
import { useCyberTheme, useCyberTypewriter } from '@/hooks';
import { cn } from '@/lib/utils';

export default function DemoPage() {
  const { theme, setColor } = useCyberTheme();
  const { currentText } = useCyberTypewriter(['演示', '页面'], { duration: 200 });

  const [selectValue, setSelectValue] = useState('');
  const [toggleValue, setToggleValue] = useState(false);

  const chartData = [
    { date: '2026-03-01', value: 100 },
    { date: '2026-03-02', value: 150 },
    { date: '2026-03-03', value: 120 },
  ];

  return (
    <div className="min-h-screen bg-cyber-dark p-8">
      <h1 className="text-4xl font-bold text-cyber-cyan mb-8">
        {currentText}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 选择器 */}
        <div className="bg-cyber-card p-6 rounded-lg border border-cyber-cyan/30">
          <h2 className="text-xl font-bold mb-4">选择器</h2>
          <CyberSelect
            options={[
              { value: '1', label: '选项 1' },
              { value: '2', label: '选项 2' },
            ]}
            value={selectValue}
            onChange={setSelectValue}
            color="cyan"
          />
        </div>

        {/* 切换开关 */}
        <div className="bg-cyber-card p-6 rounded-lg border border-cyber-purple/30">
          <h2 className="text-xl font-bold mb-4">切换开关</h2>
          <CyberToggle
            checked={toggleValue}
            onChange={setToggleValue}
            color="purple"
            label="启用功能"
          />
        </div>

        {/* 图表 */}
        <div className="md:col-span-2 bg-cyber-card p-6 rounded-lg border border-cyber-green/30">
          <h2 className="text-xl font-bold mb-4">活动图表</h2>
          <ActivityChart
            data={chartData}
            color="green"
            height={200}
            showArea
            smooth
          />
        </div>
      </div>

      {/* 主题切换 */}
      <div className="mt-8 flex gap-4">
        <button
          onClick={() => setColor('cyan')}
          className={cn(
            'px-6 py-3 rounded-lg transition-all',
            theme.color === 'cyan' ? 'bg-cyber-cyan text-black' : 'bg-cyber-cyan/20 text-cyber-cyan'
          )}
        >
          青色
        </button>
        <button
          onClick={() => setColor('purple')}
          className={cn(
            'px-6 py-3 rounded-lg transition-all',
            theme.color === 'purple' ? 'bg-cyber-purple text-white' : 'bg-cyber-purple/20 text-cyber-purple'
          )}
        >
          紫色
        </button>
      </div>
    </div>
  );
}
```

## 🧪 测试

运行测试：

```bash
# 运行所有测试
npm test

# 运行特定测试文件
npm test cyber-components

# 查看覆盖率
npm run test:coverage
```

## 📚 更多资源

- [完整文档](./NEW_COMPONENTS_REPORT.md)
- [组件展示页面](/showcase/cyber-components)
- [项目README](./README.md)
- [开发指南](./DEVELOPMENT_GUIDE.md)

## 🐛 常见问题

### 1. 组件样式不显示

确保 Tailwind CSS 配置正确，并且 `globals.css` 包含了赛博朋克主题样式。

### 2. 动画不流畅

检查是否正确安装了 `framer-motion`，并且浏览器支持硬件加速。

### 3. TypeScript 报错

确保所有依赖都已安装，并且 `tsconfig.json` 配置正确。

### 4. Hook 不能在服务端使用

所有带 `'use client'` 指令的组件和 Hook 只能在客户端使用。

## 💡 最佳实践

1. **颜色选择**: 为不同功能选择合适的颜色
   - Cyan: 主要操作
   - Purple: 次要功能
   - Pink: 警告和强调
   - Green: 成功状态
   - Yellow: 警告提示

2. **动画使用**: 保持动画简洁流畅
   - 过渡时长: 200-300ms
   - 使用 spring 动画
   - 避免过度动画

3. **性能优化**:
   - 使用 React.memo
   - 懒加载组件
   - 优化大列表渲染

4. **可访问性**:
   - 添加 ARIA 标签
   - 支持键盘导航
   - 提供文本替代

---

**创建时间**: 2026-03-08
**版本**: 1.0.0
