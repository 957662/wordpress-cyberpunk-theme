/**
 * 搜索相关工具函数
 */

/**
 * 搜索结果接口
 */
export interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  type: 'post' | 'page' | 'category' | 'tag' | 'author';
  relevance: number;
  highlight?: {
    title?: string;
    excerpt?: string;
  };
}

/**
 * 搜索过滤器
 */
export interface SearchFilters {
  type?: Array<'post' | 'page' | 'category' | 'tag' | 'author'>;
  category?: string[];
  tags?: string[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  author?: string[];
}

/**
 * 搜索选项
 */
export interface SearchOptions {
  fuzzy?: boolean;
  ignoreCase?: boolean;
  maxResults?: number;
  minRelevance?: number;
}

/**
 * 简单的全文搜索实现
 */
export function fullTextSearch(
  documents: Array<{
    id: string;
    title: string;
    content: string;
    type: SearchResult['type'];
    url: string;
  }>,
  query: string,
  options: SearchOptions = {}
): SearchResult[] {
  const {
    fuzzy = false,
    ignoreCase = true,
    maxResults = 20,
    minRelevance = 0.3,
  } = options;

  if (!query.trim()) {
    return [];
  }

  const searchTerms = query.split(/\s+/).filter(Boolean);
  const results: SearchResult[] = [];

  for (const doc of documents) {
    let relevance = 0;
    const titleMatch = new Set<number>();
    const contentMatches: number[] = [];

    for (const term of searchTerms) {
      const searchTerm = ignoreCase ? term.toLowerCase() : term;
      const title = ignoreCase ? doc.title.toLowerCase() : doc.title;
      const content = ignoreCase ? doc.content.toLowerCase() : doc.content;

      // 标题匹配权重更高
      let termIndex = title.indexOf(searchTerm);
      if (termIndex !== -1) {
        relevance += 0.5;
        titleMatch.add(termIndex);
      }

      // 内容匹配
      termIndex = content.indexOf(searchTerm);
      while (termIndex !== -1) {
        relevance += 0.1;
        contentMatches.push(termIndex);
        termIndex = content.indexOf(searchTerm, termIndex + 1);
      }
    }

    // 标准化相关性分数
    relevance = Math.min(relevance / searchTerms.length, 1);

    if (relevance >= minRelevance) {
      const excerpt = extractExcerpt(doc.content, query, 150);

      results.push({
        id: doc.id,
        title: doc.title,
        excerpt,
        url: doc.url,
        type: doc.type,
        relevance,
        highlight: {
          title: highlightText(doc.title, searchTerms),
          excerpt: highlightText(excerpt, searchTerms),
        },
      });
    }
  }

  // 按相关性排序
  results.sort((a, b) => b.relevance - a.relevance);

  return results.slice(0, maxResults);
}

/**
 * 提取包含关键词的摘要
 */
export function extractExcerpt(
  content: string,
  keywords: string[],
  maxLength: number = 150
): string {
  // 移除 HTML 标签
  const textContent = content.replace(/<[^>]*>/g, '');
  const cleanText = textContent.trim().replace(/\s+/g, ' ');

  // 查找第一个关键词出现的位置
  const firstKeywordIndex = keywords
    .map((keyword) => cleanText.toLowerCase().indexOf(keyword.toLowerCase()))
    .filter((index) => index !== -1)
    .sort((a, b) => a - b)[0];

  if (firstKeywordIndex === undefined) {
    // 如果没有找到关键词,返回开头部分
    return cleanText.slice(0, maxLength) + '...';
  }

  // 从关键词位置开始提取
  const start = Math.max(0, firstKeywordIndex - 50);
  const end = Math.min(cleanText.length, start + maxLength);

  let excerpt = cleanText.slice(start, end);

  // 添加省略号
  if (start > 0) {
    excerpt = '...' + excerpt;
  }
  if (end < cleanText.length) {
    excerpt = excerpt + '...';
  }

  return excerpt;
}

/**
 * 高亮文本中的关键词
 */
export function highlightText(
  text: string,
  keywords: string[],
  className: string = 'bg-cyber-cyan/20 text-cyber-cyan'
): string {
  if (keywords.length === 0) return text;

  // 转义特殊字符
  const escapedKeywords = keywords.map((keyword) =>
    keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  );

  // 创建正则表达式
  const pattern = new RegExp(`(${escapedKeywords.join('|')})`, 'gi');

  return text.replace(pattern, `<mark class="${className}">$1</mark>`);
}

/**
 * 生成搜索建议
 */
export function generateSearchSuggestions(
  query: string,
  documents: Array<{ title: string }>,
  maxSuggestions: number = 5
): string[] {
  if (!query.trim()) {
    return [];
  }

  const suggestions = new Set<string>();
  const lowerQuery = query.toLowerCase();

  for (const doc of documents) {
    const title = doc.title;

    // 完全匹配
    if (title.toLowerCase().includes(lowerQuery)) {
      suggestions.add(title);
    }

    // 拆分标题单词
    const words = title.split(/\s+/);
    for (const word of words) {
      if (word.toLowerCase().startsWith(lowerQuery) && word.length > query.length) {
        suggestions.add(word);
      }
    }

    if (suggestions.size >= maxSuggestions) {
      break;
    }
  }

  return Array.from(suggestions).slice(0, maxSuggestions);
}

/**
 * 计算搜索词和结果之间的相似度 (Levenshtein 距离)
 */
export function calculateSimilarity(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;

  if (len1 === 0) return len2;
  if (len2 === 0) return len1;

  const matrix: number[][] = [];

  // 初始化矩阵
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  // 填充矩阵
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (str1.charAt(i - 1) === str2.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] =
          Math.min(
            matrix[i - 1][j - 1], // 替换
            matrix[i][j - 1], // 插入
            matrix[i - 1][j] // 删除
          ) + 1;
      }
    }
  }

  const distance = matrix[len1][len2];
  const maxLen = Math.max(len1, len2);

  return (maxLen - distance) / maxLen;
}

