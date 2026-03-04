-- ============================================================================
-- CyberPress Platform - Analytics & Performance Schema
-- PostgreSQL Database Schema v1.0
-- ============================================================================
-- 说明: 分析和性能相关表结构（分析事件、页面浏览、会话、性能监控）
-- 作者: CyberPress Team
-- 创建日期: 2026-03-05
-- ============================================================================

-- 设置搜索路径
SET search_path TO public, pg_catalog;

-- ============================================================================
-- 1. 分析事件系统
-- ============================================================================

-- 通用分析事件表
CREATE TABLE IF NOT EXISTS analytics_events (
    id BIGSERIAL PRIMARY KEY,

    -- 事件信息
    event_type VARCHAR(100) NOT NULL,  -- page_view, click, scroll, download, etc.
    event_category VARCHAR(100),
    event_action VARCHAR(255),
    event_label VARCHAR(500),

    -- 用户信息
    user_id BIGINT,
    session_id VARCHAR(255),

    -- 请求信息
    url VARCHAR(2000),
    referrer VARCHAR(2000),
    page_title VARCHAR(500),

    -- 设备信息
    ip_address INET,
    user_agent TEXT,
    device_type VARCHAR(50),  -- desktop, mobile, tablet
    browser VARCHAR(100),
    os VARCHAR(100),
    screen_resolution VARCHAR(50),

    -- 地理位置
    country VARCHAR(100),
    region VARCHAR(100),
    city VARCHAR(100),

    -- 自定义数据
    custom_data JSONB DEFAULT '{}',

    -- 性能数据
    page_load_time INT,  -- 毫秒
    dom_content_loaded INT,  -- 毫秒

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- 约束
    CONSTRAINT fk_analytics_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- ============================================================================
-- 2. 页面浏览记录
-- ============================================================================

-- 页面浏览表（分区表，按月分区）
CREATE TABLE IF NOT EXISTS page_views (
    id BIGSERIAL PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,

    -- 页面信息
    post_id BIGINT,
    url VARCHAR(2000) NOT NULL,
    referrer VARCHAR(2000),
    page_title VARCHAR(500),

    -- 浏览信息
    duration INT,  -- 停留时长（秒）
    exit_page BOOLEAN DEFAULT false,  -- 是否是退出页
    entrance_page BOOLEAN DEFAULT false,  -- 是否是入口页

    -- 用户信息
    user_id BIGINT,
    ip_address INET,
    user_agent TEXT,

    -- 设备信息
    device_type VARCHAR(50),
    browser VARCHAR(100),
    os VARCHAR(100),

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- 约束
    CONSTRAINT fk_page_view_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_page_view_post FOREIGN KEY (post_id)
        REFERENCES posts(id)
        ON DELETE SET NULL
)
PARTITION BY RANGE (created_at);

-- 创建分区（示例：创建未来12个月的分区）
CREATE TABLE IF NOT EXISTS page_views_2026_03 PARTITION OF page_views
    FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');

CREATE TABLE IF NOT EXISTS page_views_2026_04 PARTITION OF page_views
    FOR VALUES FROM ('2026-04-01') TO ('2026-05-01');

CREATE TABLE IF NOT EXISTS page_views_2026_05 PARTITION OF page_views
    FOR VALUES FROM ('2026-05-01') TO ('2026-06-01');

-- ============================================================================
-- 3. 用户会话系统
-- ============================================================================

-- 会话表
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id BIGINT,

    -- 会话信息
    ip_address INET NOT NULL,
    user_agent TEXT NOT NULL,

    -- 设备信息
    device_type VARCHAR(50),
    browser VARCHAR(100),
    os VARCHAR(100),
    screen_resolution VARCHAR(50),

    -- 地理位置
    country VARCHAR(100),
    region VARCHAR(100),
    city VARCHAR(100),

    -- 会话统计
    page_views_count INT DEFAULT 0,
    duration INT DEFAULT 0,  -- 会话时长（秒）
    last_page_url VARCHAR(2000),

    -- 会话数据（JSON格式）
    session_data JSONB DEFAULT '{}',

    -- 时间戳
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP WITH TIME ZONE,

    -- 约束
    CONSTRAINT fk_session_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- ============================================================================
-- 4. 内容统计
-- ============================================================================

-- 文章统计表（每日统计）
CREATE TABLE IF NOT EXISTS post_statistics (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL,

    -- 统计日期
    stat_date DATE NOT NULL,

    -- 浏览统计
    views INT DEFAULT 0,
    unique_views INT DEFAULT 0,
    avg_duration INT DEFAULT 0,  -- 平均阅读时长（秒）

    -- 互动统计
    likes INT DEFAULT 0,
    comments INT DEFAULT 0,
    shares INT DEFAULT 0,
    bookmarks INT DEFAULT 0,

    -- 转化统计
    click_through_rate DECIMAL(5,2),  -- 点击率（百分比）
    bounce_rate DECIMAL(5,2),  -- 跳出率（百分比）

    -- 来源统计
    sources JSONB DEFAULT '{}',  -- {"direct": 100, "search": 50, "social": 30}

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(post_id, stat_date),
    CONSTRAINT fk_post_stat_post FOREIGN KEY (post_id)
        REFERENCES posts(id)
        ON DELETE CASCADE
);

-- 用户统计表（每日统计）
CREATE TABLE IF NOT EXISTS user_statistics (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,

    -- 统计日期
    stat_date DATE NOT NULL,

    -- 内容统计
    posts_created INT DEFAULT 0,
    posts_published INT DEFAULT 0,
    comments_made INT DEFAULT 0,
    likes_given INT DEFAULT 0,
    shares_made INT DEFAULT 0,

    -- 互动统计
    profile_views INT DEFAULT 0,
    new_followers INT DEFAULT 0,
    new_following INT DEFAULT 0,

    -- 活动统计
    login_count INT DEFAULT 0,
    time_spent INT DEFAULT 0,  -- 在平台花费的时间（秒）

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(user_id, stat_date),
    CONSTRAINT fk_user_stat_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- ============================================================================
-- 5. 性能监控
-- ============================================================================

-- API 性能监控表
CREATE TABLE IF NOT EXISTS api_performance (
    id BIGSERIAL PRIMARY KEY,

    -- 请求信息
    endpoint VARCHAR(500) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INT NOT NULL,

    -- 用户信息
    user_id BIGINT,
    session_id VARCHAR(255),

    -- 性能指标
    response_time INT NOT NULL,  -- 响应时间（毫秒）
    db_query_time INT,  -- 数据库查询时间（毫秒）
    cache_hit BOOLEAN DEFAULT false,

    -- 请求详情
    request_size INT,  -- 请求大小（字节）
    response_size INT,  -- 响应大小（字节）

    -- 错误信息
    error_message TEXT,
    error_stack TEXT,

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_api_perf_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- 查询性能监控表
CREATE TABLE IF NOT EXISTS query_performance (
    id BIGSERIAL PRIMARY KEY,

    -- 查询信息
    query_hash VARCHAR(64) NOT NULL,  -- 查询哈希值（用于去重）
    query_signature VARCHAR(500) NOT NULL,  -- 查询签名（去除参数）
    query_text TEXT NOT NULL,  -- 完整查询

    -- 执行信息
    execution_time INT NOT NULL,  -- 执行时间（毫秒）
    rows_affected INT,
    rows_returned INT,

    -- 调用信息
    endpoint VARCHAR(500),
    user_id BIGINT,

    -- 查询详情
    query_type VARCHAR(50),  -- SELECT, INSERT, UPDATE, DELETE
    tables_involved JSONB DEFAULT '[]',  -- 涉及的表

    -- 索引使用
    indexes_used JSONB DEFAULT '[]',  -- 使用的索引
    sequential_scan BOOLEAN DEFAULT false,

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_query_perf_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- ============================================================================
-- 6. 系统监控
-- ============================================================================

-- 系统资源使用监控表
CREATE TABLE IF NOT EXISTS system_metrics (
    id BIGSERIAL PRIMARY KEY,

    -- 服务器信息
    server_name VARCHAR(255),
    server_id VARCHAR(255),

    -- CPU 使用率
    cpu_usage DECIMAL(5,2),
    cpu_load_1m DECIMAL(5,2),
    cpu_load_5m DECIMAL(5,2),
    cpu_load_15m DECIMAL(5,2),

    -- 内存使用
    memory_total BIGINT,  -- 总内存（字节）
    memory_used BIGINT,  -- 已用内存（字节）
    memory_free BIGINT,  -- 空闲内存（字节）
    memory_usage DECIMAL(5,2),  -- 内存使用率（百分比）

    -- 磁盘使用
    disk_total BIGINT,  -- 总磁盘空间（字节）
    disk_used BIGINT,  -- 已用磁盘空间（字节）
    disk_free BIGINT,  -- 空闲磁盘空间（字节）
    disk_usage DECIMAL(5,2),  -- 磁盘使用率（百分比）

    -- 数据库连接
    db_connections INT,
    db_max_connections INT,
    db_active_connections INT,

    -- 缓存统计
    cache_hit_rate DECIMAL(5,2),
    cache_size BIGINT,
    cache_items INT,

    -- 队列统计
    queue_length INT,
    queue_processing_rate DECIMAL(5,2),

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 错误日志表
CREATE TABLE IF NOT EXISTS error_logs (
    id BIGSERIAL PRIMARY KEY,

    -- 错误信息
    error_level VARCHAR(50) NOT NULL,  -- debug, info, warning, error, critical
    error_code VARCHAR(100),
    error_message TEXT NOT NULL,
    error_stack TEXT,

    -- 请求信息
    endpoint VARCHAR(500),
    method VARCHAR(10),
    url VARCHAR(2000),

    -- 用户信息
    user_id BIGINT,
    session_id VARCHAR(255),
    ip_address INET,

    -- 环境信息
    environment VARCHAR(50) NOT NULL,  -- development, staging, production
    service_name VARCHAR(255),
    server_name VARCHAR(255),

    -- 额外数据
    context JSONB DEFAULT '{}',

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT check_error_level CHECK (error_level IN ('debug', 'info', 'warning', 'error', 'critical'))
);

-- ============================================================================
-- 7. 搜索统计
-- ============================================================================

-- 搜索查询统计表
CREATE TABLE IF NOT EXISTS search_queries (
    id BIGSERIAL PRIMARY KEY,

    -- 查询信息
    query_text VARCHAR(500) NOT NULL,
    query_type VARCHAR(50) NOT NULL,  -- post, user, tag, category

    -- 用户信息
    user_id BIGINT,
    session_id VARCHAR(255),

    -- 搜索结果
    results_count INT DEFAULT 0,
    clicked_result_id BIGINT,
    clicked_result_type VARCHAR(100),

    -- 搜索行为
    has_results BOOLEAN DEFAULT true,
    refined_search BOOLEAN DEFAULT false,  -- 是否进行了搜索优化
    search_duration INT,  -- 搜索耗时（毫秒）

    -- 过滤器
    filters JSONB DEFAULT '{}',  -- {"category": "tech", "date": "2026-03"}

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_search_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- ============================================================================
-- 8. A/B 测试
-- ============================================================================

-- A/B 测试配置表
CREATE TABLE IF NOT EXISTS ab_tests (
    id BIGSERIAL PRIMARY KEY,

    -- 测试信息
    name VARCHAR(255) NOT NULL,
    description TEXT,
    test_key VARCHAR(255) NOT NULL UNIQUE,

    -- 测试配置
    variants JSONB NOT NULL,  -- [{"name": "control", "weight": 50}, {"name": "variant_a", "weight": 50}]
    targeting_rules JSONB DEFAULT '{}',  -- 目标规则

    -- 测试状态
    status VARCHAR(50) NOT NULL DEFAULT 'draft',  -- draft, running, paused, completed
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,

    -- 目标指标
    goal_type VARCHAR(100),  -- click_through, conversion, sign_up, etc.
    goal_value DECIMAL(10,2),

    -- 统计
    total_participants INT DEFAULT 0,
    total_conversions INT DEFAULT 0,

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT check_ab_test_status CHECK (status IN ('draft', 'running', 'paused', 'completed'))
);

-- A/B 测试参与记录表
CREATE TABLE IF NOT EXISTS ab_test_participants (
    id BIGSERIAL PRIMARY KEY,
    test_id BIGINT NOT NULL,
    user_id BIGINT,
    session_id VARCHAR(255),

    -- 分配信息
    variant VARCHAR(100) NOT NULL,

    -- 转化信息
    converted BOOLEAN DEFAULT false,
    converted_at TIMESTAMP WITH TIME ZONE,

    -- 时间戳
    assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_ab_test_participant_test FOREIGN KEY (test_id)
        REFERENCES ab_tests(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_ab_test_participant_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- ============================================================================
-- 创建分析相关索引
-- ============================================================================

-- 分析事件索引
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type, created_at DESC);
CREATE INDEX idx_analytics_events_user ON analytics_events(user_id, created_at DESC);
CREATE INDEX idx_analytics_events_session ON analytics_events(session_id, created_at DESC);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at DESC);

-- 页面浏览索引
CREATE INDEX idx_page_views_session ON page_views(session_id, created_at DESC);
CREATE INDEX idx_page_views_post ON page_views(post_id, created_at DESC);
CREATE INDEX idx_page_views_user ON page_views(user_id, created_at DESC);
CREATE INDEX idx_page_views_created_at ON page_views(created_at DESC);

-- 会话索引
CREATE INDEX idx_sessions_user_id ON sessions(user_id, last_activity DESC);
CREATE INDEX idx_sessions_last_activity ON sessions(last_activity DESC);

-- 内容统计索引
CREATE INDEX idx_post_statistics_post_date ON post_statistics(post_id, stat_date DESC);
CREATE INDEX idx_post_statistics_date ON post_statistics(stat_date DESC);
CREATE INDEX idx_user_statistics_user_date ON user_statistics(user_id, stat_date DESC);

-- 性能监控索引
CREATE INDEX idx_api_performance_endpoint ON api_performance(endpoint, created_at DESC);
CREATE INDEX idx_api_performance_response_time ON api_performance(response_time DESC);
CREATE INDEX idx_api_performance_created_at ON api_performance(created_at DESC);
CREATE INDEX idx_query_performance_hash ON query_performance(query_hash, created_at DESC);
CREATE INDEX idx_query_performance_execution_time ON query_performance(execution_time DESC);

-- 系统监控索引
CREATE INDEX idx_system_metrics_created_at ON system_metrics(created_at DESC);
CREATE INDEX idx_error_logs_level ON error_logs(error_level, created_at DESC);
CREATE INDEX idx_error_logs_user_id ON error_logs(user_id, created_at DESC);

-- 搜索统计索引
CREATE INDEX idx_search_queries_text ON search_queries(query_text);
CREATE INDEX idx_search_queries_type ON search_queries(query_type, created_at DESC);
CREATE INDEX idx_search_queries_created_at ON search_queries(created_at DESC);

-- A/B 测试索引
CREATE INDEX idx_ab_tests_key ON ab_tests(test_key);
CREATE INDEX idx_ab_tests_status ON ab_tests(status);
CREATE INDEX idx_ab_test_participants_test ON ab_test_participants(test_id);
CREATE INDEX idx_ab_test_participants_user ON ab_test_participants(user_id);

-- ============================================================================
-- 创建触发器
-- ============================================================================

-- 自动更新 updated_at 字段
CREATE TRIGGER trigger_post_statistics_updated_at
    BEFORE UPDATE ON post_statistics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_user_statistics_updated_at
    BEFORE UPDATE ON user_statistics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_ab_tests_updated_at
    BEFORE UPDATE ON ab_tests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 添加表注释
-- ============================================================================

COMMENT ON TABLE analytics_events IS '通用分析事件表';
COMMENT ON TABLE page_views IS '页面浏览记录表';
COMMENT ON TABLE sessions IS '用户会话表';
COMMENT ON TABLE post_statistics IS '文章统计表';
COMMENT ON TABLE user_statistics IS '用户统计表';
COMMENT ON TABLE api_performance IS 'API 性能监控表';
COMMENT ON TABLE query_performance IS '查询性能监控表';
COMMENT ON TABLE system_metrics IS '系统资源使用监控表';
COMMENT ON TABLE error_logs IS '错误日志表';
COMMENT ON TABLE search_queries IS '搜索查询统计表';
COMMENT ON TABLE ab_tests IS 'A/B 测试配置表';
COMMENT ON TABLE ab_test_participants IS 'A/B 测试参与记录表';

-- 分析和性能表结构创建完成
