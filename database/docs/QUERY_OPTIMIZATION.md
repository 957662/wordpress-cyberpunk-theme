# CyberPress Platform - 数据库查询优化指南

## 目录
1. [查询优化原则](#查询优化原则)
2. [常见查询场景优化](#常见查询场景优化)
3. [慢查询分析与优化](#慢查询分析与优化)
4. [缓存策略](#缓存策略)
5. [分页优化](#分页优化)
6. [全文搜索优化](#全文搜索优化)

---

## 查询优化原则

### 1. 避免使用 SELECT *

**❌ 不推荐**:
```sql
SELECT * FROM posts WHERE author_id = 123;
```

**✅ 推荐**:
```sql
SELECT
    id, title, slug, excerpt, featured_image,
    view_count, like_count, comment_count,
    created_at, published_at
FROM posts
WHERE author_id = 123;
```

**原因**:
- 减少网络传输数据量
- 减少内存占用
- 可能使用覆盖索引，避免回表

### 2. 合理使用索引

**❌ 不推荐**:
```sql
-- 在未索引的列上查询
SELECT * FROM posts WHERE DATE(created_at) = '2026-03-07';
```

**✅ 推荐**:
```sql
-- 使用范围查询
SELECT * FROM posts
WHERE created_at >= '2026-03-07 00:00:00'
  AND created_at < '2026-03-08 00:00:00';
```

**原因**:
- 函数操作会导致索引失效
- 范围查询可以利用索引

### 3. 限制返回结果数量

**❌ 不推荐**:
```sql
SELECT * FROM posts ORDER BY created_at DESC;
```

**✅ 推荐**:
```sql
SELECT * FROM posts
ORDER BY created_at DESC
LIMIT 20 OFFSET 0;
```

**原因**:
- 减少内存使用
- 提高响应速度
- 避免数据溢出

### 4. 使用 JOIN 替代子查询

**❌ 不推荐**:
```sql
SELECT *,
    (SELECT username FROM users WHERE id = posts.author_id) AS author_name,
    (SELECT name FROM categories WHERE id = posts.category_id) AS category_name
FROM posts;
```

**✅ 推荐**:
```sql
SELECT
    posts.*,
    users.username AS author_name,
    categories.name AS category_name
FROM posts
LEFT JOIN users ON posts.author_id = users.id
LEFT JOIN categories ON posts.category_id = categories.id;
```

**原因**:
- 子查询会为每行执行一次
- JOIN 只执行一次，性能更好

---

## 常见查询场景优化

### 1. 首页文章列表查询

**需求**:
- 获取已发布文章
- 按发布时间倒序
- 分页显示
- 包含作者信息

**优化查询**:
```sql
-- 查询1: 获取文章列表
SELECT
    p.id,
    p.title,
    p.slug,
    p.excerpt,
    p.featured_image,
    p.author_id,
    p.view_count,
    p.like_count,
    p.comment_count,
    p.created_at,
    p.published_at
FROM posts p
WHERE p.status = 'published'
ORDER BY p.published_at DESC
LIMIT 20 OFFSET 0;

-- 查询2: 批量获取作者信息
SELECT
    u.id,
    u.username,
    u.avatar_url,
    u.bio
FROM users u
WHERE u.id IN (1, 2, 3, 4, 5); -- 从查询1获取的作者ID列表
```

**使用覆盖索引**:
```sql
-- 创建覆盖索引
CREATE INDEX idx_covering_list
ON posts(status, published_at DESC, id, title, slug, excerpt, featured_image, author_id, view_count, like_count, comment_count, created_at, published_at);
```

**性能**:
- 查询时间: < 10ms
- 无需回表
- 索引覆盖率高

### 2. 文章详情页查询

**需求**:
- 获取文章完整信息
- 包含作者、分类、标签
- 更新浏览量

**优化查询**:
```sql
-- 查询1: 获取文章详情
SELECT
    p.*,
    u.username AS author_name,
    u.avatar_url AS author_avatar,
    c.name AS category_name,
    c.slug AS category_slug
FROM posts p
LEFT JOIN users u ON p.author_id = u.id
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.id = 123 AND p.status = 'published';

-- 查询2: 获取文章标签
SELECT
    t.id,
    t.name,
    t.slug,
    t.color
FROM tags t
INNER JOIN post_tags pt ON t.id = pt.tag_id
WHERE pt.post_id = 123
ORDER BY t.name;

-- 查询3: 更新浏览量（异步执行）
UPDATE posts
SET view_count = view_count + 1
WHERE id = 123;
```

**优化建议**:
- 使用 Redis 缓存文章详情
- 浏览量更新使用队列异步处理
- 标签查询使用缓存

### 3. 评论列表查询

**需求**:
- 获取文章的顶级评论
- 按点赞数或时间排序
- 分页显示
- 包含作者信息

**优化查询**:
```sql
-- 查询1: 获取顶级评论
SELECT
    c.id,
    c.content,
    c.like_count,
    c.reply_count,
    c.created_at,
    c.author_id,
    u.username,
    u.avatar_url
FROM comments c
INNER JOIN users u ON c.author_id = u.id
WHERE c.post_id = 123
  AND c.parent_id IS NULL
  AND c.status = 'approved'
ORDER BY c.like_count DESC, c.created_at DESC
LIMIT 20 OFFSET 0;

-- 查询2: 批量获取评论回复（按需加载）
SELECT
    c.id,
    c.parent_id,
    c.content,
    c.like_count,
    c.created_at,
    c.author_id,
    u.username,
    u.avatar_url
FROM comments c
INNER JOIN users u ON c.author_id = u.id
WHERE c.parent_id IN (1, 2, 3, 4, 5) -- 顶级评论ID列表
  AND c.status = 'approved'
ORDER BY c.created_at ASC;
```

**优化建议**:
- 评论数超过100时，使用分页
- 热门评论使用 Redis 缓存
- 回复采用懒加载

### 4. 用户资料页查询

**需求**:
- 获取用户基本信息
- 获取用户统计
- 获取用户最新文章

**优化查询**:
```sql
-- 查询1: 获取用户信息
SELECT
    u.*,
    (SELECT COUNT(*) FROM followers WHERE following_id = u.id) AS followers_count,
    (SELECT COUNT(*) FROM followers WHERE follower_id = u.id) AS following_count,
    (SELECT COUNT(*) FROM posts WHERE author_id = u.id AND status = 'published') AS posts_count
FROM users u
WHERE u.id = 123;

-- 查询2: 获取用户最新文章
SELECT
    id,
    title,
    slug,
    excerpt,
    featured_image,
    view_count,
    like_count,
    published_at
FROM posts
WHERE author_id = 123 AND status = 'published'
ORDER BY published_at DESC
LIMIT 10;
```

**优化建议**:
- 统计字段使用冗余设计，避免子查询
- 用户资料使用 Redis 缓存
- 文章列表使用分页

### 5. 搜索查询优化

**需求**:
- 全文搜索文章标题和内容
- 按相关度排序
- 支持分页

**MySQL 优化查询**:
```sql
SELECT
    p.*,
    MATCH(p.title, p.content, p.excerpt) AGAINST('Next.js tutorial' IN NATURAL LANGUAGE MODE) AS score
FROM posts p
WHERE p.status = 'published'
  AND MATCH(p.title, p.content, p.excerpt) AGAINST('Next.js tutorial' IN NATURAL LANGUAGE MODE)
ORDER BY score DESC, p.published_at DESC
LIMIT 20 OFFSET 0;
```

**PostgreSQL 优化查询**:
```sql
SELECT
    p.*,
    ts_rank(to_tsvector('simple', coalesce(p.title, '') || ' ' || coalesce(p.content, '')), to_tsquery('simple', 'Next.js & tutorial')) AS score
FROM posts p
WHERE p.status = 'published'
  AND to_tsvector('simple', coalesce(p.title, '') || ' ' || coalesce(p.content, '')) @@ to_tsquery('simple', 'Next.js & tutorial')
ORDER BY score DESC, p.published_at DESC
LIMIT 20 OFFSET 0;
```

**优化建议**:
- 使用 Elasticsearch 进行高级搜索
- 搜索结果使用 Redis 缓存
- 实现搜索建议和自动完成

---

## 慢查询分析与优化

### 1. 启用慢查询日志

**MySQL**:
```sql
-- 启用慢查询日志
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1; -- 1秒
SET GLOBAL log_queries_not_using_indexes = 'ON';

-- 查看慢查询日志位置
SHOW VARIABLES LIKE 'slow_query_log_file';
```

**PostgreSQL**:
```sql
-- 修改 postgresql.conf
log_min_duration_statement = 1000 -- 1秒

-- 重启 PostgreSQL 服务
```

### 2. 分析慢查询

**使用 EXPLAIN**:
```sql
-- MySQL
EXPLAIN SELECT * FROM posts WHERE author_id = 123;

-- 详细分析
EXPLAIN FORMAT=JSON SELECT * FROM posts WHERE author_id = 123;

-- PostgreSQL
EXPLAIN ANALYZE SELECT * FROM posts WHERE author_id = 123;
```

**关键指标**:
- **type**: 连接类型（ALL = 全表扫描，index = 索引扫描，ref = 索引查找）
- **rows**: 预估扫描行数
- **Extra**: 额外信息（Using index = 使用索引，Using filesort = 文件排序）

### 3. 常见慢查询案例

#### 案例1: 全表扫描

**问题查询**:
```sql
SELECT * FROM posts WHERE LOWER(title) LIKE '%nextjs%';
```

**EXPLAIN 结果**:
```
type: ALL
rows: 100000
Extra: Using where
```

**优化方案**:
```sql
-- 使用全文搜索
SELECT * FROM posts
WHERE MATCH(title) AGAINST('nextjs' IN NATURAL LANGUAGE MODE);

-- 或使用外部搜索引擎
```

#### 案例2: 文件排序

**问题查询**:
```sql
SELECT * FROM posts
WHERE category_id = 5
ORDER BY created_at DESC;
```

**EXPLAIN 结果**:
```
type: ref
rows: 5000
Extra: Using filesort
```

**优化方案**:
```sql
-- 创建复合索引
CREATE INDEX idx_category_created
ON posts(category_id, created_at DESC);
```

#### 案例3: 临时表

**问题查询**:
```sql
SELECT DISTINCT author_id FROM posts
WHERE status = 'published';
```

**EXPLAIN 结果**:
```
type: ALL
rows: 100000
Extra: Using temporary
```

**优化方案**:
```sql
-- 使用索引
SELECT author_id FROM posts
WHERE status = 'published'
GROUP BY author_id;

-- 或使用覆盖索引
CREATE INDEX idx_status_author
ON posts(status, author_id);
```

---

## 缓存策略

### 1. Redis 缓存设计

#### 缓存热门文章
```python
# Python FastAPI 示例
import redis
import json

redis_client = redis.Redis(host='localhost', port=6379, db=0)

async def get_hot_posts():
    cache_key = "hot_posts:top20"

    # 尝试从缓存获取
    cached = redis_client.get(cache_key)
    if cached:
        return json.loads(cached)

    # 从数据库查询
    posts = await db.query("""
        SELECT * FROM posts
        WHERE status = 'published'
        ORDER BY view_count DESC
        LIMIT 20
    """)

    # 存入缓存（1小时）
    redis_client.setex(cache_key, 3600, json.dumps(posts))

    return posts
```

#### 缓存文章详情
```python
async def get_post_detail(post_id: int):
    cache_key = f"post:detail:{post_id}"

    # 尝试从缓存获取
    cached = redis_client.get(cache_key)
    if cached:
        return json.loads(cached)

    # 从数据库查询
    post = await db.query_one(
        "SELECT * FROM posts WHERE id = $1", post_id
    )

    # 存入缓存（24小时）
    redis_client.setex(cache_key, 86400, json.dumps(post))

    return post
```

#### 缓存用户资料
```python
async def get_user_profile(user_id: int):
    cache_key = f"user:profile:{user_id}"

    # 尝试从缓存获取
    cached = redis_client.get(cache_key)
    if cached:
        return json.loads(cached)

    # 从数据库查询
    user = await db.query_one(
        "SELECT * FROM users WHERE id = $1", user_id
    )

    # 存入缓存（7天）
    redis_client.setex(cache_key, 604800, json.dumps(user))

    return user
```

### 2. 缓存失效策略

#### 主动失效
```python
async def update_post(post_id: int, data: dict):
    # 更新数据库
    await db.execute(
        "UPDATE posts SET title = $1, content = $2 WHERE id = $3",
        data['title'], data['content'], post_id
    )

    # 删除缓存
    redis_client.delete(f"post:detail:{post_id}")
    redis_client.delete("hot_posts:top20") # 清除热门文章缓存
```

#### 定时刷新
```python
# 每小时刷新热门文章缓存
@app.on_event("startup")
async def start_cache_refresh():
    async def refresh_cache():
        while True:
            await asyncio.sleep(3600) # 1小时
            await refresh_hot_posts_cache()

    asyncio.create_task(refresh_cache())
```

---

## 分页优化

### 1. 传统分页（LIMIT OFFSET）

**问题**: OFFSET 越大，性能越差

```sql
-- 第100页，每页20条
SELECT * FROM posts
ORDER BY published_at DESC
LIMIT 20 OFFSET 1980;
```

**性能**: 2000ms

### 2. 游标分页（Cursor Pagination）

**优势**: 性能稳定，不受页码影响

```sql
-- 第一页
SELECT * FROM posts
WHERE status = 'published'
ORDER BY published_at DESC
LIMIT 20;

-- 下一页（使用上一页最后一条的 published_at）
SELECT * FROM posts
WHERE status = 'published'
  AND published_at < '2026-03-07 10:00:00'
ORDER BY published_at DESC
LIMIT 20;
```

**性能**: 10ms

**实现示例**:
```python
from typing import List, Optional
from datetime import datetime

class PostCursorPagination:
    def __init__(self, limit: int = 20):
        self.limit = limit

    async def get_posts(
        self,
        cursor: Optional[datetime] = None
    ) -> List[dict]:
        query = """
            SELECT * FROM posts
            WHERE status = 'published'
        """

        if cursor:
            query += f" AND published_at < '{cursor}'"

        query += f" ORDER BY published_at DESC LIMIT {self.limit}"

        return await db.query(query)

# 使用
pagination = PostCursorPagination(limit=20)

# 第一页
page1 = await pagination.get_posts()

# 第二页
last_published_at = page1[-1]['published_at']
page2 = await pagination.get_posts(cursor=last_published_at)
```

### 3. 无限滚动优化

```sql
-- 使用 ID 游标
SELECT * FROM posts
WHERE status = 'published'
  AND id < last_seen_id
ORDER BY id DESC
LIMIT 20;
```

---

## 全文搜索优化

### 1. 使用 Elasticsearch

**Docker Compose 配置**:
```yaml
version: '3.8'
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ports:
      - "9200:9200"

  kibana:
    image: docker.elastic.co/kibana/kibana:8.11.0
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch
```

**创建索引**:
```python
from elasticsearch import Elasticsearch

es = Elasticsearch(["http://localhost:9200"])

# 创建索引
index_name = "posts"

index_mapping = {
    "mappings": {
        "properties": {
            "title": {"type": "text"},
            "content": {"type": "text"},
            "excerpt": {"type": "text"},
            "tags": {"type": "keyword"},
            "category": {"type": "keyword"},
            "published_at": {"type": "date"}
        }
    }
}

es.indices.create(index=index_name, body=index_mapping)
```

**搜索文档**:
```python
def search_posts(query: str, page: int = 1, size: int = 20):
    from_ = (page - 1) * size

    search_body = {
        "query": {
            "bool": {
                "must": [
                    {
                        "multi_match": {
                            "query": query,
                            "fields": ["title^2", "content", "excerpt"],
                            "type": "best_fields"
                        }
                    },
                    {
                        "term": {"status": "published"}
                    }
                ]
            }
        },
        "sort": [
            {"published_at": {"order": "desc"}},
            "_score"
        ],
        "from": from_,
        "size": size
    }

    results = es.search(index="posts", body=search_body)

    return {
        "total": results["hits"]["total"]["value"],
        "posts": [hit["_source"] for hit in results["hits"]["hits"]]
    }
```

### 2. 搜索建议

```python
def search_suggestions(query: str):
    search_body = {
        "suggest": {
            "post-suggest": {
                "prefix": query,
                "completion": {
                    "field": "suggest",
                    "size": 10
                }
            }
        }
    }

    results = es.search(index="posts", body=search_body)
    return results["suggest"]["post-suggest"][0]["options"]
```

---

## 性能监控

### 1. 查询性能监控

```python
import time
from functools import wraps

def log_query_time(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        start_time = time.time()
        result = await func(*args, **kwargs)
        query_time = time.time() - start_time

        # 记录慢查询
        if query_time > 1.0: # 超过1秒
            logger.warning(f"Slow query: {func.__name__} took {query_time:.2f}s")

        return result
    return wrapper

@log_query_time
async def get_posts():
    return await db.query("SELECT * FROM posts")
```

### 2. 数据库连接池监控

```python
from sqlalchemy.pool import PoolProxiedConnection

def log_connections(connection: PoolProxiedConnection):
    pool = connection.connection.pool
    logger.info(
        f"Pool status: "
        f"size={pool.size()}, "
        f"checked_in={pool.checkedin()}, "
        f"checked_out={pool.checkedout()}, "
        f"overflow={pool.overflow()}"
    )
```

---

## 总结

### 最佳实践

1. ✅ **使用索引** - 为常用查询创建合适的索引
2. ✅ **避免 SELECT *** - 只查询需要的列
3. ✅ **使用 LIMIT** - 限制返回结果数量
4. ✅ **使用 JOIN** - 替代子查询
5. ✅ **使用缓存** - 减少数据库查询
6. ✅ **使用分页** - 避免一次性加载大量数据
7. ✅ **监控慢查询** - 定期分析和优化
8. ✅ **使用连接池** - 减少连接开销

### 避免的陷阱

1. ❌ **N+1 查询** - 使用批量查询或 JOIN
2. ❌ **过度索引** - 影响写入性能
3. ❌ **大事务** - 拆分为小事务
4. ❌ **阻塞操作** - 使用异步处理
5. ❌ **缺少缓存** - 重复查询相同数据

---

**创建时间**: 2026-03-07
**架构师**: AI Database Architect
**版本**: 1.0.0
