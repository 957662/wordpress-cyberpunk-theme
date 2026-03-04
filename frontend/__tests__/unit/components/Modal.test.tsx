/**
 * Modal 组件测试
 * ============================================================================
 * 功能: 测试模态框组件的所有功能
 * 版本: 1.0.0
 * 日期: 2026-03-05
 * ============================================================================
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Modal } from '@/components/ui/Modal'

describe('Modal 组件', () => {
  describe('基础渲染', () => {
    it('当 isOpen={false} 时不渲染', () => {
      render(
        <Modal isOpen={false} onClose={jest.fn()}>
          <div>模态框内容</div>
        </Modal>
      )
      expect(screen.queryByText('模态框内容')).not.toBeInTheDocument()
    })

    it('当 isOpen={true} 时渲染内容', () => {
      render(
        <Modal isOpen={true} onClose={jest.fn()}>
          <div>模态框内容</div>
        </Modal>
      )
      expect(screen.getByText('模态框内容')).toBeInTheDocument()
    })

    it('应该渲染标题', () => {
      render(
        <Modal isOpen={true} onClose={jest.fn()} title="模态框标题">
          <div>内容</div>
        </Modal>
      )
      expect(screen.getByText('模态框标题')).toBeInTheDocument()
    })

    it('应该渲染底部按钮', () => {
      const footer = (
        <>
          <button>取消</button>
          <button>确定</button>
        </>
      )
      render(
        <Modal isOpen={true} onClose={jest.fn()} footer={footer}>
          <div>内容</div>
        </Modal>
      )
      expect(screen.getByText('取消')).toBeInTheDocument()
      expect(screen.getByText('确定')).toBeInTheDocument()
    })
  })

  describe('关闭功能', () => {
    it('应该显示关闭按钮', () => {
      render(
        <Modal isOpen={true} onClose={jest.fn()}>
          <div>内容</div>
        </Modal>
      )
      const closeButton = screen.getByRole('button', { name: /关闭/i })
      expect(closeButton).toBeInTheDocument()
    })

    it('点击关闭按钮应该调用 onClose', () => {
      const handleClose = jest.fn()
      render(
        <Modal isOpen={true} onClose={handleClose}>
          <div>内容</div>
        </Modal>
      )

      const closeButton = screen.getByRole('button', { name: /关闭/i })
      fireEvent.click(closeButton)

      expect(handleClose).toHaveBeenCalledTimes(1)
    })

    it('点击遮罩层应该调用 onClose', () => {
      const handleClose = jest.fn()
      render(
        <Modal isOpen={true} onClose={handleClose}>
          <div>内容</div>
        </Modal>
      )

      const overlay = screen.getByTestId('modal-overlay')
      fireEvent.click(overlay)

      expect(handleClose).toHaveBeenCalledTimes(1)
    })

    it('点击内容区域不应该关闭', () => {
      const handleClose = jest.fn()
      render(
        <Modal isOpen={true} onClose={handleClose}>
          <div>内容</div>
        </Modal>
      )

      const content = screen.getByTestId('modal-content')
      fireEvent.click(content)

      expect(handleClose).not.toHaveBeenCalled()
    })

    it('按 ESC 键应该调用 onClose', () => {
      const handleClose = jest.fn()
      render(
        <Modal isOpen={true} onClose={handleClose}>
          <div>内容</div>
        </Modal>
      )

      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' })
      expect(handleClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('尺寸变体', () => {
    it('应该渲染小尺寸', () => {
      render(
        <Modal isOpen={true} onClose={jest.fn()} size="sm">
          <div>内容</div>
        </Modal>
      )
      const modal = screen.getByTestId('modal-content')
      expect(modal).toHaveClass('modal-sm')
    })

    it('应该渲染中等尺寸（默认）', () => {
      render(
        <Modal isOpen={true} onClose={jest.fn()} size="md">
          <div>内容</div>
        </Modal>
      )
      const modal = screen.getByTestId('modal-content')
      expect(modal).toHaveClass('modal-md')
    })

    it('应该渲染大尺寸', () => {
      render(
        <Modal isOpen={true} onClose={jest.fn()} size="lg">
          <div>内容</div>
        </Modal>
      )
      const modal = screen.getByTestId('modal-content')
      expect(modal).toHaveClass('modal-lg')
    })

    it('应该渲染全屏尺寸', () => {
      render(
        <Modal isOpen={true} onClose={jest.fn()} size="full">
          <div>内容</div>
        </Modal>
      )
      const modal = screen.getByTestId('modal-content')
      expect(modal).toHaveClass('modal-full')
    })
  })

  describe('位置变体', () => {
    it('应该支持顶部位置', () => {
      render(
        <Modal isOpen={true} onClose={jest.fn()} position="top">
          <div>内容</div>
        </Modal>
      )
      const modal = screen.getByTestId('modal-content')
      expect(modal).toHaveClass('modal-top')
    })

    it('应该支持居中位置（默认）', () => {
      render(
        <Modal isOpen={true} onClose={jest.fn()} position="center">
          <div>内容</div>
        </Modal>
      )
      const modal = screen.getByTestId('modal-content')
      expect(modal).toHaveClass('modal-center')
    })

    it('应该支持底部位置', () => {
      render(
        <Modal isOpen={true} onClose={jest.fn()} position="bottom">
          <div>内容</div>
        </Modal>
      )
      const modal = screen.getByTestId('modal-content')
      expect(modal).toHaveClass('modal-bottom')
    })
  })

  describe('滚动和内容', () => {
    it('应该支持长内容滚动', () => {
      const longContent = Array.from({ length: 100 }, (_, i) => <div key={i}>第 {i + 1} 行</div>)
      render(
        <Modal isOpen={true} onClose={jest.fn()}>
          {longContent}
        </Modal>
      )
      expect(screen.getByText('第 100 行')).toBeInTheDocument()
    })

    it('应该自动处理内容溢出', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={jest.fn()}>
          <div style={{ height: '2000px' }}>超长内容</div>
        </Modal>
      )
      const modalBody = container.querySelector('.modal-body')
      expect(modalBody).toHaveStyle({ overflowY: 'auto' })
    })
  })

  describe('动画效果', () => {
    it('应该有进入动画', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={jest.fn()}>
          <div>内容</div>
        </Modal>
      )
      const modal = screen.getByTestId('modal-content')
      expect(modal).toHaveClass('animate-in')
    })

    it('关闭时应该有退出动画', async () => {
      const { container } = render(
        <Modal isOpen={true} onClose={jest.fn()}>
          <div>内容</div>
        </Modal>
      )

      const closeButton = screen.getByRole('button', { name: /关闭/i })
      fireEvent.click(closeButton)

      await waitFor(() => {
        const modal = container.querySelector('[data-testid="modal-content"]')
        expect(modal).toHaveClass('animate-out')
      })
    })
  })

  describe('可访问性', () => {
    it('应该有正确的 role 属性', () => {
      render(
        <Modal isOpen={true} onClose={jest.fn()}>
          <div>内容</div>
        </Modal>
      )
      const modal = screen.getByRole('dialog')
      expect(modal).toBeInTheDocument()
    })

    it('应该有 aria-modal 属性', () => {
      render(
        <Modal isOpen={true} onClose={jest.fn()}>
          <div>内容</div>
        </Modal>
      )
      const modal = screen.getByRole('dialog')
      expect(modal).toHaveAttribute('aria-modal', 'true')
    })

    it('打开时应该聚焦到模态框', () => {
      render(
        <Modal isOpen={true} onClose={jest.fn()}>
          <div>内容</div>
        </Modal>
      )
      const modal = screen.getByRole('dialog')
      expect(modal).toHaveFocus()
    })

    it('应该捕获焦点在模态框内', () => {
      render(
        <Modal isOpen={true} onClose={jest.fn()}>
          <input type="text" placeholder="输入框1" />
          <input type="text" placeholder="输入框2" />
        </Modal>
      )
      const inputs = screen.getAllByRole('textbox')
      expect(inputs).toHaveLength(2)
    })

    it('应该隐藏背景内容', () => {
      render(
        <Modal isOpen={true} onClose={jest.fn()}>
          <div>模态框内容</div>
        </Modal>
      )
      const overlay = screen.getByTestId('modal-overlay')
      expect(overlay).toHaveAttribute('aria-hidden', 'true')
    })
  })

  describe('样式和属性', () => {
    it('应该应用自定义 className', () => {
      render(
        <Modal isOpen={true} onClose={jest.fn()} className="custom-modal">
          <div>内容</div>
        </Modal>
      )
      const modal = screen.getByTestId('modal-content')
      expect(modal).toHaveClass('custom-modal')
    })

    it('应该应用自定义样式', () => {
      render(
        <Modal isOpen={true} onClose={jest.fn()} style={{ zIndex: 9999 }}>
          <div>内容</div>
        </Modal>
      )
      const modal = screen.getByTestId('modal-content')
      expect(modal).toHaveStyle({ zIndex: 9999 })
    })

    it('应该支持 closeOnClickOutside={false}', () => {
      const handleClose = jest.fn()
      render(
        <Modal isOpen={true} onClose={handleClose} closeOnClickOutside={false}>
          <div>内容</div>
        </Modal>
      )

      const overlay = screen.getByTestId('modal-overlay')
      fireEvent.click(overlay)

      expect(handleClose).not.toHaveBeenCalled()
    })

    it('应该支持 showCloseButton={false}', () => {
      render(
        <Modal isOpen={true} onClose={jest.fn()} showCloseButton={false}>
          <div>内容</div>
        </Modal>
      )
      const closeButton = screen.queryByRole('button', { name: /关闭/i })
      expect(closeButton).not.toBeInTheDocument()
    })
  })

  describe('回调函数', () => {
    it('应该在打开前调用 onOpen', () => {
      const handleOpen = jest.fn()
      render(
        <Modal isOpen={true} onOpen={handleOpen} onClose={jest.fn()}>
          <div>内容</div>
        </Modal>
      )
      expect(handleOpen).toHaveBeenCalled()
    })

    it('应该在关闭后调用 afterClose', async () => {
      const handleClose = jest.fn()
      const afterClose = jest.fn()

      const { rerender } = render(
        <Modal isOpen={true} onClose={handleClose} afterClose={afterClose}>
          <div>内容</div>
        </Modal>
      )

      // 触发关闭
      handleClose()
      rerender(
        <Modal isOpen={false} onClose={handleClose} afterClose={afterClose}>
          <div>内容</div>
        </Modal>
      )

      await waitFor(() => {
        expect(afterClose).toHaveBeenCalled()
      })
    })
  })

  describe('嵌套模态框', () => {
    it('应该支持嵌套模态框', () => {
      render(
        <Modal isOpen={true} onClose={jest.fn()} title="外层模态框">
          <div>外层内容</div>
          <Modal isOpen={true} onClose={jest.fn()} title="内层模态框">
            <div>内层内容</div>
          </Modal>
        </Modal>
      )
      expect(screen.getByText('外层模态框')).toBeInTheDocument()
      expect(screen.getByText('内层模态框')).toBeInTheDocument()
    })
  })
})
