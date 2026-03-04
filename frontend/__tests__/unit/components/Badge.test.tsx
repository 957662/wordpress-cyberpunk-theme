/**
 * Badge 组件测试
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Badge } from '@/components/ui/Badge';

describe('Badge 组件', () => {
  it('应该渲染徽章文本', () => {
    render(<Badge>测试徽章</Badge>);
    expect(screen.getByText('测试徽章')).toBeInTheDocument();
  });

  it('应该应用默认样式类', () => {
    const { container } = render(<Badge>徽章</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('inline-flex');
  });

  it('应该支持不同的变体', () => {
    const { container: defaultContainer } = render(<Badge variant="default">默认</Badge>);
    const { container: neonContainer } = render(<Badge variant="neon">霓虹</Badge>);
    const { container: successContainer } = render(<Badge variant="success">成功</Badge>);

    expect(defaultContainer.firstChild).toBeInTheDocument();
    expect(neonContainer.firstChild).toBeInTheDocument();
    expect(successContainer.firstChild).toBeInTheDocument();
  });

  it('应该支持不同的尺寸', () => {
    const { container: smContainer } = render(<Badge size="sm">小</Badge>);
    const { container: mdContainer } = render(<Badge size="md">中</Badge>);
    const { container: lgContainer } = render(<Badge size="lg">大</Badge>);

    expect(smContainer.firstChild).toBeInTheDocument();
    expect(mdContainer.firstChild).toBeInTheDocument();
    expect(lgContainer.firstChild).toBeInTheDocument();
  });

  it('应该支持自定义 className', () => {
    const { container } = render(<Badge className="custom-class">自定义</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('custom-class');
  });

  it('应该渲染图标', () => {
    const { container } = render(
      <Badge icon={<span data-testid="badge-icon">★</span>}>
        带图标
      </Badge>
    );
    expect(screen.getByTestId('badge-icon')).toBeInTheDocument();
  });

  it('应该是可访问的', () => {
    render(<Badge>徽章</Badge>);
    const badge = screen.getByText('徽章');
    expect(badge).toBeVisible();
  });
});
