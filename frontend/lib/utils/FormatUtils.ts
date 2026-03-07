/**
 * Formatting Utilities
 * Helper functions for formatting data
 */

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format bytes to human readable size
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Format duration in milliseconds to human readable
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else if (seconds > 0) {
    return `${seconds}s`;
  } else {
    return `${ms}ms`;
  }
}

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string | number): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
}

/**
 * Format date to locale string
 */
export function formatDate(date: Date | string | number, locale = 'en-US', options?: Intl.DateTimeFormatOptions): string {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  });
}

/**
 * Format time to locale string
 */
export function formatTime(date: Date | string | number, locale = 'en-US', options?: Intl.DateTimeFormatOptions): string {
  return new Date(date).toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  });
}

/**
 * Format date and time to locale string
 */
export function formatDateTime(date: Date | string | number, locale = 'en-US', options?: Intl.DateTimeFormatOptions): string {
  return new Date(date).toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  });
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number, suffix = '...'): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format currency
 */
export function formatCurrency(amount: number, currency = 'USD', locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format phone number
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return `(${match[2]}) ${match[3]}-${match[4]}`;
  }

  return phone;
}

/**
 * Format credit card number
 */
export function formatCreditCard(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\D/g, '');
  const groups = cleaned.match(/.{1,4}/g);

  return groups ? groups.join(' ') : cardNumber;
}

/**
 * Format SSN (last 4 digits only)
 */
export function formatSSN(ssn: string): string {
  const cleaned = ssn.replace(/\D/g, '');
  if (cleaned.length >= 4) {
    return `***-**-${cleaned.slice(-4)}`;
  }
  return ssn;
}

/**
 * Format URL to display
 */
export function formatURL(url: string, maxLength = 50): string {
  try {
    const urlObj = new URL(url);
    return truncateText(urlObj.hostname + urlObj.pathname, maxLength);
  } catch {
    return truncateText(url, maxLength);
  }
}

/**
 * Format email for display (hide partial)
 */
export function formatEmail(email: string): string {
  const [username, domain] = email.split('@');
  if (username.length <= 3) return email;

  const visible = username.slice(0, 3);
  const hidden = '*'.repeat(username.length - 3);

  return `${visible}${hidden}@${domain}`;
}

/**
 * Format file name with extension
 */
export function formatFileName(filename: string, maxLength = 30): string {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return truncateText(filename, maxLength);
  }

  const name = filename.substring(0, lastDotIndex);
  const extension = filename.substring(lastDotIndex);

  if (name.length + extension.length <= maxLength) {
    return filename;
  }

  const maxNameLength = maxLength - extension.length - 3; // -3 for "..."
  return truncateText(name, maxNameLength) + extension;
}

/**
 * Format list with conjunction
 */
export function formatList(items: string[], conjunction = 'and'): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return items.join(` ${conjunction} `);

  return `${items.slice(0, -1).join(', ')} ${conjunction} ${items[items.length - 1]}`;
}

/**
 * Format ordinal number
 */
export function formatOrdinal(num: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const value = num % 100;
  const suffix = suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0];

  return `${num}${suffix}`;
}

/**
 * Format exponential notation
 */
export function formatExponential(num: number, decimals = 2): string {
  return num.toExponential(decimals);
}

/**
 * Format Roman numeral
 */
export function formatRoman(num: number): string {
  const romanNumerals = [
    { value: 1000, symbol: 'M' },
    { value: 900, symbol: 'CM' },
    { value: 500, symbol: 'D' },
    { value: 400, symbol: 'CD' },
    { value: 100, symbol: 'C' },
    { value: 90, symbol: 'XC' },
    { value: 50, symbol: 'L' },
    { value: 40, symbol: 'XL' },
    { value: 10, symbol: 'X' },
    { value: 9, symbol: 'IX' },
    { value: 5, symbol: 'V' },
    { value: 4, symbol: 'IV' },
    { value: 1, symbol: 'I' },
  ];

  let result = '';
  let remaining = num;

  for (const { value, symbol } of romanNumerals) {
    while (remaining >= value) {
      result += symbol;
      remaining -= value;
    }
  }

  return result;
}

/**
 * Format reading time
 */
export function formatReadingTime(wordCount: number, wordsPerMinute = 200): string {
  const minutes = Math.ceil(wordCount / wordsPerMinute);

  if (minutes < 1) return 'Less than 1 min read';
  if (minutes === 1) return '1 min read';
  if (minutes < 60) return `${minutes} min read`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours}h ${remainingMinutes}m read`;
}

/**
 * Format address
 */
export function formatAddress(address: {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}): string {
  const parts: string[] = [];

  if (address.street) parts.push(address.street);
  if (address.city) parts.push(address.city);
  if (address.state) parts.push(address.state);
  if (address.zip) parts.push(address.zip);
  if (address.country) parts.push(address.country);

  return parts.join(', ');
}

/**
 * Format coordinates
 */
export function formatCoordinates(lat: number, lng: number, decimals = 6): string {
  return `${lat.toFixed(decimals)}° ${lng.toFixed(decimals)}°`;
}

/**
 * Format temperature
 */
export function formatTemperature(celsius: number, unit: 'C' | 'F' = 'C'): string {
  if (unit === 'F') {
    return `${Math.round((celsius * 9/5) + 32)}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

/**
 * Format speed
 */
export function formatSpeed(mps: number, unit: 'kmh' | 'mph' = 'kmh'): string {
  if (unit === 'mph') {
    return `${(mps * 2.23694).toFixed(1)} mph`;
  }
  return `${(mps * 3.6).toFixed(1)} km/h`;
}

/**
 * Format distance
 */
export function formatDistance(meters: number, unit: 'km' | 'mi' = 'km'): string {
  if (unit === 'mi') {
    const miles = meters * 0.000621371;
    return miles >= 1 ? `${miles.toFixed(1)} mi` : `${(miles * 5280).toFixed(0)} ft`;
  }

  const km = meters / 1000;
  return km >= 1 ? `${km.toFixed(1)} km` : `${meters.toFixed(0)} m`;
}
