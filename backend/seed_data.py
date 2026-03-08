#!/usr/bin/env python3
"""
Seed Data Script - 预填充示例数据
"""

import sys
sys.path.insert(0, '/app')

from sqlalchemy import create_engine, text
from datetime import datetime
import uuid

# 数据库配置
DATABASE_URL = "postgresql://cyberpress:cyberpress123@cyberpress-postgres:5432/cyberpress"

def seed_data():
    engine = create_engine(DATABASE_URL)
    
    with engine.connect() as conn:
        # 检查是否已有数据
        result = conn.execute(text("SELECT COUNT(*) FROM posts"))
        post_count = result.scalar()
        
        if post_count > 0:
            print(f"✅ 已有 {post_count} 篇文章，跳过种子数据")
            return
        
        print("🌱 开始创建种子数据...")
        
        # 创建示例文章
        sample_posts = [
            {
                'id': str(uuid.uuid4()),
                'title': '探索赛博朋克设计美学',
                'slug': 'exploring-cyberpunk-aesthetics',
                'content': '''# 探索赛博朋克设计美学

赛博朋克（Cyberpunk）是科幻文化中的一个重要分支，它描绘了一个高科技低生活的未来世界。

## 视觉元素

### 1. 霓虹色彩
- 青色（Cyan）：#00f0ff
- 紫色（Purple）：#9d00ff
- 粉色（Pink）：#ff0080

### 2. 光影效果
- 强烈的对比度
- 霓虹灯效果
- 体积光

### 3. 典型场景
- 雨夜街道
- 摩天大楼
- 全息广告

## 设计原则

1. **高科技感**：使用现代 UI 元素
2. **复古未来**：80 年代审美 + 未来科技
3. **反乌托邦**：表达对社会问题的思考

## 实践建议

- 使用深色背景
- 添加发光效果
- 运用渐变色彩
- 保持高对比度

---

*本文是 CyberPress 平台的示例文章*
''',
                'excerpt': '从《银翼杀手》到《赛博朋克 2077》，深入解析赛博朋克风格的视觉元素与设计原则。',
                'status': 'published',
                'post_type': 'post',
                'featured_image_url': '/images/cyberpunk-city.jpg',
                'view_count': 128,
                'is_featured': True,
            },
            {
                'id': str(uuid.uuid4()),
                'title': 'Next.js 14 完全指南',
                'slug': 'nextjs-14-complete-guide',
                'content': '''# Next.js 14 完全指南

Next.js 14 带来了许多令人兴奋的新特性。

## 主要特性

### App Router
App Router 现在是稳定的，带来了：
- 服务端组件
- 流式渲染
- 更好的数据获取

### Server Actions
Server Actions 让你可以直接在组件中调用服务器函数。

```typescript
async function createPost(formData: FormData) {
  'use server'
  const title = formData.get('title')
  // 处理数据
}
```

### 性能优化
- 部分预渲染（PPR）
- Turbopack 改进
- 更好的缓存策略

## 开始使用

```bash
npx create-next-app@latest
```

---

*Happy Coding!*
''',
                'excerpt': 'Server Components、App Router、Server Actions - 全面掌握 Next.js 14 的革命性特性。',
                'status': 'published',
                'post_type': 'post',
                'view_count': 256,
                'is_featured': True,
            },
            {
                'id': str(uuid.uuid4()),
                'title': 'TypeScript 高级类型技巧',
                'slug': 'typescript-advanced-types',
                'content': '''# TypeScript 高级类型技巧

## 条件类型

```typescript
type IsString<T> = T extends string ? true : false;
```

## 映射类型

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

## 模板字面量类型

```typescript
type EventName = `on${Capitalize<string>}`;
```

## 实用类型

- `Partial<T>` - 所有属性可选
- `Required<T>` - 所有属性必填
- `Pick<T, K>` - 选取部分属性
- `Omit<T, K>` - 省略部分属性

---

*TypeScript makes JavaScript better!*
''',
                'excerpt': '掌握条件类型、映射类型、模板字面量类型等高级特性。',
                'status': 'published',
                'post_type': 'post',
                'view_count': 89,
            },
        ]
        
        # 获取分类 ID
        result = conn.execute(text("SELECT id FROM categories WHERE slug IN ('tech', 'design', 'development', 'thoughts')"))
        category_ids = [row[0] for row in result.fetchall()]
        
        if not category_ids:
            print("❌ 分类不存在，请先创建分类")
            return
        
        # 获取用户 ID
        result = conn.execute(text("SELECT id FROM users LIMIT 1"))
        user_row = result.fetchone()
        user_id = user_row[0] if user_row else None
        
        if not user_id:
            # 创建默认用户
            admin_id = uuid.uuid4()
            conn.execute(text("""
                INSERT INTO users (id, username, email, password_hash, role, status)
                VALUES (:id, 'admin', 'admin@cyberpress.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzS3MebAJu', 'admin', 'active')
            """), {'id': str(admin_id)})
            user_id = admin_id
            print("✅ 创建默认管理员用户")
        
        # 插入文章
        for post in sample_posts:
            category_id = category_ids[hash(post['slug']) % len(category_ids)]
            conn.execute(text("""
                INSERT INTO posts (
                    id, author_id, category_id, title, slug, content, excerpt,
                    status, post_type, featured_image_url, view_count, is_featured,
                    created_at, updated_at, published_at
                ) VALUES (
                    :id, :author_id, :category_id, :title, :slug, :content, :excerpt,
                    :status, :post_type, :featured_image_url, :view_count, :is_featured,
                    NOW(), NOW(), NOW()
                )
            """), {
                **post,
                'author_id': str(user_id),
                'category_id': str(category_id),
            })
        
        conn.commit()
        print(f"✅ 成功创建 {len(sample_posts)} 篇示例文章")
        print("✅ 种子数据创建完成！")

if __name__ == '__main__':
    seed_data()
