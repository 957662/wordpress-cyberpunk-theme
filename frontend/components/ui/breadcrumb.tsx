'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  separator?: React.ReactNode;
  homeIcon?: React.ReactNode;
  showHome?: boolean;
  variant?: 'neon' | 'holographic' | 'minimal';
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  className?: string;
}

const colorStyles = {
  cyan: 'text-cyber-cyan hover:text-cyber-cyan/80',
  purple: 'text-cyber-purple hover:text-cyber-purple/80',
  pink: 'text-cyber-pink hover:text-cyber-pink/80',
  green: 'text-cyber-green hover:text-cyber-green/80',
};

const separatorColorStyles = {
  cyan: 'text-cyber-cyan/30',
  purple: 'text-cyber-purple/30',
  pink: 'text-cyber-pink/30',
  green: 'text-cyber-green/30',
};

const variantStyles = {
  neon: 'px-4 py-2 rounded-lg border border-cyber-border bg-cyber-dark/80 backdrop-blur-sm',
  holographic: 'px-4 py-2 rounded-lg border border-white/20 bg-gradient-to-r from-white/10 to-transparent backdrop-blur-md',
  minimal: 'px-2 py-1',
};

export function Breadcrumb({
  items,
  separator = <ChevronRight className="w-4 h-4" />,
  homeIcon = <Home className="w-4 h-4" />,
  showHome = true,
  variant = 'minimal',
  color = 'cyan',
  className,
}: BreadcrumbProps) {
  const pathname = usePathname();

  // 自动生成面包屑路径
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items) return items;

    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    segments.forEach((segment, index) => {
      const href = '/' + segments.slice(0, index + 1).join('/');
      const label = segment
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      breadcrumbs.push({
        label,
        href,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();
  const colorClass = colorStyles[color];
  const separatorClass = separatorColorStyles[color];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex items-center space-x-1 text-sm', variantStyles[variant], className)}
      aria-label="Breadcrumb"
    >
      {/* Home Link */}
      {showHome && (
        <>
          <Link
            href="/"
            className={cn('flex items-center transition-colors duration-200', colorClass)}
          >
            {homeIcon}
          </Link>
          <span className={cn('flex items-center', separatorClass)}>{separator}</span>
        </>
      )}

      {/* Breadcrumb Items */}
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const itemColor = isLast ? 'text-gray-100' : colorClass;

        return (
          <React.Fragment key={index}>
            <div className="flex items-center">
              {item.icon && (
                <span className="mr-1 flex items-center">{item.icon}</span>
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={cn(
                    'transition-colors duration-200 hover:underline',
                    itemColor
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span className={cn('font-medium', itemColor)}>{item.label}</span>
              )}
            </div>
            {!isLast && (
              <span className={cn('flex items-center mx-1', separatorClass)}>
                {separator}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </motion.nav>
  );
}

// Schema.org 结构化数据支持
export interface BreadcrumbStructuredDataProps {
  items: {
    name: string;
    url: string;
  }[];
}

export function BreadcrumbStructuredData({ items }: BreadcrumbStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// 面包屑预设数据
export const blogBreadcrumbs: BreadcrumbItem[] = [
  { label: '首页', href: '/', icon: <Home className="w-4 h-4" /> },
  { label: '博客', href: '/blog' },
];

export const portfolioBreadcrumbs: BreadcrumbItem[] = [
  { label: '首页', href: '/', icon: <Home className="w-4 h-4" /> },
  { label: '作品集', href: '/portfolio' },
];

export const adminBreadcrumbs: BreadcrumbItem[] = [
  { label: '首页', href: '/', icon: <Home className="w-4 h-4" /> },
  { label: '管理后台', href: '/admin' },
];
