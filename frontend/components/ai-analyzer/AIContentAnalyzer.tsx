'use client';

/**
 * AI Content Analyzer Component
 *
 * Provides intelligent content analysis with cyberpunk styling
 * Features:
 * - SEO Analysis
 * - Readability Score
 * - Keyword Density
 * - Sentiment Analysis
 * - Content Suggestions
 */

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Zap,
  FileText,
  Tag,
  Eye,
  Heart,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
export interface AnalysisResult {
  score: number;
  seoScore: number;
  readabilityScore: number;
  sentimentScore: number;
  keywordDensity: KeywordMetric[];
  suggestions: Suggestion[];
  issues: Issue[];
  metrics: ContentMetrics;
}

export interface KeywordMetric {
  keyword: string;
  count: number;
  density: number;
  importance: 'high' | 'medium' | 'low';
}

export interface Suggestion {
  type: 'improvement' | 'warning' | 'info';
  category: 'seo' | 'readability' | 'engagement' | 'structure';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export interface Issue {
  type: 'error' | 'warning' | 'info';
  message: string;
  location?: string;
  fix?: string;
}

export interface ContentMetrics {
  wordCount: number;
  sentenceCount: number;
  paragraphCount: number;
  avgSentenceLength: number;
  avgWordLength: number;
  readingTime: number;
}

export interface AIContentAnalyzerProps {
  content: string;
  title?: string;
  onAnalyze?: (result: AnalysisResult) => void;
  autoAnalyze?: boolean;
  className?: string;
  showDetailedMetrics?: boolean;
}

// Score Display Component
const ScoreDisplay: React.FC<{
  score: number;
  label: string;
  color: string;
  icon: React.ReactNode;
}> = ({ score, label, color, icon }) => {
  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-cyber-green';
    if (s >= 60) return 'text-cyber-cyan';
    if (s >= 40) return 'text-cyber-yellow';
    return 'text-cyber-pink';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative"
    >
      <div className={cn(
        "flex items-center gap-3 p-4 rounded-lg border",
        "bg-cyber-dark/50 backdrop-blur-sm",
        "border-cyber-cyan/20 hover:border-cyber-cyan/40",
        "transition-all duration-300"
      )}>
        <div className={cn("text-2xl", color)}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="text-xs text-cyber-muted uppercase tracking-wider mb-1">
            {label}
          </div>
          <div className={cn(
            "text-3xl font-bold font-mono",
            getScoreColor(score)
          )}>
            {score}
            <span className="text-sm text-cyber-muted ml-1">/100</span>
          </div>
        </div>
        {/* Progress Ring */}
        <svg className="w-16 h-16 transform -rotate-90">
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            className="text-cyber-muted/20"
          />
          <motion.circle
            cx="32"
            cy="32"
            r="28"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeDasharray={175.93}
            strokeDashoffset={175.93 - (175.93 * score) / 100}
            className={getScoreColor(score)}
            initial={{ strokeDashoffset: 175.93 }}
            animate={{
              strokeDashoffset: 175.93 - (175.93 * score) / 100
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
      </div>
    </motion.div>
  );
};

// Keyword Density Chart
const KeywordDensityChart: React.FC<{
  keywords: KeywordMetric[];
}> = ({ keywords }) => {
  return (
    <div className="space-y-3">
      {keywords.slice(0, 8).map((keyword, index) => (
        <motion.div
          key={keyword.keyword}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-cyber-cyan">
              {keyword.keyword}
            </span>
            <span className="text-xs text-cyber-muted">
              {keyword.density.toFixed(2)}%
            </span>
          </div>
          <div className="h-2 bg-cyber-muted/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(keyword.density * 10, 100)}%` }}
              transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
              className={cn(
                "h-full rounded-full",
                keyword.importance === 'high' && "bg-cyber-pink",
                keyword.importance === 'medium' && "bg-cyber-cyan",
                keyword.importance === 'low' && "bg-cyber-purple"
              )}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Suggestion Item
const SuggestionItem: React.FC<{
  suggestion: Suggestion;
  index: number;
}> = ({ suggestion, index }) => {
  const icons = {
    improvement: <Zap className="w-4 h-4" />,
    warning: <AlertCircle className="w-4 h-4" />,
    info: <FileText className="w-4 h-4" />
  };

  const colors = {
    improvement: 'border-cyber-cyan bg-cyber-cyan/10',
    warning: 'border-cyber-yellow bg-cyber-yellow/10',
    info: 'border-cyber-purple bg-cyber-purple/10'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "p-4 rounded-lg border-l-4",
        colors[suggestion.type],
        "hover:scale-[1.02] transition-transform"
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "mt-0.5",
          suggestion.type === 'improvement' && "text-cyber-cyan",
          suggestion.type === 'warning' && "text-cyber-yellow",
          suggestion.type === 'info' && "text-cyber-purple"
        )}>
          {icons[suggestion.type]}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-semibold text-white">
              {suggestion.title}
            </h4>
            <span className={cn(
              "text-xs px-2 py-0.5 rounded",
              suggestion.priority === 'high' && "bg-cyber-pink/20 text-cyber-pink",
              suggestion.priority === 'medium' && "bg-cyber-yellow/20 text-cyber-yellow",
              suggestion.priority === 'low' && "bg-cyber-cyan/20 text-cyber-cyan"
            )}>
              {suggestion.priority}
            </span>
          </div>
          <p className="text-xs text-cyber-muted">
            {suggestion.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// Main Component
export const AIContentAnalyzer: React.FC<AIContentAnalyzerProps> = ({
  content,
  title,
  onAnalyze,
  autoAnalyze = true,
  className,
  showDetailedMetrics = true
}) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'keywords' | 'suggestions' | 'metrics'>('overview');

  // Analyze content function
  const analyzeContent = useCallback(async () => {
    if (!content.trim()) {
      return;
    }

    setAnalyzing(true);

    try {
      const response = await fetch('/api/ai/analyze-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, title })
      });

      if (!response.ok) throw new Error('Analysis failed');

      const data: AnalysisResult = await response.json();
      setResult(data);
      onAnalyze?.(data);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setAnalyzing(false);
    }
  }, [content, title, onAnalyze]);

  // Auto-analyze on content change
  useEffect(() => {
    if (autoAnalyze && content) {
      const timer = setTimeout(() => {
        analyzeContent();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [content, autoAnalyze, analyzeContent]);

  if (!content) {
    return (
      <div className={cn(
        "p-8 rounded-lg border-2 border-dashed border-cyber-muted/30",
        "text-center text-cyber-muted",
        className
      )}>
        <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="text-sm">Enter content to analyze</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Sparkles className="w-6 h-6 text-cyber-cyan" />
            {analyzing && (
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-6 h-6 text-cyber-purple opacity-50" />
              </motion.div>
            )}
          </div>
          <h3 className="text-lg font-semibold text-white">
            AI Content Analysis
          </h3>
        </div>
        {!autoAnalyze && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={analyzeContent}
            disabled={analyzing}
            className={cn(
              "px-4 py-2 rounded-lg font-medium text-sm",
              "bg-cyber-cyan/10 border border-cyber-cyan/30",
              "text-cyber-cyan hover:bg-cyber-cyan/20",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-all duration-200"
            )}
          >
            {analyzing ? 'Analyzing...' : 'Analyze'}
          </motion.button>
        )}
      </div>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Score Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <ScoreDisplay
                score={result.score}
                label="Overall Score"
                color="text-cyber-cyan"
                icon={<TrendingUp />}
              />
              <ScoreDisplay
                score={result.seoScore}
                label="SEO Score"
                color="text-cyber-green"
                icon={<Eye />}
              />
              <ScoreDisplay
                score={result.readabilityScore}
                label="Readability"
                color="text-cyber-purple"
                icon={<MessageSquare />}
              />
              <ScoreDisplay
                score={result.sentimentScore}
                label="Sentiment"
                color="text-cyber-pink"
                icon={<Heart />}
              />
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-cyber-muted/20">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'keywords', label: 'Keywords' },
                { id: 'suggestions', label: 'Suggestions' },
                { id: 'metrics', label: 'Metrics' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium transition-colors",
                    "relative",
                    activeTab === tab.id
                      ? "text-cyber-cyan"
                      : "text-cyber-muted hover:text-white"
                  )}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyber-cyan"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                  {/* Quick Stats */}
                  <div className="p-6 rounded-lg bg-cyber-dark/50 border border-cyber-cyan/20">
                    <h4 className="text-sm font-semibold text-cyber-cyan mb-4">
                      Quick Stats
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-cyber-muted">Words</span>
                        <span className="text-sm font-mono font-bold text-white">
                          {result.metrics.wordCount}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-cyber-muted">Sentences</span>
                        <span className="text-sm font-mono font-bold text-white">
                          {result.metrics.sentenceCount}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-cyber-muted">Paragraphs</span>
                        <span className="text-sm font-mono font-bold text-white">
                          {result.metrics.paragraphCount}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-cyber-muted">Reading Time</span>
                        <span className="text-sm font-mono font-bold text-white">
                          {result.metrics.readingTime} min
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Top Keywords */}
                  <div className="p-6 rounded-lg bg-cyber-dark/50 border border-cyber-cyan/20">
                    <h4 className="text-sm font-semibold text-cyber-cyan mb-4 flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Top Keywords
                    </h4>
                    <KeywordDensityChart keywords={result.keywordDensity} />
                  </div>
                </motion.div>
              )}

              {activeTab === 'keywords' && (
                <motion.div
                  key="keywords"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-6 rounded-lg bg-cyber-dark/50 border border-cyber-cyan/20"
                >
                  <h4 className="text-sm font-semibold text-cyber-cyan mb-4">
                    Keyword Analysis
                  </h4>
                  <KeywordDensityChart keywords={result.keywordDensity} />
                </motion.div>
              )}

              {activeTab === 'suggestions' && (
                <motion.div
                  key="suggestions"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  {result.suggestions.map((suggestion, index) => (
                    <SuggestionItem
                      key={index}
                      suggestion={suggestion}
                      index={index}
                    />
                  ))}
                </motion.div>
              )}

              {activeTab === 'metrics' && showDetailedMetrics && (
                <motion.div
                  key="metrics"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-6 rounded-lg bg-cyber-dark/50 border border-cyber-cyan/20"
                >
                  <h4 className="text-sm font-semibold text-cyber-cyan mb-4">
                    Detailed Metrics
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-xs text-cyber-muted mb-1">
                        Avg Sentence Length
                      </div>
                      <div className="text-lg font-mono font-bold text-white">
                        {result.metrics.avgSentenceLength.toFixed(1)} words
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-cyber-muted mb-1">
                        Avg Word Length
                      </div>
                      <div className="text-lg font-mono font-bold text-white">
                        {result.metrics.avgWordLength.toFixed(1)} chars
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-cyber-muted mb-1">
                        Sentiment
                      </div>
                      <div className={cn(
                        "text-lg font-mono font-bold",
                        result.sentimentScore > 60 ? "text-cyber-green" :
                        result.sentimentScore > 40 ? "text-cyber-yellow" :
                        "text-cyber-pink"
                      )}>
                        {result.sentimentScore > 60 ? 'Positive' :
                         result.sentimentScore > 40 ? 'Neutral' : 'Negative'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-cyber-muted mb-1">
                        Reading Level
                      </div>
                      <div className="text-lg font-mono font-bold text-white">
                        {result.readabilityScore > 80 ? 'Easy' :
                         result.readabilityScore > 60 ? 'Medium' : 'Advanced'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {analyzing && !result && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-12 rounded-lg bg-cyber-dark/50 border border-cyber-cyan/20 text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-4"
          >
            <Sparkles className="w-full h-full text-cyber-cyan" />
          </motion.div>
          <p className="text-sm text-cyber-muted">
            AI is analyzing your content...
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default AIContentAnalyzer;
