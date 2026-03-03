/**
 * Cyber-themed utility functions for CyberPress platform
 */

/**
 * Generates a cyber-random ID with hex characters
 */
export function generateCyberId(prefix: string = 'cyber'): string {
  const timestamp = Date.now().toString(16);
  const random = Math.random().toString(16).substring(2, 8);
  return `${prefix}_${timestamp}_${random}`;
}

/**
 * Converts text to cyber-case (lowercase with underscores)
 */
export function toCyberCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

/**
 * Generates a cyber color palette based on a base color
 */
export function generateCyberPalette(baseColor: string): {
  primary: string;
  secondary: string;
  accent: string;
  glow: string;
} {
  // This is a simplified version - in production, use a color manipulation library
  const colors = {
    cyan: {
      primary: '#06b6d4',
      secondary: '#0891b2',
      accent: '#22d3ee',
      glow: 'rgba(6, 182, 212, 0.5)',
    },
    magenta: {
      primary: '#d946ef',
      secondary: '#c026d3',
      accent: '#e879f9',
      glow: 'rgba(217, 70, 239, 0.5)',
    },
    default: {
      primary: '#06b6d4',
      secondary: '#0891b2',
      accent: '#22d3ee',
      glow: 'rgba(6, 182, 212, 0.5)',
    },
  };

  return colors[baseColor as keyof typeof colors] || colors.default;
}

/**
 * Creates a glitch effect string for text animations
 */
export function createGlitchText(text: string): {
  original: string;
  glitch1: string;
  glitch2: string;
} {
  const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  const glitch1 = text
    .split('')
    .map(char => (Math.random() > 0.7 ? chars[Math.floor(Math.random() * chars.length)] : char))
    .join('');

  const glitch2 = text
    .split('')
    .map(char => (Math.random() > 0.8 ? chars[Math.floor(Math.random() * chars.length)] : char))
    .join('');

  return {
    original: text,
    glitch1,
    glitch2,
  };
}

/**
 * Formats bytes to human-readable size with cyber styling
 */
export function formatCyberSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)}${units[unitIndex]}`;
}

/**
 * Generates a cyber-style timestamp
 */
export function getCyberTimestamp(): string {
  const now = new Date();
  const timestamp = now.getTime().toString(16).toUpperCase();
  return `0x${timestamp}`;
}

/**
 * Validates cyber-format usernames
 */
export function isValidCyberUsername(username: string): boolean {
  const cyberUsernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return cyberUsernameRegex.test(username);
}

/**
 * Truncates text with cyber-style ellipsis
 */
export function truncateCyber(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}[...]`;
}

/**
 * Creates a cyber-gradient string
 */
export function cyberGradient(
  colors: string[] = ['#06b6d4', '#d946ef', '#f59e0b'],
  direction: string = 'to right'
): string {
  return `linear-gradient(${direction}, ${colors.join(', ')})`;
}

/**
 * Generates a random cyber-hex color
 */
export function randomCyberColor(): string {
  const cyberColors = [
    '#06b6d4', // Cyan
    '#d946ef', // Fuchsia
    '#f59e0b', // Amber
    '#10b981', // Emerald
    '#8b5cf6', // Violet
    '#ef4444', // Red
    '#3b82f6', // Blue
  ];

  return cyberColors[Math.floor(Math.random() * cyberColors.length)];
}

/**
 * Formats numbers with cyber-style separators
 */
export function formatCyberNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '_');
}

/**
 * Debounce function for performance optimization
 */
export function cyberDebounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for scroll/resize events
 */
export function cyberThrottle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
