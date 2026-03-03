/**
 * CyberPress Platform - RBAC 中间件
 * ============================================================================
 * 功能: 基于角色的访问控制
 * 版本: 1.0.0
 * 日期: 2026-03-03
 * ============================================================================
 */

import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/services/auth-service';

// ============================================================================
// 类型定义
// ============================================================================

export type UserRole = 'admin' | 'editor' | 'author' | 'subscriber';

export type Permission =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'publish'
  | 'moderate'
  | 'admin';

export interface RolePermissions {
  role: UserRole;
  permissions: Permission[];
  description: string;
}

// ============================================================================
// 角色权限配置
// ============================================================================

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: ['*'], // 管理员拥有所有权限
  editor: ['create', 'read', 'update', 'publish', 'moderate'],
  author: ['create', 'read', 'update'],
  subscriber: ['read'],
};

const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  admin: '系统管理员 - 拥有所有权限',
  editor: '编辑 - 可以创建、编辑、发布和审核内容',
  author: '作者 - 可以创建和编辑自己的内容',
  subscriber: '订阅者 - 只能阅读内容',
};

// 资源权限矩阵
const RESOURCE_PERMISSIONS: Record<string, Record<UserRole, Permission[]>> = {
  posts: {
    admin: ['*'],
    editor: ['create', 'read', 'update', 'delete', 'publish', 'moderate'],
    author: ['create', 'read', 'update'],
    subscriber: ['read'],
  },
  comments: {
    admin: ['*'],
    editor: ['read', 'moderate', 'delete'],
    author: ['read', 'create'],
    subscriber: ['read', 'create'],
  },
  users: {
    admin: ['*'],
    editor: ['read'],
    author: ['read'],
    subscriber: ['read'],
  },
  media: {
    admin: ['*'],
    editor: ['create', 'read', 'update', 'delete'],
    author: ['create', 'read', 'update'],
    subscriber: ['read'],
  },
  settings: {
    admin: ['*'],
    editor: ['read'],
    author: [],
    subscriber: [],
  },
};

// ============================================================================
// 权限检查函数
// ============================================================================

/**
 * 检查角色是否拥有指定权限
 */
export function roleHasPermission(role: UserRole, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  return permissions.includes('*') || permissions.includes(permission);
}

/**
 * 检查角色是否拥有任一指定权限
 */
export function roleHasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some(permission => roleHasPermission(role, permission));
}

/**
 * 检查角色是否拥有所有指定权限
 */
export function roleHasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every(permission => roleHasPermission(role, permission));
}

/**
 * 检查用户是否可以访问指定资源的指定操作
 */
export function canAccessResource(
  userRole: UserRole,
  resource: string,
  permission: Permission
): boolean {
  const resourcePerms = RESOURCE_PERMISSIONS[resource];
  if (!resourcePerms) return false;

  const rolePerms = resourcePerms[userRole];
  if (!rolePerms) return false;

  return rolePerms.includes('*') || rolePerms.includes(permission);
}

/**
 * 检查用户是否为资源的所有者
 */
export function isResourceOwner(
  userId: string,
  resourceOwnerId: string,
  userRole: UserRole
): boolean {
  // 管理员和编辑可以访问所有资源
  if (userRole === 'admin' || userRole === 'editor') {
    return true;
  }

  // 作者只能访问自己的资源
  return userId === resourceOwnerId;
}

// ============================================================================
// React Hook
// ============================================================================

import { useEffect, useState, useCallback } from 'react';

export function useRBAC() {
  const user = authService.getCurrentUser();
  const [userRole, setUserRole] = useState<UserRole | null>(user?.role || null);

  useEffect(() => {
    if (user?.role) {
      setUserRole(user.role);
    }
  }, [user]);

  /**
   * 检查当前用户是否有指定权限
   */
  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      if (!userRole) return false;
      return roleHasPermission(userRole, permission);
    },
    [userRole]
  );

  /**
   * 检查当前用户是否有任一指定权限
   */
  const hasAnyPermission = useCallback(
    (permissions: Permission[]): boolean => {
      if (!userRole) return false;
      return roleHasAnyPermission(userRole, permissions);
    },
    [userRole]
  );

  /**
   * 检查当前用户是否有所有指定权限
   */
  const hasAllPermissions = useCallback(
    (permissions: Permission[]): boolean => {
      if (!userRole) return false;
      return roleHasAllPermissions(userRole, permissions);
    },
    [userRole]
  );

  /**
   * 检查当前用户是否可以访问指定资源的指定操作
   */
  const canAccess = useCallback(
    (resource: string, permission: Permission): boolean => {
      if (!userRole) return false;
      return canAccessResource(userRole, resource, permission);
    },
    [userRole]
  );

  /**
   * 检查当前用户是否为资源的所有者
   */
  const isOwner = useCallback(
    (resourceOwnerId: string): boolean => {
      if (!user) return false;
      return isResourceOwner(user.id, resourceOwnerId, userRole!);
    },
    [user, userRole]
  );

  /**
   * 获取角色的所有权限
   */
  const getRolePermissions = useCallback((): Permission[] => {
    if (!userRole) return [];
    return ROLE_PERMISSIONS[userRole];
  }, [userRole]);

  /**
   * 获取角色描述
   */
  const getRoleDescription = useCallback((): string => {
    if (!userRole) return '';
    return ROLE_DESCRIPTIONS[userRole];
  }, [userRole]);

  return {
    userRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccess,
    isOwner,
    getRolePermissions,
    getRoleDescription,
  };
}

