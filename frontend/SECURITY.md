# 安全政策

## 报告安全漏洞

如果你发现了安全漏洞，**请不要公开发布问题**。请按照以下步骤报告：

### 报告方式

发送邮件至：**security@cyberpress.dev**

### 报告内容

请包含：
- 漏洞描述
- 受影响的版本
- 复现步骤
- 潜在影响
- 建议的修复方案（如果有）

### 响应时间

- 我们会在 48 小时内确认收到
- 在 7 天内评估漏洞
- 尽快修复并发布补丁

### 奖励

对于严重的漏洞报告，我们会在修复后在发布说明中致谢。

## 安全最佳实践

### 开发者指南

#### 1. 环境变量

永远不要在代码中硬编码敏感信息：

```typescript
// ❌ 错误
const apiKey = 'sk-1234567890abcdef'

// ✅ 正确
const apiKey = process.env.API_KEY
```

#### 2. 输入验证

始终验证和清理用户输入：

```typescript
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
})

function validateUserInput(data: unknown) {
  return schema.parse(data)
}
```

#### 3. SQL 注入防护

使用参数化查询：

```typescript
// ❌ 错误
const query = `SELECT * FROM users WHERE id = ${userId}`

// ✅ 正确
const query = 'SELECT * FROM users WHERE id = ?'
db.execute(query, [userId])
```

#### 4. XSS 防护

React 默认转义输出，但要小心 dangerouslySetInnerHTML：

```typescript
// ❌ 危险
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ 使用 DOMPurify 清理
import DOMPurify from 'isomorphic-dompurify'

const clean = DOMPurify.sanitize(userInput)
<div dangerouslySetInnerHTML={{ __html: clean }} />
```

#### 5. CORS 配置

正确配置 CORS：

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://cyberpress.dev' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
}
```

#### 6. HTTPS 强制

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()

  if (url.protocol === 'http:' && process.env.NODE_ENV === 'production') {
    url.protocol = 'https:'
    return NextResponse.redirect(url)
  }
}
```

### WordPress 安全

#### 1. 更新 WordPress

```bash
wp core update
wp plugin update --all
wp theme update --all
```

#### 2. 限制登录尝试

安装并配置 Limit Login Attempts Reloaded 插件。

#### 3. 文件权限

```bash
find /var/www/html -type d -exec chmod 755 {} \;
find /var/www/html -type f -exec chmod 644 {} \;
chmod 600 wp-config.php
```

#### 4. wp-config.php 安全

```php
// 禁用文件编辑
define('DISALLOW_FILE_EDIT', true);

// 限制修订
define('WP_POST_REVISIONS', 3);

// 强制 SSL
define('FORCE_SSL_ADMIN', true);

// 禁用 XML-RPC
define('XMLRPC_REQUEST', false);

// 安全密钥
define('AUTH_KEY', 'your-random-key');
define('SECURE_AUTH_KEY', 'your-random-key');
define('LOGGED_IN_KEY', 'your-random-key');
define('NONCE_KEY', 'your-random-key');
```

### 依赖安全

#### 1. 定期更新

```bash
npm audit
npm audit fix
```

#### 2. 使用 Dependabot

在 GitHub 启用 Dependabot 以自动检测依赖漏洞。

#### 3. 锁定依赖版本

```json
{
  "dependencies": {
    "package": "1.2.3"  // 精确版本
  }
}
```

### 认证和授权

#### 1. JWT 安全

```typescript
// 验证 JWT
import jwt from 'jsonwebtoken'

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!)
  } catch (error) {
    throw new Error('Invalid token')
  }
}
```

#### 2. 密码哈希

```typescript
import bcrypt from 'bcryptjs'

async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10)
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}
```

#### 3. 会话管理

```typescript
import { serialize } from 'cookie'

export function setSessionCookie(res: NextResponse, userId: string) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  })

  res.cookies.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 天
  })
}
```

### 数据保护

#### 1. 敏感数据加密

```typescript
import crypto from 'crypto'

const algorithm = 'aes-256-gcm'
const key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex')

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(algorithm, key, iv)

  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  const authTag = cipher.getAuthTag()

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`
}

export function decrypt(encrypted: string): string {
  const [ivHex, authTagHex, encryptedText] = encrypted.split(':')

  const iv = Buffer.from(ivHex!, 'hex')
  const authTag = Buffer.from(authTagHex!, 'hex')
  const decipher = crypto.createDecipheriv(algorithm, key, iv)

  decipher.setAuthTag(authTag)

  let decrypted = decipher.update(encryptedText!, 'hex', 'utf8')
  decrypted += decipher.final('utf8')

  return decrypted
}
```

#### 2. 日志安全

不要记录敏感信息：

```typescript
// ❌ 错误
console.log('User login:', { email, password })

// ✅ 正确
console.log('User login attempt:', { email })
```

## 安全检查清单

### 部署前检查

- [ ] 所有环境变量已设置
- [ ] 敏感信息不在代码仓库中
- [ ] HTTPS 已启用
- [ ] CORS 已正确配置
- [ ] 依赖已更新并检查漏洞
- [ ] 错误处理不泄露敏感信息
- [ ] 日志不包含敏感数据
- [ ] 用户输入已验证和清理
- [ ] 认证和授权已实现
- [ ] SQL 注入防护已到位
- [ ] XSS 防护已实现
- [ ] CSRF 令牌已使用
- [ ] 文件上传已验证
- [ ] 速率限制已配置

### 定期维护

- [ ] 每月更新依赖
- [ ] 每季度审查安全策略
- [ ] 定期运行安全审计
- [ ] 监控安全公告
- [ ] 备份和测试恢复流程

## 事件响应

### 安全事件分类

**严重（Critical）**
- 数据泄露
- 系统完全被控制
- 需要立即响应（1 小时内）

**高危（High）**
- 重要数据访问
- 部分系统控制
- 需要快速响应（24 小时内）

**中危（Medium）**
- 有限的数据访问
- 需要计划响应（7 天内）

**低危（Low）**
- 最小影响
- 常规处理（30 天内）

### 响应流程

1. **确认** - 验证漏洞
2. **遏制** - 限制影响范围
3. **根除** - 修复根本原因
4. **恢复** - 恢复正常操作
5. **总结** - 记录经验教训

## 联系方式

- 安全团队邮箱: security@cyberpress.dev
- 紧急联系: +86 XXX-XXXX-XXXX
- PGP Key: [链接到公钥]

## 参考资料

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE List](https://cwe.mitre.org/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security)
- [WordPress Security](https://wordpress.org/documentation/article/hardening-wordpress/)

---

最后更新: 2024-03-05
