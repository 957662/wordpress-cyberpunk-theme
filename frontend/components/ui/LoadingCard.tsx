'use client';

import React from 'react';

export interface LoadingCardProps {
  /**
   * 卡片标题是否显示
   */
  showHeader?: boolean;
  /**
   * 卡片内容行数
   */
  lines?: number;
  /**
   * 是否显示图片占位
   */
  showImage?: boolean;
  /**
   * 图片宽度
   */
  imageWidth?: string;
  /**
   * 图片高度
   */
  imageHeight?: string;
  /**
   * 自定义类名
   */
  className?: string;
}

/**
 * LoadingCard 组件
 * 用于卡片加载状态，展示骨架屏效果
 */
export const LoadingCard: React.FC<LoadingCardProps> = ({
  showHeader = true,
  lines = 3,
  showImage = false,
  imageWidth = '100%',
  imageHeight = '200px',
  className = '',
}) => {
  return (
    <div className={`cyber-card-loading ${className}`}>
      {showHeader && (
        <div className="flex items-center space-x-4 mb-4">
          {/* 头像占位 */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyber-cyan/20 to-cyber-purple/20 animate-pulse" />
          
          {/* 标题占位 */}
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gradient-to-r from-cyber-cyan/20 to-cyber-purple/20 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-gradient-to-r from-cyber-cyan/10 to-cyber-purple/10 rounded animate-pulse w-1/2" />
          </div>
        </div>
      )}

      {showImage && (
        <div
          className="w-full rounded-lg bg-gradient-to-br from-cyber-cyan/20 to-cyber-purple/20 animate-pulse mb-4"
          style={{ height: imageHeight }}
        />
      )}

      {/* 内容行 */}
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`h-3 bg-gradient-to-r from-cyber-cyan/20 to-cyber-purple/20 rounded animate-pulse ${
              i === lines - 1 ? 'w-2/3' : 'w-full'
            }`}
            style={{
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>

      {/* 元数据占位 */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-cyber-cyan/10">
        <div className="flex items-center space-x-2">
          <div className="w-16 h-6 bg-gradient-to-r from-cyber-cyan/20 to-cyber-purple/20 rounded animate-pulse" />
          <div className="w-20 h-6 bg-gradient-to-r from-cyber-cyan/20 to-cyber-purple/20 rounded animate-pulse" />
        </div>
        <div className="w-12 h-6 bg-gradient-to-r from-cyber-cyan/20 to-cyber-purple/20 rounded animate-pulse" />
      </div>
    </div>
  );
};

export default LoadingCard;
