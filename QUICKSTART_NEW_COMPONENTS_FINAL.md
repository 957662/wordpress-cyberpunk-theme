# 🚀 新组件快速开始指南

> 快速上手 2026-03-03 创建的新组件

---

## 📦 安装和配置

### 1. 导入组件

```typescript
// 方式一：从索引文件导入（推荐）
import {
  // 通知系统
  NotificationProvider,
  notification,
  
  // 表单相关
  FormValidator,
  FormField,
  SubmitButton,
  rules,
  
  // 数据展示
  PricingCard,
  PollComponent,
  QuizComponent,
  
  // 标签管理
  TagManager,
  TagSelector,
  
  // 过滤和搜索
  SearchFilter,
  
  // 评论和看板
  CommentSystemEnhanced,
  KanbanBoard,
  
} from '@/components/ui/index-new-components';

// 方式二：直接导入
import { NotificationProvider } from '@/components/ui/NotificationSystem';
import { FormValidator } from '@/components/ui/FormValidator';
```

### 2. 配置 Provider

在 `app/layout.tsx` 中：

```typescript
import { NotificationProvider } from '@/components/ui';

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </body>
    </html>
  );
}
```

---

## 🎯 常用组件示例

### 通知系统

```typescript
'use client';

import { notification } from '@/components/ui';

export default function MyComponent() {
  const handleSuccess = () => {
    notification.success('操作成功！', '数据已保存');
  };
  
  const handleError = () => {
    notification.error('操作失败', '请重试');
  };
  
  return (
    <div>
      <button onClick={handleSuccess}>成功通知</button>
      <button onClick={handleError}>错误通知</button>
    </div>
  );
}
```

### 表单验证

```typescript
'use client';

import { FormValidator, FormField, SubmitButton, rules } from '@/components/ui';

export default function ContactForm() {
  const handleSubmit = async (values) => {
    await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(values)
    });
  };
  
  return (
    <FormValidator
      onSubmit={handleSubmit}
      validationRules={{
        name: [rules.required()],
        email: [rules.required(), rules.email()],
        message: [rules.required(), rules.minLength(10)]
      }}
    >
      <FormField name="name">
        {({ value, onChange, error }) => (
          <div>
            <input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="姓名"
            />
            {error && <span className="text-red-500">{error}</span>}
          </div>
        )}
      </FormField>
      
      <FormField name="email">
        {({ value, onChange, error }) => (
          <div>
            <input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="邮箱"
            />
            {error && <span className="text-red-500">{error}</span>}
          </div>
        )}
      </FormField>
      
      <SubmitButton>提交</SubmitButton>
    </FormValidator>
  );
}
```

### 定价卡片

```typescript
'use client';

import { PricingCard, PricingToggle } from '@/components/ui';
import { useState } from 'react';

export default function Pricing() {
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly');
  
  const plans = [
    {
      name: '基础版',
      price: period === 'monthly' ? '¥99' : '¥990',
      period: period === 'monthly' ? '/月' : '/年',
      features: [
        { name: '5个项目', included: true },
        { name: '10GB 存储', included: true },
        { name: '无限带宽', included: false }
      ]
    },
    {
      name: '专业版',
      price: period === 'monthly' ? '¥299' : '¥2990',
      period: period === 'monthly' ? '/月' : '/年',
      features: [
        { name: '无限项目', included: true },
        { name: '100GB 存储', included: true },
        { name: '无限带宽', included: true }
      ],
      highlighted: true
    }
  ];
  
  return (
    <div>
      <PricingToggle
        value={period}
        onChange={setPeriod}
        discount={17}
      />
      
      <PricingCard plans={plans} />
    </div>
  );
}
```

### 投票组件

```typescript
'use client';

import { PollComponent } from '@/components/ui';

export default function Poll() {
  const [votes, setVotes] = useState({
    '1': 100,
    '2': 80,
    '3': 60
  });
  
  return (
    <PollComponent
      question="你最喜欢的编程语言是？"
      type="single"
      options={[
        { id: '1', text: 'JavaScript', votes: votes['1'] },
        { id: '2', text: 'Python', votes: votes['2'] },
        { id: '3', text: 'TypeScript', votes: votes['3'] }
      ]}
      onVote={(optionIds) => {
        const id = optionIds[0];
        setVotes(prev => ({
          ...prev,
          [id]: prev[id] + 1
        }));
      }}
    />
  );
}
```

### 标签管理

```typescript
'use client';

import { TagManager } from '@/components/ui';
import { useState } from 'react';

export default function TagManagerExample() {
  const [tags, setTags] = useState([
    { id: '1', name: 'React', color: 'bg-cyber-cyan' },
    { id: '2', name: 'Vue', color: 'bg-cyber-purple' },
    { id: '3', name: 'Angular', color: 'bg-cyber-pink' }
  ]);
  
  const handleAdd = (name: string, color: string) => {
    setTags([...tags, {
      id: Date.now().toString(),
      name,
      color
    }]);
  };
  
  const handleRemove = (id: string) => {
    setTags(tags.filter(tag => tag.id !== id));
  };
  
  return (
    <TagManager
      tags={tags}
      onAdd={handleAdd}
      onRemove={handleRemove}
      allowSelection
      allowEditing
      allowCreating
    />
  );
}
```

### 看板管理

```typescript
'use client';

import { KanbanBoard } from '@/components/ui';
import { useState } from 'react';

export default function Kanban() {
  const [columns, setColumns] = useState([
    {
      id: 'todo',
      title: '待办',
      color: 'bg-cyber-cyan',
      tasks: [
        {
          id: '1',
          title: '完成项目文档',
          status: 'todo',
          priority: 'high',
          createdAt: new Date()
        }
      ]
    },
    {
      id: 'doing',
      title: '进行中',
      color: 'bg-cyber-purple',
      tasks: []
    },
    {
      id: 'done',
      title: '已完成',
      color: 'bg-cyber-green',
      tasks: []
    }
  ]);
  
  const handleTaskMove = (taskId: string, from: string, to: string) => {
    // 实现任务移动逻辑
  };
  
  return (
    <KanbanBoard
      columns={columns}
      onTaskMove={handleTaskMove}
    />
  );
}
```

---

## 🎨 样式自定义

所有组件都使用 Tailwind CSS 和赛博朋克主题：

```css
/* tailwind.config.ts */
module.exports = {
  theme: {
    extend: {
      colors: {
        'cyber-dark': '#0a0a0f',
        'cyber-cyan': '#00f0ff',
        'cyber-purple': '#9d00ff',
        'cyber-pink': '#ff0080',
        'cyber-green': '#00ff88',
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(0, 240, 255, 0.3)',
        'neon-purple': '0 0 20px rgba(157, 0, 255, 0.3)',
        'neon-pink': '0 0 20px rgba(255, 0, 128, 0.3)',
      }
    }
  }
}
```

---

## 📚 更多资源

- [完整文档](./NEW_COMPONENTS_SUMMARY_2026_03_03.md)
- [API 参考](./frontend/components/ui/)
- [示例代码](./frontend/app/examples/)

---

**最后更新**: 2026-03-03
**版本**: 1.0.0

🎉 **开始使用这些强大的新组件吧！**
