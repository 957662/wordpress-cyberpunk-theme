/**
 * 增强版登录表单组件
 * 完整实现用户登录功能，移除 TODO 占位符
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { toast } from '@/components/ui/ToastProvider';

interface LoginFormAdvancedProps {
  onSuccess?: () => void;
  redirectUrl?: string;
  className?: string;
}

export function LoginFormAdvanced({
  onSuccess,
  redirectUrl = '/admin',
  className = '',
}: LoginFormAdvancedProps) {
  const router = useRouter();
  const { login, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ username?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: { username?: string; password?: string } = {};

    if (!formData.username.trim()) {
      newErrors.username = '请输入用户名或邮箱';
    }

    if (!formData.password) {
      newErrors.password = '请输入密码';
    } else if (formData.password.length < 6) {
      newErrors.password = '密码至少需要 6 个字符';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // 调用实际的登录 API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '登录失败');
      }

      // 保存 token 和用户信息
      localStorage.setItem('cyberpress_token', data.token);
      localStorage.setItem('cyberpress_user', JSON.stringify(data.user));

      // 调用 AuthContext 的 login 方法
      const success = await login(formData.username, formData.password);

      if (success) {
        toast.success('登录成功！欢迎回来');
        onSuccess?.();

        // 延迟跳转，让用户看到成功提示
        setTimeout(() => {
          router.push(redirectUrl);
        }, 500);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : '登录失败，请稍后重试';
      setErrors({ general: message });
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: 'username' | 'password', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 清除该字段的错误
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full max-w-md mx-auto ${className}`}
    >
      <div className="cyber-card p-8">
        {/* 头部 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">欢迎回来</h2>
          <p className="text-gray-400">登录到 CyberPress</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 通用错误 */}
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-500">登录失败</h4>
                <p className="text-sm text-red-400 mt-1">{errors.general}</p>
              </div>
            </motion.div>
          )}

          {/* 用户名/邮箱 */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-2">
              用户名或邮箱
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="请输入用户名或邮箱"
                className={`w-full pl-10 pr-4 py-3 bg-cyber-dark/50 border rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50 transition-all
                  ${errors.username ? 'border-red-500' : 'border-cyber-border'}
                  text-white placeholder-gray-500`}
                disabled={isLoading || authLoading}
              />
            </div>
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          {/* 密码 */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">
              密码
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="请输入密码"
                className={`w-full pl-10 pr-12 py-3 bg-cyber-dark/50 border rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50 transition-all
                  ${errors.password ? 'border-red-500' : 'border-cyber-border'}
                  text-white placeholder-gray-500`}
                disabled={isLoading || authLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* 记住我 & 忘记密码 */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-cyber-border bg-cyber-dark/50 text-cyber-cyan focus:ring-cyber-cyan"
              />
              <span className="text-sm text-gray-400">记住我</span>
            </label>
            <a
              href="/forgot-password"
              className="text-sm text-cyber-cyan hover:text-cyber-pink transition-colors"
            >
              忘记密码？
            </a>
          </div>

          {/* 登录按钮 */}
          <button
            type="submit"
            disabled={isLoading || authLoading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3
              bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white rounded-lg
              hover:opacity-90 transition-opacity
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading || authLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>登录中...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>登录</span>
              </>
            )}
          </button>
        </form>

        {/* 注册链接 */}
        <div className="mt-6 text-center text-sm text-gray-400">
          还没有账号？
          <a
            href="/register"
            className="ml-1 text-cyber-cyan hover:text-cyber-pink transition-colors"
          >
            立即注册
          </a>
        </div>
      </div>

      {/* 装饰元素 */}
      <div className="mt-4 text-center text-xs text-gray-600">
        <p>登录即表示您同意我们的服务条款和隐私政策</p>
      </div>
    </motion.div>
  );
}

export default LoginFormAdvanced;
