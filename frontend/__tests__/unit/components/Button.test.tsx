/**
 * Button 组件测试
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { CyberButton } from '@/components/common/CyberButton'

describe('CyberButton', () => {
  it('renders button with text', () => {
    render(<CyberButton>Click me</CyberButton>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<CyberButton onClick={handleClick}>Click me</CyberButton>)

    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<CyberButton disabled>Disabled</CyberButton>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('applies variant classes correctly', () => {
    const { container: primary } = render(<CyberButton variant="primary">Primary</CyberButton>)
    const { container: secondary } = render(<CyberButton variant="secondary">Secondary</CyberButton>)

    expect(primary.firstChild).toHaveClass('cyber-button-primary')
    expect(secondary.firstChild).toHaveClass('cyber-button-secondary')
  })

  it('shows loading state', () => {
    render(<CyberButton isLoading>Loading</CyberButton>)
    expect(screen.getByRole('button')).toHaveClass('cyber-button-loading')
  })
})
