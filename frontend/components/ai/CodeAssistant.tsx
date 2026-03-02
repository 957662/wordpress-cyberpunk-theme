'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Copy, Check, Play, ChevronDown, ChevronUp, Sparkles, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-css';

export interface CodeSuggestion {
  id: string;
  code: string;
  language: string;
  description: string;
  explanation?: string;
}

export interface CodeAssistantProps {
  /**
   * 代码生成的回调函数
   */
  onGenerate?: (prompt: string) => Promise<CodeSuggestion>;

  /**
   * 主题颜色
   */
  themeColor?: 'cyan' | 'purple' | 'pink';

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 支持的编程语言
   */
  languages?: string[];
}

const defaultLanguages = [
  'typescript',
  'javascript',
  'python',
  'java',
  'css',
  'html',
  'json',
  'sql',
];

const examplePrompts = [
  { text: '创建一个 React 计数器组件', lang: 'typescript' },
  { text: 'Python 快速排序算法', lang: 'python' },
  { text: 'CSS 渐变动画', lang: 'css' },
  { text: 'JavaScript 防抖函数', lang: 'javascript' },
  { text: 'TypeScript 接口定义', lang: 'typescript' },
];

/**
 * AI 代码助手组件
 * 提供智能代码生成和优化建议
 */
export const CodeAssistant: React.FC<CodeAssistantProps> = ({
  onGenerate,
  themeColor = 'cyan',
  className = '',
  languages = defaultLanguages,
}) => {
  const [prompt, setPrompt] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('typescript');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<CodeSuggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<CodeSuggestion | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const codeRef = useRef<HTMLElement>(null);

  const themeColors = {
    cyan: 'border-cyber-cyan text-cyber-cyan shadow-glow-cyan',
    purple: 'border-cyber-purple text-cyber-purple shadow-glow-purple',
    pink: 'border-cyber-pink text-cyber-pink shadow-glow-pink',
  };

  const theme = themeColors[themeColor];

  useEffect(() => {
    // 高亮代码
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [selectedSuggestion]);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);

    try {
      if (onGenerate) {
        const result = await onGenerate(prompt);
        setSuggestions([result, ...suggestions]);
        setSelectedSuggestion(result);
      } else {
        // 模拟代码生成
        await new Promise(resolve => setTimeout(resolve, 2000));

        const mockCode: CodeSuggestion = {
          id: Date.now().toString(),
          code: generateMockCode(prompt, selectedLanguage),
          language: selectedLanguage,
          description: `基于 "${prompt}" 生成的 ${selectedLanguage} 代码`,
          explanation: '这段代码实现了您请求的功能。使用了最佳实践和常用的设计模式。',
        };

        setSuggestions([mockCode, ...suggestions]);
        setSelectedSuggestion(mockCode);
      }
    } catch (error) {
      console.error('生成失败:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockCode = (promptText: string, lang: string): string => {
    // 生成模拟代码
    const templates: Record<string, string> = {
      typescript: `interface Props {
  title: string;
  count: number;
}

export const Component: React.FC<Props> = ({ title, count }) => {
  const [value, setValue] = useState(count);

  const increment = () => setValue(v => v + 1);
  const decrement = () => setValue(v => v - 1);

  return (
    <div className="p-4 rounded-lg bg-gray-800">
      <h2>{title}</h2>
      <p>Count: {value}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
};`,
      javascript: `function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 使用示例
const debouncedSearch = debounce((query) => {
  console.log('Searching for:', query);
}, 300);`,
      python: `def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)

# 使用示例
result = quicksort([3, 6, 8, 10, 1, 2, 1])
print(result)  # [1, 1, 2, 3, 6, 8, 10]`,
      css: `@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animated-gradient {
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}`,
      java: `public class QuickSort {
    public static void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }

    private static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                swap(arr, i, j);
            }
        }
        swap(arr, i + 1, high);
        return i + 1;
    }

    private static void swap(int[] arr, int i, int j) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
}`,
    };

    return templates[lang] || `// Generated ${lang} code for: ${promptText}\n// TODO: Implement the requested functionality`;
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* 生成器面板 */}
      <div className="bg-cyber-card border-2 border-cyber-border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className={cn('p-2 rounded-lg bg-opacity-20', themeColors[themeColor].color)}>
            <Code2 className={cn('w-6 h-6', themeColors[themeColor].text)} />
          </div>
          <div>
            <h2 className={cn('font-display font-bold text-xl', themeColors[themeColor].text)}>
              AI 代码助手
            </h2>
            <p className="text-sm text-gray-400">智能生成和优化代码</p>
          </div>
        </div>

        {/* 语言选择 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            编程语言
          </label>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={cn(
                  'px-3 py-1.5 text-sm rounded-lg border-2 transition-all capitalize',
                  selectedLanguage === lang
                    ? `${theme} border-current bg-opacity-20`
                    : 'border-cyber-border text-gray-400 hover:border-gray-500'
                )}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* 提示词输入 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            描述你需要的代码
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="例如：创建一个 React 计数器组件，支持增加和减少功能..."
            className={cn(
              'w-full px-4 py-3 rounded-lg',
              'bg-cyber-darker border-2 border-cyber-border',
              'text-white placeholder:text-gray-500',
              'focus:outline-none focus:border-cyber-cyan',
              'resize-none',
              'font-mono text-sm',
              'min-h-[80px]'
            )}
            rows={3}
          />
        </div>

        {/* 示例提示词 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Lightbulb className="w-4 h-4 inline mr-1" />
            快速示例
          </label>
          <div className="flex flex-wrap gap-2">
            {examplePrompts
              .filter(p => languages.includes(p.lang))
              .map((example) => (
                <button
                  key={example.text}
                  onClick={() => {
                    setPrompt(example.text);
                    setSelectedLanguage(example.lang);
                  }}
                  className="px-3 py-1.5 text-sm rounded-lg bg-cyber-darker border border-cyber-border text-gray-300 hover:border-cyber-cyan hover:text-cyber-cyan transition-colors"
                >
                  {example.text}
                  <span className="ml-1 text-xs opacity-50 capitalize">({example.lang})</span>
                </button>
              ))}
          </div>
        </div>

        {/* 生成按钮 */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className={cn(
            'w-full py-3 rounded-lg font-medium',
            'flex items-center justify-center gap-2',
            'bg-gradient-to-r from-cyber-cyan to-cyber-purple',
            'text-white',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-all'
          )}
        >
          {isGenerating ? (
            <>
              <Sparkles className="w-5 h-5 animate-pulse" />
              生成中...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              生成代码
            </>
          )}
        </motion.button>
      </div>

      {/* 代码建议列表 */}
      {suggestions.length > 0 && (
        <div className="space-y-4">
          <h3 className={cn('font-display font-bold text-lg', theme)}>
            代码建议 ({suggestions.length})
          </h3>
          {suggestions.map((suggestion) => (
            <motion.div
              key={suggestion.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'bg-cyber-card border-2 rounded-lg overflow-hidden',
                selectedSuggestion?.id === suggestion.id
                  ? theme
                  : 'border-cyber-border'
              )}
            >
              {/* 标题栏 */}
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-cyber-muted/50 transition-colors"
                onClick={() => setSelectedSuggestion(suggestion)}
              >
                <div className="flex items-center gap-3">
                  <span className={cn('px-2 py-1 text-xs rounded font-mono capitalize', themeColors[themeColor].color)}>
                    {suggestion.language}
                  </span>
                  <span className="text-white font-medium">{suggestion.description}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyCode(suggestion.id, suggestion.code);
                    }}
                    className="p-2 rounded-lg hover:bg-cyber-darker text-gray-400 hover:text-white transition-colors"
                  >
                    {copiedId === suggestion.id ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(suggestion.id);
                    }}
                    className="p-2 rounded-lg hover:bg-cyber-darker text-gray-400 hover:text-white transition-colors"
                  >
                    {expandedIds.has(suggestion.id) ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* 代码预览 */}
              <AnimatePresence>
                {(expandedIds.has(suggestion.id) || selectedSuggestion?.id === suggestion.id) && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="border-t border-cyber-border"
                  >
                    <div className="p-4 bg-cyber-darker overflow-x-auto">
                      <pre className="text-sm">
                        <code
                          ref={selectedSuggestion?.id === suggestion.id ? codeRef : undefined}
                          className={`language-${suggestion.language}`}
                        >
                          {suggestion.code}
                        </code>
                      </pre>
                    </div>
                    {suggestion.explanation && (
                      <div className="p-4 bg-cyber-muted/30 border-t border-cyber-border">
                        <p className="text-sm text-gray-300">{suggestion.explanation}</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CodeAssistant;
