/**
 * Date Utility Library
 * Comprehensive date manipulation and calculation functions
 */

/**
 * Get the start of day (00:00:00)
 */
export const startOfDay = (date: Date = new Date()): Date => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

/**
 * Get the end of day (23:59:59)
 */
export const endOfDay = (date: Date = new Date()): Date => {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};

/**
 * Get the start of week
 */
export const startOfWeek = (date: Date = new Date(), startDay: number = 0): Date => {
  const result = new Date(date);
  const day = result.getDay();
  const diff = (day - startDay + 7) % 7;

  result.setDate(result.getDate() - diff);
  result.setHours(0, 0, 0, 0);

  return result;
};

/**
 * Get the end of week
 */
export const endOfWeek = (date: Date = new Date(), startDay: number = 0): Date => {
  const result = startOfWeek(date, startDay);
  result.setDate(result.getDate() + 6);
  result.setHours(23, 59, 59, 999);

  return result;
};

/**
 * Get the start of month
 */
export const startOfMonth = (date: Date = new Date()): Date => {
  const result = new Date(date);
  result.setDate(1);
  result.setHours(0, 0, 0, 0);

  return result;
};

/**
 * Get the end of month
 */
export const endOfMonth = (date: Date = new Date()): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + 1);
  result.setDate(0);
  result.setHours(23, 59, 59, 999);

  return result;
};

/**
 * Get the start of year
 */
export const startOfYear = (date: Date = new Date()): Date => {
  const result = new Date(date);
  result.setMonth(0, 1);
  result.setHours(0, 0, 0, 0);

  return result;
};

/**
 * Get the end of year
 */
export const endOfYear = (date: Date = new Date()): Date => {
  const result = new Date(date);
  result.setMonth(11, 31);
  result.setHours(23, 59, 59, 999);

  return result;
};

/**
 * Add days to date
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Subtract days from date
 */
export const subDays = (date: Date, days: number): Date => {
  return addDays(date, -days);
};

/**
 * Add months to date
 */
export const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

/**
 * Subtract months from date
 */
export const subMonths = (date: Date, months: number): Date => {
  return addMonths(date, -months);
};

/**
 * Add years to date
 */
export const addYears = (date: Date, years: number): Date => {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
};

/**
 * Subtract years from date
 */
export const subYears = (date: Date, years: number): Date => {
  return addYears(date, -years);
};

/**
 * Add hours to date
 */
export const addHours = (date: Date, hours: number): Date => {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
};

/**
 * Add minutes to date
 */
export const addMinutes = (date: Date, minutes: number): Date => {
  const result = new Date(date);
  result.setMinutes(result.getMinutes() + minutes);
  return result;
};

/**
 * Add seconds to date
 */
export const addSeconds = (date: Date, seconds: number): Date => {
  const result = new Date(date);
  result.setSeconds(result.getSeconds() + seconds);
  return result;
};

/**
 * Get difference in days between two dates
 */
export const differenceInDays = (dateLeft: Date, dateRight: Date): number => {
  const left = startOfDay(dateLeft);
  const right = startOfDay(dateRight);

  return Math.round((left.getTime() - right.getTime()) / (1000 * 60 * 60 * 24));
};

/**
 * Get difference in hours between two dates
 */
export const differenceInHours = (dateLeft: Date, dateRight: Date): number => {
  return Math.round((dateLeft.getTime() - dateRight.getTime()) / (1000 * 60 * 60));
};

/**
 * Get difference in minutes between two dates
 */
export const differenceInMinutes = (dateLeft: Date, dateRight: Date): number => {
  return Math.round((dateLeft.getTime() - dateRight.getTime()) / (1000 * 60));
};

/**
 * Get difference in seconds between two dates
 */
export const differenceInSeconds = (dateLeft: Date, dateRight: Date): number => {
  return Math.round((dateLeft.getTime() - dateRight.getTime()) / 1000);
};

/**
 * Check if two dates are the same day
 */
export const isSameDay = (dateLeft: Date, dateRight: Date): boolean => {
  return (
    dateLeft.getFullYear() === dateRight.getFullYear() &&
    dateLeft.getMonth() === dateRight.getMonth() &&
    dateLeft.getDate() === dateRight.getDate()
  );
};

/**
 * Check if date is today
 */
export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

/**
 * Check if date is yesterday
 */
export const isYesterday = (date: Date): boolean => {
  return isSameDay(date, subDays(new Date(), 1));
};

/**
 * Check if date is tomorrow
 */
export const isTomorrow = (date: Date): boolean => {
  return isSameDay(date, addDays(new Date(), 1));
};

