/**
 * Advanced Validators - 高级验证器集合
 *
 * 提供各种高级数据验证功能
 */

/**
 * 验证结果类型
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}

/**
 * 基础验证器
 */
export class Validator {
  /**
   * 必填验证
   */
  static required(value: any): ValidationResult {
    const valid = value !== null && value !== undefined && value !== '';
    return {
      valid,
      errors: valid ? [] : ['此字段为必填项'],
    };
  }

  /**
   * 最小长度验证
   */
  static minLength(value: string, min: number): ValidationResult {
    const valid = value.length >= min;
    return {
      valid,
      errors: valid ? [] : [`长度不能少于 ${min} 个字符`],
    };
  }

  /**
   * 最大长度验证
   */
  static maxLength(value: string, max: number): ValidationResult {
    const valid = value.length <= max;
    return {
      valid,
      errors: valid ? [] : [`长度不能超过 ${max} 个字符`],
    };
  }

  /**
   * 范围验证
   */
  static range(value: number, min: number, max: number): ValidationResult {
    const valid = value >= min && value <= max;
    return {
      valid,
      errors: valid ? [] : [`值必须在 ${min} 和 ${max} 之间`],
    };
  }

  /**
   * 正则表达式验证
   */
  static pattern(value: string, regex: RegExp, message?: string): ValidationResult {
    const valid = regex.test(value);
    return {
      valid,
      errors: valid ? [] : [message || '格式不正确'],
    };
  }

  /**
   * 邮箱验证
   */
  static email(value: string): ValidationResult {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return this.pattern(value, emailRegex, '请输入有效的邮箱地址');
  }

  /**
   * URL 验证
   */
  static url(value: string): ValidationResult {
    try {
      new URL(value);
      return { valid: true, errors: [] };
    } catch {
      return { valid: false, errors: ['请输入有效的 URL'] };
    }
  }

  /**
   * 电话号码验证（中国）
   */
  static phone(value: string): ValidationResult {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return this.pattern(value, phoneRegex, '请输入有效的手机号码');
  }

  /**
   * 身份证号码验证（中国）
   */
  static idCard(value: string): ValidationResult {
    const idCardRegex = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
    
    if (!idCardRegex.test(value)) {
      return { valid: false, errors: ['请输入有效的身份证号码'] };
    }

    // 验证校验码
    const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    
    let sum = 0;
    for (let i = 0; i < 17; i++) {
      sum += parseInt(value[i]) * weights[i];
    }
    
    const checkCode = checkCodes[sum % 11];
    const valid = checkCode.toUpperCase() === value[17].toUpperCase();

    return {
      valid,
      errors: valid ? [] : ['身份证号码校验失败'],
    };
  }

