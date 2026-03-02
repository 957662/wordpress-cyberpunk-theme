/**
 * 数据验证工具
 */

/**
 * 验证邮箱格式
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 验证URL格式
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
 * 验证密码强度（至少8位，包含字母和数字）
 */
export function isStrongPassword(password: string): boolean {
  if (password.length < 8) return false;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return hasLetter && hasNumber;
}

/**
 * 验证手机号（中国大陆）
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
}

/**
 * 验证身份证号（中国大陆）
 */
export function isValidIdCard(idCard: string): boolean {
  const idCardRegex = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
  return idCardRegex.test(idCard);
}

/**
 * 验证IP地址（IPv4）
 */
export function isValidIPv4(ip: string): boolean {
  const ipRegex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipRegex.test(ip);
}

/**
 * 验证十六进制颜色代码
 */
export function isValidHexColor(color: string): boolean {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(color);
}

/**
 * 验证 Slug（URL友好的标识符）
 */
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

/**
 * 表单验证规则集合
 */
export const validationRules = {
  required: (value: any) => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'string') return value.trim().length > 0;
    return value !== null && value !== undefined;
  },

  minLength: (value: string, min: number) => value.length >= min,

  maxLength: (value: string, max: number) => value.length <= max,

  pattern: (value: string, pattern: RegExp) => pattern.test(value),

  range: (value: number, min: number, max: number) => value >= min && value <= max,

  email: (value: string) => isValidEmail(value),

  url: (value: string) => isValidUrl(value),

  username: (value: string) => isValidUsername(value),

  password: (value: string) => isStrongPassword(value),

  phone: (value: string) => isValidPhone(value),
};

/**
 * 表单验证错误消息
 */
export const validationMessages = {
  required: '此字段为必填项',
  minLength: (min: number) => `最少需要 ${min} 个字符`,
  maxLength: (max: number) => `最多允许 ${max} 个字符`,
  invalidEmail: '请输入有效的邮箱地址',
  invalidUrl: '请输入有效的URL',
  invalidUsername: '用户名只能包含字母、数字和下划线，长度3-20字符',
  weakPassword: '密码至少8位，且包含字母和数字',
  invalidPhone: '请输入有效的手机号码',
  range: (min: number, max: number) => `值必须在 ${min} 到 ${max} 之间`,
};

/**
 * 验证表单字段
 */
export function validateField(
  value: any,
  rules: Array<{
    type: keyof typeof validationRules;
    value?: any;
    message?: string;
  }>
): { valid: boolean; error?: string } {
  for (const rule of rules) {
    const validator = validationRules[rule.type];

    let isValid = false;
    switch (rule.type) {
      case 'required':
        isValid = validator(value);
        break;
      case 'minLength':
        isValid = validator(value, rule.value);
        break;
      case 'maxLength':
        isValid = validator(value, rule.value);
        break;
      case 'pattern':
        isValid = validator(value, rule.value);
        break;
      case 'range':
        isValid = validator(value, rule.value[0], rule.value[1]);
        break;
      default:
        if (rule.type in validationRules) {
          isValid = validator(value);
        }
    }

    if (!isValid) {
      return {
        valid: false,
        error: rule.message || '验证失败',
      };
    }
  }

  return { valid: true };
}

/**
 * 清理和规范化用户输入
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // 移除script标签
    .replace(/<[^>]*>/g, ''); // 移除所有HTML标签
}

/**
 * 转义HTML特殊字符
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
