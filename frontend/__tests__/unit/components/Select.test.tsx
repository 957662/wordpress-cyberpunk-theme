/**
 * Select 组件测试
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { Select } from '@/components/ui/Select';

describe('Select 组件', () => {
  const options = [
    { value: 'option1', label: '选项 1' },
    { value: 'option2', label: '选项 2' },
    { value: 'option3', label: '选项 3' },
  ];

  it('应该渲染选择器', () => {
    render(<Select options={options} placeholder="请选择" />);
    expect(screen.getByText('请选择')).toBeInTheDocument();
  });

  it('应该打开选项列表', async () => {
    render(<Select options={options} placeholder="请选择" />);
    const trigger = screen.getByRole('combobox');
    await userEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('选项 1')).toBeInTheDocument();
      expect(screen.getByText('选项 2')).toBeInTheDocument();
      expect(screen.getByText('选项 3')).toBeInTheDocument();
    });
  });

  it('应该选择选项', async () => {
    const onChange = jest.fn();
    render(<Select options={options} placeholder="请选择" onChange={onChange} />);

    const trigger = screen.getByRole('combobox');
    await userEvent.click(trigger);

    await waitFor(() => {
      const option = screen.getByText('选项 2');
      userEvent.click(option);
    });

    expect(onChange).toHaveBeenCalledWith('option2');
  });

  it('应该支持禁用状态', () => {
    render(<Select options={options} placeholder="请选择" disabled />);
    const trigger = screen.getByRole('combobox');
    expect(trigger).toBeDisabled();
  });

  it('应该支持默认值', () => {
    render(<Select options={options} defaultValue="option2" />);
    expect(screen.getByText('选项 2')).toBeInTheDocument();
  });

  it('应该支持搜索过滤', async () => {
    render(
      <Select
        options={options}
        placeholder="请选择"
        searchable
      />
    );

    const trigger = screen.getByRole('combobox');
    await userEvent.click(trigger);

    const searchInput = screen.getByPlaceholderText('搜索...');
    await userEvent.type(searchInput, '选项 1');

    await waitFor(() => {
      expect(screen.getByText('选项 1')).toBeInTheDocument();
      expect(screen.queryByText('选项 2')).not.toBeInTheDocument();
    });
  });

  it('应该支持多选模式', async () => {
    render(
      <Select
        options={options}
        placeholder="请选择"
        multiple
      />
    );

    const trigger = screen.getByRole('combobox');
    await userEvent.click(trigger);

    await waitFor(() => {
      userEvent.click(screen.getByText('选项 1'));
      userEvent.click(screen.getByText('选项 2'));
    });

    // 应该显示两个选中的选项
    expect(screen.getByText('选项 1')).toBeInTheDocument();
    expect(screen.getByText('选项 2')).toBeInTheDocument();
  });

  it('应该是可访问的', () => {
    render(<Select options={options} label="选择器" />);
    expect(screen.getByLabelText('选择器')).toBeInTheDocument();
  });
});
