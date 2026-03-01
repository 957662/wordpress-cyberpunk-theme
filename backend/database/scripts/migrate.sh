#!/bin/bash
# =====================================================
# CyberPress Database Migration Script
# =====================================================
# 用途: 管理数据库迁移
# 使用: ./scripts/migrate.sh [command] [environment]
# 命令:
#   status    - 查看迁移状态
#   up        - 执行所有待执行的迁移
#   down      - 回滚最后一次迁移（需要手动指定SQL）
#   create    - 创建新的迁移文件
# =====================================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 配置
MIGRATIONS_DIR="$(dirname "$0")/../migrations"
COMMAND=${1:-status}
ENV=${2:-development}
ENV_FILE="../../.env.${ENV}"

# 加载环境变量
if [ -f "$ENV_FILE" ]; then
    source $ENV_FILE
else
    echo -e "${RED}错误: 环境文件不存在: $ENV_FILE${NC}"
    exit 1
fi

# MySQL 连接命令
MYSQL_CMD="mysql -h ${DB_HOST} -P ${DB_PORT} -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME} -s -N"

# 函数：显示帮助
show_help() {
    cat << EOF
${BLUE}CyberPress 数据库迁移工具${NC}

使用: $(basename "$0") [command] [environment]

命令:
  ${GREEN}status${NC}    查看迁移状态
  ${GREEN}up${NC}        执行所有待执行的迁移
  ${GREEN}down${NC}      回滚最后一次迁移
  ${GREEN}create${NC}    创建新的迁移文件
  ${GREEN}help${NC}      显示此帮助信息

环境:
  ${GREEN}development${NC}  开发环境 (默认)
  ${GREEN}staging${NC}      预发布环境
  ${GREEN}production${NC}   生产环境

示例:
  $(basename "$0") status development
  $(basename "$0") up production
  $(basename "$0") create add_user_preferences_table
EOF
}

