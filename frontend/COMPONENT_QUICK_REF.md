# CyberPress 组件快速参考

## 🎨 UI 组件

### 基础组件

```tsx
// Button 按钮
import { Button } from '@/components/ui/Button';

<Button variant="primary" size="md" isLoading={false}>
  点击我
</Button>

// variants: primary | secondary | outline | ghost | danger
// sizes: sm | md | lg
```

```tsx
// Card 卡片
import { Card } from '@/components/ui/Card';

<Card variant="neon" glowColor="cyan" hover={true}>
  <h3>标题</h3>
  <p>内容</p>
</Card>

// variants: default | neon | glass | hologram
// glowColor: cyan | purple | pink | yellow
```

```tsx
// Input 输入框
import { Input } from '@/components/ui/Input';

<Input
  type="text"
  placeholder="请输入..."
  label="用户名"
  error="错误信息"
  disabled={false}
/>

// types: text | email | password | number | tel | url
```

```tsx
// Modal 模态框
import { Modal } from '@/components/ui/Modal';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="标题"
  size="md"
>
  <p>内容</p>
</Modal>

// sizes: sm | md | lg | xl | full
```

```tsx
// Badge 徽章
import { Badge } from '@/components/ui/Badge';

<Badge variant="primary" size="md" glow={true}>
  标签
</Badge>

// variants: default | primary | secondary | success | warning | danger | info
// sizes: sm | md | lg
```

```tsx
// Avatar 头像
import { Avatar } from '@/components/ui/Avatar';

<Avatar
  src="/avatar.jpg"
  alt="用户名"
  size="md"
  variant="circle"
  status="online"
  fallback="UN"
/>

// sizes: xs | sm | md | lg | xl | 2xl
// variants: circle | square | rounded
// status: online | offline | away | busy
```

### 表单组件

```tsx
// Select 选择器
import { Select } from '@/components/ui/Select';

<Select
  options={[
    { label: '选项1', value: '1' },
    { label: '选项2', value: '2' },
  ]}
  value={value}
  onChange={setValue}
  placeholder="请选择"
/>

// Select 下拉菜单
import { Dropdown, type DropdownOption } from '@/components/ui/Dropdown';

const options: DropdownOption[] = [
  { label: '选项1', value: '1', onClick: () => {} },
  { label: '选项2', value: '2', onClick: () => {} },
  { separator: true },
  { label: '选项3', value: '3', disabled: true },
];

<Dropdown trigger={<button>菜单</button>} options={options} />
```

```tsx
// Tabs 标签页
import { Tabs } from '@/components/ui/Tabs';

<Tabs
  tabs={[
    { id: '1', label: '标签1', content: <div>内容1</div> },
    { id: '2', label: '标签2', content: <div>内容2</div> },
  ]}
  variant="default"
  size="md"
  onChange={(tabId) => console.log(tabId)}
/>

// variants: default | pills | underline
// sizes: sm | md | lg
```

```tsx
// Progress 进度条
import { Progress, CircularProgress } from '@/components/ui/Progress';

<Progress value={75} max={100} variant="cyan" glow showLabel />
<CircularProgress value={75} size={120} strokeWidth={8} variant="cyan" />

// variants: default | cyan | purple | pink | green | yellow
```

```tsx
// Tooltip 工具提示
import { Tooltip } from '@/components/ui/Tooltip';

<Tooltip content="提示文字" position="top" delay={200}>
  <button>悬停查看</button>
</Tooltip>

// positions: top | bottom | left | right
```

## ✨ 特效组件

```tsx
// GlitchText 故障文字
import { GlitchText } from '@/components/effects/GlitchText';

<GlitchText text="CYBERPRESS" speed="normal" />

// speed: slow | normal | fast
```

```tsx
// NeonBorder 霓虹边框
import { NeonBorder } from '@/components/effects/NeonBorder';

<NeonBorder color="cyan" intensity="medium" animated={true}>
  <div>内容</div>
</NeonBorder>

// color: cyan | purple | pink | yellow
// intensity: low | medium | high
```

```tsx
// ParticleBackground 粒子背景
import { ParticleBackground } from '@/components/effects/ParticleBackground';

<ParticleBackground count={50} color="cyan" speed="normal" />

// color: cyan | purple | pink
// speed: slow | normal | fast
```

```tsx
// HologramCard 全息卡片
import { HologramCard } from '@/components/effects/HologramCard';

<HologramCard intensity="medium" scanline={true}>
  <div>内容</div>
</HologramCard>

// intensity: low | medium | high
```

## 📝 博客组件

```tsx
// BlogCard 博客卡片
import { BlogCard } from '@/components/blog/BlogCard';

<BlogCard
  post={{
    id: 1,
    title: { rendered: '文章标题' },
    excerpt: { rendered: '文章摘要' },
    date: '2024-01-01',
    slug: 'post-slug',
    _embedded: {
      'wp:featuredmedia': [{ source_url: '/image.jpg' }],
      'wp:term': [[{ id: 1, name: '分类', slug: 'category' }]],
    },
  }}
/>
```

