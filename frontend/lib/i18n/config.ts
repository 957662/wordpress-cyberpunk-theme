/**
 * 国际化配置
 * 支持多语言翻译
 */

export type Locale = 'zh-CN' | 'zh-TW' | 'en' | 'ja' | 'ko';

export interface LocaleConfig {
  code: Locale;
  name: string;
  flag: string;
}

export const locales: LocaleConfig[] = [
  { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
  { code: 'zh-TW', name: '繁體中文', flag: '🇹🇼' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
];

export const defaultLocale: Locale = 'zh-CN';

// 翻译函数类型
export type TranslationFunction = (key: string, params?: Record<string, any>) => string;

// 翻译资源
export const translations: Record<Locale, Record<string, string>> = {
  'zh-CN': {
    // 通用
    'common.loading': '加载中...',
    'common.error': '发生错误',
    'common.success': '操作成功',
    'common.cancel': '取消',
    'common.confirm': '确认',
    'common.save': '保存',
    'common.delete': '删除',
    'common.edit': '编辑',
    'common.search': '搜索',
    'common.filter': '筛选',
    'common.sort': '排序',
    'common.more': '更多',
    'common.back': '返回',
    'common.next': '下一页',
    'common.prev': '上一页',
    'common.submit': '提交',
    'common.reset': '重置',

    // 导航
    'nav.home': '首页',
    'nav.blog': '博客',
    'nav.portfolio': '作品集',
    'nav.about': '关于',
    'nav.contact': '联系',
    'nav.admin': '管理后台',

    // 博客
    'blog.title': '博客',
    'blog.readMore': '阅读更多',
    'blog.publishedAt': '发布于',
    'blog.author': '作者',
    'blog.category': '分类',
    'blog.tag': '标签',
    'blog.comments': '评论',
    'blog.relatedPosts': '相关文章',
    'blog.noPosts': '暂无文章',
    'blog.loadMore': '加载更多',

    // 评论
    'comment.title': '评论',
    'comment.placeholder': '发表您的评论...',
    'comment.name': '姓名',
    'comment.email': '邮箱',
    'comment.reply': '回复',
    'comment.submit': '发表评论',
    'comment.noComments': '暂无评论',
    'comment.loading': '加载评论中...',

    // 搜索
    'search.title': '搜索',
    'search.placeholder': '搜索文章、页面...',
    'search.results': '搜索结果',
    'search.noResults': '未找到相关内容',
    'search.filters': '筛选条件',
    'search.sortBy': '排序方式',

    // 作品集
    'portfolio.title': '作品集',
    'portfolio.viewProject': '查看项目',
    'portfolio.technologies': '技术栈',
    'portfolio.noProjects': '暂无项目',

    // 认证
    'auth.login': '登录',
    'auth.register': '注册',
    'auth.logout': '登出',
    'auth.username': '用户名',
    'auth.password': '密码',
    'auth.email': '邮箱',
    'auth.remember': '记住我',
    'auth.forgotPassword': '忘记密码？',
    'auth.resetPassword': '重置密码',
    'auth.noAccount': '还没有账户？',
    'auth.hasAccount': '已有账户？',
    'auth.signIn': '立即登录',
    'auth.signUp': '立即注册',

    // 管理后台
    'admin.dashboard': '仪表盘',
    'admin.posts': '文章管理',
    'admin.media': '媒体库',
    'admin.users': '用户管理',
    'admin.settings': '设置',
    'admin.newPost': '新建文章',
    'admin.editPost': '编辑文章',
    'admin.publish': '发布',
    'admin.draft': '草稿',
    'admin.pending': '待审核',

    // 主题
    'theme.title': '主题',
    'theme.light': '亮色',
    'theme.dark': '暗色',
    'theme.system': '跟随系统',
    'theme.switch': '切换主题',

    // 时间
    'time.justNow': '刚刚',
    'time.minutesAgo': '{minutes} 分钟前',
    'time.hoursAgo': '{hours} 小时前',
    'time.daysAgo': '{days} 天前',
    'time.weeksAgo': '{weeks} 周前',
    'time.monthsAgo': '{months} 月前',
    'time.yearsAgo': '{years} 年前',
  },

  'zh-TW': {
    // 通用
    'common.loading': '載入中...',
    'common.error': '發生錯誤',
    'common.success': '操作成功',
    'common.cancel': '取消',
    'common.confirm': '確認',
    'common.save': '儲存',
    'common.delete': '刪除',
    'common.edit': '編輯',
    'common.search': '搜尋',
    'common.filter': '篩選',
    'common.sort': '排序',
    'common.more': '更多',
    'common.back': '返回',
    'common.next': '下一頁',
    'common.prev': '上一頁',
    'common.submit': '提交',
    'common.reset': '重置',

    // 導航
    'nav.home': '首頁',
    'nav.blog': '博客',
    'nav.portfolio': '作品集',
    'nav.about': '關於',
    'nav.contact': '聯絡',
    'nav.admin': '管理後台',

    // 博客
    'blog.title': '博客',
    'blog.readMore': '閱讀更多',
    'blog.publishedAt': '發佈於',
    'blog.author': '作者',
    'blog.category': '分類',
    'blog.tag': '標籤',
    'blog.comments': '評論',
    'blog.relatedPosts': '相關文章',
    'blog.noPosts': '暫無文章',
    'blog.loadMore': '載入更多',

    // 評論
    'comment.title': '評論',
    'comment.placeholder': '發表您的評論...',
    'comment.name': '姓名',
    'comment.email': '郵箱',
    'comment.reply': '回覆',
    'comment.submit': '發表評論',
    'comment.noComments': '暫無評論',
    'comment.loading': '載入評論中...',

    // 搜尋
    'search.title': '搜尋',
    'search.placeholder': '搜尋文章、頁面...',
    'search.results': '搜尋結果',
    'search.noResults': '未找到相關內容',
    'search.filters': '篩選條件',
    'search.sortBy': '排序方式',

    // 作品集
    'portfolio.title': '作品集',
    'portfolio.viewProject': '查看項目',
    'portfolio.technologies': '技術棧',
    'portfolio.noProjects': '暫無項目',

    // 認證
    'auth.login': '登入',
    'auth.register': '註冊',
    'auth.logout': '登出',
    'auth.username': '用戶名',
    'auth.password': '密碼',
    'auth.email': '郵箱',
    'auth.remember': '記住我',
    'auth.forgotPassword': '忘記密碼？',
    'auth.resetPassword': '重置密碼',
    'auth.noAccount': '還沒有賬戶？',
    'auth.hasAccount': '已有賬戶？',
    'auth.signIn': '立即登入',
    'auth.signUp': '立即註冊',

    // 管理後台
    'admin.dashboard': '儀表盤',
    'admin.posts': '文章管理',
    'admin.media': '媒體庫',
    'admin.users': '用戶管理',
    'admin.settings': '設置',
    'admin.newPost': '新建文章',
    'admin.editPost': '編輯文章',
    'admin.publish': '發佈',
    'admin.draft': '草稿',
    'admin.pending': '待審核',

    // 主題
    'theme.title': '主題',
    'theme.light': '亮色',
    'theme.dark': '暗色',
    'theme.system': '跟隨系統',
    'theme.switch': '切換主題',

    // 時間
    'time.justNow': '剛剛',
    'time.minutesAgo': '{minutes} 分鐘前',
    'time.hoursAgo': '{hours} 小時前',
    'time.daysAgo': '{days} 天前',
    'time.weeksAgo': '{weeks} 週前',
    'time.monthsAgo': '{months} 月前',
    'time.yearsAgo': '{years} 年前',
  },

  'en': {
    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.more': 'More',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.prev': 'Previous',
    'common.submit': 'Submit',
    'common.reset': 'Reset',

    // Navigation
    'nav.home': 'Home',
    'nav.blog': 'Blog',
    'nav.portfolio': 'Portfolio',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.admin': 'Admin',

    // Blog
    'blog.title': 'Blog',
    'blog.readMore': 'Read More',
    'blog.publishedAt': 'Published',
    'blog.author': 'Author',
    'blog.category': 'Category',
    'blog.tag': 'Tag',
    'blog.comments': 'Comments',
    'blog.relatedPosts': 'Related Posts',
    'blog.noPosts': 'No posts yet',
    'blog.loadMore': 'Load More',

    // Comments
    'comment.title': 'Comments',
    'comment.placeholder': 'Leave a comment...',
    'comment.name': 'Name',
    'comment.email': 'Email',
    'comment.reply': 'Reply',
    'comment.submit': 'Submit',
    'comment.noComments': 'No comments yet',
    'comment.loading': 'Loading comments...',

    // Search
    'search.title': 'Search',
    'search.placeholder': 'Search posts, pages...',
    'search.results': 'Search Results',
    'search.noResults': 'No results found',
    'search.filters': 'Filters',
    'search.sortBy': 'Sort By',

    // Portfolio
    'portfolio.title': 'Portfolio',
    'portfolio.viewProject': 'View Project',
    'portfolio.technologies': 'Technologies',
    'portfolio.noProjects': 'No projects yet',

    // Auth
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.logout': 'Logout',
    'auth.username': 'Username',
    'auth.password': 'Password',
    'auth.email': 'Email',
    'auth.remember': 'Remember me',
    'auth.forgotPassword': 'Forgot password?',
    'auth.resetPassword': 'Reset Password',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',

    // Admin
    'admin.dashboard': 'Dashboard',
    'admin.posts': 'Posts',
    'admin.media': 'Media',
    'admin.users': 'Users',
    'admin.settings': 'Settings',
    'admin.newPost': 'New Post',
    'admin.editPost': 'Edit Post',
    'admin.publish': 'Publish',
    'admin.draft': 'Draft',
    'admin.pending': 'Pending Review',

    // Theme
    'theme.title': 'Theme',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.system': 'System',
    'theme.switch': 'Switch Theme',

    // Time
    'time.justNow': 'Just now',
    'time.minutesAgo': '{minutes}m ago',
    'time.hoursAgo': '{hours}h ago',
    'time.daysAgo': '{days}d ago',
    'time.weeksAgo': '{weeks}w ago',
    'time.monthsAgo': '{months}mo ago',
    'time.yearsAgo': '{years}y ago',
  },

  'ja': {
    // 共通
    'common.loading': '読み込み中...',
    'common.error': 'エラーが発生しました',
    'common.success': '成功',
    'common.cancel': 'キャンセル',
    'common.confirm': '確認',
    'common.save': '保存',
    'common.delete': '削除',
    'common.edit': '編集',
    'common.search': '検索',
    'common.filter': 'フィルター',
    'common.sort': 'ソート',
    'common.more': 'もっと見る',
    'common.back': '戻る',
    'common.next': '次へ',
    'common.prev': '前へ',
    'common.submit': '送信',
    'common.reset': 'リセット',

    // ナビゲーション
    'nav.home': 'ホーム',
    'nav.blog': 'ブログ',
    'nav.portfolio': 'ポートフォリオ',
    'nav.about': 'について',
    'nav.contact': 'お問い合わせ',
    'nav.admin': '管理画面',

    // ブログ
    'blog.title': 'ブログ',
    'blog.readMore': '続きを読む',
    'blog.publishedAt': '公開日',
    'blog.author': '著者',
    'blog.category': 'カテゴリー',
    'blog.tag': 'タグ',
    'blog.comments': 'コメント',
    'blog.relatedPosts': '関連記事',
    'blog.noPosts': '記事がありません',
    'blog.loadMore': 'もっと読む',

    // コメント
    'comment.title': 'コメント',
    'comment.placeholder': 'コメントを入力...',
    'comment.name': '名前',
    'comment.email': 'メール',
    'comment.reply': '返信',
    'comment.submit': '送信',
    'comment.noComments': 'コメントがありません',
    'comment.loading': 'コメントを読み込み中...',

    // 検索
    'search.title': '検索',
    'search.placeholder': '記事、ページを検索...',
    'search.results': '検索結果',
    'search.noResults': '結果が見つかりませんでした',
    'search.filters': 'フィルター',
    'search.sortBy': '並び替え',

    // ポートフォリオ
    'portfolio.title': 'ポートフォリオ',
    'portfolio.viewProject': 'プロジェクトを見る',
    'portfolio.technologies': '技術スタック',
    'portfolio.noProjects': 'プロジェクトがありません',

    // 認証
    'auth.login': 'ログイン',
    'auth.register': '登録',
    'auth.logout': 'ログアウト',
    'auth.username': 'ユーザー名',
    'auth.password': 'パスワード',
    'auth.email': 'メール',
    'auth.remember': 'ログイン状態を保持',
    'auth.forgotPassword': 'パスワードを忘れた？',
    'auth.resetPassword': 'パスワードリセット',
    'auth.noAccount': 'アカウントをお持ちでない？',
    'auth.hasAccount': '既にアカウントをお持ち？',
    'auth.signIn': 'サインイン',
    'auth.signUp': 'サインアップ',

    // 管理画面
    'admin.dashboard': 'ダッシュボード',
    'admin.posts': '記事管理',
    'admin.media': 'メディア',
    'admin.users': 'ユーザー管理',
    'admin.settings': '設定',
    'admin.newPost': '新規記事',
    'admin.editPost': '記事編集',
    'admin.publish': '公開',
    'admin.draft': '下書き',
    'admin.pending': 'レビュー待ち',

    // テーマ
    'theme.title': 'テーマ',
    'theme.light': 'ライト',
    'theme.dark': 'ダーク',
    'theme.system': 'システム',
    'theme.switch': 'テーマ切替',

    // 時間
    'time.justNow': 'たった今',
    'time.minutesAgo': '{minutes}分前',
    'time.hoursAgo': '{hours}時間前',
    'time.daysAgo': '{days}日前',
    'time.weeksAgo': '{weeks}週間前',
    'time.monthsAgo': '{months}ヶ月前',
    'time.yearsAgo': '{years}年前',
  },

  'ko': {
    // 일반
    'common.loading': '로딩 중...',
    'common.error': '오류가 발생했습니다',
    'common.success': '성공',
    'common.cancel': '취소',
    'common.confirm': '확인',
    'common.save': '저장',
    'common.delete': '삭제',
    'common.edit': '편집',
    'common.search': '검색',
    'common.filter': '필터',
    'common.sort': '정렬',
    'common.more': '더보기',
    'common.back': '뒤로',
    'common.next': '다음',
    'common.prev': '이전',
    'common.submit': '제출',
    'common.reset': '재설정',

    // 내비게이션
    'nav.home': '홈',
    'nav.blog': '블로그',
    'nav.portfolio': '포트폴리오',
    'nav.about': '소개',
    'nav.contact': '연락처',
    'nav.admin': '관리자',

    // 블로그
    'blog.title': '블로그',
    'blog.readMore': '더 읽기',
    'blog.publishedAt': '게시일',
    'blog.author': '저자',
    'blog.category': '카테고리',
    'blog.tag': '태그',
    'blog.comments': '댓글',
    'blog.relatedPosts': '관련 글',
    'blog.noPosts': '게시물이 없습니다',
    'blog.loadMore': '더 로드',

    // 댓글
    'comment.title': '댓글',
    'comment.placeholder': '댓글을 입력하세요...',
    'comment.name': '이름',
    'comment.email': '이메일',
    'comment.reply': '답글',
    'comment.submit': '제출',
    'comment.noComments': '댓글이 없습니다',
    'comment.loading': '댓글 로딩 중...',

    // 검색
    'search.title': '검색',
    'search.placeholder': '게시물, 페이지 검색...',
    'search.results': '검색 결과',
    'search.noResults': '결과를 찾을 수 없습니다',
    'search.filters': '필터',
    'search.sortBy': '정렬',

    // 포트폴리오
    'portfolio.title': '포트폴리오',
    'portfolio.viewProject': '프로젝트 보기',
    'portfolio.technologies': '기술 스택',
    'portfolio.noProjects': '프로젝트가 없습니다',

    // 인증
    'auth.login': '로그인',
    'auth.register': '회원가입',
    'auth.logout': '로그아웃',
    'auth.username': '사용자명',
    'auth.password': '비밀번호',
    'auth.email': '이메일',
    'auth.remember': '로그인 상태 유지',
    'auth.forgotPassword': '비밀번호를 잊으셨나요?',
    'auth.resetPassword': '비밀번호 재설정',
    'auth.noAccount': '계정이 없으신가요?',
    'auth.hasAccount': '이미 계정이 있으신가요?',
    'auth.signIn': '로그인',
    'auth.signUp': '회원가입',

    // 관리자
    'admin.dashboard': '대시보드',
    'admin.posts': '글 관리',
    'admin.media': '미디어',
    'admin.users': '사용자 관리',
    'admin.settings': '설정',
    'admin.newPost': '새 글',
    'admin.editPost': '글 편집',
    'admin.publish': '게시',
    'admin.draft': '임시저장',
    'admin.pending': '검토 대기',

    // 테마
    'theme.title': '테마',
    'theme.light': '라이트',
    'theme.dark': '다크',
    'theme.system': '시스템',
    'theme.switch': '테마 전환',

    // 시간
    'time.justNow': '방금',
    'time.minutesAgo': '{minutes}분 전',
    'time.hoursAgo': '{hours}시간 전',
    'time.daysAgo': '{days}일 전',
    'time.weeksAgo': '{weeks}주 전',
    'time.monthsAgo': '{months}개월 전',
    'time.yearsAgo': '{years}년 전',
  },
};

// 翻译函数
export function t(locale: Locale, key: string, params?: Record<string, any>): string {
  const translation = translations[locale]?.[key];

  if (!translation) {
    console.warn(`Translation missing for key: ${key} in locale: ${locale}`);
    return key;
  }

  // 替换参数
  if (params) {
    return translation.replace(/\{(\w+)\}/g, (_, paramKey) => {
      return params[paramKey] || `{${paramKey}}`;
    });
  }

  return translation;
}

// 获取浏览器语言
export function getBrowserLocale(): Locale {
  if (typeof window === 'undefined') return defaultLocale;

  const browserLang = navigator.language;
  const code = browserLang.split('-')[0] as Locale;

  // 检查是否支持该语言
  if (locales.some((locale) => locale.code === code || locale.code.startsWith(code))) {
    return locales.find((locale) => locale.code === code || locale.code.startsWith(code))!.code;
  }

  return defaultLocale;
}

// 格式化日期
export function formatDate(locale: Locale, date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

// 格式化相对时间
export function formatRelativeTime(locale: Locale, date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return t(locale, 'time.justNow');
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return t(locale, 'time.minutesAgo', { minutes: diffInMinutes });
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return t(locale, 'time.hoursAgo', { hours: diffInHours });
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return t(locale, 'time.daysAgo', { days: diffInDays });
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return t(locale, 'time.weeksAgo', { weeks: diffInWeeks });
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return t(locale, 'time.monthsAgo', { months: diffInMonths });
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return t(locale, 'time.yearsAgo', { years: diffInYears });
}
