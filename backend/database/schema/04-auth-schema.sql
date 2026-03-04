-- ============================================================================
-- CyberPress Platform - Authentication & Authorization Schema
-- PostgreSQL Database Schema v1.0
-- ============================================================================
-- 说明: 认证授权表结构（API令牌、刷新令牌、角色、权限、审计日志）
-- 作者: CyberPress Team
-- 创建日期: 2026-03-05
-- ============================================================================

-- 设置搜索路径
SET search_path TO public, pg_catalog;

-- ============================================================================
-- 1. API 认证系统
-- ============================================================================

-- API 访问令牌表
CREATE TABLE IF NOT EXISTS api_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,

    -- 令牌信息
    token VARCHAR(500) NOT NULL UNIQUE,
    token_hash VARCHAR(255) NOT NULL,  -- 用于安全验证的哈希值

    -- 令牌元数据
    name VARCHAR(255) NOT NULL,
    description TEXT,

    -- 权限范围
    scopes JSONB NOT NULL DEFAULT '[]',  -- ["read:posts", "write:posts", "delete:posts"]

    -- 客户端信息
    client_id VARCHAR(255),
    client_type VARCHAR(50) DEFAULT 'web',  -- web, mobile, desktop, api

    -- 过期和状态
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_used_at TIMESTAMP WITH TIME ZONE,
    revoked_at TIMESTAMP WITH TIME ZONE,
    is_revoked BOOLEAN DEFAULT false,

    -- 限制
    ip_whitelist JSONB DEFAULT '[]',  -- 允许的IP地址列表
    rate_limit INT DEFAULT 1000,  -- 每小时请求限制

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- 约束
    CONSTRAINT fk_api_token_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- 刷新令牌表
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    api_token_id BIGINT,

    -- 令牌信息
    token VARCHAR(500) NOT NULL UNIQUE,
    token_hash VARCHAR(255) NOT NULL,

    -- 客户端信息
    client_id VARCHAR(255),
    device_fingerprint VARCHAR(500),

    -- 过期和状态
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    revoked_at TIMESTAMP WITH TIME ZONE,
    replaced_by_token_id BIGINT,  -- 被哪个令牌替换

    -- 使用统计
    usage_count INT DEFAULT 0,
    last_used_at TIMESTAMP WITH TIME ZONE,

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- 约束
    CONSTRAINT fk_refresh_token_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_refresh_token_api_token FOREIGN KEY (api_token_id)
        REFERENCES api_tokens(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_refresh_token_replaced_by FOREIGN KEY (replaced_by_token_id)
        REFERENCES refresh_tokens(id)
        ON DELETE SET NULL
);

-- ============================================================================
-- 2. 授权码系统
-- ============================================================================

