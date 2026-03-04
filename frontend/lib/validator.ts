/**
 * 通用验证器库
 * 提供各种数据验证功能
 */

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * 邮箱验证
 */
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];

  if (!email) {
    errors.push('邮箱不能为空');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('邮箱格式不正确');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * 手机号验证（中国大陆）
 */
export function validatePhone(phone: string): ValidationResult {
  const errors: string[] = [];

  if (!phone) {
    errors.push('手机号不能为空');
  } else if (!/^1[3-9]\d{9}$/.test(phone)) {
    errors.push('手机号格式不正确');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * 密码强度验证
 */
export function validatePassword(password: string): ValidationResult {
  const errors: string[] = [];

  if (!password) {
    errors.push('密码不能为空');
  } else {
    if (password.length < 8) {
      errors.push('密码长度至少为 8 位');
    }
    if (password.length > 128) {
      errors.push('密码长度不能超过 128 位');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('密码必须包含小写字母');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('密码必须包含大写字母');
    }
    if (!/\d/.test(password)) {
      errors.push('密码必须包含数字');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('密码必须包含特殊字符');
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * 用户名验证
 */
export function validateUsername(username: string): ValidationResult {
  const errors: string[] = [];

  if (!username) {
    errors.push('用户名不能为空');
  } else {
    if (username.length < 3) {
      errors.push('用户名长度至少为 3 位');
    }
    if (username.length > 20) {
      errors.push('用户名长度不能超过 20 位');
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      errors.push('用户名只能包含字母、数字、下划线和连字符');
    }
    if (/^\d/.test(username)) {
      errors.push('用户名不能以数字开头');
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * URL 验证
 */
export function validateURL(url: string): ValidationResult {
  const errors: string[] = [];

  if (!url) {
    errors.push('URL 不能为空');
  } else {
    try {
      new URL(url);
    } catch {
      errors.push('URL 格式不正确');
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * IP 地址验证
 */
export function validateIP(ip: string): ValidationResult {
  const errors: string[] = [];

  if (!ip) {
    errors.push('IP 地址不能为空');
  } else {
    const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Pattern = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

    if (!ipv4Pattern.test(ip) && !ipv6Pattern.test(ip)) {
      errors.push('IP 地址格式不正确');
    } else if (ipv4Pattern.test(ip)) {
      // 验证 IPv4 各个段
      const parts = ip.split('.');
      for (const part of parts) {
        const num = parseInt(part, 10);
        if (num < 0 || num > 255) {
          errors.push('IP 地址各段必须在 0-255 之间');
          break;
        }
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * 日期验证
 */
export function validateDate(date: string, format: 'YYYY-MM-DD' | 'DD/MM/YYYY' | 'MM/DD/YYYY' = 'YYYY-MM-DD'): ValidationResult {
  const errors: string[] = [];

  if (!date) {
    errors.push('日期不能为空');
  } else {
    let parsedDate: Date;

    switch (format) {
      case 'YYYY-MM-DD':
        parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime()) || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
          errors.push('日期格式不正确，应为 YYYY-MM-DD');
        }
        break;
      case 'DD/MM/YYYY':
        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
          errors.push('日期格式不正确，应为 DD/MM/YYYY');
        }
        break;
      case 'MM/DD/YYYY':
        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
          errors.push('日期格式不正确，应为 MM/DD/YYYY');
        }
        break;
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * 信用卡号验证（Luhn 算法）
 */
export function validateCreditCard(cardNumber: string): ValidationResult {
  const errors: string[] = [];

  if (!cardNumber) {
    errors.push('信用卡号不能为空');
  } else {
    const cleaned = cardNumber.replace(/\s/g, '');

    if (!/^\d{13,19}$/.test(cleaned)) {
      errors.push('信用卡号格式不正确');
    } else if (!luhnCheck(cleaned)) {
      errors.push('信用卡号无效');
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Luhn 算法检查
 */
function luhnCheck(cardNumber: string): boolean {
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
}

/**
 * 身份证号验证（中国大陆）
 */
export function validateChineseID(id: string): ValidationResult {
  const errors: string[] = [];

  if (!id) {
    errors.push('身份证号不能为空');
  } else {
    // 18 位身份证号
    if (!/^\d{17}[\dXx]$/.test(id)) {
      errors.push('身份证号格式不正确');
    } else {
      // 验证地区码（前 6 位）
      const areaCode = parseInt(id.substring(0, 6), 10);
      if (areaCode < 110000 || areaCode > 659004) {
        errors.push('身份证号地区码无效');
      }

      // 验证出生日期（第 7-14 位）
      const birthDate = id.substring(6, 14);
      const date = new Date(birthDate.substring(0, 4), parseInt(birthDate.substring(4, 6)) - 1, birthDate.substring(6, 8));
      if (isNaN(date.getTime())) {
        errors.push('身份证号出生日期无效');
      }

      // 验证校验码（第 18 位）
      const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

      let sum = 0;
      for (let i = 0; i < 17; i++) {
        sum += parseInt(id[i], 10) * weights[i];
      }

      const checkCode = checkCodes[sum % 11];
      if (id[17].toUpperCase() !== checkCode) {
        errors.push('身份证号校验码无效');
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * 邮政编码验证
 */
export function validatePostalCode(code: string, country: 'CN' | 'US' | 'UK' = 'CN'): ValidationResult {
  const errors: string[] = [];

  if (!code) {
    errors.push('邮政编码不能为空');
  } else {
    switch (country) {
      case 'CN':
        if (!/^\d{6}$/.test(code)) {
          errors.push('中国邮政编码必须为 6 位数字');
        }
        break;
      case 'US':
        if (!/^\d{5}(-\d{4})?$/.test(code)) {
          errors.push('美国邮政编码格式不正确');
        }
        break;
      case 'UK':
        if (!/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i.test(code)) {
          errors.push('英国邮政编码格式不正确');
        }
        break;
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * 颜色值验证
 */
export function validateColor(color: string): ValidationResult {
  const errors: string[] = [];

  if (!color) {
    errors.push('颜色值不能为空');
  } else {
    const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    const rgbPattern = /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/;
    const rgbaPattern = /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/;
    const hslPattern = /^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/;
    const hslaPattern = /^hsla\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*[\d.]+\s*\)$/;
    const namedColors = [
      'red', 'green', 'blue', 'yellow', 'orange', 'purple', 'pink', 'brown',
      'black', 'white', 'gray', 'grey', 'transparent',
    ];

    const isValid =
      hexPattern.test(color) ||
      rgbPattern.test(color) ||
      rgbaPattern.test(color) ||
      hslPattern.test(color) ||
      hslaPattern.test(color) ||
      namedColors.includes(color.toLowerCase());

    if (!isValid) {
      errors.push('颜色值格式不正确');
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * 文件扩展名验证
 */
export function validateFileExtension(filename: string, allowedExtensions: string[]): ValidationResult {
  const errors: string[] = [];

  if (!filename) {
    errors.push('文件名不能为空');
  } else {
    const extension = filename.substring(filename.lastIndexOf('.')).toLowerCase();
    const normalizedAllowed = allowedExtensions.map((ext) =>
      ext.startsWith('.') ? ext.toLowerCase() : `.${ext}`.toLowerCase()
    );

    if (!normalizedAllowed.includes(extension)) {
      errors.push(`文件类型不支持，允许的类型：${allowedExtensions.join(', ')}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * 文件大小验证
 */
export function validateFileSize(size: number, maxSizeInMB: number): ValidationResult {
  const errors: string[] = [];
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  if (size > maxSizeInBytes) {
    errors.push(`文件大小超过限制（最大 ${maxSizeInMB}MB）`);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * 数组长度验证
 */
export function validateArrayLength<T>(
  array: T[],
  minLength?: number,
  maxLength?: number
): ValidationResult {
  const errors: string[] = [];

  if (minLength !== undefined && array.length < minLength) {
    errors.push(`数组长度不能少于 ${minLength} 个元素`);
  }

  if (maxLength !== undefined && array.length > maxLength) {
    errors.push(`数组长度不能超过 ${maxLength} 个元素`);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * 字符串长度验证
 */
export function validateStringLength(
  str: string,
  minLength?: number,
  maxLength?: number
): ValidationResult {
  const errors: string[] = [];

  if (minLength !== undefined && str.length < minLength) {
    errors.push(`长度不能少于 ${minLength} 个字符`);
  }

  if (maxLength !== undefined && str.length > maxLength) {
    errors.push(`长度不能超过 ${maxLength} 个字符`);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * 数字范围验证
 */
export function validateNumberRange(
  num: number,
  min?: number,
  max?: number
): ValidationResult {
  const errors: string[] = [];

  if (min !== undefined && num < min) {
    errors.push(`数值不能小于 ${min}`);
  }

  if (max !== undefined && num > max) {
    errors.push(`数值不能大于 ${max}`);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * 正则表达式验证
 */
export function validateRegex(pattern: RegExp, value: string, errorMessage?: string): ValidationResult {
  const errors: string[] = [];

  if (!pattern.test(value)) {
    errors.push(errorMessage || '格式不正确');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * 组合验证器
 */
export function validateAll(...validators: ValidationResult[]): ValidationResult {
  const allErrors = validators.flatMap((v) => v.errors);
  return { valid: allErrors.length === 0, errors: allErrors };
}

/**
 * 条件验证
 */
export function validateIf(
  condition: boolean,
  validator: () => ValidationResult
): ValidationResult {
  return condition ? validator() : { valid: true, errors: [] };
}
