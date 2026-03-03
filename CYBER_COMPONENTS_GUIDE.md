# CyberPress Platform - 赛博朋克组件使用指南

## 📦 创建日期
2026-03-03

## 🎨 新增组件概览

本次开发会话新增了 **6 个核心赛博朋克风格组件**、**1 个实用工具库**、**1 个自定义 Hooks 库**、**1 个 API 服务**和**1 个类型定义文件**，总计 11 个文件，约 **2500+ 行代码**。

---

## 🚀 组件列表

### 1. CyberButton (赛博朋克按钮)

**文件路径**: `frontend/components/cyber/cyber-button.tsx`

**功能特性**:
- 4 种变体: `neon`, `glitch`, `holographic`, `plasma`
- 3 种尺寸: `sm`, `md`, `lg`
- 光晕效果
- 扫描线动画
- 故障效果动画
- 悬浮缩放效果

**使用示例**:
```tsx
import { CyberButton } from '@/components/cyber';

// 基础使用
<CyberButton variant="neon" size="md">
  点击我
</CyberButton>

// 带扫描效果
<CyberButton variant="neon" size="lg" scanEffect>
  扫描按钮
</CyberButton>

// 故障效果
<CyberButton variant="glitch">
  故障按钮
</CyberButton>

// 全息效果
<CyberButton variant="holographic">
  全息按钮
</CyberButton>
```

---

### 2. CyberCard (赛博朋克卡片)

**文件路径**: `frontend/components/cyber/cyber-card.tsx`

**功能特性**:
- 4 种变体: `glass`, `neon`, `holographic`, `solid`
- 3D 悬浮效果
- 光晕动画
- 扫描线效果
- 装饰角标
- 可点击交互

**使用示例**:
```tsx
import { CyberCard } from '@/components/cyber';

// 玻璃效果卡片
<CyberCard variant="glass" hover3D>
  <h3>标题</h3>
  <p>内容</p>
</CyberCard>

// 霓虹效果卡片
<CyberCard variant="neon" glowOnHover>
  <h3>标题</h3>
  <p>内容</p>
</CyberCard>

// 可点击卡片
<CyberCard
  variant="holographic"
  clickable
  onClick={() => console.log('clicked')}
>
  <h3>标题</h3>
  <p>内容</p>
</CyberCard>
```

---

### 3. CyberInput (赛博朋克输入框)

**文件路径**: `frontend/components/cyber/cyber-input.tsx`

**功能特性**:
- 3 种变体: `neon`, `glass`, `underline`
- 浮动标签动画
- 图标支持
- 密码显示/隐藏
- 错误状态显示
- 光晕聚焦效果

**使用示例**:
```tsx
import { CyberInput } from '@/components/cyber';
import { User, Mail, Lock } from 'lucide-react';

// 带图标的输入框
<CyberInput
  label="用户名"
  icon={<User />}
  variant="neon"
  placeholder="请输入用户名"
/>

// 邮箱输入
<CyberInput
  label="邮箱"
  icon={<Mail />}
  variant="glass"
  type="email"
/>

// 密码输入
<CyberInput
  label="密码"
  icon={<Lock />}
  variant="underline"
  type="password"
  showPasswordToggle
/>

// 带错误状态
<CyberInput
  label="邮箱"
  variant="neon"
  error="请输入有效的邮箱地址"
/>
```

---

### 4. ParticleBackground (粒子背景)

**文件路径**: `frontend/components/effects/particle-background.tsx`

**功能特性**:
- 可自定义粒子数量
- 粒子连接线
- 鼠标交互效果
- 多种颜色方案
- 自动边界检测

**使用示例**:
```tsx
import { ParticleBackground } from '@/components/effects/particle-background';

<div className="relative min-h-screen">
  <ParticleBackground
    particleCount={80}
    connectionDistance={120}
    mouseInteraction={true}
    color="cyan"
  />
  <div className="relative z-10">
    {/* 页面内容 */}
  </div>
</div>
```

---

### 5. CyberChart (赛博朋克图表)

**文件路径**: `frontend/components/data-viz/cyber-chart.tsx`

**功能特性**:
- 4 种图表类型: `line`, `bar`, `area`, `gradient`
- 4 种颜色方案
- 背景网格
- 数据点动画
- 工具提示支持
- 响应式设计

**使用示例**:
```tsx
import { CyberChart } from '@/components/data-viz/cyber-chart';

const data = [10, 25, 40, 30, 55, 45, 60];
const labels = ['1月', '2月', '3月', '4月', '5月', '6月', '7月'];

// 折线图
<CyberChart
  data={data}
  labels={labels}
  type="line"
  color="cyan"
  height={300}
  showGrid
/>

// 区域图
<CyberChart
  data={data}
  labels={labels}
  type="area"
  color="purple"
  height={300}
/>

// 柱状图
<CyberChart
  data={data}
  labels={labels}
  type="bar"
  color="pink"
  height={300}
/>
```

