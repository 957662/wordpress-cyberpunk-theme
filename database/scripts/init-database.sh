#!/bin/bash

# =====================================================
# CyberPress Platform - Database Initialization Script
# 数据库初始化脚本
# =====================================================
# Author: AI Development Team
# Created: 2026-03-07
# Version: 1.0.0
# =====================================================

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
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

# 加载环境变量
load_env() {
    if [ -f "../../../.env" ]; then
        source ../../../.env
    else
        log_error ".env file not found!"
        exit 1
    fi
}

# 检查依赖
check_dependencies() {
    log_info "Checking dependencies..."

    if ! command -v psql &> /dev/null; then
        log_error "PostgreSQL client not installed!"
        exit 1
    fi

    if ! command -v docker &> /dev/null; then
        log_warning "Docker not found. Using local PostgreSQL."
    fi

    log_success "Dependencies check passed!"
}

# 等待 PostgreSQL 就绪
wait_for_postgres() {
    log_info "Waiting for PostgreSQL to be ready..."

    local max_attempts=30
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "SELECT 1" &> /dev/null; then
            log_success "PostgreSQL is ready!"
            return 0
        fi

        log_info "Attempt $attempt/$max_attempts: PostgreSQL not ready yet..."
        sleep 2
        attempt=$((attempt + 1))
    done

    log_error "PostgreSQL failed to start!"
    exit 1
}

# 创建数据库
create_database() {
    log_info "Creating database: $DB_NAME"

    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres << EOF
SELECT 'CREATE DATABASE $DB_NAME' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME')\gexec
EOF

    log_success "Database created or already exists!"
}

# 应用数据库架构
apply_schema() {
    log_info "Applying database schema..."

    local schema_file="../schema/postgres-schema.sql"

    if [ ! -f "$schema_file" ]; then
        log_error "Schema file not found: $schema_file"
        exit 1
    fi

    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$schema_file"

    log_success "Database schema applied successfully!"
}

# 验证安装
verify_installation() {
    log_info "Verifying installation..."

    local tables=$(
        PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "
        SELECT COUNT(*) FROM information_schema.tables
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
        "
    )

    local indexes=$(
        PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "
        SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public';
        "
    )

    local users=$(
        PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM users;"
    )

    log_success "Installation verification:"
    echo "  - Tables: $tables"
    echo "  - Indexes: $indexes"
    echo "  - Users: $users"

    if [ "$tables" -ge 15 ]; then
        log_success "Database initialization completed successfully!"
        return 0
    else
        log_error "Database initialization may have failed!"
        return 1
    fi
}

# 显示连接信息
show_connection_info() {
    log_success "Database Connection Information:"
    echo ""
    echo "  Host: $DB_HOST"
    echo "  Port: $DB_PORT"
    echo "  Database: $DB_NAME"
    echo "  User: $DB_USER"
    echo ""
    echo "Connect with:"
    echo "  psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME"
    echo ""
}

# 主函数
main() {
    echo "====================================================="
    echo "  CyberPress Platform - Database Initialization"
    echo "====================================================="
    echo ""

    load_env
    check_dependencies

    # 如果使用 Docker，先启动服务
    if [ -f "../../../docker-compose.yml" ]; then
        log_info "Starting Docker services..."
        docker-compose -f ../../../docker-compose.yml up -d postgres
        sleep 5
    fi

    wait_for_postgres
    create_database
    apply_schema
    verify_installation
    show_connection_info
}

# 运行主函数
main "$@"
