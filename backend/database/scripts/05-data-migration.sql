-- ============================================================================
-- CyberPress Platform - PostgreSQL 数据迁移脚本
-- ============================================================================
-- 功能：数据库版本管理、数据迁移、结构升级
-- 版本：1.0.0
-- 创建日期：2026-03-06
-- ============================================================================

-- 设置搜索路径
SET search_path TO public;

-- ============================================================================
-- 迁移版本管理表
-- ============================================================================

-- 创建迁移历史表
CREATE TABLE IF NOT EXISTS schema_migrations (
    id BIGSERIAL PRIMARY KEY,
    version VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    execution_time_ms INTEGER,
    checksum VARCHAR(64)
);

-- 创建迁移锁定表（防止并发迁移）
CREATE TABLE IF NOT EXISTS schema_migration_locks (
    id BIGSERIAL PRIMARY KEY,
    locked BOOLEAN NOT NULL DEFAULT FALSE,
    locked_at TIMESTAMP,
    locked_by VARCHAR(255),
    session_id VARCHAR(255)
);

-- 插入初始迁移记录
INSERT INTO schema_migrations (version, description)
VALUES ('001_initial_schema', 'Initial database schema')
ON CONFLICT (version) DO NOTHING;

-- ============================================================================
-- 迁移辅助函数
-- ============================================================================

-- 检查迁移是否已应用
CREATE OR REPLACE FUNCTION is_migration_applied(p_version VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM schema_migrations
        WHERE version = p_version
    );
END;
$$ LANGUAGE plpgsql;

-- 记录迁移
CREATE OR REPLACE FUNCTION record_migration(
    p_version VARCHAR,
    p_description TEXT,
    p_execution_time_ms INTEGER
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO schema_migrations (version, description, applied_at, execution_time_ms)
    VALUES (p_version, p_description, CURRENT_TIMESTAMP, p_execution_time_ms);
END;
$$ LANGUAGE plpgsql;

-- 获取当前数据库版本
CREATE OR REPLACE FUNCTION get_current_version()
RETURNS VARCHAR AS $$
DECLARE
    v_version VARCHAR;
BEGIN
    SELECT version INTO v_version
    FROM schema_migrations
    ORDER BY applied_at DESC
    LIMIT 1;

    IF v_version IS NULL THEN
        RETURN '000_init';
    END IF;

    RETURN v_version;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 迁移脚本
-- ============================================================================

-- ============================================================================
-- 迁移 002: 添加全文搜索优化
-- ============================================================================
-- 版本: 002
-- 描述: 为文章和评论添加全文搜索索引
-- 依赖: 001_initial_schema
-- ============================================================================

DO $$
BEGIN
    -- 检查迁移是否已应用
    IF is_migration_applied('002_fulltext_search') THEN
        RAISE NOTICE 'Migration 002_fulltext_search already applied, skipping...';
        RETURN;
    END IF;

    RAISE NOTICE 'Applying migration 002_fulltext_search...';

    -- 创建全文搜索索引
    CREATE INDEX IF NOT EXISTS idx_posts_title_search
        ON posts USING gin(to_tsvector('english', coalesce(title, '')));

    CREATE INDEX IF NOT EXISTS idx_posts_content_search
        ON posts USING gin(to_tsvector('english', coalesce(content, '')));

    CREATE INDEX IF NOT EXISTS idx_comments_content_search
        ON comments USING gin(to_tsvector('english', coalesce(content, '')));

    -- 记录迁移
    INSERT INTO schema_migrations (version, description, applied_at)
    VALUES ('002_fulltext_search', 'Add full-text search indexes', CURRENT_TIMESTAMP);

    RAISE NOTICE 'Migration 002_fulltext_search applied successfully!';
END $$;

-- ============================================================================
-- 迁移 003: 添加用户偏好设置表
-- ============================================================================
-- 版本: 003
-- 描述: 创建用户偏好设置表，用于存储用户个性化配置
-- 依赖: 001_initial_schema
-- ============================================================================

DO $$
BEGIN
    -- 检查迁移是否已应用
    IF is_migration_applied('003_user_preferences') THEN
        RAISE NOTICE 'Migration 003_user_preferences already applied, skipping...';
        RETURN;
    END IF;

    RAISE NOTICE 'Applying migration 003_user_preferences...';

    -- 创建用户偏好设置表
    CREATE TABLE IF NOT EXISTS user_preferences (
        id BIGSERIAL PRIMARY KEY,
        user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        preferences_key VARCHAR(100) NOT NULL,
        preferences_value JSONB NOT NULL DEFAULT '{}'::jsonb,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, preferences_key)
    );

    -- 创建索引
    CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id
        ON user_preferences(user_id);

    -- 插入默认偏好设置
    INSERT INTO user_preferences (user_id, preferences_key, preferences_value)
    SELECT
        id,
        'general',
        '{
            "theme": "dark",
            "language": "en",
            "notifications_enabled": true,
            "email_notifications": true
        }'::jsonb
    FROM users
    ON CONFLICT (user_id, preferences_key) DO NOTHING;

    -- 记录迁移
    INSERT INTO schema_migrations (version, description, applied_at)
    VALUES ('003_user_preferences', 'Add user preferences table', CURRENT_TIMESTAMP);

    RAISE NOTICE 'Migration 003_user_preferences applied successfully!';
