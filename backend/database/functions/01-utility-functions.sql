-- CyberPress Platform - 数据库函数和存储过程
-- 实用工具函数集合

-- ============================================
-- 字符串处理函数
-- ============================================

-- 生成 URL 友好的 slug
CREATE OR REPLACE FUNCTION generate_slug(input_text TEXT)
RETURNS TEXT AS $$
DECLARE
    clean_text TEXT;
    slug TEXT;
BEGIN
    -- 转小写
    clean_text := lower(input_text);

    -- 移除特殊字符，保留字母数字和连字符
    clean_text := regexp_replace(clean_text, '[^a-z0-9\s-]', '', 'g');

    -- 替换空格和多个连字符为单个连字符
    clean_text := regexp_replace(trim(clean_text), '[\s-]+', '-', 'g');

    -- 限制长度
    slug := substring(clean_text FROM 1 FOR 100);

    RETURN slug;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 生成唯一 slug
CREATE OR REPLACE FUNCTION generate_unique_slug(
    input_text TEXT,
    table_name TEXT,
    column_name TEXT DEFAULT 'slug'
)
RETURNS TEXT AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 0;
    exists_count INTEGER;
BEGIN
    base_slug := generate_slug(input_text);
    final_slug := base_slug;

    -- 检查是否存在重复
    EXECUTE format(
        'SELECT COUNT(*) FROM %I WHERE %I = $1',
        table_name, column_name
    ) INTO exists_count USING final_slug;

    -- 如果存在重复，添加数字后缀
    WHILE exists_count > 0 LOOP
        counter := counter + 1;
        final_slug := base_slug || '-' || counter::TEXT;

        EXECUTE format(
            'SELECT COUNT(*) FROM %I WHERE %I = $1',
            table_name, column_name
        ) INTO exists_count USING final_slug;
    END LOOP;

    RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 文章相关函数
-- ============================================

-- 计算阅读时间（分钟）
CREATE OR REPLACE FUNCTION calculate_reading_time(content TEXT)
RETURNS INTEGER AS $$
DECLARE
    word_count INTEGER;
    reading_time INTEGER;
BEGIN
    -- 移除 Markdown 语法
    content := regexp_replace(content, '#+ ', '', 'g');
    content := regexp_replace(content, '\*\*', '', 'g');
    content := regexp_replace(content, '\*', '', 'g');
    content := regexp_replace(content, '`', '', 'g');
    content := regexp_replace(content, '!\[.*\]\(.*\)', '', 'g');

    -- 计算字数（按空格分词）
    word_count := length(regexp_replace(content, '\s+', ' ', 'g')) -
                  length(replace(content, ' ', '')) + 1;

    -- 假设平均阅读速度为 200 字/分钟
    reading_time := CEIL(word_count::NUMERIC / 200.0)::INTEGER;

    RETURN GREATEST(reading_time, 1); -- 最少 1 分钟
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 增加浏览量
CREATE OR REPLACE FUNCTION increment_post_views(post_id_param BIGINT)
RETURNS INTEGER AS $$
DECLARE
    new_count INTEGER;
BEGIN
    UPDATE posts
    SET view_count = view_count + 1
    WHERE id = post_id_param
    RETURNING view_count INTO new_count;

    RETURN new_count;
END;
$$ LANGUAGE plpgsql;

-- 切换点赞
CREATE OR REPLACE FUNCTION toggle_post_like(
    user_id_param BIGINT,
    post_id_param BIGINT
)
RETURNS JSONB AS $$
DECLARE
    already_liked BOOLEAN;
    new_like_count INTEGER;
BEGIN
    -- 检查是否已点赞
    SELECT EXISTS(
        SELECT 1 FROM likes
        WHERE user_id = user_id_param AND post_id = post_id_param
    ) INTO already_liked;

    IF already_liked THEN
        -- 取消点赞
        DELETE FROM likes
        WHERE user_id = user_id_param AND post_id = post_id_param;

        UPDATE posts
        SET like_count = like_count - 1
        WHERE id = post_id_param;

        new_like_count := (SELECT like_count FROM posts WHERE id = post_id_param);

        RETURN jsonb_build_object(
            'liked', FALSE,
            'like_count', new_like_count
        );
    ELSE
        -- 添加点赞
        INSERT INTO likes (user_id, post_id)
        VALUES (user_id_param, post_id_param);

        UPDATE posts
        SET like_count = like_count + 1
        WHERE id = post_id_param;

        new_like_count := (SELECT like_count FROM posts WHERE id = post_id_param);

        RETURN jsonb_build_object(
            'liked', TRUE,
            'like_count', new_like_count
        );
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 搜索函数
-- ============================================

