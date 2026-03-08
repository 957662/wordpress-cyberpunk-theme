'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Code2,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  Zap,
  Target,
  Rocket
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function for className
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Types
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  code?: string;
  language?: string;
  suggestions?: string[];
}

export interface CodeSuggestion {
  type: 'optimization' | 'bug-fix' | 'enhancement' | 'documentation';
  title: string;
  description: string;
  code: string;
  impact: 'high' | 'medium' | 'low';
}

export interface SmartCodeAssistantProps {
  className?: string;
  placeholder?: string;
  initialMessage?: string;
  maxSuggestions?: number;
  showCodeHighlight?: boolean;
  onMessageSent?: (message: string) => void;
  onSuggestionApplied?: (suggestion: CodeSuggestion) => void;
}

// Message Component
const MessageBubble: React.FC<{
  message: Message;
  onCopy?: (code: string) => void;
  onFeedback?: (messageId: string, feedback: 'up' | 'down') => void;
}> = ({ message, onCopy, onFeedback }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    onCopy?.(code);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex gap-3 mb-4',
        message.role === 'user' ? 'justify-end' : 'justify-start'
      )}
    >
      {message.role === 'assistant' && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      )}

      <div className={cn(
        'max-w-2xl rounded-2xl px-4 py-3',
        message.role === 'user'
          ? 'bg-gradient-to-r from-cyber-purple to-cyber-pink text-white'
          : 'bg-cyber-card border border-cyber-cyan/30 text-gray-100'
      )}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap mb-2">
          {message.content}
        </p>

        {message.code && (
          <div className="relative mt-3">
            <div className="absolute top-2 right-2 flex gap-2 z-10">
              <button
                onClick={() => handleCopy(message.code!)}
                className="p-1.5 rounded-lg bg-cyber-dark/80 hover:bg-cyber-cyan/20 transition-all"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-green-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-gray-400" />
                )}
              </button>
            </div>
            <pre className="bg-cyber-dark rounded-lg p-3 overflow-x-auto text-xs font-mono border border-cyber-cyan/20">
              <code className="text-cyber-cyan">{message.code}</code>
            </pre>
          </div>
        )}

        {message.suggestions && message.suggestions.length > 0 && (
          <div className="mt-3 space-y-2">
            <p className="text-xs text-cyber-cyan font-semibold">Suggestions:</p>
            {message.suggestions.map((suggestion, idx) => (
              <div
                key={idx}
                className="text-xs bg-cyber-dark/50 rounded-lg p-2 border border-cyber-purple/20 hover:border-cyber-purple/50 transition-all cursor-pointer"
              >
                <Lightbulb className="w-3 h-3 inline mr-1 text-yellow-400" />
                {suggestion}
              </div>
            ))}
          </div>
        )}

        {message.role === 'assistant' && onFeedback && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-cyber-cyan/20">
            <button
              onClick={() => onFeedback(message.id, 'up')}
              className="p-1.5 rounded-lg hover:bg-cyber-cyan/10 transition-all"
            >
              <ThumbsUp className="w-3.5 h-3.5 text-gray-400 hover:text-green-400" />
            </button>
            <button
              onClick={() => onFeedback(message.id, 'down')}
              className="p-1.5 rounded-lg hover:bg-cyber-cyan/10 transition-all"
            >
              <ThumbsDown className="w-3.5 h-3.5 text-gray-400 hover:text-red-400" />
            </button>
          </div>
        )}
      </div>

      {message.role === 'user' && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-cyber-purple to-cyber-pink flex items-center justify-center">
          <Code2 className="w-4 h-4 text-white" />
        </div>
      )}
    </motion.div>
  );
};

// Suggestion Cards
const SuggestionCard: React.FC<{
  suggestion: CodeSuggestion;
  onApply: () => void;
}> = ({ suggestion, onApply }) => {
  const impactColors = {
    high: 'text-red-400 border-red-400/30',
    medium: 'text-yellow-400 border-yellow-400/30',
    low: 'text-green-400 border-green-400/30'
  };

  const typeIcons = {
    optimization: <Zap className="w-4 h-4" />,
    'bug-fix': <Target className="w-4 h-4" />,
    enhancement: <Rocket className="w-4 h-4" />,
    documentation: <Lightbulb className="w-4 h-4" />
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-cyber-card border border-cyber-cyan/30 rounded-xl p-4 hover:border-cyber-purple/50 transition-all"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-cyber-cyan">{typeIcons[suggestion.type]}</span>
          <h4 className="text-sm font-semibold text-white">{suggestion.title}</h4>
        </div>
        <span className={cn(
          'text-xs px-2 py-1 rounded-full border',
          impactColors[suggestion.impact]
        )}>
          {suggestion.impact} impact
        </span>
      </div>

      <p className="text-xs text-gray-400 mb-3">{suggestion.description}</p>

      <pre className="bg-cyber-dark rounded-lg p-3 overflow-x-auto text-xs font-mono border border-cyber-cyan/20 mb-3">
        <code className="text-cyber-cyan">{suggestion.code}</code>
      </pre>

      <button
        onClick={onApply}
        className="w-full py-2 px-4 bg-gradient-to-r from-cyber-cyan to-cyber-purple rounded-lg text-white text-sm font-semibold hover:shadow-lg hover:shadow-cyber-cyan/30 transition-all flex items-center justify-center gap-2"
      >
        <Sparkles className="w-4 h-4" />
        Apply Suggestion
      </button>
    </motion.div>
  );
};

