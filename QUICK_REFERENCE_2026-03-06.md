# 🚀 快速参考指南 - CyberPress Platform

**创建日期**: 2026-03-06  
**文件数**: 11个代码文件  
**代码量**: 3,521行

---

## 📁 文件结构

```
cyberpress-platform/
├── backend/
│   ├── app/
│   │   ├── api/v1/
│   │   │   ├── auth_enhanced.py       (认证API - 329行)
│   │   │   ├── posts_enhanced.py      (文章API - 331行)
│   │   │   └── social.py              (社交API - 286行)
│   │   └── services/
│   │       ├── auth_service_enhanced.py    (认证服务 - 237行)
│   │       ├── post_service_enhanced.py    (文章服务 - 326行)
│   │       ├── social_service_enhanced.py  (社交服务 - 349行)
│   │       ├── search_service.py          (搜索服务 - 189行)
│   │       └── email_service.py           (邮件服务 - 305行)
│   └── ...
└── frontend/
    └── lib/
        └── services/
            ├── auth-service.ts    (认证服务 - 248行)
            ├── post-service.ts    (文章服务 - 197行)
            └── social-service.ts  (社交服务 - 224行)
```

---

## 🔐 认证系统

### 后端API端点

```
POST   /api/v1/auth/register              - 用户注册
POST   /api/v1/auth/login                 - 用户登录
POST   /api/v1/auth/refresh               - 刷新令牌
POST   /api/v1/auth/verify-email          - 验证邮箱
POST   /api/v1/auth/resend-verification   - 重发验证邮件
POST   /api/v1/auth/reset-password-request - 请求密码重置
POST   /api/v1/auth/reset-password-confirm - 确认密码重置
GET    /api/v1/auth/me                    - 获取当前用户
POST   /api/v1/auth/logout                - 登出
```

### 前端使用示例

```typescript
import { authService } from '@/lib/services/auth-service';

// 登录
const { access_token, user } = await authService.login({
  username: 'user@example.com',
  password: 'password123'
});

// 获取当前用户
const currentUser = await authService.getCurrentUser();

// 检查认证状态
if (authService.isAuthenticated()) {
  // 用户已登录
}

// 登出
await authService.logout();
```

---

## 📝 文章系统

### 后端API端点

```
GET    /api/v1/posts                      - 获取文章列表
GET    /api/v1/posts/featured             - 获取精选文章
GET    /api/v1/posts/trending             - 获取热门文章
GET    /api/v1/posts/related/{id}         - 获取相关文章
GET    /api/v1/posts/search               - 搜索文章
GET    /api/v1/posts/{id}                 - 获取文章详情
POST   /api/v1/posts                      - 创建文章
PUT    /api/v1/posts/{id}                 - 更新文章
DELETE /api/v1/posts/{id}                 - 删除文章
POST   /api/v1/posts/{id}/like            - 点赞文章
POST   /api/v1/posts/{id}/bookmark        - 收藏文章
```

### 前端使用示例

```typescript
import { postService } from '@/lib/services/post-service';

// 获取文章列表
const { posts, total, page } = await postService.getPosts({
  page: 1,
  per_page: 10,
  category_id: 5,
  sort_by: 'created_at',
  sort_order: 'desc'
});

// 搜索文章
const searchResults = await postService.searchPosts('TypeScript', {
  page: 1,
  per_page: 20
});

// 获取热门文章
const trendingPosts = await postService.getTrendingPosts(10, 7);

// 创建文章
const newPost = await postService.createPost({
  title: '我的新文章',
  content: '文章内容...',
  category_id: 5,
  status: 'draft'
});
```

---

## 👥 社交系统

### 后端API端点

```
POST   /api/v1/social/follow/{id}         - 关注用户
DELETE /api/v1/social/follow/{id}         - 取消关注
GET    /api/v1/social/followers/{id}      - 获取粉丝列表
GET    /api/v1/social/following/{id}      - 获取关注列表
GET    /api/v1/social/feed                - 获取活动动态
POST   /api/v1/social/like/{id}           - 点赞文章
POST   /api/v1/social/bookmark/{id}       - 收藏文章
GET    /api/v1/social/bookmarks           - 获取收藏列表
GET    /api/v1/social/recommendations/users - 获取推荐用户
GET    /api/v1/social/stats/{id}          - 获取社交统计
```

### 前端使用示例

```typescript
import { socialService } from '@/lib/services/social-service';

// 关注用户
await socialService.followUser(userId);

// 获取粉丝列表
const { followers, total } = await socialService.getFollowers(userId, 1, 20);

// 获取活动动态
const activities = await socialService.getActivityFeed(1, 20);

// 点赞文章
const { liked } = await socialService.likePost(postId);

// 获取推荐用户
const recommendations = await socialService.getRecommendedUsers(10);
```

