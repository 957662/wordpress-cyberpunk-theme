# 🚀 CyberPress 社交功能快速开始指南

**版本**: v1.0.0  
**更新日期**: 2026-03-03  
**状态**: ✅ 可用

---

## 📋 概述

本次更新为 CyberPress 平台添加了完整的社交功能，包括用户关注、点赞、书签和通知系统。

### 新增功能
- ✅ 用户关注系统
- ✅ 点赞功能
- ✅ 书签管理
- ✅ 通知系统
- ✅ 活动流

---

## 🔧 安装步骤

### 1. 确认依赖

确保以下依赖已安装：

```bash
cd frontend
npm install @tanstack/react-query framer-motion lucide-react clsx tailwind-merge
```

### 2. 配置环境变量

在 `.env.local` 中添加：

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. 设置 React Query

在 `app/providers.tsx` 中添加 QueryClientProvider：

```tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5分钟
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

---

## 📖 使用指南

### 1. 关注功能

#### 使用 API 服务

```typescript
import socialApi from '@/services/socialApi';

// 关注用户
await socialApi.followUser(userId);

// 取消关注
await socialApi.unfollowUser(userId);

// 获取粉丝列表
const followers = await socialApi.getFollowers(userId, 1, 20);

// 获取关注列表
const following = await socialApi.getFollowing(userId, 1, 20);

// 获取关注统计
const stats = await socialApi.getFollowStats(userId);
```

#### 使用 React Hooks

```typescript
import { useFollowUser, useUnfollowUser, useFollowers, useFollowStats } from '@/hooks/useSocialQueries';

function FollowButton({ userId, isFollowing }) {
  const followUser = useFollowUser();
  const unfollowUser = useUnfollowUser();
  
  return (
    <button onClick={() => isFollowing ? unfollowUser.mutate(userId) : followUser.mutate(userId)}>
      {isFollowing ? '取消关注' : '关注'}
    </button>
  );
}

function FollowersList({ userId }) {
  const { data, isLoading } = useFollowers(userId, 1);
  
  if (isLoading) return <div>加载中...</div>;
  return <div>{data?.users.map(user => <UserCard key={user.id} user={user} />)}</div>;
}
```

### 2. 点赞功能

```typescript
import socialApi from '@/services/socialApi';

// 点赞文章
await socialApi.toggleLike('post', postId);

// 获取点赞统计
const stats = await socialApi.getLikeStats('post', postId);

// 获取点赞用户列表
const likers = await socialApi.getLikers('post', postId, 1, 20);
```

### 3. 书签功能

```typescript
import socialApi from '@/services/socialApi';

// 创建书签文件夹
await socialApi.createBookmarkFolder({
  name: '我的收藏',
  description: '精彩文章',
  icon: '📚',
  color: '#00f0ff',
});

// 添加书签
await socialApi.addBookmark({
  postId: 123,
  folderId: 1,
  notes: '这篇文章很有用',
});

// 获取书签列表
const bookmarks = await socialApi.getBookmarks({ folderId: 1, page: 1 });

// 删除书签
await socialApi.removeBookmark(bookmarkId);
```

### 4. 通知功能

#### 使用通知组件

```typescript
import NotificationBell from '@/components/notifications/NotificationBell';

function Header() {
  return (
    <header>
      <NotificationBell />
    </header>
  );
}
```

#### 使用通知 API

```typescript
import socialApi from '@/services/socialApi';

// 获取通知列表
const notifications = await socialApi.getNotifications({ page: 1 });

// 获取通知统计
const stats = await socialApi.getNotificationStats();

// 标记为已读
await socialApi.markNotificationRead(notificationId);

// 标记所有为已读
await socialApi.markAllNotificationsRead();

// 删除通知
await socialApi.deleteNotification(notificationId);

// 更新通知偏好
await socialApi.updateNotificationPreferences({
  email_notifications: true,
  push_notifications: true,
  notification_types: {
    follow: true,
    like: true,
    comment: true,
    mention: true,
    system: false,
  },
});
```

### 5. 工具函数

#### 日期格式化

```typescript
import { formatDistanceToNow, formatDate, formatDateTime } from '@/lib/utils';

const date = new Date();

// 相对时间: "3分钟前"
const timeAgo = formatDistanceToNow(date);

// 本地日期: "2024年3月3日"
const localDate = formatDate(date);

// 日期时间: "2024年3月3日 14:30"
const dateTime = formatDateTime(date);
```

#### 其他工具

```typescript
import { formatNumber, truncateText, debounce } from '@/lib/utils';

// 数字格式化
formatNumber(1234); // "1.2k"
formatNumber(1234567); // "1.2M"

// 文本截断
truncateText('这是一段很长的文本...', 10); // "这是一段很长的..."

