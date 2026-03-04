/**
 * 用户认证流程集成测试
 * ============================================================================
 * 功能: 测试用户认证相关功能的集成流程
 * 版本: 1.0.0
 * 日期: 2026-03-05
 * ============================================================================
 */

import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'

// Mock API 服务
jest.mock('@/services/auth.service', () => ({
  AuthService: {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    refreshToken: jest.fn(),
    getCurrentUser: jest.fn(),
    updateProfile: jest.fn(),
    changePassword: jest.fn(),
    resetPassword: jest.fn(),
  },
}))

import { AuthService } from '@/services/auth.service'

// 测试组件
import Login from '@/app/login/page'
import Register from '@/app/register/page'
import Profile from '@/app/profile/page'
import Settings from '@/app/settings/page'

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
})

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{component}</BrowserRouter>
    </QueryClientProvider>
  )
}

describe('用户认证流程集成测试', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    sessionStorage.clear()
  })

  describe('登录流程', () => {
    it('应该成功登录用户', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        token: 'mock-token-123',
      }

      (AuthService.login as jest.Mock).mockResolvedValue(mockUser)

      renderWithProviders(<Login />)

      // 填写登录表单
      const emailInput = screen.getByPlaceholderText(/邮箱/i)
      const passwordInput = screen.getByPlaceholderText(/密码/i)

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })

      // 提交表单
      const loginButton = screen.getByRole('button', { name: /登录/i })
      fireEvent.click(loginButton)

      await waitFor(() => {
        expect(AuthService.login).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        })
      })

      // 验证用户信息已保存
      await waitFor(() => {
        expect(localStorage.getItem('token')).toBe('mock-token-123')
        expect(localStorage.getItem('user')).toBeTruthy()
      })
    })

    it('应该显示登录错误', async () => {
      (AuthService.login as jest.Mock).mockRejectedValue(
        new Error('邮箱或密码错误')
      )

      renderWithProviders(<Login />)

      const emailInput = screen.getByPlaceholderText(/邮箱/i)
      const passwordInput = screen.getByPlaceholderText(/密码/i)

      fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })

      const loginButton = screen.getByRole('button', { name: /登录/i })
      fireEvent.click(loginButton)

      await waitFor(() => {
        expect(screen.getByText(/邮箱或密码错误/i)).toBeInTheDocument()
      })
    })

    it('应该验证必填字段', async () => {
      renderWithProviders(<Login />)

      const loginButton = screen.getByRole('button', { name: /登录/i })
      fireEvent.click(loginButton)

      await waitFor(() => {
        expect(screen.getByText(/请输入邮箱/i)).toBeInTheDocument()
        expect(screen.getByText(/请输入密码/i)).toBeInTheDocument()
      })

      expect(AuthService.login).not.toHaveBeenCalled()
    })

    it('应该验证邮箱格式', async () => {
      renderWithProviders(<Login />)

      const emailInput = screen.getByPlaceholderText(/邮箱/i)
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } })

      const loginButton = screen.getByRole('button', { name: /登录/i })
      fireEvent.click(loginButton)

      await waitFor(() => {
        expect(screen.getByText(/邮箱格式不正确/i)).toBeInTheDocument()
      })
    })

    it('应该支持"记住我"功能', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        token: 'mock-token-123',
      }

      (AuthService.login as jest.Mock).mockResolvedValue(mockUser)

      renderWithProviders(<Login />)

      const emailInput = screen.getByPlaceholderText(/邮箱/i)
      const passwordInput = screen.getByPlaceholderText(/密码/i)
      const rememberCheckbox = screen.getByRole('checkbox', { name: /记住我/i })

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.click(rememberCheckbox)

      const loginButton = screen.getByRole('button', { name: /登录/i })
      fireEvent.click(loginButton)

      await waitFor(() => {
        expect(localStorage.getItem('rememberMe')).toBe('true')
      })
    })
  })

  describe('注册流程', () => {
    it('应该成功注册新用户', async () => {
      const mockUser = {
        id: 1,
        username: 'newuser',
        email: 'newuser@example.com',
        token: 'mock-token-456',
      }

      (AuthService.register as jest.Mock).mockResolvedValue(mockUser)

      renderWithProviders(<Register />)

      // 填写注册表单
      const usernameInput = screen.getByPlaceholderText(/用户名/i)
      const emailInput = screen.getByPlaceholderText(/邮箱/i)
      const passwordInput = screen.getByPlaceholderText(/密码/i)
      const confirmPasswordInput = screen.getByPlaceholderText(/确认密码/i)

      fireEvent.change(usernameInput, { target: { value: 'newuser' } })
      fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'SecurePass123!' } })
      fireEvent.change(confirmPasswordInput, { target: { value: 'SecurePass123!' } })

      // 同意条款
      const termsCheckbox = screen.getByRole('checkbox', { name: /我同意/i })
      fireEvent.click(termsCheckbox)

      // 提交表单
      const registerButton = screen.getByRole('button', { name: /注册/i })
      fireEvent.click(registerButton)

      await waitFor(() => {
        expect(AuthService.register).toHaveBeenCalledWith({
          username: 'newuser',
          email: 'newuser@example.com',
          password: 'SecurePass123!',
        })
      })
    })

    it('应该验证密码强度', async () => {
      renderWithProviders(<Register />)

      const passwordInput = screen.getByPlaceholderText(/密码/i)
      fireEvent.change(passwordInput, { target: { value: 'weak' } })

      await waitFor(() => {
        expect(screen.getByText(/密码强度不足/i)).toBeInTheDocument()
      })
    })

    it('应该验证密码确认', async () => {
      renderWithProviders(<Register />)

      const passwordInput = screen.getByPlaceholderText(/密码/i)
      const confirmPasswordInput = screen.getByPlaceholderText(/确认密码/i)

      fireEvent.change(passwordInput, { target: { value: 'Password123!' } })
      fireEvent.change(confirmPasswordInput, { target: { value: 'Different123!' } })

      const registerButton = screen.getByRole('button', { name: /注册/i })
      fireEvent.click(registerButton)

      await waitFor(() => {
        expect(screen.getByText(/两次密码不一致/i)).toBeInTheDocument()
      })
    })

    it('应该要求同意服务条款', async () => {
      renderWithProviders(<Register />)

      // 不勾选同意条款
      const registerButton = screen.getByRole('button', { name: /注册/i })
      fireEvent.click(registerButton)

      await waitFor(() => {
        expect(screen.getByText(/请同意服务条款/i)).toBeInTheDocument()
      })
    })
  })

  describe('退出登录流程', () => {
    it('应该成功退出登录', async () => {
      // 模拟已登录状态
      localStorage.setItem('token', 'mock-token')
      localStorage.setItem('user', JSON.stringify({ id: 1, username: 'testuser' }))

      (AuthService.logout as jest.Mock).mockResolvedValue(true)

      renderWithProviders(<Login />)

      // 模拟点击退出按钮
      const logoutButton = screen.getByRole('button', { name: /退出/i })
      fireEvent.click(logoutButton)

      await waitFor(() => {
        expect(AuthService.logout).toHaveBeenCalled()
        expect(localStorage.getItem('token')).toBeNull()
        expect(localStorage.getItem('user')).toBeNull()
      })
    })
  })

  describe('个人资料流程', () => {
    it('应该加载用户资料', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        avatar: '/avatar.jpg',
        bio: '这是个人简介',
        location: '北京',
        website: 'https://example.com',
      }

      (AuthService.getCurrentUser as jest.Mock).mockResolvedValue(mockUser)

      renderWithProviders(<Profile />)

      await waitFor(() => {
        expect(screen.getByText('testuser')).toBeInTheDocument()
        expect(screen.getByText('test@example.com')).toBeInTheDocument()
        expect(screen.getByText('这是个人简介')).toBeInTheDocument()
      })
    })

    it('应该更新用户资料', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      }

      const updatedUser = {
        ...mockUser,
        bio: '更新后的简介',
        location: '上海',
      }

      (AuthService.getCurrentUser as jest.Mock).mockResolvedValue(mockUser)
      (AuthService.updateProfile as jest.Mock).mockResolvedValue(updatedUser)

      renderWithProviders(<Profile />)

      await waitFor(() => {
        const bioInput = screen.getByPlaceholderText(/个人简介/i)
        const locationInput = screen.getByPlaceholderText(/所在地/i)

        fireEvent.change(bioInput, { target: { value: '更新后的简介' } })
        fireEvent.change(locationInput, { target: { value: '上海' } })

        const saveButton = screen.getByRole('button', { name: /保存/i })
        fireEvent.click(saveButton)
      })

      await waitFor(() => {
        expect(AuthService.updateProfile).toHaveBeenCalledWith({
          bio: '更新后的简介',
          location: '上海',
        })
      })
    })

    it('应该上传头像', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        avatar: '/old-avatar.jpg',
      }

      const newAvatarUrl = '/new-avatar.jpg'

      (AuthService.getCurrentUser as jest.Mock).mockResolvedValue(mockUser)
      ;(AuthService.updateProfile as jest.Mock).mockResolvedValue({
        ...mockUser,
        avatar: newAvatarUrl,
      })

      renderWithProviders(<Profile />)

      await waitFor(() => {
        const fileInput = screen.getByLabelText(/上传头像/i)
        const file = new File(['avatar'], 'avatar.jpg', { type: 'image/jpeg' })

        fireEvent.change(fileInput, { target: { files: [file] } })
      })

      await waitFor(() => {
        expect(AuthService.updateProfile).toHaveBeenCalledWith(
          expect.objectContaining({
            avatar: expect.any(File),
          })
        )
      })
    })
  })

  describe('设置流程', () => {
    it('应该修改密码', async () => {
      const mockUser = { id: 1, username: 'testuser' }

      (AuthService.getCurrentUser as jest.Mock).mockResolvedValue(mockUser)
      (AuthService.changePassword as jest.Mock).mockResolvedValue(true)

      renderWithProviders(<Settings />)

      const currentPasswordInput = screen.getByPlaceholderText(/当前密码/i)
      const newPasswordInput = screen.getByPlaceholderText(/新密码/i)
      const confirmNewPasswordInput = screen.getByPlaceholderText(/确认新密码/i)

      fireEvent.change(currentPasswordInput, { target: { value: 'OldPass123!' } })
      fireEvent.change(newPasswordInput, { target: { value: 'NewPass456!' } })
      fireEvent.change(confirmNewPasswordInput, { target: { value: 'NewPass456!' } })

      const updateButton = screen.getByRole('button', { name: /更新密码/i })
      fireEvent.click(updateButton)

      await waitFor(() => {
        expect(AuthService.changePassword).toHaveBeenCalledWith({
          currentPassword: 'OldPass123!',
          newPassword: 'NewPass456!',
        })
      })

      await waitFor(() => {
        expect(screen.getByText(/密码修改成功/i)).toBeInTheDocument()
      })
    })

    it('应该验证当前密码', async () => {
      const mockUser = { id: 1, username: 'testuser' }

      (AuthService.getCurrentUser as jest.Mock).mockResolvedValue(mockUser)
      (AuthService.changePassword as jest.Mock).mockRejectedValue(
        new Error('当前密码错误')
      )

      renderWithProviders(<Settings />)

      const currentPasswordInput = screen.getByPlaceholderText(/当前密码/i)
      const newPasswordInput = screen.getByPlaceholderText(/新密码/i)
      const confirmNewPasswordInput = screen.getByPlaceholderText(/确认新密码/i)

      fireEvent.change(currentPasswordInput, { target: { value: 'WrongPass' } })
      fireEvent.change(newPasswordInput, { target: { value: 'NewPass456!' } })
      fireEvent.change(confirmNewPasswordInput, { target: { value: 'NewPass456!' } })

      const updateButton = screen.getByRole('button', { name: /更新密码/i })
      fireEvent.click(updateButton)

      await waitFor(() => {
        expect(screen.getByText(/当前密码错误/i)).toBeInTheDocument()
      })
    })
  })

  describe('密码重置流程', () => {
    it('应该发送密码重置邮件', async () => {
      (AuthService.resetPassword as jest.Mock).mockResolvedValue(true)

      renderWithProviders(<Login />)

      // 点击"忘记密码"链接
      const forgotPasswordLink = screen.getByText(/忘记密码/i)
      fireEvent.click(forgotPasswordLink)

      // 输入邮箱
      const emailInput = screen.getByPlaceholderText(/请输入注册邮箱/i)
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })

      // 发送重置邮件
      const sendButton = screen.getByRole('button', { name: /发送/i })
      fireEvent.click(sendButton)

      await waitFor(() => {
        expect(AuthService.resetPassword).toHaveBeenCalledWith('test@example.com')
      })

      await waitFor(() => {
        expect(screen.getByText(/重置邮件已发送/i)).toBeInTheDocument()
      })
    })
  })

  describe('Token 刷新流程', () => {
    it('应该自动刷新过期 Token', async () => {
      const oldToken = 'old-token'
      const newToken = 'new-token'

      localStorage.setItem('token', oldToken)

      (AuthService.refreshToken as jest.Mock).mockResolvedValue({
        token: newToken,
        user: { id: 1, username: 'testuser' },
      })

      // 模拟 Token 过期场景
      renderWithProviders(<Profile />)

      await waitFor(() => {
        expect(AuthService.refreshToken).toHaveBeenCalled()
        expect(localStorage.getItem('token')).toBe(newToken)
      })
    })
  })

  describe('安全功能', () => {
    it('应该在多次失败后锁定账户', async () => {
      (AuthService.login as jest.Mock)
        .mockRejectedValueOnce(new Error('密码错误'))
        .mockRejectedValueOnce(new Error('密码错误'))
        .mockRejectedValueOnce(new Error('密码错误'))
        .mockRejectedValueOnce(new Error('账户已锁定，请30分钟后再试'))

      renderWithProviders(<Login />)

      const emailInput = screen.getByPlaceholderText(/邮箱/i)
      const passwordInput = screen.getByPlaceholderText(/密码/i)

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'wrongpass' } })

      const loginButton = screen.getByRole('button', { name: /登录/i })

      // 尝试登录3次
      fireEvent.click(loginButton)
      await waitFor(() => expect(screen.getByText(/密码错误/i)).toBeInTheDocument())

      fireEvent.click(loginButton)
      await waitFor(() => expect(screen.getByText(/密码错误/i)).toBeInTheDocument())

      fireEvent.click(loginButton)
      await waitFor(() => expect(screen.getByText(/密码错误/i)).toBeInTheDocument())

      // 第4次应该显示账户锁定
      fireEvent.click(loginButton)
      await waitFor(() => {
        expect(screen.getByText(/账户已锁定/i)).toBeInTheDocument()
      })
    })

    it('应该支持两步验证', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        token: 'mock-token',
        requiresTwoFactor: true,
      }

      (AuthService.login as jest.Mock).mockResolvedValue(mockUser)

      renderWithProviders(<Login />)

      // 第一阶段：输入凭据
      const emailInput = screen.getByPlaceholderText(/邮箱/i)
      const passwordInput = screen.getByPlaceholderText(/密码/i)

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })

      const loginButton = screen.getByRole('button', { name: /登录/i })
      fireEvent.click(loginButton)

      // 第二阶段：输入验证码
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/验证码/i)).toBeInTheDocument()
      })

      const codeInput = screen.getByPlaceholderText(/验证码/i)
      fireEvent.change(codeInput, { target: { value: '123456' } })

      const verifyButton = screen.getByRole('button', { name: /验证/i })
      fireEvent.click(verifyButton)

      await waitFor(() => {
        expect(screen.getByText(/登录成功/i)).toBeInTheDocument()
      })
    })
  })
})