---

## 🔍 搜索系统

### 功能特性

- **全文搜索**: 标题、内容、摘要
- **高级筛选**: 按分类、标签筛选
- **搜索建议**: 自动补全
- **结果排序**: 按相关度、时间排序

### 使用示例

```typescript
// 搜索文章
const results = await postService.searchPosts('React Hooks', {
  page: 1,
  per_page: 20,
  category_id: 3
});

// 搜索建议
const suggestions = await searchService.getSuggestions('React', 5);
// 返回: { posts: [...], users: [...] }
```

---

## 📧 邮件系统

### 功能特性

- **验证邮件**: HTML格式，精美设计
- **密码重置**: 安全的令牌机制
- **自动发送**: 异步处理
- **模板系统**: 易于自定义

### 邮件类型

```python
# 发送验证邮件
await send_verification_email(
    email=user.email,
    username=user.username,
    verification_url=verify_url
)

# 发送密码重置邮件
await send_password_reset_email(
    email=user.email,
    username=user.username,
    reset_url=reset_url
)
```

---

## 🛠️ 开发指南

### 后端开发

#### 1. 注册路由

```python
# backend/app/api/v1/__init__.py
from .auth_enhanced import router as auth_router
from .posts_enhanced import router as posts_router
from .social import router as social_router

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(posts_router)
api_router.include_router(social_router)
```

#### 2. 使用服务层

```python
from backend.app.services import AuthServiceEnhanced

# 创建服务实例
auth_service = AuthServiceEnhanced(db)

# 调用服务方法
user = await auth_service.authenticate_user(email, password)
```

### 前端开发

#### 1. 导入服务

```typescript
import { authService } from '@/lib/services/auth-service';
import { postService } from '@/lib/services/post-service';
import { socialService } from '@/lib/services/social-service';
```

#### 2. 在React组件中使用

```typescript
import { useEffect, useState } from 'react';
import { postService } from '@/lib/services/post-service';

export function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await postService.getPosts({ page: 1 });
        setPosts(data.posts);
      } catch (error) {
        console.error('加载文章失败:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadPosts();
  }, []);

  if (loading) return <div>加载中...</div>;
  return <div>{/* 渲染文章列表 */}</div>;
}
```

---

## 🔐 环境配置

### 后端环境变量

```bash
# .env
DATABASE_URL=postgresql://user:password@localhost/cyberpress
SECRET_KEY=your-secret-key
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=noreply@cyberpress.com
FROM_NAME=CyberPress
```

### 前端环境变量

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🧪 测试

### 后端测试

```bash
cd backend

# 运行所有测试
pytest tests/

# 运行特定测试
pytest tests/test_auth.py -v

# 生成覆盖率报告
pytest tests/ --cov=app --cov-report=html
```

### 前端测试

```bash
cd frontend

# 运行所有测试
npm test

# 运行特定测试
npm test auth-service.test.ts

# 生成覆盖率报告
npm test -- --coverage
```

---

## 📊 API文档

启动后端服务后，访问以下地址查看完整API文档：

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 🚀 快速开始

### 1. 启动后端

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 2. 启动前端

```bash
cd frontend
npm install
npm run dev
```

### 3. 访问应用

- **前端**: http://localhost:3000
- **后端API**: http://localhost:8000
- **API文档**: http://localhost:8000/docs

---

## 📝 相关文档

- [开发完成报告](./DEVELOPMENT_COMPLETE_2026-03-06.md)
- [文件创建报告](./FILES_CREATION_REPORT_2026-03-06.md)
- [最终会话报告](./FINAL_SESSION_REPORT_2026-03-06.md)
- [API文档](./API_DOCUMENTATION.md)
- [项目README](./README.md)

---

## 🆘 常见问题

### Q: 如何处理认证令牌过期？
A: 前端的HTTP客户端会自动检测401错误并尝试刷新令牌。

### Q: 如何自定义邮件模板？
A: 编辑 `email_service.py` 中的HTML内容。

### Q: 如何添加新的API端点？
A: 在对应的路由文件中添加新函数，或创建新的路由文件。

### Q: 如何修改搜索算法？
A: 编辑 `search_service.py` 中的搜索逻辑。

---

## 📞 获取帮助

- **项目仓库**: https://github.com/957662/wordpress-cyberpunk-theme
- **问题反馈**: GitHub Issues
- **邮箱**: 2835879683@qq.com

---

**创建日期**: 2026-03-06  
**最后更新**: 2026-03-06  
**版本**: 1.0.0

<div align="center">

**🎉 祝您使用愉快！**

**Built with ❤️ by AI Development Team**

</div>
