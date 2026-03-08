# CyberPress Platform - 快速参考指南

## 📖 目录

1. [验证工具](#验证工具)
2. [格式化工具](#格式化工具)
3. [分析服务](#分析服务)
4. [通知服务](#通知服务)
5. [通用组件](#通用组件)

---

## 🔐 验证工具

### 快速导入

```typescript
import { 
  isValidEmail, 
  isValidPassword, 
  FormValidator, 
  validationRules 
} from '@/lib/validation/validation';
```

### 常用验证

```typescript
// 邮箱验证
isValidEmail('user@example.com') // true

// 密码强度
isValidPassword('MyPass123!')
// { isValid: true, strength: 'strong', issues: [] }

// 手机号验证
isValidPhone('13800138000') // true

// URL 验证
isValidUrl('https://example.com') // true
```

### FormValidator 类

```typescript
const validator = new FormValidator()
  .addRule('email', validationRules.required('邮箱必填'))
  .addRule('email', validationRules.email('邮箱格式错误'))
  .addRule('password', validationRules.minLength(8, '密码至少8位'))
  .addRule('password', validationRules.maxLength(20, '密码最多20位'));

const { isValid, errors } = validator.validateForm({
  email: 'user@example.com',
  password: '12345678'
});
```

---

## 🎨 格式化工具

### 快速导入

```typescript
import { 
  formatDate, 
  formatSmartTime,
  formatFileSize,
  truncateText,
  formatKeywords
} from '@/lib/format/format';
```

### 日期时间

```typescript
// 格式化日期
formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss')
// "2024-03-08 15:30:00"

// 相对时间
formatSmartTime('2024-03-08')
// "3小时前" 或 "2024-03-08"

// 阅读时间
formatReadTime(8) // "8 分钟"
```

### 文件大小

```typescript
formatFileSize(1024) // "1.00 KB"
formatFileSize(1024 * 1024 * 5) // "5.00 MB"
```

### 文本处理

```typescript
// 截断文本
truncateText('很长的文本...', 100) // "很长的文本..."

// 关键词
formatKeywords(['React', 'Vue']) // "React, Vue"

// 手机号脱敏
formatPhone('13800138000') // "138****8000"
```

---

## 📊 分析服务

### 快速导入

```typescript
import analyticsService, { useAnalytics } from '@/services/AnalyticsService';
```

### 在组件中使用

```typescript
function MyComponent() {
  const { trackClick, trackPageView, trackSearch } = useAnalytics();

  useEffect(() => {
    trackPageView({
      path: '/blog/123',
      title: '文章标题',
    });
  }, []);

  const handleClick = () => {
    trackClick('button', '购买按钮');
  };

  const handleSearch = (query: string) => {
    trackSearch(query, 10); // 搜索词，结果数量
  };

  return <button onClick={handleClick}>购买</button>;
}
```

### 高阶组件

```typescript
import { withPageTracking } from '@/services/AnalyticsService';

export default withPageTracking(MyPage, '页面标题');
```

---

## 🔔 通知服务

### 快速导入

```typescript
import notificationService, { useNotification } from '@/services/NotificationService';
```

### 在组件中使用

```typescript
function MyComponent() {
  const { showSuccess, showError, showWarning, showConfirm } = useNotification();

  const handleSave = async () => {
    try {
      await saveData();
      showSuccess('成功', '数据已保存');
    } catch (error) {
      showError('错误', '保存失败');
    }
  };

  const handleDelete = async () => {
    const confirmed = await showConfirm('确认删除', '此操作不可撤销');
    if (confirmed) {
      deleteItem();
    }
  };

  return <button onClick={handleSave}>保存</button>;
}
```

### 通知类型

```typescript
// 成功通知
showSuccess('成功', '操作成功');

// 错误通知
showError('错误', '操作失败');

// 警告通知
showWarning('警告', '请注意');

// 信息通知
showInfo('提示', '这是一条提示');

// 确认对话框
const confirmed = await showConfirm('确认', '确定要执行此操作吗？');
```

---

## 🎴 徽章组件

### 快速导入

```typescript
import { 
  CyberBadge, 
  StatusBadge, 
  CountBadge, 
  VersionBadge,
  TrendBadge 
} from '@/components/common/CyberBadge';
```

### 基础徽章

```typescript
// 不同变体
<CyberBadge variant="success">成功</CyberBadge>
<CyberBadge variant="error">错误</CyberBadge>
<CyberBadge variant="warning">警告</CyberBadge>
<CyberBadge variant="info">信息</CyberBadge>
<CyberBadge variant="neon">霓虹</CyberBadge>

// 不同尺寸
<CyberBadge size="sm">小</CyberBadge>
<CyberBadge size="md">中</CyberBadge>
<CyberBadge size="lg">大</CyberBadge>

// 发光效果
<CyberBadge variant="neon" glow>发光徽章</CyberBadge>

// 脉冲点
<CyberBadge dot>新消息</CyberBadge>
```

### 特殊徽章

```typescript
// 状态徽章
<StatusBadge status="online" /> // 在线
<StatusBadge status="offline" /> // 离线
<StatusBadge status="away" /> // 离开
<StatusBadge status="busy" /> // 忙碌

// 计数徽章
<CountBadge count={5} />
<CountBadge count={100} max={99} /> // 99+

// 版本徽章
<VersionBadge version="1.0.0" type="stable" />
<VersionBadge version="2.0.0" type="beta" />
<VersionBadge version="3.0.0" type="alpha" />

// 趋势徽章
<TrendBadge value={15} /> // ↑ 15%
<TrendBadge value={-10} /> // ↓ 10%
```

---

## 👤 头像组件

### 快速导入

```typescript
import { CyberAvatar, AvatarGroup } from '@/components/common/CyberAvatar';
```

### 基础头像

```typescript
// 带图片
<CyberAvatar 
  src="/avatar.jpg" 
  alt="用户名" 
  size="lg" 
/>

// 带状态
<CyberAvatar 
  src="/avatar.jpg" 
  alt="用户名" 
  status="online" 
/>

// 带边框和发光
<CyberAvatar 
  src="/avatar.jpg" 
  bordered 
  glow 
/>

// 不同形状
<CyberAvatar shape="circle" /> // 圆形
<CyberAvatar shape="square" /> // 方形
<CyberAvatar shape="rounded" /> // 圆角

// 首字母缩写
<CyberAvatar fallback="AB" />
```

### 头像组

```typescript
<AvatarGroup 
  avatars={[
    { src: '/avatar1.jpg', alt: '用户1' },
    { src: '/avatar2.jpg', alt: '用户2' },
    { src: '/avatar3.jpg', alt: '用户3' },
  ]} 
  max={3} 
  size="md" 
/>
```

---

## 📊 进度条组件

### 快速导入

```typescript
import { 
  CyberProgress, 
  CircularProgress, 
  StepProgress 
} from '@/components/common/CyberProgress';
```

### 线性进度条

```typescript
// 基础用法
<CyberProgress value={75} max={100} />

// 显示百分比
<CyberProgress value={75} showPercentage />

// 不同颜色
<CyberProgress value={75} color="cyan" />
<CyberProgress value={75} color="purple" />
<CyberProgress value={75} color="pink" />

// 不同变体
<CyberProgress value={75} variant="neon" />
<CyberProgress value={75} variant="glow" />
<CyberProgress value={75} variant="striped" />

// 不同尺寸
<CyberProgress value={75} size="sm" />
<CyberProgress value={75} size="md" />
<CyberProgress value={75} size="lg" />
```

### 圆形进度条

```typescript
// 基础用法
<CircularProgress value={75} />

// 自定义大小
<CircularProgress value={75} size={120} />

// 不同颜色
<CircularProgress value={75} color="purple" />

// 不显示百分比
<CircularProgress value={75} showPercentage={false} />
```

### 步骤进度条

```typescript
<StepProgress 
  steps={[
    { label: '第一步', description: '填写信息' },
    { label: '第二步', description: '确认订单' },
    { label: '完成', description: '支付成功' },
  ]} 
  currentStep={1} 
/>
```

---

## 💡 实用示例

### 表单验证 + 通知

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { CyberButton } from '@/components/ui';
import { CyberInput } from '@/components/ui';
import { useNotification } from '@/services/NotificationService';
import { FormValidator, validationRules } from '@/lib/validation/validation';

export default function ContactForm() {
  const { showSuccess, showError } = useNotification();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    // 验证
    const validator = new FormValidator()
      .addRule('email', validationRules.required())
      .addRule('email', validationRules.email())
      .addRule('message', validationRules.minLength(10));

    const result = validator.validateForm(data);

    if (!result.isValid) {
      showError('表单错误', Object.values(result.errors).flat().join('\n'));
      return;
    }

    try {
      await submitForm(data);
      showSuccess('成功', '消息已发送');
    } catch (error) {
      showError('错误', '发送失败');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CyberInput {...register('email')} placeholder="邮箱" />
      <CyberInput {...register('message')} placeholder="消息" />
      <CyberButton type="submit">发送</CyberButton>
    </form>
  );
}
```

### 分析追踪 + 格式化

```typescript
'use client';

import { useEffect } from 'react';
import { useAnalytics } from '@/services/AnalyticsService';
import { formatDate, formatReadTime } from '@/lib/format/format';

export default function BlogPost({ post }: { post: any }) {
  const { trackPageView, trackContentView } = useAnalytics();

  useEffect(() => {
    trackPageView({
      path: `/blog/${post.slug}`,
      title: post.title,
    });

    trackContentView('blog', post.id, post.title);
  }, [post]);

  return (
    <article>
      <h1>{post.title}</h1>
      <div className="text-gray-400">
        <span>{formatDate(post.date, 'yyyy-MM-dd')}</span>
        <span>·</span>
        <span>{formatReadTime(post.readTime)}</span>
      </div>
      {/* ... */}
    </article>
  );
}
```

---

## 🎯 最佳实践

### 1. 类型安全

```typescript
// ✅ 好 - 使用类型
interface FormData {
  email: string;
  password: string;
}

const validator = new FormValidator()
  .addRule('email', validationRules.email())
  .addRule('password', validationRules.minLength(8));

// ❌ 不好 - 不使用类型
const validator = new FormValidator()
  .addRule('email', 'email') // 字符串没有类型检查
```

### 2. 错误处理

```typescript
// ✅ 好 - 完整的错误处理
try {
  await operation();
  showSuccess('成功', '操作完成');
} catch (error) {
  console.error(error);
  showError('错误', '操作失败');
}

// ❌ 不好 - 没有错误处理
await operation();
showSuccess('成功', '操作完成');
```

### 3. 性能优化

```typescript
// ✅ 好 - 使用防抖
import { debounce } from '@/lib/utils/performance';

const debouncedSearch = debounce((query: string) => {
  performSearch(query);
}, 300);

// ❌ 不好 - 每次输入都搜索
const handleSearch = (query: string) => {
  performSearch(query); // 频繁调用
};
```

---

## 📚 相关文档

- [完整开发报告](./DEVELOPMENT_TASKS_COMPLETED.md)
- [项目 README](./README.md)
- [组件文档](./COMPONENTS.md)

---

**最后更新**: 2026-03-08  
**版本**: 1.0.0
