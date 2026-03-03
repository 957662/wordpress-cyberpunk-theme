# 🚀 Phase 3 社交功能 - 快速使用指南

## 📦 快速开始

### 1. 安装依赖
```bash
cd frontend
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
```

### 3. 访问页面
- 通知页面: http://localhost:3000/notifications
- Feed 页面: http://localhost:3000/feed

---

## 💡 使用示例

### 关注功能

```tsx
import { useFollowStatus } from '@/hooks/api/useFollow';

function UserProfile({ userId }) {
  const { 
    isFollowing, 
    followerCount, 
    followingCount,
    toggleFollow,
    isPending 
  } = useFollowStatus(userId);

  return (
    <div className="flex items-center gap-4">
      <div className="flex gap-4">
        <div>
          <span className="font-bold">{followerCount}</span>
          <span className="text-muted">Followers</span>
        </div>
        <div>
          <span className="font-bold">{followingCount}</span>
          <span className="text-muted">Following</span>
        </div>
      </div>
      
      <button 
        onClick={toggleFollow}
        disabled={isPending}
        className="btn"
      >
        {isPending ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow'}
      </button>
    </div>
  );
}
```

### 通知功能

```tsx
import { 
  useNotifications, 
  useUnreadCount,
  useNotificationActions 
} from '@/hooks/api/useNotification';

function NotificationCenter() {
  const { notifications, unreadCount } = useNotifications();
  const { markAsRead, markAllAsRead } = useNotificationActions();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2>Notifications ({unreadCount} unread)</h2>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead}>
            Mark All Read
          </button>
        )}
      </div>

      <div className="space-y-2">
        {notifications.map(notification => (
          <div 
            key={notification.id}
            className="notification-item"
            onClick={() => markAsRead(notification.id)}
          >
            <div>{notification.icon}</div>
            <div>
              <h3>{notification.title}</h3>
              <p>{notification.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 点赞功能

```tsx
import { useLikeStats } from '@/hooks/api/useLike';

function PostActions({ postId }) {
  const { count, isLiked, toggleLike, isPending } = useLikeStats('post', postId);

  return (
    <button 
      onClick={toggleLike}
      disabled={isPending}
      className={`like-btn ${isLiked ? 'liked' : ''}`}
    >
      <Heart className={isLiked ? 'fill-current' : ''} />
      <span>{count}</span>
    </button>
  );
}
```

---

## 🔧 API 端点

### 关注 API

```typescript
// 获取关注状态
GET /api/follow?userId=123

// 关注用户
POST /api/follow
Body: { followingId: "123" }

// 取消关注
DELETE /api/follow?followingId=123

// 切换关注状态
PUT /api/follow
Body: { followingId: "123" }
```

### 通知 API

```typescript
// 获取通知列表
GET /api/notifications?page=1&pageSize=20&status=unread

// 创建通知
POST /api/notifications
Body: { type: "comment", title: "...", content: "...", recipientId: "123" }

// 批量操作
PATCH /api/notifications
Body: { action: "mark_read", notificationIds: ["1", "2", "3"] }

// 删除通知
DELETE /api/notifications?id=123
```

### 点赞 API

```typescript
// 获取点赞统计
GET /api/likes?targetType=post&targetId=123

// 点赞
POST /api/likes
Body: { targetType: "post", targetId: "123" }

// 取消点赞
DELETE /api/likes?targetType=post&targetId=123

// 切换点赞状态
PUT /api/likes/toggle
Body: { targetType: "post", targetId: "123" }
```

---

## 🎨 自定义样式

所有组件都使用 Tailwind CSS 和赛博朋克主题:

```tsx
// 自定义颜色
const cyberColors = {
  cyan: '#00f0ff',
  pink: '#ff0080',
  purple: '#9d00ff',
  green: '#00ff88',
};

// 使用示例
<button className="
  bg-cyber-cyan 
  text-black 
  hover:shadow-[0_0_20px_rgba(0,240,255,0.5)]
">
  Click Me
</button>
```

---

## 📚 类型定义

所有类型都在 `types/` 目录中定义:

```typescript
// 关注相关类型
import type { 
  Follow, 
  FollowStatus, 
  FollowersResponse 
} from '@/types/follow.types';

// 通知相关类型
import type { 
  Notification, 
  NotificationSettings,
  NotificationStats 
} from '@/types/notification.types';

// 点赞相关类型
import type { 
  Like, 
  LikeStats, 
  LikeTargetType 
} from '@/types/like.types';
```

---

## ⚡ 性能优化

所有 Hooks 都内置了缓存和性能优化:

```typescript
// 自动缓存 5 分钟
const { followStatus } = useFollowStatus(userId);

// 自动轮询 (每分钟)
const { unreadCount } = useUnreadCount();

// 批量查询优化
const { followStatuses } = useBatchFollowStatus(userIds);
```

---

## 🐛 调试技巧

### 启用 React Query DevTools

```tsx
// app/layout.tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <QueryProvider>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryProvider>
      </body>
    </html>
  );
}
```

### 查看网络请求

打开浏览器 DevTools → Network 标签页,查看所有 API 请求。

---

## 📝 常见问题

### Q: 如何处理错误?

A: 所有 Hooks 都返回 `error` 对象:

```typescript
const { data, error } = useFollowStatus(userId);

if (error) {
  return <div>Error: {error.message}</div>;
}
```

### Q: 如何实现乐观更新?

A: 使用 React Query 的 `optimisticUpdate`:

```typescript
const mutation = useMutation({
  mutationFn: followUser,
  onMutate: async (newData) => {
    // 取消相关查询
    await queryClient.cancelQueries(['follow-status']);
    
    // 保存之前的数据
    const previousData = queryClient.getQueryData(['follow-status']);
    
    // 乐观更新
    queryClient.setQueryData(['follow-status'], old => ({
      ...old,
      isFollowing: true
    }));
    
    return { previousData };
  },
  onError: (err, newData, context) => {
    // 回滚
    queryClient.setQueryData(['follow-status'], context.previousData);
  }
});
```

### Q: 如何实现实时通知?

A: 当前使用轮询,可以升级为 WebSocket:

```typescript
// hooks/api/useRealtimeNotifications.ts
export function useRealtimeNotifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000/ws');
    
    ws.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      setNotifications(prev => [notification, ...prev]);
    };
    
    return () => ws.close();
  }, []);

  return { notifications };
}
```

---

## 🎯 下一步

1. **后端集成**: 实现 API 路由中的 TODO 项
2. **测试**: 添加单元测试和 E2E 测试
3. **优化**: 性能调优和用户体验改进
4. **部署**: 部署到生产环境

---

**Happy Coding! 🚀**

**需要帮助?** 查看 [完整文档](./PHASE_3_IMPLEMENTATION_REPORT.md)
