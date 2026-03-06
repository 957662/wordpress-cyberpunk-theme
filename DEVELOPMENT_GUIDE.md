# 🚀 CyberPress 开发指南

**最后更新**: 2026-03-06

---

## 📋 目录

1. [快速开始](#快速开始)
2. [开发环境设置](#开发环境设置)
3. [项目结构](#项目结构)
4. [开发工作流](#开发工作流)
5. [代码规范](#代码规范)
6. [测试指南](#测试指南)
7. [部署指南](#部署指南)
8. [常见问题](#常见问题)

---

## 🚀 快速开始

### 环境要求

- **Node.js**: >= 18.17
- **Python**: >= 3.11
- **PostgreSQL**: >= 15
- **Redis**: >= 7.0
- **Docker**: >= 24.0 (可选)

### 一键启动

```bash
# 克隆项目
git clone https://github.com/957662/wordpress-cyberpunk-theme.git
cd wordpress-cyberpunk-theme

# 使用启动脚本
./quick-start.sh  # Linux/Mac
quick-start.bat   # Windows
```

### 手动启动

**后端**:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# 编辑 .env 文件配置数据库
alembic upgrade head
uvicorn app.main:app --reload
```

**前端**:
```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

---

## 🛠️ 开发环境设置

### VSCode 推荐扩展

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-python.python",
    "ms-python.vscode-pylance",
    "GitHub.copilot",
    "ms-vscode.live-server"
  ]
}
```

### Git 配置

```bash
# 配置 .gitignore
git config core.excludesfile .gitignore

# 配置行尾符
git config core.autocrlf input  # Linux/Mac
git config core.autocrlf true   # Windows
```

---

## 📁 项目结构

```
cyberpress-platform/
├── frontend/                   # Next.js 前端
│   ├── app/                   # App Router
│   │   ├── (public)/         # 公开页面
│   │   ├── (auth)/           # 认证页面
│   │   ├── (admin)/          # 管理后台
│   │   └── api/              # API Routes
│   ├── components/            # React 组件
│   │   ├── ui/               # 基础 UI
│   │   ├── effects/          # 特效
│   │   ├── layout/           # 布局
│   │   └── features/         # 功能组件
│   ├── lib/                   # 工具库
│   ├── hooks/                 # 自定义 Hooks
│   ├── services/              # API 服务
│   └── types/                 # TypeScript 类型
│
├── backend/                    # FastAPI 后端
│   ├── app/
│   │   ├── api/              # API 路由
│   │   ├── models/           # 数据模型
│   │   ├── schemas/          # Pydantic 模型
│   │   ├── services/         # 业务逻辑
│   │   └── core/             # 核心配置
│   ├── tests/                 # 测试
│   └── alembic/               # 数据库迁移
│
├── docker/                     # Docker 配置
├── docs/                       # 文档
└── scripts/                    # 脚本
```

---

## 🔄 开发工作流

### 分支策略

- `main` - 生产分支
- `develop` - 开发分支
- `feature/*` - 功能分支
- `bugfix/*` - 修复分支
- `hotfix/*` - 紧急修复

### 提交规范

```bash
# 格式
<type>(<scope>): <subject>

# 类型
feat:     新功能
fix:      修复 bug
docs:     文档更新
style:    代码格式
refactor: 重构
test:     测试
chore:    构建/工具

# 示例
feat(blog): 添加文章搜索功能
fix(auth): 修复登录 token 过期问题
docs(readme): 更新安装说明
```

### 代码审查

1. 创建 Pull Request
2. 通过 CI/CD 检查
3. 至少一人审查通过
4. 解决所有评论
5. 合并到目标分支

---

## 📏 代码规范

### TypeScript 规范

```typescript
// ✅ 使用类型别名
type User = {
  id: string;
  name: string;
};

// ✅ 使用接口
interface User {
  id: string;
  name: string;
}

// ✅ 使用 async/await
async function fetchData() {
  const response = await fetch('/api/data');
  return response.json();
}

// ❌ 避免使用 any
const data: any = {};  // 避免

// ✅ 使用具体类型
const data: UserData = {};  // 推荐
```

### Python 规范

```python
# ✅ 使用类型提示
async def get_user(user_id: str) -> User:
    """获取用户信息"""
    return await db.query(User).filter(User.id == user_id).first()

# ✅ 使用 Pydantic 模型
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

# ✅ 使用依赖注入
@router.get("/users/{user_id}")
async def get_user(
    user_id: str,
    current_user: User = Depends(get_current_user)
):
    return {"user": current_user}
```

### 样式规范

```tsx
// ✅ 使用 Tailwind 类名
<div className="flex items-center justify-between p-4 bg-cyber-dark border border-cyber-cyan/30">

// ✅ 使用 cn 工具函数
import { cn } from '@/lib/utils';

<div className={cn(
  "base-class",
  condition && "conditional-class",
  className
)}>
```

---

## 🧪 测试指南

### 前端测试

```bash
# 单元测试
npm run test

# 测试覆盖率
npm run test:coverage

# E2E 测试
npm run test:e2e

# 可视化测试
npm run test:ui
```

### 后端测试

```bash
# 运行所有测试
pytest tests/

# 覆盖率报告
pytest tests/ --cov=app --cov-report=html

# 运行特定测试
pytest tests/test_auth.py -v

# 带性能分析
pytest tests/ --profile
```

### 测试编写示例

**前端（Vitest）**:
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    screen.getByText('Click').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

**后端（Pytest）**:
```python
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_user():
    response = client.post(
        "/api/v1/users/",
        json={
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpass123"
        }
    )
    assert response.status_code == 200
    assert response.json()["username"] == "testuser"

@pytest.mark.asyncio
async def test_get_user(db_session):
    user = await create_test_user(db_session)
    response = client.get(f"/api/v1/users/{user.id}")
    assert response.status_code == 200
```

---

## 🚀 部署指南

### Docker 部署

```bash
# 构建镜像
docker-compose build

# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 生产环境配置

1. **环境变量**
```bash
# 后端
cp backend/.env.example backend/.env
# 编辑 .env 设置生产环境变量

# 前端
cp frontend/.env.local.example frontend/.env.local
# 编辑 .env.local 设置生产环境变量
```

2. **数据库迁移**
```bash
cd backend
alembic upgrade head
```

3. **构建生产版本**
```bash
# 前端
cd frontend
npm run build

# 后端（已包含在 Dockerfile 中）
docker build -t cyberpress-backend ./backend
```

4. **启动生产服务**
```bash
docker-compose -f docker-compose.production.yml up -d
```

### 性能优化

- **前端**: 启用 CDN、图片优化、代码分割
- **后端**: Redis 缓存、数据库索引、连接池
- **服务器**: Nginx 反向代理、Gzip 压缩

---

## ❓ 常见问题

### Q: 数据库连接失败？
A: 检查 PostgreSQL 是否运行，数据库 URL 是否正确配置

### Q: 前端构建失败？
A: 确保所有依赖已安装，Node.js 版本符合要求

### Q: API 请求 404？
A: 检查后端服务是否启动，API 前缀是否正确

### Q: 样式不生效？
A: 清除 .next 缓存：`rm -rf .next && npm run dev`

### Q: 类型错误？
A: 运行 `npm run type-check` 检查类型问题

---

## 📞 获取帮助

- 📖 [完整文档](./docs/)
- 🐛 [问题反馈](https://github.com/957662/wordpress-cyberpunk-theme/issues)
- 💬 [讨论区](https://github.com/957662/wordpress-cyberpunk-theme/discussions)
- 📧 邮箱: 2835879683@qq.com

---

<div align="center">

**Happy Coding! 🚀**

</div>