```tsx
// TableOfContents 目录
import { TableOfContents } from '@/components/blog/TableOfContents';

<TableOfContents
  headings={[
    { id: 'h1', text: '标题1', level: 2 },
    { id: 'h2', text: '标题2', level: 3 },
  ]}
  activeId="h1"
/>
```

```tsx
// ReadingProgress 阅读进度
import { ReadingProgress } from '@/components/blog/ReadingProgress';

<ReadingProgress variant="top" color="cyan" thickness={3} />
```

## 🔧 自定义 Hooks

```tsx
// useLocalStorage 本地存储
import { useLocalStorage } from '@/hooks/useLocalStorage';

const [value, setValue, removeValue] = useLocalStorage('key', 'default');
```

```tsx
// useDebounce 防抖
import { useDebounce } from '@/hooks/useDebounce';

const debouncedValue = useDebounce(value, 500);
```

```tsx
// useInfiniteScroll 无限滚动
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

const { ref, isLoading } = useInfiniteScroll({
  onLoadMore: () => fetchMore(),
  hasMore: true,
});
```

```tsx
// useCopyToClipboard 复制到剪贴板
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

const { copy, copied } = useCopyToClipboard();
copy('文本');
```

```tsx
// useInView 视口检测
import { useInView } from '@/hooks/useInView';

const { ref, inView } = useInView({
  threshold: 0.5,
  triggerOnce: true,
});
```

```tsx
// useAuth 认证
import { useAuth } from '@/hooks/useAuth';

const { user, isAuthenticated, login, logout } = useAuth();
```

## 🛠️ 工具函数

```tsx
// cn 类名合并
import { cn } from '@/lib/utils';

const className = cn('class1', 'class2', condition && 'class3');
```

```tsx
// formatNumber 格式化数字
import { formatNumber } from '@/lib/utils';

formatNumber(1500); // "1.5k"
```

```tsx
// truncateText 截断文本
import { truncateText } from '@/lib/utils';

truncateText('很长的文本...', 10); // "很长的文本..."
```

```tsx
// formatDate 格式化日期
import { formatDate } from '@/lib/utils';

formatDate(new Date()); // "2024年1月1日"
```

```tsx
// formatDistanceToNow 相对时间
import { formatDistanceToNow } from '@/lib/utils';

formatDistanceToNow(new Date()); // "刚刚"
```

## 🎯 常用模式

### 带加载状态的按钮
```tsx
<Button
  isLoading={isLoading}
  loadingText="提交中..."
  onClick={handleSubmit}
>
  提交
</Button>
```

### 带验证的表单
```tsx
import { useForm } from '@/hooks/useForm';

const { values, errors, touched, handleChange, handleSubmit } = useForm({
  initialValues: { email: '' },
  validate: (values) => {
    const errors = {};
    if (!values.email) errors.email = '请输入邮箱';
    return errors;
  },
  onSubmit: async (values) => {
    await submit(values);
  },
});
```

### 数据获取
```tsx
import { usePosts } from '@/hooks/usePosts';

const { data, isLoading, error } = usePosts({
  page: 1,
  perPage: 10,
});

if (isLoading) return <Spinner />;
if (error) return <div>加载失败</div>;
return <PostList posts={data} />;
```

### 响应式布局
```tsx
import { useBreakpoint } from '@/hooks/useBreakpoint';

const { isMobile, isTablet, isDesktop } = useBreakpoint();

return (
  <div>
    {isMobile && <MobileView />}
    {isTablet && <TableView />}
    {isDesktop && <DesktopView />}
  </div>
);
```

## 🎨 主题配置

```tsx
// 使用主题色
<div className="bg-cyber-dark text-cyber-cyan border-cyber-border">
  内容
</div>

// 霓虹发光效果
<div className="shadow-neon-cyan">内容</div>
<div className="shadow-neon-purple">内容</div>
<div className="shadow-neon-pink">内容</div>

// 文字发光
<div className="text-glow-cyan">发光文字</div>
<div className="text-glow-purple">发光文字</div>

// 边框发光
<div className="border-glow-cyan">边框发光</div>
```

## 📱 完整示例

### 博客文章页面
```tsx
import { BlogCard } from '@/components/blog/BlogCard';
import { Button } from '@/components/ui/Button';
import { usePosts } from '@/hooks/usePosts';

export default function BlogPage() {
  const { data, isLoading, fetchMore } = usePosts();

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold mb-8 text-glow-cyan">博客</h1>

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data?.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}

      <Button
        className="mt-8"
        onClick={fetchMore}
        isLoading={isLoading}
      >
        加载更多
      </Button>
    </div>
  );
}
```

### 登录表单
```tsx
import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email, password });
  };

  return (
    <Card variant="neon" className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold text-cyber-cyan">登录</h2>

        <Input
          type="email"
          label="邮箱"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="请输入邮箱"
          required
        />

        <Input
          type="password"
          label="密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="请输入密码"
          required
        />

        <Button
          type="submit"
          className="w-full"
          isLoading={isLoading}
        >
          登录
        </Button>
      </form>
    </Card>
  );
}
```

---

**更新时间**: 2026-03-06
**版本**: 1.0.0
