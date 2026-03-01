#!/bin/bash
# =====================================================
# CyberPress Database Monitor Script
# =====================================================
# 用途: 监控数据库健康状态
# 使用: ./scripts/monitor.sh [environment]
# 输出: JSON格式的监控报告
# =====================================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 加载环境变量
ENV=${1:-development}
ENV_FILE="../../.env.${ENV}"

if [ -f "$ENV_FILE" ]; then
    source $ENV_FILE
else
    echo -e "${RED}错误: 环境文件不存在: $ENV_FILE${NC}"
    exit 1
fi

# 输出格式（默认 human）
OUTPUT_FORMAT=${2:-human}

# MySQL 连接命令
MYSQL_CMD="mysql -h ${DB_HOST} -P ${DB_PORT} -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME} -s -N"

echo -e "${BLUE}=== CyberPress 数据库监控 ===${NC}"
echo -e "环境: ${YELLOW}${ENV}${NC}"
echo -e "时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# 初始化状态变量
HEALTH_SCORE=100
ISSUES=()

# 1. 检查数据库连接
echo -e "${GREEN}[1/10] 检查数据库连接...${NC}"
if mysql -h "${DB_HOST}" -P "${DB_PORT}" -u "${DB_USER}" -p"${DB_PASSWORD}" -e "SELECT 1" &> /dev/null; then
    if [ "$OUTPUT_FORMAT" == "human" ]; then
        echo -e "${GREEN}✓ 数据库连接正常${NC}"
    fi
else
    HEALTH_SCORE=$((HEALTH_SCORE - 50))
    ISSUES+=("数据库连接失败")
    echo -e "${RED}✗ 数据库连接失败${NC}"
fi

