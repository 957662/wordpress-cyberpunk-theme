#!/bin/bash

# 验证核心集成文件创建脚本
# Verification Script for Core Integration Files

echo "================================"
echo "核心集成文件验证"
echo "Core Integration Files Verification"
echo "================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 统计变量
total_files=0
existing_files=0
missing_files=0

echo "📋 检查文件列表..."
echo "Checking file list..."
echo ""

# 文件列表
files=(
  "frontend/lib/services/wp-service.ts"
  "frontend/lib/hooks/useWordPress.ts"
  "frontend/lib/blog/data-source.ts"
  "frontend/app/blog-complete/page.tsx"
  "frontend/components/blog/QuickStartGuide.tsx"
  "DEV_TASKS_2026-03-07.md"
  "DELIVERY_REPORT_CORE_INTEGRATION.md"
  "verify-core-integration.sh"
)

# 检查每个文件
for file in "${files[@]}"; do
  total_files=$((total_files + 1))

  if [ -f "$file" ]; then
    existing_files=$((existing_files + 1))
    size=$(du -h "$file" | cut -f1)
    lines=$(wc -l < "$file")
    echo -e "${GREEN}✓${NC} $file ($size, $lines lines)"
  else
    missing_files=$((missing_files + 1))
    echo -e "${RED}✗${NC} $file (缺失)"
  fi
done

echo ""
echo "================================"
echo "📊 统计信息 / Statistics"
echo "================================"
echo -e "总文件数 / Total files: ${YELLOW}$total_files${NC}"
echo -e "存在 / Existing: ${GREEN}$existing_files${NC}"
echo -e "缺失 / Missing: ${RED}$missing_files${NC}"
echo ""

# 计算完成率
if [ $total_files -gt 0 ]; then
  completion=$((existing_files * 100 / total_files))
  echo -e "完成率 / Completion: ${YELLOW}${completion}%${NC}"
  echo ""

  if [ $missing_files -eq 0 ]; then
    echo -e "${GREEN}✓ 所有文件都已创建！${NC}"
    echo -e "${GREEN}✓ All files have been created!${NC}"
    exit 0
  else
    echo -e "${RED}✗ 有 $missing_files 个文件缺失${NC}"
    echo -e "${RED}✗ $missing_files file(s) missing${NC}"
    exit 1
  fi
else
  echo -e "${RED}✗ 没有找到文件${NC}"
  echo -e "${RED}✗ No files found${NC}"
  exit 1
fi
