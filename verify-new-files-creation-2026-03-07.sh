#!/bin/bash

# 验证新文件创建脚本
# 2026-03-07

echo "================================"
echo "验证新创建的文件"
echo "================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目路径
PROJECT_PATH="/root/.openclaw/workspace/cyberpress-platform"

# 文件列表
FILES=(
  "$PROJECT_PATH/frontend/components/ui/Charts.tsx"
  "$PROJECT_PATH/frontend/lib/utils/security.ts"
  "$PROJECT_PATH/frontend/lib/utils/http.utils.ts"
  "$PROJECT_PATH/frontend/services/websocket/websocket.service.ts"
  "$PROJECT_PATH/database/schema/design.schema.sql"
  "$PROJECT_PATH/NEW_FILES_CREATED_2026-03-07-ACTUAL.md"
)

# 检查函数
check_file() {
  local file=$1
  local name=$(basename "$file")

  if [ -f "$file" ]; then
    local lines=$(wc -l < "$file")
    local size=$(du -h "$file" | cut -f1)
    echo -e "${GREEN}✓${NC} $name ($lines 行, $size)"
    return 0
  else
    echo -e "${RED}✗${NC} $name - 文件不存在"
    return 1
  fi
}

# 统计变量
total_files=${#FILES[@]}
existing_files=0

# 检查所有文件
echo "检查文件..."
echo ""

for file in "${FILES[@]}"; do
  if check_file "$file"; then
    ((existing_files++))
  fi
done

echo ""
echo "================================"
echo "统计信息"
echo "================================"
echo -e "总文件数: $total_files"
echo -e "${GREEN}已创建: $existing_files${NC}"
echo -e "${RED}缺失: $((total_files - existing_files))${NC}"
echo ""

# 检查目录结构
echo "================================"
echo "检查目录结构"
echo "================================"
echo ""

check_dir() {
  local dir=$1
  local name=$(basename "$dir")

  if [ -d "$dir" ]; then
    echo -e "${GREEN}✓${NC} $name"
    return 0
  else
    echo -e "${RED}✗${NC} $name - 目录不存在"
    return 1
  fi
}

check_dir "$PROJECT_PATH/frontend/components/ui"
check_dir "$PROJECT_PATH/frontend/lib/utils"
check_dir "$PROJECT_PATH/frontend/services/websocket"
check_dir "$PROJECT_PATH/database/schema"

echo ""

# 显示文件详情
echo "================================"
echo "文件详情"
echo "================================"
echo ""

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo -e "${BLUE}➤${NC} $(basename "$file")"
    echo "   路径: $file"
    echo "   大小: $(du -h "$file" | cut -f1)"
    echo "   行数: $(wc -l < "$file")"
    echo ""
  fi
done

# 代码统计
echo "================================"
echo "代码统计"
echo "================================"
echo ""

total_lines=0
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    local lines=$(wc -l < "$file")
    total_lines=$((total_lines + lines))
  fi
done

echo "总代码行数: ~$total_lines 行"
echo ""

# 最终结果
echo "================================"
if [ $existing_files -eq $total_files ]; then
  echo -e "${GREEN}✓ 所有文件创建成功！${NC}"
  exit 0
else
  echo -e "${RED}✗ 部分文件创建失败${NC}"
  exit 1
fi
