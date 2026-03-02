'use client';

import { motion } from 'framer-motion';

/**
 * 扫描线覆盖效果
 * 创建赛博朋克风格的 CRT 扫描线效果
 */
export function ScanLineOverlay({
  enabled = true,
  intensity = 0.1,
  speed = 8,
}: {
  enabled?: boolean;
  intensity?: number;
  speed?: number;
}) {
  if (!enabled) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* 水平扫描线 */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 240, 255, 0.03) 2px, rgba(0, 240, 255, 0.03) 4px)',
          opacity: intensity,
        }}
      />

      {/* 扫描光束 */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-cyan/5 to-transparent"
        animate={{
          y: ['-100%', '100%'],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          height: '20%',
        }}
      />

      {/* CRT 屏幕效果 */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.1) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* 屏幕闪烁效果 */}
      <motion.div
        className="absolute inset-0 bg-white/5"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 0.02, 0],
        }}
        transition={{
          duration: 0.1,
          repeat: Infinity,
          repeatDelay: 5,
        }}
      />
    </div>
  );
}
