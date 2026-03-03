# 数据库迁移指南

## 📋 概述

本文档说明如何使用 Alembic 进行数据库迁移管理。

## 🚀 快速开始

### 安装依赖

```bash
pip install alembic sqlalchemy psycopg2-binary
```

### 初始化 Alembic

如果还没有初始化，运行：

```bash
alembic init alembic
```

### 配置 Alembic

编辑 `alembic.ini` 文件，设置数据库连接：

```ini
sqlalchemy.url = postgresql://postgres:yourpassword@localhost:5432/cyberpress
```

编辑 `alembic/env.py`，导入你的模型：

```python
from app.models import Base
target_metadata = Base.metadata
```

## 📝 创建迁移

### 自动生成迁移

```bash
# 检测模型变化并生成迁移脚本
alembic revision --autogenerate -m "描述你的变更"
```

### 手动创建迁移

```bash
# 创建空白迁移脚本
alembic revision -m "描述你的变更"
```

然后在生成的文件中编写升级和降级逻辑：

```python
def upgrade():
    # 在这里编写升级逻辑
    pass

def downgrade():
    # 在这里编写降级逻辑
    pass
```

## 🔄 执行迁移

### 升级到最新版本

```bash
alembic upgrade head
```

### 升级到特定版本

```bash
alembic upgrade <revision_id>
```

### 降级一个版本

```bash
alembic downgrade -1
```

### 降级到特定版本

```bash
alembic downgrade <revision_id>
```

### 降级到初始状态

```bash
alembic downgrade base
```

## 📊 查看迁移状态

### 查看当前版本

```bash
alembic current
```

### 查看迁移历史

```bash
alembic history
```

### 查看待执行的迁移

```bash
alembic heads
```

## ⚙️ 常用场景

### 添加新表

```python
def upgrade():
    op.create_table(
        'new_table',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('NOW()')),
    )

def downgrade():
    op.drop_table('new_table')
```

### 添加新列

```python
def upgrade():
    op.add_column('users', sa.Column('bio', sa.String(), nullable=True))

def downgrade():
    op.drop_column('users', 'bio')
```

### 创建索引

```python
def upgrade():
    op.create_index('idx_users_email', 'users', ['email'], unique=True)

def downgrade():
    op.drop_index('idx_users_email', 'users')
```

### 修改列类型

```python
def upgrade():
    op.alter_column('users', 'age', type_=sa.Integer())

def downgrade():
    op.alter_column('users', 'age', type_=sa.String())
```

### 添加外键

```python
def upgrade():
    op.create_foreign_key(
        'fk_posts_author',
        'posts',
        'users',
        ['author_id'],
        ['id']
    )

def downgrade():
    op.drop_constraint('fk_posts_author', 'posts', type_='foreignkey')
```

## 🔧 高级用法

### 使用批量操作（提高性能）

```python
def upgrade():
    with op.batch_alter_table('users') as batch_op:
        batch_op.add_column(sa.Column('new_col', sa.String()))
        batch_op.create_index('idx_users_new_col', ['new_col'])
```

### 条件迁移

```python
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

def upgrade():
    # PostgreSQL 特定操作
    op.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
```

### 数据迁移

```python
from alembic import op
import sqlalchemy as sa

def upgrade():
    # 获取数据库连接
    connection = op.get_bind()

    # 执行 SQL 查询
    result = connection.execute(sa.text("SELECT id FROM users WHERE status = 'active'"))

    # 处理数据
    for row in result:
        # 更新数据
        connection.execute(
            sa.text("UPDATE users SET updated_at = NOW() WHERE id = :id"),
            {'id': row[0]}
        )
```

## 🐛 故障排查

### 迁移失败怎么办

1. 查看错误信息
2. 修复问题
3. 使用 `alembic stamp head` 标记当前状态（如果手动修复了）
4. 重新运行迁移

### 回滚迁移

```bash
# 查看迁移历史
alembic history

# 回滚到指定版本
alembic downgrade <revision_id>
```

### 重置数据库

```bash
# 删除所有表
alembic downgrade base

# 重新创建所有表
alembic upgrade head
```

## 📚 最佳实践

1. **每次变更后立即创建迁移**
   ```bash
   alembic revision --autogenerate -m "描述"
   ```

2. **审查自动生成的迁移**
   - 确保 `upgrade()` 和 `downgrade()` 都正确
   - 添加必要的数据迁移逻辑

3. **在开发环境测试迁移**
   ```bash
   # 备份数据库
   pg_dump cyberpress > backup.sql

   # 运行迁移
   alembic upgrade head

   # 测试回滚
   alembic downgrade -1
   ```

4. **使用有意义的迁移消息**
   ```bash
   # 好的示例
   alembic revision -m "Add user bio and website fields"

   # 不好的示例
   alembic revision -m "update"
   ```

5. **保持迁移的幂等性**
   - 确保迁移可以安全地多次运行
   - 使用 `IF NOT EXISTS` 和 `IF EXISTS`

## 🔗 相关资源

- [Alembic 官方文档](https://alembic.sqlalchemy.org/)
- [SQLAlchemy 文档](https://docs.sqlalchemy.org/)
- [PostgreSQL 文档](https://www.postgresql.org/docs/)

---

**最后更新**: 2026-03-03
**维护者**: CyberPress Team
