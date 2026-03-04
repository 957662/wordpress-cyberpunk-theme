'use client';

/**
 * QR Code Component
 * 二维码组件 - 用于生成二维码
 */

import { useMemo } from 'react';
import { cn } from '@/lib/utils';

export interface QrCodeProps {
  /** 二维码内容 */
  value: string;
  /** 二维码大小 */
  size?: number;
  /** 纠错级别 */
  level?: 'L' | 'M' | 'Q' | 'H';
  /** 背景颜色 */
  bgColor?: string;
  /** 前景颜色 */
  fgColor?: string;
  /** 自定义类名 */
  className?: string;
  /** Logo URL */
  logo?: string;
  /** Logo 大小 */
  logoSize?: number;
  /** 样式变体 */
  variant?: 'default' | 'neon';
}

// 简单的二维码生成 (简化版，实际项目应使用 qrcode 库)
function generateQRCodeDataUrl(
  value: string,
  size: number,
  fgColor: string,
  bgColor: string
): string {
  // 这是一个简化的实现，实际应该使用 qrcode 库
  // 这里生成一个占位图案
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) return '';

  // 背景
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);

  // 简单的图案 (实际二维码更复杂)
  ctx.fillStyle = fgColor;
  const moduleSize = size / 25;

  // 绘制定位点 (三个角)
  const drawFinderPattern = (x: number, y: number) => {
    // 外框
    ctx.fillRect(x * moduleSize, y * moduleSize, 7 * moduleSize, 7 * moduleSize);
    ctx.fillStyle = bgColor;
    ctx.fillRect((x + 1) * moduleSize, (y + 1) * moduleSize, 5 * moduleSize, 5 * moduleSize);
    ctx.fillStyle = fgColor;
    ctx.fillRect((x + 2) * moduleSize, (y + 2) * moduleSize, 3 * moduleSize, 3 * moduleSize);
  };

  drawFinderPattern(0, 0);
  drawFinderPattern(18, 0);
  drawFinderPattern(0, 18);

  // 绘制数据区域 (简化)
  for (let i = 0; i < 25; i++) {
    for (let j = 0; j < 25; j++) {
      // 跳过定位区域
      if ((i < 8 && j < 8) || (i > 16 && j < 8) || (i < 8 && j > 16)) continue;

      // 基于内容生成伪随机图案
      const hash = (value.charCodeAt(i % value.length) + i + j) % 3;
      if (hash === 0) {
        ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize);
      }
    }
  }

  return canvas.toDataURL();
}

export function QrCode({
  value,
  size = 200,
  level = 'M',
  bgColor = '#ffffff',
  fgColor = '#000000',
  className,
  logo,
  logoSize = 40,
  variant = 'default',
}: QrCodeProps) {
  const qrDataUrl = useMemo(() => {
    return generateQRCodeDataUrl(value, size, fgColor, bgColor);
  }, [value, size, fgColor, bgColor]);

  const variants = {
    default: '',
    neon: 'shadow-lg shadow-cyan-500/50 rounded-lg',
  };

  return (
    <div className={cn('qr-code inline-block relative', variants[variant], className)}>
      <img
        src={qrDataUrl}
        alt="QR Code"
        width={size}
        height={size}
        className="block"
        style={{ backgroundColor: bgColor }}
      />
      {logo && (
        <img
          src={logo}
          alt="Logo"
          width={logoSize}
          height={logoSize}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded"
        />
      )}
    </div>
  );
}
