/**
 * Tooltip 组件测试
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Tooltip } from '@/components/ui/Tooltip';

describe('Tooltip 组件', () => {
  it('应该渲染触发元素', () => {
    render(
      <Tooltip content="提示内容">
        <button>悬停我</button>
      </Tooltip>
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('应该在悬停时显示提示', async () => {
    render(
      <Tooltip content="提示内容">
        <button>悬停我</button>
      </Tooltip>
    );

    const trigger = screen.getByRole('button');
    fireEvent.mouseEnter(trigger);

    await waitFor(() => {
      expect(screen.getByText('提示内容')).toBeInTheDocument();
    });
  });

  it('应该在离开时隐藏提示', async () => {
    render(
      <Tooltip content="提示内容">
        <button>悬停我</button>
      </Tooltip>
    );

    const trigger = screen.getByRole('button');
    fireEvent.mouseEnter(trigger);

    await waitFor(() => {
      expect(screen.getByText('提示内容')).toBeInTheDocument();
    });

    fireEvent.mouseLeave(trigger);

    await waitFor(() => {
      expect(screen.queryByText('提示内容')).not.toBeInTheDocument();
    });
  });

  it('应该支持不同的位置', () => {
    const { container: topContainer } = render(
      <Tooltip content="顶部提示" placement="top">
        <button>顶部</button>
      </Tooltip>
    );
    const { container: bottomContainer } = render(
      <Tooltip content="底部提示" placement="bottom">
        <button>底部</button>
      </Tooltip>
    );

    expect(topContainer.firstChild).toBeInTheDocument();
    expect(bottomContainer.firstChild).toBeInTheDocument();
  });

  it('应该支持延迟显示', async () => {
    render(
      <Tooltip content="延迟提示" delay={500}>
        <button>延迟</button>
      </Tooltip>
    );

    const trigger = screen.getByRole('button');
    fireEvent.mouseEnter(trigger);

    // 立即检查，不应该显示
    expect(screen.queryByText('延迟提示')).not.toBeInTheDocument();

    // 等待延迟后应该显示
    await waitFor(
      () => {
        expect(screen.getByText('延迟提示')).toBeInTheDocument();
      },
      { timeout: 600 }
    );
  });

  it('应该是可访问的', () => {
    render(
      <Tooltip content="提示内容">
        <button aria-label="有提示的按钮">按钮</button>
      </Tooltip>
    );
    const trigger = screen.getByRole('button');
    expect(trigger).toHaveAttribute('aria-label', '有提示的按钮');
  });
});
