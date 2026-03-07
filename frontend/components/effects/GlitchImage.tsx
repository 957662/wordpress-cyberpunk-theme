/**
 * 故障效果图片
 * 图片悬停时产生赛博朋克风格的故障艺术效果
 */

'use client';

import { useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

export interface GlitchImageProps extends Omit<ImageProps, 'onLoad'> {
  /** 故障强度 (1-10) */
  intensity?: number;
  /** 是否启用RGB分离效果 */
  rgbSplit?: boolean;
  /** 扫描线效果 */
  scanlines?: boolean;
  /** 噪点效果 */
  noise?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 容器类名 */
  containerClassName?: string;
}

export function GlitchImage({
  intensity = 5,
  rgbSplit = true,
  scanlines = true,
  noise = true,
  className,
  containerClassName,
  alt,
  ...imageProps
}: GlitchImageProps) {
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = async () => {
    setIsHovered(true);

    // 触发故障动画
    if (intensity > 0) {
      for (let i = 0; i < intensity; i++) {
        await controls.start({
          x: [0, -5, 5, -3, 3, 0],
          y: [0, 3, -3, 5, -5, 0],
          transition: { duration: 0.1 },
        });
      }
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    controls.start({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden rounded-lg',
        'group',
        containerClassName
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 主图片 */}
      <motion.div
        animate={controls}
        className="relative"
      >
        <Image
          alt={alt}
          className={cn(
            'transition-transform duration-300',
            'group-hover:scale-105',
            className
          )}
          {...imageProps}
        />
      </motion.div>

      {/* RGB分离效果 */}
      {rgbSplit && isHovered && (
        <>
          {/* 红色通道 */}
          <motion.div
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 0.5, x: -3 }}
            exit={{ opacity: 0, x: 0 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              mixBlendMode: 'screen',
              filter: 'url(#red-channel)',
            }}
          >
            <Image
              alt={alt}
              className={className}
              {...imageProps}
            />
          </motion.div>

          {/* 蓝色通道 */}
          <motion.div
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 0.5, x: 3 }}
            exit={{ opacity: 0, x: 0 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              mixBlendMode: 'screen',
              filter: 'url(#blue-channel)',
            }}
          >
            <Image
              alt={alt}
              className={className}
              {...imageProps}
            />
          </motion.div>

          {/* SVG滤镜定义 */}
          <svg className="absolute w-0 h-0">
            <defs>
              <filter id="red-channel">
                <feColorMatrix
                  type="matrix"
                  values="1 0 0 0 0
                          0 0 0 0 0
                          0 0 0 0 0
                          0 0 0 1 0"
                />
              </filter>
              <filter id="blue-channel">
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0
                          0 0 0 0 0
                          0 0 1 0 0
                          0 0 0 1 0"
                />
              </filter>
            </defs>
          </svg>
        </>
      )}

      {/* 扫描线效果 */}
      {scanlines && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-50" />

          {/* 扫描线动画 */}
          {isHovered && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent"
              animate={{
                y: ['-100%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          )}
        </div>
      )}

      {/* 噪点效果 */}
      {noise && isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0.2, 0.4, 0] }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            mixBlendMode: 'overlay',
          }}
        />
      )}

      {/* 故障条纹 */}
      {isHovered && intensity > 5 && (
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: [0, 1, 0] }}
          transition={{
            duration: 0.2,
            repeat: Infinity,
            repeatDelay: 0.5,
          }}
          className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink"
          style={{
            mixBlendMode: 'screen',
          }}
        />
      )}

      {/* 边框发光 */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 20px rgba(0, 240, 255, 0.5)',
          }}
        />
      )}
    </div>
  );
}
