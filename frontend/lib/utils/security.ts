/**
 * Security Utilities - 安全工具函数
 *
 * 提供安全相关的工具函数：
 * - XSS 防护
 * - CSRF 防护
 * - 数据加密
 * - 输入验证
 * - 内容安全策略
 */

/**
 * Escape HTML - 转义 HTML 特殊字符
 */
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Unescape HTML - 反转义 HTML 特殊字符
 */
export function unescapeHtml safe: string): string {
  return safe
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
}

/**
 * Sanitize HTML - 清理 HTML，移除危险标签和属性
 */
export function sanitizeHtml(html: string): string {
  // 危险标签黑名单
  const dangerousTags = [
    'script',
    'iframe',
    'object',
    'embed',
    'form',
    'input',
    'button',
    'textarea',
    'select',
    'option',
    'link',
    'meta',
    'style',
  ];

  // 危险属性黑名单
  const dangerousAttrs = [
    'onload',
    'onerror',
    'onclick',
    'onmouseover',
    'onfocus',
    'onblur',
    'onsubmit',
    'javascript:',
    'data:',
    'vbscript:',
  ];

  let sanitized = html;

  // 移除危险标签
  dangerousTags.forEach((tag) => {
    const regex = new RegExp(`<${tag}[^>]*>.*?</${tag}>`, 'gis');
    sanitized = sanitized.replace(regex, '');
    const selfClosingRegex = new RegExp(`<${tag}[^>]*/>`, 'gis');
    sanitized = sanitized.replace(selfClosingRegex, '');
  });

  // 移除危险属性
  dangerousAttrs.forEach((attr) => {
    const regex = new RegExp(`\\s${attr}\\s*=\\s*["'][^"']*["']`, 'gis');
    sanitized = sanitized.replace(regex, '');
  });

  // 移除注释中的脚本
  sanitized = sanitized.replace(/<!--[\s\S]*?-->/g, '');

  return sanitized;
}

/**
 * Strip Tags - 移除所有 HTML 标签
 */
export function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Validate URL - 验证 URL 是否安全
 */
export function validateUrl(url: string): boolean {
  try {
    const parsed = new URL(url);

    // 只允许 http 和 https 协议
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return false;
    }

    // 检查是否为 javascript: 或 data: 协议
    if (url.trim().startsWith('javascript:') || url.trim().startsWith('data:')) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitize URL - 清理 URL
 */
export function sanitizeUrl(url: string): string {
  if (!validateUrl(url)) {
    return 'about:blank';
  }
  return url;
}

/**
 * Generate Random String - 生成随机字符串
 */
export function generateRandomString(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomValues = new Uint32Array(length);

  // 使用 crypto.getRandomValues 获取安全的随机数
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(randomValues);
    for (let i = 0; i < length; i++) {
      result += chars[randomValues[i] % chars.length];
    }
  } else {
    // Fallback
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }

  return result;
}

/**
 * Generate UUID v4 - 生成 UUID v4
 */
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback implementation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Hash String - 简单的字符串哈希（用于非安全场景）
 */
export function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Encode Base64 - Base64 编码
 */
export function encodeBase64(str: string): string {
  if (typeof btoa !== 'undefined') {
    return btoa(unescape(encodeURIComponent(str)));
  }
  // Node.js environment
  return Buffer.from(str).toString('base64');
}

/**
 * Decode Base64 - Base64 解码
 */
export function decodeBase64(str: string): string {
  if (typeof atob !== 'undefined') {
    return decodeURIComponent(escape(atob(str)));
  }
  // Node.js environment
  return Buffer.from(str, 'base64').toString();
}

/**
 * Validate Email - 验证邮箱地址
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate Phone - 验证手机号（中国大陆）
 */
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
}

/**
 * Validate ID Card - 验证身份证号（中国大陆）
 */
export function validateIDCard(idCard: string): boolean {
  // 18位身份证号码正则
  const idCardRegex = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;

  if (!idCardRegex.test(idCard)) {
    return false;
  }

  // 验证校验位
  const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

  let sum = 0;
  for (let i = 0; i < 17; i++) {
    sum += parseInt(idCard[i]) * weights[i];
  }

  const checkCode = checkCodes[sum % 11];
  return checkCode === idCard[17].toUpperCase();
}

/**
 * Validate Password Strength - 验证密码强度
 */
export interface PasswordStrength {
  score: number; // 0-4
  level: 'weak' | 'fair' | 'good' | 'strong';
  suggestions: string[];
}

export function validatePasswordStrength(password: string): PasswordStrength {
  const suggestions: string[] = [];
  let score = 0;

  // 长度检查
  if (password.length >= 8) score++;
  else suggestions.push('密码长度至少为8位');

  if (password.length >= 12) score++;

  // 包含小写字母
  if (/[a-z]/.test(password)) score++;
  else suggestions.push('包含小写字母');

  // 包含大写字母
  if (/[A-Z]/.test(password)) score++;
  else suggestions.push('包含大写字母');

  // 包含数字
  if (/\d/.test(password)) score++;
  else suggestions.push('包含数字');

  // 包含特殊字符
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
  else suggestions.push('包含特殊字符');

  // 没有连续字符
  if (!/(.)\1{2,}/.test(password)) score++;
  else suggestions.push('避免连续相同字符');

  // 没有常见模式
  const commonPatterns = [
    '123456',
    'password',
    'qwerty',
    'abc123',
    '111111',
    'admin',
  ];
  const hasCommonPattern = commonPatterns.some((pattern) =>
    password.toLowerCase().includes(pattern)
  );
  if (!hasCommonPattern) score++;
  else suggestions.push('避免常见密码模式');

  // 最终分数 (0-4)
  const finalScore = Math.min(Math.floor(score / 2), 4);

  let level: PasswordStrength['level'];
  if (finalScore <= 1) level = 'weak';
  else if (finalScore === 2) level = 'fair';
  else if (finalScore === 3) level = 'good';
  else level = 'strong';

  return {
    score: finalScore,
    level,
    suggestions,
  };
}

