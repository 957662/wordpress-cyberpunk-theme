/**
 * Avatar 组件测试
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Avatar } from '@/components/ui/Avatar';

describe('Avatar 组件', () => {
  it('应该渲染头像图片', () => {
    render(<Avatar src="/avatar.jpg" alt="用户头像" />);
    const img = screen.getByAltText('用户头像');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/avatar.jpg');
  });

  it('应该渲染首字母作为后备', () => {
    render(<Avatar name="张三" />);
    expect(screen.getByText('张')).toBeInTheDocument();
  });

  it('应该支持不同的尺寸', () => {
    const { container: smContainer } = render(<Avatar size="sm" name="小" />);
    const { container: mdContainer } = render(<Avatar size="md" name="中" />);
    const { container: lgContainer } = render(<Avatar size="lg" name="大" />);

    expect(smContainer.firstChild).toBeInTheDocument();
    expect(mdContainer.firstChild).toBeInTheDocument();
    expect(lgContainer.firstChild).toBeInTheDocument();
  });

  it('应该支持圆形和方形形状', () => {
    const { container: roundContainer } = render(<Avatar shape="circle" name="圆形" />);
    const { container: squareContainer } = render(<Avatar shape="square" name="方形" />);

    expect(roundContainer.firstChild).toBeInTheDocument();
    expect(squareContainer.firstChild).toBeInTheDocument();
  });

  it('应该支持自定义 className', () => {
    const { container } = render(<Avatar className="custom-class" name="自定义" />);
    const avatar = container.firstChild as HTMLElement;
    expect(avatar).toHaveClass('custom-class');
  });

  it('应该处理图片加载失败', () => {
    const { container } = render(<Avatar src="/invalid.jpg" name="后备" />);
    // 当图片加载失败时，应该显示首字母
    expect(screen.getByText('后')).toBeInTheDocument();
  });

  it('应该支持在线状态指示器', () => {
    const { container } = render(
      <Avatar src="/avatar.jpg" alt="用户" status="online" />
    );
    const statusIndicator = container.querySelector('.avatar-status');
    expect(statusIndicator).toBeInTheDocument();
  });

  it('应该是可访问的', () => {
    render(<Avatar src="/avatar.jpg" alt="用户头像" />);
    const img = screen.getByAltText('用户头像');
    expect(img).toHaveAttribute('alt', '用户头像');
  });
});
