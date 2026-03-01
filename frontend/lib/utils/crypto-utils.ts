/**
 * 加密工具函数集合
 * 提供各种常用的加密、解密、哈希功能
 */

/**
 * 生成随机字符串
 */
export const generateRandomString = (length: number = 16): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
};

/**
 * 生成 UUID v4
 */
export const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * 生成 NanoID
 */
export const generateNanoID = (size: number = 21): string => {
  const chars = 'ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZI';
  let result = '';

  for (let i = 0; i < size; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
};

/**
 * 生成安全的随机数
 */
export const generateSecureRandom = (min: number, max: number): number => {
  const range = max - min + 1;
  const bytesNeeded = Math.ceil(Math.log2(range) / 8);
  const cutoff = Math.floor(256 ** bytesNeeded / range) * range;
  const bytes = new Uint8Array(bytesNeeded);

  let value;
  do {
    crypto.getRandomValues(bytes);
    value = 0;
    for (let i = 0; i < bytesNeeded; i++) {
      value = (value << 8) + bytes[i];
    }
  } while (value >= cutoff);

  return min + (value % range);
};

/**
 * 计算字符串哈希（简单实现）
 */
export const simpleHash = (str: string): string => {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return Math.abs(hash).toString(36);
};

/**
 * 计算 SHA-256 哈希
 */
export const sha256 = async (message: string): Promise<string> => {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * 计算 SHA-512 �哈希
 */
export const sha512 = async (message: string): Promise<string> => {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-512', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * 计算文件哈希
 */
export const calculateFileHash = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Base64 编码
 */
export const base64Encode = (str: string): string => {
  if (typeof btoa !== 'undefined') {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    }));
  }
  return Buffer.from(str).toString('base64');
};

/**
 * Base64 解码
 */
export const base64Decode = (str: string): string => {
  if (typeof atob !== 'undefined') {
    return decodeURIComponent(
      atob(str)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  }
  return Buffer.from(str, 'base64').toString();
};

/**
 * Base64 URL 编码（URL 安全）
 */
export const base64UrlEncode = (str: string): string => {
  return base64Encode(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

/**
 * Base64 URL 解码（URL 安全）
 */
export const base64UrlDecode = (str: string): string => {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return base64Decode(base64);
};

/**
 * 十六进制编码
 */
export const hexEncode = (str: string): string => {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    result += str.charCodeAt(i).toString(16).padStart(2, '0');
  }
  return result;
};

/**
 * 十六进制解码
 */
export const hexDecode = (hex: string): string => {
  let result = '';
  for (let i = 0; i < hex.length; i += 2) {
    result += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return result;
};

/**
 * UTF-8 编码
 */
export const utf8Encode = (str: string): string => {
  return encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
    return String.fromCharCode(parseInt(p1, 16));
  });
};

/**
 * UTF-8 解码
 */
export const utf8Decode = (str: string): string => {
  return decodeURIComponent(
    str.split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
  );
};

/**
 * XOR 加密/解密
 */
export const xorCipher = (str: string, key: string): string => {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    result += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return result;
};

/**
 * 凯撒密码加密
 */
export const caesarCipher = (str: string, shift: number): string => {
  return str.replace(/[a-zA-Z]/g, (char) => {
    const base = char <= 'Z' ? 65 : 97;
    return String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26) + base);
  });
};

/**
 * ROT13 加密
 */
export const rot13 = (str: string): string => {
  return caesarCipher(str, 13);
};

/**
 * 简单的字符串混淆
 */
export const obfuscate = (str: string): string => {
  return str.split('').map(c => {
    const code = c.charCodeAt(0);
    return `\\u${code.toString(16).padStart(4, '0')}`;
  }).join('');
};

/**
 * 反混淆字符串
 */
export const deobfuscate = (str: string): string => {
  return str.replace(/\\u[\dA-Fa-f]{4}/g, (match) => {
    return String.fromCharCode(parseInt(match.replace('\\u', ''), 16));
  });
};

/**
 * 生成密码哈希（使用 PBKDF2）
 */
export const deriveKey = async (
  password: string,
  salt: string,
  iterations: number = 100000
): Promise<string> => {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: encoder.encode(salt),
      iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );

  const hashArray = Array.from(new Uint8Array(derivedBits));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * 生成 HMAC
 */
export const hmac = async (message: string, secret: string): Promise<string> => {
  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(message)
  );

  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * AES-GCM 加密
 */
export const aesEncrypt = async (data: string, key: string): Promise<{
  ciphertext: string;
  iv: string;
}> => {
  const encoder = new TextEncoder();
  const keyBytes = encoder.encode(key.padEnd(32, '0').slice(0, 32));

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    encoder.encode(data)
  );

  const ciphertext = Array.from(new Uint8Array(encrypted));
  const ivArray = Array.from(iv);

  return {
    ciphertext: btoa(String.fromCharCode.apply(null, ciphertext)),
    iv: btoa(String.fromCharCode.apply(null, ivArray)),
  };
};

