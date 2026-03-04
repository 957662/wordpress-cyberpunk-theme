/**
 * Validators 工具函数测试
 * ============================================================================
 * 功能: 测试验证器工具函数的所有功能
 * 版本: 1.0.0
 * 日期: 2026-03-05
 * ============================================================================
 */

import {
  validateEmail,
  validatePassword,
  validateUsername,
  validateUrl,
  validatePhone,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validatePattern,
  validateRange,
  validateDate,
  validateNumber,
  validateFile,
  validateImage,
} from '@/lib/utils/validators'

describe('验证器工具函数', () => {
  describe('validateEmail', () => {
    it('应该接受有效的邮箱地址', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name@example.com')).toBe(true)
      expect(validateEmail('user+tag@example.co.uk')).toBe(true)
      expect(validateEmail('123@test.com')).toBe(true)
    })

    it('应该拒绝无效的邮箱地址', () => {
      expect(validateEmail('')).toBe(false)
      expect(validateEmail('invalid')).toBe(false)
      expect(validateEmail('@example.com')).toBe(false)
      expect(validateEmail('test@')).toBe(false)
      expect(validateEmail('test@.com')).toBe(false)
      expect(validateEmail('test..test@example.com')).toBe(false)
    })

    it('应该处理边界情况', () => {
      expect(validateEmail('a@b.c')).toBe(true)
      expect(validateEmail('very.long.email.address@very.long.domain.name.com')).toBe(true)
    })
  })

  describe('validatePassword', () => {
    it('应该接受有效的密码', () => {
      expect(validatePassword('Password123!')).toBe(true)
      expect(validatePassword('SecureP@ssw0rd')).toBe(true)
      expect(validatePassword('MyP@ss123')).toBe(true)
    })

    it('应该拒绝无效的密码', () => {
      expect(validatePassword('')).toBe(false)
      expect(validatePassword('password')).toBe(false) // 没有大写字母和数字
      expect(validatePassword('PASSWORD')).toBe(false) // 没有小写字母和数字
      expect(validatePassword('Password')).toBe(false) // 没有数字
      expect(validatePassword('12345678')).toBe(false) // 没有字母
      expect(validatePassword('Pass1')).toBe(false) // 太短
    })

    it('应该支持自定义最小长度', () => {
      expect(validatePassword('Pass1!', { minLength: 6 })).toBe(true)
      expect(validatePassword('Pass1!', { minLength: 10 })).toBe(false)
    })

    it('应该支持自定义强度要求', () => {
      expect(validatePassword('Password123', {
        requireSpecialChar: false
      })).toBe(true)

      expect(validatePassword('Password123!', {
        requireSpecialChar: true
      })).toBe(true)
    })
  })

  describe('validateUsername', () => {
    it('应该接受有效的用户名', () => {
      expect(validateUsername('user123')).toBe(true)
      expect(validateUsername('john_doe')).toBe(true)
      expect(validateUsername('test-user')).toBe(true)
      expect(validateUsername('User.Name')).toBe(true)
    })

    it('应该拒绝无效的用户名', () => {
      expect(validateUsername('')).toBe(false)
      expect(validateUsername('ab')).toBe(false) // 太短
      expect(validateUsername('user@name')).toBe(false) // 包含特殊字符
      expect(validateUsername('user name')).toBe(false) // 包含空格
      expect(validateUsername('123')).toBe(false) // 纯数字
    })

    it('应该支持自定义最小和最大长度', () => {
      expect(validateUsername('user', { minLength: 4, maxLength: 10 })).toBe(true)
      expect(validateUsername('usr', { minLength: 4, maxLength: 10 })).toBe(false)
      expect(validateUsername('verylongusername', { minLength: 4, maxLength: 10 })).toBe(false)
    })
  })

  describe('validateUrl', () => {
    it('应该接受有效的 URL', () => {
      expect(validateUrl('https://example.com')).toBe(true)
      expect(validateUrl('http://example.com')).toBe(true)
      expect(validateUrl('https://www.example.com')).toBe(true)
      expect(validateUrl('https://example.com/path')).toBe(true)
      expect(validateUrl('https://example.com?query=1')).toBe(true)
      expect(validateUrl('https://example.com#section')).toBe(true)
    })

    it('应该拒绝无效的 URL', () => {
      expect(validateUrl('')).toBe(false)
      expect(validateUrl('example.com')).toBe(false) // 没有协议
      expect(validateUrl('http://')).toBe(false)
      expect(validateUrl('not a url')).toBe(false)
    })

    it('应该支持自定义协议', () => {
      expect(validateUrl('ftp://example.com', { protocols: ['http', 'https', 'ftp'] })).toBe(true)
      expect(validateUrl('ftp://example.com', { protocols: ['http', 'https'] })).toBe(false)
    })
  })

  describe('validatePhone', () => {
    it('应该接受有效的电话号码', () => {
      expect(validatePhone('1234567890')).toBe(true)
      expect(validatePhone('+11234567890')).toBe(true)
      expect(validatePhone('(123) 456-7890')).toBe(true)
      expect(validatePhone('123-456-7890')).toBe(true)
    })

    it('应该拒绝无效的电话号码', () => {
      expect(validatePhone('')).toBe(false)
      expect(validatePhone('123')).toBe(false) // 太短
      expect(validatePhone('abcdefghij')).toBe(false) // 非数字
    })

    it('应该支持自定义格式', () => {
      expect(validatePhone('1234567890', { format: 'US' })).toBe(true)
      expect(validatePhone('+861234567890', { format: 'CN' })).toBe(true)
    })
  })

  describe('validateRequired', () => {
    it('应该接受非空值', () => {
      expect(validateRequired('text')).toBe(true)
      expect(validateRequired('0')).toBe(true)
      expect(validateRequired(0)).toBe(true)
      expect(validateRequired(false)).toBe(true)
    })

    it('应该拒绝空值', () => {
      expect(validateRequired('')).toBe(false)
      expect(validateRequired(null)).toBe(false)
      expect(validateRequired(undefined)).toBe(false)
      expect(validateRequired([])).toBe(false)
      expect(validateRequired({})).toBe(false)
    })
  })

  describe('validateMinLength', () => {
    it('应该接受满足最小长度的值', () => {
      expect(validateMinLength('hello', 3)).toBe(true)
      expect(validateMinLength('hello', 5)).toBe(true)
      expect(validateMinLength([1, 2, 3], 3)).toBe(true)
    })

    it('应该拒绝不满足最小长度的值', () => {
      expect(validateMinLength('hi', 3)).toBe(false)
      expect(validateMinLength('', 1)).toBe(false)
      expect(validateMinLength([1, 2], 3)).toBe(false)
    })

    it('应该处理边界情况', () => {
      expect(validateMinLength('hello', 0)).toBe(true)
      expect(validateMinLength('', 0)).toBe(true)
    })
  })

  describe('validateMaxLength', () => {
    it('应该接受满足最大长度的值', () => {
      expect(validateMaxLength('hi', 5)).toBe(true)
      expect(validateMaxLength('hello', 5)).toBe(true)
      expect(validateMaxLength([1, 2], 5)).toBe(true)
    })

    it('应该拒绝超过最大长度的值', () => {
      expect(validateMaxLength('hello world', 5)).toBe(false)
      expect(validateMaxLength([1, 2, 3, 4, 5, 6], 5)).toBe(false)
    })
  })

  describe('validatePattern', () => {
    it('应该接受匹配模式的值', () => {
      expect(validatePattern('abc123', /^[a-z0-9]+$/)).toBe(true)
      expect(validatePattern('test@example.com', /^[^@]+@[^@]+\.[^@]+$/)).toBe(true)
    })

    it('应该拒绝不匹配模式的值', () => {
      expect(validatePattern('ABC123', /^[a-z0-9]+$/)).toBe(false)
      expect(validatePattern('invalid', /^[^@]+@[^@]+\.[^@]+$/)).toBe(false)
    })

    it('应该支持自定义错误消息', () => {
      const result = validatePattern('ABC', /^[a-z]+$/, '只允许小写字母')
      expect(result).toBe(false)
    })
  })

  describe('validateRange', () => {
    it('应该接受在范围内的数字', () => {
      expect(validateRange(5, { min: 1, max: 10 })).toBe(true)
      expect(validateRange(1, { min: 1, max: 10 })).toBe(true)
      expect(validateRange(10, { min: 1, max: 10 })).toBe(true)
    })

    it('应该拒绝超出范围的数字', () => {
      expect(validateRange(0, { min: 1, max: 10 })).toBe(false)
      expect(validateRange(11, { min: 1, max: 10 })).toBe(false)
    })

    it('应该支持只有最小值或最大值', () => {
      expect(validateRange(5, { min: 1 })).toBe(true)
      expect(validateRange(0, { min: 1 })).toBe(false)

      expect(validateRange(5, { max: 10 })).toBe(true)
      expect(validateRange(11, { max: 10 })).toBe(false)
    })
  })

  describe('validateDate', () => {
    it('应该接受有效的日期', () => {
      expect(validateDate('2024-03-05')).toBe(true)
      expect(validateDate('2024-03-05T12:00:00Z')).toBe(true)
      expect(validateDate(new Date())).toBe(true)
    })

    it('应该拒绝无效的日期', () => {
      expect(validateDate('')).toBe(false)
      expect(validateDate('invalid')).toBe(false)
      expect(validateDate('2024-13-01')).toBe(false) // 无效月份
      expect(validateDate('2024-02-30')).toBe(false) // 无效日期
    })

    it('应该支持最小和最大日期', () => {
      const minDate = new Date('2024-01-01')
      const maxDate = new Date('2024-12-31')

      expect(validateDate('2024-06-01', { min: minDate, max: maxDate })).toBe(true)
      expect(validateDate('2023-06-01', { min: minDate, max: maxDate })).toBe(false)
      expect(validateDate('2025-06-01', { min: minDate, max: maxDate })).toBe(false)
    })
  })

  describe('validateNumber', () => {
    it('应该接受有效的数字', () => {
      expect(validateNumber(123)).toBe(true)
      expect(validateNumber(12.34)).toBe(true)
      expect(validateNumber('123')).toBe(true)
      expect(validateNumber('12.34')).toBe(true)
    })

    it('应该拒绝无效的数字', () => {
      expect(validateNumber('')).toBe(false)
      expect(validateNumber('abc')).toBe(false)
      expect(validateNumber(NaN)).toBe(false)
      expect(validateNumber(Infinity)).toBe(false)
    })

    it('应该支持整数验证', () => {
      expect(validateNumber(123, { integer: true })).toBe(true)
      expect(validateNumber(12.34, { integer: true })).toBe(false)
    })

    it('应该支持正数验证', () => {
      expect(validateNumber(123, { positive: true })).toBe(true)
      expect(validateNumber(-123, { positive: true })).toBe(false)
    })

    it('应该支持负数验证', () => {
      expect(validateNumber(-123, { negative: true })).toBe(true)
      expect(validateNumber(123, { negative: true })).toBe(false)
    })
  })

  describe('validateFile', () => {
    it('应该接受有效的文件', () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' })
      expect(validateFile(file, { maxSize: 1024 * 1024 })).toBe(true)
    })

    it('应该拒绝超过大小的文件', () => {
      const largeFile = new File([new Array(2 * 1024 * 1024).fill('x').join('')], 'large.txt')
      expect(validateFile(largeFile, { maxSize: 1024 * 1024 })).toBe(false)
    })

    it('应该支持文件类型验证', () => {
      const imageFile = new File(['content'], 'image.jpg', { type: 'image/jpeg' })
      const textFile = new File(['content'], 'document.txt', { type: 'text/plain' })

      expect(validateFile(imageFile, { allowedTypes: ['image/jpeg', 'image/png'] })).toBe(true)
      expect(validateFile(textFile, { allowedTypes: ['image/jpeg', 'image/png'] })).toBe(false)
    })
  })

  describe('validateImage', () => {
    it('应该接受有效的图片文件', () => {
      const jpgFile = new File(['content'], 'image.jpg', { type: 'image/jpeg' })
      const pngFile = new File(['content'], 'image.png', { type: 'image/png' })
      const gifFile = new File(['content'], 'image.gif', { type: 'image/gif' })
      const webpFile = new File(['content'], 'image.webp', { type: 'image/webp' })

      expect(validateImage(jpgFile)).toBe(true)
      expect(validateImage(pngFile)).toBe(true)
      expect(validateImage(gifFile)).toBe(true)
      expect(validateImage(webpFile)).toBe(true)
    })

    it('应该拒绝非图片文件', () => {
      const textFile = new File(['content'], 'document.txt', { type: 'text/plain' })
      const pdfFile = new File(['content'], 'document.pdf', { type: 'application/pdf' })

      expect(validateImage(textFile)).toBe(false)
      expect(validateImage(pdfFile)).toBe(false)
    })

    it('应该支持最大尺寸限制', () => {
      const smallImage = new File(['content'], 'small.jpg', { type: 'image/jpeg' })
      const largeImage = new File([new Array(5 * 1024 * 1024).fill('x').join('')], 'large.jpg', { type: 'image/jpeg' })

      expect(validateImage(smallImage, { maxSize: 10 * 1024 * 1024 })).toBe(true)
      expect(validateImage(largeImage, { maxSize: 1024 * 1024 })).toBe(false)
    })
  })
})
