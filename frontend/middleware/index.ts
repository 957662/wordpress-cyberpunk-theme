/**
 * CyberPress Platform - 中间件导出
 * ============================================================================
 * 版本: 1.0.0
 * 日期: 2026-03-03
 * ============================================================================
 */

export { default as authMiddleware } from './auth-middleware';
export {
  default as rbacMiddleware,
  useRBAC,
  PermissionGate,
  RoleGate,
  withPermission,
  withRole,
  PERMISSIONS,
  ROLES,
  RESOURCES,
} from './rbac-middleware';

// 重新导出类型
export type { UserRole, Permission, RolePermissions } from './rbac-middleware';
