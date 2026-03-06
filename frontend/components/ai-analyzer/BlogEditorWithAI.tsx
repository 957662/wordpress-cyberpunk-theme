/**
 * Blog Editor with AI Content Analyzer Integration
 *
 * Complete example of integrating AI Content Analyzer into a blog editor
 */

'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Save,
  Eye,
  FileText,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react';
import AIContentAnalyzer, { AnalysisResult } from './AIContentAnalyzer';
import { cn } from '@/lib/utils';

interface BlogEditorWithAIProps {
  initialContent?: string;
  initialTitle?: string;
  onSave?: (data: { title: string; content: string; analysis?: AnalysisResult }) => void;
  onPreview?: () => void;
  className?: string;
}

export const BlogEditorWithAI: React.FC<BlogEditorWithAIProps> = ({
  initialContent = '',
  initialTitle = '',
  onSave,
  onPreview,
  className
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [showAnalyzer, setShowAnalyzer] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Handle analysis completion
  const handleAnalysisComplete = useCallback((result: AnalysisResult) => {
    setAnalysisResult(result);

    // Auto-save analysis result
    if (onSave) {
      const data = {
        title,
        content,
        analysis: result
      };
      // Could save to local storage or send to backend
      localStorage.setItem('blog-analysis-cache', JSON.stringify(data));
    }
  }, [title, content, onSave]);

  // Handle save
  const handleSave = async () => {
    if (!onSave) return;

    setSaving(true);
    setSaveStatus('idle');

    try {
      await onSave({
        title,
        content,
        analysis: analysisResult || undefined
      });
      setSaveStatus('success');

      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setSaving(false);
    }
  };

  // Load from cache on mount
  React.useEffect(() => {
    const cached = localStorage.getItem('blog-analysis-cache');
    if (cached) {
      try {
        const data = JSON.parse(cached);
        if (data.title) setTitle(data.title);
        if (data.content) setContent(data.content);
        if (data.analysis) setAnalysisResult(data.analysis);
      } catch (error) {
        console.error('Failed to load cached data:', error);
      }
    }
  }, []);

  // Get grade from score
  const getGrade = (score: number) => {
    if (score >= 90) return { grade: 'A+', color: 'text-green-500' };
    if (score >= 80) return { grade: 'A', color: 'text-green-400' };
    if (score >= 70) return { grade: 'B', color: 'text-blue-500' };
    if (score >= 60) return { grade: 'C', color: 'text-yellow-500' };
    if (score >= 50) return { grade: 'D', color: 'text-orange-500' };
    return { grade: 'F', color: 'text-red-500' };
  };

  const gradeInfo = analysisResult ? getGrade(analysisResult.score) : null;

  return (
    <div className={cn("flex flex-col lg:flex-row gap-6", className)}>
      {/* Editor Column */}
      <div className="flex-1 space-y-4">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-cyber-dark/50 border border-cyber-cyan/20">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyber-cyan" />
            <span className="text-sm font-medium text-white">Blog Editor</span>
          </div>

          <div className="flex items-center gap-2">
            {onPreview && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onPreview}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium",
                  "bg-cyber-purple/20 border border-cyber-purple/30",
                  "text-cyber-purple hover:bg-cyber-purple/30",
                  "transition-colors flex items-center gap-2"
                )}
              >
                <Eye className="w-4 h-4" />
                Preview
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              disabled={saving || !content.trim()}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium",
                "bg-cyber-cyan/20 border border-cyber-cyan/30",
                "text-cyber-cyan hover:bg-cyber-cyan/30",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transition-colors flex items-center gap-2"
              )}
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save'}
            </motion.button>

            {saveStatus === 'success' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-green-500"
              >
                <CheckCircle2 className="w-5 h-5" />
              </motion.div>
            )}

            {saveStatus === 'error' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-red-500"
              >
                <AlertCircle className="w-5 h-5" />
              </motion.div>
            )}
          </div>
        </div>

        {/* Title Input */}
        <div className="p-4 rounded-lg bg-cyber-dark/50 border border-cyber-cyan/20">
          <label className="block text-sm font-medium text-cyber-cyan mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your blog post title..."
            className={cn(
              "w-full px-4 py-3 rounded-lg",
              "bg-cyber-dark border border-cyber-muted/30",
              "text-white placeholder:text-cyber-muted",
              "focus:outline-none focus:border-cyber-cyan",
              "transition-colors text-lg font-semibold"
            )}
          />
        </div>

        {/* Content Editor */}
        <div className="p-4 rounded-lg bg-cyber-dark/50 border border-cyber-cyan/20">
          <label className="block text-sm font-medium text-cyber-cyan mb-2">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your blog post content here..."
            rows={25}
            className={cn(
              "w-full px-4 py-3 rounded-lg font-mono text-sm",
              "bg-cyber-dark border border-cyber-muted/30",
              "text-white placeholder:text-cyber-muted",
              "focus:outline-none focus:border-cyber-cyan",
              "transition-colors resize-none"
            )}
          />

          {/* Word Count */}
          <div className="mt-3 flex items-center justify-between text-xs text-cyber-muted">
            <span>
              {content.split(/\s+/).filter(w => w.length > 0).length} words
            </span>
            <span>{content.length} characters</span>
          </div>
        </div>

        {/* Score Badge */}
        {analysisResult && gradeInfo && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-cyber-dark/50 border border-cyber-cyan/20 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-cyber-cyan" />
              <div>
                <div className="text-xs text-cyber-muted">Content Quality</div>
                <div className={cn("text-2xl font-bold", gradeInfo.color)}>
                  Grade: {gradeInfo.grade}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-cyber-muted">Score</div>
              <div className="text-lg font-mono font-bold text-white">
                {analysisResult.score}/100
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* AI Analysis Panel */}
      {showAnalyzer && (
        <div className="lg:w-[500px] space-y-4">
          {/* Panel Header */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-cyber-dark/50 border border-cyber-cyan/20">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyber-cyan" />
              <span className="text-sm font-medium text-white">AI Analysis</span>
            </div>
            <button
              onClick={() => setShowAnalyzer(false)}
              className="text-cyber-muted hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Analyzer Component */}
          <AIContentAnalyzer
            content={content}
            title={title}
            autoAnalyze={true}
            showDetailedMetrics={true}
            onAnalyze={handleAnalysisComplete}
          />

          {/* Quick Actions */}
          {analysisResult && analysisResult.suggestions.length > 0 && (
            <div className="p-4 rounded-lg bg-cyber-dark/50 border border-cyber-cyan/20">
              <h4 className="text-sm font-semibold text-white mb-3">
                Priority Suggestions
              </h4>
              <div className="space-y-2">
                {analysisResult.suggestions
                  .filter(s => s.priority === 'high')
                  .slice(0, 3)
                  .map((suggestion, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        "p-3 rounded border-l-4",
                        suggestion.type === 'warning' && "border-cyber-yellow bg-cyber-yellow/10",
                        suggestion.type === 'improvement' && "border-cyber-cyan bg-cyber-cyan/10"
                      )}
                    >
                      <div className="text-xs font-semibold text-white mb-1">
                        {suggestion.title}
                      </div>
                      <div className="text-xs text-cyber-muted">
                        {suggestion.description}
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating Toggle Button (when panel is closed) */}
      {!showAnalyzer && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowAnalyzer(true)}
          className={cn(
            "fixed bottom-6 right-6 z-50",
            "w-14 h-14 rounded-full",
            "bg-cyber-cyan border-2 border-cyber-cyan/30",
            "text-cyber-dark shadow-lg shadow-cyber-cyan/20",
            "flex items-center justify-center"
          )}
        >
          <Sparkles className="w-6 h-6" />
        </motion.button>
      )}
    </div>
  );
};

export default BlogEditorWithAI;
