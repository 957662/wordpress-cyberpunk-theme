-- ============================================================================
-- CyberPress Platform - Social Features Schema
-- PostgreSQL Database Schema v1.0
-- ============================================================================
-- 说明: 社交功能表结构（关注、动态、通知）
-- 作者: CyberPress Team
-- 创建日期: 2026-03-05
-- ============================================================================

-- 设置搜索路径
SET search_path TO public, pg_catalog;

-- ============================================================================
-- 1. 用户关注系统
-- ============================================================================

-- 用户关注关系表
CREATE TABLE IF NOT EXISTS user_follows (
    id BIGSERIAL PRIMARY KEY,
    follower_id BIGINT NOT NULL,  -- 关注者
    following_id BIGINT NOT NULL, -- 被关注者

    -- 关注设置
    status VARCHAR(50) DEFAULT 'active',

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- 约束
    UNIQUE(follower_id, following_id),
    CONSTRAINT check_not_self_follow CHECK (follower_id != following_id),
    CONSTRAINT check_follow_status CHECK (status IN ('active', 'blocked', 'pending')),
    CONSTRAINT fk_follower FOREIGN KEY (follower_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_following FOREIGN KEY (following_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- 关注请求表（用于需要批准的关注）
CREATE TABLE IF NOT EXISTS follow_requests (
    id BIGSERIAL PRIMARY KEY,
    requester_id BIGINT NOT NULL,
    target_id BIGINT NOT NULL,

    -- 请求信息
    message TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP WITH TIME ZONE,

    -- 约束
    CONSTRAINT check_not_self_request CHECK (requester_id != target_id),
    CONSTRAINT check_request_status CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
    CONSTRAINT fk_requester FOREIGN KEY (requester_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_target FOREIGN KEY (target_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- ============================================================================
-- 2. 用户动态系统
-- ============================================================================

-- 用户活动/动态表
CREATE TABLE IF NOT EXISTS activities (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,

    -- 活动信息
    type VARCHAR(100) NOT NULL,  -- post, comment, like, follow, share, etc.
    title VARCHAR(500),
    description TEXT,

    -- 关联对象
    post_id BIGINT,
    comment_id BIGINT,
    target_user_id BIGINT,  -- 被操作的用户ID

    -- 活动数据（JSON格式，灵活存储）
    data JSONB DEFAULT '{}',

    -- 隐私设置
    visibility VARCHAR(50) DEFAULT 'public',  -- public, followers, private

    -- 统计
    like_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    share_count INT DEFAULT 0,

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,

    -- 约束
    CONSTRAINT fk_activity_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_activity_post FOREIGN KEY (post_id)
        REFERENCES posts(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_activity_comment FOREIGN KEY (comment_id)
        REFERENCES comments(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_activity_target_user FOREIGN KEY (target_user_id)
        REFERENCES users(id)
        ON DELETE SET NULL,
    CONSTRAINT check_activity_visibility CHECK (visibility IN ('public', 'followers', 'private'))
);

-- 动态点赞表
CREATE TABLE IF NOT EXISTS activity_likes (
    id BIGSERIAL PRIMARY KEY,
    activity_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(activity_id, user_id),
    CONSTRAINT fk_activity_like_activity FOREIGN KEY (activity_id)
        REFERENCES activities(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_activity_like_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- 动态评论表
CREATE TABLE IF NOT EXISTS activity_comments (
    id BIGSERIAL PRIMARY KEY,
    activity_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    parent_id BIGINT,  -- 父评论ID，用于嵌套回复

    -- 评论内容
    content TEXT NOT NULL,

    -- 统计
    like_count INT DEFAULT 0,

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_activity_comment_activity FOREIGN KEY (activity_id)
        REFERENCES activities(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_activity_comment_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_activity_comment_parent FOREIGN KEY (parent_id)
        REFERENCES activity_comments(id)
        ON DELETE CASCADE
);

-- ============================================================================
-- 3. 通知系统
-- ============================================================================

-- 通知表
CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,  -- 接收通知的用户

    -- 通知信息
    type VARCHAR(100) NOT NULL,  -- follow, like, comment, mention, system
    title VARCHAR(500) NOT NULL,
    message TEXT,

    -- 发送者
    sender_id BIGINT,

    -- 关联对象
    post_id BIGINT,
    comment_id BIGINT,
    activity_id BIGINT,

    -- 通知数据（JSON格式）
    data JSONB DEFAULT '{}',

    -- 状态
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,

    -- 动作
    action_url VARCHAR(1000),
    action_label VARCHAR(100),

    -- 优先级
    priority VARCHAR(20) DEFAULT 'normal',  -- low, normal, high, urgent

    -- 过期时间
    expires_at TIMESTAMP WITH TIME ZONE,

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- 约束
    CONSTRAINT fk_notification_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_notification_sender FOREIGN KEY (sender_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_notification_post FOREIGN KEY (post_id)
        REFERENCES posts(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_notification_comment FOREIGN KEY (comment_id)
        REFERENCES comments(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_notification_activity FOREIGN KEY (activity_id)
        REFERENCES activities(id)
        ON DELETE CASCADE,
    CONSTRAINT check_notification_priority CHECK (priority IN ('low', 'normal', 'high', 'urgent'))
);

-- 用户通知偏好设置表
CREATE TABLE IF NOT EXISTS notification_preferences (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,

    -- 通知类型偏好
    email_follows BOOLEAN DEFAULT true,
    email_likes BOOLEAN DEFAULT true,
    email_comments BOOLEAN DEFAULT true,
    email_mentions BOOLEAN DEFAULT true,
    email_system BOOLEAN DEFAULT true,

    push_follows BOOLEAN DEFAULT true,
    push_likes BOOLEAN DEFAULT true,
    push_comments BOOLEAN DEFAULT true,
    push_mentions BOOLEAN DEFAULT true,
    push_system BOOLEAN DEFAULT true,

    -- 通知时间设置
    quiet_hours_start TIME,
    quiet_hours_end TIME,
    timezone VARCHAR(50) DEFAULT 'Asia/Shanghai',

    -- 批量通知设置
    batch_notifications BOOLEAN DEFAULT false,
    batch_frequency VARCHAR(50) DEFAULT 'hourly',  -- immediate, hourly, daily

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notification_preferences_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- ============================================================================
-- 4. 消息系统
-- ============================================================================

-- 会话表
CREATE TABLE IF NOT EXISTS conversations (
    id BIGSERIAL PRIMARY KEY,

    -- 会话信息
    type VARCHAR(50) NOT NULL DEFAULT 'direct',  -- direct, group
    name VARCHAR(255),
    description TEXT,
    avatar_url VARCHAR(500),

    -- 会话设置
    is_private BOOLEAN DEFAULT true,
    max_participants INT DEFAULT 2,

    -- 统计
    message_count INT DEFAULT 0,
    participant_count INT DEFAULT 0,

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT check_conversation_type CHECK (type IN ('direct', 'group'))
);

-- 会话参与者表
CREATE TABLE IF NOT EXISTS conversation_participants (
    id BIGSERIAL PRIMARY KEY,
    conversation_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,

    -- 参与者设置
    role VARCHAR(50) DEFAULT 'member',  -- owner, admin, member
    is_muted BOOLEAN DEFAULT false,
    is_pinned BOOLEAN DEFAULT false,

    -- 阅读状态
    last_read_at TIMESTAMP WITH TIME ZONE,
    last_read_message_id BIGINT,

    -- 通知设置
    notifications_enabled BOOLEAN DEFAULT true,

    -- 时间戳
    joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP WITH TIME ZONE,

    UNIQUE(conversation_id, user_id),
    CONSTRAINT fk_conversation_participant_conversation FOREIGN KEY (conversation_id)
        REFERENCES conversations(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_conversation_participant_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT check_participant_role CHECK (role IN ('owner', 'admin', 'member'))
);

-- 消息表
CREATE TABLE IF NOT EXISTS messages (
    id BIGSERIAL PRIMARY KEY,
    conversation_id BIGINT NOT NULL,
    sender_id BIGINT NOT NULL,

    -- 消息内容
    content TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'text',  -- text, image, video, file, system

    -- 附件
    attachment_url VARCHAR(1000),
    attachment_type VARCHAR(100),
    attachment_name VARCHAR(500),

    -- 回复
    reply_to_id BIGINT,  -- 回复的消息ID

    -- 状态
    is_edited BOOLEAN DEFAULT false,
    is_deleted BOOLEAN DEFAULT false,

    -- 反应
    reactions JSONB DEFAULT '{}',  -- {"👍": ["user_id1", "user_id2"]}

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    edited_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_message_conversation FOREIGN KEY (conversation_id)
        REFERENCES conversations(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_message_sender FOREIGN KEY (sender_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_message_reply_to FOREIGN KEY (reply_to_id)
        REFERENCES messages(id)
        ON DELETE SET NULL,
    CONSTRAINT check_message_type CHECK (message_type IN ('text', 'image', 'video', 'file', 'system'))
);

-- 消息阅读状态表
CREATE TABLE IF NOT EXISTS message_read_status (
    id BIGSERIAL PRIMARY KEY,
    message_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,

    read_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(message_id, user_id),
    CONSTRAINT fk_read_status_message FOREIGN KEY (message_id)
        REFERENCES messages(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_read_status_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- ============================================================================
-- 5. 书签和收藏
-- ============================================================================

-- 用户书签表
CREATE TABLE IF NOT EXISTS bookmarks (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,

    -- 书签对象
    bookmarkable_id BIGINT NOT NULL,  -- 被收藏对象的ID
    bookmarkable_type VARCHAR(100) NOT NULL,  -- Post, Comment, Activity

    -- 书签信息
    title VARCHAR(500),
    notes TEXT,
    tags JSONB DEFAULT '[]',

    -- 分类
    folder VARCHAR(255) DEFAULT 'default',

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(user_id, bookmarkable_id, bookmarkable_type),
    CONSTRAINT fk_bookmark_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- ============================================================================
-- 6. 用户互动历史
-- ============================================================================

-- 用户互动表（记录用户间的所有互动）
CREATE TABLE IF NOT EXISTS user_interactions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    target_user_id BIGINT NOT NULL,

    -- 互动信息
    interaction_type VARCHAR(100) NOT NULL,  -- like, comment, mention, share, follow

    -- 关联对象
    post_id BIGINT,
    comment_id BIGINT,
    activity_id BIGINT,

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_interaction_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_interaction_target_user FOREIGN KEY (target_user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_interaction_post FOREIGN KEY (post_id)
        REFERENCES posts(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_interaction_comment FOREIGN KEY (comment_id)
        REFERENCES comments(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_interaction_activity FOREIGN KEY (activity_id)
        REFERENCES activities(id)
        ON DELETE CASCADE
);

-- ============================================================================
-- 创建社交功能索引
-- ============================================================================

-- 关注系统索引
CREATE INDEX idx_user_follows_follower ON user_follows(follower_id, created_at DESC);
CREATE INDEX idx_user_follows_following ON user_follows(following_id, created_at DESC);
CREATE INDEX idx_user_follows_status ON user_follows(status);
CREATE INDEX idx_follow_requests_target ON follow_requests(target_id, status);
CREATE INDEX idx_follow_requests_requester ON follow_requests(requester_id, status);

-- 动态系统索引
CREATE INDEX idx_activities_user_id ON activities(user_id, created_at DESC);
CREATE INDEX idx_activities_type ON activities(type, created_at DESC);
CREATE INDEX idx_activities_visibility ON activities(visibility, created_at DESC);
CREATE INDEX idx_activities_post_id ON activities(post_id);
CREATE INDEX idx_activities_target_user ON activities(target_user_id, created_at DESC);

-- 通知系统索引
CREATE INDEX idx_notifications_user_id ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_is_read ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX idx_notifications_type ON notifications(type, created_at DESC);
CREATE INDEX idx_notifications_sender_id ON notifications(sender_id);

-- 消息系统索引
CREATE INDEX idx_conversations_type ON conversations(type, updated_at DESC);
CREATE INDEX idx_conversation_participants_conversation ON conversation_participants(conversation_id);
CREATE INDEX idx_conversation_participants_user ON conversation_participants(user_id, joined_at DESC);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id, created_at DESC);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);

-- 书签索引
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id, created_at DESC);
CREATE INDEX idx_bookmarks_type ON bookmarks(bookmarkable_type);
CREATE INDEX idx_bookmarks_folder ON bookmarks(user_id, folder);

-- 互动历史索引
CREATE INDEX idx_user_interactions_user ON user_interactions(user_id, created_at DESC);
CREATE INDEX idx_user_interactions_target ON user_interactions(target_user_id, created_at DESC);
CREATE INDEX idx_user_interactions_type ON user_interactions(interaction_type);

-- ============================================================================
-- 创建触发器
-- ============================================================================

-- 自动更新 updated_at 字段
CREATE TRIGGER trigger_user_follows_updated_at
    BEFORE UPDATE ON user_follows
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_activities_updated_at
    BEFORE UPDATE ON activities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_activity_comments_updated_at
    BEFORE UPDATE ON activity_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_notification_preferences_updated_at
    BEFORE UPDATE ON notification_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_conversations_updated_at
    BEFORE UPDATE ON conversations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_bookmarks_updated_at
    BEFORE UPDATE ON bookmarks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 添加表注释
-- ============================================================================

COMMENT ON TABLE user_follows IS '用户关注关系表';
COMMENT ON TABLE follow_requests IS '关注请求表';
COMMENT ON TABLE activities IS '用户活动/动态表';
COMMENT ON TABLE activity_likes IS '动态点赞表';
COMMENT ON TABLE activity_comments IS '动态评论表';
COMMENT ON TABLE notifications IS '通知表';
COMMENT ON TABLE notification_preferences IS '用户通知偏好设置表';
COMMENT ON TABLE conversations IS '会话表';
COMMENT ON TABLE conversation_participants IS '会话参与者表';
COMMENT ON TABLE messages IS '消息表';
COMMENT ON TABLE message_read_status IS '消息阅读状态表';
COMMENT ON TABLE bookmarks IS '用户书签表';
COMMENT ON TABLE user_interactions IS '用户互动历史表';

-- 社交功能表结构创建完成
