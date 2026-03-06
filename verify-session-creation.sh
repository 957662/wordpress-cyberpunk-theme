#!/bin/bash

echo "🔍 验证2026-03-06会话创建的文件..."
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

files=(
  "backend/app/services/email_template_service.py"
  "backend/app/services/websocket_service.py"
  "backend/app/services/task_queue_service.py"
  "backend/app/services/backup_service.py"
  "backend/app/tests/test_api.py"
  "backend/app/tests/conftest.py"
  "frontend/lib/api/client-enhanced.ts"
  "frontend/components/ui/error-page.tsx"
  "frontend/components/ui/empty-state.tsx"
  "frontend/components/ui/confirmation-modal.tsx"
  "frontend/app/error/page.tsx"
  "frontend/components/blog/__tests__/BlogGrid.test.tsx"
)

success=0
failed=0

for file in "${files[@]}"; do
  if [ -f "/root/.openclaw/workspace/cyberpress-platform/$file" ]; then
    echo -e "${GREEN}✓${NC} $file"
    ((success++))
  else
    echo -e "${RED}✗${NC} $file"
    ((failed++))
  fi
done

echo ""
echo "📊 统计:"
echo "  成功: $success"
echo "  失败: $failed"
echo "  总计: $((success + failed))"

if [ $failed -eq 0 ]; then
  echo -e "\n${GREEN}🎉 所有文件创建成功！${NC}"
  exit 0
else
  echo -e "\n${RED}⚠️  有 $failed 个文件创建失败${NC}"
  exit 1
fi
