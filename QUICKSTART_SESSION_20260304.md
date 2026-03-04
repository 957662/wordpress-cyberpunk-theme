# 🚀 快速开始指南 - 2026-03-04 更新

**欢迎！** 这份指南将帮助你快速使用本次更新创建的新组件和功能。

---

## 🎯 本次更新内容

### 新增组件 (6个)
✅ **NotificationCenter** - 通知中心组件  
✅ **UserCard** - 用户卡片组件  
✅ **CommentForm** - 评论表单组件  
✅ **CyberButton** - 赛博朋克按钮组件  

### 新增 Hooks (1个)
✅ **useNotifications** - 通知管理 Hook  

### 新增服务 (3个)
✅ **notificationService** - 通知服务  
✅ **followService** - 关注服务  
✅ **likeService** - 点赞服务  

### 新增类型 (1个)
✅ **notification.types** - 通知类型定义  

### 新增页面 (1个)
✅ **Notifications Page** - 通知页面  

---

## 🏃 快速开始

### 1. 通知中心

#### 基础用法

```tsx
'use client';

import { NotificationCenter } from '@/components/notifications';

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4">
      <h1>My App</h1>
      <NotificationCenter position="top-right" />
    </header>
  );
}
```

#### 高级用法

```tsx
'use client';

import { NotificationCenter } from '@/components/notifications';
import { useNotifications } from '@/hooks/useNotifications';

export default function Header() {
  const { unreadCount } = useNotifications({
    autoFetch: true,
    pollInterval: 30000, // 30秒轮询一次
  });

  return (
    <header className="flex items-center justify-between p-4">
      <h1>My App</h1>
      <div className="flex items-center gap-4">
        <span>{unreadCount} 未读</span>
        <NotificationCenter position="top-right" />
      </div>
    </header>
  );
}
```

---

### 2. 用户卡片

#### 基础用法

```tsx
'use client';

import { UserCard } from '@/components/user';

const mockUser = {
  id: '1',
  username: 'johndoe',
  displayName: 'John Doe',
  bio: 'Full-stack developer passionate about React',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  location: 'San Francisco, CA',
  website: 'https://johndoe.dev',
  joinDate: new Date('2023-01-01'),
  stats: {
    posts: 42,
    followers: 1234,
    following: 567,
  },
};

export default function UserProfile() {
  return (
    <div className="p-4">
      <UserCard user={mockUser} />
    </div>
  );
}
```

#### 带交互的用户卡片

```tsx
'use client';

import { UserCard } from '@/components/user';
import { useState } from 'react';

export default function UserProfile() {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // 调用关注 API
  };

  return (
    <div className="p-4">
      <UserCard 
        user={mockUser}
        showStats
        showFollowButton
        isFollowing={isFollowing}
        onFollow={handleFollow}
        onClick={() => console.log('Navigate to user profile')}
      />
    </div>
  );
}
```

#### 用户卡片网格

```tsx
'use client';

import { UserCardGrid } from '@/components/user';

export default function UserList() {
  const users = [mockUser1, mockUser2, mockUser3];

  return (
    <div className="p-4">
      <UserCardGrid users={users} columns={3} />
    </div>
  );
}
```

---

### 3. 评论表单

#### 基础用法

```tsx
'use client';

import { CommentForm } from '@/components/comments-new';

export default function PostPage() {
  const handleCommentSuccess = (comment) => {
    console.log('New comment:', comment);
    // 刷新评论列表
  };

  return (
    <div className="p-4">
      <CommentForm 
        postId="123"
        onSuccess={handleCommentSuccess}
      />
    </div>
  );
}
```

#### 回复评论

```tsx
'use client';

import { CommentForm } from '@/components/comments-new';

export default function CommentReply() {
  return (
    <CommentForm 
      postId="123"
      parentId="456"
      placeholder="Write a reply..."
      submitLabel="Reply"
      onSuccess={(comment) => console.log(comment)}
      onCancel={() => console.log('Cancel')}
    />
  );
}
```

---

### 4. 赛博按钮

#### 基础按钮

```tsx
import { CyberButton } from '@/components/effects';

export default function ButtonDemo() {
  return (
    <div className="flex gap-4 p-4">
      {/* Primary Button */}
      <CyberButton variant="primary" color="cyan">
        Click Me
      </CyberButton>

      {/* Secondary Button */}
      <CyberButton variant="secondary" color="purple">
        Cancel
      </CyberButton>

      {/* Outline Button */}
      <CyberButton variant="outline" color="pink">
        Learn More
      </CyberButton>
    </div>
  );
}
```

#### 带图标和加载状态

```tsx
import { CyberButton } from '@/components/effects';
import { Download, Star } from 'lucide-react';

export default function ButtonDemo() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex gap-4 p-4">
      {/* With Icon */}
      <CyberButton 
        icon={<Download className="w-4 h-4" />}
        onClick={() => console.log('Download')}
      >
        Download
      </CyberButton>

      {/* Loading State */}
      <CyberButton 
        loading={loading}
        onClick={() => setLoading(true)}
      >
        Submit
      </CyberButton>

      {/* Icon Right */}
      <CyberButton 
        icon={<Star className="w-4 h-4" />}
        iconPosition="right"
      >
        Star Repo
      </CyberButton>
    </div>
  );
}
```

#### 动画按钮

