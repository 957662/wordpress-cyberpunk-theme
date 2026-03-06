#!/bin/bash
# ============================================================================
# CyberPress Platform - PostgreSQL 数据库监控脚本
# ============================================================================
# 功能：监控数据库性能、连接数、慢查询、表大小等关键指标
-- 版本：1.0.0
-- 创建日期：2026-03-06
# ============================================================================

set -e

# ============================================================================
# 配置参数
# ============================================================================

DB_NAME="${DB_NAME:-cyberpress}"
DB_USER="${DB_USER:-postgres}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"

# 监控配置
METRICS_DIR="${METRICS_DIR:-/var/log/postgresql/monitoring}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
LOG_FILE="${METRICS_DIR}/monitor_${TIMESTAMP}.log"

# 阈值配置
MAX_CONNECTIONS_WARNING=${MAX_CONNECTIONS_WARNING:-80}
MAX_CONNECTIONS_CRITICAL=${MAX_CONNECTIONS_CRITICAL:-90}
SLOW_QUERY_THRESHOLD=${SLOW_QUERY_THRESHOLD:-5}  # 秒
TABLE_SIZE_WARNING=${TABLE_SIZE_WARNING:-1073741824}  # 1GB
DISK_USAGE_WARNING=${DISK_USAGE_WARNING:-80}  # 百分比

# ============================================================================
# 颜色输出
# ============================================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# ============================================================================
# 日志函数
# ============================================================================

log() {
    local level=$1
    shift
    local message="$@"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[${timestamp}] [${level}] ${message}" | tee -a "${LOG_FILE}"
}

log_info() {
    echo -e "${BLUE}[INFO]${NC} $@" | tee -a "${LOG_FILE}"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $@" | tee -a "${LOG_FILE}"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $@" | tee -a "${LOG_FILE}"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $@" | tee -a "${LOG_FILE}"
}

# ============================================================================
# 工具函数
# ============================================================================

create_metrics_dir() {
    if [ ! -d "${METRICS_DIR}" ]; then
        mkdir -p "${METRICS_DIR}"
    fi
}

exec_sql() {
    local sql=$1
    PGPASSWORD="${DB_PASSWORD}" psql \
        -h "${DB_HOST}" \
        -p "${DB_PORT}" \
        -U "${DB_USER}" \
        -d "${DB_NAME}" \
        -t \
        -A \
        -c "${sql}" 2>/dev/null
}

exec_sql_formatted() {
    local sql=$1
    PGPASSWORD="${DB_PASSWORD}" psql \
        -h "${DB_HOST}" \
        -p "${DB_PORT}" \
        -U "${DB_USER}" \
        -d "${DB_NAME}" \
        -c "${sql}" 2>/dev/null
}

# ============================================================================
# 监控函数
# ============================================================================

check_database_connection() {
    log_info "检查数据库连接..."

    if PGPASSWORD="${DB_PASSWORD}" psql \
        -h "${DB_HOST}" \
        -p "${DB_PORT}" \
        -U "${DB_USER}" \
        -d "${DB_NAME}" \
        -c 'SELECT 1;' &>/dev/null; then
        log_success "数据库连接正常"
        return 0
    else
        log_error "数据库连接失败"
        return 1
    fi
}

