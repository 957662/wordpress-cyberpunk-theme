#!/bin/bash

echo "========================================="
echo "验证新创建的文件"
echo "========================================="
echo ""

# 服务文件
echo "检查服务文件..."
files=(
    "frontend/services/websocket-manager.ts"
    "frontend/services/error-handler.ts"
    "frontend/services/offline-queue.ts"
    "frontend/services/seo-service.ts"
    "frontend/services/i18n-service.ts"
)

for file in "${files[@]}"; do
    if [ -f "/root/.openclaw/workspace/cyberpress-platform/$file" ]; then
        echo "✅ $file"
        lines=$(wc -l < "/root/.openclaw/workspace/cyberpress-platform/$file")
        echo "   行数: $lines"
    else
        echo "❌ $file (未找到)"
    fi
done

echo ""
echo "检查组件文件..."
components=(
    "frontend/components/common/LoadingBoundary.tsx"
    "frontend/components/common/ConfirmDialog.tsx"
    "frontend/components/common/ImageGallery.tsx"
)

for file in "${components[@]}"; do
    if [ -f "/root/.openclaw/workspace/cyberpress-platform/$file" ]; then
        echo "✅ $file"
        lines=$(wc -l < "/root/.openclaw/workspace/cyberpress-platform/$file")
        echo "   行数: $lines"
    else
        echo "❌ $file (未找到)"
    fi
done

echo ""
echo "========================================="
echo "验证完成"
echo "========================================="
