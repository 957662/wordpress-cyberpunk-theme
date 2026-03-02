-- ============================================
-- Migration: 005_add_user_preferences
-- Description: 添加用户偏好设置表和相关功能
-- Version: 1.0.0
-- Date: 2026-03-03
-- ============================================

-- 开始事务
BEGIN;

-- ============================================
-- 创建用户偏好设置表
-- ============================================
CREATE TABLE IF NOT EXISTS user_preferences (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,

    -- 界面设置
    theme_mode VARCHAR(10) DEFAULT 'dark'
        CHECK (theme_mode IN ('light', 'dark', 'auto')),
    accent_color VARCHAR(20) DEFAULT 'cyan'
        CHECK (accent_color IN ('cyan', 'purple', 'pink', 'yellow', 'green')),
    font_size VARCHAR(5) DEFAULT 'md'
        CHECK (font_size IN ('xs', 'sm', 'md', 'lg', 'xl')),
    sidebar_collapsed BOOLEAN DEFAULT FALSE,

    -- 内容设置
    posts_per_page INTEGER DEFAULT 10,
    default_sorting VARCHAR(20) DEFAULT 'date'
        CHECK (default_sorting IN ('date', 'modified', 'title', 'views')),
    show_excerpt_in_list BOOLEAN DEFAULT TRUE,
    auto_play_gifs BOOLEAN DEFAULT FALSE,

    -- 通知设置
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT FALSE,
    notification_email_frequency VARCHAR(20) DEFAULT 'immediately'
        CHECK (notification_email_frequency IN ('immediately', 'daily', 'weekly', 'never')),
    notification_types JSONB DEFAULT '[]'::jsonb,

    -- 隐私设置
    profile_visible BOOLEAN DEFAULT TRUE,
    show_email BOOLEAN DEFAULT FALSE,
    show_location BOOLEAN DEFAULT FALSE,
    allow_messages_from VARCHAR(20) DEFAULT 'everyone'
        CHECK (allow_messages_from IN ('everyone', 'followers', 'none')),

    -- 其他设置
    language VARCHAR(10) DEFAULT 'zh-CN',
    timezone VARCHAR(50) DEFAULT 'Asia/Shanghai',
    custom_css TEXT,
    metadata JSONB DEFAULT '{}',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE user_preferences IS '用户偏好设置表';

-- ============================================
-- 创建索引
-- ============================================
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_theme_mode ON user_preferences(theme_mode);
CREATE INDEX IF NOT EXISTS idx_user_preferences_language ON user_preferences(language);

-- ============================================
-- 创建触发器
-- ============================================
CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 为现有用户创建默认偏好设置
-- ============================================
INSERT INTO user_preferences (user_id)
SELECT id FROM users
ON CONFLICT (user_id) DO NOTHING;

-- ============================================
-- 创建通知类型枚举
-- ============================================
CREATE TYPE notification_type AS ENUM (
    'comment',
    'reply',
    'like',
    'follow',
    'mention',
    'post_published',
    'system',
    'weekly_digest',
    'new_follower_posts'
);

ALTER TABLE notifications
    ALTER COLUMN type TYPE notification_type USING type::notification_type;

-- ============================================
-- 更新通知表结构
-- ============================================
ALTER TABLE notifications
    ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 0
    CHECK (priority >= 0 AND priority <= 10),
    ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP,
    ADD COLUMN IF NOT EXISTS action_url VARCHAR(500),
    ADD COLUMN IF NOT EXISTS action_label VARCHAR(100);

-- 为优先级创建索引
CREATE INDEX IF NOT EXISTS idx_notifications_priority ON notifications(priority, is_read, created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_expires_at ON notifications(expires_at) WHERE expires_at IS NOT NULL;

-- ============================================
-- 创建用户活动日志表
-- ============================================
CREATE TABLE IF NOT EXISTS user_activity_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50),
    entity_id BIGINT,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE user_activity_logs IS '用户活动日志表';

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_user_id ON user_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_action ON user_activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_entity ON user_activity_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_created_at ON user_activity_logs(created_at DESC);

-- ============================================
-- 创建用户会话管理表
-- ============================================
CREATE TABLE IF NOT EXISTS user_sessions (
    id VARCHAR(128) PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ip_address INET,
    user_agent TEXT,
    device_type VARCHAR(50),
    device_name VARCHAR(100),
    browser_name VARCHAR(100),
    browser_version VARCHAR(50),
    os_name VARCHAR(100),
    os_version VARCHAR(50),
    location_country VARCHAR(100),
    location_city VARCHAR(100),
    last_activity TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE user_sessions IS '用户会话表';

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_last_activity ON user_sessions(last_activity DESC);
CREATE INDEX IF NOT EXISTS idx_user_sessions_device_type ON user_sessions(device_type);

-- 创建清理过期会话的函数
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM user_sessions
    WHERE last_activity < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 创建用户仪表盘配置表
-- ============================================
CREATE TABLE IF NOT EXISTS user_dashboards (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    layout JSONB NOT NULL DEFAULT '[]'::jsonb,
    widgets JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, name)
);

COMMENT ON TABLE user_dashboards IS '用户仪表盘配置表';

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_user_dashboards_user_id ON user_dashboards(user_id);

-- 创建触发器
CREATE TRIGGER update_user_dashboards_updated_at
    BEFORE UPDATE ON user_dashboards
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 为默认仪表盘插入初始数据
-- ============================================
INSERT INTO user_dashboards (user_id, name, is_default, layout)
SELECT
    id,
    '默认仪表盘',
    TRUE,
    '[
        {"i": "stats", "x": 0, "y": 0, "w": 4, "h": 2},
        {"i": "recent-posts", "x": 4, "y": 0, "w": 8, "h": 4},
        {"i": "analytics", "x": 0, "y": 2, "w": 4, "h": 2},
        {"i": "comments", "x": 0, "y": 4, "w": 6, "h": 3},
        {"i": "activity", "x": 6, "y": 4, "w": 6, "h": 3}
    ]'::jsonb
