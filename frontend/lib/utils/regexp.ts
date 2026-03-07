/**
 * 正则表达式工具函数
 */

/**
 * 验证邮箱地址
 */
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * 验证 URL
 */
export const urlRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

/**
 * 验证中国手机号
 */
export const phoneRegex = /^1[3-9]\d{9}$/;

/**
 * 验证身份证号
 */
export const idCardRegex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;

/**
 * 验证用户名（4-20位，字母数字下划线）
 */
export const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/;

/**
 * 验证密码（至少8位，包含字母和数字）
 */
export const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

/**
 * 验证 IPv4 地址
 */
export const ipv4Regex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

/**
 * 验证十六进制颜色
 */
export const hexColorRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;

/**
 * 验证 MAC 地址
 */
export const macAddressRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;

/**
 * 匹配中文
 */
export const chineseRegex = /[\u4e00-\u9fa5]/;

/**
 * 匹配 HTML 标签
 */
export const htmlTagRegex = /<[^>]*>/g;

/**
 * 移除 HTML 标签
 */
export function stripHtmlTags(html: string): string {
  return html.replace(htmlTagRegex, '');
}

/**
 * 提取所有邮箱地址
 */
export function extractEmails(text: string): string[] {
  const matches = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi);
  return matches || [];
}

/**
 * 提取所有 URL
 */
export function extractUrls(text: string): string[] {
  const matches = text.match(/(https?:\/\/[^\s]+)/gi);
  return matches || [];
}

/**
 * 转义正则表达式特殊字符
 */
export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 替换所有匹配项
 */
export function replaceAll(str: string, search: string, replacement: string): string {
  return str.replace(new RegExp(escapeRegExp(search), 'g'), replacement);
}

/**
 * 检查字符串是否匹配正则表达式
 */
export function matchesRegex(str: string, regex: RegExp): boolean {
  return regex.test(str);
}
