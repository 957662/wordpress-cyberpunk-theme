'use client'

import React, { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  className?: string
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  closeOnEsc?: boolean
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full mx-4',
}

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  className,
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEsc = true,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  // 处理 ESC 键关闭
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, closeOnEsc, onClose])

  // 保存和恢复焦点
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement
      modalRef.current?.focus()

      // 禁止背景滚动
      document.body.style.overflow = 'hidden'
    } else {
      // 恢复焦点
      previousActiveElement.current?.focus()
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // 捕获焦点
  const handleTab = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab') return

    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )

    if (!focusableElements?.length) return

    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    }
  }

  if (!isOpen) return null

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onKeyDown={handleTab}
    >
      {/* 背景遮罩 */}
      <div
        className={cn(
          'absolute inset-0 bg-cyber-black/80 backdrop-blur-sm',
          'animate-fade-in',
        )}
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden="true"
      />

      {/* 模态框 */}
      <div
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        className={cn(
          'relative bg-cyber-card border border-cyber-border rounded-lg shadow-2xl',
          'animate-scale-in max-h-[90vh] overflow-hidden',
          'flex flex-col',
          sizeClasses[size],
          className,
        )}
      >
        {/* 头部 */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-4 border-b border-cyber-border">
            {title && (
              <h2
                id="modal-title"
                className="text-lg font-semibold text-cyber-cyan"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-cyber-cyan transition-colors rounded-lg hover:bg-cyber-cyan/10"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* 内容 */}
        <div className="flex-1 overflow-auto p-4">
          {children}
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

// 模态框操作按钮
interface ModalActionsProps {
  children: React.ReactNode
  className?: string
}

export function ModalActions({ children, className }: ModalActionsProps) {
  return (
    <div className={cn('flex items-center justify-end space-x-2 mt-4', className)}>
      {children}
    </div>
  )
}

// 确认对话框
interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'info',
}: ConfirmDialogProps) {
  const variantClasses = {
    danger: 'bg-cyber-pink hover:bg-cyber-pink/80 text-white',
    warning: 'bg-cyber-yellow hover:bg-cyber-yellow/80 text-cyber-black',
    info: 'bg-cyber-cyan hover:bg-cyber-cyan/80 text-cyber-black',
  }

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-4">
        <p className="text-gray-300">{message}</p>
        <ModalActions>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-cyber-border text-gray-300 hover:bg-cyber-border transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={cn(
              'px-4 py-2 rounded-lg font-semibold transition-colors',
              variantClasses[variant],
            )}
          >
            {confirmText}
          </button>
        </ModalActions>
      </div>
    </Modal>
  )
}

// 抽屉组件（从侧边滑出）
interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  position?: 'left' | 'right' | 'top' | 'bottom'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClassesDrawer = {
  sm: 'w-80',
  md: 'w-96',
  lg: 'w-[28rem]',
  xl: 'w-[32rem]',
}

const positionClasses = {
  left: 'left-0 top-0 bottom-0 h-full',
  right: 'right-0 top-0 bottom-0 h-full',
  top: 'top-0 left-0 right-0',
  bottom: 'bottom-0 left-0 right-0',
}

const slideClasses = {
  left: 'translate-x-0 -translate-x-full',
  right: 'translate-x-0 translate-x-full',
  top: 'translate-y-0 -translate-y-full',
  bottom: 'translate-y-0 translate-y-full',
}

export function Drawer({
  isOpen,
  onClose,
  children,
  title,
  position = 'right',
  size = 'md',
  className,
}: DrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const drawerContent = (
    <>
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 bg-cyber-black/80 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* 抽屉 */}
      <div
        className={cn(
          'fixed z-50 bg-cyber-card border border-cyber-border shadow-2xl',
          positionClasses[position],
          sizeClassesDrawer[size],
          'transition-transform duration-300 ease-in-out',
          isOpen && slideClasses[position].split(' ')[0],
          !isOpen && slideClasses[position].split(' ')[1],
          'flex flex-col max-h-screen',
          className,
        )}
      >
        {/* 头部 */}
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-cyber-border">
            <h2 className="text-lg font-semibold text-cyber-cyan">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-cyber-cyan transition-colors rounded-lg hover:bg-cyber-cyan/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* 内容 */}
        <div className="flex-1 overflow-auto p-4">{children}</div>
      </div>
    </>
  )

  return createPortal(drawerContent, document.body)
}

// 使用示例
export function ModalExample() {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold text-cyber-cyan">Modal Demo</h2>

      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-cyber-cyan text-cyber-black rounded-lg font-semibold hover:bg-cyber-cyan/80 transition-colors"
        >
          Open Modal
        </button>

        <button
          onClick={() => setIsConfirmOpen(true)}
          className="px-6 py-3 bg-cyber-pink text-white rounded-lg font-semibold hover:bg-cyber-pink/80 transition-colors"
        >
          Open Confirm Dialog
        </button>

        <button
          onClick={() => setIsDrawerOpen(true)}
          className="px-6 py-3 bg-cyber-purple text-white rounded-lg font-semibold hover:bg-cyber-purple/80 transition-colors"
        >
          Open Drawer
        </button>
      </div>

      {/* 模态框 */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Example Modal"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            This is a modal dialog with support for various sizes and custom
            content.
          </p>
          <p className="text-gray-400">
            Press ESC or click outside to close. Tab navigation is trapped within
            the modal.
          </p>
          <div className="p-4 bg-cyber-darker rounded-lg border border-cyber-border">
            <p className="text-sm text-gray-500">
              Modal supports keyboard accessibility and focus management.
            </p>
          </div>
        </div>
        <ModalActions>
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 rounded-lg border border-cyber-border text-gray-300 hover:bg-cyber-border transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 rounded-lg bg-cyber-cyan text-cyber-black font-semibold hover:bg-cyber-cyan/80 transition-colors"
          >
            Confirm
          </button>
        </ModalActions>
      </Modal>

      {/* 确认对话框 */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => console.log('Confirmed!')}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      {/* 抽屉 */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Drawer Menu"
        position="right"
        size="md"
      >
        <nav className="space-y-2">
          <a href="#" className="block p-3 rounded-lg hover:bg-cyber-cyan/10 text-cyber-cyan">
            Dashboard
          </a>
          <a href="#" className="block p-3 rounded-lg hover:bg-cyber-cyan/10 text-gray-300">
            Settings
          </a>
          <a href="#" className="block p-3 rounded-lg hover:bg-cyber-cyan/10 text-gray-300">
            Profile
          </a>
          <a href="#" className="block p-3 rounded-lg hover:bg-cyber-cyan/10 text-gray-300">
            Help
          </a>
        </nav>
      </Drawer>
    </div>
  )
}
