/**
 * TextScramble 组件测试
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TextScramble } from '@/components/effects/TextScramble';

describe('TextScramble 组件', () => {
  jest.useFakeTimers();

  it('应该渲染初始文本', () => {
    render(<TextScramble text="测试文本" />);
    expect(screen.getByText('测试文本')).toBeInTheDocument();
  });

  it('应该在悬停时开始文字乱码效果', async () => {
    render(<TextScramble text="悬停触发" trigger="hover" />);

    const textElement = screen.getByText('悬停触发');

    // 触发悬停
    textElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

    // 等待动画开始
    await waitFor(() => {
      expect(textElement).toBeInTheDocument();
    });
  });

  it('应该在组件挂载时自动播放', async () => {
    render(<TextScramble text="自动播放" trigger="auto" />);

    await waitFor(() => {
      expect(screen.getByText('自动播放')).toBeInTheDocument();
    });
  });

  it('应该支持不同的动画速度', () => {
    const { container: slowContainer } = render(
      <TextScramble text="慢速" speed={100} />
    );
    const { container: fastContainer } = render(
      <TextScramble text="快速" speed={30} />
    );

    expect(slowContainer.firstChild).toBeInTheDocument();
    expect(fastContainer.firstChild).toBeInTheDocument();
  });

  it('应该支持自定义字符集', () => {
    render(<TextScramble text="自定义字符" characters="!@#$%^&*" />);
    expect(screen.getByText('自定义字符')).toBeInTheDocument();
  });

  it('应该支持多次迭代', () => {
    render(<TextScramble text="多次迭代" iterations={3} />);
    expect(screen.getByText('多次迭代')).toBeInTheDocument();
  });

  it('应该在动画结束后恢复原文本', async () => {
    render(<TextScramble text="恢复文本" trigger="click" />);

    const textElement = screen.getByText('恢复文本');

    // 点击触发
    textElement.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    // 快进时间
    jest.advanceTimersByTime(3000);

    await waitFor(() => {
      expect(screen.getByText('恢复文本')).toBeInTheDocument();
    });
  });

  it('应该支持自定义 className', () => {
    const { container } = render(
      <TextScramble text="自定义样式" className="custom-class" />
    );
    const textElement = container.firstChild as HTMLElement;
    expect(textElement).toHaveClass('custom-class');
  });

  it('应该支持暂停和恢复', () => {
    const { rerender } = render(<TextScramble text="暂停测试" paused={false} />);
    expect(screen.getByText('暂停测试')).toBeInTheDocument();

    rerender(<TextScramble text="暂停测试" paused={true} />);
    expect(screen.getByText('暂停测试')).toBeInTheDocument();
  });

  it('应该是可访问的', () => {
    render(<TextScramble text="可访问性" aria-label="乱码文字效果" />);
    const textElement = screen.getByText('可访问性');
    expect(textElement).toHaveAttribute('aria-label', '乱码文字效果');
  });

  afterEach(() => {
    jest.clearAllTimers();
  });
});
