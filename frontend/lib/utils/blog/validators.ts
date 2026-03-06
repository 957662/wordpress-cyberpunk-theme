/**
 * Blog Validators
 * 博客数据验证工具函数
 */

/**
 * 验证文章标题
 */
export function validateTitle(title: string): {
  valid: boolean;
  error?: string;
} {
  if (!title || title.trim().length === 0) {
    return { valid: false, error: '标题不能为空' };
  }

  if (title.length < 5) {
    return { valid: false, error: '标题至少需要 5 个字符' };
  }

  if (title.length > 200) {
    return { valid: false, error: '标题不能超过 200 个字符' };
  }

  return { valid: true };
}

/**
 * 验证文章内容
 */
export function validateContent(content: string): {
  valid: boolean;
  error?: string;
} {
  if (!content || content.trim().length === 0) {
    return { valid: false, error: '内容不能为空' };
  }

  // 移除 HTML 标签后检查长度
  const textContent = content.replace(/<[^>]*>/g, '');

  if (textContent.length < 50) {
    return { valid: false, error: '内容至少需要 50 个字符' };
  }

  return { valid: true };
}

/**
 * 验证文章摘要
 */
export function validateExcerpt(excerpt: string): {
  valid: boolean;
  error?: string;
} {
  if (!excerpt || excerpt.trim().length === 0) {
    return { valid: false, error: '摘要不能为空' };
  }

  if (excerpt.length > 500) {
    return { valid: false, error: '摘要不能超过 500 个字符' };
  }

  return { valid: true };
}

/**
 * 验证分类 slug
 */
export function validateCategorySlug(slug: string): {
  valid: boolean;
  error?: string;
} {
  if (!slug || slug.trim().length === 0) {
    return { valid: false, error: '分类不能为空' };
  }

  // 只允许字母、数字、连字符
  const slugRegex = /^[a-z0-9-]+$/;

  if (!slugRegex.test(slug)) {
    return { valid: false, error: '分类只能包含小写字母、数字和连字符' };
  }

  return { valid: true };
}

/**
 * 验证标签 slug
 */
export function validateTagSlug(slug: string): {
  valid: boolean;
  error?: string;
} {
  if (!slug || slug.trim().length === 0) {
    return { valid: false, error: '标签不能为空' };
  }

  // 只允许字母、数字、连字符
  const slugRegex = /^[a-z0-9-]+$/;

  if (!slugRegex.test(slug)) {
    return { valid: false, error: '标签只能包含小写字母、数字和连字符' };
  }

  return { valid: true };
}

/**
 * 验证文章 URL slug
 */
export function validatePostSlug(slug: string): {
  valid: boolean;
  error?: string;
} {
  if (!slug || slug.trim().length === 0) {
    return { valid: false, error: 'URL slug 不能为空' };
  }

  // 只允许字母、数字、连字符
  const slugRegex = /^[a-z0-9-]+$/;

  if (!slugRegex.test(slug)) {
    return { valid: false, error: 'URL slug 只能包含小写字母、数字和连字符' };
  }

  if (slug.length > 200) {
    return { valid: false, error: 'URL slug 不能超过 200 个字符' };
  }

  return { valid: true };
}

/**
 * 验证搜索查询
 */
export function validateSearchQuery(query: string): {
  valid: boolean;
  error?: string;
} {
  if (!query || query.trim().length === 0) {
    return { valid: false, error: '搜索关键词不能为空' };
  }

  if (query.length < 2) {
    return { valid: false, error: '搜索关键词至少需要 2 个字符' };
  }

  if (query.length > 100) {
    return { valid: false, error: '搜索关键词不能超过 100 个字符' };
  }

  return { valid: true };
}
