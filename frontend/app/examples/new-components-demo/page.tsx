'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ReadingTimeCalculator
} from '@/components/reading-time';
import {
  SearchHistory
} from '@/components/search-history';
import {
  TagManager,
  TagCloud
} from '@/components/tag-manager';
import {
  CodeSnippetShare
} from '@/components/code-share';
import {
  ArticleSummaryGenerator
} from '@/components/article-summary';

// 示例数据
const sampleTags = [
  { id: '1', name: 'Next.js', slug: 'nextjs', count: 123 },
  { id: '2', name: 'React', slug: 'react', count: 98 },
  { id: '3', name: 'TypeScript', slug: 'typescript', count: 87 },
  { id: '4', name: 'FastAPI', slug: 'fastapi', count: 65 },
  { id: '5', name: 'Tailwind CSS', slug: 'tailwind-css', count: 54 },
  { id: '6', name: 'PostgreSQL', slug: 'postgresql', count: 43 },
  { id: '7', name: 'Docker', slug: 'docker', count: 32 },
  { id: '8', name: 'Python', slug: 'python', count: 121 },
  { id: '9', name: 'JavaScript', slug: 'javascript', count: 145 },
  { id: '10', name: 'CSS', slug: 'css', count: 67 },
];

const sampleArticle = `
# Getting Started with Next.js 14

Next.js 14 introduces many exciting features that make building web applications easier and more performant. In this article, we'll explore the key features and how to get started.

## Server Components

Server Components are a new type of React component that render on the server. They provide improved performance and allow you to use server-side features directly in your components.

## App Router

The new App Router is built on top of the latest React features, including Server Components and Streaming.

## Getting Started

To create a new Next.js app, run:

\`\`\`bash
npx create-next-app@latest my-app
\`\`\`

This will set up a new Next.js project with all the necessary configurations.

## Conclusion

Next.js 14 is a powerful framework for building modern web applications. Start exploring its features today!
`;

export default function NewComponentsDemo() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gray-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyber-cyan to-cyber-purple bg-clip-text text-transparent mb-4">
            New Components Demo
          </h1>
          <p className="text-xl text-gray-400">
            Explore our latest component collection
          </p>
        </motion.div>

        {/* Reading Time Calculator */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">
              Reading Time Calculator
            </h2>
            <p className="text-gray-400 mb-6">
              Automatically calculate reading time for your articles
            </p>
            <div className="bg-gray-800/50 rounded-lg p-6">
              <ReadingTimeCalculator
                content={sampleArticle}
                wordsPerMinute={200}
                showWordCount={true}
              />
            </div>
          </div>
        </motion.section>

        {/* Article Summary Generator */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">
              Article Summary Generator
            </h2>
            <p className="text-gray-400 mb-6">
              AI-powered article summarization
            </p>
            <ArticleSummaryGenerator
              title="Getting Started with Next.js 14"
              content={sampleArticle}
              maxLength={150}
            />
          </div>
        </motion.section>

        {/* Tag Manager */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">
              Tag Manager
            </h2>
            <p className="text-gray-400 mb-6">
              Advanced tag selection and management
            </p>
            <TagManager
              tags={sampleTags}
              selectedTags={selectedTags}
              onTagsChange={setSelectedTags}
              editable={true}
              showSearch={true}
              showTrending={true}
            />
          </div>
        </motion.section>

        {/* Tag Cloud */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">
              Tag Cloud
            </h2>
            <p className="text-gray-400 mb-6">
              Visual tag cloud with size-based styling
            </p>
            <TagCloud
              tags={sampleTags}
              minSize={12}
              maxSize={28}
            />
          </div>
        </motion.section>

        {/* Search History */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">
              Search History
            </h2>
            <p className="text-gray-400 mb-6">
              Search history with trending suggestions
            </p>
            <SearchHistory
              onSelect={(query) => {
                setSearchQuery(query);
                console.log('Selected:', query);
              }}
              maxItems={10}
              showTrending={true}
            />
          </div>
        </motion.section>

        {/* Code Snippet Share */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-gray-100 mb-6">
              Code Snippet Share
            </h2>
            <p className="text-gray-400 mb-6">
              Create and share code snippets
            </p>
            <CodeSnippetShare
              onSave={(snippet) => {
                console.log('Snippet saved:', snippet);
              }}
            />
          </div>
        </motion.section>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-gray-500 text-sm"
        >
          <p>Built with Next.js 14, TypeScript, and Tailwind CSS</p>
        </motion.div>
      </div>
    </div>
  );
}
