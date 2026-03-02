#!/bin/bash

# =====================================================
# CyberPress Database Monitoring Script
# =====================================================
# Description: 实时监控数据库性能和健康状况
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
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[OK]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_metric() {
    echo -e "${CYAN}[METRIC]${NC} $1"
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

# 检查数据库连接
check_connection() {
    log_info "检查数据库连接..."

    if mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" -e "SELECT 1" &> /dev/null; then
        log_success "数据库连接正常"
        return 0
    else
        log_error "数据库连接失败"
        return 1
    fi
}

# 获取数据库版本
get_db_version() {
    log_info "数据库版本信息:"

    mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" -e "
        SELECT
            VERSION() as mysql_version,
            @@version_comment as version_comment
    " | column -t
}

# 检查数据库大小
check_database_size() {
    log_info "数据库大小统计:"

    mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" -e "
        SELECT
            table_schema AS 'Database',
            ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)',
            ROUND(SUM(data_length) / 1024 / 1024, 2) AS 'Data (MB)',
            ROUND(SUM(index_length) / 1024 / 1024, 2) AS 'Index (MB)',
            ROUND(SUM(data_free) / 1024 / 1024, 2) AS 'Free (MB)'
        FROM information_schema.tables
        WHERE table_schema = '${DB_NAME}'
        GROUP BY table_schema
    " | column -t
}

# 检查表大小
check_table_sizes() {
    log_info "表大小统计 (TOP 10):"

    mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" -e "
        SELECT
            table_name AS 'Table',
            ROUND((data_length + index_length) / 1024 / 1024, 2) AS 'Total (MB)',
            ROUND(data_length / 1024 / 1024, 2) AS 'Data (MB)',
            ROUND(index_length / 1024 / 1024, 2) AS 'Index (MB)',
            table_rows AS 'Rows',
            ROUND((index_length / (data_length + index_length)) * 100, 2) AS 'Index %'
        FROM information_schema.tables
        WHERE table_schema = '${DB_NAME}'
        ORDER BY (data_length + index_length) DESC
        LIMIT 10
    " | column -t
}

# 检查连接数
check_connections() {
    log_info "数据库连接状态:"

    mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" -e "
        SHOW STATUS LIKE 'Threads_%';
        SHOW STATUS LIKE 'Max_used_connections';
        SHOW STATUS LIKE 'Connections';
    " | grep -E "Threads_|Max_used_connections|Connections" | column -t
}

