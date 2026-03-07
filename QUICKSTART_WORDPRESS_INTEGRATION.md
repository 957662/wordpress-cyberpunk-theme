# 🚀 WordPress 集成快速开始

## ✅ 已创建的文件

所有 10 个核心文件已成功创建！

### 核心库 (5 个文件)
- ✅ `wordpress-api.ts` - WordPress REST API 客户端
- ✅ `react-hooks.ts` - React Hooks (基于 TanStack Query)
- ✅ `wp-config.ts` - 配置管理
- ✅ `data-adapter.ts` - 数据适配器
- ✅ `main-export.ts` - 统一导出

### 服务层 (1 个文件)
- ✅ `wordpress-service.ts` - 业务逻辑封装

### 组件和页面 (3 个文件)
- ✅ `WordPressIntegrationExample.tsx` - 完整示例
- ✅ `blog/page-integrated.tsx` - 博客列表页
- ✅ `blog/[slug]/page-integrated.tsx` - 博客详情页

### 文档 (1 个文件)
- ✅ `WORDPRESS_INTEGRATION_COMPLETE_GUIDE.md` - 完整指南

## ⚡ 5 分钟快速开始

### 1. 配置环境变量

创建或编辑 `frontend/.env.local`:

\`\`\`env
NEXT_PUBLIC_WORDPRESS_URL=https://your-wordpress-site.com
NEXT_PUBLIC_WORDPRESS_API_PATH=/wp-json/wp/v2
\`\`\`

### 2. 安装依赖

\`\`\`bash
cd frontend
npm install @tanstack/react-query clsx tailwind-merge
\`\`\`

### 3. 使用示例

在任何组件中使用:

\`\`\`tsx
import { usePosts, useCategories } from '@/lib/wordpress/main-export';

export default function MyBlog() {
  const { data: posts, isLoading } = usePosts({ per_page: 10 });
  const { data: categories } = useCategories();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {posts?.map(post => (
        <article key={post.id}>
          <h2>{post.title.rendered}</h2>
          <p>{post.excerpt.rendered}</p>
        </article>
      ))}
    </div>
  );
}
\`\`\`

## 📚 可用的 Hooks

### 文章相关
- \`usePosts(params)\` - 获取文章列表
- \`usePost(id)\` - 获取单篇文章
- \`usePostBySlug(slug)\` - 根据 slug 获取文章
- \`useLatestPosts(limit)\` - 获取最新文章
- \`useFeaturedPosts()\` - 获取精选文章

### 分类和标签
- \`useCategories(params)\` - 获取分类列表
- \`useTags(params)\` - 获取标签列表
- \`usePopularTags(limit)\` - 获取热门标签

### 评论
- \`useComments(postId)\` - 获取评论列表
- \`useCreateComment()\` - 创建评论

### 搜索
- \`useSearchPosts(query)\` - 搜索文章

## 🎯 快速测试

运行示例组件查看效果:

\`\`\`tsx
import { WordPressIntegrationExample } from '@/components/wordpress/WordPressIntegrationExample';

export default function TestPage() {
  return <WordPressIntegrationExample />;
}
\`\`\`

## 📖 完整文档

查看 \`WORDPRESS_INTEGRATION_COMPLETE_GUIDE.md\` 获取:
- 详细 API 文档
- 所有可用的 hooks 和服务
- 完整的使用示例
- 高级配置选项

## 🎉 完成！

现在你可以在项目中使用完整的 WordPress 集成了！

---
**创建时间**: 2026-03-07
**状态**: ✅ 所有文件已创建
