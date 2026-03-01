/**
 * 验证工具函数集合
 * 提供各种常用的数据验证功能
 */

/**
 * 验证是否为空
 */
export const isEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * 验证邮箱格式
 */
export const isEmail = (email: string): boolean => {
  if (isEmpty(email)) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 验证手机号（中国大陆）
 */
export const isPhoneNumber = (phone: string): boolean => {
  if (isEmpty(phone)) return false;
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
};

/**
 * 验证 URL 格式
 */
export const isUrl = (url: string): boolean => {
  if (isEmpty(url)) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * 验证身份证号（中国大陆）
 */
export const isIdCard = (idCard: string): boolean => {
  if (isEmpty(idCard)) return false;

  // 18位身份证
  if (idCard.length === 18) {
    const regex = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
    if (!regex.test(idCard)) return false;

    // 验证校验码
    const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    let sum = 0;

    for (let i = 0; i < 17; i++) {
      sum += parseInt(idCard[i]) * weights[i];
    }

    const checkCode = checkCodes[sum % 11];
    return checkCode === idCard[17].toUpperCase();
  }

  // 15位身份证
  if (idCard.length === 15) {
    const regex = /^[1-9]\d{5}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}$/;
    return regex.test(idCard);
  }

  return false;
};

/**
 * 验证 IP 地址
 */
export const isIP = (ip: string, version: 'v4' | 'v6' | 'both' = 'both'): boolean => {
  if (isEmpty(ip)) return false;

  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

  if (version === 'v4') return ipv4Regex.test(ip);
  if (version === 'v6') return ipv6Regex.test(ip);
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
};

/**
 * 验证 MAC 地址
 */
export const isMAC = (mac: string): boolean => {
  if (isEmpty(mac)) return false;
  const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
  return macRegex.test(mac);
};

/**
 * 验证十六进制颜色
 */
export const isHexColor = (color: string): boolean => {
  if (isEmpty(color)) return false;
  const hexRegex = /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
  return hexRegex.test(color);
};

/**
 * 验证 RGB/RGBA 颜色
 */
export const isRGBColor = (color: string): boolean => {
  if (isEmpty(color)) return false;
  const rgbRegex = /^rgba?\(\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*(?:,\s*([01]?\d?\d)\s*)?\)$/;
  return rgbRegex.test(color);
};

/**
 * 验证日期格式
 */
export const isDate = (date: string, format?: string): boolean => {
  if (isEmpty(date)) return false;

  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
};

/**
 * 验证是否为有效数字
 */
export const isNumber = (value: unknown): boolean => {
  if (typeof value === 'number') return !isNaN(value) && isFinite(value);
  if (typeof value === 'string') {
    return !isNaN(parseFloat(value)) && isFinite(parseFloat(value));
  }
  return false;
};

/**
 * 验证整数
 */
export const isInteger = (value: unknown): boolean => {
  if (typeof value === 'number') return Number.isInteger(value);
  if (typeof value === 'string') {
    const num = parseFloat(value);
    return !isNaN(num) && Number.isInteger(num);
  }
  return false;
};

/**
 * 验证正数
 */
export const isPositive = (value: unknown): boolean => {
  if (!isNumber(value)) return false;
  return (typeof value === 'number' ? value : parseFloat(value as string)) > 0;
};

/**
 * 验证负数
 */
export const isNegative = (value: unknown): boolean => {
  if (!isNumber(value)) return false;
  return (typeof value === 'number' ? value : parseFloat(value as string)) < 0;
};

/**
 * 验证范围
 */
export const isInRange = (value: unknown, min: number, max: number): boolean => {
  if (!isNumber(value)) return false;
  const num = typeof value === 'number' ? value : parseFloat(value);
  return num >= min && num <= max;
};

/**
 * 验证长度
 */
export const isLength = (value: string | Array<unknown>, min: number, max?: number): boolean => {
  const len = value.length;
  if (max !== undefined) {
    return len >= min && len <= max;
  }
  return len >= min;
};

/**
 * 验证密码强度
 */
export const isStrongPassword = (password: string): {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  errors: string[];
} => {
  const errors: string[] = [];
  let score = 0;

  if (isEmpty(password)) {
    return { isValid: false, strength: 'weak', errors: ['密码不能为空'] };
  }

  // 长度检查
  if (password.length < 8) {
    errors.push('密码长度至少8位');
  } else if (password.length >= 12) {
    score += 2;
  } else {
    score += 1;
  }

  // 包含小写字母
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    errors.push('密码必须包含小写字母');
  }

  // 包含大写字母
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    errors.push('密码必须包含大写字母');
  }

  // 包含数字
  if (/\d/.test(password)) {
    score += 1;
  } else {
    errors.push('密码必须包含数字');
  }

  // 包含特殊字符
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score += 1;
  } else {
    errors.push('密码必须包含特殊字符');
  }

  const strength = score >= 5 ? 'strong' : score >= 3 ? 'medium' : 'weak';
  return {
    isValid: score >= 4,
    strength,
    errors,
  };
};

/**
 * 验证用户名
 */
