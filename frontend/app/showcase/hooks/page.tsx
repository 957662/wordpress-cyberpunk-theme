'use client';

/**
 * Hooks 展示页面
 * 展示所有可用的 React Hooks
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Search, Copy, Check } from 'lucide-react';
import { CyberButton } from '@/components/ui/CyberButton';
import { cn } from '@/lib/utils';

// Hooks 列表
const hooksList = [
  {
    id: 'useDebounce',
    name: 'useDebounce',
    category: 'Performance',
    description: '防抖处理值变化，延迟更新状态',
    code: `const [value, setValue] = useState('');
const debouncedValue = useDebounce(value, 500);

// debouncedValue 会在输入停止 500ms 后更新`,
  },
  {
    id: 'useLocalStorage',
    name: 'useLocalStorage',
    category: 'Storage',
    description: '在 localStorage 中持久化状态',
    code: `const [name, setName] = useLocalStorage('name', '');

// 状态会自动保存到 localStorage`,
  },
  {
    id: 'useMediaQuery',
    name: 'useMediaQuery',
    category: 'Responsive',
    description: '监听媒体查询变化',
    code: `const isMobile = useMediaQuery('(max-width: 768px)');
const isDark = useMediaQuery('(prefers-color-scheme: dark)');

// 响应式和主题检测`,
  },
  {
    id: 'useClickOutside',
    name: 'useClickOutside',
    category: 'Interaction',
    description: '监听元素外部的点击事件',
    code: `const ref = useRef(null);
useClickOutside(ref, () => {
  // 点击外部时执行
});

// 适用于下拉菜单、模态框等`,
  },
  {
    id: 'useIntersection',
    name: 'useIntersection',
    category: 'Viewport',
    description: '监听元素是否进入视口',
    code: `const ref = useRef(null);
const isVisible = useIntersection(ref);

// 元素进入视口时返回 true`,
  },
  {
    id: 'useKeyPress',
    name: 'useKeyPress',
    category: 'Keyboard',
    description: '监听键盘按键事件',
    code: `const isPressed = useKeyPress('Enter');

// 检测 Enter 键是否被按下`,
  },
];

const categories = ['全部', 'Performance', 'Storage', 'Responsive', 'Interaction', 'Viewport', 'Keyboard'];

export default function HooksShowcasePage() {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [copiedHook, setCopiedHook] = useState<string | null>(null);

  // 过滤 Hooks
  const filteredHooks = hooksList.filter((hook) => {
    return selectedCategory === '全部' || hook.category === selectedCategory;
  });

  // 复制代码
  const copyCode = async (code: string, hookId: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedHook(hookId);
      setTimeout(() => setCopiedHook(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* Header */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyber-purple/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyber-cyan/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block mb-6"
          >
            <div className="p-4 bg-cyber-purple/20 rounded-full">
              <Terminal className="w-12 h-12 text-cyber-purple" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-display font-bold mb-6"
          >
            <span className="text-white">React</span>
            <span className="text-cyber-purple">Hooks</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400"
          >
            可复用的自定义 Hooks，提升开发效率
          </motion.p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 px-4 border-y border-cyber-border bg-cyber-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-3 overflow-x-auto pb-2">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  'px-4 py-2 rounded-lg whitespace-nowrap transition-colors',
                  selectedCategory === category
                    ? 'bg-cyber-purple text-cyber-dark'
                    : 'bg-cyber-muted text-gray-300 hover:text-cyber-purple'
                )}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Hooks List */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {filteredHooks.length > 0 ? (
            <div className="space-y-6">
              {filteredHooks.map((hook, index) => (
                <motion.div
                  key={hook.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="cyber-card overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold text-white">{hook.name}</h3>
                          <span className="px-2 py-1 text-xs bg-cyber-purple/20 text-cyber-purple rounded-md">
                            {hook.category}
                          </span>
                        </div>
                        <p className="text-gray-400">{hook.description}</p>
                      </div>
                    </div>

                    <div className="relative group">
                      <pre className="bg-cyber-muted/50 p-4 rounded-lg overflow-x-auto text-sm">
                        <code className="text-cyber-cyan">{hook.code}</code>
                      </pre>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => copyCode(hook.code, hook.id)}
                        className="absolute top-2 right-2 p-2 bg-cyber-muted rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {copiedHook === hook.id ? (
                          <Check className="w-4 h-4 text-cyber-green" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400" />
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">该分类下暂无 Hooks</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