FROM users
ON CONFLICT (user_id, name) DO NOTHING;

-- ============================================
-- 创建视图：用户详细信息
-- ============================================
CREATE OR REPLACE VIEW user_details_view AS
SELECT
    u.id,
    u.username,
    u.email,
    u.display_name,
    u.bio,
    u.avatar_url,
    u.website,
    u.role,
    u.status,
    u.created_at,
    u.last_login_at,

    -- 偏好设置
    p.theme_mode,
    p.accent_color,
    p.language,
    p.timezone,

    -- 统计信息
    (SELECT COUNT(*) FROM posts WHERE author_id = u.id AND status = 'publish') as posts_count,
    (SELECT COUNT(*) FROM comments WHERE author_id = u.id AND status = 'approved') as comments_count,
    (SELECT COUNT(*) FROM follows WHERE following_id = u.id) as followers_count,
    (SELECT COUNT(*) FROM follows WHERE follower_id = u.id) as following_count,

    -- 最近活动
    (SELECT MAX(created_at) FROM user_activity_logs WHERE user_id = u.id) as last_activity_at

FROM users u
LEFT JOIN user_preferences p ON u.id = p.user_id
WHERE u.status != 'deleted';

COMMENT ON VIEW user_details_view IS '用户详细信息视图';

-- ============================================
-- 创建函数：获取用户设置
-- ============================================
CREATE OR REPLACE FUNCTION get_user_settings(p_user_id BIGINT)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'user', jsonb_build_object(
            'id', u.id,
            'username', u.username,
            'email', u.email,
            'displayName', u.display_name,
            'avatar', u.avatar_url,
            'role', u.role
        ),
        'preferences', jsonb_build_object(
            'themeMode', p.theme_mode,
            'accentColor', p.accent_color,
            'fontSize', p.font_size,
            'language', p.language,
            'timezone', p.timezone,
            'emailNotifications', p.email_notifications,
            'pushNotifications', p.push_notifications
        )
    ) INTO result
    FROM users u
    LEFT JOIN user_preferences p ON u.id = p.user_id
    WHERE u.id = p_user_id;

    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 创建函数：更新用户最后活跃时间
-- ============================================
CREATE OR REPLACE FUNCTION update_last_activity(p_user_id BIGINT)
RETURNS void AS $$
BEGIN
    UPDATE users
    SET last_login_at = CURRENT_TIMESTAMP
    WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- 提交事务
COMMIT;

-- ============================================
-- Migration 完成
-- ============================================
-- DO $$ BEGIN RAISE NOTICE 'Migration 005_add_user_preferences completed successfully'; END $$;