# 函数：确保迁移表存在
ensure_migrations_table() {
    $MYSQL_CMD -e "
        CREATE TABLE IF NOT EXISTS migrations (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT,
            migration VARCHAR(255) NOT NULL,
            batch INT NOT NULL,
            executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    " 2>/dev/null
}

# 函数：获取已执行的迁移
get_executed_migrations() {
    ensure_migrations_table
    $MYSQL_CMD -e "SELECT migration FROM migrations ORDER BY executed_at;" 2>/dev/null || echo ""
}

# 函数：获取所有迁移文件
get_migration_files() {
    if [ -d "$MIGRATIONS_DIR" ]; then
        ls -1 "$MIGRATIONS_DIR"/*.sql 2>/dev/null | xargs -n1 basename | sort
    fi
}

# 函数：获取待执行的迁移
get_pending_migrations() {
    local executed=$(get_executed_migrations)
    local files=$(get_migration_files)

    for file in $files; do
        local migration_name=${file%.sql}
        if ! echo "$executed" | grep -q "^${migration_name}$"; then
            echo "$migration_name"
        fi
    done
}

# 命令：status
cmd_status() {
    echo -e "${BLUE}=== 迁移状态 ===${NC}"
    echo -e "环境: ${YELLOW}${ENV}${NC}"
    echo ""

    ensure_migrations_table

    local executed=$(get_executed_migrations)
    local files=$(get_migration_files)
    local total_files=$(echo "$files" | wc -l)
    local total_executed=$(echo "$executed" | wc -l)

    echo -e "${GREEN}已执行: ${total_executed}/${total_files}${NC}"
    echo ""

    if [ -n "$executed" ]; then
        echo -e "${GREEN}已执行的迁移:${NC}"
        echo "$executed" | while read migration; do
            echo -e "  ${GREEN}✓${NC} ${migration}"
        done
        echo ""
    fi

    local pending=$(get_pending_migrations)
    if [ -n "$pending" ]; then
        echo -e "${YELLOW}待执行的迁移:${NC}"
        echo "$pending" | while read migration; do
            echo -e "  ${YELLOW}○${NC} ${migration}"
        done
        echo ""
    else
        echo -e "${GREEN}所有迁移都已执行！${NC}"
        echo ""
    fi

    # 显示最后一批次号
    local last_batch=$($MYSQL_CMD -e "SELECT MAX(batch) FROM migrations;" 2>/dev/null)
    echo "当前批次号: ${last_batch:-0}"
}

# 命令：up
cmd_up() {
    echo -e "${BLUE}=== 执行迁移 ===${NC}"
    echo -e "环境: ${YELLOW}${ENV}${NC}"
    echo ""

    ensure_migrations_table

    local pending=$(get_pending_migrations)
    if [ -z "$pending" ]; then
        echo -e "${GREEN}没有待执行的迁移${NC}"
        return 0
    fi

    local pending_count=$(echo "$pending" | wc -l)
    echo -e "找到 ${YELLOW}${pending_count}${NC} 个待执行的迁移"
    echo ""

    # 获取下一批次号
    local next_batch=$($MYSQL_CMD -e "SELECT COALESCE(MAX(batch), 0) + 1 FROM migrations;" 2>/dev/null)

    # 执行迁移
    echo "$pending" | while read migration; do
        local migration_file="$MIGRATIONS_DIR/${migration}.sql"

        echo -e "${GREEN}[执行]${NC} ${migration}"

        # 检查文件是否存在
        if [ ! -f "$migration_file" ]; then
            echo -e "${RED}错误: 迁移文件不存在: ${migration_file}${NC}"
            continue
        fi

        # 读取并执行迁移
        local migration_sql=$(cat "$migration_file")

        # 使用事务执行迁移
        local result=$(echo "
            SET autocommit = 0;
            START TRANSACTION;

            ${migration_sql}

            INSERT INTO migrations (migration, batch) VALUES ('${migration}', ${next_batch});

            COMMIT;
            SELECT 'SUCCESS';
        " | $MYSQL_CMD 2>&1) || echo "FAILED"

        if echo "$result" | grep -q "SUCCESS"; then
            echo -e "${GREEN}  ✓ 成功${NC}"
        else
            echo -e "${RED}  ✗ 失败${NC}"
            echo -e "${RED}  错误信息:${NC}"
            echo "$result" | sed 's/^/    /'
            return 1
        fi
    done

    echo ""
    echo -e "${GREEN}=== 迁移完成 ===${NC}"
}

# 命令：down
cmd_down() {
    echo -e "${BLUE}=== 回滚迁移 ===${NC}"
    echo -e "环境: ${YELLOW}${ENV}${NC}"
    echo ""

    ensure_migrations_table

    # 获取最后一次执行的迁移
    local last_migration=$($MYSQL_CMD -e "
        SELECT migration
        FROM migrations
        ORDER BY executed_at DESC
        LIMIT 1;
    " 2>/dev/null)

    if [ -z "$last_migration" ]; then
        echo -e "${YELLOW}没有可以回滚的迁移${NC}"
        return 0
    fi

    echo -e "最后一次迁移: ${YELLOW}${last_migration}${NC}"
    echo -e "${RED}警告: 回滚需要手动执行 SQL 语句${NC}"
    echo ""
    echo "请手动执行以下步骤:"
    echo "  1. 创建回滚 SQL 文件: migrations/${last_migration}.down.sql"
    echo "  2. 执行回滚: mysql -u \$USER -p \$DB < migrations/${last_migration}.down.sql"
    echo "  3. 从迁移表中删除记录:"
    echo "     DELETE FROM migrations WHERE migration = '${last_migration}';"
}

# 命令：create
cmd_create() {
    local migration_name=$2

    if [ -z "$migration_name" ]; then
        echo -e "${RED}错误: 请提供迁移名称${NC}"
        echo "使用: $(basename "$0") create <migration_name>"
        echo "示例: $(basename "$0") create add_user_preferences_table"
        exit 1
    fi

    # 转换为 snake_case
    migration_name=$(echo "$migration_name" | tr 'A-Z' 'a-z' | tr ' ' '_')

    # 获取下一个迁移编号
    local last_number=$(ls -1 "$MIGRATIONS_DIR" 2>/dev/null | grep '^[0-9]' | sed 's/_.*//' | sort -n | tail -1)
    local next_number=$(printf "%03d" $((10#${last_number:-0} + 1)))

    local migration_file="$MIGRATIONS_DIR/${next_number}_${migration_name}.sql"

    cat > "$migration_file" << EOF
-- =====================================================
-- Migration: ${next_number}_${migration_name}
-- =====================================================
-- Version: 1.0.0
-- Created: $(date +%Y-%m-%d)
-- Description: ${migration_name}
-- =====================================================

-- 记录迁移
INSERT INTO \`migrations\` (\`migration\`, \`batch\`)
VALUES ('${next_number}_${migration_name}', 1);

-- 在此编写你的迁移 SQL
-- ...

-- 验证脚本（可选）
-- ...

SELECT 'Migration ${next_number}_${migration_name} completed successfully!' AS message;
EOF

    echo -e "${GREEN}迁移文件已创建: ${migration_file}${NC}"
    echo -e "${YELLOW}请编辑文件并添加迁移 SQL${NC}"
}

# 主程序
case "$COMMAND" in
    status)
        cmd_status
        ;;
    up)
        cmd_up
        ;;
    down)
        cmd_down
        ;;
    create)
        cmd_create "$2"
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo -e "${RED}错误: 未知命令 '$COMMAND'${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac
