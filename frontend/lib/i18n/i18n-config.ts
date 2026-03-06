/**
 * i18n Configuration - 国际化配置
 * 支持多语言切换
 */

export const defaultLocale = 'zh-CN';
export const locales = ['zh-CN', 'en-US', 'ja-JP'] as const;
export type Locale = (typeof locales)[number];

export interface LocaleMessages {
  [key: string]: string | LocaleMessages;
}

// 中文（简体）
const zhCN: LocaleMessages = {
  common: {
    loading: '加载中...',
    error: '出错了',
    success: '成功',
    cancel: '取消',
    confirm: '确认',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    search: '搜索',
    back: '返回',
    next: '下一步',
    prev: '上一步',
    submit: '提交',
    close: '关闭',
  },
  nav: {
    home: '首页',
    blog: '博客',
    portfolio: '作品集',
    about: '关于',
    contact: '联系',
    dashboard: '仪表盘',
    settings: '设置',
  },
  blog: {
    title: '博客',
    readMore: '阅读更多',
    views: '浏览',
    likes: '点赞',
    comments: '评论',
    share: '分享',
    bookmark: '收藏',
    readingTime: '{minutes} 分钟阅读',
    relatedPosts: '相关文章',
    recentPosts: '最新文章',
  },
  auth: {
    login: '登录',
    register: '注册',
    logout: '退出登录',
    email: '邮箱',
    password: '密码',
    confirmPassword: '确认密码',
    forgotPassword: '忘记密码？',
    rememberMe: '记住我',
  },
  error: {
    notFound: '页面未找到',
    serverError: '服务器错误',
    unauthorized: '未授权',
    forbidden: '禁止访问',
  },
};

// 英文
const enUS: LocaleMessages = {
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    search: 'Search',
    back: 'Back',
    next: 'Next',
    prev: 'Previous',
    submit: 'Submit',
    close: 'Close',
  },
  nav: {
    home: 'Home',
    blog: 'Blog',
    portfolio: 'Portfolio',
    about: 'About',
    contact: 'Contact',
    dashboard: 'Dashboard',
    settings: 'Settings',
  },
  blog: {
    title: 'Blog',
    readMore: 'Read More',
    views: 'Views',
    likes: 'Likes',
    comments: 'Comments',
    share: 'Share',
    bookmark: 'Bookmark',
    readingTime: '{minutes} min read',
    relatedPosts: 'Related Posts',
    recentPosts: 'Recent Posts',
  },
  auth: {
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    forgotPassword: 'Forgot Password?',
    rememberMe: 'Remember Me',
  },
  error: {
    notFound: 'Page Not Found',
    serverError: 'Server Error',
    unauthorized: 'Unauthorized',
    forbidden: 'Forbidden',
  },
};

// 日文
const jaJP: LocaleMessages = {
  common: {
    loading: '読み込み中...',
    error: 'エラー',
    success: '成功',
    cancel: 'キャンセル',
    confirm: '確認',
    save: '保存',
    delete: '削除',
    edit: '編集',
    search: '検索',
    back: '戻る',
    next: '次へ',
    prev: '前へ',
    submit: '送信',
    close: '閉じる',
  },
  nav: {
    home: 'ホーム',
    blog: 'ブログ',
    portfolio: 'ポートフォリオ',
    about: 'について',
    contact: '連絡先',
    dashboard: 'ダッシュボード',
    settings: '設定',
  },
  blog: {
    title: 'ブログ',
    readMore: 'もっと読む',
    views: '閲覧',
    likes: 'いいね',
    comments: 'コメント',
    share: '共有',
    bookmark: 'ブックマーク',
    readingTime: '{minutes} 分で読める',
    relatedPosts: '関連記事',
    recentPosts: '最新記事',
  },
  auth: {
    login: 'ログイン',
    register: '登録',
    logout: 'ログアウト',
    email: 'メールアドレス',
    password: 'パスワード',
    confirmPassword: 'パスワード確認',
    forgotPassword: 'パスワードをお忘れですか？',
    rememberMe: 'ログイン状態を保持',
  },
  error: {
    notFound: 'ページが見つかりません',
    serverError: 'サーバーエラー',
    unauthorized: '認証されていません',
    forbidden: 'アクセス禁止',
  },
};

export const messages: Record<Locale, LocaleMessages> = {
  'zh-CN': zhCN,
  'en-US': enUS,
  'ja-JP': jaJP,
};

/**
 * 获取嵌套对象值
 */
export function getNestedValue(obj: LocaleMessages, path: string): string {
  return path.split('.').reduce((o: any, p) => o?.[p], obj) || path;
}

/**
 * 获取翻译文本
 */
export function t(locale: Locale, key: string, params?: Record<string, string | number>): string {
  const localeMessages = messages[locale] || messages[defaultLocale];
  let text = getNestedValue(localeMessages, key);

  // 替换参数
  if (params) {
    Object.entries(params).forEach(([param, value]) => {
      text = text.replace(`{${param}}`, String(value));
    });
  }

  return text;
}

/**
 * 获取浏览器语言
 */
export function getBrowserLocale(): Locale {
  if (typeof window === 'undefined') return defaultLocale;

  const browserLang = navigator.language;

  // 检查是否完全匹配
  if (locales.includes(browserLang as Locale)) {
    return browserLang as Locale;
  }

  // 检查语言前缀
  const langPrefix = browserLang.split('-')[0];
  const matchedLocale = locales.find((locale) => locale.startsWith(langPrefix));

  return matchedLocale || defaultLocale;
}

/**
 * 检测RTL语言
 */
export function isRTL(locale: Locale): boolean {
  const rtlLocales: Locale[] = [];
  return rtlLocales.includes(locale);
}

/**
 * 获取语言名称
 */
export function getLocaleName(locale: Locale, displayLocale: Locale = locale): string {
  const names: Record<Locale, Record<Locale, string>> = {
    'zh-CN': {
      'zh-CN': '简体中文',
      'en-US': 'Simplified Chinese',
      'ja-JP': '簡体字中国語',
    },
    'en-US': {
      'zh-CN': 'Simplified Chinese',
      'en-US': 'English',
      'ja-JP': 'Simplified Chinese',
    },
    'ja-JP': {
      'zh-CN': '簡体字中国語',
      'en-US': '簡体字中国語',
      'ja-JP': '簡体字中国語',
    },
  };

  return names[locale]?.[displayLocale] || locale;
}

/**
 * 获取所有可用语言
 */
export function getAvailableLocales(): Array<{ code: Locale; name: string }> {
  return locales.map((locale) => ({
    code: locale,
    name: getLocaleName(locale),
  }));
}

export default {
  defaultLocale,
  locales,
  messages,
  t,
  getBrowserLocale,
  isRTL,
  getLocaleName,
  getAvailableLocales,
};
