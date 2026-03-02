/**
 * Cryptography utility functions for CyberPress Platform
 * Note: For production, use a proper crypto library like crypto-js or Web Crypto API
 */

import { createHash, randomBytes, createCipheriv, createDecipheriv } from 'crypto';

// Simple hashing (for demo purposes - use proper crypto in production)
export async function hashString(input: string, algorithm: 'md5' | 'sha256' | 'sha512' = 'sha256'): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generate random string
export function generateRandomString(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomValues = new Uint8Array(length);

  crypto.getRandomValues(randomValues);

  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length];
  }

  return result;
}

// Generate UUID v4
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Generate numeric OTP
export function generateOTP(length: number = 6): string {
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
}

// Generate alphanumeric code
export function generateCode(length: number = 8): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No ambiguous characters
  let result = '';
  const randomValues = new Uint8Array(length);

  crypto.getRandomValues(randomValues);

  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length];
  }

  return result;
}

// Generate API key
export function generateAPIKey(prefix: string = 'cp'): string {
  const timestamp = Date.now().toString(36);
  const randomPart = generateRandomString(32);
  return `${prefix}_${timestamp}_${randomPart}`;
}

// Generate token
export function generateToken(secret: string, payload: any): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const encodedPayload = btoa(JSON.stringify({ ...payload, iat: Date.now() }));
  const signature = btoa(`${header}.${encodedPayload}.${secret}`);
  return `${header}.${encodedPayload}.${signature}`;
}

// Simple XOR cipher (for demo - not secure!)
export function xorCipher(text: string, key: string): string {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return result;
}

// Base64 encoding
export function encodeBase64(text: string): string {
  if (typeof window === 'undefined') {
    return Buffer.from(text).toString('base64');
  }
  return btoa(text);
}

// Base64 decoding
export function decodeBase64(encoded: string): string {
  if (typeof window === 'undefined') {
    return Buffer.from(encoded, 'base64').toString();
  }
  return atob(encoded);
}

// URL-safe Base64 encoding
export function encodeBase64URL(text: string): string {
  return encodeBase64(text)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// URL-safe Base64 decoding
export function decodeBase64URL(encoded: string): string {
  let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return decodeBase64(base64);
}

// Caesar cipher (shift cipher)
export function caesarCipher(text: string, shift: number, decode: boolean = false): string {
  const actualShift = decode ? (26 - shift) % 26 : shift;
  return text.replace(/[a-zA-Z]/g, (char) => {
    const base = char <= 'Z' ? 65 : 97;
    return String.fromCharCode(((char.charCodeAt(0) - base + actualShift) % 26) + base);
  });
}

// ROT13 (special case of Caesar cipher)
export function rot13(text: string): string {
  return caesarCipher(text, 13);
}

// Vigenère cipher
export function vigenereCipher(text: string, key: string, decode: boolean = false): string {
  let result = '';
  let keyIndex = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (/[a-zA-Z]/.test(char)) {
      const base = char <= 'Z' ? 65 : 97;
      const keyChar = key[keyIndex % key.length].toLowerCase();
      const shift = keyChar.charCodeAt(0) - 97;
      const actualShift = decode ? (26 - shift) % 26 : shift;

      result += String.fromCharCode(((char.charCodeAt(0) - base + actualShift) % 26) + base);
      keyIndex++;
    } else {
      result += char;
    }
  }

  return result;
}

// Mask sensitive data
export function maskData(data: string, visibleChars: number = 4, maskChar: string = '*'): string {
  if (data.length <= visibleChars) {
    return maskChar.repeat(data.length);
  }

  const visible = data.slice(-visibleChars);
  const masked = maskChar.repeat(data.length - visibleChars);

  return masked + visible;
}

// Hash password (simple version - use bcrypt in production!)
export async function hashPassword(password: string, salt?: string): Promise<string> {
  const actualSalt = salt || generateRandomString(16);
  const hash = await hashString(actualSalt + password);
  return `${actualSalt}:${hash}`;
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const [salt, hash] = hashedPassword.split(':');
  const computedHash = await hashString(salt + password);
  return hash === computedHash;
}

// Generate CSRF token
export function generateCSRFToken(): string {
  return generateRandomString(32);
}

// Generate nonce for CSP
export function generateNonce(): string {
  return generateRandomString(16);
}

// Simple checksum
export function checksum(data: string): number {
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data.charCodeAt(i);
  }
  return sum % 256;
}

// Luhn algorithm (for credit card validation)
export function luhnChecksum(number: string): boolean {
  let sum = 0;
  let isEven = false;

  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number[i], 10);

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

// Generate fingerprint (simple version)
export async function generateFingerprint(): Promise<string> {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
  ];

  const data = components.join('|');
  return await hashString(data);
}

// Secure compare (timing-safe)
export function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}
