# 新创建组件使用指南

本文档介绍本次会话中新创建的组件和工具的使用方法。

## 📁 新增文件列表

### 服务类 (Services)

1. **AI 服务** (`frontend/lib/services/ai-service.ts`)
   - 提供文本生成、摘要、分类等功能
   - 支持模拟模式（无需 API 密钥）

2. **缓存服务** (`frontend/lib/services/cache-service.ts`)
   - 内存缓存和 localStorage 缓存
   - 支持过期时间和统计信息

3. **通知服务** (`frontend/lib/services/notification-service.ts`)
   - 统一的通知管理
   - 集成 toast 通知

### 组件 (Components)

4. **高级搜索组件** (`frontend/components/search/AdvancedSearch.tsx`)
   - 多条件筛选
   - 支持分类、标签、作者等筛选

5. **博客卡片组件** (`frontend/components/blog/BlogCard.tsx`)
   - 多种显示模式（default、compact、featured）
   - 支持收藏、分享等功能

6. **增强型错误边界** (`frontend/components/error/ErrorBoundaryAdvanced.tsx`)
   - 详细的错误信息展示
   - 支持错误报告和重试

7. **主布局组件** (`frontend/components/layout/MainLayout.tsx`)
   - 响应式布局
   - 包含导航、侧边栏、页脚

### 工具类 (Utils)

8. **时间格式化** (`frontend/lib/utils/time.ts`)
   - 友好的时间显示
   - 相对时间、阅读时间计算

9. **图像处理** (`frontend/lib/utils/image.ts`)
   - 图像优化
   - 压缩、尺寸获取

10. **性能监控** (`frontend/lib/utils/performance.ts`)
    - 页面性能指标
    - LCP、FID、CLS 等

11. **日志工具** (`frontend/lib/utils/logger.ts`)
    - 统一的日志接口
    - 支持上下文和级别

12. **字符串处理** (`frontend/lib/utils/string.ts`)
    - 常用字符串操作
    - 格式化、转换等

13. **应用配置** (`frontend/lib/config/app-config.ts`)
    - 集中管理配置
    - 环境变量

### Hooks

14. **防抖 Hook** (`frontend/lib/hooks/useDebounce.ts`)
    - 延迟执行函数
    - 避免频繁触发

15. **无限滚动 Hook** (`frontend/lib/hooks/useInfiniteScroll.ts`)
    - 滚动加载更多
    - 两种实现方式

16. **LocalStorage Hook** (`frontend/lib/hooks/useLocalStorage.ts`)
    - 持久化状态
    - 自动同步

### 页面

17. **博客列表页** (`frontend/app/blog/page.tsx`)
    - 文章列表展示
    - 搜索和筛选

18. **404 页面** (`frontend/app/not-found.tsx`)
    - 赛博朋克风格
    - 友好的错误提示

19. **联系页面** (`frontend/app/contact/page.tsx`)
    - 联系表单
    - 常见问题

### 配置

20. **环境变量示例** (`frontend/.env.example`)
    - 配置模板
    - 环境变量说明

## 🚀 快速开始

### 1. 安装依赖

```bash
cd frontend
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env.local
# 编辑 .env.local 填入实际配置
```

### 3. 使用组件示例

#### AI 服务

```typescript
import { aiService } from '@/lib/services/ai-service';

// 生成摘要
const result = await aiService.generateSummary(content, 200);
if (result.success) {
  console.log(result.data.summary);
}

// 文本分类
const classification = await aiService.classifyText(text);
```

#### 缓存服务

```typescript
import { cache } from '@/lib/services/cache-service';

// 设置缓存
cache.set('key', data, 60000, true);

// 获取缓存
const data = cache.get('key');

// 清理过期缓存
cache.clean();
```

#### 高级搜索

```tsx
import { AdvancedSearch } from '@/components/search/AdvancedSearch';

<AdvancedSearch
  onSearch={(filters) => {
    console.log(filters);
  }}
  categories={['技术', '生活', '设计']}
  tags={['React', 'Next.js']}
/>
```

#### 博客卡片

```tsx
import { BlogCard } from '@/components/blog/BlogCard';

<BlogCard
  id="1"
  title="文章标题"
  excerpt="文章摘要"
  author={{ name: "作者名", avatar: "头像URL" }}
  category="分类"
  tags={["标签1", "标签2"]}
  publishedAt="2024-03-01"
  readingTime={5}
  onBookmark={(id) => console.log(id)}
/>
```

#### 主布局

```tsx
import { MainLayout } from '@/components/layout/MainLayout';

<MainLayout>
  <YourContent />
</MainLayout>
```

### 4. 使用工具函数

#### 时间格式化

```typescript
import { formatFriendlyTime, calculateReadingTime } from '@/lib/utils/time';

const timeAgo = formatFriendlyTime(new Date());
const readingTime = calculateReadingTime(content);
```

#### 图像处理

```typescript
import { getOptimizedImageUrl, compressImage } from '@/lib/utils/image';

const optimizedUrl = getOptimizedImageUrl(url, { width: 800, quality: 80 });
const compressed = await compressImage(file, { maxWidth: 1920 });
```

#### 性能监控

```typescript
import { performanceMonitor } from '@/lib/utils/performance';

performanceMonitor.init();
const metrics = performanceMonitor.getMetrics();
console.log(performanceMonitor.getReport());
```

### 5. 使用 Hooks

#### 防抖

```typescript
import { useDebounce } from '@/lib/hooks/useDebounce';

const [searchTerm, setSearchTerm] = useState('');
const debouncedSearchTerm = useDebounce(searchTerm, 500);
```

#### 无限滚动

```typescript
import { useInfiniteScroll } from '@/lib/hooks/useInfiniteScroll';

const { isFetching, hasMore } = useInfiniteScroll(
  () => fetchMoreData(),
  { threshold: 100 }
);
```

#### LocalStorage

```typescript
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';

const [theme, setTheme] = useLocalStorage('theme', 'dark');
```

## 📋 配置说明

主要配置项位于 `frontend/lib/config/app-config.ts`：

```typescript
import { appConfig, getConfig, isFeatureEnabled } from '@/lib/config/app-config';

// 访问配置
const appName = appConfig.app.name;

// 检查功能开关
if (isFeatureEnabled('enableComments')) {
  // 启用评论功能
}
```

## 🎨 自定义主题

主题颜色在 `frontend/tailwind.config.ts` 中配置：

```typescript
colors: {
  cyber: {
    dark: '#0a0a0f',
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    // ... 更多颜色
  },
}
```

## 🔧 开发命令

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 运行生产服务器
npm start

# 类型检查
npm run type-check

# 代码检查
npm run lint
```

## 📝 注意事项

1. **AI 服务**：默认使用模拟模式，要使用真实 AI 功能需要配置 API 密钥
2. **缓存服务**：localStorage 缓存需要检查浏览器兼容性
3. **性能监控**：生产环境建议关闭详细日志
4. **错误边界**：生产环境应该集成错误追踪服务

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可

MIT License
