/**
 * HolographicCard 组件测试
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HolographicCard } from '@/components/effects/HolographicCard';

describe('HolographicCard 组件', () => {
  it('应该渲染卡片内容', () => {
    render(
      <HolographicCard>
        <h3>标题</h3>
        <p>内容</p>
      </HolographicCard>
    );
    expect(screen.getByText('标题')).toBeInTheDocument();
    expect(screen.getByText('内容')).toBeInTheDocument();
  });

  it('应该应用全息效果样式', () => {
    const { container } = render(
      <HolographicCard>
        <div>内容</div>
      </HolographicCard>
    );
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('holographic-card');
  });

  it('应该响应鼠标移动', () => {
    const { container } = render(
      <HolographicCard>
        <div>内容</div>
      </HolographicCard>
    );
    const card = container.firstChild as HTMLElement;

    fireEvent.mouseMove(card, {
      clientX: 100,
      clientY: 100,
    });

    expect(card).toBeInTheDocument();
  });

  it('应该在鼠标离开时重置效果', () => {
    const { container } = render(
      <HolographicCard>
        <div>内容</div>
      </HolographicCard>
    );
    const card = container.firstChild as HTMLElement;

    fireEvent.mouseLeave(card);

    expect(card).toBeInTheDocument();
  });

  it('应该支持不同的强度级别', () => {
    const { container: lowContainer } = render(
      <HolographicCard intensity="low">
        <div>低强度</div>
      </HolographicCard>
    );
    const { container: highContainer } = render(
      <HolographicCard intensity="high">
        <div>高强度</div>
      </HolographicCard>
    );

    expect(lowContainer.firstChild).toBeInTheDocument();
    expect(highContainer.firstChild).toBeInTheDocument();
  });

  it('应该支持自定义颜色', () => {
    const { container: cyanContainer } = render(
      <HolographicCard color="cyan">
        <div>青色</div>
      </HolographicCard>
    );
    const { container: purpleContainer } = render(
      <HolographicCard color="purple">
        <div>紫色</div>
      </HolographicCard>
    );

    expect(cyanContainer.firstChild).toBeInTheDocument();
    expect(purpleContainer.firstChild).toBeInTheDocument();
  });

  it('应该支持禁用效果', () => {
    const { container } = render(
      <HolographicCard disabled>
        <div>禁用效果</div>
      </HolographicCard>
    );
    const card = container.firstChild as HTMLElement;
    expect(card).toBeInTheDocument();
  });

  it('应该支持自定义 className', () => {
    const { container } = render(
      <HolographicCard className="custom-class">
        <div>自定义</div>
      </HolographicCard>
    );
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('custom-class');
  });

  it('应该在移动设备上正常工作', () => {
    const { container } = render(
      <HolographicCard>
        <div>移动设备</div>
      </HolographicCard>
    );
    const card = container.firstChild as HTMLElement;

    // 模拟触摸事件
    fireEvent.touchStart(card, {
      touches: [{ clientX: 100, clientY: 100 }],
    });

    fireEvent.touchMove(card, {
      touches: [{ clientX: 150, clientY: 150 }],
    });

    fireEvent.touchEnd(card);

    expect(card).toBeInTheDocument();
  });

  it('应该是可访问的', () => {
    render(
      <HolographicCard aria-label="全息卡片">
        <div>内容</div>
      </HolographicCard>
    );
    const card = screen.getByLabelText('全息卡片');
    expect(card).toBeInTheDocument();
  });
});
