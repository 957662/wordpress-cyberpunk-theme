# CyberPress Platform - 数据库安全最佳实践

## 📋 目录
- [访问控制](#访问控制)
- [数据加密](#数据加密)
- [SQL注入防护](#sql注入防护)
- [审计日志](#审计日志)
- [安全配置](#安全配置)
- [漏洞扫描](#漏洞扫描)

---

## 访问控制

### 1. 用户权限管理

#### 创建专用数据库用户

```sql
-- 应用用户（最小权限）
CREATE USER cyberpress_app WITH
    PASSWORD 'strong_password_here'
    LOGIN
    NOSUPERUSER
    NOCREATEDB
    NOCREATEROLE;

-- 只读用户（用于报表和分析）
CREATE USER cyberpress_readonly WITH
    PASSWORD 'readonly_password_here'
    LOGIN
    NOSUPERUSER
    NOCREATEDB
    NOCREATEROLE;

-- 备份用户（仅用于备份）
CREATE USER cyberpress_backup WITH
    PASSWORD 'backup_password_here'
    LOGIN
    NOSUPERUSER
    NOCREATEDB
    NOCREATEROLE;

-- 管理员用户（仅用于管理）
CREATE USER cyberpress_admin WITH
    PASSWORD 'admin_password_here'
    LOGIN
    SUPERUSER
    CREATEDB
    CREATEROLE;
```

#### 授予权限

```sql
-- 应用用户权限
GRANT CONNECT ON DATABASE cyberpress_db TO cyberpress_app;
GRANT USAGE ON SCHEMA public TO cyberpress_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO cyberpress_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO cyberpress_app;

-- 只读用户权限
GRANT CONNECT ON DATABASE cyberpress_db TO cyberpress_readonly;
GRANT USAGE ON SCHEMA public TO cyberpress_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO cyberpress_readonly;

-- 备份用户权限
GRANT CONNECT ON DATABASE cyberpress_db TO cyberpress_backup;
GRANT USAGE ON SCHEMA public TO cyberpress_backup;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO cyberpress_backup;

-- 为新创建的表自动授权
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO cyberpress_app;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT SELECT ON TABLES TO cyberpress_readonly;
```

#### 撤销不必要的权限

```sql
-- 撤销 public 角色的默认权限
REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON DATABASE cyberpress_db FROM PUBLIC;

-- 只授予必要的权限
GRANT USAGE ON SCHEMA public TO PUBLIC;
```

### 2. 连接安全

#### 配置 pg_hba.conf

```
# /etc/postgresql/15/main/pg_hba.conf

# 本地连接（仅 socket）
local   cyberpress_db   cyberpress_app   md5

# 本地回环连接
host    cyberpress_db   cyberpress_app   127.0.0.1/32      md5
host    cyberpress_db   cyberpress_app   ::1/128           md5

# 应用服务器（允许内网连接）
hostssl cyberpress_db   cyberpress_app   192.168.1.0/24    md5
hostssl cyberpress_db   cyberpress_readonly 192.168.1.10/32  md5

# 管理员连接（限制 IP）
host    cyberpress_db   cyberpress_admin   10.0.0.1/32      md5

# 拒绝所有其他连接
host    all             all              0.0.0.0/0        reject
```

#### 强制 SSL 连接

```sql
-- 修改 postgresql.conf
ssl = on
ssl_cert_file = '/etc/ssl/certs/postgresql.crt'
ssl_key_file = '/etc/ssl/private/postgresql.key'
ssl_ca_file = '/etc/ssl/certs/ca.crt'

-- 要求 SSL 连接
ALTER DATABASE cyberpress_db SET sslrequire = on;
```

---

## 数据加密

### 1. 传输加密

#### 配置 SSL/TLS

```bash
# 生成自签名证书（用于开发）
openssl req -new -x509 -days 365 -nodes \
    -out /etc/ssl/certs/postgresql.crt \
    -keyout /etc/ssl/private/postgresql.key

# 设置权限
chmod 600 /etc/ssl/private/postgresql.key
chown postgres:postgres /etc/ssl/private/postgresql.key

# 重启 PostgreSQL
systemctl restart postgresql
```

#### 客户端 SSL 配置

```python
# Python (psycopg2)
import psycopg2

conn = psycopg2.connect(
    host="localhost",
    database="cyberpress_db",
    user="cyberpress_app",
    password="your_password",
    sslmode="require",  # require, verify-ca, verify-full
    sslrootcert="/etc/ssl/certs/ca.crt"
)
```

### 2. 静态加密

#### 使用 pgcrypto 扩展

```sql
-- 启用 pgcrypto 扩展
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 加密函数
CREATE OR REPLACE FUNCTION encrypt_data(data TEXT, key TEXT)
RETURNS BYTEA AS $$
BEGIN
    RETURN pgp_sym_encrypt(data, key);
END;
$$ LANGUAGE plpgsql;

-- 解密函数
CREATE OR REPLACE FUNCTION decrypt_data(data BYTEA, key TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN pgp_sym_decrypt(data, key);
END;
$$ LANGUAGE plpgsql;

-- 示例：加密敏感列
-- ALTER TABLE users ADD COLUMN email_encrypted BYTEA;
-- UPDATE users SET email_encrypted = encrypt_data(email, 'encryption_key');
-- ALTER TABLE users DROP COLUMN email;
```

### 3. 密码哈希

#### 使用 bcrypt

```sql
-- 安装 pgcrypto 扩展
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 密码哈希函数（使用 crypt）
CREATE OR REPLACE FUNCTION hash_password(password TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN encode(
        crypt(
            password::bytea,
            gen_salt('bf', 10)  -- bcrypt，10轮
        ),
        'base64'
    );
END;
$$ LANGUAGE plpgsql;

-- 密码验证函数
CREATE OR REPLACE FUNCTION verify_password(password TEXT, hash TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        digest(password::bytea, 'sha256') =
        decode(hash, 'base64')
    );
END;
$$ LANGUAGE plpgsql;

-- 更好的密码验证（使用 crypt）
CREATE OR REPLACE FUNCTION verify_bcrypt_password(password TEXT, hash TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        crypt(password, decode(hash, 'base64')::text) =
        decode(hash, 'base64')::text
    );
END;
$$ LANGUAGE plpgsql;
```

---

## SQL注入防护

### 1. 参数化查询

#### Python (psycopg2)

```python
# ❌ 不安全：字符串拼接
cursor.execute(f"SELECT * FROM users WHERE email = '{email}'")

# ✅ 安全：参数化查询
cursor.execute("SELECT * FROM users WHERE email = %s", (email,))

# ✅ 安全：使用命名参数
cursor.execute(
    "SELECT * FROM posts WHERE author_id = %(author_id)s AND status = %(status)s",
    {"author_id": user_id, "status": "published"}
)
```

#### Python (SQLAlchemy)

```python
# ❌ 不安全
query = text(f"SELECT * FROM posts WHERE id = {post_id}")

# ✅ 安全：使用绑定参数
query = text("SELECT * FROM posts WHERE id = :post_id")
result = session.execute(query, {"post_id": post_id})

# ✅ 安全：使用 ORM
post = session.query(Post).filter_by(id=post_id).first()
```

### 2. 输入验证

```python
# 验证邮箱格式
import re

def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(pattern, email):
        raise ValueError("Invalid email format")
    return email

# 验证 UUID
from uuid import UUID

def validate_uuid(uuid_str):
    try:
        return UUID(uuid_str)
    except ValueError:
        raise ValueError("Invalid UUID format")

# 使用
try:
    email = validate_email(request.json['email'])
    uuid = validate_uuid(request.json['user_id'])
    # 执行查询
except ValueError as e:
    return {"error": str(e)}, 400
```

### 3. 最小权限原则

```sql
-- 创建只读视图限制访问
CREATE VIEW user_public_info AS
SELECT
    id,
    name,
    avatar_url,
    bio,
    created_at
FROM users;

-- 授予视图权限
GRANT SELECT ON user_public_info TO cyberpress_app;

-- 使用视图代替表
-- SELECT * FROM user_public_info WHERE id = ?;
```

---

## 审计日志

### 1. 启用 PostgreSQL 审计

#### 配置 logging

```
# /etc/postgresql/15/main/postgresql.conf

# 启用日志
logging_collector = on
log_directory = '/var/log/postgresql'
log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'
log_rotation_age = 1d
log_rotation_size = 100MB

# 记录所有 SQL
log_statement = all  # none, ddl, mod, all
log_duration = on
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '

# 记录慢查询
log_min_duration_statement = 1000  # 毫秒
```

### 2. 创建审计表

```sql
-- 审计日志表
CREATE TABLE audit_log (
    id BIGSERIAL PRIMARY KEY,
    table_name VARCHAR(255) NOT NULL,
    operation VARCHAR(10) NOT NULL,  -- INSERT, UPDATE, DELETE
    old_data JSONB,
    new_data JSONB,
    changed_by UUID REFERENCES users(id),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT
);

-- 创建索引
CREATE INDEX idx_audit_log_table ON audit_log(table_name, changed_at DESC);
CREATE INDEX idx_audit_log_operation ON audit_log(operation, changed_at DESC);
CREATE INDEX idx_audit_log_user ON audit_log(changed_by, changed_at DESC);
```

### 3. 审计触发器

```sql
-- 通用的审计触发器函数
CREATE OR REPLACE FUNCTION audit_trigger_func()
RETURNS TRIGGER AS $$
DECLARE
    old_data JSONB;
    new_data JSONB;
    user_id UUID;
BEGIN
    -- 获取当前用户 ID（从应用设置）
    user_id := current_setting('app.current_user_id', true)::UUID;

    IF TG_OP = 'DELETE' THEN
        old_data := to_jsonb(OLD);
        new_data := NULL;
    ELSIF TG_OP = 'UPDATE' THEN
        old_data := to_jsonb(OLD);
        new_data := to_jsonb(NEW);
    ELSIF TG_OP = 'INSERT' THEN
        old_data := NULL;
        new_data := to_jsonb(NEW);
    END IF;

    -- 插入审计记录
    INSERT INTO audit_log (
        table_name,
        operation,
        old_data,
        new_data,
        changed_by
    ) VALUES (
        TG_TABLE_NAME,
        TG_OP,
        old_data,
        new_data,
        user_id
    );

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 为敏感表添加审计触发器
CREATE TRIGGER audit_users
AFTER INSERT OR UPDATE OR DELETE ON users
FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

CREATE TRIGGER audit_posts
AFTER INSERT OR UPDATE OR DELETE ON posts
FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

CREATE TRIGGER audit_comments
AFTER INSERT OR UPDATE OR DELETE ON comments
FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
```

### 4. 应用层设置用户上下文

```python
# 在每个请求开始时设置当前用户
@app.middleware("http")
async def set_user_context(request: Request, call_next):
    # 获取当前用户 ID
    user_id = get_current_user_id(request)

    # 设置 PostgreSQL 会话变量
    async with db.pool.acquire() as conn:
        await conn.execute(f"SET LOCAL app.current_user_id = '{user_id}'")

    response = await call_next(request)
    return response
```

---

## 安全配置

### 1. postgresql.conf 安全设置

```
# /etc/postgresql/15/main/postgresql.conf

# 连接安全
listen_addresses = '192.168.1.10'  # 绑定到特定 IP
port = 5432
max_connections = 100

# SSL/TLS
ssl = on
ssl_protocols = 'TLSv1.2,TLSv1.3'
ssl_ciphers = 'HIGH:!aNULL'
ssl_min_protocol_version = 'TLSv1.2'

# 认证
password_encryption = scram-sha-256

# 内存限制（防止 DoS）
shared_buffers = 256MB
work_mem = 4MB
maintenance_work_mem = 64MB

# 日志
log_connections = on
log_disconnections = on
log_lock_waits = on

# 性能监控
# shared_preload_libraries = 'pg_stat_statements'
```

### 2. 网络安全

#### 防火墙配置

```bash
# UFW 配置
ufw allow from 192.168.1.0/24 to any port 5432
ufw deny 5432  # 拒绝其他连接

# iptables 配置
iptables -A INPUT -p tcp --dport 5432 -s 192.168.1.0/24 -j ACCEPT
iptables -A INPUT -p tcp --dport 5432 -j DROP
```

### 3. 数据脱敏

```sql
-- 创建脱敏视图
CREATE VIEW users_masked AS
SELECT
    id,
    name,
    -- 脱敏邮箱
    SUBSTRING(email, 1, 2) || '****' || SUBSTRING(email FROM '@') as email,
    -- 脱敏电话
    CASE WHEN phone IS NOT NULL THEN
        SUBSTRING(phone, 1, 3) || '****' || SUBSTRING(phone FROM '.{4}$')
    ELSE NULL END as phone,
    avatar_url,
    created_at
FROM users;

-- 授予脱敏视图权限
GRANT SELECT ON users_masked TO cyberpress_readonly;
```

---

## 漏洞扫描

### 1. 定期安全扫描

```bash
#!/bin/bash
# File: /usr/local/bin/security-scan.sh

# 扫描 PostgreSQL 配置
echo "检查 PostgreSQL 配置..."

# 检查默认密码
echo "检查默认密码..."
psql -U postgres -c "SELECT usename FROM pg_shadow WHERE passwd IS NULL;"

# 检查超级用户
echo "检查超级用户..."
psql -U postgres -c "SELECT usename FROM pg_shadow WHERE usesuper = true;"

# 检查权限过大的用户
echo "检查权限..."
psql -U postgres -c "SELECT * FROM pg_user WHERE usesuper = false AND usecreatedb = true;"

# 检查公网可访问的表
echo "检查公网权限..."
psql -U postgres -c "SELECT grantee, table_name FROM information_schema.role_table_grants WHERE grantee = 'PUBLIC';"

# 检查弱密码策略
echo "检查密码策略..."
psql -U postgres -c "SELECT * FROM pg_shadow WHERE passwd NOT LIKE 'SCRAM-SHA-256%';"

# 检查未加密的连接
echo "检查 SSL 配置..."
psql -U postgres -c "SHOW ssl;"
```

### 2. 使用扫描工具

```bash
# 使用 nmap 扫描数据库端口
nmap -sV -p 5432 localhost

# 使用 postgresql-audit-tool
# https://github.com/languitar/postgresql-audit-tool

# 使用 pgBadger 分析日志
pgbadger /var/log/postgresql/*.log -o report.html
```

### 3. 安全检查清单

```sql
-- 创建安全检查视图
CREATE OR REPLACE VIEW security_checklist AS
SELECT
    'default_passwords' as check_item,
    CASE WHEN EXISTS (SELECT 1 FROM pg_shadow WHERE passwd IS NULL)
        THEN 'FAILED' ELSE 'PASSED' END as status
UNION ALL
SELECT
    'public_schema_permissions',
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.role_table_grants WHERE grantee = 'PUBLIC')
        THEN 'FAILED' ELSE 'PASSED' END
UNION ALL
SELECT
    'ssl_enabled',
    CASE WHEN (SELECT setting FROM pg_settings WHERE name = 'ssl')::boolean
        THEN 'PASSED' ELSE 'FAILED' END
UNION ALL
SELECT
    'log_connections',
    CASE WHEN (SELECT setting FROM pg_settings WHERE name = 'log_connections')::boolean
        THEN 'PASSED' ELSE 'FAILED' END
UNION ALL
SELECT
    'superuser_count',
    CASE WHEN (SELECT COUNT(*) FROM pg_shadow WHERE usesuper = true) <= 2
        THEN 'PASSED' ELSE 'WARNING' END;

-- 执行检查
SELECT * FROM security_checklist;
```

---

## 安全检查清单

### 日常检查

- [ ] 检查异常登录记录
- [ ] 检查慢查询日志
- [ ] 监控数据库连接数
- [ ] 检查磁盘空间使用
- [ ] 验证备份完整性

### 每周检查

- [ ] 审查用户权限
- [ ] 检查审计日志
- [ ] 更新安全补丁
- [ ] 测试恢复流程
- [ ] 审查访问控制

### 每月检查

- [ ] 完整安全扫描
- [ ] 密码策略审查
- [ ] SSL 证书检查
- [ ] 性能优化分析
- [ ] 灾难恢复演练

---

## 总结

数据库安全是一个持续的过程，需要：

1. **最小权限**: 只授予必要的权限
2. **加密传输**: 使用 SSL/TLS
3. **加密存储**: 敏感数据加密
4. **审计日志**: 记录所有操作
5. **定期扫描**: 发现潜在漏洞
6. **及时更新**: 安装安全补丁
7. **备份保护**: 加密备份文件
8. **监控告警**: 异常行为告警

记住：安全是三分技术，七分管理！
