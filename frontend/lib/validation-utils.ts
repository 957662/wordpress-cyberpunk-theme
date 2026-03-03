/**
 * 验证工具函数
 */

/**
 * 验证规则接口
 */
export interface ValidationRule {
  validate: (value: any) => boolean;
  message: string;
}

/**
 * 验证结果接口
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * 验证邮箱地址
 *
 * @param email - 邮箱地址
 * @returns 是否有效
 *
 * @example
 * ```ts
 * isEmail('test@example.com') // true
 * isEmail('invalid') // false
 * ```
 */
export function isEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 验证手机号（中国大陆）
 *
 * @param phone - 手机号
 * @returns 是否有效
 *
 * @example
 * ```ts
 * isPhone('13800138000') // true
 * isPhone('12345') // false
 * ```
 */
export function isPhone(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
}

/**
 * 验证身份证号（中国大陆）
 *
 * @param id - 身份证号
 * @returns 是否有效
 *
 * @example
 * ```ts
 * isIdCard('110101199001011234') // true
 * isIdCard('12345') // false
 * ```
 */
export function isIdCard(id: string): boolean {
  // 18位身份证号
  const idCardRegex = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
  if (!idCardRegex.test(id)) return false;

  // 验证校验码
  const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

  let sum = 0;
  for (let i = 0; i < 17; i++) {
    sum += parseInt(id[i]) * weights[i];
  }

  const checkCode = checkCodes[sum % 11];
  return checkCode === id[17].toUpperCase();
}

/**
 * 验证 URL
 *
 * @param url - URL 字符串
 * @returns 是否有效
 *
 * @example
 * ```ts
 * isUrl('https://example.com') // true
 * isUrl('invalid') // false
 * ```
 */
export function isUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 验证 IP 地址
 *
 * @param ip - IP 地址
 * @returns 是否有效
 *
 * @example
 * ```ts
 * isIP('192.168.1.1') // true
 * isIP('256.0.0.1') // false
 * ```
 */
export function isIP(ip: string): boolean {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipv4Regex.test(ip)) return false;

  const parts = ip.split('.');
  return parts.every(part => {
    const num = parseInt(part);
    return num >= 0 && num <= 255;
  });
}

/**
 * 验证 MAC 地址
 *
 * @param mac - MAC 地址
 * @returns 是否有效
 */
export function isMAC(mac: string): boolean {
  const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
  return macRegex.test(mac);
}

/**
 * 验证密码强度
 *
 * @param password - 密码
 * @returns 强度等级 (0-4)
 *
 * @example
 * ```ts
 * getPasswordStrength('123') // 0 (弱)
 * getPasswordStrength('abc123') // 1 (一般)
 * getPasswordStrength('Abc123!@') // 4 (强)
 * ```
 */
export function getPasswordStrength(password: string): number {
  let strength = 0;

  // 长度检查
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;

  // 包含小写字母
  if (/[a-z]/.test(password)) strength++;

  // 包含大写字母
  if (/[A-Z]/.test(password)) strength++;

  // 包含数字
  if (/\d/.test(password)) strength++;

  // 包含特殊字符
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

  return Math.min(strength, 4);
}

/**
 * 验证密码是否符合要求
 *
 * @param password - 密码
 * @param options - 验证选项
 * @returns 验证结果
 */
