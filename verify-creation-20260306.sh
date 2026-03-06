#!/bin/bash

# 验证创建的文件
# 2026-03-06

echo "======================================"
echo "CyberPress Platform - 文件创建验证"
echo "======================================"
echo ""

# 项目路径
PROJECT_DIR="/root/.openclaw/workspace/cyberpress-platform"
FRONTEND_DIR="$PROJECT_DIR/frontend"

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 计数器
total_files=0
created_files=0
missing_files=0

echo "检查 API 服务层..."
echo "--------------------------------------"

# API 服务文件
api_files=(
  "services/api/blog-service.ts"
  "services/api/social-service.ts"
  "services/api/index.ts"
)

for file in "${api_files[@]}"; do
  total_files=$((total_files + 1))
  if [ -f "$FRONTEND_DIR/$file" ]; then
    echo -e "${GREEN}✓${NC} $file"
    created_files=$((created_files + 1))
  else
    echo -e "${RED}✗${NC} $file (缺失)"
    missing_files=$((missing_files + 1))
  fi
done

echo ""
echo "检查 React Hooks..."
echo "--------------------------------------"

# Hooks 文件
hooks_files=(
  "hooks/use-blog-data.ts"
  "hooks/use-social-interactions.ts"
  "hooks/index.ts"
)

for file in "${hooks_files[@]}"; do
  total_files=$((total_files + 1))
  if [ -f "$FRONTEND_DIR/$file" ]; then
    echo -e "${GREEN}✓${NC} $file"
    created_files=$((created_files + 1))
  else
    echo -e "${RED}✗${NC} $file (缺失)"
    missing_files=$((missing_files + 1))
  fi
done

echo ""
echo "检查优化组件..."
echo "--------------------------------------"

# 组件文件
component_files=(
  "components/blog/BlogListOptimized.tsx"
  "components/blog/BlogGridOptimized.tsx"
  "components/blog/PaginationComponent.tsx"
  "components/blog/CommentSystemEnhanced.tsx"
  "components/blog/SocialShareButtons.tsx"
  "components/blog/ReadingProgressIndicator.tsx"
  "components/blog/TableOfContentsAuto.tsx"
)

for file in "${component_files[@]}"; do
  total_files=$((total_files + 1))
  if [ -f "$FRONTEND_DIR/$file" ]; then
    echo -e "${GREEN}✓${NC} $file"
    created_files=$((created_files + 1))
  else
    echo -e "${RED}✗${NC} $file (缺失)"
    missing_files=$((missing_files + 1))
  fi
done

echo ""
echo "检查工具和常量..."
echo "--------------------------------------"

# 工具文件
util_files=(
  "lib/constants/blog.ts"
  "lib/validators/blog-validator.ts"
)

for file in "${util_files[@]}"; do
  total_files=$((total_files + 1))
  if [ -f "$FRONTEND_DIR/$file" ]; then
    echo -e "${GREEN}✓${NC} $file"
    created_files=$((created_files + 1))
  else
    echo -e "${RED}✗${NC} $file (缺失)"
    missing_files=$((missing_files + 1))
  fi
done

echo ""
echo "======================================"
echo "验证结果汇总"
echo "======================================"
echo -e "总文件数: ${YELLOW}$total_files${NC}"
echo -e "已创建:   ${GREEN}$created_files${NC}"
echo -e "缺失:     ${RED}$missing_files${NC}"
echo ""

if [ $missing_files -eq 0 ]; then
  echo -e "${GREEN}✓ 所有文件创建成功！${NC}"
  exit 0
else
  echo -e "${RED}✗ 有 $missing_files 个文件缺失${NC}"
  exit 1
fi
