#!/bin/bash

# =====================================================
# CyberPress Platform - Database Backup Script
# 数据库备份脚本
# =====================================================
# Author: AI Development Team
# Created: 2026-03-07
# Version: 1.0.0
# =====================================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 日志函数
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# 加载环境变量
load_env() {
    if [ -f "../../../.env" ]; then
        source ../../../.env
    else
        log_error ".env file not found!"
        exit 1
    fi

    # 设置备份目录
    BACKUP_DIR="${BACKUP_DIR:-../../../backups/postgresql}"
    mkdir -p "$BACKUP_DIR"
}

# 创建备份
create_backup() {
    local backup_type=$1
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local backup_file="$BACKUP_DIR/${DB_NAME}_backup_${timestamp}.sql.gz"

    log_info "Creating $backup_type backup..."

    case $backup_type in
        "full")
            PGPASSWORD=$DB_PASSWORD pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER \
                -F p -d $DB_NAME | gzip > "$backup_file"
            ;;
        "data")
            PGPASSWORD=$DB_PASSWORD pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER \
                -a -F p -d $DB_NAME | gzip > "$backup_file"
            ;;
        "schema")
            PGPASSWORD=$DB_PASSWORD pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER \
                -s -F p -d $DB_NAME | gzip > "$backup_file"
            ;;
        *)
            log_error "Invalid backup type: $backup_type"
            exit 1
            ;;
    esac

    if [ $? -eq 0 ]; then
        local file_size=$(du -h "$backup_file" | cut -f1)
        log_success "Backup created: $backup_file ($file_size)"
    else
        log_error "Backup failed!"
        exit 1
    fi
}

# 清理旧备份
cleanup_old_backups() {
    local days_to_keep=${RETENTION_DAYS:-7}
    log_info "Cleaning up backups older than $days_to_keep days..."

    find "$BACKUP_DIR" -name "${DB_NAME}_backup_*.sql.gz" -type f -mtime +$days_to_keep -delete

    log_success "Old backups cleaned up!"
}

# 列出备份
list_backups() {
    log_info "Available backups:"
    echo ""

    ls -lht "$BACKUP_DIR"/${DB_NAME}_backup_*.sql.gz 2>/dev/null || echo "No backups found."

    echo ""
}

# 主函数
main() {
    local action=${1:-full}

    echo "====================================================="
    echo "  CyberPress Platform - Database Backup"
    echo "====================================================="
    echo ""

    load_env

    case $action in
        "full"|"data"|"schema")
            create_backup $action
            cleanup_old_backups
            list_backups
            ;;
        "list")
            list_backups
            ;;
        "clean")
            cleanup_old_backups
            ;;
        *)
            echo "Usage: $0 {full|data|schema|list|clean}"
            echo ""
            echo "Commands:"
            echo "  full    - Create full backup (default)"
            echo "  data    - Backup data only"
            echo "  schema  - Backup schema only"
            echo "  list    - List available backups"
            echo "  clean   - Clean old backups"
            exit 1
            ;;
    esac
}

main "$@"
