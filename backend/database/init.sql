-- ============================================
-- CyberPress Platform - 初始化数据
-- ============================================
-- 默认数据和示例内容
-- ============================================

-- ============================================
-- 1. 插入示例分类
-- ============================================

INSERT INTO `wp_terms` (`term_id`, `name`, `slug`, `term_group`)
VALUES
  (1, 'Technology', 'technology', 0),
  (2, 'Development', 'development', 0),
  (3, 'Design', 'design', 0),
  (4, 'Tutorials', 'tutorials', 0),
  (5, 'Cyberpunk', 'cyberpunk', 0)
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO `wp_term_taxonomy` (`term_id`, `taxonomy`, `description`, `parent`, `count`)
VALUES
  (1, 'category', 'Technology news and insights', 0, 0),
  (2, 'category', 'Development tutorials and best practices', 0, 0),
  (3, 'category', 'Design principles and UI/UX', 0, 0),
  (4, 'category', 'Step-by-step tutorials', 0, 0),
  (5, 'category', 'Cyberpunk culture and aesthetics', 0, 0)
ON DUPLICATE KEY UPDATE description=VALUES(description);

-- ============================================
-- 2. 插入示例标签
-- ============================================

INSERT INTO `wp_terms` (`term_id`, `name`, `slug`, `term_group`)
VALUES
  (101, 'React', 'react', 0),
  (102, 'Next.js', 'nextjs', 0),
  (103, 'TypeScript', 'typescript', 0),
  (104, 'Tailwind CSS', 'tailwindcss', 0),
  (105, 'WordPress', 'wordpress', 0),
  (106, 'Web Development', 'web-development', 0),
  (107, 'UI/UX', 'ui-ux', 0),
  (108, 'Performance', 'performance', 0),
  (109, 'Security', 'security', 0),
  (110, 'API', 'api', 0)
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO `wp_term_taxonomy` (`term_id`, `taxonomy`, `description`, `parent`, `count`)
VALUES
  (101, 'post_tag', 'React framework and library', 0, 0),
  (102, 'post_tag', 'Next.js framework', 0, 0),
  (103, 'post_tag', 'TypeScript language', 0, 0),
  (104, 'post_tag', 'Tailwind CSS framework', 0, 0),
  (105, 'post_tag', 'WordPress CMS', 0, 0),
  (106, 'post_tag', 'Web development topics', 0, 0),
  (107, 'post_tag', 'User interface and experience', 0, 0),
  (108, 'post_tag', 'Performance optimization', 0, 0),
  (109, 'post_tag', 'Security best practices', 0, 0),
  (110, 'post_tag', 'API development', 0, 0)
ON DUPLICATE KEY UPDATE description=VALUES(description);

-- ============================================
-- 3. 插入示例文章
-- ============================================

INSERT INTO `wp_posts` (`ID`, `post_author`, `post_date`, `post_date_gmt`, `post_content`, `post_title`, `post_excerpt`, `post_status`, `comment_status`, `ping_status`, `post_password`, `post_name`, `to_ping`, `pinged`, `post_modified`, `post_modified_gmt`, `post_content_filtered`, `post_parent`, `guid`, `menu_order`, `post_type`, `post_mime_type`, `comment_count`)
VALUES
  (1, 1, NOW(), UTC_TIMESTAMP(), '<!-- wp:paragraph -->\n<p>Welcome to CyberPress Platform! This is your first post. Edit or delete it, then start writing!</p>\n<!-- /wp:paragraph -->', 'Welcome to CyberPress', 'Welcome to your new cyberpunk-themed blog platform!', 'publish', 'open', 'open', '', 'welcome-to-cyberpress', '', '', NOW(), UTC_TIMESTAMP(), '', 0, '', 0, 'post', '', 0),

  (2, 1, NOW(), UTC_TIMESTAMP(), '<!-- wp:paragraph -->\n<p>Next.js 14 introduces powerful new features for building modern web applications. Learn about the App Router, Server Components, and more.</p>\n<!-- /wp:paragraph -->', 'Getting Started with Next.js 14', 'A comprehensive guide to Next.js 14 and its revolutionary features.', 'publish', 'open', 'open', '', 'getting-started-with-nextjs-14', '', '', NOW(), UTC_TIMESTAMP(), '', 0, '', 0, 'post', '', 0),

  (3, 1, NOW(), UTC_TIMESTAMP(), '<!-- wp:paragraph -->\n<p>TypeScript has become essential for modern web development. Discover advanced types, generics, and patterns that will level up your code.</p>\n<!-- /wp:paragraph -->', 'Advanced TypeScript Patterns', 'Master advanced TypeScript patterns and write type-safe code.', 'publish', 'open', 'open', '', 'advanced-typescript-patterns', '', '', NOW(), UTC_TIMESTAMP(), '', 0, '', 0, 'post', '', 0),

  (4, 1, NOW(), UTC_TIMESTAMP(), '<!-- wp:paragraph -->\n<p>Building a cyberpunk-themed interface requires careful attention to visual effects, color schemes, and animations. Let‘s explore the techniques.</p>\n<!-- /wp:paragraph -->', 'Creating Cyberpunk UI Effects', 'Learn how to create stunning cyberpunk visual effects in web applications.', 'publish', 'open', 'open', '', 'creating-cyberpunk-ui-effects', '', '', NOW(), UTC_TIMESTAMP(), '', 0, '', 0, 'post', '', 0),

  (5, 1, NOW(), UTC_TIMESTAMP(), '<!-- wp:paragraph -->\n<p>Performance is crucial for user experience. Discover optimization strategies for Next.js applications.</p>\n<!-- /wp:paragraph -->', 'Optimizing Next.js Performance', 'Best practices for making your Next.js app lightning fast.', 'publish', 'open', 'open', '', 'optimizing-nextjs-performance', '', '', NOW(), UTC_TIMESTAMP(), '', 0, '', 0, 'post', '', 0)
