#!/bin/bash
# =====================================================
# CyberPress Platform - Database Optimization Script
# 数据库性能优化脚本
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

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log() { echo -e "${GREEN}[INFO]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
header() { echo -e "${CYAN}=== $1 ===${NC}"; }

# 分析表
analyze_tables() {
    header "分析表 (ANALYZE)"
    
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
    SELECT 
        schemaname,
        tablename,
        last_analyze
    FROM pg_stat_user_tables
    ORDER BY last_analyze ASC NULLS LAST
    LIMIT 10;"
    
    echo ""
    log "执行 ANALYZE..."
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "ANALYZE;" || true
    log "✓ ANALYZE 完成"
}

# 清理表
vacuum_tables() {
    header "清理表 (VACUUM)"
    
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
    SELECT 
        schemaname,
        tablename,
        n_dead_tup AS dead_rows,
        n_live_tup AS live_rows
    FROM pg_stat_user_tables
    WHERE n_dead_tup > 1000
    ORDER BY n_dead_tup DESC
    LIMIT 10;"
    
    echo ""
    log "执行 VACUUM ANALYZE..."
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "VACUUM ANALYZE;" || true
    log "✓ VACUUM ANALYZE 完成"
}

# 重建索引
reindex() {
    header "重建索引"
    
    local choice=""
    read -p "是否重建所有索引? (这可能需要较长时间) [y/N]: " choice
    
    if [ "$choice" = "y" ] || [ "$choice" = "Y" ]; then
        log "执行 REINDEX DATABASE..."
        psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "REINDEX DATABASE $DB_NAME;" || true
        log "✓ 索引重建完成"
    else
        log "跳过索引重建"
    fi
}

# 清理旧数据
cleanup_old_data() {
    header "清理旧数据"
    
    local days=30
    read -p "删除多少天前的垃圾数据? (默认: 30): " input_days
    days=${input_days:-30}
    
    log "清理 $days 天前的垃圾数据..."
    
    # 删除已删除的文章
    local deleted_posts=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "
    SELECT COUNT(*) FROM posts WHERE status = 'trash' AND updated_at < NOW() - INTERVAL '$days days';")
    
    if [ "$deleted_posts" -gt 0 ]; then
        log "删除 $deleted_posts 篇垃圾文章..."
        psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
        DELETE FROM posts WHERE status = 'trash' AND updated_at < NOW() - INTERVAL '$days days';" || true
    fi
    
    # 删除垃圾评论
    local spam_comments=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "
    SELECT COUNT(*) FROM comments WHERE status = 'spam' OR status = 'trash';")
    
    if [ "$spam_comments" -gt 0 ]; then
        log "删除 $spam_comments 条垃圾评论..."
        psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
        DELETE FROM comments WHERE status = 'spam' OR status = 'trash';" || true
    fi
    
    log "✓ 旧数据清理完成"
}

# 更新统计信息
update_statistics() {
    header "更新统计信息"
    
    log "更新分类文章计数..."
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
    UPDATE categories c
    SET usage_count = (
        SELECT COUNT(*)
        FROM post_categories pc
        JOIN posts p ON pc.post_id = p.id
        WHERE pc.category_id = c.id AND p.status = 'published'
    );" || true
    
    log "更新标签使用计数..."
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
    UPDATE tags t
    SET usage_count = (
        SELECT COUNT(*)
        FROM post_tags pt
        JOIN posts p ON pt.post_id = p.id
        WHERE pt.tag_id = t.id AND p.status = 'published'
    );" || true
    
    log "✓ 统计信息更新完成"
}

# 检查碎片化
check_fragmentation() {
    header "检查表碎片化"
    
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
    SELECT 
        schemaname,
        tablename,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
        pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS index_size
    FROM pg_tables
    WHERE schemaname = 'public'
    ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
    LIMIT 10;"
}

# 主程序
main() {
    echo ""
    header "CyberPress Platform - 数据库优化工具"
    echo "时间: $(date '+%Y-%m-%d %H:%M:%S')"
    echo ""
    
    # 检查连接
    if ! pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" >/dev/null 2>&1; then
        error "无法连接到数据库"
        exit 1
    fi
    
    # 执行优化任务
    check_fragmentation
    echo ""
    
    analyze_tables
    echo ""
    
    vacuum_tables
    echo ""
    
    update_statistics
    echo ""
    
    cleanup_old_data
    echo ""
    
    reindex
    echo ""
    
    header "优化完成"
    echo ""
    log "建议: 定期运行此脚本以保持数据库性能"
    log "可以设置 cron 任务: 0 2 * * * /path/to/optimize-db.sh"
}

# 运行主程序
main