-- 全文搜索文章
CREATE OR REPLACE FUNCTION search_posts(
    search_query TEXT,
    category_slug VARCHAR DEFAULT NULL,
    tag_slug VARCHAR DEFAULT NULL,
    limit_count INTEGER DEFAULT 20,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
    id BIGINT,
    title VARCHAR,
    slug VARCHAR,
    excerpt TEXT,
    featured_image VARCHAR,
    author_id BIGINT,
    author_name VARCHAR,
    view_count INTEGER,
    like_count INTEGER,
    published_at TIMESTAMP,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.title,
        p.slug,
        p.excerpt,
        p.featured_image,
        p.author_id,
        u.display_name as author_name,
        p.view_count,
        p.like_count,
        p.published_at,
        CASE
            WHEN search_query IS NOT NULL THEN
                ts_rank_cd(
                    to_tsvector('simple', coalesce(p.title, '') || ' ' || coalesce(p.content, '')),
                    plainto_tsquery('simple', search_query)
                )
            ELSE 0
        END as rank
    FROM posts p
    JOIN users u ON p.author_id = u.id
    WHERE p.status = 'publish'
        AND (search_query IS NULL OR
             to_tsvector('simple', coalesce(p.title, '') || ' ' || coalesce(p.content, '')) @@
             plainto_tsquery('simple', search_query))
        AND (category_slug IS NULL OR EXISTS (
            SELECT 1 FROM post_categories pc
            JOIN categories c ON pc.category_id = c.id
            WHERE pc.post_id = p.id AND c.slug = category_slug
        ))
        AND (tag_slug IS NULL OR EXISTS (
            SELECT 1 FROM post_tags pt
            JOIN tags t ON pt.tag_id = t.id
            WHERE pt.post_id = p.id AND t.slug = tag_slug
        ))
    ORDER BY
        CASE WHEN search_query IS NOT NULL THEN rank ELSE 0 END DESC,
        p.published_at DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 统计函数
-- ============================================

-- 获取文章统计数据
CREATE OR REPLACE FUNCTION get_post_stats(post_id_param BIGINT)
RETURNS JSONB AS $$
DECLARE
    stats JSONB;
BEGIN
    SELECT jsonb_build_object(
        'views', view_count,
        'likes', like_count,
        'comments', comment_count,
        'reading_time', calculate_reading_time(content),
        'word_count', length(regexp_replace(content, '\s+', ' ', 'g')) - length(replace(content, ' ', '')) + 1
    ) INTO stats
    FROM posts
    WHERE id = post_id_param;

    RETURN stats;
END;
$$ LANGUAGE plpgsql;

-- 获取用户统计
CREATE OR REPLACE FUNCTION get_user_stats(user_id_param BIGINT)
RETURNS JSONB AS $$
DECLARE
    stats JSONB;
BEGIN
    SELECT jsonb_build_object(
        'posts', (SELECT COUNT(*) FROM posts WHERE author_id = user_id_param AND status = 'publish'),
        'drafts', (SELECT COUNT(*) FROM posts WHERE author_id = user_id_param AND status = 'draft'),
        'comments', (SELECT COUNT(*) FROM comments WHERE author_id = user_id_param AND status = 'approved'),
        'views', COALESCE((SELECT SUM(view_count) FROM posts WHERE author_id = user_id_param), 0),
        'likes', COALESCE((SELECT SUM(like_count) FROM posts WHERE author_id = user_id_param), 0),
        'followers', (SELECT COUNT(*) FROM follows WHERE follower_id = user_id_param),
        'following', (SELECT COUNT(*) FROM follows WHERE following_id = user_id_param)
    ) INTO stats;

    RETURN stats;
END;
$$ LANGUAGE plpgsql;

-- 获取站点统计
CREATE OR REPLACE FUNCTION get_site_stats()
RETURNS JSONB AS $$
DECLARE
    stats JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_posts', (SELECT COUNT(*) FROM posts WHERE status = 'publish'),
        'total_users', (SELECT COUNT(*) FROM users WHERE status = 'active'),
        'total_comments', (SELECT COUNT(*) FROM comments WHERE status = 'approved'),
        'total_views', COALESCE((SELECT SUM(view_count) FROM posts WHERE status = 'publish'), 0),
        'total_likes', COALESCE((SELECT SUM(like_count) FROM posts WHERE status = 'publish'), 0),
        'categories', (SELECT COUNT(*) FROM categories),
        'tags', (SELECT COUNT(*) FROM tags)
    ) INTO stats;

    RETURN stats;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 推荐系统函数
