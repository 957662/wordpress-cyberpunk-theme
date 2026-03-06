# CyberPress Platform - 开发任务清单

## 🔥 紧急任务 (优先级: 高)

### 1. 修复导入路径问题
- [ ] 检查所有组件的导入路径
- [ ] 统一使用 `@/lib/utils` 别名
- [ ] 修复 `@/lib/utils/classname` 和 `@/lib/utils/cn` 的不一致
- [ ] 确保所有工具函数正确导出

### 2. 完善博客功能
- [ ] 实现 BlogList 组件
- [ ] 实现 BlogGrid 组件
- [ ] 实现 ArticleCard 组件
- [ ] 实现分页功能
- [ ] 添加加载状态

### 3. 集成 WordPress API
- [ ] 配置 API 端点
- [ ] 实现数据获取 hooks
- [ ] 添加错误处理
- [ ] 实现缓存策略

## 📋 中期任务 (优先级: 中)

### 4. 完善搜索功能
- [ ] 实现全局搜索
- [ ] 添加搜索建议
- [ ] 实现高级筛选
- [ ] 优化搜索性能

### 5. 用户功能
- [ ] 实现用户认证
- [ ] 创建用户资料页
- [ ] 添加收藏功能
- [ ] 实现评论系统

### 6. 性能优化
- [ ] 图片懒加载
- [ ] 代码分割
- [ ] SEO 优化
- [ ] 添加 Service Worker

## 🎨 长期任务 (优先级: 低)

### 7. 高级特效
- [ ] 3D 效果集成
- [ ] WebGL 粒子系统
- [ ] AI 图像生成
- [ ] 实时数据可视化

### 8. 多语言支持
- [ ] i18n 配置
- [ ] 翻译文件
- [ ] 语言切换器
- [ ] 本地化路由

### 9. 管理后台
- [ ] Dashboard 页面
- [ ] 内容管理
- [ ] 数据统计
- [ ] 用户管理

## 📝 具体实施步骤

### 第一步：修复导入问题 (1-2小时)
```bash
# 1. 检查所有导入
grep -r "@/lib/utils/classname" frontend/
grep -r "@/lib/utils/cn" frontend/

# 2. 统一导入路径
# 将所有 @/lib/utils/classname 改为 @/lib/utils
# 将所有 @/lib/utils/cn 改为 @/lib/utils

# 3. 更新导出
# 编辑 frontend/lib/utils/index.ts
```

### 第二步：完善博客组件 (2-3小时)
```typescript
// 1. 创建 BlogList 组件
// frontend/components/blog/BlogList.tsx
export function BlogList({ posts, loading }: BlogListProps) {
  // 实现博客列表
}

// 2. 创建 BlogGrid 组件
// frontend/components/blog/BlogGrid.tsx
export function BlogGrid({ posts, columns }: BlogGridProps) {
  // 实现博客网格
}

// 3. 更新 BlogCard props
// 确保与现有数据结构兼容
```

### 第三步：WordPress 集成 (3-4小时)
```typescript
// 1. 创建 hooks
// frontend/lib/wordpress/hooks.ts
export function usePosts(page = 1) {
  return useQuery({
    queryKey: ['posts', page],
    queryFn: () => wpClient.getPosts({ page }),
  });
}

// 2. 实现数据获取
// frontend/app/blog/page.tsx
export default async function BlogPage() {
  const posts = await wpClient.getPosts();
  return <BlogGrid posts={posts} />;
}
```

### 第四步：测试和调试 (1-2小时)
```bash
# 1. 运行开发服务器
cd frontend
npm run dev

# 2. 测试所有页面
# http://localhost:3000
# http://localhost:3000/blog
# http://localhost:3000/portfolio

# 3. 检查控制台错误
# 修复所有 TypeScript 错误
```

## 🐛 已知问题

### 1. 导入路径不一致
**问题**: 组件使用不同的 utils 导入路径
```typescript
// ❌ 错误
import { cn } from '@/lib/utils/classname';
import { cn } from '@/lib/utils/cn';

// ✅ 正确
import { cn } from '@/lib/utils';
```

**解决方案**: 统一所有导入到 `@/lib/utils`

### 2. BlogCard props 不匹配
**问题**: BlogCard 期望不同的数据结构
```typescript
// 当前 BlogCard 期望：
interface BlogCardProps {
  post: {
    id: number;
    title: { rendered: string };
    // ...
  };
}

// 但博客页面传入：
interface PostData {
  id: string;
  title: string;
  // ...
}
```

**解决方案**: 创建适配器或统一数据结构

### 3. 缺失的组件
**问题**: 组件导出中引用了未实现的组件
```typescript
// frontend/components/blog/index.ts
export { BlogList } from './BlogList'; // ❌ 不存在
export { BlogGrid } from './BlogGrid'; // ❌ 不存在
export { ArticleCard } from './ArticleCard'; // ❌ 不存在
```

**解决方案**: 实现这些组件或移除导出

## 📊 进度跟踪

### 组件完成度
- UI 组件: 90% ✅
- 博客组件: 60% ⚠️
- 特效组件: 85% ✅
- 布局组件: 80% ✅

### 功能完成度
- 页面: 70% ⚠️
- API 集成: 40% ❌
- 数据管理: 50% ⚠️
- 认证: 20% ❌

## 🎯 本周目标

### 目标 1: 修复所有导入问题
- [ ] 统一 utils 导入
- [ ] 修复所有 TypeScript 错误
- [ ] 确保构建成功

### 目标 2: 完善博客功能
- [ ] 实现所有博客组件
- [ ] 完成博客列表页
- [ ] 完成博客详情页

### 目标 3: 基础 API 集成
- [ ] 连接 WordPress API
- [ ] 实现数据获取
- [ ] 添加加载和错误状态

## 💡 提示和建议

### 开发流程
1. **先测试组件**: 确保每个组件单独工作
2. **逐步集成**: 不要一次性修改太多
3. **频繁提交**: 小步快跑，便于回滚
4. **文档更新**: 及时更新相关文档

### 调试技巧
```typescript
// 1. 使用 TypeScript 严格模式
// tsconfig.json
{
  "compilerOptions": {
    "strict": true
  }
}

// 2. 启用 ESLint
npm run lint

// 3. 使用控制台调试
console.log('Debug:', data);

// 4. React DevTools
// 安装浏览器扩展进行调试
```

### 性能优化
```typescript
// 1. 使用 React.memo
export const MemoComponent = React.memo(Component);

// 2. 使用 useMemo
const value = useMemo(() => computeExpensiveValue(a, b), [a, b]);

// 3. 使用 useCallback
const callback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);

// 4. 代码分割
const HeavyComponent = dynamic(() => import('./HeavyComponent'));
```

## 📞 支持

如有问题，请查看：
- [项目文档](./PROJECT_SETUP.md)
- [设计系统](./frontend/docs/COLOR_REFERENCE.md)
- [组件文档](./frontend/docs/ICON_MANIFEST.md)

---

**最后更新**: 2026-03-06
**负责人**: AI Development Team