  /**
   * 密码强度验证
   */
  static passwordStrength(value: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (value.length < 8) {
      errors.push('密码长度至少为 8 位');
    }

    if (!/[a-z]/.test(value)) {
      errors.push('密码必须包含小写字母');
    }

    if (!/[A-Z]/.test(value)) {
      errors.push('密码必须包含大写字母');
    }

    if (!/\d/.test(value)) {
      errors.push('密码必须包含数字');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      warnings.push('建议包含特殊字符以提高安全性');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * 用户名验证
   */
  static username(value: string): ValidationResult {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return this.pattern(
      value,
      usernameRegex,
      '用户名只能包含字母、数字和下划线，长度 3-20 位'
    );
  }

  /**
   * IP 地址验证
   */
  static ip(value: string): ValidationResult {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    
    if (!ipv4Regex.test(value)) {
      return { valid: false, errors: ['请输入有效的 IP 地址'] };
    }

    const parts = value.split('.');
    const valid = parts.every((part) => {
      const num = parseInt(part);
      return num >= 0 && num <= 255;
    });

    return {
      valid,
      errors: valid ? [] : ['IP 地址格式不正确'],
    };
  }

  /**
   * 日期验证
   */
  static date(value: string, format: 'YYYY-MM-DD' | 'DD/MM/YYYY' = 'YYYY-MM-DD'): ValidationResult {
    let regex: RegExp;
    let dayIndex: number, monthIndex: number, yearIndex: number;

    if (format === 'YYYY-MM-DD') {
      regex = /^\d{4}-\d{2}-\d{2}$/;
      yearIndex = 0;
      monthIndex = 1;
      dayIndex = 2;
    } else {
      regex = /^\d{2}\/\d{2}\/\d{4}$/;
      dayIndex = 0;
      monthIndex = 1;
      yearIndex = 2;
    }

    if (!regex.test(value)) {
      return { valid: false, errors: ['日期格式不正确'] };
    }

    const parts = format === 'YYYY-MM-DD'
      ? value.split('-')
      : value.split('/');

    const day = parseInt(parts[dayIndex]);
    const month = parseInt(parts[monthIndex]);
    const year = parseInt(parts[yearIndex]);

    const date = new Date(year, month - 1, day);
    const valid =
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day;

    return {
      valid,
      errors: valid ? [] : ['请输入有效的日期'],
    };
  }

  /**
   * 年龄验证
   */
  static age(value: number, min: number = 0, max: number = 150): ValidationResult {
    return this.range(value, min, max);
  }

  /**
   * 颜色值验证 (HEX)
   */
  static hexColor(value: string): ValidationResult {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return this.pattern(value, hexRegex, '请输入有效的颜色值（如 #FFFFFF 或 #FFF）');
  }

  /**
   * 文件扩展名验证
   */
  static fileExtension(value: string, allowedExtensions: string[]): ValidationResult {
    const extension = value.split('.').pop()?.toLowerCase();
    const valid = extension && allowedExtensions.includes(extension);

    return {
      valid: !!valid,
      errors: valid ? [] : [`允许的文件类型：${allowedExtensions.join(', ')}`],
    };
  }

  /**
   * 文件大小验证
   */
  static fileSize(file: File, maxSizeInMB: number): ValidationResult {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    const valid = file.size <= maxSizeInBytes;

    return {
      valid,
      errors: valid ? [] : [`文件大小不能超过 ${maxSizeInMB}MB`],
    };
  }

  /**
   * 图片尺寸验证
   */
  static imageDimensions(
    file: File,
    minWidth?: number,
    maxWidth?: number,
    minHeight?: number,
    maxHeight?: number
  ): Promise<ValidationResult> {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        const errors: string[] = [];

        if (minWidth && img.width < minWidth) {
          errors.push(`图片宽度不能小于 ${minWidth}px`);
        }

        if (maxWidth && img.width > maxWidth) {
          errors.push(`图片宽度不能大于 ${maxWidth}px`);
        }

        if (minHeight && img.height < minHeight) {
          errors.push(`图片高度不能小于 ${minHeight}px`);
        }

        if (maxHeight && img.height > maxHeight) {
          errors.push(`图片高度不能大于 ${maxHeight}px`);
        }

        resolve({
          valid: errors.length === 0,
          errors,
        });
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({
          valid: false,
          errors: ['无法读取图片文件'],
        });
      };

      img.src = url;
    });
  }
}

/**
 * 组合验证器
 *
 * 可以组合多个验证规则
 */
export class CompositeValidator {
  private validators: Array<(value: any) => ValidationResult> = [];

  add(validator: (value: any) => ValidationResult): this {
    this.validators.push(validator);
    return this;
  }

  validate(value: any): ValidationResult {
    const allErrors: string[] = [];
    const allWarnings: string[] = [];

    for (const validator of this.validators) {
      const result = validator(value);
      
      if (!result.valid) {
        allErrors.push(...result.errors);
      }
      
      if (result.warnings) {
        allWarnings.push(...result.warnings);
      }
    }

    return {
      valid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
    };
  }
}

/**
 * 表单验证器
 *
 * 验证整个表单
 */
export interface FormSchema {
  [fieldName: string]: Array<(value: any) => ValidationResult>;
}

export class FormValidator {
  private schema: FormSchema;

  constructor(schema: FormSchema) {
    this.schema = schema;
  }

  validate(formData: Record<string, any>): {
    valid: boolean;
    errors: Record<string, string[]>;
  } {
    const errors: Record<string, string[]> = {};
    let valid = true;

    for (const [fieldName, validators] of Object.entries(this.schema)) {
      const value = formData[fieldName];
      const fieldErrors: string[] = [];

      for (const validator of validators) {
        const result = validator(value);
        
        if (!result.valid) {
          fieldErrors.push(...result.errors);
          valid = false;
        }
      }

      if (fieldErrors.length > 0) {
        errors[fieldName] = fieldErrors;
      }
    }

    return {
      valid,
      errors,
    };
  }
}

/**
 * 异步验证器
 */
export class AsyncValidator {
  /**
   * 唯一性验证（需要后端 API 支持）
   */
  static async unique(
    value: string,
    checkFn: (value: string) => Promise<boolean>
  ): Promise<ValidationResult> {
    try {
      const isUnique = await checkFn(value);
      return {
        valid: isUnique,
        errors: isUnique ? [] : ['该值已存在'],
      };
    } catch (error) {
      return {
        valid: false,
        errors: ['验证失败，请稍后重试'],
      };
    }
  }

  /**
   * 验证码检查
   */
  static async verifyCode(
    code: string,
    correctCode: string | (() => Promise<string>)
  ): Promise<ValidationResult> {
    try {
      const actualCode = typeof correctCode === 'function'
        ? await correctCode()
        : correctCode;

      return {
        valid: code === actualCode,
        errors: code === actualCode ? [] : ['验证码错误'],
      };
    } catch {
      return {
        valid: false,
        errors: ['验证码验证失败'],
      };
    }
  }
}

export default Validator;