# 检查慢查询
check_slow_queries() {
    log_info "慢查询统计:"

    SLOW_QUERY_COUNT=$(mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" -sN -e "SHOW STATUS LIKE 'Slow_queries'" | awk '{print $2}')

    log_metric "慢查询总数: ${SLOW_QUERY_COUNT}"

    if [ "${SLOW_QUERY_COUNT}" -gt 100 ]; then
        log_warning "慢查询数量较多，建议优化"
    else
        log_success "慢查询数量正常"
    fi

    # 显示慢查询日志状态
    mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" -e "
        SHOW VARIABLES LIKE 'slow_query%';
        SHOW VARIABLES LIKE 'long_query_time';
    " | column -t
}

# 检查InnoDB状态
check_innodb_status() {
    log_info "InnoDB 状态:"

    mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" -e "
        SHOW ENGINE INNODB STATUS\G
    " | grep -E "History list|Buffer pool|queries|reads|writes" | head -20
}

# 检查索引使用情况
check_index_usage() {
    log_info "索引使用统计:"

    mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" -e "
        SELECT
            table_name,
            index_name,
            cardinality,
            ROUND(cardinality / table_rows * 100, 2) AS 'selectivity %'
        FROM information_schema.statistics
        WHERE table_schema = '${DB_NAME}'
          AND index_name != 'PRIMARY'
          AND table_rows > 0
        ORDER BY cardinality DESC
        LIMIT 15
    " | column -t
}

# 检查表碎片化
check_fragmentation() {
    log_info "表碎片化情况:"

    mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" -e "
        SELECT
            table_name AS 'Table',
            ROUND(data_length / 1024 / 1024, 2) AS 'Data (MB)',
            ROUND(data_free / 1024 / 1024, 2) AS 'Fragment (MB)',
            ROUND((data_free / data_length) * 100, 2) AS 'Fragment %'
        FROM information_schema.tables
        WHERE table_schema = '${DB_NAME}'
          AND data_free > 0
        ORDER BY data_free DESC
        LIMIT 10
    " | column -t

    # 检查是否有高碎片化的表
    HIGH_FRAGMENT=$(mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" -sN -e "
        SELECT COUNT(*)
        FROM information_schema.tables
        WHERE table_schema = '${DB_NAME}'
          AND data_free > 0
          AND (data_free / data_length) > 0.1
    ")

    if [ "${HIGH_FRAGMENT}" -gt 0 ]; then
        log_warning "发现 ${HIGH_FRAGMENT} 个高碎片化表，建议执行 OPTIMIZE TABLE"
    fi
}

# 检查查询缓存
check_query_cache() {
    log_info "查询缓存状态:"

    mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" -e "
        SHOW VARIABLES LIKE 'query_cache%';
        SHOW STATUS LIKE 'Qc%';
    " | column -t
}

# 检查表锁
check_table_locks() {
    log_info "表锁统计:"

    mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" -e "
        SHOW STATUS LIKE 'Table_locks%';
    " | column -t
}

# 检查当前正在执行的查询
check_running_queries() {
    log_info "当前执行的查询:"

    QUERY_COUNT=$(mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" -sN -e "SHOW PROCESSLIST" | wc -l)

    log_metric "活动查询数: ${QUERY_COUNT}"

    mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" -e "
        SHOW FULL PROCESSLIST
    " | column -t

    # 检查是否有长时间运行的查询
    LONG_RUNNING=$(mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" -sN -e "
        SELECT COUNT(*)
        FROM information_schema.processlist
        WHERE time > 60
          AND command != 'Sleep'
    ")

    if [ "${LONG_RUNNING}" -gt 0 ]; then
        log_warning "发现 ${LONG_RUNNING} 个长时间运行的查询"
    fi
}

# 检查复制状态（如果配置了主从）
check_replication() {
    log_info "复制状态:"

    SLAVE_STATUS=$(mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" -e "SHOW SLAVE STATUS\G" 2>&1)

    if echo "${SLAVE_STATUS}" | grep -q "Empty set"; then
        log_info "未配置从服务器"
    else
        echo "${SLAVE_STATUS}" | grep -E "Slave_IO_Running|Slave_SQL_Running|Seconds_Behind_Master"
    fi
}

# 生成监控报告
generate_report() {
    log_info "生成监控报告..."

    REPORT_FILE="./reports/db_monitor_$(date +%Y%m%d_%H%M%S).txt"
    mkdir -p "./reports"

    {
        echo "======================================"
        echo "CyberPress Database Monitoring Report"
        echo "======================================"
        echo "Generated: $(date)"
        echo "Database: ${DB_NAME}"
        echo "Host: ${DB_HOST}:${DB_PORT}"
        echo ""
        echo "======================================"
        echo "Database Size"
        echo "======================================"
        check_database_size
        echo ""
        echo "======================================"
        echo "Table Sizes (TOP 10)"
        echo "======================================"
        check_table_sizes
        echo ""
        echo "======================================"
        echo "Connections"
        echo "======================================"
        check_connections
        echo ""
        echo "======================================"
        echo "Slow Queries"
        echo "======================================"
        check_slow_queries
        echo ""
        echo "======================================"
        echo "Fragmentation"
        echo "======================================"
        check_fragmentation
    } > "$REPORT_FILE"

    log_success "监控报告已保存到: $REPORT_FILE"
}

# 主函数
main() {
    echo "======================================"
    echo "CyberPress Database Monitor"
    echo "======================================"
    echo ""

    load_env

    if ! check_connection; then
        exit 1
    fi

    echo ""
    get_db_version
    echo ""
    check_database_size
    echo ""
    check_table_sizes
    echo ""
    check_connections
    echo ""
    check_slow_queries
    echo ""
    check_fragmentation
    echo ""
    check_index_usage
    echo ""
    check_running_queries
    echo ""

    # 如果指定了 --report 参数，生成报告
    if [[ "$1" == "--report" ]]; then
        generate_report
    fi

    log_success "监控完成"
    echo ""
}

# 执行主函数
main "$@"
