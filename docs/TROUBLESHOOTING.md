# CyberPress Platform - 故障排查指南

**版本**: 1.0.0  
**更新日期**: 2026-03-03

---

## 🔧 常见问题

### 开发环境问题

#### 1. 端口已被占用

**问题**:
```
Error: listen EADDRINUSE: address already in use :::3000
```

**解决方案**:
```bash
# 查找占用端口的进程
lsof -i :3000
# 或
netstat -tulpn | grep :3000

# 终止进程
kill -9 <PID>

# 或修改端口
NEXT_PUBLIC_PORT=3001 npm run dev
```

#### 2. 依赖安装失败

**问题**:
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**解决方案**:
```bash
# 清理缓存
npm cache clean --force

# 删除 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json

# 重新安装
npm install

# 如果仍然失败，使用 --legacy-peer-deps
npm install --legacy-peer-deps
```

#### 3. TypeScript 类型错误

**问题**:
```
Type error: Cannot find module '@/components/xxx'
```

**解决方案**:
```bash
# 重新构建 TypeScript
npm run type-check

# 清理 .next 缓存
rm -rf .next

# 重新启动开发服务器
npm run dev
```

---

### 后端问题

#### 4. 数据库连接失败

**问题**:
```
sqlalchemy.exc.OperationalError: could not connect to server
```

**解决方案**:
```bash
# 检查 PostgreSQL 是否运行
docker ps | grep postgres

# 查看日志
docker logs cyberpress-postgres

# 重启数据库
docker-compose restart postgres

# 检查数据库连接配置
cat backend/.env | grep DATABASE_URL
```

#### 5. Redis 连接失败

**问题**:
```
redis.exceptions.ConnectionError: Error connecting to Redis
```

**解决方案**:
```bash
# 检查 Redis 是否运行
docker ps | grep redis

# 查看 Redis 日志
docker logs cyberpress-redis

# 重启 Redis
docker-compose restart redis

# 测试连接
redis-cli -h localhost -p 6379 ping
```

#### 6. API 返回 500 错误

**问题**:
```
Internal Server Error
```

**解决方案**:
```bash
# 查看后端日志
docker logs cyberpress-backend

# 检查环境变量
cat backend/.env

# 检查数据库迁移
alembic upgrade head

# 查看详细的错误日志
tail -f backend/logs/error.log
```

---

### 前端问题

#### 7. 页面白屏

**问题**: 页面加载后显示空白

**解决方案**:
```bash
# 1. 检查浏览器控制台错误
# 打开开发者工具 (F12) 查看 Console 标签

# 2. 检查网络请求
# 查看 Network 标签，确认 API 请求是否成功

# 3. 清理 Next.js 缓存
rm -rf .next

# 4. 重新构建
npm run build
npm start
```

#### 8. API 请求失败 (CORS)

**问题**:
```
Access to fetch at 'http://localhost:8000' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```

**解决方案**:
```python
# backend/app/core/config.py

# 确保设置了正确的 CORS origins
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

```typescript
// 或者使用 API 代理
// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
    ]
  },
}
```

#### 9. 认证失败

**问题**: 用户无法登录或 Token 无效

**解决方案**:
```bash
# 1. 检查 JWT Secret
cat backend/.env | grep SECRET_KEY

# 2. 确保前后端使用相同的 Secret

# 3. 清除浏览器存储
# 打开开发者工具 -> Application -> Storage
# 清除 LocalStorage, SessionStorage, Cookies

# 4. 检查 Token 过期时间
# backend/app/core/config.py
ACCESS_TOKEN_EXPIRE_MINUTES = 60
```

---

### 性能问题

#### 10. 页面加载缓慢

**问题**: 首屏加载时间长

**解决方案**:
```bash
# 1. 分析构建产物
npm run build -- --analyze

# 2. 优化图片
npm run optimize-images

# 3. 启用压缩
# next.config.js
module.exports = {
  compress: true,
}

# 4. 使用 CDN
# 配置 NEXT_PUBLIC_CDN_URL 环境变量
```

#### 11. 内存占用过高

**问题**: Node.js 进程占用大量内存

**解决方案**:
```bash
# 1. 检查内存使用
node --max-old-space-size=4096 node_modules/.bin/next dev

# 2. 启用 SWC 压缩
# next.config.js
module.exports = {
  swcMinify: true,
}

# 3. 优化生产构建
npm run build
NODE_ENV=production npm start
```

---

### 部署问题

#### 12. Docker 容器无法启动

**问题**:
```
ERROR: for cyberpress-backend  Cannot start service backend: 
OCI runtime create failed
```

**解决方案**:
```bash
# 1. 检查 Docker 状态
docker ps -a

