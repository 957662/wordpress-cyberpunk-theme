/**
 * 路由配置文件
 * 定义所有前端路由
 */

import { ROUTES } from './constants';

// ============ 路由类型定义 ============
export interface Route {
  path: string;
  title: string;
  description?: string;
  icon?: string;
  roles?: string[];
  hidden?: boolean;
  children?: Route[];
}

// ============ 公开路由 ============
export const publicRoutes: Route[] = [
  {
    path: ROUTES.HOME,
    title: '首页',
    description: '欢迎来到 CyberPress',
  },
  {
    path: ROUTES.BLOG,
    title: '博客',
    description: '探索技术文章和见解',
  },
  {
    path: ROUTES.PORTFOLIO,
    title: '作品集',
    description: '查看我们的项目和作品',
  },
  {
    path: ROUTES.ABOUT,
    title: '关于',
    description: '了解更多关于我们',
  },
  {
    path: ROUTES.CONTACT,
    title: '联系',
    description: '与我们取得联系',
  },
  {
    path: ROUTES.SEARCH,
    title: '搜索',
    description: '搜索内容',
  },
];

// ============ 认证路由 ============
export const authRoutes: Route[] = [
  {
    path: ROUTES.LOGIN,
    title: '登录',
    description: '登录到您的账户',
  },
  {
    path: ROUTES.REGISTER,
    title: '注册',
    description: '创建新账户',
  },
  {
    path: ROUTES.FORGOT_PASSWORD,
    title: '忘记密码',
    description: '重置您的密码',
  },
  {
    path: ROUTES.RESET_PASSWORD,
    title: '重置密码',
    description: '设置新密码',
  },
];

// ============ 用户路由 ============
export const userRoutes: Route[] = [
  {
    path: ROUTES.PROFILE,
    title: '个人资料',
    icon: 'user',
    roles: ['user', 'admin'],
  },
  {
    path: ROUTES.SETTINGS,
    title: '设置',
    icon: 'settings',
    roles: ['user', 'admin'],
  },
  {
    path: ROUTES.BOOKMARKS,
    title: '收藏夹',
    icon: 'bookmark',
    roles: ['user', 'admin'],
  },
];

// ============ 管理员路由 ============
export const adminRoutes: Route[] = [
  {
    path: ROUTES.ADMIN,
    title: '仪表盘',
    icon: 'dashboard',
    roles: ['admin'],
  },
  {
    path: ROUTES.ADMIN_POSTS,
    title: '文章管理',
    icon: 'file-text',
    roles: ['admin'],
  },
  {
    path: ROUTES.ADMIN_MEDIA,
    title: '媒体库',
    icon: 'image',
    roles: ['admin'],
  },
  {
    path: ROUTES.ADMIN_COMMENTS,
    title: '评论管理',
    icon: 'message-square',
    roles: ['admin'],
  },
  {
    path: ROUTES.ADMIN_SETTINGS,
    title: '系统设置',
    icon: 'settings',
    roles: ['admin'],
  },
];

// ============ 所有路由 ============
export const allRoutes: Route[] = [
  ...publicRoutes,
  ...authRoutes,
  ...userRoutes,
  ...adminRoutes,
];

// ============ 导航菜单配置 ============
export const navMenu: Route[] = [
  {
    path: ROUTES.HOME,
    title: '首页',
    icon: 'home',
  },
  {
    path: ROUTES.BLOG,
    title: '博客',
    icon: 'file-text',
  },
  {
    path: ROUTES.PORTFOLIO,
    title: '作品集',
    icon: 'briefcase',
  },
  {
    path: ROUTES.ABOUT,
    title: '关于',
    icon: 'info',
  },
  {
    path: ROUTES.CONTACT,
    title: '联系',
    icon: 'mail',
  },
];

// ============ 页脚菜单配置 ============
export const footerMenu = {
  product: [
    { path: ROUTES.BLOG, title: '博客' },
    { path: ROUTES.PORTFOLIO, title: '作品集' },
    { path: ROUTES.ABOUT, title: '关于' },
  ],
  resources: [
    { path: ROUTES.CONTACT, title: '联系支持' },
    { path: '/docs', title: '文档' },
    { path: '/help', title: '帮助中心' },
  ],
  legal: [
    { path: '/privacy', title: '隐私政策' },
    { path: '/terms', title: '服务条款' },
    { path: '/cookies', title: 'Cookie 政策' },
  ],
};

// ============ 面包屑配置 ============
export interface BreadcrumbItem {
  title: string;
  path?: string;
  icon?: string;
}

export const getBreadcrumbs = (path: string): BreadcrumbItem[] => {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: '首页', path: ROUTES.HOME, icon: 'home' },
  ];

  // 根据路径添加面包屑
  if (path.startsWith(ROUTES.BLOG)) {
    breadcrumbs.push({ title: '博客', path: ROUTES.BLOG });
  } else if (path.startsWith(ROUTES.PORTFOLIO)) {
    breadcrumbs.push({ title: '作品集', path: ROUTES.PORTFOLIO });
  } else if (path.startsWith(ROUTES.ABOUT)) {
    breadcrumbs.push({ title: '关于', path: ROUTES.ABOUT });
  } else if (path.startsWith(ROUTES.CONTACT)) {
    breadcrumbs.push({ title: '联系', path: ROUTES.CONTACT });
  } else if (path.startsWith(ROUTES.ADMIN)) {
    breadcrumbs.push({ title: '管理后台', path: ROUTES.ADMIN });
  }

  return breadcrumbs;
};

// ============ 路由守卫配置 ============
export const routeGuards = {
  // 需要认证的路由
  requiresAuth: [
    ROUTES.PROFILE,
    ROUTES.SETTINGS,
    ROUTES.BOOKMARKS,
    ROUTES.ADMIN,
    ROUTES.ADMIN_POSTS,
    ROUTES.ADMIN_MEDIA,
    ROUTES.ADMIN_COMMENTS,
    ROUTES.ADMIN_SETTINGS,
  ],

  // 需要管理员权限的路由
  requiresAdmin: [
    ROUTES.ADMIN,
    ROUTES.ADMIN_POSTS,
    ROUTES.ADMIN_MEDIA,
    ROUTES.ADMIN_COMMENTS,
    ROUTES.ADMIN_SETTINGS,
  ],

  // 重定向配置
  redirects: {
    authenticated: ROUTES.HOME, // 已认证用户访问登录页时重定向
    unauthenticated: ROUTES.LOGIN, // 未认证用户访问受保护路由时重定向
  },
};

// ============ 元数据配置 ============
export const getRouteMetadata = (path: string) => {
  const route = allRoutes.find((r) => r.path === path);

  return {
    title: route?.title || 'CyberPress',
    description: route?.description || 'CyberPress - 赛博朋克风格的博客平台',
    keywords: ['blog', 'cyberpunk', 'technology'],
    ogImage: '/og-image.png',
  };
};

// ============ 重定向配置 ============
export const redirects = [
  { source: '/home', destination: ROUTES.HOME, permanent: true },
  { source: '/index.html', destination: ROUTES.HOME, permanent: true },
  { source: '/post/:slug', destination: `${ROUTES.BLOG_POST}/:slug`, permanent: true },
];

export default {
  publicRoutes,
  authRoutes,
  userRoutes,
  adminRoutes,
  allRoutes,
  navMenu,
  footerMenu,
  routeGuards,
  redirects,
  getBreadcrumbs,
  getRouteMetadata,
};
