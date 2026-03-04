# 🚀 新功能快速开始指南

**创建日期**: 2026-03-05
**适用版本**: CyberPress Platform v1.0+

---

## 📋 概述

本次更新为 CyberPress Platform 添加了以下核心功能：

1. **💬 实时消息系统** - WebSocket 驱动的私信功能
2. **📊 活动流系统** - 个性化动态和通知
3. **⚡ 性能监控** - 实时性能追踪和警报
4. **🎯 推荐系统** - 智能内容推荐
5. **💾 缓存服务** - 前后端缓存优化

---

## 🔧 安装和配置

### 1. 后端配置

```bash
cd backend

# 安装依赖（如果有新增）
pip install -r requirements.txt

# 运行数据库迁移
alembic upgrade head

# 启动后端服务
python main.py
```

### 2. 前端配置

```bash
cd frontend

# 安装新增依赖
npm install react-virtuoso date-fns

# 启动开发服务器
npm run dev
```

### 3. 环境变量

确保 `.env` 文件包含以下配置：

```env
# Backend (.env)
DATABASE_URL=postgresql://user:pass@localhost/cyberpress
SECRET_KEY=your-secret-key
ALLOWED_ORIGINS=http://localhost:3000

# Frontend (.env.local)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
```

---

## 💬 实时消息系统使用

### 后端 API 使用

```python
# 创建新对话
POST /api/v1/messages/conversations
{
    "user_id": 2,
    "subject": "项目讨论"
}

# 发送消息
POST /api/v1/messages/conversations/{conversation_id}/messages
{
    "content": "你好！",
    "message_type": "text"
}

# 获取对话列表
GET /api/v1/messages/conversations?page=1&per_page=20

# 获取消息历史
GET /api/v1/messages/conversations/{conversation_id}/messages

# 标记消息已读
PUT /api/v1/messages/messages/{message_id}/read

# 获取未读数
GET /api/v1/messages/unread-count
```

### 前端组件使用

```tsx
import { MessageCenter } from '@/components/messages/message-center';
import { ChatWindow } from '@/components/chat/chat-window';

function MyApp() {
  const [isMessageCenterOpen, setIsMessageCenterOpen] = useState(false);
  const [activeConversation, setActiveConversation] = useState(null);

  return (
    <>
      {/* 消息中心 */}
      <MessageCenter
        isOpen={isMessageCenterOpen}
        onClose={() => setIsMessageCenterOpen(false)}
        currentUser={currentUser}
      />

      {/* 聊天窗口 */}
      {activeConversation && (
        <ChatWindow
          conversationId={activeConversation.id}
          otherUser={activeConversation.other_user}
          currentUser={currentUser}
          onClose={() => setActiveConversation(null)}
        />
      )}
    </>
  );
}
```

---

## 📊 活动流系统使用

### 后端 API 使用

```python
# 获取个性化活动流
GET /api/v1/activities/feed?page=1&per_page=50

# 获取通知
GET /api/v1/activities/notifications?unread_only=true

# 获取活动统计
GET /api/v1/activities/stats?days=30

# 获取热门内容
GET /api/v1/activities/trending?page=1&per_page=20

# 标记活动已读
POST /api/v1/activities/{activity_id}/read

# 全部标记已读
POST /api/v1/activities/notifications/read-all
```

### 前端组件使用

```tsx
import { ActivityStream } from '@/components/activity/activity-stream';

function ActivityFeed() {
  return (
    <ActivityStream
      userId={user.id}
      maxItems={50}
      autoRefresh={true}
      onActivityClick={(activity) => {
        // 处理活动点击
        console.log('Activity clicked:', activity);
      }}
    />
  );
}
```

### 推荐服务使用

```python
from app.services.recommendation import get_recommendation_service

# 获取推荐服务
recommendation_service = get_recommendation_service(db)

# 推荐文章
posts = await recommendation_service.get_recommended_posts(
    user_id=user.id,
    limit=10,
    exclude_read=True
)

# 推荐用户
users = await recommendation_service.get_recommended_users(
    user_id=user.id,
    limit=10
)

# 获取热门文章
trending = await recommendation_service.get_trending_posts(
    limit=10,
    time_period=7
)

# 获取相关文章
related = await recommendation_service.get_related_posts(
    post_id=post.id,
    limit=5
)
```

---

## ⚡ 性能监控使用

### 前端组件使用

