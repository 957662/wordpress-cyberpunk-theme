#!/bin/bash

# =====================================================
# CyberPress Platform - Database Utilities
# 数据库工具集
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
    if [ -f "../../.env" ]; then
        source ../../.env
    else
        log_error ".env file not found!"
        exit 1
    fi
}

# 数据库状态
status() {
    log_info "Database Status:"
    echo ""

    # 检查连接
    if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT 1" &> /dev/null; then
        log_success "Database is connected"
    else
        log_error "Cannot connect to database"
        exit 1
    fi

    # 显示版本
    echo ""
    echo "PostgreSQL Version:"
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT version();"

    # 显示数据库大小
    echo ""
    echo "Database Size:"
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
    SELECT pg_size_pretty(pg_database_size('$DB_NAME')) as size;
    "

    # 显示表数量
    echo ""
    echo "Tables Count:"
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
    SELECT COUNT(*) as table_count
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
    "
}

# 数据库大小
size() {
    log_info "Database Size Information:"
    echo ""

    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME << EOF
SELECT
    datname as database,
    pg_size_pretty(pg_database_size(datname)) as size,
    pg_database_size(datname) as size_bytes
FROM pg_database
WHERE datname = '$DB_NAME'
ORDER BY size_bytes DESC;
EOF

    echo ""
    log_info "Table Sizes:"
    echo ""

    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME << EOF
SELECT
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 10;
EOF
}

# 清理数据库
vacuum() {
    log_info "Running VACUUM ANALYZE..."

    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME << EOF
VACUUM ANALYZE;
EOF

    log_success "VACUUM ANALYZE completed!"
}

# 重建索引
reindex() {
    log_warning "This operation will lock tables. Continue? (y/N)"
    read -r response

    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        log_info "Operation cancelled."
        exit 0
    fi

    log_info "Rebuilding indexes..."

    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME << EOF
REINDEX DATABASE $DB_NAME;
EOF

    log_success "Indexes rebuilt successfully!"
}

# 分析统计信息
analyze() {
    log_info "Analyzing database statistics..."

    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME << EOF
ANALYZE;
EOF

    log_success "Statistics updated!"
}

# 清理旧备份
clean_backups() {
    local days=${RETENTION_DAYS:-7}
    local backup_dir="../../backups/postgresql"

    log_info "Cleaning backups older than $days days..."

    if [ -d "$backup_dir" ]; then
        find "$backup_dir" -name "*.sql.gz" -type f -mtime +$days -delete
        log_success "Old backups cleaned!"
    else
        log_warning "Backup directory not found: $backup_dir"
    fi
}

# 重置数据库（危险操作）
reset() {
    log_warning "⚠️  DANGER: This will delete all data!"
    log_warning "Are you sure you want to reset the database? (y/N)"
    read -r response

    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        log_info "Operation cancelled."
        exit 0
    fi

    log_warning "This action cannot be undone. Confirm? (y/N)"
    read -r response

    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        log_info "Operation cancelled."
        exit 0
    fi

    log_info "Dropping database..."

    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres << EOF
DROP DATABASE IF EXISTS $DB_NAME;
CREATE DATABASE $DB_NAME;
EOF

    log_info "Applying schema..."
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f ../schema/postgres-schema.sql

    log_success "Database reset successfully!"
}

# 导出数据
export_data() {
    local output_file=${1:-"../../exports/data_$(date +%Y%m%d_%H%M%S).sql"}

    log_info "Exporting data to $output_file..."

    mkdir -p "../../exports"

    PGPASSWORD=$DB_PASSWORD pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER \
        -a -F p -d $DB_NAME > "$output_file"

    log_success "Data exported successfully!"
}

# 导入数据
import_data() {
    local input_file=$1

    if [ -z "$input_file" ]; then
        log_error "Please specify input file"
        exit 1
    fi

    if [ ! -f "$input_file" ]; then
        log_error "File not found: $input_file"
        exit 1
    fi

    log_warning "This will import data into the database. Continue? (y/N)"
    read -r response

    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        log_info "Operation cancelled."
        exit 0
    fi

    log_info "Importing data from $input_file..."

    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME < "$input_file"

    log_success "Data imported successfully!"
}

# 执行SQL
execute_sql() {
    local sql_file=$1

    if [ -z "$sql_file" ]; then
        log_error "Please specify SQL file"
        exit 1
    fi

    if [ ! -f "$sql_file" ]; then
        log_error "File not found: $sql_file"
        exit 1
    fi

    log_info "Executing SQL from $sql_file..."

    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$sql_file"

    log_success "SQL executed successfully!"
}

# 连接到数据库
connect() {
    log_info "Connecting to database..."
    echo ""
    echo "Connection details:"
    echo "  Host: $DB_HOST"
    echo "  Port: $DB_PORT"
    echo "  Database: $DB_NAME"
    echo "  User: $DB_USER"
    echo ""

    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME
}

# 显示帮助
show_help() {
    echo "CyberPress Platform - Database Utilities"
    echo ""
    echo "Usage: $0 <command> [options]"
    echo ""
    echo "Commands:"
    echo "  status          - Show database status"
    echo "  size            - Show database and table sizes"
    echo "  vacuum          - Run VACUUM ANALYZE"
    echo "  reindex         - Rebuild all indexes"
    echo "  analyze         - Update database statistics"
    echo "  clean-backups   - Clean old backup files"
    echo "  reset           - Reset database (⚠️ DANGER)"
    echo "  export [file]   - Export data to file"
    echo "  import <file>   - Import data from file"
    echo "  execute <file>  - Execute SQL file"
    echo "  connect         - Connect to database (psql)"
    echo "  help            - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 status"
    echo "  $0 vacuum"
    echo "  $0 export /path/to/backup.sql"
    echo "  $0 import /path/to/backup.sql"
    echo "  $0 execute migrations/001_initial.sql"
    echo "  $0 connect"
}

# 主函数
main() {
    local command=${1:-help}

    load_env

    case $command in
        "status")
            status
            ;;
        "size")
            size
            ;;
        "vacuum")
            vacuum
            ;;
        "reindex")
            reindex
            ;;
        "analyze")
            analyze
            ;;
        "clean-backups")
            clean_backups
            ;;
        "reset")
            reset
            ;;
        "export")
            export_data "$2"
            ;;
        "import")
            import_data "$2"
            ;;
        "execute")
            execute_sql "$2"
            ;;
        "connect")
            connect
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            log_error "Unknown command: $command"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

main "$@"
