-- ============================================================================
-- CyberPress Platform - Database Drop Script
-- PostgreSQL Database Schema v1.0
-- ============================================================================
-- 说明: 删除所有表、视图、函数等（谨慎使用！）
-- 作者: CyberPress Team
-- 创建日期: 2026-03-05
-- 警告: 此脚本将删除所有数据！仅在开发环境使用！
-- ============================================================================

-- 设置搜索路径
SET search_path TO public, pg_catalog;

-- ============================================================================
-- 警告提示
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '==========================================';
    RAISE NOTICE '警告：此脚本将删除所有表和数据！';
    RAISE NOTICE '==========================================';
    RAISE NOTICE '如果要在生产环境运行，请确认你真的想这么做！';
    RAISE NOTICE '建议：使用 DROP CASCADE 删除所有相关对象';
    RAISE NOTICE '==========================================';
END $$;

-- ============================================================================
-- 1. 删除视图
-- ============================================================================

DROP VIEW IF EXISTS index_usage_stats CASCADE;
DROP VIEW IF EXISTS index_size_stats CASCADE;

-- ============================================================================
-- 2. 删除扩展（如果需要）
-- ============================================================================

-- DROP EXTENSION IF EXISTS "uuid-ossp" CASCADE;
-- DROP EXTENSION IF EXISTS "pg_trgm" CASCADE;

-- ============================================================================
-- 3. 删除表（按依赖关系顺序）
-- ============================================================================

-- 分析和性能表
DROP TABLE IF EXISTS error_logs CASCADE;
DROP TABLE IF EXISTS system_metrics CASCADE;
DROP TABLE IF EXISTS query_performance CASCADE;
DROP TABLE IF EXISTS api_performance CASCADE;
DROP TABLE IF EXISTS user_statistics CASCADE;
DROP TABLE IF EXISTS post_statistics CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS page_views CASCADE;
DROP TABLE IF EXISTS page_views_2026_03 CASCADE;
DROP TABLE IF EXISTS page_views_2026_04 CASCADE;
DROP TABLE IF EXISTS page_views_2026_05 CASCADE;
DROP TABLE IF EXISTS analytics_events CASCADE;
DROP TABLE IF EXISTS search_queries CASCADE;
DROP TABLE IF EXISTS ab_test_participants CASCADE;
DROP TABLE IF EXISTS ab_tests CASCADE;

-- 消息系统
DROP TABLE IF EXISTS message_read_status CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversation_participants CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;

-- 书签
DROP TABLE IF EXISTS bookmarks CASCADE;

-- 互动历史
DROP TABLE IF EXISTS user_interactions CASCADE;

-- 通知系统
DROP TABLE IF EXISTS notification_preferences CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;

-- 动态系统
DROP TABLE IF EXISTS activity_likes CASCADE;
DROP TABLE IF EXISTS activity_comments CASCADE;
DROP TABLE IF EXISTS activities CASCADE;

-- 关注系统
DROP TABLE IF EXISTS follow_requests CASCADE;
DROP TABLE IF EXISTS user_follows CASCADE;

-- 评论系统
DROP TABLE IF EXISTS comment_likes CASCADE;
DROP TABLE IF EXISTS comments CASCADE;

-- 媒体系统
DROP TABLE IF EXISTS media CASCADE;

-- 内容管理
DROP TABLE IF EXISTS post_tags CASCADE;
DROP TABLE IF EXISTS post_categories CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS post_meta CASCADE;
DROP TABLE IF EXISTS posts CASCADE;

-- 用户系统
DROP TABLE IF EXISTS user_settings CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 认证授权
DROP TABLE IF EXISTS user_permissions_cache CASCADE;
DROP TABLE IF EXISTS active_sessions CASCADE;
DROP TABLE IF EXISTS password_history CASCADE;
DROP TABLE IF EXISTS password_reset_tokens CASCADE;
DROP TABLE IF EXISTS two_factor_attempts CASCADE;
DROP TABLE IF EXISTS two_factor_auth CASCADE;
DROP TABLE IF EXISTS login_history CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS role_permissions CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS refresh_tokens CASCADE;
DROP TABLE IF EXISTS api_tokens CASCADE;
DROP TABLE IF EXISTS authorization_codes CASCADE;

-- ============================================================================
-- 4. 删除触发器函数
-- ============================================================================

DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- ============================================================================
-- 5. 删除枚举类型（如果有）
-- ============================================================================

-- DROP TYPE IF EXISTS user_role_enum CASCADE;
-- DROP TYPE IF EXISTS post_status_enum CASCADE;

-- ============================================================================
-- 6. 删除序列（如果需要）
-- ============================================================================

-- 通常序列会随表一起删除，但如果有独立序列需要手动删除

-- ============================================================================
-- 完成
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '==========================================';
    RAISE NOTICE '所有表和对象已删除';
    RAISE NOTICE '现在可以重新创建数据库结构';
    RAISE NOTICE '==========================================';
END $$;

-- ============================================================================
-- 验证删除结果
-- ============================================================================

-- 查看剩余的表
SELECT
    tablename,
    tableowner
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- 查看剩余的序列
SELECT
    sequencename
FROM pg_sequences
WHERE schemaname = 'public'
ORDER BY sequencename;

-- 查看剩余的函数
SELECT
    proname
FROM pg_proc
WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
ORDER BY proname;
