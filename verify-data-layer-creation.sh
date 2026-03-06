#!/bin/bash

# 验证数据层文件创建脚本
# 2026-03-07

echo "================================"
echo "验证数据层文件创建"
echo "================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 计数器
total_files=0
existing_files=0
missing_files=0

# 检查文件是否存在
check_file() {
  total_files=$((total_files + 1))
  if [ -f "$1" ]; then
    echo -e "${GREEN}✓${NC} $1"
    existing_files=$((existing_files + 1))
    return 0
  else
    echo -e "${RED}✗${NC} $1 (文件不存在)"
    missing_files=$((missing_files + 1))
    return 1
  fi
}

echo "1. 数据层文件"
echo "--------------------------------"

check_file "frontend/lib/data/posts.ts"
check_file "frontend/lib/data/categories.ts"
check_file "frontend/lib/data/adapter.ts"
check_file "frontend/lib/data/index.ts"

echo ""
echo "2. 组件文件"
echo "--------------------------------"

check_file "frontend/components/blog/BlogCardAdaptive.tsx"
check_file "frontend/components/blog/BlogPageClient.tsx"

echo ""
echo "3. 页面文件"
echo "--------------------------------"

check_file "frontend/app/blog/page-server.tsx"

echo ""
echo "4. 文档文件"
echo "--------------------------------"

check_file "DEVELOPMENT_TASKS_2026-03-07-ACTUAL.md"
check_file "QUICKSTART_DATA_LAYER.md"

echo ""
echo "================================"
echo "验证结果"
echo "================================"
echo -e "总文件数: ${YELLOW}$total_files${NC}"
echo -e "已创建: ${GREEN}$existing_files${NC}"
echo -e "缺失: ${RED}$missing_files${NC}"
echo ""

if [ $missing_files -eq 0 ]; then
    echo -e "${GREEN}✓ 所有文件都已成功创建！${NC}"
    echo ""
    echo "下一步："
    echo "1. 查看 QUICKSTART_DATA_LAYER.md 了解如何使用"
    echo "2. 配置 .env.local 设置 WordPress API URL"
    echo "3. 运行 npm run dev 启动开发服务器"
    exit 0
else
    echo -e "${RED}✗ 有 $missing_files 个文件缺失${NC}"
    exit 1
fi
