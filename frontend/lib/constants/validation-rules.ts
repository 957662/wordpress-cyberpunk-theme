/**
 * 表单验证规则
 * 集中管理所有验证规则和错误消息
 */

export const VALIDATION_RULES = {
  // 邮箱验证
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: '请输入有效的邮箱地址',
    required: true
  },

  // 用户名验证
  username: {
    pattern: /^[a-zA-Z0-9_]{4,20}$/,
    message: '用户名必须是4-20位的字母、数字或下划线',
    required: true
  },

  // 密码验证
  password: {
    minLength: 8,
    maxLength: 128,
    message: '密码至少需要8个字符',
    strengthMessage: '密码应包含大小写字母、数字和特殊字符',
    required: true
  },

  // 手机号验证（中国）
  phone: {
    pattern: /^1[3-9]\d{9}$/,
    message: '请输入有效的手机号码',
    required: false
  },

  // URL 验证
  url: {
    pattern: /^https?:\/\/.+/,
    message: '请输入有效的 URL（以 http:// 或 https:// 开头）',
    required: false
  },

  // 数字验证
  number: {
    pattern: /^\d+(\.\d+)?$/,
    message: '请输入有效的数字',
    required: false
  },

  // 正整数验证
  positiveInteger: {
    pattern: /^[1-9]\d*$/,
    message: '请输入有效的正整数',
    required: false
  },

  // 日期验证
  date: {
    pattern: /^\d{4}-\d{2}-\d{2}$/,
    message: '请输入有效的日期（YYYY-MM-DD）',
    required: false
  },

  // 文本长度验证
  text: {
    minLength: 1,
    maxLength: 1000,
    message: '文本长度必须在1-1000个字符之间',
    required: false
  },

  // 标题验证
  title: {
    minLength: 2,
    maxLength: 200,
    message: '标题长度必须在2-200个字符之间',
    required: true
  },

  // 内容验证
  content: {
    minLength: 10,
    maxLength: 50000,
    message: '内容长度必须在10-50000个字符之间',
    required: true
  },

  // 标签验证
  slug: {
    pattern: /^[a-z0-9-]+$/,
    message: '标签只能包含小写字母、数字和连字符',
    required: false
  },

  // 文件验证
  image: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    message: '请上传不超过5MB的图片文件（JPEG、PNG、GIF、WebP）',
    required: false
  },

  // 视频验证
  video: {
    maxSize: 100 * 1024 * 1024, // 100MB
    allowedTypes: ['video/mp4', 'video/webm', 'video/ogg'],
    message: '请上传不超过100MB的视频文件（MP4、WebM、OGG）',
    required: false
  },

  // 文档验证
  document: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ],
    message: '请上传不超过10MB的文档文件',
    required: false
  }
} as const;

// 密码强度规则
export const PASSWORD_STRENGTH = {
  WEAK: {
    score: 0,
    color: 'text-red-500',
    label: '弱'
  },
  MEDIUM: {
    score: 50,
    color: 'text-yellow-500',
    label: '中'
  },
  STRONG: {
    score: 75,
    color: 'text-green-500',
    label: '强'
  },
  VERY_STRONG: {
    score: 100,
    color: 'text-cyber-primary',
    label: '很强'
  }
} as const;

// 文件大小限制
export const FILE_SIZE_LIMITS = {
  AVATAR: 2 * 1024 * 1024, // 2MB
  IMAGE: 5 * 1024 * 1024, // 5MB
  VIDEO: 100 * 1024 * 1024, // 100MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
  ARCHIVE: 50 * 1024 * 1024 // 50MB
} as const;

// 允许的文件类型
export const ALLOWED_FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  VIDEOS: ['video/mp4', 'video/webm', 'video/ogg'],
  DOCUMENTS: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/csv'
  ],
  ARCHIVES: ['application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed']
} as const;

// 表单提交限制
export const FORM_LIMITS = {
  MAX_UPLOAD_SIZE: 20 * 1024 * 1024, // 20MB
  MAX_FILES_PER_UPLOAD: 10,
  MAX_TAGS: 10,
  MAX_CATEGORIES: 5,
  MAX_LINKS: 20
} as const;

// 错误消息模板
export const ERROR_MESSAGES = {
  REQUIRED: '此字段为必填项',
  INVALID_EMAIL: '请输入有效的邮箱地址',
  INVALID_URL: '请输入有效的 URL',
  INVALID_PHONE: '请输入有效的手机号码',
  PASSWORD_TOO_SHORT: '密码至少需要{minLength}个字符',
  PASSWORD_TOO_WEAK: '密码强度不足，请增加复杂度',
  FILE_TOO_LARGE: '文件大小不能超过{maxSize}',
  INVALID_FILE_TYPE: '不支持的文件类型',
  NETWORK_ERROR: '网络连接失败，请检查您的网络',
  SERVER_ERROR: '服务器错误，请稍后重试',
  UNAUTHORIZED: '未授权，请先登录',
  FORBIDDEN: '您没有权限执行此操作',
  NOT_FOUND: '请求的资源不存在',
  UNKNOWN: '发生未知错误，请稍后重试'
} as const;

// 成功消息模板
export const SUCCESS_MESSAGES = {
  LOGIN: '登录成功',
  LOGOUT: '退出成功',
  REGISTER: '注册成功',
  UPDATE_PROFILE: '个人资料更新成功',
  CHANGE_PASSWORD: '密码修改成功',
  UPLOAD_SUCCESS: '文件上传成功',
  DELETE_SUCCESS: '删除成功',
  SAVE_SUCCESS: '保存成功',
  COPY_SUCCESS: '已复制到剪贴板'
} as const;
