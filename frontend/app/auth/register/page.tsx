'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { CyberCard } from '@/components/ui/CyberCard';
import { Loader, Eye, EyeOff, UserPlus, Mail, Lock, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const registerSchema = z
  .object({
    name: z.string().min(2, '用户名至少2个字符'),
    email: z.string().email('请输入有效的邮箱地址'),
    password: z.string().min(8, '密码至少8个字符'),
    confirmPassword: z.string(),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: '请接受服务条款' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '密码不匹配',
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register: registerUser } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setIsLoading(true);
      setError(null);

      // 调用注册 API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '注册失败');
      }

      // 自动登录
      registerUser(result.user, result.token);

      // 跳转到首页
      router.push('/');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '注册失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-dark relative overflow-hidden py-12">
      {/* 背景动画 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyber-purple rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyber-cyan rounded-full filter blur-3xl animate-pulse delay-1000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyber-purple to-cyber-pink rounded-2xl mb-4 shadow-lg shadow-cyber-purple/50">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">创建账号</h1>
          <p className="text-gray-400">加入 CyberPress Platform</p>
        </motion.div>

        <CyberCard className="p-8">
          {/* 错误提示 */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Alert type="error" message={error} />
            </motion.div>
          )}

          {/* 注册表单 */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* 用户名 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                用户名
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  {...register('name')}
                  type="text"
                  placeholder="johndoe"
                  className="pl-10"
                  error={errors.name?.message}
                />
              </div>
            </div>

            {/* 邮箱 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                邮箱地址
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  {...register('email')}
                  type="email"
                  placeholder="your@email.com"
                  className="pl-10"
                  error={errors.email?.message}
                />
              </div>
            </div>

            {/* 密码 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pr-10 pl-10"
                  error={errors.password?.message}
                  onChange={(e) => {
                    const strength = passwordStrength(e.target.value);
                    // 可以在这里更新密码强度指示器
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {/* 密码强度指示器 */}
              <div className="mt-2 flex gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded ${
                      passwordStrength(
                        (document.querySelector('input[name="password"]') as HTMLInputElement)?.value || ''
                      ) >= level
                        ? 'bg-cyber-cyan'
                        : 'bg-gray-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* 确认密码 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                确认密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pr-10 pl-10"
                  error={errors.confirmPassword?.message}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* 服务条款 */}
            <div className="flex items-start">
              <input
                type="checkbox"
                {...register('acceptTerms')}
                className="w-4 h-4 mt-1 rounded border-gray-600 text-cyber-cyan focus:ring-cyber-cyan bg-gray-800"
              />
              <label className="ml-2 text-sm text-gray-300">
                我已阅读并同意{' '}
                <Link href="/terms" className="text-cyber-cyan hover:text-cyber-purple">
                  服务条款
                </Link>
                {' '}和{' '}
                <Link href="/privacy" className="text-cyber-cyan hover:text-cyber-purple">
                  隐私政策
                </Link>
              </label>
            </div>
            {errors.acceptTerms && (
              <p className="text-sm text-red-500 -mt-2">{errors.acceptTerms.message}</p>
            )}

            {/* 注册按钮 */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyber-purple to-cyber-pink hover:from-cyber-pink hover:to-cyber-purple text-white font-medium py-3 rounded-lg shadow-lg shadow-cyber-purple/30"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  注册中...
                </span>
              ) : (
                '创建账号'
              )}
            </Button>
          </form>

          {/* 分割线 */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">或</span>
            </div>
          </div>

          {/* 登录链接 */}
          <p className="text-center text-gray-400">
            已有账号？{' '}
            <Link
              href="/auth/login"
              className="text-cyber-cyan hover:text-cyber-purple font-medium transition-colors"
            >
              立即登录
            </Link>
          </p>
        </CyberCard>

        {/* 返回首页 */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            ← 返回首页
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
