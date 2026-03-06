/**
 * 博客相关的验证器
 */

import { z } from 'zod';

/**
 * 文章搜索参数验证
 */
export const blogSearchParamsSchema = z.object({
  page: z.number().int().positive().default(1),
  perPage: z.number().int().positive().max(100).default(10),
  category: z.string().optional(),
  tag: z.string().optional(),
  search: z.string().optional(),
  author: z.string().optional(),
  orderBy: z.enum(['date', 'title', 'modified']).default('date'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export type BlogSearchParams = z.infer<typeof blogSearchParamsSchema>;

/**
 * 评论表单验证
 */
export const commentFormSchema = z.object({
  postId: z.union([z.string(), z.number()]),
  content: z.string()
    .min(1, '评论内容不能为空')
    .min(5, '评论内容至少5个字符')
    .max(1000, '评论内容不能超过1000字符'),
  parentId: z.union([z.string(), z.number()]).optional(),
});

export type CommentFormData = z.infer<typeof commentFormSchema>;

/**
 * 文章提交验证
 */
export const articleSubmitSchema = z.object({
  title: z.string()
    .min(1, '标题不能为空')
    .min(5, '标题至少5个字符')
    .max(200, '标题不能超过200字符'),
  content: z.string()
    .min(1, '内容不能为空')
    .min(50, '内容至少50个字符'),
  excerpt: z.string().max(500, '摘要不能超过500字符').optional(),
  categoryId: z.number().positive().optional(),
  tags: z.array(z.number()).optional(),
  featuredImage: z.string().url('封面图格式不正确').optional(),
  status: z.enum(['draft', 'publish', 'pending']).default('draft'),
});

export type ArticleSubmitData = z.infer<typeof articleSubmitSchema>;

/**
 * 联系表单验证
 */
export const contactFormSchema = z.object({
  name: z.string()
    .min(1, '姓名不能为空')
    .min(2, '姓名至少2个字符')
    .max(50, '姓名不能超过50字符'),
  email: z.string()
    .min(1, '邮箱不能为空')
    .email('邮箱格式不正确'),
  subject: z.string()
    .min(1, '主题不能为空')
    .min(5, '主题至少5个字符')
    .max(200, '主题不能超过200字符'),
  message: z.string()
    .min(1, '留言不能为空')
    .min(10, '留言至少10个字符')
    .max(2000, '留言不能超过2000字符'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * 订阅表单验证
 */
export const subscribeFormSchema = z.object({
  email: z.string()
    .min(1, '邮箱不能为空')
    .email('邮箱格式不正确'),
});

export type SubscribeFormData = z.infer<typeof subscribeFormSchema>;

/**
 * 验证辅助函数
 */
export function validateSearchParams(params: unknown): BlogSearchParams {
  return blogSearchParamsSchema.parse(params);
}

export function validateCommentForm(data: unknown): CommentFormData {
  return commentFormSchema.parse(data);
}

export function validateArticleSubmit(data: unknown): ArticleSubmitData {
  return articleSubmitSchema.parse(data);
}

export function validateContactForm(data: unknown): ContactFormData {
  return contactFormSchema.parse(data);
}

export function validateSubscribeForm(data: unknown): SubscribeFormData {
  return subscribeFormSchema.parse(data);
}

/**
 * 安全解析（不抛出错误）
 */
export function safeValidateSearchParams(params: unknown) {
  return blogSearchParamsSchema.safeParse(params);
}

export function safeValidateCommentForm(data: unknown) {
  return commentFormSchema.safeParse(data);
}

export function safeValidateArticleSubmit(data: unknown) {
  return articleSubmitSchema.safeParse(data);
}

export function safeValidateContactForm(data: unknown) {
  return contactFormSchema.safeParse(data);
}

export function safeValidateSubscribeForm(data: unknown) {
  return subscribeFormSchema.safeParse(data);
}
