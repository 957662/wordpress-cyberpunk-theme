'use client';

/**
 * RegisterForm - 注册表单组件
 * 用户注册，包含表单验证和密码强度检查
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Check,
  X,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface RegisterFormProps {
  onSuccess?: () => void;
  onLoginClick?: () => void;
  className?: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

interface PasswordStrength {
  score: number;
  feedback: string[];
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onLoginClick,
  className,
}) => {
  const { register, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: [],
  });

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) score += 1;
    else feedback.push('至少 8 个字符');

    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
    else feedback.push('大小写字母');

    if (/\d/.test(password)) score += 1;
    else feedback.push('至少一个数字');

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    else feedback.push('特殊字符');

    return { score: Math.min(score, 5), feedback };
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Username validation
    if (!formData.username) {
      newErrors.username = '请输入用户名';
    } else if (formData.username.length < 3) {
      newErrors.username = '用户名至少需要 3 个字符';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = '用户名只能包含字母、数字和下划线';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = '请输入邮箱地址';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = '请输入密码';
    } else if (formData.password.length < 8) {
      newErrors.password = '密码至少需要 8 个字符';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '请确认密码';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      onSuccess?.();
    } catch (error: any) {
      setErrors({
        general: error.message || '注册失败，请稍后重试',
      });
    }
  };

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));

    // Calculate password strength
    if (field === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const getStrengthColor = () => {
    const colors = [
      'bg-gray-700',
      'bg-red-500',
      'bg-orange-500',
      'bg-yellow-500',
      'bg-lime-500',
      'bg-green-500',
    ];
    return colors[passwordStrength.score];
  };

  const getStrengthLabel = () => {
    const labels = ['非常弱', '弱', '一般', '强', '非常强'];
    return labels[passwordStrength.score - 1] || '';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('w-full max-w-md mx-auto', className)}
    >
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-2">创建账户</h2>
        <p className="text-gray-400">加入我们的社区</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* General Error */}
        {errors.general && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-400">{errors.general}</p>
            </div>
          </motion.div>
        )}

        {/* Username Input */}
        <div className="space-y-2">
          <label htmlFor="username" className="block text-sm font-medium text-gray-300">
            用户名
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              id="username"
              type="text"
              value={formData.username}
              onChange={handleChange('username')}
              onBlur={() => handleBlur('username')}
              placeholder="johndoe"
              className={cn(
                'w-full pl-11 pr-4 py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-500 outline-none transition-colors',
                touched.username && errors.username
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-700 focus:border-cyan-500'
              )}
              disabled={loading}
            />
          </div>
          {touched.username && errors.username && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-red-400"
            >
              {errors.username}
            </motion.p>
          )}
        </div>

        {/* Email Input */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">
            邮箱地址
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              onBlur={() => handleBlur('email')}
              placeholder="your@email.com"
              className={cn(
                'w-full pl-11 pr-4 py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-500 outline-none transition-colors',
                touched.email && errors.email
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-700 focus:border-cyan-500'
              )}
              disabled={loading}
            />
          </div>
          {touched.email && errors.email && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-red-400"
            >
              {errors.email}
            </motion.p>
          )}
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-300">
            密码
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange('password')}
              onBlur={() => handleBlur('password')}
              placeholder="••••••••"
              className={cn(
                'w-full pl-11 pr-12 py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-500 outline-none transition-colors',
                touched.password && errors.password
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-700 focus:border-cyan-500'
              )}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Password Strength */}
          {formData.password && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    className={cn('h-full transition-colors', getStrengthColor())}
                  />
                </div>
                <span className="text-xs text-gray-400">{getStrengthLabel()}</span>
              </div>
              {passwordStrength.feedback.length > 0 && (
                <div className="text-xs text-gray-500">
                  添加：{passwordStrength.feedback.join('、')}
                </div>
              )}
            </div>
          )}

          {touched.password && errors.password && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-red-400"
            >
              {errors.password}
            </motion.p>
          )}
        </div>

        {/* Confirm Password Input */}
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
            确认密码
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              onBlur={() => handleBlur('confirmPassword')}
              placeholder="••••••••"
              className={cn(
                'w-full pl-11 pr-12 py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-500 outline-none transition-colors',
                touched.confirmPassword && errors.confirmPassword
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-700 focus:border-cyan-500'
              )}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {touched.confirmPassword && errors.confirmPassword && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-red-400"
            >
              {errors.confirmPassword}
            </motion.p>
          )}
          {formData.confirmPassword && !errors.confirmPassword && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-green-400 flex items-center gap-1"
            >
              <Check className="w-4 h-4" />
              密码匹配
            </motion.p>
          )}
        </div>

        {/* Terms */}
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="terms"
            required
            className="mt-1 w-4 h-4 rounded border-gray-700 bg-gray-900 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-gray-900"
          />
          <label htmlFor="terms" className="text-sm text-gray-400">
            我同意{' '}
            <a href="/terms" className="text-cyan-400 hover:text-cyan-300">
              服务条款
            </a>{' '}
            和{' '}
            <a href="/privacy" className="text-cyan-400 hover:text-cyan-300">
              隐私政策
            </a>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              注册中...
            </>
          ) : (
            '创建账户'
          )}
        </button>
      </form>

      {/* Login Link */}
      {onLoginClick && (
        <p className="mt-6 text-center text-sm text-gray-400">
          已有账户？{' '}
          <button
            onClick={onLoginClick}
            className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
          >
            立即登录
          </button>
        </p>
      )}
    </motion.div>
  );
};

export default RegisterForm;