/**
 * Detect XSS - 检测潜在的 XSS 攻击
 */
export function detectXSS(input: string): boolean {
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gis,
    /<iframe[^>]*>.*?<\/iframe>/gis,
    /javascript:/gis,
    /onerror\s*=/gis,
    /onload\s*=/gis,
    /onclick\s*=/gis,
    /<embed[^>]*>/gis,
    /<object[^>]*>/gis,
  ];

  return xssPatterns.some((pattern) => pattern.test(input));
}

/**
 * Detect SQL Injection - 检测潜在的 SQL 注入
 */
export function detectSQLInjection(input: string): boolean {
  const sqlPatterns = [
    /(\bor\b|\band\b).*?=/gis,
    /('|(\')|(\-\-)|(;))/gis,
    /\/\*/gis,
    /\*\/gis,
    /exec(\s|\+)+(s|x)p\w+/gis,
    /union(\s|\+)+(select|all|distinct)/gis,
  ];

  return sqlPatterns.some((pattern) => pattern.test(input));
}

/**
 * CSRF Token Generator - 生成 CSRF Token
 */
export function generateCSRFToken(): string {
  return generateRandomString(64);
}

/**
 * Validate CSRF Token - 验证 CSRF Token
 */
export function validateCSRFToken(token: string, storedToken: string): boolean {
  return token === storedToken && token.length > 0;
}

/**
 * Content Security Policy - 生成 CSP 头
 */
export interface CSPConfig {
  'default-src'?: string[];
  'script-src'?: string[];
  'style-src'?: string[];
  'img-src'?: string[];
  'font-src'?: string[];
  'connect-src'?: string[];
  'media-src'?: string[];
  'object-src'?: string[];
  'frame-src'?: string[];
  'base-uri'?: string[];
  'form-action'?: string[];
  'frame-ancestors'?: string[];
}

export function generateCSP(config: CSPConfig): string {
  const directives = Object.entries(config)
    .map(([directive, sources]) => {
      const sourcesStr = sources.join(' ');
      return `${directive} ${sourcesStr}`;
    })
    .join('; ');

  return directives;
}

/**
 * Default CSP Config - 默认 CSP 配置
 */
export const defaultCSPConfig: CSPConfig = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'https:'],
  'font-src': ["'self'", 'data:'],
  'connect-src': ["'self'"],
  'media-src': ["'self'"],
  'object-src': ["'none'"],
  'frame-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
};

/**
 * Mask Sensitive Data - 掩码敏感数据
 */
export function maskSensitiveData(
  data: string,
  visibleChars: number = 4,
  maskChar: string = '*'
): string {
  if (data.length <= visibleChars) {
    return maskChar.repeat(data.length);
  }

  const visible = data.substring(0, visibleChars);
  const masked = maskChar.repeat(data.length - visibleChars);
  return visible + masked;
}

/**
 * Mask Email - 掩码邮箱地址
 */
export function maskEmail(email: string): string {
  const [username, domain] = email.split('@');
  if (!domain) return email;

  const visibleChars = Math.min(3, username.length);
  const maskedUsername =
    username.substring(0, visibleChars) + '*'.repeat(username.length - visibleChars);

  return `${maskedUsername}@${domain}`;
}

/**
 * Mask Phone - 掩码手机号
 */
export function maskPhone(phone: string): string {
  if (phone.length < 7) return phone;

  return phone.substring(0, 3) + '****' + phone.substring(phone.length - 4);
}

/**
 * Rate Limiter - 简单的速率限制器
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 5, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  /**
   * Check - 检查是否超过限制
   */
  check(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];

    // 移除过期的时间戳
    const validRequests = requests.filter((time) => now - time < this.windowMs);

    if (validRequests.length >= this.maxRequests) {
      return false;
    }

    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    return true;
  }

  /**
   * Reset - 重置限制
   */
  reset(identifier: string): void {
    this.requests.delete(identifier);
  }

  /**
   * Get Remaining - 获取剩余请求次数
   */
  getRemaining(identifier: string): number {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    const validRequests = requests.filter((time) => now - time < this.windowMs);
    return Math.max(0, this.maxRequests - validRequests.length);
  }

  /**
   * Get Reset Time - 获取重置时间
   */
  getResetTime(identifier: string): number {
    const requests = this.requests.get(identifier);
    if (!requests || requests.length === 0) return 0;

    const oldestRequest = Math.min(...requests);
    return oldestRequest + this.windowMs;
  }
}

/**
 * Security Headers - 生成安全相关的 HTTP 头
 */
export interface SecurityHeadersConfig {
  enableCSP?: boolean;
  enableHSTS?: boolean;
  enableXFrameOptions?: boolean;
  enableXContentTypeOptions?: boolean;
  enableReferrerPolicy?: boolean;
  enablePermissionsPolicy?: boolean;
  cspConfig?: CSPConfig;
  hstsMaxAge?: number;
  frameAction?: 'deny' | 'sameorigin';
}

export function generateSecurityHeaders(config: SecurityHeadersConfig = {}): Record<string, string> {
  const headers: Record<string, string> = {
    'X-DNS-Prefetch-Control': 'off',
    'Strict-Transport-Security': `max-age=${config.hstsMaxAge || 31536000}; includeSubDomains`,
    'X-Frame-Options': config.frameAction || 'sameorigin',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  };

  if (config.enableCSP && config.cspConfig) {
    headers['Content-Security-Policy'] = generateCSP(config.cspConfig);
  }

  return headers;
}
