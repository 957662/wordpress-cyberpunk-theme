#!/bin/bash

# 验证新组件创建脚本
# 生成时间: 2026-03-06

echo "==================================="
echo "🚀 CyberPress Platform - 组件创建验证"
echo "==================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 项目路径
PROJECT_DIR="/root/.openclaw/workspace/cyberpress-platform"
FRONTEND_DIR="$PROJECT_DIR/frontend"

# 文件列表
declare -a FILES=(
  # 组件文件
  "$FRONTEND_DIR/components/blog/CodeHighlighter.tsx"
  "$FRONTEND_DIR/components/blog/TableOfContentsEnhanced.tsx"
  "$FRONTEND_DIR/components/blog/LikeButton.tsx"
  "$FRONTEND_DIR/components/blog/ShareButton.tsx"
  "$FRONTEND_DIR/components/blog/FavoriteButton.tsx"
  "$FRONTEND_DIR/components/blog/SearchBarEnhanced.tsx"
  "$FRONTEND_DIR/components/blog/ReadingTimeCalculator.tsx"
  "$FRONTEND_DIR/components/blog/ArticleActionBar.tsx"

  # 工具函数
  "$FRONTEND_DIR/lib/utils/article.ts"
  "$FRONTEND_DIR/lib/utils/search.ts"

  # 类型定义
  "$FRONTEND_DIR/types/blog.ts"

  # 示例页面
  "$FRONTEND_DIR/app/blog/examples/enhanced-blog-post/page.tsx"

  # 文档
  "$PROJECT_DIR/DEVELOPMENT_DELIVERABLES.md"
)

# 统计变量
TOTAL_FILES=${#FILES[@]}
EXISTING_COUNT=0
MISSING_COUNT=0

echo "📋 检查文件列表..."
echo ""

# 检查每个文件
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    EXISTING_COUNT=$((EXISTING_COUNT + 1))
    echo -e "${GREEN}✓${NC} $(basename $file)"

    # 显示文件大小
    SIZE=$(du -h "$file" | cut -f1)
    echo "  大小: $SIZE"

    # 显示行数
    LINES=$(wc -l < "$file")
    echo "  行数: $LINES"
    echo ""
  else
    MISSING_COUNT=$((MISSING_COUNT + 1))
    echo -e "${RED}✗${NC} $(basename $file) - 文件不存在"
    echo ""
  fi
done

echo "==================================="
echo "📊 统计结果"
echo "==================================="
echo ""
echo -e "总文件数: ${YELLOW}$TOTAL_FILES${NC}"
echo -e "已创建: ${GREEN}$EXISTING_COUNT${NC}"
echo -e "缺失: ${RED}$MISSING_COUNT${NC}"
echo ""

if [ $MISSING_COUNT -eq 0 ]; then
  echo -e "${GREEN}🎉 所有文件都已成功创建!${NC}"
  echo ""

  # 统计代码行数
  echo "📈 代码统计:"
  echo ""
  TOTAL_LINES=0
  for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
      LINES=$(wc -l < "$file")
      TOTAL_LINES=$((TOTAL_LINES + LINES))
    fi
  done
  echo "总代码行数: $TOTAL_LINES"
  echo ""

  # 分类统计
  echo "📁 分类统计:"
  echo ""

  # 组件文件
  COMPONENT_LINES=0
  for file in "$FRONTEND_DIR/components/blog"/*.tsx; do
    if [ -f "$file" ]; then
      LINES=$(wc -l < "$file")
      COMPONENT_LINES=$((COMPONENT_LINES + LINES))
    fi
  done
  echo "组件文件: $COMPONENT_LINES 行"

  # 工具函数
  UTILS_LINES=0
  for file in "$FRONTEND_DIR/lib/utils"/*.ts; do
    if [ -f "$file" ]; then
      LINES=$(wc -l < "$file")
      UTILS_LINES=$((UTILS_LINES + LINES))
    fi
  done
  echo "工具函数: $UTILS_LINES 行"

  # 类型定义
  if [ -f "$FRONTEND_DIR/types/blog.ts" ]; then
    TYPES_LINES=$(wc -l < "$FRONTEND_DIR/types/blog.ts")
    echo "类型定义: $TYPES_LINES 行"
  fi

  echo ""
  echo "==================================="
  echo "✅ 验证完成"
  echo "==================================="
  echo ""
  echo "🚀 下一步:"
  echo "1. 安装依赖: npm install react-syntax-highlighter"
  echo "2. 查看示例: /blog/examples/enhanced-blog-post"
  echo "3. 阅读文档: DEVELOPMENT_DELIVERABLES.md"
  echo ""

  exit 0
else
  echo -e "${RED}❌ 有 $MISSING_COUNT 个文件未创建${NC}"
  echo ""
  echo "请检查文件路径或重新运行创建脚本。"
  echo ""
  exit 1
fi
