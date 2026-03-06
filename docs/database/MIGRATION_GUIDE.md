# CyberPress Platform - 数据库迁移指南

## 📋 目录
- [迁移概述](#迁移概述)
- [版本控制](#版本控制)
- [迁移脚本](#迁移脚本)
- [回滚策略](#回滚策略)
- [最佳实践](#最佳实践)

---

## 迁移概述

### 迁移文件位置
```
backend/database/migrations/
├── 001_initial_schema.sql              # 初始schema
├── 002_add_performance_indexes.sql     # 性能索引
├── 003_add_search_optimization.sql     # 搜索优化
├── 004_add_performance_monitoring.sql  # 性能监控
├── 005_add_user_preferences.sql        # 用户偏好
└── 006_add_reading_list_table.sql      # 阅读列表
```

### 迁移命名规范
```
[编号]_[描述]_[版本].sql

示例:
001_initial_schema_v1.0.0.sql
002_add_social_features_v1.1.0.sql
003_add_analytics_tables_v1.2.0.sql
```

---

## 版本控制

### 迁移版本表

```sql
-- 迁移版本跟踪表
CREATE TABLE IF NOT EXISTS schema_migrations (
    id SERIAL PRIMARY KEY,
    version VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    execution_time_ms INTEGER,
    success BOOLEAN DEFAULT TRUE,
    checksum VARCHAR(64)
);

-- 当前版本表
CREATE TABLE IF NOT EXISTS schema_version (
    version VARCHAR(255) PRIMARY KEY,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入初始版本
INSERT INTO schema_version (version) VALUES ('1.0.0');
```

---

## 迁移脚本

### 迁移 #001: 初始Schema

```sql
-- File: 001_initial_schema.sql
-- Version: 1.0.0
-- Description: 初始数据库结构
-- Author: CyberPress Team
-- Date: 2024-01-01

-- 开始事务
BEGIN;

-- 记录迁移开始
INSERT INTO schema_migrations (version, description, executed_at)
VALUES ('001_initial_schema', '初始数据库结构', NOW());

-- 创建扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 创建用户表
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    -- ... 其他字段
);

-- [其他表创建...]

-- 记录迁移完成时间
UPDATE schema_migrations
SET execution_time_ms = EXTRACT(EPOCH FROM (NOW() - executed_at)) * 1000,
    success = TRUE
WHERE version = '001_initial_schema';

-- 更新当前版本
INSERT INTO schema_version (version) VALUES ('1.0.0')
ON CONFLICT (version) DO UPDATE SET updated_at = NOW();

COMMIT;
```

### 迁移 #002: 添加全文搜索

```sql
-- File: 002_add_full_text_search.sql
-- Version: 1.1.0
-- Description: 添加全文搜索支持
-- Author: CyberPress Team
-- Date: 2024-01-15

BEGIN;

INSERT INTO schema_migrations (version, description)
VALUES ('002_add_full_text_search', '添加全文搜索支持', NOW());

-- 创建全文搜索索引
CREATE INDEX idx_posts_search
ON posts USING gin(to_tsvector('english', title || ' ' || content));

-- 创建带权重的全文搜索索引
CREATE INDEX idx_posts_search_weighted
ON posts USING gin(
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(excerpt, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(content, '')), 'C')
);

UPDATE schema_migrations
SET execution_time_ms = EXTRACT(EPOCH FROM (NOW() - executed_at)) * 1000,
    success = TRUE
WHERE version = '002_add_full_text_search';

INSERT INTO schema_version (version) VALUES ('1.1.0')
ON CONFLICT (version) DO UPDATE SET updated_at = NOW();

COMMIT;
```

### 迁移 #003: 添加社交功能

```sql
-- File: 003_add_social_features.sql
-- Version: 1.2.0
-- Description: 添加关注、点赞等社交功能
-- Author: CyberPress Team
-- Date: 2024-02-01

BEGIN;

INSERT INTO schema_migrations (version, description)
VALUES ('003_add_social_features', '添加社交功能', NOW());

-- 创建关注表
CREATE TABLE IF NOT EXISTS follows (
    follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (follower_id, following_id),
    CHECK (follower_id != following_id)
);

CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_following ON follows(following_id);

-- 创建点赞表
CREATE TABLE IF NOT EXISTS post_likes (
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id, user_id)
);

CREATE INDEX idx_post_likes_user ON post_likes(user_id);

-- 更新 posts 表添加点赞计数
ALTER TABLE posts ADD COLUMN IF NOT EXISTS like_count INTEGER DEFAULT 0;

-- 创建触发器更新点赞计数
CREATE OR REPLACE FUNCTION update_like_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE posts SET like_count = like_count + 1 WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE posts SET like_count = GREATEST(like_count - 1, 0) WHERE id = OLD.post_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_post_likes
AFTER INSERT OR DELETE ON post_likes
FOR EACH ROW EXECUTE FUNCTION update_like_count();

UPDATE schema_migrations
SET execution_time_ms = EXTRACT(EPOCH FROM (NOW() - executed_at)) * 1000,
    success = TRUE
WHERE version = '003_add_social_features';

INSERT INTO schema_version (version) VALUES ('1.2.0')
ON CONFLICT (version) DO UPDATE SET updated_at = NOW();

COMMIT;
```

### 迁移 #004: 添加阅读列表

```sql
-- File: 004_add_reading_list.sql
-- Version: 1.3.0
-- Description: 添加用户阅读列表功能
-- Author: CyberPress Team
-- Date: 2024-02-15

BEGIN;

INSERT INTO schema_migrations (version, description)
VALUES ('004_add_reading_list', '添加阅读列表功能', NOW());

-- 创建阅读列表表
CREATE TABLE IF NOT EXISTS reading_list (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    is_completed BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, post_id)
);

CREATE INDEX idx_reading_list_user ON reading_list(user_id, updated_at DESC);
CREATE INDEX idx_reading_list_post ON reading_list(post_id);

-- 创建阅读历史表
CREATE TABLE IF NOT EXISTS reading_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    duration_seconds INTEGER
);

CREATE INDEX idx_reading_history_user ON reading_history(user_id, read_at DESC);
CREATE INDEX idx_reading_history_post ON reading_history(post_id);

UPDATE schema_migrations
SET execution_time_ms = EXTRACT(EPOCH FROM (NOW() - executed_at)) * 1000,
    success = TRUE
WHERE version = '004_add_reading_list';

INSERT INTO schema_version (version) VALUES ('1.3.0')
ON CONFLICT (version) DO UPDATE SET updated_at = NOW();

COMMIT;
```

### 迁移 #005: 性能优化

```sql
-- File: 005_performance_optimization.sql
-- Version: 1.4.0
-- Description: 性能优化索引和视图
-- Author: CyberPress Team
-- Date: 2024-03-01

BEGIN;

INSERT INTO schema_migrations (version, description)
VALUES ('005_performance_optimization', '性能优化', NOW());

-- 创建部分索引（只索引已发布文章）
CREATE INDEX IF NOT EXISTS idx_posts_published
ON posts(published_at DESC)
WHERE status = 'published';

-- 创建覆盖索引
CREATE INDEX IF NOT EXISTS idx_posts_home_cover
ON posts(status, published_at DESC)
INCLUDE (title, slug, featured_image, view_count)
WHERE status = 'published';

-- 创建热门文章物化视图
CREATE MATERIALIZED VIEW IF NOT EXISTS popular_posts AS
SELECT
    p.id,
    p.title,
    p.slug,
    p.featured_image,
    p.view_count,
    p.like_count,
    p.comment_count,
    p.published_at,
    u.name as author_name,
    c.name as category_name
FROM posts p
JOIN users u ON p.author_id = u.id
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.status = 'published'
    AND p.published_at > CURRENT_DATE - INTERVAL '30 days'
ORDER BY (p.view_count + p.like_count * 2 + p.comment_count * 3) DESC;

CREATE UNIQUE INDEX ON popular_posts(id);

-- 创建文章统计物化视图
CREATE MATERIALIZED VIEW IF NOT EXISTS post_statistics AS
SELECT
    p.id as post_id,
    p.title,
    p.slug,
    p.view_count,
    p.like_count,
    p.comment_count,
    COUNT(DISTINCT v.id) as unique_visitors,
    COUNT(DISTINCT cl.user_id) as unique_likers
FROM posts p
LEFT JOIN page_views v ON p.id = v.post_id
LEFT JOIN comment_likes cl ON p.id = cl.post_id
GROUP BY p.id, p.title, p.slug, p.view_count, p.like_count, p.comment_count;

CREATE UNIQUE INDEX ON post_statistics(post_id);

UPDATE schema_migrations
SET execution_time_ms = EXTRACT(EPOCH FROM (NOW() - executed_at)) * 1000,
    success = TRUE
WHERE version = '005_performance_optimization';

INSERT INTO schema_version (version) VALUES ('1.4.0')
ON CONFLICT (version) DO UPDATE SET updated_at = NOW();

COMMIT;
```

---

## 回滚策略

### 回滚脚本

每个迁移都应提供对应的回滚脚本：

```sql
-- File: rollback/003_rollback_social_features.sql
-- Description: 回滚社交功能迁移

BEGIN;

-- 删除触发器
DROP TRIGGER IF EXISTS update_post_likes ON post_likes;

-- 删除函数
DROP FUNCTION IF EXISTS update_like_count();

-- 删除点赞表
DROP TABLE IF EXISTS post_likes;

-- 删除关注表
DROP TABLE IF EXISTS follows;

-- 删除 like_count 列
ALTER TABLE posts DROP COLUMN IF EXISTS like_count;

-- 更新版本
INSERT INTO schema_version (version) VALUES ('1.1.0')
ON CONFLICT (version) DO UPDATE SET updated_at = NOW();

COMMIT;
```

### 自动回滚脚本

```sql
-- 创建回滚函数
CREATE OR REPLACE FUNCTION rollback_migration(p_version TEXT)
RETURNS void AS $$
DECLARE
    rollback_script TEXT;
BEGIN
    -- 获取回滚脚本
    SELECT content INTO rollback_script
    FROM migration_scripts
    WHERE version = p_version AND script_type = 'rollback';

    IF rollback_script IS NULL THEN
        RAISE EXCEPTION 'Rollback script not found for version %', p_version;
    END IF;

    -- 执行回滚
    EXECUTE rollback_script;

    -- 记录回滚
    UPDATE schema_migrations
    SET success = FALSE
    WHERE version = p_version;

    RAISE NOTICE 'Rolled back migration: %', p_version;
END;
$$ LANGUAGE plpgsql;

-- 使用示例
-- SELECT rollback_migration('003_add_social_features');
```

---

## 迁移工具

### Python 迁移工具

```python
# backend/database/migrate.py
import os
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import hashlib
import time

class DatabaseMigrator:
    def __init__(self, db_config):
        self.conn = psycopg2.connect(**db_config)
        self.conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        self.cursor = self.conn.cursor()
        self.migrations_dir = 'migrations'

    def get_current_version(self):
        """获取当前数据库版本"""
        self.cursor.execute("SELECT version FROM schema_version")
        result = self.cursor.fetchone()
        return result[0] if result else '0.0.0'

    def get_executed_migrations(self):
        """获取已执行的迁移"""
        self.cursor.execute("""
            SELECT version, success
            FROM schema_migrations
            ORDER BY executed_at
        """)
        return {row[0]: row[1] for row in self.cursor.fetchall()}

    def get_pending_migrations(self):
        """获取待执行的迁移"""
        executed = self.get_executed_migrations()
        all_migrations = []

        for filename in sorted(os.listdir(self.migrations_dir)):
            if filename.endswith('.sql') and not filename.startswith('rollback'):
                version = filename.split('_')[0]
                if version not in executed:
                    all_migrations.append((version, filename))

        return all_migrations

    def calculate_checksum(self, filepath):
        """计算文件的校验和"""
        with open(filepath, 'rb') as f:
            return hashlib.sha256(f.read()).hexdigest()

    def execute_migration(self, version, filename):
        """执行迁移脚本"""
        filepath = os.path.join(self.migrations_dir, filename)

        print(f"Executing migration: {filename}")

        start_time = time.time()

        try:
            # 读取并执行SQL
            with open(filepath, 'r') as f:
                sql = f.read()

            self.cursor.execute(sql)
            self.conn.commit()

            execution_time = int((time.time() - start_time) * 1000)
            checksum = self.calculate_checksum(filepath)

            # 记录迁移
            self.cursor.execute("""
                INSERT INTO schema_migrations (version, description, execution_time_ms, success, checksum)
                VALUES (%s, %s, %s, %s, %s)
            """, (version, f'Migration {version}', execution_time, True, checksum))

            print(f"✓ Migration {version} completed successfully ({execution_time}ms)")

        except Exception as e:
            self.conn.rollback()
            print(f"✗ Migration {version} failed: {str(e)}")

            # 记录失败
            self.cursor.execute("""
                INSERT INTO schema_migrations (version, description, execution_time_ms, success)
                VALUES (%s, %s, %s, %s)
            """, (version, f'Migration {version}', int((time.time() - start_time) * 1000), False))

            raise

    def migrate(self):
        """执行所有待执行的迁移"""
        pending = self.get_pending_migrations()

        if not pending:
            print("No pending migrations")
            return

        print(f"Found {len(pending)} pending migrations")

        for version, filename in pending:
            self.execute_migration(version, filename)

        print("All migrations completed successfully")

    def rollback(self, version):
        """回滚指定版本的迁移"""
        rollback_file = os.path.join(self.migrations_dir, 'rollback', f'{version}_rollback.sql')

        if not os.path.exists(rollback_file):
            raise FileNotFoundError(f"Rollback script not found: {rollback_file}")

        print(f"Rolling back migration: {version}")

        with open(rollback_file, 'r') as f:
            sql = f.read()

        self.cursor.execute(sql)
        self.conn.commit()

        print(f"✓ Rollback {version} completed successfully")

# 使用示例
if __name__ == '__main__':
    db_config = {
        'host': 'localhost',
        'database': 'cyberpress_db',
        'user': 'cyberpress_user',
        'password': 'your_password'
    }

    migrator = DatabaseMigrator(db_config)

    import sys
    if len(sys.argv) > 1 and sys.argv[1] == 'rollback':
        if len(sys.argv) > 2:
            migrator.rollback(sys.argv[2])
        else:
            print("Usage: python migrate.py rollback <version>")
    else:
        migrator.migrate()
```

---

## 最佳实践

### 1. 迁移开发流程

```
1. 创建迁移文件
   ├── 格式: [编号]_[描述].sql
   ├── 使用事务包裹
   └── 包含版本记录

2. 编写迁移脚本
   ├── 向前迁移
   ├── 回滚脚本
   └── 测试脚本

3. 测试迁移
   ├── 在开发环境测试
   ├── 在测试环境验证
   └── 检查性能影响

4. 执行迁移
   ├── 备份数据库
   ├── 执行迁移
   └── 验证结果
```

### 2. 迁移检查清单

- [ ] 迁移文件命名正确
- [ ] 使用事务包裹SQL
- [ ] 添加版本记录
- [ ] 编写回滚脚本
- [ ] 在开发环境测试
- [ ] 在测试环境验证
- [ ] 评估性能影响
- [ ] 备份生产数据库
- [ ] 通知团队成员
- [ ] 选择低峰期执行
- [ ] 监控执行过程
- [ ] 验证迁移结果

### 3. 迁移注意事项

```sql
-- ✅ 好的做法
BEGIN;
    -- 添加可空列
    ALTER TABLE posts ADD COLUMN featured_image TEXT;

    -- 创建索引（CONCURRENTLY 避免锁表）
    CREATE INDEX CONCURRENTLY idx_posts_featured_image ON posts(featured_image);

    -- 添加外键（先添加数据，再添加约束）
    ALTER TABLE posts ADD CONSTRAINT fk_posts_category
        FOREIGN KEY (category_id) REFERENCES categories(id);
COMMIT;

-- ❌ 不好的做法
ALTER TABLE posts ADD COLUMN new_column VARCHAR(255) NOT NULL;
-- 错误：添加 NOT NULL 列但没有默认值，会导致表锁

-- ✅ 正确做法
ALTER TABLE posts ADD COLUMN new_column VARCHAR(255);
UPDATE posts SET new_column = 'default_value';
ALTER TABLE posts ALTER COLUMN new_column SET NOT NULL;
```

### 4. 大表迁移策略

```sql
-- 对于大表，分批更新数据
-- 1. 添加新列
ALTER TABLE big_table ADD COLUMN new_column TEXT;

-- 2. 分批更新（每次10000行）
DO $$
DECLARE
    batch_size INTEGER := 10000;
    updated_count INTEGER := 1;
BEGIN
    WHILE updated_count > 0 LOOP
        UPDATE big_table
        SET new_column = computed_value
        WHERE new_column IS NULL
        LIMIT batch_size;

        GET DIAGNOSTICS updated_count = ROW_COUNT;
        COMMIT;
        RAISE NOTICE 'Updated % rows', updated_count;
    END LOOP;
END $$;

-- 3. 添加默认值
ALTER TABLE big_table ALTER COLUMN new_column SET DEFAULT 'default';

-- 4. 添加 NOT NULL 约束
ALTER TABLE big_table ALTER COLUMN new_column SET NOT NULL;
```

---

## 监控与故障排查

### 迁移执行监控

```sql
-- 查看迁移历史
SELECT
    version,
    description,
    executed_at,
    execution_time_ms,
    success,
    checksum
FROM schema_migrations
ORDER BY executed_at DESC;

-- 查看失败的迁移
SELECT * FROM schema_migrations WHERE success = FALSE;

-- 查看当前版本
SELECT * FROM schema_version;
```

### 故障排查

```sql
-- 检查锁等待
SELECT
    pid,
    usename,
    pg_blocking_pids(pid) as blocked_by,
    query as blocked_query
FROM pg_stat_activity
WHERE cardinality(pg_blocking_pids(pid)) > 0;

-- 检查长时间运行的查询
SELECT
    pid,
    now() - query_start as duration,
    query
FROM pg_stat_activity
WHERE state = 'active'
    AND now() - query_start > interval '5 minutes';

-- 终止特定会话
-- SELECT pg_terminate_backend(pid);
```

---

## 总结

数据库迁移是维护数据库结构的重要工具，需要：

1. **版本控制**: 严格管理迁移版本
2. **测试充分**: 在测试环境充分测试
3. **备份先行**: 执行前务必备份数据
4. **分步执行**: 复杂迁移分多步进行
5. **回滚准备**: 始终准备回滚方案
6. **监控执行**: 实时监控迁移过程
7. **文档完善**: 详细记录每个迁移

记住：谨慎执行，充分测试，确保数据安全！
