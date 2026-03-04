/**
 * NeonBorder 组件测试
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NeonBorder } from '@/components/effects/NeonBorder';

describe('NeonBorder 组件', () => {
  it('应该渲染子元素', () => {
    render(
      <NeonBorder>
        <div>内容</div>
      </NeonBorder>
    );
    expect(screen.getByText('内容')).toBeInTheDocument();
  });

  it('应该应用霓虹边框样式', () => {
    const { container } = render(
      <NeonBorder>
        <div>内容</div>
      </NeonBorder>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('neon-border');
  });

  it('应该支持不同的颜色', () => {
    const { container: cyanContainer } = render(
      <NeonBorder color="cyan">
        <div>青色</div>
      </NeonBorder>
    );
    const { container: purpleContainer } = render(
      <NeonBorder color="purple">
        <div>紫色</div>
      </NeonBorder>
    );

    expect(cyanContainer.firstChild).toBeInTheDocument();
    expect(purpleContainer.firstChild).toBeInTheDocument();
  });

  it('应该支持不同的强度', () => {
    const { container: lowContainer } = render(
      <NeonBorder intensity="low">
        <div>低强度</div>
      </NeonBorder>
    );
    const { container: highContainer } = render(
      <NeonBorder intensity="high">
        <div>高强度</div>
      </NeonBorder>
    );

    expect(lowContainer.firstChild).toBeInTheDocument();
    expect(highContainer.firstChild).toBeInTheDocument();
  });

  it('应该支持动画效果', () => {
    const { container } = render(
      <NeonBorder animated>
        <div>动画</div>
      </NeonBorder>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('animate-pulse');
  });

  it('应该支持自定义 className', () => {
    const { container } = render(
      <NeonBorder className="custom-class">
        <div>自定义</div>
      </NeonBorder>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('custom-class');
  });

  it('应该在悬停时增强发光效果', () => {
    const { container } = render(
      <NeonBorder hoverGlow>
        <div>悬停发光</div>
      </NeonBorder>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('hover-glow');
  });

  it('应该正确渲染多个子元素', () => {
    const { container } = render(
      <NeonBorder>
        <div>第一个</div>
        <div>第二个</div>
        <div>第三个</div>
      </NeonBorder>
    );
    expect(container.querySelectorAll('div').length).toBeGreaterThan(0);
  });
});
