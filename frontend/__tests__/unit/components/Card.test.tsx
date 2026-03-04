/**
 * Card 组件单元测试
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Card } from '@/components/ui/Card';

describe('Card Component', () => {
  it('应该正确渲染基础卡片', () => {
    render(
      <Card>
        <p>Card content</p>
      </Card>
    );

    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('应该正确应用自定义类名', () => {
    const { container } = render(
      <Card className="custom-class">
        <p>Content</p>
      </Card>
    );

    const cardElement = container.firstChild;
    expect(cardElement).toHaveClass('custom-class');
  });

  it('应该正确渲染带标题的卡片', () => {
    render(
      <Card title="Test Title">
        <p>Content</p>
      </Card>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('应该正确渲染带页脚的卡片', () => {
    render(
      <Card footer={<button>Action</button>}>
        <p>Content</p>
      </Card>
    );

    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });

  it('应该正确处理点击事件', () => {
    const handleClick = vi.fn();

    const { container } = render(
      <Card onClick={handleClick} clickable>
        <p>Clickable card</p>
      </Card>
    );

    const cardElement = container.firstChild;
    cardElement?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('应该正确渲染霓虹变体', () => {
    const { container } = render(
      <Card variant="neon">
        <p>Neon card</p>
      </Card>
    );

    const cardElement = container.firstChild;
    expect(cardElement).toHaveClass('neon');
  });

  it('应该正确渲染全息变体', () => {
    const { container } = render(
      <Card variant="holographic">
        <p>Holographic card</p>
      </Card>
    );

    const cardElement = container.firstChild;
    expect(cardElement).toHaveClass('holographic');
  });

  it('应该正确渲染加载状态', () => {
    const { container } = render(
      <Card loading>
        <p>Loading content</p>
      </Card>
    );

    const cardElement = container.firstChild;
    expect(cardElement).toHaveClass('loading');
  });

  it('应该正确处理悬浮效果', () => {
    const { container } = render(
      <Card hoverable>
        <p>Hoverable card</p>
      </Card>
    );

    const cardElement = container.firstChild;
    expect(cardElement).toHaveClass('hoverable');
  });

  it('应该正确显示图标', () => {
    render(
      <Card
        title="Icon Card"
        icon={<span data-testid="icon">★</span>}
      >
        <p>Content with icon</p>
      </Card>
    );

    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});
