/**
 * 认证模态框组件
 * 包含登录、注册、密码重置功能
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { authService, LoginCredentials, RegisterData } from '@/lib/services/auth';

export type AuthMode = 'login' | 'register' | 'forgot-password';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: AuthMode;
  onSuccess?: (user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
  onSuccess,
}) => {
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // 登录表单状态
  const [loginData, setLoginData] = useState<LoginCredentials>({
    username: '',
    password: '',
  });

  // 注册表单状态
  const [registerData, setRegisterData] = useState<RegisterData>({
    username: '',
    email: '',
    password: '',
    name: '',
  });

  // 密码重置状态
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // 重置状态
  const resetState = () => {
    setError(null);
    setLoading(false);
    setShowPassword(false);
    setResetSent(false);
    setLoginData({ username: '', password: '' });
    setRegisterData({ username: '', email: '', password: '', name: '' });
    setResetEmail('');
  };

  // 切换模式
  const switchMode = (newMode: AuthMode) => {
    resetState();
    setMode(newMode);
  };

  // 处理登录
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(loginData);
      onSuccess?.(response.user);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 处理注册
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await authService.register(registerData);
      onSuccess?.(response.user);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 处理密码重置
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await authService.requestPasswordReset(resetEmail);
      setResetSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <Card className="relative border-cyber-cyan/20 overflow-hidden">
        {/* 关闭按钮 */}
        <button
          onClick={() => {
            onClose();
            resetState();
          }}
          className="absolute top-4 right-4 p-2 hover:bg-cyber-dark/50 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        <div className="p-8">
          {/* Logo/标题 */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold font-display mb-2">
              {mode === 'login' && '欢迎回来'}
              {mode === 'register' && '创建账户'}
              {mode === 'forgot-password' && '重置密码'}
            </h2>
            <p className="text-gray-400 text-sm">
              {mode === 'login' && '登录到您的账户'}
              {mode === 'register' && '加入我们的社区'}
              {mode === 'forgot-password' && '输入您的邮箱地址'}
            </p>
          </div>

          {/* 错误提示 */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 登录表单 */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  用户名或邮箱
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={loginData.username}
                    onChange={(e) =>
                      setLoginData({ ...loginData, username: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-cyber-dark/50 border border-cyber-cyan/30 rounded-lg focus:outline-none focus:border-cyber-cyan focus:ring-2 focus:ring-cyber-cyan/20 transition-all"
                    placeholder="输入用户名或邮箱"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  密码
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    className="w-full pl-10 pr-12 py-2.5 bg-cyber-dark/50 border border-cyber-cyan/30 rounded-lg focus:outline-none focus:border-cyber-cyan focus:ring-2 focus:ring-cyber-cyan/20 transition-all"
                    placeholder="输入密码"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={loginData.remember}
                    onChange={(e) =>
                      setLoginData({
                        ...loginData,
                        remember: e.target.checked,
                      })
                    }
                    className="rounded border-gray-600 bg-cyber-dark/50 text-cyber-cyan focus:ring-cyber-cyan"
                  />
                  <span className="text-gray-400">记住我</span>
                </label>
                <button
                  type="button"
                  onClick={() => switchMode('forgot-password')}
                  className="text-cyber-cyan hover:underline"
                >
                  忘记密码？
                </button>
              </div>

              <Button
                type="submit"
                disabled={loading}
                variant="primary"
                className="w-full"
              >
                {loading ? '登录中...' : '登录'}
              </Button>

              <div className="text-center text-sm text-gray-400">
                还没有账户？{' '}
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  className="text-cyber-cyan hover:underline"
                >
                  立即注册
                </button>
              </div>
            </form>
          )}

          {/* 注册表单 */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  用户名
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={registerData.username}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        username: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-cyber-dark/50 border border-cyber-cyan/30 rounded-lg focus:outline-none focus:border-cyber-cyan focus:ring-2 focus:ring-cyber-cyan/20 transition-all"
                    placeholder="选择用户名"
                    required
                    minLength={3}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  邮箱
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={registerData.email}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        email: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-cyber-dark/50 border border-cyber-cyan/30 rounded-lg focus:outline-none focus:border-cyber-cyan focus:ring-2 focus:ring-cyber-cyan/20 transition-all"
                    placeholder="输入邮箱"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  显示名称（可选）
                </label>
                <input
                  type="text"
                  value={registerData.name}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 bg-cyber-dark/50 border border-cyber-cyan/30 rounded-lg focus:outline-none focus:border-cyber-cyan focus:ring-2 focus:ring-cyber-cyan/20 transition-all"
                  placeholder="输入显示名称"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  密码
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        password: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-12 py-2.5 bg-cyber-dark/50 border border-cyber-cyan/30 rounded-lg focus:outline-none focus:border-cyber-cyan focus:ring-2 focus:ring-cyber-cyan/20 transition-all"
                    placeholder="设置密码"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                variant="primary"
                className="w-full"
              >
                {loading ? '注册中...' : '注册'}
              </Button>

              <div className="text-center text-sm text-gray-400">
                已有账户？{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-cyber-cyan hover:underline"
                >
                  立即登录
                </button>
              </div>
            </form>
          )}

          {/* 忘记密码表单 */}
          {mode === 'forgot-password' && (
            <>
              {!resetSent ? (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      邮箱地址
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-cyber-dark/50 border border-cyber-cyan/30 rounded-lg focus:outline-none focus:border-cyber-cyan focus:ring-2 focus:ring-cyber-cyan/20 transition-all"
                        placeholder="输入您的邮箱"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    variant="primary"
                    className="w-full"
                  >
                    {loading ? '发送中...' : '发送重置链接'}
                  </Button>

                  <div className="text-center text-sm text-gray-400">
                    <button
                      type="button"
                      onClick={() => switchMode('login')}
                      className="text-cyber-cyan hover:underline"
                    >
                      返回登录
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
                    <Mail className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold">邮件已发送</h3>
                  <p className="text-gray-400 text-sm">
                    我们已向 <span className="text-cyber-cyan">{resetEmail}</span>{' '}
                    发送了密码重置链接，请查收邮件。
                  </p>
                  <Button
                    onClick={() => switchMode('login')}
                    variant="outline"
                    className="w-full"
                  >
                    返回登录
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </Card>
    </Modal>
  );
};

export default AuthModal;
