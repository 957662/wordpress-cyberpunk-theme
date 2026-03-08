/**
 * IconSizePreview - 图标尺寸预览组件
 * 展示图标在不同尺寸下的效果
 */

import React from 'react';

export interface SizeOption {
  size: number;
  label: string;
  useCase?: string;
}

export interface IconSizePreviewProps {
  /**
   * 图标
   */
  icon: React.ReactNode;

  /**
   * 尺寸选项
   */
  sizes?: SizeOption[];

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 是否显示用例
   * @default true
   */
  showUseCase?: boolean;
}

export const IconSizePreview: React.FC<IconSizePreviewProps> = ({
  icon,
  sizes = [
    { size: 16, label: '16px', useCase: '按钮、列表' },
    { size: 20, label: '20px', useCase: '输入框' },
    { size: 24, label: '24px', useCase: '导航、卡片' },
    { size: 32, label: '32px', useCase: '标题、装饰' },
    { size: 48, label: '48px', useCase: '英雄区' },
    { size: 64, label: '64px', useCase: '背景装饰' },
  ],
  className = '',
  showUseCase = true,
}) => {
  return (
    <div className={`icon-size-preview ${className}`.trim()}>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {sizes.map((option, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-6 bg-cyber-card rounded-lg border border-cyber-border"
          >
            <div
              style={{ width: option.size, height: option.size }}
              className="mb-4"
            >
              {icon}
            </div>

            <div className="text-center">
              <div className="text-lg font-semibold text-cyber-gray-200 mb-1">
                {option.label}
              </div>

              {showUseCase && option.useCase && (
                <div className="text-sm text-cyber-gray-400">
                  {option.useCase}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IconSizePreview;
