#!/bin/bash

# =====================================================
# CyberPress Platform - Database Monitoring Script
# 数据库监控脚本
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
}

# 检查连接数
check_connections() {
    log_info "Checking database connections..."

    local result=$(
        PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "
        SELECT
            count(*) as total,
            count(*) FILTER (WHERE state = 'active') as active,
            count(*) FILTER (WHERE state = 'idle') as idle
        FROM pg_stat_activity
        WHERE datname = '$DB_NAME';
        "
    )

    echo "$result" | while read -r total active idle; do
        echo "  Total: $total"
        echo "  Active: $active"
        echo "  Idle: $idle"

        if [ $total -gt 80 ]; then
            log_warning "High connection count!"
        fi
    done
}

# 检查慢查询
check_slow_queries() {
    log_info "Checking slow queries..."

    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME << EOF
SELECT
    query,
    calls,
    round(mean_time::numeric, 2) as avg_time_ms,
    round(max_time::numeric, 2) as max_time_ms,
    total_exec_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
EOF
}

# 检查表大小
check_table_sizes() {
    log_info "Checking table sizes..."

    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME << EOF
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
    pg_total_relation_size(schemaname||'.'||tablename) as size_bytes
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY size_bytes DESC
LIMIT 20;
EOF
}

# 检查数据库大小
check_database_size() {
    log_info "Checking database size..."

    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME << EOF
SELECT
    pg_database.datname,
    pg_size_pretty(pg_database_size(pg_database.datname)) as size
FROM pg_database
WHERE pg_database.datname = '$DB_NAME';
EOF
}

# 检查缓存命中率
check_cache_hit_ratio() {
    log_info "Checking cache hit ratio..."

    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME << EOF
SELECT
    sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read)) * 100 as cache_hit_ratio
FROM pg_statio_user_tables;
EOF
}

# 检查表膨胀
check_table_bloat() {
    log_info "Checking table bloat..."

    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME << EOF
SELECT
    schemaname,
    relname,
    n_dead_tup,
    n_live_tup,
    round(100 * n_dead_tup / NULLIF(n_live_tup + n_dead_tup, 0), 2) as dead_ratio
FROM pg_stat_user_tables
WHERE n_live_tup > 0
ORDER BY dead_ratio DESC
LIMIT 10;
EOF
}

# 检查锁等待
check_locks() {
    log_info "Checking locks..."

    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME << EOF
SELECT
    l.locktype,
    l.relation::regclass,
    l.mode,
    l.granted,
    a.usename,
    a.query,
    a.query_start
FROM pg_locks l
JOIN pg_stat_activity a ON l.pid = a.pid
WHERE NOT l.granted
ORDER BY a.query_start;
EOF
}

# 生成完整报告
generate_report() {
    log_info "Generating complete monitoring report..."

    local report_file="../../../reports/database_monitor_$(date +"%Y%m%d_%H%M%S").txt"
    mkdir -p "../../../reports"

    {
        echo "====================================================="
        echo "  Database Monitoring Report"
        echo "====================================================="
        echo "Generated: $(date)"
        echo ""
        echo "Database: $DB_NAME"
        echo "Host: $DB_HOST:$DB_PORT"
        echo ""
        echo "====================================================="
        echo "  Database Size"
        echo "====================================================="
        check_database_size
        echo ""
        echo "====================================================="
        echo "  Connection Statistics"
        echo "====================================================="
        check_connections
        echo ""
        echo "====================================================="
        echo "  Table Sizes"
        echo "====================================================="
        check_table_sizes
        echo ""
        echo "====================================================="
        echo "  Cache Hit Ratio"
        echo "====================================================="
        check_cache_hit_ratio
        echo ""
        echo "====================================================="
        echo "  Table Bloat"
        echo "====================================================="
        check_table_bloat
        echo ""
        echo "====================================================="
        echo "  Slow Queries"
        echo "====================================================="
        check_slow_queries
        echo ""
        echo "====================================================="
        echo "  Lock Status"
        echo "====================================================="
        check_locks
        echo ""
    } > "$report_file"

    log_success "Report saved to: $report_file"
    cat "$report_file"
}

# 主函数
main() {
    local action=${1:-all}

    echo "====================================================="
    echo "  CyberPress Platform - Database Monitoring"
    echo "====================================================="
    echo ""

    load_env

    case $action in
        "all")
            generate_report
            ;;
        "connections")
            check_connections
            ;;
        "slow-queries")
            check_slow_queries
            ;;
        "table-sizes")
            check_table_sizes
            ;;
        "database-size")
            check_database_size
            ;;
        "cache-hit")
            check_cache_hit_ratio
            ;;
        "bloat")
            check_table_bloat
            ;;
        "locks")
            check_locks
            ;;
        "report")
            generate_report
            ;;
        *)
            echo "Usage: $0 {all|connections|slow-queries|table-sizes|database-size|cache-hit|bloat|locks|report}"
            echo ""
            echo "Commands:"
            echo "  all            - Generate complete report (default)"
            echo "  connections    - Check connection statistics"
            echo "  slow-queries   - Show slow queries"
            echo "  table-sizes    - Show table sizes"
            echo "  database-size  - Show database size"
            echo "  cache-hit      - Show cache hit ratio"
            echo "  bloat          - Show table bloat"
            echo "  locks          - Show lock status"
            echo "  report         - Generate complete report"
            exit 1
            ;;
    esac
}

main "$@"
