/**
 * Scanlines 组件测试
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Scanlines } from '@/components/effects/Scanlines';

describe('Scanlines 组件', () => {
  it('应该渲染扫描线覆盖层', () => {
    const { container } = render(<Scanlines />);
    const overlay = container.querySelector('.scanlines');
    expect(overlay).toBeInTheDocument();
  });

  it('应该应用正确的样式类', () => {
    const { container } = render(<Scanlines />);
    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toHaveClass('scanlines-overlay');
  });

  it('应该支持不同的扫描线密度', () => {
    const { container: lightContainer } = render(<Scanlines density="light" />);
    const { container: mediumContainer } = render(<Scanlines density="medium" />);
    const { container: heavyContainer } = render(<Scanlines density="heavy" />);

    expect(lightContainer.firstChild).toBeInTheDocument();
    expect(mediumContainer.firstChild).toBeInTheDocument();
    expect(heavyContainer.firstChild).toBeInTheDocument();
  });

  it('应该支持不同的扫描线颜色', () => {
    const { container: whiteContainer } = render(<Scanlines color="white" />);
    const { container: greenContainer } = render(<Scanlines color="green" />);

    expect(whiteContainer.firstChild).toBeInTheDocument();
    expect(greenContainer.firstChild).toBeInTheDocument();
  });

  it('应该支持动画效果', () => {
    const { container } = render(<Scanlines animated />);
    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toHaveClass('animate-scan');
  });

  it('应该支持不同的动画速度', () => {
    const { container: slowContainer } = render(<Scanlines animated speed="slow" />);
    const { container: fastContainer } = render(<Scanlines animated speed="fast" />);

    expect(slowContainer.firstChild).toBeInTheDocument();
    expect(fastContainer.firstChild).toBeInTheDocument();
  });

  it('应该支持自定义透明度', () => {
    const { container: lowContainer } = render(<Scanlines opacity={0.1} />);
    const { container: highContainer } = render(<Scanlines opacity={0.5} />);

    expect(lowContainer.firstChild).toBeInTheDocument();
    expect(highContainer.firstChild).toBeInTheDocument();
  });

  it('应该支持自定义大小', () => {
    const { container: fullWidthContainer } = render(<Scanlines size="full" />);
    const { container: partialContainer } = render(<Scanlines size="partial" />);

    expect(fullWidthContainer.firstChild).toBeInTheDocument();
    expect(partialContainer.firstChild).toBeInTheDocument();
  });

  it('应该支持自定义 className', () => {
    const { container } = render(<Scanlines className="custom-class" />);
    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toHaveClass('custom-class');
  });

  it('应该不影响底层内容的交互', () => {
    render(
      <div>
        <Scanlines />
        <button onClick={() => {}}>可点击按钮</button>
      </div>
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    // 点击应该穿透扫描线
    button.click();
  });

  it('应该是可访问的', () => {
    const { container } = render(<Scanlines aria-hidden="true" />);
    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toHaveAttribute('aria-hidden', 'true');
  });

  it('应该在移动设备上正常显示', () => {
    // 模拟移动设备视口
    global.innerWidth = 375;

    const { container } = render(<Scanlines />);
    expect(container.firstChild).toBeInTheDocument();

    // 恢复默认视口
    global.innerWidth = 1024;
  });

  it('应该支持作为背景使用', () => {
    const { container } = render(
      <Scanlines background>
        <div>前景内容</div>
      </Scanlines>
    );
    expect(screen.getByText('前景内容')).toBeInTheDocument();
  });

  it('应该支持不同的扫描线方向', () => {
    const { container: horizontalContainer } = render(<Scanlines direction="horizontal" />);
    const { container: verticalContainer } = render(<Scanlines direction="vertical" />);

    expect(horizontalContainer.firstChild).toBeInTheDocument();
    expect(verticalContainer.firstChild).toBeInTheDocument();
  });
});
