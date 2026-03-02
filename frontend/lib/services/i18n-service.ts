/**
 * i18n Service - 国际化服务
 * 支持多语言翻译、日期格式化、数字格式化等
 */

export type Locale = 'zh' | 'en' | 'ja' | 'ko' | 'es' | 'fr' | 'de' | 'ru';
export type Namespace = string;

export interface I18nConfig {
  /** 默认语言 */
  defaultLocale: Locale;
  /** 支持的语言列表 */
  locales: Locale[];
  /** 回退语言 */
  fallbackLocale: Locale;
  /** 命名空间 */
  namespaces?: Namespace[];
  /** 是否启用浏览器语言检测 */
  detection?: boolean;
  /** 语言存储键名 */
  storageKey?: string;
}

export interface TranslationResources {
  [locale: string]: {
    [namespace: string]: {
      [key: string]: string | TranslationResources;
    };
  };
}

export interface FormatOptions {
  /** 格式化选项 */
  format?: string;
  /** 货币代码 */
  currency?: string;
  /** 日期格式 */
  dateFormat?: 'short' | 'medium' | 'long' | 'full';
  /** 时间格式 */
  timeFormat?: 'short' | 'medium' | 'long';
  /** 时区 */
  timeZone?: string;
}

class I18nService {
  private config: Required<I18nConfig>;
  private currentLocale: Locale;
  private resources: TranslationResources = {};
  private changeListeners: Set<(locale: Locale) => void> = new Set();

  constructor(config: I18nConfig) {
    this.config = {
      defaultLocale: config.defaultLocale,
      locales: config.locales,
      fallbackLocale: config.fallbackLocale,
      namespaces: config.namespaces || ['common'],
      detection: config.detection ?? true,
      storageKey: config.storageKey || 'locale',
    };

    this.currentLocale = this.detectLocale();
  }

  /**
   * 初始化 i18n 服务
   */
  async init(resources: TranslationResources): Promise<void> {
    this.resources = resources;

    // 预加载所有命名空间
    await this.loadNamespaces(this.config.namespaces);
  }

  /**
   * 添加翻译资源
   */
  addResources(locale: Locale, namespace: Namespace, resources: Record<string, string>): void {
    if (!this.resources[locale]) {
      this.resources[locale] = {};
    }

    this.resources[locale][namespace] = {
      ...this.resources[locale][namespace],
      ...resources,
    };
  }

  /**
   * 加载命名空间
   */
  async loadNamespaces(namespaces: Namespace[]): Promise<void> {
    // 这里可以实现异步加载翻译文件的逻辑
    // 目前资源已经通过 init() 方法加载
  }

  /**
   * 翻译文本
   */
  t(key: string, options?: Record<string, any>): string {
    const [namespace, ...keyParts] = key.split('.');
    const fullKey = keyParts.join('.');

    return this.translate(this.currentLocale, namespace, fullKey, options);
  }

  /**
   * 翻译文本（指定命名空间）
   */
  tn(namespace: Namespace, key: string, options?: Record<string, any>): string {
    return this.translate(this.currentLocale, namespace, key, options);
  }

