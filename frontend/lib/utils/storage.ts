/**
 * Storage Utilities
 *
 * Helper functions for localStorage and sessionStorage.
 */

/**
 * Get item from localStorage
 */
export function getLocalStorageItem<T>(key: string, defaultValue?: T): T | null {
  if (typeof window === 'undefined') return defaultValue ?? null;

  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue ?? null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue ?? null;
  }
}

/**
 * Set item in localStorage
 */
export function setLocalStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
}

/**
 * Remove item from localStorage
 */
export function removeLocalStorageItem(key: string): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
}

/**
 * Clear all localStorage
 */
export function clearLocalStorage(): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}

/**
 * Get item from sessionStorage
 */
export function getSessionStorageItem<T>(key: string, defaultValue?: T): T | null {
  if (typeof window === 'undefined') return defaultValue ?? null;

  try {
    const item = window.sessionStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue ?? null;
  } catch (error) {
    console.error('Error reading from sessionStorage:', error);
    return defaultValue ?? null;
  }
}

/**
 * Set item in sessionStorage
 */
export function setSessionStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;

  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error writing to sessionStorage:', error);
  }
}

/**
 * Remove item from sessionStorage
 */
export function removeSessionStorageItem(key: string): void {
  if (typeof window === 'undefined') return;

  try {
    window.sessionStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from sessionStorage:', error);
  }
}
