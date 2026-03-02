#!/bin/bash

# CyberPress Platform - 初始化演示数据脚本
# 用于快速创建演示用的文章、分类、标签等数据

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印信息
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# 检查 Docker 是否运行
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker 未运行，请先启动 Docker"
        exit 1
    fi
    print_success "Docker 运行正常"
}

# 检查数据库连接
check_database() {
    print_info "检查数据库连接..."

    # 等待数据库就绪
    max_attempts=30
    attempt=0

    while [ $attempt -lt $max_attempts ]; do
        if docker exec cyberpress-postgres pg_isready -U cyberpress -d cyberpress > /dev/null 2>&1; then
            print_success "数据库连接成功"
            return 0
        fi

        attempt=$((attempt + 1))
        echo -n "."
        sleep 1
    done

    print_error "数据库连接失败"
    exit 1
}

# 创建演示数据
create_demo_data() {
    print_info "开始创建演示数据..."

    # 创建分类
    print_info "创建分类..."
    docker exec -i cyberpress-postgres psql -U cyberpress -d cyberpress << EOF
INSERT INTO categories (name, slug, description, sort_order) VALUES
    ('技术教程', 'tech-tutorials', '编程和技术相关的教程文章', 1),
    ('产品思考', 'product-thinking', '关于产品设计和思考的文章', 2),
    ('生活随笔', 'life-essays', '日常生活和随笔记录', 3),
    ('开源项目', 'open-source', '开源项目相关的内容', 4)
ON CONFLICT (slug) DO NOTHING;
EOF

    # 创建标签
    print_info "创建标签..."
    docker exec -i cyberpress-postgres psql -U cyberpress -d cyberpress << EOF
INSERT INTO tags (name, slug) VALUES
    ('React', 'react'),
    ('Next.js', 'nextjs'),
    ('TypeScript', 'typescript'),
    ('Node.js', 'nodejs'),
    ('数据库', 'database'),
    ('DevOps', 'devops'),
    ('UI/UX', 'ui-ux'),
    ('AI', 'artificial-intelligence')
ON CONFLICT (slug) DO NOTHING;
EOF

    # 创建演示用户
    print_info "创建演示用户..."
    docker exec -i cyberpress-postgres psql -U cyberpress -d cyberpress << EOF
INSERT INTO users (username, email, password_hash, display_name, bio, role) VALUES
    ('admin', 'admin@cyberpress.dev', '\$2b\$10\$abcdefghijklmnopqrstuvwxyz', '管理员', '系统管理员', 'admin'),
    ('author', 'author@cyberpress.dev', '\$2b\$10\$abcdefghijklmnopqrstuvwxyz', '作者', '内容创作者', 'author')
ON CONFLICT (username) DO NOTHING;
EOF

    # 创建演示文章
    print_info "创建演示文章..."
    docker exec -i cyberpress-postgres psql -U cyberpress -d cyberpress << EOF
-- 获取分类和用户ID
DO \$\$
DECLARE
    v_category_id INT;
    v_author_id INT;
BEGIN
    SELECT id INTO v_category_id FROM categories WHERE slug = 'tech-tutorials' LIMIT 1;
    SELECT id INTO v_author_id FROM users WHERE username = 'author' LIMIT 1;

    IF v_category_id IS NOT NULL AND v_author_id IS NOT NULL THEN
        -- 插入演示文章
        INSERT INTO posts (
            author_id,
            title,
            slug,
            excerpt,
            content,
            status,
            post_type,
            is_featured,
            published_at
        ) VALUES
            (v_author_id, 'Next.js 14 App Router 完全指南', 'nextjs-14-app-router-guide',
             E'Next.js 14 的 App Router 带来了许多新特性，本文将详细介绍如何使用这些特性构建现代化的 Web 应用。\n\n包括服务端组件、客户端组件、路由、布局等内容。',
             E'<h1>Next.js 14 App Router 完全指南</h1>\n\n<p>Next.js 14 的 App Router 带来了许多新特性...</p>',
             'publish', 'post', true, NOW()),

            (v_author_id, 'TypeScript 最佳实践', 'typescript-best-practices',
             E'在日常开发中，遵循 TypeScript 的最佳实践可以帮助我们写出更健壮、更易维护的代码。',
             E'<h1>TypeScript 最佳实践</h1>\n\n<p>TypeScript 是 JavaScript 的超集...</p>',
             'publish', 'post', false, NOW()),

            (v_author_id, 'PostgreSQL 性能优化技巧', 'postgresql-performance-tips',
             E'本文分享一些 PostgreSQL 数据库性能优化的实用技巧，帮助你提升应用性能。',
             E'<h1>PostgreSQL 性能优化技巧</h1>\n\n<p>PostgreSQL 是强大的开源数据库...</p>',
             'publish', 'post', true, NOW());

        -- 关联文章和分类
        INSERT INTO post_categories (post_id, category_id)
        SELECT p.id, v_category_id
        FROM posts p
        WHERE p.slug IN ('nextjs-14-app-router-guide', 'typescript-best-practices', 'postgresql-performance-tips')
        ON CONFLICT DO NOTHING;

        -- 关联文章和标签
        INSERT INTO post_tags (post_id, tag_id)
        SELECT p.id, t.id
        FROM posts p
        CROSS JOIN tags t
        WHERE p.slug = 'nextjs-14-app-router-guide' AND t.slug IN ('nextjs', 'react', 'typescript')
        ON CONFLICT DO NOTHING;

        INSERT INTO post_tags (post_id, tag_id)
        SELECT p.id, t.id
        FROM posts p
        CROSS JOIN tags t
        WHERE p.slug = 'typescript-best-practices' AND t.slug IN ('typescript')
        ON CONFLICT DO NOTHING;

        INSERT INTO post_tags (post_id, tag_id)
        SELECT p.id, t.id
        FROM posts p
        CROSS JOIN tags t
        WHERE p.slug = 'postgresql-performance-tips' AND t.slug IN ('database')
        ON CONFLICT DO NOTHING;
    END IF;
END \$\$;
EOF

    print_success "演示数据创建完成"
}

# 创建演示评论
create_demo_comments() {
    print_info "创建演示评论..."

    docker exec -i cyberpress-postgres psql -U cyberpress -d cyberpress << EOF
DO \$\$
DECLARE
    v_post_id INT;
    v_user_id INT;
BEGIN
    SELECT id INTO v_post_id FROM posts WHERE slug = 'nextjs-14-app-router-guide' LIMIT 1;
    SELECT id INTO v_user_id FROM users WHERE username = 'admin' LIMIT 1;

    IF v_post_id IS NOT NULL THEN
        INSERT INTO comments (post_id, author_id, author_name, author_email, content, status)
        VALUES
            (v_post_id, v_user_id, '管理员', 'admin@cyberpress.dev',
             E'这篇文章写得很详细，App Router 确实是个很棒的改进！', 'approved'),

            (v_post_id, NULL, '访客', 'visitor@example.com',
             E'期待后续更多关于 Server Actions 的内容。', 'approved');
    END IF;
END \$\$;
EOF

    print_success "演示评论创建完成"
}

# 主函数
main() {
    echo ""
    echo "=========================================="
    echo "  CyberPress Platform - 初始化演示数据"
    echo "=========================================="
    echo ""

    check_docker
    check_database
    create_demo_data
    create_demo_comments

    echo ""
    print_success "所有演示数据初始化完成！"
    echo ""
    print_info "演示账号："
    echo "  - 管理员: admin / admin123"
    echo "  - 作者: author / password"
    echo ""
}

# 运行主函数
main
