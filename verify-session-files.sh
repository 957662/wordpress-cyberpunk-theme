#!/bin/bash

# ============================================================================
# CyberPress Platform - 文件验证脚本
# ============================================================================
# 功能: 验证本次会话创建的所有文件
# 版本: 1.0.0
# 日期: 2026-03-03
# ============================================================================

echo "🔍 验证文件创建状态..."
echo ""

# 定义要检查的文件
FILES=(
  "TASK_ANALYSIS.md"
  "backend/database/init/002_seed_data.sql"
  "backend/database/init/003_create_indexes.sql"
  "frontend/services/auth-service.ts"
  "frontend/services/cache-service.ts"
  "frontend/lib/testing-utils.ts"
  "frontend/jest.config.js"
  "docs/DEPLOYMENT.md"
  "backend/database/migrations/README.md"
  "FILES_CREATED_SESSION_20260303.md"
)

# 计数器
total=${#FILES[@]}
exist=0
missing=0

# 检查每个文件
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
    ((exist++))
  else
    echo "❌ $file (缺失)"
    ((missing++))
  fi
done

echo ""
echo "📊 统计结果:"
echo "   总计: $total"
echo "   存在: $exist ✅"
echo "   缺失: $missing ❌"
echo ""

# 检查文件内容
echo "📝 文件内容验证:"
echo ""

# 检查种子数据脚本
if [ -f "backend/database/init/002_seed_data.sql" ]; then
  lines=$(wc -l < backend/database/init/002_seed_data.sql)
  echo "✅ 种子数据脚本: $lines 行"
fi

# 检查索引脚本
if [ -f "backend/database/init/003_create_indexes.sql" ]; then
  lines=$(wc -l < backend/database/init/003_create_indexes.sql)
  echo "✅ 索引优化脚本: $lines 行"
fi

# 检查认证服务
if [ -f "frontend/services/auth-service.ts" ]; then
  lines=$(wc -l < frontend/services/auth-service.ts)
  echo "✅ 认证服务: $lines 行"
fi

# 检查缓存服务
if [ -f "frontend/services/cache-service.ts" ]; then
  lines=$(wc -l < frontend/services/cache-service.ts)
  echo "✅ 缓存服务: $lines 行"
fi

# 检查测试工具
if [ -f "frontend/lib/testing-utils.ts" ]; then
  lines=$(wc -l < frontend/lib/testing-utils.ts)
  echo "✅ 测试工具库: $lines 行"
fi

# 检查部署文档
if [ -f "docs/DEPLOYMENT.md" ]; then
  lines=$(wc -l < docs/DEPLOYMENT.md)
  echo "✅ 部署文档: $lines 行"
fi

echo ""
echo "🎉 验证完成！"
echo ""

# 生成总结报告
cat > VERIFICATION_REPORT.md << EOF
# 文件验证报告

**生成时间**: $(date '+%Y-%m-%d %H:%M:%S')

## 验证结果

- ✅ 存在文件: $exist / $total
- ❌ 缺失文件: $missing / $total

## 文件列表

EOF

# 添加文件详情到报告
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    lines=$(wc -l < "$file")
    size=$(du -h "$file" | cut -f1)
    echo "- ✅ \`$file\` ($lines 行, $size)" >> VERIFICATION_REPORT.md
  else
    echo "- ❌ \`$file\` (缺失)" >> VERIFICATION_REPORT.md
  fi
done

echo "✅ 验证报告已生成: VERIFICATION_REPORT.md"

# 返回退出码
if [ $missing -eq 0 ]; then
  echo "🎊 所有文件验证通过！"
  exit 0
else
  echo "⚠️  有文件缺失，请检查！"
  exit 1
fi