monitor_connections() {
    log_info "监控数据库连接..."

    local max_connections=$(exec_sql "SHOW max_connections;")
    local current_connections=$(exec_sql "SELECT count(*) FROM pg_stat_activity;")
    local active_connections=$(exec_sql "SELECT count(*) FROM pg_stat_activity WHERE state = 'active';")
    local idle_connections=$(exec_sql "SELECT count(*) FROM pg_stat_activity WHERE state = 'idle';")
    local usage_percent=$(echo "scale=2; ${current_connections} * 100 / ${max_connections}" | bc)

    echo "==============================================="
    echo "连接统计"
    echo "==============================================="
    echo "最大连接数: ${max_connections}"
    echo "当前连接数: ${current_connections}"
    echo "活跃连接数: ${active_connections}"
    echo "空闲连接数: ${idle_connections}"
    echo "使用率: ${usage_percent}%"
    echo "==============================================="

    # 检查阈值
    local int_usage=${usage_percent%.*}
    if [ "${int_usage}" -ge "${MAX_CONNECTIONS_CRITICAL}" ]; then
        log_error "连接数超过临界阈值: ${usage_percent}% >= ${MAX_CONNECTIONS_CRITICAL}%"
    elif [ "${int_usage}" -ge "${MAX_CONNECTIONS_WARNING}" ]; then
        log_warning "连接数超过警告阈值: ${usage_percent}% >= ${MAX_CONNECTIONS_WARNING}%"
    else
        log_success "连接数正常: ${usage_percent}%"
    fi
}

monitor_database_size() {
    log_info "监控数据库大小..."

    exec_sql_formatted "
    SELECT
        datname as database_name,
        pg_size_pretty(pg_database_size(datname)) as size,
        pg_database_size(datname) as size_bytes
    FROM pg_database
    WHERE datname = '${DB_NAME}';
    "
}

monitor_table_sizes() {
    log_info "监控表大小..."

    echo "==============================================="
    echo "表大小统计 (Top 20)"
    echo "==============================================="

    exec_sql_formatted "
    SELECT
        schemaname,
        tablename,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
        pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) as index_size
    FROM pg_tables
    WHERE schemaname = 'public'
    ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
    LIMIT 20;
    "

    # 检查大表
    local large_tables=$(exec_sql "
    SELECT COUNT(*)
    FROM pg_tables
    WHERE schemaname = 'public'
    AND pg_total_relation_size(schemaname||'.'||tablename) > ${TABLE_SIZE_WARNING};
    ")

    if [ "${large_tables}" -gt 0 ]; then
        log_warning "发现 ${large_tables} 个大表（超过 1GB）"
    fi
}

monitor_index_usage() {
    log_info "监控索引使用情况..."

    echo "==============================================="
    echo "索引使用率统计"
    echo "==============================================="

    exec_sql_formatted "
    SELECT
        schemaname,
        tablename,
        indexname,
        idx_scan as index_scans,
        idx_tup_read as tuples_read,
        idx_tup_fetch as tuples_fetched,
        CASE
            WHEN idx_scan = 0 THEN 'UNUSED'
            WHEN idx_scan < 100 THEN 'RARELY_USED'
            ELSE 'WELL_USED'
        END as usage_status
    FROM pg_stat_user_indexes
    ORDER BY idx_scan ASC;
    "

    # 查找未使用的索引
    local unused_indexes=$(exec_sql "
    SELECT COUNT(*)
    FROM pg_stat_user_indexes
    WHERE idx_scan = 0
    AND indexrelname NOT LIKE '%_pkey';
    ")

    if [ "${unused_indexes}" -gt 0 ]; then
        log_warning "发现 ${unused_indexes} 个未使用的索引"
    fi
}

monitor_slow_queries() {
    log_info "监控慢查询..."

    if ! exec_sql "SELECT 1 FROM pg_extension WHERE extname = 'pg_stat_statements';" &>/dev/null; then
        log_warning "pg_stat_statements 扩展未安装，跳过慢查询监控"
        return
    fi

    echo "==============================================="
    echo "慢查询统计 (Top 10)"
    echo "==============================================="

    exec_sql_formatted "
    SELECT
        query,
        calls,
        total_time,
        mean_time,
        max_time,
        rows
    FROM pg_stat_statements
    WHERE mean_time > ${SLOW_QUERY_THRESHOLD}
    ORDER BY mean_time DESC
    LIMIT 10;
    "

    # 统计慢查询数量
    local slow_query_count=$(exec_sql "
    SELECT COUNT(*)
    FROM pg_stat_statements
    WHERE mean_time > ${SLOW_QUERY_THRESHOLD};
    ")

    if [ "${slow_query_count}" -gt 0 ]; then
        log_warning "发现 ${slow_query_count} 个慢查询（超过 ${SLOW_QUERY_THRESHOLD}秒）"
    else
        log_success "未发现慢查询"
    fi
}

monitor_cache_hit_ratio() {
    log_info "监控缓存命中率..."

    exec_sql_formatted "
    SELECT
        sum(heap_blks_read) as heap_read,
        sum(heap_blks_hit) as heap_hit,
        sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read) + 1) * 100 as cache_hit_ratio
    FROM pg_statio_user_tables;
    "

    local ratio=$(exec_sql "
    SELECT ROUND(sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read) + 1) * 100, 2)
    FROM pg_statio_user_tables;
    ")

    if [ "${ratio%.*}" -lt 90 ]; then
        log_warning "缓存命中率较低: ${ratio}%（建议 > 90%）"
    else
        log_success "缓存命中率正常: ${ratio}%"
    fi
}