/**
 * 模糊搜索
 */
export function fuzzySearch(
  documents: Array<{ title: string; content: string }>,
  query: string,
  threshold: number = 0.6
): Array<{ doc: typeof documents[0]; score: number }> {
  const results: Array<{ doc: typeof documents[0]; score: number }> = [];

  for (const doc of documents) {
    const titleScore = calculateSimilarity(query, doc.title);
    const contentScore = calculateSimilarity(query, doc.content);

    const score = Math.max(titleScore, contentScore * 0.5);

    if (score >= threshold) {
      results.push({ doc, score });
    }
  }

  results.sort((a, b) => b.score - a.score);

  return results;
}

/**
 * 解析搜索查询
 */
export interface ParsedQuery {
  terms: string[];
  exactPhrases: string[];
  excludeTerms: string[];
  tags: string[];
  author?: string;
  dateRange?: {
    from?: Date;
    to?: Date;
  };
}

export function parseSearchQuery(query: string): ParsedQuery {
  const result: ParsedQuery = {
    terms: [],
    exactPhrases: [],
    excludeTerms: [],
    tags: [],
  };

  // 提取精确匹配短语
  const exactPhraseRegex = /"([^"]*)"/g;
  let match;
  while ((match = exactPhraseRegex.exec(query)) !== null) {
    result.exactPhrases.push(match[1]);
  }

  // 移除精确匹配短语
  query = query.replace(exactPhraseRegex, '');

  // 提取排除词
  const excludeRegex = /-(\S+)/g;
  while ((match = excludeRegex.exec(query)) !== null) {
    result.excludeTerms.push(match[1]);
  }

  // 移除排除词
  query = query.replace(excludeRegex, '');

  // 提取标签搜索
  const tagRegex = /tag:(\S+)/gi;
  while ((match = tagRegex.exec(query)) !== null) {
    result.tags.push(match[1]);
  }

  // 移除标签
  query = query.replace(tagRegex, '');

  // 提取作者搜索
  const authorRegex = /author:(\S+)/gi;
  const authorMatch = authorRegex.exec(query);
  if (authorMatch) {
    result.author = authorMatch[1];
  }

  // 移除作者
  query = query.replace(authorRegex, '');

  // 剩余的作为搜索词
  result.terms = query.split(/\s+/).filter(Boolean);

  return result;
}

/**
 * 构建搜索 URL
 */
export function buildSearchURL(
  query: string,
  filters: SearchFilters = {},
  baseUrl: string = '/search'
): string {
  const params = new URLSearchParams();

  params.set('q', query);

  if (filters.type && filters.type.length > 0) {
    params.set('type', filters.type.join(','));
  }

  if (filters.category && filters.category.length > 0) {
    params.set('category', filters.category.join(','));
  }

  if (filters.tags && filters.tags.length > 0) {
    params.set('tags', filters.tags.join(','));
  }

  if (filters.dateRange) {
    if (filters.dateRange.from) {
      params.set('from', filters.dateRange.from.toISOString());
    }
    if (filters.dateRange.to) {
      params.set('to', filters.dateRange.to.toISOString());
    }
  }

  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * 保存搜索历史
 */
export function saveSearchHistory(query: string, maxHistory: number = 10): void {
  if (typeof window === 'undefined') return;

  try {
    const history = getSearchHistory();
    const newHistory = [
      { query, timestamp: Date.now() },
      ...history.filter((item) => item.query !== query),
    ].slice(0, maxHistory);

    localStorage.setItem('search-history', JSON.stringify(newHistory));
  } catch (error) {
    console.error('保存搜索历史失败:', error);
  }
}

/**
 * 获取搜索历史
 */
export interface SearchHistoryItem {
  query: string;
  timestamp: number;
}

export function getSearchHistory(): SearchHistoryItem[] {
  if (typeof window === 'undefined') return [];

  try {
    const history = localStorage.getItem('search-history');
    return history ? JSON.parse(history) : [];
  } catch {
    return [];
  }
}

/**
 * 清除搜索历史
 */
export function clearSearchHistory(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem('search-history');
  } catch (error) {
    console.error('清除搜索历史失败:', error);
  }
}

/**
 * 获取热门搜索词
 */
export function getPopularSearches(): string[] {
  // 这里可以从 API 获取,或者从本地存储的搜索历史中统计
  // 暂时返回示例数据
  return [
    'React',
    'TypeScript',
    'Next.js',
    'Tailwind CSS',
    '赛博朋克',
    'Web 开发',
    '前端架构',
  ];
}
