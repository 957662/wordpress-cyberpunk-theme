/**
 * Switch 组件测试
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { Switch } from '@/components/ui/Switch';

describe('Switch 组件', () => {
  it('应该渲染开关', () => {
    render(<Switch />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toBeInTheDocument();
  });

  it('应该在未选中时显示关闭状态', () => {
    render(<Switch />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).not.toBeChecked();
  });

  it('应该在选中时显示开启状态', () => {
    render(<Switch defaultChecked />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toBeChecked();
  });

  it('应该响应点击事件', async () => {
    const handleChange = jest.fn();
    render(<Switch onChange={handleChange} />);

    const switchElement = screen.getByRole('switch');
    await userEvent.click(switchElement);

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('应该在禁用状态下不响应点击', async () => {
    const handleChange = jest.fn();
    render(<Switch onChange={handleChange} disabled />);

    const switchElement = screen.getByRole('switch');
    expect(switchElement).toBeDisabled();

    await userEvent.click(switchElement);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('应该支持受控模式', () => {
    const { rerender } = render(<Switch checked={false} />);
    let switchElement = screen.getByRole('switch');
    expect(switchElement).not.toBeChecked();

    rerender(<Switch checked={true} />);
    switchElement = screen.getByRole('switch');
    expect(switchElement).toBeChecked();
  });

  it('应该支持不同的尺寸', () => {
    const { container: smContainer } = render(<Switch size="sm" />);
    const { container: mdContainer } = render(<Switch size="md" />);
    const { container: lgContainer } = render(<Switch size="lg" />);

    expect(smContainer.firstChild).toBeInTheDocument();
    expect(mdContainer.firstChild).toBeInTheDocument();
    expect(lgContainer.firstChild).toBeInTheDocument();
  });

  it('应该支持不同的颜色变体', () => {
    const { container: defaultContainer } = render(<Switch variant="default" />);
    const { container: neonContainer } = render(<Switch variant="neon" />);
    const { container: cyberContainer } = render(<Switch variant="cyber" />);

    expect(defaultContainer.firstChild).toBeInTheDocument();
    expect(neonContainer.firstChild).toBeInTheDocument();
    expect(cyberContainer.firstChild).toBeInTheDocument();
  });

  it('应该支持带标签显示', () => {
    render(
      <Switch label="启用通知" description="开启后接收通知" />
    );
    expect(screen.getByText('启用通知')).toBeInTheDocument();
    expect(screen.getByText('开启后接收通知')).toBeInTheDocument();
  });

  it('应该是可访问的', () => {
    render(<Switch aria-label="暗黑模式" />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveAttribute('aria-label', '暗黑模式');
  });
});