// 防抖函数
const debouncedSearch = debounce((query) => {
  console.log('搜索:', query);
}, 300);
```

---

## 📁 文件结构

```
frontend/
├── services/
│   └── socialApi.ts              # API 服务客户端
├── hooks/
│   └── useSocialQueries.ts       # React Query Hooks
├── app/
│   └── [username]/
│       ├── followers/
│       │   └── page.tsx          # 粉丝列表页面
│       └── following/
│           └── page.tsx          # 关注列表页面
├── components/
│   ├── follow/
│   │   ├── FollowersList.tsx    # 粉丝列表组件
│   │   └── FollowingList.tsx    # 关注列表组件
│   └── notifications/
│       ├── NotificationBell.tsx  # 通知铃铛
│       └── NotificationPanel.tsx # 通知面板
├── lib/
│   ├── dateUtils.ts              # 日期工具
│   └── utils.ts                  # 通用工具
└── types/
    └── social.types.ts           # 类型定义
```

---

## 🎯 页面路由

### 新增路由

- `/user/[username]/followers` - 用户粉丝列表
- `/user/[username]/following` - 用户关注列表
- `/notifications` - 通知列表（已存在，已更新）

### 导航示例

```tsx
import Link from 'next/link';

<Link href="/user/johndoe/followers">
  查看粉丝
</Link>

<Link href="/user/johndoe/following">
  查看关注
</Link>

<Link href="/notifications">
  通知中心
</Link>
```

---

## 🎨 组件使用示例

### 用户卡片组件

```tsx
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { useFollowUser } from '@/hooks/useSocialQueries';

function UserCard({ user }) {
  const followUser = useFollowUser();
  
  return (
    <Card className="p-4">
      <div className="flex items-center gap-4">
        <Avatar src={user.avatar} alt={user.name} />
        <div>
          <h3>{user.displayName}</h3>
          <p className="text-sm text-gray-400">@{user.username}</p>
        </div>
        <Button onClick={() => followUser.mutate(user.id)}>
          <UserPlus className="w-4 h-4 mr-2" />
          关注
        </Button>
      </div>
    </Card>
  );
}
```

### 点赞按钮组件

```tsx
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useToggleLike, useLikeStats } from '@/hooks/useSocialQueries';

function LikeButton({ postId }) {
  const { data: stats } = useLikeStats('post', postId);
  const toggleLike = useToggleLike();
  
  return (
    <Button
      variant={stats?.is_liked ? 'default' : 'outline'}
      onClick={() => toggleLike.mutate({ targetType: 'post', targetId: postId })}
    >
      <Heart className={`w-4 h-4 mr-2 ${stats?.is_liked ? 'fill-current' : ''}`} />
      {stats?.likes_count || 0}
    </Button>
  );
}
```

---

## 🔐 认证集成

所有 API 调用会自动从 localStorage 读取 `auth_token`：

```typescript
// 设置 token
localStorage.setItem('auth_token', 'your-jwt-token');

// 清除 token
localStorage.removeItem('auth_token');
```

---

## 🐛 错误处理

所有 API 函数都会抛出 `ApiError`：

```typescript
import { ApiError } from '@/types/social.types';

try {
  await socialApi.followUser(userId);
} catch (error) {
  if (error instanceof ApiError) {
    console.error('API 错误:', error.message, error.statusCode);
    // 显示错误提示
    showError(error.message);
  }
}
```

---

## 📊 性能优化

### React Query 缓存

```typescript
// 自动缓存和重新验证
const { data } = useFollowStats(userId);
// 数据会缓存 5 分钟，不会重复请求
```

### 分页加载

```typescript
// 只加载当前页数据
const { data } = useFollowers(userId, currentPage);

// 预加载下一页
useFollowers(userId, currentPage + 1);
```

---

## 🧪 测试

### 功能测试清单

- [ ] 关注/取消关注
- [ ] 粉丝列表加载
- [ ] 关注列表加载
- [ ] 点赞文章/评论
- [ ] 添加/删除书签
- [ ] 通知标记已读
- [ ] 通知删除
- [ ] 分页功能
- [ ] 错误处理

---

## 🚨 常见问题

### 1. API 请求失败

**问题**: 所有 API 请求都失败  
**解决**: 检查 `NEXT_PUBLIC_API_URL` 环境变量是否正确

### 2. React Query 报错

**问题**: 无法使用 React Query hooks  
**解决**: 确保在 `app/providers.tsx` 中添加了 `QueryClientProvider`

### 3. 类型错误

**问题**: TypeScript 类型不匹配  
**解决**: 确保使用了 `@/types/social.types.ts` 中的类型

---

## 📝 下一步

### 短期计划
1. 集成后端 API
2. 添加用户认证
3. 完善错误处理
4. 编写单元测试

### 中期计划
1. WebSocket 实时通知
2. 用户搜索功能
3. 批量操作
4. 性能优化

---

## 📞 支持

如有问题，请查看：
- [完整文档](./FILES_CREATED_SESSION_20260303_FINAL.txt)
- [项目 README](./README.md)
- [开发任务清单](./DEVELOPMENT_TASKS.md)

---

**生成时间**: 2026-03-03  
**维护者**: AI 开发团队  
**许可证**: MIT
