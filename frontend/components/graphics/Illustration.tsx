/**
 * CyberPress Illustration Component
 *
 * 插画组件，用于展示场景插图
 *
 * @example
 * ```tsx
 * <Illustration name="cyber-city" />
 * <Illustration name="developer-workspace" width={600} />
 * ```
 */

import React from 'react';
import Image from 'next/image';

export interface IllustrationProps {
  /** 插画名称 */
  name: 'cyber-city' | 'developer-workspace' | 'network-nodes' | 'server-rack' | 'code-screen' | 'circuit-board' | 'network-globe';
  /** 宽度 */
  width?: number;
  /** 高度 */
  height?: number;
  /** 额外的 CSS 类名 */
  className?: string;
  /** 是否响应式填充 */
  fill?: boolean;
  /** 替代文本 */
  alt?: string;
}

export const Illustration: React.FC<IllustrationProps> = ({
  name,
  width = 800,
  height = 400,
  className = '',
  fill = false,
  alt
}) => {
  const defaultAlts: Record<string, string> = {
    'cyber-city': 'Cyberpunk cityscape illustration',
    'developer-workspace': 'Developer workspace illustration',
    'network-nodes': 'Network nodes visualization',
    'server-rack': 'Server rack illustration',
    'code-screen': 'Code screen illustration',
    'circuit-board': 'Circuit board pattern',
    'network-globe': 'Global network visualization'
  };

  return (
    <Image
      src={`/illustrations/${name}.svg`}
      alt={alt || defaultAlts[name]}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      fill={fill}
      className={className}
      style={
        fill
          ? { objectFit: 'cover' }
          : { maxWidth: '100%', height: 'auto' }
      }
      priority={name === 'cyber-city'}
    />
  );
};

export default Illustration;
