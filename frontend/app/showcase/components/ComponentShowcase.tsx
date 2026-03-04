'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// ==========================================
// Types
// ==========================================

interface ComponentExample {
  id: string;
  title: string;
  description: string;
  category: string;
  component: React.ReactNode;
  code: string;
}

interface ComponentShowcaseProps {
  examples: ComponentExample[];
  className?: string;
}

// ==========================================
// Helper Components
// ==========================================

interface CodeBlockProps {
  code: string;
  language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'typescript' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={handleCopy}
          className={cn(
            'px-3 py-1 rounded-md text-xs font-medium',
            'bg-cyber-card border border-cyber-border/50',
            'text-cyber-cyan hover:bg-cyber-cyan/10',
            'transition-all duration-200',
            'opacity-0 group-hover:opacity-100'
          )}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className={cn(
        'p-4 rounded-lg overflow-x-auto',
        'bg-cyber-darker border border-cyber-border/50',
        'text-sm text-cyber-cyan/90'
      )}>
        <code>{code}</code>
      </pre>
    </div>
  );
};

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <button
        onClick={() => onSelectCategory('all')}
        className={cn(
          'px-4 py-2 rounded-lg border font-medium text-sm',
          'transition-all duration-200',
          selectedCategory === 'all'
            ? 'bg-cyber-cyan text-cyber-dark border-cyber-cyan'
            : 'border-cyber-border/50 text-cyber-cyan hover:bg-cyber-cyan/10'
        )}
      >
        All Components
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={cn(
            'px-4 py-2 rounded-lg border font-medium text-sm capitalize',
            'transition-all duration-200',
            selectedCategory === category
              ? 'bg-cyber-cyan text-cyber-dark border-cyber-cyan'
              : 'border-cyber-border/50 text-cyber-cyan hover:bg-cyber-cyan/10'
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

// ==========================================
// Main Component Showcase
// ==========================================

export function ComponentShowcase({
  examples,
  className,
}: ComponentShowcaseProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedExample, setSelectedExample] = useState<string | null>(null);

  const categories = Array.from(
    new Set(examples.map((example) => example.category))
  );

  const filteredExamples =
    selectedCategory === 'all'
      ? examples
      : examples.filter((example) => example.category === selectedCategory);

  return (
    <div className={cn('w-full', className)}>
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-cyber-cyan mb-4">
          Component Showcase
        </h1>
        <p className="text-cyber-muted text-lg">
          Explore our collection of cyberpunk-styled components
        </p>
      </div>

      {/* Category Filter */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Component Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {filteredExamples.map((example) => (
            <motion.div
              key={example.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'group relative',
                'bg-cyber-card/50 border border-cyber-border/50',
                'rounded-lg overflow-hidden',
                'hover:border-cyber-cyan/50',
                'transition-all duration-300',
                'cursor-pointer'
              )}
              onClick={() => setSelectedExample(example.id)}
            >
              {/* Component Preview */}
              <div className="p-6">
                <div className="mb-4 min-h-[120px] flex items-center justify-center">
                  {example.component}
                </div>

                {/* Info */}
                <div>
                  <span className="text-xs text-cyber-purple font-medium uppercase">
                    {example.category}
                  </span>
                  <h3 className="text-lg font-semibold text-cyber-cyan mt-1">
                    {example.title}
                  </h3>
                  <p className="text-sm text-cyber-muted mt-2 line-clamp-2">
                    {example.description}
                  </p>
                </div>
              </div>

              {/* Hover Effect */}
              <div className={cn(
                'absolute inset-0 bg-gradient-to-t',
                'from-cyber-cyan/10 to-transparent',
                'opacity-0 group-hover:opacity-100',
                'transition-opacity duration-300',
                'pointer-events-none'
              )} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Example Detail Modal */}
      <AnimatePresence>
        {selectedExample && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-cyber-dark/80 backdrop-blur-sm"
              onClick={() => setSelectedExample(null)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'relative max-w-4xl w-full max-h-[90vh]',
                'bg-cyber-card border border-cyber-border/50',
                'rounded-lg overflow-hidden',
                'flex flex-col'
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-cyber-border/50">
                <div>
                  <span className="text-xs text-cyber-purple font-medium uppercase">
                    {examples.find((e) => e.id === selectedExample)?.category}
                  </span>
                  <h2 className="text-2xl font-bold text-cyber-cyan mt-1">
                    {examples.find((e) => e.id === selectedExample)?.title}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedExample(null)}
                  className={cn(
                    'p-2 rounded-lg',
                    'text-cyber-cyan hover:bg-cyber-cyan/10',
                    'transition-colors duration-200'
                  )}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Description */}
                <p className="text-cyber-muted mb-6">
                  {examples.find((e) => e.id === selectedExample)?.description}
                </p>

                {/* Live Preview */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-cyber-cyan mb-3">
                    Live Preview
                  </h3>
                  <div className={cn(
                    'p-8 rounded-lg border border-cyber-border/50',
                    'bg-cyber-darker/50'
                  )}>
                    {examples.find((e) => e.id === selectedExample)?.component}
                  </div>
                </div>

                {/* Code */}
                <div>
                  <h3 className="text-lg font-semibold text-cyber-cyan mb-3">
                    Source Code
                  </h3>
                  <CodeBlock code={examples.find((e) => e.id === selectedExample)?.code || ''} />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {filteredExamples.length === 0 && (
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 mx-auto text-cyber-muted mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-cyber-muted text-lg">
            No components found in this category
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="mt-12 pt-8 border-t border-cyber-border/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-cyber-cyan">
              {examples.length}
            </div>
            <div className="text-sm text-cyber-muted mt-1">
              Total Components
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-cyber-purple">
              {categories.length}
            </div>
            <div className="text-sm text-cyber-muted mt-1">
              Categories
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-cyber-pink">
              {filteredExamples.length}
            </div>
            <div className="text-sm text-cyber-muted mt-1">
              Showing
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-cyber-green">
              {selectedCategory === 'all' ? 'All' : selectedCategory}
            </div>
            <div className="text-sm text-cyber-muted mt-1">
              Current Filter
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// Export Default
// ==========================================

export default ComponentShowcase;
