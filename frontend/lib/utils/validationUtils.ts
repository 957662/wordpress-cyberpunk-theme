/**
 * 验证工具函数
 */

/**
 * 邮箱验证
 */
export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * URL 验证
 */
export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 手机号验证（中国大陆）
 */
export function validatePhone(phone: string): boolean {
  const regex = /^1[3-9]\d{9}$/;
  return regex.test(phone);
}

/**
 * 用户名验证
 *
 * 规则：4-20个字符，只能包含字母、数字、下划线
 */
export function validateUsername(username: string): boolean {
  const regex = /^[a-zA-Z0-9_]{4,20}$/;
  return regex.test(username);
}

/**
 * 密码强度验证
 *
 * 返回强度等级：0-4
 */
export function getPasswordStrength(password: string): number {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  return Math.min(strength, 4);
}

/**
 * 密码强度文本
 */
export function getPasswordStrengthText(strength: number): string {
  const texts = ['很弱', '弱', '中等', '强', '很强'];
  return texts[strength] || '很弱';
}

/**
 * 密码强度颜色
 */
export function getPasswordStrengthColor(strength: number): string {
  const colors = ['#ff3366', '#ff9933', '#ffcc00', '#66cc33', '#00cc66'];
  return colors[strength] || colors[0];
}

/**
 * 身份证号验证（中国大陆）
 */
export function validateIdCard(idCard: string): boolean {
  const regex = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
  if (!regex.test(idCard)) return false;

  // 验证校验位
  const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

  let sum = 0;
  for (let i = 0; i < 17; i++) {
    sum += parseInt(idCard[i]) * weights[i];
  }

  const checkCode = checkCodes[sum % 11];
  return checkCode === idCard[17].toUpperCase();
}

/**
 * IP 地址验证（IPv4）
 */
export function validateIPv4(ip: string): boolean {
  const regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return regex.test(ip);
}

/**
 * IP 地址验证（IPv6）
 */
export function validateIPv6(ip: string): boolean {
  const regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  return regex.test(ip);
}

/**
 * 十六进制颜色验证
 */
export function validateHexColor(color: string): boolean {
  const regex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
  return regex.test(color);
}

/**
 * 日期验证
 */
export function validateDate(date: string): boolean {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
}

/**
 * 日期范围验证
 */
export function validateDateRange(start: string, end: string): boolean {
  const startDate = new Date(start);
  const endDate = new Date(end);

  return (
    validateDate(start) &&
    validateDate(end) &&
    startDate <= endDate
  );
}

/**
 * 年龄验证
 */
export function validateAge(birthDate: string, minAge: number = 0, maxAge: number = 150): boolean {
  const birth = new Date(birthDate);
  const now = new Date();
  const age = now.getFullYear() - birth.getFullYear();

  return age >= minAge && age <= maxAge;
}

/**
 * 文件大小验证
 */
export function validateFileSize(
  file: File,
  maxSize: number = 10 * 1024 * 1024 // 默认 10MB
): boolean {
  return file.size <= maxSize;
}

/**
 * 文件类型验证
 */
export function validateFileType(
  file: File,
  allowedTypes: string[]
): boolean {
  return allowedTypes.some(type => {
    if (type.startsWith('.')) {
      return file.name.toLowerCase().endsWith(type.toLowerCase());
    }
    return file.type === type;
  });
}

/**
 * 图片尺寸验证
 */
export async function validateImageDimensions(
  file: File,
  minWidth?: number,
  maxWidth?: number,
  minHeight?: number,
  maxHeight?: number
): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => {
      const widthValid =
        (!minWidth || img.width >= minWidth) &&
        (!maxWidth || img.width <= maxWidth);
      const heightValid =
        (!minHeight || img.height >= minHeight) &&
        (!maxHeight || img.height <= maxHeight);

      resolve(widthValid && heightValid);
    };

    img.onerror = () => resolve(false);

    img.src = URL.createObjectURL(file);
  });
}

/**
 * 表单验证规则
 */
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
  message?: string;
}

/**
 * 验证单个字段
 */
export function validateField(
  value: any,
  rules: ValidationRule
): string | null {
  // 必填验证
  if (rules.required && (!value || value.toString().trim() === '')) {
    return rules.message || '此字段为必填项';
  }

  // 如果没有值且非必填，跳过其他验证
  if (!value) {
    return null;
  }

  const strValue = value.toString();

  // 最小长度
  if (rules.minLength && strValue.length < rules.minLength) {
    return rules.message || `最小长度为 ${rules.minLength} 个字符`;
  }

  // 最大长度
  if (rules.maxLength && strValue.length > rules.maxLength) {
    return rules.message || `最大长度为 ${rules.maxLength} 个字符`;
  }

  // 正则验证
  if (rules.pattern && !rules.pattern.test(strValue)) {
    return rules.message || '格式不正确';
  }

  // 自定义验证
  if (rules.custom) {
    const result = rules.custom(value);
    if (result !== true) {
      return typeof result === 'string' ? result : (rules.message || '验证失败');
    }
  }

  return null;
}

/**
 * 验证表单
 */
export function validateForm(
  data: Record<string, any>,
  rules: Record<string, ValidationRule>
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const [field, rule] of Object.entries(rules)) {
    const error = validateField(data[field], rule);
    if (error) {
      errors[field] = error;
    }
  }

  return errors;
}

/**
 * 常用验证规则
 */
export const commonRules = {
  required: { required: true, message: '此字段为必填项' },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: '请输入有效的邮箱地址',
  },
  url: {
    custom: (value: string) => {
      try {
        new URL(value);
        return true;
      } catch {
        return '请输入有效的 URL';
      }
    },
  },
  phone: {
    pattern: /^1[3-9]\d{9}$/,
    message: '请输入有效的手机号',
  },
  username: {
    pattern: /^[a-zA-Z0-9_]{4,20}$/,
    message: '用户名为4-20个字符，只能包含字母、数字、下划线',
  },
  password: {
    minLength: 8,
    message: '密码至少8个字符',
  },
};
