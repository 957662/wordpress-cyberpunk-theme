/**
 * 验证工具函数
 */

/**
 * 验证邮箱地址
 */
export function validateEmail(email: string): {
  isValid: boolean;
  error?: string;
} {
  if (!email) {
    return { isValid: false, error: '邮箱不能为空' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: '邮箱格式不正确' };
  }

  return { isValid: true };
}

/**
 * 验证用户名
 */
export function validateUsername(username: string): {
  isValid: boolean;
  error?: string;
} {
  if (!username) {
    return { isValid: false, error: '用户名不能为空' };
  }

  if (username.length < 3) {
    return { isValid: false, error: '用户名至少需要3个字符' };
  }

  if (username.length > 20) {
    return { isValid: false, error: '用户名最多20个字符' };
  }

  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!usernameRegex.test(username)) {
    return {
      isValid: false,
      error: '用户名只能包含字母、数字、下划线和连字符',
    };
  }

  return { isValid: true };
}

/**
 * 验证密码
 */
export function validatePassword(password: string): {
  isValid: boolean;
  error?: string;
  strength?: 'weak' | 'medium' | 'strong';
} {
  if (!password) {
    return { isValid: false, error: '密码不能为空' };
  }

  if (password.length < 8) {
    return { isValid: false, error: '密码至少需要8个字符' };
  }

  if (password.length > 128) {
    return { isValid: false, error: '密码最多128个字符' };
  }

  // 计算密码强度
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  let score = 0;

  // 长度加分
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;

  // 包含小写字母
  if (/[a-z]/.test(password)) score += 1;

  // 包含大写字母
  if (/[A-Z]/.test(password)) score += 1;

  // 包含数字
  if (/[0-9]/.test(password)) score += 1;

  // 包含特殊字符
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  if (score >= 4) {
    strength = 'strong';
  } else if (score >= 3) {
    strength = 'medium';
  }

  return { isValid: true, strength };
}

/**
 * 验证 URL
 */
export function validateUrl(url: string): {
  isValid: boolean;
  error?: string;
} {
  if (!url) {
    return { isValid: false, error: 'URL不能为空' };
  }

  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'URL格式不正确' };
  }
}

/**
 * 验证手机号（中国大陆）
 */
export function validatePhoneNumber(phone: string): {
  isValid: boolean;
  error?: string;
} {
  if (!phone) {
    return { isValid: false, error: '手机号不能为空' };
  }

  const phoneRegex = /^1[3-9]\d{9}$/;
  if (!phoneRegex.test(phone)) {
    return { isValid: false, error: '手机号格式不正确' };
  }

  return { isValid: true };
}

/**
 * 验证身份证号（中国大陆）
 */
export function validateIdCard(idCard: string): {
  isValid: boolean;
  error?: string;
} {
  if (!idCard) {
    return { isValid: false, error: '身份证号不能为空' };
  }

  // 15位或18位
  const idCardRegex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if (!idCardRegex.test(idCard)) {
    return { isValid: false, error: '身份证号格式不正确' };
  }

  // TODO: 添加更复杂的校验逻辑（地区码、出生日期、校验位等）

  return { isValid: true };
}

/**
 * 验证文章标题
 */
export function validateArticleTitle(title: string): {
  isValid: boolean;
  error?: string;
} {
  if (!title) {
    return { isValid: false, error: '标题不能为空' };
  }

  if (title.length < 5) {
    return { isValid: false, error: '标题至少需要5个字符' };
  }

  if (title.length > 200) {
    return { isValid: false, error: '标题最多200个字符' };
  }

  return { isValid: true };
}

/**
 * 验证文章内容
 */
export function validateArticleContent(content: string): {
  isValid: boolean;
  error?: string;
} {
  if (!content) {
    return { isValid: false, error: '内容不能为空' };
  }

  if (content.length < 50) {
    return { isValid: false, error: '内容至少需要50个字符' };
  }

  if (content.length > 100000) {
    return { isValid: false, error: '内容最多100000个字符' };
  }

  return { isValid: true };
}

/**
 * 验证标签
 */
export function validateTag(tag: string): {
  isValid: boolean;
  error?: string;
} {
  if (!tag) {
    return { isValid: false, error: '标签不能为空' };
  }

  if (tag.length > 30) {
    return { isValid: false, error: '标签最多30个字符' };
  }

  const tagRegex = /^[a-zA-Z0-9\u4e00-\u9fa5_-]+$/;
  if (!tagRegex.test(tag)) {
    return {
      isValid: false,
      error: '标签只能包含字母、数字、中文、下划线和连字符',
    };
  }

  return { isValid: true };
}

/**
 * 验证文件类型
 */
export function validateFileType(
  file: File,
  allowedTypes: string[]
): {
  isValid: boolean;
  error?: string;
} {
  if (!file) {
    return { isValid: false, error: '请选择文件' };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `只允许上传以下类型的文件：${allowedTypes.join(', ')}`,
    };
  }

  return { isValid: true };
}

/**
 * 验证文件大小
 */
export function validateFileSize(
  file: File,
  maxSizeInMB: number
): {
  isValid: boolean;
  error?: string;
} {
  if (!file) {
    return { isValid: false, error: '请选择文件' };
  }

  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    return {
      isValid: false,
      error: `文件大小不能超过 ${maxSizeInMB}MB`,
    };
  }

  return { isValid: true };
}

/**
 * 验证图片尺寸
 */
export function validateImageDimensions(
  file: File,
  minWidth: number,
  minHeight: number
): Promise<{
  isValid: boolean;
  error?: string;
}> {
  return new Promise((resolve) => {
    if (!file) {
      resolve({ isValid: false, error: '请选择图片' });
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      if (img.width < minWidth || img.height < minHeight) {
        resolve({
          isValid: false,
          error: `图片尺寸至少为 ${minWidth}x${minHeight}`,
        });
      } else {
        resolve({ isValid: true });
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ isValid: false, error: '图片加载失败' });
    };

    img.src = url;
  });
}
