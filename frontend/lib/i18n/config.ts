// i18n 配置文件
export const i18nConfig = {
  // 默认语言
  defaultLocale: 'en',
  
  // 支持的语言列表
  locales: [
    {
      code: 'en',
      name: 'English',
      flag: '🇺🇸',
      dir: 'ltr',
    },
    {
      code: 'zh',
      name: '简体中文',
      flag: '🇨🇳',
      dir: 'ltr',
    },
    {
      code: 'ja',
      name: '日本語',
      flag: '🇯🇵',
      dir: 'ltr',
    },
    {
      code: 'ko',
      name: '한국어',
      flag: '🇰🇷',
      dir: 'ltr',
    },
    {
      code: 'es',
      name: 'Español',
      flag: '🇪🇸',
      dir: 'ltr',
    },
    {
      code: 'fr',
      name: 'Français',
      flag: '🇫🇷',
      dir: 'ltr',
    },
    {
      code: 'de',
      name: 'Deutsch',
      flag: '🇩🇪',
      dir: 'ltr',
    },
    {
      code: 'ar',
      name: 'العربية',
      flag: '🇸🇦',
      dir: 'rtl',
    },
  ] as const,

  // Cookie 名称
  cookieName: 'cyberpress_locale',

  // 本地存储键名
  storageKey: 'cyberpress_locale',
} as const;

export type Locale = (typeof i18nConfig.locales)[number]['code'];
export type LocaleConfig = typeof i18nConfig;

export default i18nConfig;
