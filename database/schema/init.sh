#!/bin/bash

# CyberPress Platform - Database Initialization Script
# 数据库初始化脚本

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 配置
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-cyberpress}"
DB_USER="${DB_USER:-postgres}"
DB_PASSWORD="${DB_PASSWORD:-postgres}"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}CyberPress Database Initialization${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 检查 PostgreSQL 是否运行
echo -e "${YELLOW}检查 PostgreSQL 连接...${NC}"
if ! pg_isready -h $DB_HOST -p $DB_PORT > /dev/null 2>&1; then
    echo -e "${RED}错误: PostgreSQL 未运行${NC}"
    exit 1
fi
echo -e "${GREEN}✓ PostgreSQL 运行中${NC}"
echo ""

# 设置环境变量
export PGPASSWORD=$DB_PASSWORD

# 检查数据库是否存在
echo -e "${YELLOW}检查数据库是否存在...${NC}"
DB_EXISTS=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -lqt | cut -d \| -f 1 | grep -w $DB_NAME | wc -l)

if [ $DB_EXISTS -eq 0 ]; then
    echo -e "${YELLOW}创建数据库 $DB_NAME...${NC}"
    createdb -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME
    echo -e "${GREEN}✓ 数据库创建成功${NC}"
else
    echo -e "${GREEN}✓ 数据库已存在${NC}"
fi
echo ""

# 执行核心架构
echo -e "${YELLOW}执行核心数据库架构...${NC}"
if psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$(dirname "$0")/core-schema.sql"; then
    echo -e "${GREEN}✓ 核心架构创建成功${NC}"
else
    echo -e "${RED}✗ 核心架构创建失败${NC}"
    exit 1
fi
echo ""

# 执行性能架构
echo -e "${YELLOW}执行性能优化架构...${NC}"
if psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$(dirname "$0")/performance-schema.sql"; then
    echo -e "${GREEN}✓ 性能架构创建成功${NC}"
else
    echo -e "${RED}✗ 性能架构创建失败${NC}"
    exit 1
fi
echo ""

# 验证表创建
echo -e "${YELLOW}验证表创建...${NC}"
TABLES=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")
echo -e "${GREEN}✓ 已创建 $TABLES 个表${NC}"
echo ""

# 显示数据库信息
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}数据库初始化完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "数据库信息:"
echo "  主机: $DB_HOST"
echo "  端口: $DB_PORT"
echo "  数据库名: $DB_NAME"
echo "  用户: $DB_USER"
echo ""
echo "连接命令:"
echo "  psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME"
echo ""

# 清理环境变量
unset PGPASSWORD