ON DUPLICATE KEY UPDATE post_title=VALUES(post_title);

-- ============================================
-- 4. 关联分类和标签到文章
-- ============================================

-- 关联分类
INSERT INTO `wp_term_relationships` (`object_id`, `term_taxonomy_id`, `term_order`)
VALUES
  (1, 1, 0),
  (2, 2, 0),
  (3, 2, 0),
  (4, 3, 0),
  (5, 4, 0)
ON DUPLICATE KEY UPDATE term_order=VALUES(term_order);

-- 关联标签
INSERT INTO `wp_term_relationships` (`object_id`, `term_taxonomy_id`, `term_order`)
VALUES
  (2, 102, 0),
  (2, 101, 0),
  (3, 103, 0),
  (3, 106, 0),
  (4, 107, 0),
  (4, 104, 0),
  (5, 102, 0),
  (5, 108, 0)
ON DUPLICATE KEY UPDATE term_order=VALUES(term_order);

-- 更新分类计数
UPDATE `wp_term_taxonomy` SET count = (
  SELECT COUNT(*) FROM `wp_term_relationships`
  WHERE term_taxonomy_id = `wp_term_taxonomy`.term_taxonomy_id
);

-- ============================================
-- 5. 插入示例项目
-- ============================================

INSERT INTO `wp_posts` (`ID`, `post_author`, `post_date`, `post_date_gmt`, `post_content`, `post_title`, `post_excerpt`, `post_status`, `comment_status`, `ping_status`, `post_password`, `post_name`, `to_ping`, `pinged`, `post_modified`, `post_modified_gmt`, `post_content_filtered`, `post_parent`, `guid`, `menu_order`, `post_type`, `post_mime_type`, `comment_count`)
VALUES
  (100, 1, NOW(), UTC_TIMESTAMP(), '<!-- wp:paragraph -->\n<p>A modern blog platform built with Next.js 14, featuring a cyberpunk aesthetic and cutting-edge web technologies.</p>\n<!-- /wp:paragraph -->', 'CyberPress Platform', 'A headless WordPress + Next.js cyberpunk blog platform', 'publish', 'closed', 'closed', '', 'cyberpress-platform', '', '', NOW(), UTC_TIMESTAMP(), '', 0, '', 0, 'project', '', 0),

  (101, 1, NOW(), UTC_TIMESTAMP(), '<!-- wp:paragraph -->\n<p>An e-commerce platform with real-time inventory management and AI-powered product recommendations.</p>\n<!-- /wp:paragraph -->', 'NeonShop', 'Next-gen e-commerce experience', 'publish', 'closed', 'closed', '', 'neonshop', '', '', NOW(), UTC_TIMESTAMP(), '', 0, '', 0, 'project', '', 0),

  (102, 1, NOW(), UTC_TIMESTAMP(), '<!-- wp:paragraph -->\n<p>A task management app with beautiful animations and intuitive gesture controls.</p>\n<!-- /wp:paragraph -->', 'TaskFlow', 'Collaborative task management', 'publish', 'closed', 'closed', '', 'taskflow', '', '', NOW(), UTC_TIMESTAMP(), '', 0, '', 0, 'project', '', 0)
ON DUPLICATE KEY UPDATE post_title=VALUES(post_title);