# 2. 检查数据库大小
echo -e "${GREEN}[2/10] 检查数据库大小...${NC}"
DB_SIZE=$($MYSQL_CMD -e "
    SELECT ROUND(SUM(data_length + index_length) / 1024 / 1024, 2)
    FROM information_schema.tables
    WHERE table_schema='${DB_NAME}';
")

if [ "$OUTPUT_FORMAT" == "human" ]; then
    echo -e "${GREEN}✓ 数据库大小: ${DB_SIZE} MB${NC}"
fi

# 3. 检查表状态
echo -e "${GREEN}[3/10] 检查表状态...${NC}"
TABLE_STATUS=$($MYSQL_CMD -e "
    SELECT
        CONCAT(COUNT(*), ' 张表, ',
               SUM(CASE WHEN table_type = 'BASE TABLE' THEN 1 ELSE 0 END), ' 基表, ',
               SUM(CASE WHEN table_type = 'VIEW' THEN 1 ELSE 0 END), ' 视图')
    FROM information_schema.tables
    WHERE table_schema='${DB_NAME}';
")

if [ "$OUTPUT_FORMAT" == "human" ]; then
    echo -e "${GREEN}✓ 表状态: ${TABLE_STATUS}${NC}"
fi

# 4. 检查损坏的表
echo -e "${GREEN}[4/10] 检查表完整性...${NC}"
CORRUPTED_TABLES=$($MYSQL_CMD -e "
    SELECT COUNT(*)
    FROM information_schema.tables
    WHERE table_schema='${DB_NAME}'
    AND table_comment LIKE '%crashed%';
")

if [ "$CORRUPTED_TABLES" -gt 0 ]; then
    HEALTH_SCORE=$((HEALTH_SCORE - 30))
    ISSUES+=("发现 ${CORRUPTED_TABLES} 张损坏的表")
    echo -e "${RED}✗ 发现 ${CORRUPTED_TABLES} 张损坏的表${NC}"
else
    if [ "$OUTPUT_FORMAT" == "human" ]; then
        echo -e "${GREEN}✓ 所有表完整${NC}"
    fi
fi

# 5. 检查连接数
echo -e "${GREEN}[5/10] 检查连接数...${NC}"
CONNECTIONS=$($MYSQL_CMD -e "SHOW STATUS LIKE 'Threads_connected';" | awk '{print $2}')
MAX_CONNECTIONS=$($MYSQL_CMD -e "SHOW VARIABLES LIKE 'max_connections';" | awk '{print $2}')
CONNECTION_PERCENT=$((CONNECTIONS * 100 / MAX_CONNECTIONS))

if [ "$OUTPUT_FORMAT" == "human" ]; then
    echo -e "${GREEN}✓ 当前连接: ${CONNECTIONS}/${MAX_CONNECTIONS} (${CONNECTION_PERCENT}%)${NC}"
fi

if [ $CONNECTION_PERCENT -gt 80 ]; then
    HEALTH_SCORE=$((HEALTH_SCORE - 20))
    ISSUES+=("连接数过高: ${CONNECTION_PERCENT}%")
fi

# 6. 检查慢查询
echo -e "${GREEN}[6/10] 检查慢查询...${NC}"
SLOW_QUERIES=$($MYSQL_CMD -e "SHOW STATUS LIKE 'Slow_queries';" | awk '{print $2}')

if [ "$OUTPUT_FORMAT" == "human" ]; then
    echo -e "${GREEN}✓ 慢查询数: ${SLOW_QUERIES}${NC}"
fi

if [ "$SLOW_QUERIES" -gt 100 ]; then
    HEALTH_SCORE=$((HEALTH_SCORE - 10))
    ISSUES+=("慢查询过多: ${SLOW_QUERIES}")
fi

# 7. 检查InnoDB状态
echo -e "${GREEN}[7/10] 检查 InnoDB 状态...${NC}"
INNODB_STATUS=$($MYSQL_CMD -e "SHOW STATUS LIKE 'Innodb_buffer_pool_wait_free';" | awk '{print $2}')

if [ "$INNODB_STATUS" -eq 0 ]; then
    if [ "$OUTPUT_FORMAT" == "human" ]; then
        echo -e "${GREEN}✓ InnoDB 缓冲池正常${NC}"
    fi
else
    HEALTH_SCORE=$((HEALTH_SCORE - 15))
    ISSUES+=("InnoDB 缓冲池压力过大")
    echo -e "${YELLOW}⚠ InnoDB 缓冲池等待: ${INNODB_STATUS}${NC}"
fi

# 8. 检查磁盘空间
echo -e "${GREEN}[8/10] 检查磁盘空间...${NC}"
DISK_USAGE=$(df -h /var/lib/mysql 2>/dev/null | awk 'NR==2 {print $5}' | sed 's/%//')

if [ "$OUTPUT_FORMAT" == "human" ]; then
    echo -e "${GREEN}✓ 磁盘使用率: ${DISK_USAGE}%${NC}"
fi

if [ $DISK_USAGE -gt 80 ]; then
    HEALTH_SCORE=$((HEALTH_SCORE - 25))
    ISSUES+=("磁盘空间不足: ${DISK_USAGE}%")
    echo -e "${RED}✗ 磁盘空间告急！${NC}"
fi

# 9. 检查表碎片化
echo -e "${GREEN}[9/10] 检查表碎片化...${NC}"
FRAGMENTED=$($MYSQL_CMD -e "
    SELECT COUNT(*)
    FROM information_schema.tables
    WHERE table_schema='${DB_NAME}'
    AND data_free > 0;
")

if [ "$OUTPUT_FORMAT" == "human" ]; then
    echo -e "${GREEN}✓ 碎片化表数: ${FRAGMENTED}${NC}"
fi

if [ "$FRAGMENTED" -gt 5 ]; then
    HEALTH_SCORE=$((HEALTH_SCORE - 5))
    ISSUES+=("${FRAGMENTED} 张表需要优化")
fi

# 10. 检查最近的错误
echo -e "${GREEN}[10/10] 检查最近错误...${NC}"
ERROR_COUNT=$($MYSQL_CMD -e "SHOW STATUS LIKE 'Aborted_connects';" | awk '{print $2}')

if [ "$OUTPUT_FORMAT" == "human" ]; then
    echo -e "${GREEN}✓ 异常连接数: ${ERROR_COUNT}${NC}"
fi

if [ "$ERROR_COUNT" -gt 10 ]; then
    HEALTH_SCORE=$((HEALTH_SCORE - 10))
    ISSUES+=("异常连接过多")
fi

# 输出报告
echo ""
echo -e "${BLUE}=== 监控报告 ===${NC}"

if [ "$OUTPUT_FORMAT" == "json" ]; then
    cat << EOF
{
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "environment": "${ENV}",
  "health_score": ${HEALTH_SCORE},
  "status": "$([ $HEALTH_SCORE -ge 80 ] && echo "healthy" || ([ $HEALTH_SCORE -ge 50 ] && echo "warning" || echo "critical"))",
  "metrics": {
    "database_size_mb": ${DB_SIZE},
    "connections": {
      "current": ${CONNECTIONS},
      "max": ${MAX_CONNECTIONS},
      "usage_percent": ${CONNECTION_PERCENT}
    },
    "slow_queries": ${SLOW_QUERIES},
    "disk_usage_percent": ${DISK_USAGE},
    "fragmented_tables": ${FRAGMENTED},
    "aborted_connects": ${ERROR_COUNT}
  },
  "issues": [$(IFS=,; echo "${ISSUES[*]/\"/\\\"}" | sed 's/\([^,]*\)/"\1"/g')]
}
EOF
else
    # 人类可读格式
    if [ $HEALTH_SCORE -ge 80 ]; then
        echo -e "健康状态: ${GREEN}优秀${NC} (${HEALTH_SCORE}/100)"
    elif [ $HEALTH_SCORE -ge 50 ]; then
        echo -e "健康状态: ${YELLOW}良好${NC} (${HEALTH_SCORE}/100)"
    else
        echo -e "健康状态: ${RED}需要关注${NC} (${HEALTH_SCORE}/100)"
    fi

    if [ ${#ISSUES[@]} -gt 0 ]; then
        echo ""
        echo -e "${YELLOW}发现的问题:${NC}"
        for issue in "${ISSUES[@]}"; do
            echo -e "  • ${issue}"
        done
        echo ""
        echo -e "${YELLOW}建议操作:${NC}"
        echo "  • 运行 OPTIMIZE TABLE 优化碎片化表"
        echo "  • 检查慢查询日志"
        echo "  • 清理旧数据"
        if [ $DISK_USAGE -gt 80 ]; then
            echo "  • 清理二进制日志: PURGE BINARY LOGS BEFORE DATE(NOW() - INTERVAL 7 DAY)"
        fi
    else
        echo -e "${GREEN}未发现问题！数据库运行正常。${NC}"
    fi
fi

# 返回退出码
if [ $HEALTH_SCORE -ge 50 ]; then
    exit 0
else
    exit 1
fi
