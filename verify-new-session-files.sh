#!/bin/bash

echo "========================================="
echo "🔍 验证新创建的文件"
echo "========================================="
echo ""

total_files=0
total_lines=0

# 服务文件
echo "📦 服务文件"
echo "-----------------------------------"
services=(
    "websocket-manager.ts"
    "error-handler.ts"
    "offline-queue.ts"
    "seo-service.ts"
    "i18n-service.ts"
)

for file in "${services[@]}"; do
    path="frontend/services/$file"
    if [ -f "$path" ]; then
        lines=$(wc -l < "$path")
        echo "✅ $path"
        echo "   $lines 行"
        total_files=$((total_files + 1))
        total_lines=$((total_lines + lines))
    else
        echo "❌ $path (未找到)"
    fi
done

echo ""
echo "🎨 组件文件"
echo "-----------------------------------"
components=(
    "LoadingBoundary.tsx"
    "ConfirmDialog.tsx"
    "ImageGallery.tsx"
)

for file in "${components[@]}"; do
    path="frontend/components/common/$file"
    if [ -f "$path" ]; then
        lines=$(wc -l < "$path")
        echo "✅ $path"
        echo "   $lines 行"
        total_files=$((total_files + 1))
        total_lines=$((total_lines + lines))
    else
        echo "❌ $path (未找到)"
    fi
done

echo ""
echo "📄 文档文件"
echo "-----------------------------------"
docs=(
    "DEVELOPMENT_SESSION_2026-03-05_FINAL.md"
    "NEW_SERVICES_QUICK_START.md"
)

for file in "${docs[@]}"; do
    if [ -f "$file" ]; then
        lines=$(wc -l < "$file")
        echo "✅ $file"
        echo "   $lines 行"
        total_files=$((total_files + 1))
        total_lines=$((total_lines + lines))
    else
        echo "❌ $file (未找到)"
    fi
done

echo ""
echo "========================================="
echo "📊 统计"
echo "========================================="
echo "总文件数: $total_files"
echo "总行数: $total_lines"
echo ""

if [ $total_files -eq 10 ]; then
    echo "✅ 所有文件创建成功！"
    exit 0
else
    echo "⚠️  部分文件缺失"
    exit 1
fi
