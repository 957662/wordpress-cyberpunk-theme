// 表单验证规则和辅助函数

/**
 * 验证邮箱地址
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
 * 验证用户名（字母、数字、下划线，4-20个字符）
 */
export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/;
  return usernameRegex.test(username);
}

/**
 * 验证密码强度
 * 至少8个字符，包含大小写字母、数字
 */
export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  if (password.length < 8) return 'weak';

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const score = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

  if (score >= 3) return 'strong';
  if (score >= 2) return 'medium';
  return 'weak';
}

/**
 * 验证 slug 格式
 */
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9-]+$/;
  return slugRegex.test(slug);
}

/**
 * 生成 slug
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
 * 验证手机号（中国）
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
}

/**
 * 验证身份证号（中国）
 */
export function isValidIdCard(idCard: string): boolean {
  const idCardRegex = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
  return idCardRegex.test(idCard);
}

/**
 * 验证是否为数字
 */
export function isNumber(value: any): boolean {
  return !isNaN(value) && !isNaN(parseFloat(value));
}

/**
 * 验证整数范围
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * 验证字符串长度
 */
export function isValidLength(str: string, min: number, max: number): boolean {
  return str.length >= min && str.length <= max;
}

/**
 * 验证必填字段
 */
export function isRequired(value: any): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

/**
 * 验证确认密码是否匹配
 */
export function doPasswordsMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword;
}

/**
 * 验证文件类型
 */
export function isValidFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

/**
 * 验证文件大小
 */
export function isValidFileSize(file: File, maxSizeInMB: number): boolean {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
}

/**
 * 获取密码强度描述
 */
export function getPasswordStrengthLabel(strength: string): string {
  const labels = {
    weak: '弱',
    medium: '中',
    strong: '强',
  };
  return labels[strength as keyof typeof labels] || '';
}

/**
 * 获取密码强度颜色
 */
export function getPasswordStrengthColor(strength: string): string {
  const colors = {
    weak: 'text-red-400',
    medium: 'text-yellow-400',
    strong: 'text-green-400',
  };
  return colors[strength as keyof typeof colors] || '';
}

/**
 * 验证表单对象
 */
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateForm(
  data: Record<string, any>,
  rules: Record<string, (value: any) => boolean | string>
): ValidationResult {
  const errors: Record<string, string> = {};

  for (const [field, validator] of Object.entries(rules)) {
    const result = validator(data[field]);
    if (result !== true) {
      errors[field] = typeof result === 'string' ? result : `${field} 验证失败`;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * 常用验证规则
 */
export const commonRules = {
  email: (value: string) => isValidEmail(value) || '请输入有效的邮箱地址',
  required: (value: any) => isRequired(value) || '此字段为必填项',
  username: (value: string) => isValidUsername(value) || '用户名必须为4-20个字母、数字或下划线',
  password: (value: string) =>
    value.length >= 8 || '密码至少需要8个字符',
  phone: (value: string) => isValidPhone(value) || '请输入有效的手机号',
  url: (value: string) => isValidUrl(value) || '请输入有效的 URL',
  slug: (value: string) => isValidSlug(value) || '只能包含小写字母、数字和连字符',
};
