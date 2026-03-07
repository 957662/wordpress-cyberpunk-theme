/**
 * Validation Utilities
 * Common validation functions for forms and data
 */

import { z } from 'zod';

// ============================================================================
// Email Validation
// ============================================================================

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate email with Zod schema
 */
export const emailSchema = z.string().email('Invalid email address');

// ============================================================================
// Password Validation
// ============================================================================

export interface PasswordStrength {
  score: number; // 0-4
  feedback: string;
  isValid: boolean;
}

/**
 * Check password strength
 * Returns score 0-4 (weak to strong)
 */
export const checkPasswordStrength = (password: string): PasswordStrength => {
  let score = 0;
  const feedback: string[] = [];

  // Length check
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('at least 8 characters');
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('one lowercase letter');
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('one uppercase letter');
  }

  // Number check
  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('one number');
  }

  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    feedback.push('one special character');
  }

  return {
    score: Math.min(score, 4),
    feedback: feedback.length > 0 ? `Missing ${feedback.join(', ')}` : 'Strong password',
    isValid: score >= 3,
  };
};

/**
 * Password validation schema
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character');

// ============================================================================
// Username Validation
// ============================================================================

/**
 * Validate username format
 * Username must be 3-20 characters, alphanumeric with underscores and hyphens
 */
export const isValidUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username);
};

export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username must not exceed 20 characters')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens');

// ============================================================================
// URL Validation
// ============================================================================

/**
 * Validate URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const urlSchema = z.string().url('Invalid URL');

// ============================================================================
// Phone Validation
// ============================================================================

/**
 * Validate phone number (international format)
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s-()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

export const phoneSchema = z.string().regex(/^\+?[\d\s-()]+$/, 'Invalid phone number');

// ============================================================================
// File Validation
// ============================================================================

export interface FileValidationOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  maxWidth?: number;
  maxHeight?: number;
}

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate file
 */
export const validateFile = (
  file: File,
  options: FileValidationOptions
): FileValidationResult => {
  const { maxSize, allowedTypes, maxWidth, maxHeight } = options;

  // Check file size
  if (maxSize && file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB`,
    };
  }

  // Check file type
  if (allowedTypes && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} not allowed`,
    };
  }

  // Check image dimensions if it's an image
  if ((maxWidth || maxHeight) && file.type.startsWith('image/')) {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);

        if (maxWidth && img.width > maxWidth) {
          resolve({
            valid: false,
            error: `Image width exceeds ${maxWidth}px`,
          });
        } else if (maxHeight && img.height > maxHeight) {
          resolve({
            valid: false,
            error: `Image height exceeds ${maxHeight}px`,
          });
        } else {
          resolve({ valid: true });
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({
          valid: false,
          error: 'Failed to load image',
        });
      };

      img.src = url;
    }) as any;
  }

  return { valid: true };
};

// ============================================================================
// Common File Type Validators
// ============================================================================

export const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const documentTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
export const videoTypes = ['video/mp4', 'video/webm', 'video/ogg'];

export const validateImageFile = (file: File, maxSize = 5 * 1024 * 1024) =>
  validateFile(file, { maxSize, allowedTypes: imageTypes });

export const validateDocumentFile = (file: File, maxSize = 10 * 1024 * 1024) =>
  validateFile(file, { maxSize, allowedTypes: documentTypes });

export const validateVideoFile = (file: File, maxSize = 100 * 1024 * 1024) =>
  validateFile(file, { maxSize, allowedTypes: videoTypes });

// ============================================================================
// Data Validation
// ============================================================================

/**
 * Validate that a value is not empty
 */
export const isNotEmpty = <T>(value: T | null | undefined): value is T => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string' && value.trim().length === 0) return false;
  if (Array.isArray(value) && value.length === 0) return false;
  return true;
};

/**
 * Validate numeric range
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

/**
 * Validate that a number is positive
 */
export const isPositive = (value: number): boolean => {
  return value > 0;
};

// ============================================================================
// XSS Protection
// ============================================================================

/**
 * Sanitize HTML to prevent XSS attacks
 */
export const sanitizeHtml = (html: string): string => {
  // Remove script tags and their content
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove event handlers
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');

  return sanitized;
};

/**
 * Escape HTML special characters
 */
export const escapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
    '/': '&#x2F;',
  };

  return text.replace(/[&<>"'/]/g, (char) => map[char]);
};

// ============================================================================
// Form Validation Helpers
// ============================================================================

/**
 * Validate required fields
 */
export const validateRequired = (value: any, fieldName: string): string | undefined => {
  if (!isNotEmpty(value)) {
    return `${fieldName} is required`;
  }
  return undefined;
};

/**
 * Validate field length
 */
export const validateLength = (
  value: string,
  min: number,
  max: number,
  fieldName: string
): string | undefined => {
  if (value.length < min) {
    return `${fieldName} must be at least ${min} characters`;
  }
  if (value.length > max) {
    return `${fieldName} must not exceed ${max} characters`;
  }
  return undefined;
};

/**
 * Combine multiple validators
 */
export const combineValidators = (
  value: any,
  validators: Array<(value: any) => string | undefined>
): string | undefined => {
  for (const validator of validators) {
    const error = validator(value);
    if (error) return error;
  }
  return undefined;
};

// ============================================================================
// Export All
// ============================================================================

export const validationUtils = {
  email: {
    isValid: isValidEmail,
    schema: emailSchema,
  },
  password: {
    checkStrength: checkPasswordStrength,
    schema: passwordSchema,
  },
  username: {
    isValid: isValidUsername,
    schema: usernameSchema,
  },
  url: {
    isValid: isValidUrl,
    schema: urlSchema,
  },
  phone: {
    isValid: isValidPhone,
    schema: phoneSchema,
  },
  file: {
    validate: validateFile,
    image: validateImageFile,
    document: validateDocumentFile,
    video: validateVideoFile,
  },
  data: {
    notEmpty: isNotEmpty,
    inRange: isInRange,
    isPositive: isPositive,
  },
  security: {
    sanitizeHtml,
    escapeHtml,
  },
  form: {
    validateRequired,
    validateLength,
    combineValidators,
  },
};
