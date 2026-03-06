# 🚀 CyberPress Platform - 新功能快速使用指南

**更新时间**: 2026-03-06

本文档介绍本次创建的新功能和使用方法。

---

## 📦 新增功能概览

### 1. 图片优化系统 📸
完整的图片优化解决方案，支持懒加载、动画和错误处理。

### 2. 性能监控系统 📊
全面的 Web Vitals 性能监控和评分系统。

### 3. WordPress 集成 🔌
完整的 WordPress 数据导入工具和 UI。

### 4. API 服务层 🛠️
统一的博客 API 服务接口。

### 5. 测试套件 ✅
全面的组件和工具函数测试。

---

## 📸 图片优化系统

### 基础使用

```tsx
import { ImageOptimizer } from '@/components/performance/ImageOptimizer';

function MyComponent() {
  return (
    <ImageOptimizer
      src="/images/blog-post.jpg"
      alt="博客文章图片"
      width={800}
      height={600}
      showLoader={true}
      blurPlaceholder={true}
      fadeInDuration={0.3}
    />
  );
}
```

### 文章封面图

```tsx
import { ArticleCoverImage } from '@/components/performance/ImageOptimizer';

function BlogPost({ post }) {
  return (
    <ArticleCoverImage
      src={post.featuredImage}
      alt={post.title}
      priority={true}
    />
  );
}
```

### 头像优化

```tsx
import { AvatarOptimizer } from '@/components/performance/ImageOptimizer';

function UserCard({ user }) {
  return (
    <AvatarOptimizer
      src={user.avatar}
      alt={user.name}
      size={40}
    />
  );
}
```

### 响应式图片

```tsx
import { ResponsiveImage } from '@/components/performance/ImageOptimizer';

function Banner() {
  return (
    <ResponsiveImage
      src="/images/banner.jpg"
      alt="横幅图片"
      className="w-full h-64"
    />
  );
}
```

---

## 📊 性能监控系统

### 基础监控

```tsx
import { usePerformance } from '@/hooks/usePerformance';

function PerformanceMonitor() {
  const { metrics, isTracking, startTracking, stopTracking } = usePerformance();

  return (
    <div>
      <h3>性能指标</h3>
      <p>LCP: {Math.round(metrics.largestContentfulPaint)}ms</p>
      <p>FCP: {Math.round(metrics.firstContentfulPaint)}ms</p>
      <p>FID: {Math.round(metrics.firstInputDelay)}ms</p>
      <p>CLS: {metrics.cumulativeLayoutShift.toFixed(3)}</p>
      <p>TTFB: {Math.round(metrics.timeToFirstByte)}ms</p>

      <button onClick={isTracking ? stopTracking : startTracking}>
        {isTracking ? '停止监控' : '开始监控'}
      </button>
    </div>
  );
}
```

### 性能仪表板

```tsx
import { usePerformanceDashboard } from '@/hooks/usePerformance';

function Dashboard() {
  const {
    metrics,
    score,
    slowResources,
    totalTransferSize,
    memoryInfo
  } = usePerformanceDashboard();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <MetricCard title="性能评分" value={`${score}/100`} />
      <MetricCard title="传输大小" value={`${(totalTransferSize / 1024 / 1024).toFixed(2)} MB`} />
      <MetricCard title="慢速资源" value={slowResources.length} />
    </div>
  );
}
```

### 性能评分

```tsx
import { calculatePerformanceScore } from '@/hooks/usePerformance';

function PerformanceBadge({ metrics }) {
  const score = calculatePerformanceScore(metrics);

  const getColor = () => {
    if (score >= 90) return 'green';
    if (score >= 70) return 'yellow';
    return 'red';
  };

  return (
    <div className={`badge ${getColor()}`}>
      性能评分: {score}/100
    </div>
  );
}
```

---

## 🔌 WordPress 集成

### 导入器组件

```tsx
import { WordPressImporterComponent } from '@/components/wordpress/WordPressImporter';

function ImportPage() {
  const handleImportComplete = (result) => {
    console.log(`成功导入 ${result.posts.length} 篇文章`);
    if (result.errors.length > 0) {
      console.warn(`${result.errors.length} 个错误:`, result.errors);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">WordPress 数据导入</h1>

      <WordPressImporterComponent
        onImportComplete={handleImportComplete}
        onImportError={(error) => console.error('导入失败:', error)}
        baseUrl="/api/blog"
        showPreview={true}
      />
    </div>
  );
}
```

### 编程式导入

```tsx
import { importWordPressData } from '@/lib/wordpress/importer';

async function importFromWordPress(file) {
  try {
    const result = await importWordPressData(
      file,
      (progress) => {
        console.log(`进度: ${progress.processed}/${progress.total}`);
        console.log(`当前: ${progress.current}`);
      }
    );

    console.log(`导入完成: ${result.posts.length} 篇文章`);
    console.log(`成功: ${result.progress.succeeded}`);
    console.log(`失败: ${result.progress.failed}`);

    if (result.errors.length > 0) {
      console.error('错误列表:', result.errors);
    }

    return result;
  } catch (error) {
    console.error('导入失败:', error);
  }
}
```

---

## 🛠️ API 服务层

### 获取文章列表