  /**
   * 切换语言
   */
  async changeLocale(locale: Locale): Promise<void> {
    if (!this.config.locales.includes(locale)) {
      console.warn(`Locale ${locale} is not supported`);
      return;
    }

    this.currentLocale = locale;

    // 保存到本地存储
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.config.storageKey, locale);
      document.documentElement.lang = locale;
    }

    // 通知监听器
    this.changeListeners.forEach(listener => listener(locale));
  }

  /**
   * 获取当前语言
   */
  getLocale(): Locale {
    return this.currentLocale;
  }

  /**
   * 获取所有支持的语言
   */
  getLocales(): Locale[] {
    return this.config.locales;
  }

  /**
   * 是否是 RTL 语言
   */
  isRTL(): boolean {
    const rtlLocales: Locale[] = ['ar', 'he', 'fa'];
    return rtlLocales.includes(this.currentLocale);
  }

  /**
   * 格式化日期
   */
  formatDate(date: Date | string | number, options?: FormatOptions): string {
    const dateObj = typeof date === 'object' ? date : new Date(date);
    const locale = this.toLocaleString(this.currentLocale);

    return new Intl.DateTimeFormat(locale, {
      dateStyle: options?.dateFormat || 'medium',
      timeZone: options?.timeZone,
    }).format(dateObj);
  }

  /**
   * 格式化时间
   */
  formatTime(time: Date | string | number, options?: FormatOptions): string {
    const timeObj = typeof time === 'object' ? time : new Date(time);
    const locale = this.toLocaleString(this.currentLocale);

    return new Intl.DateTimeFormat(locale, {
      timeStyle: options?.timeFormat || 'short',
      timeZone: options?.timeZone,
    }).format(timeObj);
  }

  /**
   * 格式化日期时间
   */
  formatDateTime(
    dateTime: Date | string | number,
    options?: FormatOptions
  ): string {
    const dateObj = typeof dateTime === 'object' ? dateTime : new Date(dateTime);
    const locale = this.toLocaleString(this.currentLocale);

    return new Intl.DateTimeFormat(locale, {
      dateStyle: options?.dateFormat || 'medium',
      timeStyle: options?.timeFormat || 'short',
      timeZone: options?.timeZone,
    }).format(dateObj);
  }

  /**
   * 格式化数字
   */
  formatNumber(
    value: number,
    options?: Intl.NumberFormatOptions
  ): string {
    const locale = this.toLocaleString(this.currentLocale);
    return new Intl.NumberFormat(locale, options).format(value);
  }

  /**
   * 格式化货币
   */
  formatCurrency(
    value: number,
    currency: string = 'CNY',
    options?: Intl.NumberFormatOptions
  ): string {
    const locale = this.toLocaleString(this.currentLocale);
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      ...options,
    }).format(value);
  }

  /**
   * 格式化百分比
   */
  formatPercent(value: number, options?: Intl.NumberFormatOptions): string {
    const locale = this.toLocaleString(this.currentLocale);
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      ...options,
    }).format(value);
  }

  /**
   * 格式化相对时间
   */
  formatRelativeTime(
    value: number,
    unit: Intl.RelativeTimeFormatUnit,
    options?: Intl.RelativeTimeFormatOptions
  ): string {
    const locale = this.toLocaleString(this.currentLocale);
    return new Intl.RelativeTimeFormat(locale, options).format(value, unit);
  }

  /**
   * 复数处理
   */
  plural(count: number, forms: Record<string, string>): string {
    const locale = this.currentLocale;
    const key = new Intl.PluralRules(locale).select(count);
    return forms[key] || forms.other;
  }

  /**
   * 监听语言变化
   */
  onLocaleChange(callback: (locale: Locale) => void): () => void {
    this.changeListeners.add(callback);

    return () => {
      this.changeListeners.delete(callback);
    };
  }

  // ============= Private Methods =============

  private translate(
    locale: Locale,
    namespace: Namespace,
    key: string,
    options?: Record<string, any>
  ): string {
    // 获取翻译
    let translation = this.getTranslation(locale, namespace, key);

    // 如果找不到，尝试回退语言
    if (!translation && locale !== this.config.fallbackLocale) {
      translation = this.getTranslation(
        this.config.fallbackLocale,
        namespace,
        key
      );
    }

    // 如果还是找不到，返回 key
    if (!translation) {
      console.warn(`Translation not found: ${namespace}.${key}`);
      return key;
    }

    // 替换占位符
    if (options) {
      Object.keys(options).forEach(optionKey => {
        const regex = new RegExp(`\\{\\{${optionKey}\\}\\}`, 'g');
        translation = translation.replace(regex, String(options[optionKey]));
      });
    }

    return translation;
  }

  private getTranslation(
    locale: Locale,
    namespace: Namespace,
    key: string
  ): string | null {
    const localeResources = this.resources[locale];
    if (!localeResources) return null;

    const namespaceResources = localeResources[namespace];
    if (!namespaceResources) return null;

    // 支持嵌套 key (例如: 'user.profile.name')
    const keys = key.split('.');
    let value: any = namespaceResources;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return null;
      }
    }

    return typeof value === 'string' ? value : null;
  }

  private detectLocale(): Locale {
    // 1. 尝试从本地存储读取
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(this.config.storageKey);
      if (stored && this.config.locales.includes(stored as Locale)) {
        return stored as Locale;
      }

      // 2. 尝试从浏览器语言检测
      if (this.config.detection) {
        const browserLang = navigator.language.split('-')[0] as Locale;
        if (this.config.locales.includes(browserLang)) {
          return browserLang;
        }
      }
    }

    // 3. 返回默认语言
    return this.config.defaultLocale;
  }

  private toLocaleString(locale: Locale): string {
    const localeMap: Record<Locale, string> = {
      zh: 'zh-CN',
      en: 'en-US',
      ja: 'ja-JP',
      ko: 'ko-KR',
      es: 'es-ES',
      fr: 'fr-FR',
      de: 'de-DE',
      ru: 'ru-RU',
    };

    return localeMap[locale] || locale;
  }
}

// ============= Export Factory =============

const defaultConfig: I18nConfig = {
  defaultLocale: 'zh',
  locales: ['zh', 'en'],
  fallbackLocale: 'zh',
  namespaces: ['common'],
  detection: true,
  storageKey: 'locale',
};

let i18nInstance: I18nService | null = null;

export function createI18nService(config?: Partial<I18nConfig>): I18nService {
  if (!i18nInstance) {
    i18nInstance = new I18nService({ ...defaultConfig, ...config });
  }

  return i18nInstance;
}

export function getI18nService(): I18nService | null {
  return i18nInstance;
}

export function useI18n() {
  const service = getI18nService();

  if (!service) {
    throw new Error('i18n service not initialized. Call createI18nService first.');
  }

  return {
    locale: service.getLocale(),
    t: (key: string, options?: Record<string, any>) => service.t(key, options),
    changeLocale: (locale: Locale) => service.changeLocale(locale),
    formatDate: (date: Date | string | number, options?: FormatOptions) =>
      service.formatDate(date, options),
    formatTime: (time: Date | string | number, options?: FormatOptions) =>
      service.formatTime(time, options),
    formatNumber: (value: number, options?: Intl.NumberFormatOptions) =>
      service.formatNumber(value, options),
    formatCurrency: (value: number, currency?: string, options?: Intl.NumberFormatOptions) =>
      service.formatCurrency(value, currency, options),
  };
}

export default I18nService;