-- 插入项目元数据
INSERT INTO `wp_cyberpress_projects` (`post_id`, `project_type`, `client_name`, `project_date`, `project_url`, `github_url`, `technologies`, `featured`, `sort_order`)
VALUES
  (100, 'Web Application', NULL, '2024-01-01', 'https://cyberpress.dev', 'https://github.com/cyberpress/platform', '["Next.js", "TypeScript", "Tailwind CSS", "WordPress"]', 1, 1),
  (101, 'E-Commerce', 'CyberCorp', '2024-02-01', 'https://neonshop.com', 'https://github.com/neonshop/app', '["React", "Node.js", "MongoDB", "Stripe"]', 1, 2),
  (102, 'SaaS', NULL, '2024-03-01', 'https://taskflow.io', 'https://github.com/taskflow/app', '["Vue.js", "Firebase", "Tailwind CSS"]', 0, 3)
ON DUPLICATE KEY UPDATE project_type=VALUES(project_type);

-- ============================================
-- 6. 插入示例页面
-- ============================================

INSERT INTO `wp_posts` (`ID`, `post_author`, `post_date`, `post_date_gmt`, `post_content`, `post_title`, `post_excerpt`, `post_status`, `comment_status`, `ping_status`, `post_password`, `post_name`, `to_ping`, `pinged`, `post_modified`, `post_modified_gmt`, `post_content_filtered`, `post_parent`, `guid`, `menu_order`, `post_type`, `post_mime_type`, `comment_count`)
VALUES
  (10, 1, NOW(), UTC_TIMESTAMP(), '<!-- wp:paragraph -->\n<p>Welcome to the digital frontier. I‘m a developer passionate about creating immersive web experiences with cutting-edge technologies.</p>\n<!-- /wp:paragraph -->\n<!-- wp:heading {"level":2} -->\n<h2 class="wp-block-heading">Skills</h2>\n<!-- /wp:heading -->\n<!-- wp:list -->\n<ul><li>Frontend Development</li><li>Backend Architecture</li><li>UI/UX Design</li><li>Performance Optimization</li></ul>\n<!-- /wp:list -->', 'About', 'Learn more about me and my work', 'publish', 'closed', 'open', '', 'about', '', '', NOW(), UTC_TIMESTAMP(), '', 0, '', 0, 'page', '', 0),

  (11, 1, NOW(), UTC_TIMESTAMP(), '<!-- wp:paragraph -->\n<p>Get in touch! I‘m always open to discussing new projects, creative ideas, or opportunities to be part of your visions.</p>\n<!-- /wp:paragraph -->', 'Contact', 'Let‘s connect', 'publish', 'closed', 'open', '', 'contact', '', '', NOW(), UTC_TIMESTAMP(), '', 0, '', 0, 'page', '', 0),

  (12, 1, NOW(), UTC_TIMESTAMP(), '<!-- wp:paragraph -->\n<p>Explore my collection of projects, experiments, and creative work.</p>\n<!-- /wp:paragraph -->', 'Portfolio', 'My work and projects', 'publish', 'closed', 'open', '', 'portfolio', '', '', NOW(), UTC_TIMESTAMP(), '', 0, '', 0, 'page', '', 0)
ON DUPLICATE KEY UPDATE post_title=VALUES(post_title);

-- ============================================
-- 7. 插入示例评论
-- ============================================

INSERT INTO `wp_comments` (`comment_ID`, `comment_post_ID`, `comment_author`, `comment_author_email`, `comment_author_url`, `comment_author_IP`, `comment_date`, `comment_date_gmt`, `comment_content`, `comment_karma`, `comment_approved`, `comment_agent`, `comment_type`, `comment_parent`, `user_id`)
VALUES
  (1, 1, 'Cyber Visitor', 'visitor@cyber.net', '', '127.0.0.1', NOW(), UTC_TIMESTAMP(), 'Great platform! Love the cyberpunk aesthetic. 🌟', 0, '1', '', '', 0, 0),
  (2, 2, 'Dev Enthusiast', 'dev@example.com', '', '127.0.0.1', NOW(), UTC_TIMESTAMP(), 'This tutorial helped me understand Next.js 14 better. Thanks!', 0, '1', '', '', 0, 0),
  (3, 4, 'UI Designer', 'designer@example.com', '', '127.0.0.1', NOW(), UTC_TIMESTAMP(), 'The cyberpunk effects are amazing! Can you share more details?', 0, '1', '', '', 0, 0)
ON DUPLICATE KEY UPDATE comment_content=VALUES(comment_content);

-- 更新文章评论计数
UPDATE `wp_posts` SET `comment_count` = (
  SELECT COUNT(*) FROM `wp_comments` WHERE `comment_post_ID` = `wp_posts`.ID AND `comment_approved` = '1'
);

-- ============================================
-- 8. 插入示例 SEO 元数据
-- ============================================