export const isUsername = (username: string): boolean => {
  if (isEmpty(username)) return false;
  // 4-16位，只能包含字母、数字、下划线
  const usernameRegex = /^[a-zA-Z0-9_]{4,16}$/;
  return usernameRegex.test(username);
};

/**
 * 验证邮政编码（中国大陆）
 */
export const isPostalCode = (code: string): boolean => {
  if (isEmpty(code)) return false;
  const postalRegex = /^[1-9]\d{5}$/;
  return postalRegex.test(code);
};

/**
 * 验证车牌号
 */
export const isLicensePlate = (plate: string): boolean => {
  if (isEmpty(plate)) return false;
  // 普通车牌
  const normalPlateRegex = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-Z0-9]{5}$/;
  // 新能源车牌
  const newEnergyPlateRegex = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-Z0-9]{4}[DF]$/;

  return normalPlateRegex.test(plate) || newEnergyPlateRegex.test(plate);
};

/**
 * 验证银行卡号
 */
export const isBankCard = (cardNumber: string): boolean => {
  if (isEmpty(cardNumber)) return false;
  // 10-30位数字
  const cardRegex = /^\d{10,30}$/;
  if (!cardRegex.test(cardNumber)) return false;

  // Luhn 算法验证
  let sum = 0;
  let isEven = false;

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i], 10);

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
};

/**
 * 验证 UUID
 */
export const isUUID = (uuid: string, version?: 1 | 2 | 3 | 4 | 5): boolean => {
  if (isEmpty(uuid)) return false;

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(uuid)) return false;

  if (version !== undefined) {
    const versionChar = uuid[14];
    return versionChar === version.toString();
  }

  return true;
};

/**
 * 验证是否为 JSON 字符串
 */
export const isJSON = (str: string): boolean => {
  if (isEmpty(str)) return false;
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};

/**
 * 验证是否为 Base64 字符串
 */
export const isBase64 = (str: string): boolean => {
  if (isEmpty(str)) return false;
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  return base64Regex.test(str);
};

/**
 * 验证信用卡号
 */
export const isCreditCard = (cardNumber: string): {
  isValid: boolean;
  type?: 'visa' | 'mastercard' | 'amex' | 'discover' | 'diners' | 'jcb';
} => {
  if (isEmpty(cardNumber)) return { isValid: false };

  // 移除空格和连字符
  const cleaned = cardNumber.replace(/[\s-]/g, '');

  // 检查是否为数字
  if (!/^\d+$/.test(cleaned)) return { isValid: false };

  // 识别卡类型
  let type: ReturnType<typeof isCreditCard>['type'];
  if (/^4/.test(cleaned)) {
    type = 'visa';
  } else if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) {
    type = 'mastercard';
  } else if (/^3[47]/.test(cleaned)) {
    type = 'amex';
  } else if (/^6(?:011|5)/.test(cleaned)) {
    type = 'discover';
  } else if (/^3(?:0[0-5]|[68])/.test(cleaned)) {
    type = 'diners';
  } else if (/^(?:2131|1800|35)/.test(cleaned)) {
    type = 'jcb';
  }

  // Luhn 算法验证
  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  const isValid = sum % 10 === 0;
  return { isValid, type };
};

/**
 * 验证护照号
 */
export const isPassport = (passport: string): boolean => {
  if (isEmpty(passport)) return false;
  // 护照号格式：字母+数字，总长度6-20位
  const passportRegex = /^[A-Za-z0-9]{6,20}$/;
  return passportRegex.test(passport);
};

/**
 * 验证社会统一信用代码
 */
export const isSocialCreditCode = (code: string): boolean => {
  if (isEmpty(code)) return false;
  const regex = /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/;
  if (!regex.test(code)) return false;

  // 验证校验码
  const weights = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28];
  const chars = '0123456789ABCDEFGHJKLMNPQRTUWXY';
  let sum = 0;

  for (let i = 0; i < 17; i++) {
    const char = code[i];
    const value = chars.indexOf(char);
    sum += value * weights[i];
  }

  const checkCode = chars[31 - (sum % 31)];
  return checkCode === code[17];
};

/**
 * 验证经度
 */
export const isLongitude = (longitude: number | string): boolean => {
  const num = typeof longitude === 'string' ? parseFloat(longitude) : longitude;
  return isNumber(num) && num >= -180 && num <= 180;
};

/**
 * 验证纬度
 */
export const isLatitude = (latitude: number | string): boolean => {
  const num = typeof latitude === 'string' ? parseFloat(latitude) : latitude;
  return isNumber(num) && num >= -90 && num <= 90;
};

export default {
  isEmpty,
  isEmail,
  isPhoneNumber,
  isUrl,
  isIdCard,
  isIP,
  isMAC,
  isHexColor,
  isRGBColor,
  isDate,
  isNumber,
  isInteger,
  isPositive,
  isNegative,
  isInRange,
  isLength,
  isStrongPassword,
  isUsername,
  isPostalCode,
  isLicensePlate,
  isBankCard,
  isUUID,
  isJSON,
  isBase64,
  isCreditCard,
  isPassport,
  isSocialCreditCode,
  isLongitude,
  isLatitude,
};
