# 🚀 新功能快速参考

**CyberPress Platform - 新功能组件快速参考指南**

---

## 📦 新增组件列表

### 1️⃣ AdvancedEditor（高级编辑器）
**位置**: `@/components/editor/AdvancedEditor`

```tsx
import { AdvancedEditor } from '@/components/new-features';

<AdvancedEditor
  initialValue="Start writing..."
  mode="wysiwyg"
  autoSave={true}
  onContentChange={(content) => console.log(content)}
/>
```

**特性**:
- WYSIWYG / Markdown / 分屏模式
- 自动保存
- 工具栏操作
- 全屏支持
- 字数统计

---

### 2️⃣ RealtimeEditor（实时协作编辑器）
**位置**: `@/components/collaborative/RealtimeEditor`

```tsx
import { RealtimeEditor } from '@/components/new-features';

<RealtimeEditor
  documentId="doc-123"
  userId="user-456"
  userName="John Doe"
  wsUrl="ws://localhost:3001"
  onContentChange={handleChange}
/>
```

**特性**:
- 多人实时编辑
- 光标同步
- 评论系统
- 文档锁定
- 在线用户显示

---

### 3️⃣ AnalyticsDashboard（数据分析仪表板）
**位置**: `@/components/analytics/AnalyticsDashboard`

```tsx
import { AnalyticsDashboard } from '@/components/new-features';

<AnalyticsDashboard
  metrics={metricsData}
  charts={chartsData}
  timeRange="7d"
  autoRefresh={true}
  onExport={handleExport}
/>
```

**特性**:
- 多种图表类型
- 实时数据更新
- 自动刷新
- 数据导出
- 响应式布局

---

### 4️⃣ AdvancedFileManager（高级文件管理器）
**位置**: `@/components/upload/AdvancedFileManager`

```tsx
import { AdvancedFileManager } from '@/components/new-features';

<AdvancedFileManager
  files={files}
  onUpload={handleUpload}
  onDelete={handleDelete}
  view="grid"
/>
```

**特性**:
- 拖拽上传
- 文件预览
- 批量操作
- 搜索过滤
- 进度跟踪

---

### 5️⃣ WebSocket 实时通信
**位置**: `@/lib/services/websocket`

```tsx
import { useWebSocket } from '@/components/new-features';

function Chat() {
  const { state, send, on } = useWebSocket({
    url: 'ws://localhost:3001'
  });

  useEffect(() => {
    const unsubscribe = on('message', (data) => {
      console.log('Received:', data);
    });
    return unsubscribe;
  }, [on]);

  return <div>状态: {state.isConnected ? '已连接' : '未连接'}</div>;
}
```

**特性**:
- 自动重连
- 心跳检测
- 消息队列
- 事件订阅
- React Hook 集成

---

### 6️⃣ I18n 国际化服务
**位置**: `@/lib/services/i18n-advanced`

```tsx
import { useI18n } from '@/components/new-features';

function App() {
  const { t, locale, changeLocale, formatDate } = useI18n();

  return (
    <div>
      <h1>{t('welcome', { name: 'John' })}</h1>
      <p>{formatDate(new Date())}</p>
      <button onClick={() => changeLocale('zh')}>中文</button>
    </div>
  );
}
```

**特性**:
- 多语言支持
- 复数形式
- 日期/数字格式化
- RTL 支持
- 懒加载翻译

---

## 🔧 后端服务

### EmailService（邮件服务）
**位置**: `backend/app/services/email.py`

```python
from app.services.email import EmailService, EmailRecipient

email_service = EmailService()

# 发送欢迎邮件
recipient = EmailRecipient(
    email="user@example.com",
    name="John Doe"
)
await email_service.send_welcome_email(
    recipient,
    verification_url="https://example.com/verify"
)
```

### CacheService（缓存服务）
**位置**: `backend/app/services/cache.py`

```python
from app.services.cache import CacheService, cached

cache = CacheService()

# 基本使用
await cache.set('key', 'value', ttl=3600)
value = await cache.get('key')

# 使用装饰器
@cached(cache_service, ttl=600)
async def get_expensive_data():
    return await database.query(...)
```

---

## 📋 安装依赖

### 前端依赖
```bash
cd frontend
npm install framer-motion lucide-react
```

### 后端依赖
```bash
cd backend
pip install jinja2 redis
```

---

## 🎨 使用示例

### 完整的编辑器页面
```tsx
'use client';

import { AdvancedEditor } from '@/components/new-features';
import { useState } from 'react';

export default function EditorPage() {
  const [content, setContent] = useState('');

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">文档编辑</h1>

      <AdvancedEditor
        initialValue={content}
        mode="split"
        autoSave={true}
        onContentChange={(newContent) => {
          setContent(newContent.html);
          console.log('内容已更新');
        }}
        onSave={async (content) => {
          await fetch('/api/documents', {
            method: 'POST',
            body: JSON.stringify(content)
          });
        }}
      />
    </div>
  );
}
```

### 实时协作页面
```tsx
'use client';

import { RealtimeEditor } from '@/components/new-features';

export default function CollaborativePage() {
  return (
    <div className="h-screen">
      <RealtimeEditor
        documentId="doc-123"
        userId="user-456"
        userName="Current User"
        wsUrl="ws://localhost:3001"
        showCollaborators={true}
        showComments={true}
        onContentChange={(content) => {
          // 保存到服务器
          saveDocument(content);
        }}
      />
    </div>
  );
}
```

