/**
 * 受保护路由组件
 * 用于保护需要认证的页面
 */

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, ShieldX } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useProtectedRoute, useAuth } from '@/lib/hooks/useAuth';
import { AuthModal } from './AuthModal';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: string;
  requiredCapability?: string;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requiredRole,
  requiredCapability,
  fallback,
  redirectTo = '/login',
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const { isAuthenticated, hasAccess } = useProtectedRoute(requiredRole);
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    // 模拟认证检查
    const checkAuth = async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // 加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyber-dark">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // 需要认证但未登录
  if (requireAuth && !isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-cyber-dark p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="max-w-md w-full p-8 border-cyber-cyan/20 text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-cyber-cyan/10 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-cyber-cyan" />
            </div>

            <h2 className="text-2xl font-bold font-display text-white mb-3">
              需要登录
            </h2>
            <p className="text-gray-400 mb-6">
              您需要登录才能访问此页面
            </p>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => router.push('/')}
              >
                返回首页
              </Button>
              <Button
                variant="primary"
                onClick={() => setIsAuthModalOpen(true)}
              >
                立即登录
              </Button>
            </div>
          </Card>
        </motion.div>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={() => {
            setIsAuthModalOpen(false);
            router.refresh();
          }}
        />
      </div>
    );
  }

  // 权限不足
  if (requireAuth && isAuthenticated && !hasAccess.hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-cyber-dark p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="max-w-md w-full p-8 border-red-500/20 text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-red-500/10 rounded-full flex items-center justify-center">
              <ShieldX className="w-8 h-8 text-red-400" />
            </div>

            <h2 className="text-2xl font-bold font-display text-white mb-3">
              权限不足
            </h2>
            <p className="text-gray-400 mb-2">
              您没有访问此页面的权限
            </p>
            {requiredRole && (
              <p className="text-sm text-gray-500 mb-6">
                需要角色: {requiredRole}
              </p>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => router.back()}
              >
                返回上一页
              </Button>
              <Button
                variant="primary"
                onClick={() => router.push('/')}
              >
                返回首页
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  // 检查特定能力
  if (requiredCapability && user) {
    const hasCapability = user.capabilities?.[requiredCapability];
    if (!hasCapability) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-cyber-dark p-4">
          <Card className="max-w-md w-full p-8 border-red-500/20 text-center">
            <ShieldX className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">
              权限不足
            </h2>
            <p className="text-gray-400 mb-4">
              您需要 {requiredCapability} 权限才能访问此页面
            </p>
            <Button onClick={() => router.back()}>
              返回上一页
            </Button>
          </Card>
        </div>
      );
    }
  }

  // 通过所有检查，渲染子组件
  return <>{children}</>;
};

/**
 * 服务端渲染的受保护路由包装器
 */
export function withProtectedRoute<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<ProtectedRouteProps, 'children'>
) {
  return function ProtectedComponent(props: P) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

export default ProtectedRoute;
