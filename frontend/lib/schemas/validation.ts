/**
 * Validation Schemas - 数据验证模式
 * 使用 Zod 进行运行时类型验证
 */

import { z } from 'zod';

// ==================== 用户相关 ====================

// 用户注册验证
export const registerSchema = z.object({
  username: z
    .string()
    .min(3, '用户名至少 3 个字符')
    .max(20, '用户名最多 20 个字符')
    .regex(/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线'),
  email: z.string().email('请输入有效的邮箱地址'),
  password: z
    .string()
    .min(8, '密码至少 8 个字符')
    .regex(/[A-Z]/, '密码必须包含至少一个大写字母')
    .regex(/[a-z]/, '密码必须包含至少一个小写字母')
    .regex(/[0-9]/, '密码必须包含至少一个数字'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: '两次输入的密码不一致',
  path: ['confirmPassword'],
});

// 用户登录验证
export const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(1, '请输入密码'),
  remember: z.boolean().optional(),
});

// 用户信息更新验证
export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3, '用户名至少 3 个字符')
    .max(20, '用户名最多 20 个字符')
    .optional(),
  email: z.string().email('请输入有效的邮箱地址').optional(),
  bio: z.string().max(500, '简介最多 500 个字符').optional(),
  avatar: z.string().url('请输入有效的图片 URL').optional(),
  website: z.string().url('请输入有效的网站 URL').optional(),
});

// ==================== 文章相关 ====================

// 文章创建/更新验证
export const postSchema = z.object({
  title: z
    .string()
    .min(1, '标题不能为空')
    .max(200, '标题最多 200 个字符'),
  content: z.string().min(1, '内容不能为空'),
  excerpt: z
    .string()
    .max(500, '摘要最多 500 个字符')
    .optional(),
  categoryId: z.number().optional(),
  tagIds: z.array(z.number()).optional(),
  featuredImage: z.string().url('请输入有效的图片 URL').optional(),
  status: z.enum(['draft', 'publish']).optional(),
  meta: z.record(z.any()).optional(),
});

// 文章搜索验证
export const postSearchSchema = z.object({
  query: z.string().min(1, '搜索关键词不能为空'),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  sortBy: z.enum(['date', 'views', 'title']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// ==================== 评论相关 ====================

// 评论创建验证
export const commentSchema = z.object({
  postId: z.number(),
  content: z
    .string()
    .min(1, '评论内容不能为空')
    .max(1000, '评论最多 1000 个字符'),
  parentId: z.number().optional(),
});

// 评论更新验证
export const updateCommentSchema = z.object({
  content: z
    .string()
    .min(1, '评论内容不能为空')
    .max(1000, '评论最多 1000 个字符'),
});

// ==================== 联系表单 ====================

// 联系表单验证
export const contactFormSchema = z.object({
  name: z.string().min(1, '姓名不能为空').max(100, '姓名最多 100 个字符'),
  email: z.string().email('请输入有效的邮箱地址'),
  subject: z
    .string()
    .min(1, '主题不能为空')
    .max(200, '主题最多 200 个字符'),
  message: z
    .string()
    .min(10, '消息内容至少 10 个字符')
    .max(2000, '消息最多 2000 个字符'),
});

// ==================== 作品集相关 ====================

// 项目创建/更新验证
export const projectSchema = z.object({
  title: z
    .string()
    .min(1, '项目标题不能为空')
    .max(200, '项目标题最多 200 个字符'),
  description: z
    .string()
    .min(1, '项目描述不能为空')
    .max(1000, '项目描述最多 1000 个字符'),
  content: z.string().optional(),
  thumbnail: z.string().url('请输入有效的图片 URL').optional(),
  images: z.array(z.string().url('请输入有效的图片 URL')).optional(),
  technologies: z.array(z.string()).optional(),
  demoUrl: z.string().url('请输入有效的演示 URL').optional(),
  repositoryUrl: z.string().url('请输入有效的仓库 URL').optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  featured: z.boolean().optional(),
});

// ==================== 设置相关 ====================

// 站点设置验证
export const siteSettingsSchema = z.object({
  siteName: z
    .string()
    .min(1, '站点名称不能为空')
    .max(100, '站点名称最多 100 个字符'),
  siteDescription: z
    .string()
    .max(500, '站点描述最多 500 个字符')
    .optional(),
  siteLogo: z.string().url('请输入有效的图片 URL').optional(),
  siteFavicon: z.string().url('请输入有效的图片 URL').optional(),
  socialLinks: z
    .record(z.string().url('请输入有效的 URL'))
    .optional(),
});

// ==================== 工具类型 ====================

// 从 schema 推断类型
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type PostInput = z.infer<typeof postSchema>;
export type PostSearchInput = z.infer<typeof postSearchSchema>;
export type CommentInput = z.infer<typeof commentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;

// ==================== 错误类型 ====================

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult<T = any> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
}

// ==================== 验证工具函数 ====================

/**
 * 验证数据并返回格式化的结果
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  try {
    const validatedData = schema.parse(data);
    return {
      success: true,
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: ValidationError[] = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return {
        success: false,
        errors,
      };
    }
    return {
      success: false,
      errors: [{ field: 'unknown', message: '未知验证错误' }],
    };
  }
}

/**
 * 安全地解析数据，不抛出异常
 */
export function safeParseData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
  return schema.safeParse(data);
}