---

### 6. CyberLoader (赛博朋克加载动画)

**文件路径**: `frontend/components/loading/cyber-loader.tsx`

**功能特性**:
- 5 种动画类型: `spinner`, `dots`, `pulse`, `scan`, `matrix`
- 3 种尺寸
- 4 种颜色方案
- 全屏模式支持
- 进度条显示
- 自定义文本

**使用示例**:
```tsx
import { CyberLoader } from '@/components/loading/cyber-loader';

// 基础加载器
<CyberLoader variant="spinner" color="cyan" size="md" />

// 带文本
<CyberLoader
  variant="dots"
  color="purple"
  text="加载中..."
/>

// 带进度
<CyberLoader
  variant="scan"
  color="pink"
  text="处理中..."
  progress={75}
/>

// 全屏加载器
<CyberLoader
  variant="matrix"
  color="cyan"
  text="初始化中..."
  fullscreen
/>
```

---

## 🔧 工具库

### Cyber Utils (赛博朋克工具函数)

**文件路径**: `frontend/lib/cyber-utils.ts`

**功能特性**:
- 数字格式化
- 时间格式化
- ID 生成
- 渐变创建
- 防抖/节流
- 深度克隆
- 颜色插值
- 文件大小格式化
- 等等...

**使用示例**:
```typescript
import {
  formatCyberNumber,
  formatCyberTime,
  generateCyberId,
  createCyberGradient,
  debounce,
  throttle
} from '@/lib/cyber-utils';

// 格式化数字
formatCyberNumber(1234567); // "1.23M"

// 格式化时间
formatCyberTime(new Date()); // "5m ago"

// 生成唯一ID
generateCyberId('user'); // "user_123456789_abc123"

// 创建渐变
createCyberGradient(['#00f0ff', '#9d00ff'], 135);

// 防抖函数
const debouncedSearch = debounce(searchFunction, 500);
```

---

## 🎣 自定义 Hooks

### Use Cyber Animations (赛博朋克动画 Hooks)

**文件路径**: `frontend/hooks/use-cyber-animations.ts`

**包含的 Hooks**:
- `useCyberScroll` - 滚动动画
- `useCyberMouse` - 鼠标跟踪
- `useCyberTypewriter` - 打字机效果
- `useCyberGlitch` - 故障效果
- `useCyberParticles` - 粒子效果
- `useCyberCounter` - 计数动画
- `useCyberCountdown` - 倒计时
- `useCyberStorage` - 本地存储
- `useCyberMediaQuery` - 媒体查询
- `useCyberAsync` - 异步状态
- `useCyberDebounce` - 防抖值

**使用示例**:
```tsx
import {
  useCyberScroll,
  useCyberTypewriter,
  useCyberCounter
} from '@/hooks/use-cyber-animations';

// 滚动动画
function MyComponent() {
  const { isVisible, elementRef } = useCyberScroll(0.2);

  return (
    <div ref={elementRef}>
      {isVisible && <div>内容已显示</div>}
    </div>
  );
}

// 打字机效果
function Title() {
  const { displayedText } = useCyberTypewriter('Hello Cyberpunk!', 100);
  return <h1>{displayedText}</h1>;
}

// 计数动画
function Counter() {
  const { count, startCounting } = useCyberCounter(1000, 2000);
  useEffect(() => startCounting(), []);
  return <div>{count}</div>;
}
```

---

## 🌐 API 服务

### Cyber API (赛博朋克 API 客户端)

**文件路径**: `frontend/services/api/cyber-api.ts`

**功能特性**:
- 统一的 API 调用接口
- 自动错误处理
- 令牌管理
- 请求/响应拦截
- 类型安全

**API 模块**:
- `authApi` - 认证相关
- `postsApi` - 文章相关
- `categoriesApi` - 分类相关
- `tagsApi` - 标签相关
- `commentsApi` - 评论相关
- `usersApi` - 用户相关
- `searchApi` - 搜索相关
- `healthApi` - 健康检查

**使用示例**:
```tsx
import { useCyberApi } from '@/services/api/cyber-api';

function MyComponent() {
  const api = useCyberApi();

  const fetchPosts = async () => {
    try {
      const response = await api.posts.list({ page: 1, limit: 10 });
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const login = async () => {
    try {
      const response = await api.auth.login('user@example.com', 'password');
      console.log(response.data.token);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div>
      <button onClick={fetchPosts}>获取文章</button>
      <button onClick={login}>登录</button>
    </div>
  );
}
```

---

## 📋 类型定义

### Cyber Types (赛博朋克类型定义)

**文件路径**: `frontend/types/cyber-types.ts`

**包含的类型**:
- `CyberUser` - 用户类型
- `CyberPost` - 文章类型
- `CyberCategory` - 分类类型
- `CyberTag` - 标签类型
- `CyberComment` - 评论类型
- `CyberMedia` - 媒体类型
- `CyberProject` - 项目类型
- `CyberApiResponse` - API 响应类型
- `CyberPagination` - 分页类型
- `CyberNotification` - 通知类型
- 等等...

