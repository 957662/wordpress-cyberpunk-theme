/**
 * Form Validations
 * 表单验证工具函数
 */

/**
 * 验证邮箱格式
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 验证密码强度
 */
export function validatePassword(password: string): {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('密码至少需要 8 个字符');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('密码需要包含小写字母');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('密码需要包含大写字母');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('密码需要包含数字');
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('密码需要包含特殊字符');
  }

  const score = 5 - errors.length;

  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (score >= 4) strength = 'strong';
  else if (score >= 2) strength = 'medium';

  return {
    isValid: errors.length === 0,
    strength,
    errors,
  };
}

/**
 * 验证 URL 格式
 */
export function validateURL(url: string): boolean {
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
export function validateUsername(username: string): {
  isValid: boolean;
  error?: string;
} {
  if (username.length < 3) {
    return { isValid: false, error: '用户名至少需要 3 个字符' };
  }

  if (username.length > 20) {
    return { isValid: false, error: '用户名不能超过 20 个字符' };
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { isValid: false, error: '用户名只能包含字母、数字、下划线和连字符' };
  }

  return { isValid: true };
}

/**
 * 验证文章 slug
 */
export function validateSlug(slug: string): {
  isValid: boolean;
  error?: string;
} {
  if (!slug) {
    return { isValid: false, error: 'Slug 不能为空' };
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { isValid: false, error: 'Slug 只能包含小写字母、数字和连字符' };
  }

  if (slug.startsWith('-') || slug.endsWith('-')) {
    return { isValid: false, error: 'Slug 不能以连字符开头或结尾' };
  }

  if (slug.includes('--')) {
    return { isValid: false, error: 'Slug 不能包含连续的连字符' };
  }

  return { isValid: true };
}

/**
 * 生成文章 slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * 验证表单字段
 */
export function validateField(
  value: string,
  rules: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: string) => boolean | string;
  }
): { isValid: boolean; error?: string } {
  // 检查必填
  if (rules.required && !value.trim()) {
    return { isValid: false, error: '此字段为必填项' };
  }

  // 如果不是必填且为空，则通过验证
  if (!value.trim()) {
    return { isValid: true };
  }

  // 检查最小长度
  if (rules.minLength && value.length < rules.minLength) {
    return {
      isValid: false,
      error: `此字段至少需要 ${rules.minLength} 个字符`,
    };
  }

  // 检查最大长度
  if (rules.maxLength && value.length > rules.maxLength) {
    return {
      isValid: false,
      error: `此字段不能超过 ${rules.maxLength} 个字符`,
    };
  }

  // 检查正则表达式
  if (rules.pattern && !rules.pattern.test(value)) {
    return { isValid: false, error: '格式不正确' };
  }

  // 自定义验证
  if (rules.custom) {
    const result = rules.custom(value);
    if (result === true) {
      return { isValid: true };
    }
    if (typeof result === 'string') {
      return { isValid: false, error: result };
    }
    return { isValid: false, error: '验证失败' };
  }

  return { isValid: true };
}
