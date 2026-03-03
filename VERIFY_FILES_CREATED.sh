#!/bin/bash

echo "========================================="
echo "🔍 Verifying Created Files"
echo "========================================="
echo ""

# Social Components
echo "📂 Social Components:"
for file in \
  "frontend/components/social/FollowButton.tsx" \
  "frontend/components/social/FollowerCount.tsx" \
  "frontend/components/social/FollowersList.tsx"
do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file (NOT FOUND)"
  fi
done

echo ""
echo "📂 Notification Components:"
for file in \
  "frontend/components/notification/NotificationList.tsx" \
  "frontend/components/notification/NotificationToast.tsx"
do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file (NOT FOUND)"
  fi
done

echo ""
echo "📂 Graphics Components:"
for file in \
  "frontend/components/graphics/effects/CyberGridBackground.tsx" \
  "frontend/components/graphics/effects/MatrixRain.tsx" \
  "frontend/components/graphics/patterns/CircuitBoard.tsx" \
  "frontend/components/graphics/animated/ParticleSystem.tsx" \
  "frontend/components/graphics/animated/HolographicEffect.tsx"
do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file (NOT FOUND)"
  fi
done

echo ""
echo "📂 Utility Files:"
for file in \
  "frontend/lib/utils/cyber.ts" \
  "frontend/lib/hooks/useOnlineStatus.ts"
do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file (NOT FOUND)"
  fi
done

echo ""
echo "========================================="
echo "✨ Verification Complete!"
echo "========================================="
