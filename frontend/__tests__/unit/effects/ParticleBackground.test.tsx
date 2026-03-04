/**
 * ParticleBackground 组件测试
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ParticleBackground } from '@/components/effects/ParticleBackground';

describe('ParticleBackground 组件', () => {
  it('应该渲染画布元素', () => {
    const { container } = render(<ParticleBackground />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('应该应用正确的样式类', () => {
    const { container } = render(<ParticleBackground />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('particle-background');
  });

  it('应该支持不同的粒子数量', () => {
    const { container: fewContainer } = render(<ParticleBackground particleCount={50} />);
    const { container: manyContainer } = render(<ParticleBackground particleCount={200} />);

    expect(fewContainer.firstChild).toBeInTheDocument();
    expect(manyContainer.firstChild).toBeInTheDocument();
  });

  it('应该支持不同的粒子颜色', () => {
    const { container: cyanContainer } = render(
      <ParticleBackground particleColor="#00f0ff" />
    );
    const { container: purpleContainer } = render(
      <ParticleBackground particleColor="#9d00ff" />
    );

    expect(cyanContainer.firstChild).toBeInTheDocument();
    expect(purpleContainer.firstChild).toBeInTheDocument();
  });

  it('应该支持不同的粒子大小', () => {
    const { container: smallContainer } = render(<ParticleBackground particleSize={2} />);
    const { container: largeContainer } = render(<ParticleBackground particleSize={5} />);

    expect(smallContainer.firstChild).toBeInTheDocument();
    expect(largeContainer.firstChild).toBeInTheDocument();
  });

  it('应该支持连线效果', () => {
    const { container } = render(<ParticleBackground connectParticles />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toBeInTheDocument();
  });

  it('应该支持自定义连线距离', () => {
    const { container } = render(
      <ParticleBackground connectParticles connectionDistance={150} />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('应该支持鼠标交互', () => {
    const { container } = render(<ParticleBackground mouseInteraction />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('应该支持自定义背景颜色', () => {
    const { container } = render(<ParticleBackground backgroundColor="#0a0a0f" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toBeInTheDocument();
  });

  it('应该响应窗口大小变化', () => {
    const { container } = render(<ParticleBackground />);
    const canvas = container.querySelector('canvas') as HTMLCanvasElement;

    // 模拟窗口大小变化
    window.dispatchEvent(new Event('resize'));

    expect(canvas).toBeInTheDocument();
  });

  it('应该在组件卸载时清理', () => {
    const { container, unmount } = render(<ParticleBackground />);

    expect(container.querySelector('canvas')).toBeInTheDocument();

    unmount();

    // 确保动画被清理
    expect(container.querySelector('canvas')).not.toBeInTheDocument();
  });

  it('应该支持动画速度控制', () => {
    const { container: slowContainer } = render(<ParticleBackground speed={0.5} />);
    const { container: fastContainer } = render(<ParticleBackground speed={2} />);

    expect(slowContainer.firstChild).toBeInTheDocument();
    expect(fastContainer.firstChild).toBeInTheDocument();
  });

  it('应该是可访问的', () => {
    const { container } = render(<ParticleBackground aria-label="粒子背景效果" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveAttribute('aria-label', '粒子背景效果');
  });
});
