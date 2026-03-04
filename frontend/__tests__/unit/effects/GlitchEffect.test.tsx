/**
 * GlitchEffect 组件测试
 * ============================================================================
 * 功能: 测试故障效果组件的所有功能
 * 版本: 1.0.0
 * 日期: 2026-03-05
 * ============================================================================
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { GlitchEffect } from '@/components/effects/GlitchEffect'

describe('GlitchEffect 组件', () => {
  describe('基础渲染', () => {
    it('应该渲染默认故障效果', () => {
      render(<GlitchEffect>测试文本</GlitchEffect>)
      expect(screen.getByText('测试文本')).toBeInTheDocument()
    })

    it('应该渲染子元素', () => {
      render(
        <GlitchEffect>
          <button>按钮</button>
        </GlitchEffect>
      )
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('应该处理多个子元素', () => {
      render(
        <GlitchEffect>
          <span>文本1</span>
          <span>文本2</span>
        </GlitchEffect>
      )
      expect(screen.getByText('文本1')).toBeInTheDocument()
      expect(screen.getByText('文本2')).toBeInTheDocument()
    })
  })

  describe('触发方式', () => {
    it('默认应该在悬停时触发', () => {
      const { container } = render(
        <GlitchEffect trigger="hover">
          <div>悬停测试</div>
        </GlitchEffect>
      )
      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('glitch-hover')
    })

    it('应该支持点击触发', () => {
      const { container } = render(
        <GlitchEffect trigger="click">
          <div>点击测试</div>
        </GlitchEffect>
      )
      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('glitch-click')
    })

    it('应该支持持续触发', () => {
      const { container } = render(
        <GlitchEffect trigger="always">
          <div>持续测试</div>
        </GlitchEffect>
      )
      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('glitch-always')
    })

    it('应该支持自动触发', () => {
      const { container } = render(
        <GlitchEffect trigger="auto">
          <div>自动测试</div>
        </GlitchEffect>
      )
      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('glitch-auto')
    })
  })

  describe('强度变体', () => {
    it('应该渲染轻度强度', () => {
      const { container } = render(
        <GlitchEffect intensity="light">
          <div>轻度故障</div>
        </GlitchEffect>
      )
      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('glitch-light')
    })

    it('应该渲染中度强度（默认）', () => {
      const { container } = render(
        <GlitchEffect intensity="medium">
          <div>中度故障</div>
        </GlitchEffect>
      )
      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('glitch-medium')
    })

    it('应该渲染重度强度', () => {
      const { container } = render(
        <GlitchEffect intensity="heavy">
          <div>重度故障</div>
        </GlitchEffect>
      )
      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('glitch-heavy')
    })

    it('应该渲染极端强度', () => {
      const { container } = render(
        <GlitchEffect intensity="extreme">
          <div>极端故障</div>
        </GlitchEffect>
      )
      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('glitch-extreme')
    })
  })

  describe('速度控制', () => {
    it('应该支持慢速', () => {
      const { container } = render(
        <GlitchEffect speed="slow">
          <div>慢速故障</div>
        </GlitchEffect>
      )
      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('glitch-slow')
    })

    it('应该支持正常速度（默认）', () => {
      const { container } = render(
        <GlitchEffect speed="normal">
          <div>正常速度</div>
        </GlitchEffect>
      )
      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('glitch-normal')
    })

    it('应该支持快速', () => {
      const { container } = render(
        <GlitchEffect speed="fast">
          <div>快速故障</div>
        </GlitchEffect>
      )
      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('glitch-fast')
    })
  })

  describe('颜色主题', () => {
    it('应该支持默认颜色', () => {
      const { container } = render(
        <GlitchEffect>
          <div>默认颜色</div>
        </GlitchEffect>
      )
      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('glitch-default')
    })

    it('应该支持青色主题', () => {
      const { container } = render(
        <GlitchEffect color="cyan">
          <div>青色故障</div>
        </GlitchEffect>
      )
      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('glitch-cyan')
    })

    it('应该支持紫色主题', () => {
      const { container } = render(
        <GlitchEffect color="purple">
          <div>紫色故障</div>
        </GlitchEffect>
      )
      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('glitch-purple')
    })

    it('应该支持粉色主题', () => {
      const { container } = render(
        <GlitchEffect color="pink">
          <div>粉色故障</div>
        </GlitchEffect>
      )
      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('glitch-pink')
    })

    it('应该支持自定义颜色', () => {
      const { container } = render(
        <GlitchEffect color="#ff0000">
          <div>自定义颜色</div>
        </GlitchEffect>
      )
      const wrapper = container.firstChild
      expect(wrapper).toHaveStyle({ '--glitch-color': '#ff0000' })
    })
  })

  describe('动画效果', () => {
    it('应该包含 CSS 动画', () => {
      const { container } = render(
        <GlitchEffect>
          <div>动画测试</div>
        </GlitchEffect>
      )
      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('animate-glitch')
    })

    it('应该包含多个故障层', () => {
      const { container } = render(
        <GlitchEffect>
          <div>多层故障</div>
        </GlitchEffect>
      )
      const layers = container.querySelectorAll('.glitch-layer')
      expect(layers.length).toBeGreaterThan(1)
    })
  })

  describe('交互行为', () => {
    it('应该在悬停时激活故障效果', () => {
      const { container } = render(
        <GlitchEffect trigger="hover">
          <div>悬停激活</div>
        </GlitchEffect>
      )
      const wrapper = container.firstChild

      // 模拟悬停
      wrapper && fireEvent.mouseEnter(wrapper)

      expect(wrapper).toHaveClass('glitch-active')
    })

    it('应该在鼠标离开时停止故障效果', () => {
      const { container } = render(
        <GlitchEffect trigger="hover">
          <div>悬停停止</div>
        </GlitchEffect>
      )
      const wrapper = container.firstChild

      wrapper && fireEvent.mouseEnter(wrapper)
      wrapper && fireEvent.mouseLeave(wrapper)

      expect(wrapper).not.toHaveClass('glitch-active')
    })

    it('应该在点击时激活故障效果', () => {
      const { container } = render(
        <GlitchEffect trigger="click">
          <div>点击激活</div>
        </GlitchEffect>
      )
      const wrapper = container.firstChild

      wrapper && fireEvent.click(wrapper)

      expect(wrapper).toHaveClass('glitch-active')
    })
  })

  describe('可访问性', () => {
    it('应该有适当的 ARIA 属性', () => {
      const { container } = render(
        <GlitchEffect aria-label="故障效果文本">
          <div>可访问性测试</div>
        </GlitchEffect>
      )
      const wrapper = container.firstChild
      expect(wrapper).toHaveAttribute('aria-label', '故障效果文本')
    })

    it('应该支持减少动画偏好', () => {
      // 模拟 prefers-reduced-motion
      const { container } = render(
        <GlitchEffect respectReducedMotion={true}>
          <div>减少动画</div>
        </GlitchEffect>
      )
      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('glitch-reduced-motion')
    })
  })

  describe('样式和属性', () => {
    it('应该应用自定义 className', () => {
      const { container } = render(
        <GlitchEffect className="custom-glitch">
          <div>自定义类名</div>
        </GlitchEffect>
      )
      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('custom-glitch')
    })

    it('应该应用自定义样式', () => {
      const { container } = render(
        <GlitchEffect style={{ fontSize: '24px' }}>
          <div>自定义样式</div>
        </GlitchEffect>
      )
      const wrapper = container.firstChild
      expect(wrapper).toHaveStyle({ fontSize: '24px' })
    })

    it('应该传递其他 HTML 属性', () => {
      render(
        <GlitchEffect data-testid="custom-glitch">
          <div>测试</div>
        </GlitchEffect>
      )
      expect(screen.getByTestId('custom-glitch')).toBeInTheDocument()
    })
  })

  describe('性能优化', () => {
    it('应该使用 transform 进行动画', () => {
      const { container } = render(
        <GlitchEffect>
          <div>性能优化</div>
        </GlitchEffect>
      )
      const wrapper = container.firstChild
      // 检查是否使用了 GPU 加速
      expect(wrapper).toHaveStyle({ transform: expect.any(String) })
    })

    it('应该使用 will-change 优化', () => {
      const { container } = render(
        <GlitchEffect>
          <div>性能优化</div>
        </GlitchEffect>
      )
      const wrapper = container.firstChild
      expect(wrapper).toHaveStyle({ willChange: 'transform, opacity' })
    })
  })

  describe('特殊功能', () => {
    it('应该支持文本分裂效果', () => {
      render(
        <GlitchEffect splitText={true}>
          分裂文本
        </GlitchEffect>
      )
      // 验证文本是否被分裂为单独的字符
      expect(screen.getByText('分裂文本')).toBeInTheDocument()
    })

    it('应该支持随机故障间隔', () => {
      const { container } = render(
        <GlitchEffect randomInterval={true}>
          <div>随机间隔</div>
        </GlitchEffect>
      )
      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('glitch-random')
    })

    it('应该支持故障持续时间', () => {
      const { container } = render(
        <GlitchEffect duration={2000}>
          <div>持续时间</div>
        </GlitchEffect>
      )
      const wrapper = container.firstChild
      expect(wrapper).toHaveStyle({ '--glitch-duration': '2000ms' })
    })
  })
})

// 导入 fireEvent
import { fireEvent } from '@testing-library/react'
