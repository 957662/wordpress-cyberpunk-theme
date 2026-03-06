/**
 * 安全工具函数
 * 用于数据验证、清理和防护
 */

/**
 * 清理 HTML 字符串，防止 XSS 攻击
 */
export function sanitizeHTML(html: string): string {
  const temp = document.createElement('div');
  temp.textContent = html;
  return temp.innerHTML;
}

/**
 * 转义 HTML 特殊字符
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
    '/': '&#x2F;',
  };
  
  return text.replace(/[&<>"'/]/g, char => map[char]);
}

/**
 * 验证 URL 是否安全
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * 验证邮箱地址
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 验证手机号（中国大陆）
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
}

/**
 * 验证密码强度
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  issues: string[];
} {
  const issues: string[] = [];
  
  if (password.length < 8) {
    issues.push('密码长度至少为8位');
  }
  
  if (!/[a-z]/.test(password)) {
    issues.push('密码必须包含小写字母');
  }
  
  if (!/[A-Z]/.test(password)) {
    issues.push('密码必须包含大写字母');
  }
  
  if (!/\d/.test(password)) {
    issues.push('密码必须包含数字');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    issues.push('密码必须包含特殊字符');
  }
  
  const score = 5 - issues.length;
  
  let strength: 'weak' | 'medium' | 'strong';
  if (score <= 2) strength = 'weak';
  else if (score <= 3) strength = 'medium';
  else strength = 'strong';
  
  return {
    isValid: issues.length === 0,
    strength,
    issues,
  };
}

/**
 * 生成安全的随机字符串
 */
export function generateSecureRandom(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const values = new Uint8Array(length);
    crypto.getRandomValues(values);
    
    for (let i = 0; i < length; i++) {
      result += chars[values[i] % chars.length];
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
 * 生成 CSRF Token
 */
export function generateCSRFToken(): string {
  return generateSecureRandom(64);
}

/**
 * 验证 CSRF Token
 */
export function validateCSRFToken(token: string, storedToken: string): boolean {
  return token === storedToken && token.length > 0;
}

/**
 * 哈希字符串（简单实现）
 */
export async function hashString(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * 验证数据签名
 */
export async function verifySignature(
  data: string,
  signature: string,
  publicKey: string
): Promise<boolean> {
  try {
    const dataBuffer = new TextEncoder().encode(data);
    const signatureBuffer = new Uint8Array(
      signature.match(/[\da-f]{2}/gi)!.map(h => parseInt(h, 16))
    );
    
    const publicKeyBuffer = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(publicKey),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    
    return await crypto.subtle.verify(
      'HMAC',
      publicKeyBuffer,
      signatureBuffer,
      dataBuffer
    );
  } catch {
    return false;
  }
}

/**
 * 检测 SQL 注入模式
 */
export function detectSQLInjection(input: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
    /(--|\#|\/\*|\*\/)/,
    /(\bOR\b|\bAND\b).*=.*=/i,
    /('.*')/,
    /(\bxp_\w+\b)/i,
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
}

/**
 * 检测 XSS 攻击模式
 */
export function detectXSS(input: string): boolean {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
    /<embed\b[^>]*>/gi,
  ];
  
  return xssPatterns.some(pattern => pattern.test(input));
}

/**
 * 清理用户输入
 */
export function sanitizeUserInput(input: string): string {
  // 移除危险字符
  let cleaned = input.replace(/[<>]/g, '');
  
  // 检测并阻止潜在攻击
  if (detectSQLInjection(cleaned) || detectXSS(cleaned)) {
    throw new Error('检测到潜在的安全威胁');
  }
  
  return cleaned.trim();
}

/**
 * 验证文件类型
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

/**
 * 验证文件大小
 */
export function validateFileSize(file: File, maxSizeInMB: number): boolean {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
}

/**
 * 生成安全的文件名
 */
export function sanitizeFileName(fileName: string): string {
  // 移除路径和特殊字符
  const sanitized = fileName
    .replace(/^.*[\\\/]/, '') // 移除路径
    .replace(/[^a-zA-Z0-9.-]/g, '_') // 替换特殊字符
    .replace(/_{2,}/g, '_') // 合并多个下划线
    .toLowerCase();
  
  // 确保文件名不为空
  return sanitized || 'unnamed_file';
}

/**
 * 验证 JWT Token
 */
export function parseJWT(token: string): {
  header: any;
  payload: any;
  signature: string;
} | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const header = JSON.parse(atob(parts[0]));
    const payload = JSON.parse(atob(parts[1]));
    const signature = parts[2];
    
    return { header, payload, signature };
  } catch {
    return null;
  }
}

/**
 * 检查 Token 是否过期
 */
export function isTokenExpired(token: string): boolean {
  const parsed = parseJWT(token);
  if (!parsed || !parsed.payload.exp) return true;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return parsed.payload.exp < currentTime;
}

/**
 * 速率限制检测
 */
export class RateLimiter {
  private requests: number[] = [];
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  canMakeRequest(): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    // 移除窗口外的请求
    this.requests = this.requests.filter(time => time > windowStart);

    if (this.requests.length < this.maxRequests) {
      this.requests.push(now);
      return true;
    }

    return false;
  }

  getRemainingRequests(): number {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    const recentRequests = this.requests.filter(time => time > windowStart);
    return Math.max(0, this.maxRequests - recentRequests.length);
  }

  getResetTime(): number {
    if (this.requests.length === 0) return 0;
    const oldestRequest = Math.min(...this.requests);
    return oldestRequest + this.windowMs;
  }
}

/**
 * 创建速率限制器实例
 */
export function createRateLimiter(maxRequests?: number, windowMs?: number): RateLimiter {
  return new RateLimiter(maxRequests, windowMs);
}
