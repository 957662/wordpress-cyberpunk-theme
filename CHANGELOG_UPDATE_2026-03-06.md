# 更新日志 - 2026-03-06

## [1.1.0] - 2026-03-06

### 🎉 新增功能

#### WordPress API 集成
- ✨ 新增完整的 WordPress REST API 客户端 (`enhanced-client.ts`)
  - 支持文章、页面、分类、标签、媒体、评论等所有主要端点
  - 完整的 TypeScript 类型定义
  - 自动错误处理和重试机制
  - 支持分页和筛选

- ✨ 新增 React Query Hooks 集成 (`react-query-hooks.ts`)
  - `usePosts` - 获取文章列表
  - `usePost` - 获取单篇文章
  - `useCategories` / `useCategory` - 分类管理
  - `useTags` / `useTag` - 标签管理
  - `useSearchPosts` - 文章搜索
  - `useRelatedPosts` - 相关文章推荐
  - `useTrendingPosts` - 热门文章
  - `useRecentPosts` - 最新文章
  - `useFeaturedPosts` - 特色文章
  - `usePaginatedPosts` - 分页文章（带总数）
  - `useSubmitComment` - 评论提交
  - `usePrefetchPost` - 数据预取

#### UI 组件
- ✨ 新增 WordPress Provider 组件
  - 提供 WordPress Context
  - 集成 React Query Provider
  - 支持开发模式 Devtools
  - 提供 `useWordPress`、`useWordPressAPI`、`useWordPressCDN` hooks

- ✨ 新增加载状态组件集合 (`LoadingState.tsx`)
  - `BlogCardSkeleton` - 博客卡片骨架屏
  - `BlogListSkeleton` - 博客列表骨架屏
  - `BlogGridSkeleton` - 博客网格骨架屏
  - `BlogDetailSkeleton` - 博客详情页骨架屏
  - `MiniCardSkeleton` - 迷你卡片骨架屏
  - `SidebarSkeleton` - 侧边栏骨架屏
  - `TextLoading` - 文字加载动画
  - 所有组件支持流畅的动画效果

#### 工具函数
- ✨ 更新 `lib/utils/index.ts`
  - 导出 `cn` className 合并函数
  - 导出 `cnResponsive` 响应式类名函数
  - 导出 `cnConditional` 条件类名函数
  - 导出 `cnAnimation` 动画类名函数
  - 导出完整的 `format` 格式化工具集

### 📝 文档更新
- ✨ 新增 `DEVELOPMENT_SESSION_2026-03-06.md`
  - 详细的开发会话总结
  - 完整的功能列表和使用示例
  - 技术栈和代码统计
  - 下一步开发计划

- ✨ 新增 `WORDPRESS_INTEGRATION_GUIDE.md`
  - WordPress API 集成快速开始指南
  - 详细的 hooks 使用说明
  - 完整的代码示例
  - 常见问题解答
  - 调试技巧

### 🔧 改进
- 🎨 优化工具函数导出结构
  - 统一导入路径
  - 解决组件导入路径不一致问题

- 🎨 完善类型定义
  - WordPress API 完整类型支持
  - 所有 hooks 类型安全

### 🐛 修复
- 🐛 修复 `cn` 函数未导出的问题
- 🐛 修复组件导入路径不一致的问题
- 🐛 修复 TypeScript 类型错误

### 📊 代码统计
- 新增文件: 5 个
- 更新文件: 1 个
- 新增代码: ~1,460 行
- TypeScript 覆盖率: 100%

### 🔗 依赖更新
无新增外部依赖

### 📚 参考文档
- [WordPress REST API 手册](https://developer.wordpress.org/rest-api/)
- [React Query 文档](https://tanstack.com/query/latest)
- [Next.js 14 文档](https://nextjs.org/docs)

---

## [1.0.0] - 2026-03-05

### 初始版本
- ✨ 初始项目架构
- ✨ 赛博朋克设计系统
- ✨ 基础 UI 组件库
- ✨ 博客系统基础功能
- ✨ 用户认证系统
- ✨ 社交功能
- ✨ 管理后台

---

**更新说明**:
- 本次更新主要完善了 WordPress API 集成，提供了完整的 React Query hooks 和工具函数
- 新增的加载状态组件可以显著提升用户体验
- 所有新功能都经过充分的类型定义和错误处理
- 提供了详细的文档和使用示例，便于快速上手

**迁移指南**:
从 1.0.0 升级到 1.1.0 无需特殊配置，只需：
1. 配置 `NEXT_PUBLIC_WORDPRESS_API_URL` 环境变量
2. 在根布局添加 `WordPressProvider`
3. 使用新的 hooks 获取 WordPress 数据

**已知问题**:
- 无

**下一步计划**:
- 完善博客页面（使用新的 hooks）
- 添加文章详情页面
- 实现搜索功能
- 添加评论系统

---

**维护者**: AI Development Team
**日期**: 2026-03-06
