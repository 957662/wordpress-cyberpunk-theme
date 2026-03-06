#!/bin/bash

# CyberPress Platform - 测试脚本
# 运行所有测试并生成覆盖率报告

set -e

echo "🧪 CyberPress Platform 测试套件"
echo "================================"

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 测试结果
TESTS_PASSED=0
TESTS_FAILED=0

# 运行前端测试
echo ""
echo "⚛️  运行前端测试..."
cd frontend

if [ -f "package.json" ]; then
    if npm run test -- --watchAll=false --coverage; then
        echo -e "${GREEN}✅ 前端测试通过${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ 前端测试失败${NC}"
        ((TESTS_FAILED++))
    fi
else
    echo -e "${YELLOW}⚠️  未找到前端测试配置${NC}"
fi

cd ..

# 运行后端测试
echo ""
echo "🐍 运行后端测试..."
cd backend

if [ -f "pytest.ini" ] || [ -d "tests" ]; then
    source venv/bin/activate

    if pytest tests/ -v --cov=app --cov-report=html --cov-report=term; then
        echo -e "${GREEN}✅ 后端测试通过${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ 后端测试失败${NC}"
        ((TESTS_FAILED++))
    fi

    deactivate
else
    echo -e "${YELLOW}⚠️  未找到后端测试配置${NC}"
fi

cd ..

# 运行类型检查
echo ""
echo "🔍 运行类型检查..."

# 前端类型检查
cd frontend
if npm run type-check; then
    echo -e "${GREEN}✅ 前端类型检查通过${NC}"
else
    echo -e "${RED}❌ 前端类型检查失败${NC}"
fi
cd ..

# 后端类型检查
cd backend
if mypy app/; then
    echo -e "${GREEN}✅ 后端类型检查通过${NC}"
else
    echo -e "${RED}❌ 后端类型检查失败${NC}"
fi
cd ..

# 运行 Lint 检查
echo ""
echo "🔍 运行 Lint 检查..."

# 前端 Lint
cd frontend
if npm run lint; then
    echo -e "${GREEN}✅ 前端 Lint 检查通过${NC}"
else
    echo -e "${YELLOW}⚠️  前端 Lint 检查发现问题${NC}"
fi
cd ..

# 后端 Lint
cd backend
if flake8 app/; then
    echo -e "${GREEN}✅ 后端 Lint 检查通过${NC}"
else
    echo -e "${YELLOW}⚠️  后端 Lint 检查发现问题${NC}"
fi
cd ..

# 打印结果
echo ""
echo "================================"
echo "📊 测试结果总结"
echo "================================"
echo -e "通过: ${GREEN}$TESTS_PASSED${NC}"
echo -e "失败: ${RED}$TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 所有测试通过！${NC}"
    exit 0
else
    echo -e "${RED}❌ 有测试失败${NC}"
    exit 1
fi
