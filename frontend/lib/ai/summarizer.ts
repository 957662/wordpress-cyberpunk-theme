/**
 * AI-powered text summarization utilities
 */

export interface SummaryOptions {
  maxLength?: number;
  sentences?: number;
  type?: 'bullet' | 'paragraph' | 'concise';
}

/**
 * Extract key sentences from text using extractive summarization
 */
export function extractKeySentences(text: string, options: SummaryOptions = {}): string[] {
  const {
    sentences = 3,
  } = options;

  // Split into sentences
  const sentenceRegex = /[.!?]+/g;
  const allSentences = text
    .split(sentenceRegex)
    .map(s => s.trim())
    .filter(s => s.length > 10);

  if (allSentences.length <= sentences) {
    return allSentences;
  }

  // Calculate sentence scores based on:
  // 1. Position (first and last sentences get higher scores)
  // 2. Length (medium length sentences preferred)
  // 3. Keyword frequency
  const wordFreq = getWordFrequency(text);

  const scored = allSentences.map((sentence, index) => {
    let score = 0;

    // Position score
    if (index === 0 || index === allSentences.length - 1) {
      score += 2;
    } else if (index < 3) {
      score += 1;
    }

    // Length score (prefer medium length sentences)
    const words = sentence.split(/\s+/).length;
    if (words >= 10 && words <= 25) {
      score += 1;
    }

    // Keyword score
    const sentenceWords = new Set(sentence.toLowerCase().split(/\s+/));
    let keywordScore = 0;
    sentenceWords.forEach(word => {
      if (wordFreq.has(word)) {
        keywordScore += wordFreq.get(word)!;
      }
    });
    score += keywordScore / sentenceWords.size;

    return { sentence, score };
  });

  // Sort by score and return top sentences
  scored.sort((a, b) => b.score - a.score);

  return scored
    .slice(0, sentences)
    .map(s => s.sentence);
}

/**
 * Generate a summary of the text
 */
export function summarizeText(text: string, options: SummaryOptions = {}): string {
  const {
    maxLength = 300,
    type = 'paragraph'
  } = options;

  const keySentences = extractKeySentences(text, options);

  switch (type) {
    case 'bullet':
      return keySentences
        .map(s => `• ${s}`)
        .join('\n');

    case 'concise':
      return keySentences.join(' ').substring(0, maxLength) + '...';

    case 'paragraph':
    default:
      return keySentences.join(' ');
  }
}

/**
 * Get word frequency map
 */
function getWordFrequency(text: string): Map<string, number> {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 3);

  const freq = new Map<string, number>();
  words.forEach(word => {
    freq.set(word, (freq.get(word) || 0) + 1);
  });

  return freq;
}

/**
 * Extract key points from text
 */
export function extractKeyPoints(text: string, maxPoints: number = 5): string[] {
  const sentences = extractKeySentences(text, { sentences: maxPoints * 2 });
  const points: string[] = [];

  // Look for indicator words
  const indicatorWords = ['因此', '所以', '总之', '结论', '关键', '重要', '值得注意的是'];

  sentences.forEach(sentence => {
    const lower = sentence.toLowerCase();
    if (indicatorWords.some(word => lower.includes(word)) || points.length < maxPoints) {
      points.push(sentence);
    }
  });

  return points.slice(0, maxPoints);
}

/**
 * Generate a title from text
 */
export function generateTitle(text: string): string {
  const sentences = extractKeySentences(text, { sentences: 1 });

  if (sentences.length === 0) {
    return 'Untitled';
  }

  // Extract first phrase or clause
  const firstSentence = sentences[0];
  const clauseMatch = firstSentence.match(/^[^,.!?;]+[,.!?;]?/);

  if (clauseMatch) {
    let title = clauseMatch[0].trim();
    // Remove trailing punctuation
    title = title.replace(/[,.!?;]+$/, '');
    // Capitalize first letter
    title = title.charAt(0).toUpperCase() + title.slice(1);

    return title.length > 60 ? title.substring(0, 60) + '...' : title;
  }

  return firstSentence.substring(0, 60) + '...';
}

/**
 * Extract keywords from text
 */
export function extractKeywords(text: string, maxKeywords: number = 10): string[] {
  const wordFreq = getWordFrequency(text);

  // Filter out common words
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    '的', '了', '是', '在', '有', '和', '就', '不', '人', '都', '一'
  ]);

  const filtered = [...wordFreq.entries()]
    .filter(([word]) => !stopWords.has(word))
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([word]) => word);

  return filtered;
}

/**
 * Calculate reading time in minutes
 */
export function calculateReadingTime(text: string, wordsPerMinute: number = 200): number {
  const words = text.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Detect language of text
 */
export function detectLanguage(text: string): 'zh' | 'en' | 'unknown' {
  const chineseChars = text.match(/[\u4e00-\u9fa5]/g);
  const englishWords = text.match(/[a-zA-Z]+/g);

  const chineseCount = chineseChars?.length || 0;
  const englishCount = englishWords?.length || 0;

  if (chineseCount > englishCount) return 'zh';
  if (englishCount > chineseCount) return 'en';
  return 'unknown';
}

/**
 * Split text into sections
 */
export function splitIntoSections(text: string, maxSectionLength: number = 500): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

  const sections: string[] = [];
  let currentSection = '';

  sentences.forEach(sentence => {
    if ((currentSection + sentence).length <= maxSectionLength) {
      currentSection += sentence;
    } else {
      if (currentSection) {
        sections.push(currentSection.trim());
      }
      currentSection = sentence;
    }
  });

  if (currentSection) {
    sections.push(currentSection.trim());
  }

  return sections;
}

/**
 * Generate a concise abstract
 */
export function generateAbstract(text: string, maxLength: number = 200): string {
  const summary = summarizeText(text, {
    sentences: 2,
    type: 'concise'
  });

  if (summary.length <= maxLength) {
    return summary;
  }

  return summary.substring(0, maxLength - 3) + '...';
}
