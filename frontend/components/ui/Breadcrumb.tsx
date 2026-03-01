/**
 * Breadcrumb Component
 * 面包屑导航组件
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * 面包屑项
 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

/**
 * Breadcrumb 组件属性
 */
export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  homeHref?: string;
  className?: string;
  variant?: 'default' | 'cyber' | 'minimal';
}

/**
 * Breadcrumb 组件
 */
export function Breadcrumb({
  items,
  separator,
  homeHref = '/',
  className,
  variant = 'default'
}: BreadcrumbProps) {
  const defaultSeparator = <ChevronRight className="w-4 h-4" />;

  return (
    <nav aria-label="Breadcrumb" className={cn('w-full', className)}>
      <ol className="flex items-center space-x-1 text-sm">
        {/* 首页链接 */}
        <li>
          <Link
            href={homeHref}
            className={cn(
              'flex items-center hover:text-cyber-cyan transition-colors',
              variant === 'cyber' && 'text-cyber-cyan hover:text-cyber-pink',
              variant === 'minimal' && 'text-gray-400 hover:text-gray-600'
            )}
          >
            <Home className="w-4 h-4" />
          </Link>
        </li>

        {items.map((item, index) => (
          <React.Fragment key={index}>
            <li className={cn(
              'flex items-center',
              variant === 'cyber' && 'text-cyber-cyan/60',
              variant === 'minimal' && 'text-gray-400'
            )}>
              {separator || defaultSeparator}
            </li>

            <li>
              {item.href ? (
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-1 hover:text-cyber-cyan transition-colors',
                    variant === 'cyber' && 'hover:text-cyber-pink hover:shadow-neon',
                    variant === 'minimal' && 'hover:text-gray-600'
                  )}
                >
                  {item.icon && <span>{item.icon}</span>}
                  <motion.span
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.label}
                  </motion.span>
                </Link>
              ) : (
                <span className={cn(
                  'flex items-center space-x-1',
                  variant === 'cyber' && 'text-cyber-pink font-medium',
                  variant === 'minimal' && 'text-gray-600'
                )}>
                  {item.icon && <span>{item.icon}</span>}
                  <span>{item.label}</span>
                </span>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}

/**
 * 结构化数据（JSON-LD）组件
 */
export interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
  homeHref?: string;
}

export function BreadcrumbSchema({ items, homeHref = '/' }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: homeHref
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.label,
        item: item.href
      }))
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
