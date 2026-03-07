'use client';

import React, { useState } from 'react';

export interface AccordionItemProps {
  /**
   * 唯一标识符
   */
  id: string;
  /**
   * 标题
   */
  title: React.ReactNode;
  /**
   * 内容
   */
  content: React.ReactNode;
  /**
   * 是否默认展开
   */
  defaultOpen?: boolean;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 自定义图标
   */
  icon?: React.ReactNode;
}

export interface AccordionProps {
  /**
   * 手风琴项目列表
   */
  items: AccordionItemProps[];
  /**
   * 是否允许同时展开多项
   */
  multiple?: boolean;
  /**
   * 变体
   */
  variant?: 'default' | 'cyber' | 'neon';
  /**
   * 自定义类名
   */
  className?: string;
}

/**
 * Accordion 组件
 * 可折叠的手风琴面板
 */
export const Accordion: React.FC<AccordionProps> = ({
  items,
  multiple = false,
  variant = 'default',
  className = '',
}) => {
  const [openItems, setOpenItems] = useState<Set<string>>(
    new Set(
      items
        .filter(item => item.defaultOpen)
        .map(item => item.id)
    )
  );

  const toggleItem = (id: string) => {
    if (items.find(item => item.id === id)?.disabled) {
      return;
    }

    setOpenItems(prev => {
      const newSet = new Set(prev);

      if (multiple) {
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
      } else {
        if (newSet.has(id)) {
          newSet.clear();
        } else {
          newSet.clear();
          newSet.add(id);
        }
      }

      return newSet;
    });
  };

  const variantStyles = {
    default: 'border-gray-200 bg-white',
    cyber: 'border-cyber-cyan/30 bg-cyber-dark/50 backdrop-blur',
    neon: 'border-cyber-pink/30 bg-cyber-dark/50 backdrop-blur shadow-[0_0_20px_rgba(255,0,128,0.2)]',
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map(item => (
        <div
          key={item.id}
          className={`
            border rounded-lg overflow-hidden
            transition-all duration-200
            ${variantStyles[variant]}
            ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <button
            onClick={() => toggleItem(item.id)}
            disabled={item.disabled}
            className={`
              w-full px-6 py-4 flex items-center justify-between
              transition-all duration-200
              hover:bg-cyber-cyan/5
              ${item.disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="flex items-center space-x-3">
              {item.icon && <span className="text-cyber-cyan">{item.icon}</span>}
              <span className="font-semibold">{item.title}</span>
            </div>
            <span
              className={`
                transform transition-transform duration-200
                ${openItems.has(item.id) ? 'rotate-180' : ''}
              `}
            >
              <svg
                className="w-5 h-5 text-cyber-cyan"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
          </button>

          <div
            className={`
              overflow-hidden transition-all duration-200
              ${openItems.has(item.id) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
            `}
          >
            <div className="px-6 py-4 border-t border-current opacity-10">
              {item.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;
