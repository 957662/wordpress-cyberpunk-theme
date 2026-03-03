'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

export interface GuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiredRoles?: string[];
  requiredPermissions?: string[];
  requireAuth?: boolean;
  redirectTo?: string;
  loadingComponent?: React.ReactNode;
}

/**
 * Authentication and Authorization Guard Component
 * Protects routes and components based on auth status and permissions
 */
export const Guard: React.FC<GuardProps> = ({
  children,
  fallback,
  requiredRoles = [],
  requiredPermissions = [],
  requireAuth = true,
  redirectTo = '/login',
  loadingComponent
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, checkPermission } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check authentication
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        // Save redirect URL
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('redirect_url', pathname);
        }
        router.push(redirectTo);
        return;
      }

      // Check roles
      if (requiredRoles.length > 0 && user) {
        const hasRole = requiredRoles.some(role => user.roles?.includes(role));
        if (!hasRole) {
          router.push('/unauthorized');
          return;
        }
      }

      // Check permissions
      if (requiredPermissions.length > 0) {
        const hasPermission = requiredPermissions.every(permission =>
          checkPermission(permission)
        );
        if (!hasPermission) {
          router.push('/unauthorized');
          return;
        }
      }

      setIsChecking(false);
    }
  }, [
    isLoading,
    isAuthenticated,
    user,
    requireAuth,
    requiredRoles,
    requiredPermissions,
    redirectTo,
    pathname,
    router,
    checkPermission
  ]);

  // Show loading while checking
  if (isLoading || isChecking) {
    return (
      loadingComponent || (
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="relative">
              <motion.div
                className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute inset-0 w-16 h-16 border-4 border-purple-500 border-b-transparent rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
            </div>
            <p className="text-gray-400">Verifying access...</p>
          </motion.div>
        </div>
      )
    );
  }

  // Show fallback if not authorized
  if (requireAuth && !isAuthenticated) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            className="flex flex-col items-center gap-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="p-4 rounded-full bg-red-500/10">
              <Lock className="w-12 h-12 text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">
              Authentication Required
            </h2>
            <p className="text-gray-400 max-w-md">
              You need to be logged in to access this resource.
            </p>
          </motion.div>
        </div>
      )
    );
  }

  // Show fallback if insufficient permissions
  if (requiredRoles.length > 0 || requiredPermissions.length > 0) {
    const hasRole = requiredRoles.some(role => user?.roles?.includes(role));
    const hasPermission = requiredPermissions.every(permission =>
      checkPermission(permission)
    );

    if (!hasRole || !hasPermission) {
      return (
        fallback || (
          <div className="flex items-center justify-center min-h-screen">
            <motion.div
              className="flex flex-col items-center gap-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="p-4 rounded-full bg-yellow-500/10">
                <Shield className="w-12 h-12 text-yellow-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">
                Access Denied
              </h2>
              <p className="text-gray-400 max-w-md">
                You don't have the necessary permissions to access this resource.
              </p>
            </motion.div>
          </div>
        )
      );
    }
  }

  // Render children if authorized
  return <>{children}</>;
};

/**
 * Higher-order component version of Guard
 */
export const withGuard = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  guardProps: Omit<GuardProps, 'children'>
) => {
  return (props: P) => (
    <Guard {...guardProps}>
      <WrappedComponent {...props} />
    </Guard>
  );
};

/**
 * Hook for programmatic guard checks
 */
export const useGuard = () => {
  const { isAuthenticated, user, checkPermission } = useAuth();

  const hasRole = (roles: string[]): boolean => {
    if (!isAuthenticated || !user) return false;
    return roles.some(role => user.roles?.includes(role));
  };

  const hasPermission = (permissions: string[]): boolean => {
    if (!isAuthenticated) return false;
    return permissions.every(permission => checkPermission(permission));
  };

  const hasAnyRole = (roles: string[]): boolean => {
    if (!isAuthenticated || !user) return false;
    return roles.some(role => user.roles?.includes(role));
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!isAuthenticated) return false;
    return permissions.some(permission => checkPermission(permission));
  };

  return {
    isAuthenticated,
    user,
    hasRole,
    hasPermission,
    hasAnyRole,
    hasAnyPermission,
    checkPermission
  };
};

export default Guard;
