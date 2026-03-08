# CyberPress Platform - 数据库设计文档

## 📊 ER 图

```
┌─────────────────┐       ┌─────────────────┐
│     users       │       │     posts       │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │──┐    │ id (PK)         │
│ email           │  │    │ title           │
│ username        │  │    │ slug            │
│ password_hash   │  │    │ content         │
│ display_name    │  │    │ author_id (FK)  │←─┐
│ role            │  │    │ category_id (FK)│  │
└─────────────────┘  │    └─────────────────┘  │
                     │                        │
                     │       ┌─────────────────┤
                     │       │    comments     │
                     │       ├─────────────────┤
                     │       │ id (PK)         │
                     └───────┤ post_id (FK)    │
                             │ author_id (FK)  │
                             │ parent_id (FK)  │
                             │ content         │
                             │ status          │
                             └─────────────────┘
```

## 📋 核心表结构

### users - 用户表
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    avatar_url TEXT,
    role VARCHAR(20) DEFAULT 'subscriber',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### posts - 文章表
```sql
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'draft',
    author_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### comments - 评论表
```sql
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES posts(id),
    author_id UUID REFERENCES users(id),
    parent_id UUID REFERENCES comments(id),
    content TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

**版本**: 1.0.0  
**更新**: 2026-03-08
