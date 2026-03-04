'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface FAQProps {
  items: FAQItem[];
  variant?: 'neon' | 'holographic' | 'minimal';
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  allowMultiple?: boolean;
  className?: string;
}

const colorStyles = {
  cyan: {
    border: 'border-cyber-cyan/50',
    text: 'text-cyber-cyan',
    glow: 'shadow-cyber-cyan/20',
    bg: 'bg-cyber-can/5',
  },
  purple: {
    border: 'border-cyber-purple/50',
    text: 'text-cyber-purple',
    glow: 'shadow-cyber-purple/20',
    bg: 'bg-cyber-purple/5',
  },
  pink: {
    border: 'border-cyber-pink/50',
    text: 'text-cyber-pink',
    glow: 'shadow-cyber-pink/20',
    bg: 'bg-cyber-pink/5',
  },
  green: {
    border: 'border-cyber-green/50',
    text: 'text-cyber-green',
    glow: 'shadow-cyber-green/20',
    bg: 'bg-cyber-green/5',
  },
};

const variantStyles = {
  neon: 'border-2 border-opacity-50 bg-cyber-dark/80 backdrop-blur-sm',
  holographic: 'border border-white/20 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md',
  minimal: 'border border-gray-700 bg-gray-900/50',
};

export function FAQ({
  items,
  variant = 'neon',
  color = 'cyan',
  allowMultiple = false,
  className,
}: FAQProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const styles = colorStyles[color];

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (allowMultiple) {
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
      } else {
        newSet.clear();
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className={cn('space-y-4', className)}>
      {items.map((item) => {
        const isOpen = openItems.has(item.id);

        return (
          <motion.div
            key={item.id}
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'rounded-lg overflow-hidden transition-all duration-300',
              variantStyles[variant],
              styles.border,
              isOpen && styles.glow
            )}
          >
            <button
              onClick={() => toggleItem(item.id)}
              className={cn(
                'w-full px-6 py-4 flex items-center justify-between text-left transition-colors',
                styles.text
              )}
            >
              <span className="font-medium text-lg pr-8">{item.question}</span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="flex-shrink-0"
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-4 text-gray-300 leading-relaxed">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

export interface FAQWithCategoriesProps extends Omit<FAQProps, 'items'> {
  categories: {
    name: string;
    items: FAQItem[];
  }[];
}

export function FAQWithCategories({
  categories,
  variant = 'neon',
  color = 'cyan',
  allowMultiple = false,
  className,
}: FAQWithCategoriesProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.name || '');

  return (
    <div className={cn('space-y-6', className)}>
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => setActiveCategory(category.name)}
            className={cn(
              'px-4 py-2 rounded-lg font-medium transition-all duration-300',
              activeCategory === category.name
                ? `bg-cyber-${color} text-cyber-dark shadow-lg shadow-${color}-500/20`
                : 'bg-cyber-dark/50 text-gray-400 hover:text-white hover:bg-cyber-dark/80'
            )}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* FAQ Items for Active Category */}
      <AnimatePresence mode="wait">
        {categories.map(
          (category) =>
            activeCategory === category.name && (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <FAQ
                  items={category.items}
                  variant={variant}
                  color={color}
                  allowMultiple={allowMultiple}
                />
              </motion.div>
            )
        )}
      </AnimatePresence>
    </div>
  );
}

// 常见问题预设数据
export const defaultFAQItems: FAQItem[] = [
  {
    id: '1',
    question: '什么是 CyberPress Platform？',
    answer: 'CyberPress Platform 是一个现代化的赛博朋克风格博客平台，采用前后端分离架构，结合了 FastAPI 的高性能后端和 Next.js 14 的现代化前端技术栈。',
  },
  {
    id: '2',
    question: '如何开始使用？',
    answer: '您可以通过克隆项目仓库，按照 README.md 中的快速开始指南进行设置。支持 Docker Compose 一键启动，也可以手动配置前端和后端环境。',
  },
  {
    id: '3',
    question: '支持哪些功能？',
    answer: '平台包含博客系统、用户认证、社交功能（关注、点赞、评论）、通知系统、管理后台、Markdown 编辑器、代码高亮、全文搜索等完整功能。',
  },
  {
    id: '4',
    question: '如何自定义主题？',
    answer: '平台使用 Tailwind CSS 配置，您可以修改 tailwind.config.ts 文件来自定义颜色主题。支持霓虹青、赛博紫、激光粉等多种颜色方案。',
  },
  {
    id: '5',
    question: '是否支持移动端？',
    answer: '是的，平台采用响应式设计，完美适配各种设备和屏幕尺寸，包括桌面、平板和手机。',
  },
];

export const defaultFAQCategories = [
  {
    name: '基础问题',
    items: [
      {
        id: '1',
        question: '什么是 CyberPress Platform？',
        answer: 'CyberPress Platform 是一个现代化的赛博朋克风格博客平台。',
      },
      {
        id: '2',
        question: '如何开始使用？',
        answer: '通过克隆项目仓库并按照快速开始指南进行设置。',
      },
    ],
  },
  {
    name: '功能特性',
    items: [
      {
        id: '3',
        question: '支持哪些功能？',
        answer: '包含博客系统、用户认证、社交功能等完整功能。',
      },
      {
        id: '4',
        question: '是否支持移动端？',
        answer: '采用响应式设计，完美适配各种设备。',
      },
    ],
  },
  {
    name: '技术支持',
    items: [
      {
        id: '5',
        question: '使用什么技术栈？',
        answer: '前端使用 Next.js 14 + TypeScript + Tailwind CSS，后端使用 FastAPI + Python。',
      },
      {
        id: '6',
        question: '如何获取帮助？',
        answer: '可以通过 GitHub Issues 提交问题，或查看项目文档。',
      },
    ],
  },
];
