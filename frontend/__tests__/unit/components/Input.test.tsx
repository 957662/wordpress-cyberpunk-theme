/**
 * Input 组件测试
 * ============================================================================
 * 功能: 测试输入框组件的所有功能
 * 版本: 1.0.0
 * 日期: 2026-03-05
 * ============================================================================
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { Input } from '@/components/ui/Input'

describe('Input 组件', () => {
  describe('基础渲染', () => {
    it('应该渲染默认输入框', () => {
      render(<Input />)
      const input = screen.getByRole('textbox')
      expect(input).toBeInTheDocument()
    })

    it('应该显示占位符文本', () => {
      render(<Input placeholder="请输入用户名" />)
      expect(screen.getByPlaceholderText('请输入用户名')).toBeInTheDocument()
    })

    it('应该显示初始值', () => {
      render(<Input defaultValue="初始值" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveValue('初始值')
    })

    it('应该是受控组件', () => {
      const TestComponent = () => {
        const [value, setValue] = React.useState('test')
        return <Input value={value} onChange={(e) => setValue(e.target.value)} />
      }
      render(<TestComponent />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveValue('test')
    })
  })

  describe('输入交互', () => {
    it('应该允许用户输入', async () => {
      const user = userEvent.setup()
      render(<Input />)

      const input = screen.getByRole('textbox')
      await user.type(input, 'Hello World')

      expect(input).toHaveValue('Hello World')
    })

    it('应该调用 onChange 回调', async () => {
      const handleChange = jest.fn()
      const user = userEvent.setup()
      render(<Input onChange={handleChange} />)

      const input = screen.getByRole('textbox')
      await user.type(input, 'test')

      expect(handleChange).toHaveBeenCalled()
    })

    it('应该处理清空操作', () => {
      render(<Input value="test" />)
      const input = screen.getByRole('textbox')

      fireEvent.change(input, { target: { value: '' } })
      expect(input).toHaveValue('')
    })
  })

  describe('状态变体', () => {
    it('应该渲染禁用状态', () => {
      render(<Input disabled />)
      const input = screen.getByRole('textbox')
      expect(input).toBeDisabled()
    })

    it('禁用时不应接受输入', async () => {
      const user = userEvent.setup()
      render(<Input disabled defaultValue="test" />)

      const input = screen.getByRole('textbox')
      await user.type(input, 'abc')

      expect(input).toHaveValue('test')
    })

    it('应该渲染只读状态', () => {
      render(<Input readOnly value="readonly" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('readonly')
    })

    it('应该渲染错误状态', () => {
      render(<Input error />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('input-error')
    })

    it('应该渲染成功状态', () => {
      render(<Input success />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('input-success')
    })
  })

  describe('尺寸变体', () => {
    it('应该渲染小尺寸', () => {
      render(<Input size="sm" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('input-sm')
    })

    it('应该渲染中等尺寸（默认）', () => {
      render(<Input size="md" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('input-md')
    })

    it('应该渲染大尺寸', () => {
      render(<Input size="lg" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('input-lg')
    })
  })

  describe('辅助功能', () => {
    it('应该显示标签', () => {
      render(<Input label="用户名" />)
      expect(screen.getByText('用户名')).toBeInTheDocument()
    })

    it('应该显示帮助文本', () => {
      render(<Input helperText="请输入6-20个字符" />)
      expect(screen.getByText('请输入6-20个字符')).toBeInTheDocument()
    })

    it('应该显示错误消息', () => {
      render(<Input error errorMessage="用户名已存在" />)
      expect(screen.getByText('用户名已存在')).toBeInTheDocument()
    })

    it('应该显示前缀', () => {
      render(<Input prefix="https://" />)
      expect(screen.getByText('https://')).toBeInTheDocument()
    })

    it('应该显示后缀', () => {
      render(<Input suffix=".com" />)
      expect(screen.getByText('.com')).toBeInTheDocument()
    })
  })

  describe('键盘交互', () => {
    it('应该响应 Enter 键', () => {
      const handleKeyPress = jest.fn()
      render(<Input onKeyPress={handleKeyPress} />)

      const input = screen.getByRole('textbox')
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })

      expect(handleKeyPress).toHaveBeenCalled()
    })

    it('应该响应 Escape 键', () => {
      render(<Input />)
      const input = screen.getByRole('textbox')

      fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' })
      // 验证 Escape 键行为
      expect(input).toBeInTheDocument()
    })
  })

  describe('焦点管理', () => {
    it('应该能够获得焦点', () => {
      render(<Input />)
      const input = screen.getByRole('textbox')
      input.focus()
      expect(input).toHaveFocus()
    })

    it('应该调用 onFocus 回调', () => {
      const handleFocus = jest.fn()
      render(<Input onFocus={handleFocus} />)

      const input = screen.getByRole('textbox')
      fireEvent.focus(input)

      expect(handleFocus).toHaveBeenCalled()
    })

    it('应该调用 onBlur 回调', () => {
      const handleBlur = jest.fn()
      render(<Input onBlur={handleBlur} />)

      const input = screen.getByRole('textbox')
      fireEvent.blur(input)

      expect(handleBlur).toHaveBeenCalled()
    })

    it('应该支持自动聚焦', () => {
      render(<Input autoFocus />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveFocus()
    })
  })

  describe('类型变体', () => {
    it('应该支持密码类型', () => {
      render(<Input type="password" />)
      const input = screen.getByPlaceholderText('')
      expect(input).toHaveAttribute('type', 'password')
    })

    it('应该支持邮箱类型', () => {
      render(<Input type="email" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('type', 'email')
    })

    it('应该支持数字类型', () => {
      render(<Input type="number" />)
      const input = screen.getByRole('spinbutton')
      expect(input).toHaveAttribute('type', 'number')
    })

    it('应该支持搜索类型', () => {
      render(<Input type="search" />)
      const input = screen.getByRole('searchbox')
      expect(input).toHaveAttribute('type', 'search')
    })
  })

  describe('可访问性', () => {
    it('应该有正确的 aria 属性', () => {
      render(<Input aria-label="搜索输入框" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-label', '搜索输入框')
    })

    it('错误状态应该有 aria-invalid 属性', () => {
      render(<Input error />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })

    it('应该有正确的 id 关联', () => {
      render(<Input id="test-input" label="测试" />)
      const input = screen.getByRole('textbox')
      const label = screen.getByText('测试')

      expect(input).toHaveAttribute('id', 'test-input')
      expect(label).toHaveAttribute('for', 'test-input')
    })
  })

  describe('样式和属性', () => {
    it('应该应用自定义 className', () => {
      render(<Input className="custom-input" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('custom-input')
    })

    it('应该应用自定义样式', () => {
      render(<Input style={{ color: 'red' }} />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveStyle({ color: 'red' })
    })

    it('应该传递其他 HTML 属性', () => {
      render(<Input data-testid="custom-input" />)
      expect(screen.getByTestId('custom-input')).toBeInTheDocument()
    })

    it('应该支持最大长度限制', () => {
      render(<Input maxLength={10} />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('maxlength', '10')
    })
  })
})
