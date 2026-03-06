#!/bin/bash

# =====================================================
# CyberPress Platform - 数据库文件验证脚本
# =====================================================

echo "========================================="
echo "CyberPress Platform - 文件验证"
echo "========================================="
echo ""

SUCCESS_COUNT=0
FAIL_COUNT=0

# 检查文件是否存在
check_file() {
    local file=$1
    local description=$2
    
    if [ -f "$file" ]; then
        local size=$(du -h "$file" | cut -f1)
        local lines=$(wc -l < "$file")
        echo "✅ $description"
        echo "   文件: $file"
        echo "   大小: $size | 行数: $lines"
        echo ""
        SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
        return 0
    else
        echo "❌ $description"
        echo "   文件: $file"
        echo "   状态: 不存在"
        echo ""
        FAIL_COUNT=$((FAIL_COUNT + 1))
        return 1
    fi
}

# 检查目录是否存在
check_dir() {
    local dir=$1
    local description=$2
    
    if [ -d "$dir" ]; then
        echo "✅ $description"
        echo "   目录: $dir"
        echo ""
        SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
        return 0
    else
        echo "❌ $description"
        echo "   目录: $dir"
        echo "   状态: 不存在"
        echo ""
        FAIL_COUNT=$((FAIL_COUNT + 1))
        return 1
    fi
}

echo "检查数据库文件..."
echo "----------------------------------------"
check_dir "backend/database/schema" "架构目录"
check_file "backend/database/schema/cyberpress-architecture.sql" "数据库架构文件"
check_file "backend/database/schema/README.md" "架构文档"

check_dir "backend/database/migrations" "迁移目录"
check_file "backend/database/migrations/migrations.sql" "迁移脚本"

check_dir "backend/database/seeds" "种子数据目录"
check_file "backend/database/seeds/seeds.sql" "种子数据文件"

check_file "backend/database/init-database.sh" "初始化脚本"

echo ""
echo "检查前端文件..."
echo "----------------------------------------"
check_dir "frontend/hooks/api" "API Hooks 目录"
check_file "frontend/hooks/api/useApi.ts" "API Hooks 文件"

check_dir "frontend/components/blog/enhanced" "增强博客组件目录"
check_file "frontend/components/blog/enhanced/PostGridEnhanced.tsx" "文章网格组件"

echo ""
echo "检查文档文件..."
echo "----------------------------------------"
check_file "QUICKSTART_DATABASE.md" "数据库快速启动指南"
check_file "FILES_CREATED_DATABASE_2026-03-06.md" "文件创建报告"

echo ""
echo "========================================="
echo "验证总结"
echo "========================================="
echo "✅ 成功: $SUCCESS_COUNT"
echo "❌ 失败: $FAIL_COUNT"
echo "总计: $((SUCCESS_COUNT + FAIL_COUNT))"
echo ""

if [ $FAIL_COUNT -eq 0 ]; then
    echo "🎉 所有文件验证通过！"
    echo ""
    echo "下一步："
    echo "1. cd backend/database"
    echo "2. ./init-database.sh"
    echo ""
    exit 0
else
    echo "⚠️  部分文件验证失败"
    echo ""
    exit 1
fi
