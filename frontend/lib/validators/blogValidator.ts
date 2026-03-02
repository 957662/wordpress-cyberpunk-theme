/**
 * CyberPress Platform - Blog Validators
 * 博客数据验证工具
 */

import { z } from 'zod';

/**
 * Post Schema
 */
export const PostSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, '标题不能为空').max(200, '标题不能超过200字符'),
  slug: z.string().min(1, 'Slug不能为空').regex(/^[a-z0-9-]+$/, 'Slug只能包含小写字母、数字和连字符'),
  excerpt: z.string().max(500, '摘要不能超过500字符').optional(),
  content: z.string().min(1, '内容不能为空'),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  featuredImage: z.string().url('封面图片必须是有效的URL').optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  publishedAt: z.string().datetime().optional(),
  metaTitle: z.string().max(60, 'SEO标题不能超过60字符').optional(),
  metaDescription: z.string().max(160, 'SEO描述不能超过160字符').optional(),
  allowComments: z.boolean().default(true),
});

export type PostFormData = z.infer<typeof PostSchema>;

/**
 * Comment Schema
 */
export const CommentSchema = z.object({
  id: z.string().optional(),
  postId: z.string().min(1, '文章ID不能为空'),
  author: z.object({
    name: z.string().min(1, '昵称不能为空').max(50, '昵称不能超过50字符'),
    email: z.string().email('请输入有效的邮箱地址'),
    url: z.string().url('网站地址必须是有效的URL').optional().or(z.literal('')),
  }),
  content: z.string().min(1, '评论内容不能为空').max(1000, '评论内容不能超过1000字符'),
  parentId: z.string().optional(),
  status: z.enum(['pending', 'approved', 'spam', 'trash']).default('pending'),
});

export type CommentFormData = z.infer<typeof CommentSchema>;

/**
 * Category Schema
 */
export const CategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, '分类名称不能为空').max(50, '分类名称不能超过50字符'),
  slug: z.string().min(1, 'Slug不能为空').regex(/^[a-z0-9-]+$/, 'Slug只能包含小写字母、数字和连字符'),
  description: z.string().max(200, '描述不能超过200字符').optional(),
  parentId: z.string().optional(),
  metaTitle: z.string().max(60, 'SEO标题不能超过60字符').optional(),
  metaDescription: z.string().max(160, 'SEO描述不能超过160字符').optional(),
});

export type CategoryFormData = z.infer<typeof CategorySchema>;

/**
 * Tag Schema
 */
export const TagSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, '标签名称不能为空').max(50, '标签名称不能超过50字符'),
  slug: z.string().min(1, 'Slug不能为空').regex(/^[a-z0-9-]+$/, 'Slug只能包含小写字母、数字和连字符'),
  description: z.string().max(200, '描述不能超过200字符').optional(),
  metaTitle: z.string().max(60, 'SEO标题不能超过60字符').optional(),
  metaDescription: z.string().max(160, 'SEO描述不能超过160字符').optional(),
});

export type TagFormData = z.infer<typeof TagSchema>;

/**
 * Contact Form Schema
 */
export const ContactFormSchema = z.object({
  name: z.string().min(1, '姓名不能为空').max(100, '姓名不能超过100字符'),
  email: z.string().email('请输入有效的邮箱地址'),
  subject: z.string().min(1, '主题不能为空').max(200, '主题不能超过200字符'),
  message: z.string().min(10, '消息内容至少10个字符').max(2000, '消息内容不能超过2000字符'),
  phone: z.string().regex(/^1[3-9]\d{9}$/, '请输入有效的手机号码').optional().or(z.literal('')),
  recaptchaToken: z.string().optional(),
});

export type ContactFormData = z.infer<typeof ContactFormSchema>;

/**
 * Newsletter Subscription Schema
 */
export const NewsletterSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  name: z.string().max(100, '姓名不能超过100字符').optional(),
  tags: z.array(z.string()).optional(),
});

export type NewsletterFormData = z.infer<typeof NewsletterSchema>;

/**
 * Search Query Schema
 */
export const SearchQuerySchema = z.object({
  query: z.string().min(2, '搜索关键词至少2个字符').max(100, '搜索关键词不能超过100字符'),
  type: z.enum(['all', 'posts', 'portfolios', 'users', 'tags']).default('all'),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  sortBy: z.enum(['relevance', 'date', 'views', 'likes']).default('relevance'),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

export type SearchQueryFormData = z.infer<typeof SearchQuerySchema>;

/**
 * User Settings Schema
 */
export const UserSettingsSchema = z.object({
  displayName: z.string().min(1, '显示名称不能为空').max(50, '显示名称不能超过50字符'),
  bio: z.string().max(500, '个人简介不能超过500字符').optional(),
  website: z.string().url('网站地址必须是有效的URL').optional().or(z.literal('')),
  location: z.string().max(100, '位置不能超过100字符').optional(),
  email: z.string().email('请输入有效的邮箱地址'),
  avatar: z.string().url('头像必须是有效的URL').optional(),
  cover: z.string().url('封面图片必须是有效的URL').optional(),
  social: z.object({
    twitter: z.string().url().optional().or(z.literal('')),
    github: z.string().url().optional().or(z.literal('')),
    linkedin: z.string().url().optional().or(z.literal('')),
    youtube: z.string().url().optional().or(z.literal('')),
  }),
  preferences: z.object({
    emailNotifications: z.boolean().default(true),
    darkMode: z.boolean().default(true),
    language: z.string().default('zh-CN'),
    timezone: z.string().default('Asia/Shanghai'),
  }),
});

export type UserSettingsFormData = z.infer<typeof UserSettingsSchema>;

/**
 * Validation helper functions
 */
export const validatePost = (data: unknown) => {
  return PostSchema.safeParse(data);
};

export const validateComment = (data: unknown) => {
  return CommentSchema.safeParse(data);
};

export const validateCategory = (data: unknown) => {
  return CategorySchema.safeParse(data);
};

export const validateTag = (data: unknown) => {
  return TagSchema.safeParse(data);
};

export const validateContactForm = (data: unknown) => {
  return ContactFormSchema.safeParse(data);
};

export const validateNewsletter = (data: unknown) => {
  return NewsletterSchema.safeParse(data);
};

export const validateSearchQuery = (data: unknown) => {
  return SearchQuerySchema.safeParse(data);
};

export const validateUserSettings = (data: unknown) => {
  return UserSettingsSchema.safeParse(data);
};

/**
 * Extract validation errors
 */
export const extractErrors = (result: { success: false; error: z.ZodError }): Record<string, string> => {
  const errors: Record<string, string> = {};

  result.error.errors.forEach((error) => {
    const path = error.path.join('.');
    errors[path] = error.message;
  });

  return errors;
};

export default {
  PostSchema,
  CommentSchema,
  CategorySchema,
  TagSchema,
  ContactFormSchema,
  NewsletterSchema,
  SearchQuerySchema,
  UserSettingsSchema,
  validatePost,
  validateComment,
  validateCategory,
  validateTag,
  validateContactForm,
  validateNewsletter,
  validateSearchQuery,
  validateUserSettings,
  extractErrors,
};
