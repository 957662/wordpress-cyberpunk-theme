/**
 * 搜索服务
 * 提供全文搜索和过滤功能
 */

export interface SearchDocument {
  /** 文档ID */
  id: string;
  /** 文档标题 */
  title: string;
  /** 文档内容 */
  content: string;
  /** 文档类型 */
  type?: string;
  /** 文档标签 */
  tags?: string[];
  /** 自定义字段 */
  [key: string]: unknown;
}

export interface SearchResult {
  /** 匹配的文档 */
  document: SearchDocument;
  /** 相关性得分 */
  score: number;
  /** 匹配的高亮片段 */
  highlights?: string[];
}

export interface SearchOptions {
  /** 搜索字段 */
  fields?: (keyof SearchDocument)[];
  /** 是否模糊搜索 */
  fuzzy?: boolean;
  /** 模糊搜索的最大编辑距离 */
  fuzzyDistance?: number;
  /** 返回的最大结果数 */
  limit?: number;
  /** 是否高亮匹配文本 */
  highlight?: boolean;
  /** 高亮标签 */
  highlightTags?: {
    before: string;
    after: string;
  };
  /** 权重配置 */
  weights?: {
    title?: number;
    content?: number;
    tags?: number;
  };
}

class SearchService {
  private documents: Map<string, SearchDocument> = new Map();
  private index: Map<string, Set<string>> = new Map(); // token -> document IDs
  private stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were',
    'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up',
    'about', 'into', 'over', 'after', '的', '了', '是', '在', '和',
    '有', '就', '不', '人', '都', '一', '一个', '上', '也', '很',
    '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好',
    '自己', '这',
  ]);

  /**
   * 添加文档
   */
  addDocument(document: SearchDocument): void {
    this.documents.set(document.id, document);
    this.indexDocument(document);
  }

  /**
   * 批量添加文档
   */
  addDocuments(documents: SearchDocument[]): void {
    documents.forEach(doc => this.addDocument(doc));
  }

  /**
   * 更新文档
   */
  updateDocument(document: SearchDocument): void {
    this.removeDocument(document.id);
    this.addDocument(document);
  }

  /**
   * 移除文档
   */
  removeDocument(id: string): void {
    const document = this.documents.get(id);
    if (!document) return;

    this.documents.delete(id);
    this.removeFromIndex(document);
  }

  /**
   * 获取文档
   */
  getDocument(id: string): SearchDocument | undefined {
    return this.documents.get(id);
  }

  /**
   * 获取所有文档
   */
  getAllDocuments(): SearchDocument[] {
    return Array.from(this.documents.values());
  }

  /**
   * 清空所有文档
   */
  clear(): void {
    this.documents.clear();
    this.index.clear();
  }

  /**
   * 索引文档
   */
  private indexDocument(document: SearchDocument): void {
    const text = `${document.title} ${document.content} ${(document.tags || []).join(' ')}`;
    const tokens = this.tokenize(text);

    tokens.forEach(token => {
      if (!this.index.has(token)) {
        this.index.set(token, new Set());
      }
      this.index.get(token)!.add(document.id);
    });
  }

  /**
   * 从索引中移除文档
   */
  private removeFromIndex(document: SearchDocument): void {
    const text = `${document.title} ${document.content} ${(document.tags || []).join(' ')}`;
    const tokens = this.tokenize(text);

    tokens.forEach(token => {
      const docIds = this.index.get(token);
      if (docIds) {
        docIds.delete(document.id);
        if (docIds.size === 0) {
          this.index.delete(token);
        }
      }
    });
  }

  /**
   * 分词
   */
  private tokenize(text: string): string[] {
    // 转换为小写
    text = text.toLowerCase();

    // 移除特殊字符，保留中文、字母、数字
    text = text.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, ' ');

    // 分词
    const tokens: string[] = [];

    // 提取中文词组（简单实现，实际应使用专业分词库）
    const chineseMatches = text.match(/[\u4e00-\u9fa5]+/g);
    if (chineseMatches) {
      chineseMatches.forEach(match => {
        // 简单的中文分词：按字切分
        for (let i = 0; i < match.length; i++) {
          tokens.push(match[i]);
          // 提取双字词组
          if (i < match.length - 1) {
            tokens.push(match.substring(i, i + 2));
          }
        }
      });
    }

    // 提取英文单词
    const englishMatches = text.match(/[a-zA-Z0-9]+/g);
    if (englishMatches) {
      tokens.push(...englishMatches);
    }

    // 过滤停用词
    return tokens.filter(token => !this.stopWords.has(token) && token.length > 0);
  }

  /**
   * 搜索
   */
  search(query: string, options: SearchOptions = {}): SearchResult[] {
    const {
      fields = ['title', 'content', 'tags'],
      fuzzy = true,
      fuzzyDistance = 2,
      limit = 10,
      highlight = true,
      highlightTags = { before: '<mark>', after: '</mark>' },
      weights = { title: 3, content: 1, tags: 2 },
    } = options;

    if (!query.trim()) {
      return [];
    }

    const queryTokens = this.tokenize(query);
    const scores = new Map<string, number>();

    // 计算文档得分
    queryTokens.forEach(queryToken => {
      // 精确匹配
      const exactMatches = this.index.get(queryToken);
      if (exactMatches) {
        exactMatches.forEach(docId => {
          const document = this.documents.get(docId)!;
          const score = this.calculateScore(document, queryToken, weights);
          scores.set(docId, (scores.get(docId) || 0) + score);
        });
      }

      // 模糊匹配
      if (fuzzy) {
        this.index.forEach((docIds, token) => {
          const distance = this.levenshteinDistance(queryToken, token);
          if (distance <= fuzzyDistance && distance > 0) {
            const similarity = 1 - distance / Math.max(queryToken.length, token.length);
            docIds.forEach(docId => {
              const document = this.documents.get(docId)!;
              const score = this.calculateScore(document, token, weights) * similarity * 0.5;
              scores.set(docId, (scores.get(docId) || 0) + score);
            });
          }
        });
      }
    });

    // 转换为结果数组
    let results: SearchResult[] = Array.from(scores.entries()).map(([docId, score]) => {
      const document = this.documents.get(docId)!;
      const result: SearchResult = {
        document,
        score,
      };

      // 生成高亮片段
      if (highlight) {
        result.highlights = this.generateHighlights(document, queryTokens, highlightTags);
      }

      return result;
    });

    // 按得分排序
    results.sort((a, b) => b.score - a.score);

    // 限制结果数量
    return results.slice(0, limit);
  }

  /**
   * 计算文档得分
   */
  private calculateScore(
    document: SearchDocument,
    token: string,
    weights: { title?: number; content?: number; tags?: number }
  ): number {
    let score = 0;

    // 标题匹配
    if (document.title.toLowerCase().includes(token)) {
      score += weights.title || 3;
    }

    // 标签匹配
    if (document.tags?.some(tag => tag.toLowerCase().includes(token))) {
      score += weights.tags || 2;
    }

    // 内容匹配
    const contentLower = document.content.toLowerCase();
    const matches = (contentLower.match(new RegExp(token, 'g')) || []).length;
    score += matches * (weights.content || 1);

    return score;
  }

  /**
   * 计算编辑距离
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const m = str1.length;
    const n = str2.length;
    const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) {
      dp[i][0] = i;
    }
    for (let j = 0; j <= n; j++) {
      dp[0][j] = j;
    }

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = Math.min(
            dp[i - 1][j] + 1, // 删除
            dp[i][j - 1] + 1, // 插入
            dp[i - 1][j - 1] + 1 // 替换
          );
        }
      }
    }

    return dp[m][n];
  }

  /**
   * 生成高亮片段
   */
  private generateHighlights(
    document: SearchDocument,
    queryTokens: string[],
    tags: { before: string; after: string }
  ): string[] {
    const highlights: string[] = [];
    const maxFragmentLength = 200;

    queryTokens.forEach(token => {
      // 在标题中搜索
      const titleIndex = document.title.toLowerCase().indexOf(token);
      if (titleIndex >= 0) {
        const start = Math.max(0, titleIndex - 20);
        const end = Math.min(document.title.length, titleIndex + token.length + 20);
        const fragment = document.title.substring(start, end);
        const highlighted = fragment.replace(
          new RegExp(`(${this.escapeRegex(token)})`, 'gi'),
          `${tags.before}$1${tags.after}`
        );
        highlights.push(highlighted);
      }

      // 在内容中搜索
      const contentLower = document.content.toLowerCase();
      let lastIndex = 0;
      let matchIndex;

      while ((matchIndex = contentLower.indexOf(token, lastIndex)) >= 0 && highlights.length < 3) {
        const start = Math.max(0, matchIndex - 50);
        const end = Math.min(document.content.length, matchIndex + token.length + 50);
        let fragment = document.content.substring(start, end);

        if (start > 0) fragment = '...' + fragment;
        if (end < document.content.length) fragment = fragment + '...';

        const highlighted = fragment.replace(
          new RegExp(`(${this.escapeRegex(token)})`, 'gi'),
          `${tags.before}$1${tags.after}`
        );
        highlights.push(highlighted);

        lastIndex = matchIndex + token.length;
      }
    });

    return highlights.slice(0, 3);
  }

  /**
   * 转义正则表达式特殊字符
   */
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * 过滤文档
   */
  filter(predicate: (doc: SearchDocument) => boolean): SearchDocument[] {
    return this.getAllDocuments().filter(predicate);
  }

  /**
   * 按标签过滤
   */
  filterByTag(tag: string): SearchDocument[] {
    return this.filter(doc => doc.tags?.includes(tag));
  }

  /**
   * 按类型过滤
   */
  filterByType(type: string): SearchDocument[] {
    return this.filter(doc => doc.type === type);
  }

  /**
   * 获取所有标签
   */
  getAllTags(): string[] {
    const tags = new Set<string>();
    this.documents.forEach(doc => {
      doc.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }

  /**
   * 获取所有类型
   */
  getAllTypes(): string[] {
    const types = new Set<string>();
    this.documents.forEach(doc => {
      if (doc.type) types.add(doc.type);
    });
    return Array.from(types);
  }

  /**
   * 获取统计信息
   */
  getStats(): {
    totalDocuments: number;
    totalTokens: number;
    avgTokensPerDoc: number;
    totalTags: number;
    totalTypes: number;
  } {
    let totalTokens = 0;
    this.documents.forEach(doc => {
      const text = `${doc.title} ${doc.content} ${(doc.tags || []).join(' ')}`;
      totalTokens += this.tokenize(text).length;
    });

    return {
      totalDocuments: this.documents.size,
      totalTokens: this.index.size,
      avgTokensPerDoc: this.documents.size > 0 ? totalTokens / this.documents.size : 0,
      totalTags: this.getAllTags().length,
      totalTypes: this.getAllTypes().length,
    };
  }
}

// 创建单例
const searchService = new SearchService();

// 导出单例和类
export { SearchService };
export default searchService;