END $$;

-- ============================================================================
-- 迁移 004: 添加性能监控表
-- ============================================================================
-- 版本: 004
-- 描述: 创建性能监控表，用于跟踪查询性能和系统指标
-- 依赖: 001_initial_schema
-- ============================================================================

DO $$
BEGIN
    -- 检查迁移是否已应用
    IF is_migration_applied('004_performance_monitoring') THEN
        RAISE NOTICE 'Migration 004_performance_monitoring already applied, skipping...';
        RETURN;
    END IF;

    RAISE NOTICE 'Applying migration 004_performance_monitoring...';

    -- 创建查询性能日志表
    CREATE TABLE IF NOT EXISTS query_performance_logs (
        id BIGSERIAL PRIMARY KEY,
        query_id VARCHAR(255),
        query_text TEXT,
        execution_time_ms INTEGER,
        rows_affected INTEGER,
        memory_used_mb NUMERIC(10,2),
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    -- 创建系统指标表
    CREATE TABLE IF NOT EXISTS system_metrics (
        id BIGSERIAL PRIMARY KEY,
        metric_name VARCHAR(100) NOT NULL,
        metric_value NUMERIC(20,4),
        metric_unit VARCHAR(50),
        dimensions JSONB DEFAULT '{}'::jsonb,
        recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    -- 创建索引
    CREATE INDEX IF NOT EXISTS idx_query_performance_logs_created_at
        ON query_performance_logs(created_at DESC);

    CREATE INDEX IF NOT EXISTS idx_system_metrics_metric_name
        ON system_metrics(metric_name, recorded_at DESC);

    -- 记录迁移
    INSERT INTO schema_migrations (version, description, applied_at)
    VALUES ('004_performance_monitoring', 'Add performance monitoring tables', CURRENT_TIMESTAMP);

    RAISE NOTICE 'Migration 004_performance_monitoring applied successfully!';
END $$;

-- ============================================================================
-- 迁移 005: 优化文章表结构
-- ============================================================================
-- 版本: 005
-- 描述: 优化文章表，添加更多元数据字段和索引
-- 依赖: 001_initial_schema
-- ============================================================================

DO $$
BEGIN
    -- 检查迁移是否已应用
    IF is_migration_applied('005_optimize_posts_table') THEN
        RAISE NOTICE 'Migration 005_optimize_posts_table already applied, skipping...';
        RETURN;
    END IF;

    RAISE NOTICE 'Applying migration 005_optimize_posts_table...';

    -- 添加新列（如果不存在）
    ALTER TABLE posts
        ADD COLUMN IF NOT EXISTS reading_time_minutes INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS difficulty_level VARCHAR(20) DEFAULT 'beginner',
        ADD COLUMN IF NOT EXISTS is_sticky BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS last_modified_at TIMESTAMP,
        ADD COLUMN IF NOT EXISTS template VARCHAR(50) DEFAULT 'default';

    -- 添加约束
    ALTER TABLE posts
        ADD CONSTRAINT IF NOT EXISTS check_difficulty_level
        CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced'));

    -- 创建索引
    CREATE INDEX IF NOT EXISTS idx_posts_difficulty_level
        ON posts(difficulty_level);

    CREATE INDEX IF NOT EXISTS idx_posts_is_sticky
        ON posts(is_sticky) WHERE is_sticky = TRUE;

    CREATE INDEX IF NOT EXISTS idx_posts_reading_time
        ON posts(reading_time_minutes);

    -- 更新阅读时间（基于内容长度）
    UPDATE posts
    SET reading_time_minutes = CEIL(LENGTH(content) / 200.0)
    WHERE content IS NOT NULL AND reading_time_minutes = 0;

    -- 记录迁移
    INSERT INTO schema_migrations (version, description, applied_at)
    VALUES ('005_optimize_posts_table', 'Optimize posts table structure', CURRENT_TIMESTAMP);

    RAISE NOTICE 'Migration 005_optimize_posts_table applied successfully!';
END $$;

-- ============================================================================
-- 迁移 006: 添加活动日志表
-- ============================================================================
-- 版本: 006
-- 描述: 创建活动日志表，用于审计和用户行为跟踪
-- 依赖: 001_initial_schema
-- ============================================================================

DO $$
BEGIN
    -- 检查迁移是否已应用
    IF is_migration_applied('006_activity_logs') THEN
        RAISE NOTICE 'Migration 006_activity_logs already applied, skipping...';
        RETURN;
    END IF;

    RAISE NOTICE 'Applying migration 006_activity_logs...';

    -- 创建活动日志表
    CREATE TABLE IF NOT EXISTS activity_logs (
        id BIGSERIAL PRIMARY KEY,
        user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
        action VARCHAR(100) NOT NULL,
        entity_type VARCHAR(50),
        entity_id BIGINT,
        ip_address INET,
        user_agent TEXT,
        metadata JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    -- 创建索引
    CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id
        ON activity_logs(user_id, created_at DESC);

    CREATE INDEX IF NOT EXISTS idx_activity_logs_action
        ON activity_logs(action, created_at DESC);

    CREATE INDEX IF NOT EXISTS idx_activity_logs_entity
        ON activity_logs(entity_type, entity_id);

    CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at
        ON activity_logs(created_at DESC);

    -- 创建分区（可选，用于大型部署）
    -- CREATE TABLE activity_logs_y2024m03 PARTITION OF activity_logs
    --     FOR VALUES FROM ('2024-03-01') TO ('2024-04-01');

    -- 记录迁移
    INSERT INTO schema_migrations (version, description, applied_at)
    VALUES ('006_activity_logs', 'Add activity logs table', CURRENT_TIMESTAMP);

    RAISE NOTICE 'Migration 006_activity_logs applied successfully!';
END $$;

-- ============================================================================
-- 迁移 007: 添加评论优化
-- ============================================================================
-- 版本: 007
-- 描述: 优化评论系统，添加嵌套评论和投票功能
-- 依赖: 001_initial_schema
-- ============================================================================

DO $$
BEGIN
    -- 检查迁移是否已应用
    IF is_migration_applied('007_comment_optimizations') THEN
        RAISE NOTICE 'Migration 007_comment_optimizations already applied, skipping...';
        RETURN;
    END IF;

    RAISE NOTICE 'Applying migration 007_comment_optimizations...';

    -- 添加新列
    ALTER TABLE comments
        ADD COLUMN IF NOT EXISTS path VARCHAR(1000) DEFAULT '',
        ADD COLUMN IF NOT EXISTS depth INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS score INTEGER DEFAULT 0;

    -- 更新现有评论的路径和深度
    WITH RECURSIVE comment_tree AS (
        -- 基础查询：顶级评论
        SELECT
            id,
            parent_id,
            id::TEXT as path,
            0 as depth
        FROM comments
        WHERE parent_id IS NULL

        UNION ALL

        -- 递归查询：子评论
        SELECT
            c.id,
            c.parent_id,
            ct.path || '/' || c.id::TEXT,
            ct.depth + 1
        FROM comments c
        JOIN comment_tree ct ON c.parent_id = ct.id
    )
    UPDATE comments c
    SET path = ct.path, depth = ct.depth
    FROM comment_tree ct
    WHERE c.id = ct.id;

    -- 创建索引
    CREATE INDEX IF NOT EXISTS idx_comments_path
        ON comments USING gist(path);

    CREATE INDEX IF NOT EXISTS idx_comments_depth
        ON comments(depth);

    CREATE INDEX IF NOT EXISTS idx_comments_score
        ON comments(score DESC);

    -- 记录迁移
    INSERT INTO schema_migrations (version, description, applied_at)
    VALUES ('007_comment_optimizations', 'Optimize comment system', CURRENT_TIMESTAMP);

    RAISE NOTICE 'Migration 007_comment_optimizations applied successfully!';
END $$;

-- ============================================================================
-- 迁移 008: 添加标签云统计
-- ============================================================================
-- 版本: 008
-- 描述: 创建标签云统计视图和函数
-- 依赖: 001_initial_schema
-- ============================================================================

DO $$
BEGIN
    -- 检查迁移是否已应用
    IF is_migration_applied('008_tag_cloud') THEN
        RAISE NOTICE 'Migration 008_tag_cloud already applied, skipping...';
        RETURN;
    END IF;

    RAISE NOTICE 'Applying migration 008_tag_cloud...';

    -- 创建标签云视图
    CREATE OR REPLACE VIEW v_tag_cloud AS
    SELECT
        t.id,
        t.name,
        t.slug,
        COUNT(DISTINCT pt.post_id) as post_count,
        COUNT(DISTINCT p.author_id) as author_count,
        SUM(p.view_count) as total_views,
        CURRENT_TIMESTAMP as calculated_at
    FROM tags t
    LEFT JOIN post_tags pt ON t.id = pt.tag_id
    LEFT JOIN posts p ON pt.post_id = p.id AND p.status = 'publish'
    GROUP BY t.id, t.name, t.slug
    ORDER BY post_count DESC;

    -- 创建获取热门标签函数
    CREATE OR REPLACE FUNCTION get_popular_tags(p_limit INT DEFAULT 20)
    RETURNS TABLE (
        tag_id BIGINT,
        tag_name VARCHAR,
        tag_slug VARCHAR,
        post_count INT,
        weight NUMERIC
    ) AS $$
    DECLARE
        max_count INT;
    BEGIN
        -- 获取最大文章数
        SELECT COALESCE(MAX(post_count), 1) INTO max_count
        FROM v_tag_cloud;

        -- 返回标签及权重
        RETURN QUERY
        SELECT
            id,
            name,
            slug,
            post_count,
            ROUND(post_count::NUMERIC / max_count, 2) as weight
        FROM v_tag_cloud
        WHERE post_count > 0
        ORDER BY post_count DESC
        LIMIT p_limit;
    END;
    $$ LANGUAGE plpgsql;

    -- 记录迁移
    INSERT INTO schema_migrations (version, description, applied_at)
    VALUES ('008_tag_cloud', 'Add tag cloud statistics', CURRENT_TIMESTAMP);

    RAISE NOTICE 'Migration 008_tag_cloud applied successfully!';
END $$;

-- ============================================================================
-- 迁移 009: 添加用户关系表
-- ============================================================================
-- 版本: 009
-- 描述: 优化用户关系系统，添加好友和屏蔽功能
-- 依赖: 001_initial_schema
-- ============================================================================

DO $$
BEGIN
    -- 检查迁移是否已应用
    IF is_migration_applied('009_user_relationships') THEN
        RAISE NOTICE 'Migration 009_user_relationships already applied, skipping...';
        RETURN;
    END IF;

    RAISE NOTICE 'Applying migration 009_user_relationships...';

    -- 创建好友表
    CREATE TABLE IF NOT EXISTS friendships (
        user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        friend_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        requested_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        accepted_at TIMESTAMP,
        PRIMARY KEY (user_id, friend_id),
        CHECK (user_id != friend_id)
    );

    -- 创建屏蔽表
    CREATE TABLE IF NOT EXISTS user_blocks (
        blocker_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        blocked_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        reason TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (blocker_id, blocked_id),
        CHECK (blocker_id != blocked_id)
    );

    -- 创建索引
    CREATE INDEX IF NOT EXISTS idx_friendships_status
        ON friendships(status, requested_at DESC);

    CREATE INDEX IF NOT EXISTS idx_friendships_friend_id
        ON friendships(friend_id, status);

    CREATE INDEX IF NOT EXISTS idx_user_blocks_blocked_id
        ON user_blocks(blocked_id);

    -- 记录迁移
    INSERT INTO schema_migrations (version, description, applied_at)
    VALUES ('009_user_relationships', 'Add user relationships tables', CURRENT_TIMESTAMP);

    RAISE NOTICE 'Migration 009_user_relationships applied successfully!';
END $$;

-- ============================================================================
-- 迁移 010: 添加内容版本控制
-- ============================================================================
-- 版本: 010
-- 描述: 为文章添加版本控制和历史记录
-- 依赖: 001_initial_schema
-- ============================================================================

DO $$
BEGIN
    -- 检查迁移是否已应用
    IF is_migration_applied('010_content_versioning') THEN
        RAISE NOTICE 'Migration 010_content_versioning already applied, skipping...';
        RETURN;
    END IF;

    RAISE NOTICE 'Applying migration 010_content_versioning...';

    -- 创建文章版本表
    CREATE TABLE IF NOT EXISTS post_revisions (
        id BIGSERIAL PRIMARY KEY,
        post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        revision_number INTEGER NOT NULL,
        title VARCHAR(255),
        content TEXT,
        excerpt TEXT,
        author_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
        revision_note TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(post_id, revision_number)
    );

    -- 创建索引
    CREATE INDEX IF NOT EXISTS idx_post_revisions_post_id
        ON post_revisions(post_id, revision_number DESC);

    CREATE INDEX IF NOT EXISTS idx_post_revisions_created_at
        ON post_revisions(created_at DESC);

    -- 创建创建版本触发器
    CREATE OR REPLACE FUNCTION create_post_revision()
    RETURNS TRIGGER AS $$
    DECLARE
        next_revision INTEGER;
    BEGIN
        -- 只在内容实际变更时创建版本
        IF (OLD.content IS DISTINCT FROM NEW.content OR
            OLD.title IS DISTINCT FROM NEW.title OR
            OLD.excerpt IS DISTINCT FROM NEW.excerpt) THEN

            -- 获取下一个版本号
            SELECT COALESCE(MAX(revision_number), 0) + 1
            INTO next_revision
            FROM post_revisions
            WHERE post_id = NEW.id;

            -- 创建版本
            INSERT INTO post_revisions (
                post_id,
                revision_number,
                title,
                content,
                excerpt,
                author_id
            ) VALUES (
                NEW.id,
                next_revision,
                OLD.title,
                OLD.content,
                OLD.excerpt,
                OLD.author_id
            );
        END IF;

        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    -- 添加触发器
    DROP TRIGGER IF EXISTS trigger_create_post_revision ON posts;
    CREATE TRIGGER trigger_create_post_revision
        BEFORE UPDATE ON posts
        FOR EACH ROW
        WHEN (OLD.content IS DISTINCT FROM NEW.content OR
              OLD.title IS DISTINCT FROM NEW.title OR
              OLD.excerpt IS DISTINCT FROM NEW.excerpt)
        EXECUTE FUNCTION create_post_revision();

    -- 记录迁移
    INSERT INTO schema_migrations (version, description, applied_at)
    VALUES ('010_content_versioning', 'Add content versioning', CURRENT_TIMESTAMP);

    RAISE NOTICE 'Migration 010_content_versioning applied successfully!';
END $$;

-- ============================================================================
-- 迁移完成报告
-- ============================================================================

DO $$
DECLARE
    v_version VARCHAR;
    v_migration_count INTEGER;
BEGIN
    SELECT get_current_version(), COUNT(*)
    INTO v_version, v_migration_count
    FROM schema_migrations;

    RAISE NOTICE '===========================================';
    RAISE NOTICE '数据迁移完成！';
    RAISE NOTICE '===========================================';
    RAISE NOTICE '当前版本: %', v_version;
    RAISE NOTICE '已应用迁移数: %', v_migration_count;
    RAISE NOTICE '===========================================';
    RAISE NOTICE '新功能:';
    RAISE NOTICE '- 全文搜索优化';
    RAISE NOTICE '- 用户偏好设置';
    RAISE NOTICE '- 性能监控';
    RAISE NOTICE '- 文章表优化';
    RAISE NOTICE '- 活动日志';
    RAISE NOTICE '- 评论系统优化';
    RAISE NOTICE '- 标签云统计';
    RAISE NOTICE '- 用户关系系统';
    RAISE NOTICE '- 内容版本控制';
    RAISE NOTICE '===========================================';
END $$;
