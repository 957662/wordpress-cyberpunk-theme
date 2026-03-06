/**
 * 数据验证工具函数
 */

/**
 * 验证电子邮箱地址
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 验证 URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 验证用户名（字母、数字、下划线，3-20字符）
 */
export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

/**
 * 验证密码强度
 */
export function isValidPassword(password: string): {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  issues: string[];
} {
  const issues: string[] = [];
  let strength: 'weak' | 'medium' | 'strong' = 'weak';

  if (password.length < 8) {
    issues.push('密码长度至少8位');
  }

  if (!/[a-z]/.test(password)) {
    issues.push('密码必须包含小写字母');
  }

  if (!/[A-Z]/.test(password)) {
    issues.push('密码必须包含大写字母');
  }

  if (!/\d/.test(password)) {
    issues.push('密码必须包含数字');
  }

  // 计算强度
  const hasLength = password.length >= 8;
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const criteriaMet = [hasLength, hasLowerCase, hasUpperCase, hasNumber, hasSpecial].filter(Boolean).length;

  if (criteriaMet >= 4) {
    strength = 'strong';
  } else if (criteriaMet >= 3) {
    strength = 'medium';
  }

  return {
    isValid: issues.length === 0,
    strength,
    issues,
  };
}

/**
 * 验证是否为空值
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * 清理对象中的空值
 */
export function cleanObject<T extends Record<string, any>>(obj: T): Partial<T> {
  const cleaned: Partial<T> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (!isEmpty(value)) {
      cleaned[key as keyof T] = value;
    }
  }

  return cleaned;
}

export default {
  isValidEmail,
  isValidUrl,
  isValidUsername,
  isValidPassword,
  isEmpty,
  cleanObject,
};
