/**
 * Validator Utility Functions
 *
 * Common validation functions for forms and user input.
 */

/**
 * Email validation
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * URL validation
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Phone number validation (international)
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s-()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

/**
 * Password strength validation
 */
export const validatePassword = (password: string): {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  issues: string[];
} => {
  const issues: string[] = [];

  if (password.length < 8) {
    issues.push('密码至少需要8个字符');
  }

  if (!/[A-Z]/.test(password)) {
    issues.push('密码需要包含大写字母');
  }

  if (!/[a-z]/.test(password)) {
    issues.push('密码需要包含小写字母');
  }

  if (!/\d/.test(password)) {
    issues.push('密码需要包含数字');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    issues.push('密码需要包含特殊字符');
  }

  const strengthScore = password.length +
    (/[A-Z]/.test(password) ? 1 : 0) +
    (/[a-z]/.test(password) ? 1 : 0) +
    (/\d/.test(password) ? 1 : 0) +
    (/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 1 : 0);

  let strength: 'weak' | 'medium' | 'strong';
  if (strengthScore < 8) {
    strength = 'weak';
  } else if (strengthScore < 12) {
    strength = 'medium';
  } else {
    strength = 'strong';
  }

  return {
    isValid: issues.length === 0,
    strength,
    issues,
  };
};

/**
 * Username validation
 */
export const isValidUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username);
};

/**
 * Slug validation
 */
export const isValidSlug = (slug: string): boolean => {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
};

/**
 * Date validation
 */
export const isValidDate = (date: string): boolean => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
};

/**
 * Age validation (must be 18+)
 */
export const isValidAge = (birthDate: string): boolean => {
  const today = new Date();
  const birth = new Date(birthDate);
  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    return age - 1 >= 18;
  }

  return age >= 18;
};

/**
 * Postal code validation (supports multiple formats)
 */
export const isValidPostalCode = (postalCode: string, countryCode = 'US'): boolean => {
  const patterns: Record<string, RegExp> = {
    US: /^\d{5}(-\d{4})?$/,
    UK: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i,
    CA: /^[A-Z]\d[A-Z] ?\d[A-Z]\d$/i,
    DE: /^\d{5}$/,
    FR: /^\d{5}$/,
    JP: /^\d{3}-\d{4}$/,
    CN: /^\d{6}$/,
  };

  const pattern = patterns[countryCode.toUpperCase()] || patterns.US;
  return pattern.test(postalCode);
};

/**
 * Credit card validation (Luhn algorithm)
 */
export const isValidCreditCard = (cardNumber: string): boolean => {
  const digits = cardNumber.replace(/\D/g, '');

  if (digits.length < 13 || digits.length > 19) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

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
 * SSN validation (US Social Security Number)
 */
export const isValidSSN = (ssn: string): boolean => {
  const ssnRegex = /^(?!000|666|9)\d{3}-(?!00)\d{2}-(?!0000)\d{4}$/;
  return ssnRegex.test(ssn);
};

/**
 * IP address validation (IPv4 and IPv6)
 */
export const isValidIP = (ip: string): boolean => {
  const ipv4Regex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
};

/**
 * HEX color validation
 */
export const isValidHexColor = (color: string): boolean => {
  const hexRegex = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
  return hexRegex.test(color);
};

/**
 * File size validation
 */
export const isValidFileSize = (
  file: File,
  maxSizeInMB: number
): { isValid: boolean; sizeInMB: number } => {
  const sizeInMB = file.size / (1024 * 1024);
  return {
    isValid: sizeInMB <= maxSizeInMB,
    sizeInMB: Number(sizeInMB.toFixed(2)),
  };
};

/**
 * File type validation
 */
export const isValidFileType = (
  file: File,
  allowedTypes: string[]
): boolean => {
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  return allowedTypes.some(type => {
    const typeExtension = '.' + type.replace('*', '').toLowerCase();
    return type === file.type || fileExtension === typeExtension;
  });
};

/**
 * String length validation
 */
export const isValidLength = (
  str: string,
  min: number,
  max: number
): boolean => {
  return str.length >= min && str.length <= max;
};

/**
 * Number range validation
 */
export const isInRange = (
  num: number,
  min: number,
  max: number
): boolean => {
  return num >= min && num <= max;
};

/**
 * Required field validation
 */
export const isRequired = (value: any): boolean => {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return true;
};

/**
 * Validate object against schema
 */
export const validateSchema = <T extends Record<string, any>>(
  data: T,
  schema: {
    [K in keyof T]?: (value: T[K]) => boolean | string;
  }
): { isValid: boolean; errors: { [K in keyof T]?: string } } => {
  const errors: { [K in keyof T]?: string } = {};
  let isValid = true;

  for (const key in schema) {
    const validator = schema[key];
    if (validator) {
      const result = validator(data[key]);
      if (result !== true) {
        errors[key] = typeof result === 'string' ? result : 'Invalid value';
        isValid = false;
      }
    }
  }

  return { isValid, errors };
};

export default {
  isValidEmail,
  isValidUrl,
  isValidPhone,
  validatePassword,
  isValidUsername,
  isValidSlug,
  isValidDate,
  isValidAge,
  isValidPostalCode,
  isValidCreditCard,
  isValidSSN,
  isValidIP,
  isValidHexColor,
  isValidFileSize,
  isValidFileType,
  isValidLength,
  isInRange,
  isRequired,
  validateSchema,
};
