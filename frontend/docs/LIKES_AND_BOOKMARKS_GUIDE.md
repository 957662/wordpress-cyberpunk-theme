# 点赞和收藏功能集成指南

本文档介绍如何在前端项目中使用点赞和收藏功能。

## 📦 组件概览

### 新增文件

1. **类型定义**
   - `frontend/types/like.types.ts` - 点赞类型定义
   - `frontend/types/bookmark.types.ts` - 收藏类型定义

2. **服务层**
   - `frontend/lib/services/like-service.ts` - 点赞API服务
   - `frontend/lib/services/bookmark-service-new.ts` - 收藏API服务

3. **React Hooks**
   - `frontend/lib/hooks/useLike.ts` - 点赞Hook
   - `frontend/lib/hooks/useBookmark.ts` - 收藏Hook

4. **UI组件**
   - `frontend/components/blog/LikeButtonEnhanced.tsx` - 增强版点赞按钮
   - `frontend/components/blog/BookmarkButtonEnhanced.tsx` - 增强版收藏按钮

5. **示例页面**
   - `frontend/app/(public)/blog/examples/likes-and-bookmarks/page.tsx` - 使用示例

## 🚀 快速开始

### 1. 基础使用

最简单的使用方式：

```tsx
import { LikeButtonEnhanced } from '@/components/blog/LikeButtonEnhanced';
import { BookmarkButtonEnhanced } from '@/components/blog/BookmarkButtonEnhanced';
import { LikeTargetType } from '@/types/like.types';
import { BookmarkTargetType } from '@/types/bookmark.types';

function MyComponent() {
  return (
    <div>
      {/* 点赞按钮 */}
      <LikeButtonEnhanced
        targetType={LikeTargetType.POST}
        targetId="post-123"
        initialLiked={false}
        initialCount={42}
      />

      {/* 收藏按钮 */}
      <BookmarkButtonEnhanced
        targetType={BookmarkTargetType.POST}
        targetId="post-123"
        initialBookmarked={false}
      />
    </div>
  );
}
```

### 2. 在文章卡片中使用

```tsx
import { LikeButtonEnhanced } from '@/components/blog/LikeButtonEnhanced';
import { BookmarkButtonEnhanced } from '@/components/blog/BookmarkButtonEnhanced';
import { LikeTargetType, BookmarkTargetType } from '@/types';

interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    excerpt: string;
    likeCount: number;
    isLiked: boolean;
    isBookmarked: boolean;
  };
}

function ArticleCard({ article }: ArticleCardProps) {
  return (
    <div className="bg-cyber-dark border border-cyber-border rounded-lg p-6">
      <h3 className="text-xl font-bold text-white mb-2">{article.title}</h3>
      <p className="text-cyber-muted mb-4">{article.excerpt}</p>

      <div className="flex items-center gap-4">
        <LikeButtonEnhanced
          targetType={LikeTargetType.POST}
          targetId={article.id}
          initialLiked={article.isLiked}
          initialCount={article.likeCount}
          size="sm"
        />

        <BookmarkButtonEnhanced
          targetType={BookmarkTargetType.POST}
          targetId={article.id}
          initialBookmarked={article.isBookmarked}
          size="sm"
        />
      </div>
    </div>
  );
}
```

### 3. 使用 Hook 直接控制

如果你需要更细粒度的控制，可以直接使用 Hook：

```tsx
import { useLike } from '@/lib/hooks/useLike';
import { useBookmark } from '@/lib/hooks/useBookmark';
import { LikeTargetType, BookmarkTargetType } from '@/types';

function ArticleActions({ postId }: { postId: string }) {
  const { isLiked, likeCount, toggle: toggleLike } = useLike({
    targetType: LikeTargetType.POST,
    targetId: postId,
    initialLiked: false,
    initialCount: 0,
  });

  const { isBookmarked, toggle: toggleBookmark } = useBookmark({
    targetType: BookmarkTargetType.POST,
    targetId: postId,
    initialBookmarked: false,
  });

  return (
    <div className="flex gap-4">
      <button onClick={toggleLike}>
        {isLiked ? '❤️' : '🤍'} {likeCount}
      </button>

      <button onClick={() => toggleBookmark('我的备注')}>
        {isBookmarked ? '⭐ 已收藏' : '☆ 收藏'}
      </button>
    </div>
  );
}
```

## 🎨 组件 API

### LikeButtonEnhanced

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| targetType | `LikeTargetType` | `POST` | 目标类型 |
| targetId | `string \| number` | - | 目标ID（必填） |
| initialLiked | `boolean` | `false` | 初始点赞状态 |
| initialCount | `number` | `0` | 初始点赞数 |
| showCount | `boolean` | `true` | 是否显示计数 |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | 按钮尺寸 |
| variant | `'default' \| 'outline' \| 'ghost'` | `'default'` | 按钮样式 |
| disabled | `boolean` | `false` | 是否禁用 |
| onLikeChange | `(liked: boolean) => void` | - | 状态变化回调 |

### BookmarkButtonEnhanced

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| targetType | `BookmarkTargetType` | `POST` | 目标类型 |
| targetId | `string \| number` | - | 目标ID（必填） |
| initialBookmarked | `boolean` | `false` | 初始收藏状态 |
| showCount | `boolean` | `false` | 是否显示计数 |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | 按钮尺寸 |
| variant | `'default' \| 'outline' \| 'ghost'` | `'default'` | 按钮样式 |
| disabled | `boolean` | `false` | 是否禁用 |
| allowNotes | `boolean` | `true` | 是否允许添加备注 |
| onBookmarkChange | `(bookmarked: boolean) => void` | - | 状态变化回调 |

