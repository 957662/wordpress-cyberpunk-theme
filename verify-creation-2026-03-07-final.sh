#!/bin/bash

# 验证文件创建 - 2026-03-07 最终版

echo "🔍 验证文件创建..."
echo "================================"

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 计数器
total_files=0
success_files=0
failed_files=0

# 检查文件函数
check_file() {
  local file=$1
  total_files=$((total_files + 1))

  if [ -f "$file" ]; then
    echo -e "${GREEN}✓${NC} $file"
    success_files=$((success_files + 1))
    return 0
  else
    echo -e "${RED}✗${NC} $file"
    failed_files=$((failed_files + 1))
    return 1
  fi
}

# 检查目录函数
check_dir() {
  local dir=$1
  total_files=$((total_files + 1))

  if [ -d "$dir" ]; then
    echo -e "${GREEN}✓${NC} $dir (目录)"
    success_files=$((success_files + 1))
    return 0
  else
    echo -e "${RED}✗${NC} $dir (目录)"
    failed_files=$((failed_files + 1))
    return 1
  fi
}

echo ""
echo "📦 Toast 通知系统"
echo "--------------------------------"

check_dir "frontend/components/toast"
check_file "frontend/components/toast/Toast.tsx"
check_file "frontend/components/toast/ToastProvider.tsx"
check_file "frontend/components/toast/index.ts"

echo ""
echo "📄 文档页面"
echo "--------------------------------"

check_dir "frontend/app/components-usage"
check_file "frontend/app/components-usage/page.tsx"

echo ""
echo "📋 报告文档"
echo "--------------------------------"

check_file "FILE_CREATION_SUMMARY_2026-03-07.md"

echo ""
echo "📊 统计信息"
echo "================================"
echo "总文件数: $total_files"
echo -e "${GREEN}成功: $success_files${NC}"
echo -e "${RED}失败: $failed_files${NC}"

if [ $failed_files -eq 0 ]; then
  echo ""
  echo -e "${GREEN}🎉 所有文件验证通过!${NC}"
  exit 0
else
  echo ""
  echo -e "${RED}❌ 有 $failed_files 个文件验证失败${NC}"
  exit 1
fi
