-- =====================================================
-- Migration: 002_add_performance_indexes
-- =====================================================
-- Version: 1.0.1
-- Created: 2026-03-02
-- Description: 添加性能优化索引
-- =====================================================

-- 记录本次迁移
INSERT INTO `migrations` (`migration`, `batch`)
VALUES ('002_add_performance_indexes', 2);

-- =====================================================
-- 文章表性能优化索引
-- =====================================================

-- 作者文章列表索引
ALTER TABLE `posts`
ADD INDEX `idx_author_status_published` (`author_id`, `status`, `published_at` DESC);

-- 热门文章索引
ALTER TABLE `posts`
ADD INDEX `idx_status_type_views_published` (`status`, `post_type`, `view_count` DESC, `published_at` DESC);

-- 已发布文章索引
ALTER TABLE `posts`
ADD INDEX `idx_status_type_published` (`status`, `post_type`, `published_at` DESC);

-- =====================================================
-- 评论表性能优化索引
-- =====================================================

-- 文章评论（嵌套显示）
ALTER TABLE `comments`
ADD INDEX `idx_post_status_parent_created` (`post_id`, `status`, `parent_id`, `created_at` DESC);

-- 评论回复
ALTER TABLE `comments`
ADD INDEX `idx_parent_status_created` (`parent_id`, `status`, `created_at` ASC);

-- 待审核评论
ALTER TABLE `comments`
ADD INDEX `idx_status_created` (`status`, `created_at` DESC);

-- =====================================================
-- 分类表性能优化索引
-- =====================================================

-- 热门标签
ALTER TABLE `categories`
ADD INDEX `idx_type_count_sort` (`type`, `count` DESC, `sort_order`);

-- =====================================================
-- 作品集性能优化索引
-- =====================================================

-- 精选作品
ALTER TABLE `portfolio_items`
ADD INDEX `idx_featured_status_sort_published` (`featured`, `status`, `sort_order`, `published_at` DESC);

-- =====================================================
-- 分析数据表性能优化索引
-- =====================================================

-- 全站访问统计
ALTER TABLE `analytics`
ADD INDEX `idx_date_views` (`date`, `views`, `visitors`);

-- =====================================================
-- 创建视图
-- =====================================================

-- 文章列表视图（包含作者信息）
CREATE OR REPLACE VIEW `v_post_list` AS
SELECT
  p.*,
  u.username AS author_username,
  u.first_name AS author_first_name,
  u.last_name AS author_last_name,
  u.avatar_url AS author_avatar,
  GROUP_CONCAT(DISTINCT c.name ORDER BY c.name SEPARATOR ',') AS category_names,
  COUNT(DISTINCT cm.id) AS comment_count
FROM posts p
LEFT JOIN users u ON p.author_id = u.id
LEFT JOIN post_categories pc ON p.id = pc.post_id
LEFT JOIN categories c ON pc.category_id = c.id AND c.type = 'category'
LEFT JOIN comments cm ON p.id = cm.post_id AND cm.status = 'approved'
GROUP BY p.id;

-- 热门文章视图
CREATE OR REPLACE VIEW `v_popular_posts` AS
SELECT
  p.*,
  u.username AS author_username,
  COUNT(DISTINCT cm.id) AS comment_count
FROM posts p
LEFT JOIN users u ON p.author_id = u.id
LEFT JOIN comments cm ON p.id = cm.post_id AND cm.status = 'approved'
WHERE p.status = 'publish' AND p.post_type = 'post'
GROUP BY p.id
ORDER BY p.view_count DESC, p.published_at DESC
LIMIT 100;

-- 分类统计视图
CREATE OR REPLACE VIEW `v_category_stats` AS
SELECT
  c.id,
  c.name,
  c.slug,
  c.type,
  c.description,
  c.count AS post_count,
  COUNT(DISTINCT pc.post_id) AS actual_post_count
FROM categories c
LEFT JOIN post_categories pc ON c.id = pc.category_id
GROUP BY c.id;

