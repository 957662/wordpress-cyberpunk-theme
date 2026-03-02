/**
 * CyberIllustration - 赛博朋克风格插画组件
 *
 * @example
 * ```tsx
 * <CyberIllustration name="server" width={400} height={300} />
 * <CyberIllustration name="network" animated={true} />
 * ```
 */

'use client';

import React, { forwardRef } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface CyberIllustrationProps {
  /** 插画名称 */
  name: 'server' | 'network' | 'coding' | 'shield' | 'city' | 'workspace';
  /** 宽度 */
  width?: number;
  /** 高度 */
  height?: number;
  /** 是否启用动画 */
  animated?: boolean;
  /** 透明度 */
  opacity?: number;
  /** 额外的 CSS 类名 */
  className?: string;
  /** 图片替代文本 */
  alt?: string;
  /** 优先加载 */
  priority?: boolean;
}

export const CyberIllustration = forwardRef<HTMLDivElement, CyberIllustrationProps>(
  (
    {
      name,
      width = 400,
      height = 300,
      animated = true,
      opacity = 1,
      className = '',
      alt,
      priority = false,
      ...props
    },
    ref
  ) => {
    const illustrationPaths: Record<string, string> = {
      server: '/illustrations/cyber-server.svg',
      network: '/illustrations/cyber-network.svg',
      coding: '/illustrations/cyber-coding.svg',
      shield: '/illustrations/cyber-shield-security.svg',
      city: '/illustrations/cyber-city.svg',
      workspace: '/illustrations/developer-workspace.svg',
    };

    const illustrationPath = illustrationPaths[name] || illustrationPaths.server;

    const combinedClasses = cn(
      'transition-all duration-300',
      animated && 'animate-fade-in',
      className
    );

    const defaultAlt = `CyberPress ${name} illustration`;

    return (
      <div
        ref={ref}
        className={combinedClasses}
        style={{ width, height, opacity }}
        {...props}
      >
        <Image
          src={illustrationPath}
          alt={alt || defaultAlt}
          width={width}
          height={height}
          className="w-full h-full"
          style={{
            maxWidth: '100%',
            height: 'auto',
          }}
          priority={priority}
        />
      </div>
    );
  }
);

CyberIllustration.displayName = 'CyberIllustration';

export default CyberIllustration;