// Main Component
export const SmartCodeAssistant: React.FC<SmartCodeAssistantProps> = ({
  className,
  placeholder = 'Ask me anything about your code...',
  initialMessage,
  maxSuggestions = 5,
  showCodeHighlight = true,
  onMessageSent,
  onSuggestionApplied
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<CodeSuggestion[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (initialMessage && messages.length === 0) {
      handleSendMessage(initialMessage);
    }
  }, []);

  const generateMockResponse = (userMessage: string): Message => {
    const responses = [
      {
        content: 'I\'ve analyzed your code and found several optimization opportunities. Here\'s what I suggest:',
        code: `// Optimized version with better performance
const memoizedCallback = useMemo(() => {
  return expensiveOperation(data);
}, [data]);

// Use React.memo for component optimization
const OptimizedComponent = React.memo(({ prop }) => {
  return <div>{prop}</div>;
});`,
        language: 'typescript',
        suggestions: [
          'Consider implementing memoization to reduce re-renders',
          'Move expensive computations outside the render cycle',
          'Use React.lazy for code splitting'
        ]
      },
      {
        content: 'I found a potential bug in your code. The issue is related to async handling:',
        code: `// Fixed version with proper error handling
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw error;
  }
}`,
        language: 'typescript',
        suggestions: [
          'Add proper error handling for async operations',
          'Implement retry logic for failed requests',
          'Add loading states for better UX'
        ]
      }
    ];

    return {
      id: Date.now().toString(),
      role: 'assistant',
      ...responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date()
    };
  };

  const generateMockSuggestions = (): CodeSuggestion[] => {
    return [
      {
        type: 'optimization',
        title: 'Optimize React Performance',
        description: 'Implement memoization to prevent unnecessary re-renders and improve application performance.',
        code: 'const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);',
        impact: 'high'
      },
      {
        type: 'bug-fix',
        title: 'Fix Memory Leak',
        description: 'Add cleanup function to useEffect to prevent memory leaks in your components.',
        code: 'useEffect(() => {\n  const subscription = subscribe();\n  return () => subscription.unsubscribe();\n}, []);',
        impact: 'high'
      },
      {
        type: 'enhancement',
        title: 'Add TypeScript Types',
        description: 'Strengthen type safety by adding explicit type definitions for your props.',
        code: 'interface Props {\n  data: UserData;\n  onUpdate: (id: string) => void;\n}',
        impact: 'medium'
      }
    ];
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    onMessageSent?.(content);

    // Simulate API call
    setTimeout(() => {
      const assistantResponse = generateMockResponse(content);
      setMessages(prev => [...prev, assistantResponse]);
      setSuggestions(generateMockSuggestions().slice(0, maxSuggestions));
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const handleFeedback = (messageId: string, feedback: 'up' | 'down') => {
    console.log(`Feedback ${feedback} for message ${messageId}`);
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  const handleApplySuggestion = (suggestion: CodeSuggestion) => {
    onSuggestionApplied?.(suggestion);
  };

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-cyber-cyan/30">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-cyber-dark"></div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Smart Code Assistant</h3>
            <p className="text-xs text-cyber-cyan">AI-powered code analysis</p>
          </div>
        </div>
        <button
          onClick={() => {
            setMessages([]);
            setSuggestions([]);
          }}
          className="p-2 rounded-lg hover:bg-cyber-cyan/10 transition-all"
          title="Clear conversation"
        >
          <RefreshCw className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
        <AnimatePresence>
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onCopy={handleCopy}
              onFeedback={handleFeedback}
            />
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
              </div>
              <div className="bg-cyber-card border border-cyber-cyan/30 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-cyber-cyan rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-cyber-cyan rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-cyber-cyan rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-cyber-cyan" />
            Code Suggestions
          </h4>
          <div className="grid grid-cols-1 gap-3">
            {suggestions.map((suggestion, idx) => (
              <SuggestionCard
                key={idx}
                suggestion={suggestion}
                onApply={() => handleApplySuggestion(suggestion)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="relative">
        <textarea
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={3}
          className="w-full bg-cyber-card border border-cyber-cyan/30 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan resize-none"
        />
        <button
          onClick={() => handleSendMessage(inputValue)}
          disabled={!inputValue.trim() || isLoading}
          className={cn(
            'absolute right-3 bottom-3 p-2 rounded-lg transition-all',
            inputValue.trim() && !isLoading
              ? 'bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white hover:shadow-lg hover:shadow-cyber-cyan/30'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          )}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SmartCodeAssistant;
