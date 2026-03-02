/**
 * 验证工具函数
 */

import { z } from 'zod';

/**
 * 邮箱验证规则
 */
export const emailSchema = z
  .string()
  .min(1, '邮箱不能为空')
  .email('邮箱格式不正确')
  .max(255, '邮箱长度不能超过255个字符');

/**
 * 密码验证规则
 */
export const passwordSchema = z
  .string()
  .min(8, '密码长度至少8位')
  .regex(/[a-z]/, '密码必须包含小写字母')
  .regex(/[A-Z]/, '密码必须包含大写字母')
  .regex(/\d/, '密码必须包含数字');

/**
 * 登录表单验证
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, '密码不能为空'),
  remember: z.boolean().optional()
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * 注册表单验证
 */
export const registerSchema = z.object({
  username: z.string().min(3, '用户名至少3个字符').max(20, '用户名最多20个字符'),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: '两次密码输入不一致',
  path: ['confirmPassword']
});

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * 评论表单验证
 */
export const commentSchema = z.object({
  content: z.string().min(1, '评论内容不能为空').max(1000, '评论内容不能超过1000个字符')
});

export type CommentFormData = z.infer<typeof commentSchema>;
