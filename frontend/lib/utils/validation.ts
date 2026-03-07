/**
 * Validation Utilities
 *
 * Helper functions for data validation
 */

/**
 * Email validation
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * URL validation
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
 * Phone number validation (Chinese format)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
}

/**
 * ID card validation (Chinese format)
 */
export function isValidIdCard(idCard: string): boolean {
  const idCardRegex = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
  return idCardRegex.test(idCard);
}

/**
 * Password strength validation
 */
export function validatePassword(password: string): {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  issues: string[];
} {
  const issues: string[] = [];
  let strength: 'weak' | 'medium' | 'strong' = 'weak';

  if (password.length < 8) {
    issues.push('密码长度至少8位');
  }

  if (!/[a-z]/.test(password)) {
    issues.push('密码需要包含小写字母');
  }

  if (!/[A-Z]/.test(password)) {
    issues.push('密码需要包含大写字母');
  }

  if (!/\d/.test(password)) {
    issues.push('密码需要包含数字');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    issues.push('密码需要包含特殊字符');
  }

  const score = password.length + 
    (/[a-z]/.test(password) ? 1 : 0) + 
    (/[A-Z]/.test(password) ? 1 : 0) + 
    (/\d/.test(password) ? 1 : 0) + 
    (/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 1 : 0);

  if (score >= 10) strength = 'strong';
  else if (score >= 7) strength = 'medium';

  return {
    isValid: issues.length === 0,
    strength,
    issues,
  };
}

/**
 * Username validation
 */
export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

/**
 * Post slug validation
 */
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

/**
 * Required field validation
 */
export function isRequired(value: any): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

/**
 * Min length validation
 */
export function minLength(value: string, min: number): boolean {
  return value.length >= min;
}

/**
 * Max length validation
 */
export function maxLength(value: string, max: number): boolean {
  return value.length <= max;
}

/**
 * Range validation
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * File type validation
 */
export function isValidFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

/**
 * File size validation
 */
export function isValidFileSize(file: File, maxSizeInMB: number): boolean {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
}

/**
 * Image dimensions validation
 */
export async function isValidImageDimensions(
  file: File,
  minWidth: number,
  minHeight: number
): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve(img.width >= minWidth && img.height >= minHeight);
    };
    img.onerror = () => resolve(false);
    img.src = URL.createObjectURL(file);
  });
}