### 数据分析页面
```tsx
'use client';

import { AnalyticsDashboard } from '@/components/new-features';

export default function AnalyticsPage() {
  const metrics = [
    {
      id: 'views',
      title: 'Total Views',
      value: '125,430',
      change: 12.5,
      changeType: 'increase',
      icon: <Eye className="text-cyber-cyan" />
    },
    // ... 更多指标
  ];

  const charts = [
    {
      id: 'traffic',
      title: 'Traffic Overview',
      type: 'line',
      data: trafficData
    }
  ];

  return (
    <AnalyticsDashboard
      metrics={metrics}
      charts={charts}
      onExport={(format) => {
        console.log('导出格式:', format);
      }}
    />
  );
}
```

---

## 🌐 国际化配置

### 1. 创建翻译文件
在 `public/locales/zh/common.json`:
```json
{
  "welcome": "欢迎，{{name}}！",
  "goodbye": "再见！",
  "items_one": "1 个项目",
  "items_other": "{{count}} 个项目"
}
```

### 2. 初始化服务
```tsx
// lib/i18n.ts
import { getI18nService } from '@/lib/services/i18n-advanced';

export const i18n = getI18nService({
  defaultLocale: 'en',
  availableLocales: ['en', 'zh', 'es'],
  translationsPath: '/locales'
});
```

### 3. 在应用中使用
```tsx
import { useI18n } from '@/components/new-features';

export default function App() {
  const { t, changeLocale, locale } = useI18n();

  return (
    <div>
      <p>{t('welcome', { name: 'John' })}</p>
      <button onClick={() => changeLocale('zh')}>切换中文</button>
      <p>当前语言: {locale}</p>
    </div>
  );
}
```

---

## 🔌 WebSocket 使用

### 1. 服务器端（Python/FastAPI）
```python
from fastapi import WebSocket

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_json({"message": data})
```

### 2. 客户端（React）
```tsx
import { useWebSocket } from '@/components/new-features';

function Chat() {
  const { state, send, on } = useWebSocket({
    url: 'ws://localhost:8000/ws'
  });

  useEffect(() => {
    const unsub = on('message', (msg) => {
      console.log('收到消息:', msg);
    });
    return unsub;
  }, [on]);

  const sendMessage = () => {
    send('message', { text: 'Hello Server' });
  };

  return (
    <div>
      <p>状态: {state.isConnected ? '✅ 已连接' : '❌ 未连接'}</p>
      <button onClick={sendMessage}>发送消息</button>
    </div>
  );
}
```

---

## 📧 邮件配置

### 环境变量（.env）
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=noreply@cyberpress.dev
FROM_NAME=CyberPress Platform
```

### 使用示例
```python
from app.services.email import EmailService, EmailRecipient

# 初始化服务
email_service = EmailService()

# 创建接收者
recipient = EmailRecipient(
    email="user@example.com",
    name="John Doe"
)

# 发送欢迎邮件
await email_service.send_welcome_email(
    recipient=recipient,
    verification_url="https://example.com/verify?token=abc123"
)

# 发送密码重置邮件
await email_service.send_password_reset_email(
    recipient=recipient,
    reset_url="https://example.com/reset?token=xyz789"
)

# 批量发送
recipients = [
    EmailRecipient(email="user1@example.com"),
    EmailRecipient(email="user2@example.com")
]
await email_service.send_bulk_email(
    recipients=recipients,
    template_name="newsletter"
)
```

---

## 💾 缓存使用

### 基本用法
```python
from app.services.cache import CacheService, cached

cache = CacheService()

# 设置缓存
await cache.set('user:123', user_data, ttl=3600)

# 获取缓存
user = await cache.get('user:123')

# 删除缓存
await cache.delete('user:123')

# 批量操作
await cache.set_many({
    'key1': 'value1',
    'key2': 'value2'
})
items = await cache.get_many(['key1', 'key2'])

# 使用装饰器
@cached(cache, ttl=600)
async def get_user_data(user_id: int):
    return await database.fetch_user(user_id)
```

### Redis 配置
```python
from app.services.cache import RedisCacheBackend

redis_backend = RedisCacheBackend(
    host='localhost',
    port=6379,
    password='your-password',
    prefix='cache:'
)

cache = CacheService(backend=redis_backend)
```

---

## 🎯 最佳实践

### 1. 编辑器
- 使用 `autoSave` 防止数据丢失
- 启用 `showWordCount` 跟踪字数
- 使用 Markdown 模式提高性能

### 2. 实时协作
- 实现文档锁定避免冲突
- 限制在线用户数量
- 使用操作历史支持撤销

### 3. 数据分析
- 合理设置自动刷新间隔
- 使用时间范围选择提高性能
- 导出功能用于离线分析

### 4. 文件管理
- 限制文件大小防止服务器过载
- 使用缩略图提高加载速度
- 实现批量操作提高效率

### 5. 国际化
- 分离翻译文件便于维护
- 使用命名空间避免冲突
- 提供回退语言

### 6. 缓存
- 为动态数据设置合理的 TTL
- 使用分层缓存提高性能
- 监控缓存命中率

---

## 📚 相关文档

- [完整文档](./SESSION_2026_03_03_FILE_CREATION.md)
- [项目 README](./README.md)
- [组件文档](./COMPONENTS_QUICK_REFERENCE.md)
- [开发进度](./DEVELOPMENT_REPORT_2026_03_03.md)

---

## ✅ 检查清单

使用新功能前，请确保：

- [ ] 已安装所有必需的依赖
- [ ] 配置了环境变量
- [ ] 创建了必要的翻译文件
- [ ] 设置了 WebSocket 服务器
- [ ] 配置了 SMTP 邮件服务
- [ ] 启用了 Redis 缓存（可选）

---

**快速参考版本**: v1.0.0
**最后更新**: 2026-03-03
**状态**: ✅ 就绪
