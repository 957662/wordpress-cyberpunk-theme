# 🚀 CyberPress 社交功能快速开始指南

## 📦 已创建的文件

### 核心文件 (8个)

1. **API 服务层**
   - `/frontend/lib/api/social.ts` (449行)
   - 完整的社交功能 API 封装

2. **自定义 Hooks**
   - `/frontend/hooks/useSocialFeatures.ts` (482行)
   - 5个专用社交功能 Hooks

3. **类型定义**
   - `/frontend/types/social.types.ts` (392行)
   - 完整的 TypeScript 类型系统

4. **UI 组件** (5个)
   - `/frontend/components/social/SocialStatsCard.tsx` - 社交统计卡片
   - `/frontend/components/social/ActivityFeed.tsx` - 活动动态
   - `/frontend/components/social/UserRelationsList.tsx` - 用户关系列表
   - `/frontend/components/user/ProfileHeader.tsx` - 用户资料头部
   - `/frontend/components/notifications/NotificationBell.tsx` - 通知铃铛

---

## 🎯 快速使用示例

### 1. 使用社交 API

```typescript
import { socialApi, likeApi, bookmarkApi, notificationApi } from '@/lib/api/social';

// 关注用户
const followResult = await socialApi.toggleFollow('user-123');
console.log(followResult.data.isFollowing); // true

// 获取关注统计
const stats = await socialApi.getFollowStats('user-123');
console.log(stats.data.followersCount); // 150

// 点赞文章
const likeResult = await likeApi.toggleLike('post-456');
console.log(likeResult.data.liked); // true
console.log(likeResult.data.likesCount); // 42

// 收藏文章
const bookmarkResult = await bookmarkApi.toggleBookmark('post-456');
console.log(bookmarkResult.data.bookmarked); // true

// 获取通知
const notifications = await notificationApi.getNotifications({
  page: 1,
  perPage: 10,
  unreadOnly: false
});
```

### 2. 使用组件

#### 社交统计卡片

```tsx
import { SocialStatsCard } from '@/components/social/SocialStatsCard';

<SocialStatsCard
  userId="user-123"
  username="johndoe"
  variant="default"
  showTrends={true}
  onViewFollowers={() => console.log('View followers')}
  onViewFollowing={() => console.log('View following')}
/>
```

#### 用户资料头部

```tsx
import { ProfileHeader } from '@/components/user/ProfileHeader';

<ProfileHeader
  userId="user-123"
  isOwnProfile={false}
  onEdit={() => router.push('/settings/profile')}
  onMessage={() => openChat('user-123')}
/>
```

#### 通知铃铛

```tsx
import { NotificationBell } from '@/components/notifications/NotificationBell';

<NotificationBell
  position="header"
  showUnreadCount={true}
/>
```

#### 活动动态

```tsx
import { ActivityFeed } from '@/components/social/ActivityFeed';

<ActivityFeed
  userId="user-123"
  globalFeed={false}
  maxItems={10}
  showLoadMore={true}
/>
```

#### 用户关系列表

```tsx
import { UserRelationsList } from '@/components/social/UserRelationsList';

<UserRelationsList
  userId="user-123"
  type="followers"
  onClose={() => setShowModal(false)}
/>
```

### 3. 使用 Hooks

```tsx
import { useFollow, useLike, useBookmark, useNotifications } from '@/hooks/useSocialFeatures';

function MyComponent() {
  // 关注功能
  const {
    isFollowing,
    followersCount,
    toggleFollow,
    isLoading: isFollowLoading
  } = useFollow('user-123');

  // 点赞功能
  const {
    isLiked,
    likesCount,
    toggleLike,
    isLoading: isLikeLoading
  } = useLike('post-456');

  // 收藏功能
  const {
    isBookmarked,
    bookmarksCount,
    toggleBookmark,
    isLoading: isBookmarkLoading
  } = useBookmark('post-456');

  // 通知功能
  const {
    unreadCount,
    markAsRead,
    markAllAsRead,
    refreshUnreadCount
  } = useNotifications();

  return (
    <div>
      <button onClick={toggleFollow} disabled={isFollowLoading}>
        {isFollowing ? '取消关注' : '关注'} ({followersCount})
      </button>

      <button onClick={toggleLike} disabled={isLikeLoading}>
        {isLiked ? '♥' : '♡'} {likesCount}
      </button>

      <button onClick={toggleBookmark} disabled={isBookmarkLoading}>
        {isBookmarked ? '★' : '☆'} {bookmarksCount}
      </button>

      <button onClick={markAllAsRead}>
        全部已读 ({unreadCount})
      </button>
    </div>
  );
}
```