**使用示例**:
```tsx
import type {
  CyberUser,
  CyberPost,
  CyberApiResponse
} from '@/types/cyber-types';

interface Props {
  user: CyberUser;
  posts: CyberPost[];
}

function MyComponent({ user, posts }: Props) {
  return (
    <div>
      <h1>{user.name}</h1>
      {posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

---

## 🎨 示例页面

### 赛博朋克组件展示页

**访问路径**: `/examples/cyber-components`

**页面功能**:
- 展示所有新增组件
- 实时交互演示
- 响应式布局
- 粒子背景效果
- 打字机动画
- 计数动画

**启动方式**:
```bash
cd frontend
npm run dev
```

然后访问: `http://localhost:3000/examples/cyber-components`

---

## 📊 组件统计

| 类别 | 数量 | 代码行数 |
|------|------|----------|
| 组件 | 6 | ~1200 |
| 工具库 | 1 | ~400 |
| Hooks | 11 | ~400 |
| API 服务 | 1 | ~400 |
| 类型定义 | 1 | ~500 |
| 页面 | 1 | ~300 |
| **总计** | **21** | **~3200** |

---

## 🎯 设计特点

### 赛博朋克美学
- **深色主题**: 基于深空黑 (#0a0a0f)
- **霓虹配色**: 青色、紫色、粉色
- **发光效果**: CSS box-shadow 实现光晕
- **扫描线**: 透明度动画创建扫描效果
- **故障艺术**: 多层文本叠加创建故障感

### 交互体验
- **流畅动画**: Framer Motion 驱动
- **即时反馈**: 悬浮状态响应
- **加载状态**: 多种加载动画
- **错误处理**: 优雅的错误显示

---

## 🔗 依赖关系

### 核心依赖
```json
{
  "framer-motion": "^11.0.0",
  "lucide-react": "^0.300.0",
  "clsx": "^2.0.0",
  "tailwind-merge": "^2.0.0"
}
```

### 内部依赖
- `@/lib/utils` - 通用工具函数
- `@/types/cyber-types` - 类型定义
- Tailwind 配置 - 赛博朋克主题

---

## 🚀 快速开始

### 1. 安装依赖
```bash
npm install framer-motion lucide-react clsx tailwind-merge
```

### 2. 导入组件
```tsx
import { CyberButton, CyberCard, CyberInput } from '@/components/cyber';
```

### 3. 使用组件
```tsx
<CyberCard variant="neon">
  <h1>赛博朋克世界</h1>
  <CyberButton variant="glitch">开始探索</CyberButton>
</CyberCard>
```

---

## 📝 最佳实践

### 组件组合
```tsx
<CyberCard variant="glass" className="p-6">
  <h2 className="text-2xl text-cyber-cyan mb-4">标题</h2>
  <CyberInput
    label="输入框"
    variant="neon"
    className="mb-4"
  />
  <CyberButton variant="holographic">
    提交
  </CyberButton>
</CyberCard>
```

### 动画序列
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  <CyberCard variant="neon">
    内容
  </CyberCard>
</motion.div>
```

---

## 🎨 颜色系统

### 主色调
```css
--cyber-dark: #0a0a0f;    /* 深空黑 */
--cyber-cyan: #00f0ff;    /* 霓虹青 */
--cyber-purple: #9d00ff;  /* 赛博紫 */
--cyber-pink: #ff0080;    /* 激光粉 */
--cyber-yellow: #f0ff00;  /* 电压黄 */
--cyber-green: #00ff88;   /* 赛博绿 */
--cyber-muted: #1a1a2e;   /* 深空蓝 */
```

### 使用方式
```tsx
<div className="bg-cyber-dark text-cyber-cyan border border-cyber-purple">
  赛博朋克风格
</div>
```

---

## 🐛 常见问题

### Q: 如何自定义组件样式？
A: 使用 `className` prop 添加自定义 Tailwind 类名。

### Q: 组件支持 TypeScript 吗？
A: 是的，所有组件都有完整的类型定义。

### Q: 如何禁用动画？
A: 大多数组件都有 `animate` prop，设置为 `false` 即可。

### Q: 组件支持服务端渲染吗？
A: 是的，所有组件都兼容 Next.js SSR。

---

## 🔮 未来计划

- [ ] 添加更多图表类型（饼图、雷达图）
- [ ] 实现虚拟滚动列表
- [ ] 添加拖拽排序组件
- [ ] 创建表单验证系统
- [ ] 添加更多动画效果
- [ ] 实现暗色/亮色主题切换

---

## 📄 许可证

MIT License

---

## 👥 贡献者

- Claude (AI Agent) - 组件设计与实现
- CyberPress Platform Team - 项目维护

---

**创建时间**: 2026-03-03
**最后更新**: 2026-03-03
**版本**: 1.0.0
