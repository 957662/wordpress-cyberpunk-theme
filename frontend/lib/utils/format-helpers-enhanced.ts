/**
 * 格式化助手工具函数
 * 提供各种数据格式化功能
 */

/**
 * 格式化数字为带单位的形式
 */
export function formatNumberWithUnit(
  value: number,
  unit: string,
  options: { showPlus?: boolean; decimals?: number } = {}
): string {
  const { showPlus = false, decimals = 0 } = options;
  const sign = value > 0 && showPlus ? '+' : '';
  return `${sign}${value.toFixed(decimals)}${unit}`;
}

/**
 * 格式化字节大小
 */
export function formatBytes(
  bytes: number,
  decimals: number = 2,
  binary: boolean = false
): string {
  const base = binary ? 1024 : 1000;
  const units = binary
    ? ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
    : ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  if (bytes === 0) return '0 B';

  const exponent = Math.floor(Math.log(bytes) / Math.log(base));
  const value = bytes / Math.pow(base, exponent);
  const unit = units[exponent];

  return `${value.toFixed(decimals)} ${unit}`;
}

/**
 * 格式化百分比
 */
export function formatPercentage(
  value: number,
  decimals: number = 1,
  options: { showSymbol?: boolean; multiplyBy100?: boolean } = {}
): string {
  const { showSymbol = true, multiplyBy100 = false } = options;
  const percentage = multiplyBy100 ? value * 100 : value;
  const symbol = showSymbol ? '%' : '';
  return `${percentage.toFixed(decimals)}${symbol}`;
}

/**
 * 格式化货币
 */
export function formatCurrency(
  value: number,
  currency: string = 'USD',
  locale: string = 'en-US',
  options: Intl.NumberFormatOptions = {}
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    ...options,
  }).format(value);
}

/**
 * 格式化数字为缩写形式
 */
export function formatNumberAbbreviated(
  value: number,
  options: { decimals?: number; useSpace?: boolean } = {}
): string {
  const { decimals = 1, useSpace = false } = options;
  const space = useSpace ? ' ' : '';
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (absValue >= 1e15) return `${sign}${(absValue / 1e15).toFixed(decimals)}${space}Q`;
  if (absValue >= 1e12) return `${sign}${(absValue / 1e12).toFixed(decimals)}${space}T`;
  if (absValue >= 1e9) return `${sign}${(absValue / 1e9).toFixed(decimals)}${space}B`;
  if (absValue >= 1e6) return `${sign}${(absValue / 1e6).toFixed(decimals)}${space}M`;
  if (absValue >= 1e3) return `${sign}${(absValue / 1e3).toFixed(decimals)}${space}K`;

  return `${sign}${absValue}`;
}

/**
 * 格式化时间范围
 */
