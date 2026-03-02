/**
 * 国际化配置
 */

export const i18n = {
  defaultLocale: 'zh-CN',
  locales: ['zh-CN', 'en-US', 'ja-JP'],
} as const;

export type Locale = (typeof i18n)['locales'][number];

/**
 * 获取默认语言
 */
export function getDefaultLocale(): Locale {
  if (typeof window === 'undefined') return i18n.defaultLocale;

  const browserLang = navigator.language;
  if (i18n.locales.includes(browserLang as Locale)) {
    return browserLang as Locale;
  }

  return i18n.defaultLocale;
}

/**
 * 获取语言显示名称
 */
export function getLocaleDisplayName(locale: Locale): string {
  const names: Record<Locale, string> = {
    'zh-CN': '简体中文',
    'en-US': 'English',
    'ja-JP': '日本語',
  };

  return names[locale] || locale;
}

/**
 * 获取所有语言
 */
export function getAllLocales(): Array<{ code: Locale; name: string }> {
  return i18n.locales.map((locale) => ({
    code: locale,
    name: getLocaleDisplayName(locale),
  }));
}
