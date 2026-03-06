#!/bin/bash

# 文件验证脚本 - 2026-03-06

echo "======================================"
echo "文件创建验证 - CyberPress Platform"
echo "======================================"
echo ""

# 定义要检查的文件
files=(
  "backend/app/api/v1/auth_enhanced.py"
  "backend/app/api/v1/posts_enhanced.py"
  "backend/app/api/v1/social.py"
  "backend/app/services/auth_service_enhanced.py"
  "backend/app/services/post_service_enhanced.py"
  "backend/app/services/social_service_enhanced.py"
  "backend/app/services/search_service.py"
  "backend/app/services/email_service.py"
  "frontend/lib/services/auth-service.ts"
  "frontend/lib/services/post-service.ts"
  "frontend/lib/services/social-service.ts"
)

# 统计变量
total=${#files[@]}
created=0
missing=0

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查每个文件
for file in "${files[@]}"; do
  if [ -f "/root/.openclaw/workspace/cyberpress-platform/$file" ]; then
    echo -e "${GREEN}✓${NC} $file"
    ((created++))
  else
    echo -e "${RED}✗${NC} $file (不存在)"
    ((missing++))
  fi
done

echo ""
echo "======================================"
echo "统计信息"
echo "======================================"
echo -e "总计: $total 个文件"
echo -e "${GREEN}已创建: $created 个${NC}"
echo -e "${RED}缺失: $missing 个${NC}"
echo ""

if [ $missing -eq 0 ]; then
  echo -e "${GREEN}✓ 所有文件都已成功创建！${NC}"
  exit 0
else
  echo -e "${RED}✗ 有 $missing 个文件缺失${NC}"
  exit 1
fi