-- =====================================================
-- 创建存储过程
-- =====================================================

DELIMITER //

-- 更新文章浏览次数
CREATE PROCEDURE `sp_increment_post_views`(IN post_id_param BIGINT)
BEGIN
  DECLARE post_exists INT;

  -- 检查文章是否存在
  SELECT COUNT(*) INTO post_exists FROM posts WHERE id = post_id_param;

  IF post_exists > 0 THEN
    -- 更新浏览计数
    UPDATE posts
    SET view_count = view_count + 1
    WHERE id = post_id_param;

    -- 更新每日统计
    INSERT INTO analytics (date, post_id, views, visitors, unique_visitors)
    VALUES (CURDATE(), post_id_param, 1, 1, 1)
    ON DUPLICATE KEY UPDATE
      views = views + 1,
      visitors = visitors + 1,
      unique_visitors = unique_visitors + 1;
  END IF;
END //

-- 更新分类文章数
CREATE PROCEDURE `sp_update_category_counts`()
BEGIN
  UPDATE categories c
  SET c.count = (
    SELECT COUNT(*)
    FROM post_categories pc
    JOIN posts p ON pc.post_id = p.id
    WHERE pc.category_id = c.id AND p.status = 'publish'
  );
END //

-- 清理过期数据
CREATE PROCEDURE `sp_cleanup_old_data`(IN days_to_keep INT)
BEGIN
  DECLARE deleted_count INT DEFAULT 0;

  -- 清理已删除的文章
  DELETE FROM posts
  WHERE status = 'trash'
  AND updated_at < DATE_SUB(NOW(), INTERVAL days_to_keep DAY);

  SET deleted_count = ROW_COUNT();

  -- 清理垃圾评论
  DELETE FROM comments
  WHERE status = 'trash'
  AND updated_at < DATE_SUB(NOW(), INTERVAL days_to_keep DAY);

  SET deleted_count = deleted_count + ROW_COUNT();

  -- 返回删除的数量
  SELECT deleted_count AS deleted_rows;
END //

-- 批量更新文章状态
CREATE PROCEDURE `sp_bulk_update_post_status`(
  IN post_ids TEXT,
  IN new_status VARCHAR(20)
)
BEGIN
  DECLARE done INT DEFAULT FALSE;
  DECLARE post_id BIGINT;
  DECLARE cur CURSOR FOR
    SELECT CAST(TRIM(value) AS UNSIGNED)
    FROM JSON_TABLE(
      CONCAT('["', REPLACE(post_ids, ',', '","'), '"]'),
      '$[*]' COLUMNS(value VARCHAR(20) PATH '$')
    ) AS ids;
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

  OPEN cur;

  read_loop: LOOP
    FETCH cur INTO post_id;
    IF done THEN
      LEAVE read_loop;
    END IF;

    UPDATE posts
    SET status = new_status
    WHERE id = post_id;
  END LOOP;

  CLOSE cur;

  SELECT ROW_COUNT() AS updated_count;
END //

DELIMITER ;

-- =====================================================
-- 创建触发器
-- =====================================================

DELIMITER //

-- 文章发布后自动更新分类计数
CREATE TRIGGER `tr_post_published_update_category`
AFTER UPDATE ON posts
FOR EACH ROW
BEGIN
  IF NEW.status = 'publish' AND OLD.status != 'publish' THEN
    CALL sp_update_category_counts();
  END IF;
END //

-- 新增分类关联后更新计数
CREATE TRIGGER `tr_category_added_update_count`
AFTER INSERT ON post_categories
FOR EACH ROW
BEGIN
  CALL sp_update_category_counts();
END //

-- 删除分类关联后更新计数
CREATE TRIGGER `tr_category_removed_update_count`
AFTER DELETE ON post_categories
FOR EACH ROW
BEGIN
  CALL sp_update_category_counts();
END //

DELIMITER ;

-- =====================================================
-- 完成标记
-- =====================================================
SELECT 'Migration 002_add_performance_indexes completed successfully!' AS message;