export function formatTimeRange(
  seconds: number,
  options: { showSeconds?: boolean; abbreviated?: boolean } = {}
): string {
  const { showSeconds = false, abbreviated = false } = options;

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours}${abbreviated ? 'h' : ' hr'}`);
  }

  if (minutes > 0 || hours > 0) {
    parts.push(`${minutes}${abbreviated ? 'm' : ' min'}`);
  }

  if (showSeconds || (hours === 0 && minutes === 0)) {
    parts.push(`${secs}${abbreviated ? 's' : ' sec'}`);
  }

  return parts.join(abbreviated ? '' : ' ');
}

/**
 * 格式化日期范围
 */
export function formatDateRange(
  startDate: Date | string,
  endDate: Date | string,
  locale: string = 'en-US',
  options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const startFormatted = start.toLocaleDateString(locale, options);
  const endFormatted = end.toLocaleDateString(locale, options);

  // 如果是同一年
  if (start.getFullYear() === end.getFullYear()) {
    // 如果是同一月
    if (start.getMonth() === end.getMonth()) {
      return `${start.getMonth() + 1}/${start.getDate()}-${end.getDate()}/${end.getFullYear()}`;
    }
    return `${startFormatted} - ${endFormatted}, ${end.getFullYear()}`;
  }

  return `${startFormatted} - ${endFormatted}`;
}

/**
 * 格式化列表
 */
export function formatList(
  items: string[],
  locale: string = 'en-US',
  options: { conjunction?: string; maxLength?: number } = {}
): string {
  const { conjunction = 'or', maxLength } = options;

  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return items.join(` ${conjunction} `);

  const displayItems = maxLength ? items.slice(0, maxLength) : items;
  const lastItem = displayItems.pop();
  const conjunctionWord = locale === 'en-US' ? conjunction : '和';

  return `${displayItems.join(', ')}${conjunctionWord === 'or' ? ',' : ''} ${conjunctionWord} ${lastItem}${maxLength && items.length > maxLength ? ` (+${items.length - maxLength} more)` : ''}`;
}

/**
 * 格式化电话号码
 */
export function formatPhoneNumber(
  phoneNumber: string,
  format: 'US' | 'International' | 'E164' = 'US'
): string {
  const cleaned = phoneNumber.replace(/\D/g, '');

  if (format === 'E164') {
    return `+${cleaned}`;
  }

  if (format === 'International') {
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    if (cleaned.length <= 9) return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    return `+${cleaned.slice(0, cleaned.length - 10)} ${cleaned.slice(-10, -7)} ${cleaned.slice(-7, -4)} ${cleaned.slice(-4)}`;
  }

  // US format
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  return phoneNumber;
}

/**
 * 格式化信用卡号
 */
export function formatCreditCard(cardNumber: string, separator: string = ' '): string {
  const cleaned = cardNumber.replace(/\D/g, '');
  const groups = cleaned.match(/.{1,4}/g) || [];
  return groups.join(separator);
}

/**
 * 格式化 SSN (社会安全号)
 */
export function formatSSN(ssn: string): string {
  const cleaned = ssn.replace(/\D/g, '');
  if (cleaned.length >= 9) {
    return `***-**-${cleaned.slice(-4)}`;
  }
  if (cleaned.length >= 5) {
    return `***-${cleaned.slice(3, 5)}-${cleaned.slice(5)}`;
  }
  if (cleaned.length >= 4) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  }
  return cleaned;
}

/**
 * 格式化进度
 */
export function formatProgress(
  current: number,
  total: number,
  options: { decimals?: number; showPercentage?: boolean; showFraction?: boolean } = {}
): string {
  const { decimals = 1, showPercentage = true, showFraction = false } = options;

  const percentage = total > 0 ? (current / total) * 100 : 0;
  const parts: string[] = [];

  if (showPercentage) {
    parts.push(`${percentage.toFixed(decimals)}%`);
  }

  if (showFraction) {
    parts.push(`${current}/${total}`);
  }

  return parts.join(' ');
}

/**
 * 格式化分数
 */
export function formatFraction(
  numerator: number,
  denominator: number,
  options: { simplify?: boolean; useUnicode?: boolean } = {}
): string {
  const { simplify = true, useUnicode = false } = options;

  if (denominator === 0) return '∞';

  if (!simplify) {
    if (useUnicode) {
      const vulgarFractions: Record<string, string> = {
        '1/2': '½',
        '1/3': '⅓',
        '2/3': '⅔',
        '1/4': '¼',
        '3/4': '¾',
        '1/5': '⅕',
        '2/5': '⅖',
        '3/5': '⅗',
        '4/5': '⅘',
        '1/6': '⅙',
        '5/6': '⅚',
        '1/7': '⅐',
        '1/8': '⅛',
        '3/8': '⅜',
        '5/8': '⅝',
        '7/8': '⅞',
        '1/9': '⅑',
        '1/10': '⅒',
      };
      const key = `${numerator}/${denominator}`;
      if (vulgarFractions[key]) return vulgarFractions[key];
    }
    return `${numerator}/${denominator}`;
  }

  // 计算最大公约数
  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  const divisor = gcd(Math.abs(numerator), Math.abs(denominator));
  const simplifiedNum = numerator / divisor;
  const simplifiedDen = denominator / divisor;

  if (simplifiedDen === 1) return `${simplifiedNum}`;

  return `${simplifiedNum}/${simplifiedDen}`;
}
