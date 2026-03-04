/**
 * Progress 组件测试
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Progress } from '@/components/ui/Progress';

describe('Progress 组件', () => {
  it('应该渲染进度条', () => {
    const { container } = render(<Progress value={50} />);
    const progressBar = container.querySelector('.progress-bar');
    expect(progressBar).toBeInTheDocument();
  });

  it('应该显示正确的进度值', () => {
    const { container } = render(<Progress value={75} />);
    const progressBar = container.querySelector('.progress-bar') as HTMLElement;
    expect(progressBar).toHaveStyle({ width: '75%' });
  });

  it('应该支持不同的变体', () => {
    const { container: defaultContainer } = render(<Progress variant="default" value={50} />);
    const { container: neonContainer } = render(<Progress variant="neon" value={50} />);
    const { container: cyberContainer } = render(<Progress variant="cyber" value={50} />);

    expect(defaultContainer.firstChild).toBeInTheDocument();
    expect(neonContainer.firstChild).toBeInTheDocument();
    expect(cyberContainer.firstChild).toBeInTheDocument();
  });

  it('应该支持不同的尺寸', () => {
    const { container: smContainer } = render(<Progress size="sm" value={50} />);
    const { container: mdContainer } = render(<Progress size="md" value={50} />);
    const { container: lgContainer } = render(<Progress size="lg" value={50} />);

    expect(smContainer.firstChild).toBeInTheDocument();
    expect(mdContainer.firstChild).toBeInTheDocument();
    expect(lgContainer.firstChild).toBeInTheDocument();
  });

  it('应该支持显示百分比文本', () => {
    render(<Progress value={50} showLabel />);
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('应该支持自定义颜色', () => {
    const { container } = render(<Progress value={50} color="#00f0ff" />);
    const progressBar = container.querySelector('.progress-bar') as HTMLElement;
    expect(progressBar).toHaveStyle({ backgroundColor: '#00f0ff' });
  });

  it('应该限制值在 0-100 范围内', () => {
    const { container: overContainer } = render(<Progress value={150} />);
    const { container: underContainer } = render(<Progress value={-10} />);

    expect(overContainer.firstChild).toBeInTheDocument();
    expect(underContainer.firstChild).toBeInTheDocument();
  });

  it('应该支持动画', () => {
    const { container } = render(<Progress value={50} animated />);
    const progressBar = container.querySelector('.progress-bar');
    expect(progressBar).toHaveClass('animate-pulse');
  });

  it('应该是可访问的', () => {
    render(<Progress value={50} aria-label="加载进度" />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-label', '加载进度');
    expect(progressBar).toHaveAttribute('aria-valuenow', '50');
  });
});