/**
 * AES-GCM 解密
 */
export const aesDecrypt = async (
  ciphertext: string,
  iv: string,
  key: string
): Promise<string> => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const keyBytes = encoder.encode(key.padEnd(32, '0').slice(0, 32));

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );

  const ciphertextBytes = new Uint8Array(
    atob(ciphertext).split('').map(c => c.charCodeAt(0))
  );
  const ivBytes = new Uint8Array(
    atob(iv).split('').map(c => c.charCodeAt(0))
  );

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: ivBytes },
    cryptoKey,
    ciphertextBytes
  );

  return decoder.decode(decrypted);
};

/**
 * 生成 RSA 密钥对
 */
export const generateRSAKeyPair = async () => {
  return await crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['encrypt', 'decrypt']
  );
};

/**
 * RSA 公钥导出
 */
export const exportPublicKey = async (key: CryptoKey): Promise<string> => {
  const exported = await crypto.subtle.exportKey('spki', key);
  const exportedAsBase64 = btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(exported))));
  return exportedAsBase64;
};

/**
 * RSA 私钥导出
 */
export const exportPrivateKey = async (key: CryptoKey): Promise<string> => {
  const exported = await crypto.subtle.exportKey('pkcs8', key);
  const exportedAsBase64 = btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(exported))));
  return exportedAsBase64;
};

/**
 * RSA 公钥导入
 */
export const importPublicKey = async (pem: string): Promise<CryptoKey> => {
  const binaryDerString = atob(pem);
  const binaryDer = new Uint8Array(binaryDerString.length);
  for (let i = 0; i < binaryDerString.length; i++) {
    binaryDer[i] = binaryDerString.charCodeAt(i);
  }

  return await crypto.subtle.importKey(
    'spki',
    binaryDer.buffer,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    true,
    ['encrypt']
  );
};

/**
 * RSA 私钥导入
 */
export const importPrivateKey = async (pem: string): Promise<CryptoKey> => {
  const binaryDerString = atob(pem);
  const binaryDer = new Uint8Array(binaryDerString.length);
  for (let i = 0; i < binaryDerString.length; i++) {
    binaryDer[i] = binaryDerString.charCodeAt(i);
  }

  return await crypto.subtle.importKey(
    'pkcs8',
    binaryDer.buffer,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    true,
    ['decrypt']
  );
};

/**
 * RSA 加密
 */
export const rsaEncrypt = async (data: string, publicKey: CryptoKey): Promise<string> => {
  const encoder = new TextEncoder();
  const encrypted = await crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    publicKey,
    encoder.encode(data)
  );

  const encryptedArray = Array.from(new Uint8Array(encrypted));
  return btoa(String.fromCharCode.apply(null, encryptedArray));
};

/**
 * RSA 解密
 */
export const rsaDecrypt = async (
  ciphertext: string,
  privateKey: CryptoKey
): Promise<string> => {
  const decoder = new TextDecoder();
  const ciphertextBytes = new Uint8Array(
    atob(ciphertext).split('').map(c => c.charCodeAt(0))
  );

  const decrypted = await crypto.subtle.decrypt(
    { name: 'RSA-OAEP' },
    privateKey,
    ciphertextBytes
  );

  return decoder.decode(decrypted);
};

/**
 * 生成 OTP (One-Time Password)
 */
export const generateOTP = (length: number = 6): string => {
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
};

/**
 * 生成字母数字 OTP
 */
export const generateAlphaNumericOTP = (length: number = 8): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 排除容易混淆的字符
  let otp = '';

  for (let i = 0; i < length; i++) {
    otp += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return otp;
};

/**
 * 验证 OTP
 */
export const verifyOTP = (
  otp: string,
  userOtp: string,
  expiresIn: number = 300000 // 5 minutes
): { valid: boolean; expired?: boolean } => {
  if (otp !== userOtp) {
    return { valid: false };
  }

  // 这里可以添加时间戳验证逻辑
  return { valid: true };
};

export default {
  generateRandomString,
  generateUUID,
  generateNanoID,
  generateSecureRandom,
  simpleHash,
  sha256,
  sha512,
  calculateFileHash,
  base64Encode,
  base64Decode,
  base64UrlEncode,
  base64UrlDecode,
  hexEncode,
  hexDecode,
  utf8Encode,
  utf8Decode,
  xorCipher,
  caesarCipher,
  rot13,
  obfuscate,
  deobfuscate,
  deriveKey,
  hmac,
  aesEncrypt,
  aesDecrypt,
  generateRSAKeyPair,
  exportPublicKey,
  exportPrivateKey,
  importPublicKey,
  importPrivateKey,
  rsaEncrypt,
  rsaDecrypt,
  generateOTP,
  generateAlphaNumericOTP,
  verifyOTP,
};
