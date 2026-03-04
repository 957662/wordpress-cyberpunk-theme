/**
 * 国际化服务
 * 提供多语言支持
 */

export interface TranslationConfig {
  defaultLocale: string;
  fallbackLocale: string;
  locales: string[];
  storageKey: string;
}

export interface TranslationMessages {
  [key: string]: string | TranslationMessages;
}

type TranslationFunction = (key: string, params?: Record<string, any>) => string;

class I18nService {
  private config: TranslationConfig;
  private currentLocale: string;
  private messages: Map<string, TranslationMessages>;
  private listeners: Set<() => void>;

  constructor(config: Partial<TranslationConfig> = {}) {
    this.config = {
      defaultLocale: config.defaultLocale || 'en',
      fallbackLocale: config.fallbackLocale || 'en',
      locales: config.locales || ['en', 'zh', 'ja', 'ko'],
      storageKey: config.storageKey || 'locale',
    };

    this.currentLocale = this.loadLocaleFromStorage() || this.config.defaultLocale;
    this.messages = new Map();
    this.listeners = new Set();

    // 加载默认消息
    this.loadDefaultMessages();
  }

  /**
   * 从存储加载语言设置
   */
  private loadLocaleFromStorage(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.config.storageKey);
  }

  /**
   * 保存语言设置到存储
   */
  private saveLocaleToStorage(locale: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.config.storageKey, locale);
  }

  /**
   * 从浏览器获取语言
   */
  private getBrowserLocale(): string {
    if (typeof window === 'undefined') return this.config.defaultLocale;

    const browserLang = navigator.language;
    const locale = browserLang.split('-')[0];

    return this.config.locales.includes(locale) ? locale : this.config.defaultLocale;
  }

  /**
   * 加载默认消息
   */
  private loadDefaultMessages(): void {
    // 英文
    this.addMessages('en', {
      common: {
        appName: 'CyberPress',
        welcome: 'Welcome',
        loading: 'Loading...',
        error: 'An error occurred',
        success: 'Success',
        cancel: 'Cancel',
        confirm: 'Confirm',
        submit: 'Submit',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        search: 'Search',
        filter: 'Filter',
        sort: 'Sort',
        refresh: 'Refresh',
      },
      auth: {
        login: 'Login',
        logout: 'Logout',
        register: 'Register',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        forgotPassword: 'Forgot Password?',
        loginSuccess: 'Login successful',
        loginError: 'Login failed',
        registerSuccess: 'Registration successful',
        registerError: 'Registration failed',
      },
      blog: {
        posts: 'Posts',
        readMore: 'Read More',
        comments: 'Comments',
        share: 'Share',
        like: 'Like',
        unlike: 'Unlike',
        bookmark: 'Bookmark',
        removeBookmark: 'Remove Bookmark',
      },
      user: {
        profile: 'Profile',
        settings: 'Settings',
        notifications: 'Notifications',
        messages: 'Messages',
        followers: 'Followers',
        following: 'Following',
      },
    });

    // 中文
    this.addMessages('zh', {
      common: {
        appName: 'CyberPress',
        welcome: '欢迎',
        loading: '加载中...',
        error: '发生错误',
        success: '成功',
        cancel: '取消',
        confirm: '确认',
        submit: '提交',
        save: '保存',
        delete: '删除',
        edit: '编辑',
        search: '搜索',
        filter: '筛选',
        sort: '排序',
        refresh: '刷新',
      },
      auth: {
        login: '登录',
        logout: '退出',
        register: '注册',
        email: '邮箱',
        password: '密码',
        confirmPassword: '确认密码',
        forgotPassword: '忘记密码？',
        loginSuccess: '登录成功',
        loginError: '登录失败',
        registerSuccess: '注册成功',
        registerError: '注册失败',
      },
      blog: {
        posts: '文章',
        readMore: '阅读更多',
        comments: '评论',
        share: '分享',
        like: '点赞',
        unlike: '取消点赞',
        bookmark: '收藏',
        removeBookmark: '取消收藏',
      },
      user: {
        profile: '个人资料',
        settings: '设置',
        notifications: '通知',
        messages: '消息',
        followers: '粉丝',
        following: '关注',
      },
    });

    // 日语
    this.addMessages('ja', {
      common: {
        appName: 'CyberPress',
        welcome: 'ようこそ',
        loading: '読み込み中...',
        error: 'エラーが発生しました',
        success: '成功',
        cancel: 'キャンセル',
        confirm: '確認',
        submit: '送信',
        save: '保存',
        delete: '削除',
        edit: '編集',
        search: '検索',
        filter: 'フィルター',
        sort: 'ソート',
        refresh: '更新',
      },
      auth: {
        login: 'ログイン',
        logout: 'ログアウト',
        register: '登録',
        email: 'メール',
        password: 'パスワード',
        confirmPassword: 'パスワード確認',
        forgotPassword: 'パスワードをお忘れですか？',
        loginSuccess: 'ログイン成功',
        loginError: 'ログイン失敗',
        registerSuccess: '登録成功',
        registerError: '登録失敗',
      },
      blog: {
        posts: '投稿',
        readMore: '続きを読む',
        comments: 'コメント',
        share: '共有',
        like: 'いいね',
        unlike: 'いいねを解除',
        bookmark: 'ブックマーク',
        removeBookmark: 'ブックマークを削除',
      },
      user: {
        profile: 'プロフィール',
        settings: '設定',
        notifications: '通知',
        messages: 'メッセージ',
        followers: 'フォロワー',
        following: 'フォロー中',
      },
    });

    // 韩语
    this.addMessages('ko', {
      common: {
        appName: 'CyberPress',
        welcome: '환영합니다',
        loading: '로딩 중...',
        error: '오류가 발생했습니다',
        success: '성공',
        cancel: '취소',
        confirm: '확인',
        submit: '제출',
        save: '저장',
        delete: '삭제',
        edit: '편집',
        search: '검색',
        filter: '필터',
        sort: '정렬',
        refresh: '새로고침',
      },
      auth: {
        login: '로그인',
        logout: '로그아웃',
        register: '회원가입',
        email: '이메일',
        password: '비밀번호',
        confirmPassword: '비밀번호 확인',
        forgotPassword: '비밀번호를 잊으셨나요?',
        loginSuccess: '로그인 성공',
        loginError: '로그인 실패',
        registerSuccess: '회원가입 성공',
        registerError: '회원가입 실패',
      },
      blog: {
        posts: '게시물',
        readMore: '더 읽기',
        comments: '댓글',
        share: '공유',
        like: '좋아요',
        unlike: '좋아요 취소',
        bookmark: '북마크',
        removeBookmark: '북마크 삭제',
      },
      user: {
        profile: '프로필',
        settings: '설정',
        notifications: '알림',
        messages: '메시지',
        followers: '팔로워',
        following: '팔로잉',
      },
    });
  }

  /**
   * 添加翻译消息
   */
  addMessages(locale: string, messages: TranslationMessages): void {
    const existing = this.messages.get(locale) || {};
    this.messages.set(locale, { ...existing, ...messages });
  }

  /**
   * 获取翻译消息
   */
  getMessages(locale?: string): TranslationMessages {
    return this.messages.get(locale || this.currentLocale) || {};
  }

  /**
   * 翻译函数
   */
  t(key: string, params?: Record<string, any>): string {
    const keys = key.split('.');
    let message: any = this.getMessages();

    // 尝试当前语言
    for (const k of keys) {
      if (message && typeof message === 'object' && k in message) {
        message = message[k];
      } else {
        message = null;
        break;
      }
    }

    // 如果没有找到，尝试回退语言
    if (message === null && this.currentLocale !== this.config.fallbackLocale) {
      message = this.getMessages(this.config.fallbackLocale);
      for (const k of keys) {
        if (message && typeof message === 'object' && k in message) {
          message = message[k];
        } else {
          message = null;
          break;
        }
      }
    }

    // 如果还是没有找到，返回 key
    if (message === null) {
      return key;
    }

    // 如果是字符串，处理参数
    if (typeof message === 'string') {
      return this.interpolate(message, params);
    }

    return message;
  }

  /**
   * 插值处理
   */
  private interpolate(message: string, params?: Record<string, any>): string {
    if (!params) return message;

    return message.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return params[key] !== undefined ? String(params[key]) : match;
    });
  }

  /**
   * 获取当前语言
   */
  getLocale(): string {
    return this.currentLocale;
  }

  /**
   * 设置语言
   */
  setLocale(locale: string): void {
    if (!this.config.locales.includes(locale)) {
      console.warn(`Locale "${locale}" is not supported`);
      return;
    }

    if (this.currentLocale !== locale) {
      this.currentLocale = locale;
      this.saveLocaleToStorage(locale);
      this.notifyListeners();

      // 更新 HTML lang 属性
      if (typeof document !== 'undefined') {
        document.documentElement.lang = locale;
      }
    }
  }

  /**
   * 切换语言
   */
  toggleLocale(): void {
    const currentIndex = this.config.locales.indexOf(this.currentLocale);
    const nextIndex = (currentIndex + 1) % this.config.locales.length;
    this.setLocale(this.config.locales[nextIndex]);
  }

  /**
   * 检测并设置语言
   */
  detectAndSetLocale(): void {
    const browserLocale = this.getBrowserLocale();
    this.setLocale(browserLocale);
  }

  /**
   * 添加监听器
   */
  addListener(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * 通知监听器
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener());
  }

  /**
   * 格式化数字
   */
  formatNumber(number: number, options?: Intl.NumberFormatOptions): string {
    return new Intl.NumberFormat(this.currentLocale, options).format(number);
  }

  /**
   * 格式化日期
   */
  formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
    return new Intl.DateTimeFormat(this.currentLocale, options).format(date);
  }

  /**
   * 格式化货币
   */
  formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat(this.currentLocale, {
      style: 'currency',
      currency,
    }).format(amount);
  }

  /**
   * 格式化相对时间
   */
  formatRelativeTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const rtf = new Intl.RelativeTimeFormat(this.currentLocale, { numeric: 'auto' });

    if (days > 0) return rtf.format(-days, 'day');
    if (hours > 0) return rtf.format(-hours, 'hour');
    if (minutes > 0) return rtf.format(-minutes, 'minute');
    return rtf.format(-seconds, 'second');
  }

  /**
   * 获取支持的语言列表
   */
  getSupportedLocales(): string[] {
    return [...this.config.locales];
  }

  /**
   * 获取语言显示名称
   */
  getLocaleDisplayName(locale?: string): string {
    const targetLocale = locale || this.currentLocale;
    try {
      const displayNames = new Intl.DisplayNames(this.currentLocale, { type: 'language' });
      return displayNames.of(targetLocale) || targetLocale;
    } catch {
      return targetLocale;
    }
  }
}

