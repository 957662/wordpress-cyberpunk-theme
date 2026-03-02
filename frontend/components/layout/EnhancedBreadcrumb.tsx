/**
 * EnhancedBreadcrumb - 增强型面包屑导航组件
 * 支持自定义分隔符、图标、样式
 */

'use client';

import { Link } from 'next/link';
import { Home, ChevronRight, Slash } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface EnhancedBreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: 'arrow' | 'slash' | 'dot' | 'custom';
  customSeparator?: React.ReactNode;
  homeHref?: string;
  showHome?: boolean;
  className?: string;
  variant?: 'default' | 'neon' | 'minimal';
}

export const EnhancedBreadcrumb = ({
  items,
  separator = 'arrow',
  customSeparator,
  homeHref = '/',
  showHome = true,
  className,
  variant = 'default',
}: EnhancedBreadcrumbProps) => {
  const renderSeparator = () => {
    if (separator === 'custom' && customSeparator) {
      return customSeparator;
    }

    const iconClass = 'w-4 h-4 text-gray-600';

    switch (separator) {
      case 'arrow':
        return <ChevronRight className={iconClass} />;
      case 'slash':
        return <Slash className={iconClass} />;
      case 'dot':
        return <span className="w-1 h-1 bg-gray-600 rounded-full" />;
      default:
        return <ChevronRight className={iconClass} />;
    }
  };

  const variantStyles = {
    default: 'text-gray-400 hover:text-cyber-cyan',
    neon: 'text-gray-300 hover:text-cyber-pink hover:shadow-[0_0_10px_currentColor]',
    minimal: 'text-gray-500 hover:text-gray-300',
  };

  const allItems = showHome
    ? [{ label: '首页', href: homeHref, icon: <Home className="w-4 h-4" /> }, ...items]
    : items;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex items-center gap-2 text-sm', className)}
      aria-label="Breadcrumb"
    >
      {allItems.map((item, index) => {
        const isLast = index === allItems.length - 1;

        return (
          <div key={index} className="flex items-center gap-2">
            {/* 分隔符 */}
            {index > 0 && <span className="flex items-center">{renderSeparator()}</span>}

            {/* 面包屑项 */}
            {isLast ? (
              <span className="text-white font-medium flex items-center gap-1.5">
                {item.icon && <span className="text-cyber-cyan">{item.icon}</span>}
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href || '#'}
                className={cn(
                  'flex items-center gap-1.5 transition-all duration-200',
                  variantStyles[variant]
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            )}
          </div>
        );
      })}
    </motion.nav>
  );
};

/**
 * Schema.org 结构化数据
 */
export const BreadcrumbSchema = ({ items }: { items: BreadcrumbItem[] }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default EnhancedBreadcrumb;
