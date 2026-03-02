# 🚀 新功能快速参考 - 2026-03-03

## 📋 新增页面导航

### 🔐 认证系统
```
/auth/login           - 登录页面
/auth/register        - 注册页面
/auth/forgot-password - 忘记密码
/auth/reset-password  - 重置密码
```

### 👤 用户中心
```
/user/profile    - 个人资料
/user/settings   - 账户设置
/user/bookmarks  - 我的书签
```

### ⚙️ 管理后台
```
/admin/posts     - 文章管理
/admin/media     - 媒体库
/admin/comments  - 评论管理
/admin/settings  - 系统设置
```

---

## 🔑 核心功能速查

### 用户认证
| 功能 | 路由 | 方法 | 状态 |
|------|------|------|------|
| 登录 | /api/auth/login | POST | ✅ |
| 注册 | /api/auth/register | POST | ✅ |
| 忘记密码 | /api/auth/forgot-password | POST | ✅ |
| 重置密码 | /api/auth/reset-password | POST | ✅ |

### 文件管理
| 功能 | 路由 | 方法 | 状态 |
|------|------|------|------|
| 上传文件 | /api/admin/media/upload | POST | 🔄 |
| 删除文件 | /api/admin/media/:id | DELETE | 🔄 |
| 批量删除 | /api/admin/media/bulk-delete | POST | 🔄 |

### 评论管理
| 功能 | 路由 | 方法 | 状态 |
|------|------|------|------|
| 批准评论 | /api/admin/comments/:id/approve | POST | 🔄 |
| 拒绝评论 | /api/admin/comments/:id/reject | POST | 🔄 |
| 回复评论 | /api/admin/comments/reply | POST | 🔄 |
| 批量操作 | /api/admin/comments/bulk-* | POST | 🔄 |

---

## 🎨 UI 组件使用

### 表单组件
```tsx
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

<Input 
  type="email"
  placeholder="your@email.com"
  error={errorMessage}
/>

<Button className="bg-gradient-to-r from-cyber-cyan to-cyber-purple">
  点击我
</Button>
```

### 卡片组件
```tsx
import { CyberCard } from '@/components/ui/CyberCard';

<CyberCard variant="glow" hover={true}>
  <p>内容</p>
</CyberCard>
```

---

## 🔧 Store 使用

### Auth Store
```ts
import { useAuthStore } from '@/store/authStore';

const { user, login, logout } = useAuthStore();
```

### Theme Store
```ts
import { useThemeStore } from '@/store/themeStore';

const { theme, setTheme } = useThemeStore();
```

---

## 📝 表单验证示例

### Zod Schema
```ts
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少6个字符'),
});

// 使用 React Hook Form
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(loginSchema),
});
```

---

## 🎯 下一步开发重点

1. **后端集成** - WordPress REST API 对接
2. **数据库** - MySQL 数据持久化
3. **认证** - JWT Token 验证中间件
4. **存储** - 文件上传到云存储
5. **邮件** - SMTP 服务集成
6. **测试** - 单元测试与集成测试
7. **部署** - Docker 容器化

---

**更新时间**: 2026-03-03
**项目进度**: 95% → 进入集成阶段
