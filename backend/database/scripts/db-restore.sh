#!/bin/bash

# =====================================================
# CyberPress Database Restore Script
# =====================================================
# Description: 从备份文件恢复数据库
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

# 检查备份文件
check_backup_file() {
    log_info "检查备份文件..."

    if [ -z "$1" ]; then
        log_error "请指定备份文件路径"
        echo "用法: $0 <backup_file.sql> [backup_file.sql.gz]"
        exit 1
    fi

    BACKUP_FILE="$1"

    if [ ! -f "$BACKUP_FILE" ]; then
        log_error "备份文件不存在: $BACKUP_FILE"
        exit 1
    fi

    # 检查文件大小
    FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    log_info "备份文件大小: $FILE_SIZE"
}

# 显示备份信息
show_backup_info() {
    log_info "分析备份文件..."

    if [[ "$BACKUP_FILE" == *.gz ]]; then
        # 处理压缩文件
        TABLE_COUNT=$(gunzip -c "$BACKUP_FILE" | grep -c "CREATE TABLE" || echo "0")
        DB_NAME_IN_FILE=$(gunzip -c "$BACKUP_FILE" | grep "Database:" | head -1 | sed 's/.*Database: //;s/ .*//' || echo "unknown")
    else
        # 处理普通SQL文件
        TABLE_COUNT=$(grep -c "CREATE TABLE" "$BACKUP_FILE" || echo "0")
        DB_NAME_IN_FILE=$(grep "Database:" "$BACKUP_FILE" | head -1 | sed 's/.*Database: //;s/ .*//' || echo "unknown")
    fi

    log_info "备份数据库: $DB_NAME_IN_FILE"
    log_info "表数量: $TABLE_COUNT"
}

# 确认恢复
confirm_restore() {
    log_warning "此操作将覆盖现有数据库 '${DB_NAME}' 的所有数据！"
    log_warning "请确保已备份当前数据库！"

    read -p "确定要恢复数据库吗? (yes/NO): " -r
    echo

    if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        log_info "操作已取消"
        exit 0
    fi
}

# 创建当前数据库的备份
backup_current_db() {
    log_info "备份当前数据库..."

    BACKUP_DIR="./backups"
    mkdir -p "$BACKUP_DIR"

    CURRENT_BACKUP="$BACKUP_DIR/pre_restore_$(date +%Y%m%d_%H%M%S).sql.gz"

    mysqldump -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" "${DB_NAME}" | gzip > "$CURRENT_BACKUP"

    log_success "当前数据库已备份到: $CURRENT_BACKUP"
}

# 删除并重建数据库
recreate_database() {
    log_info "重建数据库..."

    mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" -e "DROP DATABASE IF EXISTS ${DB_NAME}"
    mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" -e "CREATE DATABASE ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"

    log_success "数据库重建完成"
}

# 恢复数据库
restore_database() {
    log_info "开始恢复数据库..."

    start_time=$(date +%s)

    if [[ "$BACKUP_FILE" == *.gz ]]; then
        # 恢复压缩备份
        gunzip -c "$BACKUP_FILE" | mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" "${DB_NAME}"
    else
        # 恢复普通SQL备份
        mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" "${DB_NAME}" < "$BACKUP_FILE"
    fi

    end_time=$(date +%s)
    duration=$((end_time - start_time))

    log_success "数据库恢复完成！耗时: ${duration}秒"
}

# 验证恢复结果
verify_restore() {
    log_info "验证恢复结果..."

    TABLE_COUNT=$(mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" "${DB_NAME}" -e "SHOW TABLES" | wc -l)

    if [ "${TABLE_COUNT}" -gt 0 ]; then
        log_success "恢复成功！数据库包含 ${TABLE_COUNT} 个表"

        log_info "数据库表列表:"
        mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" "${DB_NAME}" -e "SHOW TABLES"

        log_info "数据统计:"
        mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" "${DB_NAME}" -e "
          SELECT 'posts' as table_name, COUNT(*) as row_count FROM posts
          UNION ALL
          SELECT 'users', COUNT(*) FROM users
          UNION ALL
          SELECT 'comments', COUNT(*) FROM comments
          UNION ALL
          SELECT 'categories', COUNT(*) FROM categories
        "
    else
        log_error "恢复失败，数据库为空"
        exit 1
    fi
}

# 主函数
main() {
    echo "======================================"
    echo "CyberPress Database Restore"
    echo "======================================"
    echo ""

    load_env
    check_backup_file "$@"
    show_backup_info
    confirm_restore
    backup_current_db
    recreate_database
    restore_database
    verify_restore

    echo ""
    log_success "数据库恢复完成！"
    echo ""
}

# 执行主函数
main "$@"
