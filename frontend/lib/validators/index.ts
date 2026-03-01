/**
 * 验证器集合
 * 常用的数据验证函数
 */

/**
 * 验证邮箱
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
 * 验证密码强度
 */
export function getPasswordStrength(password: string): {
  strength: 'weak' | 'medium' | 'strong';
  score: number;
} {
  let score = 0;

  // 长度检查
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;

  // 包含小写字母
  if (/[a-z]/.test(password)) score++;

  // 包含大写字母
  if (/[A-Z]/.test(password)) score++;

  // 包含数字
  if (/\d/.test(password)) score++;

  // 包含特殊字符
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (score >= 5) strength = 'strong';
  else if (score >= 3) strength = 'medium';

  return { strength, score };
}

/**
 * 验证用户名
 */
export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

/**
 * 验证邮政编码（中国）
 */
export function isValidPostalCode(postalCode: string): boolean {
  const postalCodeRegex = /^[1-9]\d{5}$/;
  return postalCodeRegex.test(postalCode);
}

/**
 * 验证 IP 地址
 */
export function isValidIp(ip: string): boolean {
  const ipRegex = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
  return ipRegex.test(ip);
}

/**
 * 验证 MAC 地址
 */
export function isValidMac(mac: string): boolean {
  const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
  return macRegex.test(mac);
}

/**
 * 验证十六进制颜色
 */
export function isValidHexColor(color: string): boolean {
  const hexRegex = /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
  return hexRegex.test(color);
}

/**
 * 验证 UUID
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * 验证 JSON 字符串
 */
export function isValidJSON(json: string): boolean {
  try {
    JSON.parse(json);
    return true;
  } catch {
    return false;
  }
}

/**
 * 验证Base64 字符串
 */
export function isValidBase64(base64: string): boolean {
  const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
  return base64Regex.test(base64);
}

/**
 * 验证信用卡号（Luhn 算法）
 */
export function isValidCreditCard(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * 验证日期格式
 */
export function isValidDate(date: string, format: 'YYYY-MM-DD' | 'DD/MM/YYYY' | 'MM/DD/YYYY' = 'YYYY-MM-DD'): boolean {
  const dateRegex = {
    'YYYY-MM-DD': /^\d{4}-\d{2}-\d{2}$/,
    'DD/MM/YYYY': /^\d{2}\/\d{2}\/\d{4}$/,
    'MM/DD/YYYY': /^\d{2}\/\d{2}\/\d{4}$/,
  };

  if (!dateRegex[format].test(date)) return false;

  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
}

/**
 * 验证年龄
 */
export function isValidAge(birthDate: string | Date, minAge: number = 0, maxAge: number = 150): boolean {
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  const now = new Date();
  const age = now.getFullYear() - birth.getFullYear();

  return age >= minAge && age <= maxAge;
}

/**
 * 验证文件类型
 */
export function isValidFileType(fileName: string, allowedTypes: string[]): boolean {
  const extension = fileName.split('.').pop()?.toLowerCase();
  return extension ? allowedTypes.includes(`.${extension}`) : false;
}

/**
 * 验证文件大小
 */
export function isValidFileSize(fileSize: number, maxSizeInMB: number): boolean {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return fileSize <= maxSizeInBytes;
}

/**
 * 验证数字范围
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * 验证字符串长度
 */
export function isValidLength(value: string, min: number, max: number): boolean {
  return value.length >= min && value.length <= max;
}

/**
 * 验证是否为空
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * 验证是否为数字
 */
export function isNumber(value: any): boolean {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * 验证是否为整数
 */
export function isInteger(value: any): boolean {
  return Number.isInteger(value);
}

/**
 * 验证是否为正数
 */
export function isPositive(value: number): boolean {
  return value > 0;
}

/**
 * 验证是否为负数
 */
export function isNegative(value: number): boolean {
  return value < 0;
}

/**
 * 验证是否为偶数
 */
export function isEven(value: number): boolean {
  return value % 2 === 0;
}

/**
 * 验证是否为奇数
 */
export function isOdd(value: number): boolean {
  return value % 2 !== 0;
}

/**
 * 组合验证器
 */
export function combineValidators(...validators: ((value: any) => boolean)[]) {
  return (value: any) => validators.every((validator) => validator(value));
}

/**
 * 创建验证函数
 */
export function createValidator(
  validator: (value: any) => boolean,
  errorMessage: string
) {
  return {
    validate: validator,
    message: errorMessage,
  };
}
