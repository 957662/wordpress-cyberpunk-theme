/**
 * Code Preview Service
 * 代码预览服务 - 处理代码展示和格式化
 */

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export interface CodeBlock {
  code: string;
  language: string;
  title?: string;
  fileName?: string;
}

export interface FormattedCode {
  html: string;
  lines: number;
  characters: number;
}

class CodePreviewService {
  /**
   * 格式化代码块
   */
  static formatCode(code: string, language: string): FormattedCode {
    const lines = code.split('\n');
    return {
      html: code,
      lines: lines.length,
      characters: code.length,
    };
  }

  /**
   * 获取语言显示名称
   */
  static getLanguageDisplayName(language: string): string {
    const displayNames: Record<string, string> = {
      javascript: 'JavaScript',
      typescript: 'TypeScript',
      python: 'Python',
      java: 'Java',
      cpp: 'C++',
      csharp: 'C#',
      go: 'Go',
      rust: 'Rust',
      php: 'PHP',
      ruby: 'Ruby',
      swift: 'Swift',
      kotlin: 'Kotlin',
      html: 'HTML',
      css: 'CSS',
      scss: 'SCSS',
      json: 'JSON',
      xml: 'XML',
      yaml: 'YAML',
      markdown: 'Markdown',
      bash: 'Bash',
      shell: 'Shell',
      sql: 'SQL',
      dockerfile: 'Dockerfile',
    };

    return displayNames[language] || language.toUpperCase();
  }

  /**
   * 获取文件扩展名
   */
  static getFileExtension(language: string): string {
    const extensions: Record<string, string> = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      csharp: 'cs',
      go: 'go',
      rust: 'rs',
      php: 'php',
      ruby: 'rb',
      swift: 'swift',
      kotlin: 'kt',
      html: 'html',
      css: 'css',
      scss: 'scss',
      json: 'json',
      xml: 'xml',
      yaml: 'yml',
      markdown: 'md',
      bash: 'sh',
      shell: 'sh',
      sql: 'sql',
      dockerfile: 'dockerfile',
    };

    return extensions[language] || 'txt';
  }

  /**
   * 生成文件名
   */
  static generateFileName(language: string, prefix = 'code'): string {
    const extension = this.getFileExtension(language);
    return `${prefix}.${extension}`;
  }

  /**
   * 复制代码到剪贴板
   */
  static async copyToClipboard(code: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(code);
      return true;
    } catch (err) {
      console.error('Failed to copy code:', err);
      return false;
    }
  }

  /**
   * 下载代码文件
   */
  static downloadCode(code: string, filename: string): void {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * 提取代码摘要
   */
  static extractCodeExcerpt(code: string, maxLines = 5): string {
    const lines = code.split('\n');
    return lines.slice(0, maxLines).join('\n');
  }

  /**
   * 统计代码信息
   */
  static analyzeCode(code: string): {
    lines: number;
    characters: number;
    charactersWithoutSpaces: number;
    words: number;
  } {
    const lines = code.split('\n');
    const characters = code.length;
    const charactersWithoutSpaces = code.replace(/\s/g, '').length;
    const words = code.trim().split(/\s+/).filter(Boolean).length;

    return {
      lines: lines.length,
      characters,
      charactersWithoutSpaces,
      words,
    };
  }

  /**
   * 检测代码语言（简单实现）
   */
  static detectLanguage(code: string): string {
    // 简单的语言检测逻辑
    if (code.includes('import React') || code.includes('const ') && code.includes('=>')) {
      return 'javascript';
    }
    if (code.includes('interface ') || code.includes(': string') || code.includes(': number')) {
      return 'typescript';
    }
    if (code.includes('def ') || code.includes('import ') && code.includes('from ')) {
      return 'python';
    }
    if (code.includes('public class') || code.includes('public static void main')) {
      return 'java';
    }
    if (code.includes('#include') || code.includes('std::')) {
      return 'cpp';
    }
    if (code.includes('package main') || code.includes('func ')) {
      return 'go';
    }
    if (code.includes('fn main()') || code.includes('impl ')) {
      return 'rust';
    }

    return 'plaintext';
  }

  /**
   * 格式化代码为HTML（带语法高亮）
   */
  static highlightCode(code: string, language: string): string {
    // 这里可以使用 highlight.js 或 prism.js 进行实际的高亮处理
    // 目前返回简单的 HTML 格式
    const escapedCode = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    return escapedCode;
  }

  /**
   * 创建可分享的代码链接
   */
  static createShareableLink(code: string): string {
    // 使用 base64 编码代码
    const encoded = btoa(encodeURIComponent(code));
    return `${window.location.origin}/code/share?c=${encoded}`;
  }

  /**
   * 从分享链接解码代码
   */
  static decodeSharedCode(encoded: string): string | null {
    try {
      return decodeURIComponent(atob(encoded));
    } catch (err) {
      console.error('Failed to decode shared code:', err);
      return null;
    }
  }

  /**
   * 验证代码语法（简单实现）
   */
  static validateSyntax(code: string, language: string): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // 基本的语法检查
    const openBraces = (code.match(/\{/g) || []).length;
    const closeBraces = (code.match(/\}/g) || []).length;
    const openParens = (code.match(/\(/g) || []).length;
    const closeParens = (code.match(/\)/g) || []).length;

    if (openBraces !== closeBraces) {
      errors.push('大括号不匹配');
    }

    if (openParens !== closeParens) {
      errors.push('括号不匹配');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * 格式化代码（简单的缩进处理）
   */
  static formatCodeIndentation(code: string, indentSize = 2): string {
    const lines = code.split('\n');
    let indentLevel = 0;
    const indentChar = ' ';

    const formattedLines = lines.map((line) => {
      const trimmed = line.trim();

      // 减少缩进
      if (trimmed.startsWith('}') || trimmed.startsWith(']') || trimmed.startsWith(')')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }

      // 应用缩进
      const indentedLine = indentChar.repeat(indentLevel * indentSize) + trimmed;

      // 增加缩进
      if (trimmed.endsWith('{') || trimmed.endsWith('[') || trimmed.endsWith('(')) {
        indentLevel++;
      }

      return indentedLine;
    });

    return formattedLines.join('\n');
  }

  /**
   * 获取代码预览配置
   */
  static getPreviewConfig() {
    return {
      theme: 'vscDarkPlus',
      showLineNumbers: true,
      wrapLines: false,
      maxHeight: '600px',
    };
  }

  /**
   * 获取支持的编程语言列表
   */
  static getSupportedLanguages(): string[] {
    return [
      'javascript',
      'typescript',
      'python',
      'java',
      'cpp',
      'csharp',
      'go',
      'rust',
      'php',
      'ruby',
      'swift',
      'kotlin',
      'html',
      'css',
      'scss',
      'json',
      'xml',
      'yaml',
      'markdown',
      'bash',
      'shell',
      'sql',
      'dockerfile',
    ];
  }
}

export default CodePreviewService;