INSERT INTO `wp_cyberpress_seo_meta` (`post_id`, `meta_title`, `meta_description`, `meta_keywords`, `priority`, `change_frequency`)
VALUES
  (1, 'CyberPress Platform - Welcome', 'Welcome to CyberPress Platform - A modern blog with cyberpunk aesthetics', 'cyberpress, blog, nextjs, wordpress', 1.0, 'daily'),
  (2, 'Getting Started with Next.js 14 - Complete Guide', 'Learn Next.js 14 from scratch. App Router, Server Components, and more explained.', 'nextjs, nextjs 14, react, tutorial', 0.9, 'weekly'),
  (3, 'Advanced TypeScript Patterns for Better Code', 'Master advanced TypeScript patterns, generics, and type-safe development practices.', 'typescript, types, patterns, tutorial', 0.8, 'weekly'),
  (4, 'Creating Cyberpunk UI Effects - Web Design Guide', 'Learn to create stunning cyberpunk visual effects in your web applications.', 'cyberpunk, ui, effects, design', 0.8, 'monthly'),
  (5, 'Optimizing Next.js Performance - Best Practices', 'Make your Next.js application lightning fast with these optimization techniques.', 'nextjs, performance, optimization', 0.8, 'monthly')
ON DUPLICATE KEY UPDATE meta_title=VALUES(meta_title);

-- ============================================
-- 9. 插入示例订阅者
-- ============================================

INSERT INTO `wp_cyberpress_subscribers` (`email`, `name`, `status`, `confirmation_token`)
VALUES
  ('subscriber1@example.com', 'Early Adopter', 'active', NULL),
  ('subscriber2@example.com', 'Tech Enthusiast', 'active', NULL),
  ('subscriber3@example.com', NULL, 'pending', 'token_' || MD5(RAND()))
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- ============================================
-- 10. 插入一些初始浏览量
-- ============================================

INSERT INTO `wp_cyberpress_views` (`post_id`, `view_date`, `view_count`)
VALUES
  (1, CURDATE() - INTERVAL 7 DAY, FLOOR(100 + RAND() * 50)),
  (1, CURDATE() - INTERVAL 6 DAY, FLOOR(80 + RAND() * 40)),
  (1, CURDATE() - INTERVAL 5 DAY, FLOOR(120 + RAND() * 60)),
  (2, CURDATE() - INTERVAL 4 DAY, FLOOR(150 + RAND() * 70)),
  (2, CURDATE() - INTERVAL 3 DAY, FLOOR(180 + RAND() * 80)),
  (3, CURDATE() - INTERVAL 2 DAY, FLOOR(90 + RAND() * 45)),
  (4, CURDATE() - INTERVAL 1 DAY, FLOOR(110 + RAND() * 55)),
  (5, CURDATE(), FLOOR(130 + RAND() * 65))
ON DUPLICATE KEY UPDATE view_count = view_count + VALUES(view_count);

-- ============================================
-- 11. 插入一些点赞
-- ============================================

INSERT INTO `wp_cyberpress_likes` (`post_id`, `user_id`, `ip_address`)
VALUES
  (1, NULL, '192.168.1.1'),
  (1, NULL, '192.168.1.2'),
  (2, NULL, '192.168.1.3'),
  (2, NULL, '192.168.1.4'),
  (2, NULL, '192.168.1.5'),
  (3, NULL, '192.168.1.6'),
  (4, NULL, '192.168.1.7'),
  (5, NULL, '192.168.1.8'),
  (5, NULL, '192.168.1.9')
ON DUPLICATE KEY UPDATE ip_address=VALUES(ip_address);

-- ============================================
-- 12. 插入示例活动日志
-- ============================================

INSERT INTO `wp_cyberpress_activity_logs` (`user_id`, `action`, `object_type`, `object_id`, `ip_address`)
VALUES
  (1, 'post_published', 'post', 1, '127.0.0.1'),
  (1, 'post_published', 'post', 2, '127.0.0.1'),
  (1, 'post_published', 'post', 3, '127.0.0.1'),
  (1, 'project_created', 'project', 100, '127.0.0.1'),
  (1, 'comment_received', 'comment', 1, '127.0.0.1')
ON DUPLICATE KEY UPDATE action=VALUES(action);

-- ============================================
-- 完成
-- ============================================

-- 显示统计信息
SELECT 'Database initialization complete!' as message;
SELECT COUNT(*) as categories FROM wp_term_taxonomy WHERE taxonomy = 'category';
SELECT COUNT(*) as tags FROM wp_term_taxonomy WHERE taxonomy = 'post_tag';
SELECT COUNT(*) as posts FROM wp_posts WHERE post_type = 'post' AND post_status = 'publish';
SELECT COUNT(*) as projects FROM wp_posts WHERE post_type = 'project' AND post_status = 'publish';
SELECT COUNT(*) as pages FROM wp_posts WHERE post_type = 'page' AND post_status = 'publish';
SELECT COUNT(*) as comments FROM wp_comments WHERE comment_approved = '1';
SELECT COUNT(*) as subscribers FROM wp_cyberpress_subscribers WHERE status = 'active';
