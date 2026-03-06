# CyberPress Platform - 数据库迁移指南

## 目录
1. [迁移前准备](#迁移前准备)
2. [MySQL 到 PostgreSQL 迁移](#mysql-到-postgresql-迁移)
3. [数据迁移脚本](#数据迁移脚本)
4. [验证与测试](#验证与测试)
5. [回滚方案](#回滚方案)

---

## 迁移前准备

### 1. 评估数据库现状

**检查数据库大小**:
```sql
-- MySQL
SELECT
    table_name AS 'Table',
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES
WHERE table_schema = 'cyberpress'
ORDER BY (data_length + index_length) DESC;

-- PostgreSQL
SELECT
    tablename AS "Table",
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS "Size"
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

**检查表数量和行数**:
```sql
-- MySQL
SELECT COUNT(*) as table_count FROM information_schema.TABLES WHERE table_schema = 'cyberpress';

-- PostgreSQL
SELECT COUNT(*) as table_count FROM pg_tables WHERE schemaname = 'public';
```

### 2. 备份数据

**MySQL 备份**:
```bash
# 备份整个数据库
mysqldump -u root -p cyberpress > cyberpress_backup_$(date +%Y%m%d).sql

# 备份特定表
mysqldump -u root -p cyberpress users posts > cyberpress_tables_backup.sql

# 备份结构（不含数据）
mysqldump -u root -p --no-data cyberpress > cyberpress_schema.sql
```

**PostgreSQL 备份**:
```bash
# 备份整个数据库
pg_dump -U postgres cyberpress > cyberpress_backup_$(date +%Y%m%d).sql

# 备份特定表
pg_dump -U postgres -t users -t posts cyberpress > cyberpress_tables_backup.sql

# 备份结构（不含数据）
pg_dump -U postgres --schema-only cyberpress > cyberpress_schema.sql
```

### 3. 检查兼容性

**数据类型映射**:

| MySQL | PostgreSQL | 说明 |
|-------|-----------|------|
| BIGINT | BIGINT | 一致 |
| INT | INTEGER | 一致 |
| VARCHAR(n) | VARCHAR(n) | 一致 |
| TEXT | TEXT | 一致 |
| LONGTEXT | TEXT | PostgreSQL TEXT 无长度限制 |
| TIMESTAMP | TIMESTAMP WITH TIME ZONE | PostgreSQL 带时区 |
| ENUM | VARCHAR + CHECK | 使用 CHECK 约束 |
| JSON | JSONB | PostgreSQL JSONB 性能更好 |
| TINYINT(1) | BOOLEAN | PostgreSQL 原生支持 |

**索引映射**:

| MySQL | PostgreSQL | 说明 |
|-------|-----------|------|
| INDEX | INDEX | 一致 |
| UNIQUE | UNIQUE | 一致 |
| FULLTEXT | GIN + tsvector | 使用全文搜索扩展 |
| FOREIGN KEY | FOREIGN KEY | 一致 |
| PARTITION | PARTITION | 语法略有不同 |

---

## MySQL 到 PostgreSQL 迁移

### 方案1: 使用 pgLoader（推荐）

**安装 pgLoader**:
```bash
# macOS
brew install pgloader

# Ubuntu/Debian
sudo apt-get install pgloader

# Docker
docker pull dimitri/pgloader:latest
```

**迁移命令**:
```bash
# 基本迁移
pgloader mysql://root:password@localhost/cyberpress \
          postgresql://postgres:password@localhost/cyberpress

# 带配置文件的迁移
pgloader cyberpress.load

# 并发迁移
pgloader --with "prefetch rows = 10000" \
         --with "concurrency = 4" \
         mysql://root:password@localhost/cyberpress \
         postgresql://postgres:password@localhost/cyberpress
```

**配置文件示例 (cyberpress.load)**:
```lisp
LOAD DATABASE
    FROM mysql://root:password@localhost/cyberpress
    INTO postgresql://postgres:password@localhost/cyberpress

WITH include drop, create tables, create indexes, reset sequences

SET MySQL PARAMETERS
    net_buffer_length = 16384,

SET PostgreSQL PARAMETERS
    maintenance_work_mem = '1GB',
    effective_cache_size = '2GB'

CAST type datetime to timestamptz drop default drop not null using zero-dates-to-null,
     type date drop not null drop default using zero-dates-to-null,
     type year to integer drop not null drop default,

MATERIALIZE INDEX views_account_id_user_id_idx

ALTER TABLE NAMES MATCHING ~/^posts_/ TO RENAME TO ^post_/;
```

### 方案2: 使用 Python 脚本迁移

**安装依赖**:
```bash
pip install mysqlclient psycopg2-binary sqlalchemy pandas
```

**迁移脚本 (migrate_mysql_to_postgres.py)**:
```python
import os
import time
from datetime import datetime
from sqlalchemy import create_engine, text
from sqlalchemy.schema import CreateTable, MetaData
import pandas as pd

# 配置
MYSQL_CONFIG = {
    'host': 'localhost',
    'port': 3306,
    'user': 'root',
    'password': 'your_password',
    'database': 'cyberpress'
}

POSTGRES_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'user': 'postgres',
    'password': 'your_password',
    'database': 'cyberpress'
}

# 创建连接
mysql_engine = create_engine(
    f"mysql+mysqldb://{MYSQL_CONFIG['user']}:{MYSQL_CONFIG['password']}@{MYSQL_CONFIG['host']}:{MYSQL_CONFIG['port']}/{MYSQL_CONFIG['database']}",
    pool_pre_ping=True
)

postgres_engine = create_engine(
    f"postgresql+psycopg2://{POSTGRES_CONFIG['user']}:{POSTGRES_CONFIG['password']}@{POSTGRES_CONFIG['host']}:{POSTGRES_CONFIG['port']}/{POSTGRES_CONFIG['database']}",
    pool_pre_ping=True
)

# 数据类型转换映射
TYPE_MAPPING = {
    'bigint': 'BIGINT',
    'int': 'INTEGER',
    'varchar': 'VARCHAR',
    'text': 'TEXT',
    'longtext': 'TEXT',
    'timestamp': 'TIMESTAMP WITH TIME ZONE',
    'date': 'DATE',
    'boolean': 'BOOLEAN',
    'json': 'JSONB',
}

def migrate_table(table_name: str, batch_size: int = 1000):
    """迁移单个表"""
    print(f"开始迁移表: {table_name}")

    try:
        # 获取表数据
        offset = 0
        total_rows = 0

        while True:
            # 从 MySQL 读取数据
            query = f"SELECT * FROM {table_name} LIMIT {batch_size} OFFSET {offset}"
            df = pd.read_sql(query, mysql_engine)

            if df.empty:
                break

            # 写入 PostgreSQL
            df.to_sql(
                table_name,
                postgres_engine,
                if_exists='append',
                index=False,
                method='multi',
                chunksize=100
            )

            total_rows += len(df)
            offset += batch_size
            print(f"  已迁移 {total_rows} 行")

            if len(df) < batch_size:
                break

        print(f"✅ 表 {table_name} 迁移完成，共 {total_rows} 行")
        return True

    except Exception as e:
        print(f"❌ 表 {table_name} 迁移失败: {str(e)}")
        return False

def get_tables():
    """获取所有表名"""
    query = """
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'cyberpress'
        AND table_type = 'BASE TABLE'
    """
    df = pd.read_sql(query, mysql_engine)
    return df['table_name'].tolist()

def migrate_all_tables():
    """迁移所有表"""
    tables = get_tables()
    print(f"找到 {len(tables)} 个表")

    # 迁移顺序（考虑外键依赖）
    migration_order = [
        'users',
        'user_profiles',
        'categories',
        'tags',
        'posts',
        'post_categories',
        'post_tags',
        'comments',
        'likes',
        'bookmark_folders',
        'bookmarks',
        'reading_history',
        'reading_list',
        'notifications',
        'post_views',
        'media',
        'analytics_events',
    ]

    # 过滤存在的表
    tables_to_migrate = [t for t in migration_order if t in tables]

    print(f"\n开始迁移数据库...")
    print(f"源数据库: MySQL {MYSQL_CONFIG['database']}")
    print(f"目标数据库: PostgreSQL {POSTGRES_CONFIG['database']}")
    print(f"表数量: {len(tables_to_migrate)}\n")

    start_time = time.time()
    success_count = 0
    failed_count = 0

    for table_name in tables_to_migrate:
        if migrate_table(table_name):
            success_count += 1
        else:
            failed_count += 1

    elapsed_time = time.time() - start_time

    print(f"\n迁移完成！")
    print(f"成功: {success_count} 个表")
    print(f"失败: {failed_count} 个表")
    print(f"总耗时: {elapsed_time:.2f} 秒")

if __name__ == "__main__":
    # 确认开始
    print("警告: 此操作将清空目标数据库并从 MySQL 迁移数据！")
    confirm = input("确认继续? (yes/no): ")

    if confirm.lower() == 'yes':
        migrate_all_tables()
    else:
        print("已取消")
```

**运行迁移**:
```bash
python migrate_mysql_to_postgres.py
```

---

## 数据迁移脚本

### 1. 迁移用户数据

```sql
-- PostgreSQL 迁移后处理
UPDATE users SET
    followers_count = COALESCE((
        SELECT COUNT(*) FROM followers WHERE following_id = users.id
    ), 0),
    following_count = COALESCE((
        SELECT COUNT(*) FROM followers WHERE follower_id = users.id
    ), 0),
    posts_count = COALESCE((
        SELECT COUNT(*) FROM posts WHERE author_id = users.id AND status = 'published'
    ), 0);
```

### 2. 重置序列

```sql
-- PostgreSQL 重置自增序列
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('posts_id_seq', (SELECT MAX(id) FROM posts));
SELECT setval('comments_id_seq', (SELECT MAX(id) FROM comments));
-- ... 其他表
```

### 3. 重建全文搜索索引

```sql
-- PostgreSQL 创建全文搜索索引
CREATE INDEX idx_posts_fulltext ON posts USING gin(
    to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(content, '') || ' ' || coalesce(excerpt, ''))
);

CREATE INDEX idx_users_fulltext ON users USING gin(
    to_tsvector('simple', coalesce(username, '') || ' ' || coalesce(bio, ''))
);
```

---

## 验证与测试

### 1. 数据完整性验证

**验证行数**:
```sql
-- MySQL
SELECT table_name, table_rows
FROM information_schema.TABLES
WHERE table_schema = 'cyberpress'
ORDER BY table_name;

-- PostgreSQL
SELECT
    schemaname,
    tablename,
    n_live_tup AS row_count
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

**验证脚本 (validate_migration.py)**:
```python
from sqlalchemy import create_engine, text

mysql_engine = create_engine("mysql+mysqldb://root:password@localhost/cyberpress")
postgres_engine = create_engine("postgresql://postgres:password@localhost/cyberpress")

def validate_table(table_name: str):
    """验证表数据一致性"""
    # MySQL 行数
    with mysql_engine.connect() as conn:
        mysql_count = conn.execute(text(f"SELECT COUNT(*) FROM {table_name}")).scalar()

    # PostgreSQL 行数
    with postgres_engine.connect() as conn:
        pg_count = conn.execute(text(f"SELECT COUNT(*) FROM {table_name}")).scalar()

    print(f"{table_name}: MySQL={mysql_count}, PostgreSQL={pg_count}, Match={mysql_count == pg_count}")

    return mysql_count == pg_count

# 验证所有表
tables = ['users', 'posts', 'comments', 'likes', 'bookmarks']
for table in tables:
    validate_table(table)
```

### 2. 性能测试

**测试查询性能**:
```sql
-- 测试文章列表查询
EXPLAIN ANALYZE
SELECT p.*, u.username
FROM posts p
LEFT JOIN users u ON p.author_id = u.id
WHERE p.status = 'published'
ORDER BY p.published_at DESC
LIMIT 20;

-- 测试评论查询
EXPLAIN ANALYZE
SELECT c.*, u.username
FROM comments c
INNER JOIN users u ON c.author_id = u.id
WHERE c.post_id = 123 AND c.status = 'approved'
ORDER BY c.created_at DESC;
```

### 3. 功能测试

**测试 CRUD 操作**:
```python
# 测试插入
with postgres_engine.connect() as conn:
    conn.execute(text("""
        INSERT INTO users (username, email, password_hash)
        VALUES ('test_user', 'test@example.com', 'hash')
    """))
    conn.commit()

# 测试查询
with postgres_engine.connect() as conn:
    result = conn.execute(text("SELECT * FROM users WHERE username = 'test_user'"))
    print(result.fetchone())

# 测试更新
with postgres_engine.connect() as conn:
    conn.execute(text("""
        UPDATE users SET bio = 'Test bio' WHERE username = 'test_user'
    """))
    conn.commit()

# 测试删除
with postgres_engine.connect() as conn:
    conn.execute(text("DELETE FROM users WHERE username = 'test_user'"))
    conn.commit()
```

---

## 回滚方案

### 1. 快速回滚

**停止应用**:
```bash
# 停止所有应用服务
docker-compose down
```

**恢复 MySQL 数据库**:
```bash
# 恢复备份
mysql -u root -p cyberpress < cyberpress_backup_20260307.sql

# 或使用 Docker
docker exec -i mysql-container mysql -u root -ppassword cyberpress < cyberpress_backup_20260307.sql
```

**切换应用配置**:
```bash
# 修改环境变量
export DB_TYPE=mysql
export DB_HOST=localhost
export DB_PORT=3306

# 重启应用
docker-compose up -d
```

### 2. 数据同步回滚

如果迁移后已经运行了一段时间，需要同步新数据：

```python
# sync_new_data.py
from sqlalchemy import create_engine, text
import time

postgres_engine = create_engine("postgresql://postgres:password@localhost/cyberpress")
mysql_engine = create_engine("mysql+mysqldb://root:password@localhost/cyberpress")

def sync_table(table_name: str, since: str):
    """同步指定时间后的数据"""
    query = f"""
        SELECT * FROM {table_name}
        WHERE updated_at > '{since}'
        ORDER BY updated_at
    """

    # 从 PostgreSQL 读取新数据
    with postgres_engine.connect() as conn:
        df = pd.read_sql(query, postgres_engine)

    if df.empty:
        print(f"表 {table_name} 没有新数据")
        return

    # 写入 MySQL
    df.to_sql(
        table_name,
        mysql_engine,
        if_exists='append',
        index=False,
        method='multi'
    )

    print(f"✅ 同步表 {table_name}，{len(df)} 行")

# 同步所有表
sync_time = "2026-03-07 00:00:00"
tables = ['users', 'posts', 'comments', 'likes', 'bookmarks']

for table in tables:
    sync_table(table, sync_time)
```

---

## 最佳实践

### 1. 分阶段迁移

**阶段1: 只读测试**
- 迁移到 PostgreSQL
- 运行测试验证
- 不切换流量

**阶段2: 灰度发布**
- 10% 流量切换到 PostgreSQL
- 监控错误率和性能
- 逐步增加流量

**阶段3: 全量切换**
- 100% 流量切换到 PostgreSQL
- 保留 MySQL 一周用于回滚

**阶段4: 清理**
- 删除 MySQL 实例
- 释放资源

### 2. 双写方案

在迁移期间，同时写入 MySQL 和 PostgreSQL:

```python
# dual_write.py
import asyncio
from sqlalchemy import create_engine, text

mysql_engine = create_engine("mysql+mysqldb://root:password@localhost/cyberpress")
postgres_engine = create_engine("postgresql://postgres:password@localhost/cyberpress")

async def dual_write(table: str, data: dict):
    """同时写入 MySQL 和 PostgreSQL"""
    tasks = []

    # 写入 MySQL
    async def write_mysql():
        with mysql_engine.connect() as conn:
            conn.execute(text(f"INSERT INTO {table} ..."), data)
            conn.commit()
    tasks.append(write_mysql())

    # 写入 PostgreSQL
    async def write_postgres():
        with postgres_engine.connect() as conn:
            conn.execute(text(f"INSERT INTO {table} ..."), data)
            conn.commit()
    tasks.append(write_postgres())

    # 并发执行
    await asyncio.gather(*tasks, return_exceptions=True)
```

### 3. 监控告警

**设置监控指标**:
```python
# monitoring.py
from prometheus_client import Counter, Histogram

# 迁移监控
migration_errors = Counter('migration_errors', 'Migration errors', ['table', 'database'])
migration_latency = Histogram('migration_latency_seconds', 'Migration latency', ['table'])

@migration_latency.time()
def migrate_with_monitoring(table_name: str):
    try:
        migrate_table(table_name)
    except Exception as e:
        migration_errors.labels(table=table_name, database='postgresql').inc()
        raise
```

---

## 总结

### 迁移检查清单

- [ ] 备份源数据库
- [ ] 评估数据库大小和复杂度
- [ ] 选择迁移方案（pgLoader / 自定义脚本）
- [ ] 在测试环境预演
- [ ] 执行迁移
- [ ] 验证数据完整性
- [ ] 运行性能测试
- [ ] 功能测试
- [ ] 灰度发布
- [ ] 全量切换
- [ ] 监控告警
- [ ] 清理旧数据

### 风险评估

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| 数据丢失 | 高 | 完整备份，验证迁移 |
| 性能下降 | 中 | 性能测试，优化索引 |
| 兼容性问题 | 中 | 充分测试，代码调整 |
| 迁移失败 | 高 | 回滚方案，双写策略 |
| 停机时间 | 中 | 选择低峰期，双写方案 |

---

**创建时间**: 2026-03-07
**架构师**: AI Database Architect
**版本**: 1.0.0