monitor_locks() {
    log_info "监控锁等待..."

    exec_sql_formatted "
    SELECT
        l.locktype,
        l.relation::regclass,
        l.mode,
        l.granted,
        a.usename,
        a.query,
        a.query_start
    FROM pg_locks l
    LEFT JOIN pg_stat_activity a ON l.pid = a.pid
    WHERE NOT l.granted
    ORDER BY a.query_start;
    "

    local blocking_locks=$(exec_sql "
    SELECT COUNT(*)
    FROM pg_locks l
    LEFT JOIN pg_stat_activity a ON l.pid = a.pid
    WHERE NOT l.granted;
    ")

    if [ "${blocking_locks}" -gt 0 ]; then
        log_warning "发现 ${blocking_locks} 个阻塞锁"
    else
        log_success "未发现阻塞锁"
    fi
}

monitor_vacuum_status() {
    log_info "监控 VACUUM 状态..."

    echo "==============================================="
    echo "表 VACUUM 状态"
    echo "==============================================="

    exec_sql_formatted "
    SELECT
        schemaname,
        relname,
        last_vacuum,
        last_autovacuum,
        vacuum_count,
        autovacuum_count,
        last_analyze,
        last_autoanalyze,
        analyze_count,
        autoanalyze_count
    FROM pg_stat_user_tables
    ORDER BY last_autovacuum ASC NULLS LAST
    LIMIT 20;
    "
}

monitor_bloat() {
    log_info "监控表和索引膨胀..."

    echo "==============================================="
    echo "表膨胀统计"
    echo "==============================================="

    exec_sql_formatted "
    SELECT
        schemaname,
        tablename,
        pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
        CASE
            WHEN pg_stat_user_tables.n_dead_tup > 1000 THEN 'NEEDS_VACUUM'
            ELSE 'OK'
        END as vacuum_status,
        n_live_tup as live_tuples,
        n_dead_tup as dead_tuples,
        round(100 * n_dead_tup / NULLIF(n_live_tup + n_dead_tup, 0), 2) as dead_ratio
    FROM pg_stat_user_tables
    WHERE n_dead_tup > 0
    ORDER BY dead_ratio DESC
    LIMIT 20;
    "
}

monitor_replication() {
    log_info "监控复制状态..."

    local is_standby=$(exec_sql "SELECT pg_is_in_recovery();")

    if [ "${is_standby}" == "t" ]; then
        echo "==============================================="
        echo "备用库状态"
        echo "==============================================="

        exec_sql_formatted "
        SELECT
            now() - pg_last_xact_replay_timestamp() as replication_lag,
            pg_last_xact_replay_timestamp() as last_replay_time,
            pg_last_wal_receive_lsn() as last_receive_lsn,
            pg_last_wal_replay_lsn() as last_replay_lsn;
        "
    else
        echo "==============================================="
        echo "主库状态"
        echo "==============================================="

        exec_sql_formatted "
        SELECT
            client_addr,
            state,
            sync_state,
            replay_lag,
            flush_lag
        FROM pg_stat_replication;
        "
    fi
}

monitor_disk_usage() {
    log_info "监控磁盘使用率..."

    local data_dir=$(exec_sql "SHOW data_directory;")
    local disk_usage=$(df -h "${data_dir}" | tail -1 | awk '{print $5}' | sed 's/%//')

    echo "==============================================="
    echo "磁盘使用情况"
    echo "==============================================="
    echo "数据目录: ${data_dir}"
    df -h "${data_dir}"
    echo "==============================================="

    if [ "${disk_usage}" -ge "${DISK_USAGE_WARNING}" ]; then
        log_error "磁盘使用率超过阈值: ${disk_usage}% >= ${DISK_USAGE_WARNING}%"
    elif [ "${disk_usage}" -ge $((DISK_USAGE_WARNING - 10)) ]; then
        log_warning "磁盘使用率接近阈值: ${disk_usage}%"
    else
        log_success "磁盘使用率正常: ${disk_usage}%"
    fi
}

generate_report() {
    log_info "生成监控报告..."

    local report_file="${METRICS_DIR}/health_report_${TIMESTAMP}.txt"

    {
        echo "==============================================="
        echo "CyberPress Platform - 数据库健康报告"
        echo "==============================================="
        echo ""
        echo "生成时间: $(date)"
        echo "数据库: ${DB_NAME}"
        echo "主机: ${DB_HOST}:${DB_PORT}"
        echo ""
        echo "==============================================="
        echo "数据库概览"
        echo "==============================================="
        exec_sql_formatted "
        SELECT
            version() as postgresql_version;
        "
        exec_sql_formatted "
        SELECT
            current_database() as database_name,
            current_user as current_user,
            inet_server_addr() as server_address,
            inet_server_port() as server_port,
            pg_postmaster_start_time() as start_time,
            pg_size_pretty(pg_database_size(current_database())) as database_size;
        "
        echo ""
        echo "==============================================="
        echo "活动会话"
        echo "==============================================="
        exec_sql_formatted "
        SELECT
            count(*) FILTER (WHERE state = 'active') as active,
            count(*) FILTER (WHERE state = 'idle') as idle,
            count(*) FILTER (WHERE state = 'idle in transaction') as idle_in_transaction,
            count(*) as total
        FROM pg_stat_activity;
        "
        echo ""
        echo "==============================================="
        echo "检查点统计"
        echo "==============================================="
        exec_sql_formatted "
        SELECT
            checkpoints_timed as scheduled_checkpoints,
            checkpoints_req as requested_checkpoints,
            checkpoint_write_time as write_time_ms,
            checkpoint_sync_time as sync_time_ms,
            buffers_checkpoint as buffers_written,
            buffers_clean as buffers_cleaned,
            maxwritten_clean as max_clean_halts
        FROM pg_stat_bgwriter;
        "
        echo ""
        echo "==============================================="
        echo "报告结束"
        echo "==============================================="
    } > "${report_file}"

    log_success "监控报告已生成: ${report_file}"
}

send_alert() {
    local severity=$1
    local message=$2

    # 这里可以添加邮件、Slack、Webhook 等告警方式
    # 示例：发送邮件告警
    # if command -v mail &> /dev/null; then
    #     echo "${message}" | mail -s "数据库告警 [${severity}]" admin@example.com
    # fi

    log_error "告警 [${severity}]: ${message}"
}

# ============================================================================
# 主函数
# ============================================================================

usage() {
    cat << EOF
用法: $0 [选项]

选项:
    -a, --all               执行所有监控检查（默认）
    -c, --connections       监控连接数
    -s, --size              监控数据库和表大小
    -i, --indexes           监控索引使用情况
    -q, --slow-queries      监控慢查询
    -h, --cache             监控缓存命中率
    -l, --locks             监控锁等待
    -v, --vacuum            监控 VACUUM 状态
    -b, --bloat             监控膨胀
    -r, --replication       监控复制状态
    -d, --disk              监控磁盘使用
    -R, --report            生成监控报告
    -H, --help              显示帮助信息

环境变量:
    DB_NAME                 数据库名称（默认: cyberpress）
    DB_USER                 数据库用户（默认: postgres）
    DB_PASSWORD             数据库密码
    DB_HOST                 数据库主机（默认: localhost）
    DB_PORT                 数据库端口（默认: 5432）
    METRICS_DIR             监控日志目录（默认: /var/log/postgresql/monitoring）
    SLOW_QUERY_THRESHOLD    慢查询阈值（默认: 5秒）
    MAX_CONNECTIONS_WARNING 连接数警告阈值（默认: 80%）
    MAX_CONNECTIONS_CRITICAL 连接数临界阈值（默认: 90%）

示例:
    # 执行所有监控
    $0 --all

    # 监控连接和慢查询
    $0 --connections --slow-queries

    # 生成监控报告
    $0 --report

EOF
    exit 0
}

main() {
    local monitors=()

    while [[ $# -gt 0 ]]; do
        case $1 in
            -a|--all)
                monitors=(
                    "connection"
                    "size"
                    "indexes"
                    "slow_queries"
                    "cache"
                    "locks"
                    "vacuum"
                    "bloat"
                    "replication"
                    "disk"
                )
                shift
                ;;
            -c|--connections)
                monitors+=("connection")
                shift
                ;;
            -s|--size)
                monitors+=("size")
                shift
                ;;
            -i|--indexes)
                monitors+=("indexes")
                shift
                ;;
            -q|--slow-queries)
                monitors+=("slow_queries")
                shift
                ;;
            -h|--cache)
                monitors+=("cache")
                shift
                ;;
            -l|--locks)
                monitors+=("locks")
                shift
                ;;
            -v|--vacuum)
                monitors+=("vacuum")
                shift
                ;;
            -b|--bloat)
                monitors+=("bloat")
                shift
                ;;
            -r|--replication)
                monitors+=("replication")
                shift
                ;;
            -d|--disk)
                monitors+=("disk")
                shift
                ;;
            -R|--report)
                monitors=("report")
                shift
                ;;
            -H|--help)
                usage
                ;;
            *)
                echo "未知选项: $1"
                usage
                ;;
        esac
    done

    # 默认执行所有监控
    if [ ${#monitors[@]} -eq 0 ]; then
        monitors=(
            "connection"
            "size"
            "indexes"
            "slow_queries"
            "cache"
            "locks"
            "vacuum"
            "bloat"
            "replication"
            "disk"
        )
    fi

    echo "==============================================="
    echo "CyberPress Platform - 数据库监控工具"
    echo "==============================================="
    echo ""
    log_info "开始时间: $(date)"

    create_metrics_dir

    # 检查数据库连接
    if ! check_database_connection; then
        log_error "无法连接到数据库，退出监控"
        exit 1
    fi

    # 执行监控
    for monitor in "${monitors[@]}"; do
        case ${monitor} in
            connection)
                monitor_connections
                ;;
            size)
                monitor_database_size
                monitor_table_sizes
                ;;
            indexes)
                monitor_index_usage
                ;;
            slow_queries)
                monitor_slow_queries
                ;;
            cache)
                monitor_cache_hit_ratio
                ;;
            locks)
                monitor_locks
                ;;
            vacuum)
                monitor_vacuum_status
                ;;
            bloat)
                monitor_bloat
                ;;
            replication)
                monitor_replication
                ;;
            disk)
                monitor_disk_usage
                ;;
            report)
                generate_report
                ;;
        esac
    done

    log_success "监控完成！"
    log_info "结束时间: $(date)"
    echo "==============================================="
}

main "$@"
