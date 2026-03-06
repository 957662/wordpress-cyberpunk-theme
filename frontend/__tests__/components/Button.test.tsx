/**
 * Button 组件测试
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '@/components/ui/Button';

describe('Button Component', () => {
  it('应该渲染按钮文本', () => {
    render(<Button>点击我</Button>);
    expect(screen.getByText('点击我')).toBeInTheDocument();
  });

  it('应该处理点击事件', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>点击我</Button>);

    const button = screen.getByText('点击我');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('应该渲染不同的变体', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByText('Primary')).toHaveClass('bg-cyber-cyan');

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByText('Secondary')).toHaveClass('bg-cyber-purple');

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByText('Outline')).toHaveClass('border');
  });

  it('应该渲染不同的尺寸', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByText('Small')).toHaveClass('text-sm');

    rerender(<Button size="md">Medium</Button>);
    expect(screen.getByText('Medium')).toHaveClass('text-base');

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByText('Large')).toHaveClass('text-lg');
  });

  it('应该在禁用状态下不响应点击', () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} disabled>
        禁用按钮
      </Button>
    );

    const button = screen.getByText('禁用按钮');
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
  });

  it('应该渲染加载状态', () => {
    render(<Button loading>加载中...</Button>);
    expect(screen.getByText('加载中...')).toBeInTheDocument();
    // 检查是否有加载指示器
    const loader = screen.getByRole('status');
    expect(loader).toBeInTheDocument();
  });

  it('应该正确应用自定义类名', () => {
    render(<Button className="custom-class">自定义</Button>);
    expect(screen.getByText('自定义')).toHaveClass('custom-class');
  });

  it('应该渲染图标', () => {
    const Icon = () => <span data-testid="test-icon">🔥</span>;
    render(<Button icon={<Icon />}>带图标</Button>);

    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.getByText('带图标')).toBeInTheDocument();
  });

  it('应该渲染为链接', () => {
    render(
      <Button href="https://example.com" asLink>
        链接按钮
      </Button>
    );

    const link = screen.getByText('链接按钮').closest('a');
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('应该在全宽模式下正确显示', () => {
    render(<Button fullWidth>全宽按钮</Button>);
    expect(screen.getByText('全宽按钮')).toHaveClass('w-full');
  });
});