### 4. 组合使用示例

```tsx
import { ProfileHeader } from '@/components/user/ProfileHeader';
import { SocialStatsCard } from '@/components/social/SocialStatsCard';
import { ActivityFeed } from '@/components/social/ActivityFeed';
import { UserRelationsList } from '@/components/social/UserRelationsList';
import { useFollow } from '@/hooks/useSocialFeatures';

export default function UserProfilePage({ params }: { params: { id: string } }) {
  const { isFollowing, toggleFollow } = useFollow(params.id);

  return (
    <div className="container mx-auto py-8">
      {/* 用户资料头部 */}
      <ProfileHeader
        userId={params.id}
        isOwnProfile={false}
      />

      {/* 社交统计 */}
      <div className="mt-6">
        <SocialStatsCard
          userId={params.id}
          variant="detailed"
          showTrends={true}
        />
      </div>

      {/* 活动动态 */}
      <div className="mt-6">
        <ActivityFeed
          userId={params.id}
          globalFeed={false}
        />
      </div>
    </div>
  );
}
```

---

## 🔧 配置要求

### 1. 环境变量

```env
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_WS_BASE_URL=ws://localhost:8000/ws
```

### 2. 必需的依赖

```json
{
  "dependencies": {
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.344.0"
  }
}
```

### 3. Tailwind 配置

确保你的 `tailwind.config.ts` 包含这些颜色：

```typescript
theme: {
  extend: {
    colors: {
      'cyber-purple': '#9D00FF',
      'cyber-pink': '#FF006E',
      'cyber-cyan': '#00D9FF',
      'cyber-dark': '#0A0A0F',
      'cyber-muted': '#8B8B93',
    }
  }
}
```

---

## 📱 页面集成示例

### 用户资料页面

```tsx
// app/user/[id]/page.tsx
import { ProfileHeader } from '@/components/user/ProfileHeader';
import { SocialStatsCard } from '@/components/social/SocialStatsCard';
import { ActivityFeed } from '@/components/social/ActivityFeed';

export default function UserProfilePage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-cyber-dark">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <ProfileHeader userId={params.id} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-2">
            <ActivityFeed userId={params.id} />
          </div>
          <div>
            <SocialStatsCard userId={params.id} variant="compact" />
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 关注者列表页面

```tsx
// app/user/[id]/followers/page.tsx
import { UserRelationsList } from '@/components/social/UserRelationsList';
import Link from 'next/link';

export default function FollowersPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-cyber-dark py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          href={`/user/${params.id}`}
          className="text-cyber-purple hover:underline mb-4 block"
        >
          ← 返回资料
        </Link>
        <UserRelationsList userId={params.id} type="followers" />
      </div>
    </div>
  );
}
```

### 通知页面

```tsx
// app/notifications/page.tsx
'use client';

import { NotificationBell } from '@/components/notifications/NotificationBell';

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-cyber-dark py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">通知</h1>
        <div className="flex justify-end">
          <NotificationBell position="floating" />
        </div>
      </div>
    </div>
  );
}
```

---

## 🎨 样式定制

所有组件都支持通过 `className` prop 自定义样式：

```tsx
<SocialStatsCard
  userId="user-123"
  className="shadow-2xl border-cyber-cyan/30"
/>

<ProfileHeader
  userId="user-123"
  className="rounded-none"
/>
```

---

## ⚠️ 注意事项

1. **后端集成**: 这些组件需要后端 API 支持。需要实现以下端点：
   - `/api/social/follows/*`
   - `/api/social/likes/*`
   - `/api/social/bookmarks/*`
   - `/api/social/notifications/*`
   - `/api/social/activity/*`

2. **类型安全**: 所有组件和函数都有完整的 TypeScript 类型支持

3. **错误处理**: API 调用包含错误处理，确保在生产环境中适当处理错误

4. **性能优化**: 使用了 React.memo、useCallback、useMemo 等优化技术

5. **响应式设计**: 所有组件都是响应式的，支持移动端和桌面端

---

## 📚 更多文档

- [完整功能文档](./SOCIAL_FEATURES_CREATED.md)
- [组件库文档](./frontend/COMPONENTS.md)
- [API 参考](./frontend/lib/api/social.ts)
- [类型定义](./frontend/types/social.types.ts)

---

**创建时间**: 2026-03-03
**版本**: v1.0.0
**作者**: AI 开发团队
