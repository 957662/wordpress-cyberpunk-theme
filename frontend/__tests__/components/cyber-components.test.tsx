/**
 * Cyber Components Tests
 * 赛博朋克组件的单元测试
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CyberSelect } from '@/components/forms/CyberSelect';
import { CyberToggle } from '@/components/ui/toggle/CyberToggle';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('CyberSelect', () => {
  const mockOptions = [
    { value: '1', label: '选项 1' },
    { value: '2', label: '选项 2' },
    { value: '3', label: '选项 3' },
  ];

  it('应该正确渲染', () => {
    render(
      <CyberSelect
        options={mockOptions}
        value="1"
        onChange={vi.fn()}
      />
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('应该显示placeholder', () => {
    render(
      <CyberSelect
        options={mockOptions}
        placeholder="请选择"
        onChange={vi.fn()}
      />
    );

    expect(screen.getByText('请选择')).toBeInTheDocument();
  });

  it('应该正确处理选择', async () => {
    const handleChange = vi.fn();
    render(
      <CyberSelect
        options={mockOptions}
        onChange={handleChange}
      />
    );

    const combobox = screen.getByRole('combobox');
    fireEvent.click(combobox);

    await waitFor(() => {
      expect(screen.getByText('选项 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('选项 1'));

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith('1');
    });
  });

  it('应该正确显示选中的值', () => {
    render(
      <CyberSelect
        options={mockOptions}
        value="1"
        onChange={vi.fn()}
      />
    );

    expect(screen.getByText('选项 1')).toBeInTheDocument();
  });

  it('应该在搜索时过滤选项', async () => {
    render(
      <CyberSelect
        options={mockOptions}
        searchable
        onChange={vi.fn()}
      />
    );

    const combobox = screen.getByRole('combobox');
    fireEvent.click(combobox);

    const searchInput = screen.getByPlaceholderText('搜索选项...');
    fireEvent.change(searchInput, { target: { value: '选项 1' } });

    await waitFor(() => {
      expect(screen.getByText('选项 1')).toBeInTheDocument();
      expect(screen.queryByText('选项 2')).not.toBeInTheDocument();
    });
  });

  it('应该支持多选', async () => {
    const handleChange = vi.fn();
    render(
      <CyberSelect
        options={mockOptions}
        multiple
        onChange={handleChange}
      />
    );

    const combobox = screen.getByRole('combobox');
    fireEvent.click(combobox);

    await waitFor(() => {
      expect(screen.getByText('选项 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('选项 1'));
    fireEvent.click(screen.getByText('选项 2'));

    await waitFor(() => {
      expect(handleChange).toHaveBeenLastCalledWith(['1', '2']);
    });
  });

  it('应该在禁用时无法点击', () => {
    render(
      <CyberSelect
        options={mockOptions}
        disabled
        onChange={vi.fn()}
      />
    );

    const combobox = screen.getByRole('combobox');
    expect(combobox).toHaveClass('opacity-50');
    expect(combobox).toHaveClass('cursor-not-allowed');
  });
});

describe('CyberToggle', () => {
  it('应该正确渲染', () => {
    render(
      <CyberToggle
        checked={false}
        onChange={vi.fn()}
      />
    );

    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('应该正确显示标签', () => {
    render(
      <CyberToggle
        checked={false}
        onChange={vi.fn()}
        label="启用功能"
      />
    );

    expect(screen.getByText('启用功能')).toBeInTheDocument();
  });

  it('应该正确切换状态', () => {
    const handleChange = vi.fn();
    render(
      <CyberToggle
        checked={false}
        onChange={handleChange}
      />
    );

    const toggle = screen.getByRole('switch');
    fireEvent.click(toggle);

    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('应该在禁用时无法切换', () => {
    const handleChange = vi.fn();
    render(
      <CyberToggle
        checked={false}
        onChange={handleChange}
        disabled
      />
    );

    const toggle = screen.getByRole('switch');
    fireEvent.click(toggle);

    expect(handleChange).not.toHaveBeenCalled();
  });

  it('应该正确显示checked状态', () => {
    const { rerender } = render(
      <CyberToggle
        checked={false}
        onChange={vi.fn()}
      />
    );

    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');

    rerender(
      <CyberToggle
        checked={true}
        onChange={vi.fn()}
      />
    );

    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });
});

describe('Cyber Helpers', () => {
  it('应该正确合并类名', () => {
    const { cn } = require('@/lib/utils/cyber-helpers');

    const result = cn('px-4', 'py-2', 'bg-cyber-cyan');
    expect(result).toBe('px-4 py-2 bg-cyber-cyan');
  });

  it('应该正确格式化日期', () => {
    const { formatCyberDate } = require('@/lib/utils/cyber-helpers');

    const today = new Date();
    const result = formatCyberDate(today);
    expect(result).toBe('刚刚');
  });

  it('应该正确计算阅读时间', () => {
    const { calculateReadingTime } = require('@/lib/utils/cyber-helpers');

    const result = calculateReadingTime('word '.repeat(200));
    expect(result).toBe('1 分钟');
  });

  it('应该正确生成唯一ID', () => {
    const { generateCyberId } = require('@/lib/utils/cyber-helpers');

    const id1 = generateCyberId();
    const id2 = generateCyberId();

    expect(id1).not.toBe(id2);
    expect(id1).toMatch(/^CYBER_/);
  });

  it('应该正确格式化文件大小', () => {
    const { formatCyberFileSize } = require('@/lib/utils/cyber-helpers');

    expect(formatCyberFileSize(1024)).toBe('1.00 KB');
    expect(formatCyberFileSize(1024 * 1024)).toBe('1.00 MB');
  });
});

describe('useCyberTheme', () => {
  it('应该正确初始化主题', () => {
    const { renderHook } = require('@testing-library/react');
    const { useCyberTheme } = require('@/hooks/useCyberTheme');

    const { result } = renderHook(() => useCyberTheme());

    expect(result.current.theme).toBeDefined();
    expect(result.current.theme.color).toBe('cyan');
    expect(result.current.theme.darkMode).toBe(true);
  });

  it('应该正确切换颜色', () => {
    const { renderHook, act } = require('@testing-library/react');
    const { useCyberTheme } = require('@/hooks/useCyberTheme');

    const { result } = renderHook(() => useCyberTheme());

    act(() => {
      result.current.setColor('purple');
    });

    expect(result.current.theme.color).toBe('purple');
  });

  it('应该正确切换暗色模式', () => {
    const { renderHook, act } = require('@testing-library/react');
    const { useCyberTheme } = require('@/hooks/useCyberTheme');

    const { result } = renderHook(() => useCyberTheme());

    act(() => {
      result.current.toggleDarkMode();
    });

    expect(result.current.theme.darkMode).toBe(false);
  });
});

describe('useCyberAnimation', () => {
  it('应该正确初始化打字机效果', () => {
    const { renderHook } = require('@testing-library/react');
    const { useCyberTypewriter } = require('@/hooks/useCyberAnimation');

    const { result } = renderHook(() =>
      useCyberTypewriter(['Hello', 'World'])
    );

    expect(result.current.currentText).toBeDefined();
    expect(result.current.currentIndex).toBe(0);
  });

  it('应该正确初始化进度动画', () => {
    const { renderHook } = require('@testing-library/react');
    const { useCyberProgress } = require('@/hooks/useCyberAnimation');

    const { result } = renderHook(() => useCyberProgress(1000));

    expect(result.current.progress).toBe(0);
    expect(result.current.isComplete).toBe(false);
  });
});
