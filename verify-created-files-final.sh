#!/bin/bash

echo "==================================="
echo "验证创建的文件 - 2026-03-07"
echo "==================================="
echo ""

BACKEND_FILES=(
  "backend/app/api/categories.py"
  "backend/app/api/tags.py"
  "backend/app/services/category_service.py"
  "backend/app/schemas/category.py"
  "backend/app/schemas/tag.py"
)

FRONTEND_COMPONENTS=(
  "frontend/components/categories/CategoryCard.tsx"
  "frontend/components/categories/CategoryGrid.tsx"
  "frontend/components/tags/TagBadge.tsx"
  "frontend/components/tags/TagList.tsx"
)

FRONTEND_SERVICES=(
  "frontend/services/api/categories.ts"
  "frontend/services/api/tags.ts"
  "frontend/services/api/posts.ts"
)

FRONTEND_PAGES=(
  "frontend/app/categories/page.tsx"
)

echo "检查后端文件..."
echo "-------------------"
backend_count=0
for file in "${BACKEND_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
    ((backend_count++))
  else
    echo "❌ $file (未找到)"
  fi
done
echo ""

echo "检查前端组件..."
echo "-------------------"
component_count=0
for file in "${FRONTEND_COMPONENTS[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
    ((component_count++))
  else
    echo "❌ $file (未找到)"
  fi
done
echo ""

echo "检查前端服务..."
echo "-------------------"
service_count=0
for file in "${FRONTEND_SERVICES[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
    ((service_count++))
  else
    echo "❌ $file (未找到)"
  fi
done
echo ""

echo "检查前端页面..."
echo "-------------------"
page_count=0
for file in "${FRONTEND_PAGES[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
    ((page_count++))
  else
    echo "❌ $file (未找到)"
  fi
done
echo ""

total=$((backend_count + component_count + service_count + page_count))
expected=${#BACKEND_FILES[@]}+${#FRONTEND_COMPONENTS[@]}+${#FRONTEND_SERVICES[@]}+${#FRONTEND_PAGES[@]}

echo "==================================="
echo "统计结果"
echo "==================================="
echo "后端文件: $backend_count/${#BACKEND_FILES[@]}"
echo "前端组件: $component_count/${#FRONTEND_COMPONENTS[@]}"
echo "前端服务: $service_count/${#FRONTEND_SERVICES[@]}"
echo "前端页面: $page_count/${#FRONTEND_PAGES[@]}"
echo "总计: $total 文件"
echo ""

if [ $total -eq 15 ]; then
  echo "✅ 所有文件创建成功!"
  exit 0
else
  echo "❌ 部分文件缺失"
  exit 1
fi
