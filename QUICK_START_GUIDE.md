# 🚀 CyberPress 新功能快速使用指南

## 📦 新增功能概览

本次更新添加了以下核心功能：

1. **🔐 完整的用户认证系统**
2. **💬 功能完善的评论系统**
3. **🛠️ 类型安全的工具库**
4. **⚙️ 完善的配置文件**

## 🔐 用户认证系统

### API端点

#### 1. 用户注册
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "username": "cyberuser",
  "email": "user@cyberpress.dev",
  "password": "SecurePass123",
  "full_name": "Cyber User"
}
```

#### 2. 用户登录
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "cyberuser",
  "password": "SecurePass123"
}
```

### 前端使用

```typescript
import { authStorage } from '@/lib/storage';

// 登录后保存token
authStorage.setToken(accessToken);

// 获取token
const token = authStorage.getToken();

// 清除token（登出）
authStorage.clear();
```

## 💬 评论系统

### API端点

#### 1. 获取文章评论
```bash
GET /api/v1/comments?post_id=1&page=1&page_size=20
```

#### 2. 创建评论
```bash
POST /api/v1/comments
Content-Type: application/json

{
  "post_id": 1,
  "content": "这是一条很棒的文章！",
  "author_name": "游客",
  "author_email": "guest@example.com"
}
```

### 前端使用

```tsx
import CommentSection from '@/components/blog/CommentSection';

// 在文章详情页使用
function BlogPostPage({ postId }) {
  return (
    <div>
      <ArticleContent />
      <CommentSection postId={postId} />
    </div>
  );
}
```

## 🛠️ 工具库使用

### 数据验证

```typescript
import {
  isValidEmail,
  isStrongPassword,
  validateField,
  sanitizeInput
} from '@/lib/validators';

// 邮箱验证
if (isValidEmail('user@example.com')) {
  // 有效邮箱
}

// 密码强度检查
if (isStrongPassword('SecurePass123')) {
  // 强密码
}

// 输入清理
const cleanInput = sanitizeInput(userInput);
```

### 本地存储

```typescript
import {
  localStorage,
  authStorage,
  themeStorage,
  searchHistoryStorage
} from '@/lib/storage';

// 通用存储
localStorage.set('key', { data: 'value' });
const data = localStorage.get('key');

// 认证令牌
authStorage.setToken('your-access-token');
const token = authStorage.getToken();
authStorage.clear();
```

## ⚙️ 配置使用

### 站点配置

```typescript
import { siteConfig } from '@/config/site';

// 使用站点信息
console.log(siteConfig.name);
console.log(siteConfig.social.github);
```

### 颜色常量

```typescript
import { CYBER_COLORS, GRADIENTS } from '@/constants/colors';

const cyanColor = CYBER_COLORS.cyan;
const gradient = GRADIENTS.cyber;
```

## 🔧 环境配置

### 后端环境变量

创建 `.env` 文件：

```bash
# 数据库配置
DATABASE_URL=postgresql://user:password@localhost/cyberpress

# JWT配置
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# CORS配置
ALLOWED_ORIGINS=http://localhost:3000
```

### 前端环境变量

创建 `.env.local` 文件：

```bash
# API配置
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# 站点配置
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 🧪 测试

### 测试认证API

```bash
# 注册
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"Test123"}'

# 登录
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"Test123"}'
```

---

**最后更新**: 2026-03-03
**版本**: 1.0.0