-- ============================================

-- 获取相关文章（基于分类和标签）
CREATE OR REPLACE FUNCTION get_related_posts(
    post_id_param BIGINT,
    limit_count INTEGER DEFAULT 4
)
RETURNS TABLE (
    id BIGINT,
    title VARCHAR,
    slug VARCHAR,
    excerpt TEXT,
    featured_image VARCHAR,
    published_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT
        p.id,
        p.title,
        p.slug,
        p.excerpt,
        p.featured_image,
        p.published_at
    FROM posts p
    WHERE p.id != post_id_param
        AND p.status = 'publish'
        AND (
            -- 相同分类
            EXISTS (
                SELECT 1 FROM post_categories pc1
                JOIN post_categories pc2 ON pc1.category_id = pc2.category_id
                WHERE pc1.post_id = post_id_param AND pc2.post_id = p.id
            )
            OR
            -- 相同标签
            EXISTS (
                SELECT 1 FROM post_tags pt1
                JOIN post_tags pt2 ON pt1.tag_id = pt2.tag_id
                WHERE pt1.post_id = post_id_param AND pt2.post_id = p.id
            )
        )
    ORDER BY
        -- 优先显示相同分类和标签的
        (EXISTS (
            SELECT 1 FROM post_categories pc1
            JOIN post_categories pc2 ON pc1.category_id = pc2.category_id
            WHERE pc1.post_id = post_id_param AND pc2.post_id = p.id
        )::INT +
        EXISTS (
            SELECT 1 FROM post_tags pt1
            JOIN post_tags pt2 ON pt1.tag_id = pt2.tag_id
            WHERE pt1.post_id = post_id_param AND pt2.post_id = p.id
        )::INT) DESC,
        p.published_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- 获取热门文章（基于互动数据）
CREATE OR REPLACE FUNCTION get_trending_posts(
    days_ago INTEGER DEFAULT 7,
    limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
    id BIGINT,
    title VARCHAR,
    slug VARCHAR,
    excerpt TEXT,
    featured_image VARCHAR,
    view_count INTEGER,
    like_count INTEGER,
    comment_count INTEGER,
    score NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.title,
        p.slug,
        p.excerpt,
        p.featured_image,
        p.view_count,
        p.like_count,
        p.comment_count,
        (p.view_count * 0.5 + p.like_count * 1.0 + p.comment_count * 2.0) as score
    FROM posts p
    WHERE p.status = 'publish'
        AND p.published_at >= CURRENT_TIMESTAMP - (days_ago || ' days')::INTERVAL
    ORDER BY score DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 内容管理函数
-- ============================================

-- 清理垃圾评论
CREATE OR REPLACE FUNCTION clean_spam_comments()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    WITH deleted AS (
        DELETE FROM comments
        WHERE status = 'spam'
            AND created_at < CURRENT_TIMESTAMP - INTERVAL '30 days'
        RETURNING 1
    )
    SELECT COUNT(*) INTO deleted_count FROM deleted;

    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- 清理过期会话
CREATE OR REPLACE FUNCTION clean_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    WITH deleted AS (
        DELETE FROM sessions
        WHERE last_activity < CURRENT_TIMESTAMP - INTERVAL '7 days'
        RETURNING 1
    )
    SELECT COUNT(*) INTO deleted_count FROM deleted;

    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- 归档旧分析数据
CREATE OR REPLACE FUNCTION archive_old_analytics(days_to_keep INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
    archived_count INTEGER;
BEGIN
    -- 创建归档表（如果不存在）
    CREATE TABLE IF NOT EXISTS analytics_archive (
        LIKE analytics INCLUDING ALL
    );

    -- 移动旧数据到归档表
    WITH archived AS (
        INSERT INTO analytics_archive
        SELECT * FROM analytics
        WHERE date < CURRENT_DATE - days_to_keep
        RETURNING 1
    )
    SELECT COUNT(*) INTO archived_count FROM archived;

    -- 从主表删除已归档数据
    DELETE FROM analytics
    WHERE date < CURRENT_DATE - days_to_keep;

    RETURN archived_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 通知函数
-- ============================================

-- 创建通知
CREATE OR REPLACE FUNCTION create_notification(
    user_id_param BIGINT,
    type_param VARCHAR,
    title_param VARCHAR,
    content_param TEXT,
    data_param JSONB DEFAULT '{}'
)
RETURNS BIGINT AS $$
DECLARE
    notification_id BIGINT;
BEGIN
    INSERT INTO notifications (user_id, type, title, content, data)
    VALUES (user_id_param, type_param, title_param, content_param, data_param)
    RETURNING id INTO notification_id;

    RETURN notification_id;
END;
$$ LANGUAGE plpgsql;

-- 批量创建通知（评论回复）
CREATE OR REPLACE FUNCTION notify_comment_reply(comment_id_param BIGINT)
RETURNS VOID AS $$
DECLARE
    comment_rec RECORD;
BEGIN
    SELECT * INTO comment_rec
    FROM comments
    WHERE id = comment_id_param;

    IF comment_rec.parent_id IS NOT NULL THEN
        DECLARE
            parent_comment comments;
        BEGIN
            SELECT * INTO parent_comment
            FROM comments
            WHERE id = comment_rec.parent_id;

            IF parent_comment.author_id IS NOT NULL THEN
                PERFORM create_notification(
                    parent_comment.author_id,
                    'comment_reply',
                    'Reply to Your Comment',
                    format('%s replied to your comment', comment_rec.author_name),
                    jsonb_build_object(
                        'comment_id', comment_rec.id,
                        'post_id', comment_rec.post_id
                    )
                );
            END IF;
        END;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 定时任务函数
-- ============================================

-- 每日统计汇总
CREATE OR REPLACE FUNCTION daily_stats_summary()
RETURNS VOID AS $$
BEGIN
    -- 记录每日统计数据
    INSERT INTO analytics (date, metric_type, value)
    SELECT
        CURRENT_DATE,
        'daily_views',
        COALESCE(SUM(view_count), 0)
    FROM posts
    WHERE status = 'publish'
    ON CONFLICT (date, metric_type) DO UPDATE
    SET value = EXCLUDED.value;

    INSERT INTO analytics (date, metric_type, value)
    SELECT
        CURRENT_DATE,
        'daily_likes',
        COALESCE(SUM(like_count), 0)
    FROM posts
    WHERE status = 'publish'
    ON CONFLICT (date, metric_type) DO UPDATE
    SET value = EXCLUDED.value;

    INSERT INTO analytics (date, metric_type, value)
    SELECT
        CURRENT_DATE,
        'daily_comments',
        COUNT(*)
    FROM comments
    WHERE status = 'approved'
    ON CONFLICT (date, metric_type) DO UPDATE
    SET value = EXCLUDED.value;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 辅助函数
-- ============================================

-- 检查用户权限
CREATE OR REPLACE FUNCTION check_user_permission(
    user_id_param BIGINT,
    required_permission VARCHAR
)
RETURNS BOOLEAN AS $$
DECLARE
    user_role VARCHAR;
    role_permissions JSONB;
BEGIN
    -- 获取用户角色
    SELECT role INTO user_role
    FROM users
    WHERE id = user_id_param;

    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;

    -- 管理员拥有所有权限
    IF user_role = 'admin' THEN
        RETURN TRUE;
    END IF;

    -- 获取角色权限
    SELECT permissions INTO role_permissions
    FROM role_permissions
    WHERE role = user_role;

    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;

    -- 检查是否有通配符权限
    IF role_permissions ? '*' THEN
        RETURN TRUE;
    END IF;

    -- 检查具体权限
    RETURN role_permissions ? required_permission;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 测试数据生成函数
-- ============================================

-- 生成随机文章（用于测试）
CREATE OR REPLACE FUNCTION generate_test_post(
    author_id_param BIGINT,
    title_param TEXT,
    content_param TEXT
)
RETURNS BIGINT AS $$
DECLARE
    new_post_id BIGINT;
    new_slug TEXT;
BEGIN
    -- 生成唯一 slug
    new_slug := generate_unique_slug(title_param, 'posts');

    -- 插入文章
    INSERT INTO posts (author_id, title, slug, content, status, published_at)
    VALUES (
        author_id_param,
        title_param,
        new_slug,
        content_param,
        'publish',
        CURRENT_TIMESTAMP
    )
    RETURNING id INTO new_post_id;

    RETURN new_post_id;
END;
$$ LANGUAGE plpgsql;