-- OAuth 授权码表
CREATE TABLE IF NOT EXISTS authorization_codes (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,

    -- 授权信息
    code VARCHAR(500) NOT NULL UNIQUE,
    code_hash VARCHAR(255) NOT NULL,

    -- 客户端信息
    client_id VARCHAR(255) NOT NULL,
    redirect_uri VARCHAR(2000) NOT NULL,
    state VARCHAR(500),

    -- 权限范围
    scope JSONB NOT NULL DEFAULT '[]',

    -- PKCE 支持
    code_challenge VARCHAR(255),
    code_challenge_method VARCHAR(10),  -- plain, S256

    -- 过期和状态
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    is_used BOOLEAN DEFAULT false,
    revoked_at TIMESTAMP WITH TIME ZONE,

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- 约束
    CONSTRAINT fk_auth_code_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- ============================================================================
-- 3. 角色和权限系统
-- ============================================================================

-- 角色表
CREATE TABLE IF NOT EXISTS roles (
    id BIGSERIAL PRIMARY KEY,

    -- 角色信息
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,

    -- 角色设置
    is_system_role BOOLEAN DEFAULT false,  -- 是否是系统内置角色
    is_default BOOLEAN DEFAULT false,  -- 是否是新用户默认角色

    -- 角色层级（数字越大权限越高）
    level INT DEFAULT 0,

    -- 限制
    user_limit INT,  -- 该角色用户数量限制
    current_user_count INT DEFAULT 0,

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 权限表
CREATE TABLE IF NOT EXISTS permissions (
    id BIGSERIAL PRIMARY KEY,

    -- 权限信息
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,

    -- 权限分类
    category VARCHAR(100),  -- posts, users, comments, media, settings
    resource VARCHAR(100),  -- 资源类型
    action VARCHAR(100),  -- 操作类型

    -- 权限设置
    is_system_permission BOOLEAN DEFAULT false,  -- 是否是系统内置权限

    -- 条件（JSON格式，用于复杂权限判断）
    conditions JSONB DEFAULT '{}',  -- {"status": "published", "author_only": true}

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 角色权限关联表（多对多）
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,

    -- 额外条件
    conditions JSONB DEFAULT '{}',

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_rp_role FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_rp_permission FOREIGN KEY (permission_id)
        REFERENCES permissions(id)
        ON DELETE CASCADE
);

-- 用户角色关联表（多对多）
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,

    -- 分配信息
    assigned_by BIGINT,  -- 分配者ID
    assignment_reason VARCHAR(500),

    -- 过期时间（可选，用于临时角色）
    expires_at TIMESTAMP WITH TIME ZONE,

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_ur_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_ur_role FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_ur_assigned_by FOREIGN KEY (assigned_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- ============================================================================
-- 4. 安全审计系统
-- ============================================================================

-- 审计日志表
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,

    -- 用户信息
    user_id BIGINT,
    user_email VARCHAR(255),
    user_username VARCHAR(100),

    -- 操作信息
    action VARCHAR(255) NOT NULL,  -- login, logout, create_post, delete_post, etc.
    resource_type VARCHAR(100),  -- user, post, comment, media
    resource_id BIGINT,

    -- 请求信息
    ip_address INET,
    user_agent TEXT,
    request_method VARCHAR(10),
    request_url VARCHAR(2000),

    -- 变更信息
    old_values JSONB,  -- 修改前的值
    new_values JSONB,  -- 修改后的值

    -- 操作结果
    status VARCHAR(50) NOT NULL,  -- success, failure
    error_message TEXT,

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- 约束
    CONSTRAINT fk_audit_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL,
    CONSTRAINT check_audit_status CHECK (status IN ('success', 'failure'))
);

-- 登录历史表
CREATE TABLE IF NOT EXISTS login_history (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,

    -- 登录信息
    login_type VARCHAR(50) NOT NULL,  -- password, oauth, sso, magic_link
    login_method VARCHAR(100),  -- email, google, github, etc.

    -- 设备和位置
    ip_address INET NOT NULL,
    user_agent TEXT,
    device_type VARCHAR(50),
    browser VARCHAR(100),
    os VARCHAR(100),
    country VARCHAR(100),
    city VARCHAR(100),

    -- 登录状态
    status VARCHAR(50) NOT NULL,  -- success, failed, blocked
    failure_reason VARCHAR(500),

    -- 会话信息
    session_id VARCHAR(255),
    api_token_id BIGINT,

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    logout_at TIMESTAMP WITH TIME ZONE,

    -- 约束
    CONSTRAINT fk_login_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT check_login_status CHECK (status IN ('success', 'failed', 'blocked'))
);

-- ============================================================================
-- 5. 两步认证系统
-- ============================================================================

-- 两步认证配置表
CREATE TABLE IF NOT EXISTS two_factor_auth (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,

    -- 认证方法
    method VARCHAR(50) NOT NULL,  -- totp, sms, email, authenticator_app

    -- TOTP 配置
    totp_secret VARCHAR(255),
    totp_backup_codes JSONB DEFAULT '[]',  -- 备用码

    -- 短信配置
    phone_number VARCHAR(50),
    phone_verified BOOLEAN DEFAULT false,

    -- 邮箱配置
    backup_email VARCHAR(255),
    backup_email_verified BOOLEAN DEFAULT false,

    -- 认证器应用配置
    authenticator_secret VARCHAR(255),
    authenticator_verified BOOLEAN DEFAULT false,

    -- 状态
    is_enabled BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,

    -- 统计
    successful_attempts INT DEFAULT 0,
    failed_attempts INT DEFAULT 0,
    last_used_at TIMESTAMP WITH TIME ZONE,

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_2fa_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- 两步认证验证记录表
CREATE TABLE IF NOT EXISTS two_factor_attempts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,

    -- 验证信息
    code VARCHAR(20) NOT NULL,
    code_hash VARCHAR(255) NOT NULL,

    -- 设备信息
    ip_address INET,
    user_agent TEXT,
    device_fingerprint VARCHAR(500),

    -- 验证结果
    is_valid BOOLEAN DEFAULT false,
    is_used BOOLEAN DEFAULT false,

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,

    CONSTRAINT fk_2fa_attempt_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- ============================================================================
-- 6. 密码管理系统
-- ============================================================================

-- 密码重置令牌表
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,

    -- 令牌信息
    token VARCHAR(500) NOT NULL UNIQUE,
    token_hash VARCHAR(255) NOT NULL,

    -- 请求信息
    email VARCHAR(255) NOT NULL,
    ip_address INET,
    user_agent TEXT,

    -- 状态
    is_used BOOLEAN DEFAULT false,
    used_at TIMESTAMP WITH TIME ZONE,

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,

    CONSTRAINT fk_password_reset_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- 密码历史表（防止重复使用旧密码）
CREATE TABLE IF NOT EXISTS password_history (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,

    -- 密码信息
    password_hash VARCHAR(255) NOT NULL,

    -- 变更信息
    changed_by BIGINT,  -- 修改者（可能是管理员）
    change_reason VARCHAR(500),

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_password_history_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_password_history_changed_by FOREIGN KEY (changed_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- ============================================================================
-- 7. 会话管理
-- ============================================================================

-- 活跃会话表
CREATE TABLE IF NOT EXISTS active_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,

    -- 会话标识
    session_id VARCHAR(255) NOT NULL UNIQUE,

    -- 设备信息
    device_type VARCHAR(50),
    device_name VARCHAR(255),
    browser VARCHAR(100),
    os VARCHAR(100),

    -- 位置信息
    ip_address INET NOT NULL,
    country VARCHAR(100),
    city VARCHAR(100),

    -- 状态
    is_active BOOLEAN DEFAULT true,
    is_remembered BOOLEAN DEFAULT false,

    -- 最后活动
    last_activity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,

    CONSTRAINT fk_active_session_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- ============================================================================
-- 8. 权限缓存系统
-- ============================================================================

-- 用户权限缓存表（用于快速权限检查）
CREATE TABLE IF NOT EXISTS user_permissions_cache (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,

    -- 缓存的权限
    permissions JSONB NOT NULL DEFAULT '[]',  -- 所有权限的数组
    permissions_hash VARCHAR(255),  -- 权限哈希，用于检测变化

    -- 缓存元数据
    cache_version INT DEFAULT 1,

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(user_id, cache_version),
    CONSTRAINT fk_user_permissions_cache FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- ============================================================================
-- 创建认证授权相关索引
-- ============================================================================

-- API 令牌索引
CREATE INDEX idx_api_tokens_user_id ON api_tokens(user_id);
CREATE INDEX idx_api_tokens_token_hash ON api_tokens(token_hash);
CREATE INDEX idx_api_tokens_expires_at ON api_tokens(expires_at);
CREATE INDEX idx_api_tokens_is_revoked ON api_tokens(is_revoked, expires_at);

-- 刷新令牌索引
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);

-- 授权码索引
CREATE INDEX idx_auth_codes_user_id ON authorization_codes(user_id);
CREATE INDEX idx_auth_codes_code_hash ON authorization_codes(code_hash);
CREATE INDEX idx_auth_codes_expires_at ON authorization_codes(expires_at);

-- 角色和权限索引
CREATE INDEX idx_roles_slug ON roles(slug);
CREATE INDEX idx_roles_level ON roles(level);
CREATE INDEX idx_permissions_category ON permissions(category);
CREATE INDEX idx_permissions_resource ON permissions(resource, action);
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);

-- 审计日志索引
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id, created_at DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action, created_at DESC);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- 登录历史索引
CREATE INDEX idx_login_history_user_id ON login_history(user_id, created_at DESC);
CREATE INDEX idx_login_history_status ON login_history(status, created_at DESC);
CREATE INDEX idx_login_history_ip_address ON login_history(ip_address);

-- 两步认证索引
CREATE INDEX idx_2fa_user_id ON two_factor_auth(user_id);
CREATE INDEX idx_2fa_attempts_user_id ON two_factor_attempts(user_id, created_at DESC);

-- 密码管理索引
CREATE INDEX idx_password_reset_user_id ON password_reset_tokens(user_id);
CREATE INDEX idx_password_reset_token_hash ON password_reset_tokens(token_hash);
CREATE INDEX idx_password_reset_expires_at ON password_reset_tokens(expires_at);
CREATE INDEX idx_password_history_user_id ON password_history(user_id, created_at DESC);

-- 会话管理索引
CREATE INDEX idx_active_sessions_user_id ON active_sessions(user_id, is_active);
CREATE INDEX idx_active_sessions_session_id ON active_sessions(session_id);
CREATE INDEX idx_active_sessions_last_activity ON active_sessions(last_activity DESC);

-- 权限缓存索引
CREATE INDEX idx_user_permissions_cache_user_id ON user_permissions_cache(user_id);

-- ============================================================================
-- 创建触发器
-- ============================================================================

-- 自动更新 updated_at 字段
CREATE TRIGGER trigger_api_tokens_updated_at
    BEFORE UPDATE ON api_tokens
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_roles_updated_at
    BEFORE UPDATE ON roles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_permissions_updated_at
    BEFORE UPDATE ON permissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_user_roles_updated_at
    BEFORE UPDATE ON user_roles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_two_factor_auth_updated_at
    BEFORE UPDATE ON two_factor_auth
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_user_permissions_cache_updated_at
    BEFORE UPDATE ON user_permissions_cache
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 添加表注释
-- ============================================================================

COMMENT ON TABLE api_tokens IS 'API 访问令牌表';
COMMENT ON TABLE refresh_tokens IS '刷新令牌表';
COMMENT ON TABLE authorization_codes IS 'OAuth 授权码表';
COMMENT ON TABLE roles IS '角色表';
COMMENT ON TABLE permissions IS '权限表';
COMMENT ON TABLE role_permissions IS '角色权限关联表';
COMMENT ON TABLE user_roles IS '用户角色关联表';
COMMENT ON TABLE audit_logs IS '审计日志表';
COMMENT ON TABLE login_history IS '登录历史表';
COMMENT ON TABLE two_factor_auth IS '两步认证配置表';
COMMENT ON TABLE two_factor_attempts IS '两步认证验证记录表';
COMMENT ON TABLE password_reset_tokens IS '密码重置令牌表';
COMMENT ON TABLE password_history IS '密码历史表';
COMMENT ON TABLE active_sessions IS '活跃会话表';
COMMENT ON TABLE user_permissions_cache IS '用户权限缓存表';

-- 认证授权表结构创建完成
