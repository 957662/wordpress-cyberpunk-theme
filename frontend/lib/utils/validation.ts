/**
 * Validation Utilities
 *
 * Helper functions for data validation.
 */

/**
 * Check if string is a valid email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if string is a valid URL
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
 * Check if string is a valid slug
 */
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  issues: string[];
} {
  const issues: string[] = [];

  if (password.length < 8) {
    issues.push('Password must be at least 8 characters');
  }

  if (!/[a-z]/.test(password)) {
    issues.push('Password must contain lowercase letters');
  }

  if (!/[A-Z]/.test(password)) {
    issues.push('Password must contain uppercase letters');
  }

  if (!/\d/.test(password)) {
    issues.push('Password must contain numbers');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    issues.push('Password must contain special characters');
  }

  const isValid = issues.length === 0;

  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (isValid) {
    strength = 'strong';
  } else if (issues.length <= 2) {
    strength = 'medium';
  }

  return { isValid, strength, issues };
}