// ============================================================================
// 高阶组件
// ============================================================================

import { ReactNode, ComponentType } from 'react';

interface PermissionGateProps {
  children: ReactNode;
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  resource?: string;
  resourceOwnerId?: string;
  fallback?: ReactNode;
}

/**
 * 权限门组件 - 根据权限显示内容
 */
export function PermissionGate({
  children,
  permission,
  permissions,
  requireAll = false,
  resource,
  resourceOwnerId,
  fallback = null,
}: PermissionGateProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions, canAccess, isOwner } =
    useRBAC();

  let hasAccess = true;

  // 检查单个权限
  if (permission) {
    hasAccess = hasPermission(permission);
  }

  // 检查多个权限
  if (permissions && permissions.length > 0) {
    hasAccess = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  }

  // 检查资源权限
  if (hasAccess && resource && permission) {
    hasAccess = canAccess(resource, permission);
  }

  // 检查资源所有者
  if (hasAccess && resourceOwnerId) {
    hasAccess = isOwner(resourceOwnerId);
  }

  return <>{hasAccess ? children : fallback}</>;
}

/**
 * 角色门组件 - 根据角色显示内容
 */
interface RoleGateProps {
  children: ReactNode;
  roles: UserRole[];
  fallback?: ReactNode;
}

export function RoleGate({ children, roles, fallback = null }: RoleGateProps) {
  const user = authService.getCurrentUser();
  const hasAccess = user ? roles.includes(user.role) : false;

  return <>{hasAccess ? children : fallback}</>;
}

/**
 * 高阶组件 - 包装需要权限的组件
 */
export function withPermission<P extends object>(
  WrappedComponent: ComponentType<P>,
  requiredPermission: Permission
) {
  return function PermissionProtectedComponent(props: P) {
    const { hasPermission } = useRBAC();

    if (!hasPermission(requiredPermission)) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}

/**
 * 高阶组件 - 包装需要角色的组件
 */
export function withRole<P extends object>(
  WrappedComponent: ComponentType<P>,
  requiredRoles: UserRole[]
) {
  return function RoleProtectedComponent(props: P) {
    const user = authService.getCurrentUser();

    if (!user || !requiredRoles.includes(user.role)) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}

// ============================================================================
// 服务端辅助函数
// ============================================================================

/**
 * 服务端权限检查
 */
export function checkServerPermission(
  userRole: UserRole,
  permission: Permission
): boolean {
  return roleHasPermission(userRole, permission);
}

/**
 * 服务端资源访问检查
 */
export function checkServerResourceAccess(
  userRole: UserRole,
  resource: string,
  permission: Permission
): boolean {
  return canAccessResource(userRole, resource, permission);
}

// ============================================================================
// 权限常量导出
// ============================================================================

export const PERMISSIONS = {
  CREATE: 'create' as Permission,
  READ: 'read' as Permission,
  UPDATE: 'update' as Permission,
  DELETE: 'delete' as Permission,
  PUBLISH: 'publish' as Permission,
  MODERATE: 'moderate' as Permission,
  ADMIN: 'admin' as Permission,
};

export const ROLES = {
  ADMIN: 'admin' as UserRole,
  EDITOR: 'editor' as UserRole,
  AUTHOR: 'author' as UserRole,
  SUBSCRIBER: 'subscriber' as UserRole,
};

export const RESOURCES = {
  POSTS: 'posts',
  COMMENTS: 'comments',
  USERS: 'users',
  MEDIA: 'media',
  SETTINGS: 'settings',
};

// ============================================================================
// 默认导出
// ============================================================================

export default useRBAC;
