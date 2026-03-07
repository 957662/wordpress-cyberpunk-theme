-- ================================================================
-- CyberPress Platform - PostgreSQL 初始化脚本
-- 数据库初始化和基础数据
-- ================================================================
--
-- 功能：
-- 1. 创建数据库和用户
-- 2. 配置权限
-- 3. 初始化基础数据
--
-- 使用方法：
-- psql -U postgres -d postgres -f 01-init-database.sql
--
-- 作者：Claude (Database Architect)
-- 创建时间：2026-03-08
-- 版本：1.0.0
-- ================================================================

-- ================================================================
-- 第一步：创建数据库和用户
-- ================================================================

-- 创建数据库用户（如果不存在）
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'cyberpress_user') THEN
    CREATE ROLE cyberpress_user WITH LOGIN PASSWORD 'change_me_password_123';
  END IF;
END
$$;

-- 创建数据库（如果不存在）
SELECT 'CREATE DATABASE cyberpress_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'cyberpress_db')
\gexec

-- 或者使用以下方式（PostgreSQL 13+）
-- CREATE DATABASE cyberpress_db IF NOT EXISTS
--   OWNER cyberpress_user
--   ENCODING 'UTF8'
--   LC_COLLATE = 'en_US.UTF-8'
--   LC_CTYPE = 'en_US.UTF-8'
--   TEMPLATE template0;

-- 连接到新创建的数据库
\c cyberpress_db;

-- 授予用户权限
GRANT ALL PRIVILEGES ON DATABASE cyberpress_db TO cyberpress_user;
GRANT ALL PRIVILEGES ON SCHEMA public TO cyberpress_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO cyberpress_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO cyberpress_user;

-- ================================================================
-- 第二步：启用必要的扩展
-- ================================================================

-- UUID 生成
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 全文搜索和模糊搜索
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 复合索引
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- ================================================================
-- 第三步：创建基础配置函数
-- ================================================================

-- 创建更新时间戳的函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ================================================================
-- 第四步：插入初始配置数据
-- ================================================================

-- 注意：此时表还未创建，这些数据将在执行 architecture.sql 后插入
-- 这里只是作为参考，实际插入在架构脚本中完成

-- ================================================================
-- 第五步：创建备份函数
-- ================================================================

-- 备份单表
CREATE OR REPLACE FUNCTION backup_table(table_name TEXT)
RETURNS TEXT AS $$
DECLARE
  backup_name TEXT;
  result TEXT;
BEGIN
  backup_name := table_name || '_backup_' || to_char(CURRENT_TIMESTAMP, 'YYYYMMDD_HH24MISS');

  EXECUTE format('CREATE TABLE %I AS SELECT * FROM %I', backup_name, table_name);

  result := 'Table ' || table_name || ' backed up to ' || backup_name;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ================================================================
-- 第六步：创建监控视图
-- ================================================================

-- 数据库大小统计
CREATE OR REPLACE VIEW db_size_stats AS
SELECT
  pg_database.datname as database_name,
  pg_size_pretty(pg_database_size(pg_database.datname)) as size_pretty,
  pg_database_size(pg_database.datname) as size_bytes
FROM pg_database
ORDER BY pg_database_size(pg_database.datname) DESC;

-- 表大小统计
CREATE OR REPLACE VIEW table_size_stats AS
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
  pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS index_size
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- 索引使用统计
CREATE OR REPLACE VIEW index_usage_stats AS
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan as index_scans,
  idx_tup_read as tuples_read,
  idx_tup_fetch as tuples_fetched,
  pg_size_pretty(pg_relation_size(indexrelid)) as index_size
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- 慢查询统计
CREATE OR REPLACE VIEW slow_query_stats AS
SELECT
  datname as database_name,
  usename as username,
  application_name,
  state,
  query_start,
  state_change,
  waiting,
  query
FROM pg_stat_activity
WHERE state != 'idle'
  AND query_start < NOW() - INTERVAL '5 seconds'
ORDER BY query_start;

-- ================================================================
-- 第七步：创建维护函数
-- ================================================================

-- 清理死元组
CREATE OR REPLACE FUNCTION vacuum_table(table_name TEXT)
RETURNS TEXT AS $$
BEGIN
  EXECUTE format('VACUUM ANALYZE %I', table_name);
  RETURN 'Table ' || table_name || ' vacuumed and analyzed';
END;
$$ LANGUAGE plpgsql;