export function validatePassword(
  password: string,
  options: {
    minLength?: number;
    requireLowercase?: boolean;
    requireUppercase?: boolean;
    requireNumber?: boolean;
    requireSpecialChar?: boolean;
  } = {}
): ValidationResult {
  const {
    minLength = 8,
    requireLowercase = true,
    requireUppercase = true,
    requireNumber = true,
    requireSpecialChar = true,
  } = options;

  const errors: string[] = [];

  if (password.length < minLength) {
    errors.push(`密码长度至少 ${minLength} 位`);
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push('密码必须包含小写字母');
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('密码必须包含大写字母');
  }

  if (requireNumber && !/\d/.test(password)) {
    errors.push('密码必须包含数字');
  }

  if (requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('密码必须包含特殊字符');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 验证用户名
 *
 * @param username - 用户名
 * @returns 是否有效
 */
export function isUsername(username: string): boolean {
  // 用户名规则：4-20位，字母开头，只包含字母、数字、下划线
  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{3,19}$/;
  return usernameRegex.test(username);
}

/**
 * 验证十六进制颜色
 *
 * @param color - 颜色值
 * @returns 是否有效
 */
export function isHexColor(color: string): boolean {
  const hexRegex = /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
  return hexRegex.test(color);
}

/**
 * 验证 RGB 颜色
 *
 * @param color - 颜色值
 * @returns 是否有效
 */
export function isRGBColor(color: string): boolean {
  const rgbRegex = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
  const match = color.match(rgbRegex);
  if (!match) return false;

  const [, r, g, b] = match;
  return (
    parseInt(r) >= 0 &&
    parseInt(r) <= 255 &&
    parseInt(g) >= 0 &&
    parseInt(g) <= 255 &&
    parseInt(b) >= 0 &&
    parseInt(b) <= 255
  );
}

/**
 * 验证日期格式
 *
 * @param date - 日期字符串
 * @returns 是否有效
 */
export function isDate(date: string): boolean {
  const d = new Date(date);
  return !isNaN(d.getTime());
}

/**
 * 验证年龄
 *
 * @param age - 年龄
 * @param min - 最小年龄
 * @param max - 最大年龄
 * @returns 是否有效
 */
export function isAge(age: number, min: number = 0, max: number = 150): boolean {
  return age >= min && age <= max;
}

/**
 * 验证邮政编码（中国大陆）
 *
 * @param code - 邮政编码
 * @returns 是否有效
 */
export function isPostalCode(code: string): boolean {
  const postalCodeRegex = /^[1-9]\d{5}$/;
  return postalCodeRegex.test(code);
}

/**
 * 验证银行卡号
 *
 * @param cardNumber - 银行卡号
 * @returns 是否有效
 */
export function isBankCard(cardNumber: string): boolean {
  // 移除空格
  const cleaned = cardNumber.replace(/\s/g, '');

  // 银行卡号通常是12-19位
  if (!/^\d{12,19}$/.test(cleaned)) return false;

  // 使用 Luhn 算法验证
  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * 验证数字范围
 *
 * @param value - 值
 * @param min - 最小值
 * @param max - 最大值
 * @returns 是否有效
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * 验证字符串长度
 *
 * @param str - 字符串
 * @param min - 最小长度
 * @param max - 最大长度
 * @returns 是否有效
 */
export function isLength(str: string, min: number, max: number): boolean {
  return str.length >= min && str.length <= max;
}

/**
 * 验证是否为空
 *
 * @param value - 值
 * @returns 是否为空
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * 验证对象
 *
 * @param data - 数据对象
 * @param rules - 验证规则
 * @returns 验证结果
 *
 * @example
 * ```ts
 * const result = validateObject(
 *   { email: 'test@example.com', age: 25 },
 *   {
 *     email: { validate: isEmail, message: '邮箱格式不正确' },
 *     age: { validate: (v) => isInRange(v, 18, 65), message: '年龄必须在18-65岁之间' }
 *   }
 * );
 * ```
 */
export function validateObject(
  data: Record<string, any>,
  rules: Record<string, ValidationRule>
): ValidationResult {
  const errors: string[] = [];

  Object.entries(rules).forEach(([field, rule]) => {
    const value = data[field];
    if (!rule.validate(value)) {
      errors.push(`${field}: ${rule.message}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 创建表单验证器
 *
 * @param rules - 验证规则
 * @returns 验证函数
 *
 * @example
 * ```ts
 * const validateForm = createFormValidator({
 *   username: [
 *     { validate: (v) => !isEmpty(v), message: '用户名不能为空' },
 *     { validate: isUsername, message: '用户名格式不正确' }
 *   ],
 *   email: [
 *     { validate: (v) => !isEmpty(v), message: '邮箱不能为空' },
 *     { validate: isEmail, message: '邮箱格式不正确' }
 *   ]
 * });
 *
 * const result = validateForm({ username: 'test', email: 'test@example.com' });
 * ```
 */
export function createFormValidator(
  rules: Record<string, ValidationRule[]>
): (data: Record<string, any>) => ValidationResult {
  return (data: Record<string, any>) => {
    const errors: string[] = [];

    Object.entries(rules).forEach(([field, fieldRules]) => {
      const value = data[field];

      for (const rule of fieldRules) {
        if (!rule.validate(value)) {
          errors.push(`${field}: ${rule.message}`);
          break; // 只显示第一个错误
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  };
}

/**
 * 验证 JSON 字符串
 *
 * @param str - JSON 字符串
 * @returns 是否有效
 */
export function isJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * 验证 Base64 字符串
 *
 * @param str - Base64 字符串
 * @returns 是否有效
 */
export function isBase64(str: string): boolean {
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  return base64Regex.test(str);
}

export default {
  isEmail,
  isPhone,
  isIdCard,
  isUrl,
  isIP,
  isMAC,
  getPasswordStrength,
  validatePassword,
  isUsername,
  isHexColor,
  isRGBColor,
  isDate,
  isAge,
  isPostalCode,
  isBankCard,
  isInRange,
  isLength,
  isEmpty,
  validateObject,
  createFormValidator,
  isJSON,
  isBase64,
};
