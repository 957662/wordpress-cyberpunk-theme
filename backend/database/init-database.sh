#!/bin/bash

# =====================================================
# CyberPress Platform - 数据库初始化脚本
# =====================================================
# 用途：从零开始初始化完整的 PostgreSQL 数据库
# 使用：./init-database.sh [environment]
# 参数：
#   environment - dev, staging, production (默认: dev)
# =====================================================

set -e  # 遇到错误立即退出

# =====================================================
# 配置
# =====================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# 环境配置
ENVIRONMENT=${1:-dev}

# 数据库配置（从环境变量或默认值）
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-cyberpress_db}
DB_USER=${DB_USER:-cyberpress_user}
DB_PASSWORD=${DB_PASSWORD:-cyberpress_pass}

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# =====================================================
# 工具函数
# =====================================================

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_postgres() {
    log_info "检查 PostgreSQL 连接..."

    if ! command -v psql &> /dev/null; then
        log_error "psql 命令未找到，请先安装 PostgreSQL 客户端"
        exit 1
    fi

    if ! PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c '\q' 2>/dev/null; then
        log_error "无法连接到 PostgreSQL 服务器"
        log_info "请检查："
        log_info "  - PostgreSQL 服务是否运行"
        log_info "  - 连接参数是否正确"
        log_info "  - 用户权限是否足够"
        exit 1
    fi

    log_success "PostgreSQL 连接正常"
}

create_database() {
    log_info "创建数据库 $DB_NAME..."

    # 检查数据库是否存在
    if PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
        log_warning "数据库 $DB_NAME 已存在"
        read -p "是否删除并重新创建？(y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            log_info "删除现有数据库..."
            PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "DROP DATABASE $DB_NAME;"
            log_info "创建新数据库..."
            PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "CREATE DATABASE $DB_NAME ENCODING 'UTF8' LC_CTYPE 'en_US.UTF-8' LC_COLLATE 'en_US.UTF-8';"
        else
            log_info "使用现有数据库"
        fi
    else
        PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "CREATE DATABASE $DB_NAME ENCODING 'UTF8' LC_CTYPE 'en_US.UTF-8' LC_COLLATE 'en_US.UTF-8';"
        log_success "数据库创建成功"
    fi
}

run_schema() {
    log_info "执行数据库架构..."

    local schema_file="$SCRIPT_DIR/schema/cyberpress-architecture.sql"

    if [ ! -f "$schema_file" ]; then
        log_error "架构文件不存在: $schema_file"
        exit 1
    fi

    PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$schema_file"

    log_success "数据库架构执行完成"
}

run_migrations() {
    log_info "执行数据库迁移..."

    local migration_file="$SCRIPT_DIR/migrations/migrations.sql"

    if [ ! -f "$migration_file" ]; then
        log_warning "迁移文件不存在: $migration_file"
        return
    fi

    PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$migration_file"

    log_success "数据库迁移执行完成"
}

run_seeds() {
    log_info "执行数据初始化..."

    local seed_file="$SCRIPT_DIR/seeds/seeds.sql"

    if [ ! -f "$seed_file" ]; then
        log_warning "种子数据文件不存在: $seed_file"
        log_info "跳过数据初始化"
        return
    fi

    PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$seed_file"

    log_success "数据初始化完成"
}

create_admin_user() {
    log_info "创建管理员用户..."

    local admin_username=${ADMIN_USERNAME:-admin}
    local admin_email=${ADMIN_EMAIL:-admin@cyberpress.com}
    local admin_password=${ADMIN_PASSWORD:-admin123}

    # 使用 Python 生成密码哈希
    local password_hash=$(python3 -c "import bcrypt; print(bcrypt.hashpw('$admin_password'.encode(), bcrypt.gensalt()).decode())")

    PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" << EOF
INSERT INTO users (username, email, password_hash, full_name, is_active, is_verified, is_staff, is_superuser)
VALUES ('$admin_username', '$admin_email', '$password_hash', 'System Administrator', true, true, true, true)
ON CONFLICT (username) DO NOTHING;
EOF

    log_success "管理员用户创建完成"
    log_info "用户名: $admin_username"
    log_info "邮箱: $admin_email"
    log_warning "默认密码: $admin_password"
    log_warning "请在首次登录后修改密码！"
}

verify_installation() {
    log_info "验证安装..."

    local tables=$(PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")

    log_success "数据库表数量: $tables"

    # 检查关键表
    local critical_tables=("users" "posts" "categories" "tags" "comments" "likes" "bookmarks" "follows")

    for table in "${critical_tables[@]}"; do
        if PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "\dt $table" | grep -q "$table"; then
            log_success "✓ $table 表存在"
        else
            log_error "✗ $table 表不存在"
        fi
    done
}

print_summary() {
    log_success "========================================"
    log_success "数据库初始化完成！"
    log_success "========================================"
    echo ""
    log_info "数据库信息："
    log_info "  主机: $DB_HOST:$DB_PORT"
    log_info "  名称: $DB_NAME"
    log_info "  用户: $DB_USER"
    echo ""
    log_info "下一步："
    log_info "  1. 更新 .env 文件中的数据库配置"
    log_info "  2. 运行后端服务: cd backend && python -m uvicorn main:app --reload"
    log_info "  3. 运行前端服务: cd frontend && npm run dev"
    echo ""
}

# =====================================================
# 主流程
# =====================================================

main() {
    log_info "========================================="
    log_info "CyberPress 数据库初始化脚本"
    log_info "环境: $ENVIRONMENT"
    log_info "========================================="
    echo ""

    # 检查 PostgreSQL
    check_postgres
    echo ""

    # 创建数据库
    create_database
    echo ""

    # 执行架构
    run_schema
    echo ""

    # 执行迁移
    run_migrations
    echo ""

    # 执行种子数据
    run_seeds
    echo ""

    # 创建管理员用户
    create_admin_user
    echo ""

    # 验证安装
    verify_installation
    echo ""

    # 打印摘要
    print_summary
}

# 运行主流程
main
