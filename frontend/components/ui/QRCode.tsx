'use client';

import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface QRCodeProps {
  value: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  bgColor?: string;
  fgColor?: string;
  className?: string;
  logo?: string;
  logoSize?: number;
}

export const QRCode: React.FC<QRCodeProps> = ({
  value,
  size = 200,
  level = 'M',
  bgColor = '#ffffff',
  fgColor = '#000000',
  className,
  logo,
  logoSize = 40,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simple QR code generation (in production, use a library like qrcode.react)
    const drawQR = () => {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, size, size);

      // Draw a simple pattern (placeholder - use real QR library)
      ctx.fillStyle = fgColor;
      const cellSize = size / 25;

      // Position patterns
      const drawPositionPattern = (x: number, y: number) => {
        ctx.fillRect(x * cellSize, y * cellSize, 7 * cellSize, 7 * cellSize);
        ctx.fillStyle = bgColor;
        ctx.fillRect(
          (x + 1) * cellSize,
          (y + 1) * cellSize,
          5 * cellSize,
          5 * cellSize
        );
        ctx.fillStyle = fgColor;
        ctx.fillRect(
          (x + 2) * cellSize,
          (y + 2) * cellSize,
          3 * cellSize,
          3 * cellSize
        );
      };

      drawPositionPattern(1, 1);
      drawPositionPattern(17, 1);
      drawPositionPattern(1, 17);

      // Draw some data modules (randomized for demo)
      ctx.fillStyle = fgColor;
      for (let i = 0; i < 100; i++) {
        const x = Math.floor(Math.random() * 25);
        const y = Math.floor(Math.random() * 25);
        if (
          !(
            (x < 9 && y < 9) ||
            (x > 15 && y < 9) ||
            (x < 9 && y > 15) ||
            (x >= 9 && x <= 12 && y >= 9 && y <= 12)
          )
        ) {
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }

      // Draw logo if provided
      if (logo) {
        const img = new Image();
        img.onload = () => {
          const logoX = (size - logoSize) / 2;
          const logoY = (size - logoSize) / 2;

          // Draw background for logo
          ctx.fillStyle = bgColor;
          ctx.fillRect(
            logoX - cellSize,
            logoY - cellSize,
            logoSize + cellSize * 2,
            logoSize + cellSize * 2
          );

          ctx.drawImage(img, logoX, logoY, logoSize, logoSize);
        };
        img.src = logo;
      }
    };

    drawQR();
  }, [value, size, bgColor, fgColor, logo, logoSize]);

  return (
    <div className={cn('inline-block', className)}>
      <canvas ref={canvasRef} width={size} height={size} className="rounded-lg" />
    </div>
  );
};

interface QRCodeButtonProps {
  value: string;
  icon?: React.ReactNode;
  className?: string;
}

export const QRCodeButton: React.FC<QRCodeButtonProps> = ({
  value,
  icon,
  className,
}) => {
  const [showQR, setShowQR] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowQR(!showQR)}
        className={cn(
          'p-2 rounded-lg bg-dark-800 border border-dark-700 hover:border-cyber-cyan/50 transition-colors',
          className
        )}
      >
        {icon || <span className="text-2xl">📱</span>}
      </button>

      {showQR && (
        <div className="absolute top-full right-0 mt-2 p-4 rounded-lg bg-white shadow-xl z-50">
          <QRCode value={value} size={150} />
        </div>
      )}
    </div>
  );
};

export default QRCode;