/**
 * Check if date is this week
 */
export const isThisWeek = (date: Date, startDay: number = 0): boolean => {
  const start = startOfWeek(new Date(), startDay);
  const end = endOfWeek(new Date(), startDay);

  return date >= start && date <= end;
};

/**
 * Check if date is this month
 */
export const isThisMonth = (date: Date): boolean => {
  const now = new Date();

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth()
  );
};

/**
 * Check if date is this year
 */
export const isThisYear = (date: Date): boolean => {
  return date.getFullYear() === new Date().getFullYear();
};

/**
 * Check if date is in the past
 */
export const isPast = (date: Date): boolean => {
  return date < new Date();
};

/**
 * Check if date is in the future
 */
export const isFuture = (date: Date): boolean => {
  return date > new Date();
};

/**
 * Check if date is within given range
 */
export const isWithinRange = (date: Date, startDate: Date, endDate: Date): boolean => {
  return date >= startDate && date <= endDate;
};

/**
 * Get days in month
 */
export const getDaysInMonth = (date: Date = new Date()): number => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + 1);
  result.setDate(0);

  return result.getDate();
};

/**
 * Get week of year
 */
export const getWeekOfYear = (date: Date = new Date()): number => {
  const start = startOfYear(date);
  const diff = differenceInDays(date, start);

  return Math.ceil((diff + 1) / 7);
};

/**
 * Get day of year
 */
export const getDayOfYear = (date: Date = new Date()): number => {
  const start = startOfYear(date);

  return differenceInDays(date, start) + 1;
};

/**
 * Get quarter of year
 */
export const getQuarter = (date: Date = new Date()): number => {
  return Math.floor(date.getMonth() / 3) + 1;
};

/**
 * Get age from birthdate
 */
export const getAge = (birthDate: Date | string): number => {
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

/**
 * Format date to ISO string without timezone
 */
export const toISODate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

/**
 * Parse ISO date string
 */
export const parseISODate = (isoString: string): Date => {
  return new Date(isoString);
};

/**
 * Get date range for given period
 */
export const getDateRange = (
  period: 'today' | 'yesterday' | 'thisWeek' | 'lastWeek' | 'thisMonth' | 'lastMonth' | 'thisYear' | 'lastYear',
  startDay: number = 0
): { start: Date; end: Date } => {
  const now = new Date();

  switch (period) {
    case 'today':
      return { start: startOfDay(now), end: endOfDay(now) };

    case 'yesterday':
      const yesterday = subDays(now, 1);
      return { start: startOfDay(yesterday), end: endOfDay(yesterday) };

    case 'thisWeek':
      return { start: startOfWeek(now, startDay), end: endOfWeek(now, startDay) };

    case 'lastWeek':
      const lastWeekStart = subDays(startOfWeek(now, startDay), 7);
      const lastWeekEnd = subDays(endOfWeek(now, startDay), 7);
      return { start: lastWeekStart, end: lastWeekEnd };

    case 'thisMonth':
      return { start: startOfMonth(now), end: endOfMonth(now) };

    case 'lastMonth':
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
      return { start: startOfDay(lastMonthStart), end: endOfDay(lastMonthEnd) };

    case 'thisYear':
      return { start: startOfYear(now), end: endOfYear(now) };

    case 'lastYear':
      const lastYearStart = new Date(now.getFullYear() - 1, 0, 1);
      const lastYearEnd = new Date(now.getFullYear() - 1, 11, 31);
      return { start: startOfDay(lastYearStart), end: endOfDay(lastYearEnd) };

    default:
      return { start: startOfDay(now), end: endOfDay(now) };
  }
};

/**
 * Convert date to another timezone
 */
export const convertTimezone = (date: Date, timezone: string): Date => {
  const str = new Date(date).toLocaleString('en-US', { timeZone: timezone });
  return new Date(str);
};

/**
 * Get list of timezones
 */
export const getTimezones = (): string[] => {
  return [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Dubai',
    'Australia/Sydney'
  ];
};

export default {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  addDays,
  subDays,
  addMonths,
  subMonths,
  addYears,
  subYears,
  addHours,
  addMinutes,
  addSeconds,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  isSameDay,
  isToday,
  isYesterday,
  isTomorrow,
  isThisWeek,
  isThisMonth,
  isThisYear,
  isPast,
  isFuture,
  isWithinRange,
  getDaysInMonth,
  getWeekOfYear,
  getDayOfYear,
  getQuarter,
  getAge,
  toISODate,
  parseISODate,
  getDateRange,
  convertTimezone,
  getTimezones
};
