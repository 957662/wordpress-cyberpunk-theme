# 新服务快速开始指南

## 📦 新创建的服务

### 后端服务 (backend/app/services/)

#### 1. Cache Service - 缓存服务

```python
from backend.app.services.cache_service import cache_service

# 基本使用
cache_service.set("user:123", {"name": "张三"}, ttl=3600)
user = cache_service.get("user:123")

# 批量操作
data = {"key1": "value1", "key2": "value2"}
cache_service.set_many(data, ttl=3600)

# 记忆化装饰器
@cached("user_profile", ttl=3600)
async def get_user_profile(user_id: int):
    return await db.fetch_user(user_id)
```

**特性**：
- ✅ Redis + 内存双缓存
- ✅ TTL 自动过期
- ✅ 批量操作支持
- ✅ 统计信息
- ✅ 装饰器支持

#### 2. WordPress Service - WordPress API 服务

```python
from backend.app.services.wordpress_service import WordPressService

async with WordPressService() as wp:
    # 获取文章列表
    posts = await wp.get_posts(page=1, per_page=10)
    
    # 获取单篇文章
    post = await wp.get_post(post_id=123)
    
    # 创建文章
    new_post = await wp.create_post({
        "title": "文章标题",
        "content": "文章内容",
        "status": "draft"
    })
    
    # 搜索
    results = await wp.search("关键词")
```

**特性**：
- ✅ 完整的 WordPress REST API 封装
- ✅ 文章 CRUD 操作
- ✅ 分类和标签管理
- ✅ 评论系统
- ✅ 媒体上传
- ✅ 搜索功能

#### 3. AI Service - AI 服务

```python
from backend.app.services.ai_service import AIService

async with AIService() as ai:
    # 生成摘要
    result = await ai.generate_summary(content, max_length=200)
    
    # 文本分类
    category = await ai.classify_text(text)
    
    # 提取关键词
    keywords = await ai.extract_keywords(text)
    
    # 推荐标签
    tags = await ai.suggest_tags(title, content)
```

**特性**：
- ✅ 文本摘要生成
- ✅ 文本分类
- ✅ 关键词提取
- ✅ 标签推荐
- ✅ 语法检查
- ✅ 模拟模式（无需 API key）

#### 4. Media Service - 媒体服务

```python
from backend.app.services.media_service import media_service

# 上传文件
result = await media_service.upload_file(
    file,
    optimize=True,
    create_thumbnail=True
)

# 从 URL 上传
result = await media_service.upload_from_url(
    url="https://example.com/image.jpg"
)

# 获取文件信息
info = await media_service.get_file_info(file_path)

# 删除文件
await media_service.delete_file(file_path)
```

**特性**：
- ✅ 文件上传
- ✅ 图像优化
- ✅ 缩略图生成
- ✅ URL 上传
- ✅ 文件管理
- ✅ 支持多种格式

### 前端组件 (frontend/components/cyber/)

#### 1. CyberCard - 赛博朋克卡片

```tsx
import { CyberCard, NeonCard, GlassCard, HoloCard } from '@/components/cyber';

// 基本使用
<CyberCard glow>
  <h1>标题</h1>
  <p>内容</p>
</CyberCard>

// 霓虹效果
<NeonCard>
  <h1>霓虹卡片</h1>
</NeonCard>

// 玻璃效果
<GlassCard>
  <p>玻璃拟态</p>
</GlassCard>

// 全息效果
<HoloCard>
  <p>全息投影</p>
</HoloCard>
```

#### 2. CyberButton - 赛博朋克按钮

```tsx
import { CyberButton, CyanButton, PurpleButton, PinkButton } from '@/components/cyber';

// 基本使用
<CyberButton variant="primary" color="cyan">
  点击我
</CyberButton>

// 发光效果
<CyberButton variant="glow" scanline>
  扫描线按钮
</CyberButton>

// 快捷组件
<CyanButton variant="neon">
  青色按钮
</CyanButton>

// 加载状态
<CyberButton loading>
  加载中...
</CyberButton>
```

#### 3. CyberInput - 赛博朋克输入框

```tsx
import { CyberInput, CyberTextarea } from '@/components/cyber';

// 基本使用
<CyberInput
  label="用户名"
  placeholder="请输入用户名"
  variant="neon"
  glow
/>

// 带错误提示
<CyberInput
  label="邮箱"
  error="邮箱格式不正确"
  variant="neon"
/>

// 文本域
<CyberTextarea
  label="内容"
  placeholder="请输入内容"
  rows={5}
/>
```

## 🚀 快速开始

### 1. 后端服务使用

```python
# 在 FastAPI 路由中使用
from fastapi import APIRouter
from backend.app.services.wordpress_service import WordPressService

router = APIRouter()

@router.get("/posts")
async def get_posts():
    async with WordPressService() as wp:
        posts = await wp.get_posts(page=1, per_page=10)
        return {"posts": posts}
```

### 2. 前端组件使用

```tsx
// 在页面中使用
import { CyberCard, CyberButton } from '@/components/cyber';

export default function Page() {
  return (
    <div>
      <CyberCard variant="neon">
        <h1>欢迎使用 CyberPress</h1>
        <CyberButton color="cyan">
          开始使用
        </CyberButton>
      </CyberCard>
    </div>
  );
}
```

## 📝 注意事项

1. **后端服务**
   - 需要配置 Redis 连接（可选，无 Redis 时使用内存缓存）
   - AI 服务默认使用模拟模式
   - WordPress 服务需要配置 API 地址

2. **前端组件**
   - 需要安装 Tailwind CSS
   - 需要安装 Framer Motion
   - 需要配置赛博朋克主题颜色

## 🔧 配置说明

### 环境变量 (.env)

```bash
# Redis 配置
REDIS_URL=redis://localhost:6379/0

# WordPress API
WORDPRESS_URL=http://localhost:8080
WORDPRESS_API_URL=http://localhost:8080/wp-json/wp/v2

# AI 服务（可选）
AI_API_KEY=your_api_key
AI_BASE_URL=https://api.openai.com/v1
```

### Tailwind 配置

```javascript
// tailwind.config.ts
colors: {
  cyber: {
    dark: '#0a0a0f',
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    yellow: '#f0ff00',
  }
}
```

## 📚 更多信息

- 查看各文件内的详细注释
- 所有代码都包含类型提示
- 完整的错误处理
- 详细的文档字符串

---

**创建时间**：2026-03-03
**版本**：1.0.0