```tsx
import { CyberButtonAnimated, CyberButtonGlitch } from '@/components/effects';

export default function ButtonDemo() {
  return (
    <div className="flex gap-4 p-4">
      {/* Animated Border */}
      <CyberButtonAnimated>
        Get Started
      </CyberButtonAnimated>

      {/* Glitch Effect */}
      <CyberButtonGlitch>
        Glitch Button
      </CyberButtonGlitch>
    </div>
  );
}
```

---

### 5. 使用 Hooks

#### useNotifications Hook

```tsx
'use client';

import { useNotifications } from '@/hooks/useNotifications';

export default function NotificationDemo() {
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  } = useNotifications({
    autoFetch: true,
    pollInterval: 30000,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h2>Notifications ({unreadCount})</h2>
      <button onClick={markAllAsRead}>Mark All Read</button>
      <button onClick={clearAll}>Clear All</button>
      
      <ul>
        {notifications.map(notification => (
          <li key={notification.id}>
            {notification.title}
            {!notification.read && (
              <button onClick={() => markAsRead(notification.id)}>
                Mark Read
              </button>
            )}
            <button onClick={() => deleteNotification(notification.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

### 6. 使用服务

#### Notification Service

```tsx
import { notificationService } from '@/services/notificationService';

// 获取通知列表
const { notifications, total, unreadCount } = await notificationService.getNotifications({
  page: 1,
  limit: 10,
  type: 'comment',
  unreadOnly: true,
});

// 标记已读
await notificationService.markAsRead('notification-id');

// 全部标记已读
await notificationService.markAllAsRead();

// 删除通知
await notificationService.deleteNotification('notification-id');

// 获取统计信息
const stats = await notificationService.getStats();

// 获取偏好设置
const preferences = await notificationService.getPreferences();

// 更新偏好设置
await notificationService.updatePreferences({
  email: true,
  push: false,
});
```

#### Follow Service

```tsx
import { followService } from '@/services/followService';

// 关注用户
await followService.followUser('user-id');

// 取消关注
await followService.unfollowUser('user-id');

// 检查关注状态
const isFollowing = await followService.isFollowing('user-id');

// 获取关注统计
const stats = await followService.getFollowStats('user-id');

// 获取关注列表
const following = await followService.getFollowing({
  page: 1,
  limit: 20,
});

// 获取粉丝列表
const followers = await followService.getFollowers({
  page: 1,
  limit: 20,
});
```

#### Like Service

```tsx
import { likeService } from '@/services/likeService';

// 点赞文章
await likeService.likeItem('post', 'post-id');

// 取消点赞
await likeService.unlikeItem('post', 'post-id');

// 检查点赞状态
const hasLiked = await likeService.hasLiked('post', 'post-id');

// 获取点赞统计
const stats = await likeService.getLikeStats('post', 'post-id');

// 获取点赞列表
const likes = await likeService.getLikes('post', 'post-id', {
  page: 1,
  limit: 20,
});

// 切换点赞
const { liked, like } = await likeService.toggleLike('post', 'post-id');
```

---

## 🎨 组件属性参考

### NotificationCenter

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| className | string | - | 自定义类名 |
| position | 'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left' | 'top-right' | 位置 |

### UserCard

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| user | User | - | 用户数据 |
| variant | 'default' \| 'compact' \| 'detailed' | 'default' | 变体 |
| showStats | boolean | true | 显示统计 |
| showFollowButton | boolean | true | 显示关注按钮 |
| isFollowing | boolean | false | 是否已关注 |
| onFollow | () => void | - | 关注回调 |
| onClick | () => void | - | 点击回调 |

### CommentForm

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| postId | string | - | 文章 ID |
| parentId | string | - | 父评论 ID（回复） |
| placeholder | string | 'Write a comment...' | 占位符 |
| submitLabel | string | 'Post Comment' | 提交按钮文本 |
| showAvatar | boolean | true | 显示头像 |
| onSuccess | (comment) => void | - | 成功回调 |
| onCancel | () => void | - | 取消回调 |

### CyberButton

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| variant | 'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger' | 'primary' | 变体 |
| size | 'sm' \| 'md' \| 'lg' \| 'icon' | 'md' | 尺寸 |
| color | 'cyan' \| 'purple' \| 'pink' \| 'green' \| 'yellow' | 'cyan' | 颜色 |
| loading | boolean | false | 加载状态 |
| icon | ReactNode | - | 图标 |
| iconPosition | 'left' \| 'right' | 'left' | 图标位置 |
| glow | boolean | false | 发光效果 |

---

## 📝 类型定义

### Notification Type

```typescript
interface Notification {
  id: string;
  type: 'comment' | 'like' | 'follow' | 'mention' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  avatar?: string;
  metadata?: Record<string, unknown>;
}
```

### User Type

```typescript
interface User {
  id: string;
  username: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  location?: string;
  website?: string;
  joinDate: Date;
  stats?: {
    posts?: number;
    followers?: number;
    following?: number;
    likes?: number;
  };
  verified?: boolean;
  badge?: string;
}
```

---

## 🚀 下一步

1. **探索组件库**
   - 查看所有可用组件
   - 自定义样式
   - 组合使用

2. **集成到项目**
   - 替换现有组件
   - 添加新功能
   - 优化性能

3. **扩展功能**
   - 创建自定义组件
   - 添加新的服务
   - 实现实时功能

---

## 🆘 需要帮助？

- 查看完整文档: `FILES_CREATED_SESSION_20260304.md`
- 查看组件源码: `frontend/components/`
- 查看类型定义: `frontend/types/`

---

**祝你使用愉快！** 🎉

Built with ❤️ by AI Development Team
