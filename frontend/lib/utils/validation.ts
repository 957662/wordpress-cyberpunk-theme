/**
 * Validation Utilities
 * 验证工具函数
 */

/**
 * 验证邮箱
 */
export function isEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * 验证手机号（中国）
 */
export function isPhoneCN(phone: string): boolean {
  const regex = /^1[3-9]\d{9}$/;
  return regex.test(phone);
}

/**
 * 验证 URL
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
 */
export function isIP(ip: string): boolean {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipv4Regex.test(ip)) return false;

  const parts = ip.split('.');
  return parts.every((part) => {
    const num = parseInt(part, 10);
    return num >= 0 && num <= 255;
  });
}

/**
 * 验证 IPv6 地址
 */
export function isIPv6(ip: string): boolean {
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  return ipv6Regex.test(ip);
}

/**
 * 验证身份证号（中国）
 */
export function isIDCard(id: string): boolean {
  // 18位身份证
  const regex18 = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
  // 15位身份证
  const regex15 = /^[1-9]\d{5}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}$/;

  return regex18.test(id) || regex15.test(id);
}

/**
 * 验证密码强度
 */
export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  if (password.length < 6) return 'weak';

  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  if (strength <= 2) return 'weak';
  if (strength <= 4) return 'medium';
  return 'strong';
}

/**
 * 验证邮政编码（中国）
 */
export function isPostalCode(code: string): boolean {
  const regex = /^\d{6}$/;
  return regex.test(code);
}

/**
 * 验证车牌号（中国）
 */
export function isLicensePlate(plate: string): boolean {
  // 普通车牌
  const normalRegex = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-Z0-9]{5}$/;
  // 新能源车牌
  const evRegex = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-Z0-9]{4}[A-Z0-9]$/;

  return normalRegex.test(plate) || evRegex.test(plate);
}

/**
 * 验证微信号
 */
export function isWeChatId(id: string): boolean {
  const regex = /^[a-zA-Z][-_a-zA-Z0-9]{5,19}$/;
  return regex.test(id);
}

/**
 * 验证 QQ 号
 */
export function isQQ(qq: string): boolean {
  const regex = /^[1-9][0-9]{4,10}$/;
  return regex.test(qq);
}

/**
 * 验证 MAC 地址
 */
export function isMAC(mac: string): boolean {
  const regex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
  return regex.test(mac);
}

/**
 * 验证十六进制颜色
 */
export function isHexColor(color: string): boolean {
  const regex = /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
  return regex.test(color);
}

/**
 * 验证 RGB 颜色
 */
export function isRGBColor(color: string): boolean {
  const regex = /^rgb\(\s*(\d{1,3}%?\s*,\s*){2}\d{1,3}%?\s*\)$/;
  return regex.test(color);
}

/**
 * 验证 Base64 字符串
 */
export function isBase64(str: string): boolean {
  try {
    return btoa(atob(str)) === str;
  } catch {
    return false;
  }
}

/**
 * 验证 JSON 字符串
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
 * 验证数字（字符串）
 */
export function isNumeric(str: string): boolean {
  return !isNaN(Number(str)) && isFinite(Number(str));
}

/**
 * 验证整数
 */
export function isInteger(str: string): boolean {
  return /^-?\d+$/.test(str);
}

/**
 * 验证正整数
 */
export function isPositiveInteger(str: string): boolean {
  return /^\d+$/.test(str);
}

/**
 * 验证浮点数
 */
export function isFloat(str: string): boolean {
  return /^-?\d+\.\d+$/.test(str);
}

/**
 * 验证日期格式 YYYY-MM-DD
 */
export function isDate(date: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(date)) return false;

  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
}

/**
 * 验证时间格式 HH:MM:SS
 */
export function isTime(time: string): boolean {
  const regex = /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;
  return regex.test(time);
}

/**
 * 验证日期时间格式 YYYY-MM-DD HH:MM:SS
 */
export function isDateTime(datetime: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
  if (!regex.test(datetime)) return false;

  const d = new Date(datetime);
  return d instanceof Date && !isNaN(d.getTime());
}

/**
 * 验证中文字符
 */
export function isChinese(str: string): boolean {
  const regex = /^[\u4e00-\u9fa5]+$/;
  return regex.test(str);
}

/**
 * 验证英文字符
 */
export function isEnglish(str: string): boolean {
  const regex = /^[a-zA-Z]+$/;
  return regex.test(str);
}

/**
 * 验证字母数字
 */
export function isAlphanumeric(str: string): boolean {
  const regex = /^[a-zA-Z0-9]+$/;
  return regex.test(str);
}

/**
 * 验证用户名（字母开头，允许字母数字下划线，4-16位）
 */
export function isUsername(username: string): boolean {
  const regex = /^[a-zA-Z][a-zA-Z0-9_]{3,15}$/;
  return regex.test(username);
}

/**
 * 验证文件扩展名
 */
export function isValidFileExtension(filename: string, extensions: string[]): boolean {
  const ext = filename.split('.').pop()?.toLowerCase();
  return ext ? extensions.includes(ext) : false;
}

/**
 * 验证文件大小
 */
export function isValidFileSize(size: number, maxSize: number): boolean {
  return size <= maxSize;
}