// 创建全局实例
export const i18n = new I18nService();

// Hook
export function useI18n() {
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  React.useEffect(() => {
    return i18n.addListener(forceUpdate);
  }, []);

  const t = React.useCallback((key: string, params?: Record<string, any>) => {
    return i18n.t(key, params);
  }, []);

  const locale = i18n.getLocale();
  const setLocale = React.useCallback((locale: string) => {
    i18n.setLocale(locale);
  }, []);

  const formatNumber = React.useCallback(
    (number: number, options?: Intl.NumberFormatOptions) => {
      return i18n.formatNumber(number, options);
    },
    [locale]
  );

  const formatDate = React.useCallback(
    (date: Date, options?: Intl.DateTimeFormatOptions) => {
      return i18n.formatDate(date, options);
    },
    [locale]
  );

  const formatCurrency = React.useCallback(
    (amount: number, currency?: string) => {
      return i18n.formatCurrency(amount, currency);
    },
    [locale]
  );

  const formatRelativeTime = React.useCallback(
    (date: Date) => {
      return i18n.formatRelativeTime(date);
    },
    [locale]
  );

  return {
    t,
    locale,
    setLocale,
    formatNumber,
    formatDate,
    formatCurrency,
    formatRelativeTime,
    getSupportedLocales: () => i18n.getSupportedLocales(),
    getLocaleDisplayName: (locale?: string) => i18n.getLocaleDisplayName(locale),
  };
}

export default I18nService;
