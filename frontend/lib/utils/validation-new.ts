/**
 * Validation Utilities
 * 验证工具函数
 */

/**
 * 验证邮箱地址
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 验证URL
 */
export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 验证用户名
 */
export function isValidUsername(username: string): boolean {
  if (!username || typeof username !== 'string') return false;

  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

/**
 * 验证密码强度
 */
export function isValidPassword(password: string): {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  errors: string[];
} {
  const errors: string[] = [];

  if (!password || typeof password !== 'string') {
    return { isValid: false, strength: 'weak', errors: ['Password is required'] };
  }

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  // 计算强度
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (errors.length === 0) {
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLong = password.length >= 12;

    if (hasSpecialChar && isLong) {
      strength = 'strong';
    } else {
      strength = 'medium';
    }
  }

  return {
    isValid: errors.length === 0,
    strength,
    errors,
  };
}

/**
 * 验证slug
 */
export function isValidSlug(slug: string): boolean {
  if (!slug || typeof slug !== 'string') return false;

  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

/**
 * 验证字符串长度
 */
export function isValidLength(
  value: string,
  minLength: number = 0,
  maxLength: number = Infinity
): boolean {
  if (typeof value !== 'string') return false;

  return value.length >= minLength && value.length <= maxLength;
}

/**
 * 验证数字范围
 */
export function isValidNumberRange(
  value: number,
  min: number = -Infinity,
  max: number = Infinity
): boolean {
  if (typeof value !== 'number' || isNaN(value)) return false;

  return value >= min && value <= max;
}

/**
 * 验证JSON字符串
 */
export function isValidJSON(jsonString: string): boolean {
  if (!jsonString || typeof jsonString !== 'string') return false;

  try {
    JSON.parse(jsonString);
    return true;
  } catch {
    return false;
  }
}

// 导出所有验证函数
export default {
  isValidEmail,
  isValidUrl,
  isValidUsername,
  isValidPassword,
  isValidSlug,
  isValidLength,
  isValidNumberRange,
  isValidJSON,
};
