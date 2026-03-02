#!/bin/bash
# =====================================================
# CyberPress Platform - Database Monitor Script
# 数据库监控脚本
# =====================================================
# Author: AI Database Architect
# Created: 2026-03-03
# =====================================================

set -e

# 配置变量
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-cyberpress}"
DB_USER="${DB_USER:-postgres}"
ALERT_THRESHOLD=90  # 磁盘使用率告警阈值 (%)
CONNECTION_THRESHOLD=80  # 连接数告警阈值 (%)

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# 日志函数
log() { echo -e "${GREEN}[INFO]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
info() { echo -e "${BLUE}[INFO]${NC} $1"; }
header() { echo -e "${CYAN}=== $1 ===${NC}"; }

# 检查数据库连接
check_connection() {
    header "数据库连接检查"
    
    if pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" >/dev/null 2>&1; then
        log "✓ 数据库连接正常"
        return 0
    else
        error "✗ 无法连接到数据库"
        return 1
    fi
}

# 获取数据库版本
get_version() {
    header "数据库版本信息"
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT version();" | head -n 1
}

# 获取数据库大小
get_db_size() {
    header "数据库大小"
    local size=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT pg_size_pretty(pg_database_size('$DB_NAME'));")
    log "数据库总大小: $size"
    
    echo ""
    info "各表大小:"
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
    SELECT 
        schemaname,
        tablename,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
    FROM pg_tables
    WHERE schemaname = 'public'
    ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
    LIMIT 10;"
}

# 获取连接数统计
get_connections() {
    header "连接数统计"
    
    local total=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT setting::int FROM pg_settings WHERE name='max_connections';")
    local current=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT count(*) FROM pg_stat_activity;")
    local percent=$((current * 100 / total))
    
    log "当前连接数: $current / $total ($percent%)"
    
    if [ $percent -ge $CONNECTION_THRESHOLD ]; then
        warn "连接数使用率超过 $CONNECTION_THRESHOLD%!"
    fi
    
    echo ""
    info "活跃连接详情:"
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
    SELECT 
        state,
        count(*) AS connections
    FROM pg_stat_activity
    WHERE datname = '$DB_NAME'
    GROUP BY state
    ORDER BY connections DESC;"
}

# 获取慢查询
get_slow_queries() {
    header "慢查询统计 (执行时间 > 1秒)"
    
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
    SELECT 
        query,
        calls,
        total_time,
        mean_time,
        max_time
    FROM pg_stat_statements
    WHERE mean_time > 1000
    ORDER BY mean_time DESC
    LIMIT 10;" 2>/dev/null || warn "pg_stat_statements 扩展未安装"
}

# 获取表统计信息
get_table_stats() {
    header "表统计信息"
    
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
    SELECT 
        schemaname,
        tablename,
        n_live_tup AS row_count,
        n_dead_tup AS dead_rows,
        last_vacuum,
        last_autovacuum,
        last_analyze,
        last_autoanalyze
    FROM pg_stat_user_tables
    ORDER BY n_live_tup DESC
    LIMIT 10;"
}

# 获取索引使用情况
get_index_usage() {
    header "索引使用情况"
    
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
    SELECT 
        schemaname,
        tablename,
        indexname,
        idx_scan AS index_scans,
        idx_tup_read AS tuples_read,
        idx_tup_fetch AS tuples_fetched
    FROM pg_stat_user_indexes
    ORDER BY idx_scan DESC
    LIMIT 10;"
}

# 获取缓存命中率
get_cache_hit() {
    header "缓存命中率"
    
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
    SELECT 
        sum(heap_blks_read) as heap_read,
        sum(heap_blks_hit) as heap_hit,
        sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read)) * 100 as cache_hit_ratio
    FROM pg_statio_user_tables;"
}

# 获取磁盘使用情况
get_disk_usage() {
    header "磁盘使用情况"
    
    local data_dir=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SHOW data_directory;")
    
    if [ -d "$data_dir" ]; then
        df -h "$data_dir"
        
        local usage=$(df "$data_dir" | tail -1 | awk '{print $5}' | sed 's/%//')
        
        if [ $usage -ge $ALERT_THRESHOLD ]; then
            warn "磁盘使用率超过 $ALERT_THRESHOLD%!"
        fi
    else
        warn "无法访问数据目录: $data_dir"
    fi
}

# 获取锁等待情况
get_locks() {
    header "锁等待情况"
    
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
    SELECT 
        l.locktype,
        l.relation::regclass,
        l.mode,
        l.granted,
        a.query
    FROM pg_locks l
    LEFT JOIN pg_stat_activity a ON l.pid = a.pid
    WHERE NOT l.granted
    LIMIT 10;"
}

# 主程序
main() {
    echo ""
    header "CyberPress Platform - 数据库监控报告"
    echo "时间: $(date '+%Y-%m-%d %H:%M:%S')"
    echo ""
    
    check_connection || exit 1
    echo ""
    
    get_version
    echo ""
    
    get_db_size
    echo ""
    
    get_connections
    echo ""
    
    get_table_stats
    echo ""
    
    get_index_usage
    echo ""
    
    get_cache_hit
    echo ""
    
    get_disk_usage
    echo ""
    
    get_locks
    echo ""
    
    header "监控完成"
}

# 运行主程序
main
