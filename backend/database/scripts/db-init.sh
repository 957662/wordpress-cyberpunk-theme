#!/bin/bash

# =====================================================
# CyberPress Database Initialization Script
# =====================================================
# Description: 初始化数据库并导入schema
# Author: AI Database Architect
# Version: 1.0.0
# Date: 2026-03-03
# =====================================================

set -e  # 遇到错误立即退出

# 颜色输出
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
    if [ -f .env ]; then
        source .env
        log_info "已加载环境变量"
    else
        log_error ".env 文件未找到"
        exit 1
    fi
}

# 检查MySQL连接
check_mysql_connection() {
    log_info "检查 MySQL 连接..."

    if mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" -e "SELECT 1" &> /dev/null; then
        log_success "MySQL 连接成功"
    else
        log_error "MySQL 连接失败，请检查配置"
        exit 1
    fi
}

# 检查数据库是否存在
check_database_exists() {
    log_info "检查数据库 '${DB_NAME}' 是否存在..."

    DB_EXISTS=$(mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" -e "SHOW DATABASES LIKE '${DB_NAME}'" | grep -c "${DB_NAME}" || true)

    if [ "${DB_EXISTS}" -eq 1 ]; then
        log_warning "数据库 '${DB_NAME}' 已存在"
        read -p "是否删除并重新创建? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            log_info "删除现有数据库..."
            mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" -e "DROP DATABASE ${DB_NAME}"
            create_database
        else
            log_info "使用现有数据库"
        fi
    else
        create_database
    fi
}

# 创建数据库
create_database() {
    log_info "创建数据库 '${DB_NAME}'..."

    mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" -e "CREATE DATABASE ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"

    log_success "数据库创建成功"
}

# 导入schema
import_schema() {
    log_info "导入数据库 schema..."

    if [ -f "schema.sql" ]; then
        mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" "${DB_NAME}" < schema.sql
        log_success "Schema 导入成功"
    else
        log_error "schema.sql 文件未找到"
        exit 1
    fi
}

# 运行迁移
run_migrations() {
    log_info "运行数据库迁移..."

    if [ -d "migrations" ]; then
        for migration in migrations/*.sql; do
            if [ -f "$migration" ]; then
                log_info "执行迁移: $(basename "$migration")"
                mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" "${DB_NAME}" < "$migration"
                log_success "迁移完成: $(basename "$migration")"
            fi
        done
        log_success "所有迁移执行成功"
    else
        log_warning "migrations 目录未找到，跳过迁移"
    fi
}

# 验证安装
verify_installation() {
    log_info "验证数据库安装..."

    TABLE_COUNT=$(mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" "${DB_NAME}" -e "SHOW TABLES" | wc -l)

    if [ "${TABLE_COUNT}" -gt 0 ]; then
        log_success "数据库初始化成功！创建了 ${TABLE_COUNT} 个表"

        log_info "数据库表列表:"
        mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" "${DB_NAME}" -e "SHOW TABLES"

        log_info "默认管理员账户:"
        mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" "${DB_NAME}" -e "SELECT id, email, username, role FROM users WHERE role = 'administrator'"
    else
        log_error "数据库初始化失败"
        exit 1
    fi
}

# 主函数
main() {
    echo "======================================"
    echo "CyberPress Database Initialization"
    echo "======================================"
    echo ""

    load_env
    check_mysql_connection
    check_database_exists
    import_schema
    run_migrations
    verify_installation

    echo ""
    log_success "数据库初始化完成！"
    echo ""
    log_info "默认管理员登录信息:"
    log_info "  Email: admin@cyberpress.com"
    log_info "  Password: admin123"
    log_warning "请在登录后立即修改默认密码！"
    echo ""
}

# 执行主函数
main "$@"
