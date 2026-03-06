#!/bin/bash

# 点赞和收藏功能快速测试脚本
# CyberPress Platform - Backend

set -e

echo "=========================================="
echo "  点赞和收藏功能测试脚本"
echo "  CyberPress Platform"
echo "=========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查 Python 环境
echo -e "${YELLOW}[1/7] 检查 Python 环境...${NC}"
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}✗ Python 3 未安装${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Python 环境正常${NC}"
echo ""

# 进入后端目录
cd "$(dirname "$0")"

# 检查虚拟环境
echo -e "${YELLOW}[2/7] 检查虚拟环境...${NC}"
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}⚠ 虚拟环境不存在，正在创建...${NC}"
    python3 -m venv venv
fi
echo -e "${GREEN}✓ 虚拟环境就绪${NC}"
echo ""

# 激活虚拟环境
echo -e "${YELLOW}[3/7] 激活虚拟环境...${NC}"
source venv/bin/activate
echo -e "${GREEN}✓ 虚拟环境已激活${NC}"
echo ""

# 安装依赖
echo -e "${YELLOW}[4/7] 检查依赖...${NC}"
pip install -q pytest pytest-cov pytest-asyncio httpx
echo -e "${GREEN}✓ 依赖已安装${NC}"
echo ""

# 检查数据库连接
echo -e "${YELLOW}[5/7] 检查数据库连接...${NC}"
if ! python3 -c "from app.core.database import engine; print('Database connected')" 2>/dev/null; then
    echo -e "${RED}✗ 数据库连接失败${NC}"
    echo "请确保数据库已启动且配置正确"
    exit 1
fi
echo -e "${GREEN}✓ 数据库连接正常${NC}"
echo ""

# 应用数据库迁移
echo -e "${YELLOW}[6/7] 应用数据库迁移...${NC}"
alembic upgrade head
echo -e "${GREEN}✓ 数据库迁移完成${NC}"
echo ""

# 运行测试
echo -e "${YELLOW}[7/7] 运行测试...${NC}"
echo ""

# 测试点赞服务
echo -e "${YELLOW}测试点赞服务...${NC}"
if pytest app/tests/test_likes.py -v --tb=short; then
    echo -e "${GREEN}✓ 点赞服务测试通过${NC}"
else
    echo -e "${RED}✗ 点赞服务测试失败${NC}"
    exit 1
fi
echo ""

# 测试收藏服务
echo -e "${YELLOW}测试收藏服务...${NC}"
if pytest app/tests/test_bookmarks.py -v --tb=short; then
    echo -e "${GREEN}✓ 收藏服务测试通过${NC}"
else
    echo -e "${RED}✗ 收藏服务测试失败${NC}"
    exit 1
fi
echo ""

# 测试点赞 API
echo -e "${YELLOW}测试点赞 API...${NC}"
if pytest app/tests/test_likes_api.py -v --tb=short; then
    echo -e "${GREEN}✓ 点赞 API 测试通过${NC}"
else
    echo -e "${RED}✗ 点赞 API 测试失败${NC}"
    exit 1
fi
echo ""

# 测试收藏 API
echo -e "${YELLOW}测试收藏 API...${NC}"
if pytest app/tests/test_bookmarks_api.py -v --tb=short; then
    echo -e "${GREEN}✓ 收藏 API 测试通过${NC}"
else
    echo -e "${RED}✗ 收藏 API 测试失败${NC}"
    exit 1
fi
echo ""

# 生成覆盖率报告
echo -e "${YELLOW}生成覆盖率报告...${NC}"
pytest app/tests/test_likes.py app/tests/test_bookmarks.py \
    --cov=app.services.like_service \
    --cov=app.services.bookmark_service \
    --cov-report=term-missing \
    --cov-report=html
echo ""

echo "=========================================="
echo -e "${GREEN}  ✓ 所有测试通过！${NC}"
echo "=========================================="
echo ""
echo "📊 覆盖率报告已生成到: htmlcov/index.html"
echo ""
echo "🚀 启动开发服务器:"
echo "   uvicorn app.main:app --reload"
echo ""
echo "📖 查看 API 文档:"
echo "   http://localhost:8000/api/docs"
echo ""
echo "📚 查看详细文档:"
echo "   cat LIKES_AND_BOOKMARKS_API.md"
echo ""
