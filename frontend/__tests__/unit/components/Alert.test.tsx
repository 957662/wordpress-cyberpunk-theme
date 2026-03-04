/**
 * Alert 组件测试
 * ============================================================================
 * 功能: 测试提示组件的所有功能
 * 版本: 1.0.0
 * 日期: 2026-03-05
 * ============================================================================
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Alert } from '@/components/ui/Alert'

describe('Alert 组件', () => {
  describe('基础渲染', () => {
    it('应该渲染默认提示', () => {
      render(<Alert>默认提示</Alert>)
      expect(screen.getByText('默认提示')).toBeInTheDocument()
    })

    it('应该渲染 info 类型提示', () => {
      render(<Alert variant="info">信息提示</Alert>)
      const alert = screen.getByRole('alert')
      expect(alert).toHaveClass('alert-info')
    })

    it('应该渲染 success 类型提示', () => {
      render(<Alert variant="success">成功提示</Alert>)
      const alert = screen.getByRole('alert')
      expect(alert).toHaveClass('alert-success')
    })

    it('应该渲染 warning 类型提示', () => {
      render(<Alert variant="warning">警告提示</Alert>)
      const alert = screen.getByRole('alert')
      expect(alert).toHaveClass('alert-warning')
    })

    it('应该渲染 error 类型提示', () => {
      render(<Alert variant="error">错误提示</Alert>)
      const alert = screen.getByRole('alert')
      expect(alert).toHaveClass('alert-error')
    })
  })

  describe('图标功能', () => {
    it('默认应该显示图标', () => {
      render(<Alert>带图标的提示</Alert>)
      const icon = screen.getByRole('alert').querySelector('svg')
      expect(icon).toBeInTheDocument()
    })

    it('当 showIcon={false} 时不显示图标', () => {
      render(<Alert showIcon={false}>无图标提示</Alert>)
      const icon = screen.getByRole('alert').querySelector('svg')
      expect(icon).not.toBeInTheDocument()
    })

    it('应该能自定义图标', () => {
      const customIcon = <span data-testid="custom-icon">★</span>
      render(<Alert icon={customIcon}>自定义图标</Alert>)
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
    })
  })

  describe('关闭功能', () => {
    it('默认不显示关闭按钮', () => {
      render(<Alert>不可关闭的提示</Alert>)
      const closeButton = screen.queryByRole('button', { name: /关闭/i })
      expect(closeButton).not.toBeInTheDocument()
    })

    it('当 closable={true} 时显示关闭按钮', () => {
      render(<Alert closable>可关闭的提示</Alert>)
      const closeButton = screen.queryByRole('button')
      expect(closeButton).toBeInTheDocument()
    })

    it('点击关闭按钮应该调用 onClose 回调', () => {
      const handleClose = jest.fn()
      render(<Alert closable onClose={handleClose}>可关闭提示</Alert>)

      const closeButton = screen.getByRole('button')
      fireEvent.click(closeButton)

      expect(handleClose).toHaveBeenCalledTimes(1)
    })

    it('点击关闭按钮应该隐藏提示', () => {
      const { container } = render(<Alert closable>可关闭提示</Alert>)

      const closeButton = screen.getByRole('button')
      fireEvent.click(closeButton)

      const alert = container.querySelector('[role="alert"]')
      expect(alert).not.toBeInTheDocument()
    })
  })

  describe('标题功能', () => {
    it('应该渲染标题', () => {
      render(
        <Alert title="重要提示">
          这是提示内容
        </Alert>
      )
      expect(screen.getByText('重要提示')).toBeInTheDocument()
      expect(screen.getByText('这是提示内容')).toBeInTheDocument()
    })
  })

  describe('样式和属性', () => {
    it('应该应用自定义 className', () => {
      render(<Alert className="custom-class">自定义样式</Alert>)
      const alert = screen.getByRole('alert')
      expect(alert).toHaveClass('custom-class')
    })

    it('应该传递其他 HTML 属性', () => {
      render(<Alert data-testid="test-alert">测试提示</Alert>)
      expect(screen.getByTestId('test-alert')).toBeInTheDocument()
    })
  })

  describe('可访问性', () => {
    it('应该有正确的 role 属性', () => {
      render(<Alert>提示内容</Alert>)
      const alert = screen.getByRole('alert')
      expect(alert).toBeInTheDocument()
    })

    it('应该有正确的 aria-live 属性', () => {
      render(<Alert>实时提示</Alert>)
      const alert = screen.getByRole('alert')
      expect(alert).toHaveAttribute('aria-live', 'polite')
    })
  })

  describe('动画', () => {
    it('应该有进入动画', async () => {
      const { container } = render(<Alert>动画提示</Alert>)
      const alert = container.querySelector('[role="alert"]')
      expect(alert).toHaveClass('animate-in')
    })

    it('关闭时应该有退出动画', () => {
      const { container } = render(<Alert closable>可关闭提示</Alert>)

      const closeButton = screen.getByRole('button')
      fireEvent.click(closeButton)

      const alert = container.querySelector('[role="alert"]')
      expect(alert).toHaveClass('animate-out')
    })
  })
})