```typescript
import { BlogService } from '@/lib/services/blog.service';

// 获取最新文章
const posts = await BlogService.getPosts({
  page: 1,
  limit: 10,
  sort: 'latest'
});

// 按分类筛选
const techPosts = await BlogService.getPosts({
  category: 'technology',
  page: 1,
  limit: 20
});

// 搜索文章
const searchResults = await BlogService.getPosts({
  search: 'Next.js',
  limit: 5
});
```

### 文章操作

```typescript
// 创建文章
const newPost = await BlogService.createPost({
  title: '我的新文章',
  content: '这是文章内容...',
  excerpt: '简短摘要',
  category: 'tech',
  tags: ['react', 'nextjs'],
  status: 'published'
});

// 更新文章
const updatedPost = await BlogService.updatePost('post-id', {
  title: '更新后的标题',
  content: '更新后的内容'
});

// 删除文章
await BlogService.deletePost('post-id');

// 点赞文章
const result = await BlogService.likePost('post-id');
console.log(`点赞数: ${result.count}, 已点赞: ${result.liked}`);
```

### 评论管理

```typescript
// 获取评论
const comments = await BlogService.getComments('post-id', {
  page: 1,
  limit: 20,
  sort: 'latest'
});

// 创建评论
const comment = await BlogService.createComment('post-id', {
  content: '这是我的评论',
  author_name: '张三',
  author_email: 'zhangsan@example.com'
});

// 删除评论
await BlogService.deleteComment('post-id', 'comment-id');
```

### 图片上传

```typescript
// 单个图片上传
const result = await BlogService.uploadImage(file, 'content');
console.log('图片URL:', result.url);

// 批量上传
const results = await BlogService.uploadImages(files, 'featured');
results.forEach(item => {
  console.log('上传成功:', item.url);
});
```

---

## ✅ 测试

### 运行测试

```bash
# 运行所有测试
npm test

# 运行特定测试文件
npm test CommentSection.test.tsx

# 监听模式
npm run test:watch

# 生成覆盖率报告
npm run test:ci
```

### 测试示例

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import CommentSection from '@/components/blog/CommentSection';

describe('CommentSection', () => {
  it('应该渲染评论区域', () => {
    render(<CommentSection postId={1} />);
    expect(screen.getByText(/评论/i)).toBeInTheDocument();
  });

  it('应该处理评论提交', async () => {
    render(<CommentSection postId={1} />);

    const nameInput = screen.getByPlaceholderText(/输入你的昵称/i);
    const commentInput = screen.getByPlaceholderText(/写下你的评论/i);

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(commentInput, { target: { value: 'Test comment' } });

    const submitButton = screen.getByRole('button', { name: /发表评论/i });
    fireEvent.click(submitButton);

    // 验证评论已添加
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('Test comment')).toBeInTheDocument();
    });
  });
});
```

---

## 🎨 最佳实践

### 图片优化

1. **使用合适的组件**：
   - 普通图片：`ImageOptimizer`
   - 文章封面：`ArticleCoverImage`
   - 用户头像：`AvatarOptimizer`
   - 响应式图片：`ResponsiveImage`

2. **性能优化**：
   - 启用懒加载：默认开启
   - 使用模糊占位符：提升用户体验
   - 合理设置尺寸：避免布局偏移

### 性能监控

1. **监控关键指标**：
   - LCP < 2.5s（良好）
   - FID < 100ms（良好）
   - CLS < 0.1（良好）

2. **定期检查**：
   - 使用仪表板组件监控
   - 设置性能阈值告警
   - 优化慢速资源

### WordPress 导入

1. **导入前准备**：
   - 备份原有数据
   - 验证 XML 文件格式
   - 检查文件大小（< 50MB）

2. **导入后处理**：
   - 检查导入结果
   - 处理错误报告
   - 更新图片路径

### API 使用

1. **错误处理**：
   ```typescript
   try {
     const posts = await BlogService.getPosts();
   } catch (error) {
     console.error('获取文章失败:', error);
     // 显示错误提示
   }
   ```

2. **认证**：
   ```typescript
   // 登录后保存 token
   localStorage.setItem('auth_token', token);

   // API 会自动使用 token
   ```

---

## 📚 相关文档

- [项目 README](./README.md)
- [开发任务清单](./DEVELOPMENT_TASKS.md)
- [文件创建总结](./FILES_CREATED_2026-03-06-SESSION.md)
- [项目设置指南](./PROJECT_SETUP.md)

---

## 🆘 常见问题

### Q: 图片优化组件不显示？
A: 确保 Next.js 配置了图片域名：
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['example.com', 'cdn.example.com'],
  },
};
```

### Q: 性能监控没有数据？
A: 确保：
1. 页面已完全加载
2. 浏览器支持 Performance API
3. 没有被隐私模式阻止

### Q: WordPress 导入失败？
A: 检查：
1. XML 文件格式是否正确
2. 文件大小是否超过限制
3. 网络连接是否正常

### Q: 测试运行失败？
A: 确保：
1. 所有依赖已安装：`npm install`
2. Vitest 配置正确
3. Mock 所有外部依赖

---

## 📞 支持

如有问题，请联系：

- **项目**: CyberPress Platform
- **团队**: AI Development Team
- **更新**: 2026-03-06

---

**🎉 开始使用新功能吧！**