## 🔧 高级用法

### 批量获取状态

如果你需要同时获取多个目标的点赞/收藏状态：

```tsx
import { useBatchLikes } from '@/lib/hooks/useLike';
import { useBatchBookmarks } from '@/lib/hooks/useBookmark';

function ArticleList({ articles }: { articles: Array<{ id: string }> }) {
  const targets = articles.map(a => ({
    targetType: LikeTargetType.POST,
    targetId: a.id,
  }));

  const { isLiked } = useBatchLikes({ targets });

  return (
    <div>
      {articles.map(article => (
        <div key={article.id}>
          <h3>{article.title}</h3>
          <span>{isLiked(LikeTargetType.POST, article.id) ? '已点赞' : '未点赞'}</span>
        </div>
      ))}
    </div>
  );
}
```

### 收藏列表

使用 `useBookmarkList` Hook 获取用户的收藏列表：

```tsx
import { useBookmarkList } from '@/lib/hooks/useBookmark';
import { BookmarkTargetType } from '@/types/bookmark.types';

function MyBookmarks() {
  const { bookmarks, isLoading, loadMore, hasMore } = useBookmarkList({
    targetType: BookmarkTargetType.POST,
    initialLimit: 20,
  });

  if (isLoading) return <div>加载中...</div>;

  return (
    <div>
      {bookmarks.map(bookmark => (
        <div key={bookmark.id}>
          <h3>{bookmark.target_type}: {bookmark.target_id}</h3>
          {bookmark.notes && <p>备注: {bookmark.notes}</p>}
        </div>
      ))}

      {hasMore && (
        <button onClick={loadMore}>加载更多</button>
      )}
    </div>
  );
}
```

## 🔌 API 端点

后端 API 已部署在以下端点：

### 点赞 API

- `POST /api/v1/likes` - 创建点赞
- `DELETE /api/v1/likes/{target_type}/{target_id}` - 取消点赞
- `POST /api/v1/likes/toggle/{target_type}/{target_id}` - 切换点赞状态
- `GET /api/v1/likes/status/{target_type}/{target_id}` - 获取点赞状态
- `GET /api/v1/likes/count/{target_type}/{target_id}` - 获取点赞数量
- `GET /api/v1/likes/my` - 获取我的点赞列表
- `GET /api/v1/likes/target/{target_type}/{target_id}` - 获取目标点赞列表
- `GET /api/v1/likes/stats` - 获取点赞统计

### 收藏 API

- `POST /api/v1/bookmarks` - 创建收藏
- `PUT /api/v1/bookmarks/{bookmark_id}` - 更新收藏
- `DELETE /api/v1/bookmarks/{bookmark_id}` - 删除收藏
- `DELETE /api/v1/bookmarks/target/{target_type}/{target_id}` - 根据目标删除
- `POST /api/v1/bookmarks/toggle/{target_type}/{target_id}` - 切换收藏状态
- `GET /api/v1/bookmarks/status/{target_type}/{target_id}` - 获取收藏状态
- `GET /api/v1/bookmarks/my` - 获取我的收藏列表
- `GET /api/v1/bookmarks/{bookmark_id}` - 获取收藏详情
- `GET /api/v1/bookmarks/search` - 搜索收藏

## 🎯 类型定义

### LikeTargetType

```typescript
enum LikeTargetType {
  POST = 'post',           // 文章
  COMMENT = 'comment',     // 评论
  PROJECT = 'project',     // 项目
}
```

### BookmarkTargetType

```typescript
enum BookmarkTargetType {
  POST = 'post',           // 文章
  PROJECT = 'project',     // 项目
  CATEGORY = 'category',   // 分类
}
```

## 📝 注意事项

1. **认证**：所有需要用户身份的API调用都会自动在请求头中携带JWT token
2. **乐观更新**：组件使用乐观更新策略，操作会立即反映到UI上，失败时自动回滚
3. **错误处理**：错误会自动显示toast提示，你也可以通过 `onError` 回调自定义处理
4. **性能优化**：使用防抖和缓存策略，避免重复请求

## 🐛 故障排查

### 问题：点赞/收藏操作不生效

**解决方案**：
1. 检查是否已登录（JWT token是否存在）
2. 检查网络连接
3. 打开浏览器控制台查看错误信息
4. 确认后端API是否正常运行

### 问题：状态不同步

**解决方案**：
1. 使用 `refresh` 方法手动刷新状态
2. 检查 `initialLiked` 和 `initialBookmarked` 是否正确传递
3. 确认后端返回的数据格式正确

## 📚 更多资源

- [后端API文档](../../../LIKES_AND_BOOKMARKS_API.md)
- [使用示例](./../../app/(public)/blog/examples/likes-and-bookmarks/page.tsx)
- [类型定义](./../../types/like.types.ts)
- [组件源码](./../../components/blog/LikeButtonEnhanced.tsx)

## 🤝 贡献

如果你发现任何问题或有改进建议，欢迎提交 PR 或 Issue！

---

**最后更新**: 2026-03-06
**维护者**: AI Development Team
