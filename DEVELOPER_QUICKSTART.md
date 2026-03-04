# CyberPress 开发者快速入门指南

> 帮助新开发者快速上手 CyberPress 项目

---

## 📋 目录

1. [项目概览](#项目概览)
2. [环境设置](#环境设置)
3. [项目结构](#项目结构)
4. [开发工作流](#开发工作流)
5. [常用命令](#常用命令)
6. [API 使用](#api-使用)
7. [组件开发](#组件开发)
8. [测试](#测试)
9. [故障排除](#故障排除)

---

## 🎯 项目概览

**CyberPress** 是一个赛博朋克风格的博客平台，采用前后端分离架构。

### 技术栈

#### 前端
- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript 5.4
- **样式**: Tailwind CSS
- **状态管理**: Zustand + TanStack Query
- **动画**: Framer Motion
- **表单**: React Hook Form + Zod

#### 后端
- **框架**: FastAPI
- **语言**: Python 3.11+
- **数据库**: PostgreSQL
- **ORM**: SQLAlchemy
- **认证**: JWT

---

## 🛠️ 环境设置

### 前置要求

- Node.js >= 18.17
- npm >= 9.0
- Python >= 3.11
- PostgreSQL >= 14
- Git

### 1. 克隆项目

```bash
git clone https://github.com/your-username/cyberpress-platform.git
cd cyberpress-platform
```

### 2. 后端设置

```bash
cd backend

# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Linux/Mac
# 或
venv\Scripts\activate  # Windows

# 安装依赖
pip install -r requirements.txt

# 复制环境变量
cp .env.example .env

# 编辑 .env 文件，配置数据库连接等

# 运行数据库迁移
alembic upgrade head

# 启动后端服务
python main.py
```

后端将运行在 http://localhost:8000

### 3. 前端设置

```bash
cd frontend

# 安装依赖
npm install

# 复制环境变量
cp .env.example .env.local

# 编辑 .env.local 文件，配置 API 地址等

# 启动开发服务器
npm run dev
```

前端将运行在 http://localhost:3000

---

## 📁 项目结构

### 后端结构

```
backend/
├── app/
│   ├── api/              # API 路由
│   │   └── v1/          # API v1 版本
│   ├── core/            # 核心配置
│   ├── models/          # 数据库模型
│   ├── schemas/         # Pydantic schemas
│   ├── services/        # 业务逻辑
│   └── utils/           # 工具函数
├── alembic/             # 数据库迁移
├── tests/               # 测试文件
└── main.py              # 应用入口
```

### 前端结构

```
frontend/
├── app/                 # Next.js App Router
│   ├── (auth)/         # 认证相关页面
│   ├── blog/           # 博客页面
│   ├── dashboard/      # 仪表板
│   └── ...
├── components/         # React 组件
│   ├── ui/            # 基础 UI 组件
│   ├── follow/        # 关注功能组件
│   ├── notifications/ # 通知功能组件
│   └── ...
├── hooks/             # 自定义 Hooks
├── lib/               # 工具库
├── services/          # API 服务
├── store/             # 状态管理
├── types/             # TypeScript 类型
└── styles/            # 样式文件
```

---

## 💻 开发工作流

### 1. 创建新功能

#### 后端

1. **创建数据模型** (`app/models/`)
```python
# app/models/example.py
from sqlalchemy import Column, Integer, String
from app.models.base import Base

class Example(Base):
    __tablename__ = "examples"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
```

2. **创建 Schema** (`app/schemas/`)
```python
# app/schemas/example.py
from pydantic import BaseModel

class ExampleBase(BaseModel):
    name: str

class ExampleCreate(ExampleBase):
    pass

class ExampleResponse(ExampleBase):
    id: int

    class Config:
        from_attributes = True
```

3. **创建服务** (`app/services/`)
```python
# app/services/example_service.py
from sqlalchemy.orm import Session
from app.models.example import Example
from app.schemas.example import ExampleCreate

def create_example(db: Session, data: ExampleCreate) -> Example:
    example = Example(**data.model_dump())
    db.add(example)
    db.commit()
    db.refresh(example)
    return example
```

4. **创建 API 路由** (`app/api/v1/`)
```python
# app/api/v1/examples.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.example_service import create_example
from app.schemas.example import ExampleCreate, ExampleResponse

router = APIRouter(prefix="/examples", tags=["examples"])

@router.post("/", response_model=ExampleResponse)
async def create(
    data: ExampleCreate,
    db: Session = Depends(get_db)
):
    return create_example(db, data)
```

5. **注册路由** (`app/api/v1/__init__.py`)
```python
from app.api.v1 import examples

api_router.include_router(examples.router)
```

#### 前端

1. **创建类型定义** (`types/`)
```typescript
// types/example.types.ts
export interface Example {
  id: string;
  name: string;
  createdAt: string;
}

export interface ExampleCreate {
  name: string;
}
```

2. **创建 API Hook** (`hooks/`)
```typescript
// hooks/useExample.ts
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { Example, ExampleCreate } from '@/types/example.types';

export function useExample() {
  const createMutation = useMutation({
    mutationFn: async (data: ExampleCreate) => {
      const response = await apiClient.post('/api/v1/examples/', data);
      return response.data;
    },
  });

  return {
    createExample: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
}
```

3. **创建组件** (`components/`)
```typescript
// components/example/ExampleCard.tsx
'use client';

import { motion } from 'framer-motion';
import { useExample } from '@/hooks/useExample';

export function ExampleCard() {
  const { createExample, isCreating } = useExample();

  const handleClick = async () => {
    await createExample({ name: 'Test' });
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      onClick={handleClick}
      disabled={isCreating}
    >
      {isCreating ? '创建中...' : '创建示例'}
    </motion.button>
  );
}
```

### 2. 运行测试

```bash
# 后端测试
cd backend
pytest

# 前端测试
cd frontend
npm test
```

### 3. 代码格式化

```bash
# 后端
cd backend
black .
isort .

# 前端
cd frontend
npm run format
npm run lint
```

---

## 🎮 常用命令

### 后端

```bash
# 启动开发服务器
python main.py

# 运行测试
pytest

# 数据库迁移
alembic revision --autogenerate -m "描述"
alembic upgrade head

# 代码格式化
black .
isort .

# 类型检查
mypy .
```

### 前端

```bash
# 开发
npm run dev

# 构建
npm run build

# 预览生产构建
npm start

# 测试
npm test

# 代码检查
npm run lint

# 格式化
npm run format

# 类型检查
npm run type-check
```

---

## 🔌 API 使用

### 使用 API 客户端

```typescript
import { api } from '@/lib/api-client';

// GET 请求
const response = await api.get('/api/v1/posts', {
  params: { page: 1, per_page: 10 }
});

// POST 请求
const response = await api.post('/api/v1/posts', {
  title: '新文章',
  content: '文章内容'
});

// PUT 请求
const response = await api.put('/api/v1/posts/1', {
  title: '更新标题'
});

// DELETE 请求
const response = await api.delete('/api/v1/posts/1');
```

### 使用自定义 Hooks

```typescript
import { useFollow } from '@/hooks/useFollow';

function MyComponent() {
  const { followUser, unfollowUser, useFollowStatus } = useFollow();

  const { data: followStatus } = useFollowStatus(userId);

  const handleFollow = async () => {
    if (followStatus?.isFollowing) {
      await unfollowUser(userId);
    } else {
      await followUser(userId);
    }
  };

  return (
    <button onClick={handleFollow}>
      {followStatus?.isFollowing ? '取消关注' : '关注'}
    </button>
  );
}
```

---

## 🎨 组件开发

### 组件规范

1. **使用 'use client' 指令**（对于客户端组件）
```typescript
'use client';

import React from 'react';
```

2. **使用 TypeScript**
```typescript
interface MyComponentProps {
  title: string;
  count?: number;
  onClick?: () => void;
}

export function MyComponent({ title, count = 0, onClick }: MyComponentProps) {
  // ...
}
```

3. **使用赛博朋克主题样式**
```typescript
import { cn } from '@/lib/utils';

<div className={cn(
  'rounded-lg border border-white/10 bg-white/5 p-4',
  'hover:border-cyber-cyan/50 hover:bg-white/10',
  'transition-all'
)}>
  {/* 内容 */}
</div>
```

4. **添加动画**
```typescript
import { motion } from 'framer-motion';

<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: 'spring', stiffness: 400 }}
>
  {/* 内容 */}
</motion.div>
```

---

## 🧪 测试

### API 测试

使用内置的 API 测试工具：

```typescript
import { testSocialFeatures, quickTest } from '@/lib/api-test-utils';

// 测试所有社交功能
await testSocialFeatures();

// 快速测试单个端点
await quickTest('GET', '/api/v1/notifications/stats');
```

### 组件测试

```typescript
// __tests__/components/Example.test.tsx
import { render, screen } from '@testing-library/react';
import { ExampleCard } from '@/components/example/ExampleCard';

describe('ExampleCard', () => {
  it('renders correctly', () => {
    render(<ExampleCard />);
    expect(screen.getByText('创建示例')).toBeInTheDocument();
  });
});
```

---

## 🔧 故障排除

### 常见问题

#### 1. 数据库连接失败

**问题**: `could not connect to server`

**解决方案**:
- 检查 PostgreSQL 服务是否运行
- 检查 `backend/.env` 中的数据库配置
- 确保数据库已创建

#### 2. 前端 API 请求失败

**问题**: `Network Error` 或 `404 Not Found`

**解决方案**:
- 检查后端服务是否运行
- 检查 `frontend/.env.local` 中的 API 地址
- 检查浏览器控制台的 CORS 错误

#### 3. 样式不生效

**问题**: Tailwind CSS 类名不工作

**解决方案**:
- 运行 `npm run dev` 重新启动开发服务器
- 清除 `.next` 缓存: `rm -rf .next`
- 检查 `tailwind.config.ts` 配置

#### 4. 类型错误

**问题**: TypeScript 类型错误

**解决方案**:
- 运行 `npm run type-check` 查看详细错误
- 确保所有导入的路径正确
- 检查 `tsconfig.json` 配置

---

## 📚 资源链接

- [Next.js 文档](https://nextjs.org/docs)
- [FastAPI 文档](https://fastapi.tiangolo.com/)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Framer Motion 文档](https://www.framer.com/motion/)
- [TanStack Query 文档](https://tanstack.com/query/latest)

---

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支: `git checkout -b feature/amazing-feature`
3. 提交更改: `git commit -m 'Add amazing feature'`
4. 推送分支: `git push origin feature/amazing-feature`
5. 创建 Pull Request

---

## 📞 获取帮助

- 查看 [SOCIAL_FEATURES_STATUS.md](./SOCIAL_FEATURES_STATUS.md) 了解功能状态
- 查看 [DEVELOPMENT_TASKS.md](./DEVELOPMENT_TASKS.md) 了解开发任务
- 在项目 Issues 中提问

---

**祝你开发愉快！** 🚀

---

*最后更新: 2026-03-05*
