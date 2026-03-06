/**
 * 导航配置
 */

import { Home, BookOpen, User, Tag, FolderOpen, Search, Settings } from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
  children?: NavItem[];
  external?: boolean;
}

export const mainNav: NavItem[] = [
  {
    title: '首页',
    href: '/',
    icon: Home,
  },
  {
    title: '博客',
    href: '/blog',
    icon: BookOpen,
    description: '查看所有文章',
  },
  {
    title: '分类',
    href: '/categories',
    icon: FolderOpen,
  },
  {
    title: '标签',
    href: '/tags',
    icon: Tag,
  },
  {
    title: '作者',
    href: '/authors',
    icon: User,
  },
  {
    title: '搜索',
    href: '/search',
    icon: Search,
  },
];

export const footerNav: NavItem[] = [
  {
    title: '关于我们',
    href: '/about',
  },
  {
    title: '联系方式',
    href: '/contact',
  },
  {
    title: '隐私政策',
    href: '/privacy',
  },
  {
    title: '服务条款',
    href: '/terms',
  },
  {
    title: '帮助中心',
    href: '/help',
  },
];

export const userNav: NavItem[] = [
  {
    title: '个人资料',
    href: '/profile',
  },
  {
    title: '我的文章',
    href: '/posts/my',
  },
  {
    title: '收藏夹',
    href: '/bookmarks',
  },
  {
    title: '阅读历史',
    href: '/reading-history',
  },
  {
    title: '通知',
    href: '/notifications',
  },
  {
    title: '设置',
    href: '/settings',
    icon: Settings,
  },
];

export const adminNav: NavItem[] = [
  {
    title: '仪表盘',
    href: '/admin',
  },
  {
    title: '文章管理',
    href: '/admin/posts',
  },
  {
    title: '评论管理',
    href: '/admin/comments',
  },
  {
    title: '用户管理',
    href: '/admin/users',
  },
  {
    title: '分类标签',
    href: '/admin/categories',
  },
  {
    title: '媒体库',
    href: '/admin/media',
  },
  {
    title: '系统设置',
    href: '/admin/settings',
  },
];

export const sidebarNav: NavItem[] = [
  {
    title: '总览',
    href: '/admin',
    icon: Home,
  },
  {
    title: '内容',
    children: [
      {
        title: '文章',
        href: '/admin/posts',
      },
      {
        title: '评论',
        href: '/admin/comments',
      },
      {
        title: '分类',
        href: '/admin/categories',
      },
      {
        title: '标签',
        href: '/admin/tags',
      },
      {
        title: '媒体',
        href: '/admin/media',
      },
    ],
  },
  {
    title: '用户',
    children: [
      {
        title: '所有用户',
        href: '/admin/users',
      },
      {
        title: '角色权限',
        href: '/admin/roles',
      },
    ],
  },
  {
    title: '统计',
    children: [
      {
        title: '分析',
        href: '/admin/analytics',
      },
      {
        title: '日志',
        href: '/admin/logs',
      },
    ],
  },
  {
    title: '设置',
    icon: Settings,
    href: '/admin/settings',
  },
];
