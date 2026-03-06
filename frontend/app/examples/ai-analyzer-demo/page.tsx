/**
 * AI Content Analyzer Demo Page
 *
 * Demonstrates the AI Content Analyzer component
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, FileText, Lightbulb } from 'lucide-react';
import AIContentAnalyzer from '@/components/ai-analyzer/AIContentAnalyzer';
import { cn } from '@/lib/utils';

export default function AIAnalyzerDemoPage() {
  const [content, setContent] = useState(DEMO_CONTENT);
  const [title, setTitle] = useState('The Future of AI in Web Development');
  const [activeDemo, setActiveDemo] = useState<'demo' | 'custom'>('demo');

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* Header */}
      <header className="border-b border-cyber-cyan/20 bg-cyber-dark/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Sparkles className="w-8 h-8 text-cyber-cyan" />
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-8 h-8 text-cyber-purple opacity-30" />
              </motion.div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                AI Content Analyzer
              </h1>
              <p className="text-sm text-cyber-muted">
                Intelligent content analysis with real-time feedback
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Editor */}
          <div className="space-y-6">
            {/* Demo Selector */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveDemo('demo')}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium text-sm transition-all",
                  activeDemo === 'demo'
                    ? "bg-cyber-cyan text-cyber-dark"
                    : "bg-cyber-muted/20 text-cyber-muted hover:bg-cyber-muted/30"
                )}
              >
                Demo Content
              </button>
              <button
                onClick={() => setActiveDemo('custom')}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium text-sm transition-all",
                  activeDemo === 'custom'
                    ? "bg-cyber-cyan text-cyber-dark"
                    : "bg-cyber-muted/20 text-cyber-muted hover:bg-cyber-muted/30"
                )}
              >
                Custom Content
              </button>
            </div>

            {/* Title Input */}
            <div className="p-6 rounded-lg bg-cyber-dark/50 border border-cyber-cyan/20">
              <label className="block text-sm font-medium text-cyber-cyan mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Content Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your content title..."
                className={cn(
                  "w-full px-4 py-3 rounded-lg",
                  "bg-cyber-dark border border-cyber-muted/30",
                  "text-white placeholder:text-cyber-muted",
                  "focus:outline-none focus:border-cyber-cyan",
                  "transition-colors"
                )}
              />
            </div>

            {/* Content Editor */}
            <div className="p-6 rounded-lg bg-cyber-dark/50 border border-cyber-cyan/20">
              <label className="block text-sm font-medium text-cyber-cyan mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter your content to analyze..."
                rows={20}
                className={cn(
                  "w-full px-4 py-3 rounded-lg font-mono text-sm",
                  "bg-cyber-dark border border-cyber-muted/30",
                  "text-white placeholder:text-cyber-muted",
                  "focus:outline-none focus:border-cyber-cyan",
                  "transition-colors resize-none"
                )}
              />
              <div className="mt-3 flex items-center justify-between text-xs text-cyber-muted">
                <span>{content.split(/\s+/).filter(w => w.length > 0).length} words</span>
                <span>{content.length} characters</span>
              </div>
            </div>

            {/* Tips */}
            {activeDemo === 'custom' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg bg-cyber-purple/10 border border-cyber-purple/30"
              >
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-cyber-purple flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-cyber-purple mb-1">
                      Tips for Better Analysis
                    </h4>
                    <ul className="text-xs text-cyber-muted space-y-1">
                      <li>• Write at least 300 words for optimal SEO</li>
                      <li>• Use clear headings and paragraph breaks</li>
                      <li>• Include relevant keywords naturally</li>
                      <li>• Keep sentences concise and readable</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Analysis Results */}
          <div className="space-y-6">
            <AIContentAnalyzer
              content={content}
              title={title}
              autoAnalyze={true}
              showDetailedMetrics={true}
              className="sticky top-24"
            />

            {/* Feature Highlights */}
            <div className="p-6 rounded-lg bg-cyber-dark/50 border border-cyber-cyan/20">
              <h3 className="text-lg font-semibold text-white mb-4">
                Features
              </h3>
              <ul className="space-y-3">
                {[
                  {
                    icon: '🎯',
                    title: 'SEO Analysis',
                    description: 'Optimize your content for search engines'
                  },
                  {
                    icon: '📖',
                    title: 'Readability Score',
                    description: 'Ensure your content is easy to understand'
                  },
                  {
                    icon: '💡',
                    title: 'Keyword Density',
                    description: 'Track keyword usage and optimization'
                  },
                  {
                    icon: '😊',
                    title: 'Sentiment Analysis',
                    description: 'Understand the emotional tone of your content'
                  },
                  {
                    icon: '✨',
                    title: 'Smart Suggestions',
                    description: 'Get actionable improvement recommendations'
                  }
                ].map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-cyber-dark/30 hover:bg-cyber-dark/50 transition-colors"
                  >
                    <span className="text-2xl">{feature.icon}</span>
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        {feature.title}
                      </h4>
                      <p className="text-xs text-cyber-muted">
                        {feature.description}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Usage Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 p-8 rounded-lg bg-cyber-dark/50 border border-cyber-cyan/20"
        >
          <h2 className="text-2xl font-bold text-white mb-6">
            How to Use
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '1',
                title: 'Enter Your Content',
                description: 'Paste or type your blog post, article, or any text content into the editor.'
              },
              {
                step: '2',
                title: 'Automatic Analysis',
                description: 'The AI analyzes your content in real-time, checking multiple quality metrics.'
              },
              {
                step: '3',
                title: 'Review & Improve',
                description: 'Review the scores, keywords, and suggestions to optimize your content.'
              }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-cyber-cyan/20 border-2 border-cyber-cyan flex items-center justify-center">
                  <span className="text-xl font-bold text-cyber-cyan">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-cyber-muted">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}

// Demo Content
const DEMO_CONTENT = `Artificial Intelligence is revolutionizing the way we approach web development, bringing unprecedented efficiency and capabilities to the field. The integration of AI tools and technologies is transforming how developers write code, debug applications, and optimize user experiences.

One of the most significant impacts of AI in web development is automated code generation. Tools like GitHub Copilot and ChatGPT can now generate boilerplate code, suggest completions, and even write entire functions based on natural language descriptions. This not only speeds up development but also helps developers learn new frameworks and libraries more quickly.

AI-powered debugging is another game-changer. Machine learning algorithms can analyze error patterns, suggest fixes, and even predict potential bugs before they occur. This proactive approach to debugging saves countless hours and results in more stable, reliable applications.

Performance optimization has also benefited greatly from AI. Advanced algorithms can analyze user behavior patterns, predict loading times, and automatically optimize resources to deliver faster, more responsive experiences. This level of optimization was previously only possible through extensive manual testing and tweaking.

The future of AI in web development looks even more promising. We're seeing the emergence of AI-powered design systems that can automatically generate UI components, intelligent testing frameworks that adapt to application changes, and smart deployment systems that optimize infrastructure based on usage patterns.

However, it's important to note that AI is not replacing developers. Instead, it's augmenting their capabilities and allowing them to focus on higher-level tasks like architecture, user experience design, and business logic. The most successful web developers of tomorrow will be those who learn to collaborate effectively with AI tools.

As we move forward, the synergy between human creativity and artificial intelligence will continue to push the boundaries of what's possible in web development. The key is to embrace these tools while maintaining a strong foundation in fundamental development principles.`;
