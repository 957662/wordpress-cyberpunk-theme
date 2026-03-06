/**
 * AI Content Analysis API Route
 *
 * Provides intelligent content analysis services
 */

import { NextRequest, NextResponse } from 'next/server';

// Types
interface AnalysisRequest {
  content: string;
  title?: string;
}

interface KeywordMetric {
  keyword: string;
  count: number;
  density: number;
  importance: 'high' | 'medium' | 'low';
}

interface Suggestion {
  type: 'improvement' | 'warning' | 'info';
  category: 'seo' | 'readability' | 'engagement' | 'structure';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

interface ContentMetrics {
  wordCount: number;
  sentenceCount: number;
  paragraphCount: number;
  avgSentenceLength: number;
  avgWordLength: number;
  readingTime: number;
}

interface AnalysisResult {
  score: number;
  seoScore: number;
  readabilityScore: number;
  sentimentScore: number;
  keywordDensity: KeywordMetric[];
  suggestions: Suggestion[];
  issues: Array<{
    type: 'error' | 'warning' | 'info';
    message: string;
    location?: string;
    fix?: string;
  }>;
  metrics: ContentMetrics;
}

// Utility Functions

/**
 * Calculate word count
 */
function calculateWordCount(text: string): number {
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  return words.length;
}

/**
 * Calculate sentence count
 */
function calculateSentenceCount(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  return sentences.length;
}

/**
 * Calculate paragraph count
 */
function calculateParagraphCount(text: string): number {
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
  return paragraphs.length;
}

/**
 * Calculate average sentence length
 */
function calculateAvgSentenceLength(wordCount: number, sentenceCount: number): number {
  return sentenceCount > 0 ? wordCount / sentenceCount : 0;
}

/**
 * Calculate average word length
 */
function calculateAvgWordLength(text: string): number {
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  if (words.length === 0) return 0;

  const totalLength = words.reduce((sum, word) => sum + word.length, 0);
  return totalLength / words.length;
}

/**
 * Calculate reading time (average 200 words per minute)
 */
function calculateReadingTime(wordCount: number): number {
  return Math.ceil(wordCount / 200);
}

/**
 * Extract keywords and calculate density
 */
function extractKeywords(text: string, wordCount: number): KeywordMetric[] {
  // Remove common stop words
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'this',
    'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they'
  ]);

  // Extract words and count frequency
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word));

  const frequency = new Map<string, number>();
  words.forEach(word => {
    frequency.set(word, (frequency.get(word) || 0) + 1);
  });

  // Convert to array and calculate density
  const keywords: KeywordMetric[] = Array.from(frequency.entries())
    .map(([keyword, count]) => ({
      keyword,
      count,
      density: (count / wordCount) * 100,
      importance: count > 3 ? 'high' : count > 1 ? 'medium' : 'low' as const
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  return keywords;
}

/**
 * Calculate SEO score
 */
function calculateSEOScore(
  metrics: ContentMetrics,
  keywords: KeywordMetric[],
  hasTitle: boolean
): number {
  let score = 0;

  // Content length (30 points)
  if (metrics.wordCount >= 300) score += 30;
  else if (metrics.wordCount >= 200) score += 20;
  else if (metrics.wordCount >= 100) score += 10;

  // Title presence (20 points)
  if (hasTitle) score += 20;

  // Keyword density (25 points)
  const hasGoodKeywords = keywords.some(k => k.density >= 1 && k.density <= 3);
  if (hasGoodKeywords) score += 25;

  // Paragraph structure (15 points)
  if (metrics.paragraphCount >= 3) score += 15;
  else if (metrics.paragraphCount >= 2) score += 10;

  // Sentence length (10 points)
  if (metrics.avgSentenceLength >= 15 && metrics.avgSentenceLength <= 25) score += 10;
  else if (metrics.avgSentenceLength >= 10 && metrics.avgSentenceLength <= 30) score += 5;

  return Math.min(score, 100);
}

/**
 * Calculate readability score (Flesch Reading Ease approximation)
 */
function calculateReadabilityScore(metrics: ContentMetrics): number {
  const avgSentenceLength = metrics.avgSentenceLength;
  const avgWordLength = metrics.avgWordLength;

  // Simplified Flesch formula
  const score = 206.835 - (1.015 * avgSentenceLength) - (84.6 * (avgWordLength / 100));

  // Convert to 0-100 scale and ensure it's within bounds
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Calculate sentiment score (simple version)
 */
function calculateSentimentScore(text: string): number {
  const positiveWords = [
    'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic',
    'love', 'happy', 'joy', 'success', 'best', 'perfect', 'awesome',
    'brilliant', 'outstanding', 'positive', 'beautiful', 'incredible'
  ];

  const negativeWords = [
    'bad', 'terrible', 'awful', 'horrible', 'hate', 'sad', 'angry',
    'worst', 'poor', 'negative', 'ugly', 'fail', 'failure', 'wrong',
    'problem', 'issue', 'difficult', 'hard', 'painful'
  ];

  const words = text.toLowerCase().split(/\s+/);
  let positiveCount = 0;
  let negativeCount = 0;

  words.forEach(word => {
    const cleanWord = word.replace(/[^\w]/g, '');
    if (positiveWords.includes(cleanWord)) positiveCount++;
    if (negativeWords.includes(cleanWord)) negativeCount++;
  });

  const total = positiveCount + negativeCount;
  if (total === 0) return 50; // Neutral

  return Math.round((positiveCount / total) * 100);
}

/**
 * Generate suggestions based on analysis
 */
function generateSuggestions(
  metrics: ContentMetrics,
  seoScore: number,
  readabilityScore: number,
  keywords: KeywordMetric[]
): Suggestion[] {
  const suggestions: Suggestion[] = [];

  // Content length suggestions
  if (metrics.wordCount < 300) {
    suggestions.push({
      type: 'warning',
      category: 'seo',
      title: 'Content Too Short',
      description: 'Consider adding more detail. Ideally, aim for at least 300 words for better SEO.',
      priority: 'high'
    });
  }

  // Paragraph structure
  if (metrics.paragraphCount < 3) {
    suggestions.push({
      type: 'improvement',
      category: 'structure',
      title: 'Improve Paragraph Structure',
      description: 'Break your content into more paragraphs for better readability.',
      priority: 'medium'
    });
  }

  // Sentence length
  if (metrics.avgSentenceLength > 25) {
    suggestions.push({
      type: 'improvement',
      category: 'readability',
      title: 'Long Sentences',
      description: 'Some sentences are quite long. Consider breaking them down for easier reading.',
      priority: 'medium'
    });
  }

  // Keyword density
  const highDensityKeywords = keywords.filter(k => k.density > 3);
  if (highDensityKeywords.length > 0) {
    suggestions.push({
      type: 'warning',
      category: 'seo',
      title: 'Keyword Overuse',
      description: `"${highDensityKeywords[0].keyword}" appears too frequently. Aim for 1-3% density.`,
      priority: 'high'
    });
  }

  // Readability
  if (readabilityScore < 60) {
    suggestions.push({
      type: 'improvement',
      category: 'readability',
      title: 'Improve Readability',
      description: 'Use simpler language and shorter sentences to make content more accessible.',
      priority: 'medium'
    });
  }

  // SEO improvements
  if (seoScore < 70) {
    suggestions.push({
      type: 'improvement',
      category: 'seo',
      title: 'Boost SEO',
      description: 'Add a compelling title, include relevant keywords, and ensure proper formatting.',
      priority: 'high'
    });
  }

  return suggestions;
}

/**
 * POST handler for content analysis
 */
export async function POST(request: NextRequest) {
  try {
    const body: AnalysisRequest = await request.json();
    const { content, title } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Invalid content provided' },
        { status: 400 }
      );
    }

    // Calculate metrics
    const wordCount = calculateWordCount(content);
    const sentenceCount = calculateSentenceCount(content);
    const paragraphCount = calculateParagraphCount(content);
    const avgSentenceLength = calculateAvgSentenceLength(wordCount, sentenceCount);
    const avgWordLength = calculateAvgWordLength(content);
    const readingTime = calculateReadingTime(wordCount);

    const metrics: ContentMetrics = {
      wordCount,
      sentenceCount,
      paragraphCount,
      avgSentenceLength,
      avgWordLength,
      readingTime
    };

    // Extract keywords
    const keywordDensity = extractKeywords(content, wordCount);

    // Calculate scores
    const seoScore = calculateSEOScore(metrics, keywordDensity, !!title);
    const readabilityScore = calculateReadabilityScore(metrics);
    const sentimentScore = calculateSentimentScore(content);

    // Calculate overall score
    const overallScore = Math.round(
      (seoScore * 0.3 + readabilityScore * 0.3 + sentimentScore * 0.2 + Math.min(wordCount / 3, 100) * 0.2)
    );

    // Generate suggestions
    const suggestions = generateSuggestions(
      metrics,
      seoScore,
      readabilityScore,
      keywordDensity
    );

    // Build result
    const result: AnalysisResult = {
      score: overallScore,
      seoScore,
      readabilityScore,
      sentimentScore,
      keywordDensity,
      suggestions,
      issues: [],
      metrics
    };

    // Cache the result (in production, use Redis or similar)
    // await cache.set(`analysis:${hash}`, result, { ex: 3600 });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Content analysis error:', error);
    return NextResponse.json(
      { error: 'Internal server error during analysis' },
      { status: 500 }
    );
  }
}

/**
 * GET handler for API info
 */
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/ai/analyze-content',
    method: 'POST',
    description: 'AI-powered content analysis',
    features: [
      'SEO Score',
      'Readability Analysis',
      'Keyword Density',
      'Sentiment Analysis',
      'Content Suggestions'
    ],
    usage: {
      method: 'POST',
      body: {
        content: 'string (required)',
        title: 'string (optional)'
      }
    }
  });
}
