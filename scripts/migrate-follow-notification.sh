#!/bin/bash

# =============================================================================
# CyberPress Platform - 关注和通知系统数据库迁移脚本
# =============================================================================

set -e  # 遇到错误立即退出

echo "🚀 开始数据库迁移..."
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查是否在项目根目录
if [ ! -f "README.md" ]; then
    echo -e "${RED}错误: 请在项目根目录运行此脚本${NC}"
    exit 1
fi

# 进入后端目录
cd backend

echo -e "${YELLOW}步骤 1/3: 检查 Alembic 配置...${NC}"
if [ ! -f "alembic.ini" ]; then
    echo -e "${RED}错误: 未找到 alembic.ini 配置文件${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Alembic 配置文件存在${NC}"
echo ""

echo -e "${YELLOW}步骤 2/3: 执行数据库迁移...${NC}"
# 检查数据库连接
if ! python -c "from app.core.database import engine; engine.connect()" 2>/dev/null; then
    echo -e "${RED}错误: 无法连接到数据库，请检查数据库配置和连接${NC}"
    exit 1
fi

# 执行迁移
alembic upgrade head
echo -e "${GREEN}✓ 数据库迁移完成${NC}"
echo ""

echo -e "${YELLOW}步骤 3/3: 验证表结构...${NC}"
python -c "
from app.core.database import engine
from sqlalchemy import inspect

inspector = inspect(engine)
tables = inspector.get_table_names()

required_tables = [
    'follows',
    'follower_stats',
    'notifications',
    'notification_preferences',
    'notification_templates'
]

missing_tables = [t for t in required_tables if t not in tables]

if missing_tables:
    print(f'警告: 以下表未创建: {missing_tables}')
    exit(1)
else:
    print('✓ 所有必需的表都已创建')
"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ 迁移成功完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "已创建的表:"
echo "  - follows              (关注关系表)"
echo "  - follower_stats       (关注统计表)"
echo "  - notifications        (通知表)"
echo "  - notification_preferences  (通知偏好表)"
echo "  - notification_templates    (通知模板表)"
echo ""
echo "下一步:"
echo "  1. 启动后端服务: cd backend && python -m app.main"
echo "  2. 启动前端服务: cd frontend && npm run dev"
echo "  3. 访问页面: http://localhost:3000"
echo ""
