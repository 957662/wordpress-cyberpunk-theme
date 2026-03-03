#!/bin/bash

echo "╔════════════════════════════════════════════════════════════╗"
echo "║        🎯 CyberPress - Final Verification Report          ║"
echo "║                  Session: 2026-03-03                       ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

total=0
created=0

check_files() {
  local category="$1"
  shift
  local files=("$@")
  local count=0

  echo "📦 $category"
  for file in "${files[@]}"; do
    ((total++))
    if [ -f "/root/.openclaw/workspace/cyberpress-platform/$file" ]; then
      echo "  ✅ $file"
      ((created++))
      ((count++))
    else
      echo "  ❌ $file"
    fi
  done
  echo "  └─ $count/${#files[@]} files"
  echo ""
}

check_files "Social Components" \
  "frontend/components/social/FollowButton.tsx" \
  "frontend/components/social/FollowerCount.tsx" \
  "frontend/components/social/FollowersList.tsx"

check_files "Notification Components" \
  "frontend/components/notification/NotificationList.tsx" \
  "frontend/components/notification/NotificationToast.tsx"

check_files "Graphics Effects" \
  "frontend/components/graphics/effects/CyberGridBackground.tsx" \
  "frontend/components/graphics/effects/MatrixRain.tsx" \
  "frontend/components/graphics/patterns/CircuitBoard.tsx" \
  "frontend/components/graphics/animated/ParticleSystem.tsx" \
  "frontend/components/graphics/animated/HolographicEffect.tsx"

check_files "Utilities & Hooks" \
  "frontend/lib/utils/cyber.ts" \
  "frontend/lib/hooks/useOnlineStatus.ts"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║                   📊 Summary                              ║"
echo "╠════════════════════════════════════════════════════════════╣"
echo "║  Total Files Checked:  $total                            ║"
echo "║  Files Created:       $created                           ║"
echo "║  Success Rate:        $((created * 100 / total))%        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

if [ $created -eq $total ]; then
  echo "✨ All files successfully created!"
  exit 0
else
  echo "⚠️  Some files are missing. Please review."
  exit 1
fi
