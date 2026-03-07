#!/bin/bash

# 博客组件集成验证脚本
# 验证所有创建的文件和组件

echo "========================================"
echo "博客组件集成验证"
echo "========================================"
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

# 检查文件函数
check_file() {
  local file=$1
  total_files=$((total_files + 1))

  if [ -f "$file" ]; then
    echo -e "${GREEN}✓${NC} $file"
    existing_files=$((existing_files + 1))

    # 显示文件大小
    size=$(du -h "$file" | cut -f1)
    echo "  大小: $size"
  else
    echo -e "${RED}✗${NC} $file"
    missing_files=$((missing_files + 1))
  fi
}

echo "1. 验证核心博客组件"
echo "----------------------------------------"
check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/components/blog/BlogList.tsx"
check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/components/blog/BlogGrid.tsx"
check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/components/blog/ArticleCard.tsx"
check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/components/blog/BlogCardUnified.tsx"
check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/components/blog/BlogSearch.tsx"
check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/components/blog/CategoryFilter.tsx"
check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/components/blog/LoadingState.tsx"
echo ""

echo "2. 验证依赖组件"
echo "----------------------------------------"
check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/components/pagination/Pagination.tsx"
check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/lib/blog/adapters.ts"
check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/types/models/blog.ts"
echo ""

echo "3. 验证新创建的文件"
echo "----------------------------------------"
check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/app/examples/blog-components-demo/page.tsx"
check_file "/root/.openclaw/workspace/cyberpress-platform/frontend/app/examples/blog-components-demo/README.md"
check_file "/root/.openclaw/workspace/cyberpress-platform/BLOG_COMPONENTS_INTEGRATION_REPORT.md"
echo ""

echo "4. 验证导入路径"
echo "----------------------------------------"
echo "检查 TypeScript 配置..."
if grep -q "@/components/blog" /root/.openclaw/workspace/cyberpress-platform/frontend/tsconfig.json; then
  echo -e "${GREEN}✓${NC} tsconfig.json 配置正确"
else
  echo -e "${YELLOW}⚠${NC} 未找到路径别名配置（可能使用 jsconfig.json）"
fi
echo ""

echo "5. 统计信息"
echo "----------------------------------------"
echo "总文件数: $total_files"
echo -e "存在文件: ${GREEN}$existing_files${NC}"
echo -e "缺失文件: ${RED}$missing_files${NC}"
echo ""

echo "6. 组件功能检查"
echo "----------------------------------------"

# 检查 BlogList 组件
if grep -q "export function BlogList" /root/.openclaw/workspace/cyberpress-platform/frontend/components/blog/BlogList.tsx 2>/dev/null; then
  echo -e "${GREEN}✓${NC} BlogList 组件导出正确"
else
  echo -e "${RED}✗${NC} BlogList 组件导出有问题"
fi

# 检查 BlogGrid 组件
if grep -q "export function BlogGrid" /root/.openclaw/workspace/cyberpress-platform/frontend/components/blog/BlogGrid.tsx 2>/dev/null; then
  echo -e "${GREEN}✓${NC} BlogGrid 组件导出正确"
else
  echo -e "${RED}✗${NC} BlogGrid 组件导出有问题"
fi

# 检查 ArticleCard 组件
if grep -q "export function ArticleCard" /root/.openclaw/workspace/cyberpress-platform/frontend/components/blog/ArticleCard.tsx 2>/dev/null; then
  echo -e "${GREEN}✓${NC} ArticleCard 组件导出正确"
else
  echo -e "${RED}✗${NC} ArticleCard 组件导出有问题"
fi

# 检查演示页面
if grep -q "export default function BlogComponentsDemoPage" /root/.openclaw/workspace/cyberpress-platform/frontend/app/examples/blog-components-demo/page.tsx 2>/dev/null; then
  echo -e "${GREEN}✓${NC} 演示页面组件导出正确"
else
  echo -e "${RED}✗${NC} 演示页面组件导出有问题"
fi
echo ""

echo "========================================"
echo "验证完成"
echo "========================================"

# 最终结果
if [ $missing_files -eq 0 ]; then
  echo -e "${GREEN}✓ 所有文件都已正确创建！${NC}"
  exit 0
else
  echo -e "${RED}✗ 有 $missing_files 个文件缺失${NC}"
  exit 1
fi