# 2. 查看容器日志
docker logs cyberpress-backend

# 3. 重新构建镜像
docker-compose build --no-cache

# 4. 清理并重启
docker-compose down -v
docker-compose up -d
```

#### 13. SSL 证书问题

**问题**: HTTPS 不工作或证书警告

**解决方案**:
```bash
# 1. 使用 Let's Encrypt
sudo certbot --nginx -d yourdomain.com

# 2. 配置 Nginx
# /etc/nginx/sites-available/cyberpress
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# 3. 测试配置
sudo nginx -t
sudo systemctl reload nginx
```

---

### 数据库问题

#### 14. 数据库迁移失败

**问题**:
```
alembic.util.exc.CommandError: Target database is not up to date
```

**解决方案**:
```bash
# 1. 查看当前版本
alembic current

# 2. 查看迁移历史
alembic history

# 3. 重置数据库（谨慎使用！）
alembic downgrade base
alembic upgrade head

# 4. 或强制标记为最新
alembic stamp head
```

#### 15. 数据库性能慢

**问题**: 查询响应时间长

**解决方案**:
```sql
-- 1. 检查慢查询
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- 2. 分析表
ANALYZE posts;
ANALYZE users;
ANALYZE comments;

-- 3. 重建索引
REINDEX DATABASE cyberpress;

-- 4. 更新统计信息
VACUUM ANALYZE;
```

---

## 🛠️ 调试工具

### 浏览器开发者工具

#### Console 调试
```javascript
// 查看当前用户
console.log(authService.getCurrentUser());

// 查看认证状态
console.log(authService.isAuthenticated());

// 查看访问令牌
console.log(authService.getAccessToken());

// 查看所有 localStorage
console.log(localStorage);

// 清除所有数据
localStorage.clear();
sessionStorage.clear();
```

#### Network 调试
- 打开 Network 标签
- 过滤 `XHR` 和 `Fetch` 请求
- 查看请求头、响应头、响应体
- 检查状态码和响应时间

### 后端调试

#### Python 日志
```python
import logging

# 设置日志级别
logging.basicConfig(level=logging.DEBUG)

# 使用 logger
logger = logging.getLogger(__name__)
logger.debug("Debug message")
logger.info("Info message")
logger.error("Error message")
```

#### FastAPI 调试
```python
# 启用调试模式
app = FastAPI(debug=True)

# 或使用环境变量
DEBUG=True uvicorn main:app --reload
```

### 数据库调试

#### 查看连接
```sql
-- 查看当前连接
SELECT * FROM pg_stat_activity;

-- 查看数据库大小
SELECT 
    pg_database.datname,
    pg_size_pretty(pg_database_size(pg_database.datname)) AS size
FROM pg_database;

-- 查看表大小
SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 📊 监控

### 应用监控

#### 健康检查
```bash
# 检查后端健康
curl http://localhost:8000/health

# 检查前端
curl http://localhost:3000

# 检查数据库
docker exec cyberpress-postgres pg_isready

# 检查 Redis
docker exec cyberpress-redis redis-cli ping
```

#### 日志聚合
```bash
# 查看所有服务日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f backend
docker-compose logs -f postgres

# 查看错误日志
docker-compose logs | grep ERROR
```

---

## 🆘 获取帮助

### 社区资源

- GitHub Issues: [https://github.com/cyberpress/platform/issues](https://github.com/cyberpress/platform/issues)
- 文档: [https://docs.cyberpress.dev](https://docs.cyberpress.dev)
- Discord: [https://discord.gg/cyberpress](https://discord.gg/cyberpress.dev)

### 报告问题

提交问题时请包含：

1. **问题描述**
   - 清晰描述遇到的问题
   - 预期行为 vs 实际行为

2. **环境信息**
   ```bash
   # 系统信息
   uname -a
   
   # Node.js 版本
   node -v
   npm -v
   
   # Python 版本
   python --version
   
   # Docker 版本
   docker -v
   docker-compose -v
   ```

3. **错误日志**
   - 完整的错误堆栈
   - 相关的日志输出
   - 浏览器控制台截图

4. **复现步骤**
   - 如何触发问题
   - 最小化复现代码

---

## 📚 相关文档

- [API 文档](./API.md)
- [部署指南](./DEPLOYMENT.md)
- [开发指南](../CONTRIBUTING.md)

---

**最后更新**: 2026-03-03  
**文档版本**: 1.0.0
