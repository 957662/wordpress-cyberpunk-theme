/**
 * Validation Utilities
 *
 * Common validation functions for form inputs and data validation
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
 * Password strength validation
 */
export interface PasswordStrength {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  score: number;
  feedback: string[];
}

export function validatePassword(password: string): PasswordStrength {
  const feedback: string[] = [];
  let score = 0;

  // Length check
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Password must be at least 8 characters long');
  }

  if (password.length >= 12) {
    score += 1;
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password must contain lowercase letters');
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password must contain uppercase letters');
  }

  // Number check
  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password must contain numbers');
  }

  // Special character check
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password must contain special characters');
  }

  // Determine strength
  let strength: 'weak' | 'medium' | 'strong';
  if (score <= 2) {
    strength = 'weak';
  } else if (score <= 4) {
    strength = 'medium';
  } else {
    strength = 'strong';
  }

  return {
    isValid: score >= 4,
    strength,
    score,
    feedback,
  };
}

/**
 * Username validation
 */
export function isValidUsername(username: string): boolean {
  // Username: 3-20 characters, alphanumeric and underscores only
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

/**
 * Phone number validation (basic)
 */
export function isValidPhoneNumber(phone: string): boolean {
  // Basic phone number validation (supports various formats)
  const phoneRegex = /^\+?[\d\s-()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

/**
 * Credit card validation (Luhn algorithm)
 */
export function isValidCreditCard(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '');

  if (digits.length < 13 || digits.length > 19) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i]);

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
 * Date validation
 */
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Age validation
 */
export function isValidAge(birthDate: string | Date, minAge: number = 13, maxAge: number = 120): boolean {
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  const today = new Date();
  const age = today.getFullYear() - birth.getFullYear();

  return age >= minAge && age <= maxAge;
}

/**
 * String length validation
 */
export function isValidLength(
  value: string,
  minLength?: number,
  maxLength?: number
): boolean {
  const length = value.length;

  if (minLength !== undefined && length < minLength) {
    return false;
  }

  if (maxLength !== undefined && length > maxLength) {
    return false;
  }

  return true;
}

/**
 * Range validation
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Required field validation
 */
export function isRequired<T>(value: T | null | undefined): boolean {
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
}

/**
 * File validation
 */
export interface FileValidationOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  maxWidth?: number;
  maxHeight?: number;
}

export async function validateFile(
  file: File,
  options: FileValidationOptions
): Promise<{ valid: boolean; error?: string }> {
  // Check file size
  if (options.maxSize && file.size > options.maxSize) {
    const maxSizeMB = (options.maxSize / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB`,
    };
  }

  // Check file type
  if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type not allowed. Allowed types: ${options.allowedTypes.join(', ')}`,
    };
  }

  // Check image dimensions if it's an image
  if (options.maxWidth || options.maxHeight) {
    if (!file.type.startsWith('image/')) {
      return { valid: true };
    }

    try {
      const dimensions = await getImageDimensions(file);

      if (options.maxWidth && dimensions.width > options.maxWidth) {
        return {
          valid: false,
          error: `Image width exceeds ${options.maxWidth}px`,
        };
      }

      if (options.maxHeight && dimensions.height > options.maxHeight) {
        return {
          valid: false,
          error: `Image height exceeds ${options.maxHeight}px`,
        };
      }
    } catch {
      return {
        valid: false,
        error: 'Failed to read image dimensions',
      };
    }
  }

  return { valid: true };
}

/**
 * Get image dimensions
 */
function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * Slug validation
 */
export function isValidSlug(slug: string): boolean {
  // Slug: lowercase, alphanumeric, hyphens only
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

/**
 * Hex color validation
 */
export function isValidHexColor(color: string): boolean {
  const hexRegex = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(color);
}

/**
 * IP address validation
 */
export function isValidIP(ip: string): boolean {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

  if (ipv4Regex.test(ip)) {
    return ip.split('.').every(octet => {
      const num = parseInt(octet);
      return num >= 0 && num <= 255;
    });
  }

  return ipv6Regex.test(ip);
}

/**
 * Postal code validation (basic)
 */
export function isValidPostalCode(postalCode: string, countryCode: string = 'US'): boolean {
  const patterns: Record<string, RegExp> = {
    US: /^\d{5}(-\d{4})?$/,
    UK: /^[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}$/i,
    CA: /^[A-Z]\d[A-Z] \d[A-Z]\d$/i,
    DE: /^\d{5}$/,
    FR: /^\d{5}$/,
    JP: /^\d{3}-\d{4}$/,
  };

  const pattern = patterns[countryCode];
  return pattern ? pattern.test(postalCode) : false;
}

/**
 * SSN validation (US)
 */
export function isValidSSN(ssn: string): boolean {
  // SSN: XXX-XX-XXXX format
  const ssnRegex = /^(?!000|666|9\d{2})\d{3}-(?!00)\d{2}-(?!0000)\d{4}$/;
  return ssnRegex.test(ssn);
}

/**
 * Tax ID validation (basic)
 */
export function isValidTaxID(taxId: string): boolean {
  // Basic tax ID validation (9 digits)
  const taxIdRegex = /^\d{2}-\d{7}$/;
  return taxIdRegex.test(taxId);
}

/**
 * Validate object against schema
 */
export interface ValidationSchema {
  [key: string]: (value: any) => boolean | string;
}

export function validateObject<T extends Record<string, any>>(
  data: T,
  schema: ValidationSchema
): { valid: boolean; errors: Record<keyof T, string> } {
  const errors = {} as Record<keyof T, string>;

  for (const key in schema) {
    const validator = schema[key];
    const result = validator(data[key]);

    if (result === false) {
      errors[key] = `Invalid ${key}`;
    } else if (typeof result === 'string') {
      errors[key] = result;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Sanitize input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Format validation error messages
 */
export function formatValidationErrors(errors: Record<string, string>): string[] {
  return Object.values(errors);
}