```tsx
import { PerformanceMonitor } from '@/components/performance/performance-monitor';

function App() {
  return (
    <>
      {/* 其他内容 */}

      {/* 性能监控器 */}
      <PerformanceMonitor
        sampleRate={1000}  // 采样间隔（毫秒）
        showDetails={false}  // 是否显示详细信息
        alertThresholds={{
          apiResponseTime: 1000,  // API 响应时间阈值（毫秒）
          memoryUsage: 80,        // 内存使用阈值（百分比）
          fps: 30,                // FPS 阈值
        }}
        onMetricsUpdate={(metrics) => {
          // 处理指标更新
          console.log('Performance metrics:', metrics);
        }}
      />
    </>
  );
}
```

---

## 💾 缓存服务使用

### 后端缓存使用

```python
from app.services.cache import cache, cached

# 基本使用
await cache.set('key', value, ttl=300)  # 缓存 5 分钟
value = await cache.get('key')
await cache.delete('key')

# 使用装饰器
@cached(ttl=600, key_prefix='posts')
async def get_posts():
    return await fetch_posts_from_db()

# 批量操作
await cache.clear()
removed = await cache.cleanup_expired()

# 获取统计信息
stats = cache.get_stats()
print(f"Cache hit rate: {stats['hit_rate']}%")
```

### 前端缓存使用

```typescript
import { cache, useCache } from '@/lib/cache-service';

// 基本使用
cache.set('key', data, 300);  // 5 分钟
const data = cache.get('key');
cache.delete('key');

// 使用 React Hook
function MyComponent() {
  const { cache, stats } = useCache();

  return (
    <div>
      <p>Cache hit rate: {stats.hitRate}%</p>
      <p>Total entries: {stats.size}</p>
    </div>
  );
}
```

---

## 🎯 新功能展示页面

访问 `/showcase/new-features` 查看所有新功能的交互式演示：

```
http://localhost:3000/showcase/new-features
```

展示页面包含：
- 功能卡片展示
- 实时演示
- API 文档
- 使用说明

---

## 🔗 API 端点总览

### 消息系统
- `GET /api/v1/messages/conversations` - 获取对话列表
- `POST /api/v1/messages/conversations` - 创建对话
- `GET /api/v1/messages/conversations/{id}` - 获取对话详情
- `GET /api/v1/messages/conversations/{id}/messages` - 获取消息列表
- `POST /api/v1/messages/conversations/{id}/messages` - 发送消息
- `PUT /api/v1/messages/messages/{id}/read` - 标记已读
- `DELETE /api/v1/messages/conversations/{id}` - 删除对话
- `GET /api/v1/messages/unread-count` - 获取未读数

### 活动流系统
- `GET /api/v1/activities/feed` - 获取活动流
- `GET /api/v1/activities/notifications` - 获取通知
- `GET /api/v1/activities/stats` - 获取统计
- `GET /api/v1/activities/trending` - 获取热门内容
- `POST /api/v1/activities/{id}/read` - 标记已读
- `POST /api/v1/activities/notifications/read-all` - 全部标记已读

---

## 📚 更多资源

- **完整文档**: 查看 `NEW_FEATURES_SUMMARY.md`
- **API 文档**: 访问 `http://localhost:8000/docs`
- **示例代码**: 查看 `frontend/app/showcase/new-features/page.tsx`

---

## 🐛 故障排除

### 问题：WebSocket 连接失败

**解决方案**:
1. 检查后端是否正常运行
2. 确认防火墙允许 WebSocket 连接
3. 验证 `NEXT_PUBLIC_WS_URL` 配置正确

### 问题：前端依赖安装失败

**解决方案**:
```bash
# 清除缓存并重新安装
rm -rf node_modules package-lock.json
npm install
```

### 问题：数据库迁移错误

**解决方案**:
```bash
# 检查数据库连接
alembic upgrade head

# 如果出错，回滚并重试
alembic downgrade base
alembic upgrade head
```

---

## 🎊 开始使用

所有新功能已准备就绪！现在就可以：

1. ✅ 启动后端和前端服务
2. ✅ 访问新功能展示页面
3. ✅ 测试实时消息功能
4. ✅ 查看活动流和通知
5. ✅ 监控应用性能
6. ✅ 体验智能推荐

祝使用愉快！🚀

---

**创建者**: AI 开发团队
**更新时间**: 2026-03-05
**版本**: 1.0.0