-- 重建索引
CREATE OR REPLACE FUNCTION reindex_table(table_name TEXT)
RETURNS TEXT AS $$
BEGIN
  EXECUTE format('REINDEX TABLE %I', table_name);
  RETURN 'Table ' || table_name || ' indexes rebuilt';
END;
$$ LANGUAGE plpgsql;

-- 分析表
CREATE OR REPLACE FUNCTION analyze_table(table_name TEXT)
RETURNS TEXT AS $$
BEGIN
  EXECUTE format('ANALYZE %I', table_name);
  RETURN 'Table ' || table_name || ' analyzed';
END;
$$ LANGUAGE plpgsql;

-- ================================================================
-- 第八步：创建健康检查函数
-- ================================================================

-- 数据库健康检查
CREATE OR REPLACE FUNCTION database_health_check()
RETURNS TABLE(
  check_type TEXT,
  check_result TEXT,
  status TEXT
) AS $$
BEGIN
  -- 检查数据库连接
  RETURN QUERY
  SELECT
    'database_connection'::TEXT as check_type,
    'OK'::TEXT as check_result,
    'healthy'::TEXT as status;

  -- 检查磁盘空间
  RETURN QUERY
  SELECT
    'disk_space'::TEXT as check_type,
    pg_size_pretty(pg_database_size('cyberpress_db')) as check_result,
    CASE
      WHEN pg_database_size('cyberpress_db') > 10 * 1024 * 1024 * 1024 THEN 'warning'
      ELSE 'healthy'
    END as status;

  -- 检查表膨胀
  RETURN QUERY
  SELECT
    'table_bloat'::TEXT as check_type,
    COUNT(*)::TEXT as check_result,
    CASE
      WHEN COUNT(*) > 0 THEN 'warning'
      ELSE 'healthy'
    END as status
  FROM pg_stat_user_tables
  WHERE n_dead_tup > 1000;

  -- 检查慢查询
  RETURN QUERY
  SELECT
    'slow_queries'::TEXT as check_type,
    COUNT(*)::TEXT as check_result,
    CASE
      WHEN COUNT(*) > 5 THEN 'warning'
      ELSE 'healthy'
    END as status
  FROM pg_stat_activity
  WHERE state != 'idle'
    AND query_start < NOW() - INTERVAL '5 seconds';
END;
$$ LANGUAGE plpgsql;

-- ================================================================
-- 第九步：配置说明输出
-- ================================================================

DO $$
BEGIN
  RAISE NOTICE '================================================================';
  RAISE NOTICE 'CyberPress Platform - 数据库初始化完成！';
  RAISE NOTICE '================================================================';
  RAISE NOTICE '';
  RAISE NOTICE '数据库信息:';
  RAISE NOTICE '  - 数据库名: cyberpress_db';
  RAISE NOTICE '  - 用户名: cyberpress_user';
  RAISE NOTICE '  - 密码: change_me_password_123 (请及时修改!)';
  RAISE NOTICE '';
  RAISE NOTICE '下一步:';
  RAISE NOTICE '  1. 修改默认密码:';
  RAISE NOTICE '     ALTER USER cyberpress_user WITH PASSWORD ''your_secure_password'';';
  RAISE NOTICE '';
  RAISE NOTICE '  2. 执行架构脚本:';
  RAISE NOTICE '     psql -U cyberpress_user -d cyberpress_db -f architecture.sql';
  RAISE NOTICE '';
  RAISE NOTICE '  3. (可选) 执行种子数据脚本:';
  RAISE NOTICE '     psql -U cyberpress_user -d cyberpress_db -f seed-data.sql';
  RAISE NOTICE '';
  RAISE NOTICE '安全建议:';
  RAISE NOTICE '  - 修改默认密码';
  RAISE NOTICE '  - 限制数据库访问IP';
  RAISE NOTICE '  - 定期备份数据库';
  RAISE NOTICE '  - 启用SSL连接（生产环境）';
  RAISE NOTICE '';
  RAISE NOTICE '================================================================';
END
$$;

-- ================================================================
-- 完成
-- ================================================================

-- 显示数据库列表
\l

-- 显示当前连接信息
SELECT
  current_database() as database_name,
  current_user as user_name,
  version() as postgresql_version;

-- 显示扩展
SELECT extname as extension_name, extversion as version
FROM pg_extension
WHERE extname NOT IN ('plpgsql')
ORDER BY extname;

-- ================================================================
-- 脚本结束
-- ================================================================
